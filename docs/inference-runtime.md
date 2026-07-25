---
title: Inference Runtime
sidebar_label: Inference Runtime
description: BatchEngine continuous batching, library-managed KV cache, model leases, eviction, and the one max-batch-size knob.
---

# Inference Runtime

Osaurus's MLX inference path is a thin shell around vmlx-swift-lm's `BatchEngine`. Tool-call parsing, reasoning extraction, KV-cache management, and per-model scheduling all live inside the library. This page describes the small slice Osaurus owns.

## End-to-end shape

```
ChatEngine (route resolution, attribution, logging)
    -> ModelRuntime (container lifecycle, model lease, prefill progress)
        -> MLXBatchAdapter
            -> BatchEngine.generate(input:parameters:)
                -> AsyncStream<Generation>
            -> GenerationEventMapper (Generation -> ModelRuntimeEvent)
                -> AsyncThrowingStream<ModelRuntimeEvent, Error>
```

`BatchEngine.generate` returns these event cases:

- `.chunk(String)` — pure user-visible text. Reasoning markers and tool-call markers are stripped by the library before they reach Osaurus.
- `.reasoning(String)` — model reasoning text. Osaurus forwards this to `ModelRuntimeEvent.reasoning`, HTTP `reasoning_content`, the ChatView Think panel, and plugin `chunk.delta.reasoning_content`.
- `.prefillProgress(PrefillProgress)` — real prompt-processing progress before the first generated token, surfaced as a determinate prefill percentage in the chat UI.
- `.toolCall(ToolCall)` — a fully-parsed tool call. Every supported family (JSON, Qwen `xml_function`, Mistral, GLM-4, LFM2, Kimi K2, Gemma-3/4, MiniMax M2) emits this once the call is complete.
- `.info(GenerateCompletionInfo)` — final stats (token counts, prompt/generation time, stop reason). One per request.

`GenerationEventMapper` translates those into Osaurus's local `ModelRuntimeEvent` (`.tokens`, `.reasoning`, `.prefillProgress`, `.toolInvocation`, `.completionInfo`).

## Continuous batching

Same-model concurrent requests share a single forward pass via `BatchEngine`. The default `mlxBatchEngineMaxBatchSize` is `1` — deliberately, because vmlx's compiled-decode fast path (a large measured TTFT win on families like Mistral, Qwen, MiniMax, and DSV4) only engages at batch size 1. The primary control is **Server → Settings → Concurrency & Batching** (`continuousBatching` and `maxConcurrentSequences`) — when continuous batching is off, the effective batch size is pinned to `1`; when it's on, `maxConcurrentSequences` wins over the legacy defaults key:

```bash
defaults write ai.osaurus ai.osaurus.scheduler.mlxBatchEngineMaxBatchSize -int 8
```

Clamped to `[1, 32]`; values ≤ 0 fall back to `1`. Higher values raise possible same-model concurrency at the cost of compile eligibility, wired-memory footprint, and per-request latency — the chat UI's tok/s display flags the trade-off when a non-default value is active. The batch size is hot-resizable: a changed value takes effect on the next inference call, without an unload/reload. Defined in `InferenceFeatureFlags.swift`.

## Cache management

vmlx's `CacheCoordinator` owns KV-cache geometry. Osaurus configures it per container at load time (`installCacheCoordinator` in `ModelRuntime.swift`):

| Override | Why |
|---|---|
| `modelKey` (with KV-mode / serializer / topology tags) | Per-model isolation across loads — the tags prevent serving disk entries encoded under a different cache contract after a runtime update |
| `diskCacheDir` | Osaurus-managed sandbox path |
| `enableDiskCache` | `true` when a probe-write succeeds, else `false` — graceful fallback to memory-only when the dir is read-only or out of disk |
| `defaultKVMode` = `engine_selected` | The engine picks the KV mode per model: eligible full-attention rows get quantized (TurboQuant) KV; hybrid, rotating, and companion-cache architectures keep their native/fp16 typed caches unless explicitly overridden |
| `defaultMaxKVSize` = `65536`, `longPromptMultiplier` = `2.0` | Prefill window, with the rotating-cache cap kicking in only past 131K |
| `usePagedCache` = `false` | Paged RAM KV blocks mainly help multi-batch workloads; the single-batch default keeps prefix reuse through the disk/L2 tier instead |

`maxCacheBlocks`, `pagedBlockSize`, and `diskCacheMaxGB` are left at the library default so a vmlx tuning bump lands without an app-layer redeploy.

Osaurus deliberately does **not** pass `GenerateParameters.maxKVSize` — a global rotating cache window forced from the app layer conflicted with sliding-window attention layers (e.g. Gemma-4 with a fixed per-layer 1024-position window) and produced `[broadcast_shapes] (1,1,1,N) and (1,16,1,1024)` crashes on the first decode step.

For hybrid SSM families, Osaurus eagerly calls `CacheCoordinator.setHybrid(_:)` for known model families, and vmlx also auto-detects Mamba-style caches on first slot admission. Models with their own companion-cache topology (e.g. DeepSeek V4's hybrid pool) keep their typed serializers — generic KV compression is never forced onto them.

### Multi-turn KV cache reuse

Reuse across requests is **automatic and content-addressed** — the engine delegates prefix-cache management to vmlx's `CacheCoordinator`. Two requests that share the same prefix tokens (system prompt, tools, prior turns) automatically share the cached KV blocks. There is no client-side opt-in or cache key to manage.

For visibility, every response carries a `prefix_hash` field — a stable hash of the system prompt + tool names that produced this generation. `prefix_hash` is informational; passing it back has no effect. Keep `session_id` stable per conversation so chat history and session bookkeeping group correctly; cache reuse itself does not depend on it.

## Concurrency

| Layer | What it protects |
|---|---|
| `BatchEngine` actor (vmlx) | Serializes Metal / model access. Continuous batching for same-model concurrent requests. |
| `MLXBatchAdapter.Registry` | Keeps one `BatchEngine` per model name and coalesces concurrent first creation, so two same-model requests can't build duplicate engines. |
| `ModelLease` | Pins a model name for the lifetime of one stream so eviction (`unload`, `clearAll`, GC) blocks until the lease drops to zero. |
| `ModelResidencyManager` | Schedules the idle-unload policy after the final lease drops; it never owns execution or cache deletion. |
| `PluginHostAPI` per-plugin in-flight cap | Caps concurrent inference calls per plugin (default 2). Excess returns `plugin_busy`. |
| `MetalGate` | Serializes GPU producers across families so concurrent command buffers can't trip Metal asserts — generation is gated per model; embedding and model load are exclusive. |

## Model loading and eviction

Window-scoped warm-up: models are loaded and prefix-cached when a chat window opens, not at app launch. Each window warms its own model independently, using the window's agent context (system prompt, memory, tools) for the prefix cache.

When a user switches to a remote model or closes a window, a GC pass checks all open windows and unloads any local model no longer referenced. The warm-up indicator (yellow dot) signals when a model is loading.

### Eviction policy

Configurable in **Management → Server → Settings → Model Memory:**

| Policy | Behavior |
|---|---|
| **Strict (One Model)** | Only one local model loaded at a time (default) |
| **Flexible (Multi Model)** | Allows concurrent models for high-RAM systems |

### Idle residency

**Settings → Local Inference → Model Management → Keep model loaded after use** controls how long weights stay resident after the last stream releases its lease. The default is **15 minutes**, so follow-up turns don't pay a full cold load; choices are 5/15/30/60 minutes, **Immediately** (the old window-close GC behavior, still useful on low-memory Macs), or **Never**.

This is a memory-residency policy only — it unloads weights and runtime buffers, never downloaded models or disk KV-cache entries. Strict single-model eviction, manual unload, app quit, and memory cleanup still win over idle timers. `/health` reports `resident_models[]` with per-model `idle_unload_at` and `idle_seconds_remaining`.

## Sentinel scheme (in-band streaming hints)

`ChatEngine.streamWithTools` returns `AsyncThrowingStream<String, Error>`. Non-content events ride along on the same stream as sentinel strings starting with `\u{FFFE}`:

| Sentinel | Producer | Consumer |
|---|---|---|
| `\u{FFFE}tool:` | local + remote tool call name | HTTP SSE → `tool_calls` deltas; ChatView Think panel |
| `\u{FFFE}args:` | tool argument fragments | HTTP SSE → `tool_calls.function.arguments` deltas |
| `\u{FFFE}done:` | server-side tool call result | ChatView (tool result card) |
| `\u{FFFE}prefill:` | local vMLX prefill progress JSON | ChatView loading label; internal sentinel on HTTP/plugin paths |
| `\u{FFFE}stats:` | post-stream perf | ChatView, plugin `chunk.delta.stats` |
| `\u{FFFE}reasoning:` | local + remote `reasoning_content` | OpenAI SSE `reasoning_content`; Anthropic `thinking_delta`; OpenResponses `response.reasoning_summary_text.delta`; ChatView Think panel; plugin `chunk.delta.reasoning_content` |

HTTP handlers and the plugin SDK MUST decode any sentinel with public meaning (`StreamingReasoningHint`, `StreamingStatsHint`) BEFORE the generic `StreamingToolHint.isSentinel` filter, otherwise that signal gets dropped together with the private tool sentinels.

## Source map

| File | Role |
|---|---|
| `ModelRuntime.swift` | Container lifecycle (load / unload / strict eviction), `ModelLease` glue, single MLX entry into `MLXBatchAdapter` |
| `MLXBatchAdapter.swift` | Per-model `BatchEngine` registry; submits each request via `engine.generate(...)` |
| `GenerationEventMapper.swift` | `Generation` → `ModelRuntimeEvent` bridge; stop-sequence lookahead; prefill progress forwarding; tool-call argument JSON serialization |
| `Events.swift` | `ModelRuntimeEvent` enum (`tokens` / `reasoning` / `prefillProgress` / `toolInvocation` / `completionInfo`) |
| `RuntimeConfig.swift` | Server-side default `topP` |
| `InferenceFeatureFlags.swift` | Single user-tunable: `mlxBatchEngineMaxBatchSize` |
| `MetalGate.swift` | Cross-family GPU serialization gate (generation shared per model; embedding and model load exclusive) |
| `ModelLease.swift` | Per-model refcount; `unload(name)` waits for `count == 0` before freeing buffers |
| `ModelResidencyManager.swift` | Per-model idle timers and health snapshots for the residency policy |

## Tests

| File | Coverage |
|---|---|
| `MLXBatchAdapterTests` | Max-batch-size flag clamping; per-family thinking opt-in contexts; registry-shutdown safety |
| `ModelResidencyManagerTests` | Timer scheduling, cancellation on new use, never policy, active-lease protection |
| `GenerationEventMapperTests` | `chunk` → `tokens`; `toolCall` → `toolInvocation` JSON serialization (happy path + failure envelope); `info` → `completionInfo`; cross-chunk stop-sequence cut |
| `StreamingReasoningHintTests` | Sentinel encode/decode round-trip; co-existence with the tool sentinel filter |
| `MetalGateTests` | Embedding gate happy paths |

---

**Related:**

- [Models](/models) — choosing the right model
- [HTTP API](/api) — `session_id`, `prefix_hash`, streaming behavior
- [Apple Intelligence](/models/apple-intelligence) — the `foundation` model path

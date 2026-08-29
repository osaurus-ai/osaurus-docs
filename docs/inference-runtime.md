---
title: Inference Runtime
sidebar_label: Inference Runtime
description: BatchEngine concurrency, library-managed KV cache, model leases, eviction, and live diagnostics.
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

Same-model concurrent requests share a single forward pass via `BatchEngine`. **Server → Settings → Concurrency & Batching → Concurrent Sessions** is the canonical ceiling for both request concurrency and subagent batching; Main Chat Spawn and every agent's **Max subagents per batch** editor share that value.

Leave Concurrent Sessions empty for an automatic Memory Safety value, or set 1–32 explicitly. RAM admission, current engine occupancy, and model residency can still run a smaller subagent wave. With **Continuous Batching** off, the effective local per-model limit is `1` regardless of the configured ceiling. Turning it on allows same-model requests to decode together; `1` retains the compiled-decode fast path, while higher values favor aggregate throughput at the cost of more wired memory and per-request latency.

The legacy defaults key remains a fallback when no runtime setting is present:

```bash
defaults write ai.osaurus ai.osaurus.scheduler.mlxBatchEngineMaxBatchSize -int 8
```

The value is clamped to `[1, 32]`. The batch size is hot-resizable: a changed value takes effect on the next inference call without an unload/reload.

## Cache management

vmlx's `CacheCoordinator` owns KV-cache geometry. Configure it under **Server → Settings → Cache**. Each local model captures the saved cache policy when it loads; changing the KV-retention policy unloads resident models so the next load cannot retain the old cap.

| Control | Behavior |
|---|---|
| **Prefix Cache** | Master switch for content-addressed prompt reuse. Turning it off also disables GPU and SSD reuse. |
| **GPU Cache (Paged KV)** | Optional hot prefix tier in unified memory. Some hybrid cache topologies are not page-compatible. |
| **SSD Cache (L2)** | Persists prompt checkpoints across requests and restarts, even when GPU Cache is off. The default path is `~/.osaurus/cache/kv_v2/`. |
| **Disk Cache Size (% of disk)** | Shared cap for every model on the cache volume. Blank resolves to 10% of capacity; at model load the runtime also limits use to 25% of currently free space. |
| **Clear SSD Cache** | Safely locks cache I/O, removes indexed checkpoints and orphaned payload files, and reclaims the space. |
| **KV Retention Override** | Explicit per-session retention cap; blank uses the active Memory Safety profile. This is separate from the model's context maximum. |
| **On-the-fly Compression** | `Engine Selected` keeps native cache types. TurboQuant is an explicit opt-in and is not forced onto hybrid or companion caches. |

Before enabling SSD reuse, Osaurus performs a real write probe. A read-only directory, ownership problem, or full disk disables the disk tier rather than writing elsewhere. The diagnostics log the path, owner/mode, and underlying error; check that detail if every tool round appears to prefill the full conversation again.

The cap is root-wide, not per model. At model load it is constrained to 25% of currently free disk, and the SSD tier is disabled when that allowance is below 1 GB. The Context Budget popover shows used space and the resolved cap while it is open; after 75% it warns that older checkpoints may be evicted and long chats may need to prefill again. Existing installs migrate from the old flat 10 GB default to percentage sizing once, while a deliberate later choice remains yours.

### Multi-turn KV cache reuse

Reuse across requests is **automatic and content-addressed** — the engine delegates prefix-cache management to vmlx's `CacheCoordinator`. Two requests that share the same prefix tokens (system prompt, tools, prior turns) automatically share the cached KV blocks. There is no client-side opt-in or cache key to manage.

For visibility, every response carries a `prefix_hash` field — a stable hash of the system prompt + tool names that produced this generation. `prefix_hash` is informational; passing it back has no effect. Keep `session_id` stable per conversation so chat history and session bookkeeping group correctly; cache reuse itself does not depend on it.

### Context compaction and cache reuse

LLM context compaction replaces older outbound turns with a persisted summary while leaving the visible transcript unchanged. That changes the prompt prefix once, so Osaurus invalidates the old warm-up identity and rewarms the summary-aware prefix before the next send. Later turns reuse the stable summary prefix normally.

The deterministic last-resort trimmer also keeps its decisions sticky within a run: once an old message is summarized or dropped, later tool-loop iterations do not rewrite the middle of the already-rendered prefix. [Chat compaction →](/chat#context-compaction)

### DeepSeek V4 cache caveats

DeepSeek V4 Flash uses a hybrid, paged-incompatible cache topology. Its SSD L2 tier is therefore the only cross-request prefix-reuse tier; if Disk Cache is disabled or its directory is not writable, every tool round must prefill the growing transcript again.

Osaurus also rejects inconsistent SSD checkpoints before storing them. If DSV4 reasoning began looping or degrading after cache restores on an older build, update and clear the SSD KV cache once so pre-fix entries cannot be reused.

## Sampling and speculative decoding

Effective local generation settings resolve in this order:

1. values supplied by the request or agent;
2. your **Server → Settings → Sampling Defaults**;
3. the model bundle's `generation_config.json`; and
4. vmlx engine defaults.

Leaving a user default blank is what lets the model value win. An explicit `temperature: 0` selects greedy decoding and makes top-p, top-k, and min-p inert. Presence and frequency penalties resolve from a per-request value and then the model bundle; they do not have user-default fields.

**Server → Settings → Live Activity → Sampler last used** shows the exact temperature, top-p, top-k, min-p, maximum output, and repetition penalty that ran for each model. Warm-up prefills are excluded so the row describes a real request.

For compatible models, speculative controls include an MTP mode/depth and a validated **DFlash 2** drafter selection. Changing these controls may reload the model so the next launch plan uses the new speculative path.

## Concurrency

| Layer | What it protects |
|---|---|
| `BatchEngine` actor (vmlx) | Serializes Metal / model access. Continuous batching for same-model concurrent requests. |
| `MLXBatchAdapter.Registry` | Keeps one `BatchEngine` per model name and coalesces concurrent first creation, so two same-model requests can't build duplicate engines. |
| `ModelLease` | Pins a model name for the lifetime of one stream so eviction (`unload`, `clearAll`, GC) blocks until the lease drops to zero. |
| `ModelResidencyManager` | Schedules the idle-unload policy after the final lease drops; it never owns execution or cache deletion. |
| `PluginHostAPI` per-plugin in-flight cap | Caps concurrent inference calls per plugin (default 2). Excess returns `plugin_busy`. |
| `MetalGate` | Serializes GPU producers across families so concurrent command buffers can't trip Metal asserts — generation is gated per model; embedding and model load are exclusive. |

### Live diagnostics

Open **Server → Settings → Live Activity** for a read-only BatchEngine snapshot that refreshes every two seconds. It reports active and queued slots, per-model configured capacity, high-water marks, engine status, loaded/cache-enabled models, prefix hits and misses, SSD L2 hits/misses/stores, paged evictions, TurboQuant compressions, and hybrid SSM re-derivations. No model loaded means there is no engine snapshot yet.

When macOS swap pressure becomes unsafe for local inference, chat shows a warning with unload and recovery guidance. Treat it as a host-memory signal: stop or unload large local models, close other memory-heavy apps, and retry after pressure falls.

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

**Management → Server → Settings → Model Management → Keep model loaded after use** controls how long weights stay resident after the last stream releases its lease. The default is **15 minutes**, so follow-up turns don't pay a full cold load; choices are 5/15/30/60 minutes, **Immediately** (the old window-close GC behavior, still useful on low-memory Macs), or **Never**.

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
| `ServerRuntimeSettingsStore.swift` | Saved concurrency, Memory Safety, generation, and cache settings |
| `InferenceFeatureFlags.swift` | Legacy `mlxBatchEngineMaxBatchSize` fallback |
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

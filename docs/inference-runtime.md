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

`BatchEngine.generate` returns three event cases:

- `.chunk(String)` — pure user-visible text. Reasoning markers and tool-call markers are stripped by the library before they reach Osaurus.
- `.toolCall(ToolCall)` — a fully-parsed tool call. Every supported family (JSON, Qwen `xml_function`, Mistral, GLM-4, LFM2, Kimi K2, Gemma-3/4, MiniMax M2) emits this once the call is complete.
- `.info(GenerateCompletionInfo)` — final stats (token counts, prompt/generation time, stop reason). One per request.

`GenerationEventMapper` translates those into Osaurus's local `ModelRuntimeEvent` (`.tokens`, `.reasoning`, `.toolInvocation`, `.completionInfo`). Reasoning is wired forward-compat: vmlx does not yet emit `Generation.reasoning(String)` on its public enum, so `ModelRuntimeEvent.reasoning` is currently never produced — the plumbing is ready end-to-end (HTTP `reasoning_content`, ChatView Think panel, `StreamingReasoningHint` sentinel for plugins / remote providers) for the day vmlx adds the case.

## Continuous batching

Same-model concurrent requests share a single forward pass via `BatchEngine`. The default `mlxBatchEngineMaxBatchSize` is `4`; tune with:

```bash
defaults write ai.osaurus ai.osaurus.scheduler.mlxBatchEngineMaxBatchSize -int 8
```

Clamped to `[1, 32]`. Higher values raise total throughput at the cost of wired-memory footprint and per-request latency. Defined in `InferenceFeatureFlags.swift`.

## Cache management

vmlx's `CacheCoordinator` owns KV-cache geometry. Osaurus configures it per container at load time with three minimal overrides (`installCacheCoordinator` in `ModelRuntime.swift`):

| Override | Why |
|---|---|
| `modelKey` | Per-model isolation across loads |
| `diskCacheDir` | Osaurus-managed sandbox path |
| `enableDiskCache=false` when dir is unwritable | Graceful fallback to memory-only |

Everything else (`maxCacheBlocks`, `pagedBlockSize`, `diskCacheMaxGB`, `ssmMaxEntries`) is left at the library default so vmlx can ship a single tuned answer per release.

Osaurus deliberately does **not** pass `GenerateParameters.maxKVSize` — a global rotating cache window forced from the app layer conflicted with sliding-window attention layers (e.g. Gemma-4 with a fixed per-layer 1024-position window) and produced `[broadcast_shapes] (1,1,1,N) and (1,16,1,1024)` crashes on the first decode step.

Osaurus also does not call `CacheCoordinator.setHybrid(_:)`. The engine auto-detects hybrid SSM models on first slot admission.

### Multi-turn KV cache reuse

Reuse across requests is **automatic and content-addressed** — the engine delegates prefix-cache management to vmlx's `CacheCoordinator`. Two requests that share the same prefix tokens (system prompt, tools, prior turns) automatically share the cached KV blocks. There is no client-side opt-in or cache key to manage.

For visibility, every response carries a `prefix_hash` field — a stable hash of the system prompt + tool names that produced this generation. `prefix_hash` is informational; passing it back has no effect. Keep `session_id` stable per conversation so chat history and preflight bookkeeping group correctly; cache reuse itself does not depend on it.

## Concurrency

| Layer | What it protects |
|---|---|
| `BatchEngine` actor (vmlx) | Serializes Metal / model access. Continuous batching for same-model concurrent requests. |
| `ModelLease` | Pins a model name for the lifetime of one stream so eviction (`unload`, `clearAll`, GC) blocks until the lease drops to zero. |
| `PluginHostAPI` per-plugin in-flight cap | Caps concurrent inference calls per plugin (default 2). Excess returns `plugin_busy`. |
| `MetalGate.enterEmbedding` | Embedding service (`MetalSafeEmbedder`) opt-in serialization point. The generation surface of the gate was retired; only embeddings call into it today. |

## Model loading and eviction

Window-scoped warm-up: models are loaded and prefix-cached when a chat window opens, not at app launch. Each window warms its own model independently, using the window's agent context (system prompt, memory, tools) for the prefix cache.

When a user switches to a remote model or closes a window, a GC pass checks all open windows and unloads any local model no longer referenced. The warm-up indicator (yellow dot) signals when a model is loading.

### Eviction policy

Configurable in **Settings → Local Inference → Model Management:**

| Policy | Behavior |
|---|---|
| **Strict (One Model)** | Only one local model loaded at a time (default) |
| **Flexible (Multi Model)** | Allows concurrent models for high-RAM systems |

## Sentinel scheme (in-band streaming hints)

`ChatEngine.streamWithTools` returns `AsyncThrowingStream<String, Error>`. Non-content events ride along on the same stream as sentinel strings starting with `\u{FFFE}`:

| Sentinel | Producer | Consumer |
|---|---|---|
| `\u{FFFE}tool:` | local + remote tool call name | HTTP SSE → `tool_calls` deltas; ChatView Think panel |
| `\u{FFFE}args:` | tool argument fragments | HTTP SSE → `tool_calls.function.arguments` deltas |
| `\u{FFFE}done:` | server-side tool call result | ChatView (tool result card) |
| `\u{FFFE}stats:` | post-stream perf | ChatView, plugin `chunk.delta.stats` |
| `\u{FFFE}reasoning:` | local (forward-compat) + remote `reasoning_content` | OpenAI SSE `reasoning_content`; Anthropic `thinking_delta`; OpenResponses `response.reasoning_summary_text.delta`; ChatView Think panel; plugin `chunk.delta.reasoning_content` |

HTTP handlers and the plugin SDK MUST decode `StreamingReasoningHint` BEFORE the generic `StreamingToolHint.isSentinel` filter, otherwise reasoning gets dropped together with the other sentinels.

## Source map

| File | Role |
|---|---|
| `ModelRuntime.swift` | Container lifecycle (load / unload / strict eviction), `ModelLease` glue, single MLX entry into `MLXBatchAdapter` |
| `MLXBatchAdapter.swift` | Per-model `BatchEngine` registry; submits each request via `engine.generate(...)` |
| `GenerationEventMapper.swift` | `Generation` → `ModelRuntimeEvent` bridge; stop-sequence lookahead; tool-call argument JSON serialization |
| `Events.swift` | `ModelRuntimeEvent` enum (`tokens` / `reasoning` / `toolInvocation` / `completionInfo`) |
| `RuntimeConfig.swift` | Server-side default `topP` |
| `InferenceFeatureFlags.swift` | Single user-tunable: `mlxBatchEngineMaxBatchSize` |
| `MetalGate.swift` | Embedding-only counter (kept as the canonical hook for any future MLX-vs-CoreML interlock) |
| `ModelLease.swift` | Per-model refcount; `unload(name)` waits for `count == 0` before freeing buffers |

## Tests

| File | Coverage |
|---|---|
| `MLXBatchAdapterTests` | Max-batch-size flag clamping; registry-shutdown safety |
| `GenerationEventMapperTests` | `chunk` → `tokens`; `toolCall` → `toolInvocation` JSON serialization (happy path + failure envelope); `info` → `completionInfo`; cross-chunk stop-sequence cut |
| `StreamingReasoningHintTests` | Sentinel encode/decode round-trip; co-existence with the tool sentinel filter |
| `MetalGateTests` | Embedding gate happy paths |

---

**Related:**

- [Models](/models) — choosing the right model
- [HTTP API](/api) — `session_id`, `prefix_hash`, streaming behavior
- [Apple Intelligence](/models/apple-intelligence) — the `foundation` model path

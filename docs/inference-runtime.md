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

Same-model concurrent requests share a single forward pass via `BatchEngine`. **Server → Settings → Concurrency & Batching → Concurrent Sessions** is the canonical ceiling for both request concurrency and subagent batching; the Orchestrator's and every agent's **Max local subagents at once** setting share that value. Left empty (Automatic), it resolves to a memory-safe value for your Mac, which may differ from the subagent default of 3.

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
| **SSD Cache (L2) → Disk Cache** | Persists prompt checkpoints across requests and restarts, even when GPU Cache is off. The default path is `~/.osaurus/cache/kv_v2/`; **Disk Cache Directory** overrides it. |
| **Disk Cache Size (% of disk)** | Shared cap for every model on the cache volume. Blank (or **Use Automatic Cache Size**) means Automatic: 30% of free space plus the cache's own bytes, so a filling cache doesn't shrink its own cap. An explicit percentage uses total disk size, bounded by 25% of free space plus the cache. Saving a size change updates loaded models without unloading them. |
| **Clear SSD Cache** | Removes indexed conversation cache files and reclaims the space. Chats, models, and unrecognized files are left alone. If you've edited **Disk Cache Directory**, save first — Clear stays disabled until the directory change is saved. It still clears the saved directory when Prefix Cache is off. |
| **KV Retention Override** | Explicit per-session retention cap; blank uses the active Memory Safety profile. This is separate from the model's context maximum. |
| **On-the-fly Compression** | `Engine Selected` keeps native cache types. TurboQuant is an explicit opt-in and is not forced onto hybrid or companion caches. |

Before enabling SSD reuse, Osaurus performs a real write probe. A read-only directory or ownership problem disables the disk tier rather than writing elsewhere. The diagnostics log the path, owner/mode, and underlying error; check that detail if every tool round appears to prefill the full conversation again.

The cap is root-wide, not per model. Low free space is advisory: Settings shows "Disk space is low. SSD caching remains enabled." rather than switching caching off. Eviction is conversation-aware — the chat's session id is the engine's cache chain, so other chats' snapshots are evicted before the chat in progress, and normal trimming is silent (there is no chat popup about cache capacity). The Context Budget popover's disk-cache row shows used space and the resolved cap, and warns past 75% that older checkpoints may be evicted; **Server → Settings → Live Activity** shows disk-cache hits, stores, usage, and evictions. Saved percentages and legacy GB sizes survive migration.

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

For compatible models, speculative controls include an MTP mode/depth and a validated **DFlash 2** drafter selection. Native MTP starts **Off**: a compatible local model shows **Speculative Depth** (Off, Auto, 1–3) in the chat model picker's options once its configuration and weight headers are inspected — no request or load is needed. The global setting is **Server → Settings → Speculative Decoding**, and it applies to chat and API requests. The runtime may lower the depth or use ordinary decoding when speculation doesn't help. Force On requires verified bundle tuning unless an eligible manual depth is selected in chat; if the bundle can't honor it, the request reports a policy error instead of silently falling back. Changing these controls may reload the model so the next launch plan uses the new speculative path.

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

macOS manages swap: Osaurus no longer shows swap warnings or asks for a "Use Anyway" confirmation. **Memory Safety** load budgets still refuse a load that won't fit, and actual model-load failures appear normally. Local memory warnings are hidden when the selected model is a cloud model.

## Model loading and eviction

Lazy loading: selecting a model in chat only records the choice. The first **Send** loads the weights and prefills the real request, so neither app launch nor opening a chat window loads a model. Each window keeps its own model and agent context (system prompt, memory, tools) for the prefix cache.

When a user switches to a remote model or closes a window, a GC pass checks all open windows and unloads any local model no longer referenced (unless **Keep Model Loaded** is on). The warm-up indicator (yellow dot) signals when a model is loading.

### Eviction policy

Configurable in **Settings… → Server → Settings → Model Memory → Eviction Policy:**

| Policy | Behavior |
|---|---|
| **Strict (One Model)** | Only one local model loaded at a time (default) |
| **Flexible (Multi Model)** | Allows concurrent models for high-RAM systems |

### Idle residency

**Settings… → Server → Settings → Model Memory → Model Residency** controls how long weights stay resident after the last stream releases its lease:

| Control | Behavior |
|---|---|
| **Keep Model Loaded** | Off by default. On keeps weights resident through idle time and window close; permanent residency is an explicit opt-in. |
| **Unload After** | Shown while Keep Model Loaded is off. **30 seconds** (default), 5 / 15 / 30 minutes, 1 hour, or **Immediately** (unload when the last generation finishes). A timed choice also unloads when the last chat window using the model closes; active requests finish first. |

A 15-minute value saved by older versions (the former default) migrates to 30 seconds once on upgrade; Never, Immediately, and other durations are kept.

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

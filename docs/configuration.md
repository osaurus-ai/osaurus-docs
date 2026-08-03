---
title: Server Settings
sidebar_label: Server Settings
description: Environment variables, server flags, defaults knobs, and where everything lives on disk.
---

# Server Settings

Osaurus works out of the box with sensible defaults. This page covers the knobs you can turn.

## Environment variables

| Variable | Description | Default |
|---|---|---|
| `OSU_PORT` | Server port number | `1337` |
| `OSU_MODELS_DIR` | Custom MLX models directory | `~/MLXModels` |

```bash
# Persistent (shell profile)
export OSU_PORT=8080
export OSU_MODELS_DIR=/Volumes/External/MLXModels

# Or inline
OSU_PORT=8080 osaurus serve
```

## Server flags

`osaurus serve` accepts:

| Option | Description | Default |
|---|---|---|
| `--port`, `-p` | Server port | 1337 |
| `--expose` | Bind to all interfaces (LAN access) | localhost only |

```bash
osaurus serve                          # localhost:1337
osaurus serve --port 8080              # localhost:8080
osaurus serve --expose                 # 0.0.0.0:1337 (LAN)
osaurus serve --expose --port 1337     # 0.0.0.0:1337 (LAN, explicit)
```

:::warning[LAN exposure]
When you `--expose`, anyone on your network can reach your Osaurus. Use access keys to protect endpoints — see [Identity](/identity).
:::

## Capabilities (auto-selection)

Each agent has a tool mode in its **Capabilities** settings. In **Auto** mode (the default), the model starts with a small always-loaded set and pulls in more of your enabled tools, skills, and methods on demand via `capabilities_discover` / `capabilities_load`. In **Manual** mode, all enabled capabilities are sent every turn at the cost of larger system prompts. [Skills →](/skills) · [Methods →](/methods)

## Chat

**Management → Settings → Chat → Compaction Model** selects the model used to summarize older messages when a conversation approaches its context limit. Local, Foundation, and remote models are supported; remote compaction requests honor your [Privacy Filter](/privacy-filter) settings. If unset, Osaurus asks you to choose a model the first time compaction runs rather than silently using the active chat model. [Chat compaction →](/chat#context-compaction)

## Memory

Memory is on by default, with ten settings. Edit them in **Management → Memory** or in `~/.osaurus/config/memory.json`:

| Setting | Default | Description |
|---|---|---|
| `enabled` | `true` | Master toggle |
| `embeddingBackend` | `mlx` | Embedding backend (`mlx` / `none`) |
| `embeddingModel` | `nomic-embed-text-v1.5` | Embedding model used by VecturaKit |
| `extractionMode` | `sessionEnd` | When to distill (`sessionEnd` / `manual`) |
| `relevanceGateMode` | `heuristic` | Read-path gate (`off` / `heuristic` / `llm`) |
| `memoryBudgetTokens` | `800` | Per-request budget (100–4,000) |
| `summaryDebounceSeconds` | `60` | Inactivity before distillation (10–3,600) |
| `consolidationIntervalHours` | `24` | Background consolidator cadence (1–168) |
| `salienceFloor` | `0.2` | Eviction threshold for pinned facts (0–1) |
| `episodeRetentionDays` | `365` | Episode/transcript retention (0 = forever) |

[Memory →](/memory) · [Memory Internals →](/memory-internals)

## Local inference

**Management → Server → Settings → Model Memory:**

| Setting | Description |
|---|---|
| **Eviction policy** | `Strict (One Model)` keeps one model loaded (default); `Flexible (Multi Model)` allows concurrent models for high-RAM systems |
| **Keep model loaded after use** | Idle residency after the last request — 5/15/30/60 minutes (default 15), Immediately, or Never |
| **Top P** | Default top-p for inference (per-request override available) |
| **Allowed origins** | CORS origins (currently `*`) |

### Concurrency & Batching

**Server → Settings → Concurrency & Batching → Concurrent Sessions** is the shared concurrency limit for same-model requests and subagent batches. The same value appears in Main Chat Spawn and every agent's **Max subagents per batch** control; editing either surface updates the canonical limit.

Leave the field empty for **Automatic**, which resolves a safe value from the active Memory Safety profile. Values are clamped to 1–32. RAM admission, current engine occupancy, and local-model residency can still split a subagent batch into smaller waves.

With **Continuous Batching** off (the default), each local model is pinned to one active job even when Concurrent Sessions is higher. Turning it on allows same-model requests to decode together. A limit of `1` keeps vmlx's compiled-decode fast path; higher limits trade that speedup and additional wired memory for throughput. Remote jobs can still overlap when local continuous batching is off.

The legacy `defaults` knob still works when no runtime setting is present:

```bash
defaults write ai.osaurus ai.osaurus.scheduler.mlxBatchEngineMaxBatchSize -int 8
```

The legacy value is clamped to `[1, 32]`; the Server setting takes precedence. [Inference Runtime details →](/inference-runtime)

## Sandbox

The sandbox is configured in **Management → Sandbox → Container → Resources** or by editing `~/.osaurus/config/sandbox.json` (the Linux VM backend on macOS 26+; macOS 15 uses the Seatbelt fallback, which has no VM resources to configure):

```json
{
  "autoStart": true,
  "cpus": 2,
  "memoryGB": 2,
  "network": "outbound"
}
```

| Setting | Range | Default |
|---|---|---|
| `autoStart` | true / false | true |
| `cpus` | 1–8 | 2 |
| `memoryGB` | 1–8 | 2 |
| `network` | `outbound` / `proxy` / `none` | outbound |

`proxy` boots the VM on a host-only network with a domain-allowlist egress proxy; it's selected automatically when the provisioning agent has Allowed Domains configured. Changes require a container restart. [Sandbox Internals →](/sandbox)

## Storage encryption

Local data is plaintext SQLite by default, protected at rest by FileVault. Turn on whole-database SQLCipher encryption in **Settings → Storage** if your threat model calls for it — the same panel handles backups, key rotation, and recovery. [Storage & Encryption →](/storage)

## API path prefixes

Endpoints are available under multiple prefixes for compatibility:

- `/v1/endpoint` — OpenAI style
- `/api/endpoint` — generic / Ollama style
- `/v1/api/endpoint` — combined

All prefixes route to the same handlers.

## HTTP server limits

To prevent unauthenticated clients from exhausting host memory, Osaurus rejects oversized request bodies *before* the auth gate:

| Endpoint | Limit |
|---|---|
| `POST /pair` | 64 KiB |
| Other public HTTP routes | 32 MiB |
| Sandbox host bridge | 8 MiB |

Oversized requests return `413 Payload Too Large`.

## Where things live

| What | Path | Override |
|---|---|---|
| MLX models | `~/MLXModels/` | `OSU_MODELS_DIR` |
| App data root | `~/.osaurus/` | not configurable |
| Plugin install root | `~/.osaurus/Tools/<plugin_id>/<version>/` | not configurable |
| Voice models | `~/Library/Application Support/FluidAudio/Models/` | not configurable |
| Memory | `~/.osaurus/memory/memory.sqlite` + `vectura/{agent}/` | not configurable |
| Chat history | `~/.osaurus/chat-history/history.sqlite` + `blobs/` | not configurable |
| Methods | `~/.osaurus/methods/methods.sqlite` | not configurable |
| Tool index | `~/.osaurus/tool-index/tool_index.sqlite` | not configurable |
| Schedules | `~/.osaurus/schedules/{uuid}.json` | not configurable |
| Watchers | `~/.osaurus/watchers/{uuid}.json` | not configurable |
| Skills | `~/.osaurus/skills/{name}/SKILL.md` | not configurable |
| Themes | `~/.osaurus/themes/{uuid}.json` | not configurable |
| Sandbox plugins | `~/.osaurus/sandbox-plugins/` | not configurable |
| Sandbox container | `~/.osaurus/container/` | not configurable |
| Configs | `~/.osaurus/config/*.json` | edit directly |
| Encryption key (opt-in encryption only) | macOS Keychain (`com.osaurus.storage`) | see [Storage](/storage) |
| Identity master key | iCloud Keychain | see [Identity](/identity) |

## Per-request configuration

Most generation behavior is per-request via API parameters:

```json
{
  "model": "gemma-4-e2b-it-4bit",
  "messages": [{ "role": "user", "content": "Hello" }],
  "temperature": 0.7,
  "max_tokens": 1000,
  "top_p": 0.9,
  "stream": true,
  "session_id": "my-conversation"
}
```

[HTTP API reference →](/api)

## Recommended setups

**Single-machine local-first development:**

```bash
osaurus serve                          # default port, loopback only
```

**LAN access for testing on phone or another laptop:**

```bash
osaurus serve --expose
# Then mint an osk-v1 access key from Identity → Access Keys
```

**External drive for large models:**

```bash
export OSU_MODELS_DIR=/Volumes/ModelsDrive/MLXModels
osaurus serve
```

**Multiple instances (one per project, etc.):**

```bash
# Terminal 1
OSU_PORT=1337 osaurus serve

# Terminal 2 (separate models dir if you want isolation)
OSU_MODELS_DIR=~/MLXModels-experimental OSU_PORT=1338 osaurus serve
```

---

**Related:**

- [Storage & Encryption](/storage) — SQLCipher migration, key rotation, plaintext export
- [Memory Internals](/memory-internals) — settings explained
- [Inference Runtime](/inference-runtime) — what the batch-size knob actually does
- [Identity](/identity) — `osk-v1` keys, whitelists, revocation

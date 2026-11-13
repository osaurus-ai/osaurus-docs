---
title: Configuration
sidebar_label: Configuration
description: Declarative YAML/JSON desired state (agents, automations, workflows, channels, and more), configuration history, environment variables, server flags, runtime defaults, and storage paths.
---

# Configuration

This page is for people who want to manage Osaurus from files, scripts, or the Terminal instead of clicking through Settings.

Osaurus works out of the box with sensible defaults. This page covers the knobs you can turn.

## Declarative configuration

Describe the parts of Osaurus you want to manage in one versioned YAML or JSON document. The planner compares that desired state with the running app, validates the whole document, and shows the exact changes and risks before the applier writes anything.

The same engine powers:

- the Configurator's `osaurus_config` tool (`schema`, `export`, `plan`, `apply`, `templates`, `workflows`, `history`, `diff`, `revert`) and the `osaurus_inspect` read surface;
- `osaurus config export|schema|plan|apply`; and
- loopback-only `/admin/config/*` HTTP endpoints.

### Example

```yaml
version: 1

memory:
  enabled: true
  budget_tokens: 1200

default_agent:
  name: Osaurus
  model: foundation
  system_prompt: "Be concise and delegate specialist work."

new_chat_agent: default

agents:
  - name: Research Agent
    description: "Web research with cited sources"
    system_prompt: "Research thoroughly and cite sources."
    model: null # inherits the Orchestrator's model
    temperature: 0.4
    capabilities:
      tools_enabled: true
      web_search_enabled: true
      apple_apps: [calendar, reminders]
    workflows: ["Research Brief"]

delegation:
  local_text_enabled: true
  spawnable_agents: ["Research Agent"]
  spawnable_workspace_agents: [] # teammates' shared agents as Name@Workspace
  permission_defaults:
    spawn: always_allow
    spawn_workspace: ask
  budget_max_tokens: 8192
  budget_max_turns: 24
  budget_max_seconds: 900

automations:
  - name: Weekday report
    source:
      kind: schedule
      frequency: cron
      frequency_value: "0 9 * * 1-5"
    workflow: Daily Report
    input:
      date: "{{schedule.scheduled_for}}"
```

Documents can manage `memory`, `harness_runtimes`, `default_agent`, `configurator`, `new_chat_agent`, `model_defaults`, `chat`, `app`, custom `agents`, `tools`, `delegation`, slash `commands`, `knowledge_collections`, `channels`, `mcp_servers`, local `models`, native `plugins`, cloud `providers`, `search_providers`, and `automations`.

A few sections worth knowing:

| Key | What it covers |
|---|---|
| `new_chat_agent` | The agent new chats open with: `default` (the Orchestrator) or a custom agent's name. The older `active_agent` name is still accepted. |
| `configurator` | The built-in Configurator: `model` (`null` uses the Orchestrator's model), `temperature`, and extra `system_prompt` instructions. Its name is fixed. |
| `model_defaults` | `core_model` and `compaction_model` from **Settings → Models → Model Defaults**. `null` clears the role so the chat's model is used. Image, video, speech, privacy detection, and AppleScript models stay in Settings. |
| `chat` | Everyday switches from **Settings → Chat**: `smooth_streaming`, `group_activity`, `expand_thinking`, `spell_check`, `auto_titles`, `follow_up_suggestions`, `clipboard_monitoring`, `keep_mac_awake`. |
| `app` | From **Settings → General**: `hotkey` (for example `cmd+shift+o`; `null` turns it off), `start_at_login`, `show_notifications`. |
| `agents[].model` | `null` inherits the Orchestrator's model |
| `agents[].capabilities` | Ability switches, including `image_enabled`, `applescript_enabled`, `browser_use_enabled`, `computer_use_enabled`, `calculator_enabled`, `redaction_tools_enabled`, and `apple_apps` — a list from `calendar`, `reminders`, `contacts`, `notes`, `mail`, `messages`, `maps`, `music`, `shortcuts` that replaces the agent's set |
| `agents[].skills` | The agent's skill allow-list: omit to leave it unchanged, `null` for every installed skill, or a list of skill names or slugs (`[]` means none). Only listed skills appear in the agent's prompt, `capabilities_load`, and slash commands. |
| `agents[].tools` | With `mode: manual`, the exact tool list. Exports list a fully selected plugin or MCP server under `plugins` / `mcp_servers`, and a partly selected one as exact names under `tools.enabled`. |
| `agents[].workflows` | Installed [workflow](/workflows) names the agent may call, each as a `workflow_<slug>` tool. The list replaces the set; `[]` turns them off. Installing a workflow stays in the app. |
| `agents[].shared_tool_approval` | What happens when a teammate, invite-link guest, or another person's agent calls one of this agent's tools that needs approval: `mode: deny` (default, the call fails) or `ask_owner` (waits for you, declining after `timeout_seconds`, 30–86400, default 600). |
| `agents[].runtime`, `agents[].claude_code` | Which [runtime](/harness-runtimes) the agent runs on, and its Claude Code options. Also on `default_agent`, which adds `claude_code.allow_osaurus_config_writes`. |
| `agents[].orchestrator_spawnable` | `false` keeps a newly created agent out of **Settings → Agents → Delegation → Allowed subagents**. Ignored when patching an existing agent; a `delegation.spawnable_agents` list in the same document wins. |
| `harness_runtimes` | External agent runtimes: `name`, `kind` (`claude_code` or `pi_rpc`; required to add, fixed after), `executable`, `arguments` (`{chat_id}`, `{agent_id}`, `{cwd}`, `{system_prompt_file}` are filled per launch), and `environment` (plain values, never secrets). [Runtimes →](/harness-runtimes) |
| `delegation` | The Orchestrator's allowed subagents (`spawnable_agents`, `spawnable_workspace_agents`), `workspace_auto_join` (set a workspace to `false` to stop its shared agents joining automatically), `permission_defaults` (`spawn`, `spawn_workspace`: `ask` / `deny` / `always_allow`), worker limits (`budget_max_tokens`, `budget_max_turns`, `budget_max_seconds`, `budget_max_parallel_spawns`, `budget_max_remote_parallel_spawns`), and the [local-model memory settings](/subagents) (`local_text_enabled`, `ram_safety_preflight`) |
| `channels` | Per platform: receiving (`read_allowlist`, `sender_allowlist`), `routing` (which agent or workflow answers which rooms, with `replies` set to `automatic` or `approval`), and sending (`write_enabled`, `write_allowlist`, `posting` with `off`, `ask_first`, or `without_asking`). Extra bots and accounts go under `channels.<platform>.accounts`. Bots and mail accounts are added in the app, never from a document. [Agent Channels →](/agent-channels) |

Working folders and the per-agent model override aren't part of the document; set them in the app. In chat, the Orchestrator can also create an agent from an [agent template](/agent-templates) shown to it, with `template: "<name>"` and `overrides` (`name`, `description`, `system_prompt`, `model`, `capabilities`). To install agents, skills, MCP servers, and runtimes from a vendor's installer, see [Osaurus Bundles](/bundles). [Apple Apps →](/apple-apps) · [Subagents →](/subagents)

### Automations

`automations:` describes [Automations](/automations): what starts the work, an optional filter, and what runs.

| Key | What it covers |
|---|---|
| `source.kind` | `schedule`, `folder`, `webhook`, `rss`, `sse`, `run_failed`, or `app` |
| `source` (webhook) | Optional `sample_body` (so fields are known) and a `provider` (`github`, `stripe`, `slack`, `shopify`, `twilio`, `microsoft_graph`, `facebook`, `sns`) that replaces `verification` |
| `source` (rss) | `url`, `poll_interval_seconds`, `catch_up`, `max_items_per_tick` |
| `source` (sse) | `url`, `headers`, `event_names`, `heartbeat_timeout_seconds` |
| `source` (run_failed) | `workflows` and `include_automation_runs` |
| `source` (app) | `reasons`: `app_launched`, `automation_enabled`, `automation_updated` |
| `filter` | Optional conditions on the trigger's fields, for example `webhook.body.action: opened` |
| `agent` + `instructions` | Run an agent with instructions that can use trigger values such as `{{webhook.body.issue.title}}` |
| `workflow` + `input` | Run a workflow. Every required input must be bound, to a trigger value such as `{{schedule.scheduled_for}}` or fixed text. An omitted `input` on create is prefilled the way the editor does |
| `delivery` | Queueing, `dedupe` (`none`, `window` with `dedupe_window_seconds`, or `durable`), and missed runs |

```yaml
automations:
  - name: New GitHub issues
    source:
      kind: webhook
      provider: github
      sample_body: '{"action": "opened", "issue": {"title": "Crash on launch"}}'
    filter:
      conditions:
        webhook.body.action: opened
    agent: Triage
    instructions: "Triage the new issue: {{webhook.body.issue.title}}"
```

A webhook's URL and secret are created on apply and shown on the automation in **Settings → Automations**. They never appear in a document or the apply result. For providers that issue their own secret (Stripe, Slack, Shopify, Twilio, Meta), paste it on the automation after apply.

Older documents still work: `schedules:`, `watchers:`, and `events:` sections are translated into `automations:`, and `channels.<platform>.inbound_*` keys or automations with `source.kind: channel_message` become `channels.<platform>.routing` rules, each with a deprecation note. Automations with `source.kind: email` are ignored with a note pointing to `channels.email`.

### Semantics and safety

- **Merge by default.** Missing keys stay untouched; explicit `null` clears an optional override.
- **Entities match by name**, case-insensitively. Listed agents, providers, MCP servers, automations, and channel routing rules are created or patched. Automations and routing rules share one set of names.
- **Plan is read-only.** Only `apply` mutates state.
- **Prune is an explicit argument**, not a document key. It deletes unlisted entries only in sections present in the document. A prune that would delete an agent a surviving automation still runs on is refused.
- **Validation is all-or-nothing.** Unknown keys, bad values, and invalid references stop the whole document before changes begin.
- **Model ids are grounded.** `foundation`, an installed local model id, or `<provider>/<model>` for a cloud model. An id nothing offers fails validation.
- **High-risk changes need an extra confirmation:** prune deletions, screen or browser grants, Remote Access exposure, new MCP endpoints and stdio MCP commands, runtime commands and environments, moving an agent onto a runtime, Claude Code shell or configuration-change permission, enabling channel writes, automatic channel replies, agents posting `without_asking`, setting a tool policy to `auto`, and looser delegation permissions.
- Documents are capped at 512 KiB.

### Configuration history

Every change that lands is kept as a version of the whole document — from a chat, a template install, a file import, the command line, your iPhone, or a change made in Settings (shown as **Changed in Settings**). The first version is your setup as Osaurus first found it.

**Settings → Agents → Configurator → Configuration History** lists them newest first. Select one to see what it changed, or two to compare. A row's ⋯ menu has **Name…** (named versions are always kept; otherwise the newest 200 are), **Export…** (as `.yaml`), and **Revert to This Version…**. In chat, ask "what changed yesterday?" and the Configurator uses `history` and `diff`; a `revert` shows the same approval card as any change.

A revert is an ordinary apply of the old document: it adds and updates but deletes nothing unless you ask for an exact mirror, and it can be limited to some sections. Versions hold only what the document holds — no keys or tokens, and not server runtime settings, appearance, voice, or working folders. History lives in `~/.osaurus/config/history.sqlite`.

### Secrets

Exports never include secrets or reveal whether a credential exists. Documents accept references, not raw keys:

- `env:VARIABLE_NAME`
- `keychain:SERVICE/ACCOUNT`
- `credential:KEY` — a key saved for all agents in the [Vault](/vault)
- `set_api_key: true` to open the native credential sheet during apply

Provider `api_key_ref`, MCP `token_ref` (HTTP bearer token), `secret_header_refs` (HTTP custom headers such as `X-API-Key`, header name → reference), `secret_env_refs` (stdio environment), and channel `bot_token_ref` resolve only at apply time. OAuth, device pairing, macOS permission grants (including the Apple app permission prompts), folder pickers, destructive resets, payment, server runtime, appearance and text size, voice, sandbox resources, privacy filtering, and image targets remain interactive Settings work by design.

### CLI workflow

```bash
osaurus config export -o osaurus-config.yaml
osaurus config schema
osaurus config plan osaurus-config.yaml
osaurus config apply osaurus-config.yaml

# Destructive or otherwise high-risk changes
osaurus config plan osaurus-config.yaml --prune
osaurus config apply osaurus-config.yaml --prune --yes
```

`apply` exits `0` when fully converged, `1` when a change fails or is cancelled, and `3` when changes applied but an interactive step such as credential entry remains. With **Settings → Server → Server Settings → Authentication → Require Access Key for Local Admin Routes** on, pass `--access-key KEY` or set `OSAURUS_API_KEY`.

Validated sample documents covering every section ship in the Osaurus repository under `docs/examples/` (`osaurus-config.sample.yaml` and `osaurus-config.sample.json`).

[Orchestrator →](/orchestrator) · [CLI reference →](/cli) · [HTTP endpoints →](/api)

## Environment variables

| Variable | Description | Default |
|---|---|---|
| `OSU_PORT` | Server port number | `1337` |
| `OSU_MODELS_DIR` | Custom MLX models directory | `~/MLXModels` |
| `OSAURUS_API_KEY` | Access key the CLI sends for `osaurus config`, `osaurus import`, and `osaurus mcp` | none |

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
When you `--expose`, anyone on your network can reach your Osaurus. Use access keys to protect endpoints — see [Osaurus ID](/identity).
:::

## Capabilities (auto-selection)

Each agent has a tool mode under **Settings → Agents →** the agent **→ Abilities → Tools**. In **Auto** mode (the default), the model starts with a small always-loaded set and pulls in more of your enabled tools, skills, and methods on demand via `capabilities_discover` / `capabilities_load`. In **Manual** mode, all enabled capabilities are sent every turn at the cost of larger system prompts. [Skills →](/skills) · [Methods →](/methods)

## Chat

**Settings → Models → Model Defaults → Compaction Model** selects the model used to summarize older messages when a conversation approaches its context limit (**Settings → Chat** links there too). Local, Foundation, and remote models are supported; remote compaction requests honor your [Privacy Filter](/privacy-filter) settings. If unset, the chat's current model summarizes. To lower every model's chat context window, use **Settings → Server → Server Settings → Cache → Context Window Cap**. [Chat →](/chat)

## Memory

Memory is on by default, with ten settings. Edit them in **Settings → Memory** or in `~/.osaurus/config/memory.json`:

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

**Settings → Server → Server Settings:**

| Section | Setting | Description |
|---|---|---|
| Model Memory | **Eviction Policy** | `Strict (One Model)` keeps one model loaded (default); `Flexible (Multi Model)` allows concurrent models for high-RAM systems |
| Model Memory | **Keep Model Loaded** / **Unload After** | Off by default: a model unloads 30 seconds after its last request (or when the last chat window using it closes). Pick 5, 15, or 30 minutes, 1 hour, or Immediately instead — or turn on **Keep Model Loaded** to never unload. |
| Memory Safety | **Keep Model in Memory** | Keeps a loaded model's weights wired in GPU memory. On by default when the model fits; other apps may slow down. Turning it off lets macOS evict model pages. Doesn't change **Keep Model Loaded**. While the sandbox runs, its Memory is taken out of this budget. |
| Memory Safety | **Allocator Cache Cap (MB)** | Bounds MLX's freed-buffer reuse pool after reload. Blank keeps the profile's targets. Doesn't limit model weights or KV state. |
| Sampling Defaults | | Optional temperature, top-p, top-k, min-p, repetition penalty, and max-token defaults. Blank fields defer to the model bundle. |
| Speculative Decoding | | **Default** follows the loaded bundle; shows the actual resolution and reason. [Models →](/models) |
| Cache | **Disk Cache Size (% of disk)** | Blank is Automatic: 30% of free space plus the cache's own bytes. An explicit percentage (above 0, up to 100) uses total disk size with no other ceiling; it's a maximum, not a reservation, and a red advisory appears when it exceeds available space. |
| Cache | **Clear SSD Cache** | Safely remove reusable KV checkpoints and reclaim the cache volume |
| Cache | **Context Window Cap** | Lower every model's chat context window |
| Connection | **Allowed Origins (CORS)** | For browser apps only; loopback is always allowed. `*` allows any origin, otherwise a comma-separated list. |
| Authentication | **Require Access Key for Local Admin Routes** | Off by default. When on, callers on this Mac need an access key for `/sessions`, `/agents`, `/conversations/*`, `/mcp/*`, `/admin/config/*`, and `/admin/import/*`. Takes effect on the next request. [Security →](/security) |

Sampler precedence is request/agent → your Sampling Defaults → model bundle → engine. **Live Activity → Sampler last used** reports what actually ran. [Inference Runtime details →](/inference-runtime)

### Concurrency & Batching

**Settings → Server → Server Settings → Concurrency & Batching → Concurrent Sessions** is the shared concurrency limit for same-model requests and local subagents. The same value appears as **Max local subagents at once** in **Settings → Agents → Delegation** and every agent's Subagents tab; editing either surface updates the shared limit. It isn't the number of background tasks that run at once — that's **Max Concurrent Tasks** per queue in **Settings → Developer Tools → Tasks**.

Leave the field empty for **Automatic**, which resolves a safe value from the active Memory Safety profile. Values are clamped to 1–32. Memory checks, current engine occupancy, and local-model residency can still split a wave of subagents into smaller groups.

With **Continuous Batching** off (the default), each local model is pinned to one active job even when Concurrent Sessions is higher. Turning it on allows same-model requests to decode together. A limit of `1` keeps vmlx's compiled-decode fast path; higher limits trade that speedup and additional wired memory for throughput. Remote jobs can still overlap when local continuous batching is off.

The legacy `defaults` knob still works when no runtime setting is present:

```bash
defaults write ai.osaurus ai.osaurus.scheduler.mlxBatchEngineMaxBatchSize -int 8
```

The legacy value is clamped to `[1, 32]`; the Server setting takes precedence. [Inference Runtime details →](/inference-runtime)

## Sandbox

The sandbox is configured in **Settings → Developer Tools → Sandbox → Settings** or by editing `~/.osaurus/config/sandbox.json` (the Linux VM backend on macOS 26+; macOS 15 uses the Seatbelt fallback, which has no VM resources to configure):

```json
{
  "autoStart": true,
  "cpus": 2,
  "memoryGB": 2,
  "maxAgentEnvironments": 6,
  "maxRetainedEnvironments": 16,
  "idleShutdownMinutes": 0
}
```

| Key | Setting | Range | Default |
|---|---|---|---|
| `autoStart` | Auto-Start | true / false | true |
| `cpus` | CPUs | 1–8 | 2 |
| `memoryGB` | Memory | 1–8 | 2 |
| `maxAgentEnvironments` | Agents Kept Warm | 1–8 | 4, 6, or 8 by the Mac's memory |
| `maxRetainedEnvironments` | Environments Kept on Disk | 1–64 | 16 |
| `idleShutdownMinutes` | Stop When Idle | 0–240 | 0 (never) |

Network isn't a sandbox-wide setting: each agent's **Sandbox Network** and **Allowed Domains** decide it, and the older `network` key is ignored. Changes take effect with **Restart to Apply**. [Sandbox Internals →](/sandbox)

## Storage encryption

Local data is plaintext SQLite by default, protected at rest by FileVault. Turn on whole-database SQLCipher encryption in **Settings → Privacy & Security → Data & Storage** if your threat model calls for it — the same panel handles backups, key rotation, recovery, and how long file-change history is kept. [Storage & Encryption →](/storage)

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
| `/pair-invite`, `/secure/session`, `/pair/code`, `/pair/confirm` | 64 KiB |
| `POST /events/{token}` (webhook automations) | Set per automation: 256 KB by default, up to 10 MB |
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
| Automations | `~/.osaurus/events/` (one JSON per automation, plus the `runs.sqlite` run ledger) | not configurable |
| Workflows | `~/.osaurus/workflows/` (installed workflows, drafts, `runs.sqlite`) | not configurable |
| Skills | `~/.osaurus/skills/{name}/SKILL.md` | not configurable |
| Config templates | `~/.osaurus/templates/` | not configurable |
| Configuration history | `~/.osaurus/config/history.sqlite` | not configurable |
| Vault | `~/.osaurus/credentials/` (index and bindings; values in the macOS Keychain) | not configurable |
| Sandbox plugins | `~/.osaurus/sandbox-plugins/` | not configurable |
| Sandbox container | `~/.osaurus/container/` | not configurable |
| Configs | `~/.osaurus/config/*.json` | edit directly |
| Encryption key (opt-in encryption only) | macOS Keychain (`com.osaurus.storage`) | see [Storage](/storage) |
| Osaurus ID master key | iCloud Keychain | see [Osaurus ID](/identity) |

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

**LAN access for testing on another laptop:**

```bash
osaurus serve --expose
# Then create an osk-v1 access key in Settings → Server → Access Keys
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
- [Osaurus ID](/identity) — `osk-v1` keys, whitelists, revocation
- [Vault](/vault) — keys and secrets that `credential:KEY` points at

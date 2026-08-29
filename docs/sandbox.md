---
title: Sandbox Internals
sidebar_label: Sandbox Internals
description: The shared Linux VM, host bridge, plugin recipes, security posture, and tool inventory. Reference for plugin authors and contributors.
---

# Sandbox Internals

The Sandbox runs agent code in an isolated environment with full dev capabilities — shell, Python, Node, compilers, package managers. On **macOS 26+** it's a shared Linux VM (Alpine, Apple Containerization framework) running natively on Apple Silicon; on **macOS 15** it falls back to a native Seatbelt backend so sandboxed execution works everywhere.

:::tip[Sandbox security at a glance]
Per-agent Linux users, vsock-bridge with per-agent bearer tokens, fail-closed network policy, SHA-256-pinned runtime artifacts. Plain-language summary on [Security & Privacy](/security).
:::

For the everyday view, see [Tasks](/agent-loop). This page is the reference for plugin authors and contributors.

## Requirements

- **macOS 26 (Tahoe)** or later for the Linux VM backend (Apple's Containerization framework)
- **Apple Silicon** (M1 or newer)
- On earlier macOS, the sandbox automatically uses the [Seatbelt fallback](#seatbelt-fallback-macos-15) — no VM, no download

## Seatbelt fallback (macOS 15)

On Macs that can't run the Containerization VM, commands run as regular host processes confined by a deny-by-default Seatbelt profile (`sandbox-exec`): they can read the system but can only write inside the sandbox workspace (`~/.osaurus/container/workspace/`, seen by agents as `/workspace`) and a scratch temp directory. The backend is chosen once at launch — macOS 26+ always uses the VM, older systems always use Seatbelt.

Everything on this page applies to both backends unless noted. The differences:

| | Linux VM (macOS 26+) | Seatbelt (earlier) |
|---|---|---|
| Environment | Alpine Linux, full userland | macOS, BSD userland |
| Package managers | `pip`, `npm`, `apk` | `pip`, `npm` (no `apk`) |
| Tool recipe `dependencies` | Supported | Not supported — install via `setup` with pip/npm |
| Network policy | Off, on, or per-domain allowlist | All-or-nothing. A configured domain allowlist can't be enforced and fails closed to no network |
| Isolation boundary | Hardware VM, separate filesystem | Process-level write confinement. Reads of the host are not blocked |
| Per-agent environments | Separate Linux users, optional per-agent rootfs | Shared workspace tree with per-agent home directories |
| Sandboxed MCP servers | Supported | Not supported — set the provider's Run in to Host |
| Provisioning | Kernel + rootfs download (~1 min) | Instant, no download |

Two Seatbelt behavioral notes: denied file lookups surface as "No such file or directory" rather than "Operation not permitted" (deliberate macOS anti-probing behavior), and `~` inside sandboxed commands resolves to the agent's workspace home, not your macOS home.

## Provisioning

1. **Management → Sandbox → Container** → **Provision**
2. Osaurus downloads the Linux kernel + initial filesystem and boots the VM
3. The first run takes about a minute; subsequent boots are seconds
4. Sandbox tools become available to the active agent automatically

Sandbox execution defaults **on for every new custom agent** while preserving explicit opt-outs through duplicate, export, and relaunch. The built-in Orchestrator is hard-off and delegates code execution to custom agents instead.

The container is not booted eagerly — a never-set-up sandbox stays un-provisioned until the first time a custom agent reaches for a sandbox tool, at which point it boots and provisions on demand. Once setup completes, later launches auto-start as normal.

A **Provisioning Preflight** report (Management → Sandbox) inspects the resolved paths, config, cached assets, and bridge socket before provisioning, with typed readiness states (`ready` / `needs_setup` / `blocked` / `unproven`) and a concrete repair suggestion per finding. **Copy JSON** produces a support artifact.

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        macOS Host                            │
│                                                              │
│  ┌──────────────┐     ┌──────────────────────────────┐       │
│  │   Osaurus    │     │   Linux VM (Alpine)          │       │
│  │              │     │                              │       │
│  │  SandboxMgr ─┼─────┤→ /workspace (VirtioFS)       │       │
│  │              │     │→ /output    (VirtioFS)       │       │
│  │  HostAPI  ←──┼─vsock─→ /run/osaurus-bridge.sock   │       │
│  │  Bridge      │     │                              │       │
│  │              │     │  agent-alice  (Linux user)   │       │
│  │  ToolReg  ←──┼─────┤  agent-bob    (Linux user)   │       │
│  │              │     │  ...                         │       │
│  └──────────────┘     └──────────────────────────────┘       │
└──────────────────────────────────────────────────────────────┘
```

| Component | Description |
|---|---|
| **Linux VM** | Alpine Linux with the production Kata 3.32 ARM64 kernel, 8 GiB rootfs |
| **VirtioFS mounts** | `/workspace` ↔ `~/.osaurus/container/workspace/`, `/output` ↔ `~/.osaurus/container/output/` |
| **NAT networking** | Container gets `10.0.2.15/24` via `VZNATNetworkDeviceAttachment` |
| **Vsock bridge** | Unix socket relayed via vsock connects the container to the host bridge |
| **Per-agent users** | Each agent gets a Linux user `agent-{name}` with home at `/workspace/agents/{name}/` |
| **Host API Bridge** | HTTP server on the host, accessible from the container via the `osaurus-host` CLI shim |

## VM configuration

**Management → Sandbox → Container → Resources:**

| Setting | Range | Default | Notes |
|---|---|---|---|
| CPUs | 1–8 | 2 | |
| Memory | 1–8 GB | 2 GB | |
| Network | `outbound` / `proxy` / `none` | outbound | `outbound` = unrestricted NAT; `proxy` = host-only network with a domain-allowlist egress proxy (selected automatically when the agent has Allowed Domains set); `none` = no networking |
| Per-Agent Environments | on / off | off | Experimental: boot from the provisioning agent's own copy-on-write clone of the base image |
| Auto-Start | on / off | on | Start VM when Osaurus launches |
| Rootfs | — | 8 GiB | Fixed |

With **Per-Agent Environments** on, system packages an agent installs with `apk` persist in its own clone and are invisible to other agents. The clone pool is LRU-bounded (default 3); evicted environments re-clone fresh from the pristine base template. Agent home directories live on the `/workspace` mount and are never affected by environment eviction or reset.

Changes require a container restart. Config file: `~/.osaurus/config/sandbox.json`:

```json
{
  "autoStart": true,
  "cpus": 2,
  "memoryGB": 2,
  "network": "outbound"
}
```

## Built-in tools

When the runtime is ready, sandbox-backed tools are registered automatically for the active custom agent. The public model-facing names are shared with trusted-folder mode; Osaurus routes them to the sandbox backend from the execution context. Read-only tools are always on. Write/exec/install/secret tools require `autonomous_exec.enabled`; `sandbox_plugin_register` additionally requires `autonomous_exec.pluginCreate`.

Before first setup, the agent receives only `sandbox_init_pending`. Calling it provisions the runtime and the agent environment, then activates the real tool schemas in the same run.

### Anti-confusion cheat sheet

Always prefer the dedicated tool over a shell command:

| Don't | Do |
|---|---|
| `cat`/`head`/`tail` in `shell_run` | `file_read` |
| `grep`/`rg`/`find`/`ls` in `shell_run` | `file_search` |
| `sed`/`awk` | `file_edit` |
| `echo`/heredoc | `file_write` |
| `&` / `nohup` / `disown` | `shell_run(background:true)` + `sandbox_process` |

Reserve `shell_run` for builds, processes, network calls, and work without a dedicated tool. For multi-step logic, write a script with `file_write` and run it with `shell_run` (for example, `python3 script.py`).

### Read-only (always available)

| Tool | Description |
|---|---|
| `file_read` | Read a file's contents or inspect a directory, with bounded ranges |
| `file_search` | Search contents or locate files by glob |

### Requires `autonomous_exec`

| Tool | Description |
|---|---|
| `file_write` | Create or overwrite a file |
| `file_edit` | Make an exact in-place edit |
| `shell_run` | Run a command. Foreground by default, or `background:true` for servers and long tasks when the agent's background-process setting is enabled |
| `sandbox_process` | Manage background jobs from `shell_run(background:true)` — poll, wait, or kill |
| `sandbox_install` | Install packages — `manager` selects `apk` (system, runs as root), `pip` (agent venv at `~/.venv/`), or `npm` (agent workspace at `~/.osaurus/node_workspace/`) |
| `sandbox_secret_check` | Check whether a secret exists (never reveals the value) |
| `sandbox_secret_set` | Store a secret directly (`value`) or prompt the user (omit `value`) |
| `sandbox_plugin_register` | Register an agent-created plugin (requires `pluginCreate`) |

`share_artifact` is a [global built-in](/agent-loop#sharing-artifacts) registered on `ToolRegistry`. It's available everywhere, not just in sandbox mode, so it doesn't appear in this sandbox-specific table.

Backend-specific names such as `sandbox_read_file`, `sandbox_search_files`, `sandbox_write_file`, and `sandbox_exec` are private adapters, not schemas shown to the model. Legacy discrete operations are expressed through the public tools above or a direct `shell_run` invocation.

### Install hardening

The three install managers share a hardening pipeline:

| Layer | Behavior |
|---|---|
| **Per-agent serialization** | `SandboxInstallLock` queues install ops behind each other per agent. apk's lock is container-wide so `manager:"apk"` installs serialize **globally across every agent**. npm/pip are per-agent and run concurrently across agents. |
| **Auto-recovery** | If the first attempt fails AND output matches a known stale-state signature (`Tracker "idealTree" already exists`, `EEXIST`, `ELOCKED`, `Could not install packages due to an OSError`, `ReadTimeoutError`, `temporary error`, `unable to lock database`), the tool runs cleanup and retries once. The result envelope sets `retried: true`. |
| **Cleanup actions** | npm: `rm -rf node_modules/.package-lock.json && npm cache clean --force`. pip: `pip cache purge`. apk: `apk update`. Same exec context as the install. |
| **Workspace isolation** | npm in `~/.osaurus/node_workspace/`; pip in agent's venv at `~/.venv/`; both bin/ on PATH from any cwd. |
| **Stable flags** | npm: `--no-audit --no-fund --no-update-notifier`. pip: `--disable-pip-version-check --no-input`. apk: `--no-cache`. |
| **Timeouts** | npm/pip: 240s. apk: 120s. |

### Result shape

Every sandbox tool returns a [ToolEnvelope](/tool-contract) JSON string. Success payloads:

- Read/inspect: `{path, content, size}` (+ optional `start_line`/`line_count`/`tail_lines`/`max_chars`)
- Search: `{pattern, target, path, matches}` — `target` is `"content"` or `"files"`
- Exec foreground: `{stdout, stderr, exit_code, cwd}`
- Exec background: `{pid, log_file, cwd, background:true}`
- Process management: `{pid, alive|exited|killed, log_file, log_tail, ...}`
- Install: `{installed, exit_code, output}` on success, plus `retried: true` when auto-recovery ran. Failures use `kind: execution_error` and may carry `cleanup_failed: true`.

Path failures use `kind: invalid_args` with `field` pointing at the offending argument so the model can self-correct. The path sanitizer returns structured rejection reasons (empty, traversal, null byte, dangerous character, outside allowed roots).

## Plugin recipes

Sandbox plugins are JSON recipes — no compiled dylibs, no Xcode, no code signing. They install dependencies, seed files, define custom tools, and configure secrets.

### Format

```json
{
  "name": "Python Data Tools",
  "description": "Data analysis toolkit with pandas and matplotlib",
  "version": "1.0.0",
  "author": "your-name",
  "dependencies": ["python3", "py3-pip"],
  "setup": "pip install --user pandas matplotlib seaborn",
  "files": {
    "helpers.py": "import pandas as pd\nimport matplotlib\nmatplotlib.use('Agg')\nimport matplotlib.pyplot as plt\n"
  },
  "tools": [
    {
      "id": "analyze_csv",
      "description": "Load a CSV file and return summary statistics",
      "parameters": {
        "file": { "type": "string", "description": "Path to the CSV file" }
      },
      "run": "cd $HOME/plugins/python-data-tools && python3 -c \"import pandas as pd; df = pd.read_csv('$PARAM_FILE'); print(df.describe().to_string())\""
    }
  ],
  "secrets": ["OPENAI_API_KEY"],
  "permissions": {
    "network": "outbound",
    "inference": true
  }
}
```

### Properties

| Property | Type | Required | Description |
|---|---|---|---|
| `name` | string | Yes | Display name |
| `description` | string | Yes | Brief description |
| `version` | string | No | Semantic version |
| `author` | string | No | Author name |
| `source` | string | No | Source URL (e.g. GitHub repo) |
| `dependencies` | string[] | No | System packages installed via `apk add` (root) |
| `setup` | string | No | Setup command run as the agent's Linux user |
| `files` | object | No | Files seeded into the plugin folder (key = relative path, value = contents) |
| `tools` | SandboxToolSpec[] | No | Custom tool definitions |
| `secrets` | string[] | No | Secret names the plugin requires (user prompted on install) |
| `permissions` | object | No | Network policy + inference access |

### Per-agent installation

Plugins install per agent. Each agent has its own plugin set, isolated under their workspace.

**Install flow:**

1. Validate plugin file paths (`SandboxPathSanitizer`)
2. Start container (if not running)
3. Create the agent's Linux user
4. Install system dependencies via `apk`
5. Create plugin directory and seed files via VirtioFS
6. Configure secrets from Keychain
7. Run the setup command
8. Register plugin tools

**Manage from Management → Sandbox → Plugins:**

- **Import** from JSON files, URLs, or GitHub repos
- **Create** with the built-in editor
- **Install** to specific agents
- **Export** and **duplicate** for sharing

### Plugin tools

Each tool in a plugin's `tools` array becomes an AI-callable tool. Tool name is `{pluginId}_{toolId}`. Parameters are passed as environment variables prefixed `PARAM_`:

| Parameter | Env var |
|---|---|
| `file` | `$PARAM_FILE` |
| `query` | `$PARAM_QUERY` |
| `output_format` | `$PARAM_OUTPUT_FORMAT` |

The `run` field is a shell command executed as the agent's Linux user with the working directory set to the plugin folder.

## Agent-authored plugins (Sandbox Plugin Creator)

Agents can author, package, and register new sandbox plugins at runtime. The model-facing guidance is injected when the agent has `pluginCreate` enabled and the sandbox is available.

Both the in-process `sandbox_plugin_register` tool and the host-API `POST /api/plugin/create` endpoint funnel through one shared registration pipeline (`SandboxPluginRegistration.register`) so they cannot drift.

**Requirements:**

- `autonomousExec.enabled = true` on the agent
- `autonomousExec.pluginCreate = true` (the default)
- The sandbox running

**Workflow:**

1. Agent writes script files to `~/plugins/{plugin-id}/scripts/`
2. Agent writes a `plugin.json` manifest defining name, description, tools, dependencies
3. Agent calls `sandbox_plugin_register` with the `plugin_id` (or `POST /api/plugin/create`)
4. Pipeline validates, applies restricted defaults, persists, runs install, hot-registers tools via `CapabilityLoadBuffer`
5. Toast notifies the user with a **Remove** action

**File auto-packaging:** `sandbox_plugin_register` recursively collects every UTF-8 readable file in the plugin directory (excluding `plugin.json`) and merges them into the plugin's `files` map. Files explicitly defined in `plugin.json` take precedence. **Binary files are rejected up front** — text-only.

**Restricted defaults (`SandboxPluginDefaults`):**

- **`permissions.network`** — Wildcards (`outbound`) collapse to `none`. Comma-separated domain lists are accepted only when every entry parses as a valid domain. Plan ahead — declare exact API hostnames.
- **`permissions.inference`** — Forced to `false`. Agent-authored plugins cannot call inference APIs.
- **`metadata.created_by`** stamped to `agent`; **`metadata.created_via`** records `agent_tool` or `host_bridge`.

**Validation:** Rejected up front (no library state written) when:

- File paths fail `SandboxPathSanitizer.validatePluginFiles`
- The `setup` command references a host outside `SandboxNetworkPolicy.setupAllowlist`
- Any tool's `run` command references a host outside the same allowlist
- A declared `secrets` entry has no value in `AgentSecretsKeychain` for the requesting agent
- The agent exceeds `SandboxRateLimiter` quota for `service: "http"`
- The container is not running (`unavailable` → HTTP 503)

**Persistence:** Plugins saved to `SandboxPluginLibrary` (`~/.osaurus/sandbox-plugins/`) survive restarts. Per-agent install state lives at `~/.osaurus/agents/{agent-id}/sandbox-plugins/installed.json`.

## Host API Bridge

Inside the container, the `osaurus-host` CLI talks to the bridge server over a vsock-relayed Unix socket.

| Command | Description |
|---|---|
| `osaurus-host secrets get <name>` | Read a secret from macOS Keychain |
| `osaurus-host config get <key>` | Read a plugin config value |
| `osaurus-host config set <key> <value>` | Write a plugin config value |
| `osaurus-host inference chat -m <message>` | Run a chat completion through Osaurus |
| `osaurus-host agent dispatch <id> <task>` | Dispatch a task to an agent |
| `osaurus-host agent memory query <text>` | Search agent memory |
| `osaurus-host agent memory store <text>` | Store a memory entry |
| `osaurus-host events emit <type> [payload]` | Emit a cross-plugin event |
| `osaurus-host plugin create` | Create a plugin from stdin JSON |
| `osaurus-host log <message>` | Append to the sandbox log buffer |

### Bridge authentication

Every request authenticates with a per-agent bearer token:

- The host mints a 256-bit token per agent and writes it to `/run/osaurus/.token` inside the guest, mode `0600`, owned by that agent's Linux user. The directory is mode `0711` so users open their own file by name without enumerating siblings.
- The `osaurus-host` shim reads the token (allowed by uid) and sends it as `Authorization: Bearer <token>`. Refuses to run if the token file is missing or unreadable.
- The bridge resolves the token to an `(agentId, linuxName)` pair via `SandboxBridgeTokenStore`. Unknown or missing tokens get `401` — no fallback to a default agent.
- `X-Osaurus-User` is no longer trusted. Identity is bound to the token, which is bound to a Linux uid by file permissions inside the guest.
- `X-Osaurus-Plugin` is still self-reported by the shim. It namespaces config and secrets within an agent but is not a security boundary between plugins of the same agent.

The `agent dispatch` route rejects any body whose `agent_id` doesn't match the token-bound identity (`403`); `agent memory query` filters results to the calling agent's pinned facts.

Tokens are revoked when the agent is unprovisioned or the container is stopped, and re-minted on the next `ensureProvisioned`. After an Osaurus upgrade, plugin bridge calls fail closed until the container restarts and the new shim/token files are written — this happens automatically when Sparkle relaunches the app.

### Request size limits

Bridge requests are capped at **8 MiB** per body. Oversized requests are rejected with `413 Payload Too Large` before reaching any handler. Combined with the public HTTP server's pre-auth caps (32 MiB generic, 64 KiB on `/pair`), this prevents an unauthenticated client from forcing unbounded memory allocation.

## Secret management

Agents check for and store secrets via `sandbox_secret_check` and `sandbox_secret_set`. Secrets are stored in the macOS Keychain, scoped per agent.

### Two storage paths

| Path | When | How |
|---|---|---|
| **Direct** | Agent already has the value (e.g. via Host API or Telegram bot) | Pass `value` to `sandbox_secret_set` |
| **Prompt** | Agent needs the user to provide the value (Chat) | Omit `value` — a `SecureField` overlay appears |

The prompt path keeps secret values out of conversation history and LLM context entirely. The execution loop pauses via `withCheckedContinuation` until the user submits or cancels.

### Prompt flow

1. Agent calls `sandbox_secret_set` without `value`
2. Tool returns a `secret_prompt` marker (JSON with key, description, instructions)
3. Chat execution loop intercepts and shows `SecretPromptOverlay`
4. User enters secret in `SecureField` and submits (or cancels)
5. Value stored in Keychain; tool result rewritten to `{"stored": true, "key": "..."}` (or cancelled)
6. Execution resumes with the sanitized result — the LLM never sees the secret

`SecretPromptState` tracks a `resolved` flag so `submit()` and `cancel()` are idempotent. `onDisappear` calls `cancel()` as a safety net.

### Secret containment

Storing a secret is only half the problem — the other half is keeping its **value** out of model context and every persisted record afterwards:

- **Output scrubbing.** Agent secrets are injected into the exec environment, so `echo $KEY` would otherwise land the value in the model's context. `SecretScrubber` rewrites every known secret value in `shell_run` stdout/stderr, background-job log tails, and sandbox-plugin tool output to `[REDACTED:<ENV_KEY>]` before the result is enveloped. Longer values scrub first (substring-safe); values under 6 characters are exempt to avoid false positives.
- **Argument redaction (fail-closed).** When the agent uses the direct `value` path of `sandbox_secret_set`, execution receives the original arguments but every *recorded* surface receives a secret-safe representation instead: chat and HTTP agent-run history, plugin events and streamed deltas, approval prompts, debug logs, Insights records, and remote-provider wire snapshots. The exact value is also redacted from any sibling string field it was duplicated into, and malformed or ambiguous secret payloads collapse to a minimal redacted object rather than re-emitting uncertain input. The prompt path never carries the value through the model at all and remains the recommended flow.

## Security

### Path sanitization

All file paths from tool arguments are validated by `SandboxPathSanitizer` before any container execution. Directory traversal (`..`) is rejected; paths are resolved relative to the agent's home directory.

### Per-agent isolation

Each agent runs as a separate Linux user (`agent-{name}`). Standard Unix permissions prevent agents from accessing each other's files and processes.

The guest runs with a restricted OCI capability set and `noNewPrivileges`, so child processes cannot gain new privileges through setuid binaries or file capabilities. The Seatbelt fallback uses a tightened deny-by-default profile as well.

### Network policy

Container networking has three modes:

- **`outbound`** — unrestricted NAT internet access (the default, and an explicit user choice)
- **`proxy`** — the VM boots on a **host-only** network with no NAT. All egress goes through a filtering HTTP/HTTPS CONNECT proxy on the host. This mode is selected automatically when the provisioning agent has a non-empty **Allowed Domains** list in its Agent settings.
- **`none`** — no guest networking at all

In proxy mode, enforcement is per-connection and per-agent: the requested hostname must match the agent's resolved allowlist (its own Allowed Domains plus the domains declared by its installed plugins). Patterns are `example.com` (exact) or `*.example.com` (subdomains, not the apex). IP literals are rejected outright, and resolved addresses are re-checked on the host — names resolving to loopback, private, link-local, or reserved space are refused (DNS-rebinding defense). Known limitation: the guest can still reach the proxy gateway address itself; everything beyond it is blocked by the host-only network.

Plugins declare their own network requirements in `permissions`; declarations are validated at install, reinstall, and repair time and feed the runtime allowlist.

### Rate limiting

- `SandboxExecLimiter` — caps commands an agent runs per turn
- `SandboxRateLimiter` — general rate limiting for sandbox ops and bridge calls

### Artifact integrity

Every external artifact the sandbox depends on is pinned to an immutable digest, and downloaded blobs are verified before they touch the on-disk store.

| Artifact | Pin |
|---|---|
| GHCR image (`ghcr.io/osaurus-ai/sandbox`) | Multi-arch index digest (`@sha256:...`); `:latest` tag never used at runtime |
| Kata kernel tarball | SHA-256 verified after download against an in-source constant |
| Initfs blob | SHA-256 verified after download against an in-source constant |

A digest mismatch is **fail-closed**: temp file deleted, no silent fallback to alternate mirrors, provisioning aborts with `SandboxError.integrityCheckFailed`. Hashing is bounded at 512 MiB.

## Diagnostics

**Management → Sandbox → Container → Run Diagnostics:**

| Check | Verifies |
|---|---|
| Exec | Can execute commands in the container |
| NAT | Outbound network connectivity |
| Agent User | Agent's Linux user exists and can run commands |
| APK | Package manager is functional |
| Vsock Bridge | Host API bridge is reachable from the container |

## Container management

| Action | Description |
|---|---|
| **Start** | Boot the container (provisions first if needed) |
| **Stop** | Gracefully shut down |
| **Reset** | Remove and re-provision. Agent workspaces preserved (they live in VirtioFS-mounted `/workspace`). |
| **Remove** | Delete container + kernel + initfs. Workspaces preserved. |

Find these under **Container → Danger Zone**.

## Storage paths

| Path | Description |
|---|---|
| `~/.osaurus/container/` | Container root |
| `~/.osaurus/container/kernel/vmlinux` | Linux kernel |
| `~/.osaurus/container/initfs.ext4` | Initial filesystem |
| `~/.osaurus/container/workspace/` | Mounted as `/workspace` in the VM |
| `~/.osaurus/container/workspace/agents/{name}/` | Per-agent home |
| `~/.osaurus/container/output/` | Mounted as `/output` |
| `~/.osaurus/sandbox-plugins/` | Plugin library (JSON recipes) |
| `~/.osaurus/agents/{agentId}/sandbox-plugins/installed.json` | Per-agent installed plugin records |
| `~/.osaurus/config/sandbox.json` | Sandbox configuration |
| `~/.osaurus/config/sandbox-agent-map.json` | Linux username → agent UUID mapping |

---

**Related:**

- [Tasks](/agent-loop) — the everyday view
- [Tool Contract](/tool-contract) — envelope shape for every tool
- [Plugin Authoring](/plugin-authoring) — non-sandbox v1/v2 plugins
- [Identity Cryptography](/identity-internals) — how the bridge token, body limits, and pre-auth gating fit together

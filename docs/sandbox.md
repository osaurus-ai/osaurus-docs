---
title: Sandbox Internals
sidebar_label: Sandbox Internals
description: One Linux container per agent inside the sandbox VM, the Sandbox settings, the 1.0 rebuild, workflow environments, the host bridge, plugin recipes, security posture, and tool inventory.
---

# Sandbox Internals

This page is for plugin authors, contributors, and anyone who wants to know exactly how the [Sandbox](/glossary#sandbox) keeps agent code off your Mac.

The Sandbox runs agent code in an isolated environment with full dev capabilities — shell, Python, Node, compilers, package managers. On **macOS 26+** it's a Linux VM (Alpine, Apple's Containerization framework) running natively on Apple Silicon, with **one container per agent** inside it. On **macOS 15** it falls back to a native Seatbelt backend so sandboxed execution works everywhere.

:::tip[Sandbox security at a glance]
A container per agent with its own filesystem, processes, and Linux user; a host bridge with per-agent bearer tokens; per-agent network policy; SHA-256-pinned runtime artifacts. Plain-language summary on [Security & Privacy](/security).
:::

For the everyday view of agents running commands, see [Working in Chat](/agent-loop).

## Requirements

- **macOS 26 (Tahoe)** or later for the Linux VM backend (Apple's Containerization framework)
- **Apple Silicon** (M1 or newer)
- On earlier macOS, the sandbox automatically uses the [Seatbelt fallback](#seatbelt-fallback-macos-15) — no VM, no download

## Seatbelt fallback (macOS 15)

On Macs that can't run the Containerization VM, commands run as regular host processes confined by a deny-by-default Seatbelt profile (`sandbox-exec`): they can read the system but can only write inside the sandbox workspace (`~/.osaurus/container/workspace/`, seen by agents as `/workspace`) and a scratch temp directory. Each agent's profile grants only its own home, `shared/`, and a per-agent scratch directory. The backend is chosen once at launch — macOS 26+ always uses the VM, older systems always use Seatbelt.

Everything on this page applies to both backends unless noted. The differences:

| | Linux VM (macOS 26+) | Seatbelt (earlier) |
|---|---|---|
| Environment | Alpine Linux, full userland | macOS, BSD userland |
| Package managers | `pip`, `npm`, `apk` | `pip`, `npm` (no `apk`) |
| Tool recipe `dependencies` | Supported | Not supported — install via `setup` with pip/npm |
| Network policy | Off, on, or per-domain allowlist | All-or-nothing. A domain allowlist can't be enforced and fails closed to no network. An open agent still can't reach the Mac's `localhost` |
| Isolation boundary | Hardware VM, a container per agent | Process-level write confinement. Reads of the host are not blocked |
| Per-agent environment | Own container, rootfs clone, and Linux user | Shared workspace tree with per-agent home directories |
| Sandboxed MCP servers | Supported | Not supported — set the provider's Run in to Host |
| Resource settings | CPUs, Memory, Agents Kept Warm, Environments Kept on Disk, Stop When Idle | None (host processes) |
| Provisioning | Kernel + rootfs download (~1 min) | Instant, no download |

Two Seatbelt behavioral notes: denied file lookups surface as "No such file or directory" rather than "Operation not permitted" (deliberate macOS anti-probing behavior), and `~` inside sandboxed commands resolves to the agent's workspace home, not your macOS home.

## Setting it up

Most people never open the Sandbox page. On Macs that run the VM, the runtime downloads quietly in the background after onboarding (the VM doesn't start). The first custom-agent chat that needs to run a command starts the sandbox, and the chat shows **Preparing sandbox** with progress in that turn. Stopping the chat during first-time setup cancels it; downloads resume next time.

To set it up ahead of time, open **Settings → Developer Tools → Sandbox** and click **Set Up Sandbox**.

Until setup finishes, the agent receives only the transient `sandbox_init_pending` tool. Calling it waits for provisioning and, on success, adds the real sandbox schemas to the next model step in the same run. A startup failure returns an actionable `unavailable` envelope instead of requiring a blind retry.

Sandbox execution defaults **on for every new custom agent** on supported Macs, while preserving explicit opt-outs through duplicate, export, and relaunch. The [Orchestrator](/orchestrator) and other built-in agents never get it.

Workspace tools like `shell_run` and `file_*` keep the same name in every execution mode, so tool approval cards show a **Runs in** notice resolved per call: inside the agent's sandbox container, directly on this Mac (when the agent works in a [Working Folder](/glossary#working-folder) with the sandbox off), or on a remote MCP server. A chat uses either a folder or the sandbox, never both: while an agent's sandbox is on, its chats ignore their working folder, and picking a folder in a chat or project turns that agent's sandbox off.

### Upgrading to 1.0

The first start after updating to 1.0 rebuilds the sandbox for the one-container-per-agent layout:

- It downloads a new init filesystem (about 64 MiB, so it needs a connection) and builds per-agent environments, briefly using about 8 GiB of extra disk.
- Packages installed inside the old sandbox (`apk`, `pip`, `npm`) must be reinstalled.
- Files in the sandbox workspace are kept. Loose files at the workspace root move to `shared/` (`legacy-workspace-root/` on a name collision).
- If that first start fails, the old sandbox disk is kept so it can be retried.

## The Sandbox page

**Settings → Developer Tools → Sandbox** has these sections:

| Section | What's there |
|---|---|
| **Overview** | Status (running, stopped, not provisioned, error), what it runs on, uptime, CPU load, memory, workspace size, processes, and agents. **Start**, **Stop**, **Restart**, or **Try Again**, plus **Copy Details** and **Open Troubleshooting** after a failure. When another app holds the VM, it says which. |
| **Settings** | The controls below. |
| **Agents & Environments** | One row per agent environment (and **Workflow environment** / **Unused environment** rows): its Linux user, network, package count, disk use, and when it was last used, with **Open in Finder** and, for agents, **Reset…**. |
| **Troubleshooting** | Collapsed. **Last Failure**, **Provisioning Preflight** (**Run**, **Copy JSON**), **Run Diagnostics**, and **Logs**. |
| **Danger Zone** | **Reset Sandbox** and **Remove Sandbox**. Both keep every agent's home folder and the shared folder. |

### Settings

| Setting | Range | Default | What it does |
|---|---|---|---|
| **CPUs** | 1–8 | 2 | Cores the VM can use. Warns when it could crowd out the rest of the Mac |
| **Memory** | 1–8 GB | 2 GB | Memory the VM can use, shared by every agent's container (also each container's cap). While the sandbox runs, it is taken out of the Server's Memory Safety model-load budget |
| **Agents Kept Warm** | 1–8 | 4, 6, or 8 (scaled to the Mac's memory: under 16 GB, under 32 GB, or more) | How many agents and workflows keep their own container running at once |
| **Environments Kept on Disk** | 1–64 | 16 | How many agent and workflow environments, with their `apk` packages, stay between runs. Never fewer than Agents Kept Warm |
| **Stop When Idle** | 0–240 min | 0 | Stop the sandbox after this many minutes with nothing running, to free its memory. A connected sandboxed MCP server counts as running. 0 keeps it running |
| **Network** | read-only | — | Shows **Open**, **Filtered per agent**, or **Off** for the current pod. Each agent's own settings decide it ([Network policy](#network-policy)) |
| **Auto-Start** | on / off | on | Start the sandbox when Osaurus launches. When off, it starts the first time an agent runs a command |
| **Workspace** | — | — | **Open in Finder** for `~/.osaurus/container/workspace/` |

CPU, memory, Agents Kept Warm, Environments Kept on Disk, and Stop When Idle changes take effect with **Restart to Apply** (or **Save** while the sandbox is stopped). The resource settings are hidden on the Seatbelt backend.

Config file: `~/.osaurus/config/sandbox.json`:

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

`maxAgentEnvironments` is Agents Kept Warm, `maxRetainedEnvironments` is Environments Kept on Disk, and `idleShutdownMinutes` is Stop When Idle. A file from before 1.0 that still has the old default of `3` for `maxAgentEnvironments` (and no `maxRetainedEnvironments`) moves to the memory-scaled default. The `network` and `allowedDomains` keys are legacy: they still decode but are unused.

### Per-agent settings

Each custom agent's sandbox options are under **Settings → Agents →** the agent **→ Abilities → Sandbox**:

- **Sandbox Network** on or off, and optional **Allowed Domains** — the agent's network policy.
- **Plugin Creation** — whether the agent may write and register its own [sandbox plugins](#agent-authored-plugins).
- **Execution → Code Can Use Osaurus** (off by default) — whether code in the agent's sandbox may run model completions, start agent tasks, or register plugins through the [host bridge](#host-api-bridge).
- **Keys** — the [Vault](/vault) keys the agent's code can read, its own values next to the shared ones, with **Open Vault** and **Add Key**.

## Architecture

```
┌───────────────────────────────────────────────────────────────────┐
│                           macOS Host                              │
│                                                                   │
│  ┌──────────────┐   ┌───────────────────────────────────────────┐ │
│  │   Osaurus    │   │  Linux VM (LinuxPod)                      │ │
│  │              │   │                                           │ │
│  │  SandboxMgr ─┼───┤→ container agent-alice                    │ │
│  │              │   │    /workspace/agents/alice  (VirtioFS)    │ │
│  │  HostAPI  ←──┼─vsock─→ /tmp/osaurus-bridge.sock (alice only) │ │
│  │  Bridge      │   │    /workspace/shared        (VirtioFS)    │ │
│  │              │   │→ container agent-bob  (same shape)        │ │
│  │  ToolReg  ←──┼───┤→ container osaurus-system (no workspace)  │ │
│  └──────────────┘   └───────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────┘
```

| Component | Description |
|---|---|
| **Linux VM** | Alpine Linux with the Kata Containers 3.32.0 production ARM64 kernel, 8 GiB root filesystem |
| **Pod** | One VM holding a container per agent plus a system container. Each agent container boots its own copy-on-write clone of the base image and has its own mount, PID, IPC, and UTS namespaces |
| **VirtioFS mounts** | An agent container mounts only `~/.osaurus/container/workspace/agents/{name}/` at `/workspace/agents/{name}` and `workspace/shared/` at `/workspace/shared`. The `osaurus-host` shim is a read-only file mount. The workspace root itself is never mounted |
| **Networking** | A vmnet interface shared by the pod: NAT when every member is open, host-only plus a filtering egress proxy when members differ, absent when every member is off |
| **Vsock bridge** | One Unix socket per container (`/tmp/osaurus-bridge.sock` inside it), relayed via vsock to the host bridge. Each socket accepts only its own agent's token |
| **Per-agent users** | Each agent gets a Linux user `agent-{name}` with home at `/workspace/agents/{name}/`, in its own container |
| **System container** | `osaurus-system`: no workspace mounts. Runs the network readiness probe, VM metrics, and diagnostics |
| **Host API Bridge** | HTTP server on the host, reached from the container through the `osaurus-host` CLI shim |

### Rootfs templates and copy-on-write boots

The first cold boot unpacks the pinned OCI image into an 8 GiB ext4 image that becomes the immutable **base template** (`~/.osaurus/container/templates/`, keyed by image digest and rootfs format version). Every container in the pod boots its own APFS `clonefile` of it — an instant, block-sharing copy. Templates are never booted or mutated; a pod that won't boot from its clones falls back once to a full unpack. Templates and environments are excluded from Time Machine.

Templates and environments are keyed by the rootfs format, not the Containerization SDK version. An SDK bump re-pulls only the ~64 MiB `vminit` initfs; existing environments stay warm.

### Agent environments and pod membership

Each agent's container boots from the agent's own clone of the template (`~/.osaurus/container/environments/<agent>/rootfs.ext4`). System packages an agent installs with `apk` persist there and are invisible to other agents. Agent home directories live on the VirtioFS workspace and are never affected by environment eviction or reset.

Virtualization.framework can't add a device to a running VM, so the set of containers is fixed when the VM boots. Each boot includes the agent that asked for the sandbox and the most recently used others, up to **Agents Kept Warm**. When another agent needs the sandbox, Osaurus restarts the VM with that agent included: it waits (up to two minutes) for other agents' running commands, background jobs, and MCP requests, and never stops them. Queued tasks wait as *sandbox busy*; anything else gets a *sandbox is busy* error to try again. The warm reboot itself takes well under a second plus guest setup. Long-lived processes such as stdio MCP servers restart with it.

Clones beyond **Environments Kept on Disk** are evicted least recently used first, after each successful boot, and re-clone fresh on next use. Approximate cost per extra agent: about 0.06 s of boot time, about 60 MB of host memory for a light workload (the VM's Memory setting caps the total), and no extra disk until the agent's clone diverges from the template.

**Reset…** on an agent's row in **Agents & Environments** resets that agent's environment: it removes `apk` packages and other changes outside the agent's home folder, and restarts the sandbox if that agent is running. When setup fails because a disk is full, the error says which: the Mac's disk, or the agent's environment.

### Workflow environments

Every [workflow](/workflows) runs its shell steps and Python code steps in a sandbox identity of its own instead of on the host, whether or not it declares **dependencies** (`dependencies: [{manager: pip|npm|apk, packages, binaries}]`). Dependencies are what get installed into that identity. It reuses the agent layout:

| | Agent | Workflow |
|---|---|---|
| Linux user | `agent-<name>` | `agent-wf-<template id>` |
| Home | `/workspace/agents/<name>` | `/workspace/agents/wf-<template id>` |
| PATH injection | `~/.venv/bin`, `~/.osaurus/node_workspace/node_modules/.bin` | same |
| Enabled by | the agent's sandbox settings | the workflow itself |

Environments are keyed by **template id**, so one environment follows a workflow from its first Architect test run through install and every run. Before each run Osaurus provisions the user, installs each manager's packages, checks every declared binary with `command -v`, and writes `.osaurus-environment.json` in the home. Workflow setup reads that manifest to show **installed / not installed / stale / unsupported here** without booting the VM; `apk` dependencies are unsupported on Seatbelt.

At run time the run workspace sits under the environment's home (`…/wf-<id>/runs/<run id>`), so the host and the VM see one directory. A shell step sees only that run workspace, not folders picked for the run; host file steps can still use picked folders. A shell step that exits 127 or 126 fails with `command_not_found`. Workflow environments count toward Agents Kept Warm and Environments Kept on Disk. Uninstalling the workflow removes its home, manifest, and Linux user. [Reset Sandbox](#container-management) marks every workflow environment as needing its packages installed again.

## SOUL.md

Every sandboxed agent gets a `SOUL.md` at `~/SOUL.md` in its home (host path `~/.osaurus/container/workspace/agents/{name}/SOUL.md`): a place for the agent to record stable preferences it learns about working with you. It's seeded on first provision (never overwriting an existing file), read on every sandbox-mode chat compose (capped at 8 KB on a line boundary), and emitted as a `## SOUL` section below the agent's instructions, which win on conflict. Edits apply from the next session so the cached prompt stays stable. Delete the file to reset it.

## Built-in tools

When the sandbox is ready, sandbox tools are registered as one process-wide runtime surface. Every call resolves the requesting agent from its chat or task execution context, so concurrent agent runs keep their own container, Linux user, home, config, secrets, package manifest, and plugin scope. Calls without an authorized request context fail closed.

The model sees the same five workspace names as folder mode (`file_read`, `file_search`, `file_write`, `file_edit`, `shell_run`) plus enabled control-plane tools such as `sandbox_install` and `sandbox_plugin_register`. Read-only tools are always on. Write, exec, install, and secret tools require `autonomous_exec.enabled`; `sandbox_plugin_register` additionally requires `autonomous_exec.pluginCreate`.

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
| `file_read` | Read a file's contents or list a directory (a structured `kind: "listing"` envelope), with bounded ranges |
| `file_search` | Search contents or locate files by glob |

### Requires `autonomous_exec`

| Tool | Description |
|---|---|
| `file_write` | Create or overwrite a file |
| `file_edit` | Make an exact in-place edit |
| `shell_run` | Run a command. Foreground by default, or `background:true` for servers and long tasks when the agent's background-process setting is enabled. Output streams live into the chat's tool card, with a **Terminate** button |
| `sandbox_process` | Manage background jobs from `shell_run(background:true)` — poll, wait, or kill |
| `sandbox_install` | Install packages — `manager` selects `apk` (system, runs as root, in the agent's own environment), `pip` (agent venv at `~/.venv/`), or `npm` (agent workspace at `~/.osaurus/node_workspace/`) |
| `sandbox_secret_check` | Check whether a secret exists (never reveals the value) |
| `sandbox_secret_set` | Store a secret directly (`value`) or prompt the user (omit `value`) |
| `sandbox_plugin_register` | Register an agent-created plugin (requires `pluginCreate`) |

`share_artifact` is a global built-in registered on `ToolRegistry`. It's available everywhere, not just in sandbox mode, so it doesn't appear in this table.

Backend-specific names such as `sandbox_read_file`, `sandbox_search_files`, `sandbox_write_file`, and `sandbox_exec` are private adapters, not schemas shown to the model.

`shell_run` has no wall-clock timeout by default. Its optional `timeout` is an inactivity ceiling that resets on every byte of output. Commands run with `set -o pipefail`.

### Install hardening

The three install managers share a hardening pipeline:

| Layer | Behavior |
|---|---|
| **Per-agent serialization** | `SandboxInstallLock` queues install ops behind each other per agent. apk installs also serialize globally across agents. npm/pip run concurrently across agents. |
| **Request validation** | Registry package names only (no URLs, `git+`/`file:` sources, paths, or archives; `@scope/name` is allowed), capped count and length, every argument POSIX-quoted. Malformed requests return `invalid_args`. |
| **Network preflight** | A disabled network returns a non-retryable `rejected` envelope; configured-but-unavailable egress returns retryable `unavailable`. |
| **Auto-recovery** | If the first attempt fails AND output matches a known stale-state signature (`Tracker "idealTree" already exists`, `EEXIST`, `ELOCKED`, `ReadTimeoutError`, `temporary error`, `unable to lock database`), the tool runs cleanup and retries once. The result envelope sets `retried: true`. |
| **Failure classification** | Package-not-found and malformed specifiers return `retryable:false` with `failure_class:"package_resolution"`. |
| **Cleanup actions** | npm: `rm -rf node_modules/.package-lock.json && npm cache clean --force`. pip: `pip cache purge`. apk: `apk update`. Same exec context as the install. |
| **Workspace isolation** | npm in `~/.osaurus/node_workspace/`; pip in the agent's venv at `~/.venv/`; both `bin/` on PATH from any cwd. |
| **Stable flags** | npm: `--no-audit --no-fund --no-update-notifier`. pip: `--disable-pip-version-check --no-input`. apk: `--no-cache`. |
| **Timeouts** | npm/pip: 240s. apk: 120s. |

Successful installs are recorded per agent in `~/.osaurus/agents/<uuid>/installed-packages.json`, and the next composed turn lists them in the system prompt so the model doesn't reinstall them.

### Result shape

Every sandbox tool returns a [ToolEnvelope](/tool-contract) JSON string. Success payloads:

- Read/inspect: `{path, content, size}` (+ optional `start_line`/`line_count`/`tail_lines`/`max_chars`)
- Search: `{pattern, target, path, matches}` — `target` is `"content"` or `"files"`
- Exec foreground: `{stdout, stderr, exit_code, cwd}`
- Exec background: `{pid, log_file, cwd, background:true}`
- Process management: `{pid, alive|exited|killed, log_file, log_tail, ...}`
- Install: `{installed, manager, exit_code, summary}` on success, plus `retried: true` when auto-recovery ran. Failures use `kind: execution_error` with `{manager, requested, retried, failure_class, exit_code}` and may carry `cleanup_failed: true`.

Path failures use `kind: invalid_args` with `field` pointing at the offending argument so the model can self-correct. The path sanitizer returns structured rejection reasons (empty, traversal, null byte, dangerous character, outside allowed roots). An inactivity kill is `kind: timeout`; a sandbox that isn't ready yet is `kind: unavailable`.

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
    "network": "api.openai.com"
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
| `dependencies` | string[] | No | System packages installed via `apk add` (root, in the agent's environment) |
| `setup` | string | No | Setup command run as the agent's Linux user |
| `files` | object | No | Files seeded into the plugin folder (key = relative path, value = contents) |
| `tools` | SandboxToolSpec[] | No | Custom tool definitions |
| `secrets` | string[] | No | Secret names the plugin requires, resolved through the [Vault](/vault) |
| `permissions` | object | No | `network` (domains the plugin needs, added to the agent's allowlist). `inference` is not honored; see **Code Can Use Osaurus** |

### Per-agent installation

Plugins install per agent, into that agent's own container and home. A recipe is installed on the agent's first invocation of one of its tools; there's no separate install step.

**Install flow:**

1. Validate plugin file paths (`SandboxPathSanitizer`)
2. Start the sandbox (if not running)
3. Create the agent's Linux user
4. Install system dependencies via `apk`
5. Create the plugin directory and seed files via VirtioFS
6. Configure secrets from the Vault (`PluginCredentials`)
7. Run the setup command
8. Register plugin tools

Registered recipes appear read-only under **Custom** in **Settings → Tools & MCP → All Tools**. There's no in-app recipe editor, importer, or exporter.

### Plugin tools

Each tool in a plugin's `tools` array becomes an AI-callable tool. Tool name is `{pluginId}_{toolId}`. Parameters are passed as environment variables prefixed `PARAM_`:

| Parameter | Env var |
|---|---|
| `file` | `$PARAM_FILE` |
| `query` | `$PARAM_QUERY` |
| `output_format` | `$PARAM_OUTPUT_FORMAT` |

The `run` field is a shell command executed as the agent's Linux user with the working directory set to the plugin folder.

## Agent-authored plugins

Agents can author, package, and register new sandbox plugins at runtime. The authoring recipe is injected into the system prompt as a `## Building new tools` section when the agent has **Plugin Creation** on and the sandbox is available.

Both the in-process `sandbox_plugin_register` tool and the host-API `POST /api/plugin/create` endpoint funnel through one shared registration pipeline (`SandboxPluginRegistration.register`) so they can't drift. `sandbox_plugin_register` asks the user first by default; the bridge endpoint additionally requires the agent's **Code Can Use Osaurus** setting.

**Requirements:**

- `autonomousExec.enabled = true` on the agent
- `autonomousExec.pluginCreate = true` (the default; shown as **Plugin Creation**)
- The sandbox running

**Workflow:**

1. Agent writes script files to `~/plugins/{plugin-id}/scripts/`
2. Agent writes a `plugin.json` manifest defining name, description, tools, dependencies
3. Agent calls `sandbox_plugin_register` with the `plugin_id` (or `POST /api/plugin/create`)
4. The pipeline validates, applies restricted defaults, persists, runs install, and hot-registers tools for the next model step
5. A toast notifies the user with a **Remove** action

**File auto-packaging:** `sandbox_plugin_register` recursively collects every UTF-8 readable file in the plugin directory (excluding `plugin.json`) and merges them into the plugin's `files` map. Files explicitly defined in `plugin.json` take precedence. **Binary files are rejected up front** — text-only.

**Restricted defaults (`SandboxPluginDefaults`):**

- **`permissions.network`** — Wildcards (`outbound`) collapse to `none`. Comma-separated domain lists are accepted only when every entry parses as a valid domain. Declare exact API hostnames.
- **`permissions.inference`** — Not honored. Whether sandbox code may call inference is the agent's **Code Can Use Osaurus** setting.
- **`metadata.created_by`** stamped to `agent`; **`metadata.created_via`** records `agent_tool` or `host_bridge`.

**Validation:** rejected up front (no library state written) when:

- File paths fail `SandboxPathSanitizer.validatePluginFiles`
- The `setup` command references a host outside `SandboxNetworkPolicy.setupAllowlist`
- Any tool's `run` command references a host outside the same allowlist
- A declared `secrets` entry has no value in the Vault for the requesting agent (its own value or the shared one)
- The agent exceeds `SandboxRateLimiter` quota for `service: "http"`
- The sandbox is not running (`unavailable` → HTTP 503)

**Persistence:** Plugins saved to `SandboxPluginLibrary` (`~/.osaurus/sandbox-plugins/`) survive restarts. Per-agent install state lives at `~/.osaurus/agents/{agent-id}/sandbox-plugins/installed.json`.

## Host API Bridge

Inside each container, the `osaurus-host` CLI talks to the bridge server over that container's vsock-relayed Unix socket.

| Command | Description |
|---|---|
| `osaurus-host secrets get <name>` | Read a Vault key marked **Agents Can Use This When Running Code** (the same values the agent's shell sees) |
| `osaurus-host config get <key>` | Read a plugin config value |
| `osaurus-host config set <key> <value>` | Write a plugin config value |
| `osaurus-host inference chat -m <message>` | Run a chat completion through Osaurus |
| `osaurus-host agent dispatch <id> <task>` | Dispatch a task to an agent |
| `osaurus-host agent memory query <text>` | Search agent memory |
| `osaurus-host agent memory store <text>` | Store a memory entry |
| `osaurus-host events emit <type> [payload]` | Emit a cross-plugin event |
| `osaurus-host plugin create` | Create a plugin from stdin JSON |
| `osaurus-host log <level> <message>` | Append to the sandbox log buffer (`debug`, `info`, `warn`, or `error`) |

`inference chat`, `agent dispatch`, and `plugin create` act as the agent on the host, so they're refused (`403`) unless the agent's **Code Can Use Osaurus** setting is on. A task started with `agent dispatch` runs as an external caller: tools that would ask first are refused instead of showing an approval card, and it never runs in a host folder.

### Bridge authentication

Every request authenticates with a per-agent bearer token:

- The host mints a 256-bit token per agent and writes it to `/run/osaurus/<linuxName>.token` inside that agent's container, mode `0600`, owned by the agent's Linux user. The directory is mode `0711`.
- The `osaurus-host` shim reads the token and sends it as `Authorization: Bearer <token>`. It refuses to run if the token file is missing or unreadable.
- The bridge resolves the token to an `(agentId, linuxName)` pair via `SandboxBridgeTokenStore`. Unknown or missing tokens get `401` — no fallback to a default agent.
- Each container has its own bridge socket, and the host listener for that socket accepts only its own agent's token (`403` otherwise).
- `X-Osaurus-Plugin` is self-reported by the shim. It namespaces config within an agent but isn't a security boundary between plugins of the same agent, so `secrets get` ignores it.

The `agent dispatch` route rejects any body whose `agent_id` doesn't match the token-bound identity (`403`); `agent memory query` filters results to the calling agent's pinned facts.

Tokens are revoked when the agent is unprovisioned or the sandbox stops, and re-minted on the next provision. After an Osaurus upgrade, bridge calls fail closed until the sandbox restarts and writes the new shim and token files; the Sandbox page shows **Security update is ready** with **Restart sandbox** until then.

### Request size limits

Bridge requests are capped at **8 MiB** per body. Oversized requests are rejected with `413 Payload Too Large` before reaching any handler. Combined with the public HTTP server's pre-auth caps (32 MiB generic, 64 KiB on the invite and pairing routes), this prevents an unauthenticated client from forcing unbounded memory allocation.

## Secret management

Agents check for and store secrets via `sandbox_secret_check` and `sandbox_secret_set`. Values are saved in the [Vault](/vault) as the agent's own keys. The sandbox environment is every shared key marked **Agents Can Use This When Running Code**, overlaid by the agent's own keys, so an agent's value replaces the shared one.

### Two storage paths

| Path | When | How |
|---|---|---|
| **Direct** | Agent already has the value (e.g. via Host API or a channel) | Pass `value` to `sandbox_secret_set`. Asks the user first by default, since a supplied value can replace a key the user saved |
| **Prompt** | Agent needs the user to provide the value (chat) | Omit `value` — a secure input overlay appears |

The prompt path keeps secret values out of conversation history and model context entirely. The execution loop pauses until the user submits or cancels.

### Prompt flow

1. Agent calls `sandbox_secret_set` without `value`
2. Tool returns a `secret_prompt` marker (JSON with key, description, instructions)
3. The chat execution loop intercepts it and shows `SecretPromptOverlay`
4. The user enters the secret and submits (or cancels)
5. The value is saved; the tool result is rewritten to `{"stored": true, "key": "..."}` (or cancelled)
6. Execution resumes with the sanitized result — the model never sees the secret

### Secret containment

- **Output scrubbing.** Agent secrets are injected into the exec environment, so `echo $KEY` would otherwise land the value in the model's context. `SecretScrubber` rewrites every known secret value in `shell_run` stdout/stderr, background-job log tails, and sandbox-plugin tool output to `[REDACTED:<ENV_KEY>]` before the result is enveloped. Longer values scrub first; values under 6 characters are exempt.
- **Credential scrubbing.** The agent's bridge token and egress-proxy credential are in every command's environment too, and are scrubbed the same way. The live terminal view of a running command and sandboxed MCP server streams are not scrubbed.
- **Argument redaction (fail-closed).** When the agent uses the direct `value` path, execution receives the original arguments but every *recorded* surface receives `value` → `[REDACTED]`: chat and HTTP agent-run history, plugin events and streamed deltas, approval prompts, logs, and Insights. Malformed secret payloads collapse to a minimal redacted object.

## Security

### Path sanitization

All file paths from tool arguments are validated by `SandboxPathSanitizer` before any container execution. Directory traversal (`..`) is rejected; paths are resolved relative to the agent's home directory. These checks are textual; inside the VM, the mount namespace is what actually confines an agent.

### Pod isolation

Unix file permissions don't separate agents on VirtioFS: Apple's VirtioFS server reports every file as owned by whichever guest user accesses it. Isolation comes from giving each agent its own container in a `LinuxPod`:

- An agent container mounts only its own home, `shared/`, and the read-only shim. Other agents' homes and the VirtioFS share root don't exist in its mount namespace.
- Root inside a container can't mount the VirtioFS share, can't write or remove the shim, and sees no other agent's processes (separate PID namespace) or Linux users (separate rootfs).
- `/proc` is mounted `hidepid=2`. Each agent's Linux user has its own UID (from 10000, kept in `~/.osaurus/config/sandbox-agent-uids.json`).
- Commands run as the agent are limited to 4096 processes and 65536 open files, and write no core files.
- The guest runs with a restricted capability set and `noNewPrivileges`.
- Everything the host reads, writes, or serves on an agent's behalf resolves through `SandboxAgentPathScope`: the agent's own home plus `/workspace/shared`. Symlinks are never followed out of that scope.
- `shared/` is visible to every agent, by design.

Residual risks, not separated today:

- **Network namespace.** Containers share the VM's network stack, so loopback ports and abstract Unix sockets are reachable across agents.
- **Kernel and VM resources.** All containers share one guest kernel and the VM's memory; agents together can pressure each other up to the VM size.
- **No seccomp filter.** The published `vminit` initfs ships no OCI runtime to apply one.
- **Membership restarts** stop every container, so another agent joining interrupts long-running work after the wait described [above](#agent-environments-and-pod-membership).

### Network policy

Network is set per agent (**Settings → Agents →** the agent **→ Abilities → Sandbox**): **Sandbox Network** on or off, and optional **Allowed Domains**. That gives each agent one of three policies: open, allowlist, or off. The VM-wide setting from earlier versions is gone.

The VM's network is a boot-time property shared by every container, so each boot composes it from the agents in the pod:

- **Every agent open** — shared NAT, every protocol (the default). The Sandbox page shows **Open**.
- **Every agent off** — no guest networking. Shows **Off**.
- **Anything else** — a **host-only** vmnet interface with no NAT, plus a filtering HTTP/HTTPS CONNECT proxy on the vmnet gateway. The proxy applies each caller's own policy: an open agent reaches any public host name, an allowlist agent only its domains, and an agent with network off nothing. Only proxy-aware HTTP(S) clients get out; SSH, raw TCP, and UDP are blocked for every agent. Shows **Filtered per agent**.

Workflow environments and diagnostics count as open when the pod's network is composed. Each Python step of a workflow gets its own proxy credential that reaches only the hosts the step declares in `network`, and none when it declares none. When a change to an agent's settings changes the composed network, the sandbox restarts once running commands finish; otherwise the proxy reads each policy per connection, so the change applies immediately.

Enforcement in the proxy:

- Guest processes receive `http_proxy`/`https_proxy` carrying the agent's credential; the proxy derives identity from it alone.
- An allowlist agent's hostname must match its resolved allowlist — the agent's own Allowed Domains plus the domains its installed plugins declare. Patterns are `example.com` (exact) or `*.example.com` (subdomains, not the apex).
- IP literals are rejected, and resolved addresses are re-checked on the host: names resolving to loopback, private, link-local, CGNAT, or reserved space are refused (DNS-rebinding defense). This applies to open agents in a filtered VM too, so they can't reach the LAN.
- Root setup commands (package installs) get a system credential limited to the package registries Osaurus uses.

**Known limitation:** in a filtered VM the guest can still reach the vmnet gateway address itself. Traffic beyond it is blocked by the host-only network.

### Rate limiting

- `SandboxExecLimiter` — caps commands an agent runs per turn
- `SandboxRateLimiter` — general rate limiting for sandbox ops and bridge calls

### Artifact integrity

Every external artifact the sandbox depends on is pinned to an immutable digest, and downloaded blobs are verified before they touch the on-disk store.

| Artifact | Pin |
|---|---|
| GHCR image (`ghcr.io/osaurus-ai/sandbox`) | Multi-arch index digest (`@sha256:...`); `:latest` is never used at runtime |
| Containerization SDK | Exact SwiftPM pin (0.54.0) |
| Kata kernel | Kata 3.32.0 production binary; the tarball and extracted kernel have pinned SHA-256 digests |
| vminit initfs | `vminit:0.54.0` OCI index pinned by digest; the locally built block's SHA-256 is recorded and re-checked before every boot |

A digest mismatch is **fail-closed**: temp file deleted, no silent fallback to alternate mirrors, provisioning aborts with `SandboxError.integrityCheckFailed`. Hashing is bounded at 768 MiB.

### Other known limitations

- **Working Folder host shell.** With a Working Folder attached, `shell_run` runs on the Mac, not in the sandbox.
- **Workflow storage.** Each workflow with Python or npm dependencies keeps its own environment, so disk use grows with installed workflows until they're uninstalled.
- **Python step limits.** A workflow's Python step is capped at 2 GB of address space by default and killed at its time limit.

## Troubleshooting

### Provisioning Preflight

**Settings → Developer Tools → Sandbox → Troubleshooting → Provisioning Preflight → Run** inspects the resolved Osaurus root, `sandbox.json`, cache and temp directories, the container workspace and agent/shared roots, kernel and initfs assets, the rootfs template or an agent environment, and the system container's bridge socket. Readiness is typed: `ready`, `needs_setup`, `blocked`, or `unproven`, with a code, severity, affected path, and repair suggestion per finding. **Copy JSON** produces a support artifact.

### Diagnostics

**Run Diagnostics** (same section):

| Check | Verifies |
|---|---|
| Exec | Can execute commands in the container |
| NAT | Outbound network connectivity |
| Agent User | Agent's Linux user exists and can run commands |
| APK | Package manager is functional |
| Vsock Bridge | Host API bridge is reachable from the container |

**Last Failure** shows the most recent startup or provisioning failure as one line, for example:

```
Last failure: agent_provision_failed · agent_provision.bootstrap_exec · sandbox_timeout · on_demand · warm · vm · 2 hr. ago
```

It reads from the local ring buffer `~/.osaurus/container/startup-failures.json` and uses the same closed tokens (category, phase, error class, trigger, cold/warm, backend) as the anonymous `sandbox_provision_failure` [telemetry](/telemetry) event — paste it into a bug report. No error message, path, or agent identity is stored in that file.

### One sandbox VM per Mac user

Only one process can run the sandbox VM at a time; every boot path holds an advisory lock (`$TMPDIR/osaurus-sandbox-vmnet-<uid>.lock`). When another process holds it, the agent's sandbox is unavailable, retries back off from 15 seconds to 5 minutes, and **Overview** names the holder. **Start**, **Try Again**, **Reset**, or **Remove** offers the fix: quit the other Osaurus app, or end the process holding the lock. In chat, a sandbox agent's input bar shows a **Sandbox unavailable** chip that opens the same fix.

## Container management

| Action | Where | Description |
|---|---|---|
| **Start** | Overview | Boot the sandbox (provisions first if needed) |
| **Stop** | Overview | Gracefully shut down. A deliberate stop is **not** auto-restarted: the sandbox stays down until you press **Start** or an agent's next command boots it. Only a sandbox that went away on its own (for example, after sleep/wake) is warm-restarted automatically |
| **Restart** | Overview | Stop and start again |
| **Reset…** (one agent) | Agents & Environments | Reset that agent's environment (`apk` packages and other changes outside its home) |
| **Reset Sandbox** | Danger Zone | Delete the Linux system and every agent's environment, including `apk` packages, then download the runtime and set up again. Kept: every agent's home folder (files, `SOUL.md`, pip and npm packages) and the shared folder. Workflows with dependencies ask to install them again |
| **Remove Sandbox** | Danger Zone | Stop the sandbox and delete the Linux system, every environment, and the downloaded runtime to free disk space. Home folders and the shared folder are kept. Agents can't run commands until you set it up again |

## Storage paths

| Path | Description |
|---|---|
| `~/.osaurus/container/` | Container root |
| `~/.osaurus/container/kernel/vmlinux` | Linux kernel |
| `~/.osaurus/container/initfs.ext4` | Initial filesystem |
| `~/.osaurus/container/templates/` | Immutable base rootfs template |
| `~/.osaurus/container/environments/{name}/` | Per-agent (and `osaurus-system`) rootfs clone |
| `~/.osaurus/container/workspace/` | Host workspace. Its `agents/{name}/` and `shared/` are mounted into the matching containers; the root itself is never mounted |
| `~/.osaurus/container/workspace/agents/{name}/` | Per-agent home, mounted at `/workspace/agents/{name}` |
| `~/.osaurus/container/workspace/agents/{name}/SOUL.md` | Per-agent SOUL file |
| `~/.osaurus/container/workspace/agents/wf-{templateId}/` | A workflow's environment (venv, npm workspace, `runs/{runId}` workspaces, `.osaurus-environment.json`) |
| `~/.osaurus/container/workspace/shared/` | Mounted at `/workspace/shared` in every agent container |
| `~/.osaurus/container/shim/osaurus-host` | Host bridge shim, mounted read-only into every container |
| `$TMPDIR/osb-{rootHash}/` | Per-container host bridge sockets |
| `~/.osaurus/container/startup-metrics.json` | Local boot phase timings |
| `~/.osaurus/container/startup-failures.json` | Recent startup / provisioning failure tokens shown in Troubleshooting |
| `~/.osaurus/sandbox-plugins/` | Plugin library (JSON recipes) |
| `~/.osaurus/agents/{agentId}/sandbox-plugins/installed.json` | Per-agent installed plugin records |
| `~/.osaurus/agents/{agentId}/installed-packages.json` | Per-agent installed package record |
| `~/.osaurus/config/sandbox.json` | Sandbox configuration |
| `~/.osaurus/config/sandbox-agent-map.json` | Linux username → agent UUID mapping |
| `~/.osaurus/config/sandbox-agent-uids.json` | Linux username → guest UID |

---

**Related:**

- [Working in Chat](/agent-loop) — the everyday view of agents running commands
- [Workflows](/workflows) — what runs in workflow environments
- [Tool Contract](/tool-contract) — envelope shape for every tool
- [Plugin Authoring](/plugin-authoring) — native (non-sandbox) plugins
- [Identity Cryptography](/identity-internals) — how the bridge token, body limits, and pre-auth gating fit together

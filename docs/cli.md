---
title: CLI
sidebar_label: CLI
description: Command-line control of the Osaurus server, models, MCP, and plugins.
---

# CLI

The Osaurus CLI controls your local LLM server, MCP tools, and models from the terminal.

## Quick Start

```bash
# Start the server
osaurus serve

# Open the UI
osaurus ui

# Check status
osaurus status

# Diagnose a broken install
osaurus doctor

# Download a model, then chat with it
osaurus pull mlx-community/Llama-3.2-1B-4bit
osaurus run gemma-4-e2b-it-4bit
```

## Installation

The CLI ships inside the Osaurus application bundle. The Homebrew cask links it automatically and owns that link.

### Manual Setup

If the `osaurus` command is not found after installation:

```bash
cli="/Applications/Osaurus.app/Contents/Helpers/osaurus"
[ -x "$cli" ] || cli="/Applications/Osaurus.app/Contents/MacOS/osaurus"

# Prefer /usr/local/bin; fall back without sudo.
bin="/usr/local/bin"
if [ ! -d "$bin" ] || [ ! -w "$bin" ]; then
  bin="$HOME/.local/bin"
  mkdir -p "$bin"
fi
ln -sf "$cli" "$bin/osaurus"
```

Do not write into `$(brew --prefix)/bin` for a DMG install: Homebrew manages that directory. If the link uses `~/.local/bin`, add it to `PATH`. From a source checkout, `scripts/release/install_cli_symlink.sh --prefix <directory>` explicitly targets `<directory>/bin`; without `--prefix`, it follows the same `/usr/local/bin` then `~/.local/bin` order.

## Commands

### osaurus serve

Start the Osaurus server.

```bash
osaurus serve [options]
```

**Options:**

| Option         | Description                                | Default |
| -------------- | ------------------------------------------ | ------- |
| `--port`       | Server port number                         | 1337    |
| `--expose`     | Enable LAN access (bind to all interfaces) | false   |
| `--yes`, `-y`  | Skip the interactive security prompt that `--expose` shows | false |
| `--supervise`  | Keep the server alive — probe health and relaunch it whenever it goes down | false |
| `--interval`   | Health-probe interval in seconds (with `--supervise`) | 15 |

**Examples:**

```bash
# Default start (localhost:1337)
osaurus serve

# Custom port
osaurus serve --port 8080

# Enable LAN access
osaurus serve --expose

# Keep-alive loop that survives app quits and crashes
osaurus serve --supervise
```

:::tip[Environment Variable]
Set `OSU_PORT` to override the default port globally.
:::

#### Supervise mode

Plain `osaurus serve` is a one-shot command: it launches the app, starts the server, and exits. If the app later quits or crashes, nothing brings the server back.

`--supervise` never exits — it probes `/health` every `--interval` seconds and relaunches the server whenever it's down. Pair it with a `launchd` LaunchAgent for quit/crash/logout/reboot resilience:

```xml
<!-- ~/Library/LaunchAgents/ai.osaurus.serve.plist -->
<dict>
  <key>Label</key>            <string>ai.osaurus.serve</string>
  <key>ProgramArguments</key> <array>
      <string>/opt/homebrew/bin/osaurus</string>
      <string>serve</string><string>--supervise</string>
  </array>
  <key>RunAtLoad</key> <true/>
  <key>KeepAlive</key> <true/>
</dict>
```

### osaurus stop

Stop the running Osaurus server.

```bash
osaurus stop
```

### osaurus status

Check whether the server is running.

```bash
osaurus status
```

**Example output:**

```
running (port 1337)
```

Prints `stopped` when the server isn't running.

### osaurus doctor

Read-only diagnostics for the installation and server: CLI/app version skew, duplicate app bundles, server startup, and model storage.

```bash
osaurus doctor [--port N] [--json] [--redact] [--verify-signatures]
```

| Option | Description |
| --- | --- |
| `--port` | Probe a specific port instead of the configured one |
| `--json` | Machine-readable report |
| `--redact` | Strip usernames/paths for a shareable report — use this when attaching output to a bug report |
| `--verify-signatures` | Also check code signature and notarization of every discovered app bundle (explicit because it can be slow with many copies installed) |

The report ends with a diagnosis and a concrete next step. Exit code is 0 when the install is usable (healthy, or merely not running) and 1 otherwise.

### osaurus ui

Open the Osaurus menu-bar popover.

```bash
osaurus ui
```

Launches the app if not already running and opens its menu-bar popover (not a full app window).

### osaurus list

List all downloaded models.

```bash
osaurus list
```

**Example output:**

```
gemma-4-e2b-it-4bit
gemma-4-26b-a4b-it-jang_4m
qwen3.6-35b-a3b-jangtq2
```

One model ID per line. Use `osaurus show <model>` for size and metadata.

### osaurus show

Show metadata for a specific model.

```bash
osaurus show <model>
```

**Example:**

```bash
osaurus show gemma-4-e2b-it-4bit
```

**Example output:**

```
Model: gemma-4-e2b-it-4bit
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Architecture:   Gemma4ForCausalLM
Parameters:     2B
Quantization:   4-bit
Context Length: 131072
Size:           1.5 GB
Path:           ~/MLXModels/gemma-4-e2b-it-4bit
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Useful for inspecting architecture, parameter count, quantization level, and context window size.

### osaurus pull

Download an MLX model from Hugging Face without opening the app.

```bash
osaurus pull <model_id>

# Example
osaurus pull mlx-community/Llama-3.2-1B-4bit
```

Downloads the same file set the in-app downloader uses (config, tokenizer, `*.safetensors`, …) into your configured models directory (falling back to `~/.osaurus/models/<org>/<name>`). Files that are already fully downloaded are skipped, so an interrupted pull resumes where it left off.

### osaurus run

Interactive chat session with a model.

```bash
osaurus run <model>
```

**Example:**

```bash
osaurus run gemma-4-e2b-it-4bit
```

Starts an interactive REPL where you can chat with the model. Type `exit` or press Ctrl+C to quit.

### osaurus bench

Benchmark the running server: time-to-first-token, prefill tok/s, and decode tok/s per prompt size, reported as JSON tagged with hardware info.

```bash
osaurus bench [--model <id>] [--prompt-tokens 1024,8192] [--max-tokens 128] [--runs 3] [--json <path>] [--port N]

# Find and persist the best prefill step size for a model
osaurus bench --tune-prefill [--model <id>] [--candidates 512,1024,2048,4096]
```

Requires a running server (`osaurus serve`). `--tune-prefill` measures TTFT at each candidate prefill step size and persists the per-model winner — the optimum is model-architecture-dependent, and the server applies it immediately.

### osaurus mcp

Start MCP stdio transport for connecting MCP clients.

```bash
osaurus mcp [--access-key KEY]
```

Proxies the MCP protocol over stdio to the running Osaurus server, auto-launching it if needed. Local-only servers can rely on loopback trust; if **Server → Network exposure** is enabled, pass an [access key](/identity) with `--access-key` or the `OSAURUS_MCP_ACCESS_KEY` environment variable (also accepted: `OSAURUS_ACCESS_KEY`, `OSAURUS_API_KEY`, or a `Bearer …` value in `OSAURUS_MCP_AUTHORIZATION`).

**Use with MCP clients:**

```json
{
  "mcpServers": {
    "osaurus": {
      "command": "osaurus",
      "args": ["mcp"]
    }
  }
}
```

### osaurus version

Display the Osaurus version (also `--version` / `-v`).

```bash
osaurus version
```

### osaurus tools

Manage plugins and tools.

```bash
osaurus tools <subcommand> [options]
```

#### tools install

Install a plugin from the registry, a URL, or a local directory.

```bash
# From registry
osaurus tools install osaurus.files

# From local directory (must contain osaurus-plugin.json,
# manifest.json, or plugin.json)
osaurus tools install .
osaurus tools install /path/to/plugin
```

#### tools uninstall

Remove an installed plugin.

```bash
osaurus tools uninstall osaurus.files
```

#### tools list

List all installed plugins.

```bash
osaurus tools list
```

#### tools search

Search for plugins in the registry.

```bash
osaurus tools search calendar
osaurus tools search git
```

#### tools outdated / upgrade / rollback

Keep installed plugins current — and step back when an update misbehaves.

```bash
# Check for newer registry versions
osaurus tools outdated

# Upgrade installed tools
osaurus tools upgrade

# Roll a tool back to its previous version
osaurus tools rollback osaurus.git
```

#### tools verify

Verify the dylib integrity of installed tools — useful after a suspicious sync or restore.

```bash
osaurus tools verify
```

#### tools reload

Ask the running app to rescan installed tools without restarting.

```bash
osaurus tools reload
```

#### tools create

Scaffold a new plugin project.

```bash
osaurus tools create MyPlugin --language swift
osaurus tools create MyPlugin --language rust
```

Creates a directory with:

- `Package.swift` or `Cargo.toml`
- `osaurus-plugin.json` (the plugin manifest)
- Source file template

#### tools dev

Run a plugin in development mode with hot reload.

```bash
osaurus tools dev com.acme.my-plugin
```

Watches the plugin directory and reloads the plugin when files change — useful for rapid iteration.

#### tools package

Package a plugin for distribution.

```bash
cd MyPlugin
osaurus tools package <plugin_id> <version> [dylib_path]

# Example
osaurus tools package com.example.mytool 1.0.0
```

Creates a zip file with the built `.dylib` and the plugin manifest.

### osaurus manifest

Work with plugin manifests during development.

```bash
# Extract the manifest JSON embedded in a built plugin dylib
osaurus manifest extract ./MyPlugin.dylib

# Validate a manifest's structure before packaging
osaurus manifest validate ./osaurus-plugin.json
```

### osaurus bundle

Load and run an MCP Bundle (`.mcpb` file) — a packaged MCP server that Osaurus can host directly.

```bash
osaurus bundle load ./my-server.mcpb --name "Display Name"
```

### osaurus coord

Foundation for local multi-instance coordination — directories, JSON feature flags, and file-scoped locks.

```bash
osaurus coord init                       # Create coordinator directories and seed state
osaurus coord status [--json]            # Root, initialization, locks, pause/stop state
osaurus coord feature-flags list|get|set # Read or update JSON-backed feature flags
osaurus coord lock list|acquire|release|reap
```

All subcommands accept `--root PATH` to work against a non-default coordinator root. Later orchestration subcommands (`preflight`, `heartbeat`, `lane`, `promote`, …) are registered but **not yet supported** — they exit with an error in the current foundation slice.

## Environment Variables

Configure Osaurus using environment variables:

| Variable         | Description             | Default       |
| ---------------- | ----------------------- | ------------- |
| `OSU_PORT`       | Server port number      | 1337          |
| `OSU_MODELS_DIR` | Custom models directory | `~/MLXModels` |

**Example:**

```bash
# Set in your shell profile
export OSU_PORT=8080
export OSU_MODELS_DIR=/Volumes/External/Models

# Or inline
OSU_PORT=8080 osaurus serve
```

## Common Workflows

### Development Setup

```bash
# Start server with custom port
osaurus serve --port 8080

# In another terminal, check available models
curl http://127.0.0.1:8080/v1/models | jq

# Interactive chat for testing
osaurus run gemma-4-e2b-it-4bit
```

### MCP Client Integration

```bash
# Ensure server is running
osaurus status

# If not running, start it
osaurus serve

# MCP client connects via:
# osaurus mcp
```

### Plugin Development

```bash
# Create a new plugin
osaurus tools create MyTool --language swift
cd MyTool

# Build and test
swift build -c release
osaurus tools install .

# Or use dev mode for hot reload
osaurus tools dev com.example.mytool

# Check it's installed
osaurus tools list
```

### LAN Access

```bash
# Start with LAN exposure
osaurus serve --expose

# Other machines can connect via your IP
curl http://192.168.1.100:1337/v1/models
```

## Troubleshooting

### Command Not Found

1. Verify Osaurus.app is installed:

   ```bash
   ls /Applications/Osaurus.app
   ```

2. Check symlink exists:

   ```bash
   which osaurus
   ls -la $(which osaurus)
   ```

3. Add to PATH manually if needed:
   ```bash
   export PATH="/Applications/Osaurus.app/Contents/MacOS:$PATH"
   ```

### Server Won't Start

1. Check if already running:

   ```bash
   osaurus status
   ```

2. Check port availability:

   ```bash
   lsof -i :1337
   ```

3. Try a different port:
   ```bash
   osaurus serve --port 8080
   ```

### Permission Denied

```bash
# Make CLI executable
chmod +x /Applications/Osaurus.app/Contents/MacOS/osaurus

# Don't use sudo for normal operations
osaurus serve  # Correct
sudo osaurus serve  # Not recommended
```

### MCP Connection Issues

1. Verify server is running:

   ```bash
   osaurus status
   ```

2. Test MCP endpoint:

   ```bash
   curl http://127.0.0.1:1337/mcp/health
   ```

3. Check installed tools:
   ```bash
   osaurus tools list
   ```

---

**Related:**

- [HTTP API](/api) — endpoints exposed by `osaurus serve`
- [Tools & Plugins](/tools) — what `osaurus tools install/dev/create` work with
- [Plugin Authoring](/plugin-authoring) — what to put in your scaffolded plugin

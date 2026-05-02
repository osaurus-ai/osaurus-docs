---
title: CLI
sidebar_label: CLI
description: Complete command-line interface for the Osaurus server, models, MCP, and plugins.
---

# CLI

The Osaurus CLI provides command-line control over your local LLM server, MCP tools, and model management.

## Quick Start

```bash
# Start the server
osaurus serve

# Open the UI
osaurus ui

# Check status
osaurus status

# Interactive chat
osaurus run gemma-4-e2b-it-4bit
```

## Installation

The CLI is embedded in the Osaurus application bundle. When installed via Homebrew, it's automatically linked.

### Manual Setup

If the `osaurus` command is not found after installation:

```bash
# Quick symlink
ln -sf "/Applications/Osaurus.app/Contents/MacOS/osaurus" "$(brew --prefix)/bin/osaurus"

# Or add to PATH
echo 'export PATH="/Applications/Osaurus.app/Contents/MacOS:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

## Commands

### osaurus serve

Start the Osaurus server.

```bash
osaurus serve [options]
```

**Options:**

| Option         | Description                                | Default |
| -------------- | ------------------------------------------ | ------- |
| `--port`, `-p` | Server port number                         | 1337    |
| `--expose`     | Enable LAN access (bind to all interfaces) | false   |

**Examples:**

```bash
# Default start (localhost:1337)
osaurus serve

# Custom port
osaurus serve --port 8080

# Enable LAN access
osaurus serve --expose
```

:::tip[Environment Variable]
Set `OSU_PORT` to override the default port globally.
:::

### osaurus stop

Stop the running Osaurus server.

```bash
osaurus stop
```

### osaurus status

Check server status and display running configuration.

```bash
osaurus status
```

**Example output:**

```
Osaurus Server Status
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Status:     Running
Port:       1337
PID:        12345
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### osaurus ui

Open the Osaurus graphical interface.

```bash
osaurus ui
```

Launches the app if not already running and brings it to the foreground.

### osaurus list

List all downloaded models.

```bash
osaurus list
```

**Example output:**

```
Available Models
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
gemma-4-e2b-it-4bit            1.5 GB
gemma-4-26b-a4b-it-jang_4m     8.2 GB
qwen3.6-35b-a3b-jangtq2        8.7 GB
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total: 18.4 GB
```

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

This is useful for inspecting model details like architecture, parameter count, quantization level, and context window size.

### osaurus run

Interactive chat session with a model.

```bash
osaurus run <model>
```

**Example:**

```bash
osaurus run gemma-4-e2b-it-4bit
```

Starts an interactive REPL where you can chat with the model. Type `/exit` or press Ctrl+C to quit.

### osaurus mcp

Start MCP stdio transport for connecting MCP clients.

```bash
osaurus mcp
```

This command proxies MCP protocol over stdio to the running Osaurus server. If the server isn't running, it auto-launches.

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

Display the Osaurus version.

```bash
osaurus version
```

**Example output:**

```
Osaurus 0.9.7
```

### osaurus tools

Manage plugins and tools.

```bash
osaurus tools <subcommand> [options]
```

#### tools install

Install a plugin from the registry or local directory.

```bash
# From registry
osaurus tools install osaurus.browser

# From local directory (must contain manifest.json)
osaurus tools install .
osaurus tools install /path/to/plugin
```

#### tools uninstall

Remove an installed plugin.

```bash
osaurus tools uninstall osaurus.browser
```

#### tools list

List all installed plugins.

```bash
osaurus tools list
```

#### tools search

Search for plugins in the registry.

```bash
osaurus tools search browser
osaurus tools search filesystem
```

#### tools create

Scaffold a new plugin project.

```bash
osaurus tools create MyPlugin --swift
osaurus tools create MyPlugin --rust
```

Creates a directory with:

- `Package.swift` or `Cargo.toml`
- `manifest.json`
- Source file template

#### tools dev

Run a plugin in development mode with hot reload.

```bash
osaurus tools dev com.acme.my-plugin
```

Watches the plugin directory for changes and automatically reloads the plugin when files are modified. Useful for rapid iteration during plugin development.

#### tools package

Package a plugin for distribution.

```bash
cd MyPlugin
osaurus tools package
```

Creates a zip file with the built `.dylib` and `manifest.json`.

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
osaurus tools create MyTool --swift
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

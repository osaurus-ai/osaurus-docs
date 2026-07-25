---
title: Tools & Plugins
sidebar_label: Tools & Plugins
description: Twenty-plus native Swift/Rust plugins across an append-only v1–v6 host ABI. Agents start with a small hot set and discover more tools on demand.
---

# Tools & Plugins

Osaurus ships with 20+ native plugins for everything from filesystem operations to Mail, Calendar, Git, and Vision. Tools are exposed via the Model Context Protocol (MCP) so any MCP-compatible client can use them. Osaurus is both a full MCP **server** and **client** — aggregate tools from remote MCP servers alongside locally installed plugins.

In the default **Auto** mode, agents start each session with a small always-loaded set of tools and pull in more from your enabled capabilities on demand — the same discovery mechanism that loads skills and methods. See [Skills](/skills) and [Methods](/methods) for how that works.

## Why Native Tools?

Osaurus tools are pure native **Swift and Rust** implementations—not Python scripts running through interpreters. This matters for production AI agents:

| Aspect           | Python/uv MCPs                                      | Native Swift Tools                               |
| ---------------- | --------------------------------------------------- | ------------------------------------------------ |
| **CPU Speed**    | Interpreter overhead + GIL limits parallelism       | Compiled machine code, true multi-threading      |
| **Memory**       | Higher baseline (~50MB+) + garbage collector pauses | ARC provides precise, predictable memory control |
| **Startup**      | Virtual environment + interpreter load (~200ms)     | Binary loads in under 10ms                       |
| **Dependencies** | Requires Python runtime, pip packages               | Self-contained binary, zero dependencies         |

For agents that make dozens of tool calls per session, these differences compound.

## Official System Tools

These tools are maintained by the Osaurus team and available from the central registry:

| Plugin ID            | Description                      |
| -------------------- | -------------------------------- |
| `osaurus.files`      | File system operations           |
| `osaurus.shell`      | Run shell commands               |
| `osaurus.git`        | Git repository utilities         |
| `osaurus.fetch`      | HTTP client for web requests     |
| `osaurus.mail`       | Apple Mail integration           |
| `osaurus.calendar`   | Calendar events                  |
| `osaurus.reminders`  | Apple Reminders                  |
| `osaurus.messages`   | Apple Messages                   |
| `osaurus.vision`     | Image analysis and OCR           |
| `osaurus.xlsx`       | Excel / CSV spreadsheet operations |
| `osaurus.pptx`       | PowerPoint presentation tools    |
| `osaurus.music`      | Apple Music control              |

Browse the full, current catalog (with each plugin's tool list) in **Management → Plugins**, or search it with `osaurus tools search`.

A few capabilities that used to be plugins are now **built in**: [web search](/web-search) (replacing `osaurus.search`), [browser automation](/browser-use) (replacing `osaurus.browser`), the clock (`get_current_time`), and [Computer Use](/computer-use) (macOS UI automation) all ship with the app rather than installing as `osaurus.*` plugins. Existing installs of a superseded plugin keep their card in Settings → Plugins with a "Built into Osaurus" banner, but their tools no longer load.

## Installing Tools

Use the Osaurus CLI to manage tools:

```bash
# Install a tool from the registry
osaurus tools install osaurus.files

# Install multiple tools
osaurus tools install osaurus.git osaurus.vision

# List installed tools
osaurus tools list

# Search available tools
osaurus tools search calendar

# Uninstall a tool
osaurus tools uninstall osaurus.time

# Dev mode with hot reload
osaurus tools dev com.acme.my-plugin
```

Tools are installed to:

```
~/.osaurus/Tools/<plugin_id>/<version>/
```

## Auto-selection (on-demand discovery)

:::tip[Key feature]
Most other tools load every tool definition upfront — burning thousands of tokens before you even ask anything. Osaurus keeps the schema small and lets the agent expand it only when needed.
:::

Each agent has a tool mode, set in the agent's **Capabilities** settings:

| Mode | Behavior |
|---|---|
| **Auto** *(default)* | The model starts with a small always-loaded hot set and loads more from your enabled capabilities on demand |
| **Manual** | All enabled capabilities are sent to the model every turn |

In Auto mode, the agent expands its kit mid-conversation via two always-on tools: `capabilities_discover` searches your enabled methods, tools, and skills and returns ranked IDs; `capabilities_load` injects the selected items (with their dependencies) into the active session.

This keeps the context small compared to loading every tool spec, leaving more room for conversation and reasoning. [Skills →](/skills) · [Methods →](/methods)

## Using Tools

### Via MCP Clients

Once installed, tools are automatically available to any connected MCP client. Configure your client to connect to Osaurus:

**Cursor / Claude Desktop:**

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

The CLI proxies MCP over stdio to the running Osaurus server. If Osaurus isn't running, it auto-launches.

### Via HTTP API

Tools are also accessible via HTTP endpoints:

| Endpoint      | Method | Description            |
| ------------- | ------ | ---------------------- |
| `/mcp/health` | GET    | Check MCP availability |
| `/mcp/tools`  | GET    | List active tools      |
| `/mcp/call`   | POST   | Execute a tool         |

**Example: List available tools**

```bash
curl http://127.0.0.1:1337/mcp/tools | jq
```

**Example: Execute a tool**

```bash
curl -X POST http://127.0.0.1:1337/mcp/call \
  -H "Content-Type: application/json" \
  -d '{
    "name": "read_file",
    "arguments": {"path": "/etc/hosts"}
  }'
```

### Via OpenAI Function Calling

Tools can also be used through the standard OpenAI function calling interface:

```python
from openai import OpenAI

client = OpenAI(base_url="http://127.0.0.1:1337/v1", api_key="osaurus")

response = client.chat.completions.create(
    model="gemma-4-e2b-it-4bit",
    messages=[{"role": "user", "content": "What files are in my home directory?"}],
    tools=[{
        "type": "function",
        "function": {
            "name": "list_directory",
            "description": "List contents of a directory",
            "parameters": {
                "type": "object",
                "properties": {
                    "path": {"type": "string", "description": "Directory path"}
                },
                "required": ["path"]
            }
        }
    }]
)
```

## Tool Permissions

Each tool can specify a permission policy:

- **`ask`** (default) — Prompts user for approval before each execution
- **`auto`** — Executes automatically if requirements are met
- **`deny`** — Blocks execution entirely

Some tools require macOS system permissions:

| Permission        | How to Grant                                         | Use Case                            |
| ----------------- | ---------------------------------------------------- | ----------------------------------- |
| **Automation**    | System Settings → Privacy & Security → Automation    | AppleScript, controlling other apps |
| **Accessibility** | System Settings → Privacy & Security → Accessibility | UI automation, input simulation     |

The Tools UI shows which permissions are needed and provides one-click buttons to grant them.

## Community Tools

The [Osaurus Tools Registry](https://github.com/osaurus-ai/osaurus-tools) hosts community-contributed plugins. Browse available tools:

```bash
osaurus tools search <keyword>
```

### Example: osaurus-emacs

The [osaurus-emacs](https://github.com/osaurus-ai/osaurus-emacs) plugin demonstrates a community tool that executes Emacs Lisp code:

```bash
osaurus tools install osaurus.emacs
```

Once installed, AI agents can interact with your Emacs instance:

```json
{
  "id": "execute_emacs_lisp_code",
  "description": "Execute Emacs Lisp code in a running Emacs instance",
  "parameters": {
    "code": "(buffer-name)"
  }
}
```

## Remote MCP Providers

Osaurus can connect to external MCP servers and aggregate their tools into your local instance, alongside your locally installed plugins.

### Adding a Remote MCP Provider

1. Open the Management window (`⌘ ⇧ M`)
2. Navigate to **MCP Providers**
3. Click **Add Provider**
4. Enter the provider details

### Configuration Options

| Field         | Description                                        |
| ------------- | -------------------------------------------------- |
| **Name**      | Display name for the provider                      |
| **Endpoint**  | MCP server URL or command                          |
| **Token**     | Authentication token (stored securely in Keychain) |
| **Timeout**   | Request timeout in seconds                         |
| **Streaming** | Enable/disable streaming responses                 |

### How It Works

- **Tool Discovery** — Osaurus queries the remote MCP server for available tools
- **Namespacing** — Remote tools are prefixed with the provider name (e.g., `provider_toolname`) to avoid conflicts
- **Unified Access** — All tools—local and remote—appear in the same tools list
- **Secure Storage** — Authentication tokens are stored in macOS Keychain

### Using Remote Tools

Once connected, remote tools appear alongside local tools:

```bash
# List all tools (local and remote)
curl http://127.0.0.1:1337/mcp/tools | jq

# Call a remote tool (namespaced)
curl -X POST http://127.0.0.1:1337/mcp/call \
  -H "Content-Type: application/json" \
  -d '{
    "name": "provider_remote_tool",
    "arguments": {"param": "value"}
  }'
```

Remote tools are also available to MCP clients like Cursor and Claude Desktop through the standard `osaurus mcp` command.

### Best Practices

- **Use descriptive provider names** — Makes it easy to identify tool origins
- **Set appropriate timeouts** — Remote tools may have higher latency than local ones
- **Monitor connection health** — Check the Management window for provider status

## Plugin ABIs

The native plugin host API is **append-only**. It has grown from v1 through **v6**, and every older plugin keeps loading unchanged against a newer host. Most plugins still choose between the two foundational tiers:

| ABI | Capabilities |
| --- | ------------ |
| **v1** | Tools only — define tool schemas and handle invocations, with no host callbacks |
| **v2** | Full host API — register HTTP routes, serve web apps, persist data in SQLite, dispatch agent tasks, and call inference through any model |

v2 plugins get the full Osaurus runtime, enabling integrations that go beyond simple tool calls. Versions v3–v6 add capabilities on top of v2 without breaking anything:

| ABI | Adds |
| --- | ---- |
| **v3** | Streaming control — cancel an in-flight completion by `stream_id` |
| **v4** | Agent-context introspection — `get_active_agent_id()` so a plugin knows which agent invoked it |
| **v5** | Structured logging — `log_structured()` emits searchable fields into Insights |
| **v6** | Host-side `free_string()` — an allocator-stable free path for host-returned strings |

Every new slot is optional: a plugin built against v6 checks `host->version` before calling a newer callback, and a v1 plugin runs fine on a v6 host. See the upstream [ABI versioning reference](https://github.com/osaurus-ai/osaurus/blob/main/docs/plugins/ABI_VERSIONS.md) for the full history and compatibility table.

### v2 capabilities

| Capability | Manifest key | Description |
|---|---|---|
| Tools | `capabilities.tools` | AI-callable functions |
| Routes | `capabilities.routes` | HTTP endpoints (OAuth, webhooks, APIs) |
| Config | `capabilities.config` | Native settings UI with validation |
| Web | `capabilities.web` | Static frontend serving with context injection |
| Docs | `docs` | README, changelog, external links |

Each is opt-in. A plugin can declare any subset.

## Tool contract

Every tool — built-in, folder, sandbox, plugin, MCP — returns a JSON envelope in one of two shapes (success or failure). This is how the chat UI distinguishes "the tool succeeded with this result" from "the model used the tool wrong and should fix it on the next turn".

[Tool Contract →](/tool-contract)

## Creating Your Own Tools

Want to build a tool? See the [Plugin Authoring Guide](/plugin-authoring) for complete instructions.

Quick start:

```bash
# Scaffold a new Swift plugin
osaurus tools create MyPlugin --language swift

# Build and install locally
cd MyPlugin
swift build -c release
osaurus tools install .

# Dev mode with hot reload
osaurus tools dev com.example.myplugin
```

## Central Registry

All official and community tools are indexed in the [osaurus-tools](https://github.com/osaurus-ai/osaurus-tools) repository:

- **Browse plugins**: See what's available
- **Submit your plugin**: Open a PR to add your tool
- **Automatic CI**: Your plugin JSON is validated on submission

### Registry Structure

```
osaurus-tools/
├── plugins/           # Plugin specifications
│   ├── osaurus.files.json
│   ├── osaurus.git.json
│   └── ...
├── tools/             # Source code for official tools
└── scripts/           # Build and release automation
```

## Troubleshooting

### Tool not appearing in MCP clients

1. Verify the tool is installed: `osaurus tools list`
2. Check Osaurus is running: `osaurus status`
3. Restart the MCP client to refresh the tool list

### Permission denied errors

1. Check which permissions the tool requires in the UI
2. Grant permissions via System Settings → Privacy & Security
3. No restart required—permissions take effect immediately

### Tool execution fails

1. Check Osaurus logs: Click the menu bar icon → View Logs
2. Verify the tool's requirements are met
3. Try reinstalling: `osaurus tools uninstall <id> && osaurus tools install <id>`

---

**Related:**

- [Plugin Authoring](/plugin-authoring) — full guide to building native plugins (v1–v6 ABI)
- [Tool Contract](/tool-contract) — envelope shape every tool returns
- [Sandbox Internals](/sandbox) — JSON-recipe plugins for the Linux sandbox
- [Remote MCP Providers](/remote-mcp-providers) — connecting external MCP servers
- [Skills](/skills) — user-facing skills view
- [Methods](/methods) — how the auto-selection layer is scored and tuned
- [Tools Registry](https://github.com/osaurus-ai/osaurus-tools) — browse and submit plugins

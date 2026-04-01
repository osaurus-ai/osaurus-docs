---
title: Tools & Plugins
sidebar_label: Tools & Plugins
description: Native Swift and Rust MCP tools for Osaurus - browser automation, filesystem, git, search, and more
---

# Tools & Plugins

Osaurus includes a powerful plugin system with 20+ native plugins for extending AI agent capabilities. Tools are exposed via the Model Context Protocol (MCP), allowing any MCP-compatible client to use them. Osaurus is both a full MCP server and client — aggregate tools from remote MCP servers alongside your locally installed plugins.

## Why Native Tools?

Osaurus tools are pure native **Swift and Rust** implementations—not Python scripts running through interpreters. This matters for production AI agents:

| Aspect           | Python/uv MCPs                                      | Native Swift Tools                               |
| ---------------- | --------------------------------------------------- | ------------------------------------------------ |
| **CPU Speed**    | Interpreter overhead + GIL limits parallelism       | Compiled machine code, true multi-threading      |
| **Memory**       | Higher baseline (~50MB+) + garbage collector pauses | ARC provides precise, predictable memory control |
| **Startup**      | Virtual environment + interpreter load (~200ms)     | Binary loads in under 10ms                       |
| **Dependencies** | Requires Python runtime, pip packages               | Self-contained binary, zero dependencies         |

For AI agents executing dozens of tool calls per session, these differences compound significantly.

## Official System Tools

These tools are maintained by the Osaurus team and available from the central registry:

| Plugin ID            | Description                      | Tools                                                                                                                                                          |
| -------------------- | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `osaurus.filesystem` | File system operations           | `read_file`, `write_file`, `list_directory`, `create_directory`, `delete_file`, `move_file`, `search_files`, `get_file_info`                                   |
| `osaurus.browser`    | Headless WebKit browser          | `browser_navigate`, `browser_get_content`, `browser_get_html`, `browser_execute_script`, `browser_click`, `browser_type`, `browser_screenshot`, `browser_wait` |
| `osaurus.git`        | Git repository utilities         | `git_status`, `git_log`, `git_diff`, `git_branch`                                                                                                              |
| `osaurus.search`     | Web search via DuckDuckGo        | `search`, `search_news`, `search_images`                                                                                                                       |
| `osaurus.fetch`      | HTTP client for web requests     | `fetch`, `fetch_json`, `fetch_html`, `download`                                                                                                                |
| `osaurus.time`       | Time and date utilities          | `current_time`, `format_date`                                                                                                                                  |
| `osaurus.mail`       | Apple Mail integration           | `mail_send`, `mail_search`, `mail_read`                                                                                                                        |
| `osaurus.calendar`   | Calendar events                  | `calendar_list`, `calendar_create`, `calendar_search`                                                                                                          |
| `osaurus.vision`     | Image analysis and OCR           | `vision_describe`, `vision_ocr`                                                                                                                                |
| `osaurus.macos-use`  | macOS UI automation              | `macos_click`, `macos_type`, `macos_screenshot`, `macos_get_windows`                                                                                           |
| `osaurus.xlsx`       | Excel spreadsheet operations     | `xlsx_read`, `xlsx_write`, `xlsx_create`                                                                                                                       |
| `osaurus.pptx`       | PowerPoint presentation tools    | `pptx_read`, `pptx_create`                                                                                                                                     |
| `osaurus.music`      | Apple Music control              | `music_play`, `music_pause`, `music_search`, `music_now_playing`                                                                                               |

## Installing Tools

Use the Osaurus CLI to manage tools:

```bash
# Install a tool from the registry
osaurus tools install osaurus.browser
osaurus tools install osaurus.filesystem

# Install multiple tools
osaurus tools install osaurus.git osaurus.search

# List installed tools
osaurus tools list

# Search available tools
osaurus tools search browser

# Uninstall a tool
osaurus tools uninstall osaurus.time

# Dev mode with hot reload
osaurus tools dev com.acme.my-plugin
```

Tools are installed to:

```
~/.osaurus/Tools/<plugin_id>/<version>/
```

## Two-Phase Capability Selection

:::tip Key Feature
This optimization saves ~80% of context space, giving you longer conversations and better AI reasoning.
:::

Osaurus uses a smart loading system that dramatically reduces context usage for tools.

### How It Works

Instead of loading all tool definitions upfront (which can consume thousands of tokens), Osaurus shows the AI a lightweight catalog first. The AI sees tool names and brief descriptions, then requests full definitions only for tools it actually needs.

| Approach        | Context Usage | What's Loaded                             |
| --------------- | ------------- | ----------------------------------------- |
| **Traditional** | ~5,000 tokens | All tool schemas upfront                  |
| **Two-Phase**   | ~1,000 tokens | Catalog + only actively used tool schemas |

This saves approximately **80% of context space**, leaving more room for conversation history and AI reasoning. Combined with [Skills](/skills), you can have extensive capabilities available without overwhelming the context window.

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
    model="llama-3.2-3b-instruct-4bit",
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

Osaurus can connect to external MCP servers and aggregate their tools into your local instance. This lets you use tools from remote MCP endpoints alongside your locally installed plugins.

### Adding a Remote MCP Provider

1. Open the Management window (⌘⇧M)
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

Plugins support two ABI versions:

| ABI | Capabilities |
| --- | ------------ |
| **v1** | Tools only — define tool schemas and handle invocations |
| **v2** | Full host API — register HTTP routes, serve web apps, persist data in SQLite, dispatch agent tasks, and call inference through any model |

v2 plugins have access to the full Osaurus runtime, enabling rich integrations that go beyond simple tool calls.

## Creating Your Own Tools

Want to build a tool? See the [Plugin Authoring Guide](/plugin-authoring) for complete instructions.

Quick start:

```bash
# Scaffold a new Swift plugin
osaurus tools create MyPlugin --swift

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
│   ├── osaurus.browser.json
│   ├── osaurus.filesystem.json
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

<p align="center">
  To contribute a tool, see the <a href="/plugin-authoring">Plugin Authoring Guide</a> or browse the <a href="https://github.com/osaurus-ai/osaurus-tools">tools registry</a>.
</p>

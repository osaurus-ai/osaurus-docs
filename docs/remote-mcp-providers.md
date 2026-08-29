---
title: Remote MCP Providers
sidebar_label: Remote MCP Providers
description: Connect Osaurus to external MCP servers and aggregate their tools alongside locally installed plugins.
---

# Remote MCP Providers

Remote MCP Providers let Osaurus connect to external MCP (Model Context Protocol) servers, aggregating their **tools** into your Osaurus instance.

Where [Remote Providers](/remote-providers) provide *inference* (cloud models), Remote MCP Providers provide **tools** that local agents can call.

## What you can do

- Connect to any MCP server over HTTP / SSE
- Auto-discover and register remote tools
- Use remote tools alongside local plugins (and have them participate in [auto-selection](/skills))
- Aggregate tools from multiple MCP servers

## Adding an MCP provider

1. Open the Management window (`⌘ ⇧ M`)
2. Click **Tools** in the sidebar, then open the **MCP** tab
3. Click **+ Add Provider**
4. Pick a service from the catalog, or choose **Custom Server** to enter your own URL
5. Configure authentication if required (OAuth sign-in, API key, or none)
6. Click **Add Provider**

:::note
Use the **Tools** sidebar item, not **Cloud Models**. Cloud Models manages *inference* endpoints (Ollama, OpenAI-compatible, etc.); MCP tool servers live under **Tools → MCP**.
:::

## Configuration

### Basic settings

| Setting | Description |
|---|---|
| **Name** | Display name for the provider |
| **URL** | Full URL to the MCP server endpoint |
| **Enabled** | Whether the provider is active |

### Authentication

| Setting | Description |
|---|---|
| **Token** | Bearer token (stored in Keychain) |
| **Custom headers** | Additional HTTP headers |

### Advanced

| Setting | Description | Default |
|---|---|---|
| **Auto-connect** | Connect on Osaurus launch | true |
| **Streaming enabled** | SSE streaming for tool discovery | false |
| **Discovery timeout** | Tool discovery timeout (seconds) | 20 |
| **Tool call timeout** | Tool execution timeout (seconds) | 45 |

## How it works

### Tool discovery

When you connect:

1. Osaurus opens a connection to the MCP server
2. Sends a `tools/list` request
3. Builds a complete namespaced catalog
4. Atomically swaps the provider's previous catalog for the new one
5. Tools become available for inference

Reconnects and discovery refreshes never expose a half-updated catalog: the old set remains active until the replacement is ready.

### Tool namespacing

Remote tools are prefixed with the provider name to avoid conflicts:

```
provider_toolname
```

So a provider named `myserver` exposing `search` is registered as `myserver_search`.

### Tool execution

When a model calls a remote MCP tool:

1. Osaurus receives the tool call
2. Routes it to the right MCP provider
3. Sends the request to the remote server
4. Returns the result to the model

The same [Tool Contract](/tool-contract) envelope is used end-to-end — failures from a remote MCP server surface to the local model as standard `invalid_args` / `execution_error` envelopes so the agent can self-correct.

## Using remote MCP tools

Remote MCP tools work like any other tool. The agent picks them up via [on-demand capability discovery](/skills) when relevant.

### Via the MCP API directly

```bash
# List all tools (local + remote)
curl http://127.0.0.1:1337/mcp/tools

# Call a remote tool
curl http://127.0.0.1:1337/mcp/call \
  -H "Content-Type: application/json" \
  -d '{
    "name": "myserver_search",
    "arguments": {"query": "hello world"}
  }'
```

## Connection states

| State | Indicator | Description |
|---|---|---|
| **Connected** | Green | Active connection, tools discovered |
| **Connecting** | Blue (animated) | Establishing connection |
| **Disconnected** | Gray | Not connected |
| **Disabled** | Gray | Manually disabled |
| **Error** | Red | Connection or discovery failed |

### Connection info

When connected, the provider card shows:

- Number of tools discovered
- Last connected timestamp
- Any error messages

## Testing connections

Before saving a provider, you can test the connection:

1. Enter the URL and authentication
2. Click **Test Connection**
3. If successful, you'll see the number of tools discovered
4. Click **Save** to persist

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Osaurus                                  │
│  ┌────────────────────────────────────────────────────────┐     │
│  │                   ToolRegistry                         │     │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │     │
│  │  │ Local Plugin │  │ Local Plugin │  │ MCP Provider │  │     │
│  │  │   (browser)  │  │ (filesystem) │  │    Tools     │  │     │
│  │  └──────────────┘  └──────────────┘  └──────┬───────┘  │     │
│  └─────────────────────────────────────────────│──────────┘     │
│                                                │                │
│  ┌─────────────────────────────────────────────│──────────┐     │
│  │              MCPProviderManager             │          │     │
│  │  ┌──────────────────────────────────────────┴──────┐   │     │
│  │  │              Remote MCP Client                  │   │     │
│  │  └─────────────────────────────────────────┬───────┘   │     │
│  └────────────────────────────────────────────│───────────┘     │
└───────────────────────────────────────────────│─────────────────┘
                                                │
                                                ▼
                               ┌─────────────────────────────┐
                               │   Remote MCP Server         │
                               │   (external)                │
                               │   ├── tool1                 │
                               │   ├── tool2                 │
                               │   └── tool3                 │
                               └─────────────────────────────┘
```

## Troubleshooting

### "Connection refused"

- Verify the MCP server is running
- Check the URL (protocol, host, port, path)
- No firewall blocking?

### "Authentication failed"

- Verify the token is correct
- Check whether custom headers are required

### "Discovery timeout"

- The MCP server may be slow to respond — bump the timeout
- Check upstream server health

### "No tools discovered"

- The server may not expose any tools
- Check the server's tool configuration

### Debug mode

Use **Insights** to monitor MCP activity:

1. Open Management window (`⌘ ⇧ M`)
2. Click **Insights**
3. Filter by source or search for the provider name

## Security

### Token storage

Authentication tokens are stored in the macOS Keychain — encrypted at rest, never exposed in config files.

### Secret headers

Custom headers marked as "secret" are also stored in the Keychain.

### Configuration files

Non-secret configuration is stored at:

```
~/.osaurus/providers/mcp.json
```

## Example: connecting to a custom MCP server

Suppose you have an MCP server at `https://mcp.example.com/sse`:

1. Click **Add MCP Provider**
2. Enter:
   - **Name:** "Example Server"
   - **URL:** `https://mcp.example.com/sse`
   - **Token:** *(your auth token)*
3. Click **Test Connection**
4. Click **Save**

The server's tools will now be available in Osaurus as:

- `example-server_tool1`
- `example-server_tool2`
- …

---

**Related:**

- [Remote Providers](/remote-providers) — connecting to inference APIs (cloud models)
- [Tools & Plugins](/tools) — using tools that are now in your registry
- [Plugin Authoring](/plugin-authoring) — building local plugins
- [Tool Contract](/tool-contract) — envelope shape for every tool
- [Global Proxy](/global-proxy) — routing MCP discovery and auth traffic through a proxy

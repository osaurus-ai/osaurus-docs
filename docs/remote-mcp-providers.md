---
title: Remote MCP Providers
sidebar_label: Remote MCP Providers
description: Connect Osaurus to external MCP servers and aggregate their tools alongside locally installed plugins.
---

# Remote MCP Providers

Remote MCP Providers let Osaurus connect to external MCP (Model Context Protocol) servers, aggregating their **tools** into your Osaurus instance.

Where [Remote Providers](/remote-providers) provide *inference* (cloud models), Remote MCP Providers provide **tools** that local agents can call.

## What you can do

- Connect to any MCP server over HTTP / SSE, or run a local one over stdio
- Pick from a directory of about 110 services, grouped by professional domain
- Auto-discover and register remote tools
- Answer a service's questions mid-call, and follow progress on long-running tools
- Use remote tools alongside local plugins (and have them participate in [auto-selection](/skills))
- Aggregate tools from multiple MCP servers

## Adding an MCP provider

1. Open **Settings…** (`⌘ ,`)
2. Click **Tools & MCP** in the sidebar (under **Capabilities**), then open the **Services** tab
3. Click **Add Service** — or click **Add** on a row in the **Directory** below the Services list
4. Pick a service from the directory, or choose **Custom Server** to enter your own URL or stdio command
5. Configure authentication if required (OAuth sign-in, API key / Bearer token, or none)
6. Save the service

### The directory

The directory lists about 110 well-known services, with a search field and category chips: **Legal**, **Finance & Accounting**, **Investing & Market Data**, **Healthcare & Life Sciences**, **Documents & Signatures**, **Compliance & Security**, **Business Productivity**, **Sales & CRM**, and **Developer**. Search matches name, tagline, or category ("legal" finds every legal service). A few examples:

| Category | Examples |
|---|---|
| Legal | Bloomberg Law, CoCounsel Legal, CourtListener, Harvey, Ironclad, iManage Work, NetDocuments |
| Finance & Accounting | QuickBooks, Xero, Stripe, Ramp, Brex, Mercury, Gusto, FreshBooks |
| Investing & Market Data | FactSet, S&P Global, PitchBook, Morningstar, Moody's, LSEG, Alpha Vantage |
| Healthcare & Life Sciences | Medidata, Cortellis Regulatory, Open Targets, SNOMED CT, Consensus, Elicit |
| Documents & Signatures | Box, Docusign, Dropbox, Egnyte, PandaDoc |
| Business Productivity | Notion, Slack, Gmail, Google Drive, Google Calendar, Microsoft 365, Asana, Atlassian, Zoom, Zapier |
| Sales & CRM | Salesforce, HubSpot, Attio, Intercom, Close |
| Developer | GitHub, Linear, Sentry, Supabase, Vercel, Cloudflare, Hugging Face, DeepWiki |

Enterprise data products show a **Requires subscription** note; they only work with a paid account. Some services (Google, Slack, Asana, Zoom, Xero, Box, Docusign, HubSpot, Harvey, Microsoft 365) need an OAuth app you or your administrator create first; the connect screen walks through it and shows the redirect URI to copy (`http://127.0.0.1:33267/callback`).

The **Services** header shows a one-line summary (connected · needs attention · tools) and a ⋯ menu with **Show** (filter), **Reconnect All**, **Test Connections**, and **Copy Diagnostics**.

In chat, you can also ask the [Orchestrator](/glossary#orchestrator) to add an MCP server; it applies an `mcp_servers:` entry through `osaurus_config` after a one-tap approval. OAuth sign-in and tokens still go through the secure native UI.

:::note
Use **Tools & MCP**, not **Providers**. Providers manages *inference* endpoints (Ollama, OpenAI-compatible, etc.); MCP tool servers live under **Tools & MCP → Services**.
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
| **Tool call timeout** | How long a tool call may go without any sign of progress (seconds) | 45; 120 for Legal, Investing, and Healthcare services |
| **Max Duration with Progress** | Longest a tool call may run while the server keeps sending progress updates (minutes, up to 4 hours) | 10 |

## When a service asks you something

Some services need an answer from you in the middle of a tool call. Osaurus shows a card in the chat:

- **"*Service* needs more information"** — a short form (text, number, yes/no, or a choice). Required fields are marked. Choose **Submit**, **Decline**, or **Cancel**. Never type passwords, API keys, or card numbers into these forms.
- **"*Service* wants you to finish in your browser"** — shows the destination host and full link. It opens only when you click **Open**, and closes when the service reports it's done or you click **Done**.

These cards only appear while you're chatting. Background runs, schedules, and outside apps decline the request automatically. The tool's timeout is paused while a card waits for you.

## Approvals

Services can label their tools as read-only or as able to change or delete data. Osaurus uses those labels to pick each tool's starting approval policy:

- **Read-only tools** run without asking, unless they can also reach the open web (like web search or page fetch).
- **Tools that may change or delete data**, including tools with no labels at all, ask on **every** call. Task-wide approval and **Always Allow** never cover them.
- Everything else asks the first time.

The tool list on a service's row shows an eye for read-only tools and a warning triangle for tools that can change data. A policy you set yourself replaces the default, except that a tool that asks on every call only offers **Ask** and **Deny**.

## Long-running tools

Every tool call asks the service for progress updates. Each update restarts the tool-call timeout, up to **Max Duration with Progress**, and the latest progress message (with a percentage when available) shows on the running tool card. A timed-out call is reported to the model as not retryable, since the service may still be working. When a call times out or you press Stop, Osaurus tells the service to cancel. When a service hands back a job to poll, status polls that report the job still running don't trigger the agent loop's repeated-call nudges, for up to 15 polls.

## How it works

### Tool discovery

When you connect:

1. Osaurus opens a connection to the MCP server
2. Sends a `tools/list` request
3. Builds a complete namespaced catalog
4. Atomically swaps the provider's previous catalog for the new one
5. Tools become available for inference

Reconnects and discovery refreshes never expose a half-updated catalog: the old set remains active until the replacement is ready.

Some servers publish object schemas without a `properties` field; Osaurus fills in an empty one so strict inference providers accept the tool. Integer arguments are forwarded as integers — a `0` or `1` is never sent as a boolean.

A remote tool can't register under the name of a built-in [Apple Apps](/apple-apps) tool (`calendar_events`, `messages_send`, …); the registration is logged and dropped.

### Tool namespacing

Remote tools are prefixed with the provider name to avoid conflicts:

```
provider_toolname
```

So a provider named `myserver` exposing `search` is registered as `myserver_search`. The exact exposed names are listed under **Tools & MCP → All Tools**.

Servers document their own tools by their canonical names (`search`), both in tool descriptions and in the `instructions` they return on connect. Two things keep those references usable after prefixing:

- Each exposed description starts with ``Exposed as `myserver_search` (server name `search`).`` and maps sibling tools the description cites by canonical name too.
- A call to a bare canonical name (`search`) resolves to the prefixed tool of the server that publishes it, then passes through the normal exposure and permission gates. If two connected servers publish the same name, the one exposed to the request wins; if both are exposed, the model is told both names and asked to pick. A name no server publishes gets `tool_not_found`.

### Tool execution

When a model calls a remote MCP tool:

1. Osaurus receives the tool call
2. Routes it to the right MCP provider
3. Sends the request to the remote server, with a progress token
4. Returns the result to the model. Text, images, embedded resources, and `resource_link` items are kept. When a result carries only `structuredContent`, its JSON is passed as text; when the server also mirrors it as text, only the text is sent.

Discovered-tool pills use each tool's `title` and show its behavior annotations (`readOnlyHint`, `destructiveHint`, `openWorldHint`). Annotations only choose the default approval policy (see [Approvals](#approvals)); `ExternalMCPToolPolicy` deny lists still apply.

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

Connector errors are shown in plain language, with a **Details** disclosure for the raw error.

### The service row shows **Sign In** after working before

Some services list tools without sign-in and only ask when a tool runs, and some grant fewer permissions than a tool needs. If a call still returns `401` or `403` after a reconnect and retry, the service is marked as needing sign-in and the model asks you to sign in again from **Tools & MCP → Services**. For a `403`, the next sign-in requests the scopes already granted plus any the server asked for. Re-authorization is never silent.

### "Command not found" for a local (stdio) server

Local servers get your login shell's `PATH`, so `npx`, `node`, and tools installed with Homebrew, mise, nvm, asdf, fnm, direnv, or Volta resolve. For a `#!/usr/bin/env node` script, the interpreter's directory goes first. An explicit `PATH` you set on the server still wins. If a command still isn't found, use its full path.

### A tool call stopped after a few minutes

Raise **Max Duration with Progress** for that service. The cap only applies while the service keeps sending progress; without progress, **Tool call timeout** applies.

### "Discovery timeout"

- The MCP server may be slow to respond — bump the timeout
- Check upstream server health

### "No tools discovered"

- The server may not expose any tools
- Check the server's tool configuration

### Debug mode

Use **Insights** to monitor MCP activity:

1. Open **Settings…** (`⌘ ,`)
2. Click **Insights** (under **Developer Tools**)
3. Filter by source or search for the provider name

Each call is an **MCP tool** row with the server, tool, arguments, result preview, and transport — stdio servers show as Local, HTTP servers as Cloud. For connection problems, use **Copy Diagnostics** in the Services ⋯ menu.

## OAuth sign-in details

One-tap OAuth uses RFC 9728 protected-resource metadata and RFC 8414 authorization-server metadata, PKCE S256, an RFC 8252 loopback redirect, RFC 8707 resource indicators, and automatic refresh. Client registration is chosen in this order:

1. A saved `client_id`, but only if the same authorization server (`issuer`) issued it. A changed issuer forces a fresh registration.
2. A Client ID Metadata Document, when the server advertises `client_id_metadata_document_supported`. The `client_id` is `https://osaurus.ai/oauth/mcp-client-metadata.json`; Osaurus validates the published document first and skips this step until it's live. Services that accept only this method (MyCase, Ironclad, Wealthbox, Affinity, Crunchbase, Financial Modeling Prep) stay hidden until then.
3. RFC 7591 Dynamic Client Registration, when the server has a `registration_endpoint`.

After the redirect, Osaurus checks the `iss` parameter (RFC 9207): a different issuer stops sign-in, and a missing one stops it when the server advertises `authorization_response_iss_parameter_supported`. Servers built against MCP 2025-03-26 (no protected-resource metadata) fall back to authorization-server metadata at the server's origin. Manual-credentials templates send the client secret with `client_secret_post`, or `client_secret_basic` when that's all the token endpoint accepts (Zoom).

Not in the directory: services with no usable client registration (Everlaw), no vendor-hosted MCP server (Clio, Filevine, ADP, Bill.com), per-account URLs (NetSuite; add it with **Custom Server**), undocumented endpoints, endpoints that don't publish OAuth discovery (Stack Overflow), and multi-step GCP-IAM services (BigQuery, Maps, GKE). QuickBooks may require Intuit's approval, and Harvey and Microsoft 365 need credentials from your administrator.

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

1. Click **Add Service → Custom Server**
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

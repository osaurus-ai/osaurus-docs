---
title: Docs MCP
sidebar_label: Docs MCP
description: Give Claude Code, Cursor, Codex, VS Code, and any other MCP client direct access to the Osaurus docs through the official hosted MCP server.
---

# Docs MCP

The Osaurus docs are available as a hosted [Model Context Protocol](https://modelcontextprotocol.io/) (MCP) server. Add it to your coding agent and it can search and read these docs directly, instead of guessing or scraping web search results.

```
https://docs.osaurus.ai/mcp
```

- **Transport:** Streamable HTTP
- **Auth:** none, the server is public and read-only
- **Always current:** it is rebuilt with every docs deploy, so it matches this site

:::tip[Not the same as the Osaurus MCP server]
This server serves the *documentation*. To let an agent use the *tools installed in your Osaurus app*, connect to the app's own local MCP server instead. See [Integrations](/integrations#mcp-server).
:::

## Tools

| Tool | What it does |
| --- | --- |
| `search_osaurus_docs` | Searches every page by section. Returns the best matches with a snippet, the page slug, and a link to the exact heading. |
| `read_osaurus_doc` | Returns a page as markdown with code and config examples intact. Pass `section` (a heading or anchor) to read one part of a long page. |
| `list_osaurus_docs` | Lists every page grouped by sidebar section, with the page count, slugs, and descriptions. |

A typical agent flow is `search_osaurus_docs("add a remote MCP provider")`, then `read_osaurus_doc("remote-mcp-providers", section: "adding-an-mcp-provider")`.

## Add it to your agent

### Claude Code

```bash
claude mcp add --transport http osaurus-docs https://docs.osaurus.ai/mcp
```

Add `--scope user` to make it available in every project.

### Claude Desktop and claude.ai

Open **Settings → Connectors → Add custom connector**, name it `Osaurus Docs`, and paste `https://docs.osaurus.ai/mcp` as the URL.

### Cursor

Add to `~/.cursor/mcp.json` (or `.cursor/mcp.json` in a project):

```json
{
  "mcpServers": {
    "osaurus-docs": {
      "url": "https://docs.osaurus.ai/mcp"
    }
  }
}
```

### VS Code

Add to `.vscode/mcp.json`:

```json
{
  "servers": {
    "osaurus-docs": {
      "type": "http",
      "url": "https://docs.osaurus.ai/mcp"
    }
  }
}
```

### Codex CLI

Add to `~/.codex/config.toml`:

```toml
[mcp_servers.osaurus-docs]
url = "https://docs.osaurus.ai/mcp"
```

### Windsurf

Add to `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "osaurus-docs": {
      "serverUrl": "https://docs.osaurus.ai/mcp"
    }
  }
}
```

### Gemini CLI

Add to `~/.gemini/settings.json`:

```json
{
  "mcpServers": {
    "osaurus-docs": {
      "httpUrl": "https://docs.osaurus.ai/mcp"
    }
  }
}
```

### Osaurus

Your Osaurus agents can use it too. Add it as a [Remote MCP Provider](/remote-mcp-providers) with the URL `https://docs.osaurus.ai/mcp` and no authentication.

### Any other client

Point any MCP client that supports Streamable HTTP at `https://docs.osaurus.ai/mcp`. No headers or keys are needed.

## Limits

The server is free to use and has a few limits to keep it fast for everyone:

- `read_osaurus_doc` returns up to 30,000 characters. Longer pages end with a list of their sections, so read those one at a time with `section`.
- Requests over 32 KB and batches of more than 10 messages are refused.
- Heavy traffic from one address may be rate limited with HTTP `429`. Wait a moment and retry.

## Plain text for agents without MCP

If your tool can't use MCP, the same content is published as plain text:

- [`/llms.txt`](https://docs.osaurus.ai/llms.txt) lists every page with a one-line description
- [`/llms-full.txt`](https://docs.osaurus.ai/llms-full.txt) contains every page in one file

## Privacy

The server keeps no sessions and needs no account. It doesn't store or log your search queries.

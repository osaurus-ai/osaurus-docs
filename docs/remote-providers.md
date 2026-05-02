---
title: Remote Providers
sidebar_label: Remote Providers
description: Connect Osaurus to OpenAI, Anthropic, xAI, OpenRouter, Ollama, LM Studio, and any custom OpenAI-compatible endpoint.
---

# Remote Providers

Remote Providers let you connect Osaurus to external inference APIs (OpenAI, Anthropic, Open Responses, and compatible endpoints), giving you cloud models alongside your local MLX models — all behind the same Osaurus URL.

## Why this matters

- One client connection (your script's OpenAI SDK pointed at Osaurus) gets access to **every** model — local and cloud — by name
- API keys are stored in the macOS Keychain, never in plain-text config files
- Switch backends without touching client code; same memory and agent context follows you across providers

## Adding a provider

### Via the UI

1. Open the Management window (`⌘ ⇧ M`)
2. Click **Providers** in the sidebar
3. Click **Add Provider**
4. Select a preset or **Custom**
5. Configure connection settings
6. Click **Save**

### Provider presets

| Preset | Host | Port | Base path | API format | Auth |
|---|---|---|---|---|---|
| **Anthropic** | `api.anthropic.com` | 443 | `/v1` | Anthropic | API key required |
| **OpenAI** | `api.openai.com` | 443 | `/v1` | OpenAI | API key required |
| **xAI** | `api.x.ai` | 443 | `/v1` | OpenAI | API key required |
| **OpenRouter** | `openrouter.ai` | 443 | `/api/v1` | OpenAI | API key required |
| **Custom** | (you specify) | — | `/v1` | OpenAI | Optional |

For Ollama, LM Studio, Venice AI, or any other OpenAI-compatible endpoint, use **Custom** and configure host/port manually. See [Provider-specific notes](#provider-specific-notes) below.

### API format types

| Format | Endpoint | Description |
|---|---|---|
| **OpenAI** | `/chat/completions` | OpenAI Chat Completions |
| **Anthropic** | `/messages` | Anthropic Messages |
| **Open Responses** | `/responses` | [Open Responses](https://www.openresponses.org) |

## Configuration options

### Basic settings

| Setting | Description |
|---|---|
| **Name** | Display name for the provider |
| **Host** | Hostname or IP (e.g. `api.openai.com`) |
| **Protocol** | HTTP or HTTPS |
| **Port** | Server port (optional, uses protocol default) |
| **Base path** | API path prefix (usually `/v1`) |

### Authentication

| Setting | Description |
|---|---|
| **Auth type** | None or API Key |
| **API key** | Stored in Keychain, never in plain text |

### Advanced

| Setting | Description | Default |
|---|---|---|
| **Enabled** | Whether the provider is active | true |
| **Auto-connect** | Connect automatically when Osaurus starts | true |
| **Timeout** | Request timeout in seconds | 60 |
| **Custom headers** | Additional HTTP headers | {} |

#### Custom headers

You can add custom HTTP headers for specialized authentication or configuration:

```
X-Custom-Header: value
Authorization: Bearer token
```

For headers containing secrets, mark them as "secret" to store values in the Keychain rather than in plain-text configuration.

## Using remote models

Once a provider is connected, its models appear alongside local models.

### In the Chat UI

- Click the model selector dropdown
- Remote models are grouped under their provider name
- Select one and chat

### Via the OpenAI SDK

```python
from openai import OpenAI

client = OpenAI(base_url="http://127.0.0.1:1337/v1", api_key="osaurus")

# Use a remote model — name matches what the upstream provider expects
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello!"}]
)
```

### Via curl

```bash
curl http://127.0.0.1:1337/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

The model name should match what the remote provider expects.

## Connection states

| State | Indicator | Description |
|---|---|---|
| **Connected** | Green | Active connection, models available |
| **Connecting** | Blue (animated) | Establishing connection |
| **Disconnected** | Gray | Not connected |
| **Disabled** | Gray | Manually disabled |
| **Error** | Red | Connection failed (see error message) |

### Troubleshooting

1. **Verify the endpoint** — host, port, base path
2. **Check credentials** — API key is correct
3. **Test directly** — `curl` the upstream endpoint to confirm it's reachable
4. **Check network** — no firewall blocking the connection
5. **Review error message** — the provider card shows detailed error info

## Provider-specific notes

### OpenAI

```
Host:     api.openai.com
Protocol: HTTPS
Base:     /v1
Auth:     API key (platform.openai.com)
```

All ChatGPT models via the OpenAI API.

### OpenRouter

```
Host:     openrouter.ai
Protocol: HTTPS
Base:     /api/v1
Auth:     API key (openrouter.ai)
```

OpenRouter aggregates many providers. Use IDs like:

- `openai/gpt-4o`
- `anthropic/claude-3.5-sonnet`
- `google/gemini-pro`

### Anthropic

```
Host:     api.anthropic.com
Protocol: HTTPS
Base:     /v1
Auth:     API key (console.anthropic.com)
Format:   Anthropic
```

### xAI

```
Host:     api.x.ai
Protocol: HTTPS
Base:     /v1
Auth:     API key (x.ai)
```

### Venice AI

Use the **Custom** preset:

```
Host:     api.venice.ai
Protocol: HTTPS
Base:     /v1
Auth:     API key (venice.ai)
Format:   OpenAI
```

Venice provides uncensored, privacy-focused inference with no data retention.

### Ollama

Use the **Custom** preset:

```
Host:     localhost (or remote Ollama IP)
Protocol: HTTP
Port:     11434
Base:     /v1
Auth:     None (unless you've configured Ollama auth)
```

To expose Ollama on the network:

```bash
OLLAMA_HOST=0.0.0.0:11434 ollama serve
```

### LM Studio

Use the **Custom** preset:

```
Host:     localhost
Protocol: HTTP
Port:     1234
Base:     /v1
Auth:     None
```

Make sure "Start Server" is enabled in LM Studio.

## Security

### API key storage

API keys are stored in the macOS Keychain, **not** in plain-text configuration files:

- Encrypted at rest
- Protected by your macOS login
- Never exposed in config files or logs

### Secret headers

Custom headers marked as "secret" are also stored in the Keychain.

### Configuration files

Non-secret provider configuration is stored at:

```
~/.osaurus/providers/remote.json
```

This file contains connection settings but **not** API keys or secret headers.

## Managing providers

| Action | How |
|---|---|
| **Edit** | Click the pencil icon on the provider card → modify → **Save**. Connection re-establishes with new settings. |
| **Delete** | Click the trash icon → confirm. Removes the provider and its credentials from the Keychain. |
| **Enable/disable** | Toggle the switch on the provider card |

---

**Related:**

- [Models](/models) — how cloud and local models share the same picker
- [HTTP API](/api) — what callers see once a provider is connected
- [Remote MCP Providers](/remote-mcp-providers) — connecting Osaurus to remote *tool* providers (different feature)

---
title: Remote Providers
sidebar_label: Remote Providers
description: Connect Osaurus to OpenAI, Anthropic, Gemini, xAI, DeepSeek, MiniMax, Venice, OpenRouter, Ollama, and any custom OpenAI-compatible endpoint — by API key or browser sign-in.
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

Osaurus ships first-class presets for the providers below — pick one and you only fill in a key (or sign in). The OAuth-capable providers are listed first because a browser sign-in is the lowest-friction path.

| Preset | Host | Port | Base path | API format | Auth |
|---|---|---|---|---|---|
| **OpenAI** | `api.openai.com` | 443 | `/v1` | OpenAI / Open Responses | API key or browser sign-in |
| **xAI** | `api.x.ai` | 443 | `/v1` | OpenAI-compatible | API key or browser sign-in |
| **OpenRouter** | `openrouter.ai` | 443 | `/api/v1` | OpenAI-compatible | API key or browser sign-in |
| **Anthropic** | `api.anthropic.com` | 443 | `/v1` | Anthropic | API key |
| **Google (Gemini)** | `generativelanguage.googleapis.com` | 443 | `/v1beta` | Gemini | API key |
| **Azure OpenAI Foundry** | your resource host | 443 | `/openai/v1` | OpenAI | API key |
| **AtlasCloud** | `api.atlascloud.ai` | 443 | `/v1` | OpenAI-compatible | API key |
| **DeepSeek** | `api.deepseek.com` | 443 | `/v1` | OpenAI-compatible | API key |
| **MiniMax** | `api.minimax.io` | 443 | `/v1` | OpenAI-compatible | API key |
| **Venice AI** | `api.venice.ai` | 443 | `/api/v1` | OpenAI-compatible | API key |
| **Ollama** | `localhost` | 11434 | `/v1` | OpenAI-compatible | None (local) |
| **Custom** | (you specify) | — | `/v1` | OpenAI-compatible | Optional |

Need something else? Use **Custom** for LM Studio or any other OpenAI-compatible endpoint. For a hosted, zero-setup option tied to your Osaurus account (no key to paste), see [Osaurus Router](/osaurus-router).

### Signing in with OAuth

**OpenAI**, **xAI**, and **OpenRouter** support a **browser sign-in** instead of an API key: pick the provider, click **Sign in**, and authorize in your browser. For OpenAI you can sign in with your **ChatGPT / Codex** account or paste a Platform API key — either works. These providers are surfaced first in the picker because OAuth is the quickest way to connect.

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
Auth:     API key (platform.openai.com) or browser sign-in
```

Sign in with your **ChatGPT / Codex** account for the lowest-friction setup, or paste a Platform API key — either works.

### xAI

```
Host:     api.x.ai
Protocol: HTTPS
Base:     /v1
Auth:     API key (console.x.ai) or browser sign-in
```

Grok models, with browser sign-in or a pasted key.

### OpenRouter

```
Host:     openrouter.ai
Protocol: HTTPS
Base:     /api/v1
Auth:     API key (openrouter.ai) or browser sign-in
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

Claude models, spoken natively over the Anthropic Messages format.

### Google (Gemini)

```
Host:     generativelanguage.googleapis.com
Protocol: HTTPS
Base:     /v1beta
Auth:     API key (aistudio.google.com)
Format:   Gemini
```

### Azure OpenAI Foundry

```
Host:     your resource endpoint (e.g. my-resource.openai.azure.com)
Protocol: HTTPS
Base:     /openai/v1
Auth:     API key (Azure AI Foundry)
```

Point the host at your own Azure OpenAI resource and add deployment names if they don't appear automatically.

### AtlasCloud

```
Host:     api.atlascloud.ai
Protocol: HTTPS
Base:     /v1
Auth:     API key (atlascloud.ai)
```

OpenAI-compatible access to DeepSeek, Qwen, GLM, Kimi, and MiniMax models.

### DeepSeek

```
Host:     api.deepseek.com
Protocol: HTTPS
Base:     /v1
Auth:     API key (platform.deepseek.com)
```

### MiniMax

```
Host:     api.minimax.io
Protocol: HTTPS
Base:     /v1
Auth:     API key (platform.minimax.io)
```

### Venice AI

```
Host:     api.venice.ai
Protocol: HTTPS
Base:     /api/v1
Auth:     API key (venice.ai)
```

Privacy-first, uncensored inference with no data retention.

### Ollama

```
Host:     localhost (or remote Ollama IP)
Protocol: HTTP
Port:     11434
Base:     /v1
Auth:     None (unless you've configured Ollama auth)
```

Run models locally via Ollama. To expose Ollama on the network:

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
- [Osaurus Router](/osaurus-router) — hosted inference with no key to paste
- [Privacy Filter](/privacy-filter) — redact sensitive content before it reaches a cloud provider
- [HTTP API](/api) — what callers see once a provider is connected
- [Remote MCP Providers](/remote-mcp-providers) — connecting Osaurus to remote *tool* providers (different feature)

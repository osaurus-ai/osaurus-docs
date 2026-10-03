---
title: Remote Providers
sidebar_label: Remote Providers
description: Connect Osaurus to OpenAI, Anthropic, Gemini, xAI, Mistral, Claude Code, and any OpenAI-compatible endpoint — by API key, browser sign-in, or a signed-in CLI.
---

# Remote Providers

Remote Providers connect Osaurus to external inference APIs (OpenAI, Anthropic, Open Responses, and compatible endpoints), so cloud models sit alongside your local MLX models — all behind the same Osaurus URL.

## Why this matters

- One client connection (your script's OpenAI SDK pointed at Osaurus) reaches **every** model — local and cloud — by name
- API keys live in the macOS Keychain, never in plain-text config files
- Switch backends without touching client code; memory and agent context follow you across providers

## Adding a provider

### Via the UI

1. Open **Settings…** (`⌘ ,`)
2. Click **Providers** in the sidebar (under **Models**)
3. Click **Add Provider**
4. Pick a sign-in provider, **Claude Code**, or **Use an API key** (Anthropic, Google, Ollama, custom, and more)
5. Configure connection settings
6. Click **Save**

### Provider presets

Osaurus ships first-class presets for the providers below — pick one and you only fill in a key (or sign in). OAuth-capable providers are listed first.

| Preset | Host | Port | Base path | API format | Auth |
|---|---|---|---|---|---|
| **OpenAI** | `api.openai.com` | 443 | `/v1` | OpenAI / Open Responses | API key or browser sign-in |
| **xAI** | `api.x.ai` | 443 | `/v1` | OpenAI-compatible | API key or browser sign-in |
| **OpenRouter** | `openrouter.ai` | 443 | `/api/v1` | OpenAI-compatible | API key or browser sign-in |
| **Anthropic** | `api.anthropic.com` | 443 | `/v1` | Anthropic | API key |
| **Google (Gemini)** | `generativelanguage.googleapis.com` | 443 | `/v1beta` | Gemini | API key |
| **Azure OpenAI Foundry** | your resource host | 443 | `/openai/v1` | OpenAI | API key |
| **AtlasCloud** | `api.atlascloud.ai` | 443 | `/v1` | OpenAI-compatible | API key |
| **Mistral** | `api.mistral.ai` | 443 | `/v1` | OpenAI-compatible | API key |
| **DeepSeek** | `api.deepseek.com` | 443 | `/v1` | OpenAI-compatible | API key |
| **Fireworks AI** | `api.fireworks.ai` | 443 | `/inference/v1` | OpenAI-compatible | API key |
| **MiniMax** | `api.minimax.io` | 443 | `/v1` | OpenAI-compatible | API key |
| **Venice AI** | `api.venice.ai` | 443 | `/api/v1` | OpenAI-compatible | API key |
| **Ollama** | `localhost` | 11434 | `/v1` | OpenAI-compatible | None (local) |
| **Custom** | (you specify) | — | `/v1` | OpenAI-compatible | Optional |

Need something else? Use **Custom** for LM Studio, [OpenCode Zen / Go](#opencode-zen--go), or any other OpenAI-compatible endpoint. To use a Claude Pro/Max subscription through your own Claude Code install, see [Claude Code](#claude-code). For a hosted, zero-setup option tied to your Osaurus account (no key to paste), see [Osaurus Router](/osaurus-router).

### Signing in with OAuth

**OpenAI**, **xAI**, and **OpenRouter** support a **browser sign-in** instead of an API key: pick the provider, click **Sign in**, and authorize in your browser. For OpenAI you can sign in with your **ChatGPT / Codex** account or paste a Platform API key — either works.

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

Add custom HTTP headers for specialized authentication or configuration:

```
X-Custom-Header: value
Authorization: Bearer token
```

Mark headers containing secrets as "secret" to store their values in the Keychain rather than in plain-text configuration.

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

### Provider metadata and multimodal input

During discovery, Osaurus honors positive integer context-window metadata advertised as `max_model_len` (vLLM), `context_length` (OpenRouter and LM Studio), `max_context_length` (llama.cpp), or `context_window`. The resolved value appears in the model picker and drives context budgeting; malformed metadata is ignored for that model without breaking the connection.

For vision-capable providers, image attachments are resized to provider-safe wire dimensions and sent with the corrected MIME type. Osaurus reports unsupported input instead of silently dropping an attachment.

Osaurus also carries per-model profiles for well-known remote models (context window, reasoning controls, which sampler knobs to omit), so newer releases such as OpenAI's GPT-6 Astra are recognized with the right context window and reasoning contract, including when discovered through a ChatGPT / Codex sign-in.

### Prompt caching

Multi-turn chats and agent loops re-send the same system prompt, tool schemas, and history every turn. Osaurus keeps that prefix byte-stable and then enables each provider's own prompt cache, so repeated input bills at the provider's cached rate:

| Provider | What Osaurus sends |
|---|---|
| **OpenAI**, **Azure OpenAI Foundry**, **OpenRouter**, **Osaurus Router** | A session-scoped `prompt_cache_key` (`osaurus-session-{id}`) on every turn, so one conversation stays on one cache shard. OpenRouter also receives `session_id` for sticky upstream routing. |
| **Anthropic** | A top-level `cache_control` marker: a 1-hour TTL when the last message is a user turn, the default 5 minutes when it's a tool result (a tight agent loop). |
| **Gemini** | Nothing — implicit context caching applies automatically. |
| Other OpenAI-compatible hosts (xAI, DeepSeek, Fireworks, Mistral, custom) | Neither field — strict schemas can reject unknown keys, and their caches are automatic where they exist. |

Cached-token counts the provider reports back appear as an **"N cached"** chip in the assistant message footer. No chip means the provider didn't report a cached count, not that nothing was cached.

## Connection states

| State | Indicator | Description |
|---|---|---|
| **Connected** | Green | Active connection, models available |
| **Connecting** | Blue (animated) | Establishing connection |
| **Disconnected** | Gray | Not connected |
| **Disabled** | Gray | Manually disabled |
| **Error** | Red | Connection failed (see error message) |

Enabled providers reconnect automatically after app updates, network recovery, and relaunch. Authentication or contract errors remain visible and require correction; transient transport failures retry without leaving the provider permanently unavailable.

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

Sign in with your **ChatGPT / Codex** account, or paste a Platform API key.

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

### Mistral

```
Host:     api.mistral.ai
Protocol: HTTPS
Base:     /v1
Auth:     API key (console.mistral.ai)
```

Mistral's adjustable reasoning models get a **reasoning effort** control (none / low / medium / high) in the chat settings.

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

Privacy-first, uncensored inference with no data retention. Compatible Venice media models can also appear as explicit remote image/video targets; media requests remain separately consented and constrained by their catalog metadata.

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

### OpenCode (Zen / Go)

Use the **Custom** preset:

```
Host:     opencode.ai
Protocol: HTTPS
Base:     /zen/go/v1   (OpenCode Go)
          /zen/v1      (OpenCode Zen)
Auth:     API key (opencode.ai)
```

Pick the API format by model family: OpenAI for most Go models, Open Responses for Grok and Muse, Anthropic for MiniMax and Qwen (see [OpenCode's docs](https://opencode.ai/docs/go/)).

OpenCode Go rejects requests without an `x-opencode-session` header ("cannot be routed efficiently"). Osaurus adds it automatically for any provider whose host is `opencode.ai` or a subdomain, whatever the API format, with a stable per-conversation value so every turn lands on the same upstream shard. A custom header with the same name takes precedence.

### Claude Code

Drives your own signed-in [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI as a subprocess — the sanctioned way to reach a Claude Pro/Max subscription. Osaurus never mints or stores an Anthropic token; the CLI owns the session.

1. Install Claude Code and run `claude` once in a terminal to sign in
2. **Settings… → Providers → Add Provider → Claude Code**
3. Osaurus finds the `claude` binary and shows its version, account, and plan when it's **Signed in and ready** (use **Re-check** after signing in)

The models appear in the picker as **Claude Code (Sonnet)**, **Claude Code (Opus)**, and **Claude Code (Haiku)** (IDs `claude-code/sonnet`, `claude-code/opus`, `claude-code/haiku`). These are Claude Code's own aliases, so they follow whatever the CLI currently resolves them to.

Once Claude Code is installed (or an agent already uses a Claude Code model), each agent's settings under **Settings… → Agents** get a **Claude Code** section:

| Setting | What it does |
|---|---|
| **Execution mode** | **Agent** — Claude Code runs its own agent loop under your macOS account; Read, Grep, and Glob are allowed by default. **Text only** — every built-in and MCP tool is disabled and the CLI is a plain text generator. |
| **Allow file changes** | Auto-approve Edit, Write, and NotebookEdit, with your macOS file access, starting in the chat folder |
| **Allow shell commands** | Auto-approve Bash under your macOS account — this is **not** the Osaurus Sandbox |
| **Allow Osaurus read tools** | Attach a scoped MCP bridge for Osaurus status, list, describe, and search |
| **Allow Osaurus configuration changes** | Permit agent, provider, model, plugin, and MCP configuration writes (requires read tools) |

The permission toggles apply only in **Agent** mode.

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
- [Global Proxy](/global-proxy) — routing provider traffic through a proxy

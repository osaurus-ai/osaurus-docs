---
title: Integrations
sidebar_label: Integrations
description: Connect Osaurus with MCP clients, IDEs, and your favorite tools
---

# Integration Guide

Osaurus provides multiple integration paths: Remote Providers for cloud AI, MCP Server for AI agents, OpenAI-compatible APIs for existing tools, and Ollama-compatible APIs for additional flexibility.

## MCP Server

Osaurus is a full [Model Context Protocol](https://modelcontextprotocol.io/) (MCP) server. Connect any MCP client to give AI agents access to your installed tools.

### Cursor

Add to your Cursor MCP settings (Settings → Features → MCP Servers):

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

Or edit `~/.cursor/mcp.json` directly.

### Claude Desktop

Add to your Claude Desktop configuration at `~/Library/Application Support/Claude/claude_desktop_config.json`:

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

### Other MCP Clients

Any MCP client that supports stdio transport can connect:

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

The `osaurus mcp` command:

- Proxies MCP protocol over stdio to the running server
- Auto-launches Osaurus if it isn't running
- Exposes all installed tools to the connected client

### HTTP MCP Endpoints

MCP is also available over HTTP:

| Endpoint      | Method | Description            |
| ------------- | ------ | ---------------------- |
| `/mcp/health` | GET    | Check MCP availability |
| `/mcp/tools`  | GET    | List active tools      |
| `/mcp/call`   | POST   | Execute a tool         |

**Example: List tools**

```bash
curl http://127.0.0.1:1337/mcp/tools | jq
```

**Example: Call a tool**

```bash
curl -X POST http://127.0.0.1:1337/mcp/call \
  -H "Content-Type: application/json" \
  -d '{"name": "current_time", "arguments": {}}'
```

## Remote Providers

Osaurus can connect to cloud AI providers, giving you access to remote models alongside your local ones through a unified API.

### Adding a Provider

1. Open the Management window (⌘⇧M)
2. Navigate to **Providers**
3. Click **Add Provider**
4. Choose a preset or configure a custom endpoint

### Supported Presets

| Provider       | Description                                                         |
| -------------- | ------------------------------------------------------------------- |
| **Anthropic**  | Claude models with native API support                               |
| **OpenAI**     | ChatGPT models                                                      |
| **xAI**        | Grok models                                                         |
| **OpenRouter** | Access multiple providers (Anthropic, Google, etc.) through one API |
| **Ollama**     | Connect to a local or remote Ollama instance                        |
| **LM Studio**  | Use LM Studio as a backend                                          |
| **Custom**     | Any OpenAI-compatible endpoint                                      |

### Features

- **Secure API Key Storage** — Keys are stored in macOS Keychain, never in plain text
- **Custom Headers** — Add authentication headers for custom endpoints
- **Auto-Connect on Launch** — Automatically reconnect to providers when Osaurus starts
- **Connection Health Monitoring** — Real-time status indicators show provider availability

### Configuration Options

When adding a custom provider:

| Field              | Description                                      |
| ------------------ | ------------------------------------------------ |
| **Name**           | Display name for the provider                    |
| **Base URL**       | API endpoint (e.g., `https://api.openai.com/v1`) |
| **API Key**        | Authentication key (stored securely in Keychain) |
| **Custom Headers** | Additional headers for authentication            |
| **Auto-Connect**   | Connect automatically on launch                  |

### Using Remote Models

Once connected, remote models appear alongside local models in the Model Manager and Chat UI. Use them via the API:

```bash
# Use a remote OpenAI model
curl http://127.0.0.1:1337/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

Remote models are available to all connected MCP clients and integrate seamlessly with tool calling.

## OpenAI SDK Integration

### Python

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://127.0.0.1:1337/v1",
    api_key="osaurus"  # Any value works
)

response = client.chat.completions.create(
    model="llama-3.2-3b-instruct-4bit",
    messages=[{"role": "user", "content": "Hello!"}]
)

print(response.choices[0].message.content)
```

### Streaming

```python
stream = client.chat.completions.create(
    model="llama-3.2-3b-instruct-4bit",
    messages=[{"role": "user", "content": "Tell me a story"}],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="")
```

### JavaScript/TypeScript

```javascript
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "http://127.0.0.1:1337/v1",
  apiKey: "osaurus",
});

const response = await client.chat.completions.create({
  model: "llama-3.2-3b-instruct-4bit",
  messages: [{ role: "user", content: "Hello!" }],
});

console.log(response.choices[0].message.content);
```

## LangChain Integration

```python
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage

llm = ChatOpenAI(
    base_url="http://127.0.0.1:1337/v1",
    api_key="osaurus",
    model="llama-3.2-3b-instruct-4bit"
)

response = llm.invoke([HumanMessage(content="Hello!")])
print(response.content)
```

### With Chains

```python
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful translator."),
    ("human", "Translate to French: {text}")
])

chain = prompt | llm | StrOutputParser()
result = chain.invoke({"text": "Hello, world!"})
```

## LlamaIndex Integration

```python
from llama_index.llms.openai import OpenAI
from llama_index.core import Settings

Settings.llm = OpenAI(
    api_base="http://127.0.0.1:1337/v1",
    api_key="osaurus",
    model="llama-3.2-3b-instruct-4bit"
)
```

## IDE Integrations

### Continue.dev (VS Code / JetBrains)

Add to `~/.continue/config.json`:

```json
{
  "models": [
    {
      "title": "Osaurus Local",
      "provider": "openai",
      "model": "llama-3.2-3b-instruct-4bit",
      "apiBase": "http://127.0.0.1:1337/v1",
      "apiKey": "osaurus"
    }
  ]
}
```

### Cursor (as OpenAI Provider)

In Cursor settings, add a custom OpenAI-compatible model:

1. Open Settings → Models
2. Add OpenAI-compatible endpoint
3. Base URL: `http://127.0.0.1:1337/v1`
4. Model: `llama-3.2-3b-instruct-4bit`
5. API Key: `osaurus`

## Native App Integration

### Swift/macOS

Use the shared configuration to discover running Osaurus instances:

```swift
import Foundation

// Discover Osaurus
let instance = try OsaurusDiscoveryService.discoverLatestRunningInstance()

// Make API request
let url = instance.url.appendingPathComponent("v1/chat/completions")
var request = URLRequest(url: url)
request.httpMethod = "POST"
request.setValue("application/json", forHTTPHeaderField: "Content-Type")

let body: [String: Any] = [
    "model": "llama-3.2-3b-instruct-4bit",
    "messages": [["role": "user", "content": "Hello!"]]
]
request.httpBody = try JSONSerialization.data(withJSONObject: body)

let (data, _) = try await URLSession.shared.data(for: request)
```

See the [Shared Configuration](/shared-configuration) guide for the complete discovery implementation.

### Electron

```javascript
// main/index.js
const { discoverLatestRunningInstance } = require("./osaurus-discovery");

ipcMain.handle("osaurus:chat", async (event, message) => {
  const instance = await discoverLatestRunningInstance();

  const response = await fetch(`${instance.url}/v1/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama-3.2-3b-instruct-4bit",
      messages: [{ role: "user", content: message }],
    }),
  });

  return response.json();
});
```

## Ollama-Compatible Clients

### OllamaKit (Swift)

```swift
import OllamaKit

let client = OllamaKit(baseURL: URL(string: "http://127.0.0.1:1337")!)

let response = try await client.chat(
    model: "llama-3.2-3b-instruct-4bit",
    messages: [.user("Hello!")]
)
```

### Python (Ollama Format)

```python
import requests

response = requests.post(
    "http://127.0.0.1:1337/api/chat",
    json={
        "model": "llama-3.2-3b-instruct-4bit",
        "messages": [{"role": "user", "content": "Hello!"}],
        "stream": False
    }
)

print(response.json()["message"]["content"])
```

## Web Applications

### React

```jsx
async function chat(message) {
  const response = await fetch("http://127.0.0.1:1337/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama-3.2-3b-instruct-4bit",
      messages: [{ role: "user", content: message }],
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
}
```

### Next.js API Route

```javascript
// app/api/chat/route.js
export async function POST(request) {
  const { message } = await request.json();

  const response = await fetch("http://127.0.0.1:1337/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama-3.2-3b-instruct-4bit",
      messages: [{ role: "user", content: message }],
    }),
  });

  return Response.json(await response.json());
}
```

## Authentication with Access Keys

By default, Osaurus does not require authentication for local requests. When exposing your server to external clients — especially via [Relay](/relay) — you should use access keys to protect API endpoints.

Access keys use the `osk-v1` format and are created through the [Identity](/identity) system. Pass them as a Bearer token:

```bash
curl http://127.0.0.1:1337/v1/chat/completions \
  -H "Authorization: Bearer osk-v1.<payload>.<signature>" \
  -H "Content-Type: application/json" \
  -d '{"model": "llama-3.2-3b-instruct-4bit", "messages": [{"role":"user","content":"Hello!"}]}'
```

With the OpenAI SDK, pass the access key as the `api_key`:

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://127.0.0.1:1337/v1",
    api_key="osk-v1.<payload>.<signature>"
)
```

Access keys can be scoped to a specific agent or your entire identity. See [Identity — Access Keys](/identity#access-keys) for details on creating, scoping, and revoking keys.

## Integration Checklist

- [ ] **Choose integration method** — MCP, OpenAI SDK, or direct API
- [ ] **Configure base URL** — `http://127.0.0.1:1337` (or custom port)
- [ ] **Set model name** — Use lowercase with hyphens
- [ ] **Set up authentication** — Create an [access key](/identity#access-keys) if exposing endpoints externally
- [ ] **Handle streaming** — Enable for better UX
- [ ] **Install tools** — If using MCP, install needed plugins
- [ ] **Test error handling** — Handle connection and model errors

## Troubleshooting

### Connection Refused

- Verify Osaurus is running: `osaurus status`
- Check port matches configuration
- Ensure firewall allows localhost connections

### MCP Tools Not Appearing

- Verify tools are installed: `osaurus tools list`
- Restart your MCP client after installing tools
- Check `osaurus mcp` runs without errors

### Model Not Found

- List available models: `curl http://127.0.0.1:1337/v1/models`
- Use exact model name from list
- Download model if needed via Model Manager

### CORS Errors (Browser)

- CORS is enabled by default for all origins
- Verify request includes correct headers
- Check browser console for specific error

---

<p align="center">
  For integration help, check our <a href="/sdk-examples">SDK Examples</a> or join <a href="https://discord.gg/dinoki">Discord</a>.
</p>

---
title: HTTP API
sidebar_label: HTTP API
description: OpenAI, Anthropic, Open Responses, Ollama, MCP, and Memory endpoints. Drop-in compatible at the same port.
---

# HTTP API

Osaurus serves four well-known chat APIs side-by-side at the same port — OpenAI, Anthropic, Open Responses, Ollama — plus MCP server endpoints, the Memory API, and a few Osaurus-specific paths. Pick whichever your SDK already speaks.

## Compatible APIs

Drop-in endpoints for existing tools and SDKs:

| API       | Endpoint                                    |
| --------- | ------------------------------------------- |
| OpenAI    | http://127.0.0.1:1337/v1/chat/completions   |
| Anthropic | http://127.0.0.1:1337/anthropic/v1/messages |
| Ollama    | http://127.0.0.1:1337/api/chat              |

All prefixes supported (`/v1`, `/api`, `/v1/api`). Full function calling with streaming tool call deltas.

## Base URL

```
http://127.0.0.1:1337
```

Override the port with the `OSU_PORT` environment variable.

## Endpoints Overview

### Core API

| Endpoint | Method | Description |
| -------- | ------ | ----------- |
| `/` | GET | Server status (plain text) |
| `/health` | GET | Health check (JSON) |
| `/v1/models` | GET | List available models (OpenAI) |
| `/v1/tags` | GET | List available models (Ollama) |
| `/v1/chat/completions` | POST | Chat completion (OpenAI) |
| `/v1/responses` | POST | Responses (Open Responses) |
| `/anthropic/v1/messages` | POST | Chat completion (Anthropic) |
| `/api/chat` | POST | Chat completion (Ollama) |

### Memory Endpoints

| Endpoint | Method | Description |
| -------- | ------ | ----------- |
| `/memory/ingest` | POST | Bulk-ingest conversation turns for memory extraction |
| `/agents` | GET | List agents with pinned-fact counts |

### Server-side agent loop

| Endpoint | Method | Description |
| -------- | ------ | ----------- |
| `/agents/{id}/run` | POST | Server-side autonomous tool loop (executes tools, manages iteration budget, streams hints) |

### MCP Endpoints

| Endpoint | Method | Description |
| -------- | ------ | ----------- |
| `/mcp/health` | GET | MCP server health |
| `/mcp/tools` | GET | List available tools |
| `/mcp/call` | POST | Execute a tool |

### Identity / pairing

| Endpoint | Method | Description |
| -------- | ------ | ----------- |
| `/pair` | POST | Bonjour pairing handshake (mints an `osk-v1` access key after user approval) |

## Core Endpoints

### GET /

Simple status check returning plain text.

**Response:**

```
Osaurus is running
```

### GET /health

Health check endpoint returning JSON status.

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2024-03-15T10:30:45Z"
}
```

### GET /v1/models

List all available models in OpenAI format.

**Response:**

```json
{
  "object": "list",
  "data": [
    {
      "id": "gemma-4-e2b-it-4bit",
      "object": "model",
      "created": 1234567890,
      "owned_by": "osaurus"
    },
    {
      "id": "foundation",
      "object": "model",
      "created": 1234567890,
      "owned_by": "apple"
    }
  ]
}
```

### GET /v1/tags

List all available models in Ollama format. Also available at `/api/tags`.

**Response:**

```json
{
  "models": [
    {
      "name": "gemma-4-e2b-it-4bit",
      "size": 2147483648,
      "digest": "sha256:abcd1234...",
      "modified_at": "2024-03-15T10:30:45Z"
    }
  ]
}
```

### POST /v1/chat/completions

Create a chat completion using OpenAI format.

:::info Tool calling semantics
`/v1/chat/completions` follows **strict OpenAI semantics**: when the model emits `tool_calls`, the response (or final SSE chunk) returns those calls and the **client is expected to execute them and POST the results back** in the next request. Osaurus deliberately does **not** auto-execute tools on this endpoint, so it can serve as a drop-in backend for harnesses that already manage their own tool loop.

If you want server-side autonomous tool loops, use `POST /agents/{id}/run` instead — it executes tools, manages the iteration budget (max 30), and streams hint frames. To expose Osaurus tools to a remote MCP harness, use `/mcp/tools` + `/mcp/call`.
:::

**Request Body:**

```json
{
  "model": "gemma-4-e2b-it-4bit",
  "messages": [
    {
      "role": "system",
      "content": "You are a helpful assistant."
    },
    {
      "role": "user",
      "content": "Hello, how are you?"
    }
  ],
  "max_tokens": 1000,
  "temperature": 0.7,
  "top_p": 0.9,
  "stream": false,
  "tools": []
}
```

**Parameters:**

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `model` | string | Yes | Model ID to use |
| `messages` | array | Yes | Array of message objects |
| `max_tokens` | integer | No | Maximum tokens to generate (default: 2048) |
| `temperature` | float | No | Sampling temperature 0-2 (default: 0.7) |
| `top_p` | float | No | Nucleus sampling threshold (default: 0.9) |
| `stream` | boolean | No | Enable SSE streaming (default: false) |
| `tools` | array | No | Function/tool definitions |
| `tool_choice` | string/object | No | Tool selection strategy |
| `session_id` | string | No | Reuse the same conversation's KV cache across turns (per `(model, session_id)`) |

**Response (Non-streaming):**

```json
{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1234567890,
  "model": "gemma-4-e2b-it-4bit",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "I'm doing well, thank you! How can I help you today?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 25,
    "completion_tokens": 15,
    "total_tokens": 40
  }
}
```

**Response (Streaming):**

```
data: {"id":"chatcmpl-123","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"role":"assistant"},"finish_reason":null}]}

data: {"id":"chatcmpl-123","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"content":"I'm"},"finish_reason":null}]}

data: {"id":"chatcmpl-123","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"content":" doing"},"finish_reason":null}]}

data: {"id":"chatcmpl-123","object":"chat.completion.chunk","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

data: [DONE]
```

#### Prefix caching and `prefix_hash`

KV cache reuse across requests is **automatic and content-addressed** — vmlx-swift-lm's `CacheCoordinator` matches shared prefix tokens (system prompt, tools, prior turns) without any client-side cache key.

For visibility, every response carries a `prefix_hash` field — a stable hash of the system prompt + tool names that produced this generation. Clients can use it to detect when the system prefix changed across requests:

```json
{ "prefix_hash": "a1b2c3d4e5f67890..." }
```

`prefix_hash` is informational only. Keep `session_id` stable per conversation so chat history and preflight bookkeeping group correctly; cache reuse itself does not depend on it.

### POST /agents/&#123;id&#125;/run

Server-side autonomous tool loop. Use this when you want Osaurus to execute tools on your behalf, manage the iteration budget, stream tool-execution hints, and only return when the model is done. (This is the path the in-app chat UI uses.)

- Each pending `tool_call` is executed against the registered `ToolRegistry` (sandbox, folder, MCP, plugin tools — everything the agent has access to)
- Independent tool calls within a single model turn run **in parallel**
- The loop is capped at 30 iterations; if the budget is exhausted while still requesting tools, a notice is appended to the stream
- Honors client-supplied `tools` (merged with the agent's always-loaded set) and `tool_choice`

### POST /api/chat

Create a chat completion using Ollama format.

**Request Body:**

```json
{
  "model": "gemma-4-e2b-it-4bit",
  "messages": [
    {
      "role": "user",
      "content": "Why is the sky blue?"
    }
  ],
  "stream": false,
  "options": {
    "temperature": 0.7,
    "top_p": 0.9,
    "num_predict": 1000
  }
}
```

**Response:**

```json
{
  "model": "gemma-4-e2b-it-4bit",
  "created_at": "2024-03-15T10:30:45Z",
  "message": {
    "role": "assistant",
    "content": "The sky appears blue due to Rayleigh scattering..."
  },
  "done": true,
  "total_duration": 1234567890,
  "eval_count": 85
}
```

### POST /v1/responses

Create a response using the Open Responses format. This endpoint provides multi-provider interoperability, allowing you to use the same request format across different AI providers.

**Request Body:**

```json
{
  "model": "gemma-4-e2b-it-4bit",
  "input": "What is the capital of France?",
  "instructions": "You are a helpful assistant.",
  "max_output_tokens": 1000,
  "temperature": 0.7,
  "stream": false
}
```

**Parameters:**

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `model` | string | Yes | Model ID to use |
| `input` | string/array | Yes | Input text or array of message objects |
| `instructions` | string | No | System instructions for the model |
| `max_output_tokens` | integer | No | Maximum tokens to generate |
| `temperature` | float | No | Sampling temperature 0-2 (default: 0.7) |
| `top_p` | float | No | Nucleus sampling threshold |
| `stream` | boolean | No | Enable SSE streaming (default: false) |
| `tools` | array | No | Tool definitions for function calling |

**Response (Non-streaming):**

```json
{
  "id": "resp_123",
  "object": "response",
  "created_at": 1234567890,
  "model": "gemma-4-e2b-it-4bit",
  "output": [
    {
      "type": "message",
      "role": "assistant",
      "content": [
        {
          "type": "output_text",
          "text": "The capital of France is Paris."
        }
      ]
    }
  ],
  "usage": {
    "input_tokens": 15,
    "output_tokens": 8,
    "total_tokens": 23
  }
}
```

**Response (Streaming):**

When `stream: true`, responses are sent as Server-Sent Events:

```
event: response.created
data: {"type":"response.created","response":{"id":"resp_123","object":"response","model":"gemma-4-e2b-it-4bit"}}

event: response.output_item.added
data: {"type":"response.output_item.added","output_index":0,"item":{"type":"message","role":"assistant"}}

event: response.content_part.added
data: {"type":"response.content_part.added","output_index":0,"content_index":0,"part":{"type":"output_text","text":""}}

event: response.output_text.delta
data: {"type":"response.output_text.delta","output_index":0,"content_index":0,"delta":"The"}

event: response.output_text.delta
data: {"type":"response.output_text.delta","output_index":0,"content_index":0,"delta":" capital"}

event: response.output_text.done
data: {"type":"response.output_text.done","output_index":0,"content_index":0,"text":"The capital of France is Paris."}

event: response.completed
data: {"type":"response.completed","response":{"id":"resp_123","status":"completed"}}
```

**Example with cURL:**

```bash
curl http://127.0.0.1:1337/v1/responses \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemma-4-e2b-it-4bit",
    "input": "What is the capital of France?"
  }'
```

**Example with conversation history:**

```json
{
  "model": "gemma-4-e2b-it-4bit",
  "input": [
    {"role": "user", "content": "What is the capital of France?"},
    {"role": "assistant", "content": "The capital of France is Paris."},
    {"role": "user", "content": "What is its population?"}
  ],
  "instructions": "You are a helpful geography assistant."
}
```

### POST /anthropic/v1/messages

Create a chat completion using Anthropic format. This endpoint is compatible with the Anthropic Claude API. Also available at `/messages` for backwards compatibility.

**Request Body:**

```json
{
  "model": "gemma-4-e2b-it-4bit",
  "max_tokens": 1024,
  "messages": [
    {
      "role": "user",
      "content": "Hello, how are you?"
    }
  ],
  "system": "You are a helpful assistant.",
  "stream": false
}
```

**Parameters:**

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `model` | string | Yes | Model ID to use |
| `messages` | array | Yes | Array of message objects |
| `max_tokens` | integer | Yes | Maximum tokens to generate |
| `system` | string | No | System prompt (Anthropic style) |
| `temperature` | float | No | Sampling temperature 0-1 (default: 1.0) |
| `top_p` | float | No | Nucleus sampling threshold |
| `top_k` | integer | No | Top-k sampling |
| `stream` | boolean | No | Enable SSE streaming (default: false) |
| `stop_sequences` | array | No | Sequences that stop generation |

**Response (Non-streaming):**

```json
{
  "id": "msg_123",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "I'm doing well, thank you! How can I help you today?"
    }
  ],
  "model": "gemma-4-e2b-it-4bit",
  "stop_reason": "end_turn",
  "usage": {
    "input_tokens": 25,
    "output_tokens": 15
  }
}
```

**Response (Streaming):**

When `stream: true`, responses are sent as Server-Sent Events:

```
event: message_start
data: {"type":"message_start","message":{"id":"msg_123","type":"message","role":"assistant","content":[],"model":"gemma-4-e2b-it-4bit"}}

event: content_block_start
data: {"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"I'm"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" doing"}}

event: content_block_stop
data: {"type":"content_block_stop","index":0}

event: message_delta
data: {"type":"message_delta","delta":{"stop_reason":"end_turn"},"usage":{"output_tokens":15}}

event: message_stop
data: {"type":"message_stop"}
```

**Example with Python (Anthropic SDK):**

```python
import anthropic

client = anthropic.Anthropic(
    base_url="http://127.0.0.1:1337/anthropic",
    api_key="osaurus"  # Any value works
)

message = client.messages.create(
    model="gemma-4-e2b-it-4bit",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Hello!"}
    ]
)

print(message.content[0].text)
```

**Example with cURL:**

```bash
curl http://127.0.0.1:1337/anthropic/v1/messages \
  -H "Content-Type: application/json" \
  -H "x-api-key: osaurus" \
  -d '{
    "model": "gemma-4-e2b-it-4bit",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

## MCP Endpoints

### GET /mcp/health

Check MCP server availability.

**Response:**

```json
{
  "status": "ok",
  "tools_available": 12
}
```

### GET /mcp/tools

List all available MCP tools from installed plugins.

**Response:**

```json
{
  "tools": [
    {
      "name": "read_file",
      "description": "Read contents of a file",
      "inputSchema": {
        "type": "object",
        "properties": {
          "path": {
            "type": "string",
            "description": "Path to the file"
          }
        },
        "required": ["path"]
      }
    },
    {
      "name": "browser_navigate",
      "description": "Navigate to a URL in the browser",
      "inputSchema": {
        "type": "object",
        "properties": {
          "url": {
            "type": "string",
            "description": "URL to navigate to"
          }
        },
        "required": ["url"]
      }
    }
  ]
}
```

### POST /mcp/call

Execute an MCP tool.

**Request Body:**

```json
{
  "name": "read_file",
  "arguments": {
    "path": "/etc/hosts"
  }
}
```

**Response:**

```json
{
  "content": [
    {
      "type": "text",
      "text": "# Host Database\n127.0.0.1 localhost\n..."
    }
  ]
}
```

**Error Response:**

```json
{
  "error": {
    "code": "tool_not_found",
    "message": "Tool 'unknown_tool' not found"
  }
}
```

## Memory API

Osaurus exposes its [memory system](/memory) through the HTTP API, so any OpenAI-compatible client can benefit from persistent, on-device personalization.

### Memory Context Injection — `X-Osaurus-Agent-Id`

Add the `X-Osaurus-Agent-Id` header to any `POST /v1/chat/completions` request. Osaurus runs the relevance gate against the latest user message, picks at most one memory section (identity, pinned facts, episodes, or transcript), and prepends it — together with always-on identity overrides — to the user message.

The header value is an arbitrary string identifying the agent whose memory should be retrieved. When the header is absent or empty, the request is processed normally without memory injection.

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://127.0.0.1:1337/v1",
    api_key="osaurus",
    default_headers={"X-Osaurus-Agent-Id": "my-agent"},
)

response = client.chat.completions.create(
    model="your-model-name",
    messages=[{"role": "user", "content": "What did we talk about last time?"}],
)
```

### POST /memory/ingest

Bulk-ingest conversation turns so the memory system can learn from them. Useful for seeding memory from existing chat logs, migrating from another system, or running benchmarks. Distillation flushes immediately at the end of the batch — you do not have to wait for the writer's debounce.

**Request Body:**

```json
{
  "agent_id": "my-agent",
  "conversation_id": "session-1",
  "turns": [
    {"user": "Hi, my name is Alice", "assistant": "Hello Alice! Nice to meet you."},
    {"user": "I work at Acme Corp", "assistant": "Got it, you work at Acme Corp."}
  ]
}
```

**Parameters:**

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `agent_id` | string | Yes | Identifier for the agent whose memory is being populated |
| `conversation_id` | string | Yes | Identifier for the conversation session |
| `turns` | array | Yes | Array of turn objects, each with `user` and `assistant` string fields |
| `session_date` | string | No | Optional ISO 8601 date for the whole batch |
| `skip_extraction` | bool | No | When `true`, only insert transcript rows; skip distillation |

Distillation produces an episode and (when warranted) a small set of pinned facts. Response: `{"status":"ok","turns_ingested":N}`.

**Example with cURL:**

```bash
curl http://127.0.0.1:1337/memory/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "my-agent",
    "conversation_id": "session-1",
    "turns": [
      {"user": "Hi, my name is Alice", "assistant": "Hello Alice! Nice to meet you."},
      {"user": "I work at Acme Corp", "assistant": "Got it, you work at Acme Corp."}
    ]
  }'
```

### GET /agents

Returns all configured agents with their pinned-fact counts. Use this to discover valid agent IDs for the `X-Osaurus-Agent-Id` header.

**Example with cURL:**

```bash
curl http://127.0.0.1:1337/agents
```

**Response:**

```json
{
  "agents": [
    {
      "id": "00000000-0000-0000-0000-000000000001",
      "name": "Osaurus",
      "description": "Default assistant",
      "default_model": null,
      "supports_vision": false,
      "is_built_in": true,
      "memory_entry_count": 42,
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

`supports_vision` reflects whether the agent's effective model is a VLM, so clients can show or hide image-attach UI without round-tripping the model registry.

## Function Calling

Osaurus supports OpenAI-style function calling for structured interactions.

### Defining Tools

```json
{
  "model": "gemma-4-e2b-it-4bit",
  "messages": [
    {"role": "user", "content": "What's the weather in San Francisco?"}
  ],
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "get_weather",
        "description": "Get the current weather in a location",
        "parameters": {
          "type": "object",
          "properties": {
            "location": {
              "type": "string",
              "description": "The city and state"
            },
            "unit": {
              "type": "string",
              "enum": ["celsius", "fahrenheit"]
            }
          },
          "required": ["location"]
        }
      }
    }
  ]
}
```

### Response with Tool Call

```json
{
  "id": "chatcmpl-123",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": null,
        "tool_calls": [
          {
            "id": "call_abc123",
            "type": "function",
            "function": {
              "name": "get_weather",
              "arguments": "{\"location\":\"San Francisco, CA\",\"unit\":\"fahrenheit\"}"
            }
          }
        ]
      },
      "finish_reason": "tool_calls"
    }
  ]
}
```

### Tool Choice Options

- `"auto"` — Model decides whether to use tools (default)
- `"none"` — Disable tool usage
- `{"type": "function", "function": {"name": "function_name"}}` — Force specific function

## Authentication

For local clients (loopback connections to `127.0.0.1`), Osaurus accepts requests without authentication. Most SDKs require *some* API key string — pass anything:

```python
client = OpenAI(
    base_url="http://127.0.0.1:1337/v1",
    api_key="osaurus"
)
```

For LAN, Relay, or any non-loopback caller, send an [`osk-v1` access key](/identity#access-keys) as a Bearer token:

```bash
curl http://your-mac.local:1337/v1/chat/completions \
  -H "Authorization: Bearer osk-v1.eyJpc3M…" \
  -H "Content-Type: application/json" \
  -d '{...}'
```

Or as the OpenAI SDK's `api_key`:

```python
client = OpenAI(
    base_url="http://your-mac.local:1337/v1",
    api_key="osk-v1.eyJpc3M..."
)
```

Anthropic SDK uses `x-api-key` instead of `Authorization`:

```python
client = anthropic.Anthropic(
    base_url="http://your-mac.local:1337/anthropic",
    api_key="osk-v1.eyJpc3M..."
)
```

Access keys can be **master-scoped** (any agent) or **agent-scoped** (one specific agent), with optional expiration and revocation. [Identity & Access →](/identity)

### Pre-auth body-size limits

Osaurus rejects oversized request bodies *before* the auth gate runs, so an unauthenticated caller can't exhaust host memory.

| Endpoint | Limit |
|---|---|
| `POST /pair` | 64 KiB |
| Other public HTTP routes | 32 MiB |
| Sandbox host bridge | 8 MiB |

Both servers enforce the cap with a `Content-Length` pre-check at request head and a streaming guard at body chunks, so chunked clients and clients that lie about their declared length both hit `413 Payload Too Large`.

## Error Handling

Errors follow the OpenAI error format:

```json
{
  "error": {
    "message": "Model not found: gpt-4",
    "type": "invalid_request_error",
    "code": "model_not_found"
  }
}
```

**Common Error Codes:**

| Code | Description |
| ---- | ----------- |
| `model_not_found` | Requested model doesn't exist |
| `invalid_request` | Malformed request body |
| `context_length_exceeded` | Input exceeds model's context window |
| `tool_not_found` | MCP tool not installed |
| `internal_server_error` | Server-side error |

## CORS Support

Built-in CORS support for browser-based applications:

- **Allowed Origins:** `*` (all origins)
- **Allowed Methods:** `GET, POST, OPTIONS`
- **Allowed Headers:** `Content-Type, Authorization`

## Quick Examples

### Python (OpenAI SDK)

```python
from openai import OpenAI

client = OpenAI(base_url="http://127.0.0.1:1337/v1", api_key="osaurus")

response = client.chat.completions.create(
    model="gemma-4-e2b-it-4bit",
    messages=[{"role": "user", "content": "Hello!"}]
)
print(response.choices[0].message.content)
```

### cURL

```bash
curl http://127.0.0.1:1337/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemma-4-e2b-it-4bit",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

### MCP Tool Call

```bash
curl -X POST http://127.0.0.1:1337/mcp/call \
  -H "Content-Type: application/json" \
  -d '{
    "name": "current_time",
    "arguments": {}
  }'
```

---

**Related:**

- [SDK Examples](/sdk-examples) — Python, JS, Anthropic SDK, Open Responses
- [Integrations](/integrations) — wiring Osaurus into Cursor, Claude Desktop, etc.
- [Tool Contract](/tool-contract) — envelope shape for every tool
- [Memory](/memory) — what `X-Osaurus-Agent-Id` does under the hood
- [Identity & Access](/identity) — minting and revoking `osk-v1` keys
- [Inference Runtime](/inference-runtime) — KV cache, batching, model leases

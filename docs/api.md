---
title: HTTP API
sidebar_label: HTTP API
description: OpenAI, Anthropic, Open Responses, Ollama, MCP, Memory, media, and loopback configuration endpoints at the same port.
---

# HTTP API

Osaurus serves four chat APIs at the same port — OpenAI, Anthropic, Open Responses, and Ollama — plus MCP, Memory, media, agent-loop, and loopback configuration endpoints. Use whichever your SDK already speaks.

## Compatible APIs

Drop-in endpoints for existing tools and SDKs:

| API       | Endpoint                                    |
| --------- | ------------------------------------------- |
| OpenAI    | http://127.0.0.1:1337/v1/chat/completions   |
| Anthropic | http://127.0.0.1:1337/v1/messages           |
| Ollama    | http://127.0.0.1:1337/api/chat              |

The router normalizes `/v1`, `/api`, and `/v1/api` prefixes before dispatch. Full function calling with streaming tool call deltas.

:::note[Anthropic path at this baseline]
Upstream overview copy calls `/anthropic/v1/messages` canonical, but the pinned server handler registers `/messages` and its normalized `/v1/messages` alias. Direct local examples therefore use the registered `/v1/messages` route; this guide does not claim the `/anthropic`-prefixed path is an alias.
:::

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
| `/v1/completions` | POST | Text completion, including fill-in-middle (OpenAI) |
| `/v1/responses` | POST | Responses (Open Responses) |
| `/v1/messages` | POST | Chat completion (Anthropic) |
| `/api/chat` | POST | Chat completion (Ollama) |
| `/api/generate` | POST | Text generation (Ollama) |
| `/api/show` | POST | Model metadata (Ollama) |
| `/v1/embeddings` | POST | Text embeddings (OpenAI) |
| `/api/embed` | POST | Text embeddings (Ollama) |
| `/v1/audio/transcriptions` | POST | Speech-to-text with the on-device engine (OpenAI-compatible) |

### Image endpoints

| Endpoint | Method | Description |
| -------- | ------ | ----------- |
| `/v1/images/generations` | POST | Text-to-image with an explicit local, remote-provider, or Osaurus Cloud target |
| `/v1/images/edits` | POST | Local image editing (edit-capable models) |
| `/v1/images/upscale` | POST | Local image upscaling (upscale-capable models) |
| `/v1/images/cancel` | POST | Cancel an in-flight image job |
| `/v1/images/models` | GET | List installed local image models with per-model capabilities (`generations`, `edits`, `upscale`) |

### Video endpoints

| Endpoint | Method | Description |
| -------- | ------ | ----------- |
| `/v1/videos/quote` | POST | Get a short-lived quote for text-to-video or image-to-video |
| `/v1/videos/generations` | POST | Start a quoted durable cloud video job |
| `/v1/videos/jobs/{id}` | GET | Poll durable job status |
| `/v1/videos/jobs/{id}/content` | GET | Download completed `video/mp4` content |

See [Image & Video Generation](/image-generation) for model setup, consent, and examples.

### Declarative configuration

These routes are intentionally loopback-only:

| Endpoint | Method | Description |
| -------- | ------ | ----------- |
| `/admin/config/export?format=yaml|json` | GET | Export current desired state without secrets |
| `/admin/config/schema?format=yaml|json` | GET | Get the annotated YAML reference or JSON Schema |
| `/admin/config/plan` | POST | Validate and preview a YAML/JSON document |
| `/admin/config/apply` | POST | Apply a planned desired state |

### Memory Endpoints

| Endpoint | Method | Description |
| -------- | ------ | ----------- |
| `/memory/ingest` | POST | Bulk-ingest conversation turns for memory extraction |
| `/agents` | GET | List custom agents with memory entry counts (episodes + active pinned facts) |

### Server-side agent loop

| Endpoint | Method | Description |
| -------- | ------ | ----------- |
| `/agents/{id}/run` | POST | Server-side autonomous tool loop (executes tools, manages iteration budget, streams hints) |
| `/agents/{id}/dispatch` | POST | Fire-and-forget detached task — returns immediately with a task id |
| `/tasks/{task_id}` | GET | Poll a detached task's status and result |
| `/tasks/{task_id}` | DELETE | Cancel a detached task |
| `/tasks/{task_id}/clarify` | POST | Answer a clarifying question a detached task is waiting on |

### MCP Endpoints

| Endpoint | Method | Description |
| -------- | ------ | ----------- |
| `/mcp/health` | GET | MCP HTTP transport liveness |
| `/mcp/tools` | GET | List currently registered, enabled, externally exposed tools |
| `/mcp/call` | POST | Execute a tool |

### Identity / pairing / secure channel

| Endpoint | Method | Description |
| -------- | ------ | ----------- |
| `/pair/challenge` | GET | Fetch a pairing challenge nonce |
| `/pair` | POST | Bonjour pairing handshake (mints an `osk-v1` access key after user approval) |
| `/pair-invite` | POST | Redeem an out-of-band pairing invite |
| `/secure/session` | POST | Establish an end-to-end-encrypted [Secure Channel](/secure-channel) session |
| `/secure/call` | POST | Invoke a route through an established Secure Channel envelope |

Path prefixes are normalized before handler matching: `/v1/…`, `/api/…`, and `/v1/api/…` resolve to the same registered route, so `/v1/chat/completions` and `/chat/completions` are equivalent.

:::note[Public vs. internal routes]
Most `/admin/*` routes are app diagnostics and not a stable public contract. The `/admin/config/*` family is the supported exception for local automation, but remains loopback-only and must never be exposed over LAN.
:::

## Declarative configuration

The config API uses the same strict planner and applier as `osaurus config` and the Orchestrator. It requires a physical `127.0.0.1` or `::1` connection; relay traffic and remote access-key callers cannot authorize it, even when the server is exposed.

Export or inspect the schema:

```bash
curl 'http://127.0.0.1:1337/admin/config/export?format=yaml'
curl 'http://127.0.0.1:1337/admin/config/schema?format=json'
```

Plan a document without changing anything:

```bash
curl http://127.0.0.1:1337/admin/config/plan \
  -H "Content-Type: application/json" \
  -d '{
    "yaml": "version: 1\nmemory:\n  enabled: true\n",
    "prune": false
  }'
```

Apply uses the same body at `POST /admin/config/apply`. A high-risk response lists the risks and requires a second request with `"confirm_high_risk": true`. `prune` deletes unlisted entities only from sections declared in the document.

Secrets are never exported and raw credentials are not accepted in documents. Use `env:` or `keychain:` references, or an interactive credential-sheet request. See [Declarative configuration](/configuration#declarative-configuration).

## Cloud media jobs

Remote image requests add a target and explicit spend consent to the normal image body:

```json
{
  "prompt": "a cinematic dinosaur observatory",
  "target": {
    "backend": "osaurus_cloud",
    "model": "provider/model"
  },
  "aspect_ratio": "16:9",
  "allow_remote_media_spend": true
}
```

`target.backend` is `local`, `remote_provider`, or `osaurus_cloud`; `remote_provider` also requires `provider_id` and currently recognizes configured Venice providers. Osaurus enforces the selected catalog model's advertised sizes, aspect ratios, quality options, and other constraints. A bare `model` selects a local bundle. Local generation currently returns one image; remote generation accepts `n` from 1–4.

Video generation is quote-bound:

1. `POST /v1/videos/quote` with `target`, `duration`, and optional `aspect_ratio`, `resolution`, `audio`, or source image details.
2. Review the returned `quote_usd`, `quote_token`, and expiry.
3. `POST /v1/videos/generations` with the same generation fields, `quote_token`, and `allow_remote_media_spend: true`.
4. Poll `GET /v1/videos/jobs/{id}` and retrieve `/content` after completion.

Jobs and their idempotency records survive disconnects and relaunches. Changed or expired quotes fail instead of silently changing the charge. See [Image & Video Generation](/image-generation).

## Core Endpoints

### GET /

Simple status check returning plain text.

**Response:**

```
Osaurus Server is running! 🦕
```

### GET /health

Health check endpoint returning liveness plus current runtime diagnostics. It includes model residency and contention, memory/persistence state, hardware and RAM feasibility, batching, sandbox/index failures, and HTTP connection pressure.

**Response (truncated):**

```json
{
  "status": "healthy",
  "timestamp": "2026-07-12T10:30:45Z",
  "loaded": ["gemma-4-e2b-it-4bit"],
  "current_model": "gemma-4-e2b-it-4bit",
  "inflight": {},
  "resident_models": [],
  "memory_enabled": true,
  "memory_database_open": true,
  "http_inflight": 0,
  "http_inference_limit": 4,
  "chat_active": false,
  "distillation": {"queued": 0, "active": 0},
  "open_file_descriptors": 42,
  "open_connections": 1
}
```

Batch diagnostics are deadline-bounded so a wedged engine cannot wedge `/health`. If that snapshot exceeds the deadline, `batch_diagnostics` is `null` and `batch_diagnostics_timeout` is `true`.

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

:::info[Tool calling semantics]
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
| `max_tokens` | integer | No | Maximum tokens to generate (default: model-dependent) |
| `temperature` | float | No | Sampling temperature 0-2 (default: model-dependent) |
| `top_p` | float | No | Nucleus sampling threshold (default: model-dependent) |
| `stream` | boolean | No | Enable SSE streaming (default: false) |
| `tools` | array | No | Function/tool definitions |
| `tool_choice` | string/object | No | Tool selection strategy |
| `session_id` | string | No | Group conversation history and session bookkeeping across turns; KV reuse is content-addressed |

When `max_tokens`, `temperature`, or `top_p` are omitted, Osaurus defers to the model's own `generation_config.json` and engine defaults rather than inventing app-wide values.

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

`prefix_hash` is informational only. Keep `session_id` stable per conversation so chat history and session bookkeeping group correctly; cache reuse itself does not depend on it.

### POST /agents/&#123;id&#125;/run

Server-side autonomous tool loop. Osaurus executes tools on your behalf, manages the iteration budget, streams tool-execution hints, and returns only when the model is done. (This is the path the in-app chat uses.)

- Each pending `tool_call` is executed against the registered `ToolRegistry` (sandbox, folder, MCP, plugin tools — everything the agent has access to)
- Independent tool calls within a single model turn run **in parallel**
- The loop defaults to 30 iterations (configurable via the chat settings' max tool attempts, capped at 120); if the budget is exhausted while still requesting tools, a notice is appended to the stream
- Honors client-supplied `tools` (merged with the agent's always-loaded set) and `tool_choice`

### POST /agents/&#123;id&#125;/dispatch

Fire-and-forget version of `/run`: dispatch a prompt as a **detached background task** and return immediately. The identifier can be an agent UUID or its crypto address (`0x…`).

**Request Body:**

```json
{
  "prompt": "Summarize this week's inbox and file follow-ups",
  "title": "Weekly inbox sweep"
}
```

**Response (202 Accepted):**

```json
{
  "id": "6f9c2c1e-...",
  "status": "running",
  "poll_url": "/v1/tasks/6f9c2c1e-..."
}
```

Returns `429 task_limit_reached` when the concurrent background-task limit is hit. Loopback callers may dispatch to the built-in agent (this is how App Intents drive it); remote callers can only dispatch to custom agents, and — like `/run` — remote dispatch requires the [Secure Channel](/secure-channel).

### Task endpoints

Manage a dispatched task by the id returned from `/dispatch`:

- **`GET /tasks/{task_id}`** — poll status; returns the serialized task state (running, waiting on clarification, completed with result, failed), or `404` for unknown ids
- **`DELETE /tasks/{task_id}`** — cancel; returns `204 No Content`
- **`POST /tasks/{task_id}/clarify`** with `{"response": "…"}` — answer a clarifying question the task is blocked on

### POST /api/show

Return Ollama-compatible model metadata. The response includes a `capabilities` array so clients can distinguish ordinary text completion from multimodal support:

```json
{
  "details": {
    "family": "gemma4",
    "parameter_size": "2B",
    "quantization_level": "4-bit"
  },
  "capabilities": ["completion", "vision"]
}
```

`completion` is reported for generative chat models. `vision` is included when the selected bundle accepts image input.

`/api/show` reads installed local MLX metadata plus the special `foundation` alias. Remote-provider model IDs return `404`, and current capability strings do not report tools, audio, or video.

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

### POST /v1/completions

OpenAI-style text completion, including **fill-in-middle (FIM)** fields for code-completion clients. Prompt and prefix-only requests run through the raw generation path; a request with a separate suffix or middle context returns an explicit OpenAI-shaped unsupported error rather than being silently ignored.

**Request Body:**

```json
{
  "model": "gemma-4-e2b-it-4bit",
  "prompt": "def fibonacci(n):",
  "max_tokens": 128
}
```

### POST /v1/responses

Create a response using the Open Responses format. The same request shape works across AI providers.

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

### POST /v1/messages

Create a chat completion using the Anthropic Messages format. The handler is registered at `/messages`; the standard `/v1` prefix is normalized, so `/v1/messages` is the preferred direct-client form at this baseline.

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
    base_url="http://127.0.0.1:1337",
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
curl http://127.0.0.1:1337/v1/messages \
  -H "Content-Type: application/json" \
  -H "x-api-key: osaurus" \
  -d '{
    "model": "gemma-4-e2b-it-4bit",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

### POST /v1/embeddings

Text embeddings from the built-in on-device embedding model. OpenAI-shaped request and response; `POST /api/embed` accepts the same input and answers in Ollama's shape.

**Request Body:**

```json
{
  "input": ["The sky is blue", "Grass is green"]
}
```

`input` can be a single string or an array of strings. The response carries one embedding vector per input, in order, plus a token-count `usage` estimate. The embedding model is built in — there's no `model` selection.

### POST /v1/audio/transcriptions

Speech-to-text through the same on-device engine that powers [Voice](/voice). OpenAI-compatible: send `multipart/form-data` with a `file` part (WAV audio) and an optional `response_format` (`json`, the default, or `text`).

```bash
curl http://127.0.0.1:1337/v1/audio/transcriptions \
  -F file=@recording.wav \
  -F response_format=json
```

Transcription runs entirely on your Mac — audio never leaves the machine.

## MCP Endpoints

### GET /mcp/health

Check MCP HTTP transport liveness. A successful response does not mean every plugin or remote MCP provider has finished connecting.

**Response:**

```json
{
  "status": "ok"
}
```

### GET /mcp/tools

Return a snapshot of tools that are registered and enabled at request time, excluding app-only tools that external callers cannot invoke.

The HTTP server binds before optional plugin loading and remote MCP provider discovery finish. During startup, this list can be incomplete even while `/health` and `/mcp/health` are healthy. If an expected tool is missing, wait for its plugin/provider to become ready and query again.

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
      "name": "web_search",
      "description": "Discover relevant web sources",
      "inputSchema": {
        "type": "object",
        "properties": {
          "query": {
            "type": "string",
            "description": "Plain-language search query"
          }
        },
        "required": ["query"]
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

Errors use the same MCP content envelope with `isError` set — there is no separate `error.code` object:

```json
{
  "content": [
    {
      "type": "text",
      "text": "Tool 'unknown_tool' not found"
    }
  ],
  "isError": true
}
```

**Tool-level failures keep HTTP 200.** A tool that runs but fails — a structured failure envelope, or a tool body that throws — is still a successful *transport* exchange: the response stays HTTP 200 and the failure is reported through MCP `isError: true`, with the structured failure envelope in `content`. Separate transport success from tool success when integrating: check `isError`, not just the status code. (Routing, auth, and lookup failures still use regular HTTP error statuses.)

## Memory API

Osaurus exposes its [memory system](/memory) through the HTTP API, so any OpenAI-compatible client gets persistent, on-device personalization.

### The `X-Osaurus-Agent-Id` header

Add the `X-Osaurus-Agent-Id` header to a `POST /v1/chat/completions` request to attribute the session to a specific agent — chat history and memory *recording* are grouped under that agent.

:::warning[No memory injection on chat completions]
`/v1/chat/completions` is a passthrough: agent memory is **not** injected into the prompt on this path, even with the header set. For memory-enriched requests (relevance gate, memory sections, identity overrides), use [`POST /agents/{id}/run`](#post-agentsidrun) or the in-app chat.
:::

Use a real agent UUID from `GET /agents` as the header value.

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://127.0.0.1:1337/v1",
    api_key="osaurus",
    # Use an agent UUID from GET /agents
    default_headers={"X-Osaurus-Agent-Id": "9A2B4C6D-1122-3344-5566-77889900AABB"},
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

Returns your custom agents (built-in agents are excluded) with memory entry counts. `memory_entry_count` is the number of stored memory entries — distilled episodes plus active pinned facts. Use this to discover valid agent IDs for the `X-Osaurus-Agent-Id` header.

**Example with cURL:**

```bash
curl http://127.0.0.1:1337/agents
```

**Response (partial — additional fields like `avatar`, `chat_quick_actions`, `effective_model`, and `supports_thinking` are also returned):**

```json
{
  "agents": [
    {
      "id": "9A2B4C6D-1122-3344-5566-77889900AABB",
      "name": "Code Assistant",
      "description": "Helps with software engineering",
      "default_model": null,
      "supports_vision": false,
      "is_built_in": false,
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
    base_url="http://your-mac.local:1337",
    api_key="osk-v1.eyJpc3M..."
)
```

Access keys can be **master-scoped** (any agent) or **agent-scoped** (one specific agent), with optional expiration and revocation. [Identity →](/identity)

### Pre-auth body-size limits

Osaurus rejects oversized request bodies *before* the auth gate runs, so an unauthenticated caller can't exhaust host memory.

| Endpoint | Limit |
|---|---|
| `POST /pair` | 64 KiB |
| Other public HTTP routes | 32 MiB |
| Sandbox host bridge | 8 MiB |

Both servers enforce the cap with a `Content-Length` pre-check at request head and a streaming guard at body chunks, so chunked clients and clients that lie about their declared length both hit `413 Payload Too Large`.

## Error Handling

Chat endpoints return errors in the OpenAI shape — a `message` and a `type` (there is no stable `code` field):

```json
{
  "error": {
    "message": "Model not found: gpt-4",
    "type": "invalid_request_error"
  }
}
```

**Common `type` values:**

| Type | Description |
| ---- | ----------- |
| `invalid_request_error` | Malformed request body, unknown model, or bad parameters |
| `internal_error` | Server-side error |
| `insufficient_resources` | Not enough memory to load or run the requested model |

MCP tool errors use the MCP content envelope (`{"content":[…],"isError":true}`) instead — see [POST /mcp/call](#post-mcpcall).

## CORS Support

Built-in CORS support for browser-based applications:

- **Allowed Origins:** `*` (all origins)
- **Allowed Methods:** `GET, POST, OPTIONS` for the chat/API routes (admin routes additionally accept `PUT`)
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
    "name": "get_current_time",
    "arguments": {}
  }'
```

---

**Related:**

- [SDK Examples](/sdk-examples) — Python, JS, Anthropic SDK, Open Responses
- [Integrations](/integrations) — wiring Osaurus into Cursor, Claude Desktop, etc.
- [Tool Contract](/tool-contract) — envelope shape for every tool
- [Memory](/memory) — what memory does for users
- [Memory Internals](/memory-internals) — what `X-Osaurus-Agent-Id` and `/memory/ingest` do under the hood
- [Identity](/identity) — minting and revoking `osk-v1` keys
- [Inference Runtime](/inference-runtime) — KV cache, batching, model leases

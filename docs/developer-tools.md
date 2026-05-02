---
title: Developer Tools
sidebar_label: Developer Tools
description: Real-time API request inspection (Insights) and an interactive endpoint catalog (Server Explorer) — built into the Osaurus app.
---

# Developer Tools

Osaurus includes built-in developer tools for debugging, monitoring, and testing your integration. Open the Management window (`⌘ ⇧ M`) and click **Insights** or **Server**.

## Insights

The **Insights** tab provides real-time monitoring of every API request flowing through Osaurus.

### Request log

Every API request is logged with:

| Field | Description |
|---|---|
| **Time** | Request timestamp |
| **Source** | Origin: Chat UI or HTTP API |
| **Method** | HTTP method (GET/POST) |
| **Path** | Request endpoint |
| **Status** | HTTP status code |
| **Duration** | Total response time |

Click any row to expand and see full request/response details.

### Filtering

| Filter | Options |
|---|---|
| **Search** | Filter by path or model name |
| **Method** | All, GET only, POST only |
| **Source** | All, Chat UI, HTTP API |

### Aggregate stats

The stats bar at the top shows real-time metrics:

| Stat | Description |
|---|---|
| **Requests** | Total request count |
| **Success** | Success rate percentage |
| **Avg Time** | Average response duration |
| **Errors** | Total error count |
| **Inferences** | Chat completion requests (if any) |
| **Avg Speed** | Average tokens/second (for inference) |

### Request details

Expand a row for:

**Request panel:**

- Full request body (formatted JSON)
- Copy to clipboard

**Response panel:**

- Full response body (formatted JSON)
- Status indicator (green for success, red for error)
- Response duration
- Copy to clipboard

**Inference details** (for chat completions):

- Model used
- Token counts (input → output)
- Generation speed (tok/s)
- Temperature
- Max tokens
- Finish reason

**Tool calls** (if applicable):

- Tool name
- Arguments
- Duration
- Success/error status

### Use cases

- **Debugging API integration** — See exactly what's being sent and received
- **Performance monitoring** — Track latency and throughput
- **Tool call inspection** — Debug tool calling behavior
- **Error investigation** — Understand why requests fail
- **Auditing schedules / watchers** — Filter by source to see what fired

## Server Explorer

The **Server** tab is an interactive API reference and testing interface.

### Server status

| Info | Description |
|---|---|
| **Server URL** | Base URL for API requests |
| **Status** | Running, Stopped, Starting, … |

Copy the URL with one click for use in your applications.

### Endpoint catalog

Every endpoint, organized by category:

| Category | Endpoints |
|---|---|
| **Core** | `/`, `/health`, `/models`, `/tags` |
| **Chat** | `/chat/completions`, `/chat`, `/messages`, `/responses` |
| **Audio** | `/audio/transcriptions` |
| **MCP** | `/mcp/health`, `/mcp/tools`, `/mcp/call` |

Each endpoint shows HTTP method, path, compatibility badge (OpenAI, Ollama, Anthropic, Open Responses, MCP), and description.

### Interactive testing

Test any endpoint directly:

1. Click an endpoint row to expand it
2. For POST requests, edit the JSON payload
3. Click **Send Request**
4. View the formatted response

**Request panel (left):**

- Editable JSON payload for POST requests
- Request preview for GET requests
- Reset button to restore default payload
- Send Request button

**Response panel (right):**

- Formatted response body
- Status code badge
- Response duration
- Copy button
- Clear button

### Use cases

- **API exploration** — discover endpoints
- **Quick testing** — try things without curl
- **Payload experimentation** — try different request shapes
- **Response inspection** — see formatted JSON

## Workflow examples

### Debugging a chat integration

1. Open **Insights**
2. Send a request from your application
3. Find it in the log (filter by path if needed)
4. Expand to see request/response details
5. Check for errors in the response
6. If using tools, inspect tool call details

### Testing tool calling

1. Open **Server**
2. Expand `/chat/completions`
3. Modify the payload to include tools:

```json
{
  "model": "foundation",
  "messages": [{ "role": "user", "content": "What time is it?" }],
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "current_time",
        "description": "Get the current time"
      }
    }
  ]
}
```

4. Click **Send Request**
5. Observe the tool call in the response
6. Check **Insights** for the full request flow

### Monitoring performance

1. Open **Insights**
2. Run your test workload
3. Observe:
   - Avg Time (should be consistent)
   - Success rate (should be high)
   - Avg Speed for inference (tok/s)
4. Expand slow requests to investigate

### Verifying MCP tools

1. Open **Server**
2. Expand `GET /mcp/tools`
3. Click **Send Request**
4. Verify your expected tools are listed
5. Test a specific tool with `POST /mcp/call`

## Tips

### Clear logs regularly

The Insights log grows over time. Use **Clear** to reset when debugging a specific issue.

### Use source filters

Filter by source to distinguish between:

- **Chat** — Requests from the built-in chat UI
- **HTTP** — Requests from external applications

### Copy responses

Use the copy button to grab response payloads for debugging in other tools.

### Keep the server running

Server Explorer requires the server to be running. If endpoints are disabled, start the server first.

## CI testing conventions

For contributors. How CI runs the Osaurus test suite, and the hooks that exist to debug it when it goes sideways.

### Reproduce CI locally

The Makefile target `make ci-test` runs the exact `xcodebuild` flags CI uses, piped through `xcbeautify`, and writes a result bundle:

```bash
brew install xcbeautify
make ci-test
open build/Tests.xcresult
```

If a test fails on CI but you can't reproduce it on your machine, download the `test-core-xcresult-*` artifact from the failed CI run and open it the same way.

### Long-running and integration tests

Tests that require external infrastructure (Apple Containerization, real GPU, network, etc.) must:

1. **Be opt-in via an environment variable** — never run unconditionally in CI
2. **Use Swift Testing's `.disabled(if:)` trait** at the suite level so they're reported as `Disabled` (not silently passing)
3. **Keep individual test bodies under ~250ms of `Task.sleep`** and prefer event-driven waits

Currently env-gated:

| Env var | Suite | Notes |
|---|---|---|
| `OSAURUS_RUN_SANDBOX_INTEGRATION_TESTS=1` | `SandboxIntegrationTests` | Boots a Linux VM; runs `pip` / `npm` / `go` workloads |

### CI cache controls

The `test-core` job caches `~/Library/Developer/Xcode/DerivedData` keyed on Swift sources, manifests, resources, the pinned Xcode version, and a manual `CACHE_SALT`. Two recovery levers:

1. **One-shot cold build** — trigger CI manually via the **Run workflow** button and check `clear_cache`. Skips the restore for that one run.
2. **Permanent bust** — bump `CACHE_SALT` (currently `v1`) at the top of `.github/workflows/ci.yml` to `v2` and merge. Every cache key invalidates immediately.

The cache only **saves** on `main` pushes — PRs read from it but never overwrite, so a half-baked branch can't poison everyone.

### Where the logs live

The full xcodebuild output is collapsed into expandable groups by `xcbeautify`. On a failure, CI also publishes:

- A short failure summary at the top of the GitHub Actions run page
- The raw `Tests.xcresult` bundle as a downloadable artifact (`test-core-xcresult-N`, 7-day retention)

A passing run produces ~1–2k log lines instead of the historical ~30k. Individual tests that hang are killed in ~2 min by `-test-timeouts-enabled YES` (default 60s, max 120s per test). The whole `test-core` job is also capped at 15 minutes via `timeout-minutes`.

---

**Related:**

- [Inference Runtime](/inference-runtime) — what the inference metrics in Insights actually measure
- [HTTP API](/api) — endpoint reference, mirrored in Server Explorer
- [Tool Contract](/tool-contract) — envelope shape that Insights renders for tool calls
- [Building from Source](/developer) — to contribute and extend Osaurus

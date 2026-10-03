---
title: Developer Tools
sidebar_label: Developer Tools
description: A tamper-evident activity log of every local and cloud interaction (Insights) and an interactive endpoint catalog (Server → API Reference) — built into the Osaurus app.
---

# Developer Tools

Osaurus includes built-in developer tools for debugging, monitoring, auditing, and testing your integration. Open **Settings…** (`⌘ ,`) and click **Insights** or **Server** under **Developer Tools**.

## Insights

**Insights** is the activity log: one row for every interaction Osaurus performs — local model requests, cloud provider calls, web searches, URL fetches, MCP tool calls, channel deliveries, Osaurus Router calls, inbound API requests, plugin host calls, embeddings, transcriptions, speech synthesis, media generation — plus chain-of-custody events about the log itself.

Each row is marked **Local** (data stayed on this Mac) or **Cloud** (data left this Mac), persisted to `~/.osaurus/activity/activity.sqlite`, and chained with SHA-256 so edits and deletions are detectable.

You can open Insights three ways:

- **Settings… → Insights**
- **Settings… → Privacy → Filter → Activity Log → Review Activity in Insights**
- The **Inspect response** action on any assistant message in chat, which focuses that turn's row

Or deep-link: `open "osaurus://settings?tab=insights"`.

### What gets recorded

| Category | What's recorded |
|---|---|
| **Inference** | Every model request from chat, agents, schedules, watchers, channels and plugins — local or cloud. Model, tokens, speed, finish reason, tool calls, prompt, request/response payloads, and whether the Privacy Filter redacted anything. Hidden one-shots (chat titles, follow-ups, memory distillation, transcription cleanup) appear with an `/internal/…` path. |
| **Compaction** | Hidden conversation-summary generations |
| **Web search** | Query, providers tried, which one answered, result count, destination host |
| **URL fetch** | Pages fetched directly from this Mac or through the Osaurus Router |
| **MCP tool** | Tool calls forwarded to an MCP server. Local stdio servers are **Local**; HTTP servers are **Cloud**. |
| **Channel** | Messages delivered to Slack, Discord, Telegram, WhatsApp, iMessage, n8n or a custom webhook. Metadata only — message text isn't copied into the log. |
| **Router** | Osaurus Router control-plane calls (workspaces, credits, media, pairing, account) |
| **API** | Inbound requests to the local HTTP server from API clients and paired peers |
| **Plugin call / Plugin log** | Host API calls and log lines from installed plugins (log lines hidden by default) |
| **Embedding** | Local embedding batches and `/v1/embeddings` calls. Counts and sizes only. |
| **Transcription / Speech / Media** | Dictation and file transcription, spoken replies, and image/video jobs |
| **System** | Chain-of-custody events: cleared, pruned, verified, exported, settings changed, recovered |

Delegated subagents and Computer Use / AppleScript helper steps show source **Agent** and share the parent turn's id, so you can follow a delegated task from the parent turn to every helper step.

### The list

| Column | Meaning |
|---|---|
| **Time** | When the interaction finished. Rows are grouped by day with a pinned day header. A red dot marks a failed row (orange for a 4xx that wasn't an error). |
| **Event** | Category glyph and plain-language title (model + tokens, query, destination, media size…) over a secondary line: category · plugin · agent · destination (Cloud rows) · tools sent. A hand glyph marks rows the Privacy Filter rewrote. |
| **Source** | Chat UI, Agent, HTTP API, Plugin, P2P, Channel, Schedule, Watcher, Self-scheduled, Tool, System |
| **Duration** | Wall time. Token counts and bytes live in the detail. |

Status is deliberately not a column — only failed rows are tinted.

### Glance strip

The strip above the list shows four numbers for the current filter:

| Tile | Description |
|---|---|
| **Events** | Total rows matching the filter |
| **Left this Mac** | Cloud rows and their share (click to filter) |
| **Failed** | Failed rows (click to filter) |
| **Privacy-filtered** | Rows the Privacy Filter rewrote (click to filter) |

Beneath it, a local/cloud bar and a **destinations** disclosure list every host that received data, with request counts and bytes. Click a host to filter by it.

### Filtering

| Filter | Where | Options |
|---|---|---|
| **Search** | Search field | Path, model, title, destination, agent |
| **Time range** | Toolbar | Today, 7 days, 30 days, All time |
| **Scope** | Scope tabs | **All**, **Models** (inference, compaction, embedding), **Web** (search, URL fetch), **Tools** (MCP, plugin calls and logs), **Channels**, **API** (inbound API, Router), **Audio & Media** (transcription, speech, media), **System** |
| **Local / Cloud** | **Filter** popover or **Left this Mac** tile | |
| **Status** | **Filter** popover or **Failed** tile | Any, Succeeded, Failed |
| **Source** | **Filter** popover | Multi-select |
| **Destination, Model** | **Filter** popover | Hosts / models present in the log |
| **Privacy Filter** | **Filter** popover or **Privacy-filtered** tile | Any, only filtered, only unfiltered |
| **Plugin console logs** | **Filter** popover | Hidden by default |

Every active criterion appears as a removable token under the toolbar; **Clear all** resets them. Filters apply to the list, the glance strip and **Export**.

### Row detail

Click a row. In a wide window the detail opens as an inspector beside the list (↑/↓ move the selection; Escape or × closes). In a narrow window it replaces the list and **Back** returns.

- **Overview** — a facts grid (model, tokens, tok/s, finish, bytes sent / received, destination, whether content was stored), a one-sentence summary, the category-specific section, then collapsible groups: **Where it went** (destination, host, endpoint, transport, data classes, privacy-filter result), **Who drove this** (source, agent, session, turn, request id, access key), **Generation settings** (temperature, max tokens, finish reason, tool calls) and **Integrity** (`seq`, hash, previous hash). Errors are shown first.
- **Prompt** — the parsed chat messages and tool definitions (chat-shaped rows only).
- **Raw** — request and response bodies behind a Request / Response toggle. For remote inference, a **Server / Local** sub-toggle shows the exact bytes sent on the wire (after the Privacy Filter) next to what the local caller sent. **Copy** in the header copies any captured body.

Rows written while **Store Prompts and Responses** was off show `[content withheld — metadata only]` instead of bodies; metadata is always present.

### Verify, Export, and Clear

**Export** is the header's primary action; **Verify Integrity** and **Clear Activity Log…** live in the **⋯** menu beside it.

| Action | What it does |
|---|---|
| **Verify Integrity** | Walks the whole chain and reports record count, head hash, and any broken link, gap, edit, or head mismatch. The check is itself recorded as a System row. |
| **Export** | Writes the current filter (or everything) as **JSONL** (manifest line + one canonical record per line — re-verifiable offline without Osaurus), **CSV** (no bodies), or **Markdown**, with or without message content. Recorded as a System row. |
| **Clear Activity Log…** | Removes every row, moves the chain anchor forward, and writes a `cleared` System row — so the log still verifies and the clearing is visible. |

Each record's hash is `SHA-256(prevHash + "\n" + canonical JSON of the record)`. The log is tamper-**evident**, not tamper-proof: someone with write access to your home folder could rewrite the whole chain. For outside assurance, export regularly and keep the manifest's head hash elsewhere.

### Limits

- Prompt, response and wire bodies are kept up to 256 KB each; longer bodies are truncated with a note and the original size.
- Per-row detail values (queries, previews, URLs) are kept up to 2 KB each, at most 32 per row.
- Credentials (Bearer tokens, `sk-…` keys, JWTs, API-key headers, workspace attestations) are replaced with `<redacted>` before anything is stored. Secret-setting tool arguments and all Agent Channel tool arguments are redacted too.
- Rows appear immediately and are written to disk a moment later; after a hard crash the last few rows may be missing.

### Not captured

The log records interactions, not every byte on the wire. These don't produce rows: provider model-list and **Test connection** probes, OAuth sign-in flows, MCP capability probes, pages the managed browser loads during [Browser Use](/browser-use), channel polling and incoming-message receipt, workspace handshake and keep-alives, the unauthenticated Router announcements feed and health probe, theme fetches, skill / plugin / sandbox downloads, and local tool side effects (file edits, shell commands, clicks). Telemetry, crash reports, app updates, and model downloads are separate consent switches under **Privacy → Filter → Data Collection**.

### Settings

Retention and content policy live in the **Activity Log** section of **Settings… → Privacy → Filter**:

| Setting | Default | Description |
|---|---|---|
| **Keep Activity History** | 30 days | 7 days, 30 days, 90 days, 1 year, or Keep forever. Older records are pruned at launch, every six hours, and when the setting changes. |
| **Store Prompts and Responses** | On | Turn off to keep metadata only for new records; existing records aren't rewritten. |

Changing either writes a `settings_changed` System row.

### Response metrics in chat

Per-response metrics (total time, time to first token, tokens/sec, token count, model load, cached input tokens) no longer occupy a footer row under each reply. Open the assistant message's overflow menu and hover **Inspect response** to see them; the submenu ends with **Open request and response log**, which jumps to that turn's row in Insights. Only the "thinking didn't close" warning still appears inline.

### Use cases

- **"Did this leave my Mac?"** — Click the **Left this Mac** tile; the destinations disclosure lists every host and the bytes sent
- **Debugging API integration** — Filter by source **HTTP API** (or the **API** scope), open the row, and compare Request / Response under **Raw**
- **Verifying the Privacy Filter** — Open a Cloud inference row → **Raw** → Request → **Server**; placeholders should appear where PII was
- **Tracing a delegated run** — The parent turn and every subagent / helper step share one turn id; search by agent name
- **Auditing schedules / watchers** — Filter by source to see what fired
- **Hidden model work** — Rows with `/internal/...` paths are one-shots (chat titles, follow-ups, memory distillation, compaction, transcription cleanup, embeddings)

## API Reference

**Settings… → Server** has four tabs: **Overview**, **Models**, **Settings**, and **API Reference**. The server status card is on **Overview**; **API Reference** is an interactive endpoint catalog and testing interface.

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
3. Pick the **API** scope (or filter by source **HTTP API**) and find the row
4. Click it to open the detail
5. Check for errors at the top of **Overview**
6. Switch to **Raw** to compare the request and response bodies; tool calls are listed under **Generation settings**

### Testing tool calling

1. Open **Server → API Reference**
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

1. Open **Insights** and pick the **Models** scope
2. Run your test workload
3. Watch the **Failed** tile and the **Duration** column
4. Open slow rows to see tokens and tok/s in the **Overview** facts grid

### Verifying MCP tools

1. Open **Server → API Reference**
2. Expand `GET /mcp/tools`
3. Click **Send Request**
4. Verify your expected tools are listed
5. Test a specific tool with `POST /mcp/call`

## Tips

### Let retention do the clearing

The activity log is pruned automatically by **Privacy → Filter → Activity Log → Keep Activity History** (30 days by default). **Clear Activity Log…** is an audited action — it writes a chain-of-custody row — so prefer a filter (time range, source) when you just want a quieter view while debugging.

### Use source filters

Filter by source to distinguish between:

- **Chat UI** — Requests from the built-in chat
- **Agent** — Delegated subagents and helper loops (Computer Use, AppleScript)
- **HTTP API** — Requests from external applications
- **Schedule / Watcher / Self-scheduled / Channel** — Headless runs
- **Tool** — Egress performed by a tool (search, URL fetch, MCP, channel delivery)

### Copy responses

Use the copy button to grab response payloads for debugging in other tools.

### Keep the server running

The API Reference tab requires the server to be running. If endpoints are disabled, start the server first.

## CI testing conventions

For contributors: how CI runs the Osaurus test suite, and the hooks for debugging it when it goes sideways.

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

Treat the pinned [`ci.yml`](https://github.com/osaurus-ai/osaurus/blob/dd9de43f8191f9825fe5dfd2a9b7d9f889701a5f/.github/workflows/ci.yml) as the source of truth; cache keys and salts are implementation details and change over time.

At the documented baseline, `test-core`:

- caches Swift package sources separately from Xcode build products;
- restores `DerivedData` only for an exact-key `main` push or manual run;
- cold-builds `DerivedData` for pull requests, re-runs, and manual runs with `clear_cache`;
- saves successful `DerivedData` results only on `main`.

Use **Run workflow → `clear_cache`** for a one-shot cold build. Maintainers can change the workflow's cache salt for a repository-wide invalidation, but documentation should not pin its current value.

### Where the logs live

The full xcodebuild output is collapsed into expandable groups by `xcbeautify`. On a failure, CI also publishes:

- A short failure summary at the top of the GitHub Actions run page
- The raw `Tests.xcresult` bundle as a downloadable artifact (`test-core-xcresult-N`, 7-day retention)

A passing run produces ~1–2k log lines instead of the historical ~30k. Individual tests that hang are killed in ~2 min by `-test-timeouts-enabled YES` (default 60s, max 120s per test). The whole `test-core` job is also capped at 45 minutes via `timeout-minutes` (headroom for the cold-cache rebuild path).

---

**Related:**

- [Inference Runtime](/inference-runtime) — what the inference metrics in Insights actually measure
- [Privacy Filter](/privacy-filter) — the redaction Insights lets you verify
- [HTTP API](/api) — endpoint reference, mirrored in **Server → API Reference**
- [Tool Contract](/tool-contract) — envelope shape that Insights renders for tool calls
- [Building from Source](/developer) — to contribute and extend Osaurus

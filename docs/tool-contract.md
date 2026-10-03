---
title: Tool Contract
sidebar_label: Tool Contract
description: The canonical success/failure envelope every Osaurus tool returns. The single rule plugin authors and contributors care about most.
---

# Tool Contract

Every Osaurus tool — global built-in, folder tool, sandbox tool, plugin tool, MCP-aggregated tool — returns a JSON string in exactly one of two shapes. This page is the one-stop reference for tool authors.

The type lives at `Packages/OsaurusCore/Tools/ToolEnvelope.swift` in the osaurus repo.

## Success envelope

```json
{
  "ok": true,
  "tool": "file_write",
  "result": { "path": "/home/agent/foo.txt", "size": 123 },
  "warnings": ["slow disk"]
}
```

| Field | Description |
|---|---|
| `ok` | Always `true` |
| `tool` | Optional — the tool name. Populated automatically by the helpers. |
| `result` | The tool's payload. Object, array, string, number, bool, or null. |
| `warnings` | Optional list of non-fatal notes the model should read |

### `text` convenience

Tools whose primary output is a single human-readable string (folder tools, capability listings, search-memory hits, `todo`/`complete`/`clarify`) use:

```swift
return ToolEnvelope.success(tool: name, text: "Found 3 matches\n...")
```

which is sugar for `result: { "text": "..." }`. The chat UI's tool-call card detects this pattern and renders the text verbatim as Markdown instead of a JSON code block.

## Failure envelope

```json
{
  "ok": false,
  "kind": "invalid_args",
  "message": "Missing required argument `content` (string).",
  "field": "content",
  "expected": "non-empty string of file contents",
  "tool": "file_write",
  "retryable": true
}
```

| Field | Description |
|---|---|
| `ok` | Always `false` |
| `kind` | Classification — see the table below |
| `message` | Human- and model-readable explanation |
| `field` | Optional — offending argument name when `kind` is `invalid_args` |
| `expected` | Optional — what the argument should look like (example form) |
| `tool` | Optional — populated automatically |
| `retryable` | Whether a retry might succeed. Defaulted by `kind`. |

### Kinds

| `kind` | meaning | default `retryable` |
|---|---|---|
| `invalid_args` | argument missing, malformed, or scope-incompatible | `true` |
| `rejected` | blocked by configured policy | `false` |
| `user_denied` | user clicked Deny on an interactive approval | `false` |
| `timeout` | tool ran past its time budget | `true` |
| `execution_error` | tool ran but failed (process exited non-zero, file missing…) | `true` |
| `unavailable` | tool exists but can't run right now (sandbox booting, etc.) | `true` |
| `tool_not_found` | model called a tool the registry doesn't have | `false` |

## Detection

Code paths that need to distinguish success from failure without parsing the whole envelope use:

```swift
ToolEnvelope.isError(resultString)     // true for failure envelopes + legacy prefixes
ToolEnvelope.isSuccess(resultString)   // symmetric
ToolEnvelope.successPayload(result)    // returns the `result` dict for a success
ToolEnvelope.failureMessage(result)    // returns `message` (falls back to the input)
```

These also recognize the legacy `[REJECTED]` / `[TIMEOUT]` prefixes and the legacy `ToolErrorEnvelope` JSON shape so partial migrations don't mis-classify.

## Writing a tool

Use the `require…` helpers on `OsaurusTool` to build failure envelopes with the right `field` / `expected` automatically:

```swift
func execute(argumentsJSON: String) async throws -> String {
    let argsReq = requireArgumentsDictionary(argumentsJSON, tool: name)
    guard case .value(let args) = argsReq else { return argsReq.failureEnvelope ?? "" }

    let pathReq = requireString(
        args, "path",
        expected: "relative path under the agent home",
        tool: name
    )
    guard case .value(let path) = pathReq else { return pathReq.failureEnvelope ?? "" }

    // ... do work ...
    return ToolEnvelope.success(tool: name, result: ["path": path, "size": 123])
}
```

The sandbox tool helpers (in `BuiltinSandboxTools.swift`) add `requirePath(_:home:tool:)` on top, which routes through `SandboxPathSanitizer` and turns a rejection into an `invalid_args` envelope with the specific reason (path traversal, dangerous character, outside allowed roots, etc.).

### Thrown errors

Tool bodies that throw (folder tools, for historical reasons) have the exception mapped to the envelope at the catch site via `ToolEnvelope.fromError(_:tool:)`. That helper understands `FolderToolError`, `ToolRegistry` permission `NSError` codes, and any other `Error` (falls through to `execution_error`).

### Schema

Add `"additionalProperties": false` to every new tool's top-level schema. `SchemaValidator` enforces it at `ToolRegistry.execute` time and emits `invalid_args` with `field: <unknown>` for the model.

Scalar types are intentionally lenient: `integer`, `number`, and `boolean` properties accept native JSON values *and* string-encoded equivalents (`"15"`, `"3.14"`, `"true"`/`"yes"`/`"1"`). `array` properties additionally accept a string that JSON-decodes to an array (`"[\"a\",\"b\"]"`). This matches the tool-side `ArgumentCoercion` helpers so local models that emit slightly off types don't bounce on the preflight when the body would coerce anyway. `string`, `object`, and `enum` checks remain strict, and `array` still rejects bare non-array strings so the model gets a clear signal.

Prefer:

- `enum` for closed-set values (`chartType`, `scope`, `language`, …)
- `default` declared in the schema for any default the implementation uses
- Concrete examples in `description` strings

A tool can repair known malformed argument shapes before validation by implementing `normalizeArgumentsBeforeValidation` on `OsaurusTool`; `ToolRegistry` runs it first, so the public schema can stay strict. `file_edit` uses it to decode `edits`/`operations` sent as a JSON string, hoist a `path` every entry carries identically, and drop content-free fillers like `"operations": []` that constrained decoders emit next to a real edit.

### Property order on the provider wire

Osaurus encodes request bodies with sorted keys for prompt-cache determinism, which alphabetizes each tool's `properties`. Constrained decoders (JSON-schema grammars, and xAI's grok models in practice) can only reach optional properties in declared order — once the model emits a later key, earlier ones are gone. A tool that cares declares `parameterOrder` (for example `["path", "content", "mode", "dry_run"]` on `file_write`); `ToolRegistry` records it and the encoded body is rewritten just before send so that tool's `properties` follow the authored order while everything else stays sorted. The rewrite is deterministic, so the cache contract still holds. Put the key the model writes first, first.

Don't enumerate per-variant keys on a polymorphic array item. `file_edit.operations.items` is a free-form object whose keys are documented in the `operations` description; each document editor validates its own keys with entry-numbered errors instead.

### Special-case markers (artifact, chart)

`share_artifact` and `render_chart` carry marker-delimited blobs (`---SHARED_ARTIFACT_START---` / `---CHART_START---`) because the chat UI is tightly coupled to those parsers. The markers ride inside the envelope's `result.text` string — downstream parsers extract `text` from the envelope first, then scan for markers. Prefer not to add new marker-based flows; treat them as legacy.

### `share_artifact` failure envelopes

The chat-layer wrapper differentiates four failure modes for `share_artifact` so the model can self-correct on the next turn instead of retrying the same path. Each maps to a specific `ToolEnvelope.failure` shape:

- **Path rejected** (`pathRejected`) → `kind: invalid_args`, `field: "path"`, message names the trusted root and suggests `file_search`.
- **File not found** (`fileNotFound`) → `kind: execution_error`, message enumerates every candidate path the resolver tried (e.g. `<home>/foo.png`, `<home>/output/foo.png`, `<home>/dist/foo.png`, …) so the model knows exactly where to look next.
- **Copy failed** (`copyFailed`) → `kind: execution_error`, message carries the FS error string (disk full, perms) plus the source path.
- **Filename rejected** (`destinationRejected`) → `kind: invalid_args`, `field: "filename"`, asks for a plain basename.

Empty-string filler in optional fields (`content: ""`, `filename: ""`) is treated as absent on entry — many models pass empty placeholders for unused fields, and rejecting that as `invalid_args` was a footgun.

### `shell_run` background flag

Foreground (default): returns `{stdout, stderr, exit_code, cwd}` when the command finishes. The optional `timeout` parameter is an **idle** timeout — the command is killed if it produces no output for that many seconds; when omitted, it runs to completion (the user can terminate from the chat card). Pass `background:true` to spawn a detached process — the tool returns `{pid, log_file, cwd, background:true}` as soon as the spawn shim returns. Manage the resulting job through `sandbox_process` (poll/wait/kill).

### `file_edit` matching contract

`file_edit` (and the sandbox writer it routes `/workspace/...` paths through) matches `old_string` with a fixed cascade and applies the first tier that matches:

1. `exact` — byte for byte.
2. `whitespace_normalized` — whole lines compared with edge whitespace trimmed and inner whitespace runs collapsed (tabs vs spaces, indentation depth).
3. `blank_lines_collapsed` — as above, ignoring blank lines between the non-blank lines.
4. `unicode_normalized` — as above, folding curly quotes, dashes, ellipses, and non-breaking spaces to their ASCII forms.

A relaxed tier applies only when it matches exactly once (or `replace_all` is set); otherwise the failure names the tier and count and carries `metadata.retry_with = {"replace_all": true}`. Unchanged lines are always copied from the file, never from `old_string`, so indentation, blank lines, BOM, and line endings survive.

The success payload reports `replacements`, `match_strategy` (the most relaxed tier any edit needed), `matched_lines` (`"12"` or `"12-15"` per block), and for `edits` batches `edits_applied` / `edit_strategies`. Every relaxed match adds a `warnings` entry quoting the verbatim file text that matched. `dry_run` returns the same payload plus a `PREVIEW ONLY` warning and writes nothing.

Existing `.docx`, `.xlsx`, `.pptx`, and `.pdf` files are edited in place with `operations` (or `old_string`/`new_string`, mapped onto `replace_text`). Each edit is validated in a staged copy before the original is swapped. Word and PowerPoint `replace_text` use a two-tier cascade (`exact`, then punctuation/whitespace `normalized`), and a miss whose `old_string` carries Markdown syntax (list markers, `##` headings, `**emphasis**`) is retried without it, since those documents store that as styling, not text. An empty `old_string` on `.docx`/`.pptx` is rejected with a pointer to the operations that insert text (`append_markdown`, `insert_paragraph`, `set_slide_text`, `duplicate_slide`).

`file_write` on a document path refuses `content` that parses as a `file_edit` operations array — rendering it would replace the document with a line of JSON — and returns the equivalent `file_edit` call in `metadata.retry_with`.

### Paged listings

`file_search` and `list_knowledge` page instead of silently truncating. Pass `offset` (the previous result's `next_offset`) to continue. `file_search` with `target: "files"` reports `total` and, when more remain, `next_offset`; an empty files-mode pattern means `*`. `list_knowledge` defaults to 100 rows (max 500) and reports `total` / `next_offset`.

## Loop tools

Three special tools drive the inline UI for the [Tasks](/agent-loop) experience. The chat layer intercepts their results and renders the live to-do list, "Completed" banner, and clarifying-question prompt. They're available in every chat. A fourth intercept, [`prompt_working_folder`](#prompt_working_folder), shares the same run-ending mechanics.

### `todo`

Publishes or updates the plan as a markdown checklist. The list lives in the chat and ticks off as the agent works. Each call replaces the whole list, so the agent can rewrite the plan as it learns more.

### `complete`

Ends the loop with a summary of what was done and how it was verified. Becomes a "Completed" banner in the chat. Placeholder summaries (`done`, `ok`, `looks good`) are rejected by the validator so the agent can't fake completion — partial completions must be honest about what was and wasn't done.

### `clarify`

Pauses the loop and asks one critical question. Optional one-tap answer chips (`options[]`) let the user answer with a single click. The validator only accepts `clarify` calls when the question genuinely changes the outcome — agents can't use it for cosmetic preferences mid-task.

### Result envelopes

All three return their payload via the `text` convenience (a single human-readable string). The chat-layer parsers consume the envelope's `result.text` to render the corresponding UI element.

### Surface parity

The run-ending intercepts aren't chat-only. The HTTP `/agents/{id}/run` loop and the plugin completion loop also end the run on a successful `complete`/`clarify`, and a batch carrying an intercept falls back to serial model-order execution on every surface. Only the presentation differs:

| Surface | `complete` | `clarify` | `prompt_working_folder` |
|---|---|---|---|
| Chat | Ends run; "Completed" banner | Pauses run; inline overlay, the answer resumes | Opens the folder picker; on a pick the run ends and immediately continues with the folder bound |
| HTTP `/agents/{id}/run` | Ends run; summary in response | Ends run; question in response (re-send with the answer) | Not exposed; refused as an external-surface tool |
| Plugin dispatch | Ends run; COMPLETED event | Pauses task; `CLARIFICATION` event, the answer resumes | Not exposed |

### `prompt_working_folder`

The one picker-backed intercept. It's in the schema only for an attended `.chat` session on a custom agent with no working folder and no Sandbox. It opens the native folder picker as a sheet on the chat window with the model's `reason` as the dialog message, then runs the same sequence as the Folder chip (attach the folder to the chat, disable the agent's Sandbox, remember the folder on the agent), rolling back on failure.

| Field | Type | Required | Description |
|---|---|---|---|
| `reason` | string | Yes | One short user-facing sentence shown in the picker (e.g. "Save the generated report as report.md"). |

Because the tool schema and execution root are frozen per turn, a success ends the run and chat immediately continues with the file tools in the schema — the model picks up from the success envelope without the user typing. Cancelling returns `user_denied`: the run stops, the message is shown, and the same run never reopens the picker. A failure (stale bookmark, Sandbox could not be disabled) returns `execution_error` and rolls back. The tool is on the external deny list, excluded from spawned subagents, and returns `unavailable` when no live chat window drives the run.

---

**Related:**

- [Plugin Authoring](/plugin-authoring) — how to wire your tool into the registry
- [Tools & Plugins](/tools) — what tools exist and how they're auto-selected
- [Sandbox Internals](/sandbox) — sandbox-specific success/failure shapes

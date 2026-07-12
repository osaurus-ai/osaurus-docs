---
title: Plugin Authoring
sidebar_label: Plugin Authoring
description: Build native Swift and Rust plugins for Osaurus using the Generic C ABI. Tools, HTTP routes, SQLite storage, config UI, web apps.
---

# Plugin Authoring

This guide covers building external plugins for Osaurus. Plugins are native binaries (`.dylib`) distributed with a `manifest.json`, providing tools that AI agents call via MCP.

For sandbox plugins (JSON recipes that run inside the Linux VM, no compilation), see [Sandbox Internals → Plugin recipes](/sandbox#plugin-recipes).

## Quick Start (Swift)

### 1. Scaffold a Plugin

```bash
osaurus tools create MyPlugin --language swift
cd MyPlugin
```

This creates:

```
MyPlugin/
├── Package.swift
├── osaurus-plugin.json     # plugin_id + version used by `osaurus tools dev`
├── web/                    # optional static frontend
├── .github/workflows/release.yml
└── Sources/
    └── MyPlugin/
        └── Plugin.swift    # full v2-ABI plugin with host API mirror
```

The plugin's capability manifest (tools, routes, config) is returned by `get_manifest()` in `Plugin.swift`; `osaurus-plugin.json` only stores project metadata for the CLI.

### 2. Build the Plugin

```bash
swift build -c release

# Copy the built dylib
cp .build/release/libMyPlugin.dylib ./libMyPlugin.dylib
```

### 3. Code Sign (Required for Distribution)

```bash
codesign -s "Developer ID Application: Your Name (TEAMID)" ./libMyPlugin.dylib
```

:::warning[Code Signing Required]
macOS Gatekeeper blocks unsigned `.dylib` files downloaded from the internet. For local development, ad-hoc signing works, but distribution requires a valid Developer ID certificate.
:::

### 4. Install Locally

```bash
osaurus tools install .
```

The plugin is installed to:

```
~/.osaurus/Tools/<plugin_id>/<version>/
```

## Plugin Structure

### manifest.json

The manifest describes your plugin's capabilities:

```json
{
  "plugin_id": "com.example.mytool",
  "version": "1.0.0",
  "description": "My awesome tool",
  "capabilities": {
    "tools": [
      {
        "id": "my_tool",
        "description": "Does something useful",
        "parameters": {
          "type": "object",
          "properties": {
            "input": {
              "type": "string",
              "description": "The input to process"
            }
          },
          "required": ["input"]
        },
        "requirements": [],
        "permission_policy": "ask"
      }
    ]
  }
}
```

### Tool Definition Fields

| Field               | Required | Description                                       |
| ------------------- | -------- | ------------------------------------------------- |
| `id`                | Yes      | Unique identifier for the tool                    |
| `description`       | Yes      | Human-readable description shown to users and AI  |
| `parameters`        | Yes      | JSON Schema defining input parameters             |
| `requirements`      | No       | System permissions needed (see below)             |
| `permission_policy` | No       | `"ask"`, `"auto"`, or `"deny"` (default: `"ask"`) |

### System Requirements

Some tools need macOS system permissions:

| Requirement     | Description                                                    |
| --------------- | -------------------------------------------------------------- |
| `automation`    | AppleScript/Apple Events—allows controlling other applications |
| `accessibility` | Accessibility API—allows UI interaction and input simulation   |

Example tool requiring automation:

```json
{
  "id": "run_applescript",
  "description": "Execute AppleScript commands",
  "parameters": {
    "type": "object",
    "properties": {
      "script": { "type": "string" }
    },
    "required": ["script"]
  },
  "requirements": ["automation"],
  "permission_policy": "ask"
}
```

## ABI Overview

Plugins expose a C-compatible interface. The header is available at:

```
Packages/OsaurusCore/Tools/PluginABI/osaurus_plugin.h
```

### Entry Point

Current plugins export:

```c
const osr_plugin_api* osaurus_plugin_entry_v2(const osr_host_api* host);
```

Osaurus tries `osaurus_plugin_entry_v2` first and passes in the host API (callbacks for config, storage, inference, HTTP, logging, dispatch). Legacy v1 plugins that export only `osaurus_plugin_entry(void)` still load — with a deprecation log — but get no host callbacks.

Either entry point returns a pointer to an `osr_plugin_api` struct whose fields are function pointers (these are struct fields, not exported symbols):

| Function                         | Description                                             |
| -------------------------------- | ------------------------------------------------------- |
| `init()`                         | Called once on load. Returns an opaque context pointer. |
| `destroy(ctx)`                   | Called on unload. Clean up resources.                   |
| `get_manifest(ctx)`              | Returns JSON string describing capabilities.            |
| `invoke(ctx, type, id, payload)` | Execute a capability. Returns JSON result.              |
| `free_string(s)`                 | Called by host to free strings returned by plugin.      |

### Invocation

When Osaurus executes a tool, it calls `invoke` with:

- `type`: Capability type (e.g., `"tool"`)
- `id`: Tool identifier (e.g., `"my_tool"`)
- `payload`: JSON string with arguments (e.g., `{"input": "hello"}`)

Return a JSON string with the result. The host calls `free_string` to release it.

## Swift Implementation

The scaffold from `osaurus tools create` is the reference implementation — it ships a byte-compatible Swift mirror of the `osr_host_api` struct, host-API helper wrappers, and a fully wired `osr_plugin_api`. The skeleton looks like this (abbreviated — run the scaffold for the complete, current version):

```swift
import Foundation

// Byte-compatible Swift mirrors of the C structs from osaurus_plugin.h
private struct osr_host_api { /* version + host callback pointers */ }
private struct osr_plugin_api { /* version + plugin function pointers */ }

private var hostAPI: UnsafePointer<osr_host_api>?

// The static API struct. Fields are C function pointers implemented as
// Swift closures: init / destroy / get_manifest / invoke / free_string,
// plus optional v2+ callbacks (handle_route, on_config_changed, on_task_event).
private var api: osr_plugin_api = {
    var api = osr_plugin_api()
    api.version = 2
    api.get_manifest = { ctx in
        strdup(#"{"plugin_id":"com.example.echo","version":"1.0.0","capabilities":{"tools":[{"id":"echo","description":"Echoes back input","parameters":{"type":"object","properties":{"message":{"type":"string"}},"required":["message"],"additionalProperties":false}}]}}"#)
    }
    api.invoke = { ctx, type, id, payload in
        // Parse the payload JSON, do the work, return a Tool Contract envelope
        strdup(#"{"ok":true,"tool":"echo","result":{"text":"Echo!"}}"#)
    }
    // ... init, destroy, free_string ...
    return api
}()

// Primary entry point: receives the host API
@_cdecl("osaurus_plugin_entry_v2")
public func osaurus_plugin_entry_v2(_ host: UnsafePointer<osr_host_api>?) -> UnsafeRawPointer? {
    hostAPI = host
    return UnsafeRawPointer(&api)
}

// Legacy fallback for old hosts
@_cdecl("osaurus_plugin_entry")
public func osaurus_plugin_entry() -> UnsafeRawPointer? {
    return UnsafeRawPointer(&api)
}
```

## Rust Implementation

Scaffold a Rust plugin with `osaurus tools create MyPlugin --language rust`. The generated `cdylib` follows the same shape — a `#[repr(C)]` mirror of the ABI structs and both entry points:

```rust
// Abbreviated — the scaffold generates the full, current version.

#[repr(C)]
pub struct OsrHostApi { /* version + host callback pointers */ }

#[repr(C)]
pub struct OsrPluginApi {
    pub version: u32,
    pub init: Option<extern "C" fn() -> *mut c_void>,
    pub destroy: Option<extern "C" fn(*mut c_void)>,
    pub get_manifest: Option<extern "C" fn(*mut c_void) -> *const c_char>,
    pub invoke: Option<extern "C" fn(*mut c_void, *const c_char, *const c_char, *const c_char) -> *const c_char>,
    pub free_string: Option<extern "C" fn(*const c_char)>,
    // v2+ optional callbacks: handle_route, on_config_changed, on_task_event
}

static mut HOST: *const OsrHostApi = std::ptr::null();
static mut API: OsrPluginApi = OsrPluginApi { /* wired to the fns above */ };

#[no_mangle]
pub unsafe extern "C" fn osaurus_plugin_entry_v2(host: *const OsrHostApi) -> *const OsrPluginApi {
    HOST = host;
    &raw const API
}

#[no_mangle]
pub unsafe extern "C" fn osaurus_plugin_entry() -> *const OsrPluginApi {
    &raw const API
}
```

## v2 Plugin ABI

The v2 ABI adds full host API access. Where v1 plugins only define and handle tools, v2 plugins can interact with the entire Osaurus runtime.

The host API is **append-only**: v2 established the full base set, and v3–v6 each appended one optional capability without changing the existing struct layout — so a plugin built against any version keeps loading on a newer host.

| ABI | Adds on top of the previous version |
|---|---|
| **v3** | `complete_cancel(stream_id)` — cancel an in-flight streaming completion from any thread |
| **v4** | `get_active_agent_id()` — learn which agent invoked the current callback; the host also enforces agent scope on plugin-initiated work |
| **v5** | `log_structured(level, message, payload)` — emit JSON fields that become searchable in Insights |
| **v6** | `free_string(ptr)` — a host-owned, allocator-stable free path for strings the host returned |

Because a newer slot is `NULL` on an older host, always guard a newer call against `host->version`:

```c
if (host->version >= 5 && host->log_structured) {
    host->log_structured(2, "event", "{\"key\":\"value\"}");
} else {
    host->log(2, "event {key=value}");  // fallback
}
```

### v2 Capabilities

| Capability | Manifest key | Description |
|---|---|---|
| Tools | `capabilities.tools` | AI-callable functions (also v1) |
| HTTP Routes | `capabilities.routes` | Register custom HTTP endpoints on the Osaurus server (OAuth, webhooks, APIs) |
| Web Apps | `capabilities.web` | Serve embedded static frontends with context injection |
| Config UI | `capabilities.config` | Native settings UI rendered in the Management window with validation |
| SQLite Storage | host API | Per-plugin sandboxed SQLite database via `PluginHostAPI` |
| Agent Dispatch | host API | Programmatically dispatch tasks to other agents |
| Inference | host API | Call chat completions through any configured model provider |
| Events | host API | Emit and subscribe to cross-plugin events |
| Docs | `docs` | README, changelog, external links rendered in the plugin detail view |

### Conversation grouping (`session_id`)

When your plugin dispatches an agent task (e.g. for an inbound Telegram message, Slack DM, GitHub webhook), pass `session_id` so subsequent dispatches with the same key **reattach to the same chat session** instead of creating a new row each time. (The legacy `external_session_key` field name is no longer accepted.)

```json
{
  "agent_id": "...",
  "task": "Reply to: Hi!",
  "session_id": "telegram:chat:12345",
  "source_plugin_id": "com.example.telegram"
}
```

The key is an arbitrary string scoped per-plugin. Use it for any external thread that should grow into a single auditable session row (Telegram chat ID, GitHub issue number, Slack thread TS).

The dispatch task ID and the persisted session ID are intentionally the same UUID, so HTTP pollers, plugins, and the chat sidebar deep-link to the same row.

### Choosing an ABI Version

- Use **v1** for simple tools that respond to invocations — file utilities, API wrappers, data transformers
- Use **v2** when your plugin needs persistent state, background processing, web UIs, or cross-agent communication
- Target a **higher version (v3–v6)** only for the specific slot you need — streaming cancellation (v3), agent-context introspection (v4), structured logging (v5), or the host-side `free_string` (v6) — and keep a defensive `host->version` check so your plugin still runs on older hosts

For the complete callback reference and migration notes, see the upstream [Host API](https://github.com/osaurus-ai/osaurus/blob/main/docs/plugins/HOST_API.md) and [ABI Versioning](https://github.com/osaurus-ai/osaurus/blob/main/docs/plugins/ABI_VERSIONS.md) docs.

There is no `"abi"` manifest key — the ABI version comes from the binary itself: which entry symbol you export and the `version` field you set on your `osr_plugin_api` struct.

### Hot Reload Development

Use `osaurus tools dev` for rapid iteration during plugin development:

```bash
osaurus tools dev com.example.myplugin
```

This watches your plugin directory and reloads the plugin when files change — no manual reinstall required.

## Publishing to the Registry

### 1. Prepare Your Plugin

Ensure your `manifest.json` contains publishing metadata:

```json
{
  "plugin_id": "com.yourcompany.mytool",
  "version": "1.0.0",
  "description": "My tool description",
  "homepage": "https://github.com/yourcompany/mytool",
  "license": "MIT",
  "authors": ["Your Name"],
  "capabilities": { ... }
}
```

### 2. Create Release Artifacts

```bash
# Build release binary
swift build -c release

# Create distribution directory
mkdir -p dist
cp .build/release/libMyTool.dylib dist/
cp manifest.json dist/

# Code sign
codesign --force --options runtime --timestamp \
  --sign "Developer ID Application: Your Name (TEAMID)" \
  dist/libMyTool.dylib

# Package
cd dist && zip -r ../mytool-macos-arm64.zip . && cd ..

# Generate checksum
shasum -a 256 mytool-macos-arm64.zip
```

### 3. Sign with Minisign (Recommended)

```bash
# Install Minisign
brew install minisign

# Generate key pair (once)
minisign -G -p minisign.pub -s minisign.key

# Sign the zip
minisign -S -s minisign.key -m mytool-macos-arm64.zip
```

### 4. Publish Release

1. Upload `mytool-macos-arm64.zip` to GitHub Releases
2. Fork [osaurus-tools](https://github.com/osaurus-ai/osaurus-tools)
3. Create `plugins/com.yourcompany.mytool.json`:

```json
{
  "plugin_id": "com.yourcompany.mytool",
  "name": "My Tool",
  "homepage": "https://github.com/yourcompany/mytool",
  "license": "MIT",
  "authors": ["Your Name"],
  "capabilities": {
    "tools": [{ "name": "my_tool", "description": "Does something" }]
  },
  "public_keys": {
    "minisign": "RWxxxxxxxxxxxxxxxx"
  },
  "versions": [
    {
      "version": "1.0.0",
      "release_date": "2025-01-15",
      "notes": "Initial release",
      "requires": { "osaurus_min_version": "0.5.0" },
      "artifacts": [
        {
          "os": "macos",
          "arch": "arm64",
          "url": "https://github.com/yourcompany/mytool/releases/download/v1.0.0/mytool-macos-arm64.zip",
          "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
          "minisign": {
            "signature": "RWxxxxxxxxxxxxxxxx",
            "key_id": "xxxxxxxx"
          }
        }
      ]
    }
  ]
}
```

4. Submit a Pull Request—CI validates your JSON automatically

## Example: osaurus-emacs

The [osaurus-emacs](https://github.com/osaurus-ai/osaurus-emacs) plugin is a real-world example of a community tool:

**manifest.json:**

```json
{
  "plugin_id": "osaurus.emacs",
  "version": "0.1.0",
  "description": "Execute Emacs Lisp code in a running Emacs instance",
  "capabilities": {
    "tools": [
      {
        "id": "execute_emacs_lisp_code",
        "description": "Execute Emacs Lisp code via emacsclient",
        "parameters": {
          "type": "object",
          "properties": {
            "code": {
              "type": "string",
              "description": "The Emacs Lisp code to execute"
            },
            "emacsclient_path": {
              "type": "string",
              "description": "Optional path to emacsclient binary"
            }
          },
          "required": ["code"]
        },
        "requirements": [],
        "permission_policy": "ask"
      }
    ]
  }
}
```

## Best Practices

1. **Keep tools focused** — One tool should do one thing well
2. **Validate inputs** — Check parameters before execution
3. **Return Tool Contract envelopes** — Use the `success`/`failure` shape from [Tool Contract](/tool-contract) so chat UI rendering and the agent's self-correction work right
4. **Document parameters** — Clear descriptions help `capabilities_discover` find your tool
5. **Set `additionalProperties: false`** on every tool's parameter schema (the schema validator enforces this and rejects unknown args with a friendly `invalid_args` envelope)
6. **Handle cleanup** — Free resources in `destroy()` and handle signals
7. **Test with `osaurus tools dev`** — Hot reload makes iteration fast

## Troubleshooting

### Plugin won't load

- Check code signature: `codesign -v libMyPlugin.dylib`
- Verify manifest.json is valid JSON
- Check Osaurus logs for error details

### Tool not appearing

- Verify `plugin_id` matches between manifest and binary
- Ensure `get_manifest` returns valid JSON
- Restart Osaurus after installing

### Execution errors

- Check parameter types match schema
- Verify all required parameters are present
- Test `invoke` with sample payloads

---

**Related:**

- [Tools & Plugins](/tools) — using existing tools
- [Tool Contract](/tool-contract) — envelope shape every tool returns
- [Sandbox Internals](/sandbox#plugin-recipes) — JSON-recipe plugins for the Linux VM
- [Tools Registry](https://github.com/osaurus-ai/osaurus-tools) — submit yours via PR

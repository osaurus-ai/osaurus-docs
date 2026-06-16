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
osaurus tools create MyPlugin --swift
cd MyPlugin
```

This creates:

```
MyPlugin/
├── Package.swift
├── manifest.json
└── Sources/
    └── MyPlugin/
        └── Plugin.swift
```

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

Your plugin must export a single symbol:

```c
osr_plugin_api* osaurus_plugin_entry(void);
```

This returns a pointer to a struct with function pointers:

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

Here's a minimal Swift plugin:

```swift
import Foundation

// Global context
var pluginContext: UnsafeMutableRawPointer? = nil

// Manifest JSON
let manifest = """
{
  "plugin_id": "com.example.echo",
  "version": "1.0.0",
  "description": "Echo plugin",
  "capabilities": {
    "tools": [{
      "id": "echo",
      "description": "Echoes back input",
      "parameters": {
        "type": "object",
        "properties": {
          "message": {"type": "string"}
        },
        "required": ["message"]
      }
    }]
  }
}
"""

@_cdecl("plugin_init")
func pluginInit() -> UnsafeMutableRawPointer? {
    return nil // No context needed for simple plugins
}

@_cdecl("plugin_destroy")
func pluginDestroy(_ ctx: UnsafeMutableRawPointer?) {
    // Cleanup if needed
}

@_cdecl("plugin_get_manifest")
func pluginGetManifest(_ ctx: UnsafeMutableRawPointer?) -> UnsafeMutablePointer<CChar>? {
    return strdup(manifest)
}

@_cdecl("plugin_invoke")
func pluginInvoke(
    _ ctx: UnsafeMutableRawPointer?,
    _ type: UnsafePointer<CChar>?,
    _ id: UnsafePointer<CChar>?,
    _ payload: UnsafePointer<CChar>?
) -> UnsafeMutablePointer<CChar>? {
    guard let id = id, let payload = payload else { return nil }

    let toolId = String(cString: id)
    let args = String(cString: payload)

    if toolId == "echo" {
        // Parse JSON arguments
        if let data = args.data(using: .utf8),
           let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
           let message = json["message"] as? String {
            let result = ["result": "Echo: \(message)"]
            if let resultData = try? JSONSerialization.data(withJSONObject: result),
               let resultString = String(data: resultData, encoding: .utf8) {
                return strdup(resultString)
            }
        }
    }

    return strdup("{\"error\": \"Unknown tool\"}")
}

@_cdecl("plugin_free_string")
func pluginFreeString(_ s: UnsafeMutablePointer<CChar>?) {
    free(s)
}

// Entry point
@_cdecl("osaurus_plugin_entry")
func osaurusPluginEntry() -> UnsafeMutableRawPointer {
    // Return function table (simplified)
    // In practice, return a pointer to osr_plugin_api struct
    return UnsafeMutableRawPointer(bitPattern: 1)!
}
```

## Rust Implementation

Scaffold a Rust plugin with `osaurus tools create MyPlugin --rust`, or create a `cdylib` manually:

```rust
use std::ffi::{CStr, CString};
use std::os::raw::c_char;

static MANIFEST: &str = r#"{
  "plugin_id": "com.example.echo",
  "version": "1.0.0",
  "description": "Echo plugin",
  "capabilities": {
    "tools": [{
      "id": "echo",
      "description": "Echoes back input",
      "parameters": {
        "type": "object",
        "properties": {"message": {"type": "string"}},
        "required": ["message"]
      }
    }]
  }
}"#;

#[no_mangle]
pub extern "C" fn plugin_init() -> *mut std::ffi::c_void {
    std::ptr::null_mut()
}

#[no_mangle]
pub extern "C" fn plugin_destroy(_ctx: *mut std::ffi::c_void) {}

#[no_mangle]
pub extern "C" fn plugin_get_manifest(_ctx: *mut std::ffi::c_void) -> *mut c_char {
    CString::new(MANIFEST).unwrap().into_raw()
}

#[no_mangle]
pub extern "C" fn plugin_invoke(
    _ctx: *mut std::ffi::c_void,
    _type: *const c_char,
    id: *const c_char,
    payload: *const c_char,
) -> *mut c_char {
    let id = unsafe { CStr::from_ptr(id).to_str().unwrap_or("") };
    let payload = unsafe { CStr::from_ptr(payload).to_str().unwrap_or("{}") };

    let result = if id == "echo" {
        // Parse and echo
        format!(r#"{{"result": "Echo: {}"}}"#, payload)
    } else {
        r#"{"error": "Unknown tool"}"#.to_string()
    };

    CString::new(result).unwrap().into_raw()
}

#[no_mangle]
pub extern "C" fn plugin_free_string(s: *mut c_char) {
    if !s.is_null() {
        unsafe { let _ = CString::from_raw(s); }
    }
}
```

## v2 Plugin ABI

The v2 ABI extends the plugin system with full host API access. While v1 plugins are limited to tool definitions and invocations, v2 plugins can interact with the entire Osaurus runtime.

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

### Conversation grouping (`external_session_key`)

When your plugin dispatches an agent task (e.g. for an inbound Telegram message, Slack DM, GitHub webhook), pass `external_session_key` so subsequent dispatches with the same key **reattach to the same chat session** instead of creating a new row each time.

```json
{
  "agent_id": "...",
  "task": "Reply to: Hi!",
  "external_session_key": "telegram:chat:12345",
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

Specify the ABI version in your manifest:

```json
{
  "plugin_id": "com.example.mytool",
  "version": "1.0.0",
  "abi": "v2",
  "capabilities": { ... }
}
```

### Hot Reload Development

Use `osaurus tools dev` for rapid iteration during plugin development:

```bash
osaurus tools dev com.example.myplugin
```

This watches your plugin directory for changes and automatically reloads the plugin when files are modified — no manual reinstall required.

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
4. **Document parameters** — Clear descriptions help the auto-selection RAG search find your tool
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

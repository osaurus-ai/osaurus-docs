---
title: Plugin Authoring
sidebar_label: Plugin Authoring
description: Build native Swift and Rust plugins for Osaurus using the Generic C ABI
---

# Plugin Authoring Guide

This guide explains how to build external plugins for Osaurus. Plugins are native binaries (`.dylib`) distributed with a `manifest.json`, providing tools that AI agents can call via MCP.

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

:::warning Code Signing Required
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

### v2 Capabilities

| Capability | Description |
| ---------- | ----------- |
| **HTTP Routes** | Register custom HTTP endpoints on the Osaurus server |
| **Web Apps** | Serve embedded web applications through the server |
| **SQLite Storage** | Persist structured data in a per-plugin SQLite database |
| **Agent Dispatch** | Programmatically dispatch tasks to other agents |
| **Inference** | Call chat completions through any configured model provider |
| **Events** | Emit and subscribe to cross-plugin events |

### Choosing an ABI Version

- Use **v1** for simple tools that respond to invocations — file utilities, API wrappers, data transformers
- Use **v2** when your plugin needs persistent state, background processing, web UIs, or cross-agent communication

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
3. **Return structured errors** — Use `{"error": "message"}` format
4. **Document parameters** — Clear descriptions help AI use tools correctly
5. **Handle cleanup** — Free resources in `destroy()` and handle signals
6. **Test locally** — Use `osaurus tools install .` during development

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

<p align="center">
  For plugin development help, join our <a href="https://discord.gg/dinoki">Discord community</a> or check the <a href="https://github.com/osaurus-ai/osaurus-tools">tools registry</a>.
</p>

---
title: Building from Source
sidebar_label: Building from Source
description: Build Osaurus from source, contribute to the project, and understand the architecture.
---

# Building from Source

Everything you need to build Osaurus from source, contribute, and understand the architecture.

## Why Contribute to Osaurus?

Osaurus is built with **native Swift**—not Python, not Electron, not wrapped web tech. This matters:

| Aspect          | Python/Electron                 | Native Swift                    |
| --------------- | ------------------------------- | ------------------------------- |
| **Performance** | Interpreter overhead, GC pauses | Compiled, ARC memory management |
| **Startup**     | 200ms+ for Python runtime       | Under 10ms binary load          |
| **Memory**      | 50MB+ baseline                  | Minimal footprint               |
| **Integration** | Bridging required               | Native macOS APIs               |

## Getting Started

### Prerequisites

- **macOS 15.5+** on Apple Silicon
- **Xcode 16.4+** with Command Line Tools
- **Swift 6.0+**
- **Git**

### Clone and Build

```bash
# Clone the repository
git clone https://github.com/osaurus-ai/osaurus.git
cd osaurus

# Open in Xcode
open osaurus.xcworkspace

# Build and run the "osaurus" scheme
# Press ⌘R or Product → Run
```

### Git hooks (lefthook)

Install [lefthook](https://github.com/evilmartians/lefthook) so the codebase stays consistently formatted:

```bash
brew install lefthook
lefthook install
```

This installs a `pre-push` hook that runs `swift-format` over the `Packages/` directory before each push.

### Project structure

```
osaurus/
├── App/                          # macOS app target (SwiftUI entry point, assets, entitlements)
├── Packages/
│   ├── OsaurusCore/              # Core library — all app logic
│   │   ├── Models/               # Data types, DTOs, configuration stores
│   │   ├── Services/             # Business logic (actors and stateless types)
│   │   ├── Managers/             # UI-facing state holders (@MainActor, observable)
│   │   ├── Views/                # SwiftUI views, organized by feature
│   │   ├── Networking/           # HTTP server, routing, relay
│   │   ├── Storage/              # SQLite databases
│   │   ├── Identity/             # Cryptographic identity and access keys
│   │   ├── Tools/                # MCP tools, plugin ABI, tool registry
│   │   ├── Folder/               # Working-folder context, file ops, batch tool
│   │   ├── Utils/                # Cross-cutting utilities
│   │   └── Tests/                # Unit and integration tests
│   ├── OsaurusCLI/               # CLI (osaurus command)
│   └── OsaurusRepository/        # Plugin registry and installation
├── docs/                         # Feature guides and documentation
├── scripts/                      # Build, release, and benchmark scripts
├── sandbox/                      # Sandbox VM Dockerfile
└── assets/                       # DMG packaging assets
```

See [`CONTRIBUTING.md`](https://github.com/osaurus-ai/osaurus/blob/main/docs/CONTRIBUTING.md) for the architecture guide and layer definitions.

### Running in Development

1. Select the `osaurus` scheme in Xcode
2. Choose "My Mac" as the run destination
3. Press ⌘R to build and run
4. View logs in Xcode's console

## Architecture overview

```
┌─────────────────────────────────────────────────────┐
│                   The Harness                       │
├──────────┬──────────┬────────────┬──────────────────┤
│ Agents   │ Memory   │ Agent Loop │ Automation       │
├──────────┴──────────┴────────────┴──────────────────┤
│              MCP Server + Client                    │
├──────────┬──────────┬───────────┬───────────────────┤
│ MLX      │ OpenAI   │ Anthropic │ Ollama / Others   │
│ Runtime  │ API      │ API       │                   │
├──────────┴──────────┴───────────┴───────────────────┤
│      Plugin System (v1 / v2 ABI) · Native Plugins   │
├──────────┬──────────┬───────────┬───────────────────┤
│ Identity │ Relay    │ Tools     │ Skills · Methods  │
├──────────┴──────────┴───────────┴───────────────────┤
│  Sandbox VM (Alpine · Apple Containerization)       │
│  vsock bridge · VirtioFS · per-agent isolation      │
└─────────────────────────────────────────────────────┘
```

Most features are accessible through the Management window (`⌘ ⇧ M`).

## Contributing

### Finding Issues

Start with issues labeled **"good first issue"**:

[Browse Good First Issues →](https://github.com/osaurus-ai/osaurus/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)

### Pull Request Process

1. **Fork** the repository
2. **Create a feature branch**: `git checkout -b feature/my-feature`
3. **Make your changes** with tests
4. **Run SwiftLint**: `swiftlint`
5. **Submit a PR** with a clear description

### Commit Messages

Follow conventional commits:

```
feat: Add support for new model architecture
fix: Resolve memory leak in streaming responses
docs: Update API documentation
test: Add integration tests for tool calling
refactor: Simplify router implementation
```

### Code Style

- Use descriptive names
- Document public APIs
- Keep functions focused and small
- Prefer immutability (`let` over `var`)
- Follow existing patterns in the codebase

## Building Plugins

Plugins extend agent capabilities. They are native binaries that expose tools via the MCP protocol.

### Quick Start

```bash
# Scaffold a new Swift plugin
osaurus tools create MyPlugin --swift
cd MyPlugin

# Build
swift build -c release

# Install locally
osaurus tools install .

# Or use dev mode for hot reload
osaurus tools dev com.example.myplugin
```

### Plugin Architecture

Plugins use a C ABI for compatibility:

```swift
@_cdecl("osaurus_plugin_entry")
func osaurusPluginEntry() -> UnsafeMutableRawPointer {
    // Return function table
}
```

See the [Plugin Authoring Guide](/plugin-authoring) for complete documentation.

### Why Native Plugins?

Python-based MCP tools (like those using `uv`) have significant overhead:

- **~200ms startup** for Python interpreter
- **Higher memory** due to GC and runtime
- **GIL limitations** for parallelism

Native Swift/Rust plugins:

- **Under 10ms load time**
- **Minimal memory footprint**
- **True parallelism**

This matters when AI agents execute dozens of tool calls per session.

## Testing

### Unit Tests

```bash
# Run all tests
xcodebuild test -workspace osaurus.xcworkspace -scheme osaurus

# Run specific test
xcodebuild test -workspace osaurus.xcworkspace -scheme osaurus \
  -only-testing:OsaurusTests/MLXServiceTests
```

### Integration Tests

```python
# test_integration.py
import requests

def test_chat_completion():
    response = requests.post(
        "http://localhost:1337/v1/chat/completions",
        json={
            "model": "gemma-4-e2b-it-4bit",
            "messages": [{"role": "user", "content": "Hello"}]
        }
    )
    assert response.status_code == 200
    assert "choices" in response.json()
```

### Performance Testing

```bash
# Run benchmark suite
./scripts/run_bench.sh

# Profile with Instruments
xcrun xctrace record --template "Time Profiler" --launch osaurus
```

## Key Components

### MLXService

Handles model loading and inference:

```swift
class MLXService {
    func loadModel(_ name: String) async throws -> MLXModel
    func generate(prompt: String, maxTokens: Int) -> AsyncStream<String>
}
```

### PluginManager

Manages tool plugins:

```swift
class PluginManager {
    func loadPlugin(at path: URL) throws
    func invoke(tool: String, arguments: [String: Any]) async throws -> Any
}
```

### HTTPHandler

Processes API requests:

```swift
struct HTTPHandler: ChannelInboundHandler {
    func channelRead(context: ChannelHandlerContext, data: NIOAny)
}
```

## Debugging

### Common Issues

**Model loading fails:**

```swift
// Check model path
print(modelPath.path)

// Verify required files
let required = ["config.json", "model.safetensors"]
```

**Plugin won't load:**

```bash
# Check code signature
codesign -v libMyPlugin.dylib

# Check for missing symbols
nm -g libMyPlugin.dylib | grep osaurus_plugin_entry
```

**Memory issues:**

```swift
// Monitor memory
let memory = ProcessInfo.processInfo.physicalMemory
print("Available: \(memory / 1024 / 1024 / 1024)GB")
```

### Debug Logging

```swift
#if DEBUG
Logger.shared.level = .trace
#endif
```

## Developer tools

Osaurus has built-in dev tools — Insights for live request monitoring and Server Explorer for endpoint testing. Open the Management window (`⌘ ⇧ M`) and click **Insights** or **Server**.

[Full Developer Tools guide →](/developer-tools)

## Resources

### Osaurus Documentation

- [FEATURES.md](https://github.com/osaurus-ai/osaurus/blob/main/docs/FEATURES.md) — Complete feature inventory and architecture overview
- [Contributing Guide](https://github.com/osaurus-ai/osaurus/blob/main/CONTRIBUTING.md) — How to contribute to Osaurus

### External Documentation

- [Swift Documentation](https://docs.swift.org)
- [SwiftNIO Guide](https://apple.github.io/swift-nio/docs/current/NIO/index.html)
- [MLX Documentation](https://ml-explore.github.io/mlx/build/html/index.html)

### Community

- [Discord](https://discord.gg/osaurus) — Get help and discuss
- [GitHub Issues](https://github.com/osaurus-ai/osaurus/issues) — Report bugs
- [GitHub Discussions](https://github.com/osaurus-ai/osaurus/discussions) — Ideas and questions
- [Community Calls](https://lu.ma/osaurus) — Bi-weekly, open to everyone

### Related Projects

- [osaurus-tools](https://github.com/osaurus-ai/osaurus-tools) — Official tool plugins
- [osaurus-emacs](https://github.com/osaurus-ai/osaurus-emacs) — Example community plugin

## Security

### Reporting Vulnerabilities

See [SECURITY.md](https://github.com/osaurus-ai/osaurus/blob/main/SECURITY.md) for reporting security issues.

### Best Practices

- Validate all inputs
- Sanitize file paths in plugins
- Use secure random for IDs
- Log security-relevant events

---

**Related:**

- [Plugin Authoring](/plugin-authoring) — extend Osaurus from outside the codebase
- [Tool Contract](/tool-contract) — the envelope every tool returns
- [Inference Runtime](/inference-runtime) — what `OsaurusCore/Services/ModelRuntime` does
- [Identity Cryptography](/identity-internals) — the spec for the `Identity/` subtree

To contribute, start with [good first issues](https://github.com/osaurus-ai/osaurus/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) on GitHub.

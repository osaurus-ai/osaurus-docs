---
title: Building from Source
sidebar_label: Building from Source
description: Build Osaurus from source with Xcode 26 and Git LFS, find your way around the repository, run the tests, and contribute.
---

# Building from Source

This page is for contributors who want to build Osaurus themselves, change its code, or send a pull request.

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

- **macOS 15.5+** on Apple Silicon (M1 or newer)
- **Xcode 26+** with Command Line Tools — the packages use Swift tools 6.2, and CI builds with Xcode 26.4.1
- **Git** and **[Git LFS](https://git-lfs.com)** — the OsaurusSync libraries and the sandbox init image are stored in LFS, so a clone without it won't build

### Clone and Build

Set up Git LFS **before** you clone, so the large files come down with the repository:

```bash
# One-time Git LFS setup
brew install git-lfs
git lfs install

# Clone the repository (LFS files download automatically)
git clone https://github.com/osaurus-ai/osaurus.git
cd osaurus

# Already cloned without LFS? Fetch the large files now
git lfs pull

# Open in Xcode
open osaurus.xcworkspace

# Build and run the "osaurus" scheme
# Press ⌘R or Product → Run
```

On first launch, pick a model in the welcome window (or in **Settings → Models → Local Models**) to generate text locally. For the fast unit-test loop, run `make test`; `make help` lists the other targets.

### Git hooks (lefthook)

Install [lefthook](https://github.com/evilmartians/lefthook) so the codebase stays consistently formatted:

```bash
brew install lefthook
lefthook install
```

This installs a `pre-push` hook that runs `swift-format lint --strict` over the `Packages/` and `App/` directories before each push (fix issues with `swift-format format --in-place --recursive Packages App`).

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
│   │   ├── Resources/Guide/      # In-app guides the Orchestrator reads
│   │   ├── Utils/                # Cross-cutting utilities
│   │   └── Tests/                # Unit and integration tests
│   ├── OsaurusCLI/               # CLI (osaurus command)
│   ├── OsaurusEvals/             # Eval suites (make evals)
│   ├── OsaurusNetworking/        # Shared networking (global proxy configuration)
│   ├── OsaurusPluginTestKit/     # Mock host for unit-testing native plugins
│   ├── OsaurusPlugins/           # First-party plugins
│   ├── OsaurusRepository/        # Plugin registry and installation
│   └── Vendor/                   # Vendored binary dependencies (LFS)
├── docs/                         # Feature guides and documentation
├── scripts/                      # Build, release, and benchmark scripts
├── sandbox/                      # Sandbox VM Dockerfile
└── assets/                       # DMG packaging assets
```

See [`docs/CONTRIBUTING.md`](https://github.com/osaurus-ai/osaurus/blob/main/docs/CONTRIBUTING.md) for the architecture guide and layer definitions.

### Telemetry in local builds

Usage analytics (Aptabase) and crash reporting (Sentry) are **off by default in source builds**: with no key, neither SDK starts, so you can build and contribute without setting anything up. To test them locally, put your own `APTABASE_APP_KEY` and `SENTRY_DSN` in `App/osaurus/Secrets.xcconfig` (it's gitignored — never commit it) and base the Debug configuration on it. Debug builds report to separate debug buckets, so local testing never mixes with production data. See [`docs/CONTRIBUTING.md`](https://github.com/osaurus-ai/osaurus/blob/main/docs/CONTRIBUTING.md) for the exact steps and [Telemetry](/telemetry) for what is collected.

### Running in Development

1. Select the `osaurus` scheme in Xcode
2. Choose "My Mac" as the run destination
3. Press ⌘R to build and run
4. View logs in Xcode's console

## Architecture overview

```
┌─────────────────────────────────────────────────────┐
│                   The Harness                       │
├──────────────┬────────────┬────────────┬────────────┤
│ Orchestrator │ Agents     │ Workflows  │ Automations│
├──────────────┼────────────┼────────────┼────────────┤
│ Chat loop    │ Memory     │ Tasks      │ Channels   │
├──────────────┴────────────┴────────────┴────────────┤
│              MCP Server + Client                    │
├──────────┬──────────┬───────────┬───────────────────┤
│ MLX      │ OpenAI   │ Anthropic │ Ollama / Others   │
│ Runtime  │ API      │ API       │                   │
├──────────┴──────────┴───────────┴───────────────────┤
│      Plugin System (v1–v6 ABI) · Native Plugins     │
├──────────┬──────────┬───────────┬───────────────────┤
│ Vault    │ Osaurus  │ Sync ·    │ Tools · Skills    │
│          │ ID       │ Relay     │                   │
├──────────┴──────────┴───────────┴───────────────────┤
│  Sandbox (Alpine · Apple Containerization)          │
│  one Linux container per agent · vsock · VirtioFS   │
└─────────────────────────────────────────────────────┘
```

See [Architecture](/architecture) for how these pieces connect. Most features are reachable from **Settings** (`⌘,`).

## Contributing

### Finding Issues

Start with issues labeled **"good first issue"**:

[Browse Good First Issues →](https://github.com/osaurus-ai/osaurus/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)

### Pull Request Process

1. **Fork** the repository
2. **Create a feature branch** from `main`: `git checkout -b feat/my-feature` (or `fix/…`, `docs/…`)
3. **Make your changes** with tests in `Packages/OsaurusCore/Tests/`
4. **Check formatting and tests**: `swift-format lint --strict --recursive Packages App` and `make test`
5. **Update the in-app guide** in `Packages/OsaurusCore/Resources/Guide/` if users or the Orchestrator need to know about the change
6. **Submit a PR** with a clear description, linked issues (`Closes #123`), and screenshots for UI changes

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
osaurus tools create MyPlugin --language swift
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
@_cdecl("osaurus_plugin_entry_v2")
public func osaurus_plugin_entry_v2(_ host: UnsafePointer<osr_host_api>?) -> UnsafeRawPointer? {
    // Keep the host API, return the plugin's function table
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
# Fast loop: OsaurusCore package tests
make test

# One suite
swift test --package-path Packages/OsaurusCore --filter ChatEngineTests

# Reproduce the CI test job exactly (needs xcbeautify)
make ci-test
```

The eval suites live in `Packages/OsaurusEvals`: `make evals-test` runs their token-free harness tests, and `make evals` runs a suite against a model.

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
# Local model throughput (osaurus bench)
make bench-mlx BENCH_MLX_ARGS="--runs 5"

# Memory recall benchmark (LOCOMO)
make bench-setup && make bench

# Profile with Instruments
xcrun xctrace record --template "Time Profiler" --launch osaurus
```

## Key Components

The snippets below are **illustrative sketches** of each component's role, not literal declarations from the codebase — check the source for the real signatures.

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

Processes API requests (a class in the real codebase):

```swift
final class HTTPHandler: ChannelInboundHandler {
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

Osaurus has built-in dev tools — **Insights** for live request monitoring and **Server → API Reference** for endpoint testing. Open **Settings** (`⌘,`) and click **Insights** or **Server** under **Developer Tools**.

[Full Developer Tools guide →](/developer-tools)

## Resources

### Osaurus Documentation

- [FEATURES.md](https://github.com/osaurus-ai/osaurus/blob/main/docs/FEATURES.md) — Complete feature inventory and architecture overview
- [Contributing Guide](https://github.com/osaurus-ai/osaurus/blob/main/docs/CONTRIBUTING.md) — How to contribute to Osaurus

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

See [`docs/SECURITY.md`](https://github.com/osaurus-ai/osaurus/blob/main/docs/SECURITY.md) for reporting security issues.

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

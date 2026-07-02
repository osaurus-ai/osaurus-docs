---
title: Apple Intelligence
sidebar_label: Apple Intelligence
description: Deep dive into Apple Foundation Models support in Osaurus
slug: /models/apple-intelligence
---

# Apple Intelligence Integration

On macOS 26+, Osaurus exposes Apple's on-device Foundation model as `foundation` — no downloads, no configuration. Send a request with `model: "foundation"` and it works.

## Overview

Apple Foundation Models give you:

- **System-integrated AI** — the same model that powers system features
- **Hardware acceleration** — optimized for the Apple Neural Engine (ANE)
- **Zero setup** — no downloads or configuration
- **Privacy** — all processing happens on-device

## Requirements

- **macOS 26 (Tahoe)** or later
- **Apple Silicon Mac** (M1, M2, M3, or newer)
- **Apple Intelligence enabled** in System Settings

:::info[Compatibility Note]
While Osaurus itself runs on macOS 15.5+, Apple Foundation Models specifically require macOS 26 (Tahoe) or later.
:::

## Setup

1. **Update macOS** to version 26 (Tahoe) or later
2. **Enable Apple Intelligence** in System Settings → Apple Intelligence & Siri
3. **Start Osaurus** — It automatically detects Foundation Models
4. **Verify availability**:

```bash
curl -s http://127.0.0.1:1337/v1/models | jq '.data[] | select(.id=="foundation")'
```

If you see a `foundation` entry, you're ready.

## Using Foundation Models

### Basic Chat

Use `model: "foundation"` in your requests:

```bash
curl -s http://127.0.0.1:1337/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "foundation",
    "messages": [{"role":"user","content":"Explain quantum computing simply"}],
    "max_tokens": 200
  }' | jq -r '.choices[0].message.content'
```

### Using the Alias

`model: "default"` also maps to Foundation Models when available:

```bash
curl -s http://127.0.0.1:1337/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "default",
    "messages": [{"role":"user","content":"Write a haiku about coding"}]
  }' | jq -r '.choices[0].message.content'
```

### Streaming Responses

Streaming works as usual:

```bash
curl -N http://127.0.0.1:1337/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "foundation",
    "messages": [{"role":"user","content":"Tell me a story about a brave robot"}],
    "stream": true
  }'
```

## Advanced Features

### Function/Tool Calling

Osaurus transparently maps OpenAI-style tools to Apple's tool interface:

```bash
curl -s http://127.0.0.1:1337/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "foundation",
    "messages": [{"role":"user","content":"What is the weather in San Francisco?"}],
    "tools": [{
      "type": "function",
      "function": {
        "name": "get_weather",
        "description": "Get weather for a city",
        "parameters": {
          "type": "object",
          "properties": {"city": {"type": "string"}},
          "required": ["city"]
        }
      }
    }],
    "tool_choice": "auto"
  }'
```

Tools work identically to MLX models: streaming emits OpenAI-style `tool_calls` deltas, and your existing tool-calling code works unchanged.

### System Prompts

Foundation Models respect system prompts:

```python
from openai import OpenAI

client = OpenAI(base_url="http://127.0.0.1:1337/v1", api_key="osaurus")

response = client.chat.completions.create(
    model="foundation",
    messages=[
        {"role": "system", "content": "You are a helpful coding assistant. Always include comments in code examples."},
        {"role": "user", "content": "Write a Python function to calculate factorial"}
    ]
)
```

## Performance Characteristics

### Advantages

- **Instant loading** — no model initialization
- **ANE acceleration** — dedicated neural hardware
- **Memory efficient** — shared with system services
- **Consistent quality** — the same model as system features

### Considerations

- **Fixed model** — no choice of size or version
- **System dependent** — requires macOS 26+
- **Limited configuration** — less control than MLX models

## Detection and Fallback

### Programmatic Detection

```python
import requests

def has_foundation_models():
    try:
        response = requests.get("http://127.0.0.1:1337/v1/models")
        models = response.json()["data"]
        return any(m["id"] == "foundation" for m in models)
    except:
        return False

# Use Foundation Models if available, fall back to MLX
if has_foundation_models():
    model = "foundation"
else:
    model = "gemma-4-e2b-it-4bit"
```

### Graceful Fallback

```javascript
async function getBestModel() {
  try {
    const response = await fetch("http://127.0.0.1:1337/v1/models");
    const { data } = await response.json();

    // Prefer Foundation Models if available
    if (data.some((m) => m.id === "foundation")) {
      return "foundation";
    }

    // Fall back to first available MLX model
    return (
      data.find((m) => m.id !== "foundation")?.id ||
      "gemma-4-e2b-it-4bit"
    );
  } catch (error) {
    return "gemma-4-e2b-it-4bit";
  }
}
```

## Privacy and Security

- **100% on-device** — Apple Foundation Models run entirely locally; inference never leaves your Mac
- **Sandboxed** — runs within macOS security boundaries
- **No API keys** — no authentication or tracking

## Troubleshooting

### Foundation model not appearing

1. **Check macOS version**:

   ```bash
   sw_vers -productVersion
   # Should be 26.0 or higher
   ```

2. **Verify Apple Intelligence is enabled**:

   - System Settings → Apple Intelligence & Siri
   - Toggle "Apple Intelligence" ON

3. **Restart Osaurus** after enabling Apple Intelligence

4. **Check system requirements**:
   ```bash
   sysctl -n machdep.cpu.brand_string
   # Should show Apple M1, M2, M3, etc.
   ```

### Errors using foundation model

**"Model not found" error:**

- Foundation Models not available on your system
- Fall back to an MLX model
- Check `/v1/models` endpoint for available models

**Slow or no response:**

- System may be loading the model initially
- Check Activity Monitor for high system usage
- Ensure adequate free memory (8GB+ recommended)

**Unexpected output:**

- Foundation Models may behave differently than MLX models
- Adjust prompts and parameters as needed
- Use system prompts for consistent behavior

### Performance issues

1. **Free up resources**:
   - Quit unnecessary apps
   - Check Activity Monitor for memory pressure
2. **Optimize requests**:

   ```json
   {
     "max_tokens": 200, // Limit output length
     "temperature": 0.7, // Balance creativity/consistency
     "stream": true // Better perceived performance
   }
   ```

3. **Monitor system health**:

   ```bash
   # Check Osaurus health
   curl -s http://127.0.0.1:1337/health | jq

   # Check system memory pressure
   vm_stat | grep "Pages free"
   ```

## Best Practices

1. **Prefer Foundation Models when available** — better integration and performance
2. **Implement fallback logic** — handle systems without Apple Intelligence
3. **Use streaming** — Foundation Models excel at streaming responses
4. **Test on both** — make sure your app works with and without Foundation Models
5. **Monitor availability** — models may be temporarily unavailable during system updates

## Related

- [Models](/models) — all supported model types
- [HTTP API](/api) — complete endpoint reference
- [Inference Runtime](/inference-runtime) — how local + Foundation inference is wired
- [Apple Intelligence Docs](https://developer.apple.com) — official Apple documentation

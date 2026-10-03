---
title: Apple Intelligence
sidebar_label: Apple Intelligence
description: Use Apple's built-in AI model in Osaurus — nothing to download, nothing to set up, and everything stays on your Mac.
slug: /models/apple-intelligence
---

# Apple Intelligence

[Apple Intelligence](/glossary#apple-intelligence) includes a small AI [model](/glossary#model) built into macOS. Osaurus can use it with nothing to download or set up. It shows up as **Foundation** in the model picker. It's private (everything stays on your Mac) and always ready, which makes it great for quick questions and for Osaurus's own background housekeeping.

You need macOS 26 (Tahoe) or later, a Mac that supports Apple Intelligence, and Apple Intelligence turned on.

## Get started

1. **Update macOS** to version 26 (Tahoe) or later.
2. **Turn on Apple Intelligence** in **System Settings → Apple Intelligence & Siri**. The first time, macOS downloads Apple's model in the background; this can take a few minutes.
3. **Open Osaurus.** It finds Apple's model automatically.
4. In a chat, click the model pill in the message box and choose **Foundation** ("Apple's built-in on-device model").

That's it — start typing.

## Requirements

- **macOS 26 (Tahoe)** or later
- **A Mac that supports Apple Intelligence** — a Mac with [Apple Silicon](/glossary#apple-silicon) (M1 or newer)
- **Apple Intelligence turned on** in System Settings

:::info[Compatibility Note]
Osaurus itself runs on macOS 15.5 and later, but Apple's model needs macOS 26 (Tahoe) or later. On older macOS, use a [local model](/models#local-models-mlx) instead.
:::

## What it's good at

- **Ready instantly** — there's nothing to load or download.
- **Private** — it runs entirely on your Mac. Nothing goes to the internet, and there's no account or key.
- **Light on your Mac** — it shares memory with macOS's own features instead of taking extra.
- **Quick tasks** — short questions, rewording, summaries of short text, and simple tool use.
- **Background jobs** — it's a good fit for Osaurus's [Core Model](/glossary#core-model) (see below).

## What it's not as good at

- **Long conversations and long documents.** It can only keep a short amount of text in mind at once (a small [context window](/glossary#context-window)). For long chats or big files, pick a larger local or [cloud model](/glossary#cloud-model).
- **Hard problems.** It's a small model. For complex reasoning, coding, or research, a bigger model will do better.
- **Choice.** There's one Apple model, with no sizes or versions to pick from, and fewer settings than other models.
- **It depends on macOS.** It needs macOS 26, and it may be briefly unavailable while macOS updates or downloads the model.

## Osaurus's background helper

Osaurus uses a small Core Model behind the scenes for housekeeping, like saving [memories](/glossary#memory) and naming chats. On macOS 26 and later, **Foundation** is the default Core Model, so these jobs stay on your Mac without any setup. You can change it in **Settings… → General → Core Model**.

If Apple Intelligence is turned off, its model is still downloading, or a request gets stuck, those background jobs automatically switch to the model you're chatting with. The Core Model picker and Memory's diagnostics show why.

## Privacy

- **Stays on your Mac** — Apple's model runs entirely on your Mac. Your messages never leave it.
- **Protected by macOS** — it runs inside macOS's own security protections.
- **No keys or accounts** — nothing to sign up for, and no tracking.

## Troubleshooting

### Foundation doesn't appear in the model picker

1. **Check your macOS version.** Open the Apple menu → **About This Mac**. It should say macOS 26 or later.
2. **Check Apple Intelligence is on.** Open **System Settings → Apple Intelligence & Siri** and turn on **Apple Intelligence**.
3. **Wait for the download.** Right after you turn it on, macOS downloads the model in the background. Try again in a few minutes.
4. **Restart Osaurus** after turning Apple Intelligence on.
5. **Check your Mac.** **About This Mac** should list an Apple M-series chip (M1, M2, M3, or later).

When Apple's model isn't available, Osaurus explains why — for example, "This Mac is not eligible for Apple Intelligence", "Apple Intelligence is turned off", or "The Apple Intelligence model is still downloading".

### Slow or no answer

- macOS may still be loading the model the first time.
- Quit apps you're not using, and check Activity Monitor for memory pressure. 8 GB of memory or more is recommended.

### Odd or off-topic answers

- Apple's model behaves differently from other models. Try rewording your request or being more specific.
- Give your agent clear standing instructions (a [system prompt](/glossary#system-prompt)) for more consistent results.
- For harder tasks, switch to a bigger model.

---

## Under the hood

Developer details for using Apple's model through Osaurus's [API](/glossary#api).

### Model name and availability

Osaurus exposes Apple's on-device Foundation model as `foundation`. Send a request with `model: "foundation"` and it works. It runs on Apple's on-device hardware, including the Apple Neural Engine (ANE), and is the same model that powers macOS system features.

Check whether it's available:

```bash
curl -s http://127.0.0.1:1337/v1/models | jq '.data[] | select(.id=="foundation")'
```

If you see a `foundation` entry, you're ready.

Check the macOS version and chip from Terminal:

```bash
sw_vers -productVersion
# Should be 26.0 or higher

sysctl -n machdep.cpu.brand_string
# Should show Apple M1, M2, M3, etc.
```

### Basic chat

```bash
curl -s http://127.0.0.1:1337/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "foundation",
    "messages": [{"role":"user","content":"Explain quantum computing simply"}],
    "max_tokens": 200
  }' | jq -r '.choices[0].message.content'
```

### The `default` alias

`model: "default"` (or an empty model) also maps to Foundation when it's available:

```bash
curl -s http://127.0.0.1:1337/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "default",
    "messages": [{"role":"user","content":"Write a haiku about coding"}]
  }' | jq -r '.choices[0].message.content'
```

### Streaming

```bash
curl -N http://127.0.0.1:1337/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "foundation",
    "messages": [{"role":"user","content":"Tell me a story about a brave robot"}],
    "stream": true
  }'
```

### Function / tool calling

Osaurus maps OpenAI-style tools to Apple's tool interface automatically:

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

Tools work the same as with MLX models: streaming emits OpenAI-style `tool_calls` deltas, and existing tool-calling code works unchanged.

### System prompts

Foundation respects system prompts:

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

### Context size

Osaurus reads the model's context size from Apple's framework (`SystemLanguageModel.contextSize`). On macOS 26.x it's 4,096 [tokens](/glossary#token), which is why long chats and documents are a poor fit.

### Detection and fallback

Detect Foundation and fall back to an MLX model:

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

If you get **"Model not found"**, Foundation isn't available on this system: fall back to an MLX model and check `/v1/models` for what's available.

### Performance tips

Keep requests small and stream for better perceived speed:

```json
{
  "max_tokens": 200, // Limit output length
  "temperature": 0.7, // Balance creativity/consistency
  "stream": true // Better perceived performance
}
```

Monitor health:

```bash
# Check Osaurus health
curl -s http://127.0.0.1:1337/health | jq

# Check system memory pressure
vm_stat | grep "Pages free"
```

### Best practices for apps

1. **Prefer Foundation when available** — it's integrated with the system and loads instantly.
2. **Build in fallback logic** — handle Macs without Apple Intelligence.
3. **Use streaming** — Foundation does well with streamed responses.
4. **Test both paths** — make sure your app works with and without Foundation.
5. **Watch availability** — the model can be temporarily unavailable during system updates.

---

**Related:**

- [Models](/models) — every kind of model Osaurus supports
- [HTTP API](/api) — the complete endpoint reference
- [Inference Runtime](/inference-runtime) — how local and Foundation inference fit together
- [Apple Intelligence Docs](https://developer.apple.com) — Apple's official documentation

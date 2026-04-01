---
title: Model Management
sidebar_label: Models
description: Complete guide to managing, downloading, and using models in Osaurus
---

# Model Management

Osaurus supports a wide variety of MLX-optimized models and Apple Foundation Models. This guide covers model management and configuration.

## Model Manager

Access the Model Manager through the Osaurus menu bar icon.

### Downloading Models

1. Click the Osaurus menu bar icon
2. Select **Model Manager**
3. Browse or search for models
4. Click **Download** on your chosen model
5. Monitor progress in the download queue

### Model Information

Each model displays:

- **Name** — Model identifier
- **Size** — Download and disk size
- **Quantization** — Bit precision (4-bit, 8-bit)
- **Parameters** — Model size in billions
- **Download Status** — Current state

### Managing Storage

Models are stored at:

```
~/MLXModels
```

Override this location with the `OSU_MODELS_DIR` environment variable.

To remove models:

1. Open Model Manager
2. Find the downloaded model
3. Click **Delete**
4. Confirm removal

## Model Types

### MLX Models

MLX models are optimized specifically for Apple Silicon. Osaurus supports a wide range of model architectures:

**Supported Architectures:**

- **Llama** — Meta's Llama 3.2, Llama 3.1, and earlier versions
- **Qwen** — Alibaba's Qwen 2.5 series
- **Gemma** — Google's Gemma and Gemma 2 models
- **Mistral** — Mistral AI's instruction-tuned models
- **DeepSeek** — DeepSeek Coder and general models
- **Phi** — Microsoft's Phi series

**Quantization Options:**

- **4-bit Quantization** — Best speed/quality trade-off
- **8-bit Quantization** — Higher quality, more memory
- **16-bit** — Maximum quality, significant memory usage

### Apple Foundation Models

Available on supported macOS versions:

```bash
# Use with model ID "foundation"
curl -X POST http://127.0.0.1:1337/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "foundation",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

Features:

- System-integrated model
- No download required
- Optimized for Apple Silicon
- Privacy-focused design

### Liquid Foundation Models

Osaurus supports Liquid AI's LFM family — on-device models built on a non-transformer architecture optimized for edge deployment. Fast decode, low memory footprint, and strong tool calling out of the box.

Features:

- Non-transformer architecture tuned for edge inference
- Fast token generation on Apple Silicon
- Low memory footprint compared to equivalent-quality transformers
- Strong tool calling performance

### Cloud Providers

The harness is model-agnostic. Connect to cloud providers when you need more power — your agents, memory, and tools stay intact regardless of which provider you use.

| Provider | Description |
| -------- | ----------- |
| **OpenAI** | GPT-4o, GPT-4, and other OpenAI models |
| **Anthropic** | Claude family of models |
| **Gemini** | Google's Gemini models |
| **xAI / Grok** | xAI's Grok models |
| **Venice AI** | Privacy-focused, uncensored inference with no data retention |
| **OpenRouter** | Unified access to multiple model providers |
| **Ollama** | Local and remote Ollama instances |
| **LM Studio** | Local model serving via LM Studio |

Context and memory persist across all providers. Switch freely without losing what the AI has learned about you.

## Model Naming Convention

Osaurus uses consistent model naming:

```
{model-family}-{version}-{size}-{variant}-{quantization}
```

Examples:

- `llama-3.2-3b-instruct-4bit`
- `mistral-7b-instruct-v0.2-4bit`
- `deepseek-coder-7b-instruct-4bit`

## Performance Characteristics

### Memory Requirements

| Model Size | 4-bit   | 8-bit   | 16-bit   |
| ---------- | ------- | ------- | -------- |
| 2-3B       | 2-3GB   | 4-6GB   | 8-12GB   |
| 7-8B       | 4-5GB   | 8-10GB  | 16-20GB  |
| 13B        | 8-10GB  | 16-20GB | 32-40GB  |
| 30B+       | 20-25GB | 40-50GB | 80-100GB |

### Speed Benchmarks

Typical tokens per second on M2:

| Model | 4-bit | 8-bit |
| ----- | ----- | ----- |
| 3B    | 40-60 | 30-45 |
| 7B    | 20-35 | 15-25 |
| 13B   | 12-20 | 8-15  |

## Model Configuration

### Context Length

Default context lengths by model family:

- **Llama 3.2** — 4096 tokens
- **Mistral** — 8192 tokens
- **Qwen 2.5** — 32768 tokens
- **DeepSeek** — 4096 tokens

### Temperature Settings

Recommended temperature ranges:

- **Creative Writing** — 0.7-1.0
- **Code Generation** — 0.1-0.3
- **General Chat** — 0.5-0.7
- **Factual Responses** — 0.0-0.3

### System Prompts

Configure default system prompts in Settings:

```python
{
  "model": "llama-3.2-3b-instruct-4bit",
  "messages": [
    {
      "role": "system",
      "content": "You are a helpful, concise assistant."
    },
    {
      "role": "user",
      "content": "Explain quantum computing"
    }
  ]
}
```

## Advanced Configuration

There are no global model aliasing or preloading options at this time. Control behavior per request via the OpenAI-compatible API.

## Troubleshooting

### Model Not Found

1. Verify model is downloaded in Model Manager
2. Check exact model name:
   ```bash
   curl http://127.0.0.1:1337/v1/models
   ```
3. Ensure correct spelling and format

### Slow Performance

1. Check Activity Monitor for memory pressure
2. Try smaller or more quantized models
3. Close unnecessary applications
4. Reduce context length in requests

### Download Issues

1. Check internet connection
2. Verify available disk space
3. Try pausing and resuming download
4. Check Model Manager logs

### Memory Errors

1. Monitor RAM usage during inference
2. Switch to more quantized versions
3. Reduce max_tokens in requests
4. Consider smaller models

## Model Updates

Osaurus periodically updates available models:

1. New models appear automatically in Model Manager
2. Updated versions are marked with badges
3. Old versions remain usable until deleted
4. Check GitHub releases for model announcements

---

<p align="center">
  For model help, join our <a href="https://discord.gg/dinoki">Discord community</a> or check the <a href="/benchmarks">benchmarks page</a>.
</p>

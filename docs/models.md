---
title: Models
sidebar_label: Models
description: Local models on your Mac, Apple's on-device foundation model, or any cloud provider — your agents, memory, and tools work the same across all of them.
---

# Models

Osaurus is model-agnostic. Run a fast 2B local model on the train, switch to GPT-4o at the office, hand off to Apple's on-device Foundation model on the weekend — your agents, memory, and tools stay intact across all of them.

## What you can run

| Source | Where it runs | macOS | Setup |
|---|---|---|---|
| **MLX (local)** | On your Mac, Apple Silicon | 15.5+ | Download once via Model Manager |
| **Apple Foundation** | On your Mac, Apple Neural Engine | 26+ | Zero — model name is just `foundation` |
| **Liquid Foundation** | On your Mac | 15.5+ | Download via Model Manager |
| **Cloud providers** | Their servers | 15.5+ | API key in **Management → Providers** |

## Local models (MLX)

Local models run through MLX, Apple's array framework with first-class GPU support via unified memory, optimized for Apple Silicon.

### Downloading

1. Open the Management window (`⌘ ,`) → **Models**
2. Browse or search the catalog
3. Click **Download** on a model
4. Watch progress in the queue

Each entry shows name, parameter count, quantization (4-bit / 8-bit / JANGTQ / mxfp4), and total disk size.

### Where models live

By default, models live at `~/MLXModels/`. To put them on an external drive (helpful for big models), set `OSU_MODELS_DIR`:

```bash
export OSU_MODELS_DIR=/Volumes/External/MLXModels
```

To remove a model: **Models → Downloaded → Delete**.

### Reusing models you already have

Osaurus discovers models downloaded by other tools, so you never fetch the same weights twice:

- **Hugging Face cache** — the standard locations (`HF_HUB_CACHE`, `HF_HOME/hub`, `~/.cache/huggingface/hub`) are scanned automatically, and you can point Osaurus at a **custom cache path** in Settings (text field, folder picker, and a reset).
- **LM Studio** — models in LM Studio's directory are discovered too.

The chat picker filters out local bundles that aren't in MLX format and embedding-only models. MLX models that fail the runtime compatibility check may still appear but will error at load time.

### Curated lineup on Hugging Face

Osaurus maintains its own [optimized model library on Hugging Face](https://huggingface.co/OsaurusAI). Downloads from the in-app Model Manager pull from this library by default. Highlights:

#### Small / fast — start here

| API name | Params | Size | Notes |
|---|---|---|---|
| `gemma-4-e2b-it-4bit` | 2B | ~1.5 GB | **Recommended first model.** Tool calling out of the box. |
| `gemma-4-e2b-it-8bit` | 2B | ~2.5 GB | Same model, higher quality |
| `gemma-4-e4b-it-4bit` | 4B | ~2.6 GB | Step up in capability |
| `gemma-4-e4b-it-8bit` | 4B | ~4.2 GB | |
| `laguna-xs.2-jangtq` | 3B | ~1.6 GB | OsaurusAI's tiny JANGTQ-quantized model |

#### Mid-range

| API name | Params | Active | Size | Notes |
|---|---|---|---|---|
| `gemma-4-26b-a4b-it-4bit` | 26B MoE | 4B | ~13 GB | Solid coding + reasoning |
| `gemma-4-26b-a4b-it-jang_4m` | 26B MoE | 4B | smaller | OsaurusAI JANGTQ variant |
| `gemma-4-31b-it-jang_4m` | 31B | dense | | |
| `qwen3.5-35b-a3b-jang_2s` | 35B MoE | 3B | smallest | |
| `qwen3.5-35b-a3b-jang_4k` | 35B MoE | 3B | | |
| `qwen3.6-27b-jang_4m` | 27B | dense | | |

#### Vision-capable (image input + text output)

| API name | Params | Active | Size | Notes |
|---|---|---|---|---|
| `mistral-medium-3.5-128b-jangtq` | 128B | dense | | Mistral's flagship vision model |
| `mistral-medium-3.5-128b-mxfp4` | 128B | dense | | mxfp4 variant |
| `nemotron-3-nano-omni-30b-a3b-jangtq2` | 30B MoE | 3B | | NVIDIA Nemotron Omni |
| `nemotron-3-nano-omni-30b-a3b-jangtq4` | 30B MoE | 6B | | |
| `holo3-35b-a3b-jangtq2` | 35B MoE | 3B | | Holo3 vision model |
| `qwen3.6-35b-a3b-jangtq2` | 35B MoE | 3B | | Qwen vision |

#### Large frontier-class

| API name | Params | Active | Notes |
|---|---|---|---|
| `qwen3.5-122b-a10b-jang_2s` | 122B MoE | 10B | Largest available |
| `qwen3.5-122b-a10b-jang_4k` | 122B MoE | 10B | |
| `minimax-m2.7-jangtq` | 15B | dense | |
| `minimax-m2.7-jangtq4` | 29B | dense | |
| `deepseek-v4-flash-jangtq` | 21B | dense | |

For the canonical, always-up-to-date list, see [OsaurusAI on Hugging Face](https://huggingface.co/OsaurusAI).

### About the quantizations

A model's filename hints at how it was compressed (smaller = uses less RAM, larger = higher quality):

| Suffix | What it is |
|---|---|
| `4bit` / `8bit` | Standard MLX integer quantization |
| `mxfp4` | Apple's MX FP4 — block floating-point, great quality at 4-bit footprint |
| `JANGTQ` / `JANGTQ2` / `JANGTQ4` | OsaurusAI's curated quants, tuned for Apple Silicon. Better quality-to-size than off-the-shelf 4-bit. |
| `JANG_2L`, `JANG_4M`, `JANG_2S`, `JANG_4K` | Variant codes — different bit widths × calibration recipes |

Rule of thumb: for a model with multiple variants, try the one ending in `JANGTQ4` first (best quality for the size), then drop to `JANGTQ2` or `JANG_2S` if you need less RAM.

### Tool calling

Tool calling works across every family above. Osaurus's tool-call parser handles JSON, Qwen XML, Mistral, GLM-4, LFM2, Kimi K2, Gemma 3/4, and MiniMax M2 dialects automatically — your agents don't care which model produced the call.

### How much RAM does a model need?

Apple Silicon shares VRAM with system memory. Approximate RAM per model:

- **4-bit**: ~0.6 GB per billion parameters
- **8-bit**: ~1.2 GB per billion parameters
- **MoE models**: only the active-parameter weights are touched per token, so a 35B/3B-active MoE behaves closer to a 3B model in steady-state memory

So `gemma-4-e2b-it-4bit` (2B, 4-bit) needs ~1.5 GB; `qwen3.6-35b-a3b-jangtq2` (35B/3B-active) effectively needs RAM in the 3B-class plus expert weights swap-in.

Pick a quantization that leaves room for the rest of your work and your Core Model.

### Loaded models and eviction

Configure how local models are cached in **Management → Server → Settings → Model Memory**:

| Policy | Behavior |
|---|---|
| **Strict (One Model)** | Only one local model loaded at a time (default). Switching unloads the previous one. |
| **Flexible (Multi Model)** | Multiple models loaded concurrently. **Required if your Core Model is local and different from your chat model** — otherwise the two will fight over the slot. |

Models load on demand when a chat window opens (with prefix caching warm-up) and unload when no chat references them.

## Apple Foundation Models

On macOS 26 (Tahoe) or later, you can use Apple's on-device system model with **zero configuration** and **zero downloads**.

```bash
curl http://127.0.0.1:1337/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "foundation",
    "messages": [{"role":"user","content":"Hello!"}]
  }'
```

The model name is literally `foundation`. Tool calling, streaming, and the standard generation parameters all work — Osaurus translates between OpenAI/Anthropic semantics and Apple's native interface automatically. It's also the recommended **Core Model** for memory and capability auto-selection on macOS 26+.

[Apple Intelligence guide →](/models/apple-intelligence)

## Liquid Foundation Models

[Liquid AI's LFM](https://www.liquid.ai/models) family is built on a non-transformer architecture optimized for edge deployment. Highlights:

- Fast token generation on Apple Silicon
- Low memory footprint compared to equivalent-quality transformers
- Strong tool calling out of the box

Download LFM models the same way as any other MLX model — they appear in the Model Manager catalog.

## Cloud providers

Connect to cloud providers when you need more power. Each provider's models appear alongside local models in the model picker; switching is one click.

| Provider | Notes |
|---|---|
| **OpenAI** | GPT-4o, o-series, etc. — API key or ChatGPT / Codex sign-in |
| **Anthropic** | Claude family via Anthropic Messages |
| **Gemini** | Google Gemini |
| **xAI / Grok** | xAI's Grok — API key or browser sign-in |
| **Mistral** | Mistral models, with a reasoning-effort control for adjustable reasoning |
| **DeepSeek** | DeepSeek V-series via OpenAI-compatible endpoint |
| **MiniMax** | MiniMax M-series models |
| **Venice AI** | Privacy-focused, uncensored, no data retention |
| **AtlasCloud** | DeepSeek, Qwen, GLM, Kimi, MiniMax under one key |
| **Azure OpenAI** | OpenAI models on your own Azure resource and deployments |
| **OpenRouter** | One key, many providers (`openai/gpt-4o`, `anthropic/claude-3.5-sonnet`, …) |
| **Ollama** | Local or remote Ollama servers |
| **LM Studio** | LM Studio's local server (via Custom) |
| **[Osaurus Router](/osaurus-router)** | Hosted inference tied to your Osaurus account — no key to paste |

Add a provider via **Management → Providers → Add Provider**. Connect with an API key (stored in the macOS Keychain) or a browser sign-in where supported. [Remote Providers →](/remote-providers)

Memory and agent context persist across providers — switching from your local Gemma to Claude 4 or GPT-4o doesn't lose your agent's memory.

## Model naming

API model names are the model's display name in lowercase with hyphens for spaces:

| Display name | API name |
|---|---|
| `Gemma 4 E2B it 4bit` | `gemma-4-e2b-it-4bit` |
| `Qwen3.6 35B A3B JANGTQ2` | `qwen3.6-35b-a3b-jangtq2` |
| `Mistral Medium 3.5 128B JANGTQ` | `mistral-medium-3.5-128b-jangtq` |

List models from any client:

```bash
curl http://127.0.0.1:1337/v1/models
```

## Per-request settings

Most behavior is per-request via the API. Common parameters:

```json
{
  "model": "gemma-4-e2b-it-4bit",
  "messages": [{ "role": "user", "content": "Hello" }],
  "temperature": 0.7,
  "max_tokens": 1000,
  "top_p": 0.9,
  "stream": true
}
```

Recommended temperature ranges:

| Use case | Temperature |
|---|---|
| Code, deterministic tasks | 0.0–0.3 |
| Factual responses | 0.0–0.3 |
| General chat | 0.5–0.7 |
| Creative writing | 0.7–1.0 |

[Full API reference →](/api)

## Context length

Osaurus picks a sane default for each model's context limit automatically. Multi-turn caching is also automatic — repeating the same system prompt across messages is cheap. For tunables, see [Inference Runtime](/inference-runtime).

## Troubleshooting

### "Model not found"

- Check it's downloaded: **Management → Models → Downloaded**
- List API model names: `curl http://127.0.0.1:1337/v1/models`
- Match the API name exactly (lowercase, hyphens)

### Slow generation

- Try a smaller / more aggressively-quantized variant (e.g. `JANGTQ2` instead of `JANGTQ4`)
- Close memory-hungry apps
- Reduce `max_tokens`
- Watch Activity Monitor for memory pressure

### Download fails

- Check internet connection and disk space
- Pause and resume; partial files are kept
- Try a different mirror via the model card's "Source" link

### Out of memory

- Switch to a more aggressive quantization (`JANGTQ2`, `JANG_2S`, or 4-bit instead of 8-bit)
- Reduce `max_tokens`
- Consider a smaller model (drop from MoE-large to `gemma-4-e2b-it-4bit`)
- Switch to **Strict (One Model)** eviction policy if you have multiple loaded

## Image models

Chat models aren't the only kind — Osaurus also runs local **image models** (Z-Image Turbo, FLUX.1 Schnell, Qwen-Image, Ideogram) for fully offline image generation and editing. They're installed from the **Images** tab in the Management window and covered separately: [Image Generation →](/image-generation)

## Under the hood

Curious about continuous batching, the KV cache, batch size tuning, or how the inference path is structured? See [Inference Runtime](/inference-runtime).

---

**Related:**

- [Apple Intelligence](/models/apple-intelligence) — using `foundation` on macOS 26+
- [Remote Providers](/remote-providers) — connecting cloud providers
- [Osaurus Router](/osaurus-router) — hosted inference with no key to paste
- [Inference Runtime](/inference-runtime) — how MLX inference works under the hood
- [OsaurusAI on Hugging Face](https://huggingface.co/OsaurusAI) — the canonical model catalog

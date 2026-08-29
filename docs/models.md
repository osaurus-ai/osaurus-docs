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
| **Cloud providers** | Their servers | 15.5+ | API key in **Management → Cloud Models** |

## Local models (MLX)

Local models run through MLX, Apple's array framework with first-class GPU support via unified memory, optimized for Apple Silicon.

### Downloading

1. Open the Management window (`⌘ ⇧ M`) → **Local Models**
2. Browse or search the catalog
3. Click **Download** on a model
4. Watch progress in the queue

Each entry shows name, parameter count, quantization (MXFP8 / MXFP4 / JANGTQ / JANG / 4-bit / 8-bit), and total disk size.

The catalog is **dynamic**: a curated set of OsaurusAI models is merged with a live fetch of the [OsaurusAI Hugging Face org](https://huggingface.co/OsaurusAI), and searching also discovers MLX-compatible repos from `mlx-community` and beyond. You can paste any Hugging Face URL or `org/repo` id straight into the search field to import a model directly — Osaurus checks MLX compatibility before offering the download.

For a private Hugging Face repository, configure your Hugging Face token first. Catalog lookup, metadata validation, and download requests then authenticate with that token; the public OsaurusAI registry remains curated separately. A private repo still needs the normal MLX model files to be importable.

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

Osaurus maintains its own [optimized model library on Hugging Face](https://huggingface.co/OsaurusAI). Downloads from the in-app Model Manager pull from this library by default; the in-app catalog is the canonical, always-current list, so treat the highlights below as a snapshot of the families rather than an exhaustive table.

**Top picks** (what onboarding recommends, chosen to fit your Mac's RAM):

| Family | What it is |
|---|---|
| **Ornith 1.5** (9B / 35B-A3B MXFP8) | Vision-language models tuned for agentic coding at near-lossless MXFP8 precision. |
| **Nanbeige 4.2 3B** (JANG_6M) | Compact local model offered as an onboarding Top Pick for smaller memory budgets. |
| **Gemma 4 E2B / E4B** (8-bit) | Small multimodal choices for lower-memory Macs. |
| **Gemma 4 12B MXFP8** | Google's multimodal Gemma — images, video, and audio in, high-precision MXFP8. |
| **LFM2.5 8B MoE** | Liquid AI's hybrid MoE (~1B active) — very fast Apple Silicon chat. |

**The wider catalog** spans small edge builds (Gemma 4 E2B/E4B), Qwen 3.6 dense and MoE vision models (some with multi-token-prediction speculative decode), reasoning hybrids (Nemotron-3 Nano Omni, ZAYA1, DeepSeek V4 Flash), agentic-coding MoEs (Poolside Laguna-XS.2, MiniMax M2.7), Ling-2.6 Flash, Mistral Medium 3.5 + Pixtral vision, and very large specialist showcases (Kimi K2.6, Hunyuan 3, Nemotron-3 Ultra 550B). Each card shows size, capabilities, and quantization variants in a Versions picker.

### About the quantizations

A model's filename hints at how it was compressed (smaller = uses less RAM, larger = higher quality):

| Suffix | What it is |
|---|---|
| `4bit` / `8bit` | Standard MLX integer quantization |
| `MXFP4` | Block floating-point 4-bit — best quality per byte, fastest decode |
| `MXFP8` | Block floating-point 8-bit — near-lossless precision |
| `qat` | Quantization-aware-trained build (trained to survive 4-bit) |
| `JANGTQ` / `JANGTQ2` / `JANGTQ4` / `JANGTQ_K` | OsaurusAI's TurboQuant quants (2-bit / 4-bit / K-quant routed experts), tuned for Apple Silicon |
| `JANG` (e.g. `1bit`, `Ternary`) | Extreme low-bit affine JANG weights — the smallest footprints in the catalog |
| `MTP` | Ships multi-token-prediction speculative decoding for faster generation |

Rule of thumb: prefer the `MXFP8` build of a family when your RAM allows it, `MXFP4` or `JANGTQ4` for the balance point, and the 2-bit `JANGTQ` / low-bit `JANG` builds when you need the smallest footprint.

### Tool calling

Tool calling works across every family above. Osaurus's tool-call parser handles JSON, Qwen XML, Mistral, GLM-4, LFM2, Kimi K2, Gemma 3/4, and MiniMax M2 dialects automatically — your agents don't care which model produced the call.

### Thinking (reasoning) models

Whether a local model supports thinking is **detected from its chat template**, not hardcoded — new reasoning families are picked up automatically the moment you download them. When a model exposes a thinking toggle, the model picker shows a **Thinking** control, and the chip reports the model's true default (some families think unless told not to, others only when asked). Reasoning output streams separately from the answer — the Think panel in chat, `reasoning_content` over the API. A few families get tuned defaults (e.g. Ling ships with thinking off by default, with explicit opt-in preserved).

#### DeepSeek V4 Flash 0731

DeepSeek V4 Flash bundles expose a four-level **Reasoning Mode** under the model's options:

- **Off** — uses the compatibility `instruct`/direct-answer rail
- **Low** — the bundle default
- **High** — more reasoning
- **Max** — maximum 0731 reasoning effort

Low, High, and Max pass the corresponding 0731 effort value to the runtime; they are not aliases for a generic on/off toggle.

Leave temperature unset to use the bundle's sampling defaults unless you specifically need deterministic output. An explicit agent or request `temperature: 0` overrides those defaults, forces greedy argmax decoding, and makes `top_p` inert. On long DSV4 reasoning runs, that deterministic path can amplify repetition once the model revisits a prior state.

### How much RAM does a model need?

Apple Silicon shares VRAM with system memory. Approximate RAM per model:

- **4-bit**: ~0.6 GB per billion parameters
- **8-bit**: ~1.2 GB per billion parameters
- **MoE models**: only the active-parameter weights are touched per token, so a 35B/3B-active MoE behaves closer to a 3B model in steady-state memory

So `gemma-4-e2b-it-4bit` (2B, 4-bit) needs ~1.5 GB; a 35B/3B-active MoE like `qwen3.6-35b-a3b-mxfp4` effectively needs RAM in the 3B-class plus expert weights swap-in.

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
| **Fireworks AI** | Hosted open models through an OpenAI-compatible API |
| **MiniMax** | MiniMax M-series models |
| **Venice AI** | Privacy-focused, uncensored, no data retention |
| **AtlasCloud** | DeepSeek, Qwen, GLM, Kimi, MiniMax under one key |
| **Azure OpenAI** | OpenAI models on your own Azure resource and deployments |
| **OpenRouter** | One key, many providers (`openai/gpt-4o`, `anthropic/claude-3.5-sonnet`, …) |
| **Ollama** | Local or remote Ollama servers |
| **LM Studio** | LM Studio's local server (via Custom) |
| **[Osaurus Router](/osaurus-router)** | Hosted inference tied to your Osaurus account — no key to paste |

Add a provider via **Management → Cloud Models → Add Provider**. Connect with an API key (stored in the macOS Keychain) or a browser sign-in where supported. [Remote Providers →](/remote-providers)

Memory and agent context persist across providers — switching from your local Gemma to Claude 4 or GPT-4o doesn't lose your agent's memory.

Custom providers can advertise model context windows through `/models`. Osaurus recognizes positive integer `max_model_len` (vLLM), `context_length` (OpenRouter and LM Studio), `max_context_length` (llama.cpp), and `context_window`, displays the value in the picker, and uses it for context budgeting. Missing or malformed values fall back safely without failing provider discovery.

## Model naming

API model names are the model's display name in lowercase with hyphens for spaces:

| Display name | API name |
|---|---|
| `Gemma 4 E2B it 4bit` | `gemma-4-e2b-it-4bit` |
| `Ornith 1.5 9B MXFP8` | `ornith-1.5-9b-mxfp8` |
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

## Audio-capable local models

Osaurus detects audio support from the installed checkpoint, not only the model name. Compatible Gemma 4 and Nemotron Omni bundles show a waveform badge and allow audio files in the attachment picker. Audio is delivered to the local model alongside text and images; support is model-specific, so rely on the picker badge rather than assuming every multimodal bundle accepts sound.

## Troubleshooting

### "Model not found"

- Check it's downloaded: **Management → Local Models → Downloaded**
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

- Switch to a more aggressive quantization (2-bit `JANGTQ`, low-bit `JANG`, or 4-bit instead of 8-bit)
- Reduce `max_tokens`
- Consider a smaller model (drop from MoE-large to `gemma-4-e2b-it-4bit`)
- Switch to **Strict (One Model)** eviction policy if you have multiple loaded

## Image models

Chat models aren't the only kind — Osaurus runs local **image models** (Z-Image Turbo, FLUX.1 Schnell, Qwen-Image, Ideogram) for fully offline image generation and editing, and can expose catalog-driven hosted image/video targets from Venice and Osaurus Cloud. [Image & Video Generation →](/image-generation)

## Under the hood

Curious about continuous batching, the KV cache, batch size tuning, or how the inference path is structured? See [Inference Runtime](/inference-runtime).

---

**Related:**

- [Apple Intelligence](/models/apple-intelligence) — using `foundation` on macOS 26+
- [Remote Providers](/remote-providers) — connecting cloud providers
- [Osaurus Router](/osaurus-router) — hosted inference with no key to paste
- [Inference Runtime](/inference-runtime) — how MLX inference works under the hood
- [OsaurusAI on Hugging Face](https://huggingface.co/OsaurusAI) — the canonical model catalog

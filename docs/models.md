---
title: Models
sidebar_label: Models
description: Choose the AI that answers you — download a model that runs on your Mac, use Apple's built-in one, or connect a cloud service. Your agents, memory, and tools work the same with all of them.
---

# Models

A [model](/glossary#model) is the AI "brain" that reads your message and writes the reply. Osaurus can use models that run entirely on your Mac, Apple's built-in model, or models from cloud companies like OpenAI and Anthropic — and you can switch anytime without losing your agents, memory, or tools.

All you need is a Mac with [Apple Silicon](/glossary#apple-silicon) (M1 or later). Local models need some free disk space and memory; cloud models need an internet connection.

## Get started

The quickest way to start is to download a [local model](/glossary#local-model). It runs on your Mac, works offline, and nothing you type leaves your computer.

1. Open **Settings…** (`⌘ ,`) → **Local Models**.
2. Browse the list, or type a name in the search field.
3. Click **Download** on a model. Progress shows in the download queue, and you can pause and resume.
4. In a chat, click the model pill in the message box and pick your new model.

Not sure which to pick? Ask the [Orchestrator](/glossary#orchestrator) in chat to recommend one for your Mac and download it for you.

## What you can run

| Kind | Where it runs | macOS | How to set it up |
|---|---|---|---|
| **Local models** | On your Mac | 15.5+ | Download once from **Settings… → Local Models** |
| **Apple Foundation** | On your Mac, using Apple's built-in model | 26+ | Nothing to download — pick **Foundation** in the model picker |
| **Liquid Foundation** | On your Mac | 15.5+ | Download from **Settings… → Local Models** |
| **Cloud providers** | On the provider's servers | 15.5+ | Add an [API key](/glossary#api-key) or sign in from **Settings… → Providers** |

## Choosing a model in chat

Click the model pill in the chat message box. You'll see a **Provider** column and a **Model** column:

- Your installed **Local** models come first.
- Next is **Osaurus Cloud** — hosted models from [Osaurus Router](/osaurus-router), paid for with [credits](/glossary#credits).
- Then any cloud providers you've connected.

If you haven't set up Local or Osaurus Cloud yet, they still appear with an **Explore** button. For Local, it opens model downloads in Settings. For Osaurus Cloud, it opens the Cloud model browser.

The Osaurus Cloud list shows your favorites plus the model you're using now. Click the star next to a model to add or remove it as a favorite. **More models** opens the full Local or Cloud list.

### Model options

Some models have extra settings. When you select one, a third **Model options** column appears:

- **Thinking** — **Default**, **On**, or **Off**. Thinking models work through a problem step by step before answering. Their reasoning shows in a separate Think panel in the chat.
- **Reasoning level** — how hard the model thinks, on models that support it.
- **Speculative Depth** — a speed-up some models support (see [Under the hood](#speculative-depth)).
- Any other on/off switches the model offers.

Each option shows your saved choice or the model's default. Click **Reset to default** to undo a change. The card stays open while you choose; click outside it or press Escape to close it.

## Local models (MLX)

Local models run on your Mac using [MLX](/glossary#mlx), Apple's technology for running AI quickly on Apple Silicon.

### Downloading

1. Open **Settings…** (`⌘ ,`) → **Local Models**.
2. Browse or search the catalog.
3. Click **Download** on a model.
4. Watch progress in the queue.

Each entry shows the model's name, size in [parameters](/glossary#parameters) (like "4B" for 4 billion), how it was compressed ([quantization](/glossary#quantization), like 4-bit or 8-bit), and how much disk space it needs.

To bring in a model that isn't listed, paste its [Hugging Face](/glossary#hugging-face) web address (or its `org/repo` name) into the search field. Osaurus checks that it can run the model before offering the download.

### Your first model

On most Macs, setup suggests **Raptor 0.6** as your first model. It's a fast, capable model built for agents and tools, and it needs about 3.4 GB.

Osaurus comes in two downloads:

- The **standard** download is about 80 MB. Setup downloads Raptor 0.6 for you.
- The **full** download is 3.6 GB and has Raptor 0.6 built in. The first launch installs it for you, so setup skips the download. Later app updates use the small download.

If you delete Raptor 0.6 from **Local Models → On Device**, it's gone from that install. Download it again from the catalog if you want it back. The older Raptor v0.5 is no longer in the catalog, but copies you already have still work.

### Which model should I pick?

Osaurus keeps its own [collection of tuned models on Hugging Face](https://huggingface.co/OsaurusAI), and **Local Models** downloads from it by default. The in-app catalog is always the most current list; the picks below are a snapshot.

**Top picks** (what setup recommends, matched to your Mac's memory):

| Family | What it is |
|---|---|
| **Raptor 0.6 4B** (JANG_6M) | The default for Macs with 8 GB of memory or more. About 3.4 GB, fast at using tools, and can keep a very long conversation in mind. |
| **Ornith 1.5 35B-A3B** (MXFP8) | Understands images too, and is tuned for coding tasks. For Macs with lots of memory. |
| **Nanbeige 4.2 3B** (JANG_6M) | A compact model for Macs with less memory. |
| **Gemma 4 E2B / E4B** (8-bit) | Small models that also understand images, for lower-memory Macs. |
| **Gemma 4 12B MXFP8** | Google's Gemma, which takes images, video, and audio as well as text. |

**The wider catalog** includes LFM2.5 8B (Liquid AI), Ornith 1.5 9B, Qwen 3.6 models that understand images, reasoning models (Nemotron-3 Nano Omni, ZAYA1, DeepSeek V4 Flash), coding models (Poolside Laguna-XS.2, MiniMax M2.7), Ling-2.6 Flash, Mistral Medium 3.5 and Pixtral, and some very large showcase models (Kimi K2.6, Hunyuan 3, Nemotron-3 Ultra 550B). Each card shows the size, what the model can do, and a **Versions** picker for its compressed variants.

**Rule of thumb:** a model's name hints at how it's compressed. Smaller versions use less memory; larger ones give better answers. Pick the `MXFP8` version when your Mac has room, `MXFP4` or `JANGTQ4` as a good middle ground, and the 2-bit `JANGTQ` or low-bit `JANG` versions when memory is tight. The full list of name endings is in [Under the hood](#about-the-quantizations).

### How much memory does a model need?

On Apple Silicon, models share your Mac's regular memory (RAM). A rough guide:

- **4-bit** models: about 0.6 GB per billion parameters.
- **8-bit** models: about 1.2 GB per billion parameters.
- **Mixture-of-experts models** (names like "35B-A3B"): only a small part of the model works on each word, so a 35B model with 3B active behaves closer to a 3B model in day-to-day memory use.

For example, `gemma-4-e2b-it-4bit` (2B, 4-bit) needs about 1.5 GB. Pick a size that leaves room for your other apps and for your [Core Model](/glossary#core-model) (the small helper model Osaurus uses in the background).

### Models that understand images and audio

Some local models can take pictures, and a few can take sound. Compatible Gemma 4 and Nemotron Omni models show a waveform badge in the picker and let you attach audio files. Osaurus checks the installed model itself rather than guessing from its name, so trust the badge.

### Updates, verification, and repair

Open a model's details in **Local Models → On Device** to manage it:

- **Check for Model Updates** checks whether the publisher has released a newer version. If the publisher doesn't list versions, Osaurus tells you.
- **Verification needed** appears on older models that were installed before the publisher listed versions. Click **Verify Model** to check the files. Osaurus never assumes an unknown version is current.
- **Repair** compares your files with Hugging Face and restores any that are missing or changed. Good files are kept. It has the same Pause, Resume, and Cancel controls as a download. Models managed by another app stay managed by that app.

**Automatically Check Model Updates** (in **Settings… → Local Models**, on by default) checks official OsaurusAI models every six hours and lets you know when an update is out. Turn it off to stop the automatic checks and their notifications; the manual buttons above still work.

These checks only compare version information. They never download or replace a model by themselves, and a matching version doesn't prove your files are untouched. This switch is separate from updating the Osaurus app.

### Open a model from Hugging Face

You can open any MLX model on [huggingface.co](https://huggingface.co) straight into Osaurus from the model page's **Use this model** menu:

:::note
This needs an Osaurus release newer than 0.25.9. The Osaurus entry appears in Hugging Face's **Use this model** menu once Hugging Face adds it to their list of local apps. Until then, the links in [Under the hood](#hugging-face-links) work on their own.
:::

1. On huggingface.co, turn on **Osaurus** once under [Settings → Local Apps](https://huggingface.co/settings/local-apps). It only appears on a Mac.
2. On an MLX model page, open **Use this model** and choose **Osaurus**.
3. Osaurus opens **Local Models** with that model's details showing. It checks first whether Osaurus can run the model; if not, you see an "Unsupported model" notice instead of a download button.
   - For a private or restricted model, Osaurus asks for a Hugging Face token (a password-like code from your Hugging Face account) for an account that has access, then opens the model once it's saved.
   - A mistyped name, too many requests, or no internet connection each show their own clear message.
4. Click **Download**. The model is saved with your other models.

Osaurus only appears for models tagged `mlx`. Models in other formats (such as GGUF) don't show it, because Osaurus runs MLX models.

### Where models live

Osaurus saves models in a folder called **MLXModels** in your home folder. If your Mac's drive is filling up, you can keep them on an external drive instead (see [Under the hood](#model-storage)).

To remove a model: **Local Models → On Device** → open the model → **Delete Model**.

### Reusing models you already have

Osaurus finds models you've already downloaded with other tools, so you never download the same model twice:

- **Hugging Face downloads** — Osaurus looks in the usual places automatically. If yours are somewhere else, set a custom location in **Settings… → Local Models** (type a path, pick a folder, or reset to the default).
- **LM Studio** — models you downloaded in LM Studio show up too.

The chat picker hides models Osaurus can't chat with. A model that looks compatible but isn't may still appear and show an error when it loads.

To hide models from other apps, the model pickers in Settings (such as an agent's default model or the Core Model) have a **Source** filter on their Local tab: **Any**, **Osaurus** (models Osaurus manages), or a single other source such as **LM Studio** or **Hugging Face cache**. Only sources you actually have are listed.

## Apple Foundation Models

On macOS 26 (Tahoe) or later, with [Apple Intelligence](/glossary#apple-intelligence) turned on, you can use Apple's built-in model with **nothing to download or set up**. Pick **Foundation** in the chat model picker.

It's private and runs on your Mac. Osaurus also uses it as the default Core Model for background jobs like saving memories. It's small, so it's best for quick, simple tasks.

[Apple Intelligence guide →](/models/apple-intelligence)

## Liquid Foundation Models

[Liquid AI's LFM](https://www.liquid.ai/models) models are built differently from most AI models and are designed to run well on small devices. They:

- Answer quickly on Apple Silicon
- Use less memory than models of similar quality
- Are good at using tools out of the box

Download them like any other model — they're in the **Local Models** catalog.

## Cloud providers

When you need more power, connect a [provider](/glossary#provider) — a company that runs models on its own servers. A [cloud model](/glossary#cloud-model) needs the internet, and what you send it leaves your Mac. Its models appear in the same picker as your local ones, so switching takes one click.

| Provider | Notes |
|---|---|
| **OpenAI** | GPT-4o, o-series, and more — API key or ChatGPT / Codex sign-in |
| **Anthropic** | The Claude family |
| **Gemini** | Google Gemini |
| **xAI / Grok** | xAI's Grok — API key or sign-in in your browser |
| **Mistral** | Mistral models, with a control for how hard they reason |
| **DeepSeek** | DeepSeek V-series |
| **Fireworks AI** | Hosted open models |
| **MiniMax** | MiniMax M-series models |
| **Venice AI** | Privacy-focused, uncensored, keeps no data |
| **AtlasCloud** | DeepSeek, Qwen, GLM, Kimi, and MiniMax under one key |
| **Azure OpenAI** | OpenAI models on your own Azure account |
| **OpenRouter** | One key for many providers (`openai/gpt-4o`, `anthropic/claude-3.5-sonnet`, …) |
| **Ollama** | Ollama running on your Mac or another computer |
| **LM Studio** | LM Studio's built-in server (added as a Custom provider) |
| **[Osaurus Router](/osaurus-router)** | Hosted models tied to your Osaurus account — no key to paste |

To add one, open **Settings… → Providers → Add Provider**. Connect with an API key (stored safely in your Mac's [Keychain](/glossary#keychain)) or sign in through your browser where offered. [Remote Providers →](/remote-providers)

Your agents' memory carries over when you switch. Moving from a local Gemma model to Claude or GPT-4o doesn't lose anything.

## Image models

Osaurus can also run local **image models** (Z-Image Turbo, FLUX.1 Schnell, Qwen-Image, Ideogram) to create and edit pictures fully offline, plus hosted image and video options from Venice and Osaurus Cloud. Download them from **Settings… → Images → Image Models** and set defaults under **Images → Defaults**. [Image & Video Generation →](/image-generation)

## Troubleshooting

### "Model not found"

- Check that it's downloaded: **Settings… → Local Models → On Device**.
- If another app is calling Osaurus, check it uses the exact model name (see [Model naming](#model-naming)).

### Slow answers

- Try a smaller or more compressed version (for example, `JANGTQ2` instead of `JANGTQ4`).
- Quit apps that use a lot of memory.
- Open Activity Monitor and check the Memory tab for memory pressure.

### Download fails

- Check your internet connection and free disk space.
- Pause and resume — partly downloaded files are kept.
- Try a different source using the "Source" link on the model card.

### Out of memory

- Switch to a more compressed version (2-bit `JANGTQ`, low-bit `JANG`, or 4-bit instead of 8-bit).
- Pick a smaller model, such as `gemma-4-e2b-it-4bit`.
- If several models are loaded at once, set **Eviction Policy** to **Strict (One Model)** (see [Loaded models and eviction](#loaded-models-and-eviction)).

---

## Under the hood

Technical details for developers and the curious. For how inference works inside — batching, caching, tuning — see [Inference Runtime](/inference-runtime).

### Model storage

Models live at `~/MLXModels/` by default. To use another location, such as an external drive, set `OSU_MODELS_DIR`:

```bash
export OSU_MODELS_DIR=/Volumes/External/MLXModels
```

The full download (`Osaurus-<version>-full.dmg`) installs the bundled Raptor 0.6 (`OsaurusAI/Raptor-0.6-4B-JANG_6M`) into `~/MLXModels/OsaurusAI/Raptor-0.6-4B-JANG_6M` on first launch. When the app and the models folder are on the same volume, this is an instant APFS clone.

Osaurus scans these Hugging Face cache locations automatically: `HF_HUB_CACHE`, `HF_HOME/hub`, and `~/.cache/huggingface/hub`. The chat picker filters out local bundles that aren't MLX format and embedding-only models.

### The catalog

The catalog is dynamic: a curated set of OsaurusAI models is merged with a live fetch of the [OsaurusAI Hugging Face org](https://huggingface.co/OsaurusAI). Searching also finds MLX-compatible repos from `mlx-community` and elsewhere.

For a private Hugging Face repository, set up your Hugging Face token first. Catalog lookup, metadata checks, and downloads then use that token; the public OsaurusAI registry stays curated separately. A private repo still needs the normal MLX model files to import.

### Hugging Face links

The **Use this model** button opens a link like `osaurus://open_from_hf?model=<org>/<repo>`, with an optional `&file=<path>` when the Hub points at one file. The older `huggingface://?model=<org>/<repo>` form still works. Paste either into a browser address bar, a Terminal `open` command, or a Shortcut to jump to a model without visiting the Hub.

### About the quantizations

| Suffix | What it is |
|---|---|
| `4bit` / `8bit` | Standard MLX integer quantization |
| `MXFP4` | Block floating-point 4-bit — best quality per byte, fastest decode |
| `MXFP8` | Block floating-point 8-bit — near-lossless precision |
| `qat` | Quantization-aware-trained build (trained to survive 4-bit) |
| `JANGTQ` / `JANGTQ2` / `JANGTQ4` / `JANGTQ_K` | OsaurusAI's TurboQuant quants (2-bit / 4-bit / K-quant routed experts), tuned for Apple Silicon |
| `JANG` (e.g. `1bit`, `Ternary`) | Extreme low-bit affine JANG weights — the smallest footprints in the catalog |
| `MTP` | Ships multi-token-prediction speculative decoding for faster generation |

Catalog entries list quantizations such as MXFP8, MXFP4, JANGTQ, JANG, 4-bit, and 8-bit. Raptor 0.6 4B is a dense text model with a 1M-token [context window](/glossary#context-window). Ornith 1.5 35B-A3B is a vision-language mixture-of-experts (MoE) model; LFM2.5 8B is an MoE with about 1B active parameters.

### Speculative Depth

Models with a supported native MTP (multi-token prediction) head show **Speculative Depth** in the model options: **Off**, **Auto**, **1**, **2**, or **3**. Flash Next starts **Off** across its quantizations; Qwen3.8-27B keeps its depth-3 default. An explicit choice is kept when you switch models or relaunch. Headless bundles (such as Flash Next JANG_1L) don't advertise MTP, and the setting doesn't override your sampling settings. The same global setting is under **Settings… → Server → Settings → Speculative Decoding** and applies to chat and API requests.

### Thinking (reasoning) models

Whether a local model supports thinking is detected from its chat template, not hardcoded, so new reasoning families work as soon as you download them. The **Thinking** chip reports the model's true default (some families think unless told not to; others only when asked). Reasoning streams separately from the answer: the Think panel in chat, `reasoning_content` over the API. A few families get tuned defaults (for example, Ling ships with thinking off, with explicit opt-in preserved).

#### DeepSeek V4 Flash 0731

DeepSeek V4 Flash bundles have a four-level **Reasoning Mode** in the model's options:

- **Off** — uses the compatibility `instruct`/direct-answer rail
- **Low** — the bundle default
- **High** — more reasoning
- **Max** — maximum 0731 reasoning effort

Low, High, and Max pass the matching 0731 effort value to the runtime; they aren't aliases for a generic on/off toggle.

Leave [temperature](/glossary#temperature) unset to use the bundle's sampling defaults unless you need deterministic output. An explicit agent or request `temperature: 0` overrides those defaults, forces greedy argmax decoding, and makes `top_p` inert. On long DSV4 reasoning runs, that deterministic path can amplify repetition once the model revisits a prior state.

### Tool calling

Tool calling works across every family in the catalog. The tool-call parser handles JSON, Qwen XML, Mistral, GLM-4, LFM2, Kimi K2, Gemma 3/4, and MiniMax M2 dialects automatically, so agents don't care which model produced the call.

### Loaded models and eviction

Set how local models stay in memory in **Settings… → Server → Settings → Model Memory**. **Eviction Policy** decides how many models can be loaded at once:

| Policy | Behavior |
|---|---|
| **Strict (One Model)** | Only one local model loaded at a time (default). Switching unloads the previous one. |
| **Flexible (Multi Model)** | Several models loaded at once. **Needed if your Core Model is local and different from your chat model** — otherwise the two fight over the slot. |

**Model Residency** decides how long a model stays loaded. Models load when you send a request. With **Keep Model Loaded** off (the default), an idle model unloads after **Unload After** (30 seconds by default), or as soon as its last chat window closes; requests in progress finish first. Turn **Keep Model Loaded** on to keep it loaded through idle time and closed windows. See [Inference Runtime](/inference-runtime#idle-residency).

### Context length

Osaurus picks a sensible context limit for each model automatically. Multi-turn caching is automatic too, so repeating the same [system prompt](/glossary#system-prompt) across messages is cheap. For tunables, see [Inference Runtime](/inference-runtime).

Custom providers can report model context windows through `/models`. Osaurus recognizes positive integer `max_model_len` (vLLM), `context_length` (OpenRouter and LM Studio), `max_context_length` (llama.cpp), and `context_window`, shows the value in the picker, and uses it for context budgeting. Missing or malformed values fall back safely without breaking provider discovery.

Audio support is detected from the installed checkpoint, not only the model name. Audio is sent to the local model alongside text and images.

### Apple Foundation over the API

The model name is literally `foundation`. Tool calling, streaming, and the standard generation parameters all work; Osaurus translates between OpenAI/Anthropic semantics and Apple's native interface. It's also the recommended Core Model for memory and capability auto-selection on macOS 26+.

```bash
curl http://127.0.0.1:1337/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "foundation",
    "messages": [{"role":"user","content":"Hello!"}]
  }'
```

### Model naming

[API](/glossary#api) model names are the display name in lowercase, with hyphens for spaces:

| Display name | API name |
|---|---|
| `Gemma 4 E2B it 4bit` | `gemma-4-e2b-it-4bit` |
| `Ornith 1.5 9B MXFP8` | `ornith-1.5-9b-mxfp8` |
| `Mistral Medium 3.5 128B JANGTQ` | `mistral-medium-3.5-128b-jangtq` |

List models from any client:

```bash
curl http://127.0.0.1:1337/v1/models
```

### Per-request settings

Most behavior is set per request through the API. Common parameters:

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

Lowering `max_tokens` also helps with slow generation and memory pressure. [Full API reference →](/api)

---

**Related:**

- [Apple Intelligence](/models/apple-intelligence) — using Apple's built-in model on macOS 26+
- [Remote Providers](/remote-providers) — connecting cloud providers
- [Osaurus Router](/osaurus-router) — hosted models with no key to paste
- [Inference Runtime](/inference-runtime) — how local inference works under the hood
- [OsaurusAI on Hugging Face](https://huggingface.co/OsaurusAI) — the full model catalog

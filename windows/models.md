---
title: Local models on Windows
sidebar_label: Local Models
description: Download AI models that run on your PC's graphics card or processor, see which ones fit before you download, use models you already have from LM Studio or Ollama, and tune how they run.
---

# Local models on Windows

A [local model](/glossary#local-model) runs on your PC: free, private, and it works offline. Osaurus for Windows runs GGUF models (the format LM Studio and Ollama use) through llama.cpp, on your graphics card or your processor. Settings are in **Settings → Models**.

The most important number is your graphics card's own memory (VRAM). Most models worth using need about 12 GB of it; smaller cards and processors run smaller models, more slowly. Osaurus checks every model against your PC, so you know before downloading.

## Download a model

1. Open **Settings → Models → Catalog**. At the top, **Recommended for this PC** suggests up to three models picked for your hardware: the best one that fits, one that understands images, and the fastest.
2. Each card shows whether the model fits:

   | Badge | Meaning |
   |---|---|
   | **Runs well** | Fits on your graphics card with room to spare |
   | **Tight fit** | Fits, but not in what's free right now; closing apps that use the graphics card makes room |
   | **GPU + RAM** | Part of it runs from system memory: it works, but slower |
   | **Too large** | More than this PC can run well |

   Turn on **Fits this PC** to hide the rest.
3. Click **Get** to download the version picked for your PC, or **Details** to choose another version (quantization: smaller versions are faster and slightly less accurate) and see exactly how much memory it needs.

Downloads show on the **On device** tab, with time remaining. Cancelling keeps the progress, so you can resume later.

The first time you use a local model, Osaurus also downloads the llama.cpp engine for your graphics card. That happens once; the chat shows "Preparing inference engine…" while it does.

## Any model from Hugging Face

The catalog is a curated list. For anything else on [Hugging Face](/glossary#hugging-face):

- **Search HF** searches Hugging Face's GGUF models. Pick one to see its versions, with a fit badge on each; Osaurus picks the largest version that fits your PC.
- **Add GGUF** takes a Hugging Face link (`org/repo`, a repository URL, or a direct `.gguf` link).

Gated or private repositories need a Hugging Face token: click the key icon next to **Search HF**. A token also raises Hugging Face's download limits.

## Models you already have

If you've used LM Studio or Ollama, or downloaded models through Hugging Face's tools, click **Scan for models**. Osaurus finds the GGUF files and lists them; pick the ones to use and click **Register**. The files stay where they are and aren't copied. Removing one from Osaurus leaves the file on disk.

## Make a model faster or remember more

Click the gear on a model on the **On device** tab:

- **Speed ⇄ Quality**: **Fast**, **Balanced**, or **Quality** sampling.
- **Memory (context)**: how much of the conversation the model can see at once: **Short (8K)**, **Normal (16K)**, or **Long (32K)**. Longer uses more memory; the page shows how much.
- **Use GPU**: off runs it on the processor only.

**Advanced** has every llama.cpp setting, from GPU layers and cache types to sampling and speculative decoding. **Reset to recommended** undoes all of it. Changes apply the next time the model loads.

## The engine

Under **Settings → Models → Local engine**:

| Setting | What it does |
|---|---|
| **Accelerator** | **Auto (recommended)** uses CUDA on an NVIDIA card with its driver, else Vulkan on any recent graphics card, else the processor. You can pick **NVIDIA CUDA**, **Vulkan (any GPU)**, or **CPU only**. Restart Osaurus to apply |
| **Models folder** | Where downloads go. **Change…** to put them on another drive |
| **Idle unload** | How long an unused model stays in memory: **Never unload**, or after 5, 15 (the default), 30 minutes, or 1 hour idle |
| **Models kept loaded** | How many models stay warm at once (1 by default, up to 8). More uses more memory |
| **Restart engine** | Stops every loaded model to free memory at once |

## Use local models from other apps

Your downloaded models are available on Osaurus's local server, `http://127.0.0.1:1337`, under their file name without `.gguf` (for example `Qwen3-8B-Q4_K_M`). Models found by **Scan for models** have ids starting with `ext:`. `osaurus list` prints them all. See [Apps & Devices](/windows/connections).

## Troubleshooting

- **A model is slow:** check its badge. **GPU + RAM** and **Too large** are slower by design; try a smaller version (the card suggests one) or close apps using your graphics card. `osaurus bench` measures the speed.
- **The graphics card isn't used:** update its driver, then check **Accelerator**. Picking **NVIDIA CUDA** or **Vulkan** without that driver installed falls back to the processor.
- **"This repository isn't available anonymously":** add a Hugging Face token.
- **"Local engine crashed N times in the last minute":** try **Vulkan (any GPU)** or **CPU only** under **Accelerator**, restart Osaurus, and post the log from `%LOCALAPPDATA%\osaurus\logs` in the [community forum](https://community.osaurus.ai/tag/windows/2).

---

## Under the hood

- Engine builds come from llama.cpp's GitHub releases, pinned to a build and checked against a SHA-256 before use, and are stored in `%LOCALAPPDATA%\osaurus\engines`.
- A fit verdict compares what the engine itself says the model needs (measured with `llama-fit-params` once the file is on disk, or from the file's header on the details page) with what your graphics card has free right now, counting every process. Before that, it's an estimate from the file's size, layers, and context.
- A model too large for the card still loads: llama.cpp keeps what it can on the GPU and runs the rest from system memory. For mixture-of-experts models, the expert weights move to RAM first, which is why they often run well as **GPU + RAM**.
- Scanned models are read from `%USERPROFILE%\.lmstudio\models`, `%USERPROFILE%\.cache\lm-studio\models`, the Hugging Face cache (`HF_HUB_CACHE`, `HF_HOME`, or `%USERPROFILE%\.cache\huggingface\hub`), and Ollama's store (`OLLAMA_MODELS` or `%USERPROFILE%\.ollama\models`).

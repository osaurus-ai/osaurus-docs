---
title: Models on Windows
sidebar_label: Models
description: Download AI models that run on your PC's graphics card or processor, see how each one fits before you download, tune how it runs, choose the llama.cpp engine version, and add cloud providers such as ChatGPT, Grok, and Osaurus Cloud.
---

# Models on Windows

A [local model](/glossary#local-model) runs on your PC: free, private, and it works offline. Osaurus for Windows runs GGUF models (the format LM Studio and Ollama use) through llama.cpp, on your graphics card or your processor. You can also connect cloud models with a sign-in or an API key. Local models are in **Settings → Models → Models**; cloud ones are in **Settings → Models → Providers**.

The most important number for a local model is your graphics card's own memory (VRAM). Most models worth using need a 12 GB card; smaller cards and processors run smaller models, more slowly. Osaurus checks every model against your PC, so you know before downloading.

## Get started

1. Open **Settings → Models → Models**. The **Catalog** tab lists the models Osaurus suggests. At the top, **Recommended for this PC** shows up to three picked for your hardware: Osaurus's own pick, the best one that understands images, and the quickest to answer.
2. Each card says how the model fits:

   | Label | Meaning |
   |---|---|
   | **Runs well** | Fits on your graphics card with room to spare |
   | **Tight fit** | Fits, but not in what's free right now; closing apps that use the graphics card makes room |
   | **GPU + RAM** | Part of it runs from system memory: it works, but slower |
   | **GPU + RAM + SSD** | A very large mixture-of-experts model (one that uses only a few of its parts for each word) that outgrows your card and memory together: the rest is read from the disk as it's needed. It runs, slowly; keep it on an SSD |
   | **Too large** | More than this PC can run well |

   Hover a label to see how much memory the model needs and how much is free. Turn on **Fits this PC** to hide the rest.
3. Click **Get** to download the version picked for your PC, or **Details** to choose another version (smaller versions are faster and slightly less accurate) and see exactly how much memory it needs.

Downloads show on the **On device** tab, with time remaining. Cancelling keeps the progress, so you can resume later.

The first time you use a local model, Osaurus also downloads the llama.cpp engine for your graphics card. That happens once; the chat shows "Preparing inference engine…" while it does.

### New in the catalog

- **Raptor 0.7 4B**, Osaurus's own small model, is the starter: it chats in seconds while a bigger download finishes.
- **Diplodocus preview**, Osaurus's model for documents, spreadsheets, and money.
- **Nemotron 3.5 Lightning 30B-A3B**, NVIDIA's mixture-of-experts model for everyday chat and writing.

A card marked **Needs a newer engine** needs a newer llama.cpp than the one you have; see [The engine](#the-engine).

## Any model from Hugging Face

The catalog is a curated list. For anything else on [Hugging Face](/glossary#hugging-face), click **Add a model** at the top of the page:

- **Search Hugging Face** searches its GGUF models. Pick one to see its versions, each with a fit label; Osaurus selects one that fits your PC, usually the largest.
- **Download by name…** takes an `org/repo` name, a Hugging Face link, or a direct `.gguf` link. Click **Look up** to choose the build; a direct `.gguf` link downloads as it is.
- **Hugging Face token…** stores a token for gated or private repositories. A token also raises Hugging Face's download limits.

You can also ask Osaurus in a chat, for example "Download numind/NuExtract3-GGUF from Hugging Face." When you ask for a repository by name like that (or with `osaurus pull`), and it has several builds, Osaurus takes Q4_K_M unless you name another.

## Models you already have

If you've used LM Studio or Ollama, or downloaded models through Hugging Face's tools, click **Add a model → Find models already on this PC**. Osaurus finds the GGUF files and lists them; pick the ones to use and click **Register**. The files stay where they are and aren't copied. Removing one from Osaurus leaves the file on disk.

## Fit a model to your PC

On the **On device** tab, each model says where it runs (**On graphics card**, **Graphics card + memory**, **In system memory**, or **Too large**) and how much it remembers. Click its **Settings** button (the gear) to open its page:

- At the top, Osaurus says where the model will run ("Runs entirely on your graphics card", for example), how much it **Remembers**, its **Speed** (estimated until it has run, then measured), and how much graphics memory it **Uses**, drawn as a bar beside other apps.
- **How much it remembers** is a slider for the context: how much of the conversation, files, and tool results the model can see at once. Green means the model **Stays on the graphics card**; amber means it **Spills into system memory**, which slows replies; grey (below 32K) is **Too small for agents**. **Best fit** puts it back on the largest size that fits.
- **Fine-tuning** has the everyday choices: **Memory compression** (**Off**, **Standard**, **Compact**), **Response style** (**Recommended**, **Precise**, **Creative**), **Think before answering** on models that can, **Faster replies** where the model supports it, and **Graphics card** (**Automatic**, or **Off** to run on the processor).
- **Advanced** has every llama.cpp option, searchable, with who set each one. **Command line** shows the exact command the engine runs, with **Copy** and **Export as llama.cpp preset**. **Extra arguments** takes anything else; paste a whole `llama-server` command there and its options move into their rows when you save.
- **Last launch** shows what happened the last time the model loaded. If the engine didn't start, the page names the setting it stopped on, with **Undo that change and start**.

A changed page says **Custom** instead of **Automatic**. **Back to best fit** lets Osaurus choose everything again. Click **Save**: if the model is loaded, choose **Reload now** or **Save for next load**.

## The engine

Your local models run on llama.cpp. The **Engine** group on the **On device** tab shows which version you have and where it runs ("CUDA on" your graphics card, for example).

**Version** has three choices:

| Choice | What it does |
|---|---|
| **Tested by Osaurus** | The default. The build this Osaurus release was proven on; it moves when Osaurus updates |
| **Latest stable** | Follows llama.cpp's newest stable release. Each new version is downloaded beside the one you're using, checked on this PC first, and takes over only when no model is answering. **Update automatically** downloads new versions without asking |
| **My own build** | A `llama-server.exe` you choose, checked the same way |

When a new version is being checked, the card lists each check as it passes: the download matches its published checksum, it starts and reports the right version, and it sees your graphics card. A version that fails is **Held back**, and you stay on the one you had. If a model won't start on a new version, Osaurus loads it on the previous one and doesn't offer that version again. **Check for updates** on the card looks for a new version now. To return to the tested build after switching, open **More engine actions** (the **…** button) and choose **Go back to llama.cpp** and its version. The same menu has **Restart engine**, **Open engine folder**, and **Copy engine details**.

The other settings in the group:

| Setting | What it does |
|---|---|
| **Accelerator** | **Auto (recommended)** uses CUDA on an NVIDIA card with its driver, else Vulkan on any recent graphics card, else the processor. You can pick **NVIDIA CUDA**, **Vulkan (any GPU)**, or **CPU only**. Restart Osaurus to apply |
| **Models folder** | Where downloads go. **Change…** to put them on another drive |
| **Unload idle models** | How long an unused model stays in memory: **Never unload**, or after 5, 15 (the default), 30 minutes, or 1 hour idle |
| **Models kept loaded** | How many models stay warm at once (1 by default, up to 8). More uses more memory |

## Sharing the graphics card

A local model and [image generation](/windows/images) take turns on the graphics card. If a chat model would have to run partly in system memory because something else is using the card, Osaurus asks first: a card in the chat says the model "won't fit in the GPU memory that's free", lists what's **Using the GPU now**, and offers **Load anyway** or **Cancel**. After **Load anyway**, Osaurus doesn't ask again for that model in that chat until Osaurus restarts. See [Sharing the graphics card with chat models](/windows/images#sharing-the-graphics-card-with-chat-models).

## Cloud providers

A provider is a service that runs models for you: ChatGPT, Grok, Claude, Gemini, and others. Open **Settings → Models → Providers** and click **Add provider**:

- **Sign in — no key to paste**: **Sign in with ChatGPT** (your ChatGPT Plus or Pro subscription), **Sign in with Grok** (your SuperGrok or X Premium+ subscription; Osaurus lists xAI's current models from your sign-in), and **Sign in with OpenRouter**. [Claude Code](/windows/claude-code) and the [coding plans](/windows/coding-plans) GitHub Copilot and Antigravity are here too.
- **With an API key**: OpenAI, Anthropic, Google Gemini, Azure OpenAI, DeepSeek, Venice AI, and an OpenRouter key. Keys are checked with the provider, then stored encrypted on this PC.
- **On this PC**: Ollama, and [your own runtime](/windows/coding-plans#your-own-runtime).
- **Other**: **Custom endpoint**, for any OpenAI-compatible address.

**Osaurus Cloud** runs hosted models paid from your Osaurus account's credits, with no key to paste. It's added to your providers once you have an Osaurus account; add credit on the [Account](/windows/account) page.

The provider marked **Default** is used when a model names no provider; **Set default** in a provider's **…** menu changes it. **Test all** checks that every provider is reachable.

## Use local models from other apps

Your downloaded models are available on Osaurus's local server, `http://127.0.0.1:1337`, under their file name without `.gguf` (for example `Qwen3-8B-Q4_K_M`). Models found by **Find models already on this PC** have ids starting with `ext:`. `osaurus list` prints them all. See [Apps & Devices](/windows/connections).

## Troubleshooting

- **A model is slow:** check its label. **GPU + RAM**, **GPU + RAM + SSD**, and **Too large** are slower by design; try a smaller version or close apps using your graphics card. A model's settings page shows what fits. `osaurus bench` measures the speed.
- **The graphics card isn't used:** update its driver, then check **Accelerator**. Picking **NVIDIA CUDA** or **Vulkan** without that driver installed falls back to the processor.
- **"This repository isn't available anonymously":** add a Hugging Face token (**Add a model → Hugging Face token…**).
- **A catalog model says Needs a newer engine:** switch **Version** to **Latest stable**, or wait for an Osaurus update.
- **A new llama.cpp version was held back or rolled back:** you're still on the version you had, and nothing changed. The card says which check failed; **Try again** reruns it.
- **"Local engine crashed N times in the last minute":** try **Vulkan (any GPU)** or **CPU only** under **Accelerator**, restart Osaurus, and post the log from `%LOCALAPPDATA%\osaurus\logs` in the [community forum](https://community.osaurus.ai/tag/windows/2).

---

## Under the hood

- The tested engine is llama.cpp 1.0.0 (build b12359). Builds come from llama.cpp's GitHub releases, checked against the SHA-256 GitHub publishes before use, and are stored in `%LOCALAPPDATA%\osaurus\engines`. Under **Tested by Osaurus**, Osaurus looks for new versions only when you click **Check for updates**; under **Latest stable** it looks about once a day, and an automatic download waits for an unmetered connection.
- A new build's check runs on this PC without loading any model: checksum, start-up and version, the graphics card through CUDA or Vulkan, the options Osaurus passes, and the memory-measuring tool.
- A fit verdict compares what the engine itself says the model needs (measured with `llama-fit-params` once the file is on disk, or from the file's header on the details page) with what your graphics card has free right now, counting every process. Before that, it's an estimate from the file's size, layers, and context.
- A model too large for the card still loads: llama.cpp keeps what it can on the GPU and runs the rest from system memory. For mixture-of-experts models, the expert weights move to RAM first, which is why they often run well as **GPU + RAM**. Before a chat model loads, Osaurus weighs it against free graphics memory after unloading idle models and an idle image engine; a shortfall under 512 MB isn't asked about.
- A repository named without a build takes its only model, the build its tag names, the catalog's pick for a repository the catalog curates, or else Q4_K_M; a repository with none of those is refused with the builds it has. The same rule applies to the `models:` list in a configuration file.
- A model's settings are stored per model, apply the next time it loads, and are the same `model_settings` a configuration file sets.
- Scanned models are read from `%USERPROFILE%\.lmstudio\models`, `%USERPROFILE%\.cache\lm-studio\models`, the Hugging Face cache (`HF_HUB_CACHE`, `HF_HOME`, or `%USERPROFILE%\.cache\huggingface\hub`), and Ollama's store (`OLLAMA_MODELS` or `%USERPROFILE%\.ollama\models`).

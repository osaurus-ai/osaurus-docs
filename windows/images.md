---
title: Images and video on Windows
sidebar_label: Images & Video
description: Make and edit pictures and short video clips on your own PC with Osaurus for Windows. Download an image or video model, then use it from a chat, let an agent use it, or run it in a workflow. Nothing goes to a cloud service.
---

# Images and video on Windows

Osaurus for Windows can make pictures, edit them, and make short video clips on your own PC. You download an image or video model once, then describe what you want in a chat. You can also let an agent make and edit pictures as part of its work. The model runs on your PC's graphics card, not in a cloud service, so it's free to use and works offline.

What you need: a model from **Settings → Models → Images** (about 9 to 26 GB to download), and ideally a graphics card with plenty of its own memory (VRAM). A card that's too small still works, more slowly, as long as your PC has enough memory overall.

## Get started

1. Open **Settings → Models → Images**.
2. Each card under **Image and video models** shows what the model does and whether it fits your PC:
   - **Generate**, **Generate + edit**, or **Video**: what it makes.
   - **Runs well**, **Tight fit**, **Runs from RAM**, or **Too large**: how it fits your graphics card. **Runs from RAM** means part of it runs from system memory: it works, but slower. Hover the badge for how much memory it needs.
   - The licence. A model marked **Non-commercial** has a note saying what you may use its pictures for.
3. Click **Download**. The card shows progress; **Cancel** stops it, and a stopped download offers **Finish download** later.

The first time you make a picture, Osaurus also downloads the image engine for your graphics card. That happens once.

## Which models

| Model | Makes | Licence |
|---|---|---|
| **Z-Image Turbo** | Pictures | Apache-2.0 |
| **FLUX.1 schnell** | Pictures | Apache-2.0 |
| **Qwen-Image 2.1 Turbo** | Pictures, and edits | Non-commercial (Qwen Research License) |
| **Qwen-Image 2.1** | Pictures, and edits | Non-commercial (Qwen Research License) |
| **FLUX.3 Image Klein** | Pictures, and edits | Non-commercial, with exceptions (FLUX Kommunity License) |
| **Wan 2.1 T2V 1.3B** | Video from text | Apache-2.0 |
| **Wan 2.2 TI2V 5B** | Video from text or a picture | Apache-2.0 |
| **Wan 2.1 I2V 14B** | Video from a picture | Apache-2.0 |
| **Wan 2.1 FLF2V 14B** | Video from a first and a last frame | Apache-2.0 |
| **Wan 2.1 VACE 1.3B** and **14B** | Video that follows reference pictures or a video | Apache-2.0 |

Some models share files (a Qwen-Image model and its Turbo version, for example). The card says so; the shared files download once, and **Delete** keeps them while another model still uses them.

## Make a picture in a chat

1. In any chat, open the model picker and go to the **Images** tab. Pick an image model.
2. The message box switches to **Create image**, with chips for **Image size**, **Steps**, **CFG** (guidance: how closely the picture follows your words), **Seed**, and, on models that take one, **Avoid** (things the picture should not contain).
3. Type what you want to see ("Describe the image…") and send.

The picture appears in the chat with a live preview while it's made, and **Cancel** while it runs. When it's done:

- **Edit** attaches it to the message box and switches to a model that can edit. Describe the change and send.
- **Save as…**, **Copy**, and **Open** (in your default image viewer).
- The seed under the picture puts that seed back for the next picture, so the same words and settings make the same picture again.

To edit a picture of your own, attach it while an edit-capable model is picked. The chip changes to **Edit image**, a **Strength** chip appears on models that take it (low keeps the picture and changes details; high redraws it), and you describe the change. To go back to chatting, use the chip's close button (**Back to chat**).

## Make a video clip in a chat

1. In the model picker, go to the **Video** tab and pick a video model (it's there once one is downloaded).
2. Choose **Video size**, **Video length**, **Steps**, and **Seed** on the chips, describe the clip ("Describe the video…"), and send.
3. Attach a picture to animate it (**Animate image**). A first-and-last-frame model needs two pictures (**First to last frame**); a VACE model follows reference pictures or a video you attach.

Video is slow: most of the time goes into turning the frames into a clip, and the card says "Decoding the frames…" and "Saving the video…" while it does. The finished clip plays in the chat.

## Let an agent make pictures

Your own agents can make and edit pictures, and make clips, while they work. The [Orchestrator](/glossary#orchestrator) doesn't make pictures itself; it hands that to an agent that can.

1. Open the agent's editor (**Edit** on the agent in the sidebar).
2. Under **CREATE**, turn on **Images** ("Makes and edits pictures on this PC's GPU") or **Video** ("Makes short clips on this PC's GPU").
3. Open the card's options to choose its **Generation model** and **Edit model** (or **Text-to-video model** and **Image-to-video model**). If the card says **Needs an image model** or **Needs a video model**, download one first: **Open Images** takes you there.

The agent can then edit a picture you attach to your message, or one it made earlier in the same chat. Agents that don't name a model use the **Default image model** on the Images page (**Choose automatically** unless you pick one).

## Pictures from a workflow

A [workflow](/windows/workflows) can make pictures as one of its steps. On the run's page, click a picture to open it in the viewer:

- **Previous image** and **Next image** (or the arrow keys) step through every picture of the run.
- **Open**, **Copy image**, and a folder button that shows the file in File Explorer.
- **Copy prompt** and **Copy settings** copy the words and the settings that made it, to make it again or tweak it.

## Sharing the graphics card with chat models

A [local model](/glossary#local-model) and image generation use the same graphics card, and they take turns:

- When both fit, both stay loaded.
- When a picture won't fit beside an idle chat model, the chat model is unloaded to make room; it loads again on your next message.
- An idle image model gives the card back after the minutes set in **Unload when idle (minutes)** on the Images page (1 to 240), or sooner when a chat model needs the room.
- If a chat model would have to run partly in system RAM because something else is using the card, Osaurus asks first: a card in the chat says "… won't fit in the GPU memory that's free", lists what's **Using the GPU now**, and offers **Load anyway** or **Cancel**. See [Local models](/windows/models).

## Bring your own model files

If you already have diffusion model files on your PC, click **Import model** on the Images page.

1. Click **Choose files…** or drop `.gguf` or `.safetensors` files on the page. Osaurus reads each file to tell what it is. It takes a Z-Image, FLUX.1 schnell or Qwen-Image 2.1 model, or an SD 1.5 or SDXL checkpoint.
2. A missing companion file (a VAE or text encoder) comes from the catalog.
3. Give it a **Name** and click **Import**.

A file on the same drive as your models folder is linked, taking no extra space; one on another drive is copied. Osaurus can't see an imported model's licence: check it before using its pictures for work.

## Troubleshooting

- **"Images aren't available in this version yet":** this copy of Osaurus has no image engine to download. Update Osaurus.
- **A model says Too large:** it needs more graphics and system memory than your PC has free. Try a smaller model or close other apps.
- **"The image engine could not start on CUDA … Restart your PC to get CUDA back":** your NVIDIA driver's CUDA got stuck. Osaurus carries on with the slower Vulkan engine until you restart Windows.
- **A video is very slow:** that's normal. Most video models default to a 480p clip of 2 to 3 seconds, because longer and larger clips take far longer.

---

## Under the hood

- The engine is [stable-diffusion.cpp](https://github.com/leejet/stable-diffusion.cpp)'s `sd-server`, a build Osaurus makes with its own security patch. It's downloaded on first use, checked against a pinned SHA-256 before it's unpacked, and runs as a child process listening only on this PC (`127.0.0.1`) with a fresh token per launch.
- It uses the same accelerator as local models (**Settings → Models**): CUDA on an NVIDIA card, else Vulkan, else the processor. On Windows on Arm, Qualcomm graphics get the processor build.
- Model files download from Hugging Face at pinned commits, each checked against its SHA-256, into `.media\blobs` inside your models folder.
- Before a job, Osaurus estimates what the model needs at that size (its files plus a measured working-memory curve) and weighs it against free graphics memory: run on the card, unload idle chat models first, run partly from system memory, or refuse with how much is needed and how much is free. A background job (an automation or workflow) never unloads the model you're chatting with.
- Pictures and clips are stored encrypted in `%LOCALAPPDATA%\osaurus\generated-media`, with the prompt and settings kept beside them rather than written into the file. They go when the chat is deleted. A finished video job is kept for 30 days; the clip in the chat stays.
- Videos come out of the engine as AVI and are saved as MP4 with Windows' own video encoder.
- Agents use the `image` and `video` tools, offered only to your own agents with **Images** or **Video** turned on. Remote callers never get your PC's graphics card; your paired phone and your own automations do.
- The local server also answers OpenAI-style `/images/*` and `/videos/*` requests from other apps; see [Apps & Devices](/windows/connections).

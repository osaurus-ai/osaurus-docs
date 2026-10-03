---
title: Image & Video
sidebar_label: Image & Video
description: Create and edit pictures on your Mac for free and offline, or choose a paid cloud service when you want hosted images or short videos.
---

# Image & Video

Osaurus can make pictures from a short description, and edit pictures you already have. You can do it entirely on your Mac, offline and free, with an image [model](/glossary#model) you download. If you want short videos, or a hosted image service, you can pick a paid cloud option instead. Osaurus always shows you the price and privacy terms first. For on-device images you need an [Apple Silicon](/glossary#apple-silicon) Mac with room for a model of several GB.

## Get started

1. Open **Settings…** (`⌘ ,`) → **Images**, and choose the **Image Models** tab.
2. Download a model. **Z-Image Turbo** is the best place to start.
3. Open a chat and pick that model in the model picker.
4. Describe the picture you want, like *"a watercolor dinosaur reading a book"*, and send it.

You'll see progress as the picture is made: the current step, time left, and time spent. You can cancel at any point.

## Choosing a model

The **Image Models** tab shows each model's download size and a link to its page on [Hugging Face](/glossary#hugging-face), the site where models are published.

| Model | Good at |
|---|---|
| **Z-Image Turbo** | Fast, high-quality pictures. The best starting point. |
| **FLUX.1 Schnell** | Pictures that follow your description closely |
| **Qwen-Image** | Making pictures from a description |
| **Qwen-Image-Edit** | Editing: give it one or more pictures plus instructions |
| **Ideogram 4** | Pictures with clear lettering and a stylized look |

You aren't limited to this list. The catalog also pulls in new models as they're published, and the **Import** button at the top of the Images screen lets you add another compatible model by pasting its name.

Image models are large and use a lot of memory while they work. Osaurus loads the model for each job and unloads it afterward, so it doesn't keep using your Mac's memory between pictures.

## Making pictures in chat

When an image model is selected, the chat box gains extra controls:

- **Size.** The width and height of the picture.
- **Steps.** How many passes the model makes. More steps can add detail but take longer.
- **Guidance.** How strictly the model sticks to your description.
- **Seed.** A number that makes a result repeatable. Use the same seed and description to get the same picture again.
- **Negative prompt.** Things you *don't* want in the picture.

### Editing a picture

1. Pick a model that can edit, like **Qwen-Image-Edit**.
2. Attach one or more pictures to your message.
3. Describe the change, like *"make the sky stormy"*.
4. Use **edit strength** to choose how much of the original to keep.

Edits apply to the whole picture. You can't yet paint over just one area to change it.

## Letting an agent make pictures and videos

An [agent](/glossary#agent) can make a picture (or a video) in the middle of a conversation, and the result appears right in the chat. This works whether the agent itself uses a local or a cloud model.

1. Open **Settings… → Agents** and pick one of your agents.
2. Go to **Abilities → Subagents**.
3. Turn on the **Image** card, and choose which image model the agent should use. For videos, turn on the **Video** card.

The [Orchestrator](/orchestrator) can't make pictures itself. To use it for pictures, add an image-enabled agent to its **Allowed subagents**, and it hands the job to that agent.

If your chat runs on a [local model](/glossary#local-model), Osaurus makes room for the image model first, so two large models don't compete for memory. It sets the chat model aside, makes the picture, then brings the chat model back and carries on. You can change this with the **Swap local models for subagents** setting; see [Subagents](/subagents#local-models-and-memory).

## Cloud images and videos

Cloud options run on another company's servers, so your description leaves your Mac and you pay per use. They come from two places: **Venice**, if you've added it as a [provider](/glossary#provider), or **Osaurus Cloud**, which is paid for with [credits](/glossary#credits).

- **Videos are cloud only.** Osaurus can make short videos from a description, or bring a still picture to life. There's no way to make videos on your Mac.
- **You see the cost first.** Before anything is sent, Osaurus shows an [approval](/glossary#approval) card with the service, its privacy terms, and the estimated price.
- **Nothing switches to the cloud on its own.** If you asked for a local model, the job stays on your Mac. Cloud is only used when you choose it.
- **Videos keep going if you close the window.** A video job carries on even if you quit and reopen Osaurus. When it's done, Osaurus saves a copy with your other generated files right away, because the cloud copy is only kept briefly.

You can see recent video jobs and change cloud video settings in **Settings… → Images → Defaults**.

## Troubleshooting

**The picture takes a long time or your Mac slows down.** Larger models need a lot of memory; some need 24 GB or more. On smaller Macs, use **Z-Image Turbo**.

**You don't see Osaurus Cloud options.** Cloud choices only appear when the Osaurus Cloud catalog is available. If it isn't, Osaurus hides those choices rather than guessing.

**You only got one picture.** Agents and local generation make one picture per request.

You can review every image job in [Insights](/glossary#insights), under the **Audio & Media** tab.

---

## Under the hood

### Settings and model catalog

**Settings… → Images** has two tabs. **Image Models** is the catalog. **Defaults** holds the default models, permissions, cloud video settings with recent jobs, and, under **Advanced**, the **Image model load policy**.

The catalog merges a curated set with a live listing of image bundles from the OsaurusAI Hugging Face org. **Import** stages any compatible (mflux-format) repo by its `org/repo` ID. Each installed model reports its capabilities (`generations`, `edits`, `upscale`), which the UI and API honor.

Cloud choices come from the connected provider or Router media catalog. Each entry declares its operation (`image`, `text_to_video`, or `image_to_video`), constraints, price, privacy policy, and whether audio is supported. If Osaurus Cloud catalog discovery returns `404`, Cloud media stays hidden; stale choices are not exposed.

### The `image` and `video` tools

Agents use the built-in `image` tool to generate a picture, or edit one with a local edit model. Generated media renders automatically in the conversation.

When the chat runs on a local model, the shared **Swap local models for subagents** setting decides what happens. On (the default), Osaurus unloads the chat model, runs the image job, then reloads the chat model and continues. Off keeps the chat model loaded through the job. The **Image model load policy** only controls cleanup of the image model afterward.

For a cloud target, the request includes an explicit backend (`remote_provider` for a configured Venice provider, or `osaurus_cloud`) and model. Osaurus validates the target's advertised constraints and always shows a billable approval prompt with backend, privacy, and estimated price before a remote image dispatch. There's no silent cloud fallback.

The `video` tool is cloud-only. Catalog entries advertise text-to-video or image-to-video, plus valid durations, aspect ratios, resolutions, and audio support. Before starting a job, Osaurus gets a short-lived quote. **Ask** permission shows the quote for approval; **Always Allow** can proceed after quoting; **Deny** blocks the job. The request is bound to the quote and an idempotency key, so an expired or increased quote is rejected instead of silently charging a different amount.

Video jobs are durable across client disconnects and app relaunches. They move through queued, running, completed, or failed states. A completed result is persisted into generated-artifact history before the transient cloud copy is deleted.

### HTTP API

OpenAI-compatible [endpoints](/glossary#endpoint) on the local server:

| Endpoint | Purpose |
|---|---|
| `POST /v1/images/generations` | Text-to-image |
| `POST /v1/images/edits` | Image editing (edit-capable models only; generation-only models return `400`) |
| `POST /v1/images/upscale` | Upscale a source image with an upscale-capable model. Send `image` plus an optional `scale` (default 4×). |
| `POST /v1/images/cancel` | Cancel an in-flight job |
| `GET /v1/images/models` | List installed local image models with capabilities and defaults |
| `POST /v1/videos/quote` | Quote a cloud text-to-video or image-to-video request |
| `POST /v1/videos/generations` | Start a quoted durable video job |
| `GET /v1/videos/jobs/{id}` | Poll queued, running, completed, or failed status |
| `GET /v1/videos/jobs/{id}/content` | Retrieve completed `video/mp4` content |

Generation supports streaming progress events (`queued`, `loading_model`, `step=n/m`, `cancelled`). Masks are not yet supported on the edit endpoint (`501`).

The `model` value is the installed bundle's directory name. Get the exact ID from `GET /v1/images/models`:

```bash
curl http://127.0.0.1:1337/v1/images/generations \
  -H "Content-Type: application/json" \
  -d '{
    "model": "Z-Image-Turbo-mflux-4bit",
    "prompt": "a watercolor dinosaur reading a book",
    "size": "1024x1024"
  }'
```

For remote image generation, provide a `target` and explicitly allow metered media spend:

```bash
curl http://127.0.0.1:1337/v1/images/generations \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "a cinematic dinosaur observatory",
    "target": {
      "backend": "osaurus_cloud",
      "model": "provider/model"
    },
    "aspect_ratio": "16:9",
    "allow_remote_media_spend": true
  }'
```

Remote targets may advertise `aspect_ratio`, `resolution`, `quality`, or other model-specific constraints. Unsupported fields are rejected or omitted rather than guessed.

### Limitations

- **Memory.** Larger models (Qwen-Image at high [quantization](/glossary#quantization)) can need 24 GB+ of unified memory.
- **No masked editing yet.** Edits apply to the whole image, guided by your instructions and edit strength.
- **Output counts differ by path.** Agent image calls and local HTTP generation produce one image. Remote HTTP generation accepts `n` from 1–4.
- **Local stays local.** Cloud media is an explicit target with spend consent, never an automatic fallback for a missing local model.
- **Video is hosted.** There's no local video runtime. Cloud output is transient, so Osaurus persists the artifact promptly after completion.
- **Agent image-to-video is provisional.** The `video` tool exposes `source_path`, but its quote phase does not consistently classify that source as image-to-video. Use the quoted HTTP flow for image-to-video until this is fixed.

---

**Related:**

- [Models](/models): the local model library and how downloads work
- [Subagents](/subagents): how the `image` and `video` tools fit the delegation family
- [HTTP API](/api): the full endpoint reference

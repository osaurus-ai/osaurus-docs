---
title: Image & Video
sidebar_label: Image & Video
description: Create and edit pictures on your Mac for free and offline, or choose a paid cloud service when you want hosted images or short videos.
---

# Image & Video

Osaurus can make pictures from a short description, edit pictures you already have, and sharpen small pictures into bigger ones. You can do it entirely on your Mac, offline and free, with an image [model](/glossary#model) you download. If you want short videos, or a hosted image service, you can pick a paid cloud option instead. Osaurus always shows you the price and privacy terms first. For on-device images you need an [Apple Silicon](/glossary#apple-silicon) Mac with room for a model of several GB.

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
| **FLUX 3 Image Klein** | Making and editing pictures at any size, guided by up to ten reference pictures. Free for non-commercial use only (FLUX Kommunity license). |
| **Qwen-Image 2.1** | Making pictures, and editing with one or more reference pictures, in one model |
| **Qwen-Image 2.1 Turbo** | A faster, 8-step version of Qwen-Image 2.1 |
| **Qwen-Image / Qwen-Image-Edit** | The earlier Qwen models: one makes pictures, the other edits them |
| **Ideogram 4** | Pictures with clear lettering and a stylized look |
| **SeedVR2 3B** | Upscaling: makes a picture 2× or 4× bigger and sharper |

You aren't limited to this list. The catalog also pulls in new models as they're published, and the **Import** button at the top of the Images screen lets you add another compatible model by pasting its name.

Image models are large and use a lot of memory while they work. Osaurus loads the model for each job and unloads it afterward, so it doesn't keep using your Mac's memory between pictures.

## Making pictures in chat

When an image model is selected, the chat box gains extra controls:

- **Size.** The width and height of the picture. Some models, like FLUX 3 Image Klein, accept any size you type; Osaurus rounds it to the nearest size the model supports when you press Return.
- **Steps.** How many passes the model makes. More steps can add detail but take longer. Turbo models use a fixed number of steps.
- **Guidance.** How strictly the model sticks to your description.
- **Seed.** A number that makes a result repeatable. Use the same seed and description to get the same picture again.
- **Negative prompt.** Things you *don't* want in the picture.

Controls a model doesn't use are hidden. After a picture finishes, the panel shows the settings that were actually used, which can differ from what you asked for (for example, a Turbo model's fixed step count).

### The Generate and Edit panel

In **Settings… → Images → Image Models**, open **Generate** or **Edit** next to an installed model for more control:

- **Sampler** and **Scheduler** list the choices that model supports. **Bundle default** keeps its own behavior.
- **Timestep shift** appears only on models that allow it. Leave it empty to keep the default.
- **Live previews** shows a small preview every few steps while the picture is made. Previews may be skipped when your Mac is busy, and never replace the final picture.

### Editing a picture

1. Pick a model that can edit, like **Qwen-Image 2.1** or **FLUX 3 Image Klein**.
2. Attach one or more pictures to your message. Order matters: the first picture sets the canvas.
3. Describe the change, like *"make the sky stormy"*.
4. On models that offer it, use **edit strength** to choose how much of the original to keep.

With FLUX 3 Image Klein, choose **Default** in the size picker (or **Use source aspect ratio** in the panel) to keep the first picture's shape. Edits apply to the whole picture. You can't yet paint over just one area to change it.

### Upscaling a picture

1. In **Settings… → Images → Image Models**, click **Upscale** next to an installed **SeedVR2 3B** model.
2. Choose a picture.
3. Pick **Scale**: **2×** or **4×**. Optionally enter a seed.

The picture keeps its shape. You can cancel anytime; Osaurus finishes cleaning up before starting the next image job.

## Letting an agent make pictures and videos

An [agent](/glossary#agent) can make a picture (or a video) in the middle of a conversation, and the result appears right in the chat. This works whether the agent itself uses a local or a cloud model.

1. Open **Settings… → Agents** and pick one of your agents.
2. Go to **Abilities → Subagents**.
3. Turn on the **Image** card, and choose which image model the agent should use. For videos, turn on the **Video** card.

The [Orchestrator](/orchestrator) can't make pictures itself. To use it for pictures, add an image-enabled agent to its **Allowed subagents**, and it hands the job to that agent.

If your chat runs on a [local model](/glossary#local-model), Osaurus makes room for the image model first, so two large models don't compete for memory. It sets the chat model aside, makes the picture, then brings the chat model back and carries on. You can change this with the **Swap local models for subagents** setting; see [Subagents](/subagents#local-models-and-memory).

## Cloud images and videos

Cloud options run on another company's servers, so your description leaves your Mac and you pay per use. They come from two places: **Venice**, if you've added it as a [provider](/glossary#provider), or **Osaurus Cloud**, which is paid for with [credits](/glossary#credits).

- **Videos are mostly cloud.** Osaurus can make short videos from a description, or bring a still picture to life. On your Mac, video needs a Wan 2.1 video model you've imported yourself (see [Under the hood](#local-video)); the built-in catalog doesn't include one.
- **You see the cost first.** Before anything is sent, Osaurus shows an [approval](/glossary#approval) card with the service, its privacy terms, and the estimated price.
- **Nothing switches to the cloud on its own.** If you asked for a local model, the job stays on your Mac. Cloud is only used when you choose it.
- **Videos keep going if you close the window.** A video job carries on even if you quit and reopen Osaurus. When it's done, Osaurus saves a copy with your other generated files right away, because the cloud copy is only kept briefly.

You can see recent video jobs and change local and cloud video settings, including whether video jobs ask first, in **Settings… → Images → Defaults**.

## Troubleshooting

**The picture takes a long time or your Mac slows down.** Larger models need a lot of memory; some need 24 GB or more. On smaller Macs, use **Z-Image Turbo**. Memory estimates for some models (like FLUX 3 Image Klein) are only a guide; Osaurus still runs the job and reports a real out-of-memory error if one happens.

**You don't see Osaurus Cloud options.** Cloud choices only appear when the Osaurus Cloud catalog is available. If it isn't, Osaurus hides those choices rather than guessing.

**The negative prompt or guidance setting is missing.** FLUX 3 Image Klein doesn't use them, so they're hidden.

**A batch stopped partway.** Pictures that finished before the problem are kept.

You can review every image job in [Insights](/glossary#insights), under the **Audio & Media** tab.

---

## Under the hood

### Settings and model catalog

**Settings… → Images** has two tabs. **Image Models** is the catalog. **Defaults** holds the default models, permissions, cloud video settings with recent jobs, and, under **Advanced**, the **Image model load policy**.

The catalog merges a curated set with a live listing of image bundles from the OsaurusAI Hugging Face org. **Import** stages any compatible (mflux-format) repo by its `org/repo` ID; pasting an image repo into the Local Models search also routes it here, never into the language-model list. Each installed model reports its capabilities (`generations`, `edits`, `upscale`), which the UI and API honor.

Family notes:

- **Qwen-Image 2.1 / 2.1 Turbo** are one bundle each for generation and ordered-reference editing, with bounded dimensions, supported step counts, and PNG output. Turbo (`qwen-image-2.1-turbo`) uses its bundle's fixed 8-step sampling grid.
- **FLUX 3 Image Klein** supports generate, edit, and up to ten ordered references. Width and height snap to multiples of 16 within 64–4096; default 1024×1024 and 16 steps, with no fixed step maximum. Unsized edits follow the first prepared reference (and crop a padded single reference back to its fitted box). The model is distilled, so a supplied negative prompt is accepted and ignored. A missing peak-memory estimate is logged as advisory and never refuses a job.
- **SeedVR2 3B** runs a fixed one-step restoration that preserves aspect ratio; unknown upscale formats are rejected.

Cloud choices come from the connected provider or Router media catalog. Each entry declares its operation (`image`, `text_to_video`, or `image_to_video`), constraints, price, privacy policy, and whether audio is supported. If Osaurus Cloud catalog discovery returns `404`, Cloud media stays hidden; stale choices are not exposed.

### The `image` and `video` tools

Agents use the built-in `image` tool to generate a picture (up to 4 per call), or edit one with a local edit model by passing source image paths. Generated media renders automatically in the conversation, with a selector for batch results. Delegated jobs carry explicit size, steps, seed, sampler settings, adapters, and ordered reference paths through unchanged, and edits are validated before handoff to the image worker.

When the chat runs on a local model, the shared **Swap local models for subagents** setting decides what happens. On (the default), Osaurus unloads the chat model, runs the image job, then reloads the chat model and continues. Off keeps the chat model loaded through the job. The **Image model load policy** only controls cleanup of the image model afterward.

For a cloud target, the request includes an explicit backend (`remote_provider` for a configured Venice provider, or `osaurus_cloud`) and model. Osaurus validates the target's advertised constraints and always shows a billable approval prompt with backend, privacy, and estimated price before a remote image dispatch. There's no silent cloud fallback.

For a cloud video, catalog entries advertise text-to-video or image-to-video, plus valid durations, aspect ratios, resolutions, and audio support. Before starting a job, Osaurus gets a short-lived quote. **Ask** permission shows the quote for approval; **Always Allow** can proceed after quoting; **Deny** blocks the job. The request is bound to the quote and an idempotency key, so an expired or increased quote is rejected instead of silently charging a different amount.

Video jobs are durable across client disconnects and app relaunches. They move through queued, running, completed, or failed states. A completed result is persisted into generated-artifact history before the transient cloud copy is deleted.

### Local video {/* #local-video */}

An installed Wan 2.1 video bundle runs through the same `video` tool and endpoints with `target.backend: "local"`, sharing model residency and memory admission with chat and image models. Local requests resolve their values before any weights load and never silently clamp them:

- `resolution` `480p` or `720p` with `aspect_ratio` `16:9`, `9:16`, or `1:1` (default 480p, 16:9 = 832×480); explicit `width` / `height` must be multiples of 16.
- `fps` defaults to 16, `steps` to 50, `guidance` to 5. Frame count must be 4n+1 and match `duration × fps` exactly (49 frames at 16 fps is `3.0625s`).
- `audio: true` is rejected. Explicit dimensions, frames, fps, steps, guidance, and seed are only accepted for local targets.

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

Generation supports streaming progress events (`queued`, `loading_model`, `step=n/m`, `cancelled`). Masks are not yet supported on the edit endpoint (`501`). Cancellation is cooperative: the image lane stays held until the producer drains.

Local generation and edit requests also accept optional `sampler`, `scheduler`, and `shift` (Turbo bundles with a fixed schedule reject alternates), plus `preview_interval` and `preview_max_pixel` for live previews (off by default). Unsupported provider requests fail instead of dropping these fields. Upscale accepts `scale` `2` or `4` and an optional `seed`. Qwen-Image 2.1 / Turbo results include `effective_parameters` with the actual dimensions, steps, guidance, seed, and sampling schedule; other backends omit the field rather than echoing requested values. Completed images in a batch are kept if a later image fails.

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
- **Output counts.** The `image` tool produces up to 4 images per call; remote HTTP generation accepts `n` from 1–4.
- **Local stays local.** Cloud media is an explicit target with spend consent, never an automatic fallback for a missing local model.
- **Video is mostly hosted.** Local video needs a Wan 2.1 bundle you import; it doesn't generate audio. Cloud output is transient, so Osaurus persists the artifact promptly after completion.
- **Agent image-to-video is provisional.** The `video` tool exposes `source_path`, but its quote phase does not consistently classify that source as image-to-video. Use the quoted HTTP flow for image-to-video until this is fixed.

---

**Related:**

- [Models](/models): the local model library and how downloads work
- [Subagents](/subagents): how the `image` and `video` tools fit the delegation family
- [HTTP API](/api): the full endpoint reference

---
title: Image & Video Generation
sidebar_label: Image & Video
description: Create and edit images locally, or explicitly use Venice and Osaurus Cloud for hosted image and video generation.
---

# Image & Video Generation

Osaurus supports two media paths:

- **Local images** — install an image model and generate or edit fully offline on your Mac.
- **Cloud media** — explicitly choose a Venice or Osaurus Cloud target for hosted image generation, text-to-video, or image-to-video. The picker shows the model's capabilities, privacy terms, and price before use.

There are three ways to use it:

- **Chat with an image model directly.** Pick an image model in the model picker and describe what you want. The composer exposes size, steps, guidance (CFG), seed, negative prompt, and edit strength.
- **Let your chat model call the `image` or `video` tool.** An enabled agent can generate media mid-conversation and render the result inline.
- **Call the HTTP API.** OpenAI-compatible local image endpoints plus durable cloud video jobs.

## Available models

Install models from the Management window (`⌘ ⇧ M`) → **Media → Models**. The catalog shows download sizes and links to each model's Hugging Face page. (The **Media → Settings** sub-tab holds global image defaults and media targets.)

| Model | Good at |
|---|---|
| **Z-Image Turbo** | Fast, high-quality text-to-image — the best starting point |
| **FLUX.1 Schnell** | Text-to-image with strong prompt adherence |
| **Qwen-Image** | Text-to-image |
| **Qwen-Image-Edit** | Editing — give it one or more source images plus instructions |
| **Ideogram 4** | Text-to-image, strong typography and stylized output |

The catalog is dynamic: a curated set is merged with a live listing of image bundles from the OsaurusAI Hugging Face org, and an **Import** field lets you stage any compatible (mflux-format) repo by pasting its `org/repo` id — you're not limited to what's listed. Each installed model reports its capabilities (`generations`, `edits`, `upscale`), which the UI and API honor.

Cloud choices come from the connected provider or Router media catalog. Each entry declares its operation (`image`, `text_to_video`, or `image_to_video`), constraints, price, privacy policy, and whether audio is supported. If Osaurus Cloud catalog discovery returns `404`, Cloud media remains hidden; stale choices are not exposed.

Image models are large (several GB) and memory-hungry while loaded. Osaurus loads a model for the job and unloads it afterward, so it doesn't sit on your RAM between generations.

## Generating in chat

1. Install a model from **Management → Media → Models**.
2. Select it in the chat model picker. The input card gains image controls: **size**, **steps**, **guidance**, **seed**, and **negative prompt**.
3. Describe the image and send. Progress streams in place — current step, ETA, and elapsed time — and you can cancel a generation at any point without leaving the app in a bad state.

For **editing**, pick an edit-capable model (like Qwen-Image-Edit), attach one or more source images, and describe the change. An **edit strength** control balances how much of the original is preserved.

## The `image` tool

Your chat model — local or cloud — can call the built-in `image` tool to generate a picture, or edit one with a local edit model, as part of a task. Generated media renders automatically in the conversation.

- Enable it per agent in **Agents → Abilities → Subagents**, where you can also pick which image model the agent uses.
- When your chat runs on a local model, Osaurus performs a **residency handoff**: it unloads the chat model, runs the image job, then reloads the chat model and continues — so two large models never fight for memory. The handoff is automatic and crash-safe.

For a cloud target, the request includes an explicit backend (`remote_provider` for a configured Venice provider, or `osaurus_cloud`) and model. Osaurus validates the target's advertised constraints and always shows a billable approval prompt with backend, privacy, and estimated price before a remote image dispatch. There is no silent cloud fallback: a request aimed at a local model stays local, and a missing Cloud catalog hides Cloud choices instead of rerouting them.

## The `video` tool

Video generation is cloud-only. Enable it per agent under **Agents → Abilities → Subagents**. Supported catalog entries advertise text-to-video or image-to-video along with valid durations, aspect ratios, resolutions, and audio support.

Before starting a job, Osaurus obtains a short-lived quote. **Ask** permission shows the quote for approval; **Always Allow** can proceed after quoting, while **Deny** blocks the job. The request is bound to the quote and an idempotency key; an expired or increased quote is rejected instead of silently charging a different amount.

Jobs are durable across client disconnects and app relaunches. They move through queued, running, completed, or failed states. A completed result is persisted into generated-artifact history before the transient cloud copy is deleted.

## HTTP API

OpenAI-compatible endpoints on the local server:

| Endpoint | Purpose |
|---|---|
| `POST /v1/images/generations` | Text-to-image |
| `POST /v1/images/edits` | Image editing (edit-capable models only; generation-only models return `400`) |
| `POST /v1/images/upscale` | Upscale a source image with an upscale-capable model — send `image` plus an optional `scale` (default 4×) |
| `POST /v1/images/cancel` | Cancel an in-flight job |
| `GET /v1/images/models` | List installed local image models with capabilities and defaults |
| `POST /v1/videos/quote` | Quote a cloud text-to-video or image-to-video request |
| `POST /v1/videos/generations` | Start a quoted durable video job |
| `GET /v1/videos/jobs/{id}` | Poll queued, running, completed, or failed status |
| `GET /v1/videos/jobs/{id}/content` | Retrieve completed `video/mp4` content |

Generation supports streaming progress events (`queued`, `loading_model`, `step=n/m`, `cancelled`). Masks are not yet supported on the edit endpoint (`501`).

The `model` value is the installed bundle's directory name — get the exact ID from `GET /v1/images/models`:

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

## Limitations

- **Apple Silicon memory matters.** Larger models (Qwen-Image at high quantization) can need 24 GB+ of unified memory. Start with Z-Image Turbo on smaller machines.
- **Masked editing isn't supported yet.** Edits apply to the whole image, guided by your instructions and edit strength.
- **Output counts differ by path.** Agent image calls and local HTTP generation currently produce one image. Remote HTTP generation accepts `n` from 1–4.
- **Local remains local.** Cloud media is an explicit target with spend consent, never an automatic fallback for a missing local model.
- **Video is hosted.** There is no local video runtime. Cloud output is transient, so Osaurus persists the artifact promptly after completion.
- **Agent image-to-video is provisional on current main.** The `video` tool exposes `source_path`, but its quote phase does not consistently classify that source as image-to-video. Use the quoted HTTP flow for image-to-video until this is fixed.

---

**Related:**

- [Models](/models) — the local model library and how downloads work
- [Subagents](/subagents) — how the `image` and `video` tools fit the delegation family
- [HTTP API](/api) — the full endpoint reference

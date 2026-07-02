---
title: Image Generation
sidebar_label: Image Generation
description: Create and edit images on your Mac, fully offline — local image models, an inline image tool for chat, and OpenAI-compatible HTTP endpoints.
---

# Image Generation

Create images on your Mac, fully offline. Install a local image model and generate from a text prompt — or hand it a source image to edit instead of starting from scratch. Nothing is sent to a server.

There are three ways to use it:

- **Chat with an image model directly.** Pick an image model in the model picker and describe what you want. The composer exposes size, steps, guidance (CFG), seed, negative prompt, and edit strength.
- **Let your chat model call the `image` tool.** Any agent with the capability enabled can generate or edit a picture mid-conversation and render it **inline** — pass source images and the tool switches to edit mode.
- **Call the HTTP API.** OpenAI-compatible endpoints for scripts and integrations.

## Available models

Install models from the Management window (`⌘ ⇧ M`) → **Settings → Images**. The catalog shows download sizes and links to each model's Hugging Face page.

| Model | Good at |
|---|---|
| **Z-Image Turbo** | Fast, high-quality text-to-image — the best starting point |
| **FLUX.1 Schnell** | Text-to-image with strong prompt adherence |
| **Qwen-Image** | Text-to-image |
| **Qwen-Image-Edit** | Editing — give it one or more source images plus instructions |
| **Ideogram** | Text-to-image, strong at stylized output |

Image models are large (several GB) and memory-hungry while loaded. Osaurus loads a model for the job and unloads it afterward, so it doesn't sit on your RAM between generations.

## Generating in chat

1. Install a model from **Settings → Images**.
2. Select it in the chat model picker. The input card gains image controls: **size**, **steps**, **guidance**, **seed**, and **negative prompt**.
3. Describe the image and send. Progress streams in place — current step, ETA, and elapsed time — and you can cancel a generation at any point without leaving the app in a bad state.

For **editing**, pick an edit-capable model (like Qwen-Image-Edit), attach one or more source images, and describe the change. An **edit strength** control balances how much of the original is preserved.

## The `image` tool

Your chat model — local or cloud — can call the built-in `image` tool to generate or edit a picture as part of a task, rendering the result inline in the conversation.

- Enable it per agent in **Agents → Configure → Subagents**, where you can also pick which image model the agent uses.
- When your chat runs on a local model, Osaurus performs a **residency handoff**: it unloads the chat model, runs the image job, then reloads the chat model and continues — so two large models never fight for memory. The handoff is automatic and crash-safe.

## HTTP API

OpenAI-compatible endpoints on the local server:

| Endpoint | Purpose |
|---|---|
| `POST /v1/images/generations` | Text-to-image |
| `POST /v1/images/edits` | Image editing (edit-capable models only; generation-only models return `400`) |
| `POST /v1/images/cancel` | Cancel an in-flight job |
| `GET /images/models` | List installed image models with capabilities and defaults |

Generation supports streaming progress events (`queued`, `loading_model`, `step=n/m`, `cancelled`). Masks are not yet supported on the edit endpoint (`501`).

```bash
curl http://127.0.0.1:1337/v1/images/generations \
  -H "Content-Type: application/json" \
  -d '{
    "model": "z-image-turbo",
    "prompt": "a watercolor dinosaur reading a book",
    "size": "1024x1024"
  }'
```

## Limitations

- **Apple Silicon memory matters.** Larger models (Qwen-Image at high quantization) can need 24 GB+ of unified memory. Start with Z-Image Turbo on smaller machines.
- **Masked editing isn't supported yet.** Edits apply to the whole image, guided by your instructions and edit strength.
- **Everything is local.** There's no cloud fallback for image generation — if you haven't installed a model, the `image` tool and endpoints report that clearly.

---

**Related:**

- [Models](/models) — the local model library and how downloads work
- [Subagents](/subagents) — how the `image` tool fits the delegation family
- [HTTP API](/api) — the full endpoint reference

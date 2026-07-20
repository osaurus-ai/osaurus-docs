---
title: Text-to-Speech
sidebar_label: Text-to-Speech
description: Have Osaurus read replies aloud — fully on-device with PocketTTS, or through any OpenAI-compatible TTS server on your network.
---

# Text-to-Speech

Reading is not always convenient either. Osaurus can speak assistant replies aloud — tap the speaker button on any assistant message, or let an agent speak for itself with the `speak` tool. Audio streams as it's synthesized, so speech starts before the whole reply is ready.

Two engines, pick one in settings:

| Engine | Best for | Needs |
|---|---|---|
| **On-Device (PocketTTS)** | Privacy, zero setup beyond a download | ~700 MB one-time model download; English only |
| **OpenAI-Compatible Server** | More voices, other languages, shared TTS on your network | Any server speaking the OpenAI `/v1/audio/speech` API |

## On-Device (PocketTTS)

Fully local synthesis via [FluidAudio PocketTTS](https://github.com/FluidInference/FluidAudio). Nothing leaves your Mac.

1. Open the Management window (`⌘ Shift M`) → **Voice** → **Text-to-Speech**
2. Enable **Text-to-Speech** and leave **Engine** on *On-Device (PocketTTS)*
3. Click **Download** on the model card (~700 MB, once)
4. Pick a voice and temperature, then test with **Preview**

## OpenAI-Compatible Server

Point Osaurus at any server implementing the OpenAI speech API — [openai-edge-tts](https://github.com/travisvn/openai-edge-tts), [Kokoro-FastAPI](https://github.com/remsky/Kokoro-FastAPI), LocalAI, or OpenAI itself.

1. Switch **Engine** to *OpenAI-Compatible Server*
2. Fill in the Server card:
   - **Endpoint** — base URL, e.g. `http://localhost:5050` (the API path is appended automatically)
   - **Model** and **Voice** — whatever your server understands (`tts-1` / `alloy`, `en-GB-SoniaNeural`, `af_sky`, …)
   - **API Key** — optional; stored in the macOS Keychain, never in config files
   - **Speed** — 0.25×–4×
3. Click **Test Connection**. It runs a real synthesis request through the full path, so a green *Connected* means playback will work. Any failure — wrong URL, server down, bad key, undecodable audio — shows the exact error inline.

### Quick start with openai-edge-tts

```bash
docker run -d -p 5050:5050 -e REQUIRE_API_KEY=False travisvn/openai-edge-tts:latest
```

That's it — free Microsoft Edge voices on localhost, and Osaurus plays them out of the box. Two tips:

- The image's auth is on by default (key `your_api_key_here`); the command above disables it, or enter that key in the API Key field.
- The stock image returns MP3, which Osaurus decodes automatically after each reply downloads. For lower-latency streaming, build the image with ffmpeg so it can serve WAV: `docker build --build-arg INSTALL_FFMPEG=true -t openai-edge-tts:ffmpeg https://github.com/travisvn/openai-edge-tts.git`

## How audio is handled

Osaurus asks servers for WAV (24 kHz mono) and checks what actually comes back:

- **WAV or raw PCM** — streamed frame-by-frame as it arrives
- **MP3 / FLAC** — buffered and decoded via CoreAudio after download, then played (slightly higher latency, but it works with servers that can't convert)
- **Anything unplayable** — rejected with a clear error naming the format, never noise or silence

## Troubleshooting

- **Speaker button opens settings instead of speaking** — the PocketTTS model isn't downloaded yet (on-device engine only).
- **Speaker icon flips back with no sound** — playback failed; the error appears in Settings → Voice → Text-to-Speech and in Console.app under subsystem `ai.osaurus`.
- **"Server sent WAV audio in an unsupported format"** — your server is converting to a non-24 kHz or stereo WAV; fix its converter settings.
- **Voices sound wrong-speed or robotic** — check the Speed slider first; then verify the server with Test Connection.

Settings live in `~/.osaurus/voice/tts.json`. The API key is kept only in the Keychain.

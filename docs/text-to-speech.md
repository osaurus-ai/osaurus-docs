---
title: Text-to-Speech
sidebar_label: Text-to-Speech
description: Have Osaurus read replies out loud — privately on your Mac, or through a speech server you run yourself for more voices and languages.
---

# Text-to-Speech

Osaurus can read replies out loud, so you can listen instead of reading. Click the speaker button on any reply, or let an agent speak on its own. Speech starts right away, before the whole reply is ready. By default it runs privately on your Mac after a one-time download of about 700 MB.

## Get started

1. Open **Settings…** (`⌘ ,`) → **Voice** → **Text To Speech**.
2. Turn on **Enable Text-to-Speech**.
3. On the **PocketTTS Model** card, click **Download** (about 700 MB, once).
4. In the **Voice** section, pick a voice and adjust **Temperature** (how varied the delivery sounds). The default voice is **alba**.
5. Type some text under **Preview** and play it to hear how it sounds.

Now click the speaker button on any reply to hear it.

## Choosing where the voice comes from

Osaurus has two speech engines. Switch between them under **Advanced → Engine** on the Text To Speech tab.

| Engine | Best for | What you need |
|---|---|---|
| **On-Device (PocketTTS)** | Privacy and simplicity | A one-time ~700 MB download. English only. |
| **OpenAI-Compatible Server** | More voices and other languages, or sharing one speech service on your network | A speech server you run yourself, or an online service |

**On-Device (PocketTTS)** is the default. Everything happens on your Mac, and nothing you hear is sent anywhere.

## Using a speech server

If you want more voices or other languages, you can connect Osaurus to a separate speech program. Popular free ones include [openai-edge-tts](https://github.com/travisvn/openai-edge-tts), [Kokoro-FastAPI](https://github.com/remsky/Kokoro-FastAPI), and LocalAI. OpenAI's own speech service works too, but then the text being read leaves your Mac.

1. On the Text To Speech tab, open **Advanced** and set **Engine** to **OpenAI-Compatible Server**.
2. Fill in the **Server** card:
   - **Endpoint:** the server's address, such as `http://localhost:5050`.
   - **Model** and **Voice:** names your server understands. Its documentation lists them.
   - **API Key:** only if your server needs one. It's stored in your [Keychain](/glossary#keychain).
   - **Speed:** from 0.25× to 4×.
3. Click **Test Connection**. Osaurus reads a short sample through the server. A green **Connected** means playback will work. If something's wrong, the exact error appears right there.

## Troubleshooting

- **The speaker button opens settings instead of speaking.** The on-device voice model isn't downloaded yet. Download it on the **PocketTTS Model** card.
- **The speaker icon flips back with no sound.** Playback failed. The error appears in **Settings… → Voice → Text To Speech**.
- **"Server sent WAV audio in an unsupported format".** Your speech server is sending audio Osaurus can't play. See Under the hood.
- **Voices sound too fast, too slow, or robotic.** Check the **Speed** slider first, then click **Test Connection**.

---

## Under the hood

### The `speak` tool

Agents can read text aloud with the `speak` tool. Audio streams as it's synthesized.

### PocketTTS

On-device synthesis uses [FluidAudio PocketTTS](https://github.com/FluidInference/FluidAudio). The default voice is `alba`.

### OpenAI-compatible servers

Any server implementing the OpenAI `/v1/audio/speech` API works. For **Endpoint**, enter the base URL; the API path is appended automatically. Example model/voice values: `tts-1` / `alloy`, `en-GB-SoniaNeural`, `af_sky`. The API key is kept only in the Keychain, never in config files. **Test Connection** runs a real synthesis request through the full playback path, and reports failures (wrong URL, server down, bad key, undecodable audio) inline.

### Quick start with openai-edge-tts

```bash
docker run -d -p 5050:5050 -e REQUIRE_API_KEY=False travisvn/openai-edge-tts:latest
```

This gives you free Microsoft Edge voices on localhost, and Osaurus plays them out of the box. Two tips:

- The image's auth is on by default (key `your_api_key_here`). The command above disables it, or you can enter that key in the API Key field.
- The stock image returns MP3, which Osaurus decodes after each reply downloads. For lower-latency streaming, build the image with ffmpeg so it can serve WAV: `docker build --build-arg INSTALL_FFMPEG=true -t openai-edge-tts:ffmpeg https://github.com/travisvn/openai-edge-tts.git`

### How audio is handled

Osaurus asks servers for WAV (24 kHz mono) and checks what actually comes back:

- **WAV or raw PCM:** streamed frame by frame as it arrives.
- **MP3 / FLAC:** buffered and decoded via CoreAudio after download, then played (slightly higher latency, but it works with servers that can't convert).
- **Anything unplayable:** rejected with a clear error naming the format, never noise or silence.

"Server sent WAV audio in an unsupported format" means the server is converting to a non-24 kHz or stereo WAV; fix its converter settings.

### Logs and settings

Playback errors also appear in Console.app under subsystem `ai.osaurus`. Settings live in `~/.osaurus/voice/tts.json`.

---

**Related:**

- [Voice](/voice): talking to Osaurus and dictation

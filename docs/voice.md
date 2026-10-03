---
title: Voice
sidebar_label: Voice
description: Talk to your AI hands-free, dictate into any app, or transcribe meetings — all on your Mac. Your voice never leaves it.
---

# Voice

Sometimes typing isn't convenient: you're cooking, your hands are full, or you just want to think out loud. Osaurus turns your speech into text ([transcription](/glossary#transcription)) right on your Mac, so you can talk to an agent, dictate into any app, or transcribe a meeting. Your voice never leaves your computer. You need a microphone and a one-time download of about 600 MB.

Osaurus offers three ways to use your voice:

| Feature | What it does | Where it works |
|---|---|---|
| **Voice input in chat** | Speak your next message instead of typing it | The chat window |
| **Wake Word** | Say an agent's name to open a chat hands-free | Anywhere, in the background |
| **Transcription Mode** | Press a shortcut key and speak into any text box | Any app on your Mac |

Osaurus can talk back too. See [Text-to-Speech](/text-to-speech) to have replies read aloud.

## Get started

1. Open **Settings…** (`⌘ ,`) → **Voice**. It opens on the **Setup** tab.
2. Next to **Microphone**, click **Grant** to let Osaurus use your mic.
3. Next to **Parakeet model**, click **Download** to get the speech model.
4. When both show checkmarks, click the big mic button to test it.

Voice settings are split into tabs:

| Tab | What's there |
|---|---|
| **Setup** | Permissions, model download, which microphone to use, how sensitive listening is, and the test mic |
| **Chat Voice** | **Enable Voice Input** for the mic button in the chat box |
| **Transcription** | Transcription Mode, its shortcut key, and the **Stop Behavior & Cleanup** settings (shared with chat voice input) |
| **Text To Speech** | Having replies read aloud. See [Text-to-Speech](/text-to-speech). |
| **Wake Word** | Hands-free activation |
| **Models** | Managing your speech models |

## Picking a model

Osaurus uses Parakeet speech models, which run on your Mac. There are two:

- **Parakeet TDT v3** is the default. It understands 25 European languages, including English, German, Spanish, and French. Pick this one unless you have a reason not to.
- **Parakeet TDT v2** understands English only, and is slightly more accurate for English. Pick it if you only ever speak English.

Each is about 600 MB and downloads once.

## Voice input in chat

Click the microphone button in the chat box, and speak. Your words appear as you talk. Click again to stop, or pause and let Osaurus send the message for you.

### Sending automatically

With the default settings:

1. You speak, and see your words appear.
2. When you pause, a countdown appears.
3. If you start talking again, the countdown resets.
4. When the countdown ends, the message sends.

To send only when you click stop, switch **Stop Mode** to **Manual**, or set **Pause Detection** to 0.

### Settings

| Setting | Where | Default | What it does |
|---|---|---|---|
| **Enable Voice Input** | Voice → Chat Voice | On | Turns voice in chat on or off |
| **Sensitivity** | Voice → Setup | Medium | How easily Osaurus picks up your voice |
| **Stop Mode** | Voice → Transcription → Stop Behavior & Cleanup | Automatic | **Automatic** sends after a short pause; **Manual** waits for you to click stop |
| **Pause Detection** | Voice → Transcription → Stop Behavior & Cleanup | 1.5s | How long a silence counts as a pause (0 turns it off) |
| **Confirmation Delay** | Voice → Transcription → Stop Behavior & Cleanup | 2.0s | How long the countdown lasts before sending |
| **Clean Up Transcription** | Voice → Transcription → Stop Behavior & Cleanup | On | Removes filler words like "uh" and "mm", using the [Core Model](/glossary#core-model) |

The Stop Behavior & Cleanup settings apply to both chat voice input and Transcription Mode.

### Sensitivity levels

| Level | Best for |
|---|---|
| Low | Noisy places, or a loud voice |
| Medium | Normal conversation |
| High | Quiet places, or a soft voice |

### Transcribing what's playing on your Mac

Osaurus can listen to your microphone, or to the sound playing on your Mac.

| Source | Use it for |
|---|---|
| Microphone (built-in, external, or Bluetooth) | Dictating messages |
| System audio | Transcribing a meeting, podcast, video, or lecture |

System audio needs the macOS **Screen Recording** permission. Osaurus leaves out its own sound automatically, so it doesn't transcribe itself.

## Wake Word (VAD mode)

Wake Word lets you start a chat without touching your Mac. Say a [wake word](/glossary#wake-word), like an agent's name, or a phrase you choose, and a chat with that agent opens. It used to be called **VAD Mode** (short for voice activity detection).

### Turn on Wake Word

1. Open **Settings… → Voice → Wake Word** and turn on **Enable Wake Word**.
2. Choose which agents should respond to their names.
3. If you like, set a custom wake phrase, such as "Hey Osaurus".

### How it works

Osaurus listens quietly in the background. When it hears an agent's name or your wake phrase, the chat window opens with that agent, and voice input starts automatically. Close the chat, and Wake Word goes back to listening.

### Wake Word settings

| Setting | Default | What it does |
|---|---|---|
| **Enable Wake Word** | Off | Turns Wake Word on or off |
| Enabled agents | None | Which agents respond to their names |
| Custom wake phrase | Empty | An optional phrase that opens a chat |
| Wake-word sensitivity | Medium | How easily it picks up the wake word |
| Auto-start voice input | On | Start listening for your message right after it wakes |

### Status indicators

| Where | What it looks like | Meaning |
|---|---|---|
| Menu bar icon | Blue pulsing dot | Wake Word is listening |
| Menu bar icon | Orange dot | Wake Word heard something and is working on it |
| Menu bar icon | No dot | Wake Word is off |
| Menu bar pop-up | Green waveform button | Listening is on |
| Menu bar pop-up | Gray waveform button | Listening is off |

## Transcription Mode

Transcription Mode lets you dictate into any text box on your Mac: an email, a document, a search bar, anything. Press your shortcut key and start talking.

### One-time setup

1. Open **Settings… → Voice → Transcription**.
2. Give Osaurus the **Accessibility** permission (**System Settings → Privacy & Security → Accessibility**, then turn on Osaurus). You may need to restart Osaurus.
3. Turn on **Enable Transcription Mode**.
4. Click the shortcut field and press the key combination you want.

### Using it

1. Click into any text box, in any app.
2. Press your shortcut key.
3. Speak. Your words are typed into the box as you talk.
4. Press `Esc` or click **Done** to stop.

While you dictate, a small bar floats at the top of the screen. It shows a "Listening" light, a moving waveform, a **Done** button, and a close button that cancels and throws away what you said. It stays on top of other windows, matches your theme, and respects the macOS reduce-motion setting.

### Tips for best results

- **Speak clearly**, at a steady volume.
- **Use an external mic** if you can. Built-in mics work, but external ones are more accurate.
- **Find a quiet spot.** Background noise makes mistakes more likely.
- **Use Parakeet TDT v3** for the best overall accuracy, unless you only need English.

You can use it for emails, documents, comments in code, chat apps like Slack or Messages, web forms, and quick notes.

## Privacy

Everything happens on your Mac:

- **No cloud.** Speech is turned into text on your Mac.
- **No recordings.** Audio is processed in memory and never saved.
- **Works offline.** Models download once, then run without the internet.
- **Wake Word is local too.** Listening for your wake phrase happens on your Mac.

Each dictation is still listed in [Insights](/glossary#insights) as a **Transcription** entry (under **Audio & Media**) marked **Local**, so you can check what was transcribed. See [Developer Tools](/developer-tools#insights).

## Troubleshooting

### Mic not working

1. Open **System Settings → Privacy & Security → Microphone** and turn on Osaurus.
2. Check that the right microphone is selected in **Voice → Setup**.
3. Try the mic in another app.
4. Restart Osaurus.

### Poor transcription quality

1. Switch to Parakeet TDT v3 if you're using v2.
2. Move somewhere quieter, or use an external mic.
3. Speak clearly and at a steady volume.
4. Lower the sensitivity if it picks up background noise; raise it if you speak softly.

### Wake Word doesn't respond

1. Make sure **Settings… → Voice → Wake Word → Enable Wake Word** is on.
2. Turn on at least one agent for Wake Word, or set a custom wake phrase.
3. Say the agent's full name, and wait 2–3 seconds between tries.
4. Check that the menu bar icon shows the blue pulsing dot.

### System audio isn't captured

1. Give Osaurus the **Screen Recording** permission.
2. Restart Osaurus after granting it.

### Transcription Mode doesn't type

1. Open **System Settings → Privacy & Security → Accessibility**, turn on Osaurus, and restart it.
2. Check that the shortcut key is set and isn't used by another app.
3. Click into a text box before pressing the shortcut.
4. Some apps don't accept typed-in text this way. Try TextEdit to confirm everything is set up.

### Your Mac works hard while Wake Word is on

Listening all the time uses some processing power. If that's a problem:

- Use a smaller model.
- Turn off Wake Word when you don't need it.
- Close apps you aren't using.

### Model download fails

- Check your internet connection.
- Make sure you have at least 1 GB of free disk space.
- Delete partial downloads (see Under the hood) and try again.

---

## Under the hood

- Speech recognition uses [FluidAudio](https://github.com/FluidInference/FluidAudio) with Parakeet TDT models, running on Apple's Neural Engine.
- Downloaded speech models live in `~/Library/Application Support/FluidAudio/Models/`. Delete partial downloads there if a download fails.
- Transcription Mode types by simulating keyboard input, which is why it needs the Accessibility permission.
- System audio capture uses Screen Recording permission; Osaurus's own audio output is excluded to prevent feedback.

### Requirements

- Voice features work on any Mac that runs Osaurus (macOS 15.5 or later, [Apple Silicon](/glossary#apple-silicon)). See [Installation](/installation).
- **Microphone** permission (always)
- **Screen Recording** permission (system audio only)
- **Accessibility** permission (Transcription Mode only)

---

**Related:**

- [Chat](/chat): voice input in the chat window
- [Agents](/agents): agents that respond to wake words
- [Themes](/themes): the dictation bar follows the active theme

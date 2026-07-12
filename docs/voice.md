---
title: Voice
sidebar_label: Voice
description: Talk to your AI hands-free, dictate into any app, or transcribe meetings — all on-device. Nothing leaves your Mac.
---

# Voice

Sometimes typing isn't convenient — you're cooking, driving, or just want to think out loud. Osaurus has fully local speech-to-text powered by [FluidAudio](https://github.com/FluidInference/FluidAudio) on Apple's Neural Engine. Speak naturally, see your words appear in real time, knowing nothing leaves your Mac.

Three voice features for three different jobs:

| Feature | What it does | Where it works |
|---|---|---|
| **Voice input in chat** | Dictate your next message | Chat overlay |
| **VAD Mode** | Always-on listening for a wake word | System-wide (background) |
| **Transcription Mode** | Hotkey to dictate into any text field | Anywhere on macOS |

## Setup (once)

1. Open the Management window (`⌘ ,`) → **Voice**
2. Complete the requirements at the top of the page:
   - **Microphone** — click **Grant** to enable mic access
   - **Parakeet model** — click **Download** to fetch the recommended model
3. When both show checkmarks, the big mic button activates — tap to test

## Picking a model

Osaurus uses Parakeet TDT models for on-device speech recognition. Two versions are available:

- **Parakeet TDT v3** — the multilingual default. Recognizes 25 European languages including English, German, Spanish, French, and most major European languages. Pick this one unless you have a reason not to.
- **Parakeet TDT v2** — English only, with a slight edge in pure-English recall. Pick this if you only ever dictate in English and want the best possible accuracy.

Both models are about 600 MB and download once.

## Voice input in chat

The simplest mode. Click the microphone button in the chat input bar, speak, watch the transcription appear in real time, click again to stop (or wait for auto-send).

### Settings

| Setting | Default | What it does |
|---|---|---|
| Voice input enabled | On | Master toggle for voice in chat |
| Sensitivity | Medium | Voice detection threshold |
| Pause duration | 1.5s | Silence before auto-send (set to 0 to disable) |
| Confirmation delay | 2.0s | Countdown shown before sending |

### Sensitivity levels

| Level | Best for |
|---|---|
| Low | Noisy environments, louder speech |
| Medium | Normal conversation |
| High | Quiet environments, soft speech |

### Auto-send

When pause duration is set:

1. You speak; you see real-time transcription
2. When you pause, a countdown appears
3. If you resume speaking, the countdown resets
4. After the countdown elapses, the message sends automatically

Set pause duration to 0 to disable (manual send only).

### Audio sources

Osaurus can transcribe from your microphone or from the audio playing on your Mac.

| Source | Use case |
|---|---|
| Microphone (built-in / external / Bluetooth) | Dictating messages |
| System audio | Transcribe a meeting, podcast, video, or lecture |

System audio capture requires macOS 12.3+ and Screen Recording permission. Osaurus's own audio output is excluded automatically to prevent feedback.

## VAD Mode (wake-word activation)

VAD ("Voice Activity Detection") Mode lets you activate Osaurus hands-free. Say an agent's name or a custom wake phrase, and chat opens with that agent.

### Enable VAD

1. **Voice → VAD Mode → Enable**
2. Select which agents should respond to wake words
3. Optionally set a custom wake phrase like "Hey Osaurus"

### How it feels

Osaurus listens in the background. When it hears an agent's name (or your custom wake phrase), the chat overlay appears with that agent ready, and voice input starts automatically. Close the chat and VAD goes back to listening.

### VAD settings

| Setting | Default | What it does |
|---|---|---|
| VAD Mode enabled | Off | Master toggle |
| Enabled agents | None | Which agents respond to wake words |
| Custom wake phrase | Empty | Optional activation phrase |
| Wake-word sensitivity | Medium | Detection threshold |
| Auto-start voice input | On | Begin recording after activation |

### Status indicators

| Where | What it looks like | Meaning |
|---|---|---|
| Menu bar icon | Blue pulsing dot | VAD is listening |
| Menu bar icon | Orange dot | VAD is processing speech |
| Menu bar icon | No dot | VAD is off |
| Popover | Waveform button green | Listening on |
| Popover | Waveform button gray | Listening off |

## Transcription Mode

Transcription Mode is a global hotkey that types your speech directly into any focused text field — email, document, search bar, code editor, anything.

### One-time setup

1. **Voice → Transcription**
2. Grant **Accessibility permission** (System Settings → Privacy & Security → Accessibility → enable Osaurus). You may need to restart Osaurus.
3. Toggle **Enable Transcription Mode**
4. Click the hotkey field and press your preferred combination

### Using it

1. Click into any text field, anywhere on macOS
2. Press your hotkey
3. Speak — your words type into the focused field in real time
4. Press `Esc` or click **Done** to stop

### What appears

A minimal floating overlay at the top of the screen with:

- A "Listening" indicator with a pulsing accent color
- Animated waveform that responds to audio level
- Done button
- Close button (cancels and discards)

The overlay stays on top of every window and follows your active theme. Reduced-motion settings are respected.

### Tips for best results

- **Speak clearly.** Enunciate; don't mumble.
- **External mic helps.** Built-ins work but external mics improve accuracy.
- **Quiet environment.** Background noise hurts transcription.
- **Use Parakeet TDT v3.** Best overall accuracy unless you only need English.

### Use cases

- Email composition (Mail, Gmail, etc.)
- Document writing (Word, Pages, Google Docs)
- Code comments in your IDE
- Chat messages in Slack, Discord, iMessage
- Form filling on the web
- Quick capture in any notes app

## Privacy

Everything is local:

- **No cloud transcription.** FluidAudio runs entirely on-device.
- **No audio recording.** Audio is processed in memory only — nothing is saved.
- **Models stored locally.** Downloaded once, used offline.
- **VAD is local.** Wake-phrase detection runs on-device.

Your voice never leaves your Mac.

## Troubleshooting

### Mic not working

1. **System Settings → Privacy & Security → Microphone** → enable Osaurus
2. Verify the right device is selected in Voice settings
3. Test the mic in another app
4. Restart Osaurus

### Poor transcription quality

1. Switch to Parakeet TDT v3 if you're on v2
2. Use a quieter environment or external mic
3. Speak more clearly and at consistent volume
4. Lower sensitivity if it's picking up background noise; raise it for soft speech

### VAD not detecting wake words

1. Confirm VAD is enabled and the menu bar dot is visible
2. At least one agent must be enabled for VAD (or a custom wake phrase set)
3. Speak the full agent name; allow a 2–3 second cooldown between detections
4. Check that the menu bar icon shows the blue pulsing dot

### System audio not capturing

1. Check macOS version (12.3+)
2. Grant Screen Recording permission
3. Restart after granting

### Transcription Mode not typing

1. **System Settings → Privacy & Security → Accessibility** → enable Osaurus and restart
2. Verify the hotkey is set and doesn't conflict with another app
3. Click into a text field before pressing the hotkey
4. Some apps with custom text fields may not accept simulated keyboard input — try TextEdit to confirm setup

### High CPU when VAD is on

Always-on listening uses continuous CPU. If it's a problem:

- Use a smaller model
- Disable VAD when you don't need it
- Close unnecessary apps

### Model download fails

- Check your internet connection
- Verify ≥1 GB of free disk space
- Delete partial downloads from `~/Library/Application Support/FluidAudio/Models/` and retry

## Requirements

- **macOS 15.5+** for voice input
- **macOS 12.3+** for system audio capture
- **Apple Silicon** (M1+) for optimal performance
- **Microphone** permission (always)
- **Screen Recording** permission (system audio only)
- **Accessibility** permission (Transcription Mode only)

---

**Related:**

- [Chat](/chat) — voice input in the chat overlay
- [Agents](/agents) — agents that respond to VAD wake words
- [Themes](/themes) — overlay follows the active theme

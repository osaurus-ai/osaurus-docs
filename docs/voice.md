---
title: Voice Input
sidebar_label: Voice Input
description: On-device speech-to-text via FluidAudio on Apple's Neural Engine. Voice in chat, wake-word activation, global dictation. All local.
sidebar_position: 10
---

# Voice Input

Sometimes typing isn't convenient — you're cooking, exercising, or just want to think out loud. Osaurus has fully local speech-to-text powered by [FluidAudio](https://github.com/FluidInference/FluidAudio) on Apple's Neural Engine. Speak naturally, see your words appear in real time, knowing nothing leaves your Mac.

Three voice features, three different jobs:

| Feature | What it does | Where it works |
|---|---|---|
| **Voice input in chat** | Dictate your next message | Chat overlay |
| **VAD Mode** | Always-on listening for a wake word | System-wide (background) |
| **Transcription Mode** | Hotkey to dictate into any text field | Anywhere on macOS |

## Setup (once)

1. Open the Management window (`⌘ ⇧ M`) → **Voice**
2. Complete the requirements at the top of the page:
   - **Microphone** — click **Grant** to enable mic access
   - **Parakeet model** — click **Download** to fetch the recommended model
3. When both show checkmarks, the big mic button activates — tap to test

If you'd rather configure it manually, the settings live in the same Voice tab.

## Parakeet models

Osaurus uses [FluidAudio](https://github.com/FluidInference/FluidAudio) Parakeet TDT models for on-device speech recognition via CoreML and the Apple Neural Engine.

| Model | Size | Languages | When to pick it |
|---|---|---|---|
| **Parakeet TDT v3 (0.6B)** | ~600 MB | Multilingual (25 European languages) | Recommended default |
| **Parakeet TDT v2 (0.6B)** | ~600 MB | English only | Slightly better English recall |

Models are stored at `~/Library/Application Support/FluidAudio/Models/`.

Languages supported by v3: English, German, Spanish, French, Dutch, Italian, Danish, Estonian, Finnish, Greek, Hungarian, Latvian, Lithuanian, Maltese, Polish, Portuguese, Romanian, Slovak, Slovenian, Swedish, Russian, Ukrainian, Bulgarian, Croatian, Czech.

## Voice input in chat

The simplest mode. Click the microphone button in the chat input bar, speak, watch the transcription appear in real time, click again to stop (or wait for auto-send).

### Settings

| Setting | Default | Description |
|---|---|---|
| Voice input enabled | On | Master toggle for voice in chat |
| Sensitivity | Medium | Voice detection threshold |
| Pause duration | 2.0s | Silence before auto-send (set to 0 to disable) |
| Confirmation delay | 1.5s | Countdown shown before sending |

### Sensitivity levels

| Level | Energy threshold | Silence detection | Best for |
|---|---|---|---|
| Low | Higher | 0.4s | Noisy environments, louder speech |
| Medium | Balanced | 0.6s | Normal conversation |
| High | Lower | 1.2s | Quiet environments, soft speech |

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

VAD (Voice Activity Detection) Mode lets you activate Osaurus hands-free. Say an agent's name or a custom wake phrase to open chat with that agent.

### Enable VAD

1. **Voice → VAD Mode → Enable**
2. Select which agents should respond to wake words
3. Optionally set a custom wake phrase like "Hey Osaurus"

### How it works

```
1. Osaurus listens in the background
2. Real-time transcription is checked for agent names + wake phrase
3. On a match, chat opens with the detected agent
4. Voice input starts automatically (if enabled)
5. After chat closes, VAD resumes listening
```

### VAD settings

| Setting | Default | Description |
|---|---|---|
| VAD Mode enabled | Off | Master toggle |
| Enabled agents | None | Which agents respond to wake words |
| Custom wake phrase | Empty | Optional activation phrase |
| Wake-word sensitivity | Medium | Detection threshold |
| Auto-start voice input | On | Begin recording after activation |
| Silence timeout | 0 (disabled) | Auto-close chat after this many seconds of silence |

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

- Status indicator ("Listening" with a pulsing accent color)
- Animated waveform that responds to audio level
- Done button
- Close button (cancels and discards)

The overlay stays on top of every window and follows your active theme. Reduced-motion settings are respected.

### Tips for best results

- **Speak clearly.** Enunciate; don't mumble.
- **External mic helps.** Built-ins work but external mics improve accuracy.
- **Quiet environment.** Background noise hurts transcription.
- **Use Parakeet TDT v3.** It's the multilingual model and has the best overall accuracy.

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

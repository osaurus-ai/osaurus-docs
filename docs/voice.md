---
title: Voice Input
sidebar_label: Voice Input
description: Speech-to-text powered by FluidAudio on Apple's Neural Engine — fully local, private, on-device transcription
sidebar_position: 12
---

# Voice Input

Sometimes typing isn't convenient — you're cooking, exercising, or just want to think out loud. Osaurus includes fully local speech-to-text powered by FluidAudio on Apple's Neural Engine. Speak naturally, see your words appear in real-time, and know that nothing leaves your Mac.

## Features

- **Real-time transcription** — See your words as you speak
- **Multiple transcription models** — From Tiny (75 MB) to Large V3 (3 GB)
- **Microphone or system audio** — Transcribe your voice or computer audio
- **Configurable sensitivity** — Adjust for quiet or noisy environments
- **Auto-send with confirmation** — Hands-free message sending
- **Transcription Mode** — Dictate into any app with a global hotkey

## Setup

### 1. Open Voice Settings

1. Open the Management window (**⌘⇧M**)
2. Navigate to the **Voice** tab

### 2. Grant Microphone Permission

When prompted, allow Osaurus to access your microphone:

1. Click **Enable Microphone** in Voice settings
2. macOS will show a permission dialog
3. Click **Allow**

If you accidentally denied permission:

1. Open **System Settings** → **Privacy & Security** → **Microphone**
2. Find Osaurus in the list
3. Toggle the switch to enable

### 3. Download a Transcription Model

Choose and download a transcription model:

| Model        | Size   | Speed    | Accuracy  | Best For                        |
| ------------ | ------ | -------- | --------- | ------------------------------- |
| **Tiny**     | 75 MB  | Fastest  | Basic     | Quick notes, casual use         |
| **Base**     | 142 MB | Fast     | Good      | General purpose                 |
| **Small**    | 466 MB | Moderate | Better    | Balanced performance            |
| **Medium**   | 1.5 GB | Slower   | Very Good | Higher accuracy needs           |
| **Large V3** | 3 GB   | Slowest  | Best      | Maximum accuracy, complex audio |

Click **Download** next to your chosen model. The model downloads to `~/.osaurus/voice-models`.

:::tip Recommended
Start with **Small** for a good balance of speed and accuracy. Upgrade to **Large V3** if you need better transcription for accented speech or technical vocabulary.
:::

### 4. Test Your Voice Input

1. Click the microphone button in the chat input area
2. Speak a test phrase
3. Watch the transcription appear in real-time
4. Click the microphone button again to stop

## Using Voice Input

### Starting Voice Input

- **Click** the microphone icon in the chat input area
- The icon animates to show recording is active
- Speak naturally at a normal pace

### Stopping Voice Input

- **Click** the microphone icon again
- Or wait for the silence timeout
- Transcription is inserted into the input field

### Auto-Send

When enabled, voice input automatically sends your message after transcription:

1. Open Voice settings (**⌘⇧M** → **Voice**)
2. Enable **Auto-send after transcription**
3. Optionally enable **Confirm before sending** for a review step

### Switching Audio Sources

Choose between microphone and system audio:

| Source           | Description                    | Use Case                      |
| ---------------- | ------------------------------ | ----------------------------- |
| **Microphone**   | Your voice input               | Dictating messages            |
| **System Audio** | Audio playing on your computer | Transcribing videos, meetings |

Select the audio source in Voice settings.

## Sensitivity Settings

Adjust voice detection for your environment:

| Setting             | Description                                     |
| ------------------- | ----------------------------------------------- |
| **Sensitivity**     | How loud audio must be to trigger transcription |
| **Silence Timeout** | How long to wait after silence before stopping  |

- **Quiet environment** — Lower sensitivity, shorter timeout
- **Noisy environment** — Higher sensitivity, longer timeout

## VAD Mode (Voice Activity Detection)

VAD Mode enables hands-free activation of Osaurus using wake phrases. Say your agent's name or a custom phrase to open chat and start voice input automatically.

### Enabling VAD Mode

1. Open Voice settings (**⌘⇧M** → **Voice**)
2. Toggle **VAD Mode** to enable
3. Configure wake phrases (optional)

### How VAD Works

1. **Always Listening** — Osaurus listens for wake phrases in the background
2. **Activation** — When a wake phrase is detected, chat opens automatically
3. **Voice Input Starts** — Microphone activates for your message
4. **Automatic Close** — Chat closes after silence timeout (configurable)

### Status Indicators

| Indicator                  | Meaning                                      |
| -------------------------- | -------------------------------------------- |
| **Blue pulsing dot**       | VAD is active and listening for wake phrases |
| **Microphone icon active** | Currently recording voice input              |

The blue pulsing dot appears on the menu bar icon when VAD is enabled and listening.

### Wake Phrases

By default, saying an agent's name activates that agent:

- "Hey Code Assistant" → Opens chat with Code Assistant agent
- "Hey Research Helper" → Opens chat with Research Helper agent

You can also configure custom wake phrases in Voice settings.

### VAD Settings

| Setting             | Description                               |
| ------------------- | ----------------------------------------- |
| **Wake Phrases**    | Custom phrases to trigger activation      |
| **Silence Timeout** | Time to wait after silence before closing |
| **Auto-Close**      | Automatically close chat after inactivity |

### VAD Use Cases

- **Hands-free computing** — Control Osaurus while cooking, exercising, etc.
- **Accessibility** — Voice-first interaction
- **Quick queries** — Fast questions without touching the keyboard
- **Multi-tasking** — Keep working while asking questions

## Transcription Mode

Transcription Mode lets you dictate text directly into any application on your Mac. Press a global hotkey, speak, and watch your words appear in the currently focused text field—no copy-paste required.

### What is Transcription Mode?

Unlike regular voice input (which types into Osaurus chat), Transcription Mode types into whatever app you're using. Writing an email? Dictate it. Filling out a form? Speak instead of type. Coding? Dictate comments without switching windows.

### Features

- **Global Hotkey** — Trigger transcription from anywhere on your Mac
- **Live Typing** — Text appears in the focused text field in real-time
- **Accessibility Integration** — Uses macOS accessibility APIs to simulate keyboard input
- **Minimal Overlay** — Sleek floating UI shows recording status
- **Press Esc or Done** — Stop transcription when finished

### Setup

#### 1. Grant Accessibility Permission

Transcription Mode requires accessibility access to type into other applications:

1. Open **System Settings** → **Privacy & Security** → **Accessibility**
2. Click the **+** button
3. Find and add **Osaurus**
4. Toggle the switch to enable

:::note Why Accessibility Access?
Transcription Mode simulates keyboard input to type into other apps. macOS requires explicit permission for any app that controls input in other applications.
:::

#### 2. Configure the Global Hotkey

1. Open Management window (**⌘⇧M**) → **Voice**
2. Navigate to the **Transcription** tab
3. Click the hotkey recorder field
4. Press your desired key combination (e.g., **⌥Space**)
5. The hotkey is saved automatically

### Using Transcription Mode

1. **Focus a text field** — Click into any text input (email, document, search bar, code editor)
2. **Press your hotkey** — The transcription overlay appears
3. **Speak** — Your words are typed into the focused field in real-time
4. **Stop** — Press **Esc** or click **Done** to finish

### The Transcription Overlay

When active, a minimal overlay shows:

| Element          | Description                              |
| ---------------- | ---------------------------------------- |
| **Recording indicator** | Visual confirmation that you're being transcribed |
| **Done button**  | Click to stop transcription              |
| **Audio level**  | Real-time visualization of your voice    |

The overlay stays out of your way while giving you clear feedback.

### Tips for Best Results

1. **Speak at a natural pace** — No need to slow down or over-enunciate
2. **Pause for punctuation** — Brief pauses help the model place periods and commas
3. **Use a quiet environment** — Background noise reduces accuracy
4. **External mic recommended** — Better audio quality improves transcription

### Transcription Mode Use Cases

- **Email and messaging** — Dictate messages in any app
- **Document writing** — Draft content in Word, Pages, Google Docs, etc.
- **Code comments** — Speak documentation without switching to Osaurus
- **Form filling** — Voice input for any text field on the web
- **Note-taking** — Quick capture in any notes app
- **Search** — Speak search queries in Spotlight, browsers, or any app

## Troubleshooting

### Microphone Not Working

1. Check microphone permission in **System Settings** → **Privacy & Security** → **Microphone**
2. Verify the correct audio input is selected in Voice settings
3. Test your microphone in another app
4. Restart Osaurus

### Poor Transcription Quality

1. **Upgrade your model** — Try a larger Whisper model
2. **Reduce background noise** — Move to a quieter environment
3. **Speak clearly** — Maintain consistent volume and pace
4. **Check microphone quality** — External mics often work better

### VAD Not Activating

1. Verify VAD is enabled in Voice settings
2. Check the blue pulsing dot is visible on the menu bar icon
3. Speak the wake phrase clearly
4. Adjust sensitivity settings
5. Ensure microphone permissions are granted

### High CPU Usage

Transcription is computationally intensive:

1. **Use a smaller model** — Tiny or Base for lower resource usage
2. **Close unnecessary apps** — Free up system resources
3. **Disable VAD when not needed** — Always-listening uses continuous CPU

### Model Download Failed

1. Check your internet connection
2. Verify disk space (Large V3 needs 3 GB)
3. Try a smaller model first
4. Check `~/.osaurus/voice-models` for partial downloads and delete them

### Transcription Mode Not Working

1. **Check accessibility permission** — Open **System Settings** → **Privacy & Security** → **Accessibility** and verify Osaurus is enabled
2. **Verify the hotkey** — Ensure your global hotkey doesn't conflict with other apps
3. **Focus a text field** — Transcription Mode requires an active text input
4. **Restart Osaurus** — Some permission changes require a restart

### Text Not Appearing in Target App

1. **Ensure the text field is focused** — Click into the field before starting
2. **Check app compatibility** — Some apps with custom text fields may not work
3. **Try a different app** — Test with a standard app like TextEdit to verify functionality
4. **Grant accessibility again** — Remove and re-add Osaurus in accessibility settings

## Privacy

Voice input in Osaurus is completely local:

- **No cloud processing** — All transcription happens on your Mac
- **No data uploaded** — Audio never leaves your device
- **Models stored locally** — Downloaded once, used offline
- **VAD is local** — Wake phrase detection runs on-device

---

<p align="center">
  For agent-specific voice workflows, see the <a href="/agents">Agents</a> guide.
</p>

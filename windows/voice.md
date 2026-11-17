---
title: Voice on Windows
sidebar_label: Voice
description: Talk to your agents in Osaurus for Windows. Call an agent and talk a task through, dictate into any app, wake an agent by saying its name, or have replies read aloud. Speech is recognised on your PC.
---

# Voice on Windows

Osaurus for Windows can listen and speak. You can call an agent and talk a task through, dictate into any app on your PC, wake an agent by saying its name, or have its replies read aloud. Your speech is turned into text on your PC, and replies are spoken by a voice on your PC unless you choose a speech server of your own.

What you need: a microphone, and two downloads from **Settings → Models → Voice**: **Speech to text** (about 500 MB) and **Read aloud** (about 70 MB). Both run on your processor, so no graphics card is needed.

## Get started

1. Open **Settings → Models → Voice**.
2. Under **Speech models**, click **Install** on **Speech to text** ("Turns what you say into text for the composer and voice calls") and on **Read aloud** ("Reads replies aloud in the voice you pick below").
3. Under **Speaking voice**, pick one of the 25 English voices (American and British, female and male) and click **Play sample** to hear it. **Hadley** is the default.

The page's summary line says "Everything is installed." when you're ready. Listening needs only **Speech to text**; a call needs both.

## Call an agent

A call is a conversation out loud: you talk, the agent answers in its voice, and it can still use its tools while you talk.

1. Open a chat with the agent and click the **Call** button in the message box (its tooltip says "Call" and the agent's name).
2. A call window opens with the agent's picture. Just talk. When you pause, the agent answers.
3. Click **Hang up** when you're done. What was said stays in the chat.

During a call:

- **Interrupt** by talking over the agent, or click its picture.
- **Mute microphone**, change the **Speaking speed** (1×, 1.5×, 2×; double-clicking the agent does it too), open the **Transcript**, or **Shrink to a pill** to keep the call small on screen.
- **Approvals** show on the call window: **Allow once** or **Deny**. Some can be answered out loud: the card says "Or say “go ahead” or “no”".
- If the [Privacy Filter](/windows/privacy-filter) would hold back something you said, the call asks **Send as said** or **Keep private**, or you can say "send it" or "keep it private".
- **Open in Osaurus** brings up the chat itself.

**From anywhere.** **Ctrl+Alt+Space** starts a call, and hangs up, from any app. Change or turn it off under **Calls → Call shortcut** and **Keys** (**Use the default** puts it back). The tray icon's menu can start a call too.

**Who answers.** A call from the message box goes to that chat's agent. A call from the shortcut, the tray, or the wake phrase goes to whoever you choose under **The shortcut, the tray and the wake phrase call**: **The agent of the chat you have open** (the default), or one agent. **Create an operator** makes an agent called Operator that "Takes your calls and hands the work to your other agents".

## Dictate into a chat

Click **Dictate** (the microphone beside Send) or press **Ctrl+Shift+Space** in the message box. Talk, then click again or press the keys again to stop; **Esc** cancels. The words go into the message box for you to check before sending.

## Dictate into any app

**Dictate anywhere** types what you say into whatever app has the cursor: an email, a document, a form.

1. Under **Dictate anywhere**, turn on **Dictation shortcut**. The keys are **Ctrl+Alt+D** unless you change them under **Keys**.
2. In any app, press the shortcut and talk. A small card shows "Listening" and the words as they're heard.
3. Press the shortcut again or click **Insert** to type the words in. With **Insert by itself when I pause** on (the default), a pause is enough. **Esc** or **Cancel** stops without typing anything.

The words are typed, not pasted, so your clipboard is left alone. An app running as administrator won't accept typing from Osaurus; then the words go on the clipboard instead and the card says to paste them with Ctrl+V. Dictate anywhere is off during a call, since the call is already listening.

## Wake an agent by name

1. Under **Wake phrase**, turn on **Listen for a wake phrase**.
2. Under **Who answers by name**, tick the agents you want to be able to call by saying their name.
3. Optionally, set **Your own phrase** (for example "Hey Osaurus"). It calls the agent chosen under **Calls**, or the first agent ticked.

Then say the name to start a call: for an agent called Ada, "Ada, what's on my calendar?" or "Hey Ada…". The name has to come first (after "hey", "hi", "hello", "ok", "okay", or "yo"), so mentioning an agent in conversation doesn't start a call.

While this is on, the microphone stays open. What it hears is turned into text on your PC and thrown away unless it starts with one of the names. It's off by default.

## Replies read aloud

Every reply has a **Read aloud** button. To have an agent speak on its own, open its editor and, under **SPEAK**, open **Voice**: **Speak aloud when asked** lets it speak when you ask, and **Read every reply aloud** reads each reply as it arrives.

## Use your own speech server

If you run a speech server that speaks OpenAI's `/v1/audio/speech` API (one on your own PC or network, or a hosted one), Osaurus can use its voice instead:

1. Under **Speaking voice**, choose **A speech server (OpenAI-compatible)**.
2. Enter its **Address** (for example `http://localhost:5050`), and if needed the **Model** (`tts-1` if left empty), **The server's voice** (`alloy` if left empty), and an **API key** ("Only if the server asks for one").
3. Click **Test**, then **Use this server**.

Listening still happens on your PC; only what's read aloud goes to the server. When the server isn't on this PC, the page warns **What's read aloud leaves this PC**, and the call window says which server voices the replies. The Privacy Filter covers what goes to models, not what goes to a speech server. To switch back, choose **This PC, in one of the voices below**.

## Memory

The speech engine holds about 0.8 GB of memory while loaded. **Unload after idle** sets how long it stays loaded with nothing heard or said: 5, **10** (the default), 30, or 60 minutes. It starts again the next time you talk or a reply is read.

## Troubleshooting

| Message or problem | What to do |
|---|---|
| Speech to text won't install (1.0.3 and earlier) | The model's download changed and older versions refused it. Update to Osaurus 1.0.4 or later |
| "Install speech to text and a voice in Settings → Voice to call." | Install both in **Settings → Models → Voice** |
| "Windows is blocking the microphone." | Allow it in Windows **Settings → Privacy & security → Microphone** |
| "That app didn't take typing." | The app runs as administrator. Paste the words with Ctrl+V |
| The shortcut does nothing | Another app has the same keys. The Voice page shows a warning; pick other keys |
| "You're on a call. Hang up to dictate." | Dictate anywhere waits until the call ends |

---

## Under the hood

- Speech runs in its own child process, `osaurus-speech`, listening only on this PC (`127.0.0.1`) with a fresh token per launch; it refuses requests from a browser.
- Speech to text is NVIDIA's Parakeet TDT v3 (int8) through [sherpa-onnx](https://github.com/k2-fsa/sherpa-onnx), with Silero VAD to find speech and Smart Turn v3.2 to tell when you've finished talking. Voices are Gradium's Phonon 31m (English). Everything runs on the processor.
- Each model downloads from a pinned address (sherpa-onnx's GitHub releases, Hugging Face at a fixed commit) and is checked against its SHA-256. They're stored in `%LOCALAPPDATA%\osaurus\models\speech`. 1.0.4 pins the re-exported Parakeet archive that replaced the earlier one upstream.
- Licences: Parakeet CC-BY-4.0, Silero VAD MIT, Smart Turn BSD-2-Clause, Phonon Apache-2.0.
- The call and dictation shortcuts are kept with the app's window settings, not the server's, so a paired phone doesn't see them.
- The local server answers OpenAI-style `/audio/transcriptions` and `/audio/speech` requests from other apps; see [Apps & Devices](/windows/connections).

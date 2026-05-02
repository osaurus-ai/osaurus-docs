---
title: Chat
sidebar_label: Chat
description: The Osaurus chat overlay, multi-window mode, sessions, and keyboard shortcuts in one place.
sidebar_position: 4
---

# Chat

The chat overlay is the daily driver. Press `⌘;` from anywhere on your Mac, ask a question, dismiss it, get back to what you were doing. No browser tab, no context switch.

This page covers the chat overlay, multi-window mode, sessions, and every keyboard shortcut.

## Opening chat

| What you want | How |
|---|---|
| Open the chat overlay | `⌘;` |
| Dismiss the overlay | `⌘;` again, or `Esc`, or click outside |
| Open a new chat window | `⌘ N` |
| Open the Management window | `⌘ ⇧ M` |

The hotkey is configurable: Settings → General → Global Hotkey if `⌘;` collides with another app.

## Anatomy of a chat

| Element | What it does |
|---|---|
| **Input bar** | Type or paste your message. `Enter` to send, `Shift + Enter` for a new line. |
| **Folder picker** | Click to point this chat at a working folder. Gives the agent file/search/git tools scoped to that folder. See [Tasks](/agent-loop). |
| **Sandbox toggle** *(macOS 26+)* | Gives the agent shell access in an isolated Linux VM. |
| **Microphone** | Click for voice input. Long-press the global hotkey for [Transcription Mode](/voice#transcription-mode) into any app. |
| **Model selector** | Switch between local models, Apple Foundation, and any cloud providers you've connected. |
| **Agent selector** | Switch the active agent. Theme, prompt, and memory swap with it. |

## Get things done

When you ask the AI to *do* something — not just explain something — it writes a plan, calls tools to do the actual work, and shows you a verified summary at the end. You watch the to-do list tick off as it goes; it pauses to ask only when a question genuinely changes the outcome.

Two power-ups on the input bar give the agent more capability per chat:

- **Working folder** — point at a folder to get scoped file, search, and git tools
- **Sandbox** *(macOS 26+)* — toggle on for shell access in an isolated Linux VM

Pick one or the other; they're mutually exclusive per chat.

[Tasks →](/agent-loop)

## Sessions

Conversations are saved automatically. There's nothing to "save" — you'll find every chat in the sidebar.

### The sidebar

Click the history icon (or use the sidebar toggle) to see your sessions, ordered by most recent.

Each session shows:

- A short auto-generated title (from the first message)
- A **source badge** — `chat` (you), `plugin`, `http`, `schedule`, or `watcher` — so you can see at a glance what kicked off the conversation
- Estimated token usage

The badge filter rail across the top lets you narrow by source. It hides itself when only one source is present.

### Searching, deleting, clearing

| Action | How |
|---|---|
| Search | Type in the search field at the top of the sidebar |
| Delete a session | Right-click → **Delete** |
| Clear current chat | `⌘ K` |
| Wipe everything | Settings → Storage → **Clear chat history** |

Wiping is irreversible. Use **Settings → Storage → Export plaintext backup** first if you want to keep them. [Storage details →](/storage)

### Resuming a session

Click any session in the sidebar to load it in the current window. Right-click → **Open in New Window** to keep your current chat untouched.

## Multi-window

Press `⌘ N` to open a new chat window. Each window is fully independent:

- Separate conversation
- Separate active agent (with its own theme)
- Separate model selection
- Separate working folder / Sandbox state

Useful patterns:

| Window 1 | Window 2 | Window 3 |
|---|---|---|
| Code Assistant on `~/projects/api` | Research Helper | Creative Writer |
| Sandbox toggle on for build/test | Browsing the web | Drafting a post |

### Pin to top

Click the pin icon in the title bar to keep a window floating above all other apps. Useful for a reference conversation while you code, or watching a long-running agent task.

### Window management

| Shortcut | Action |
|---|---|
| `⌘ N` | New window |
| `⌘ W` | Close current window |
| `⌘ \`` | Cycle between Osaurus windows |
| Drag titlebar | Move |
| Drag corner | Resize |

Closing a window doesn't delete the session — you can reopen it from the sidebar of any window.

## Voice input

Click the microphone in the input bar to dictate your next message. All transcription is on-device via FluidAudio on the Apple Neural Engine — nothing leaves your Mac.

Two related features that are *not* in the chat overlay:

- **VAD (wake-word)** — say a phrase like "Hey Osaurus" or your agent's name to open chat hands-free.
- **Transcription Mode** — global hotkey that types into any focused text field, anywhere on your Mac.

[Full voice guide →](/voice)

## Markdown, code, copy

Responses are rendered with full Markdown:

- Code blocks with syntax highlighting
- Headings, lists, tables
- Inline code, bold, italics
- Clickable links

Hover over any message to reveal a copy button.

If a response is heading the wrong direction, click **Stop** to interrupt streaming, edit your prompt, and try again.

## Settings inside the overlay

Click the gear icon in the chat header for the most-used per-session settings:

| Setting | What it does |
|---|---|
| **System prompt** | Default instructions sent with every message in this session |
| **Temperature** | 0.0 (focused) → 1.0 (creative) |
| **Max tokens** | Cap on the response length |
| **Stream responses** | On by default; flip off if you want to wait for the whole response at once |

Per-agent versions of these live in the agent's settings (Management → Agents). [Agents →](/agents)

## Menu bar icon

The Osaurus menu bar icon stays out of your way. Click it to:

- Start/stop the server
- Open the Management window (`⌘ ⇧ M`)
- See server status
- Toggle VAD listening on/off

A small dot on the icon means VAD is on:

| Dot | What it means |
|---|---|
| Blue, pulsing | VAD is listening for wake words |
| Orange | VAD is processing audio |
| None | VAD is off |

## Complete keyboard shortcut reference

### Global

| Shortcut | Action |
|---|---|
| `⌘;` | Toggle chat overlay |
| `⌘ ⇧ M` | Open Management window |
| *(custom)* | Transcription Mode (set in Voice settings) |
| *(custom)* | VAD wake phrase (set in Voice settings) |

### Chat window

| Shortcut | Action |
|---|---|
| `⌘ N` | New window |
| `⌘ W` | Close current window |
| `⌘ \`` | Cycle between Osaurus windows |
| `Enter` | Send message |
| `Shift + Enter` | New line |
| `Esc` | Dismiss the overlay |
| `⌘ K` | Clear current conversation |

### Management window

| Shortcut | Action |
|---|---|
| `⌘ ,` | Open application Settings |
| `⌘ W` | Close window |

### Text editing

Standard macOS shortcuts (`⌘ A`, `⌘ C`, `⌘ V`, `⌘ X`, `⌘ Z`, `⌘ ⇧ Z`) work in every input field.

### Customizing hotkeys

`⌘;` and the Transcription Mode hotkey are remappable. See **Settings → General** and **Voice → Transcription**.

Supported modifiers: `⌘` Command, `⌥` Option, `⌃` Control, `⇧` Shift. Combine with any letter, number, or function key.

---

**Related:**

- [Tasks](/agent-loop) — what happens when you point a chat at a folder or toggle sandbox
- [Agents](/agents) — specialized assistants per task
- [Voice Input](/voice) — dictation, wake words, global transcription
- [Themes](/themes) — make the overlay yours

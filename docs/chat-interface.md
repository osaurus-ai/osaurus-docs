---
title: Chat Interface
sidebar_label: Chat Interface
description: Access AI from anywhere on your Mac with the Osaurus chat overlay
---

# Chat Interface

Osaurus includes a beautiful glass-styled chat overlay that you can access from anywhere on your Mac. No browser tabs, no context switching—just press a hotkey and start talking to AI.

## Opening Chat

Press **⌘;** (Command + Semicolon) anywhere on your Mac to open the chat overlay. The overlay appears above your current work, so you can ask questions without losing your place.

Press **⌘;** again to close it, or click outside the overlay.

:::tip
You can customize the global hotkey in Settings if ⌘; conflicts with another app.
:::

## Having a Conversation

Once the chat is open:

1. Type your message in the input field at the bottom
2. Press **Enter** to send
3. Watch the response stream in real-time
4. Continue the conversation as long as you like

The AI remembers your conversation history within the session, so you can ask follow-up questions naturally.

## Session History

Osaurus automatically saves your chat sessions, so you never lose a conversation.

### Viewing History

Click the **history icon** in the chat header to view your past conversations. Sessions are organized by date and display a preview of the conversation topic.

### Session Features

- **Persistent storage** — Conversations are saved automatically and persist across app restarts
- **Context tracking** — The AI maintains context within each session for natural follow-up questions
- **Quick resume** — Click any session to continue where you left off
- **Open in new window** — Right-click a session to open it in a separate window

### Managing Sessions

- **Search** — Filter sessions by keyword or date
- **Delete** — Remove individual sessions you no longer need
- **Clear all** — Start fresh by clearing your entire history

## Chat Features

### Markdown Rendering

Responses are rendered with full Markdown support:

- **Code blocks** with syntax highlighting
- **Headers, lists, and tables**
- **Bold, italic, and inline code**
- **Links** (clickable)

### Copying Messages

Hover over any message to reveal the copy button. Click it to copy the message content to your clipboard—useful for grabbing code snippets or saving responses.

### Stop Generation

If a response is taking too long or going in the wrong direction, click the **Stop** button to interrupt generation. You can then refine your question and try again.

### Model Selection

Use the model dropdown at the top of the chat to switch between:

- **Local models** you've downloaded
- **Cloud providers** you've configured (OpenAI, Anthropic, etc.)
- **Apple Foundation Model** on macOS 26+

The selected model persists across sessions.

## Settings

Click the **gear icon** in the chat header to access settings:

| Setting              | Description                                              |
| -------------------- | -------------------------------------------------------- |
| **System Prompt**    | Default instructions sent with every conversation        |
| **Temperature**      | Controls response creativity (0 = focused, 1 = creative) |
| **Max Tokens**       | Maximum length of responses                              |
| **Stream Responses** | Show responses word-by-word (on by default)              |

## Quick Actions

| Action               | Shortcut          |
| -------------------- | ----------------- |
| Open/close chat      | **⌘;**            |
| Send message         | **Enter**         |
| New line in message  | **Shift + Enter** |
| Clear conversation   | **⌘K**            |
| New window           | **⌘N**            |
| View session history | Click history icon |
| Open settings        | Click gear icon   |

## Menu Bar

When Osaurus is running, you'll see its icon in your menu bar. Click it to access the menu bar popover with quick controls:

- **Start/stop the server**
- **Open Model Manager** (⌘⇧M)
- **Access Settings**
- **View status and logs**

### Status Indicators

The menu bar icon shows the current state:

- **Normal icon** — Server is running and ready
- **Blue pulsing dot** — VAD (voice activity detection) is actively listening
- **Toggle button in popover** — Quickly enable/disable VAD mode

## Multiple Windows

Want more than one conversation at a time? Osaurus supports multiple independent chat windows:

- Press **⌘N** to open a new window
- Each window can have its own agent
- Windows are completely independent

[Learn more about multi-window →](/multi-window)

## Work Mode

Switch to Work Mode for autonomous multi-step task execution. Click the **Work Mode** tab at the top of the chat window to enter this mode. In Work Mode, the AI can:

- Break down complex tasks into trackable issues
- Generate step-by-step execution plans
- Perform file operations (read, write, edit, search, organize)
- Use tools to browse the web, search online, and automate your Mac
- Leverage skills for specialized methodologies
- Run tasks in the background while you work on other things

Work Mode is ideal for organizing files, conducting deep research, automating workflows, compiling documents, and for developers—building features, refactoring code, and debugging issues that span multiple files.

[Learn more about Work Mode →](/work-mode)

## Agents

The chat interface works seamlessly with Agents. When you switch agents:

- The system prompt changes to match the agent
- Available tools update based on agent configuration
- The visual theme changes (if the agent has a custom theme)

[Learn more about agents →](/agents)

## Voice Input

Click the microphone icon in the input area to use voice input. Speak naturally and your words appear as text. All transcription happens locally on your Mac.

[Learn more about voice input →](/voice)

## Tips

- **Be specific** — Detailed questions get better answers
- **Use agents** — Create specialized assistants for different tasks
- **Try different models** — Smaller models are faster; larger models are smarter
- **Enable streaming** — See responses as they're generated for a more interactive feel

---

<p align="center">
  Ready to customize your experience? Learn about <a href="/agents">Agents</a>.
</p>

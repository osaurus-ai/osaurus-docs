---
title: Multi-Window Chat
sidebar_label: Multi-Window
description: Work with multiple independent chat windows, each with its own agent and session
---

# Multi-Window Chat

Real work isn't linear. You might be debugging code in one conversation while researching an API in another and drafting documentation in a third. Osaurus supports multiple independent chat windows—each with its own agent, theme, and history—so you can work the way you think.

## Features

- **Independent Windows** — Each window maintains its own agent, theme, and session
- **Agent per Window** — Different agents in different windows simultaneously
- **Session Management** — Open any session in a new window
- **Pin to Top** — Keep specific windows floating above others
- **Cascading Windows** — New windows are offset for visibility

## Opening New Windows

### From the Menu

1. Click **File** in the menu bar
2. Select **New Window** (or press **⌘N**)
3. A new chat window opens with the default agent

### From Keyboard

Press **⌘N** to open a new chat window instantly.

### From Session History

1. Open the session history sidebar
2. Right-click on any saved session
3. Select **Open in New Window**
4. The session opens in a new window with its original agent

## Working with Multiple Windows

### Independent Conversations

Each window is completely independent:

- Separate conversation history
- Separate active agent
- Separate theme (if agent has a custom theme)
- Separate model selection

Changes in one window don't affect others.

### Switching Agents per Window

Each window can have a different active agent:

1. Click the agent selector in the window
2. Choose an agent
3. That window now uses the selected agent
4. Other windows remain unchanged

**Example workflow:**

| Window 1               | Window 2             | Window 3        |
| ---------------------- | -------------------- | --------------- |
| Code Assistant         | Research Helper      | Creative Writer |
| Dark blue theme        | Light theme          | Warm theme      |
| Git & filesystem tools | Search & fetch tools | No tools        |

### Cascading Windows

When you open multiple windows, they automatically cascade:

- Each new window is offset slightly from the previous
- All windows remain visible and accessible
- Drag windows to arrange them as needed

## Pin to Top

Keep important chat windows floating above all other applications.

### Enabling Pin to Top

1. Click the pin icon in the window title bar
2. The window now stays on top of all other windows
3. Click again to disable

### Use Cases

- Keep a reference conversation visible while coding
- Monitor an ongoing task in one window
- Quick access to a specific assistant

## Use Cases

### Side-by-Side Comparison

Compare responses from different agents:

1. Open two windows (**⌘N**)
2. Set different agents in each
3. Ask the same question in both
4. Compare the responses side-by-side

### Project-Based Organization

Dedicate windows to specific projects:

| Window        | Agent           | Purpose                       |
| ------------- | --------------- | ----------------------------- |
| Backend Dev   | Code Assistant  | API and database work         |
| Frontend Dev  | Code Assistant  | UI and styling                |
| Documentation | Creative Writer | Writing docs and READMEs      |
| Research      | Research Helper | Looking up libraries and APIs |

### Reference Conversations

Keep useful conversations open while starting new ones:

1. Find a helpful past conversation
2. Right-click → **Open in New Window**
3. Pin it to top for reference
4. Start a new conversation in another window

### Multi-Tasking

Run multiple AI tasks simultaneously:

- Window 1: Generating code
- Window 2: Researching documentation
- Window 3: Writing commit messages

Each window processes independently.

## Window Management Tips

### Arranging Windows

- **Drag title bar** — Move windows anywhere on screen
- **Resize corners** — Adjust window size
- **Mission Control** — Use macOS Mission Control (F3) to see all windows
- **Stage Manager** — Works with macOS Stage Manager

### Quick Switching

- **⌘`** — Cycle between Osaurus windows
- **Mission Control** — Click any visible window
- **Dock** — Click Osaurus icon to show all windows

### Closing Windows

- **⌘W** — Close the current window
- Click the close button (red circle) in the title bar
- Closing a window doesn't delete the conversation — it's saved in history

## Sessions and Windows

### How Sessions Work

- Each window can display one session at a time
- Sessions are saved automatically
- The same session can be opened in multiple windows (changes sync)
- Creating a new chat starts a new session

### Opening Sessions

1. Click the sidebar toggle to show session history
2. Click any session to open it in the current window
3. Right-click → **Open in New Window** to keep your current window unchanged

### Session Continuity

When you close a window:

- The session is preserved in history
- Reopen it anytime from any window
- The agent and context are remembered

## Keyboard Shortcuts

| Shortcut | Action                                      |
| -------- | ------------------------------------------- |
| **⌘N**   | Open new window                             |
| **⌘W**   | Close current window                        |
| **⌘`**   | Cycle between Osaurus windows               |
| **⌘;**   | Toggle chat overlay (separate from windows) |

## Combining with Other Features

### Multi-Window + Agents

The real power comes from combining multi-window with [Agents](/agents):

- Create specialized agents for different tasks
- Open each agent in its own window
- Visual themes help you identify which assistant you're talking to

### Multi-Window + Voice Input

With [Voice Input](/voice) enabled:

- Voice input goes to the focused window
- VAD activation opens the main chat overlay (not a window)
- Use windows for persistent, organized conversations

---

<p align="center">
  For creating custom agents, see the <a href="/agents">Agents</a> guide.
</p>

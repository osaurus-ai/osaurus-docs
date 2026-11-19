---
title: Chatting in Osaurus for Windows
sidebar_label: Chat
description: The Osaurus for Windows main window. Your agents and their chats in the sidebar, search, starting a chat, attachments, approvals, the panel beside a chat, and the General settings.
---

# Chatting in Osaurus

Everything in Osaurus happens in one window: your [agents](/glossary#agent) down the left, each with its recent chats under it, and the chat you're in on the right. Beside a chat, a panel shows what it's working with and what it has made. You need at least one [model](/glossary#model) set up, which [Quick Start](/windows/quickstart) does for you.

## Get started

1. Click an agent in the sidebar. **Osaurus**, the built-in [Orchestrator](/glossary#orchestrator), is a good first choice: it answers, or hands the work to the right helper.
2. Press **Ctrl+N** (or hover the agent and click its **New chat** button) for a new chat.
3. Type your message and press **Enter**. **Shift+Enter** starts a new line.

A new chat shows a greeting and the message box, with the chat's setup under it. The two you'll use most:

- **Workspace**: the [working folder](/glossary#working-folder) the agent may work in. **Workspace: None** means it answers without your files; click it to choose a folder.
- **Model**: the model that answers. Click it to pick another.

When you send your first message, these move into the panel beside the chat, where you can still change them.

## The sidebar

From the top:

- **Search** (Ctrl+K) finds any chat. See [Find a chat](#find-a-chat).
- **Chat**, **Projects** and **Workflows** switch what the sidebar lists. **Chat** lists your agents. **Projects** lists your [projects](/windows/projects) and their chats. **Workflows** opens your [workflows](/windows/workflows) and their open runs.
- **AGENTS**, with a **+** to create a new agent. Under each agent are its recent chats.
- At the bottom: a download chip while a model is downloading (click it to open **Models**), and **Settings**.

Press **Ctrl+B** to shrink the sidebar to a narrow strip of avatars, and again to bring it back.

### An agent's chats

Each agent shows up to three of its chats that are pinned or used in the last week. **Show N more** lists its ten newest; **All N chats with …** opens them all in Search. Click the arrow beside an agent to fold its chats away.

A chat's row tells you its state at a glance:

| You see | It means |
|---|---|
| A spinner | The agent is working on it |
| **Needs you** | It's waiting for your answer, usually an approval |
| A dot, and the title in bold | A reply you haven't read |
| A pin | You pinned it |
| A time | When it was last used |

A chat that's working or needs you always shows, however old it is. The agent's own row says **Needs you** too, so you can spot it with the agent's chats folded.

### Chat menu

Right-click a chat (or press Shift+F10) for:

- **Pin** / **Unpin** and **Rename**.
- **View insights**: what this chat cost and did, including any helpers it used, in **Settings → Insights**. See [Data and privacy](/windows/data-and-privacy).
- **Move to project** / **Remove from project**.
- **Archive** / **Unarchive**: find archived chats with **Archived** in Search.
- **Export**: **Markdown (.md)** or **Bundle (.zip)**.
- **Delete**.

### Agent menu

Right-click an agent (or click its **More** button) for **New conversation**, **Conversations…** (Search, showing only that agent's chats), **Workflows** (Ctrl+Shift+W), **Browser** (Ctrl+Shift+B), **Edit**, **Duplicate**, **Share…**, **Delete**, and **Manage agents…**. See [Agents](/windows/agents).

## Find a chat

Press **Ctrl+K** (Ctrl+H and Ctrl+E work too), or click **Search** in the sidebar.

1. Type in **Search chats and messages**. It matches chat titles and the words inside them, and shows a preview.
2. Narrow it down with the project filter, **All agents** or just the current agent, and **Archived** for archived chats only.
3. Click **Open chat**.

The **Runs** tab next to **Chats** searches your [workflow](/windows/workflows) runs instead.

To flip between the chats you used last, hold Ctrl and press Tab (Shift+Tab goes back), then let go on the one you want.

## Pick a model

Click the **Model** row (under the message box in a new chat, or in the panel beside the chat), or type **/model**.

- Type to search every model across your [providers](/glossary#provider).
- The sort and filter button sorts by name, context size or price, and filters by **Context window**, **Images** (models that accept pictures), or **On-device models only**.
- **Manage** opens **Settings → Models**, where you add providers and download [local models](/windows/models).

Some agents always use one model. Their **Model** row is locked, and you change the model in the agent's settings.

## Attachments and folders

Click **+** beside the message box:

- **Attach files…**: add files or pictures to your message. You can also drag them onto the message box, or paste them. Pasting a long piece of text (400 characters or more) adds it as an attachment instead of filling the box; Ctrl+Shift+V pastes it as plain text.
- **Attach workspace folder…**: give the agent a working folder. It can read the files in it and, with your OK, change them or run commands there. **Change workspace folder…** and **Detach workspace folder** appear once one is attached.
- **Command or skill…**: the same as typing **/** (see [Slash commands](#slash-commands)).
- **Workflows**: run one of this agent's [workflows](/windows/workflows), when it has any.

Osaurus keeps a copy of every file an agent changes, so you can undo it. In the panel beside the chat, the **files changed** row opens **Changes**, where you can review each change, **Revert** a file, or choose **Undo everything in this chat…**. If Osaurus can't keep a copy of something, the approval card says so before it runs.

## Approvals

By default, agents use their tools without asking (**Tool approvals** under [Behavior](#behavior) is **Run tools without asking**), but some actions ask either way: a change Osaurus can't keep a copy of to undo, a file outside the chat's folder, and anything that changes your settings. Choose **Ask before each tool** to approve every step, for all agents or for one agent on its **Permissions** tab. When an agent asks, the card in the chat says in plain words what the tool will do, shows the whole command, and offers only the choices that apply:

- **Allow once** (Enter): let this one action through.
- **Deny** (Esc): refuse it. To tell the agent what to do instead, type in **Or deny with a note** first; the button becomes **Deny with note**.
- **Don't ask again ▾**:
  - **For the rest of this run** or **For the rest of this chat**: stop asking about this tool for now.
  - **Always allow…**: remember your answer for good. Depending on the tool, choose **This file**, **This folder**, **This exact command**, **This exact URL** or query, or the tool as a whole. You can take it back in **Settings → General → Behavior**, under **Remembered approvals**.

While a card waits, the chat's row in the sidebar says **Needs you**, and so does the status pill the message box shrinks to while an agent works. Click the pill to jump to the card. Windows notifies you too, unless you turn off **Approval requests** in **Settings → General → Notifications**.

## While an agent works

- Press **Esc** to stop the reply.
- Type and press **Enter** to queue your next message: it's held under **Queued — sends when this reply finishes**. Press **Ctrl+Enter** (or the queued message's **Send now**) to interrupt and send it at once.

### Continue a reply that stopped

If you stop a reply, or Osaurus closes while an agent is working (a crash, a restart), the reply is kept up to where it stopped. A line under it says why: **Stopped before the reply finished.** or **Cut off when Osaurus closed.** Click **Continue** on that line to carry it on from where it stopped, without sending a new message. **Continue** shows on the chat's last reply while nothing else is running.

### Your messages and replies

A reply has buttons to **Copy** it, **Regenerate** it, and **Read aloud**. Your own messages have **Edit & resend** and **Copy**.

## The panel beside a chat

Once a chat starts, a panel headed **THIS CHAT** sits to the right of it. Its rows appear only when they have something to say. The most useful ones:

| Row | What it shows |
|---|---|
| What needs you | Approvals, questions from the agent, a message held for the [Privacy Filter](/glossary#privacy-filter), a sign-in or credits that ran out. Always first. Click to go to the card. |
| Project | The [project](/windows/projects) the chat is in, and where its data may go |
| **Workspace** | The folder the chat works in (with its Git branch and changes, if it has them), **Sandbox**, or **None**. Click to change it. |
| Model | The model answering. Click to switch. |
| Cost | **N credits** on [Osaurus Cloud](/glossary#osaurus-cloud), with what the last reply cost and about how many more you can afford; **$… this chat** on a provider you pay by API key; or **…% of your plan used** on a subscription |
| Plan | The agent's task list, as it works through it |
| **Files changed** | How many files it changed, with lines added and removed. Click to open **Changes**. |
| Helpers | Helpers the agent handed work to, and whether they're working, done or waiting for you |
| What it made | Files, pictures and video it made. Click to open or jump to them. |
| Sources | Web pages and files it cited |
| Learned | Facts [memory](/windows/memory) took from this chat |
| **Kept private** | How many values the [Privacy Filter](/glossary#privacy-filter) swapped out, and which company the chat goes to |
| Context | How full the model's [context window](/glossary#context-window) is |

Other rows appear for a voice call, a scheduled run the agent booked, a workflow it started, background jobs, and the agent's browser.

- **Whole chat** at the top switches the rows to **This turn** (just the newest exchange) and back. The same menu copies the panel as text.
- Hover a row to see where its cards sit on the scroll bar; click it to jump there, and click again for the one before.
- **F6** moves between the message box and the panel.
- In a narrow window the panel becomes a column of icons.

## Slash commands

Type **/** at the start of the message box to see commands. Use the arrow keys to choose, and Enter or Tab to pick one.

- **/clear**: start a new conversation.
- **/model**: switch the model.
- **/folder**: attach a workspace folder.
- **/help**: list the commands.

The menu also lists your own commands, your enabled [skills](/windows/skills-and-mcp), and the agent's [workflows](/windows/workflows), each by name.

## General settings

**Settings → General** holds the settings for the window itself.

### Appearance

- **Theme**: **System** (the default), **Light** or **Dark**.
- **Chat density**: **Compact**, **Comfortable** (the default) or **Spacious**.
- **Text size**: from 0.85× to 1.30×.
- **Reading width**: **Full width** (the default), **Narrow (720)**, **Medium (900)** or **Wide (1100)**.
- **Window backdrop**: **None**, **Mica**, **Mica Alt**, **Acrylic (Base)** or **Acrylic (Thin)**. **Keep lit when inactive** stops the window dimming when you switch away, and **Customize tint & opacity** lets you set the colors yourself.

### Behavior

- **Start at login**: open Osaurus in the system tray when you sign in to Windows. Off by default.
- **Tool approvals**: **Ask before each tool** or **Run tools without asking**. It applies to every agent set to follow your approval setting; an agent's own choice under its permissions wins.
- **Ask about a folder's codebase in new chats**: when you attach a folder inside a larger code project, a new chat offers to share what Osaurus found above the folder (such as the project's instructions). Its **Don't ask again** turns this off.
- **Tool rounds per reply**: how many rounds of tool use an agent may take in one reply, from 1 to 120 (30 by default).
- **Setup**: **Run setup again** reruns first-run setup. You see every change before it's applied.
- **Remembered approvals**: everything you chose **Always allow…** for. Remove one, or **Forget all**.

### Notifications

Windows notifications for **Background run outcomes**, **Approval requests** and **Budget alerts**, all on by default. **Quiet hours** (off by default) holds them between **From** and **To**, 22:00 to 07:00 unless you change it.

### Commands

Your own slash commands: a short name that drops a prompt you use often into the message box.

1. Open **Settings → General → Commands** and click **Create** (or **Create command**).
2. Fill in **Name** (what you type after the **/**), an optional **Description**, an **Icon**, and the **Template**: the text put in the message box when you pick it. You go on typing after it.
3. Click **Save**.

A command can't use the name of a built-in one such as **/model**.

## About and What's New

After Osaurus updates, a **New in …** line appears under the message box of a new chat. Click it to read what changed.

**About**, at the foot of the Settings list, has:

- Your version, and **Check for updates**, which opens the Microsoft Store's downloads and updates page.
- How much Osaurus has done for you on this PC, which opens [Insights](/windows/data-and-privacy).
- **Documentation**, **Community**, and **Report a problem**, which starts a forum post with your version details filled in.
- Every release's notes, newest first. Unread releases are marked; **Mark as read** clears them.
- **Licenses**, **Privacy**, **Terms**, and **Copy system info**.

## Keyboard shortcuts

| Shortcut | Action |
|---|---|
| Ctrl+N or Ctrl+T | New chat with the current agent |
| Ctrl+Shift+N | New window |
| Ctrl+K, Ctrl+H or Ctrl+E | Search chats |
| Ctrl+Tab / Ctrl+Shift+Tab | Switch between recent chats |
| Ctrl+Alt+Up / Ctrl+Alt+Down | Previous / next agent |
| Ctrl+B | Narrow or widen the sidebar |
| Ctrl+Shift+B | This agent's browser |
| Ctrl+Shift+W | Workflows |
| Enter / Shift+Enter | Send / new line |
| Esc | Stop the reply |
| Ctrl+Enter | Send now, interrupting the reply |
| Ctrl+Shift+V | Paste as plain text |
| Ctrl+Shift+Space | Dictate (see [Voice](/windows/voice)) |
| F6 | Move between the message box and the panel |

Voice calls with an agent and dictation are covered in [Voice](/windows/voice).

---

## Under the hood

- While a reply streams, Osaurus saves it to the chat's history on this PC every couple of seconds and soon after each tool call, so a crash or a closed window loses at most a moment of it. On the next launch the saved part becomes the chat's last reply, marked as interrupted, and **Continue** resumes it in place.
- Under each agent, the sidebar lists up to 3 chats that are pinned or updated in the last 7 days, or the 10 newest with **Show more**. A chat that's open, working or waiting is listed on top of those limits.
- Window settings (theme, density, text size, reading width, notifications, quiet hours) are kept in `app-ui.json` in `%LOCALAPPDATA%\osaurus`.
- The four built-in commands always win: a custom command can't reuse their names, and a skill or workflow can't take a custom command's name.

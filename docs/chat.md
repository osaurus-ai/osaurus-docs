---
title: Chat
sidebar_label: Chat
description: How to use the Osaurus chat window — opening it from anywhere, tabs and windows, choosing a model, reviewing file changes, history, and keyboard shortcuts.
---

# Chat

The chat window is where you talk to your AI. Press `⌘;` from anywhere on your Mac, ask a question, then press `⌘;` again to hide it and get back to what you were doing. You don't need a browser or a separate app.

## Get started

1. Press **`⌘;`**. The chat window appears.
2. Type your message in the box at the bottom.
3. Press **Return** to send. The reply appears as it's written.
4. Press **`⌘;`** again (or **Esc**, or click outside the window) to hide it.

Every new chat starts with the [Orchestrator](/glossary#orchestrator), the [agent](/glossary#agent) built into Osaurus, unless you've chosen a different agent for new chats. To change it, ask the Orchestrator something like *"start my new chats with Coder"*. Switching agents inside one chat doesn't change it.

| What you want | How |
|---|---|
| Open or hide the chat window | `⌘;` |
| Hide the window | `⌘;` again, `Esc`, or click outside |
| Start a new chat | `⌘ N` — a new tab in the current window, staying in the current [project](/glossary#project) |
| Open a new chat window | `⇧ ⌘ N` |
| Open Settings | **Settings…** (`⌘ ,`) |

If `⌘;` clashes with another app, change it in **Settings… → General → Global Hotkey**.

## The chat window

The window has tabs across the top and a panel on each side. Show or hide each panel with the buttons at either end of the toolbar, and drag a panel's inner edge to resize it.

- **Tabs.** Like browser tabs, one conversation each. Your open tabs come back after you close the window or restart the app, and each remembers where you'd scrolled to. Right-click a tab to **Stop**, **Open in New Window**, **Rename**, **Pin**, **Move to Project**, **Export**, **Archive**, **Delete**, or **Close Tab**.
- **Sidebar (left).** Choose what to open. The buttons at the top switch between **Agents** (one row per agent — click to chat, or click the row's **+** for a fresh chat) and **Projects**. The search field narrows the list; for agents, it also finds agents your [workspace](/glossary#workspace) teammates share and agents found on your network. **Settings** is at the bottom.
- **Inspector (right).** Details about what's on screen. For a chat, switch between **File Changes** (what this chat changed in your files — see [Reviewing file changes](#reviewing-file-changes)) and **History** (past chats with this tab's agent). For a project, it shows Project Settings.
- **Minimap.** Long chats show a thin strip with one mark per message you sent. Hover over it to see previews, and click one to jump there.

## The message box

| Part | What it does |
|---|---|
| **Message box** | Type or paste your message. `Return` sends; `Shift + Return` adds a new line. What you've typed stays there if you switch tabs or agents. |
| **Folder** | Choose the chat's [Working Folder](/glossary#working-folder), the one folder the agent may work in. See [Working Folder](#working-folder). The **+** menu also lists folders you've used recently. |
| **Attach** | Add documents (including plain-text files), plus images, audio, or video when the chosen model can understand them. |
| **Microphone** | Click to speak your message instead of typing. |
| **Model** | Choose the AI [model](/glossary#model) for this chat. See [Choosing a model](#choosing-a-model). |
| **Context Budget** | Shows how full the chat's [context window](/glossary#context-window) is (how much the model can keep in mind at once). Click it for the **Compact conversation** button. |

## Choosing a model

Click the model button in the message box. You'll see a **Provider** column and a **Model** column. Models on your Mac come first, then [Osaurus Cloud](/glossary#osaurus-cloud), then any AI companies you've connected. A source you haven't set up shows **Explore**: for local models it opens model downloads in Settings, and for Osaurus Cloud it opens the Cloud model browser.

- **Favorites.** The Cloud list shows your favorites plus the Cloud model you're using now. New installs start with a few favorites picked for you. Click the star to add or remove one. **More models** opens the full list.
- **Cloud browser.** Search by model or company, and filter by **Category** or **Context** (how much the model can take in). Models with published prices show their starting price in [credits](/glossary#credits). Choosing a model closes the browser; starring one keeps it open. **Manage Credits** opens your account.
- **Model options.** Some models add a **Model options** column with choices like **Thinking** (Default, On, Off), how hard to reason, and other switches. Each shows your choice or the model's default, with **Reset to default** if you've changed it.
- **Loading.** Choosing a model on your Mac doesn't load it right away. It loads when you send your first message. The button is gray until the model is loaded, then turns green.
- **Switching mid-chat.** If you move a chat off a model on your Mac, Osaurus mentions that the next reply has to re-read the whole conversation, so it may take a moment. Switching between cloud models shows no warning.

To check your Osaurus Cloud balance, hover over the **Credits** button in the toolbar (or click it to keep it open). **Add credits** tops up your balance; **View all** opens **Settings… → Credits**.

## Get things done

When you ask the AI to *do* something — not just explain it — it makes a plan, uses [tools](/glossary#tool) (actions like reading a file or searching the web) to do the work, and finishes with a summary of what it did. You can watch a to-do list tick off as it goes. It only stops to ask you something when the answer really changes the result.

While it works, its thinking and actions are grouped into a single **Worked for …** row. Click it to see each step.

[Tasks →](/agent-loop)

## Working Folder {/* #working-folder */}

A [Working Folder](/glossary#working-folder) is one folder on your Mac that you let the agent read and edit. Click **Folder** in the message box to choose one.

**On an agent you created,** the agent can then read, create, edit, search, and undo changes to files in that folder. It can also run commands there, and use version-history tools if the folder is a code repository. The folder stays with the chat, and the agent remembers it: new chats with that agent, and its [schedules](/schedules) and [watchers](/watchers), start in the same folder. If a chat has no folder and the agent needs one, it can open the folder picker itself and tell you why. If you cancel, the chat continues without a folder.

A chat uses either a Working Folder or the [Sandbox](/glossary#sandbox) (a sealed-off area for running code), never both. Picking a folder turns that agent's Sandbox off. You can turn it back on later in the agent's **Abilities** settings.

**On the Orchestrator,** the folder is one it can **read** but never change. Agents it hands work to that don't have a folder of their own work inside it and can make changes, so *"have Coder write the report into this folder"* just works. See [Orchestrator](/orchestrator#working-folder).

The agent can read text and code, pull the content out of PDF, Word, PowerPoint, and Excel files, and look at images (if the model can see images) or read the text in them. It can also create Word, Excel, PDF, and PowerPoint files, and edit existing ones while keeping their formatting.

## Reviewing file changes

Osaurus saves a copy of each file before and after the agent changes it, so nothing the agent does to your files is final.

- Open **File Changes** in the inspector. When the inspector is closed, its toolbar button shows a number: how many files this chat has changed and not undone.
- Under a reply that changed files, click **N files changed · View changes** to jump to those changes. Each file-edit card in the chat also has its own **Revert** and **View change** buttons.
- **Timeline** lists every change in order, showing before and after. **Files** shows the end result for each file.
- **Revert** undoes one change. **Revert File** puts one file back the way it was before the chat. **Roll Back to Before This** undoes a change and everything after it. **Revert All** puts back every file the chat touched.
- If you edited a file yourself after the agent did, it's marked **Edited since** and left alone unless you choose **Overwrite Edited Files**. You can undo any revert, too.

To choose how long these copies are kept, go to **Settings… → General → Advanced → Data & Storage → File History**. **Keep File History** can be until the chat is deleted (the default), 90 days, or 30 days. **File History Size Limit** caps how much space they use. Deleting a chat always deletes its saved copies.

## History

Chats save automatically. There's no "Save" button.

Open **History** in the inspector to see past chats with the current tab's agent, newest first. Switch to a tab with a different agent and History switches too. At the top are **New Chat** and **Import Conversations**. Click a past chat to open it in the current tab, or use the row's buttons to open it in a new tab or window.

Each row shows:

- **A short title.** Osaurus writes one once the chat has some substance, like "Fix the CI flake in auth tests" instead of your first few words. To turn this off, use **Automatically Name Chats** in **Settings… → Conversation**.
- **Where it came from:** Chat, Plugin, API, Channel, Schedule, Watcher, Self-scheduled, or Imported.
- **A file count** if the chat still has file changes; click it to open File Changes.

**Filter** narrows the list by where chats came from, project, workspace, plugin, ability, or archived chats.

### Active conversations

Chats that are still working float to the top. A row says **Running…** while the agent is working or waiting its turn, and **Needs your input** when it's waiting for an answer or a password from you. Click the row's **Stop** button (or right-click → **Stop**) to halt it without opening it.

### Pinning, searching, deleting

| Action | How |
|---|---|
| Keep a chat at the top | Right-click → **Pin** |
| Search | Type in the History search field |
| Select several chats | `⌘`-click each one, then archive or delete them together |
| Delete a chat | Right-click → **Delete** |
| Delete one AI reply | Use the reply's menu; you can delete your matching message too |
| Clear the current chat | Type `/clear` in the message box |
| Delete everything for one agent | Open that agent's settings and choose **Delete All Data** |
| Wipe everything | Delete chats from History, or use **Settings… → General → Factory Reset…** (removes all app data) |

Deleting can't be undone. To keep a copy first, use **Settings… → General → Advanced → Data & Storage → Export plaintext backup…**. [Storage details →](/storage)

To group related chats so they share instructions, documents, memory, and a folder, use [Projects](/projects). Right-click any chat and choose **Move to Project**.

### Importing conversations

Bring in chats from other AI apps with **Import Conversations** in History. You can import exports from:

- ChatGPT
- Claude
- Grok
- Gemini (Google Takeout)
- Open WebUI
- Other apps that export in a common format (see [Under the hood](#import-formats))

Choose one or more exported `.json` or `.zip` files. Imported chats keep their original dates, get an **Imported** label, and are briefly highlighted so you can find them. Chats you've already imported are skipped. Progress shows as it goes. If one file can't be read, the others still import, and a message at the end lists anything that was skipped.

### When you go offline

If your internet drops, cloud models disappear from the model list, and a chat that was using one switches to a model on your Mac. Your agent's cloud model choice isn't lost; it comes back when you're online again.

## Multiple windows

Press `⇧ ⌘ N` to open a new chat window, or choose **File → New Window with Agent** to pick which agent it starts with. Each window has its own tabs, and each tab has its own agent, model, and folder or Sandbox setting.

For example, you could keep three windows open side by side:

| Window 1 | Window 2 | Window 3 |
|---|---|---|
| Code Assistant working in your project folder | Research Helper browsing the web | Creative Writer drafting a post |

### Keep a window on top

Click the pin icon in the toolbar to keep a window floating above all other apps. It's handy for a reference chat while you work, or for watching a long task.

Closing a window doesn't delete its chats. Reopen them from History in any window.

## Voice input

Click the microphone in the message box to speak your next message. Your speech is turned into text on your Mac and never leaves it.

Two related voice features work outside the chat window:

- **Wake Word.** Say a phrase like "Hey Osaurus", or your agent's name, to open a chat hands-free.
- **Transcription Mode.** Press a shortcut key to dictate into any text field in any app.

[Full voice guide →](/voice)

## Replies: formatting, copying, and follow-ups

Replies are nicely formatted, with headings, lists, tables, **bold** and *italic* text, and code with color highlighting. Links are clickable, including links to your [Knowledge](/glossary#knowledge) documents, which open the file. Right-click those for **Open With**, **Show in Finder**, or **Copy Path**.

- **Copy.** Hover over any message to see a copy button.
- **Stop.** If a reply is going the wrong way, click **Stop**, edit your message, and try again.
- **Images.** Click a generated picture to see it full screen.
- **Follow-up suggestions.** Suggested next questions appear under the latest reply. Click one to send it. To turn them off, use **Suggest Follow-Up Questions** in **Settings… → Conversation**. You can also choose a different model for suggestions for each agent.

### See how a reply was made

Open a reply's **⋯** menu to see when it arrived, and choose **Inspect response** for details like how long it took and how fast it was written. See [Under the hood](#response-details) for the full list.

## When a chat gets long {/* #context-compaction */}

Every model can only keep so much of a chat in mind at once (its [context window](/glossary#context-window)). When a chat gets long, Osaurus can summarize the older parts so you can keep going. This is called compacting.

- **Compact by hand.** Click the Context Budget meter in the message box, then **Compact conversation**. It tells you which model will write the summary.
- **Automatic.** When the chat is about 85% full, Osaurus compacts before sending your next message. If that fails, your message stays in the box and you can choose **Retry** or **Send without compacting**.
- **What you see doesn't change.** Your chat still shows every message. A marker labeled **Older messages summarized** shows where the summary starts; click it to read exactly what the model now sees.
- **Your latest messages are kept word for word.** Only older parts are summarized.

To choose which model writes summaries, go to **Settings… → Conversation → Advanced → Compaction Model**. If you leave it unset, the chat's own model does it. If the summary model is a [cloud model](/glossary#cloud-model), your [Privacy Filter](/privacy-filter) settings apply before anything leaves your Mac.

## Chat settings

**Settings… → Conversation** holds chat behavior:

- **Appearance:** Smooth Streaming, Group Thinking & Tool Activity, Check Spelling While Typing
- **Behavior:** Automatically Name Chats, Suggest Follow-Up Questions, Clipboard Monitoring, and **⌘+N Starts a New Chat in the Current Window**
- **Agent Sessions:** Keep Mac Awake While Agents Run
- **Advanced:** the Compaction Model, plus a shortcut to **Context Window Cap**

Each agent's own instructions, model, and other settings live in **Settings… → Agents**. [Agents →](/agents)

## Menu bar icon

Osaurus has an icon in your Mac's menu bar. Click it to:

- See whether Osaurus is running (with **Retry** if it couldn't start)
- **Ask AI** — open the chat window
- Turn Wake Word listening on or off
- Open **Settings**, the documentation, or quit

Small dots on the icon show what's happening:

| Dot | What it means |
|---|---|
| Green, blinking | A model is writing a reply |
| Blue, pulsing | Wake Word is listening |
| Red | Wake Word hit a problem |

## Keyboard shortcuts {/* #complete-keyboard-shortcut-reference */}

### Anywhere on your Mac

| Shortcut | Action |
|---|---|
| `⌘;` | Open or hide the chat window (changeable) |
| *(your choice)* | Transcription Mode (set in Voice settings) |
| *(your choice)* | Wake Word phrase (set in Voice settings) |

### App menus

| Shortcut | Action |
|---|---|
| `⌘ N` | New Chat in the current window (when the Conversation setting is on, which is the default) |
| `⇧ ⌘ N` | New Window (`⌘ N` when that setting is off) |
| `⌘ ,` | Settings… |
| `⌘ B` | Show or hide the sidebar |
| `⇧ ⌘ .` | Next Agent |
| `⇧ ⌘ V` | Turn Wake Word on or off |
| `⌘ =` / `⌘ -` / `⌘ 0` | Zoom In / Zoom Out / Actual Size |
| `⌘ ?` | Osaurus Help |

### In the chat window

| Shortcut | Action |
|---|---|
| `⌘ N` / `⌘ T` | New tab (`⌘ N` stays in the current project) |
| `⇧ ⌘ T` | Reopen the last closed tab |
| `⌃ Tab` / `⌃ ⇧ Tab` | Next / previous tab |
| `⇧ ⌘ ]` / `⇧ ⌘ [` | Next / previous tab |
| `⌘ W` | Close |
| `Return` | Send message |
| `Shift + Return` | New line |
| `Esc` | Hide the chat window |
| `/clear` | Clear the current chat (type it in the message box) |
| `/title` | Write a title for the current chat |

The usual Mac text shortcuts (`⌘ A`, `⌘ C`, `⌘ V`, `⌘ X`, `⌘ Z`, `⌘ ⇧ Z`) work in every text box.

### Change shortcuts

You can change `⌘;` and the Transcription Mode shortcut in **Settings… → General → Global Hotkey** and **Settings… → Voice → Transcription**. Combine `⌘` Command, `⌥` Option, `⌃` Control, or `⇧` Shift with any letter, number, or function key.

## Troubleshooting

- **`⌘;` does nothing or opens something else.** Another app may use the same shortcut. Pick a different one in **Settings… → General → Global Hotkey**.
- **The first reply is slow.** A model on your Mac loads when you send your first message. Later replies are faster.
- **A cloud model vanished from the list.** You're probably offline. See [When you go offline](#when-you-go-offline).
- **The agent can't see my files.** Give the chat a [Working Folder](#working-folder).

---

## Under the hood

### New-chat agent

The agent for new chats is the declarative `new_chat_agent` field in [declarative configuration](/configuration#declarative-configuration). Asking the Orchestrator to change which agent new chats start with sets it.

### Import formats {/* #import-formats */}

Supported exports:

- ChatGPT `conversations.json`
- Claude export JSON
- Grok account exports
- Gemini Takeout `MyActivity.json`
- Open WebUI chat exports
- Generic JSON containing `conversations[].messages[]` (or one top-level `messages` array)

Osaurus scans recognizable JSON files inside each archive, including large ZIP64 exports. Re-imports with the same stable conversation ID are skipped. Multiple selections are processed independently.

### Offline fallback

Connectivity drives model availability automatically. An affected chat falls back to an available on-device chat model; the agent's cloud default is not overwritten and is restored when connectivity returns.

### Response details {/* #response-details */}

**Inspect response** lists the response metrics — **Worked for** (the total time from your keypress to the end of the run, including model loading, tool steps, and approval prompts), time to first [token](/glossary#token), tokens per second, token count, and model load time when the model had to load — followed by **Open request and response log**.

### Compaction details

- **Compact conversation** is available whenever there's an older span to summarize.
- Automatic compaction triggers before a send at 85% context utilization.
- The two most recent user exchanges stay verbatim; older turns are replaced by a summary in the model's outbound context. The visible transcript is unchanged.
- The context window itself is **Settings… → Server → Settings → Cache → Context Window Cap**, not a Conversation setting (the Conversation → Advanced row only links to it). The composer's Context Budget popover is read-only.

### Voice

Chat dictation uses FluidAudio on the Apple Neural Engine, entirely on-device. See [Voice → Transcription Mode](/voice#transcription-mode).

---

**Related:**

- [Tasks](/agent-loop) — what happens when you point a chat at a folder or turn on the Sandbox
- [Agents](/agents) — assistants for different jobs
- [Projects](/projects) — group chats around shared instructions, documents, memory, and a folder
- [Voice Input](/voice) — dictation, wake words, and typing into any app
- [Themes](/themes) — change how the chat window looks

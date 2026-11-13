---
title: Chat
sidebar_label: Chat
description: How to use the Osaurus chat window — opening it from anywhere, the navigation rail and chat list, choosing a model, running a workflow, reviewing file changes, finding past chats, and keyboard shortcuts.
---

# Chat

The chat window is where you talk to your AI. Press `⌘;` from anywhere on your Mac, ask a question, then press `⌘;` again to hide it and get back to what you were doing. You don't need a browser or a separate app.

## Get started

1. Press **`⌘;`**. The chat window appears.
2. Type your message in the box at the bottom.
3. Press **Return** to send. The reply appears as it's written.
4. Press **`⌘;`** again (or **Esc**, or click outside the window) to hide it.

Every new chat starts with the [Orchestrator](/glossary#orchestrator), the [agent](/glossary#agent) built into Osaurus, unless you've chosen a different agent for new chats. To change it, ask the Orchestrator something like *"start my new chats with Planner"*. Switching agents inside one chat doesn't change it.

| What you want | How |
|---|---|
| Open or hide the chat window | `⌘;` |
| Hide the window | `⌘;` again, `Esc`, or click outside |
| Start a new chat | `⌘ N` (it stays in the current [project](/glossary#project)) |
| Open a new chat window | `⇧ ⌘ N` |
| Find text in this chat | `⌘ F` |
| Open Settings | The gear at the bottom left of the window, or `⌘ ,` |

If `⌘;` clashes with another app, change it in **Settings → General → Global Hotkey**.

## The chat window

The window has three parts, left to right.

- **The navigation rail.** The narrow strip on the left edge of the window. **Chat** and **Workflows** are at the top. **Usage** (your [Osaurus Cloud](/glossary#osaurus-cloud) balance) and **Settings** (the gear) are at the bottom. Settings opens inside this same window. Click **Chat** to come back to your conversation.
- **The sidebar.** Your list of chats. See [The chat list](#the-chat-list). Show or hide it with the sidebar button at the left of the toolbar (or `⌘ B`), and drag its inner edge to resize it.
- **The conversation.** The chat's title sits at the top, with your messages, the agent's replies, and the message box underneath. **Find** (`⌘ F`) adds a search bar above the conversation.

Long chats also show a thin strip with one mark per message you sent. Hover over it to see previews, and click a mark to jump there.

A **File Changes** panel can also appear in the top-right corner. It shows up only after the chat changes a file on your Mac. See [Reviewing file changes](#reviewing-file-changes).

In a narrow window, the conversation takes the full width and the sidebar slides in over it. Click outside it, press **Esc**, or pick a chat to close it.

## The chat list {/* #the-chat-list */}

The sidebar lists your chats, grouped from top to bottom:

- **Osaurus** — the Orchestrator and its recent chats.
- **Pinned** — chats you've pinned, from any agent.
- **Agents** — one row per agent, with that agent's recent chats under it. Click an agent to open or fold its chats, or use the row's **+** for a fresh chat. The **+** beside the **Agents** heading creates a new agent.
- **Your projects** — one group per [project](/projects), with its chats. The group's **+** starts a chat in that project, and its gear opens the project's settings.
- **Agents on your other Macs**, your [workspaces](/glossary#workspace), and **Shared with you**, when you have any.

The search field at the top finds agents and workspaces by name and chats by title.

Right-click a chat (or use its **⋯** menu) for **Stop** (while it's working), **Open in New Window**, **Rename**, **Pin**, **Move to Project**, **Tasks from This Chat** (when the chat started background work; see [Tasks](/tasks)), **Export…**, **Archive**, and **Delete**.

Chats save automatically. There's no "Save" button. Osaurus gives each chat a short title once it has some substance, like "Fix the CI flake in auth tests". To turn this off, use **Automatically Name Chats** in **Settings → Chat**.

## The message box

| Part | What it does |
|---|---|
| **Message box** | Type or paste your message. `Return` sends; `Shift + Return` adds a new line. What you've typed stays there if you switch chats or agents. |
| **+** | **Add folder**, **Attach files**, **Add Workflow**, and **Slash commands**. Attached files can be documents, plus images, audio, or video when the chosen model can understand them. If the model can't take an image you paste or drop, a **Cannot attach** message says why. |
| **Folder** | Choose the chat's [Working Folder](/glossary#working-folder), the one folder the agent may work in. See [Working Folder](#working-folder). |
| **Microphone** | Click to speak your message instead of typing. |
| **Model** | Choose the AI [model](/glossary#model) for this chat. See [Choosing a model](#choosing-a-model). |
| **Context Budget** | Shows how full the chat's [context window](/glossary#context-window) is (how much the model can keep in mind at once). Click it for the **Compact conversation** button. |

## Choosing a model

Click the model button in the message box. You'll see a **Provider** column and a **Model** column. Models on your Mac come first, then [Osaurus Cloud](/glossary#osaurus-cloud), then any AI companies you've connected. A source you haven't set up shows **Explore**: for local models it opens model downloads in Settings, and for Osaurus Cloud it opens the Cloud model browser.

- **Favorites.** The Cloud list shows your favorites plus the Cloud model you're using now. Click the star to add or remove one. **More models** opens the full list.
- **Cloud browser.** Search by model or company, and filter by **Category** or **Context** (how much the model can take in). Models with published prices show their starting price in [credits](/glossary#credits). Choosing a model closes the browser; starring one keeps it open. **Manage Credits** opens your account.
- **Model options.** Some models add an options column with choices like **Reasoning Effort** (how hard to think, or simply On and Off), **Speculative Decoding** for some local models (see [Models](/models#speculative-decoding)), and other switches. Each shows your choice or the model's default, with **Reset to default** if you've changed it.
- **Runtimes.** Next to the providers, each [runtime](/harness-runtimes) such as **Claude Code** has its own column. Picking one hands this agent's chats to that outside program; picking an ordinary model switches it back. You can't switch while a reply is running.
- **Loading.** Choosing a model on your Mac doesn't load it right away. It loads when you send your first message. The button is gray until the model is loaded, then turns green.
- **Switching mid-chat.** If you move a chat off a model on your Mac, Osaurus mentions that the next reply has to re-read the whole conversation, so it may take a moment. Switching between cloud models shows no warning.

To check your Osaurus Cloud balance, hover over **Usage** in the navigation rail (or click it to keep it open). **Add Credits** tops up your balance; **View all** opens **Settings → Osaurus ID → Wallet & Credits**.

## Get things done

When you ask the AI to *do* something — not just explain it — it makes a plan, uses [tools](/glossary#tool) (actions like reading a file or searching the web) to do the work, and finishes with a summary of what it did. You can watch a to-do list tick off as it goes. It only stops to ask you something when the answer really changes the result.

While it works, its thinking and actions are grouped into a single **Worked for …** row. Click it to see each step.

[Working in Chat →](/agent-loop)

### Run a workflow from chat

A [workflow](/glossary#workflow) is a task Osaurus remembers how to do. To run one from a chat:

1. Click **+** in the message box and choose **Add Workflow**, or type `/` and start typing the workflow's name.
2. Pick the workflow. Its form opens.
3. Fill it in and click **Run**.

You can also just ask. *"Run Meeting Prep for my 2 pm"* works when the workflow is turned on for the agent you're talking to, or for the Orchestrator when the workflow is marked **Osaurus can run this for you**. [Run a Workflow →](/workflows-run)

## Working Folder {/* #working-folder */}

A [Working Folder](/glossary#working-folder) is one folder on your Mac that you let the agent read and edit. Click **Folder** in the message box to choose one.

**On an agent you created,** the agent can then read, create, edit, search, and undo changes to files in that folder. It can also run commands there, and use version-history tools if the folder is a code repository. The folder stays with the chat, and the agent remembers it: new chats with that agent, and its [automations](/automations), start in the same folder. If a chat has no folder and the agent needs one, it can open the folder picker itself and tell you why. If you cancel, the chat continues without a folder.

A chat uses either a Working Folder or the [Sandbox](/glossary#sandbox) (a sealed-off area for running code), never both. Picking a folder turns that agent's Sandbox off. You can turn it back on later in the agent's **Abilities** settings.

**On the Orchestrator,** the folder is not one it reads or changes itself. It's where the work lands: agents it hands a job to that don't have a folder of their own work inside it and can make changes, and so does the **Files** [helper](/glossary#helpers). So *"write the report into this folder"* just works. See [Orchestrator](/orchestrator#working-folder).

The agent can read text and code, pull the content out of PDF, Word, PowerPoint, and Excel files, and look at images (if the model can see images) or read the text in them. It can also create Word, Excel, PDF, and PowerPoint files, and edit existing ones while keeping their formatting.

## Reviewing file changes

Osaurus saves a copy of each file before and after the agent changes it, so nothing the agent does to your files is final.

- When a chat first changes a file, the **File Changes** panel opens in the top-right corner. Show or hide it with the button at the right end of the toolbar (**Show File Changes**). That button only appears once the chat has changed a file. While the panel is closed, the button shows how many files this chat has changed and not undone.
- Under a reply that changed files, click **N files changed · View changes** to jump to those changes. Each file-edit card in the chat also has its own **Revert** and **View change** buttons.
- **Timeline** lists every change in order, showing before and after. **Files** shows the end result for each file.
- **Revert** undoes one change. **Revert File** puts one file back the way it was before the chat. **Roll Back to Before This** undoes a change and everything after it. **Revert All** (in the panel's **⋯** menu) puts back every file the chat touched.
- If you edited a file yourself after the agent did, it's marked **Edited since** and left alone unless you choose **Overwrite Edited Files**. You can undo any revert, too.

To choose how long these copies are kept, go to **Settings → Privacy & Security → Data & Storage → File History**. **Keep File History** can be until the chat is deleted (the default), 90 days, or 30 days. **File History Size Limit** caps how much space they use. Deleting a chat always deletes its saved copies.

## Managing chats

| Action | How |
|---|---|
| Find a past chat | Type in the search field at the top of the sidebar |
| Keep a chat at the top | Right-click → **Pin**. It moves to **Pinned** until you unpin it. |
| Stop a chat that's working | Right-click → **Stop** |
| Put a chat away | Right-click → **Archive**. To see archived chats, hover the **Agents** heading, open its **⋯** menu, and choose **Show Archived**. |
| Delete a chat | Right-click → **Delete** |
| Delete one AI reply | Use the reply's menu; you can delete your matching message too |
| Clear the current chat | Type `/clear` in the message box |
| Delete everything for one agent | Open that agent in **Settings → Agents** and use **Delete All Data** at the bottom of its page |
| Wipe everything | **Settings → General → Factory Reset…** (removes all app data) |

Deleting can't be undone. To keep a copy first, use **Settings → Privacy & Security → Data & Storage → Export Plaintext Backup**. [Storage details →](/storage)

To group related chats so they share instructions, documents, memory, and a folder, use [Projects](/projects). Right-click any chat and choose **Move to Project**.

### Importing conversations

Bring in chats from other AI apps. Hover the **Agents** heading in the sidebar, open its **⋯** menu, and choose **Import Conversations**. The chats go to the agent on screen. You can import exports from:

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

Press `⇧ ⌘ N` to open a new chat window, or choose **File → New Window with Agent** to pick which agent it starts with. To move one chat into its own window, right-click it and choose **Open in New Window**. Each chat keeps its own agent, model, and folder or Sandbox setting.

For example, you could keep three windows open side by side:

| Window 1 | Window 2 | Window 3 |
|---|---|---|
| Builder working in your project folder | Scout researching on the web | Planner sorting out your week |

Closing a window doesn't delete its chats. Find them again in the sidebar of any window.

## Voice input

Click the microphone in the message box to speak your next message. Your speech is turned into text on your Mac and never leaves it.

Two related voice features work outside the chat window:

- **Wake Word.** Say a phrase like "Hey Osaurus", or your agent's name, to open a chat hands-free.
- **Transcription Mode.** Press a shortcut key to dictate into any text field in any app.

[Full voice guide →](/voice)

## Replies: formatting, copying, and follow-ups

Replies are nicely formatted, with headings, lists, tables, **bold** and *italic* text, and code with color highlighting. Links are clickable, including links to your [Knowledge](/glossary#knowledge) documents, which open the file. Right-click those for **Open With**, **Show in Finder**, or **Copy Path**.

- **Copy.** Hover over any message to see a copy button. It copies the reply itself, without the model's thinking.
- **Stop.** If a reply is going the wrong way, click **Stop**, edit your message, and try again.
- **Images.** Click a generated picture to see it full screen.
- **Follow-up suggestions.** Suggested next questions appear under the latest reply. Click one to send it. To turn them off everywhere, use **Suggest Follow-Up Questions** in **Settings → Chat**. Each agent can also turn them off, or use a different model for them.

### See how a reply was made

Open a reply's **⋯** menu to see when it arrived, and choose **Inspect response** for details like how long it took and how fast it was written. See [Under the hood](#response-details) for the full list.

## When a chat gets long {/* #context-compaction */}

Every model can only keep so much of a chat in mind at once (its [context window](/glossary#context-window)). When a chat gets long, Osaurus can summarize the older parts so you can keep going. This is called compacting.

- **Compact by hand.** Click the Context Budget meter in the message box, then **Compact conversation**, or type `/compact`. It tells you which model will write the summary.
- **Automatic.** When the chat is about 85% full, Osaurus compacts before sending your next message. If that fails, your message stays in the box and you can choose **Retry** or **Send without compacting**.
- **What you see doesn't change.** Your chat still shows every message. A marker labeled **Older messages summarized** shows where the summary starts; click it to read exactly what the model now sees.
- **Your latest messages are kept word for word.** Only older parts are summarized.
- **A full meter never blocks you.** The meter is an estimate. Even when it shows the chat is over the limit, Osaurus still sends your message, and only shows an error if the model itself reports it ran out of room.

Chats with the Orchestrator don't need compacting. It keeps a short note of what's still open in the conversation instead. See [Orchestrator](/orchestrator).

To choose which model writes summaries, go to **Settings → Models → Model Defaults → Compaction Model**. If you leave it unset, the chat's own model does it. If the summary model is a [cloud model](/glossary#cloud-model), your [Privacy Filter](/privacy-filter) settings apply before anything leaves your Mac.

## Chat settings

**Settings → Chat** holds chat behavior:

- **Commands:** your own slash commands (shortcuts you type after `/`)
- **Transcript:** Smooth Streaming, Group Thinking & Tool Activity, Expand Thinking While Streaming
- **Composer:** Check Spelling While Typing, Collapse Long Pastes, **⌘+N Starts a New Chat in the Current Window**
- **Behavior:** Automatically Name Chats, Suggest Follow-Up Questions, Clipboard Monitoring, and **Set Up Osaurus**
- **Models:** links to **Core Model** and **Compaction Model**, which live in **Settings → Models → Model Defaults**
- **Advanced:** a link to **Context Window Cap**, and a few rarely needed limits

Two related settings live elsewhere. **Keep Mac Awake While Agents Run** is in **Settings → General → Power**. How long file copies are kept is **File History** in **Settings → Privacy & Security → Data & Storage**.

How the app looks (System, Light, or Dark, and text size) is in **Settings → General → Appearance**. [Appearance →](/appearance)

Each agent's own instructions, model, and other settings live in **Settings → Agents**. [Agents →](/agents)

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
| `⌘ N` | New Chat in the current window (when the Chat setting is on, which is the default) |
| `⇧ ⌘ N` | New Window (`⌘ N` when that setting is off) |
| `⌘ ,` | Settings |
| `⌘ B` | Show or hide the sidebar |
| `⇧ ⌘ .` | Next Agent |
| `⇧ ⌘ V` | Turn Wake Word on or off |
| `⌘ =` / `⌘ -` / `⌘ 0` | Zoom In / Zoom Out / Actual Size |
| `⌘ ?` | Osaurus Help |

### In the chat window

| Shortcut | Action |
|---|---|
| `⌘ N` / `⌘ T` | New chat (`⌘ N` stays in the current project) |
| `⇧ ⌘ T` | Reopen the last chat you closed in this window |
| `⌃ Tab` / `⌃ ⇧ Tab` | Next / previous chat open in this window |
| `⇧ ⌘ ]` / `⇧ ⌘ [` | Next / previous chat open in this window |
| `⌘ F` | Find in this chat |
| `⌘ W` | Close the current chat (the window stays open) |
| `Return` | Send message |
| `Shift + Return` | New line |
| `Esc` | Hide the chat window |
| `/clear` | Clear the current chat (type it in the message box) |
| `/compact` | Summarize older messages now |
| `/title` | Write a title for the current chat |

The usual Mac text shortcuts (`⌘ A`, `⌘ C`, `⌘ V`, `⌘ X`, `⌘ Z`, `⌘ ⇧ Z`) work in every text box.

### Change shortcuts

You can change `⌘;` and the Transcription Mode shortcut in **Settings → General → Global Hotkey** and **Settings → Voice → Transcription**. Combine `⌘` Command, `⌥` Option, `⌃` Control, or `⇧` Shift with any letter, number, or function key.

## Troubleshooting

- **`⌘;` does nothing or opens something else.** Another app may use the same shortcut. Pick a different one in **Settings → General → Global Hotkey**.
- **The first reply is slow.** A model on your Mac loads when you send your first message. Later replies are faster.
- **A cloud model vanished from the list.** You're probably offline. See [When you go offline](#when-you-go-offline).
- **The agent can't see my files.** Give the chat a [Working Folder](#working-folder).
- **I can't find the File Changes panel.** It only appears after the chat has changed a file.
- **A red "Sandbox unavailable" chip shows in the message box.** Another copy of Osaurus on this Mac is using the [Sandbox](/glossary#sandbox). Hover the chip to see which one, and click it for ways to fix it.

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
- Context estimates (UTF-8 bytes / 4 plus reservations) are advisory only. They drive compaction and the context chip's warning, but the agent loop always performs the model step; a real context-limit error from the runtime propagates through the normal error path.
- Compaction requests turn reasoning off in a form self-hosted OpenAI-compatible servers read, and ChatGPT (Codex) compaction requests are streamed so they work on those models.
- The Orchestrator works from a bounded context (session state plus the last three exchanges) and never auto-compacts.
- The context window itself is **Settings → Server → Server Settings → Cache → Context Window Cap**, not a Chat setting (the Chat → Advanced row only links to it). The composer's Context Budget popover is read-only.

### Window state

`ChatWindowState.MainSurface` is `chat`, `workflows`, or `settings`; **Settings** (`⌘ ,`) and the rail gear both switch the same window to the Settings surface. The File Changes card is the window's context panel and only exists once the session has a recorded file change. Narrow windows (from 560 points) turn the sidebar into a drawer and close the context panel until the window widens.

### Markdown rendering

Code fences longer than three backticks and tilde fences render correctly. A fence labeled with a language renders as a code block even when its content looks like prose; a bare fence around prose stays prose. Channel output neutralizes inner fences inside code blocks.

### Voice

Chat dictation uses FluidAudio on the Apple Neural Engine, entirely on-device. See [Voice → Transcription Mode](/voice#transcription-mode).

---

**Related:**

- [Working in Chat](/agent-loop) — what happens when you point a chat at a folder or turn on the Sandbox
- [Run a Workflow](/workflows-run) — run a saved workflow from chat, the Workflows page, or an automation
- [Agents](/agents) — assistants for different jobs
- [Projects](/projects) — group chats around shared instructions, documents, memory, and a folder
- [Voice Input](/voice) — dictation, wake words, and typing into any app
- [Appearance](/appearance) — Light, Dark, and text size

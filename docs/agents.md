---
title: Agents
sidebar_label: Agents
description: Create AI assistants for different jobs — a coding partner, a research helper, a writing buddy — each with its own instructions, model, look, and memory.
---

# Agents

An [agent](/glossary#agent) is a saved AI assistant with its own name, instructions, AI [model](/glossary#model), and abilities. One assistant doesn't fit every job: for code you want something careful and precise, for brainstorming something creative, for research something that can search the web. Agents let you set each one up once and switch between them with a click.

Osaurus comes with one agent built in, the [Orchestrator](/glossary#orchestrator). Every agent described on this page is one you create yourself.

## Get started

1. Open **Settings… (`⌘ ,`) → Agents**, or click **+** in the chat sidebar's **Agents** list.
2. Click **Create Agent**.
3. Under **Start From**, pick a starting template (or begin blank).
4. Fill in the short form:
   - **Name** — required, like "Code Assistant". Templates fill in a good one.
   - **Avatar** — pick a mascot picture, or leave it blank to show the agent's first initial in its own color.
   - **Model** *(optional)* — always use this AI model for this agent, whatever you pick elsewhere.
   - **Capabilities** — everything starts turned on. Click **Customize…** to choose exactly which [tools](/glossary#tool) it gets. Nothing is saved until you create the agent.
   - **Prompt** — the agent's standing instructions (its [system prompt](/glossary#system-prompt)), used in every chat with it.
5. Click **Create Agent**. It's ready to use right away.

You can also just ask the Orchestrator: *"Create a research agent with web search."* It shows you a plan; approve it and the agent is created. An agent it creates without a chosen model uses the Orchestrator's current model.

Everything else — description, look, quick prompts, Sandbox settings, schedules — is in the agent's settings, described [below](#the-agent-detail-view).

### Descriptions

In the agent's **General → Configure** tab, **Brief description (optional)** is one line on what the agent does and when to hand it work. It shows next to the agent's name in pickers, and it helps the Orchestrator pick the right agent.

You don't have to fill it in. If you leave it blank, Osaurus writes one from the agent's instructions (you'll see it as gray placeholder text). Typing your own replaces it, and changing the instructions makes Osaurus write a new one. A description is only a label; it never gives the agent extra abilities.

### Example instructions

**Code Assistant** (set a low [temperature](/glossary#temperature) for careful, consistent answers):

```
You are an expert software engineer. You write clean, efficient,
well-tested code. You consider edge cases, suggest improvements
when relevant, and admit when you don't know something.
```

**Creative Writer** (high temperature for more varied writing):

```
You are a creative writing assistant with a flair for vivid
descriptions and engaging narratives. You help craft compelling
stories, poems, and creative content with an expressive style.
```

**Research Helper** (medium temperature, organized answers):

```
You are a research analyst. For every question, you cite sources,
flag uncertainty, and structure findings into:
- Executive summary
- Key findings
- Confidence assessment
```

## Switching, duplicating, and managing agents

| Where | How |
|---|---|
| Inside a chat | Pick an agent in the sidebar's **Agents** list, or press `⇧ ⌘ .` (**Next Agent**). **File → New Window with Agent** opens a window with a specific agent. |
| In Settings | Each agent card has a **⋯** menu: **Open**, **Duplicate**, **Open Database**, **Delete** |
| By voice | Turn on Wake Word for the agent and say its name. See [Voice → Wake Word](/voice#wake-word-vad-mode) |
| Make a copy | **⋯ → Duplicate**. The quickest way to try a variation of an agent you like. |
| Reorder | Click the reorder button in the Agents header and drag agents into place. The same order is used in the agent picker. |

Switching agents changes the instructions, model (if the agent has one), look (if it has one), and which memories are used. The chat keeps its history.

Agents other people have shared with you (see [Share an agent](#share-an-agent)) appear in the same list with a **Remote** label, and you can switch to them the same way.

## The agent detail view

Open any agent you created to see its settings. They're grouped in five sections in the sidebar:

| Section | Tabs | What's there |
|---|---|---|
| **General** | Configure · Appearance | Name, instructions, model, creativity and reply-length settings, the agent's voice, limits on scheduling itself · avatar, quick prompts shown in an empty chat, and a color theme |
| **Abilities** | Overview · Tools · Subagents · Sandbox | Every ability switch, with an estimate of its cost · which tools it can use · handing work to other agents · [Sandbox](/glossary#sandbox) settings and saved passwords. Some [plugins](/glossary#plugin) add their own tabs here too. |
| **Connections** | Network · Remote Connections · Channels | Finding the agent on your local network, its [Public Link](/glossary#public-link), and which [workspaces](/glossary#workspace) it's shared with · everyone you've given access, with usage and a **Revoke** button · where the agent replies on [messaging apps](/agent-channels) |
| **Automation** | Automation | The agent's [schedules](/schedules) and [folder watchers](/watchers) |
| **Memory** | Memory · Database | Chat history, pinned facts, and past conversations · the agent's own [database](/agent-db) |

Anything you leave empty uses your general Osaurus settings.

## Abilities

**Abilities → Overview** shows everything the agent can do, with a switch for each. At the top, a card shows how many abilities are on and an **estimated startup cost**: how much of the model's [context window](/glossary#context-window) (its working memory for a chat) the abilities take up before you've typed anything. The number updates as you flip switches. If the agent's model is too small to carry them, Tools and Memory are turned off automatically, with a note explaining why.

| Group | Ability | What it does |
|---|---|---|
| Model Access | **Tools** | The main switch for all tools. Off = an agent that can only chat. |
| | **Memory** | Remember useful facts from chats, and bring them up when relevant. |
| Output | **Charts** | Show data as charts in the chat |
| | **Speak Tool** | Read a reply out loud when you ask |
| Memory & Recall | **Memory Recall** | Let the agent search its own memory during a chat (separate from Memory, which only brings things up automatically) |
| Knowledge | **Knowledge** | Search the [Knowledge](/glossary#knowledge) collections (folders of your documents) you tick right under the switch |
| Web | **Web Search** | [Search the web](/web-search) |
| Autonomy | **Self-scheduling** | Let the agent set reminders to run again later, and send you notifications. Limits are in **General → Configure → Scheduling**. |
| Data | **Database** | A private, encrypted [database](/agent-db) for organized data. With a cloud model, the names of tables and columns are sent along with requests; the data itself isn't. |
| Code Execution | **Autonomous Execution** | The main switch for running code in the Sandbox. More settings are in **Abilities → Sandbox**. |
| Working Folder | **Working Folder** | The one folder on your Mac this agent works in. See [Working folders and the Sandbox](#working-folders-and-the-sandbox). |

Most abilities rely on tools, so they pause (with a note) when the main **Tools** switch is off.

### Turning off tools or memory entirely

For a simple chat-only agent — no tools and no memory — turn these off in **Abilities → Overview**:

- **Tools off** — the agent gets no tools.
- **Memory off** — the agent doesn't use or save memories.

This suits coaching or journaling agents, or anything where you want plain conversation and nothing else.

## Apple apps

Calendar, Reminders, Contacts, Notes, Mail, Messages, Maps & Location, Music, and Shortcuts are built in. They're **off for every agent** until you turn them on.

1. Open the agent and go to **Abilities → Tools**.
2. Each app has its own group at the top. Turn on the apps this agent should use.
3. macOS asks for permission to use that app. If you decline, the group shows **Permission needed**; click it to try again.

Osaurus always asks before an agent sends mail or a message, or deletes anything. The Orchestrator never uses these apps itself, but you can ask it to *"give Planner access to Calendar"* and it updates that agent for you. [Apple Apps →](/apple-apps)

## The tool picker

Each agent has its own set of [tools](/glossary#tool) — the actions it can take, like searching the web or reading a spreadsheet. You choose them in two places:

- **While creating the agent:** click **Customize…** under Capabilities.
- **For an existing agent:** open it and go to **Abilities → Tools**.

Tools are grouped by where they come from:

| Group | What's in it |
|---|---|
| **Built-in** | Tools every agent always has, like keeping a to-do list or sharing a file in the chat. Shown so you can see them; they can't be turned off. |
| **Apple app** *(one per app)* | The [Apple Apps](/apple-apps), turned on per app; all off at first |
| **Plugin** *(one per plugin)* | Tools from each [plugin](/glossary#plugin) you've installed |
| **MCP provider** *(one per service)* | Tools from an outside service you connected through [MCP](/glossary#mcp) |
| **Sandbox plugin** *(one per plugin)* | Tools the Sandbox has set up |

For each group you can open it to see every tool, turn the whole group on or off at once, and see how many are on. Each tool shows its name, a short description, and roughly how much context it costs. You can search by name or description.

**Skills aren't in the picker.** [Skills](/glossary#skill) (ready-made playbooks) are shared by all your agents. Every installed skill is available to every agent you create, with nothing to switch on. [Skills →](/skills)

### Auto vs Manual

A switch at the top of the tool picker decides how tools reach the model:

- **Auto** *(recommended)* — The agent starts with a small set of tools and loads more only when it needs them. This leaves more room for your chat and usually gives better results.
- **Manual** — The agent gets every tool you've turned on, every time. Predictable, but it uses more context, and skills aren't used in this mode.

Either way, a tool you've switched off in the picker is never offered to the agent.

## Working folders and the Sandbox

An agent can work in one of two places:

- **A [Working Folder](/glossary#working-folder)** — a real folder on your Mac. The agent can read, create, edit, search, and undo changes to files in it, run commands there, and use version-history tools if the folder holds a code repository. Choose it with **Folder** in the chat's message box, or the agent can open the folder picker itself when it needs one.
- **The [Sandbox](/glossary#sandbox)** — a sealed-off area where the agent can run code and install software without touching the rest of your Mac. New agents you create have it turned on where your Mac supports it. Change it in **Abilities → Overview** and **Abilities → Sandbox**.

It's always one or the other, never both. Picking a folder turns the agent's Sandbox off first. How much the agent can do in the Sandbox depends on its [Sandbox permissions](#sandbox-permissions); anything beyond reading needs **Autonomous Execution** on.

**The agent remembers its folder.** Picking or clearing a folder in a chat also updates the agent's **Working Folder** setting (which you can edit in **Abilities → Overview**). New chats with the agent open in that folder, and so do its schedules, watchers, and other background jobs that don't set their own. If you start a chat inside a [project](/glossary#project) that has its own folder, the project's folder wins.

When someone you've given access to uses the agent from another device, it can read and write files only in that same folder, and can't run commands.

[Tasks →](/agent-loop) · [Sandbox →](/sandbox)

## Sandbox permissions

**Abilities → Sandbox → Execution** controls what the agent may do when the [Sandbox](/agent-loop#configure-the-sandbox) is on:

| Setting | What it does | Default |
|---|---|---|
| **Autonomous Execution** | Lets the agent change files, run programs, install software, and use saved passwords in the Sandbox. Off = it can only look. | On for new agents where the Sandbox is supported |
| **Plugin Creation** | Lets the agent build its own new Sandbox tools | On |
| **Sandbox Network** | Lets the Sandbox reach the internet. Turn it off so nothing can be sent out. Takes effect the next time the Sandbox starts. | On |
| **Allowed Domains** | Only allow these websites, separated by commas: `example.com` for one site, `*.example.com` for all its subdomains. Only on macOS 26 and later; on macOS 15, internet access is all or nothing. | Empty (no limit) |
| **Background Processes** | Lets the agent leave programs running in the background, like a small web server | Off |

The same tab has a **Workspace Folder** row that shows the agent's Sandbox files in Finder. Changes you make there are visible to the agent right away. The agent's saved passwords and keys (**secrets**) are listed here too. [Sandbox →](/sandbox)

## Subagents per agent

The **Abilities → Subagents** tab controls what this agent can hand off:

- **Delegate to subagents** — hand jobs to other agents, including ones teammates shared with you. See [Subagents](/subagents).
- **Image** and **Video** — make pictures and videos. See [Image & Video Generation](/image-generation).
- **Computer Use** — use other Mac apps. See [Computer Use](/computer-use).
- **Browser Use** — use its own private web browser. See [Browser Use](/browser-use).
- **AppleScript** — automate Mac apps with scripts.

These are all off until you turn them on. Every new agent you create is automatically available to the Orchestrator. Other agents can only hand work to it if you add it to their own allowed list. Deleting an agent removes it from every list.

## Memory per agent

Each agent has its own [memory](/glossary#memory): pinned facts, past conversations, and preferences like *"I prefer tabs over spaces"* or *"Reply in English."* So your Code Assistant doesn't pick up things you told your journaling agent. (Preferences you set for Osaurus as a whole apply to every agent.)

For an agent that remembers nothing, turn the **Memory** ability off. [Memory →](/memory)

## Knowledge per agent

[Knowledge](/glossary#knowledge) collections are folders of your own documents — notes, PDFs, Word, Excel, PowerPoint, spreadsheets, code — that an agent can search when answering. You choose exactly which ones each agent may see:

1. Open the agent and go to **Abilities → Overview**.
2. Turn on **Knowledge**.
3. Tick the collections this agent may use. It can't see the others.

An agent with access can also flag out-of-date documents and suggest edits. Edits need your approval, and you can undo them. [Knowledge →](/knowledge)

## The built-in Orchestrator

Osaurus comes with the **Orchestrator** built in. It's the agent you talk to first, and the one new chats start with unless you choose another. It answers questions about Osaurus, changes settings after you approve, and for bigger jobs creates a specialist agent and hands it the work in the same reply. Files the specialist makes show up in your chat.

You can change its name and instructions in **Settings… → Orchestrator**, but its core setup is protected. It never uses the Sandbox. With a Working Folder it can **read** files but doesn't change them or run commands; it hands file edits, code, pictures, research, and other hands-on work to the agents you create, whose own safety settings still apply. Every agent you create is added to its list of agents it may hand work to. If you remove one, Osaurus remembers and doesn't add it back. See [Orchestrator](/orchestrator).

## Share an agent

Sharing an agent doesn't send a copy. It gives the other person a **live connection to your agent on your Mac**, over a secure, encrypted connection. They chat with the same agent you built, with your instructions, tools, and memory. You can cancel their access anytime.

The **Share** button in the agent's header offers two ways to share:

- **Send Invite Link…** — a one-time link for one person (see below).
- **Add to Workspace** — share the agent with a team [workspace](/workspaces), so every member can chat with it and hand it work. This is grayed out if you don't have a workspace you can share to. The agent's **Connections → Network** tab lists the workspaces it's **Shared with**, each with **Open workspace** and **Unshare**. You can also unshare from the agent's row in the chat sidebar.

### Send an invite

1. Open the agent and choose **Share → Send Invite Link…**.
2. Choose how long the link works: **1 hour**, **1 day**, **7 days** *(default)*, or **30 days**.
3. Osaurus turns on the agent's [Public Link](/glossary#public-link) for you and creates the invite.
4. Send it however you like. You get a clickable link, a **QR code**, and a **Share…** button for Messages, AirDrop, Mail, and so on.

Each invite works **once**. To share with three people, create three invites.

### Keep track of invites

Every invite you've made for an agent is listed under **Issued Invites**:

| Status | What it means |
|---|---|
| **Active** | The link works and hasn't been used |
| **Accepted** | Someone used it. They have access until you revoke it. |
| **Expired** | The link ran out; nothing to do |

You can **revoke** any active or accepted invite. Revoking an accepted one cuts off that person right away.

### Accept an invite someone sent you

1. Click the link, or scan the QR code. Osaurus opens it.
2. The **Add Remote Agent** window shows who you'd connect to: the agent's name and description, where it's from, when the invite expires, and a space for a note to yourself.
3. Click **Add Remote Agent**.

The agent appears in your **Agents** list with a **Remote** label and an antenna icon. Chat with it like any other agent; your messages go to the other person's Mac, where their agent answers. Add a note (like *"Alice's research agent"*) so you remember who shared it. Either of you can end it anytime: the sender from **Issued Invites**, you from the remote agent's settings.

## Move an agent to another Mac

Sharing keeps the agent running on *your* Mac. To move the agent itself — settings, database, and all — export it as an encrypted file:

1. In the agent's settings, choose **Export Bundle** and pick where to save the file.
2. Choose a password (at least 8 characters). You'll need it to open the file on the other Mac.
3. On the other Mac, choose **Import Bundle**, pick the file, and enter the password.
4. Check the summary (agent name, description, what's included, export date), then click **Activate** — or **Discard** to change nothing.

## Identity and access keys

Each agent has its own [identity](/glossary#identity). You can create [access keys](/glossary#access-key) that let another app or tool use just that one agent, and cancel them anytime. [Identity →](/identity)

## Tips

- **Start from a template.** **Start From** fills in a name, picture, and instructions. Pick the closest one and adjust. Duplicating an agent you like works too.
- **Watch the cost estimate.** Each ability takes up some of the model's working memory. **Abilities → Overview** shows how much, so you can keep agents on small models lean.
- **Match creativity to the job.** Set a low temperature (0.1–0.3) for code and facts, and a high one (0.7–0.9) for creative work. It's in **General → Configure**.
- **Use colors to stay oriented.** A different theme per agent helps when you have several windows open.
- **Keep instructions short.** Long instructions use up room the agent needs for your chat. Let [skills](/skills) carry specialized know-how.
- **Share for a short time.** When sharing an agent, pick 1 day or 7 days. You can always share again.

## Troubleshooting

- **Tools or Memory turned themselves off.** The agent's model is too small to carry them. Choose a model with a bigger context window, or turn off abilities you don't need.
- **An ability says it's paused.** The main **Tools** switch is off. Turn it on in **Abilities → Overview**.
- **The agent can't run code.** It has a Working Folder, which turns the Sandbox off. Clear the folder and turn the Sandbox back on in **Abilities**, or check **Autonomous Execution** in **Abilities → Sandbox**.
- **An Apple app shows "Permission needed".** Click the badge and allow access when macOS asks.

---

## Under the hood

### Everything an agent stores

An agent is a saved configuration with its own:

- **Identity** — name, optional one-line description, optional avatar (mascot or initial monogram), and a cryptographic address derived from your master key
- **Personality** — system prompt, optional default model, optional generation overrides (temperature, max tokens), optional theme that activates when the agent is selected
- **Abilities** — every capability switch: tools, memory, knowledge, web search, charts, speech, self-scheduling, database, code execution, and Working Folder, with a live estimate of startup context
- **Tools** — its own enabled tool set, including the built-in Apple Apps, plus the Auto/Manual toggle. Skills aren't scoped per agent.
- **Working Folder** — the one Mac folder the agent works inside, remembered from the chat Folder chip
- **Memory** — pinned facts, episode digests, and identity overrides, stored per agent
- **Database** — an optional private, encrypted SQLite database ([Agent DB](/agent-db))
- **Sandbox permissions** — an `autonomous_exec` config, down to per-domain network allowlists
- **Subagents** — which agents it may delegate to, plus the `image` and `video` tools, Computer Use, Browser Use, and AppleScript
- **Automation** — per-agent schedules and file watchers, plus opt-in self-scheduling
- **Quick actions** — per-agent prompt templates shown in the chat empty state, with separate lists for Chat and Work modes
- **Plugin instructions** — optional per-plugin instruction overrides
- **Bonjour discovery** — opt-in flag that advertises the agent on your local network so connector apps can find it

### Descriptions

The generated description is written in the background from the system prompt, without ever loading a model just for that. It's routing metadata only and never grants tools or permissions.

### Abilities and context

The startup-context estimate shows a `+/- tokens` delta per toggle and is priced through the same gates the next real send uses. The Orchestrator's memory is governed globally in Settings rather than by a per-agent Memory switch.

### Tool picker details

- **Built-in** tools include the loop tools `todo`, `complete`, and `clarify`, plus `share_artifact` and `web_search`. Toggling them has no effect.
- **Sandbox plugin** tools are defined by JSON-recipe sandbox plugins.
- **Auto** mode starts with a small always-loaded set and a capabilities manifest, then loads tools, skills, and methods on demand via `capabilities_discover` / `capabilities_load`. See [Methods → Mid-conversation discovery](/methods#mid-conversation-discovery).
- **Manual** mode sends the entire enabled tool set every turn and doesn't use the skill library.
- With **Tools off**, no tools or capability context are sent. With **Memory off**, memory is neither injected on read nor recorded on write.

### Working Folder and Sandbox internals

- Folder tools are file read/write/edit/search, shell, and undo, plus git tools when the folder is a repository.
- The Sandbox is a Linux VM on macOS 26+ and a Seatbelt-confined runner on macOS 15. Picking a folder turns Sandbox off for that agent before granting the host path.
- Write, exec, install, and secret tools require **Autonomous Execution** (`autonomous_exec`).
- **Allowed Domains**, when non-empty, switches the sandbox to host-only networking with a filtering proxy (VM backend only).
- The agent's sandbox home is `/workspace/agents/<name>/`.
- Authenticated remote runs ([Secure Channel](/glossary#secure-channel), agent-scoped keys) get file read/write confined to the agent's folder, but never shell or git.

See [Sandbox Internals](/sandbox).

### Orchestrator tools

The Orchestrator inspects the app with `osaurus_inspect`, answers product questions from the bundled guide with `osaurus_help`, and applies reviewed desired-state changes with `osaurus_config`. Child artifacts are adopted into the parent conversation. Every custom-agent creation path — the editor, declarative config, duplicate, bundle import, or backup restore — registers the new agent in its allowed subagents; existing installs are seeded once, and an intentionally empty list isn't repopulated. The agent for new chats is the [`new_chat_agent`](/configuration#declarative-configuration) setting.

### Sharing internals

- Invites are signed `osaurus://…?pair=…` deep links. Sending one enables the agent's public link (via the [relay](/glossary#relay)) automatically.
- Revoking an accepted invite kills the receiver's access key immediately; they're turned away on their next request.
- **Add to Workspace** is disabled for built-in agents.

### Bundles

Bundles are `.osaurus-agent` files sealed with your passphrase. Activating one copies the agent into `~/.osaurus/agents/<id>/`, re-keys its database to the local master key, and registers the agent. The manifest shows table and saved-view counts.

### Access keys

Per-agent access keys start with `osk-v1` and scope external tools and MCP clients to just that agent.

---

**Related:**

- [Tasks](/agent-loop) — what happens when you ask an agent to *do* something
- [Skills](/skills) — ready-made know-how, picked automatically
- [Memory](/memory) — what your agent remembers
- [Knowledge](/knowledge) — document collections your agent can search
- [Agent DB & Self-Scheduling](/agent-db) — give an agent organized storage and the ability to wake itself
- [Themes](/themes) — change an agent's look

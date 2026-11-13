---
title: Agents
sidebar_label: Agents
description: Create AI assistants for different jobs, like planning your day, sorting mail, or research, each with its own instructions, model, abilities, and memory.
---

# Agents

An [agent](/glossary#agent) is a saved AI assistant with its own name, instructions, AI [model](/glossary#model), and abilities. One assistant doesn't fit every job. For your calendar you want something careful, for brainstorming something creative, for research something that can search the web. Agents let you set each one up once and switch between them with a click.

For example, a "Trip Planner" agent could know your travel preferences, search the web for flights, and add the dates to your calendar, while your writing agent never sees any of that.

## Your starter team

On a new install, Osaurus sets up a small team of [teammates](/glossary#teammate), each looking after one part of your day:

| Agent | What it looks after |
|---|---|
| **Planner** | Calendar and Reminders |
| **Courier** | Mail. It reads your mail and never sends anything without asking. |
| **Keeper** | Your Downloads folder (read only) and Notes. It never changes a file. |
| **Scout** | Research on the web. Searches leave your Mac. |
| **Builder** | One project folder. Only on Macs set up for coding. It changes nothing without asking. |

If you updated from an older Osaurus, or deleted the team, you can add it in one click: open **Settings → Agents → Delegation** and click **Create starter agents**.

Three helpers are built in and pinned under **Built-in** at the top of **Settings → Agents**:

- The [Orchestrator](/glossary#orchestrator), the assistant new chats start with. It answers simple questions and hands everything else to the right agent or workflow.
- The [Architect](/glossary#architect), which builds [workflows](/workflows) with you.
- The [Configurator](/glossary#configurator), which changes settings when you ask in a chat.

Every other agent on this page is one you create, or one of the starter team.

## Get started

1. Open **Settings → Agents** (the gear at the bottom of the narrow strip on the left edge of the window, or press `⌘ ,`). You can also click **+** next to **Agents** in the chat sidebar.
2. Click **New Agent**.
3. Osaurus asks **What should your new agent do?** Describe it in your own words, pick an idea (**Assistant**, **Writer**, **Researcher**, **Coder**, or **Productivity**), or choose **Fill it in yourself instead**.
4. Chat with the [Configurator](/glossary#configurator). As you talk, the agent's card fills in beside the chat: its name and look, then **Instructions**, **Tools**, and **Model**. The Configurator says why it turns on each tool, and asks at most a couple of questions.
5. Change anything on the card with **Edit** (for tools, **Customize**). Parts you edit are marked **Edited by you**, and the Configurator keeps your choice.
6. Click **Create Agent**. Nothing is saved until you do. The agent's page opens, with **Start Chatting**.

If you step away halfway, the Agents list keeps your draft with **Continue** and **Discard**, even after you quit Osaurus.

You can also just ask in any chat: *"Create a research agent with web search."* Osaurus shows you a plan; approve it and the agent is created. An agent made this way without a chosen model uses the Orchestrator's current model.

To reuse a setup, save an agent as a template, or start from one someone sent you. See [Agent Templates](/agent-templates).

Everything else (description, look, quick prompts, Sandbox settings, automations) is on the agent's page, described [below](#the-agent-detail-view).

### Descriptions

On the agent's page, **Brief description (optional)** is one line on what the agent does and when to hand it work. It shows next to the agent's name in pickers, and it helps the Orchestrator pick the right agent.

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
| In Settings | Each agent card has a **⋯** menu: **Open**, **Duplicate**, **Save as Template**, **Open Database**, **Delete** (plus **Run Setup** while the agent shows **Needs setup**) |
| By voice | Turn on Wake Word for the agent and say its name. See [Voice](/voice) |
| Make a copy | **⋯ → Duplicate**. The quickest way to try a variation of an agent you like. |
| Reorder | Click the reorder button in the Agents header and drag agents into place. The same order is used in the agent picker. |

Switching agents changes the instructions, model (if the agent has one), avatar and greeting, and which memories are used. The chat keeps its history.

Agents other people have shared with you (see [Share an agent](#share-an-agent)) appear in the same list with a **Remote** label, and you can switch to them the same way.

## The agent detail view

Open any agent in **Settings → Agents** to see its page. The top holds what defines the agent: its name and **Brief description (optional)**, **Runtime**, **Model**, **System Prompt**, **Voice**, and **Advanced Settings** (custom creativity and reply-length settings for this agent). Below that, under **More Settings**, one row opens each group of settings:

| Row | What's there |
|---|---|
| **Abilities** | Every ability switch, with an estimate of its cost, and the [workflows](/workflows) the agent may run. From here, **Tools**, **Subagents** and **Sandbox** open the details: which [tools](/glossary#tool) it can use, handing work to other agents, and [Sandbox](/glossary#sandbox) settings and saved passwords. Some [plugins](/glossary#plugin) add their own rows here too. |
| **Appearance** | The avatar, and the greeting and quick prompts shown in an empty chat |
| **Sharing & Channels** | The agent's [Remote Access](/glossary#remote-access), which [workspaces](/glossary#workspace) it's shared with, its **Guests** (people you sent a link, with a **Revoke** button), and **On Channels**: where it answers on [messaging apps](/agent-channels) |
| **Automations** | Every [automation](/automations) that runs this agent, with **Add Automation**, and the agent's recent tasks |
| **Memory** | Chat history, pinned facts, and summaries of past conversations |
| **Database** | The agent's own [database](/agent-db), and **Export Bundle** to move the agent to another Mac |

Anything you leave empty uses your general Osaurus settings. Light or dark appearance is the same for the whole app; see [Appearance](/appearance).

## Abilities

**Abilities** shows everything the agent can do, with a switch for each. At the top, a bar shows how many abilities are on and an **estimated startup cost**: how much of the model's [context window](/glossary#context-window) (its working memory for a chat) the abilities take up before you've typed anything. The number updates as you flip switches. If the agent's model is too small to carry them, Tools and Memory are turned off automatically, with a note explaining why.

| Group | Ability | What it does | Starts |
|---|---|---|---|
| Model Access | **Tools** | The main switch for all tools. Off = an agent that can only chat. | On |
| | **Memory** | Remember useful facts from chats, and bring them up when relevant. | On |
| Output | **Charts** | Show data as charts in the chat | Off |
| | **Speak Tool** | Read a reply out loud when you ask | Off |
| | **Share Artifacts** | Post finished files, images, and reports as cards in the chat | On |
| Task Tools | **Task Checklist** | Keep a visible checklist for work with several steps | On |
| | **Clarifying Questions** | Stop and ask you a question when a task is unclear | On |
| | **Calculator** | Exact sums, for agents that work with budgets, invoices, or other numbers | Off |
| | **Redaction Tools** | Find and hide names, emails, phone numbers, and other personal details in files in the Working Folder | Off |
| Memory & Recall | **Memory Recall** | Let the agent search its own memory during a chat (separate from Memory, which only brings things up automatically) | Off |
| Knowledge | **Knowledge** | Search the [Knowledge](/glossary#knowledge) collections (folders of your documents) you tick right under the switch | Off |
| Web | **Web Search** | [Search the web](/web-search) | On |
| Autonomy | **Self-scheduling** | Let the agent set reminders to run again later, and send you notifications. Limits are under **Scheduling** on the agent's page. | Off |
| Data | **Database** | A private [database](/agent-db) for organized data. With a cloud model, the names of tables and columns are sent along with requests; the data itself isn't. | Off |
| Code Execution | **Autonomous Execution** | The main switch for running code in the Sandbox. More settings are in **Abilities → Sandbox**. | On where the Sandbox is supported |
| Working Folder | **Working Folder** | The one folder on your Mac this agent works in. **Read Only** lets it read and search there but never change anything. See [Working folders and the Sandbox](#working-folders-and-the-sandbox). | No folder |

Most abilities rely on tools, so they pause (with a note) when the main **Tools** switch is off.

### Workflows an agent can run

A [workflow](/glossary#workflow) is a task Osaurus remembers how to do, like a morning brief or sorting new mail. The **Workflows** list on the **Abilities** page shows the workflows you've installed. Turn one on, and the agent can run it whenever you ask, for example *"do my morning brief"*. The workflow runs as this agent, with its saved keys. If you have no workflows yet, **Browse Workflows** opens the Workflows page. See [Run a Workflow](/workflows-run).

### Turning off tools or memory entirely

For a simple chat-only agent (no tools and no memory), turn these off in **Abilities**:

- **Tools off**: the agent gets no tools.
- **Memory off**: the agent doesn't use or save memories.

This suits coaching or journaling agents, or anything where you want plain conversation and nothing else.

## Apple apps

Calendar, Reminders, Contacts, Notes, Mail, Messages, Maps & Location, Music, and Shortcuts are built in. They're **off for every agent** until you turn them on.

1. Open the agent and go to **Abilities → Tools**.
2. Each app has its own group at the top. Turn on the apps this agent should use.
3. macOS asks for permission to use that app. If you decline, the group shows **Permission needed**; click it to try again.

Osaurus always asks before an agent sends mail or a message, or deletes anything. The Orchestrator never uses these apps itself, but you can ask it to *"give Planner access to Calendar"* and it updates that agent for you. [Apple Apps →](/apple-apps)

## The tool picker

Each agent has its own set of [tools](/glossary#tool) — the actions it can take, like searching the web or reading a spreadsheet. You choose them in two places:

- **While creating the agent:** click **Customize** on the card's **Tools** part.
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

### Which skills an agent can use

[Skills](/glossary#skill) (ready-made playbooks) are shared by all your agents. By default every installed skill is available to every agent you create, with nothing to switch on.

To narrow that, turn on **Limit to selected skills** above the tool picker. Every installed skill starts ticked; click **Choose Skills…** to untick the ones this agent shouldn't use. Only ticked skills reach the agent, including as slash commands. A skill on the list that isn't installed yet shows **not installed** and starts working once you install it. [Skills →](/skills)

### Auto vs Manual

A switch at the top of the tool picker decides how tools reach the model:

- **Auto** *(recommended)* — The agent starts with a small set of tools and loads more only when it needs them. This leaves more room for your chat and usually gives better results.
- **Manual** — The agent gets every tool you've turned on, every time. Predictable, but it uses more context, and skills aren't used in this mode.

Either way, a tool you've switched off in the picker is never offered to the agent.

## Run an agent on Claude Code or Pi

Normally Osaurus runs an agent's chats itself. **Runtime → Runs on**, near the top of the agent's page, can hand them to an outside agent program instead, such as Claude Code or Pi. You can also switch from the chat's model picker, where each runtime has its own column. The outside program brings its own model and tools, so the agent's Osaurus abilities, memory, and Sandbox don't apply while it's on a runtime. See [Runtimes](/harness-runtimes).

## Working folders and the Sandbox

An agent can work in one of two places:

- **A [Working Folder](/glossary#working-folder)** — a real folder on your Mac. The agent can read, create, edit, search, and undo changes to files in it, run commands there, and use version-history tools if the folder holds a code repository. Choose it with **Folder** in the chat's message box, or the agent can open the folder picker itself when it needs one.
- **The [Sandbox](/glossary#sandbox)** — a sealed-off area where the agent can run code and install software without touching the rest of your Mac. New agents you create have it turned on where your Mac supports it. Change it in **Abilities** and **Abilities → Sandbox**.

It's always one or the other, never both. Picking a folder turns the agent's Sandbox off first. How much the agent can do in the Sandbox depends on its [Sandbox permissions](#sandbox-permissions); anything beyond reading needs **Autonomous Execution** on.

**The agent remembers its folder.** Picking or clearing a folder in a chat also updates the agent's **Working Folder** setting (which you can edit in **Abilities**). New chats with the agent open in that folder, and so do its [automations](/automations) and other background jobs that don't set their own. If you start a chat inside a [project](/glossary#project) that has its own folder, the project's folder wins.

Turn on **Read Only** under the folder when the agent should only look. It can then read and search the folder, but never changes a file or runs a command there. Workflow steps that run as this agent follow the same rule.

When someone you've given access to uses the agent from another device, it can read and write files only in that same folder, and can't run commands.

[Working in Chat →](/agent-loop) · [Sandbox →](/sandbox)

## Sandbox permissions

**Abilities → Sandbox → Execution** controls what the agent may do when the [Sandbox](/sandbox) is on:

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

These are all off until you turn them on. Every new agent you create is automatically available to the Orchestrator (an [Osaurus Bundle](/bundles) can opt its agents out); the list is in **Settings → Agents → Delegation**. Other agents can only hand work to it if you add it to their own allowed list. Deleting an agent removes it from every list.

## Memory per agent

Each agent has its own [memory](/glossary#memory): pinned facts, past conversations, and preferences like *"I prefer tabs over spaces"* or *"Reply in English."* So your Code Assistant doesn't pick up things you told your journaling agent. (Preferences you set for Osaurus as a whole apply to every agent.)

For an agent that remembers nothing, turn the **Memory** ability off. [Memory →](/memory)

## Knowledge per agent

[Knowledge](/glossary#knowledge) collections are folders of your own documents — notes, PDFs, Word, Excel, PowerPoint, spreadsheets, code — that an agent can search when answering. You choose exactly which ones each agent may see:

1. Open the agent and go to **Abilities**.
2. Turn on **Knowledge**.
3. Tick the collections this agent may use. It can't see the others.

An agent with access can also flag out-of-date documents and suggest edits. Edits need your approval, and you can undo them. [Knowledge →](/knowledge)

## The built-in Orchestrator

Osaurus comes with the **Orchestrator** built in. It's the agent you talk to first, and the one new chats start with unless you choose another. It answers simple questions itself and routes everything else: settings changes go to the [Configurator](/glossary#configurator), building a workflow goes to the [Architect](/glossary#architect), and a task one of your saved workflows does runs that workflow. Other hands-on work goes to one of your agents or to a built-in [helper](/glossary#helpers) (Research, Files, Browser, or Code). Files they make show up in your chat.

You can change its name and instructions in **Settings → Agents → Orchestrator**, but its core setup is protected. It never reads or changes files itself, and never uses the Sandbox. A Working Folder you give it is passed on to the agents it hands work to, whose own safety settings still apply. Every agent you create is added to the list of agents it may hand work to (**Settings → Agents → Delegation**). If you remove one, Osaurus remembers and doesn't add it back. See [Orchestrator](/orchestrator).

## Share an agent

Sharing an agent doesn't send a copy. It gives the other person a **live connection to your agent on your Mac**, over a secure, encrypted connection. They chat with the same agent you built, with your instructions, tools, and memory. You can cancel their access anytime.

Click the **Share** button at the top of the agent's page, then **Share…**. Choose who gets to chat with it:

- **Workspace**: share it with a team [workspace](/workspaces), so every member can chat with it from their own Osaurus and hand it work. Their chats use workspace credits. Pick the workspace, then choose the name it shows there and who pays. If you have no workspace to share to, the sheet says so. **Sharing & Channels** on the agent's page lists the workspaces it's **Shared with**, each with **Open workspace** and **Unshare**.
- **Guest Link**: a link for one person (see below).

The same **Share** button has **Save as Template**, which saves a copy of the setup rather than sharing the agent. See [Agent Templates](/agent-templates).

Built-in agents can't be shared. Duplicate one first.

### Send a guest link

1. On the agent's page, click **Share → Share…**, then **Guest Link**.
2. Turn on **Remote Access** if it's off. This gives the agent an address that works from outside your home network. It asks once to confirm. See [Remote Access](/remote-access).
3. Choose how long the link works: **1 hour**, **1 day**, **7 days** *(default)*, or **30 days**.
4. Click **Create Link**.
5. Send it however you like. You get the link to copy, a **QR code**, and a **Share…** button for Messages, AirDrop, Mail, and so on.

Each link works **once**. To share with three people, create three links. Guests chat with the agent as you set it up, running on your Mac. They don't see your other agents or chats. Tools that need your approval wait for you in the **Inbox**.

### Keep track of guests

**Sharing & Channels** on the agent's page lists everyone you've sent a link, under **Guests**:

| Status | What it means |
|---|---|
| **Active** | Someone used the link. They have access until you revoke it. |
| **Not accepted** | The link works and hasn't been used yet |
| **Expired** | The link ran out; nothing to do |
| **Revoked** | You cut off access |

Click **Revoke** to cut someone off right away. Their open chats show "Access revoked". **Settings → Sharing → Access** lists guests for all your agents in one place.

### Accept a link someone sent you

1. Click the link, or scan the QR code. Osaurus opens it.
2. The sheet shows the agent's name and description, when the link expires, and **What the Owner Can See**: your messages and the files you attach in chats with this agent go to the owner's Mac, and the owner can read those chats. Your other agents and chats stay private.
3. Add a **Note** if you like (such as *"Alice's research agent"*), so you remember who shared it.
4. Click **Add Shared Agent**.

The agent appears in your **Agents** list with a **Remote** label and an antenna icon. Chat with it like any other agent; your messages go to the other person's Mac, where their agent answers. Either of you can end it anytime.

## Move an agent to another Mac

Sharing keeps the agent running on *your* Mac. To move the agent itself (settings, database, and all), export it as an encrypted file:

1. On the agent's page, open **Database**, and under **Manage** click **Export Bundle**. Pick where to save the file.
2. Choose a password (at least 8 characters). You'll need it to open the file on the other Mac.
3. On the other Mac, open any agent's **Database** page, click **Import Bundle**, pick the file, and enter the password.
4. Check the summary (agent name, description, what's included, export date), then click **Activate**, or **Discard** to change nothing.

## Osaurus ID and access keys

Each agent has its own address under your [Osaurus ID](/glossary#osaurus-id). You can create [access keys](/glossary#access-key) that let another app or tool use just that one agent, and cancel them anytime. [Osaurus ID →](/identity)

## Tips

- **Start from an idea or a template.** The ideas under **New Agent** give the Configurator a head start. Duplicating an agent you like works too, and [Agent Templates](/agent-templates) carry a whole setup, including tools and services.
- **Watch the cost estimate.** Each ability takes up some of the model's working memory. **Abilities** shows how much, so you can keep agents on small models lean.
- **Match creativity to the job.** Set a low temperature (0.1–0.3) for code and facts, and a high one (0.7–0.9) for creative work. It's under **Advanced Settings → Generation Overrides** on the agent's page.
- **Use avatars to stay oriented.** A different avatar per agent helps when you have several windows open. Set it in **Appearance**.
- **Let agents run your workflows.** If you do the same task often, save it as a [workflow](/workflows) and turn it on in the agent's **Abilities**.
- **Keep instructions short.** Long instructions use up room the agent needs for your chat. Let [skills](/skills) carry specialized know-how.
- **Share for a short time.** When sharing an agent, pick 1 day or 7 days. You can always share again.

## Troubleshooting

- **Tools or Memory turned themselves off.** The agent's model is too small to carry them. Choose a model with a bigger context window, or turn off abilities you don't need.
- **An ability says it's paused.** The main **Tools** switch is off. Turn it on in **Abilities**.
- **The agent can't run code.** It has a Working Folder, which turns the Sandbox off. Clear the folder and turn the Sandbox back on in **Abilities**, or check **Autonomous Execution** in **Abilities → Sandbox**.
- **An Apple app shows "Permission needed".** Click the badge and allow access when macOS asks.
- **The agent shows "Needs setup".** It came from a template or bundle that relies on something your Mac doesn't have yet. Choose **⋯ → Run Setup**. See [Agent Templates](/agent-templates).

---

## Under the hood

### Everything an agent stores

An agent is a saved configuration with its own:

- **Identity** — name, optional one-line description, optional avatar (mascot or initial monogram), and a cryptographic address derived from your master key
- **Personality** — system prompt, optional default model, optional generation overrides (temperature, max tokens, and the other sampling fields), greeting and quick actions for the empty chat
- **Abilities** — every capability switch: tools, memory, knowledge, web search, charts, speech, artifacts, task checklist, clarifying questions, calculator, redaction tools, self-scheduling, database, code execution, and Working Folder, with a live estimate of startup context
- **Workflows** — the installed workflows it may call, each exposed as a `workflow_<slug>` tool (`agents[].workflows` in config; a list replaces the set, `[]` turns them off)
- **Tools** — its own enabled tool set, including the built-in Apple Apps, plus the Auto/Manual toggle, and an optional skill allow-list (`agents[].skills` in config: omitted = unchanged, `null` = all, a list = only those)
- **Runtime** — `builtin` or a registered [harness runtime](/harness-runtimes), plus Claude Code options when it runs on Claude Code
- **Working Folder** — the one Mac folder the agent works inside, remembered from the chat Folder chip, with an optional read-only flag
- **Memory** — pinned facts, episode digests, and identity overrides, stored per agent
- **Database** — an optional private SQLite database ([Agent DB](/agent-db)). It follows the app-wide storage setting: plaintext (protected by FileVault) by default, SQLCipher-encrypted if you turned on **Encrypt Local Data at Rest (SQLCipher)** in **Settings → Privacy & Security → Data & Storage**.
- **Sandbox permissions** — an `autonomous_exec` config, down to per-domain network allowlists
- **Subagents** — which agents it may delegate to with `spawn_agent`, plus the `image` and `video` tools, Computer Use, Browser Use, and AppleScript
- **Automations** — none are stored on the agent; [automations](/automations) that target it are listed on its **Automations** page. Self-scheduling is opt-in.
- **Plugin instructions** — optional per-plugin instruction overrides

Custom agents are stored as JSON under `~/.osaurus/agents/<uuid>.json`.

### Descriptions

The generated description is written in the background from the system prompt, without ever loading a model just for that. It's routing metadata only and never grants tools or permissions.

### Abilities and context

The startup-context estimate shows a `+/- tokens` delta per toggle and is priced through the same gates the next real send uses. The Orchestrator's memory is governed globally in Settings rather than by a per-agent Memory switch.

### Tool picker details

- **Built-in** tools include the loop tools `todo`, `complete`, and `clarify`, plus `share_artifact` and `web_search`. Toggling them has no effect.
- **Sandbox plugin** tools are defined by JSON-recipe sandbox plugins.
- **Auto** mode starts with a small always-loaded set and a capabilities manifest, then loads tools, skills, and methods on demand via `capabilities_discover` / `capabilities_load`. See [Methods](/methods).
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

The Orchestrator's own tools are `status`, `state`, `configurator_handoff`, `architect_handoff`, `run_workflow`, and `clarify`. It has no file tools and doesn't call `spawn_agent`; it reaches your agents and the built-in helpers through `run_workflow`, each running as a one-step workflow. Configuration (`osaurus_config`, `osaurus_inspect`, `osaurus_help`) belongs to the Configurator. Child artifacts are adopted into the parent conversation. Every custom-agent creation path — the editor, declarative config, duplicate, template, bundle import, or backup restore — registers the new agent in its allowed subagents; existing installs are seeded once, and an intentionally empty list isn't repopulated. An agent entry created with `orchestrator_spawnable: false` (used by [Osaurus Bundles](/bundles)) is left out; patching an existing agent ignores the key, and a `delegation.spawnable_agents` list in the same document wins. Agents on a [harness runtime](/harness-runtimes) are left out of the Orchestrator's roster. The agent for new chats is the [`new_chat_agent`](/configuration) setting.

### Sharing internals

- Guest links are signed, single-use `osaurus://…?pair=…` deep links. They need the agent's Remote Access address (served through the [relay](/glossary#relay)), so the **Guest Link** section appears only once Remote Access is on.
- Revoking an accepted link kills the guest's access key immediately; they're turned away on their next request.
- **Share…** is disabled for built-in agents, and an agent that's shared with a workspace can't be deleted until you unshare it.

### Export bundles

Export bundles are `.osaurus-agent` files sealed with your passphrase (unrelated to [Osaurus Bundles](/bundles), which installers use with `osaurus import`). Activating one copies the agent into `~/.osaurus/agents/<id>/`, re-keys its database to the local master key, and registers the agent. The manifest shows table and saved-view counts.

### Access keys

Per-agent access keys start with `osk-v1` and scope external tools and MCP clients to just that agent.

---

**Related:**

- [Working in Chat](/agent-loop) — what happens when you ask an agent to *do* something
- [Workflows](/workflows) — tasks Osaurus remembers how to do, which your agents can run
- [Automations](/automations) — run an agent or workflow on a schedule or when something happens
- [Skills](/skills) — ready-made know-how, picked automatically
- [Memory](/memory) — what your agent remembers
- [Knowledge](/knowledge) — document collections your agent can search
- [Agent DB & Self-Scheduling](/agent-db) — give an agent organized storage and the ability to wake itself

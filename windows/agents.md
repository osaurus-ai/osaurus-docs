---
title: Agents on Windows
sidebar_label: Agents
description: Create and edit agents in Osaurus for Windows, describe one in a chat and let Osaurus draft it, see how the Orchestrator hands work to helpers, change settings by asking, and put back any earlier setup from History.
---

# Agents on Windows

An agent is an assistant with its own instructions, model, tools, and memory. Make one for each kind of job: a writer, a researcher, a helper for one client. You don't need one to start: out of the box, chats open on the [Orchestrator](#the-orchestrator), Osaurus's built-in agent, which answers you or hands the work to the right helper. Agents work much as [Agents](/agents) describes on the Mac; this page covers where things are on Windows and what's different.

Everything on this page is in the sidebar's **AGENTS** list and in **Settings → Agents**, which has seven pages: **Agents**, **Orchestrator**, **Architect**, **Configurator**, **Memory**, **Knowledge**, and **History**.

## Get started

There are two ways to make an agent.

**Describe it in a chat.** Osaurus drafts it with you.

1. Open **Settings → Agents → Agents** and click **Add agent**.
2. Under **What should your new agent do?**, describe it in your own words, or pick an idea (**Assistant**, **Writer**, **Researcher**, **Coder**, **Productivity**).
3. The [Configurator](/glossary#configurator) asks only what it needs and fills in a card beside the chat: name, description, avatar, instructions, tools, and model. You can change anything on the card yourself; it reads your changes on its next turn.
4. Click **Create agent**. Nothing is saved until you do.
5. Click **Start chatting**, or **Open in settings** to keep going in the editor. If it still needs something on this PC (a model, a key), **Finish setup** takes you there.

If you leave before creating it, the Agents page shows it as an unfinished agent, with **Continue** and **Discard**. **Discard draft** removes the draft and its chat.

**Fill it in yourself.** Click the **+** next to **AGENTS** in the sidebar (or **Fill it in yourself instead** on the New agent page). The editor opens on a blank agent. Under **Start from a template**, pick a starting point or leave it blank, give it a **Name**, and click **Save**.

You can also just ask Osaurus in any chat ("make me an agent that drafts replies in my tone"). It shows the change on a card for you to approve first. See [Change settings by asking](#change-settings-by-asking).

## Your agents

**Settings → Agents → Agents** lists your agents. Click the pencil to edit one. The **…** menu has **Duplicate**, **Save as template…**, **Share…**, **Publish to store…**, and **Delete**. An agent made from a template that still needs something shows **Needs setup**; click it, then **Set up now** (or **Later**).

In the sidebar, each agent's recent chats sit under it. Right-click an agent for **New conversation**, **Conversations…**, **Workflows**, **Browser**, **Edit**, **Duplicate**, **Share…**, **Delete**, and **Manage agents…**. Deleting an agent keeps its conversations in history, under the Orchestrator.

Switch agents with **Ctrl+Alt+Up** and **Ctrl+Alt+Down**; **Ctrl+B** narrows the sidebar to a strip of avatars.

## The editor

The editor has five tabs. Changes show **Unsaved changes** with **Save** and **Cancel**.

| Tab | What's there |
|---|---|
| **Basics** | Avatar (a mascot, or **Upload image**), **Name**, **What it's for**, **Instructions**, **Model** (blank uses the chat's model), **Thinking** |
| **Abilities** | What it can do, as cards (below) |
| **Permissions** | When it asks you first, file edits and commands, spending limits for runs you're not watching, the folder for remote runs, and how teammates' runs ask for tools |
| **Chat** | Its greeting (or **Write a fresh greeting each time**), **Quick actions** shown on a new chat, and the [channels](/windows/channels) it can post to |
| **Advanced** | **Enabled**, temperature, longest reply, reasoning effort, **Save as template…** |

### Abilities

Each ability is a card, grouped under **GET WORK DONE**, **CREATE**, **SPEAK**, **REMEMBER**, and **ON ITS OWN**. Some have a switch; click a card to open its settings.

| Card | What it does |
|---|---|
| **Tools** | Lets it act, not just talk. **Which tools**: **Auto** picks what each turn needs; **Manual** offers only the tools you list. With Tools off, it can only talk and its other abilities are off too. |
| **Files & commands** | Where it works: its own [sandbox](/windows/sandbox), or a folder you attach. Includes **Contain its commands**, **Keep things running**, **Build its own tools**, **Commands per turn**, **Sites it may reach**, and **Secrets**. |
| **Team** | The agents it may hand tasks to. See [Handing work to other agents](#handing-work-to-other-agents). |
| **Web browser** | A browser of its own, with its own sign-ins. See [Browser Use](/windows/browser). |
| **Workflows** | The saved [workflows](/windows/workflows) it can run as tools. |
| **Images**, **Video** | Makes and edits pictures, or short clips, on this PC's graphics card. Off until you turn them on. See [Images & Video](/windows/images). |
| **Voice** | **Speak aloud when asked**, or **Read every reply aloud**. See [Voice](/windows/voice). |
| **Memory** | **Follow the global setting**, **Always on**, or **Off**, plus **Let it search memory** and **Use your About me**. See [Memory](/windows/memory). |
| **Skills** | **All enabled skills**, or **Only the skills I pick**. |
| **Private database** | Tables only this agent can read and write, with a storage limit. |
| **Wake-ups** | Lets it book its own next run, within limits you set. See [Automations](/windows/automation). |

An agent is told only about the tools it has in that run, so it doesn't go looking for one it can't use.

### Permissions

**When should it ask you first?** is **Follow my approval setting** (the one in **Settings → General → Behavior**) unless you pick **Run tools without asking** or **Ask before each tool call** for this agent. **File edits and commands** has its own setting. **Review** shows the decisions you've told it to remember.

**Spending when you're not watching** caps what it may spend on runs you aren't watching, such as a schedule: **Per month (USD)**, **Per run (USD)**, and **Tokens per run**.

**Teammates' tool calls** applies when you share the agent with a [workspace](/windows/workspaces): **Ask me before a teammate's run uses a tool**, and how long to wait before declining a request nobody answered.

## The Orchestrator

The Orchestrator is Osaurus's built-in agent, the one a new window opens on, shown as **Osaurus** unless you rename it. Ask it for anything. When a request needs no tools, it answers. When it needs tools, it hands the work on and shows you what comes back:

- **Osaurus itself** (how a feature works, where a setting is, or a change): to the [Configurator](#change-settings-by-asking).
- **Web research**, **files in the chat's folder**, **a website**, or **code**: to one of four built-in [helpers](/glossary#helpers), **Research**, **Files**, **Browser**, and **Code**. Code runs in its own sandbox and never sees your folder.
- **A job one of your agents does**: to that agent.
- **A task a saved workflow does**: to that [workflow](/windows/workflows).
- **A new multi-step task**: to the [Architect](/glossary#architect), which builds it as a workflow with you.

To let the Files helper work on your files, attach a folder with the **+** button in the message box. A build, tests, or any command in that folder goes to one of your agents that can run commands there; if none can, Osaurus tells you and offers to set one up.

### Orchestrator settings

**Settings → Agents → Orchestrator** opens the Orchestrator in the same editor as your agents, with only what it has:

- **Basics**: its name, avatar, **Instructions** (added to its built-in ones), **Model**, and **Thinking**.
- **Abilities → Team**: **Agents Osaurus can hand work to**. Each new agent you create is added; one you untick stays off. The limits apply to each task it hands on.
- **Advanced**: sampling (temperature, longest reply, reasoning effort).

Click **Save** to apply.

## Change settings by asking

Ask Osaurus to change something ("add my OpenAI key", "download a smaller model", "make a writer agent", "keep the Henley project to local models") and the Orchestrator hands it to the Configurator, a built-in helper that knows Osaurus's settings. Before anything changes, a card in the chat shows exactly what will change. Nothing happens until you approve it, and this card never offers "always allow": every change asks.

**Paste to install.** Paste a setup link, an [MCP](/glossary#mcp) server's config, or an install command into a chat. Osaurus reads it once and shows a card of what it would install: skills, agents, MCP servers, Claude plugin skills. Untick anything you don't want, then approve. A server that would run on this PC starts unticked.

**Settings → Agents → Configurator** sets its **Model** (blank uses the chat's model), **Use the model's temperature** or a **Temperature** of your own, and **Extra instructions**. **Each request** shows how much one request may do: up to 8 steps and 10 minutes. **Save** applies; **Restore defaults** puts back the stock settings.

## History

**Settings → Agents → History** keeps every version of your setup: your agents, providers, models, MCP servers, web search, channels, schedules, watchers, projects, and more. Each version says who made the change:

- **Changed in a chat**, with what you asked for, such as "make me a writer".
- **Changed in Settings**, for a change you made on a settings page.
- **Template install**, **File import**, **Paired phone**, or **Command line or admin API**.

Select a version to see what it changed. Its **…** menu has **Name…**, **Export…**, and **Revert to this version…**. Reverting shows exactly what will change before you click **Revert**. A revert adds and updates; it deletes nothing. A provider it brings back needs its API key entered again.

You can also ask in a chat ("what changed yesterday?", "put my agents back the way they were on Monday"). A revert asked for in a chat shows the same approval card.

## The Architect

The Architect builds workflows with you. **Settings → Agents → Architect** sets its name, avatar, **Instructions** (added to its own), **Model** (blank uses the Orchestrator's), and two **Permissions**: **Edit the draft** and **Run tests**. **Restore defaults** fills in the stock settings; **Save** applies them. To build a workflow, see [Workflows](/windows/workflows).

## Handing work to other agents

An agent can hand a self-contained task to another agent and get back a short summary; the other agent's reading never enters your chat. See [Subagents](/subagents).

Open the agent's **Abilities → Team** card and tick who it may delegate to. Nothing ticked means it can't delegate. The list has three parts:

- Your agents, each running with its own instructions, model, and tools.
- **Shared workspace agents (run on a teammate's machine)**.
- **Bare models (no persona, no tools of their own)**, for a quick second opinion.

Each agent has three limits:

| Setting | Default | Range |
|---|---|---|
| **Tool rounds** | 12 | 1–40 |
| **Time budget (s)** | 300 | 15–1800 |
| **In parallel** | 3 | 1–8 |

Agents doing delegated work can't delegate further or ask you questions. Delegating asks for your approval like any other tool, following the agent's approval setting.

## Templates

A template is an agent as a file (`.osaurustemplate`) that you can share and make new agents from. The format is shared with the Mac, so templates move between the two. See [Agent Templates](/agent-templates).

- **Settings → Agents → Agents → Templates** lists them. **Use template** shows what it will create and what it still needs before you click **Create agent**. **Details and versions** lists earlier versions, with **Restore**.
- **Save as template…** on an agent saves it to your templates, and **Export file…** saves a file to share. Turn on **Sign it with your Osaurus ID** so others can tell it came from you and that it wasn't changed. Secrets, keys, and the agent's identity never go in a file.
- **Import file…**, drop a file on the page, or open one from File Explorer. Osaurus shows what it contains before importing. Importing a newer version of one you have offers to replace yours or keep both.
- The **Orchestrator** switch on a template lets the Orchestrator make agents from it.

## Share an agent

**Share…** creates an invite link that lets one person add the agent to their Osaurus; it keeps running on your PC. Choose **Expires after** (1, 7, or 30 days), click **Create invite link**, then **Copy link**. If the agent isn't reachable from outside yet, click **Publish on the relay** first. **Links you have made** lists your links; **Revoke** stops one.

Agents others have shared with you are under **Paired remote agents** on the Agents page.

To share an agent with your team, use the workspace's **Share an agent**. See [Workspaces](/windows/workspaces).

**Publish to store…** puts the agent on a page in the Osaurus store, so anyone with the link can add it, with the workflows it uses. Choose **Who can find it** (**Public**, **Unlisted**, or **Password**). Its prompt, model, and quick actions travel; its tools, folders, sandbox, and budgets stay on this PC. The page is signed with your [Osaurus ID](/glossary#osaurus-id), so only you can update it or take it down.

## Different from the Mac

- The editor is five tabs (Basics, Abilities, Permissions, Chat, Advanced), not a sidebar of sections. Manual tool selection is a list of tool names, not a picker.
- Delegation is set on each agent's **Team** card; there's no separate Delegation page or starter-agent button. The Orchestrator's Team lists your agents only.
- Delegated work runs as one task per call; continuing an earlier task, background tasks, and batches aren't on Windows.
- The Orchestrator has no folder setting of its own: attach a folder to the chat.
- The Configurator's settings are on **Settings → Agents → Configurator**, and every version of your setup is on **Settings → Agents → History**.
- Invite links have no QR code and no 1-hour option. There's no `.osaurus-agent` bundle export; use a template.
- Not on Windows: per-agent themes, Apple apps, Computer Use, and the startup-cost estimate.

---

## Under the hood

- The Orchestrator's id is `default`. Its tools are for routing: `configurator_handoff`, `architect_handoff`, `run_workflow` (which runs workflows, the four helpers, and a wrapper for each of your agents), `status`, `state`, and `clarify`, plus `memory_remember`, `memory_forget`, and `memory_search`, and on a voice call `delegate_task` and `end_call`. On Claude Code or another model that runs its own tool loop, it holds the Configurator's settings tools itself instead of handing off.
- The Configurator changes settings only through `osaurus_config` (a small YAML document, applied after you approve its plan) and installs pasted setup through `osaurus_import`. Both always ask, and neither accepts a remembered approval.
- A New agent chat runs the Configurator with `agent_draft` and read-only tools only; **Create agent** is the only thing that makes the agent.
- History is kept by the server for the declarative setup (`/admin/config/history`). App-only settings, such as Appearance, aren't in it.

---
title: Orchestrator
sidebar_label: Orchestrator
description: The Orchestrator is the assistant built into Osaurus. It answers questions about the app, changes settings for you, creates specialist assistants, and hands them work.
---

# Orchestrator

The **Orchestrator** is the [agent](/glossary#agent) built into Osaurus, and every new chat starts with it. Think of it as a helpful front desk: ask it about Osaurus, have it change a setting, or give it a job and it passes the job to the right specialist agent. You don't need to set anything up to use it.

## Get started

1. Press **`⌘;`** to open a chat. New chats start with the Orchestrator.
2. Ask it something, like *"What can you do?"* or *"Create a research agent that can search the web."*
3. If it wants to change something, it shows an [approval](/glossary#approval) card describing the change. Click **Allow** to go ahead, or **Deny** to cancel.

To customize it, open **Settings… (`⌘ ,`) → Orchestrator**.

## What it does

The Orchestrator has two jobs.

**1. Explain and set up Osaurus.** It answers questions using your app's real current settings and the guide that comes with your version of Osaurus. When you ask for a change, it works out exactly what will change, shows you, and only makes the change after you approve.

**2. Hand work to specialists.** For real tasks — writing code, researching, editing files, making pictures — it passes the work to one of your own agents, or to an agent a teammate shared with you. Agents doing work for another agent are called [subagents](/glossary#subagent). It can run several at once, then brings their answers and any files they made back into your chat. If you don't have the right specialist yet, it can create one first, in the same reply.

### What it doesn't do itself

On purpose, the Orchestrator doesn't do hands-on work. It can't run code, use the [Sandbox](/glossary#sandbox), drive a browser or other apps, make pictures or video, or use the [Apple Apps](/apple-apps) (Calendar, Mail, and so on). Those belong to agents you create, which it hands work to. The one exception: it can **read** its Working Folder.

## Things to ask

- *"What's set up right now?"* or *"Change a setting for me."*
- *"Create a research agent with web search and switch to it."*
- *"Hand this to my coding agent and summarize the result."*
- *"Give my Planner agent access to Calendar and Reminders."*
- *"Start my new chats with Coder."*
- *"Export my setup as a template."*

## Working Folder {/* #working-folder */}

A [Working Folder](/glossary#working-folder) is a folder on your Mac that an agent may use. To give the Orchestrator one, click **Folder** in the message box of an Orchestrator chat, or go to **Settings… → Orchestrator → Working Folder**.

With a folder set, the Orchestrator can **look through and read** it — see what's there, open a file a specialist wrote, check a result. It never changes files, runs commands, or undoes changes there.

Agents it hands work to that **don't have a Working Folder of their own** work in the Orchestrator's folder for that job, and they *can* make changes. That way their finished files land where you can find them. Agents that have their own folder use theirs.

## Handing work to other agents

Every agent you create is automatically added to the Orchestrator's list of **Allowed subagents** (the agents it may hand work to). This happens however the agent was made: in Settings, by copying another agent, by importing one, or by restoring a backup.

You stay in control of that list:

- To stop the Orchestrator from using an agent, remove it under **Settings… → Orchestrator → Subagents → Allowed subagents**. Osaurus remembers that choice and won't add it back.
- Agents your teammates share through a [workspace](/glossary#workspace) join the list as the workspace loads. They're shown as *Name@Workspace*.

When a task needs a specialist, the Orchestrator:

1. Looks at your setup and the agents you have.
2. Creates or updates a specialist if needed, after showing you the plan and getting your approval. An agent it creates without a chosen model uses the Orchestrator's current model.
3. Hands off the job. If it hands several jobs off at once, they run together after **one** approval. It can also send a specialist a follow-up, or let a job run in the background.
4. Sums up the result and shows any files the specialist made as cards in your chat.

Each specialist works in its own separate chat, with its own model, instructions, tools, and safety settings. Specialists can't hand work on to other agents. See [Subagents](/subagents) for permissions, limits, and how Osaurus keeps local models from running out of memory.

## Settings

Open **Settings… (`⌘ ,`) → Orchestrator**. A strip at the top sums up what it does (*Configures Osaurus*, *Delegates work*, *Works in a folder*). **Restore Defaults** in the header resets its name and instructions.

| Section | What's there |
|---|---|
| **Identity** | Its **Name** (Osaurus by default) and an optional **System Prompt** — extra personality or instructions added to its built-in ones. See [system prompt](/glossary#system-prompt). |
| **Model & Generation** | **Model readiness** for the chat's current model, then **Temperature** ([how creative it is](/glossary#temperature)) and **Max Output Tokens** (how long its replies can be). To change the model itself, use the model button in the chat, or ask the Orchestrator to switch. |
| **Working Folder** | The folder it reads, and that specialists without their own folder work in. See [above](#working-folder). |
| **Subagents** | **Allowed subagents**, whether to ask before using your agents or teammates' agents, limits, and an advanced model setting. Also **Local Models & Memory**, with **Swap local models for subagents** and **Check memory before delegating**. See [Subagents](/subagents#local-models-and-memory). |
| **Delegations** | Every job handed off, **Sent** or **Received**, with a link to open that specialist's chat. |

Renaming the Orchestrator only changes how it's labeled. Its abilities stay the same.

## Troubleshooting

- **It won't edit my files or run code.** That's by design. Ask it to hand the job to one of your agents, or create one: *"Create a coding agent and have it do this."*
- **It keeps using an agent I don't want.** Remove that agent from **Allowed subagents** in **Settings… → Orchestrator → Subagents**.
- **I can't reach it from another app or my phone.** The Orchestrator only works inside the Osaurus app. Share one of your own agents instead.

---

## Under the hood

### Configuration tools

The Orchestrator uses three compact built-in [tools](/glossary#tool):

| Tool | Purpose |
|---|---|
| `osaurus_inspect` | Read current state and schema-backed configuration details |
| `osaurus_config` | Plan and apply a [YAML/JSON](/glossary#json-yaml) desired-state change after review |
| `osaurus_help` | Read the product guide bundled with your installed version |

`osaurus_config` uses the same planner and applier as the CLI and [loopback](/glossary#loopback) HTTP API. The approval card shows the calculated change before anything is written, and completion claims are checked against the real apply result. It can also hand out Apple apps — setting `capabilities.apple_apps` on an existing agent or a new one — and adds a risk line to the plan when Mail, Messages, or Shortcuts are involved.

Delegation uses `spawn_agent`. Several calls in one message run as **one wave** behind a single approval; a worker can be continued, asked a follow-up, or run in the background. Child `share_artifact` files are surfaced in the parent chat.

### Allowed-subagents seeding

Every custom-agent creation path adds the new agent to **Allowed subagents**: creating or duplicating an agent in the UI, applying a declarative configuration, importing an agent bundle, or restoring a backup. Existing installs are seeded once. If you later remove an agent from the list, Osaurus preserves that decision; it doesn't refill an intentionally empty list. Shared agents are addressed as `Name@Workspace`.

### Declarative configuration

The built-in definition remains protected, and the Orchestrator never gets Sandbox access. Your name, persona, and delegation choices are user configuration and can be changed or exported. To rename it declaratively:

```yaml
default_agent:
  name: Jarvis
```

`name: null` restores "Osaurus". The name is cosmetic — tools and behavior are unchanged.

The declarative `new_chat_agent` field selects the agent for new chats (the older `active_agent` name is still accepted). It doesn't redirect the current turn; current-turn specialist work uses `spawn_agent`.

The Working Folder is set in the app only; it isn't part of the declarative document.

For repeatable setup across Macs, export the full desired state and keep it in source control without its secrets:

```bash
osaurus config export > osaurus-config.yaml
osaurus config plan osaurus-config.yaml
osaurus config apply osaurus-config.yaml
```

[Declarative configuration →](/configuration#declarative-configuration)

### Scope and security

- **In-app only.** The Orchestrator is never exposed on external surfaces: the agent run and dispatch HTTP endpoints reject it with `built_in_agent_not_exposable`. Only your saved custom agents are reachable over HTTP, plugins, or schedules.
- **No hands-on writes.** Its tool surface can read its Working Folder (`file_read`, `file_search`) and excludes writes, shell, Sandbox, browser, computer-use, media, and Apple Apps tools by construction.

---

**Related:**

- [Agents](/agents) — create and configure specialists
- [Subagents](/subagents) — allowed subagents, permissions, limits, and memory
- [Workspaces](/workspaces) — share agents with teammates and use theirs
- [Configuration](/configuration) — declarative YAML/JSON, CLI, and loopback API
- [Tasks](/agent-loop) — tools, folders, Sandbox, and artifacts

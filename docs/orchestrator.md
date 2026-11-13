---
title: Orchestrator
sidebar_label: Orchestrator
description: The Orchestrator is the assistant built into Osaurus. It answers what it can, and routes everything else — settings changes to the Configurator, new workflows to the Architect, and real work to your saved workflows, your agents, and four built-in helpers.
---

# Orchestrator

The **Orchestrator** is the [agent](/glossary#agent) built into Osaurus, and every new chat starts with it. It's named **Osaurus** unless you rename it. Think of it as a front desk: ask it anything, and it either answers you itself or passes the job to whoever does that kind of work best. You don't need to set anything up to use it.

For example, ask *"What's on my calendar tomorrow, and draft a reply to Sam's last email"*. The Orchestrator hands the calendar part to Planner and the email part to Courier, then shows you both answers in the same chat.

## Get started

1. Press **`⌘;`** to open a chat. New chats start with the Orchestrator.
2. Ask it something, like *"What can you do?"*, *"Turn off follow-up suggestions"*, or *"Research the best travel cribs and give me three options."*
3. If your request changes a setting, a card shows exactly what will change. Click **Apply Changes** to go ahead, or **Cancel**.
4. If it hands work to an agent or a helper, a card shows that work in the chat, and the answer comes back into the conversation.

To customize it, open **Settings → Agents → Orchestrator**. (Settings is the gear at the bottom of the narrow strip on the left edge of the window, or press `⌘ ,`.)

## What it does with your request

You never have to name a tool, an agent, or a workflow. If you do name one, your choice wins.

| You ask | Who handles it |
|---|---|
| A question it can answer from what it knows or what's in the chat | The Orchestrator answers directly. Nothing runs. |
| Something about Osaurus itself: where a setting is, what's set up, or a change | The [Configurator](/glossary#configurator), a built-in helper that works behind the chat. It answers, or shows you a change card and waits for **Apply Changes**. |
| A task one of your saved [workflows](/glossary#workflow) does | The Orchestrator runs that workflow and fills in its form from your message. Only workflows marked **Osaurus can run this for you** are offered. |
| Hands-on work: the web, your files, a website, code, your calendar or mail | One of your agents, or one of the built-in [helpers](#built-in-helpers). |
| Something new that takes several steps, with no workflow for it yet | The [Architect](/glossary#architect) sketches a small workflow, runs it in the chat right away, and offers to keep it. |
| *"Build me a workflow that…"* | The Architect, which designs and tests a workflow with you. See [Build a Workflow](/workflows-build). |

If it isn't sure where a request should go, it asks you one question first.

### Built-in helpers {/* #built-in-helpers */}

Four helpers come with Osaurus. Each does one kind of hands-on work, so the Orchestrator can get real work done before you've made any agents of your own.

| Helper | What it does | Good to know |
|---|---|---|
| **Research** | Searches the web and reads pages, then answers with sources | Searches leave your Mac and go to a web search service. See [Web Search](/web-search). |
| **Files** | Reads, searches, writes, and edits files in this chat's Working Folder | Pick a folder with **Folder** in the message box first. |
| **Browser** | Opens websites, clicks, types, and reads pages, including sites you're signed in to | It asks before anything sensitive. |
| **Code** | Writes and runs code in the [Sandbox](/glossary#sandbox), a sealed-off area on your Mac | Needs macOS 26 or later. It starts the Sandbox the first time it's used. |

Reading your Downloads folder or Notes is Keeper's job, not the Files helper's.

### What it doesn't do itself

On purpose, the Orchestrator does no hands-on work. It doesn't read or write files, search the web, run code, use the Sandbox, drive a browser or other apps, make pictures, or use the [Apple Apps](/apple-apps) (Calendar, Mail, and so on). It doesn't change settings itself either; the Configurator does, after you approve. All of that goes to your agents, the helpers, or the Configurator.

## Things to ask

- *"What's set up right now?"* or *"Where's the memory setting?"*
- *"Switch my default model to the one I downloaded yesterday."*
- *"Run Meeting Prep for my 3 pm."* (a workflow marked **Osaurus can run this for you**)
- *"Have Planner find a free hour on Thursday."*
- *"Create a research agent with web search, then have it summarize this article."*
- *"Every weekday at 8, run Morning Brief."* (see [Automations](/automations))
- *"Start my new chats with Planner."* Say *"back to Osaurus"* to undo it.
- *"Make me an agent from the Cloud Agent template that tracks invoices."* (works with [agent templates](/agent-templates) available to the Orchestrator)
- *"What's running right now?"*

## Working Folder {/* #working-folder */}

A [Working Folder](/glossary#working-folder) is a folder on your Mac that an agent may use. To give the Orchestrator one, click **Folder** in the message box of an Orchestrator chat, or go to **Settings → Agents → Orchestrator → Working Folder**.

The Orchestrator never opens the folder itself. It's where delegated work lands. Agents it hands a job to that **don't have a Working Folder of their own** work in this folder for that job, and they *can* make changes there. The **Files** helper works there too. That way, finished files end up where you can find them, and the answer names the files that were written. Agents that have their own folder use theirs.

Your folder is never handed to someone else's agent. Agents a teammate shares with you run on their Mac and can't see your files; the Orchestrator puts what they need into the request instead.

## Handing work to your agents

The Orchestrator may hand work to any agent on its **Allowed subagents** list. Every agent you create joins that list automatically, however you made it. An agent handling work for another agent is called a [subagent](/glossary#subagent).

- To see or change the list, go to **Settings → Agents → Delegation**. You can also get there from **Settings → Agents → Orchestrator → Allowed Subagents and Limits**.
- To stop the Orchestrator from using an agent, remove it from **Allowed subagents**. Osaurus remembers that and won't add it back.
- No agents yet? **Create starter agents** on the same page makes the starter team of [teammates](/glossary#teammate): **Planner** (Calendar and Reminders), **Courier** (Mail), **Keeper** (Downloads and Notes), **Scout** (web research), and **Builder** (one project folder, on Macs with developer tools).
- Agents your teammates share through a [workspace](/glossary#workspace) join the list as the workspace loads. They're shown as *Name@Workspace* and run on your teammate's Mac.

If you don't have the right agent yet, ask for one: *"Create a research agent and have it summarize X."* The Configurator creates it after you approve, and the Orchestrator hands it the job in the same reply. A new agent without a chosen model uses the Orchestrator's current model.

Each agent works in its own separate chat, with its own model, instructions, tools, and safety settings. See [Subagents](/subagents) for permissions, limits, and how Osaurus keeps local models from running out of memory.

## Asking for things that run on their own

Ask for something that should happen on a schedule, when a folder changes, or when a web service calls in, and the Configurator sets up an [automation](/automations). It picks what the automation runs in this order:

1. A saved workflow that already does the job.
2. A new workflow, built by the Architect, once you've kept it.
3. One of your agents, for open-ended work (web, files, apps).
4. Plain instructions, for a simple text task like a daily quote. No agent is needed.

Automations never run the Orchestrator itself, so a web service can never change your settings.

## Settings

**Settings → Agents → Orchestrator**:

| Section | What's there |
|---|---|
| **Identity** | **Orchestrator Name** (Osaurus by default), **Orchestrator Avatar** (your own picture or a dino), and **System Prompt**: extra personality or instructions added to its built-in ones. See [system prompt](/glossary#system-prompt). |
| **Model & Generation** | **Model Readiness** for the chat's current model (with a suggestion when its [context window](/glossary#context-window) is small), then **Temperature** ([how creative it is](/glossary#temperature)) and **Max Output Tokens** (how long its replies can be). To change the model itself, use the model button in the chat. |
| **Working Folder** | The folder delegated work lands in. See [above](#working-folder). |
| **Subagents** | **Allowed Subagents and Limits**, which opens **Settings → Agents → Delegation**. |
| **Delegations** | Every job handed off, **Sent** or **Received** (jobs a teammate's Orchestrator asked one of your shared agents to do), with **Open Chat**. |
| **Danger Zone** | **Restore Defaults** puts back its name, picture, and instructions. |

**Settings → Agents → Delegation** holds **Allowed subagents**, **Create starter agents**, the **Permission** settings, **Limits**, and **Local Models & Memory**. See [Subagents](/subagents).

**Settings → Configurator** has **Extra Instructions**, **Configurator Model** (leave it unset to use the Orchestrator's model), and **Temperature**.

Renaming the Orchestrator only changes how it's labeled. Its abilities stay the same.

## Long chats stay quick

The Orchestrator keeps a short running note for each chat: what you're after, what's been decided, and what's still open. It reads that note plus your last few messages, instead of the whole conversation. So "yes" or "the second one" still makes sense several messages later, and a long chat never slows down or needs compacting.

## Troubleshooting

- **It won't edit my files itself.** That's by design. Give the chat a Working Folder and ask again; the Files helper or one of your agents does the work.
- **It keeps using an agent I don't want.** Remove that agent from **Allowed subagents** in **Settings → Agents → Delegation**.
- **It didn't run my workflow.** Open the workflow on the **Workflows** page and turn on **Osaurus can run this for you** under **Who Can Start It**.
- **The Code helper won't start.** It needs macOS 26 or later for the Sandbox.
- **I can't reach it from another app or my phone.** The Orchestrator only works inside the Osaurus app. Share one of your own agents instead.

---

## Under the hood

### Tools

The Orchestrator's tool surface is fixed:

| Tool | Purpose |
|---|---|
| `configurator_handoff` | Pass the user's exact words to the Configurator, which answers or plans a change |
| `architect_handoff` | Build a small workflow (up to five steps) for a new multi-step request, run it in the chat, and offer to keep it |
| `run_workflow` | Run an installed workflow marked **Osaurus can run this for you**, an allowed agent, or a built-in helper (each runs as a one-step workflow with the message as its task) |
| `status` | Loaded model, workflow runs running or waiting, pending approvals, and the workflows `run_workflow` can run |
| `state` | Rewrite the chat's session state once per turn |
| `clarify` | Ask at most one question per turn, only when the route is unclear |

It never gets file tools (`file_read`, `file_search` included), shell, Sandbox, browser, computer use, media, Apple Apps tools, `prompt_working_folder`, or `spawn_agent`. Custom agents with delegation on still use `spawn_agent`; see [Subagents](/subagents).

The Configurator owns `osaurus_inspect`, `osaurus_help`, and `osaurus_config`. `osaurus_config` uses the same planner and applier as the CLI and [loopback](/glossary#loopback) HTTP API; the approval card shows the calculated change before anything is written, and completion claims are checked against the real apply result.

### Session state

Each turn's context is the Orchestrator's instructions, the session state, the last three exchanges, and the current one, capped at 8,000 tokens or a quarter of the model's context window, whichever is smaller. Older exchanges drop out instead of being summarized. When a turn ends without a `state` call, Osaurus asks the same model once more, without tools, to write it; if that fails, the previous state is kept and marked possibly stale. The state is saved with the chat and syncs to your other devices.

### Allowed-subagents seeding

Every custom-agent creation path adds the new agent to **Allowed subagents**: creating or duplicating an agent in the UI, applying a declarative configuration or agent template, importing an agent bundle or [Osaurus Bundle](/bundles), or restoring a backup. If you later remove an agent, Osaurus preserves that decision; it doesn't refill an intentionally empty list. Shared agents are addressed as `Name@Workspace`; removing one leaves a tombstone so it doesn't rejoin when re-shared.

An agent entry created with `orchestrator_spawnable: false` isn't added. The key is ignored when patching an existing agent, and a `delegation.spawnable_agents` list in the same document replaces the whole list. Agents on a [harness runtime](/harness-runtimes) are left out of the roster, and an agent flagged **Needs setup** is refused while a blocking item remains ([Agent Templates](/agent-templates#setup-checks)).

### Agent templates

`osaurus_config` `templates` lists templates marked **Available to the Orchestrator** under `agent_templates`. `plan` / `apply` with `template: "<name>"` bases the new agent on that template, with optional `overrides` for name, description, system prompt, and model.

### Declarative configuration

The built-in definition is protected. Your name, persona, and delegation choices are user configuration and can be changed or exported. To rename it declaratively:

```yaml
default_agent:
  name: Jarvis
```

`name: null` restores "Osaurus". The declarative `new_chat_agent` field selects the agent for new chats (the older `active_agent` name is still accepted). The Configurator is configured under `configurator`, and delegation under `delegation`. The Working Folder is set in the app only.

```bash
osaurus config export > osaurus-config.yaml
osaurus config plan osaurus-config.yaml
osaurus config apply osaurus-config.yaml
```

[Declarative configuration →](/configuration#declarative-configuration)

### Storage

Identity and the working folder are in `~/.osaurus/config/default-agent.json`, delegation settings in `~/.osaurus/config/agent-delegation.json`, and the Configurator's settings in `~/.osaurus/config/configurator.json`.

### Scope and security

- **In-app only.** The agent run and dispatch HTTP endpoints reject the Orchestrator with `built_in_agent_not_exposable`, and automations can't target it. Only your saved custom agents are reachable over HTTP, plugins, or automations.
- **No hands-on tools.** File, shell, Sandbox, browser, computer-use, media, and Apple Apps tools are excluded by construction (`ToolRegistry.orchestratorExcludedToolNames`).

---

**Related:**

- [Agents](/agents) — create and configure agents
- [Subagents](/subagents) — allowed subagents, permissions, limits, and memory
- [Workflows](/workflows) — tasks Osaurus remembers how to do
- [Workspaces](/workspaces) — share agents with teammates and use theirs
- [Configuration](/configuration) — declarative YAML/JSON, CLI, and loopback API
- [Working in Chat](/agent-loop) — tools, folders, Sandbox, and artifacts

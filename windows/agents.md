---
title: Agents on Windows
sidebar_label: Agents
description: Create and edit agents in Osaurus for Windows — the five-tab editor, abilities, permissions, templates, sharing, the Orchestrator, and handing work to other agents.
---

# Agents on Windows

An agent (a Dino) is an assistant with its own instructions, model, tools, and memory. Agents work as [Agents](/agents) describes on the Mac; this page covers where things are on Windows and what's different.

## Create an agent

- Click **+** next to **AGENTS** in the sidebar, or **Settings → Agents → Add agent**.
- Under **Start from a template**, pick a starting point (Assistant, Writer, Researcher, Coder, Productivity) or leave it blank.
- Give it a **Name**, and **Instructions** if you like, then click **Save**.

You can also ask the [Orchestrator](#the-orchestrator) to make one for you.

**Settings → Agents** lists your agents. Click the pencil to edit one. The **…** menu has **Duplicate**, **Save as template…**, **Share…**, and **Delete**. Right-clicking an agent in the sidebar gives the same, plus **New conversation** and **Conversations…**. Deleting an agent keeps its conversations in history.

Switch agents with **Ctrl+Alt+Up** and **Ctrl+Alt+Down**; **Ctrl+B** hides the sidebar.

An agent made from a template that still needs something (a model, a key) shows **Needs setup**. Click it, then **Set up now**.

## The editor

The editor has five tabs. **Save** saves; leaving with unsaved changes asks first.

| Tab | What's there |
|---|---|
| **Basics** | Avatar (a mascot, or **Upload image**), **Name**, **What it's for**, **Instructions**, **Model** (blank uses the chat's model), **Thinking** |
| **Abilities** | What it can do, as cards (below) |
| **Permissions** | When it asks you first, file edits and commands, spending limits for runs you're not watching, the folder for remote runs |
| **Chat** | Its greeting (or **Write a fresh greeting each time**), **Quick actions** shown on a new chat, and the [channels](/windows/channels) it can post to |
| **Advanced** | **Enabled**, temperature, longest reply, reasoning effort, **Save as template…** |

### Abilities

Each ability is a card with a switch; click the card to open its settings.

| Card | What it does |
|---|---|
| **Tools** | Lets it act, not just talk. **Which tools**: **Auto** picks what each turn needs; **Manual** offers only the tools you list. With Tools off, the other abilities are off too. |
| **Files & commands** | Where it works: its own [sandbox](/windows/sandbox), or a folder you attach. Includes **Contain its commands**, **Keep things running**, **Build its own tools**, **Commands per turn**, **Sites it may reach**, and **Secrets**. |
| **Team** | The agents it may hand tasks to. See [Handing work to other agents](#handing-work-to-other-agents). |
| **Web browser** | A browser of its own. See [Browser Use](/windows/browser). Off by default. |
| **Memory** | **Follow the global setting**, **Always on**, or **Off**, plus **Let it search memory** and **Use your About me**. See [Memory](/windows/memory). |
| **Skills** | **All enabled skills**, or **Only the skills I pick**. |
| **Private database** | Tables only this agent can read and write, with a storage limit. Off by default. |
| **Wake-ups** | Lets it book its own next run, within limits you set. Off by default. See [Schedules and Watchers](/windows/automation). |

### Permissions

**When should it ask you first?** follows your setting in **Settings → Behavior** unless you pick **Run tools without asking** or **Ask before each tool call** for this agent. **File edits and commands** can be set to **Ask every time** or **Deny** on their own. **Review** shows the decisions you've told it to remember.

**Spending when you're not watching** caps what it may spend on runs you aren't watching, such as a schedule: per month, per run, and tokens per run.

## Templates

A template is an agent as a file (`.osaurustemplate`) that you can share and make new agents from. The format is shared with the Mac, so templates move between the two. See [Agent Templates](/agent-templates).

- **Settings → Agents → Templates** lists them. **Use template** makes an agent; the page shows what it will create and what it still needs before you click **Create agent**.
- **Save as template…** on an agent saves it to your templates, and **Export file…** saves a file to share. Turn on **Sign it with your Osaurus ID** so others can tell it came from you.
- **Import file…**, or drop a file on the page, or open one from File Explorer. Osaurus shows what it contains before importing. Importing a newer version of one you have offers to replace yours or keep both.
- The **Orchestrator** switch on a template lets the Orchestrator make agents from it.

## Share an agent

**Share…** creates an invite link that lets someone else's Osaurus use the agent, running on your PC. Choose how long the link lasts (1, 7, or 30 days), then **Copy link**. If the agent isn't reachable from outside yet, click **Publish on the relay** first. **Links you have made** lists your links; **Revoke** stops one.

Agents others have shared with you are under **Paired remote agents** on the Agents page.

To share an agent with a workspace, use the workspace's **Share an agent**. See [Workspaces](/windows/workspaces).

## The Orchestrator

The Orchestrator is the built-in agent. It sets Osaurus up for you (providers, models, agents, settings), asking you to approve each change first, and hands other work to your agents. It doesn't read or change your files. See [Orchestrator](/orchestrator).

Its settings are in **Settings → Orchestrator** and save as you change them:

- **Identity**: its **Name** and a **System prompt** added to its built-in instructions.
- **Generation**: **Model**, **Temperature**, **Max output tokens**, **Reasoning effort**, **Thinking**.
- **Delegation**: the agents it may hand work to. New agents are added automatically; one you remove stays removed.

**Restore defaults** resets its name and prompt.

## Handing work to other agents

An agent can hand a self-contained task to another agent and get back a short summary; the other agent's reading never enters your chat. See [Subagents](/subagents).

Open the agent's **Team** card and tick who it may delegate to. Nothing ticked means it can't delegate. The list has three parts:

- **Your agents**, each running with its own instructions, model, and tools.
- **Shared workspace agents**, which run on a teammate's machine.
- **Bare models**, with no instructions or tools of their own, for a quick second opinion.

Each agent has three limits:

| Setting | Default | Range |
|---|---|---|
| **Tool rounds** | 12 | 1–40 |
| **Time budget (s)** | 300 | 15–1800 |
| **In parallel** | 3 | 1–8 |

Agents doing delegated work can't delegate further or ask you questions. Delegating asks for your approval like any other tool, following the agent's approval setting.

## Different from the Mac

- The editor is five tabs (Basics, Abilities, Permissions, Chat, Advanced), not a sidebar of sections.
- Manual tool selection is a list of tool names, not a picker.
- Delegation is turned on by ticking agents on the **Team** card; there's no separate switch, starter-agent button, or delegations log.
- Delegated work runs as one task per call; continuing an earlier task, background tasks, and batches aren't on Windows.
- The Orchestrator has no working folder and can't read files.
- Invite links have no QR code and no 1-hour option. There's no `.osaurus-agent` bundle export; use a template.
- Not on Windows: per-agent themes, Apple apps, Computer Use, and the startup-cost estimate.

---
title: Quick Start on Windows
sidebar_label: Quick Start
description: First launch of Osaurus for Windows. Answer a few questions, review the plan, meet your team of agents, and find your way around Settings.
---

# Quick Start on Windows

The first time you open Osaurus, a short setup asks five quick questions and builds a team of [agents](/glossary#agent) around what you do. It takes about two minutes, every question can be skipped, and nothing is set up until you've seen the whole plan and said yes.

## First launch

### Before the questions

The first screen introduces Osaurus. Click **Let's begin**, or **Skip, I'll look around** (see [Skipping setup](#skipping-setup)).

- The **Share anonymous usage data to help improve Osaurus** box is checked. It covers which steps people finish and what they pick, never what you type. Uncheck it if you'd rather not; you can change it later in **Settings → Privacy → Data**.
- On a PC that can run it, Osaurus starts downloading a small model, Raptor 0.7 4B, in the background, so it can read your answers on this PC. On a metered connection it asks first, with **Get it**. Click **Stop** if you don't want it. Setup never waits for it.

### The five questions

Use **Back** to change an earlier answer, and **Skip setup** at the top right to stop before the plan is applied.

1. **What should I call you?** Type your first name and press Enter. It stays on this PC.
2. **What fills most of your week?** Pick up to three areas; each one brings a teammate (an agent for that kind of work). The number keys pick them too. Nothing fits? Describe it under **Something else?** and click **Suggest** for teammates made from your words.
3. **Where do you keep your work?** Click **Choose a folder…** to point Osaurus at it, or **Not now**. Osaurus looks at file names and types only, and opens nothing. **Keep it as a project** (on by default) keeps chats about that folder together in one [project](/windows/projects).
4. **Anything you do on repeat?** Osaurus suggests routines it can run on a schedule, or when something changes in your folder. None is picked for you: each says what it may do without asking, so tick only the ones you want. You can pause any of them later in **Settings → Automations**.
5. **Where should the thinking happen?** Choose the [model](/glossary#model) your team runs on:
   - **Only on this PC** (Most private): nothing you write leaves this computer. One download, then it works offline. Offered when your graphics card has 12 GB of memory or more; Osaurus says which model your PC can run and how fast.
   - **Osaurus Cloud** (No download): runs on Osaurus's servers, so it's quick on any PC. Pay as you go, with your balance shown in each chat. Names, numbers and addresses it spots are swapped out before anything is sent.
   - **My ChatGPT or Claude plan** (Already paying?): sign in with the plan you already pay for, with the same swapping. Claude needs the Claude Code app on this PC.

   Osaurus preselects what fits your PC. Click **See the plan**. (**Decide later** works like skipping setup: see [Skipping setup](#skipping-setup).)

### The plan

**Here's what I'd set up for you** lists your team and everything else setup will do: the routines you ticked, your folder or project, and the model. Each line has a switch, so you can leave anything out. Before the plan, each routine you ticked is shown once more, in full, with **Confirm** or **Leave out**.

- **Show the exact changes** shows the exact settings Osaurus will apply. Nothing has changed yet.
- **Set it up** applies the plan.

Osaurus then makes your team, books the routines and gets the model ready: it downloads the local model, connects to Osaurus Cloud (creating an [Osaurus account](/glossary#osaurus-id) on this PC to hold your balance), or asks you to **Sign in with ChatGPT** or **Use Claude Code**. When it's done, click **Meet your team**, or **Continue anyway** to go in while a download or sign-in finishes. If you described something setup couldn't turn into a teammate or routine, it waits in a new chat with Osaurus, unsent.

:::tip[Back up your recovery phrase]
If setup created an Osaurus account for you, back up its [recovery phrase](/glossary#recovery-phrase) in **Settings → Account → Show recovery phrase**. It's the only way to move your account, and its credits, to another PC.
:::

### Skipping setup

**Skip, I'll look around**, **Skip setup** and **Decide later** forget your answers and ask just one thing: where the thinking should happen, so your first chat has a model that can answer. Click **Set it up** to use that choice, or **Decide later** (or skip again) to go straight in with nothing set up. You can add a model later in **Settings → Models**.

To go through setup again later, open **Settings → General → Behavior** and click **Run setup again**. You see every change before anything is applied.

## Your first chat

After setup you land in the main window. Your agents are listed down the left side, with their recent chats under them. **Osaurus** is the built-in agent, the [Orchestrator](/glossary#orchestrator): it sets things up and hands work to the right teammate.

- Type in the message box and press **Enter** to send; **Shift+Enter** starts a new line.
- Press **Ctrl+N** for a new chat with the agent you're on.
- Press **Ctrl+K** to search every chat.

[Chatting in Osaurus](/windows/chat) covers the window in full: picking a model, attaching files and folders, answering approvals, and the panel beside each chat.

## Settings

Click **Settings** at the bottom of the sidebar. Settings opens in the main window: pick a section on the left, then a page from the bar at the top. **Search settings** (Ctrl+F) finds any setting by name, and **Back to chat** returns to your conversation.

| Section | Pages |
|---|---|
| General | Appearance, Behavior, Notifications, Commands |
| Privacy | Data, Privacy filter |
| Models | Providers, Models, Images, Voice |
| Agents | Agents, Orchestrator, Architect, Configurator, Memory, Knowledge, History |
| Tools | Skills, MCP servers, Sandbox, Browser, Web search |
| Automations | Tasks, Watchers, Schedules, Channels |
| Devices | Connections, Mobile, Sync, Workspaces |
| Account | Account |
| Insights | Insights |

**About**, at the foot of the list, shows your version and every release's notes.

A few places to start:

- **Settings → Models → Models**: download [local models](/windows/models). The catalog shows what fits your PC.
- **Settings → Models → Providers**: add cloud models from other providers.
- **Settings → Agents → Agents**: create more [agents](/windows/agents) for different jobs. Or ask Osaurus in a chat: it can add a provider, download a model, or create an agent for you, and you approve each change first.

## Keyboard shortcuts

| Shortcut | Action |
|---|---|
| Ctrl+N or Ctrl+T | New chat with the current agent |
| Ctrl+Shift+N | New window |
| Ctrl+K (or Ctrl+H, Ctrl+E) | Search chats |
| Ctrl+Tab / Ctrl+Shift+Tab | Switch between recent chats |
| Ctrl+Alt+Up / Ctrl+Alt+Down | Previous / next agent |
| Ctrl+B | Narrow or widen the sidebar |
| Ctrl+Shift+B | This agent's browser |
| Ctrl+Shift+W | Workflows |
| Ctrl+Shift+Space | Dictate into the message box (when the microphone button shows; see [Voice](/windows/voice)) |
| Ctrl+F (in Settings) | Search settings |

## Next

- Learn the main window: [Chatting in Osaurus](/windows/chat).
- Turn a task you repeat into a [workflow](/windows/workflows).
- Connect other apps to Osaurus's local server: see the [HTTP API](/api). The server runs on `http://127.0.0.1:1337`.
- Use Osaurus from a terminal: see [CLI on Windows](/windows/cli).
- See what's different from the Mac app: [Windows and Mac](/windows/mac-differences).

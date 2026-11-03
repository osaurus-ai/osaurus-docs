---
title: Quick Start on Windows
sidebar_label: Quick Start
description: First launch of Osaurus for Windows — create your first assistant, give it a model, start chatting, and find your way around Settings.
---

# Quick Start on Windows

The first time you open Osaurus, a short setup creates your first assistant (Osaurus calls them Dinos, or [agents](/glossary#agent)) and gives it an AI model. It takes a minute, and you can change every choice later.

## First launch

Setup has three steps.

1. **Welcome.** Click **Get started**. The **Share anonymous usage data to help improve Osaurus** box is checked; uncheck it if you'd rather not. It never includes your chats, prompts, files, or keys, and you can change it later in **Settings → Data & privacy**.
2. **Your first Dino.** Pick what it should be great at: **Everyday helper**, **Research & writing**, or **Coding & development**. Give it a name and a look if you like, then click **Create your Dino**.
3. **A brain for your Dino.** Choose the [model](/glossary#model) it runs on:
   - **Osaurus Cloud**: hosted models billed to your Osaurus account, with nothing to download and no key. Click **Use Osaurus Cloud**. Osaurus creates an [account](/glossary#identity) for you if you don't have one yet.
   - **Run on this PC**: a free, private model that works offline. Offered when your graphics card has about 12 GB of memory. Click **Use this PC**; you can start chatting while the rest of the model downloads.
   - **Your own provider**: sign in with ChatGPT or Grok, paste an API key for OpenAI, Anthropic, or Gemini, or use Claude Code if it's installed. Choose **More** for the full list.

   Then click **Continue to Osaurus**. Or click **Set up later** and add a model from **Settings** whenever you're ready.

:::tip[Back up your recovery phrase]
If setup created an account for you, back up its [recovery phrase](/glossary#recovery-phrase) in **Settings → Account**. It's the only way to move your account, and its credits, to another PC.
:::

## Chat

The window has your agents down the left side and their conversations as tabs along the top.

- **Send** with Enter; Shift+Enter starts a new line.
- **Switch the model** with the model chip in the message box. **Manage** in the picker opens your models.
- **Start a new conversation** with Ctrl+T, or the **+** at the end of the tabs.
- **Find an old conversation** with Ctrl+H.

### Let an agent work on your files

1. Click **+** in the message box and choose **Attach workspace folder…**.
2. Pick a folder. The agent can now read the files in it and, with your OK, change them or run commands there.

When an agent wants to change a file or run a command, it asks first:

- **Allow once** (Enter) lets this one action through.
- **Always allow** remembers your answer for this file, folder, command, or tool. You can take it back in **Settings → Behavior**.
- **Deny** (Esc) refuses. Type a note first to tell the agent what to do instead.

Osaurus records the changes agents make to your files, so you can undo them. If it can't record a change, it tells you before the action runs.

## Settings

Click **Settings** at the bottom of the agent sidebar. Settings open as a tab named **Control center** that you can close like any other, and **Ctrl+F** searches them. This is the Windows counterpart of the Mac's **Settings…** window, and its sections are grouped like this:

| Group | Sections |
|---|---|
| App | Appearance, Behavior, Notifications, Data & privacy, Privacy filter |
| Intelligence | Providers, Models, Orchestrator, Agents, Memory |
| Capabilities | Skills, MCP servers, Commands, Sandbox, Browser |
| Automation | Tasks, Watchers, Schedules |
| Connectivity | Connections, Mobile, Account, Workspaces, Channels, Web search |
| Diagnostics | Insights |

A few places to start:

- **Models**: download local models. The **Catalog** tab shows what fits your PC, with a badge on each: **Runs well**, **Tight fit**, **GPU + RAM** (part of the model runs from system memory, more slowly), or **Too large**.
- **Providers**: add cloud models: sign in with ChatGPT, Grok, or OpenRouter; paste an API key for OpenAI, Anthropic, Gemini, Azure OpenAI, DeepSeek, or Venice AI; use Claude Code; or connect Ollama or any OpenAI-compatible endpoint.
- **Agents**: create more agents for different jobs. The [Orchestrator](/orchestrator), Osaurus's built-in agent, can also set Osaurus up for you: ask it to add a provider, download a model, or create an agent.

## Keyboard shortcuts

| Shortcut | Action |
|---|---|
| Ctrl+T or Ctrl+N | New conversation |
| Ctrl+Shift+N | New window |
| Ctrl+W | Close tab |
| Ctrl+Tab / Ctrl+Shift+Tab | Next / previous tab |
| Ctrl+1 … Ctrl+9 | Go to a tab |
| Ctrl+Alt+Up / Ctrl+Alt+Down | Previous / next agent |
| Ctrl+B | Show or hide the agent sidebar |
| Ctrl+H | Conversation history |
| Ctrl+Shift+B | This agent's browser |

## Next

- Connect other apps to Osaurus's local server: see the [HTTP API](/api). The server runs on `http://127.0.0.1:1337`.
- Use Osaurus from a terminal: see [CLI on Windows](/windows/cli).
- See what's different from the Mac app: [Windows and Mac](/windows/mac-differences).

---
title: Skills, Commands, and MCP on Windows
sidebar_label: Skills, Commands & MCP
description: Teach agents know-how with skills, save prompt shortcuts as commands, and connect MCP tool servers in Osaurus for Windows.
---

# Skills, Commands, and MCP on Windows

Three ways to extend what agents know and can do:

- **Skills**: know-how an agent loads when it needs it.
- **Commands**: your own `/` shortcuts that type a prompt for you.
- **MCP servers**: other programs whose tools agents can call.

## Skills

Skills work as [Skills](/skills) describes on the Mac, with the differences below. They're in **Settings → Skills**.

**Turn skills on.** A skill is available to agents only when its switch is on. Osaurus comes with six, all off to start: Research Analyst, Creative Brainstormer, Study Tutor, Productivity Coach, Content Summarizer, and Debug Assistant. Skills you create or import are on.

**Get more skills.**

- **Create** writes your own: a **Name**, a one-line **Description** (what the model sees when deciding to load it), and the **Instructions**.
- **Import → From file…** takes a `SKILL.md`, a `.json`, or a `.zip`.
- **Import → From GitHub…** reads a repository with a `.claude-plugin/marketplace.json`. Enter `owner/repo`, click **Find**, tick the skills you want, and click **Import selected**. Only the skills are imported.

**Use a skill.** Agents see the list of skills that are on and load one when a task calls for it; this needs the agent's **Tools** ability. To use one yourself, type `/` and its name in the message box, or click **+** and choose **Command or skill…** (with the box empty). The skill applies to that one message.

**Limit an agent's skills.** On the agent's **Abilities** tab, open **Skills** and choose **Only the skills I pick**.

**Different from the Mac:** six built-in skills, off to start; no tabs, export, or reference-file editing; agents can't edit skills themselves; Claude plugins aren't on Windows.

## Commands

A command is a prompt you use often, saved as a `/` shortcut. In **Settings → Commands**, click **Create** and give it a **Name** (which becomes `/name`), an optional **Description** and **Icon**, and the **Template** text.

Type `/` in the message box and pick it: its text goes into the box, and you carry on typing before you send. Nothing is sent until you do.

Osaurus also has `/clear` (new conversation), `/model` (switch the model), `/folder` (attach a workspace folder), and `/help`.

## MCP servers

An [MCP](/glossary#mcp) server is a program that offers tools, such as access to a service or your files. Agents can call its tools like any others. They're in **Settings → MCP servers**.

### Add a server

Click **Add server**, then fill in:

- **Id**: a short name, used as the start of each tool's name. It can't be changed later.
- **Name**: shown in the list.
- **Transport**: **stdio** for a program on your PC, or **http** for a server at a web address.

**For stdio**, enter the **Command** (such as `npx`), its **Arguments**, and any **Environment** variables, then choose where it runs:

- **This PC**: with your Windows account's access to your files and apps. Only for a server you trust.
- **The sandbox**: each agent that uses it gets its own copy, running in that agent's Linux home in the [sandbox](/windows/sandbox). Linux commands (`npx`, `uvx`, `python3`) work there; Windows paths don't. Its tools are available only while the sandbox is on.

**For http**, enter the **URL**. For a server that signs you in, set **Authentication** to **OAuth**: after saving, click **Sign in** on its row to finish in your browser. For a key or token, add it under **Headers**.

List the names of any secret environment variables or headers under **Secret keys**: they're stored encrypted and never shown again.

Click **Save**. The row shows **Connected · N tools** when it works.

### Choose its tools

Expand **Tools** on a server's row to turn single tools on or off. For an agent to call only some tools, open its **Tools** card, set **Which tools** to **Manual**, and list them.

Whether agents ask before calling a server's tools is set in **Settings → Behavior → Tool approvals** (**Run automatically** by default, or **Ask each time**), and each agent can override it on its **Permissions** tab.

A tool call that hears nothing from its server for 45 seconds stops; a server that reports progress can keep going for up to 10 minutes.

### Use Osaurus's tools from another app

The `osaurus mcp` command lets other MCP apps, such as an AI coding tool, call the tools of the servers you've added to Osaurus. See [`osaurus mcp`](/windows/cli#osaurus-mcp).

**Different from the Mac:** no built-in directory of services; no Test Connection; timeouts aren't adjustable; each tool is on or off rather than having its own ask/auto policy; stdio servers can run in the sandbox.

---

## Under the hood

- Skills are stored as `skills\<name>\SKILL.md` in the data folder. The system prompt lists the skills that are on; the model loads one with the `skill_load` tool.
- MCP tools are named `<server id>_<tool>`. With automatic tool selection, their full descriptions aren't sent with every message: the model sees their names and loads a tool's details when it needs it, which saves tokens with large servers.
- A sandboxed stdio server is one process per agent, running as that agent. Its environment variables reach it through a temporary file, never a command line.
- The local server also exposes your servers' tools over HTTP at `/mcp/tools` and `/mcp/call`.

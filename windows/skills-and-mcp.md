---
title: Skills, Commands, and MCP on Windows
sidebar_label: Skills, Commands & MCP
description: Teach agents know-how with skills, keep skills from GitHub up to date, save prompt shortcuts as commands, and connect MCP tool servers in Osaurus for Windows.
---

# Skills, Commands, and MCP on Windows

Three ways to extend what agents know and can do:

- **[Skills](/glossary#skill)**: know-how an agent loads when it needs it.
- **Commands**: your own `/` shortcuts that type a prompt for you.
- **MCP servers**: other programs whose tools agents can call.

## Skills

Skills work as [Skills](/skills) describes on the Mac, with the differences below. They're in **Settings → Tools → Skills**.

**Turn skills on.** A skill is available to agents only when its switch is on. Osaurus comes with six, marked **Built-in** and all off to start: Research Analyst, Creative Brainstormer, Study Tutor, Productivity Coach, Content Summarizer, and Debug Assistant. Skills you create or import are on.

**Get more skills.**

- **Create** writes your own: a **Name**, a one-line **Description** (what the model sees when deciding to load it), and the **Instructions**. **Details** holds an optional category, version, author, and keywords.
- **Import → From file…** takes a `SKILL.md`, a `.json`, or a `.zip`.
- **Import → From GitHub…** reads a repository with a `.claude-plugin/marketplace.json`. Enter `owner/repo` or the repository's address under **GitHub repository**, click **Find**, tick the skills you want (or **Select all not yet installed**), and click **Import selected**. Only the skills are imported. Each one is marked **GitHub**.
- **Paste it into a chat.** Paste a link to a skill into a chat with the Orchestrator and ask it to set the skill up. It shows what it found on a card. Nothing is installed until you approve the card.

**Use a skill.** Agents see the list of skills that are on and load one when a task calls for it; this needs the agent's **Tools** ability. To use one yourself, type `/` and its name in the message box, or click **+** and choose **Command or skill…** (with the box empty). The skill applies to that one message.

**Limit an agent's skills.** In the agent's editor, open **Skills** on the **Abilities** tab and choose **Only the skills I pick** instead of **All enabled skills**.

### Keep skills from GitHub up to date

A skill you imported from GitHub can check whether its repository has changed. Osaurus never updates a skill on its own, and nothing is downloaded until you ask.

1. In **Settings → Tools → Skills**, click **Check for updates** (it appears once you've imported a skill from GitHub). Each GitHub skill shows **Up to date**, **Update available**, or **Removed from repository** (your copy still works).
2. Click **Review** on a skill with an update. The review page shows what the update changes, file by file, the **Commits since your version**, and notes such as a script it adds or changes, or the agents whose instructions it changes.
3. If you edited the skill here (it's marked **Edited here**), the page also shows **Your changes** and asks **What to keep**:
   - **Take the update, and save my version as a new skill** (your copy is saved separately, switched off);
   - **Keep my version**;
   - **Take the update and drop my changes**.
4. Click **Update** (or **Update and keep my copy**, or **Keep my version**, depending on your choice) at the top of the page, or **Cancel**. A chat that already loaded the skill keeps the old text; its next load reads the new version.

To take every update at once, click **Update all** on the bar at the top. It skips skills you edited here, which each need a choice on their own page.

**Undo.** Right after an update, click **Undo** on the bar, or later choose **Undo last update** from the skill's **…** menu. It puts back the skill exactly as it was.

**Stop updating one skill.** Choose **Don't update this skill** on its review page or its **…** menu. **Take updates again** turns it back on.

**Under Sources**, each repository you imported from shows its branch, how many skills came from it, and when it was last checked. **Check weekly** checks it once a week; it's off by default. **GitHub access token** lets you add a token, which raises GitHub's limit on how often Osaurus can check. Osaurus sends it only to GitHub, and a token that can read public repositories is enough.

A skill imported before Osaurus 1.0.4 shows **Not tracked yet**. Click **Compare** once to start following it: if it matches GitHub, it's tracked from then on; if not, the review shows the difference and asks what to keep.

**Different from the Mac:** six built-in skills, off to start; no tabs, export, or reference-file editing; agents can't edit skills themselves; Claude plugins aren't on Windows (importing one brings in only its skills).

## Commands

A command is a prompt you use often, saved as a `/` shortcut. In **Settings → General → Commands**, click **Create** and give it a **Name** (which becomes `/name`), an optional **Description** and **Icon**, and the **Template** text.

Type `/` in the message box and pick it: its text goes into the box, and you carry on typing before you send. Nothing is sent until you do.

Osaurus also has `/clear` (new conversation), `/model` (switch the model), `/folder` (attach a workspace folder), and `/help`.

## MCP servers

An [MCP](/glossary#mcp) server is a program that offers tools, such as access to a service or your files. Agents can call its tools like any others. They're in **Settings → Tools → MCP servers**.

### Add a server

Click **Add server**, then fill in:

- **Name**: shown in the list. Osaurus makes the server's short id from it.
- **Runs**: **On this PC, as a command** for a program, or **At a URL** for a server on the web.

**For a command**, enter the **Command** (such as `npx`), then **Add an argument** and **Add a variable** for its arguments and environment variables, one row each. Then choose where it runs, under **Run in**:

- **This PC**: with your Windows account's access to your files and apps. Only for a server you trust.
- **The sandbox**: each agent that uses it gets its own copy, running as that agent in the [sandbox](/windows/sandbox). Linux commands (`npx`, `uvx`, `python3`) work there; Windows paths don't. Its tools are available only while the sandbox is on, and the page warns you if it isn't.

**For a URL**, enter the **URL**. For a server that signs you in, set **Authentication** to **OAuth**: after saving, click **Sign in** on its row to finish in your browser. Some services, like Slack, need a **Client ID** and **Client secret** from an app you create with them; the page shows the address to give them. For a key or token, **Add a header**.

Click the lock beside a variable or header to make it secret: it's stored encrypted and never shown again once saved.

Click **Save**. The row says where the server runs (**On this PC**, **In the sandbox**, or **Remote**) and shows **Connected · N tools** when it works.

**Or paste it into a chat.** Paste a server's config or install command into a chat with the Orchestrator and ask it to add the server. It shows a card for you to approve. A server added this way that runs as a command runs in the sandbox; if this PC can't run the sandbox, the card says so and won't add it. The exception is a server that needs Docker: it runs on this PC, outside the sandbox, so the card leaves it unticked until you tick it.

### Choose its tools

Expand **Tools** on a server's row to turn single tools on or off. For an agent to call only some tools, open its **Tools** card, set **Which tools** to **Manual**, and list them.

Whether agents ask before calling a server's tools follows **Settings → General → Behavior → Tool approvals** (**Run tools without asking** by default, or **Ask before each tool**), and each agent can override it on its **Permissions** tab.

A tool call that hears nothing from its server for 45 seconds stops; a server that reports progress can keep going for up to 10 minutes. A very long result isn't cut off: the agent reads the rest page by page.

### Use Osaurus's tools from another app

The `osaurus mcp` command lets other MCP apps, such as an AI coding tool, call the tools of the servers you've added to Osaurus. See [`osaurus mcp`](/windows/cli#osaurus-mcp).

**Different from the Mac:** no built-in directory of services; no **Test Connections**; timeouts aren't adjustable; each tool is on or off rather than having its own ask/auto policy; servers can run in the sandbox.

---

## Under the hood

- Skills are stored as `skills\<name>\SKILL.md` in the data folder. The system prompt lists the skills that are on; the model loads one with the `skill_load` tool.
- A GitHub import records the commit it read and each file's Git blob hash under `skills\.sources\<skill id>\`, with the files as GitHub served them (the base every diff is drawn from) and the previous version for **Undo**. An update is any change to a file the import installs (`SKILL.md` and the files directly in `scripts/`, `references/`, and `assets/`); a declared version number isn't compared. The update applied is the exact download you reviewed.
- A check asks GitHub for the branch's latest commit with the last ETag, so an unchanged repository costs one request. Without a token GitHub allows 60 requests an hour. The token is kept in the encrypted database, never returned by the API, and sent only to `api.github.com` and `raw.githubusercontent.com` over https.
- MCP tools are named `<server id>_<tool>`. With automatic tool selection, their full descriptions aren't sent with every message: the model sees their names and loads a tool's details when it needs it, which saves tokens with large servers.
- A long tool result is kept, and the model reads the rest of it back with `file_read`.
- A server that runs on this PC starts directly rather than through `cmd.exe /c` (only a `.cmd` or `.bat`, such as `npx.cmd`, goes through cmd), so a command under a folder with spaces, such as `C:\Program Files`, starts.
- A sandboxed server is one process per agent, running as that agent. Its environment variables reach it through a temporary file, never a command line.
- The local server also exposes your servers' tools over HTTP at `/mcp/tools` and `/mcp/call`.

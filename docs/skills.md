---
title: Skills
sidebar_label: Skills
description: Ready-made playbooks your AI pulls in when it needs them — like research, organizing your calendar, or building a spreadsheet. Nine come built in, and you can create or import your own.
---

# Skills

A [skill](/glossary#skill) is a ready-made playbook that teaches your AI how to do a kind of task well — like researching a topic, sorting your calendar, or building a spreadsheet. Your agents pick up the right skill on their own when a conversation calls for it.

There's nothing to switch on. Osaurus comes with nine skills, and any skill you add is available to all your custom [agents](/glossary#agent) right away. The one exception is the [Orchestrator](/glossary#orchestrator), which sticks to helping you set up Osaurus and doesn't use skills.

## Get started

1. Open **Settings…** (`⌘ ,`) → **Skills** to see what's available.
2. Start a chat with one of your agents and ask for something — the agent finds and uses the right skill by itself.
3. To use a specific skill for one message, type `/` followed by its name in the message box (for example, `/web-researcher`).

### Built-in skills

| Skill | What it does |
|---|---|
| **Web Researcher** | Researches the web, checks facts across sources, and writes reports with citations |
| **Content Summarizer** | Reads web pages or files and turns them into clear summaries |
| **Mac Automator** | Controls and checks Mac apps using AppleScript (Apple's way of automating apps) |
| **Personal Organizer** | Manages calendar events, reminders, email, and messages |
| **Document Builder** | Creates spreadsheets and presentations you can download |
| **Workspace Assistant** | Reads, edits, searches, and saves changes to files in your [Working Folder](/glossary#working-folder) |
| **Data Keeper** | Keeps organized records across chats in the agent's private [database](/agent-db) |
| **Autonomous Scheduler** | Sets up repeating or delayed tasks that run on their own, with notifications |
| **Data Visualizer** | Draws charts and graphs from your data |

## How skills get picked

You don't need to assign skills. At the start of each chat, your agent gets a short list of every skill you have. When it needs one, it looks it up and reads the full instructions. This keeps chats fast, because the agent only reads the skills it actually needs.

A few things to know:

- **New skills show up in your next chat.** The list is set when a chat starts. A skill you add mid-chat can still be found by searching or with `/skill-name`, but it's only listed in new chats.
- **Typing `/skill-name` always works.** It gives the agent the skill's full instructions for that one message, no searching needed.
- **Good keywords help.** The agent finds skills by their name, description, and keywords (see [Creating your own](#creating-your-own)).

## Adding your own skills

### Importing from GitHub

Many people share skills on GitHub. To import them:

1. Open **Skills → Import → From GitHub**.
2. Enter the project's address (`github.com/owner/repo` or just `owner/repo`).
3. Browse the skills it offers and select the ones you want.
4. Click **Import Selected**.

Osaurus follows the open [Agent Skills](https://agentskills.io/) standard, so skills made for Claude work here too. Some GitHub projects also bring along schedules, slash commands, and [MCP](/glossary#mcp) connections — see [Claude Plugins](/claude-plugins).

### Importing from a file

Open **Skills → Import → From File** and pick a skill file (`.md`, `.json`, or `.zip`). Osaurus checks the file before saving it. If you already have a skill with the same name, it asks before replacing it.

### Creating your own

Open **Skills → Create Skill** and fill in:

| Field | What it's for |
|---|---|
| **Name** | A clear, descriptive name |
| **Description** | A one-line summary shown in the list — the agent also searches it |
| **Category** | Optional grouping, like "Development" or "Writing" |
| **Keywords** | Words someone would use when they need this skill, separated by commas — the most important field for being found |
| **Instructions** | The full guidance for the AI, written in plain text or Markdown |
| **Version** / **Author** | Optional details about the skill |

**Keywords are how the AI finds your skill.** The agent searches a skill's name, keywords, and description — not its instructions. Use the words you'd actually say when you need it ("summarize, tldr, key points" rather than "text processing").

Tips for writing instructions:

- Say clearly what the skill is for and how to approach it
- Include examples of what good results look like
- Spell out any steps or methods to follow
- Describe the format you want the answer in

### Adding reference files

You can attach files that come along whenever the skill is used — style guides, word lists, process notes, templates.

1. Edit a skill.
2. Add files to its `references/` folder.
3. Text files (like `.txt` and `.md`) up to 100 KB each are given to the AI with the skill.

## Letting the agent edit a skill

You can ask an agent to change one of your skills — for example, "switch my Release Notes skill from Canadian to American spelling." The agent shows you the exact change and a one-line reason in an [approval](/glossary#approval) card before saving anything.

- If the text it's looking for isn't in the skill, the agent tells you instead of guessing.
- Only skills you created or imported can be changed. Built-in skills and skills from plugins can't.

## Managing your skills

The Skills screen has three tabs:

- **All** — built-in, custom, and imported skills together.
- **Custom** — skills you created or imported yourself.
- **Claude Plugins** — installed Claude plugin bundles and the skills they brought.

| Action | How |
|---|---|
| **Edit** | Click a skill → **Edit**. Built-in skills can be viewed but not changed. |
| **Export** | Expand a skill → **Export** → JSON, Markdown, or ZIP |
| **Delete** | Click **Delete** on a custom skill. Built-in skills can't be deleted; plugin skills are removed by uninstalling their plugin. |

If you imported a full Claude plugin, manage it from **Skills → Claude Plugins**. Each entry shows how many skills, schedules, commands, and MCP connections it has, and lets you update, configure, view details, or uninstall it. See [Claude Plugins](/claude-plugins).

## A note on Methods

You may see "Methods" next to Skills in places like [Insights](/glossary#insights). A method is a **learned routine**: when an agent finishes a multi-step task successfully, it can save the steps so it can repeat them next time. Agents find methods the same way they find skills, so you don't need to manage them. For details, see [Methods](/methods).

## Troubleshooting

### My skill isn't being used

- Check the skill is listed in **Settings… → Skills**.
- Add **keywords** — they matter most when the agent searches for skills.
- Make the description say clearly when to use the skill.
- Start a new chat — skills added mid-chat are only listed in the next one.
- Type `/skill-name` to use it directly for one message.
- Check the agent's tools are on and set to automatic. Skills don't work when an agent's tools are off or picked by hand, and the Orchestrator doesn't use skills.

### GitHub import fails

- Make sure the project is public, or that you have access to it.
- Check that the project includes the file `.claude-plugin/marketplace.json`.
- If GitHub says you've made too many requests, wait until the time shown in the error. GitHub allows 60 requests an hour without signing in.

### The AI seems to ignore a skill's instructions

- Make the instructions clearer and more specific.
- Make the description and keywords more specific so the right skill is found.
- Be more explicit in your message.

### A skill file won't import

- `.md` files: check the details block at the top is between `---` lines and formatted correctly.
- `.zip` files: `SKILL.md` must be at the top level or inside one named folder.
- `.json` files: check the file isn't damaged or cut off.

---

## Under the hood

### Discovery and loading

Each chat session's [system prompt](/glossary#system-prompt) carries a **capabilities manifest** listing every installed skill (alongside tools and methods). Full instructions aren't injected up front. When the agent needs expertise it hasn't loaded, it searches the catalog with `capabilities_discover` and pulls the matching skill's instructions into the session with `capabilities_load`.

The manifest is frozen when the chat starts, which keeps the prompt cache-stable. `/skill-name` is the deterministic path: it injects the skill's full instructions for one message without depending on search.

Capability search indexes the skill's name, keywords, and description, not its instructions. Every built-in skill ships a rich keyword list for this reason.

Skills require **Auto** tool mode with tools enabled; Manual tool mode doesn't use the skill library. The Orchestrator's capability search and loading are restricted to its own configuration tools, so it never loads skills.

When a skill stored on disk loads, its instructions start with the skill's directory path (`~/.osaurus/skills/{skill-name}/`), so relative references like `references/style.md` or `assets/template.docx` resolve against the skill rather than the chat's Working Folder. Built-in skills have no directory and get no anchor.

### Reference files

References load on both delivery paths: `/skill-name` includes them in full, and model-initiated loading includes them up to a size budget. Past the budget, remaining files are named in an omission note so the AI knows they exist.

### The `update_skill` tool

Agent edits use the `update_skill` tool: a find-and-replace on the skill's instructions, saved to its `SKILL.md`.

- Each `find` must match exactly once unless the edit sets `all`.
- Its permission defaults to **Ask**.
- `update_skill` is loaded on demand (and pre-loaded when you invoke one of your skills with `/skill-name`). It isn't available over the HTTP [API](/glossary#api) or to [subagents](/glossary#subagent).

### Import formats

| Format | What it is |
|---|---|
| `.md` / `SKILL.md` | Agent Skills format — Markdown with [YAML](/glossary#json-yaml) frontmatter |
| `.json` | Osaurus export format |
| `.zip` | A complete package: `SKILL.md` + optional `references/` and `assets/` folders |

Any GitHub repo with a `.claude-plugin/marketplace.json` manifest can be imported. Repos using the full directory-based Claude plugin layout can bring schedules, slash commands, and MCP providers along with their skills.

Imports are validated before saving: ZIP archives are bounded in size, file count, and path depth; entries can't escape the archive root; and importing over an existing skill asks for an explicit replace confirmation. In a `.zip` with several `SKILL.md` files, the shallowest wins and the rest are reported.

### File format

```markdown
---
name: Web Researcher
description: Live web research with source retrieval and cited reports
category: Research
version: 1.0.0
author: Your Name
---

# Web Researcher

You are a web researcher specializing in thorough, well-sourced research.

## Methodology

1. Understand the research question
2. Search the web for candidate sources
3. Retrieve and evaluate each source
4. Synthesize findings
5. Present with citations
```

Skills are stored as directories at `~/.osaurus/skills/{skill-name}/SKILL.md`, with optional `references/` and `assets/` subfolders.

---

**Related:**

- [Agents](/agents) — agent settings control tools; skills come from the shared library
- [Claude Plugins](/claude-plugins) — import skills, schedules, commands, and MCP servers from GitHub
- [Tools & Plugins](/tools) — what tools exist and how they're built
- [Methods](/methods) — the developer view of capability discovery and scoring
- [Agent Skills Specification](https://agentskills.io/) — the open format Osaurus follows

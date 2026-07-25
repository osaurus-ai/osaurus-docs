---
title: Skills
sidebar_label: Skills
description: Reusable expertise your AI pulls in on demand — one universal library, no toggles, no per-agent setup. Built-ins included; create or import your own.
---

# Skills

Skills are reusable packages of expertise — on-demand specialists your AI can pull in: a research methodology, a debugging framework, a document workflow. The library is **universal**: installing or creating a skill makes it available to every custom agent automatically, and the agent discovers and loads the relevant ones as the conversation calls for them.

There are no enable/disable toggles and no per-agent skill assignment — the library *is* the configuration. (The built-in Osaurus configuration agent is the one exception; it doesn't use skills.)

## Quick start

Osaurus ships with nine built-in skills, each teaching the AI a concrete workflow built on real Osaurus tools:

| Skill | What it does |
|---|---|
| **Web Researcher** | Live web research with source retrieval, cross-checking, and cited reports |
| **Content Summarizer** | Retrieve pages or files, then distill them into structured summaries |
| **Mac Automator** | Control and query Mac apps with AppleScript automation |
| **Personal Organizer** | Manage calendar events, reminders, email, and messages |
| **Document Builder** | Create spreadsheets and presentations, delivered as downloadable files |
| **Workspace Assistant** | Read, edit, search, and commit files in the mounted working folder |
| **Data Keeper** | Keep structured records across chats in the agent's private database |
| **Autonomous Scheduler** | Set up recurring or delayed self-running tasks with notifications |
| **Data Visualizer** | Render charts and graphs from attached, retrieved, or computed data |

To get started:

1. Open the Management window (`⌘ ⇧ M`) → **Skills** to browse the library
2. Start a chat — the AI discovers and loads relevant skills on demand
3. Or type `/skill-name` in the input bar to invoke a specific skill explicitly for a single message

## How skills get picked

Each chat session's system prompt carries a **capabilities manifest** listing every installed skill (alongside tools and methods). The full instructions aren't injected up front — when the agent needs expertise it doesn't have loaded, it searches the catalog with `capabilities_discover` and pulls the matching skill's instructions into the session with `capabilities_load`.

The manifest is frozen when the chat starts (this keeps the prompt cache-stable), so a skill added mid-conversation shows up in the *next* chat's manifest — though it's immediately reachable through discovery and `/skill-name`.

`/skill-name` is the deterministic path: it injects the skill's full instructions for one message without depending on search at all.

## Adding your own skills

### Importing from GitHub

Any GitHub repo with a `.claude-plugin/marketplace.json` manifest works:

1. **Skills → Import → From GitHub**
2. Enter the repo URL (`github.com/owner/repo` or just `owner/repo`)
3. Browse the available skills, select what to import
4. Click **Import Selected**

Osaurus follows the open [Agent Skills](https://agentskills.io/) specification, so anything that targets Claude Skills also works here. Repos using the full directory-based Claude plugin layout can bring schedules, slash commands, and MCP providers along with their skills — see [Claude Plugins](/claude-plugins).

### Importing from files

| Format | What it is |
|---|---|
| `.md` / `SKILL.md` | Agent Skills format — Markdown with YAML frontmatter |
| `.json` | Osaurus export format |
| `.zip` | A complete package: `SKILL.md` + optional `references/` and `assets/` folders |

**Skills → Import → From File** → pick the file. Imports are validated before saving: ZIP archives are bounded in size, file count, and path depth; entries can't escape the archive root; and importing over an existing skill asks for an explicit replace confirmation first.

### Creating your own

**Skills → Create Skill**:

| Field | What it's for |
|---|---|
| **Name** | A clear, descriptive name |
| **Description** | One-line summary shown in the list — and part of the search index |
| **Category** | Optional grouping ("Development", "Writing") |
| **Keywords** | Comma-separated discovery terms — the most important field for findability |
| **Instructions** | The full guidance for the AI in Markdown |
| **Version** / **Author** | Metadata |

**Keywords are how the AI finds your skill.** Capability search indexes the skill's name, keywords, and description — not its instructions. Add the words a user would actually say when they need it ("summarize, tldr, key points" rather than "text processing"). Every built-in skill ships a rich keyword list for exactly this reason.

Tips for the instructions themselves:

- Be specific about purpose and approach
- Include examples of expected behavior
- Define any frameworks or methodologies to follow
- Specify output formats when relevant

### Reference files

Add files that load alongside the skill whenever it activates — style guides, terminology, process docs, templates.

1. Edit a skill
2. Add files to its `references/` folder
3. Text files (`.txt`, `.md`, etc.) are loaded into context (≤100 KB each)

References ride along on both delivery paths: `/skill-name` invocation includes them in full, and model-initiated loading includes them up to a size budget — past it, remaining files are named in an omission note so the AI knows they exist.

## Managing the library

The Skills view groups the library by source — **All**, **Built-in**, **Yours**, and **From Plugins**:

| Action | How |
|---|---|
| **Edit** | Click a skill → **Edit**. Built-in skills are read-only but viewable. |
| **Export** | Expand a skill → **Export** → JSON, Markdown, or ZIP |
| **Delete** | **Delete** on a custom skill. Built-ins can't be deleted; plugin skills are removed by uninstalling their plugin. |

When you've imported a full Claude plugin, an **Installed Plugins** card at the top of the view shows each plugin with chips for its skill/schedule/command/MCP counts and a one-shot **Uninstall**. See [Claude Plugins](/claude-plugins).

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

## A note on Methods

You may see "Methods" mentioned alongside Skills in places like Insights and Capabilities. Methods are **learned workflows** — when an agent successfully completes a multi-step task, it can save the sequence of steps as a method that future tasks reuse. They're discovered through the same capability search that finds skills, so you don't have to think about them as a user. For the scoring math, see [Methods](/methods).

## Troubleshooting

### Skills don't appear in chat

- Verify the skill appears in the library (Management window → Skills)
- Add **keywords** — the capability search indexes name + keywords + description, and keywords carry the most weight
- Make the description clearly state when to use the skill
- Start a new chat — the capabilities manifest is frozen per session, so skills added mid-conversation aren't listed until the next chat (they remain reachable via discovery)
- Type `/skill-name` to invoke it deterministically for one message
- Skills require **Auto** tool mode with tools enabled; Manual tool mode and the built-in configuration agent don't use the skill library

### GitHub import fails

- Ensure the repo is public or you have access
- Verify the repo has `.claude-plugin/marketplace.json`
- If GitHub rate-limits the request, wait for the reset time shown in the error — unauthenticated requests are capped at 60/hour

### Skill instructions seem ignored

- Review the instructions for clarity and specificity
- Make the description and keywords more specific so discovery matches the right queries
- Try being more explicit in your prompt

### Import format errors

- `.md` files: ensure valid YAML frontmatter between `---` markers
- `.zip` files: `SKILL.md` must be at the root or in a named folder (if several are present, the shallowest wins and the rest are reported)
- `.json` files: validate JSON syntax

---

**Related:**

- [Agents](/agents) — agent configuration scopes tools; skills come from the shared library
- [Claude Plugins](/claude-plugins) — import skills, schedules, commands, and MCP servers from GitHub
- [Tools & Plugins](/tools) — what tools exist and how they're built
- [Methods](/methods) — the developer view on capability discovery and scoring
- [Agent Skills Specification](https://agentskills.io/) — the open format Osaurus follows

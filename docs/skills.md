---
title: Skills & Methods
sidebar_label: Skills & Methods
description: Reusable AI capabilities — Skills package expertise, Methods capture learned workflows. Both are auto-selected via RAG search.
sidebar_position: 8
---

# Skills & Methods

Skills are reusable packages of instructions, context, and resources that give your AI specialized expertise — a research methodology, a debugging framework, a creative writing style.

Methods are similar but learned. When an agent figures out an effective sequence of tool calls, it saves that workflow as a method. Future tasks find and reuse it.

Both are **auto-selected via RAG search** before each message — no manual configuration needed.

## Quick start

Osaurus ships with 6 built-in skills:

| Skill | What it does |
|---|---|
| **Research Analyst** | Structured research with source evaluation and citation |
| **Creative Brainstormer** | Ideation and creative problem solving |
| **Study Tutor** | Educational guidance using the Socratic method |
| **Productivity Coach** | Task management and productivity optimization |
| **Content Summarizer** | Distill long content into concise summaries |
| **Debug Assistant** | Systematic debugging methodology |

To get started:

1. Open the Management window (`⌘ ⇧ M`) → **Skills**
2. Built-in skills are enabled by default — toggle any off you don't want
3. Start a new chat — relevant skills get loaded automatically when you ask the right kind of question

## How auto-selection works

Before every message, a **preflight RAG search** runs across all enabled skills, methods, and tools. It uses hybrid BM25 + vector matching to find the ones relevant to your query, then injects matching skill instructions and method bodies into the system prompt.

The search itself runs through your **Core Model** when configured (set in **Settings → General → Core Model**), and falls back to the active chat model when Core Model is unset. A small fast Core Model (`foundation` on macOS 26+, or `gemma-4-e2b-it-4bit`) keeps preflight cheap.

You control how aggressively it searches:

| Mode | Methods | Tools | Skills | Best for |
|---|---|---|---|---|
| `off` | 0 | 0 | 0 | Disabling auto-selection |
| `narrow` | 1 | 2 | 1 | Fastest responses, minimal context |
| `balanced` (default) | 3 | 5 | 2 | Most cases — good coverage at moderate cost |
| `wide` | 5 | 8 | 4 | Maximum coverage, larger prompts |

Set the mode in **Management → Settings → Capabilities**.

### Mid-conversation discovery

The agent can also expand its kit while a chat is in progress via two always-on tools:

| Tool | What it does |
|---|---|
| `capabilities_search` | Search methods, tools, and skills across all indexes in parallel |
| `capabilities_load` | Load a specific capability by ID into the active session |

Loading a method automatically loads its referenced tools and skills. So an agent that starts with research skills can pull in a "deploy to staging" method (and the tools that method uses) without you doing anything.

## Skills

### Importing from GitHub

Any GitHub repo with a `.claude-plugin/marketplace.json` manifest works:

1. **Skills → Import → From GitHub**
2. Enter the repo URL (`github.com/owner/repo` or just `owner/repo`)
3. Browse the available skills, select what to import
4. Click **Import Selected**

Osaurus follows the open [Agent Skills](https://agentskills.io/) specification, so anything that targets Claude Skills also works here.

### Importing from files

| Format | Description |
|---|---|
| `.md` / `SKILL.md` | Agent Skills format — Markdown with YAML frontmatter |
| `.json` | Osaurus export format |
| `.zip` | A complete package: `SKILL.md` + optional `references/` and `assets/` folders |

**Skills → Import → From File** → pick the file.

### Creating your own

**Skills → Create Skill**:

| Field | Description |
|---|---|
| **Name** | A clear, descriptive name |
| **Description** | One-line summary (used by the RAG search — make it specific) |
| **Category** | Optional grouping ("Development", "Writing") |
| **Instructions** | The full guidance for the AI in Markdown |
| **Version** / **Author** | Metadata |

Tips for instructions:

- Be specific about purpose and approach
- Include examples of expected behavior
- Define any frameworks or methodologies to follow
- Specify output formats when relevant

### Reference files

Add files that load into the AI's context whenever the skill is active. Useful for style guides, terminology, process docs, templates.

1. Edit a skill
2. Add files to its `references/` folder
3. Text files (`.txt`, `.md`, etc.) are loaded into context (≤100 KB each)

### Editing, exporting, deleting

| Action | How |
|---|---|
| **Edit** | Click a skill → **Edit**. Built-in skills are read-only but viewable. |
| **Export** | Right-click → **Export** → JSON, Markdown, or ZIP |
| **Delete** | Right-click → **Delete** (custom skills only) |
| **Disable** | Toggle the switch — disabled skills are excluded from RAG search |

### File format

```markdown
---
name: Research Analyst
description: Structured research with source evaluation
category: Research
version: 1.0.0
author: Your Name
---

# Research Analyst

You are a research analyst specializing in thorough, well-sourced research.

## Methodology

1. Understand the research question
2. Identify reliable sources
3. Evaluate source credibility
4. Synthesize findings
5. Present with citations

## Output format

Always include:
- Executive summary
- Key findings
- Source citations
- Confidence assessment
```

Skills are stored as directories at `~/.osaurus/skills/{skill-name}/SKILL.md`, with optional `references/` and `assets/` subfolders.

## Methods

Methods capture **learned procedures**. When an agent finishes a multi-step task, it can save the sequence of tool calls as a YAML workflow that future tasks can reuse.

### What's in a method

| Property | Description |
|---|---|
| `name` | Display name |
| `description` | Brief description (used by RAG search) |
| `triggerText` | Optional phrases that activate this method ("deploy to staging", "publish post") |
| `body` | The YAML workflow — step-by-step tool calls with logic between them |
| `toolsUsed` / `skillsUsed` | Auto-extracted from `body` so loading the method auto-loads its dependencies |
| `tokenCount` | Estimated cost for context budgeting |
| `version` | Bumped on every edit |

### Scoring

Methods are scored using a recency-weighted success rate:

```
score = successRate × recencyWeight
recencyWeight = 1.0 / (1.0 + daysSinceUsed / 30.0)
```

Each time a method is used, the system records a `MethodEvent` (`loaded`, `succeeded`, `failed`) and recalculates the score. High-quality, recently-used methods rank higher in search results — so the workflows that actually work float to the top automatically.

### Storage

Methods live in `~/.osaurus/methods/methods.sqlite` (encrypted with SQLCipher since 0.17.7).

### Browsing methods

There isn't a separate "Methods" tab — they live alongside skills in the same RAG index. To inspect what's been learned:

- **Management → Insights** shows when methods were loaded and whether they succeeded
- The methods database is browsable via SQLite tools if you really need to dig in

## Skills, Methods, Tools — what's the difference?

| | Skills | Methods | Tools |
|---|---|---|---|
| **Source** | You author them or import from a marketplace | Agents save them after successful runs | Built-in plugins, native plugins, MCP providers |
| **Content** | Markdown instructions + reference files | YAML sequences of tool calls | Code (Swift, Rust, Python via MCP) |
| **What they do** | Add domain knowledge / methodology | Replay a known-good workflow | Take action (read files, run commands, call APIs) |
| **Loaded by** | RAG search (preflight + on-demand) | RAG search (preflight + on-demand) | RAG search; loading a method auto-loads its tools |
| **Token cost** | The skill's instructions text | The method's YAML body | Just the tool's spec (description + parameters) |

## Troubleshooting

### Skills don't appear in chat

- Verify the skill is enabled (toggle is on)
- Make sure the skill's **description** clearly describes when to use it — RAG search keys off this
- Start a new chat session
- Try setting the search mode to `wide`

### GitHub import fails

- Ensure the repo is public or you have access
- Verify the repo has `.claude-plugin/marketplace.json`
- Check your network connection

### Skill instructions seem ignored

- Review the instructions for clarity and specificity
- Make the description more specific so RAG matches it on the right queries
- Try being more explicit in your prompt

### Import format errors

- `.md` files: ensure valid YAML frontmatter between `---` markers
- `.zip` files: `SKILL.md` must be at the root or in a named folder
- `.json` files: validate JSON syntax

---

**Related:**

- [Agents](/agents) — skills/methods/tools are auto-selected per agent per turn
- [Tools & Plugins](/tools) — what tools exist and how they're built
- [Agent Skills Specification](https://agentskills.io/) — the open format Osaurus follows

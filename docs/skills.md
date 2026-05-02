---
title: Skills
sidebar_label: Skills
description: Reusable expertise your AI can pull in on demand — a research methodology, a debugging framework, a writing style. Built-ins included; create or import your own.
sidebar_position: 8
---

# Skills

Skills are reusable packages of expertise. Think of them as on-demand specialists you can attach to your AI: a research methodology, a debugging framework, a creative writing style. When you ask a relevant question, the right skill loads itself — you don't have to remember what to enable.

Osaurus picks the right skills automatically before each message, so you mostly just enable the ones you want and forget about it.

## Quick start

Osaurus ships with six built-in skills:

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
2. Built-in skills are enabled by default — toggle off any you don't want
3. Start a new chat — relevant skills load themselves when you ask the right kind of question

## How skills get picked

Before every message, Osaurus runs a quick search across your enabled skills (and tools, and methods — see below) and picks the most relevant ones for the question you just asked. The matching skill's instructions are added to the system prompt for that turn.

You don't configure which skills to load per-chat. You just enable them once; the right ones surface when they're needed.

If you'd rather see them all every turn (predictable but heavier on context), each agent has an **Auto-discover vs Manual** toggle in its Capabilities tab. [Agents → Capabilities](/agents#capabilities)

## Adding your own skills

### Importing from GitHub

Any GitHub repo with a `.claude-plugin/marketplace.json` manifest works:

1. **Skills → Import → From GitHub**
2. Enter the repo URL (`github.com/owner/repo` or just `owner/repo`)
3. Browse the available skills, select what to import
4. Click **Import Selected**

Osaurus follows the open [Agent Skills](https://agentskills.io/) specification, so anything that targets Claude Skills also works here.

### Importing from files

| Format | What it is |
|---|---|
| `.md` / `SKILL.md` | Agent Skills format — Markdown with YAML frontmatter |
| `.json` | Osaurus export format |
| `.zip` | A complete package: `SKILL.md` + optional `references/` and `assets/` folders |

**Skills → Import → From File** → pick the file.

### Creating your own

**Skills → Create Skill**:

| Field | What it's for |
|---|---|
| **Name** | A clear, descriptive name |
| **Description** | One-line summary — used to match the skill to your questions, so be specific |
| **Category** | Optional grouping ("Development", "Writing") |
| **Instructions** | The full guidance for the AI in Markdown |
| **Version** / **Author** | Metadata |

Tips:

- Be specific about purpose and approach
- Include examples of expected behavior
- Define any frameworks or methodologies to follow
- Specify output formats when relevant

The **description** is the most important field. It's what determines whether your skill gets matched to a user question, so write it like a one-line résumé bullet, not a marketing tagline.

### Reference files

Add files that load alongside the skill whenever it activates — style guides, terminology, process docs, templates.

1. Edit a skill
2. Add files to its `references/` folder
3. Text files (`.txt`, `.md`, etc.) are loaded into context (≤100 KB each)

### Editing, exporting, deleting

| Action | How |
|---|---|
| **Edit** | Click a skill → **Edit**. Built-in skills are read-only but viewable. |
| **Export** | Right-click → **Export** → JSON, Markdown, or ZIP |
| **Delete** | Right-click → **Delete** (custom skills only) |
| **Disable** | Toggle the switch — disabled skills are excluded from auto-selection |

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

## A note on Methods

You may see "Methods" mentioned alongside Skills in places like Insights and Capabilities. Methods are **learned workflows** — when an agent successfully completes a multi-step task, it can save the sequence of steps as a method that future tasks reuse. They're picked by the same auto-selection that picks skills, so you don't have to think about them as a user. If you're building plugins or want to see the scoring math, see [Methods](/methods).

## Troubleshooting

### Skills don't appear in chat

- Verify the skill is enabled (toggle is on)
- Make sure the skill's **description** clearly describes when to use it — auto-selection keys off this
- Start a new chat session
- Try setting the search width to `wide` in **Management → Settings → Capabilities**

### GitHub import fails

- Ensure the repo is public or you have access
- Verify the repo has `.claude-plugin/marketplace.json`
- Check your network connection

### Skill instructions seem ignored

- Review the instructions for clarity and specificity
- Make the description more specific so auto-selection matches it on the right queries
- Try being more explicit in your prompt

### Import format errors

- `.md` files: ensure valid YAML frontmatter between `---` markers
- `.zip` files: `SKILL.md` must be at the root or in a named folder
- `.json` files: validate JSON syntax

## Under the hood

Curious about how methods are scored, the auto-selection mechanics, or the search width tiers? See [Methods](/methods).

---

**Related:**

- [Agents](/agents) — skills are auto-selected per agent per turn
- [Tools & Plugins](/tools) — what tools exist and how they're built
- [Methods](/methods) — the developer view on the auto-selection layer
- [Agent Skills Specification](https://agentskills.io/) — the open format Osaurus follows

---
title: Skills
sidebar_label: Skills
description: Extend your AI with reusable capabilities imported from GitHub or local files
---

# Skills

Your AI assistant is only as capable as its context allows. Skills let you extend that context with specialized knowledge and behaviors—research methodologies, debugging frameworks, creative techniques, and more. Import skills from GitHub repositories or local files, and activate them when you need that expertise.

## What is a Skill?

A skill is a reusable AI capability that provides specialized instructions, context, or methodology to your assistant. Unlike agents (which define personality and tool access), skills add domain expertise that can be combined with any agent.

Each skill can include:

- **Instructions** — Detailed guidance for the AI on how to approach specific tasks
- **Context** — Background knowledge or reference material
- **Methodology** — Step-by-step frameworks for complex workflows
- **Examples** — Sample outputs or patterns to follow

## Features

- **Import from GitHub** — Browse skills from any repository with a `marketplace.json`
- **Import from Files** — Load `.md`, `.json`, or `.zip` skill packages
- **Built-in Skills** — 6 pre-installed skills ready to use
- **Custom Skills** — Create and edit skills with the built-in editor
- **Agent Skills Compatible** — Follows the open Agent Skills specification
- **Smart Loading** — Only selected skills are loaded to save context space

## Accessing Skills

Open the Management window with **⌘⇧M**, then navigate to the **Skills** tab.

## Two-Phase Capability Selection

:::tip Key Feature
This is one of Osaurus's most important optimizations. It saves ~80% of context space compared to traditional approaches, giving you longer conversations and better AI reasoning.
:::

Traditional AI assistants load all skill instructions and tool definitions upfront—often thousands of tokens before you even ask a question. Osaurus takes a smarter approach.

### How It Works

**Phase 1: Lightweight Catalog**

When a conversation starts, the AI sees only a compact catalog of available skills and tools—names and brief descriptions. This catalog uses minimal context space.

**Phase 2: On-Demand Loading**

When the AI determines it needs a specific skill or tool, only then are the full instructions loaded. The AI requests exactly what it needs, when it needs it.

### Benefits

| Approach           | Context Usage | Problem                                    |
| ------------------ | ------------- | ------------------------------------------ |
| **Traditional**    | ~5,000 tokens | All skills/tools loaded upfront            |
| **Two-Phase**      | ~1,000 tokens | Only catalog + actively used capabilities  |

This saves approximately **80% of context space** for both Skills and Tools, leaving more room for your actual conversation and the AI's reasoning.

### Why It Matters

- **Longer conversations** — More context available for chat history
- **Better responses** — AI isn't overwhelmed by irrelevant instructions
- **Faster performance** — Less data to process per request
- **More capabilities** — Enable more skills without hitting context limits

The two-phase approach means you can have dozens of skills and tools available without paying the context cost until they're actually used.

## Built-in Skills

Osaurus includes six pre-installed skills to get you started:

| Skill                    | Description                                          |
| ------------------------ | ---------------------------------------------------- |
| **Research Analyst**     | Structured research with source evaluation           |
| **Study Tutor**          | Educational guidance using the Socratic method       |
| **Creative Brainstormer**| Ideation and creative problem solving                |
| **Debug Assistant**      | Systematic debugging methodology                     |
| **Code Reviewer**        | Thorough code review with best practices             |
| **Technical Writer**     | Clear documentation and technical writing            |

These skills are ready to use immediately—just enable them in the Skills tab.

## Importing Skills

### From GitHub

Import skills from any GitHub repository that includes a `marketplace.json` file:

1. Open Management window (**⌘⇧M**) → **Skills**
2. Click **Import from GitHub**
3. Enter the repository URL or browse available repositories
4. Select the skills you want to import
5. Click **Import**

The `marketplace.json` file defines available skills in the repository:

```json
{
  "name": "My Skills Collection",
  "skills": [
    {
      "id": "research-analyst",
      "name": "Research Analyst",
      "description": "Structured research methodology",
      "file": "skills/research-analyst.md"
    }
  ]
}
```

### From Files

Import skills from local files on your Mac:

1. Open Management window (**⌘⇧M**) → **Skills**
2. Click **Import from File**
3. Select a skill file (`.md`, `.json`, or `.zip`)
4. The skill is added to your library

**Supported formats:**

| Format   | Description                                      |
| -------- | ------------------------------------------------ |
| `.md`    | Markdown file with skill instructions            |
| `.json`  | JSON file with structured skill definition       |
| `.zip`   | Archive containing multiple skill files          |

## Creating Custom Skills

Build your own skills with the built-in editor:

1. Open Management window (**⌘⇧M**) → **Skills**
2. Click **Create Skill**
3. Fill in the skill details:
   - **Name** — Display name for the skill
   - **Description** — Brief explanation of what the skill does
   - **Instructions** — The detailed content that guides the AI
4. Click **Save**

### Writing Effective Skills

**Be specific and actionable:**

```markdown
When analyzing code for security vulnerabilities:
1. Check for injection vulnerabilities (SQL, command, XSS)
2. Review authentication and authorization logic
3. Look for sensitive data exposure
4. Evaluate error handling and logging
5. Assess dependency security
```

**Include examples when helpful:**

```markdown
When asked to explain a concept, use this format:

## [Concept Name]

**What it is:** One-sentence definition.

**Why it matters:** Real-world relevance.

**How it works:** Step-by-step explanation.

**Example:** Concrete illustration.
```

**Define boundaries:**

```markdown
You are a code reviewer focused on Python best practices.

DO:
- Suggest PEP 8 improvements
- Identify potential bugs
- Recommend performance optimizations

DON'T:
- Rewrite entire functions unless asked
- Suggest architectural changes for small reviews
- Focus on stylistic preferences over correctness
```

## Managing Skills

### Enabling and Disabling Skills

Toggle skills on or off to control what's loaded into context:

1. Open Management window (**⌘⇧M**) → **Skills**
2. Click the toggle next to any skill to enable or disable it
3. Enabled skills are loaded when you start a conversation

:::tip Context Management
Only enable skills you're actively using. Each skill adds to the context sent with every message, which affects response speed and token usage.
:::

### Editing a Skill

1. Open Management window (**⌘⇧M**) → **Skills**
2. Click on the skill you want to edit
3. Make your changes in the editor
4. Click **Save**

### Deleting a Skill

1. Open Management window (**⌘⇧M**) → **Skills**
2. Click on the skill
3. Click **Delete**
4. Confirm deletion

:::note Built-in Skills
Built-in skills cannot be deleted, but you can disable them.
:::

## Skills vs Agents

Skills and agents serve different purposes and work together:

| Aspect        | Agents                                | Skills                                |
| ------------- | ------------------------------------- | ------------------------------------- |
| **Purpose**   | Define personality and behavior       | Add domain expertise                  |
| **Scope**     | Controls tools, model, temperature    | Provides instructions and context     |
| **Usage**     | One active at a time                  | Multiple can be enabled simultaneously|
| **Best for**  | Different assistant modes             | Specialized knowledge areas           |

**Example combination:**

- **Agent:** Code Assistant (low temperature, filesystem tools enabled)
- **Skills:** Debug Assistant + Code Reviewer (methodology for the task)

## Agent Skills Compatibility

Osaurus skills follow the open [Agent Skills](https://github.com/agentskills/agentskills) specification, making them compatible with other tools that support this format.

**Key compatibility features:**

- Standard markdown format
- Metadata in frontmatter
- Portable between compatible tools
- Version-controlled in Git

## Use Cases

### Research Workflow

Enable the **Research Analyst** skill when gathering information:

- Structured approach to evaluating sources
- Methodology for synthesizing findings
- Framework for presenting research results

### Learning Sessions

Use the **Study Tutor** skill for educational conversations:

- Socratic questioning approach
- Adaptive explanation depth
- Knowledge verification techniques

### Code Reviews

Combine **Code Reviewer** and **Debug Assistant** skills:

- Systematic code analysis
- Bug identification methodology
- Best practice recommendations

### Creative Projects

Enable **Creative Brainstormer** for ideation:

- Divergent thinking techniques
- Idea generation frameworks
- Creative constraint methods

## Tips and Best Practices

1. **Start with built-in skills** — Try the pre-installed skills before creating custom ones
2. **Keep skills focused** — One skill per domain works better than monolithic skills
3. **Enable selectively** — Only load skills relevant to your current task
4. **Iterate on instructions** — Refine your custom skills based on results
5. **Share with others** — Export skills to share methodologies with your team
6. **Version control** — Store skill files in Git for history and collaboration

---

<p align="center">
  For combining skills with custom assistants, see the <a href="/agents">Agents</a> guide.
</p>

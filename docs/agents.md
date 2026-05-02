---
title: Agents
sidebar_label: Agents
description: Specialized AI assistants with their own prompt, theme, default model, and memory. Tools and skills are auto-selected.
sidebar_position: 5
---

# Agents

One AI doesn't fit every job. When you're writing code you want a focused technical assistant. When you're brainstorming you want creativity. When you're researching you want web access. Agents let you save those configurations and switch between them instantly.

## What an agent is

An agent is a saved configuration with:

- A **system prompt** (the personality and instructions)
- An optional **default model** (Foundation, MLX, or a cloud provider)
- Optional **temperature** and **max tokens** overrides
- An optional **theme** that activates with the agent
- Its own **identity** (a cryptographic address derived from your master key)
- Its own **memory** — pinned facts and episode digests are scoped per agent
- An optional **`autonomous_exec`** flag that controls Sandbox write/exec access

You don't configure tools or skills per-agent any more — those are auto-selected for every message via your **Core Model** (`Settings → General → Core Model`, falls back to the chat model when unset). More on that below.

## Creating an agent

1. Open the Management window (`⌘ ⇧ M`)
2. Click **Agents** in the sidebar
3. Click **Create Agent**
4. Fill in:
   - **Name** — required (e.g. "Code Assistant")
   - **Description** — optional one-liner
   - **System Prompt** — instructions prepended to every message
   - **Default Model** — optional override of the user's selected model
   - **Temperature** / **Max Tokens** — optional generation overrides
   - **Theme** — optional theme that activates when the agent is selected

Click **Save**. The agent is immediately available in the agent selector.

### Example system prompts

**Code Assistant** (low temperature, focus on correctness):

```
You are an expert software engineer. You write clean, efficient,
well-tested code. You consider edge cases, suggest improvements
when relevant, and admit when you don't know something.
```

**Creative Writer** (high temperature, vivid output):

```
You are a creative writing assistant with a flair for vivid
descriptions and engaging narratives. You help craft compelling
stories, poems, and creative content with an expressive style.
```

**Research Helper** (balanced temperature, structured output):

```
You are a research analyst. For every question, you cite sources,
flag uncertainty, and structure findings into:
- Executive summary
- Key findings
- Confidence assessment
```

## Capabilities are auto-selected

This is the part that surprises long-time users. Osaurus does **not** ask you which tools and skills each agent gets. Instead, before every message, a **preflight RAG search** runs across every indexed tool, skill, and method and pulls in just the relevant ones.

| Mode | Methods loaded | Tools loaded | Skills loaded |
|---|---|---|---|
| `off` | 0 | 0 | 0 |
| `narrow` | 1 | 2 | 1 |
| `balanced` (default) | 3 | 5 | 2 |
| `wide` | 5 | 8 | 4 |

Configure the mode in **Management → Settings → Capabilities**. The default (`balanced`) is the right answer for most people. Capability search runs through the **Core Model** you set in **Settings → General → Core Model** — pick a small fast one (`foundation` or `gemma-4-e2b-it-4bit`) for cheap preflight.

The agent can also expand its kit mid-conversation via the always-on `capabilities_search` and `capabilities_load` tools. So if you start asking about Git halfway through a chat that began with web research, the right tools show up without restarting.

[Skills & Methods deep dive →](/skills)

## Working folders and the Sandbox

Agents don't have a "give it filesystem access" toggle. Instead:

- **Click the folder picker** in the chat input bar to point a chat at a folder. The agent gets file/search/git tools scoped to that folder for the current chat.
- **Toggle the Sandbox** *(macOS 26+)* to give the agent shell access in an isolated Linux VM. Mutually exclusive with a working folder.

Both decisions are per-chat, not per-agent. The agent's `autonomous_exec` flag controls whether write/exec tools are available *if the Sandbox is on*:

| Flag | What it unlocks in the Sandbox |
|---|---|
| `autonomous_exec.enabled = false` | Read-only sandbox tools only (`sandbox_read_file`, `sandbox_search_files`) |
| `autonomous_exec.enabled = true` | Adds write, edit, exec, install, secret, and plugin-register tools |
| `autonomous_exec.pluginCreate = true` | Lets the agent author and register new sandbox plugins at runtime |

Toggle these in the agent editor under **Sandbox**.

[Working Folders & Sandbox →](/agent-loop) · [Sandbox Internals →](/sandbox)

## Memory per agent

Each agent has its own memory — pinned facts, episodes, and identity overrides are stored per-agent. So your Code Assistant doesn't accidentally carry over context from your Therapy Buddy.

Identity overrides ("I prefer tabs over spaces", "Reply in English") are also per-agent unless you set them at the top level. [Memory →](/memory)

## Switching agents

| Where | How |
|---|---|
| Inside a chat | Click the agent selector (top of the chat window) |
| New chat with a specific agent | Right-click an agent in **Management → Agents** → **New Chat** |
| Voice activation | Enable the agent for VAD and say its name. See [Voice → VAD](/voice#vad-mode-wake-word-activation) |

Switching changes the system prompt, default model (if set), theme (if set), and memory scope. The current chat session keeps its history.

## Built-in agents

Osaurus ships with a default **Osaurus** agent — a generalist with the standard system prompt. It's read-only (you can copy it), so you can always reset to a known-good configuration.

## Import and export

Agents are JSON files. To share or back up:

1. Open **Management → Agents**
2. Right-click an agent → **Export**
3. Pick a save location

To import: **Agents → Import** → pick the JSON file.

A typical exported agent:

```json
{
  "name": "Code Assistant",
  "description": "Expert programming partner",
  "systemPrompt": "You are an expert software engineer...",
  "defaultModel": "gemma-4-e2b-it-4bit",
  "temperature": 0.2,
  "maxTokens": 2048,
  "themeId": "dark-blue",
  "autonomousExec": {
    "enabled": true,
    "pluginCreate": true
  }
}
```

Skills, tools, and memory are **not** part of the export — those are managed centrally and don't move with the agent file.

## Identity and access keys

Each agent gets a cryptographic address derived from your master key. You can mint per-agent access keys (`osk-v1`) that scope external tools and MCP clients to just that agent. [Identity & Access →](/identity)

## Tips

- **Start from a template.** Duplicate the default Osaurus agent and tweak the prompt — that's the fastest way to a working specialized agent.
- **Match temperature to the task.** Low for code/facts (0.1–0.3), high for creative work (0.7–0.9).
- **Use themes for context.** Visual cues (a green theme for your assistant, a red theme for your code reviewer) help you stay oriented when running multiple windows.
- **Don't over-prompt.** Long system prompts eat into context. Keep them tight and lean on Skills for specialized methodology.
- **Export regularly.** They're tiny JSON files — back them up to git.

---

**Related:**

- [Working Folders & Sandbox](/agent-loop) — the per-chat tool kit
- [Skills & Methods](/skills) — auto-selected expertise
- [Memory](/memory) — what your agent remembers
- [Themes](/themes) — visual customization per agent

---
title: Agents
sidebar_label: Agents
description: Specialized AI assistants — your coding partner, research helper, creative collaborator. Each with its own prompt, theme, model, and memory.
sidebar_position: 5
---

# Agents

One AI doesn't fit every job. When you're writing code you want a focused technical assistant. When you're brainstorming you want creativity. When you're researching you want web access. Agents let you save those configurations and switch between them with a click.

## What an agent is

An agent is a saved configuration with its own:

- **Identity** — name, description, optional avatar (mascot or initial monogram), and a cryptographic address derived from your master key
- **Personality** — system prompt, optional default model, optional temperature and max-tokens overrides, optional theme that activates when the agent is selected
- **Capabilities** — its own enabled set of tools and skills, plus an *Auto-discover* toggle (more below)
- **Memory** — pinned facts, episode digests, and identity overrides are stored per-agent
- **Sandbox autonomy** — optional `autonomous_exec` config that controls what the agent can do in the [Linux Sandbox](/agent-loop)
- **Quick actions** — per-agent prompt templates shown in the chat empty state, separate lists for Chat and Work modes
- **Plugin instructions** — optional per-plugin instruction overrides
- **Bonjour discovery** — opt-in flag that advertises the agent on your local network so connector apps can find it
- **Per-agent disables** — toggles to skip tools entirely (`disableTools`) or skip memory entirely (`disableMemory`) for this agent

You can override almost everything per-agent, or leave fields empty to fall back to your global defaults.

## Creating an agent

1. Open the Management window (`⌘ ⇧ M`) → **Agents**
2. Click **Create Agent**

The Create Agent sheet has a few sections:

### Identity

- **Name** — required (e.g. "Code Assistant")
- **Avatar** *(optional)* — pick a mascot icon, or leave it blank for an initial-monogram badge in the agent's auto-assigned color
- **Description** — optional one-liner that shows under the name in the grid

### Personality

- **System prompt** — instructions prepended to every message in chats with this agent
- **Default model** *(optional)* — locks this agent to a specific model regardless of your global pick
- **Temperature** *(optional)* — 0.0–1.0; lower = focused, higher = creative
- **Max tokens** *(optional)* — caps response length
- **Theme** *(optional)* — pick from your built-in or custom themes; activates automatically with the agent

### Capabilities

The Capabilities picker is the single source of truth for what tools and skills this agent has access to. See the [Capabilities](#capabilities) section below for the details.

### Sandbox autonomy *(optional)*

Configure what the agent can do when the [Sandbox](/agent-loop) is toggled on for a chat:

| Setting | What it does | Default |
|---|---|---|
| `enabled` | Unlocks write/exec/install/secret tools in the Sandbox. With it off, the agent only gets read-only sandbox tools. | `false` |
| `pluginCreate` | Lets the agent author and register new Sandbox plugins at runtime | `true` |
| `maxCommandsPerTurn` | Caps how many shell commands the agent can run in a single turn | `10` |
| `commandTimeout` | Per-command timeout in seconds | `30` |

These settings are also editable on existing agents from the agent's **Sandbox** tab.

### Memory and discovery *(optional)*

- **Disable memory** — turn off memory entirely for this agent (no injection on read, no recording on write)
- **Disable tools** — skip the tool/preflight system entirely; the agent is text-in-text-out
- **Bonjour discovery** — advertise this agent on your local network so connector apps and remote pairers can find it

### Quick actions *(optional)*

The chat empty state shows up to four prompt templates. You can leave the defaults, hide them, or customize:

- **Chat quick actions** — ideas like *"Explain a concept"*, *"Summarize text"*, *"Write code"*, *"Help me write"*
- **Work quick actions** — ideas like *"Build a site"*, *"Research a topic"*, *"Write a blog post"*, *"Organize my files"*

Each entry has an SF Symbols icon, a short label, and the prompt prefix that gets typed when the user taps it.

Click **Save** when you're done. The agent is immediately available in the agent selector.

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

## Capabilities

Each agent has its own enabled set of tools and skills. You configure it in two places:

- **Inside the Create Agent sheet** — under the Capabilities section, when you're building a new agent
- **On an existing agent** — open the agent and click the **Capabilities** tab

### Auto-discover vs Manual

A single toggle at the top of the Capabilities picker decides how your enabled set reaches the model each turn:

- **Auto-discover** *(recommended)* — Before each message, Osaurus picks the most relevant subset of your enabled tools and skills for the question you just asked. Saves context tokens and tends to give better focus.
- **Manual** — Send the *entire* enabled set every turn. Predictable but heavier on context.

In either mode, the per-item Enabled toggles in the picker are honored — disabling a tool there means the model never sees it, in any mode.

For the search width tiers and the mechanics of how auto-selection works, see [Methods → Auto-selection mechanics](/methods#auto-selection-mechanics-preflight-search).

### What the picker looks like

Tools and skills are grouped by **source**:

| Source | What's in it |
|---|---|
| **Built-in** | Always-loaded tools (the agent's `todo`/`complete`/`clarify`, `share_artifact`, etc.). Shown for transparency — toggling has no effect. |
| **Plugin** *(one per plugin)* | Tools and skills shipped by each native plugin you've installed |
| **MCP provider** *(one per provider)* | Tools aggregated from a remote MCP server |
| **Sandbox plugin** *(one per provisioned plugin)* | Tools defined by JSON-recipe sandbox plugins |
| **Standalone skills** | Built-in and user-created skills not tied to any plugin |

Per group you can:

- **Expand / collapse** to inspect individual items
- **Bulk enable / disable** the whole group with one click
- See an at-a-glance count of how many items are enabled

Per item you see name, description, and an estimated token cost. Filter the whole picture by **All** / **Enabled** / **Tools** / **Skills**, or search by name and description.

### Disabling tools or memory entirely

If you want a strictly conversational agent — no tools, no memory writes — flip these on the agent:

- **Disable tools** — no tools and no preflight context are sent for this agent
- **Disable memory** — memory is neither injected on read nor recorded on write

Useful for therapy-style assistants, coaching agents, or anything where you want predictable text-in-text-out behavior.

[Skills deep dive →](/skills)

## Working folders and the Sandbox

These are per-chat power-ups, not per-agent settings:

- **Click the folder picker** in the chat input bar to point a chat at a folder. The agent gets file/search/git tools scoped to that folder for the current chat.
- **Toggle the Sandbox** *(macOS 26+)* to give the agent shell access in an isolated Linux VM. Mutually exclusive with a working folder.

The agent's `autonomous_exec` config (set when you created the agent, editable later) controls how much capability it has *if the Sandbox is on*. Read-only sandbox tools (`sandbox_read_file`, `sandbox_search_files`) are always available; write/exec/install/secret tools require `autonomous_exec.enabled = true`.

[Tasks →](/agent-loop) · [Sandbox Internals →](/sandbox)

## Memory per agent

Each agent has its own memory — pinned facts, episodes, and identity overrides are stored per-agent. So your Code Assistant doesn't accidentally carry over context from your Therapy Buddy.

Identity overrides ("I prefer tabs over spaces", "Reply in English") are also per-agent unless you set them at the top level. If you want a clean stateless agent, flip **Disable memory** on the agent — memory is neither injected on read nor recorded on write. [Memory →](/memory)

## Switching, duplicating, and managing agents

| Where | How |
|---|---|
| Inside a chat | Click the agent selector (top of the chat window) |
| New chat with a specific agent | Right-click an agent in **Management → Agents** → **New Chat** |
| Voice activation | Enable the agent for VAD and say its name. See [Voice → VAD](/voice#vad-mode-wake-word-activation) |
| Make a local copy | Right-click an agent → **Duplicate**. The fastest way to fork a working configuration and tweak it. |

Switching changes the system prompt, default model (if set), theme (if set), and memory scope. The current chat session keeps its history.

Agents you've been invited to (via [Share Agent](#share-an-agent)) appear in the same grid with a **Remote** badge. They show up in the agent selector too, so you can switch to them mid-chat the same way.

## Built-in agents

Osaurus ships with a default **Osaurus** agent — a generalist that uses your global chat settings. It's read-only; **Duplicate** it to start a custom variant, so you can always reset to a known-good configuration.

## Share an agent

When you share an agent with someone, you're not sending them a copy — you're giving them a **live link to your agent on your Mac**, routed over a secure tunnel. They chat with the same agent you built, with your prompt, your tools, your memory. You can revoke their access anytime.

### Send an invite

1. Open the agent and click **Share Agent**
2. Pick how long the link should stay valid: **1 hour**, **1 day**, **7 days** *(default)*, or **30 days**
3. Osaurus enables the public link automatically and generates a signed `osaurus://…?pair=…` invite
4. Send the link however you want — it shows up as a clickable URL, a **QR code**, and a system **Share…** button (drop it in iMessage, AirDrop, Mail, etc.)

Each invite is **single-use** — once someone accepts, the link can't be reused. If you want to share with three people, generate three invites.

### The invite ledger

Every invite you've ever issued for an agent is listed under **Issued Invites** with its status:

| Status | What it means |
|---|---|
| **Active** | Link is valid and unused |
| **Accepted** | Someone redeemed it. They have access until you revoke. |
| **Expired** | Past expiry date; no further action needed |

You can **revoke** any active or accepted invite at any time. Revoking an accepted invite kills the receiver's access key immediately — they get turned away on the next request.

### Receiving an invite

When someone sends you a `osaurus://…?pair=…` link:

1. Open it (click the URL or scan the QR code — Osaurus catches the deeplink)
2. The **Add Remote Agent** sheet shows you who you'd be paired with: name, description, source URL, expiry, an optional note for yourself
3. Click **Add Remote Agent**

The agent appears in your **Agents** grid with a **Remote** badge and an antenna icon. Chat with it like any other agent — your messages travel over the tunnel back to the sender's Mac, where their agent runs them.

You can leave a note on the remote agent (e.g. *"Alice's research agent"*) so you remember who shared it. Either side can revoke anytime: the sender from their **Issued Invites** ledger, the receiver from the remote agent's detail view.

## Identity and access keys

Each agent gets a cryptographic address derived from your master key. You can mint per-agent access keys (`osk-v1`) that scope external tools and MCP clients to just that agent. [Identity →](/identity)

## Tips

- **Start from a template.** Duplicate the default Osaurus agent and tweak the prompt — that's the fastest way to a working specialized agent.
- **Match temperature to the task.** Low for code/facts (0.1–0.3), high for creative work (0.7–0.9).
- **Use themes for context.** Visual cues (a green theme for your assistant, a red theme for your code reviewer) help you stay oriented when running multiple windows.
- **Don't over-prompt.** Long system prompts eat into context. Keep them tight and lean on Skills for specialized methodology.
- **Pick a tight expiry.** When you share an agent, default to a short window (1 day or 7 days) — you can always re-share. Long-lived links are harder to keep track of.

---

**Related:**

- [Tasks](/agent-loop) — what happens when you ask the agent to *do* something
- [Skills](/skills) — auto-selected expertise
- [Memory](/memory) — what your agent remembers
- [Agent DB & Self-Scheduling](/agent-db) — give an agent structured storage and the ability to wake itself
- [Themes](/themes) — visual customization per agent

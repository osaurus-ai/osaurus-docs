---
title: Agents
sidebar_label: Agents
description: Specialized AI assistants — your coding partner, research helper, creative collaborator. Each with its own prompt, theme, model, and memory.
---

# Agents

One AI doesn't fit every job. When you're writing code you want a focused technical assistant. When you're brainstorming you want creativity. When you're researching you want web access. Agents let you save those configurations and switch between them with a click.

## What an agent is

An agent is a saved configuration with its own:

- **Identity** — name, description, optional avatar (mascot or initial monogram), and a cryptographic address derived from your master key
- **Personality** — system prompt, optional default model, optional generation overrides (temperature, max tokens), optional theme that activates when the agent is selected
- **Abilities** — every capability switch in one place: tools, memory, knowledge, web search, charts, speech, self-scheduling, database, code execution, host files — with a live estimate of what each one costs in startup context
- **Tools** — its own enabled set of tools, plus an *Auto vs Manual* toggle (more below). Skills aren't scoped per agent — they come from the universal [Skills library](/skills).
- **Memory** — pinned facts, episode digests, and identity overrides are stored per-agent
- **Database** — an optional private, encrypted SQLite database for structured data across runs (see [Agent DB](/agent-db))
- **Sandbox permissions** — an `autonomous_exec` config that controls exactly what the agent may do in the [Sandbox](/agent-loop#toggle-the-sandbox), down to per-domain network allowlists
- **Subagents** — per-agent delegation settings: spawnable agents/models, the `image` tool, Computer Use, Browser Use, and AppleScript, all off by default (see [Subagents](/subagents))
- **Automation** — per-agent [schedules](/schedules) and [file watchers](/watchers), plus opt-in self-scheduling
- **Quick actions** — per-agent prompt templates shown in the chat empty state, separate lists for Chat and Work modes
- **Plugin instructions** — optional per-plugin instruction overrides
- **Bonjour discovery** — opt-in flag that advertises the agent on your local network so connector apps can find it

You can override almost everything per-agent, or leave fields empty to fall back to your global defaults.

## Creating an agent

1. Open the Management window (`⌘ ⇧ M`) → **Agents**
2. Click **Create Agent**

The Create Agent sheet is deliberately short — pick from **Start From** starter templates (or begin blank), then:

- **Name** — required (e.g. "Code Assistant"); templates prefill a sensible one
- **Avatar** — pick a mascot icon, or leave it blank for an initial-monogram badge in the agent's auto-assigned color
- **Model** *(optional)* — locks this agent to a specific model regardless of your global pick
- **Capabilities** — starts with everything enabled; click **Customize…** for the full tool picker in draft mode (nothing persists until you create)
- **Prompt** — the system prompt prepended to every message in chats with this agent

Click **Create Agent** and it's immediately available in the agent selector. Everything else — generation overrides, theme, quick actions, sandbox permissions, automation — lives in the agent's detail view, described next.

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

## The agent detail view

Open any custom agent to get its detail view: five plain-language groups in the sidebar, each holding a few focused tabs.

| Group | Tabs | What's there |
|---|---|---|
| **General** | Configure · Appearance | Identity, system prompt, model, generation overrides, per-agent voice, self-scheduling limits · avatar, empty-state quick actions, visual theme |
| **Abilities** | Overview · Tools · Subagents · Sandbox | Every capability switch with a live context estimate · the tool picker · delegation settings · sandbox permissions and secrets. Installed agent plugins get their own tabs in this group too. |
| **Connections** | Network · Remote Connections | Bonjour discovery and the relay tunnel · every peer granted access to this agent, with usage and a Revoke action |
| **Automation** | Automation | Per-agent schedules and file watchers |
| **Memory** | Memory · Database | Chat history, pinned facts, episodes · the agent's [Database workspace](/agent-db) |

## Abilities

**Abilities → Overview** is the one place to see and flip everything a custom agent can do. A hero card shows how many abilities are on and a **live estimated startup context** — the number responds to every toggle (with a `+/- tokens` delta), priced through the same gates the next real send will use. If the agent's model has a context window too small to carry them, Tools and Memory are **auto-disabled** with a notice explaining why.

The switches, grouped the way the UI groups them:

| Group | Ability | What it does |
|---|---|---|
| Model Access | **Tools** | Master switch for the tool system. Off = a chat-only agent. |
| | **Memory** | Inject relevant memories per turn and record new ones. (The default agent's memory is governed globally in Settings.) |
| Output | **Charts** | Render data as inline chart cards |
| | **Speak Tool** | A tool the agent can call to read a reply aloud on request |
| Memory & Recall | **Memory Recall** | Let the agent search its own memory mid-conversation — separate from Memory, which only auto-injects |
| Knowledge | **Knowledge** | Search and read the [knowledge collections](/knowledge) granted inline below the toggle |
| | **Curator** | Draft document updates as pending proposals you approve |
| Web | **Web Search** | [Native web search](/web-search) through your configured providers |
| Autonomy | **Self-scheduling** | Let the agent schedule its own follow-up runs and send notifications; frequency limits live in General → Configure → Scheduling |
| Data | **Database** | A private encrypted database for structured data (see [Agent DB](/agent-db)). With a cloud model, the schema — table names and column types — is sent with requests; row data is not. |
| Code Execution | **Autonomous Execution** | Master switch for sandboxed commands; the full permission set lives in Abilities → Sandbox |
| Host Files | **Host Files** | Grant access to one macOS folder, including over authenticated remote agent runs. Writes stay inside the folder; shell and git remain disabled. |

Most ability toggles are backed by tools, so they pause (with a note) if the master **Tools** switch is off.

## Sandbox permissions

**Abilities → Sandbox → Execution** holds the full `autonomous_exec` permission set for when the [Sandbox](/agent-loop#toggle-the-sandbox) is on:

| Setting | What it does | Default |
|---|---|---|
| **Autonomous Execution** | Unlocks write/exec/install/secret tools in the Sandbox. Off = read-only sandbox tools. | On for new custom agents where the sandbox is supported |
| **Plugin Creation** | Lets the agent author and register new Sandbox plugins at runtime | On |
| **Sandbox Network** | Allow outbound network from the sandbox; turn off to cut exfiltration (takes effect on next sandbox start) | On |
| **Allowed Domains** | Comma-separated egress allowlist (`example.com` exact, `*.example.com` subdomains). Non-empty switches the sandbox to host-only networking with a filtering proxy. VM backend (macOS 26+) only — on Seatbelt, network is all-or-nothing. | Empty (unrestricted) |
| **Background Processes** | Long-lived detached processes (servers, watchers) the agent can manage | Off |
| **Read Secret Files** | With a working folder, allow reading `.env` / keys / credentials | Off |
| **Edit Folder Files** | With a working folder, allow creating and editing its files (tracked and undoable in **Changes**). Off keeps the folder read-only. | Off |

The same tab has a **Workspace Folder** row that reveals the agent's sandbox home (`/workspace/agents/<name>/`) in Finder — edits you make there are visible to the agent immediately — and the agent's **secrets** list. [Sandbox Internals →](/sandbox)

## The tool picker

Each agent has its own enabled set of **tools**. You configure it in two places:

- **Inside the Create Agent sheet** — click **Customize…** under Capabilities while creating
- **On an existing agent** — open the agent → **Abilities → Tools**

**Skills aren't in the picker.** The [Skills library](/skills) is universal — every installed skill is automatically discoverable by every custom agent, with no per-agent assignment and no toggles. Agent configuration scopes *tools*; the shared library supplies *skills*.

### Auto vs Manual

A single toggle at the top of the tool picker decides how your enabled set reaches the model:

- **Auto** *(recommended)* — The model starts with a small always-loaded set and a capabilities manifest, then loads more (tools, skills, methods) on demand via `capabilities_discover` / `capabilities_load`. Saves context tokens and tends to give better focus.
- **Manual** — Send the *entire* enabled tool set every turn. Predictable but heavier on context — and Manual mode doesn't use the skill library.

In either mode, the per-item Enabled toggles in the picker are honored — disabling a tool there means the model never sees it, in any mode.

For the mechanics of capability discovery, see [Methods → Mid-conversation discovery](/methods#mid-conversation-discovery).

### What the picker looks like

Tools are grouped by **source**:

| Source | What's in it |
|---|---|
| **Built-in** | Always-loaded tools (the agent's `todo`/`complete`/`clarify`, `share_artifact`, `web_search`, etc.). Shown for transparency — toggling has no effect. |
| **Plugin** *(one per plugin)* | Tools shipped by each native plugin you've installed |
| **MCP provider** *(one per provider)* | Tools aggregated from a remote MCP server |
| **Sandbox plugin** *(one per provisioned plugin)* | Tools defined by JSON-recipe sandbox plugins |

Per group you can:

- **Expand / collapse** to inspect individual items
- **Bulk enable / disable** the whole group with one click
- See an at-a-glance count of how many items are enabled

Per item you see name, description, and an estimated token cost, with search by name and description.

### Disabling tools or memory entirely

If you want a strictly conversational agent — no tools, no memory writes — flip the master switches off in **Abilities → Overview**:

- **Tools off** — no tools or capability context are sent for this agent
- **Memory off** — memory is neither injected on read nor recorded on write

Useful for therapy-style assistants, coaching agents, or anything where you want predictable text-in-text-out behavior.

[Skills deep dive →](/skills)

## Working folders and the Sandbox

These are per-chat power-ups, not per-agent settings:

- **Click the folder picker** in the chat input bar to point a chat at a folder. The agent gets file/search/git tools scoped to that folder for the current chat.
- **Toggle the Sandbox** to give the agent shell access in an isolated environment (a Linux VM on macOS 26+, a Seatbelt-confined runner on macOS 15). It composes with a working folder — see [Combined mode](/agent-loop#combined-mode-folder--sandbox).

The agent's [sandbox permissions](#sandbox-permissions) control how much capability it has *if the Sandbox is on*. Read-only sandbox tools (`sandbox_read_file`, `sandbox_search_files`) are always available; write/exec/install/secret tools require **Autonomous Execution** to be on.

Separate from the per-chat folder, the per-agent [**Host Files** ability](#abilities) grants standing access to one macOS folder — it works over authenticated remote agent runs too, with writes confined to the folder and shell/git kept disabled.

[Tasks →](/agent-loop) · [Sandbox Internals →](/sandbox)

## Subagents per agent

Each agent's **Abilities → Subagents** tab controls what it can delegate: spawning other agents and models, generating images inline, driving macOS apps with Computer Use, driving a persistent browser with Browser Use, and running AppleScript. Everything ships disabled — an agent can't delegate until you grant it. [Subagents →](/subagents) · [Computer Use →](/computer-use) · [Browser Use →](/browser-use) · [Image Generation →](/image-generation)

## Memory per agent

Each agent has its own memory — pinned facts, episodes, and identity overrides are stored per-agent. So your Code Assistant doesn't accidentally carry over context from your Therapy Buddy.

Identity overrides ("I prefer tabs over spaces", "Reply in English") are also per-agent unless you set them at the top level. If you want a clean stateless agent, turn the **Memory** ability off — memory is neither injected on read nor recorded on write. [Memory →](/memory)

## Knowledge per agent

Beyond what an agent learns from you, you can hand it curated reference material: knowledge collections are folders of documents (markdown, plain text, code, PDF, Word, Excel, PowerPoint, CSV) the agent can search and read on demand. Grants are per-agent and explicit — in **Abilities → Overview**, turn on **Knowledge** and check the collections this agent may see right under the toggle; it can never touch the others. Enable **Curator** as well to let the agent flag stale documents and propose updates you approve. [Knowledge →](/knowledge)

## Switching, duplicating, and managing agents

| Where | How |
|---|---|
| Inside a chat | Click the agent selector (top of the chat window) |
| From the grid | Each agent card has a **⋯** menu: **Open**, **Duplicate**, **Open Database**, **Delete** |
| Voice activation | Enable the agent for VAD and say its name. See [Voice → VAD](/voice#vad-mode-wake-word-activation) |
| Make a local copy | **⋯ → Duplicate**. The fastest way to fork a working configuration and tweak it. |
| Reorder the grid | Click the reorder button in the Agents header and drag agents into place — the same order drives the agent selector |

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

## Move an agent to another Mac

Sharing gives someone a live link to an agent running on *your* Mac. If you want the agent itself to move — configuration, database, saved views and all — export it as an encrypted **bundle**:

1. From the agent's detail view, choose **Export Bundle** and pick a folder for the `.osaurus-agent` file
2. Choose a passphrase (at least 8 characters) — the bundle is sealed with it, and you'll need the same passphrase to open it anywhere else
3. On the other Mac, choose **Import Bundle**, pick the file, and enter the passphrase
4. Review the manifest — agent name, description, table and saved-view counts, export date — then **Activate** (or **Discard** to change nothing on disk)

Activating copies the agent into `~/.osaurus/agents/<id>/`, re-keys its database to the local master key, and registers the agent for use.

## Identity and access keys

Each agent gets a cryptographic address derived from your master key. You can mint per-agent access keys (`osk-v1`) that scope external tools and MCP clients to just that agent. [Identity →](/identity)

## Tips

- **Start from a template.** The Create Agent sheet's **Start From** strip prefills a name, avatar, and prompt — pick the closest one and tweak. Duplicating an existing agent works too.
- **Watch the context estimate.** Every ability you enable costs startup context; the live figure in **Abilities → Overview** shows exactly what each toggle adds, so you can keep small-model agents lean.
- **Match temperature to the task.** Low for code/facts (0.1–0.3), high for creative work (0.7–0.9). Generation overrides live in **General → Configure**.
- **Use themes for context.** Visual cues (a green theme for your assistant, a red theme for your code reviewer) help you stay oriented when running multiple windows.
- **Don't over-prompt.** Long system prompts eat into context. Keep them tight and lean on Skills for specialized methodology.
- **Pick a tight expiry.** When you share an agent, default to a short window (1 day or 7 days) — you can always re-share. Long-lived links are harder to keep track of.

---

**Related:**

- [Tasks](/agent-loop) — what happens when you ask the agent to *do* something
- [Skills](/skills) — auto-selected expertise
- [Memory](/memory) — what your agent remembers
- [Knowledge](/knowledge) — curated reference collections your agent can consult
- [Agent DB & Self-Scheduling](/agent-db) — give an agent structured storage and the ability to wake itself
- [Themes](/themes) — visual customization per agent

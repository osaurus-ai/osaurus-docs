---
title: Computer Use
sidebar_label: Computer Use
description: Let an agent drive real macOS apps — fill forms, flip settings, extract on-screen text — with a safe-by-default autonomy gate and local-first perception.
---

# Computer Use

Computer Use lets an agent drive a real macOS app on your behalf: fill a form, flip a setting, navigate an app, extract on-screen text. The agent works primarily from the **accessibility tree** — no pixels — and falls back to a screenshot only when an element can't be resolved that way.

It is **off by default**, enabled **per agent** (custom agents only — the built-in Orchestrator can't use it), and every action passes through a **safe-by-default autonomy gate** before it runs.

:::info[Experimental]
Computer Use is an experimental feature. Start with the default `balanced` autonomy preset, which confirms every edit and consequential action with you before it runs.
:::

## How it works

When you give an agent a task that needs the screen, it calls one tool — `computer_use` — with the whole goal in plain language. That spins up a nested subagent that runs a tight loop:

1. **Perceive** — capture the focused app as a numbered list of actionable elements, optionally with an annotated screenshot.
2. **Decide** — the model proposes exactly one action per step (click, type, scroll, open, …).
3. **Gate** — the action's effect is classified and checked against your autonomy policy: allow, confirm with you, or deny.
4. **Act** — the action is dispatched to the app.
5. **Verify** — after a mutation, the loop re-perceives and confirms the action actually landed.

The inner steps render live in the chat row but never clutter the conversation — the chat gets back a single summary. A **Stop** control interrupts the run at any point, even while a confirmation is up.

The model is kept on a short leash: it only ever proposes the *next* action. The harness owns every deterministic decision — which element to target, whether the gate allows it, and whether it worked.

## Getting started

1. Grant **Accessibility** permission (required) and **Screen Recording** (optional — needed only for screenshot-based perception) in **Settings → Computer Use**.
2. Enable Computer Use on a custom agent: **Agents → Abilities → Subagents → Computer Use**.
3. Ask the agent to do something on screen: *"Open System Settings and turn on Night Shift"* or *"Fill in this form with my details"*.
4. Approve or deny each confirmation as it appears. The overlay shows a structured preview: app, action, target, and any text about to be typed.

## The autonomy model

Every action is classified by effect, then checked against your policy.

| Effect | Meaning |
|---|---|
| `read` | Pure perception — look, query, wait. Never mutates. Always allowed. |
| `navigate` | Moves focus or viewport without committing — click a link, scroll, switch app. |
| `edit` | Mutates reviewable, undoable state — type, set a value, clear a field. |
| `consequential` | Commits something hard to undo or crossing a trust boundary — send, submit, delete, purchase. |

The classifier can only ever *escalate* an action's effect, never lower it. Buttons labeled Send, Delete, or Purchase escalate to `consequential`; a bare Save or OK escalates to at least `edit`; icon-only buttons with no readable label do too.

### Presets

| Preset | navigate | edit | consequential |
|---|---|---|---|
| `read_only` | allow | **deny** | **deny** |
| `cautious` | confirm | confirm | confirm |
| **`balanced`** (default) | allow | confirm | confirm |
| `trusted` | allow | allow | confirm |
| `autonomous` | allow | allow | allow |

Three layers combine, and the **strictest always wins**:

1. **Global preset** — your baseline for every app (**Settings → Computer Use**).
2. **Per-app override** — can only make a specific app *stricter*, never looser.
3. **Per-agent ceiling** — a hard cap on each agent, set in its Subagents tab. An agent can be held stricter than your default but never looser.

Two extra guardrails apply regardless of preset:

- **App allowlist.** If you set one, only listed apps can be driven at all.
- **Dangerous-app guardrail.** Driving a sensitive app — Terminal, System Settings, Keychain Access, password managers, and similar — always requires at least a confirmation, no matter how permissive your preset is.

## Local-first perception

By default, everything the agent sees stays on your Mac: the accessibility tree, any screenshots, and on-device OCR.

A screenshot can reach a **cloud** model only if you explicitly consent (**Settings → Computer Use → Cloud vision**, off by default) — and even then it is scrubbed first:

- **Mask all text** (default) — opaque boxes are painted over *every* recognized text region, so nothing readable leaves the device.
- **Mask only detected sensitive text** (opt-in) — only regions matching your [Privacy Filter](/privacy-filter) rules and the on-device classifier are masked. Detection isn't perfect, which is why masking everything is the default.

If a task would benefit from cloud vision but you haven't consented, Osaurus shows a just-in-time prompt (Allow once / Always allow / Not now) instead of silently degrading.

## Screen context

Separate from driving apps, **Screen context** gives an agent ambient awareness of what you're doing — *without* taking any action. When enabled, a distilled, text-only snapshot of your screen (frontmost app, window titles, the field you're editing, salient on-screen text) is attached to the **first message** of each chat session and reused unchanged for the rest of the conversation.

- It's per-agent, nested under Computer Use (**Agents → Abilities → Subagents → Computer Use → Share screen context**), and on by default once an agent has Computer Use enabled. Agents without Computer Use — including the Default agent — never inject screen context.
- The snapshot is built entirely from the accessibility tree — no screenshots — so it passes through the text-based [Privacy Filter](/privacy-filter) before any cloud send.
- **Settings → Computer Use → Screen context** shows a live preview of exactly what would be shared, including how many spans the Privacy Filter would mask.

There's also a permission-gated **screenshot slash command** in chat for one-off captures.

## AppleScript subagent

For tasks that scriptable apps do better than clicking — Finder, Safari, Mail, Notes, System Events — an agent can delegate to the **AppleScript subagent**. A dedicated on-device model writes the script, and results or errors feed back so it can iterate.

- **Safe by default:** the generated script is shown in the confirmation overlay before it runs. An opt-in *auto-run with warning* mode exists for trusted workflows.
- Requires the macOS **Automation** permission, surfaced when first needed.
- Curated AppleScript models download from **Settings → Computer Use → Models**, with global defaults and per-agent overrides in the agent's Subagents tab.

## Run limits

Every run is bounded — by a step cap (default 24), a wall-clock budget (5 minutes), and stall detection (repeated identical actions, consecutive dead ends). When a run can't finish, the agent reports why instead of spinning.

## Where things live

| Path / setting | Purpose |
|---|---|
| `~/.osaurus/config/computer-use.json` | Global preset, per-app overrides, app allowlist |
| Agent settings (per agent) | Computer Use enable, autonomy ceiling, screen context |
| **Settings → Computer Use** | Presets, permissions, cloud-vision consent, AppleScript models |

Telemetry for Computer Use is coarse and privacy-clean: one event per run with outcome and bucketed counts — never the goal text, app names, or per-step detail. See [Telemetry](/telemetry).

---

**Related:**

- [Subagents](/subagents) — the delegation family Computer Use belongs to
- [Browser Use](/browser-use) — the same autonomy gate, applied to a real browser
- [Privacy Filter](/privacy-filter) — the scrubbing layer used for screen context and cloud vision
- [Agents](/agents) — configuring per-agent capabilities

---
title: Computer Use
sidebar_label: Computer Use
description: Let an agent use the apps on your Mac for you — fill in forms, change settings, or copy text off the screen — while it asks your permission before changing anything.
---

# Computer Use

Computer Use lets an [agent](/glossary#agent) operate the apps on your Mac for you: fill in a form, change a setting, find its way around an app, or copy text off the screen. It's useful for repetitive clicking you'd rather hand off. It's off until you turn it on for a specific agent, and by default it asks you before it changes anything. You need to give Osaurus the macOS **Accessibility** permission.

:::info[Experimental]
Computer Use is an experimental feature. Start with the default **Balanced** setting, which asks you before every change.
:::

## Get started

1. Open **Settings…** (`⌘ ,`) → **Computer Use**.
2. Under **Setup**, click **Grant** next to **Accessibility** (required). You can also grant **Screen Recording**, which is optional and only needed if you want the agent to take screenshots.
3. Go to **Settings… → Agents**, pick one of your own agents, and open **Abilities → Subagents**.
4. Turn on **Computer Use**. The card says **Unavailable** until Accessibility is granted.
5. Ask the agent for something on screen, like *"Open System Settings and turn on Night Shift"* or *"Fill in this form with my details"*.
6. When a confirmation card appears, check what the agent wants to do and click allow or deny.

Each confirmation card shows the app, the action, what it will click, and any text it's about to type. The cards appear in the chat window, so keep it open while the agent works.

:::note[Using it from the Orchestrator]
The [Orchestrator](/orchestrator) can't use Computer Use itself. Either chat with your Computer Use agent directly, or add that agent to the Orchestrator's agent pool so the Orchestrator can hand the job to it.
:::

## What happens while it works

The agent works one small step at a time:

1. **Look.** It reads what's on screen as a numbered list of buttons, fields, and menus.
2. **Decide.** It picks one next action, such as click, type, scroll, or open an app.
3. **Check with you.** Osaurus decides whether that action can go ahead, needs your OK, or isn't allowed.
4. **Act.** The action is sent to the app.
5. **Confirm.** It looks again to make sure the action actually worked.

The steps show live in the chat, but they don't clutter the conversation; you get a single summary at the end. Click **Stop** at any time to end the run, even while a confirmation card is showing.

The agent can't claim it finished unless it actually saw the screen change. If it can't prove the job worked, it says it gave up rather than reporting a false success.

## Choosing how much it can do alone

Every action falls into one of four kinds:

| Kind | Examples |
|---|---|
| **Read** | Looking at the screen. This never changes anything, so it always runs. |
| **Navigate** | Clicking a link, scrolling, switching apps. Moves around without changing anything. |
| **Edit** | Typing, choosing a value, clearing a field. Changes you can review or undo. |
| **Consequential** | Send, submit, delete, purchase. Hard to undo, or reaches other people. |

Pick a setting in **Settings… → Computer Use → Autonomy**:

| Setting | Navigate | Edit | Consequential |
|---|---|---|---|
| **Read-only** | Auto-run | Block | Block |
| **Cautious** | Ask first | Ask first | Ask first |
| **Balanced** (default) | Auto-run | Ask first | Ask first |
| **Trusted** | Auto-run | Auto-run | Ask first |
| **Autonomous** | Auto-run | Auto-run | Auto-run |

Osaurus errs on the side of caution. A button labeled Send, Delete, or Purchase always counts as consequential. A plain Save or OK, or a button with only an icon, counts as at least an edit.

### Extra safety settings

Three layers combine, and **the strictest one always wins**:

1. **Your main setting** above applies to every app.
2. **Per-app rules** (under **Advanced**) can make a specific app stricter, never looser.
3. **Each agent's limit**, set in that agent's **Subagents** tab, can hold the agent stricter than your main setting, never looser.

Two more guardrails apply no matter what you choose:

- **App allowlist** (under **Advanced**). If you add apps here, the agent can only use those apps.
- **Sensitive apps always ask.** Using Terminal, System Settings, Keychain Access, password managers, and similar apps always needs your OK, even on **Autonomous**.

## Your screen stays private

By default, everything the agent sees stays on your Mac: the on-screen text, any screenshots, and any text it reads out of images.

A screenshot only goes to a [cloud model](/glossary#cloud-model) if you allow it. Turn on **Allow masked screenshots to reach a cloud model** in **Settings… → Computer Use → Advanced → Cloud vision**. It's off by default. Even then, Osaurus covers text with solid boxes on your Mac before anything is sent:

- **Normally, all text is covered**, so nothing readable leaves your Mac. This is the recommended choice.
- **Turn on Mask only detected sensitive text** to cover only personal details such as names, emails, numbers, and secrets, and leave other text readable. It uses your [Privacy Filter](/glossary#privacy-filter) rules plus an on-device detector. Detection isn't perfect, which is why covering everything is the default.

If a task would go better with a screenshot but you haven't allowed it, Osaurus asks you at that moment (**Allow once**, **Always allow**, or **Not now**) instead of quietly doing a worse job.

## Screen context

Screen context is separate from operating apps. It gives an agent a quick, text-only snapshot of what you're doing (which app is in front, window titles, the field you're typing in, and key text on screen) so it understands your question better. It never clicks or types anything.

- The snapshot is attached to the first message of each chat and reused for the rest of that chat.
- It's set per agent: in the agent's **Subagents** tab, under **Computer Use**, use **Share screen context**. It's on by default once an agent has Computer Use. Agents without Computer Use, including the Orchestrator, never share screen context.
- It's built from on-screen text, not screenshots, so your Privacy Filter can hide personal details before it goes to a cloud model.
- **Settings… → Computer Use → Screen context** shows a live preview of exactly what would be shared.

There's also a screenshot slash command in chat for one-off captures. It asks for permission before it runs.

## AppleScript helper

Some apps, like Finder, Safari, Mail, and Notes, can be controlled with AppleScript (Apple's built-in automation language) more reliably than by clicking. For these, an agent can hand the job to an AppleScript helper, a [subagent](/glossary#subagent) that writes a short script with a small on-device model, runs it, and fixes it if it fails.

- **You see the script first.** It's shown in the confirmation card before it runs. For workflows you trust, you can switch to running scripts automatically with a warning.
- It needs the macOS [Automation](/glossary#automation-permission) permission, which macOS asks for the first time.
- Download AppleScript models in **Settings… → Computer Use → Models**. You can set a default there and override it per agent in the agent's **Subagents** tab.

## Troubleshooting

**The agent says it can't use Computer Use.** The message tells you why. Usually the agent is the Orchestrator (switch to one of your own agents), tools are turned off for that agent, or Computer Use isn't turned on in its **Subagents** tab.

**The run ended with "no chat window is open to show the approval card".** Confirmation cards need an open chat window. Open one and try again.

**The run stopped early.** Every run has limits on steps and time, and it stops if it keeps repeating itself. The agent tells you why it stopped. Time you spend on a confirmation card doesn't count against the time limit.

**The app quit or didn't open.** Osaurus checks that the app is still running before each action, and reports it if an app never finished opening.

---

## Under the hood

### The `computer_use` tool and loop

The agent calls one tool, `computer_use`, with the whole goal in plain language. That starts a nested subagent that runs a perceive → decide → gate → act → verify loop. Perception works primarily from the macOS **accessibility tree** (no pixels) and falls back to an annotated screenshot only when an element can't be resolved that way. The model proposes only the next action; the harness owns every deterministic decision: which element to target, whether the gate allows it, and whether it worked.

macOS input events are fire-and-forget, so "the click was sent" isn't proof it worked. The verify step reports one of three outcomes: **succeeded** (the view changed), **posted but no change observed** (look again before retrying), or **failed**. A `done` after acting is only accepted once a later look saw the view change. The model gets one challenge to re-check, and a second unproven `done` ends the run as given up.

### Effects and presets

| Effect | Meaning |
|---|---|
| `read` | Pure perception: look, query, wait. Never mutates. Always allowed. |
| `navigate` | Moves focus or viewport without committing: click a link, scroll, switch app. |
| `edit` | Mutates reviewable, undoable state: type, set a value, clear a field. |
| `consequential` | Commits something hard to undo or crossing a trust boundary: send, submit, delete, purchase. |

The classifier can only ever escalate an action's effect, never lower it.

| Preset ID | navigate | edit | consequential |
|---|---|---|---|
| `read_only` | allow | deny | deny |
| `cautious` | confirm | confirm | confirm |
| `balanced` (default) | allow | confirm | confirm |
| `trusted` | allow | allow | confirm |
| `autonomous` | allow | allow | allow |

If no chat window is open (for example, a headless dispatch), a gated action ends the run immediately instead of waiting on a card nobody can answer.

### Cloud vision masking

Screenshot redaction runs Vision OCR on-device. In the default mode, every recognized text region is painted over. With **Mask only detected sensitive text** on, only regions matching the Privacy Filter's detectors and the on-device classifier are masked. The cloud route only accepts an already-scrubbed frame, and requires consent.

### Run limits

Every run is bounded by a step cap (default 24), a wall-clock budget (5 minutes), and stall detection (repeated identical actions, consecutive dead ends). Time spent on a confirmation card or cloud-vision consent prompt is credited back to the wall-clock budget. Before posting input, the loop checks that the target app is still running, and `open` reports **not ready** when an app never finished launching.

### Where things live

| Path / setting | Purpose |
|---|---|
| `~/.osaurus/config/computer-use.json` | Global preset, per-app overrides, app allowlist |
| Agent settings (per agent) | Computer Use enable, autonomy ceiling, screen context |
| **Settings… → Computer Use** | Presets, permissions, cloud-vision consent, AppleScript models |

### Telemetry

Computer Use telemetry is coarse: a three-event funnel of `computer_use_attempt`, `computer_use_refused` (with the refusal stage, such as missing Accessibility or agent authorization), and `computer_use_run` (outcome and bucketed counts). It never includes the goal text, app names, agent IDs, or per-step detail. See [Telemetry](/telemetry).

---

**Related:**

- [Subagents](/subagents): the delegation family Computer Use belongs to
- [Browser Use](/browser-use): the same safety settings, applied to a built-in browser
- [Privacy Filter](/privacy-filter): the scrubbing layer used for screen context and cloud vision
- [Agents](/agents): configuring per-agent capabilities

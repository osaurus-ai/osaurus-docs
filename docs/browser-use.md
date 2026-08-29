---
title: Browser Use
sidebar_label: Browser Use
description: Give an agent its own persistent browser — it navigates, reads, clicks, and types against an isolated per-agent WebKit session, with every consequential action gated for your approval.
---

# Browser Use

Give an agent its own browser. `browser_use` runs a self-contained subagent that navigates, reads pages, clicks, types, and verifies each step against a **persistent, per-agent WebKit session** — cookies and sign-ins survive between chats, isolated from other agents and from your regular browser.

Browser Use is **off by default**, enabled **per custom agent** in its Subagents tab (the built-in Orchestrator never gets browser access), and every action passes through the **same safe-by-default autonomy gate as [Computer Use](/computer-use)** before it runs.

:::info[Replaces the osaurus.browser plugin]
Browser Use is the native replacement for the retired `osaurus.browser` plugin. Existing plugin installs remain visible under **Tools → Native Plugins** with a "Built into Osaurus" banner, but their tools no longer load. Each agent's WebKit profile is migrated automatically, so existing sign-ins carry over — see [Migration](#migrating-from-the-osaurusbrowser-plugin).
:::

## How it works

The chat agent calls one tool — `browser_use(goal:)` — exactly once. That tool spins up a **nested subagent** (the same machinery behind `computer_use`, `spawn_agent`, and `image`) that runs a navigate → act → verify loop against a private set of browser primitives and returns a single summary. The inner per-step decisions never clutter your conversation; they surface in a live feed rendered in the chat row, and you can stop the run at any time.

| Field | Required | Description |
|---|---|---|
| `goal` | yes | The complete task in plain language, naming the site when it matters |
| `max_steps` | no | Safety cap on subagent turns (each turn can batch many page actions). Default 24, clamped to 1–100. |

The subagent inherits the chat model by default, with the standard per-agent model override — including the single-residency handoff rules for local models (see [Subagents](/subagents#batch-execution-and-residency)). Because a run may legitimately park on a sign-in window, it has a 15-minute wall-clock budget rather than a normal tool timeout.

Under the hood, the subagent works with primitives like navigate, snapshot (numbered element references it can click and type against), read-page (readability-style article extraction), scroll, select, batched actions, screenshots, script execution, console/network inspection, and cookie operations. You never call these directly — the `goal` is the whole interface.

## Sessions: persistent, per-agent, isolated

- **One isolated profile per agent.** Each agent's session runs on a persistent WebKit data store. Cookies, localStorage, and sign-ins survive across chats and app restarts — and are never shared with other agents or your regular browser.
- **Sign-ins are yours, not the agent's.** The agent never types credentials. When it hits a login wall, it opens a **secure sign-in window** on the agent's profile; you sign in directly, and the run resumes logged-in when the window closes.
- **Settings → Browser Use** lists every session with its live/saved state, last page, and per-service sign-in badges. **Open** attaches the live view, **Close** detaches without touching data, **Reset** wipes the profile after confirmation.
- **Lifecycle.** Deleting an agent wipes its browser profile; factory reset wipes every profile. Idle live sessions close after 15 minutes (the saved profile restores at its last page on next use).
- **No uploads or downloads.** File choosers are declined and downloads fail with a typed error — pages can never be handed local files.

## Safety

Every browser action is classified into the same effect ladder as Computer Use and gated by the **shared autonomy policy** (Settings → Computer Use → Autonomy) plus the agent's own ceiling:

| Class | Browser actions | Default (Cautious) |
|---|---|---|
| Read | snapshots, waiting, console/network inspection, screenshots | auto |
| Navigate | navigation, scrolling, hovering, non-consequential clicks | auto |
| Edit | typing, selecting, setting cookies, handling dialogs | confirm |
| Consequential | submits, purchase/send/delete-looking clicks, cookie clears, session resets, sign-in windows, script execution | confirm |

Confirm cards run through the same approval overlay as Computer Use, with the site's domain shown as context. A denied action is remembered for the run — the subagent won't retry it.

Additional hardening:

- **URL scheme policy.** Only `http` and `https` pages load — `file://`, `data:`, and custom schemes are blocked at the tool boundary *and* at navigation time, covering redirects and clicked links.
- **Cookie redaction.** Cookie reads return names and flags only; including raw values requires an explicit approval.
- **Screenshot confinement.** Screenshots write only inside `~/Downloads`, never overwriting existing files.
- **Prompt-injection defenses.** All page content is treated as untrusted data — a page cannot change the goal, trigger sign-ins or resets, or reveal cookies, and the summary returned to your chat carries a "derived from web content" provenance note.

## Enabling it

1. Open **Management → Agents**, pick a custom agent, and open its **Subagents** tab
2. Turn on **Browser Use** (like every delegated capability, it ships disabled)
3. Ask for something that needs a browser: *"Check the pricing page on example.com and summarize the tiers."*

Only custom agents can enable Browser Use — the built-in Default agent is locked to its fixed baseline.

## Migrating from the `osaurus.browser` plugin

The migration is automatic and requires no action:

- At launch, each agent's exact WebKit profile is copied from the plugin's records into the native session catalog, so **existing sign-ins carry over**.
- The plugin's tools and skill no longer load; the installed card stays under **Tools → Native Plugins** with a "Built into Osaurus" banner, and uninstall works normally.
- One behavior deliberately did not carry over: the plugin sometimes shared the default agent's authenticated session with other agents. Native sessions are strictly per-agent.

---

**Related:**

- [Computer Use](/computer-use) — the same autonomy gate, applied to native macOS apps
- [Subagents](/subagents) — the delegation machinery Browser Use runs on
- [Web Search](/web-search) — for finding pages rather than operating them
- [Agents](/agents) — per-agent capability configuration

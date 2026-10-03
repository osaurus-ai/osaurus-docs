---
title: Browser Use
sidebar_label: Browser Use
description: Give an agent its own private web browser so it can visit sites, read pages, click, and fill in forms for you — staying signed in between chats, and asking before anything important.
---

# Browser Use

Browser Use gives an [agent](/glossary#agent) its own web browser. The agent can visit sites, read pages, click links, and fill in forms for you, like checking a pricing page or looking something up on a site you're signed in to. Each agent's browser is private: it stays signed in between chats, but it's kept separate from your other agents and from your own Safari or Chrome. It's off until you turn it on for an agent, and it asks you before doing anything important.

## Get started

1. Open **Settings…** (`⌘ ,`) → **Agents**, pick one of your own agents, and open **Abilities → Subagents**.
2. Turn on **Browser Use**. Like every ability on this tab, it starts off.
3. Ask for something that needs a browser, like *"Check the pricing page on example.com and summarize the tiers."*

The agent's steps show live in the chat, and you get a short summary at the end. You can stop the run at any time.

:::note[The Orchestrator doesn't browse]
Only your own agents can use Browser Use. The [Orchestrator](/orchestrator) never gets browser access.
:::

:::info[Replaces the osaurus.browser plugin]
Browser Use replaces the old `osaurus.browser` plugin. If you had it installed, its card stays in **Settings… → Tools & MCP → Plugins** with a "Built into Osaurus" banner, but it no longer does anything. Each agent's sign-ins carry over automatically. See [Migrating from the osaurus.browser plugin](#migrating-from-the-osaurusbrowser-plugin).
:::

## Signing in to sites

The agent never types your passwords. When it reaches a sign-in page:

1. Osaurus opens a secure sign-in window that uses that agent's browser.
2. You sign in yourself, in that window.
3. Close the window, and the agent carries on, signed in.

The sign-in is saved in that agent's browser, so you won't need to do it again next time. Because a run may wait for you to sign in, it can last up to 15 minutes.

## Managing browser sessions

**Settings… → Browser Use** lists each agent's browser session. For each one you can see whether it's **Active** or **Saved**, the last page it was on, and badges for the sites it's signed in to.

- **Open** shows the live browser window.
- **Close** closes the live window but keeps its sign-ins and data.
- The trash button resets the session. This deletes that agent's browsing data, including sign-ins, after you confirm. **Reset All Sessions** does the same for every agent.

Sessions also tidy up on their own:

- An idle live session closes after 15 minutes. Next time, it reopens at the last page it was on.
- Deleting an agent deletes its browser data. A factory reset deletes all of it.

## Staying in control

Browser Use uses the same safety settings as [Computer Use](/computer-use). Choose your setting in **Settings… → Computer Use → Autonomy**, and each agent can be held to a stricter limit in its **Subagents** tab.

With the default **Balanced** setting:

| Kind of action | Examples | With Balanced (default) |
|---|---|---|
| Read | Looking at a page, taking a screenshot | Runs on its own |
| Navigate | Opening pages, scrolling, ordinary clicks | Runs on its own |
| Edit | Typing, choosing from a list, answering a pop-up | Asks you first |
| Consequential | Submitting a form, clicks that look like buy, send, or delete, signing in, clearing sign-ins, running code on the page | Asks you first |

The confirmation card shows which website the action is on. If you deny an action, the agent won't try it again during that run.

Other protections:

- **Only normal web pages.** The browser only opens `http` and `https` addresses. It can't open files on your Mac.
- **No uploads or downloads.** Pages can never be handed your files.
- **Sign-in cookies stay hidden.** The agent can see which cookies exist, but not their contents unless you approve it.
- **Screenshots go to Downloads.** Screenshots are only saved in your Downloads folder and never overwrite existing files.
- **Web pages can't take over.** Everything on a page is treated as untrusted. A page can't change the agent's task, start a sign-in, reset the session, or read your cookies. The summary in your chat is marked as coming from web content.

---

## Under the hood

### The `browser_use` tool

The chat agent calls one tool, `browser_use(goal:)`, exactly once. That starts a nested [subagent](/glossary#subagent) (the same machinery behind `computer_use`, `spawn_agent`, and `image`) that runs a navigate → act → verify loop against a private set of browser primitives and returns a single summary.

| Field | Required | Description |
|---|---|---|
| `goal` | yes | The complete task in plain language, naming the site when it matters |
| `max_steps` | no | Safety cap on subagent turns (each turn can batch many page actions). Default 24, clamped to 1–100. |

The subagent inherits the chat model by default, with the standard per-agent model override, including the single-residency handoff rules for [local models](/glossary#local-model) (see [Subagents](/subagents#local-models-and-memory)). It has a 15-minute wall-clock budget rather than a normal tool timeout.

Internally, the subagent uses primitives like navigate, snapshot (numbered element references it can click and type against), read-page (readability-style article extraction), scroll, select, batched actions, screenshots, script execution, console/network inspection, and cookie operations. You never call these directly; the `goal` is the whole interface.

### Sessions

Each agent's session runs on a persistent WebKit data store. Cookies, localStorage, and sign-ins survive across chats and app restarts, and are never shared with other agents or your regular browser. File choosers are declined and downloads fail with a typed error.

### Safety classes

Every browser action is classified into the same effect ladder as Computer Use and gated by the shared autonomy policy plus the agent's own ceiling.

| Class | Browser actions | Balanced (default) |
|---|---|---|
| Read | snapshots, waiting, console/network inspection, screenshots | auto |
| Navigate | navigation, scrolling, hovering, non-consequential clicks | auto |
| Edit | typing, selecting, setting cookies, handling dialogs | confirm |
| Consequential | submits, purchase/send/delete-looking clicks, cookie clears, session resets, sign-in windows, script execution | confirm |

Hardening details:

- **URL scheme policy.** `file://`, `data:`, and custom schemes are blocked at the tool boundary and at navigation time, covering redirects and clicked links.
- **Cookie redaction.** Cookie reads return names and flags only; raw values need explicit approval.
- **Screenshot confinement.** Screenshots write only inside `~/Downloads`, never overwriting existing files.
- **Prompt-injection defenses.** Page content is untrusted data, and the summary returned to chat carries a "derived from web content" provenance note.

### Migrating from the `osaurus.browser` plugin

Browser Use is the native replacement for the retired `osaurus.browser` [plugin](/glossary#plugin). The migration is automatic:

- At launch, each agent's exact WebKit profile is copied from the plugin's records into the native session catalog, so **existing sign-ins carry over**.
- The plugin's tools and skill no longer load. The installed card stays under **Settings… → Tools & MCP → Plugins** with a "Built into Osaurus" banner, and uninstall works normally.
- One behavior deliberately didn't carry over: the plugin sometimes shared the Orchestrator's signed-in session with other agents. Native sessions are strictly per agent.

---

**Related:**

- [Computer Use](/computer-use): the same safety settings, applied to the apps on your Mac
- [Subagents](/subagents): the delegation machinery Browser Use runs on
- [Web Search](/web-search): for finding pages rather than operating them
- [Agents](/agents): per-agent capability configuration

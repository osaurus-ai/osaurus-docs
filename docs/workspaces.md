---
title: Workspaces
sidebar_label: Workspaces
description: Share agents with teammates, chat with theirs, and fund cloud calls from one shared monthly credit pool. Shared agents keep running on their owner's Mac.
---

# Workspaces

A **workspace** is a team space in Osaurus. Members share a monthly pool of [credits](/glossary#credits) for cloud models, and can share their [agents](/glossary#agent) so everyone in the group can chat with them. A shared agent keeps running on its owner's Mac; teammates reach it through Osaurus's [relay](/glossary#relay). Nothing about the agent is copied, and the owner's files never leave their Mac.

:::note[What you need]
Workspaces run on [Osaurus Router](/glossary#osaurus-router) and use your Osaurus [identity](/glossary#identity), which is set up automatically. If Router is off, the Workspaces tab shows **Osaurus Router is off** with an **Open Credits** button so you can turn it back on. The same identity on two of your own Macs sees the same workspaces.
:::

## Get started

1. Open **Settings…** (`⌘ ,`) → **Workspaces**.
2. Create a workspace (it starts with a free trial), or join one with an invite link or code. See [Creating and joining](#creating-and-joining).
3. On the **Shared Agents** tab, click **Share agent** to share one of yours, or click **Chat** on a teammate's agent.

## Plan, price, and trial

There's one plan — no tiers. Every workspace includes a shared monthly credit pool, a seat limit, and a shared-agent limit; the create sheet shows the current values (or "Unlimited members" / "Unlimited shared agents").

- **Price** — billed per workspace, monthly or yearly. Launch prices are **$20/month** or **$200/year**; the app always shows the live price from Router.
- **Free trial** — your *first* workspace subscription starts with a free trial (14 days by default; the sheet shows the current length). Your card is collected up front and first charged when the trial ends. A trialing workspace gets the full monthly pool.
- **One workspace while trialing** — you can add more once the trial converts to a paid subscription.
- **Checkout happens in your browser** through Stripe. The workspace appears in Osaurus as soon as Stripe confirms it — use **Check now** if you're waiting, or **Stop waiting** if you closed the tab.

Owners see a billing strip with the subscription status, renewal or trial-end date, and **Manage billing**, which opens the Stripe billing portal for card changes, invoices, cancellation, and switching between monthly and yearly.

## Creating and joining

1. **Create** — In **Settings… → Workspaces**, start a new workspace, give it a name, and pick a billing interval. With a live subscription, a new workspace is added to it and is ready right away; otherwise the button reads **Start free trial** or **Continue to checkout**.
2. **Invite** — On the workspace's **Members** tab, click **Invite** to create an invite link. Pick the role it grants and how many people can use it. Links expire after 14 days, and an owner or admin can revoke them.
3. **Join** — Open an invite link (`osaurus://workspaces/join?code=…`) in Osaurus, or paste the code under **Have an invite code?** in the Workspaces tab.

Bought a plan on osaurus.ai instead? Open the activation link from your receipt, or paste the **Activation code** in the Workspaces tab, then name the workspace to finish.

## Roles

| Role | Can do |
|---|---|
| **Owner** | Everything, including billing, pool top-ups, auto-reload, admin invites, and deleting the workspace |
| **Admin** | Invite and remove members, and manage shared agents |
| **Member** | Use shared agents, share their own, and spend from the pool |
| **Viewer** | Use the workspace's shared agents, but can't share their own |

Only the owner can create an invite link that grants **Admin**.

## Sharing agents

On the workspace's **Shared Agents** tab, click **Share agent** and pick one of your custom agents. Sharing turns on the agent's [Public Link](/glossary#public-link) so teammates can reach it over the internet, but only workspace members can get in. **Unshare** removes it for everyone at once.

Each shared agent shows presence (**Online**, or **Offline · last seen …**). If the host's Mac is asleep or Osaurus isn't running, teammates can't reach it.

- **Chatting with a teammate's agent** — Click **Chat** on the roster, or pick it from the chat sidebar, where shared agents appear alongside your own. The reply streams from the teammate's Mac.
- **Your own agents on another Mac** — An agent you shared from another of your devices shows as "Yours · other device" and works like a teammate's agent.
- **On the hosting side** — a run a teammate asked for opens as a tab on the shared agent's chat and is listed in **Settings… → Orchestrator → Delegations → Received**. It runs with *your* agent's settings and [tool](/glossary#tool) permissions.

Leaving a workspace drops your access to its shared agents and pool, and revokes the agents you shared.

## The workspace pool

The **Workspace pool** on the Overview tab is the shared balance that pays for pool-billed cloud calls. It holds two kinds of credit:

- **Monthly grant** — resets each cycle, with no rollover.
- **Purchased credit** — from top-ups and auto-reloads. It never expires. The grant is spent first.

Owners can refill it:

- **Add credits…** — a one-time top-up of $5–$500 (presets $20 / $50 / $100), paid in the browser with no fee. The card is saved on the owner subscription.
- **Auto-reload…** — when the pool drops below a threshold ($5 / $10 / $20 presets), charge the saved card a reload amount ($20 / $50 / $100), with an optional monthly cap (default $200). Every member sees an **Auto-reload on** or **Auto-reload paused** chip. After three failed charges auto-reload pauses; fix the card under **Manage billing**, then save to re-arm it.

When the pool runs dry, a pool-billed chat fails with an out-of-credits message. It never falls back to your personal credits. If auto-reload is on, wait a moment and send again.

A suspended or inactive workspace pauses invites, sharing, and pool-billed inference until the owner reactivates it with **Reactivate…**.

### Who pays for what

- **Teammates' runs of your shared agent** always bill the workspace pool.
- **Your own chats with an agent you shared** follow that agent's **Bill the workspace pool** switch on the Shared Agents tab. It's **on by default** once the agent is shared, so your cloud calls draw from the pool too. Turn it off to bill your personal credits instead. Osaurus remembers the opt-out, so it stays off.
- **The composer chip** shows which balance a turn will spend. When a chat bills the pool, the personal credits chip is replaced by the pool chip (workspace name · pool · balance).

## Shared agents and the Orchestrator

The [Orchestrator](/glossary#orchestrator) can hand jobs to teammates' shared agents, just like it does with your own [agents](/agents). (Handing off a job is called [delegation](/glossary#delegation).)

- **Auto-join.** When a workspace roster loads, every shared agent not hosted on this Mac joins **Settings… → Orchestrator → Subagents → Allowed subagents**. Remove one and it stays removed until you add it back. To turn auto-join off for one workspace, use **Let the Orchestrator delegate to shared agents** on its Shared Agents tab.
- **Naming.** The Orchestrator addresses shared agents as `Name@Workspace`. A bare name works while it's unique.
- **Permission.** **Permission for shared (workspace) agents** defaults to **Ask**, because the run leaves your Mac and spends that workspace's pool. One approval card covers every shared agent in a wave and names the agent, owner, and workspace.
- **What the agent sees.** Only the task text. It can't see your [Working Folder](/glossary#working-folder) or chat, so the Orchestrator puts everything it needs into the task.
- **What comes back.** The final answer, plus small files the agent shared, which appear as [artifact](/glossary#artifact) cards. Larger files stay on the teammate's Mac.
- **Offline hosts.** If the host isn't connected to the relay, the delegation is refused before anything runs, and the Orchestrator picks another agent or tells you.

## Privacy

- **Shared agents stay put.** The agent, its memory, its tools, and its files stay on the owner's Mac. Teammates send messages and get replies.
- **Runs are encrypted end to end.** Teammate runs travel over the [Secure Channel](/secure-channel) through the relay, so the relay sees only scrambled data. Teammates' access to your agent is short-lived and is tied to their workspace membership.
- **Router sees membership and billing.** Router keeps the member list, roles, who's online, and the pool's balance history, and lists pool-billed calls in the workspace's activity. Like all Router billing, these records contain details like cost and timing, never your messages or replies.
- **Tools run on the host.** A teammate's run of your agent uses your agent's tools on your Mac, under your permission settings. Share only agents whose abilities you're comfortable exposing.
- **Audit trail.** The **Audit** tab records every run and every change in the workspace.

## Troubleshooting

**A shared agent shows Offline.** Its owner's Mac is asleep, offline, or not running Osaurus. Ask the owner to open Osaurus.

**A chat fails with an out-of-credits message.** The workspace pool is empty. An owner can click **Add credits…** on the Overview tab, or wait for auto-reload if it's on.

**The Workspaces tab says "Osaurus Router is off."** Click **Open Credits** and turn Router back on.

---

## Under the hood

- **Sharing and identity.** Sharing gives the agent its own identity key, which signs the ownership proof, and turns on its relay tunnel. Only workspace members can authenticate to it.
- **Access keys.** Workspace access keys are short-lived and expire with Router's membership attestation. Workspace-minted keys get a strict route allowlist.
- **Invite links** use the `osaurus://workspaces/join?code=…` format.

Delegation settings for shared agents can also be written in the Orchestrator's [YAML](/glossary#json-yaml) configuration:

```yaml
delegation:
  spawnable_workspace_agents: [Research@Acme, "Writer@Beta Team"]
  workspace_auto_join:
    Acme: true
  permission_defaults:
    spawn_workspace: ask
```

---

**Related:**

- [Osaurus Router](/osaurus-router) — the service workspaces run on
- [Agents](/agents) — creating the agents you share
- [Orchestrator](/orchestrator) — delegating to shared agents
- [Identity](/identity) — the keys behind membership and sharing

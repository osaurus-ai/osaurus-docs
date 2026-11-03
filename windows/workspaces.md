---
title: Workspaces on Windows
sidebar_label: Workspaces
description: Invite your team to a workspace in Osaurus for Windows, share agents that keep running on your PC, and pay for them from a shared credit pool.
---

# Workspaces on Windows

A workspace lets your team chat with agents you share. A shared agent keeps running on your PC; teammates use it from their own Osaurus, on Windows or a Mac. Workspaces work as [Workspaces](/workspaces) describes, with the differences below. They're in **Settings → Workspaces**.

You need an Osaurus [account](/windows/account) and **Osaurus Cloud** turned on in **Settings → Providers**; the page tells you if either is missing.

## Create or join

- **New workspace**: name it, choose how often to be billed, and click **Start free trial** or **Continue to checkout**. Checkout opens in your browser; Osaurus notices when you're done (or click **Check now**).
- **Join with link**: paste an invite code or link (`osaurus://workspaces/join?code=…`). Clicking an invite link opens Osaurus and offers to join.
- **Activate a code**: enter the activation code from your osaurus.ai receipt.

## Invite teammates

Open the workspace, go to **Members**, and click **Invite link**. Choose a **Role** (**Viewer**, **Member**, or **Admin**; only the owner can make admins) and how many people may use it, then **Create link** and copy it. Links expire after 14 days. **Invite links** lists them, with **Revoke**. Change someone's role or remove them from the member list.

## Share an agent

On the **Shared agents** tab, click **Share an agent**. Choose the agent, how it's **Shown to teammates as**, and an optional description, then **Share agent**. Only agents you create can be shared, not the Orchestrator.

Sharing makes the agent reachable through the Osaurus relay. If remote access is off, Osaurus asks first (**Turn on and share**).

Teammates' agents appear on the same tab: click **Connect**, then **Chat**. A shared agent works only while its owner's PC is on and Osaurus is running. Your agents can also [delegate](/windows/agents#handing-work-to-other-agents) to teammates' agents.

## The workspace pool

A workspace has its own credits, shown on its **Overview** tab.

- **Add credits…** buys credits for the pool ($5 to $500). Bought credits never expire.
- **Auto-reload…** tops the pool up when it falls below an amount, with a monthly cap ($200 by default).
- **Pool activity** shows who used credits and for what.

A shared agent's Osaurus Cloud usage is billed to you unless you turn on **Bill the workspace pool** for it on the **Shared agents** tab.

## Audit

The **Audit** tab records who used your shared agents and what was refused, on this PC only. **Verify** checks that the record hasn't been altered, and **Export** saves it.

## Different from the Mac

- Billing a shared agent to the pool is off until you turn it on.
- **Activate a code** and **Pool activity** are Windows additions.
- An agent's status reads as a sentence ("Connected — ready to chat", "Offline — the host's Osaurus isn't reachable") rather than online/last seen.

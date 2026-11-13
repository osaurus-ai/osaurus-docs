---
title: Workspaces
sidebar_label: Workspaces
description: Share agents and workflows with teammates, chat with theirs, approve what their runs do on your Mac, and pay for cloud calls from shared Workspace Credits. Shared agents keep running on their owner's Mac.
---

# Workspaces

A **workspace** is a team space in Osaurus. Members share a monthly balance of [credits](/glossary#credits) for cloud models, chat with each other's [agents](/glossary#agent), and share [workflows](/glossary#workflow). A shared agent keeps running on its owner's Mac, and teammates reach it through Osaurus's [relay](/glossary#relay). Nothing about the agent is copied, and the owner's files never leave their Mac.

For example: Sam on your team has a Research agent that knows how to dig through industry reports. Sam shares it to the workspace. You pick it from your chat sidebar and ask a question. It runs on Sam's Mac, with Sam's tools, and the answer streams back to you. If it wants to do something that needs permission, Sam gets the approval card, not you.

:::note[What you need]
Workspaces run on [Osaurus Router](/glossary#osaurus-router) and use your [Osaurus ID](/glossary#osaurus-id), which is set up automatically. If Router is off, the Workspaces page shows **Osaurus Router is off** with **Open Wallet & Credits** so you can turn it back on. The same Osaurus ID on two of your own Macs sees the same workspaces.
:::

## Get started

1. Open Settings: click the gear icon at the bottom of the narrow strip on the left edge of the window, or press ⌘,.
2. Under **Sharing**, choose **Workspaces**.
3. Create a workspace (it starts with a free trial), or join one with an invite link or code. See [Creating and joining](#creating-and-joining).
4. Open the workspace. On the **Shared agents** tab, click **Share agent** to share one of yours, or click **Chat** on a teammate's agent.

## Plan, price, and trial

There's one plan, with no tiers. Every workspace includes monthly Workspace Credits, a seat limit, and a shared-agent limit; the create sheet shows the current values (or "Unlimited members" / "Unlimited shared agents").

- **Price.** Billed per workspace, monthly or yearly. Launch prices are **$20/month** or **$200/year**; the app always shows the live price from Router.
- **Free trial.** Your *first* workspace subscription starts with a free trial (14 days by default; the sheet shows the current length). Your card is collected up front and first charged when the trial ends. A trialing workspace gets the full monthly credits.
- **One workspace while trialing.** You can add more once the trial converts to a paid subscription.
- **Checkout happens in your browser** through Stripe. The workspace appears in Osaurus as soon as Stripe confirms it. Use **Check now** if you're waiting, or **Stop waiting** if you closed the tab.

Owners see a billing strip with the subscription status, the renewal or trial-end date, and **Manage billing**, which opens the Stripe billing portal for card changes, invoices, cancellation, and switching between monthly and yearly.

## Creating and joining

1. **Create.** On the Workspaces page, start a new workspace, give it a name, and pick a billing interval. With a live subscription, a new workspace is added to it and is ready right away; otherwise the button reads **Start free trial** or **Continue to checkout**.
2. **Invite.** On the workspace's **Members** tab, click **Invite** to create an invite link. Pick the role it grants and how many people can use it. Links expire after 14 days, and an owner or admin can revoke them.
3. **Join.** Open an invite link in Osaurus, or paste the code under **Have an invite code?** on the Workspaces page.

Bought a plan on osaurus.ai instead? Open the activation link from your receipt, or paste the **Activation code** on the Workspaces page, then name the workspace to finish.

## Roles

| Role | Can do |
|---|---|
| **Owner** | Everything, including billing, credit top-ups, auto-reload, admin invites, and deleting the workspace |
| **Admin** | Invite and remove members, and manage shared agents and shared workflows |
| **Member** | Use shared agents, share their own agents and workflows, and spend Workspace Credits |
| **Viewer** | Chat with shared agents and install shared workflows, but can't share their own |

Only the owner can create an invite link that grants **Admin**.

## Sharing agents

On the workspace's **Shared agents** tab, click **Share agent** and pick one of your custom agents. Sharing turns on the agent's [Remote Access](/remote-access) so teammates can reach it over the internet, but only workspace members can get in. **Unshare** removes it for everyone at once.

Each shared agent shows whether it's **Online** or **Offline** (with when it was last seen). If the owner's Mac is asleep or Osaurus isn't running, teammates can't reach it.

- **Chatting with a teammate's agent.** Click **Chat** on the roster, or pick the agent from the workspace's group in the chat sidebar. The reply streams from the teammate's Mac.
- **On your side, as the host.** A run a teammate asked for opens as a tab on your agent's chat, titled with who asked. It's also listed in **Settings → Agents → Orchestrator → Delegations → Received**. It runs with *your* agent's settings and [tool](/glossary#tool) permissions.
- **Your own other Mac.** To use your own agents from another Mac, add it under [Devices & Sync](/devices) instead. An agent you shared to a workspace from your other Mac shows there as "Yours · other device."

### Approving a teammate's tool calls

A teammate can't answer your [approval](/glossary#approval) cards. So by default, a tool that needs approval simply fails in their run. To have the run wait for you instead, turn on **Require Approval for Teammate Tool Calls** on each agent you host (on the **Shared agents** tab).

With it on:

1. An **Approval needed** card appears in the teammate's conversation on your Mac. A desktop notification offers **Allow**, **Allow for This Conversation** and **Deny**. Your iPhone and your other synced devices list it too. The first answer wins.
2. The teammate sees "Waiting for @you to allow *the tool*" in their chat.
3. If nobody answers within **Decline Unanswered Requests After** (10 minutes by default; 5 minutes to 24 hours), the call is declined and the agent carries on without it.

Good to know:

- **Allow for This Conversation** covers that tool for that person in that conversation only. There's no "Always Allow" for teammates, and tools that write or edit files ask every time.
- With the switch on, your agent can also ask *you* a question during a teammate's run. Answer with **Reply**.
- Everything waiting on you is in **Inbox → Needs You**. What you answered is in **Insights → Interactions**.
- Tools you set to **Deny**, and tools never allowed for remote callers (such as running commands), stay blocked. Approval can't unlock them.
- Where these requests reach you is **Settings → General → Notifications → Approvals**.

### Joining a teammate's conversation

You can type into a teammate's conversation with your agent, making it three-way. Open its tab on your Mac and write in the line under the transcript (**Message** *caller* **and your agent as yourself…**). The teammate sees your message labeled with your handle, and the agent treats your words as the owner's. Your other synced Macs show the conversation under **On** *the Mac that ran it*; writing there shows **Waiting for** *that Mac* until it delivers your message.

## Sharing workflows

There are two different ways to share a [workflow](/workflows) with a workspace. Pick by where it should run and whose keys it should use.

**Give teammates their own copy.** Publish the workflow with **Who can see it → Workspace** and tick the workspaces. Each member installs their own copy, which runs on their Mac with their own keys and models.

1. On the workflow's page, click **Share…** and choose **Publish to store.osaurus.ai**.
2. Under **Who can see it**, choose **Workspace** and tick the workspaces.
3. Publish. It isn't listed on the public store and isn't reviewed.

Members find it under **Workflows → Workspaces** (the Workflows icon on the left edge of the window), or on the workspace's **Workflows** tab, and click **Install**. Later they'll see **Update**, **Set Up** or **Open**. Owners, admins and members can share; viewers can only install. The author, owners and admins can take a listing down with **Remove from workspace**; copies already installed keep working. See [Share a Workflow](/workflows-share).

**Let teammates run yours on your Mac.** Turn on **Teammates can run this** on the workflow's page, under **Who Can Start It**. One of your shared agents must have the workflow turned on (**Agents** → the agent → **Abilities** → **Workflows**). Teammates don't get a copy. Instead, a teammate's run uses *your* Mac, *your* keys, connections and folders, and they get the result. Each call waits for your approval through that agent's **Require Approval for Teammate Tool Calls**.

Teammates see it under **Workflows → Workspaces** as **Runs on** *your name*'s **Mac**, and can click **Add to My Workflows** so their own agents can call it too. Every such run still asks you. Your Mac has to be online.

A workflow can also hand work *to* a teammate's shared agent with an Agent step. It sends only the task text and gets the answer back.

## Workspace Credits

**Workspace Credits**, on the workspace's **Overview** tab, is the shared balance that pays for cloud calls billed to the workspace. It holds two kinds of credit:

- **Monthly grant.** Resets each cycle, with no rollover.
- **Purchased credit.** From top-ups and auto-reloads. It never expires. The grant is spent first.

Owners can refill it:

- **Add credits…** A one-time top-up of $5–$500 (presets $20 / $50 / $100), paid in the browser with no fee. The card is saved on the owner's subscription.
- **Auto-reload…** When the balance drops below a threshold ($5 / $10 / $20 presets), charge the saved card a reload amount ($20 / $50 / $100), with an optional monthly cap (default $200). Every member sees an **Auto-reload on** or **Auto-reload paused** chip. After three failed charges, auto-reload pauses; fix the card under **Manage billing**, then save to turn it back on.

When Workspace Credits run out, a chat billed to them fails with an out-of-credits message. It never falls back to your personal credits. If auto-reload is on, wait a moment and send again.

A suspended or inactive workspace pauses invites, shared agents, shared workflow installs, and anything billed to Workspace Credits until the owner renews with **Reactivate…**. Hosts enforce it too: while a workspace is suspended, a teammate's run is refused, even on a local model, with "This workspace is suspended, so its shared agents are paused until the owner renews it."

### Who pays for what

- **Teammates' runs of your shared agent** always use Workspace Credits.
- **Your own chats with an agent you shared** follow that agent's **Bill Workspace Credits** switch on the **Shared agents** tab. It's **on by default** once the agent is shared, so your cloud calls use Workspace Credits too. Turn it off to bill your personal credits instead. Osaurus remembers the choice.
- **The composer chip** shows which balance a turn will spend.

## Shared agents and the Orchestrator

The [Orchestrator](/glossary#orchestrator) can hand jobs to teammates' shared agents, just like it does with your own [agents](/agents). (Handing off a job is called [delegation](/glossary#delegation).)

- **Auto-join.** When a workspace's roster loads, every shared agent not hosted on this Mac joins **Settings → Agents → Delegation → Allowed subagents**. Remove one and it stays removed until you add it back. To turn auto-join off for one workspace, use **Let the Orchestrator delegate to shared agents** on its **Shared agents** tab.
- **Naming.** The Orchestrator calls shared agents `Name@Workspace`. A bare name works while it's unique.
- **Permission.** **Permission for shared (workspace) agents**, under **Settings → Agents → Delegation**, defaults to **Ask**, because the run leaves your Mac and spends that workspace's credits. One approval card covers every shared agent in a batch and names the agent, owner and workspace.
- **What the agent sees.** Only the task text. It can't see your [Working Folder](/glossary#working-folder) or chat, so the Orchestrator puts everything it needs into the task.
- **What comes back.** The final answer, plus small files the agent shared, which appear as [artifact](/glossary#artifact) cards. Larger files stay on the teammate's Mac.
- **Offline hosts.** If the host can't be reached, the hand-off is refused before anything runs, and the Orchestrator picks another agent or tells you.

## Leaving a workspace

Leaving drops your access to its shared agents, workflows and Workspace Credits. It also unshares the agents you shared and removes the workflows and agent templates you shared from its **Workflows** list. If your Osaurus is offline when you leave (or an owner removes you), store.osaurus.ai removes those listings on its own within a few minutes.

## Privacy

- **Shared agents stay put.** The agent, its memory, its tools and its files stay on the owner's Mac. Teammates send messages and get replies.
- **Runs are encrypted end to end.** Teammate runs travel over the [Secure Channel](/secure-channel) through the relay, so the relay sees only scrambled data. Teammates' access to your agent is short-lived and tied to their membership.
- **Tools run on the host, with the host's permission.** A teammate's run of your agent uses your agent's tools on your Mac, under your permission settings. Share only agents whose abilities you're comfortable exposing, and turn on **Require Approval for Teammate Tool Calls** for anything sensitive.
- **"Teammates can run this" uses your keys.** A teammate starting your workflow uses your accounts and keys, on your Mac. You approve every call.
- **Router sees membership and billing.** Router keeps the member list, roles, who's online, and the balance history, and lists billed calls in the workspace's activity. Like all Router billing, these records contain details like cost and timing, never your messages or replies.
- **Audit trail.** The **Audit (this Mac)** tab records what this Mac saw: every run and every change in the workspace.

## Guest links

To give one person who isn't in a workspace access to one agent, use a guest link instead (**Share Agent → Guest Link**). Guests aren't on the workspace roster; they're listed under **Settings → Sharing → Access → Guests**. See [Remote Access](/remote-access).

## Troubleshooting

**A shared agent shows Offline.** Its owner's Mac is asleep, offline, or not running Osaurus. Ask the owner to open Osaurus.

**A teammate's run says a tool was declined.** You didn't answer within the time limit, or **Require Approval for Teammate Tool Calls** is off. Turn it on, or answer from **Inbox → Needs You**.

**A chat fails with an out-of-credits message.** Workspace Credits are empty. An owner can click **Add credits…** on the **Overview** tab, or wait for auto-reload if it's on.

**The Workspaces page says "Osaurus Router is off."** Click **Open Wallet & Credits** and turn Router back on.

---

## Under the hood

- **Sharing and identity.** Sharing gives the agent its own identity key, which signs the ownership proof, and turns on its relay tunnel. Only workspace members can authenticate to it.
- **Access keys.** Workspace access keys are short-lived and expire with Router's membership attestation. Workspace-minted keys get a strict route allowlist.
- **Invite links** use the `osaurus://workspaces/join?code=…` format.
- **Teammate approvals** are declarative as `agents[].shared_tool_approval: {mode: ask_owner, timeout_seconds: 600}`. Shared artifacts are capped at 16 files and 4 MB per run.
- **Hosted workflows.** **Teammates can run this** adds a link, not a template, on the teammate's side; an automation can't start a hosted workflow. Each start, finish and refusal is in the workspace audit log and in Insights → **Interactions**.

Delegation settings for shared agents can also be written in [YAML](/glossary#json-yaml) configuration:

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

- [Share a Workflow](/workflows-share): Workspace visibility and Teammates can run this
- [Osaurus Router](/osaurus-router): the service workspaces run on
- [Agents](/agents): creating the agents you share
- [Orchestrator](/orchestrator): delegating to shared agents
- [Remote Access](/remote-access): guest links and the relay
- [Osaurus ID](/identity): the identity behind membership and sharing

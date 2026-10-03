---
title: Osaurus Router
sidebar_label: Osaurus Router
description: Use powerful cloud AI models without signing up with each AI company. Osaurus Router appears in the model picker as Osaurus Cloud, and you pay with prepaid credits — no API key to paste.
---

# Osaurus Router

Osaurus Router is Osaurus's own service for [cloud models](/glossary#cloud-model). It lets you use capable hosted models — from DeepSeek, Anthropic, OpenAI, and others — without creating an account or pasting an [API key](/glossary#api-key) for each company. Its models appear in the model picker as **Osaurus Cloud**, and you pay with prepaid [credits](/glossary#credits).

There's nothing to set up: it's on by default and connects automatically using your Osaurus [identity](/glossary#identity), which Osaurus creates for you.

It's one of three ways to get a model. Your agents, memory, and tools work the same with all of them:

- **Local models** and **Apple's Foundation model** run on your Mac and work offline. See [Models](/models).
- **Your own provider keys** connect cloud companies directly. See [Remote Providers](/remote-providers).
- **Osaurus Router** is the "I just want a capable hosted model, no setup" option.

## Get started

1. In a chat, click the model pill in the message box.
2. Under **Osaurus Cloud**, pick a model. (If it shows **Explore**, click it to open the Cloud model browser.)
3. Add credits if you need to: click the **Credits** button in the message box, then **Add credits**.
4. Start chatting.

You can also pick an Osaurus Cloud model as an agent's default model.

## Finding models

The Osaurus Cloud list in the picker shows your favorites plus the model you're using now. Click the star next to any model to add or remove it as a favorite.

**More models** (or **Explore**) opens the **Cloud model browser**. You can:

- Search by model or company.
- Filter by **Category** or **Context** (how much text a model can keep in mind at once).
- See each model's starting price in credits.

Selecting a model closes the browser; starring one keeps it open. **Manage Credits** opens your account controls.

If you have no favorites yet, Osaurus adds a few starter models once (DeepSeek V4.1 Flash, Claude Opus 5.5, and GPT-6 Astra). If you remove a starter, it stays removed, and your own favorites are never changed.

## Credits

You pay for Osaurus Cloud with credits. **$1 buys 10,000 credits.** Credits also pay for premium web search and hosted image and video generation. Where it helps, prices and usage also show the dollar amount.

### Checking your balance in chat

Hover over the **Credits** button in the chat message box to see your balance; click it to keep the card open. The card shows:

- Your balance
- What this chat has spent so far
- Recent activity

**Add credits** opens the top-up window. **View all** opens **Settings… → Credits**.

When a chat bills a [workspace](/glossary#workspace) pool instead of your own balance, the button shows the pool instead (workspace name · pool · balance).

### Redeeming a code

Got a promotion or referral code?

1. Open **Settings… → Credits**.
2. Under **Have a code?**, type your code in the **Enter your code** field.
3. Click **Redeem**.

Osaurus Router and your Osaurus identity both need to be on. When it works, you see the campaign's message, your balance updates, and you can click **Redeem another code**. If you've already used the code, it says so. Some referral rewards stay pending until your first paid top-up.

If it doesn't work, the message tells you what to do:

- **Unknown or mistyped code** — check the code and try again.
- **Not available for your account** — this code can't be used on your account.
- **Identity or connection problem** — fix that, then try again.
- **Service problem** — try again later.
- **Too many attempts** — wait for the countdown to finish.

Your code stays in the field after an error you can retry, and editing it clears the error.

### Workspaces and shared credits

[Workspaces](/workspaces) add a shared pool of credits on top of your personal balance. When teammates use an agent you've shared, it always draws from the workspace pool. For your own chats with a shared agent, each agent has a **Bill the workspace pool** switch.

Dollars only appear where real money changes hands: adding credits, the Workspaces subscription price, and the pool's top-up and auto-reload amounts.

## Turning it off

Osaurus Router is on by default. To turn it off, switch off **Osaurus Router** in **Settings… → Credits**, or disable the Router provider in **Settings… → Providers**. With it off, Osaurus Cloud models and shared workspace agents can't be reached.

## Announcements

Occasionally Osaurus shares news — launches, events, heads-ups — through the Router, so it can change without an app update. Osaurus checks shortly after you open it and when you come back to it (at most every 30 minutes), shows each announcement once, and never shows it again. The check sends no account information. If it fails, nothing is shown.

## Your privacy

Osaurus Router keeps track of what you're billed for, but **never what you said**. Your messages, the AI's replies, and anything your tools send or receive are never saved in billing records — only details like which model ran, how much text it processed, and the cost.

- **No double charges.** If a connection drops and Osaurus retries automatically, you're only billed once. Clicking **Retry** yourself starts a new, separately billed run.
- **A copy of your bills stays on your Mac.** This helps support sort out "I was charged but saw nothing" without any of your chats leaving your Mac. You can export it, without your conversations, from the Dashboard.

Osaurus also keeps background requests to a minimum. It only contacts the Router when you do something or open a screen that needs it, not on a timer. Each request to your account appears in [Insights](/glossary#insights).

## Troubleshooting

- **No Osaurus Cloud models in the picker?** Check that **Osaurus Router** is on in **Settings… → Credits** and that you're online. Osaurus reconnects on its own after sleep or a dropped connection.
- **A request is refused for lack of credits?** Add credits from the **Credits** button or **Settings… → Credits**. A workspace chat draws from the workspace pool, so that pool may need topping up instead.
- **An empty answer?** If a model finishes without writing anything, Osaurus shows a notice instead of an empty bubble. Try again or pick another model.

---

## Under the hood

### How it connects

Router is an OpenAI-compatible remote [provider](/glossary#provider). Its availability follows your local Osaurus identity: when an identity is present, Osaurus adds the Router provider to your remote provider list, where it behaves like any other provider. It speaks standard OpenAI Chat Completions, so streaming and tool calling work as they do elsewhere, including in the [agent loop](/agent-loop).

- It connects at app launch alongside your other auto-connect providers.
- Signing in or changing identity reconnects Router automatically.
- Waking the Mac or recovering network connectivity retries discovery.
- Temporary connection failures retry quietly; authentication and contract errors surface as real, final errors instead of spinning forever.

### Reliability details

- **Output length.** If a request doesn't set `max_tokens`, Osaurus sends a sensible default so a long agent run isn't silently cut off by an upstream cap.
- **No silent empty answers.** A response that finishes without visible text shows an explicit empty-response notice.
- **Prompt caching.** Every turn of a conversation — including agent-loop tool rounds — carries a session-scoped `prompt_cache_key` (`osaurus-session-{id}`). Router forwards it to upstreams with keyed prompt caches (and adds Anthropic cache markers itself), then bills cached input at the discounted rate. The split shows as **"N cached · P%"** in the chat's Credits card (for this session), as a cached-input total in Credits activity when non-zero, and on each activity row.

### Code redemption details

Codes are trimmed before submission, and the field and controls are disabled while a request is running. Account eligibility is decided by the server; error messages are deliberately actionable without exposing eligibility details. Code redemption is no longer part of the three-screen first-launch flow.

### Hosted image and video quotes

Hosted image and video generation uses the same balance. Video jobs are quoted before they start, the approved amount is bound to the request, and expired or mismatched quotes are rejected rather than silently charging a different amount.

### Reading the balance from local tools

Scripts and status-bar tools on your Mac can read the balance with [`GET /credits/balance`](/api#get-creditsbalance) on the local [API](/glossary#api). It needs a master [access key](/glossary#access-key), or **Allow local API access without a key** in **Settings… → Credits** for keyless [loopback](/glossary#loopback) requests (browser requests always need a key). Osaurus signs the hosted request itself, so the caller never touches your wallet key.

### Background request policy

Signed Router account calls appear as rows in **Settings… → Insights**, so Osaurus asks the Router only when you act or open a surface, not on a timer. Switching back to the app doesn't refresh anything except a pending Stripe top-up or workspace confirmation; the composer's credits chip reuses a balance up to five minutes old; and workspace sync stays off until your account belongs to a workspace.

The announcements check is unauthenticated, sends no account data, and isn't logged to Insights.

### Local billing ledger

Router charges are also recorded at `~/.osaurus/billing/ledger.sqlite` (encrypted with your storage key when you've opted in to [storage encryption](/storage)). It keeps the newest 10,000 rows for up to 365 days. Each row has correlation data — request id, model, token counts (including the cached-input / cache-write split), cost, status, and how the turn rendered — and no prompt or response text. Retries and reconnects are de-duplicated per logical step.

---

**Related:**

- [Remote Providers](/remote-providers) — connect your own OpenAI, Anthropic, Gemini, and other provider keys
- [Workspaces](/workspaces) — shared agents and the workspace credit pool
- [Models](/models) — how local, Apple Foundation, and cloud models share one picker
- [Identity](/identity) — the identity Router depends on
- [HTTP API](/api) — the OpenAI-compatible interface Router uses

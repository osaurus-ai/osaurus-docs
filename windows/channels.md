---
title: Agent Channels on Windows
sidebar_label: Agent Channels
description: Connect Discord, Slack, Telegram, n8n, or your own HTTP service to Osaurus for Windows, so agents can answer messages there and post to places you allow.
---

# Agent Channels on Windows

Channels connect your agents to chat apps and services. An agent can answer messages people send there, and post to places you allow. Channels work as [Agent Channels](/agent-channels) describes on the Mac, with the differences below. They're in **Settings → Channels**.

## Channels on Windows

| Channel | How it connects |
|---|---|
| **Discord** | A bot you create; Osaurus checks for new messages every few seconds |
| **Slack** | A Slack app over Socket Mode |
| **Telegram** | A bot you create with @BotFather |
| **n8n** | n8n sends messages in and gets replies back |
| **Custom HTTP** | Your own JSON service, for posting and reading only |

Discord, Slack, and Telegram don't need your PC to be reachable from the internet: Osaurus reaches out to them. Each can be set up once. WhatsApp and iMessage aren't on Windows.

## Add a channel

On the **Connections** tab, click **Add Discord**, **Add Slack**, **Add Telegram**, **Add n8n**, or **Add Custom HTTP**. Each editor walks you through connecting, then where the bot may listen and post, who may talk to it, and how it replies.

- **Discord**: create an application and bot in the Developer Portal (**Open the Developer Portal**), turn on **Message Content Intent**, paste the bot token, and click **Connect**. Then **Open invite link** to add the bot to your server. The bot shows as offline in Discord; that's expected.
- **Slack**: give the app a name and click **Create app in Slack**, which opens Slack with the settings filled in. Paste the **Bot token** (`xoxb-…`) and the **App token** (`xapp-…`), and click **Connect**.
- **Telegram**: create the bot with @BotFather (**Open @BotFather**, then `/newbot`), paste its token, and click **Connect**. Then send your bot a message so you show up to be allowed. To let it see every message in a group, turn off its privacy mode with `/setprivacy` in @BotFather.

Tokens are stored encrypted on this PC.

### Who and where

Under **Where can Osaurus listen and post?** (on Telegram, **…listen and reply?**), choose the channels, chats, or groups Osaurus may use, each set to **Listen only** or **Can post** (or **Can reply**). Under **Who can talk to the agent?**, choose the people. Someone new who messages the bot shows as **Waiting for approval**, with **Allow** and **Deny**.

### Answering messages

Under **Replies**:

1. Turn on **Send incoming messages to an agent** and choose the **Agent that answers**.
2. **When should it respond?** Only when @mentioned (the default; on Telegram, a reply to the bot counts too), or **Every message in the channels above**.
3. **Reply automatically** posts its replies in the channel. Off, replies stay in Osaurus for you to read.

**Routing rules** send messages to different agents: a message starting with a name (`sales: …`) picks that rule first, then a rule for the channel, then the agent above. Agents answering a channel can't use their MCP tools unless you turn on **Let the answering agent use its MCP tools**.

Use **Test connection** to check it; **Recent activity** shows what came in and what happened to it.

## n8n

1. Name the connection, then choose **Where does n8n run?**: **This PC**, **Docker Desktop on this PC**, or **Another computer on my network**.
2. Choose **Which agent answers?** (or **Decide later**), and how replies get back: n8n waits for the reply, or Osaurus also pushes it to an n8n webhook.
3. Click **Create connection**, then **Pair with n8n**. Use **Show pairing code** for the Osaurus node, or copy the addresses and secret for n8n's HTTP Request nodes.

For **Another computer on my network**, Osaurus must listen on your network first: set the address in **Settings → Connections → Network access** and restart Osaurus. Then turn on **Allow plaintext HTTP from other machines** in the n8n editor, unless n8n reaches Osaurus over an encrypted connection. An n8n on the internet can't be paired with Windows yet.

## Custom HTTP

Connects to your own JSON service so agents can post to it and read from it. Give it a **Name** and **Base URL**, add a key if it needs one, and click **Create connection**. Then define what the agent can do (**Add action**) and where (**Where may the agent read and post?**). It's https only unless you allow plain http. Nothing comes in from it on its own.

## Letting agents post

On the **Agent posting** tab, **Add destination** lets an agent post to a channel on its own. Choose the agent, the channel and conversation, and what happens when it wants to post:

| Mode | What happens |
|---|---|
| **Off** | It can't post here |
| **Drafts only** | Its messages wait in the **Outbox** for you |
| **Ask first** (default) | You approve each message |
| **Auto-send** | It posts without review; you have to confirm you understand |

Each destination is limited to 10 messages an hour, 30 seconds apart, by default. Only chat runs can post to a new destination; to let schedules, watchers, or wake-ups post too, tick them under **Which kinds of run may post here** in its advanced settings.

The agent's **Chat** tab lists the channels it can post to.

**The Outbox** holds messages waiting for you (**Review**, then send or **Discard**) and a 30-day history. **Activity & audit** shows everything that came in and went out, with **Copy redacted export**.

## The master switch

**Allow agents to send messages**, at the top of **Connections**, pauses all sending everywhere when off; agents can still read. It's on by default.

## Different from the Mac

- Five channel kinds: Discord, Slack, Telegram, n8n, and Custom HTTP. No WhatsApp, iMessage, or helper apps.
- One Slack, one Discord, and one Telegram bot.
- The Discord bot appears offline.
- Editors have **Save** and **Cancel**; tokens are saved when you click **Connect**.
- n8n can't be paired over the internet.

---

## Under the hood

- Every message in is checked against your allowlists before it's recorded, and duplicates are dropped. Agents answering a channel run as an outside caller: unattended, and unable to use channel tools or delegate.
- Every post checks the master switch, the destination's mode, and its write allowlist. A post whose delivery is unclear is marked **Unconfirmed** and never retried on its own.
- n8n requests are signed (HMAC-SHA256 by default) and limited to 120 a minute.
- A reply longer than the channel allows is split into at most five messages.

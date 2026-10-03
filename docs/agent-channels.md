---
title: Agent Channels
sidebar_label: Agent Channels
description: Let your agents answer and send messages in WhatsApp, Slack, Telegram, Discord, iMessage, n8n workflows, or other online services, with you deciding who they talk to and what they can send.
---

# Agent Channels

**Agent Channels** let your [agents](/glossary#agent) take part in your chat apps: **WhatsApp**, **Slack**, **Telegram**, **Discord**, and **iMessage**, plus **n8n** workflows and other online services. An agent can answer messages people send it, and it can start messages of its own, like a morning summary in a Slack channel. You decide exactly which chats it can read, who it listens to, and whether it sends on its own or asks you first.

You'll need an account with the chat app. Some apps also need a "bot" (an app account for your agent) that you create on their website.

## Get started

1. Open **Settings…** (`⌘ ,`) → **Channels** and click **Add Channel**.
2. Pick the app you want to connect. (n8n has its own guided setup; see [n8n](#n8n).)
3. Work through the four sections:
   1. **Connect:** sign in or paste your bot's details. For iMessage and WhatsApp, download the small helper app Osaurus offers.
   2. **Conversations:** choose which chats the agent may read, which it may write to, and which people it may listen to. You can search by name.
   3. **Agent Behavior:** turn on replies and choose which agent answers.
   4. **Test:** send a real message and watch it arrive, reach the agent, and get a reply.

Changes save as you go. Passwords and bot tokens are kept in your [Keychain](/glossary#keychain), macOS's secure password storage.

## Two ways agents use channels

- **Replies:** the agent answers messages people send it. You choose which chats and people can reach it, which agent answers, and whether its reply is posted automatically.
- **Messages agents can start:** the agent brings something up on its own, for example from a [schedule](/schedules). The Channels page calls these **Messages Agents Can Start**; each agent's Channels tab calls them **Messages It Can Start**.

## Replies

In **Agent Behavior**, turn on **Reply with an Agent** and choose the agent that answers by default.

You can also send different chats to different agents. Osaurus picks the agent in this order:

1. If the message starts with an agent's name, like `sales:`, that agent answers.
2. Otherwise, if you set an agent for that chat, that agent answers.
3. Otherwise, the agent you chose in **Reply with an Agent** answers.

### Posting the reply

The agent's reply is only posted back to the chat app when **Reply Automatically** is on. With it off, the agent still runs, but its reply stays in Osaurus. The channel's activity list shows "Agent replied (auto-reply off)," and a warning appears under the switch.

Replies are cleaned up before posting, and still follow your write permissions and the master **Allow Agents to Send Messages** switch.

A message that came in from a chat can only be answered in that same chat. Someone messaging your agent can't steer it into posting somewhere else.

### Incoming messages on this Mac

Each channel conversation is an ordinary chat in Osaurus. The first message opens a tab under the answering agent in your chat window, without stealing focus. Later messages in the same conversation land in that tab, which updates live. Every run also appears in **Activity**.

To bring each new conversation to the front instead, turn on **Settings… → Channels → Incoming → Focus Chat on Incoming Messages** (off by default). That's useful on a Mac you keep an eye on just for this.

### Checking it works

The **Test** section shows whether the connection is healthy and what happened to recent messages. If a message was turned away, it says why, for example: the sender isn't allowed, the chat isn't one the agent may read, or the app sent the same message twice.

## Messages Agents Can Start

An agent can post on its own only to a **destination** you've approved. It picks from your list of destinations by name; it never picks a raw chat ID.

Osaurus adds a destination automatically when a connected channel has an agent set to reply, a chat the agent may write to, and sending turned on. These automatic destinations don't grant any new access and always start in **Ask first** mode. If you take away write access, the destination disappears right away. Destinations show by name, like `#content` or a person's name.

Manage destinations in **Settings… → Channels → Messages Agents Can Start**, or for one agent in **Settings… → Agents →** the agent **→ Channels → Messages It Can Start**. Each destination has one mode:

- **Ask first:** you get an [approval](/glossary#approval) card in the chat. If nobody is watching (for example, a scheduled run), the message waits in the **Outbox**.
- **Auto-send:** send without asking each time. You must confirm you understand before turning this on, and every other safeguard still applies.
- **Drafts only:** save the message for you to review; never send it.
- **Off:** keep the destination listed but don't allow posting.

Under advanced options, you can limit which kinds of runs may post, stick to one thread, and limit how often a destination can be posted to.

### The Outbox

The **Outbox** keeps drafts, messages waiting for approval, messages whose delivery is uncertain, and recent history. Before you approve or retry anything, you see the full message and where it's going, and Osaurus rechecks all your permissions.

Osaurus never posts the same message twice by accident. If a timeout or crash leaves it unclear whether a message was sent, Osaurus doesn't retry on its own. You can mark it sent, discard it, or send it again. Unresolved items stay until you deal with them; finished history is removed after 30 days.

## Formatting

Osaurus adapts the agent's formatting to each app. Slack and Discord get their own formatting, Telegram gets its supported style, and iMessage gets clean plain text instead of stray symbols. Long replies are split neatly so code, links, and emoji stay intact, up to five messages per send. Reactions (like emoji responses) work in Slack, Discord, and Telegram and follow the same permissions as messages.

## Safe by default

- **Reading and writing are separate.** Seeing a chat in the list doesn't grant access. Reading, writing, and who the agent listens to each have their own allowed list.
- **One switch to pause everything.** **Allow Agents to Send Messages** in **Settings… → Channels** is the master switch for all replies and new messages. Turning it off still lets agents read allowed chats, but blocks all sending.
- **Strangers are ignored.** An incoming message is handled only if it comes from an allowed person in an allowed chat, and isn't from a bot or from the agent itself (unless you allow that).
- **Outside messages aren't instructions.** Message text and attachments from chat apps are treated as information, not commands the agent must follow.
- **No surprise sends.** Every post, edit, delete, or reaction must pass your settings for that destination first.
- **No double posts.** Repeated incoming messages are ignored, and each outgoing message is tracked so it's sent only once.
- **Limits on outside senders.** People messaging your agent are rate-limited, and risky approvals from a chat need fresh proof.
- **A record you can review.** **Activity** and the **Inbox & Audit** view show what was accepted, denied, ignored as a duplicate, run, and replied to. Exports leave out raw app data and hide known passwords and personal details as best they can.
- **Deliveries are logged in Insights.** Every message an agent sends shows in **Settings… → Insights** under **Channels**: destination, room, size, outcome, and whether attachments were sent. The message text itself isn't copied into the log. See [Developer Tools](/developer-tools#insights).

## Slack

Slack connects without any public web address or router changes. Osaurus provides a ready-made app setup (a "manifest") to paste into Slack, which includes everything needed, including the green "online" dot. If you set up your Slack app before, reapply the manifest to get the dot.

Save your bot token and app-level token, then pick readable and writable channels and allowed people from your workspace. You can connect several Slack workspaces, each with its own settings. The bot can only use channels it has joined.

Thread replies work as normal. Link previews and "also send to channel" are off for agent posts, and `@channel`, `@here`, and `@everyone` are blocked unless you allow them.

## Telegram

Telegram checks for new messages regularly. Telegram doesn't let bots see older history, so the agent can only read and search messages received while the channel was on.

- Use the number ID for private groups; Telegram doesn't always include the `@username`.
- If your bot was set up with a webhook elsewhere, it conflicts with Osaurus. Setup can check for it and remove it.
- Telegram doesn't show whether bots are online.

## Discord

Discord checks for new messages regularly, starting from when you connect (it doesn't replay old history). In the Discord Developer Portal, turn on the **Message Content** and **Server Members** options for your bot. Then pick servers, channels, and allowed people. If Discord won't list members, you can type a person's ID instead.

Osaurus also keeps your bot showing as online while the app is running, even for send-only setups.

## iMessage

iMessage uses this Mac's Messages app. There's no bot or online service. From **Connect**, download the small helper Osaurus offers; Osaurus checks it every time before it runs.

There are two levels:

- **Send only:** download the helper, allow Osaurus to control Messages when macOS asks ([Automation permission](/glossary#automation-permission)), turn on iMessage sending, and choose which chats the agent may write to.
- **Receive and reply:** also grant [Full Disk Access](/glossary#full-disk-access), turn on **Receive Messages** and local message storage, load recent chats, choose readable chats, and pick the people whose messages the agent may handle. Messages must be signed in.

Your chat list is read from this Mac and stays on it. The **Test** section checks that a fresh message from an allowed person arrives.

### Advanced iMessage actions

:::warning
Editing, unsending, tapbacks, typing indicators, attachments, effects, polls, and group changes use Apple's private iMessage features. They require turning off **System Integrity Protection (SIP)** and **Library Validation**, two core macOS protections. That makes your whole Mac significantly less secure. Osaurus only checks whether they're off; it never changes them. Use these actions only on a Mac set aside for this.
:::

Basic sending and receiving work with both protections on. Advanced actions have their own master switch and per-action switches, and every change still needs your normal approvals and permissions.

## WhatsApp

WhatsApp connects the same way WhatsApp Web does, using an unofficial connection, so you don't need a Meta developer account. WhatsApp can sign out linked devices, so use a separate phone number for anything important.

1. From **Connect**, download the helper Osaurus offers.
2. Osaurus shows a QR code. On your phone, open **WhatsApp → Settings → Linked Devices** and scan it.
3. Choose readable and writable chats and allowed people.
4. Turn on receiving, optional read receipts, and **Reply Automatically** as needed.
5. Run the **Test** section to confirm everything works with a real message.

The agent can send, read, search, quote, edit, delete, react, show typing, and send attachments where WhatsApp supports it. Unlinking from either your phone or Osaurus ends the connection.

## n8n

[n8n](https://n8n.io) is a tool for building automated workflows. The **n8n** channel lets an n8n workflow send a message to one of your agents and get the reply. n8n always contacts Osaurus, never the other way around.

### Setup

Open **Settings… → Channels → n8n**. The setup has five steps:

1. **Name it:** give the connection a name.
2. **Where is your n8n?** Choose **This Mac**, **Docker Desktop**, **another machine on my network**, or **Remote**. This decides everything after, including whether you need a [Public Link](/glossary#public-link) and whether the connection is [end-to-end encrypted](/glossary#end-to-end-encryption).
3. **Who answers?** Pick the agent that replies. For **Remote**, also turn on [Relay](/relay) for that agent. Optionally add an **Outbound Webhook URL** so replies are pushed to n8n.
4. **Pair:** copy the pairing code.
5. **Prove it:** approve your workflow and check that a real message gets through.

To turn a saved connection on or off, use the switch on its card in the channel list.

| Where is your n8n? | What you need |
|---|---|
| This Mac | Nothing extra |
| Docker Desktop | Nothing extra; it's treated like This Mac |
| Another machine on my network | Turn on **Expose to Network**. With an agent chosen in *Who answers?*, the connection uses the [Secure Channel](/secure-channel). Otherwise, you must turn on **Allow plaintext HTTP from other machines** (only offered for this option) |
| Remote | An agent in *Who answers?* with its Relay connected. Always end-to-end encrypted |

### Pairing code

**Pair with n8n** shows a code you can copy once everything it needs is ready. For **Remote**, that means an agent is chosen and its Relay is connected. If something's missing, the card says what and which step fixes it.

Install the [Osaurus n8n add-on](https://github.com/osaurus-ai/n8n-nodes-osaurus) (`@osaurus/n8n-nodes-osaurus`) in n8n, paste the code into its **Osaurus Channel** credential, and press **Test**.

:::warning
The pairing code contains the connection's secret. Treat it like a password. A new connection gets a random secret automatically. **Rotate** under *Pair → Advanced* makes every earlier code stop working. If you move n8n, change *Where is your n8n?* and copy the code again.
:::

### Approve workflows on first contact

Osaurus ignores workflows you haven't approved. You don't need to type any IDs: just run the workflow once. It appears under **Prove it → Who may speak** as "Workflow … wants to use …" with **Allow** and **Deny**. Click **Allow**, then run the workflow again. Until then, n8n reports `pending_approval` and nothing reaches the agent.

- A workflow that doesn't match lists you typed by hand still shows up with Allow and Deny. You can edit the lists under *Advanced*.
- If Settings is closed, a new workflow's first run shows a notification with **Open Channels**.
- Pending requests and Deny choices last until you quit Osaurus. Approvals are saved.

### Getting replies pushed to n8n (optional)

If you set an **Outbound Webhook URL** and turn on auto-reply, Osaurus sends each reply to an n8n Webhook trigger. The add-on's **Osaurus Trigger** checks that it really came from Osaurus. The address must be a public `https://` address; local or private addresses are refused, so an n8n on your own network needs a tunnel. Without one, n8n checks for replies itself.

## Custom JSON channels

**Custom JSON** connects other online services that have a simple web [API](/glossary#api), without writing a [plugin](/glossary#plugin). You describe how each action (like "send a message") maps to a web request. **Check Configuration** checks your setup without contacting the service.

For safety, Custom JSON only talks to the services you list, requires secure `https://` addresses by default, never contacts your own Mac or private network, limits message sizes, and keeps secrets in your Keychain.

## Troubleshooting

**Messages arrive but nothing is posted back.** Check that **Reply Automatically** is on for that channel and **Allow Agents to Send Messages** is on in **Settings… → Channels**.

**A message was ignored.** Open the channel's **Test** section. It says why, usually that the sender or chat isn't on the allowed list.

**n8n says `pending_approval`.** Open **Prove it → Who may speak** in the n8n setup and click **Allow**, then run the workflow again.

**iMessage can't receive.** Grant Full Disk Access to Osaurus in macOS **System Settings → Privacy & Security**, and make sure Messages is signed in.

---

## Under the hood

### Channel tools

Provider adapters expose the same provider-neutral `agent_channel_*` tools for diagnostics, discovery, reading, search, drafts, sends, replies, edits, deletes, typing, and reactions where supported. `agent_channel_list_connections` reports which actions are available and which need confirmation. Tools load on demand and are denied to external HTTP and MCP callers; they must run inside the app, where local policy and credentials are available.

For proactive messages, an agent calls `agent_channel_publish` during chat, scheduled, watcher, or self-scheduled runs. It supplies a destination binding and a stable intent key; it never chooses a raw provider connection or conversation ID. Runs triggered by an inbound channel message can't post through `agent_channel_*` write tools or proactive destination bindings; inbound delivery goes through **Reply Automatically** only.

### Policy enforcement

- **Confirmed writes:** mutating `agent_channel_*` actions require the host's `confirm_send` proof. Interactive approvals, Reply Automatically, and Auto-send only supply it after their own policy checks pass.
- **Inbound gate:** events need a stable provider event ID, an allowlisted server or workspace when applicable, an allowlisted conversation and sender, and no bot or self origin unless allowed. Events are deduplicated locally.
- **Outbound idempotency:** sends use durable intent or idempotency keys.
- **Remote approvals:** authorized senders are rate-limited, and dangerous remote approvals require fresh reply-token proof.
- Each reply runs in a private channel session. Policy changes restart the receive runtime when needed. Direct ID entry for conversations and senders is under **Advanced**.

### Formatting details

Slack receives native Markdown; Discord its Markdown subset; Telegram escaped Bot API HTML; iMessage plain text. Long output is split at block, line, then grapheme boundaries; one logical send creates at most five native messages. Reactions accept aliases or Unicode and are normalized per provider. iMessage tapbacks are an advanced private-API action.

### Provider transports

- **Slack:** Socket Mode; the recommended manifest includes scopes, subscriptions, Socket Mode setup, and the `always_online` flag.
- **Telegram:** Bot API long polling; reads and searches use the local message store populated while receiving.
- **Discord:** cursor-based REST polling (the first poll sets the cursor), plus a lightweight presence-only Gateway session.
- **iMessage:** the `imsg` helper; release, archive, executable, and bridge digests are pinned and the executable is verified before every launch. Chat discovery reads the local Messages database. Direct chat GUIDs and handles are under Advanced.
- **WhatsApp:** the `osaurus-wa` helper over the unofficial WhatsApp Web protocol (not the Meta Cloud API, no public webhook). Archive and executable digests are verified before every launch. The linked session persists under `~/.osaurus/whatsapp/session/`. Inbound media is size-capped and path-fenced.

### n8n details

Pairing code URLs by location:

| Where is your n8n? | Pairing code URL |
|---|---|
| This Mac | `http://127.0.0.1:<port>` |
| Docker Desktop | `http://host.docker.internal:<port>` (Docker Desktop on macOS delivers the connection from loopback) |
| Another machine on my network | `http://<lan-ip>:<port>` |
| Remote | The agent's relay URL |

The pairing code looks like:

```
osrs-n8n-1.<base64url JSON>
```

It bundles the URL, the connection id, the verification method, the channel secret, and, when an agent is bound, that agent's address. The node pins that address for a Secure Channel handshake, so a relay or man-in-the-middle can't substitute its own key, and wraps every request in `/secure/call`.

For workflows that use plain HTTP Request nodes instead of the community node, *Pair → Advanced* lists the URLs, verification settings, a sample envelope, an HMAC Code node, and curl examples.

| Route | Purpose |
|---|---|
| `POST /channels/n8n/{connection_id}/inbound` | Submit a message. Returns `202` with a `task_id` and `poll_url` |
| `GET /channels/n8n/{connection_id}/tasks/{task_id}` | Poll until `status` is `completed`, `failed`, or `cancelled`; `output` holds the latest reply |
| `GET /channels/n8n/{connection_id}/ping` | Credential test; verifies the secret without touching tasks |

These routes don't use `osk-v1` keys. The connection secret is the credential, verified **before** the body is read:

| Method | Header | Value |
|---|---|---|
| HMAC-SHA256 (default) | `X-Osaurus-Channel-Signature` | `sha256=<hex HMAC-SHA256 of the exact raw body>` (polls and pings sign the empty string) |
| Shared secret | `X-Osaurus-Channel-Secret` | The secret verbatim |

The inbound envelope is JSON with `v: 1`, a unique `event_id` (use the n8n execution id; it's the dedupe key), `conversation_id`, `sender.id`, and `content`. Messages with the same `conversation_id` continue the same chat session. Remote plaintext callers get `426` unless the connection allows plaintext; each source is limited to 120 requests per minute.

Outbound pushes are signed with `X-Osaurus-Channel-Signature: sha256=<hex>` over the exact body using the same channel secret. `localhost`, private addresses, and plain HTTP push URLs are refused.

### Custom JSON runner

Custom JSON maps standard channel actions to HTTP request and response templates. **Check Configuration** validates URLs, action maps, allowlists, response mappings, idempotency, and Keychain secret references without a network request. The runner is a bounded connector:

- HTTPS required (unless explicitly overridden), hosts and methods allowlisted, redirects disabled.
- Localhost, private ranges, and cloud-metadata addresses are refused before dispatch.
- Request and response sizes are capped; secrets are Keychain references, never inline, and are scrubbed from error output.
- Template placeholders render as safe JSON literals, so user content can't inject into sibling fields.
- Repeated writes with the same idempotency key are suppressed (`duplicate_suppressed`).
- With a `bodySignature` block, the runner computes HMAC-SHA256 over the exact rendered bytes with a named Keychain secret and attaches it in the configured header (for example `X-Osaurus-Channel-Signature: sha256=<hex>`). A missing signing secret rejects the action before dispatch.

### Storage

Custom JSON definitions and proactive destination bindings live in `agent-channels.json`; native provider policy uses provider-specific configuration. Message, audit, and Outbox state lives in `agent-channels/messages.sqlite`, using the same SQLCipher-aware storage stack as chat history (see [Storage](/storage)). Provider tokens are stored in the Keychain, not in channel configuration.

---

**Related:**

- [Agents](/agents) — the agents your channels route to
- [Secure Channel](/secure-channel) — encryption for agent-to-agent traffic
- [Identity](/identity) — access keys and scoping
- [Storage & Encryption](/storage) — where channel state lives

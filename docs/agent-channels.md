---
title: Agent Channels
sidebar_label: Agent Channels
description: Let your agents and workflows answer and send messages in WhatsApp, Slack, Telegram, Discord, iMessage, Email, n8n, or other online services, with you deciding who they talk to and what they can send.
---

# Agent Channels

**Agent Channels** let your [agents](/glossary#agent) take part in your chat apps: **WhatsApp**, **Slack**, **Telegram**, **Discord** and **iMessage**, plus **Email**, **n8n** and other online services. An agent can answer messages people send it, a [workflow](/workflows) can start when a message arrives, and an agent can post on its own, like a morning summary in a Slack channel. You decide exactly which chats it can read, who it listens to, and whether it sends on its own or asks you first.

For example: your team's #support channel in Slack gets the same five questions every day. You connect Slack, add a rule so your Triage agent answers in #support, and set it to reply **After approval**. Each answer waits for your OK before it's posted.

You'll need an account with the chat app. Some apps also need a "bot" (an app account for your agent) that you create on their website.

## Get started

1. Open Settings: click the gear icon at the bottom of the narrow strip on the left edge of the window, or press ⌘,.
2. Choose **Channels** (under Capabilities) and click **Add Channel**.
3. Pick the app you want to connect. (n8n has its own guided setup; see [n8n](#n8n).)
4. Work through the steps with **Back** and **Continue**:
   1. **Connect:** sign in or paste your bot's details, then press **Connect**. For iMessage and WhatsApp, download the small helper app Osaurus offers.
   2. **Receiving:** choose which chats the bot may read and which people it listens to. You can search by name.
   3. **Routing:** choose who answers. See [Who answers messages](#who-answers-messages).
   4. **Sending:** choose whether the bot may post, which chats it may write to, and which agents may post on their own.
   5. **Test:** send a real message and watch it arrive, reach the agent, and get a reply.

A channel that's already set up opens as tabs instead, with **Status** (the same live check as **Test**) first.

Bot tokens and passwords are saved in the [Vault](/vault), so they're kept in your Mac's [Keychain](/glossary#keychain) and never in a settings file.

## The Channels page

**Settings → Channels** shows every connected channel in one table:

- **By channel** shows, for each channel, what it **Receives from** (chats and people allowed in), where it **Routes to** (who answers), and what it **Sends** (whether agents may post).
- **By agent** turns it around: for each agent, where it **Answers on** and where it **Posts on its own**.

Each row shows one status: a connection problem first, then the first thing setup still needs (*Needs rooms*, *Needs people*, *No one answers*). Click a row to open its settings.

**More than one account.** You can connect several bots or workspaces for the same app. Use the add button on the app's heading: **Add Bot** for Discord and Telegram, **Add Workspace** for Slack, **Add Account** for Email. Each account is its own channel, with its own settings, rules and history. **Name** at the top of **Connect** renames it, and **Remove…** at the bottom removes an extra account.

## Who answers messages

The **Routing** step decides which agent or workflow answers. It's a table with one row per rule:

- **Where:** the chats the rule covers, or *Any room*.
- **Who answers:** an agent or a workflow.
- **Replies:** for an agent, **Automatically** or **After approval**. For a workflow, **Posts the output**, **Replies from its steps**, or **Doesn't reply**.
- An on/off switch.

Click **Add Rule** to pick the agent or workflow and the chats it answers in. Many agents across many chats is just many rows: #support goes to Triage, #ops goes to Ops, everything else goes to Helper. A rule's **…** menu has **Edit…** (instructions, nicknames, answering only when mentioned, filters), **Duplicate for another room…** and **Delete**.

Osaurus picks the rule in this order:

1. If the message starts with a rule's nickname, like `ops: restart the build`, that rule answers.
2. Otherwise, rules for that chat answer.
3. Otherwise, *Any room* rules answer.

**Where messages go**, under the table, reads your rules back in plain words, like "In #support: Triage" and "Everywhere else: Helper." It warns you when no rule is on, when a readable chat has no rule, or when several agents would answer the same message.

A message no rule claims isn't answered. It shows up in **Automations → ⋯ → Channel Messages** with the reason.

### Posting the reply

With **Automatically**, the agent's reply is posted as soon as it's ready. With **After approval**, you see the reply first and approve it. Replies still follow the chats the bot may write to and the master **Allow Agents to Send Messages** switch.

A message that came in from a chat can only be answered in that same chat. Someone messaging your agent can't steer it into posting somewhere else.

### When a workflow answers

A rule can start a [workflow](/workflows) instead of an agent. The workflow gets the message text, and fills its form from the message where it can (such as the sender or the chat).

- **Replies from its steps:** a workflow with a **Reply** step posts into the conversation that started it, mid-run as well as at the end. It can send a file from its run on iMessage and WhatsApp; other apps get the text. A run posts at most 20 replies.
- **Posts the output:** the workflow's result is posted when it finishes.
- **Questions in the chat.** When the workflow stops for a form, the bot asks each question in the conversation, one at a time. Only the person who sent the message can answer. Questions that need a file, a folder or a secret aren't asked in the chat; the bot says to answer them on the Mac.

### Incoming messages on this Mac

Each channel conversation is an ordinary chat in Osaurus. The first message opens a tab under the answering agent in your chat window, without stealing focus. Later messages in the same conversation land in that tab, which updates live. Each run is also listed in **Settings → Tasks → History**.

To bring each new conversation to the front instead, turn on **Settings → Channels → Incoming → Focus Chat on Incoming Messages** (off by default). That's useful on a Mac you keep an eye on just for this.

If someone sends another message while the agent is still replying, it isn't dropped. The agent takes it into the reply it's working on, at its next step, or answers it right after. If the follow-up can't run, the sender is told.

### Slack messages sent through apps

Slack marks messages posted through an app or the API with that app's bot ID, even when you post with your own user token, so Osaurus ignores them as bot messages. To let them through, open **Settings → Channels → Slack → Reply to incoming messages** and turn on **Accept Messages Sent Through Apps** (off by default). This is useful for, say, a phone shortcut that calls `chat.postMessage`. Only messages whose author is on the allowed-people list are accepted, but any app you've authorized to post as you can then reach the agent. Other bots stay blocked.

### Checking it works

The **Test** step (**Status**, once set up) shows whether the connection is healthy and what happened to recent messages. If a message was turned away, it says why: for example, the sender isn't allowed, the chat isn't one the bot may read, or the app sent the same message twice.

## Agents that post on their own

An agent can also post without being asked, for example from an [automation](/automations) that runs every morning.

1. Open the channel and go to **Sending**.
2. Make sure the bot may post in at least one chat.
3. Under **Agents that post on their own**, click **Add Agent** and pick the agent.
4. Choose how it posts:
   - **Off:** listed, but can't post.
   - **Asks first:** you see each message and approve it before it's sent.
   - **Without asking:** sends directly. You confirm once before turning this on. Use it sparingly.

Each agent's page shows a read-only **On Channels** list under **Sharing & Channels**, such as "Slack: answers in #support, replies automatically, posts after asking first," with **Edit in Channels** to change it.

### The Outbox

The **Outbox** button in the Channels header keeps drafts, messages waiting for approval, messages whose delivery is uncertain, and recent history. Before you approve or retry anything, you see the full message and where it's going, and Osaurus rechecks all your permissions.

Osaurus never posts the same message twice by accident. If a timeout or crash leaves it unclear whether a message was sent, Osaurus doesn't retry on its own. You can mark it sent, discard it, or send it again. Unresolved items stay until you deal with them; finished history is removed after 30 days.

## Formatting

Osaurus adapts the agent's formatting to each app. Slack and Discord get their own formatting, Telegram gets its supported style, and iMessage gets clean plain text instead of stray symbols. Long replies are split neatly so code, links and emoji stay intact, up to five messages per send. Reactions (like emoji responses) work in Slack, Discord and Telegram and follow the same permissions as messages.

## Safe by default

- **Reading and writing are separate.** Seeing a chat in the list doesn't grant access. Reading, writing, and who the bot listens to each have their own allowed list.
- **One switch to pause everything.** **Allow Agents to Send Messages** in **Settings → Channels** is the master switch for all replies and new messages. Turning it off still lets agents read allowed chats, but blocks all sending.
- **Strangers are ignored.** An incoming message is handled only if it comes from an allowed person in an allowed chat, and isn't from a bot or from the agent itself (unless you allow that).
- **Outside messages aren't instructions.** Message text and attachments from chat apps are treated as information, not commands the agent must follow.
- **No surprise sends.** Every post, edit, delete or reaction must pass your settings for that chat first.
- **No double posts.** Repeated incoming messages are ignored, and each outgoing message is tracked so it's sent only once.
- **Limits on outside senders.** People messaging your agent are rate-limited, and risky approvals from a chat need fresh proof.
- **A record you can review.** **Automations → ⋯ → Channel Messages** lists messages that were refused, that no rule claimed, or that answered a workflow's form, each with the reason. Runs that did happen are in **Tasks → History**. **Copy redacted export** on Channel Messages leaves out raw app data and hides known passwords and personal details as best it can.
- **Deliveries are logged in Insights.** Every message an agent or workflow sends shows in **Settings → Insights** under **Channels**: destination, chat, size, outcome, and whether attachments were sent. The message text itself isn't copied into the log. See [Developer Tools](/developer-tools).

## Slack

Slack connects without any public web address or router changes. Osaurus provides a ready-made app setup (a "manifest") to paste into Slack, which includes everything needed, including the green "online" dot. If you set up your Slack app before, reapply the manifest to get the dot.

Save your bot token and app-level token, then pick readable and writable channels and allowed people from your workspace. To connect another Slack workspace, use **Add Workspace**. The bot can only use channels it has joined.

Thread replies work as normal. Link previews and "also send to channel" are off for agent posts, and `@channel`, `@here` and `@everyone` are blocked unless you allow them.

## Telegram

Telegram checks for new messages regularly. Telegram doesn't let bots see older history, so the agent can only read and search messages received while the channel was on.

- Use the number ID for private groups; Telegram doesn't always include the `@username`.
- If your bot was set up with a webhook elsewhere, it conflicts with Osaurus. Setup can check for it and remove it.
- Telegram doesn't show whether bots are online.

## Discord

Discord checks for new messages regularly, starting from when you connect (it doesn't replay old history). In the Discord Developer Portal, turn on the **Message Content** and **Server Members** options for your bot. Then pick servers, channels and allowed people. If Discord won't list members, you can type a person's ID instead.

Osaurus also keeps your bot showing as online while the app is running, even for send-only setups.

## iMessage

iMessage uses this Mac's Messages app. There's no bot or online service. From **Connect**, download the small helper Osaurus offers; Osaurus checks it every time before it runs.

There are two levels:

- **Send only:** download the helper, allow Osaurus to control Messages when macOS asks ([Automation permission](/glossary#automation-permission)), turn on iMessage sending, and choose which chats the agent may write to.
- **Receive and reply:** also grant [Full Disk Access](/glossary#full-disk-access), turn on **Receive Messages** and local message storage, load recent chats, choose readable chats, and pick the people whose messages the agent may handle. Messages must be signed in.

Your chat list is read from this Mac and stays on it. The **Test** step checks that a fresh message from an allowed person arrives.

### Advanced iMessage actions

:::warning
Editing, unsending, tapbacks, typing indicators, attachments, effects, polls and group changes use Apple's private iMessage features. They require turning off **System Integrity Protection (SIP)** and **Library Validation**, two core macOS protections. That makes your whole Mac significantly less secure. Osaurus only checks whether they're off; it never changes them. Use these actions only on a Mac set aside for this.
:::

Basic sending and receiving work with both protections on. Advanced actions have their own master switch and per-action switches, and every change still needs your normal approvals and permissions.

## WhatsApp

WhatsApp connects the same way WhatsApp Web does, using an unofficial connection, so you don't need a Meta developer account. WhatsApp can sign out linked devices, so use a separate phone number for anything important.

1. From **Connect**, download the helper Osaurus offers.
2. Osaurus shows a QR code. On your phone, open **WhatsApp → Settings → Linked Devices** and scan it.
3. Choose readable and writable chats and allowed people.
4. Turn on receiving and, if you like, read receipts. Add a rule under **Routing** for who answers.
5. Run the **Test** step to confirm everything works with a real message.

The agent can send, read, search, quote, edit, delete, react, show typing, and send attachments where WhatsApp supports it. Unlinking from either your phone or Osaurus ends the connection.

## Email

Email works like the other channels: mail from people you allow reaches an agent or workflow, and the agent answers by replying in the same thread. It never marks mail as read, moves it or deletes it.

1. Open **Settings → Channels → Email**.
2. Under **Connect**, choose the mail account to **Watch**, or click **Add Account…** to add one:
   - **IMAP server:** Gmail, iCloud, Fastmail or any server that accepts a password. If you use two-step sign-in, create an app password. To send replies, also fill in **Reply Server (SMTP)**, **Reply Server Security**, **Reply Server Port** and **From Address**. The password is kept in your Keychain.
   - **Mail app:** an account already set up in Apple Mail. No password needed, and replies go out through Mail. Use this for Microsoft 365 and Outlook.com. Mail must be open for checks to run.
3. Turn on **Receive Mail**.
4. Under **Allowed Senders**, list one address (`alex@example.com`) or domain (`@example.com`) per line. Mail from anyone else never reaches an agent. With the list empty, nothing does.
5. Under **Routing**, click **Add Rule** and pick the agent or workflow and the mailboxes it answers.
6. To let agents reply, turn on **Allow Sending Email** under **Sending**.

Agents reply only in the thread of mail they received, only to the sender of the latest message (never reply-all), and can't start new email. With a Mail app account and a rule set to reply **After approval**, **Open Unsent Replies as Drafts** opens each answer in Mail as a reply draft for you to review and send.

Other options for each account: **Mailboxes** (empty means Inbox), **Only Unread Mail**, **Include the Message Text** (off means agents see only the sender, subject and a short preview), **Check Every** (1 to 60 minutes) and **Mail That Arrived While Osaurus Was Closed**. **Check Now**, **Verify incoming message** and **Test Connection** check that it works. To watch another mail account, use **Add Account** on the Email heading.

Email used to be an automation trigger. Old email automations move here automatically, replying **After approval**.

## n8n

[n8n](https://n8n.io) is a tool for building automated workflows. The **n8n** channel lets an n8n workflow send a message to one of your agents and get the reply. n8n always contacts Osaurus, never the other way around.

### Setup

Open **Settings → Channels → n8n**. The setup has five steps:

1. **Name it:** give the connection a name.
2. **Where is your n8n?** Choose **This Mac**, **Docker Desktop**, **another machine on my network**, or **Remote**. This decides everything after, including whether you need [Remote Access](/glossary#remote-access) and whether the connection is [end-to-end encrypted](/glossary#end-to-end-encryption).
3. **Who answers?** Click **Add Rule** to pick the agent or workflow that replies. For **Remote**, also turn on Remote Access for that agent; the n8n setup still calls it **Relay**, with an **Enable Relay** button. Optionally add an **Outbound Webhook URL** so replies are pushed to n8n.
4. **Pair:** copy the pairing code.
5. **Prove it:** approve your workflow and check that a real message gets through.

To turn a saved connection on or off, use the switch on its card in the channel list.

| Where is your n8n? | What you need |
|---|---|
| This Mac | Nothing extra |
| Docker Desktop | Nothing extra; it's treated like This Mac |
| Another machine on my network | Turn on **Expose to Network**. With an agent answering, the connection uses the [Secure Channel](/secure-channel). Otherwise, you must turn on **Allow plaintext HTTP from other machines** (only offered for this option) |
| Remote | An agent answering, with its Remote Access (Relay) connected. Always end-to-end encrypted |

### Pairing code

**Pair with n8n** shows a code you can copy once everything it needs is ready. For **Remote**, that means an agent answers on this connection and its Relay is connected. If something's missing, the card says what and which step fixes it.

Install the [Osaurus n8n add-on](https://github.com/osaurus-ai/n8n-nodes-osaurus) (`@osaurus/n8n-nodes-osaurus`) in n8n, paste the code into its **Osaurus Channel** credential, and press **Test**.

:::warning
The pairing code contains the connection's secret. Treat it like a password. A new connection gets a random secret automatically. **Rotate** under *Pair → Advanced* makes every earlier code stop working. If you move n8n, change *Where is your n8n?* and copy the code again.
:::

### Approve workflows on first contact

Osaurus ignores n8n workflows you haven't approved. You don't need to type any IDs: just run the workflow once. It appears under **Prove it → Who may speak** as "Workflow … wants to use …" with **Allow** and **Deny**. Click **Allow**, then run the workflow again. Until then, n8n reports `pending_approval` and nothing reaches the agent.

- A workflow that doesn't match lists you typed by hand still shows up with Allow and Deny. You can edit the lists under *Advanced*.
- If Settings is closed, a new workflow's first run shows a notification with **Open Channels**.
- Pending requests and Deny choices last until you quit Osaurus. Approvals are saved.

### Getting replies pushed to n8n (optional)

If you set an **Outbound Webhook URL**, Osaurus sends each reply to an n8n Webhook trigger. The add-on's **Osaurus Trigger** checks that it really came from Osaurus. The address must be a public `https://` address; local or private addresses are refused, so an n8n on your own network needs a tunnel. Without one, n8n checks for replies itself.

## Custom JSON channels

**Custom JSON** connects other online services that have a simple web [API](/glossary#api), without writing a [plugin](/glossary#plugin). You describe how each action (like "send a message") maps to a web request. **Check Configuration** checks your setup without contacting the service.

For safety, Custom JSON only talks to the services you list, requires secure `https://` addresses by default, never contacts your own Mac or private network, limits message sizes, and keeps secrets in the [Vault](/vault).

## Troubleshooting

**Messages arrive but nothing is posted back.** Check that the chat has a rule under **Routing** set to reply **Automatically** (or approve the reply if it's **After approval**), that the bot may write to that chat under **Sending**, and that **Allow Agents to Send Messages** is on in **Settings → Channels**.

**A message was ignored.** Open **Automations → ⋯ → Channel Messages**, or the channel's **Status** tab. It says why: usually the sender or chat isn't on the allowed list, or no rule covers that chat.

**n8n says `pending_approval`.** Open **Prove it → Who may speak** in the n8n setup and click **Allow**, then run the workflow again.

**iMessage can't receive.** Grant Full Disk Access to Osaurus in macOS **System Settings → Privacy & Security**, and make sure Messages is signed in.

**Email checks stopped.** If the server refused the sign-in, checks for that account pause so it isn't locked. Fix the password, then click **Check Now**.

---

## Under the hood

### Channel tools

Provider adapters expose the same provider-neutral `agent_channel_*` tools for diagnostics, discovery, reading, search, drafts, sends, replies, edits, deletes, typing and reactions where supported. `agent_channel_list_connections` reports every account with its own `connection_id` (`discord-…`, `telegram-…`, `slack-<team>`, `email-…`) and which actions need confirmation. Tools load on demand and are denied to external HTTP and MCP callers; they must run inside the app, where local policy and credentials are available.

For posting on its own, an agent calls `agent_channel_publish` during chat, scheduled or self-scheduled runs. It supplies a destination binding and a stable intent key; it never chooses a raw provider connection or conversation ID. Runs triggered by an inbound channel message can't post through `agent_channel_*` write tools or proactive destination bindings; inbound replies go through the channel's routing rules only.

### Routing rules

Each routing rule is an [automation](/automations) with a channel-message trigger. Its runs are tasks (listed in Tasks → History), but channel rules are managed only in Channels; the Automations list points there. Unclaimed messages are logged with a reason code: `no_event_configured`, `no_event_for_room`, `mention_required` or `no_event_matched`. Workflow inputs can read `{{text}}`, `{{caller.channel.room_id}}`, `{{caller.channel.sender_name}}` and, for Email, `{{email.subject}}`, `{{email.from}}`, `{{email.from_name}}`, `{{email.body}}`, `{{email.snippet}}`, `{{email.attachments}}`.

Posting modes behind the **Agents that post on their own** picker: Off, Draft (writes land in the Outbox), Confirm (**Asks first**), Autonomous (**Without asking**). Draft is only reachable through the Orchestrator's sheet or `osaurus_config`. The built-in Orchestrator can't answer messages, but it can post; its places are edited with **Edit places…** on its row.

### Policy enforcement

- **Confirmed writes:** mutating `agent_channel_*` actions require the host's `confirm_send` proof. Interactive approvals, automatic replies and Autonomous mode only supply it after their own policy checks pass.
- **Inbound gate:** events need a stable provider event ID, an allowlisted server or workspace when applicable, an allowlisted conversation and sender, and no bot or self origin unless allowed. Events are deduplicated locally.
- **Outbound idempotency:** sends use durable intent or idempotency keys.
- **Remote approvals:** authorized senders are rate-limited, and dangerous remote approvals require fresh reply-token proof.
- Each reply runs in a private channel session. Policy changes restart the receive runtime when needed. Direct ID entry for conversations and senders is under **Advanced**.

Insights records outbound deliveries as `PUBLISH` (proactive posts) or `REPLY`, with trigger `auto_reply` for agents and `workflow_reply` for a workflow's Reply steps, form questions and final post.

### Formatting details

Slack receives native Markdown; Discord its Markdown subset; Telegram escaped Bot API HTML; iMessage plain text. Long output is split at block, line, then grapheme boundaries; one logical send creates at most five native messages. Reactions accept aliases or Unicode and are normalized per provider. iMessage tapbacks are an advanced private-API action.

### Provider transports

- **Slack:** Socket Mode; the recommended manifest includes scopes, subscriptions, Socket Mode setup, and the `always_online` flag.
- **Telegram:** Bot API long polling; reads and searches use the local message store populated while receiving.
- **Discord:** cursor-based REST polling (the first poll sets the cursor), plus a lightweight presence-only Gateway session.
- **iMessage:** the `imsg` helper; release, archive, executable and bridge digests are pinned and the executable is verified before every launch. Chat discovery reads the local Messages database. Direct chat GUIDs and handles are under Advanced.
- **WhatsApp:** the `osaurus-wa` helper over the unofficial WhatsApp Web protocol (not the Meta Cloud API, no public webhook). Archive and executable digests are verified before every launch. The linked session persists under `~/.osaurus/whatsapp/session/`. Inbound media is size-capped and path-fenced.
- **Email:** IMAP (TLS on 993; *None* only for a server on this Mac, such as Proton Mail Bridge) or AppleScript to Mail. Each message reaches agents once, keyed by Message-ID across relaunches. The account is the space, each watched mailbox is a room (`<account id>/<mailbox>`), and each thread is a conversation. SMTP replies use TLS on port 465 (no STARTTLS) and aren't copied to the Sent mailbox.

### Credentials

Channel tokens and connection secrets are [Vault](/vault) keys: `SLACK_BOT_TOKEN`, `SLACK_APP_TOKEN`, `SLACK_SIGNING_SECRET`, `DISCORD_BOT_TOKEN`, `TELEGRAM_BOT_TOKEN`, and `<CONN>_<SECRET>` for Custom JSON and n8n connections. Vault → **Accounts** lists bots and workspaces with **Manage in Channels**, and an agent can be given the bot it posts as. IMAP passwords are kept in the Keychain and never exported.

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

For workflows that use plain HTTP Request nodes instead of the community node, *Pair → Advanced* lists the URLs, verification settings, a sample envelope, an HMAC Code node, curl examples, and the `osk-v1` access key for the node's Agent resource.

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

Custom JSON maps standard channel actions to HTTP request and response templates. **Check Configuration** validates URLs, action maps, allowlists, response mappings, idempotency, and secret references without a network request. The runner is a bounded connector:

- HTTPS required (unless explicitly overridden), hosts and methods allowlisted, redirects disabled.
- Localhost, private ranges, and cloud-metadata addresses are refused before dispatch.
- Request and response sizes are capped; secrets are Vault references, never inline, and are scrubbed from error output.
- Template placeholders render as safe JSON literals, so user content can't inject into sibling fields.
- Repeated writes with the same idempotency key are suppressed (`duplicate_suppressed`).
- With a `bodySignature` block, the runner computes HMAC-SHA256 over the exact rendered bytes with a named secret and attaches it in the configured header (for example `X-Osaurus-Channel-Signature: sha256=<hex>`). A missing signing secret rejects the action before dispatch.

### Storage

Custom JSON definitions and proactive destination bindings live in `agent-channels.json`; native provider policy uses provider-specific configuration. Message, audit and Outbox state lives in `agent-channels/messages.sqlite`, using the same SQLCipher-aware storage stack as other local databases (see [Storage](/storage)). When several accounts were split out on upgrade, a backup was kept in `~/.osaurus/backups/`.

---

**Related:**

- [Agents](/agents): the agents your channels route to
- [Automations](/automations): schedules that post through channels
- [Vault](/vault): where channel tokens are kept
- [Secure Channel](/secure-channel): encryption for agent-to-agent traffic
- [Storage & Encryption](/storage): where channel state lives

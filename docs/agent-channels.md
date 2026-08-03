---
title: Agent Channels
sidebar_label: Agent Channels
description: Let agents reply and start messages in Slack, Telegram, Discord, iMessage, or your own JSON API — with explicit routing, allowlists, and review controls.
---

# Agent Channels

Agent Channels connect Osaurus to **Slack**, **Telegram**, **Discord**, **iMessage**, and services with a simple JSON API. Channel messaging has two separate paths:

- **Replies** answer incoming messages. You choose which conversations and senders may reach an agent, which agent answers, and whether its response is posted automatically.
- **New Messages** let an agent bring something up without an incoming trigger. The Channels page calls these **Messages Agents Can Start**; each agent's Channels tab calls them **Messages It Can Start**.

Both paths use the same provider-neutral tools, routing policy, and local audit state.

## Set up a channel

Open **Settings → Channels**, choose **Add Channel**, then pick a provider. Native setup is divided into four focused sections:

1. **Connect** — add the bot credentials or local iMessage helper.
2. **Conversations** — choose readable and writable conversations and authorized senders.
3. **Agent Behavior** — configure Replies and sending.
4. **Test** — run diagnostics and verify a real incoming message from receipt through dispatch and reply.

Valid policy changes save automatically and restart the receive runtime when needed. Conversation and sender selectors are searchable by name or ID; direct ID entry remains under **Advanced** for items discovery cannot return. Provider tokens are stored in Keychain, not in channel configuration.

## Replies

In **Agent Behavior**, turn on **Reply with an Agent** and choose the default agent. Optional routing rules can use different agents for different conversations or name prefixes in a shared conversation. Routing is deterministic:

1. A leading configured name, such as `sales:`, selects that agent.
2. Otherwise, a conversation-specific rule selects the agent.
3. Otherwise, the default replying agent handles the message.

Each reply runs in a private channel session. Turn on **Reply Automatically** only when you want the sanitized agent response posted back without a separate approval. Provider sending, the conversation's write allowlist, and the global sending switch still apply.

The **Test** section shows transport health and recent inbound stages. A rejected event explains why — for example, an unauthorized sender, a conversation outside the read allowlist, or a duplicate provider event.

## Messages Agents Can Start

An agent with an approved destination can call `agent_channel_publish` during chat, scheduled, watcher, or self-scheduled runs. The agent supplies a destination binding and a stable intent key; it never chooses a raw provider connection or conversation ID.

Osaurus creates **Automatic** destinations when a connected native channel has:

- an agent assigned to Replies;
- a writable conversation; and
- channel sending and inbound dispatch enabled.

Automatic destinations grant no new access and always start in **Ask first** mode. Removing write access makes the destination disappear immediately. Destinations are shown name-first — for example, `#content` or a person's name — with the provider and raw route available as secondary detail.

Manage destinations globally under **Settings → Channels → Messages Agents Can Start**, or per agent under **Agents → agent → Channels → Messages It Can Start**. Each destination has one mode:

- **Ask first** — show an approval card in an attended chat; unattended runs wait in the Outbox.
- **Auto-send** — send without asking each time. Enabling it requires an explicit acknowledgement, and all other gates still apply.
- **Drafts only** — save the exact message locally for review; never contact the provider.
- **Off** — keep the destination listed but refuse publishing.

Advanced options can restrict run kinds, pin a thread, and set per-destination rate limits.

### Outbox and delivery review

The durable **Outbox** keeps drafts, pending approvals, uncertain deliveries, and recent history. Every approval or retry shows the complete payload and destination, then rechecks the current route, run source, allowlists, rate limits, and global sending switch.

An intent key prevents a repeated run from posting twice. If a timeout, crash, or ambiguous provider response leaves delivery unknown, Osaurus never retries automatically. You can inspect the item and mark it sent, discard it, or explicitly resend it. Unresolved items are retained; terminal history is removed after 30 days.

## Tools and formatting

Provider adapters expose the same `agent_channel_*` actions for diagnostics, discovery, reading, search, drafts, sends, replies, edits, deletes, typing, and reactions where supported. `agent_channel_list_connections` reports which actions are available and which require confirmation. Tools load on demand and are denied to external HTTP and MCP callers; they must run inside the app, where local policy and credentials are available.

Agent Markdown is rendered for each destination:

- Slack receives native Markdown; Discord receives its Markdown subset.
- Telegram receives escaped Bot API HTML.
- iMessage receives readable plain text instead of literal Markdown markers.

Long output is split at block, line, then grapheme boundaries so code fences, links, and emoji stay intact. One logical send can create at most five native messages. Reactions accept familiar aliases or Unicode and are normalized for Slack, Discord, and Telegram. iMessage tapbacks are an advanced private-API action. Reactions use the same write allowlists, confirmation policy, and global sending switch as messages.

## Safe by default

- **Separate read and write access.** Discovery only helps you choose; it never grants access. Reads, writes, and inbound senders each have explicit allowlists, and channel sending must be enabled.
- **Global pause.** **Allow Agents to Send Messages** in Settings → Channels is the master switch for Replies and New Messages. Turning it off leaves allowlisted reading available but blocks every channel write.
- **Deny-by-default inbound handling.** Incoming events need a stable provider event ID, an allowlisted server or workspace when applicable, an allowlisted conversation and sender, and no bot or self origin unless explicitly allowed.
- **Untrusted content.** External message text and attachments enter agent context as untrusted data, not instructions.
- **Confirmed provider writes.** Mutating `agent_channel_*` actions require the host's `confirm_send` proof. Interactive approvals, Reply Automatically, and Auto-send only supply that proof after their own policy checks pass.
- **Replay and duplicate protection.** Provider events are deduplicated locally; outbound sends use durable intent or idempotency keys.
- **Remote-action limits.** Authorized senders are rate-limited, and dangerous remote approvals require fresh reply-token proof.
- **Redacted audit evidence.** **Activity** and the Inbox & Audit workbench record accepted, denied, duplicate, dispatched, and replied states. Exports omit raw provider payloads and apply best-effort redaction to known credential and personal-data shapes.

## Slack

Slack receives through **Socket Mode**, so it needs no public webhook or port forwarding. The recommended app manifest includes the scopes, subscriptions, Socket Mode setup, and `always_online` flag used for Slack's green presence dot. Existing apps must reapply the manifest for that presence flag to take effect.

Save the bot token and App-Level token in Keychain, then choose readable and writable conversations and authorized senders from workspace discovery. Slack supports multiple workspaces; each keeps separate credentials, policy, and receive runtime. Unjoined channels are unavailable.

Threads use the standard thread tools. Outbound posts do not unfurl links or broadcast thread replies, and broadcast mentions such as `@channel`, `@here`, and `@everyone` are blocked unless explicitly allowed.

## Telegram

Telegram receives through **Bot API long polling**. The Bot API does not expose arbitrary prior history, so reads and searches use the local message store populated while receiving is active.

- Use numeric chat IDs for private groups; Telegram can omit an `@username` from updates.
- An existing webhook conflicts with long polling. Setup can check and remove the webhook.
- Telegram does not expose bot presence.

## Discord

Discord receives through cursor-based REST polling. The first poll establishes the cursor and does not replay history. Enable Message Content and Server Members intents in the Developer Portal, then choose servers, channels, and authorized senders. A manual sender-ID fallback remains available when member discovery is restricted.

REST polling alone leaves a Discord bot offline, so Osaurus also keeps a lightweight presence-only Gateway session while the app is running, including for send-only setups. Message receiving remains on REST polling.

## iMessage

iMessage is a native, local channel backed by this Mac's Messages app. It uses no bot token or remote service. From **Connect**, download the small `imsg` helper on demand. The helper release, archive, executable, and bridge digests are pinned in Osaurus; every launch verifies the installed executable before it can run.

Basic setup has two permission paths:

- **Send only:** download the helper, grant **Messages Automation**, enable iMessage sending, and choose writable chats. Full Disk Access and receiving are not required.
- **Receive and reply:** also grant **Full Disk Access**, turn on **Receive Messages** and local message storage, load recent chats, choose readable chats, and allow the people whose messages may be handled. Messages.app must be signed in.

Chat discovery reads the local Messages database and remains on the Mac. Searchable selectors show chat names, types, and participant handles; direct chat GUIDs and handles remain available under Advanced. The Test section verifies the local watch stream from a fresh authorized iMessage.

### Advanced iMessage actions

:::warning
Editing, unsending, tapbacks, typing indicators, attachments, effects, polls, and group changes use Apple's private iMessage APIs. They require **System Integrity Protection (SIP)** and **Library Validation** to be disabled, which is a significant system-wide security reduction. Osaurus only diagnoses this state and never changes either protection. Use these actions only on a dedicated Mac.
:::

Basic send and receive continue to work with SIP and Library Validation enabled. Advanced actions have a separate master switch and per-action switches, and every mutation still passes the normal confirmation and write gates.

## Custom JSON channels

Use **Custom JSON** to map standard channel actions to HTTP request and response templates without writing a plugin. **Check Configuration** validates URLs, action maps, allowlists, response mappings, idempotency, and Keychain secret references without making a network request.

The runner is a bounded connector, not a general web client:

- HTTPS required (unless explicitly overridden), hosts and methods allowlisted, redirects disabled
- Localhost, private ranges, and cloud-metadata addresses are refused before dispatch
- Request and response sizes are capped; secrets are Keychain references, never inline, and are scrubbed from any error output
- Template placeholders render as safe JSON literals, so user content can't inject into sibling fields
- Repeated writes with the same idempotency key are suppressed (`duplicate_suppressed`) instead of double-posting

Custom JSON definitions and proactive destination bindings live in `agent-channels.json`; native provider policy uses its provider-specific configuration. Message, audit, and Outbox state lives in `agent-channels/messages.sqlite`, using the same SQLCipher-aware storage stack as chat history (see [Storage](/storage)).

---

**Related:**

- [Agents](/agents) — the agents your channels route to
- [Secure Channel](/secure-channel) — encryption for agent-to-agent traffic
- [Identity](/identity) — access keys and scoping
- [Storage & Encryption](/storage) — where channel state lives

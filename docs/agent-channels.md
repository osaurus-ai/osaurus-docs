---
title: Agent Channels
sidebar_label: Agent Channels
description: Connect agents to Slack, Telegram, Discord, or your own JSON APIs through one provider-neutral action set — guided setup, multi-agent routing, allowlisted, confirmed, and audited.
---

# Agent Channels

Agent Channels connect your agents to chat platforms — **Slack**, **Telegram**, **Discord**, or any service with a simple JSON API — through one provider-neutral set of actions. The same tools read messages, search history, and send replies regardless of the platform behind them, and inbound messages can be routed to different agents per room or by name.

Native connections come with a **guided, numbered setup** in Settings → Channels: each provider sheet walks you through creating the bot, granting it access, picking rooms and senders from live discovery (raw IDs are demoted to an Advanced section), and ends with a **live "verify incoming message" step** so you know receive actually works before you rely on it. Saving is gated on real readiness — missing pieces are surfaced as blockers instead of silently dismissed.

## The standard actions

Every channel connection exposes the same verbs through the `agent_channel_*` tools:

| Action | What it does |
|---|---|
| `list_connections` | Enumerate the channel connections available, with per-action policy |
| `diagnostics` | Validate a connection's configuration — reports missing credentials, disabled writes, and denied rooms as explicit states |
| `list_spaces` / `list_rooms` | Discover servers/workspaces and channels the connection can see |
| `read_messages` / `read_thread` / `search_messages` | Read a room, follow a thread, or search allowlisted rooms |
| `draft_message` | A local dry run — shows a redacted preview of what would be sent, sends nothing |
| `send_message` / `reply_thread` | Post to an allowlisted room, always requiring explicit confirmation |
| `edit_message` / `delete_message` | Modify or remove a previously sent message where the provider supports it |
| `add_reaction` / `remove_reaction` / `send_typing` | Lightweight presence and reaction actions |

Provider-specific adapters translate these standard verbs into each platform's API, so an agent that learns to use channels once can use any of them. The `agent_channel_*` tools are loaded on demand through the capabilities flow, and they're **denied to external HTTP/MCP callers** — channel reads and writes must originate from the Osaurus app surface, where connection policy, confirmations, and local credentials are available.

## Multi-agent routing

A channel is not owned by a single agent. Each connection carries per-room **routing rules** with optional name **aliases**, resolved in a fixed order:

1. **Alias** — a message starting with a configured name ("sales: what changed this week?") routes to that agent
2. **Room** — otherwise, the room's routing rule picks the agent
3. **Default** — otherwise, the connection's default agent answers

The Channels tab shows who answers at a glance ("Answers as Sales", "Routes to 2 agents"), the resolved agent is recorded in the inbound activity feed, and diagnostics validate every routed agent — a rule pointing at a deleted agent is flagged instead of failing silently.

## Activity and health

Each provider's settings show **live transport health** and a per-event **inbound activity** feed that tracks every message through its lifecycle: received → rejected or stored → dispatched → replied. When a message didn't get an answer, the activity row says why (unauthorized sender, room not allowlisted, duplicate, …) instead of leaving you guessing.

The transport supervisor starts each configured receive runtime at launch and after settings changes.

## Safe by default

Channels are built so an agent — or someone messaging your agent from outside — can't overstep:

- **Read and write allowlists.** A connection can only read rooms on its read allowlist and only write to rooms on its write allowlist. Writes also require the connection's `writeEnabled` flag. Discovery pickers are selection assistance only — they never grant access automatically.
- **Confirmed writes.** `send_message` and `reply_thread` require an explicit confirmation (`confirm_send: true`) — an agent can draft freely but can't fire a message without it.
- **Inbound authorization, deny by default.** Before any external message reaches an agent, it must pass a gate: a stable provider event id (no replays), an allowlisted server and room, an allowlisted sender, and no bot or self messages unless explicitly allowed. Anything else is dropped, with an audit reason recorded.
- **Untrusted by construction.** Message content from a channel enters the agent as untrusted external data, never as instructions.
- **Duplicate suppression.** Message state lives in a local store keyed by provider ids, so a replayed webhook or repeated read can't dispatch the same message twice. Write actions support idempotency keys so a retry can't double-post.
- **Rate limits and reply-token proof.** A shared safety gate rate-limits remote senders and requires fresh reply-token proof before any dangerous remote approval — so a message in a shared room can't trigger privileged actions on your Mac.
- **Redacted audit trail.** Every receive decision — accepted, denied, or duplicate — is recorded with a typed reason. An **Inbox & Audit workbench** in the connection center shows recent redacted snapshots, decision counts, and a copyable redacted JSON export, so you can always answer "why did (or didn't) my agent respond to that?"

## Slack

Slack receive runs over **Socket Mode** — no public webhook, no port forwarding. The guided setup walks through creating the app, saving the bot token and Socket Mode app token (stored in **Keychain**), picking channels and authorized senders from workspace discovery, and verifying a live inbound message.

Policy lives in `slack.json` (non-secret ids only):

- `readableChannelIds` / `writableChannelIds` — independent read and write choices per channel; unjoined channels are marked unavailable
- `senderAllowlist` — which Slack users may trigger inbound handling; empty means inbound dispatch stays off until you pick people
- `allowBroadcastMentions` — off by default; outbound messages containing `@channel` / `@here` / `@everyone` markup are rejected before any network call

You can connect **multiple workspaces** from the same sheet — each keeps its own tokens, channel/sender policy, and Socket Mode runtime, and actions route through the token that owns the selected channel. Threads work through the canonical thread tools (Slack thread ids are `channel_id:thread_ts`). Outbound posting is conservative: name linking off, no unfurls, replies don't broadcast.

## Telegram

Telegram receive runs over **Bot API long polling**. The guided setup covers the BotFather commands, token validation, chat and sender allowlists, and a live verify step. Notes specific to Telegram:

- The Bot API doesn't let bots read arbitrary history, so `read_messages` / `search_messages` read from the **local message store** populated by the receive runtime.
- Chat allowlists accept numeric ids and `@username` handles — but use numeric ids for private groups, since Telegram may omit the username on updates.
- Long polling conflicts with an active webhook on the same bot token; setup flags that instead of silently receiving nothing.

## Discord

Discord receive uses cursor-based REST **polling** (the first poll establishes a cursor — no replay of history). The guided setup covers Developer Portal intents and the invite URL, then discovery-first pickers for servers, channels, and authorized senders (servers that restrict member listing keep a manual sender-ID fallback).

Policy fields: `configuredGuildIds` (servers it may inspect), `readableChannelIds`, `writableChannelIds`, `writeEnabled`, and `senderAllowlist`. The bot token lives in Keychain; the configuration stores only ids and policy. Read and write are independent explicit choices.

## Custom JSON channels

For services with a simple JSON API, you can define a channel in configuration alone — no code. Each action maps to one of the standard verbs and describes an HTTP request template:

```json
{
  "id": "ops-webhook",
  "name": "Ops Webhook",
  "kind": "custom_http",
  "supportedActions": ["diagnostics", "send_message"],
  "writeEnabled": true,
  "writeRoomAllowlist": ["alerts"],
  "inboundAuthorization": {
    "senderAllowlist": ["user-1"],
    "roomAllowlist": ["alerts"],
    "allowBotMessages": false,
    "requireProviderEventId": true
  },
  "secrets": [{ "name": "bearer", "keychainId": "ops_webhook_token" }],
  "customHTTP": {
    "baseURL": "https://hooks.example.test",
    "actions": {
      "send_message": {
        "method": "POST",
        "path": "/rooms/{{input.room_id}}/messages",
        "headers": { "Authorization": "Bearer {{secret.bearer}}" },
        "bodyTemplate": "{\"text\":{{input.content}}}"
      }
    }
  }
}
```

The custom-channel sheet is a stepped editor with required fields labeled, editable inbound authorization (sender/room allowlists, bot/self toggles), and a pre-save **Check Configuration** validator that flags bad URLs, invalid action maps, empty write allowlists, and malformed secret references before anything is saved.

The runner is a bounded HTTP adapter, not a general web client:

- HTTPS required (unless explicitly overridden), hosts and methods allowlisted, redirects disabled
- Localhost, private ranges, and cloud-metadata addresses are refused before dispatch
- Request and response sizes are capped; secrets are Keychain references, never inline, and are scrubbed from any error output
- Template placeholders render as safe JSON literals, so user content can't inject into sibling fields
- Repeated writes with the same idempotency key are suppressed (`duplicate_suppressed`) instead of double-posting

Configuration lives in `agent-channels.json`; message state and the audit ledger live in `agent-channels/messages.sqlite`, stored through the same SQLCipher-aware storage stack as chat history (see [Storage](/storage)).

---

**Related:**

- [Agents](/agents) — the agents your channels route to
- [Secure Channel](/secure-channel) — encryption for agent-to-agent traffic
- [Identity](/identity) — access keys and scoping
- [Storage & Encryption](/storage) — where channel state lives

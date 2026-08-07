---
title: Agent Channels
sidebar_label: Agent Channels
description: Connect agents to Discord, Slack, Telegram, or your own JSON APIs through one provider-neutral action set — allowlisted, confirmed, and audited.
---

# Agent Channels

Agent Channels connect your agents to chat platforms — Discord, Slack, Telegram, or any service with a simple JSON API — through one provider-neutral set of actions. The same tools read messages, search history, and send replies regardless of the platform behind them.

:::caution[Early preview]
Agent Channels are under active development. **Discord** is the first fully working connection, and the management UI is still being rolled out. Expect the surface to change between releases.
:::

## The standard actions

Every channel connection exposes the same verbs through the `agent_channel_*` tools:

| Action | What it does |
|---|---|
| `list_connections` | Enumerate the channel connections available to this agent |
| `diagnostics` | Validate a connection's configuration without touching the network |
| `list_spaces` / `list_rooms` | Discover servers and channels the connection can see |
| `read_messages` / `read_thread` / `search_messages` | Read a room, follow a thread, or search allowlisted rooms |
| `draft_message` | A local dry run — shows what would be sent, sends nothing |
| `send_message` / `reply_thread` | Post to an allowlisted room, always requiring explicit confirmation |

Provider-specific adapters translate these standard verbs into each platform's API, so an agent that learns to use channels once can use any of them.

## Safe by default

Channels are built so an agent — or someone messaging your agent from outside — can't overstep:

- **Read and write allowlists.** A connection can only read rooms on its read allowlist and only write to rooms on its write allowlist. Writes also require the connection's `writeEnabled` flag.
- **Confirmed writes.** `send_message` and `reply_thread` require an explicit confirmation (`confirm_send: true`) — an agent can draft freely but can't fire a message without it.
- **Inbound authorization, deny by default.** Before any external message reaches an agent, it must pass a gate: a stable provider event id (no replays), an allowlisted server and room, an allowlisted sender, and no bot or self messages unless explicitly allowed. Anything else is dropped, with an audit reason recorded.
- **Duplicate suppression.** Message state lives in a local store keyed by provider ids, so a replayed webhook or repeated read can't dispatch the same message twice. Write actions support idempotency keys so a retry can't double-post.
- **Rate limits and reply-token proof.** A shared safety gate rate-limits remote senders and requires fresh reply-token proof before any dangerous remote approval — so a message in a shared room can't trigger privileged actions on your Mac.
- **Redacted audit trail.** Every receive decision — accepted, denied, or duplicate — is recorded with a typed reason, and exports are scrubbed of secrets, so you can always answer "why did (or didn't) my agent respond to that?"

## Replying to incoming messages

When an incoming channel message dispatches an agent, the agent's response is delivered back to the channel by the app itself — and only when the connection's **Reply Automatically** toggle is on. With it off, incoming messages still run the agent, but the reply stays local in Osaurus; the connection's activity list records the turn as "Agent replied (auto-reply off)" and the settings pane shows a warning under the toggle.

Runs triggered by an inbound channel message deliberately cannot post through the `agent_channel_*` write tools or proactive destination bindings: an outside sender must never be able to steer your agent into publishing somewhere else. (This gate is enforced from 0.22.17 on — earlier versions let channel-triggered runs reply through the channel tools, so setups that relied on that need Reply Automatically enabled after upgrading.)

Auto-replies are sanitized before posting and still respect the platform's write gates and allowlists.

## Discord

Discord is the first native connection. The bot token lives in your macOS **Keychain** — the JSON configuration stores only non-secret ids and policy. Discord connections use their own field names:

- `configuredGuildIds` — which servers the connection may inspect
- `readableChannelIds` — rooms it may read and search
- `writableChannelIds` — rooms it may post to
- `writeEnabled` — the master write switch; sends still require per-message confirmation

(Custom JSON channels use the generic `readRoomAllowlist` / `writeRoomAllowlist` names instead — see below.)

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

The runner is a bounded HTTP adapter, not a general web client:

- HTTPS required (unless explicitly overridden), hosts and methods allowlisted, redirects disabled
- Localhost, private ranges, and cloud-metadata addresses are refused before dispatch
- Request and response sizes are capped; secrets are Keychain references, never inline, and are scrubbed from any error output
- Template placeholders render as safe JSON literals, so user content can't inject into sibling fields

Configuration lives in `agent-channels.json`; message state and the audit ledger live in `agent-channels/messages.sqlite`, stored through the same storage stack as chat history (see [Storage](/storage)).

---

**Related:**

- [Secure Channel](/secure-channel) — encryption for agent-to-agent traffic
- [Identity](/identity) — access keys and scoping
- [Tools & Plugins](/tools) — the wider tool ecosystem channels plug into

---
title: Public Links
sidebar_label: Public Links
description: Give a friend, your phone, or a third-party tool a stable public URL to one of your agents — no port forwarding, no ngrok, no configuration.
sidebar_position: 15
---

# Public Links

Sometimes you want a friend, your phone, or a third-party tool to talk to one of your agents from anywhere. Public Links is how — Osaurus opens a secure tunnel through `agent.osaurus.ai` and gives that one agent a stable public URL based on its cryptographic address. No port forwarding, no ngrok, no firewall changes.

Your access keys still protect everything. Public Links only handles transport; authentication is unchanged.

## How it works

1. You enable a public link for an agent in the Management window (**⌘,**) → **Server** → **Relays**
2. Osaurus authenticates with the relay service using the agent's signature
3. The agent gets a public URL: `https://<address>.agent.osaurus.ai`
4. Incoming requests are forwarded to your local server over a WebSocket tunnel
5. Your [access keys](/identity#access-keys) still protect all API endpoints

```
Remote Client                    Relay Service                    Your Mac
     │                                │                               │
     │  HTTPS request                 │                               │
     │  ──────────────────────────►   │                               │
     │                                │  WebSocket forward            │
     │                                │  ──────────────────────────►  │
     │                                │                               │
     │                                │  ◄──────────────────────────  │
     │                                │           Response            │
     │  ◄──────────────────────────   │                               │
     │           Response             │                               │
```

## Enabling a public link

1. Open the Management window (**⌘,**) → **Server** → **Relays**
2. Find the agent you want to expose
3. Toggle the public link switch
4. Confirm in the dialog that the agent will be publicly accessible
5. The public URL appears once the tunnel is established

:::warning
Enabling a public link makes the agent's API endpoints reachable from the public internet. Make sure the agent has appropriate access key protection before enabling. See [Identity](/identity) for details on access keys.
:::

## What you get

### Per-agent toggles

Each agent can be exposed independently — enabling one doesn't affect the others.

### Persistent settings

Your link configuration survives app restarts. When the server starts, previously enabled links reconnect automatically.

### Auto-reconnect

If your network drops, the tunnel reconnects with backoff — no manual intervention needed.

### Concurrent traffic

The tunnel handles multiple requests in parallel — no bottleneck on a single connection.

## When public links are useful

### Share an agent with a teammate

Give a teammate a public URL to interact with your local agent without exposing your local network or setting up VPNs.

### MCP clients on other machines

Connect MCP clients running on other machines — or mobile apps — to your local Osaurus instance through the public URL.

### Demo agents publicly

Show off an agent from your development machine with a stable public URL. No deployment needed.

### Receive webhooks

Route webhooks and callbacks from external services to a locally running agent for processing.

## Security

Public Links is a transport layer. It does not weaken authentication:

- **Access keys are still required** — the tunnel forwards requests to your local server, which validates access keys as usual
- **Explicit opt-in** — enabling a public link requires confirmation through a dialog
- **Per-agent isolation** — each tunnel is scoped to a single agent; enabling one does not expose others
- **Routing uses the agent's signature** — so requests can't be misdirected and the tunnel itself can't be impersonated

---

**Related:**

- [Identity](/identity) — set up and manage the access keys that protect a public link
- [Identity Cryptography](/identity-internals) — how `osk-v1` keys and signatures work
- [Integrations](/integrations) — using a public URL from MCP clients

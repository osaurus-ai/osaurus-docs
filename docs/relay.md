---
title: Relay
sidebar_label: Relay
description: Expose your local agents to the public internet via secure WebSocket tunnels — no port forwarding, no configuration
sidebar_position: 11
---

# Relay

Relay exposes your agents to the public internet via secure WebSocket tunnels through `agent.osaurus.ai`. Each agent gets a unique public URL based on its cryptographic address — no port forwarding, no ngrok, no configuration.

Your access keys still protect all API endpoints. Relay only handles transport; authentication is unchanged.

## How It Works

1. Enable a tunnel for an agent in the Management window (**⌘⇧M**) → **Server** → **Relays**
2. Osaurus authenticates with the relay service using the agent's [EIP-191](https://eips.ethereum.org/EIPS/eip-191) signature
3. The agent gets a public URL: `https://<address>.agent.osaurus.ai`
4. Incoming requests are forwarded to your local server over the WebSocket tunnel
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

## Enabling a Relay

1. Open the Management window (**⌘⇧M**) → **Server** → **Relays**
2. Find the agent you want to expose
3. Toggle the relay switch
4. Confirm in the dialog that the agent will be publicly accessible
5. The public URL appears once the tunnel is established

:::warning
Enabling a relay makes the agent's API endpoints reachable from the public internet. Make sure the agent has appropriate access key protection before enabling. See [Identity](/identity) for details on access keys.
:::

## Features

### Per-Agent Tunnels

Each agent can be tunneled independently. Enable or disable relays on a per-agent basis without affecting other agents.

### Persistent Settings

Tunnel configuration survives app restarts. When the server starts, previously enabled tunnels reconnect automatically.

### Auto-Reconnect

If the network connection drops, the tunnel reconnects with exponential backoff. No manual intervention is needed after transient network interruptions.

### Concurrent Multiplexing

Multiple requests are proxied concurrently off the main thread. The tunnel handles parallel traffic without blocking.

### Identity-Based Routing

The relay service uses the agent's cryptographic address for routing. The local server receives the correct agent UUID, so memory context injection and agent-specific behavior work the same as local requests.

## Use Cases

### Share Agents with Teammates

Give teammates a public URL to interact with your local agent without exposing your local network or setting up VPNs.

### Remote MCP Clients

Connect MCP clients running on other machines — or mobile apps — to your local Osaurus instance through the public URL.

### Demo Agents Publicly

Show off an agent from your development machine with a stable public URL. No deployment needed.

### Receive Webhooks

Route webhooks and callbacks from external services to a locally running agent for processing.

## Security

Relay is a transport layer. It does not weaken authentication:

- **Access keys are still required** — the relay forwards requests to your local server, which validates access keys as usual
- **Explicit opt-in** — enabling a relay requires confirmation through a dialog
- **Per-agent isolation** — each tunnel is scoped to a single agent; enabling one does not expose others
- **EIP-191 authentication** — the tunnel itself is authenticated using the agent's cryptographic signature, preventing unauthorized tunnel registration

---

<p align="center">
  Relay requires <a href="/identity">Identity</a> to be set up. For details on creating and managing access keys, see the <a href="/identity#access-keys">Access Keys</a> documentation.
</p>

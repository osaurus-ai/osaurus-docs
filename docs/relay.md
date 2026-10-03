---
title: Public Links
sidebar_label: Public Links
description: Give one of your agents a web address so your phone, a friend, or another app can reach it from anywhere, without changing your router or network settings.
---

# Public Links

A **Public Link** gives one of your agents its own web address, so your phone, a teammate, or another app can reach it from anywhere. You don't need to change your router or firewall. The agent keeps running on your Mac, and Osaurus's [relay](/glossary#relay) servers pass messages back and forth. Anyone using the link still needs an [access key](/glossary#access-key) you created.

## Get started

1. Open **Settings…** (`⌘ ,`) → **Agents**, choose the agent, then open **Connections → Network**.
2. In the **Relay** section, turn on the switch.
3. Osaurus asks **Expose Agent to Internet?** Click **Enable Relay**.
4. When the link is ready, its address appears. Click the copy button next to it.
5. Give the address, plus an [access key](/identity#access-keys) for that agent, to whoever or whatever needs it.

:::tip[Pairing a phone?]
You don't need to turn this on for each agent for the iPhone app. **Settings… → Mobile → Reach From Anywhere** (on by default while a phone is paired) does it for you, so the phone works away from home. See [Mobile](./mobile.md).
:::

:::warning
A Public Link makes the agent reachable from the internet. Only share it together with an access key, and only with people and apps you trust. See [Identity](/identity) for how access keys work.
:::

## Turning a link off

Turn the **Relay** switch off in the same place. If the agent is shared with a [workspace](./workspaces.md), Osaurus asks you to confirm first. Teammates are disconnected right away, but the agent stays shared, so turning the link back on restores their access.

## What to expect

- **Each agent is separate.** Turning on a link for one agent doesn't expose any others.
- **Links survive restarts.** When Osaurus starts again, links you turned on reconnect on their own.
- **Links reconnect on their own.** If your internet drops, Osaurus keeps trying until it's back.
- **Several requests at once are fine.** The link can handle many conversations in parallel.
- **Your Mac has to be awake.** If your Mac is asleep or Osaurus isn't running, the link can't answer.

### One Mac per agent

Each agent's link points to one Mac at a time. If another Mac with your [identity](/glossary#identity) starts serving the same agent (for example, a restored backup running on two Macs), the newer one takes over. Your Mac then shows **Served From Another Device** (badge: **On another device**) and stops trying to reconnect that agent, instead of fighting the other Mac. To take it back, turn the relay off and on again, or click **Serve From This Mac** in the agent's share sheet.

Agents created separately on different Macs have different addresses, so they never clash. See [Identity](/identity).

## Who can see what

How private the traffic is depends on who's on the other end:

- **Osaurus to Osaurus is [end-to-end encrypted](/glossary#end-to-end-encryption).** Your iPhone app, a teammate's Osaurus, and your other Mac all use the [Secure Channel](/secure-channel). The relay passes along scrambled data it can't read.
- **Other apps use regular secure web traffic (HTTPS) to the relay.** When a third-party app, a script, or a webhook service uses the link, its connection is encrypted between that app and the relay. The relay then unwraps it and forwards it to your Mac. That means **the relay can see that traffic**, including the messages and replies. Keep this in mind before sending sensitive material from other apps.

Either way, your access keys still decide who gets in. A Public Link only carries messages; it doesn't let anyone skip the access key.

## When Public Links are useful

- **Share an agent with a teammate** without exposing your home network or setting up a VPN. (For ongoing team sharing, [Workspaces](/workspaces) is easier.)
- **Connect apps on other computers**, like an [MCP](/glossary#mcp) app, to your Osaurus.
- **Demo an agent** from your Mac with a stable web address, with nothing to deploy.
- **Receive webhooks**, the automatic notifications other online services send, and have a local agent process them.

## Troubleshooting

**The link doesn't appear.** Check that your Mac is online and Osaurus is running. The address only shows once the connection to the relay works.

**The agent shows "On another device."** Another Mac is serving it. Click **Serve From This Mac** in the agent's share sheet, or turn the relay off and on again.

**Another app gets "unauthorized."** It needs a valid access key for this agent. Create one in **Settings… → Identity**.

---

## Under the hood

### How the tunnel works

1. You enable the relay from the agent's **Connections → Network** settings (or from the **Relays** list in **Settings… → Server**, which uses an **Enable Tunnel** button).
2. Osaurus opens a WebSocket tunnel to the relay service and authenticates using the agent's signature (an EIP-191 signed message from the agent's key).
3. The agent gets a public URL: `https://<address>.agent.osaurus.ai`, based on its cryptographic address.
4. Before marking the link live, Osaurus probes `https://<address>.agent.osaurus.ai/health` to confirm the public route actually reaches your Mac.
5. Incoming HTTPS requests are forwarded to your local server over the WebSocket tunnel, marked with the `X-Osaurus-Relay-Origin` header.
6. Your [access keys](/identity#access-keys) still protect all API endpoints.

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

### What the relay can read

HTTPS from a remote client terminates at the relay, which then forwards the request over the tunnel. For plain API calls from third-party clients (for example, an OpenAI SDK calling `/v1/chat/completions`), the relay therefore handles the request and response in readable form.

Osaurus peers wrap every agent request in the [Secure Channel](/secure-channel) (`POST /secure/call`), so the relay only forwards ciphertext. Agent-execution routes (`/agents/{id}/run`, `/agents/{id}/dispatch`) refuse plaintext from any non-loopback caller with `426 Upgrade Required`, and relay traffic is never treated as a trusted local caller even though it arrives over loopback.

### Security properties

- **Access keys are still required.** Relay-origin requests go through the normal auth gate, CORS rules, and the built-in Orchestrator's remote block.
- **Explicit opt-in.** Enabling a link requires confirming a dialog.
- **Per-agent isolation.** Each tunnel is scoped to a single agent.
- **Routing uses the agent's signature**, so requests can't be misdirected and the tunnel can't be impersonated.
- **Auto-reconnect** uses backoff. Persistent settings reconnect enabled tunnels when the server starts.
- **One tunnel per address.** The relay routes each agent address to exactly one tunnel; a newer authenticated tunnel evicts the older one.

---

**Related:**

- [Identity](/identity) — set up and manage the access keys that protect a public link
- [Identity Cryptography](/identity-internals) — how `osk-v1` keys and signatures work
- [Secure Channel](/secure-channel) — the encryption Osaurus-to-Osaurus traffic uses through the relay
- [Integrations](/integrations) — using a public URL from MCP clients

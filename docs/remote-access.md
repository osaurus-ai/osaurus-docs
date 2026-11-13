---
title: Remote Access
sidebar_label: Remote Access
description: Give one of your agents a web address so a teammate, a guest, or another app can reach it from anywhere, without changing your router or network settings. Access keys still decide who gets in.
---

# Remote Access

**Remote Access** gives one of your agents its own web address, so a teammate, a friend you invite, or another app can reach it from anywhere. You don't need to change your router or firewall. The agent keeps running on your Mac, and Osaurus's [relay](/glossary#relay) servers pass messages back and forth. Anyone using the address still needs an [access key](/glossary#access-key) or an invitation from you.

For example: you've built a Research agent you're proud of, and a friend wants to try it. You send them a guest link. They chat with it from their own Osaurus, and it runs on your Mac with your models and tools. When you're done, you revoke the link.

Most of the time you won't turn this on by hand. Sharing an agent to a [workspace](/workspaces) or creating a guest link turns it on for that agent. Your own Macs and iPhone don't need it at all: they use [Devices & Sync](/devices).

## Get started

1. Open Settings: click the gear icon at the bottom of the narrow strip on the left edge of the window, or press ⌘,.
2. Under **Sharing**, choose **Access**. The **Remote Access** section lists each of your agents. (The same switch is on each agent's page, under **Sharing & Channels**.)
3. Turn on the switch next to the agent.
4. Osaurus asks **Turn on remote access?** It explains that the agent gets a public address at agent.osaurus.ai, that anyone with the address can send requests, and that access keys still protect everything. Click **Turn on remote access**.
5. The agent shows **Connecting** while it gets its address, then **On** with the address underneath. Click the copy button next to it.
6. Give the address, plus an [access key](/identity) for that agent, to whoever or whatever needs it.

:::warning
Remote Access makes the agent reachable from the internet. Only share the address together with an access key, and only with people and apps you trust. See [Osaurus ID](/identity) for how access keys work.
:::

If the row says the agent needs an address, click **Open Osaurus ID** and finish setting up your [Osaurus ID](/glossary#osaurus-id) first.

## What the states mean

| State | What it means |
|---|---|
| **Off** | The agent has no public address. |
| **Connecting** | Osaurus is getting the address and checking that it reaches your Mac. |
| **On** | The address works. It's shown under the agent's name. |
| **On another Mac** | Another Mac signed in to your Osaurus ID is serving this agent. Click **Serve From This Mac** to take it back. |
| **Couldn't connect** | Something went wrong. The row says what. Osaurus keeps retrying. |

## Invite one person with a guest link

A guest link lets one person chat with one of your agents, without joining a workspace.

1. Open **Settings → Agents** and pick the agent.
2. Click the share icon (**Share Agent**) and choose **Guest Link**.
3. Make sure **Remote Access** is on in the sheet. Osaurus asks to confirm the first time.
4. Pick how long the link lasts, then click **Create Link**.
5. Copy the link, or click **Share…**, and send it to the person.

Each link works once: after someone accepts it, it can't be used again. Guests chat with the agent as you set it up, with its model, tools and folders, running on your Mac. They don't see your other agents or chats. Tools that need your approval wait for you in **Inbox**.

Everyone holding a guest link is listed under **Settings → Sharing → Access → Guests**. Click **Revoke** to cut someone off.

Agents other people shared with *you* through a guest link are under **Shared With You** on the same page. Teammates' agents are in [Workspaces](/workspaces).

## Share your models

**Model Sharing → Share My Models for Inference**, also on the Access page, lets teammates, guests and peers use the models you expose in **Settings → Server**. It's off unless you turn it on.

## Turning it off

Turn the agent's switch off in the same place. If the agent is shared with a [workspace](/workspaces), Osaurus asks **Turn off remote access?** first. Teammates are disconnected right away, but the agent stays shared, so turning it back on restores their access.

## What to expect

- **Each agent is separate.** Turning it on for one agent doesn't expose any others.
- **It survives restarts.** When Osaurus starts again, agents you turned on reconnect on their own.
- **It reconnects on its own.** If your internet drops, Osaurus keeps trying until it's back.
- **Several conversations at once are fine.**
- **Your Mac has to be awake.** If your Mac is asleep or Osaurus isn't running, the address can't answer.
- **One Mac per agent.** If a copied agent comes online on another of your Macs (for example, a restored backup), the newer one takes over and the older Mac shows **On another Mac** instead of fighting over it. Agents created separately on different Macs have different addresses, so they never clash.

## Who can see what

How private the traffic is depends on who's on the other end:

- **Osaurus to Osaurus is [end-to-end encrypted](/glossary#end-to-end-encryption).** A teammate's Osaurus and a guest's Osaurus use the [Secure Channel](/secure-channel). The relay passes along scrambled data it can't read.
- **Other apps use regular secure web traffic (HTTPS) to the relay.** When a third-party app, a script, or a webhook service uses the address, its connection is encrypted between that app and the relay. The relay then unwraps it and forwards it to your Mac. That means **the relay can see that traffic**, including the messages and replies. Keep this in mind before sending sensitive material from other apps.

Either way, your access keys still decide who gets in. Remote Access only carries messages; it doesn't let anyone skip the key.

:::note[Not the same as Anywhere (Beta)]
Devices & Sync has its own **Anywhere (Beta)** setting, which moves your own chats between your own devices through separate Osaurus servers. It never carries agent traffic, and Remote Access never carries sync.
:::

## When Remote Access is useful

- **Share an agent with a teammate or friend** without exposing your home network or setting up a VPN. ([Workspaces](/workspaces) and guest links set this up for you.)
- **Connect apps on other computers**, like an [MCP](/glossary#mcp) app or an [n8n](/agent-channels) server, to your Osaurus.
- **Demo an agent** from your Mac with a stable web address, with nothing to deploy.
- **Receive webhooks**, the automatic notifications other online services send, and have a local agent handle them.

## Troubleshooting

**The address doesn't appear.** Check that your Mac is online and Osaurus is running. The address shows once the connection to the relay works.

**The agent shows "On another Mac."** Another Mac is serving it. Click **Serve From This Mac**.

**Another app gets "unauthorized."** It needs a valid access key for this agent. Create one on the [Osaurus ID](/identity) page.

**My guest can't connect.** Check that the agent's Remote Access is **On**, the link hasn't expired or been used, and your Mac is awake.

---

## Under the hood

### How the tunnel works

1. Remote Access is turned on from **Sharing → Access → Remote Access**, the agent's **Sharing & Channels**, **Share Agent**, the workspace share sheet, or the chat sidebar. Every one asks the same consent question before the tunnel opens. (The n8n setup still calls it **Relay**.)
2. Osaurus opens a WebSocket tunnel to the relay service and authenticates with the agent's signature (an EIP-191 signed message from the agent's key).
3. The agent gets a public URL: `https://<address>.agent.osaurus.ai`, based on its cryptographic address.
4. Before marking it **On**, Osaurus probes `https://<address>.agent.osaurus.ai/health` to confirm the public route reaches your Mac.
5. Incoming HTTPS requests are forwarded to your local server over the tunnel, marked with the `X-Osaurus-Relay-Origin` header.
6. [Access keys](/identity) still protect every endpoint.

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

HTTPS from a remote client terminates at the relay, which then forwards the request over the tunnel. For plain API calls from third-party clients (for example, an OpenAI SDK calling `/v1/chat/completions`), the relay handles the request and response in readable form.

Osaurus peers wrap every agent request in the [Secure Channel](/secure-channel) (`POST /secure/call`), so the relay only forwards ciphertext. Agent-execution routes (`/agents/{id}/run`, `/agents/{id}/dispatch`), and every owner route called with a master key, refuse plaintext from any non-loopback caller with `426 Upgrade Required`. Relay traffic is never treated as a trusted local caller, even though it arrives over loopback.

### Guest links

A guest link is a signed, single-use invite with an expiry of 1 hour, 1 day, 7 days or 30 days. Redeeming it through `/pair-invite` mints an agent-scoped `osk-v1` key, HPKE-sealed to the guest's ephemeral key so the relay never sees it in plaintext. **Revoke** under **Guests** revokes that key.

### Security properties

- **Access keys are still required.** Relay-origin requests go through the normal auth gate, CORS rules, and the built-in Orchestrator's remote block.
- **Explicit opt-in.** Turning it on requires confirming the consent dialog.
- **Per-agent isolation.** Each tunnel is scoped to a single agent.
- **Routing uses the agent's signature**, so requests can't be misdirected and the tunnel can't be impersonated.
- **Auto-reconnect** uses backoff. Saved settings reconnect enabled tunnels when the server starts.
- **One tunnel per address.** The relay routes each agent address to exactly one tunnel; a newer authenticated tunnel evicts the older one.
- **Separate from sync.** The sync relays (`*.sync.osaurus.ai`) and the agent relay (`*.agent.osaurus.ai`) don't carry each other's traffic.

---

**Related:**

- [Osaurus ID](/identity): set up and manage the access keys that protect an agent's address
- [Workspaces](/workspaces): share agents with a team
- [Devices & Sync](/devices): your own Macs and iPhone, without Remote Access
- [Secure Channel](/secure-channel): the encryption Osaurus-to-Osaurus traffic uses through the relay
- [Integrations](/integrations): using a public address from MCP clients

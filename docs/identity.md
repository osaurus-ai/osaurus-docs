---
title: Identity
sidebar_label: Identity
description: How Osaurus proves that requests really come from you or your agents, with no account or password. Create access keys for other apps, back up your recovery phrase, and revoke access anytime.
---

# Identity

Your Osaurus **identity** is how Osaurus knows a request really comes from you or one of your agents. There's no account or password. Osaurus creates it for you the first time you open the app. You'll use it to let other apps and devices talk to your agents, and to move your setup to a new Mac.

:::tip[Trust at a glance]
Identity is one piece of how Osaurus protects your data. The full picture lives on [Security & Privacy](/security).
:::

## Get started

There's nothing to do on first launch. Osaurus sets up your identity quietly in the background. Then:

1. Open **Settings…** (`⌘ ,`) → **Identity**.
2. Click **View recovery phrase** and save the 24 words somewhere safe and private. This [recovery phrase](/glossary#recovery-phrase) is your backup. Anyone who has it can restore your identity.
3. When you want another app to use one of your agents, create an [access key](#access-keys) for it.

## What your identity is made of

Osaurus gives every participant its own **address**, a long code that starts with `0x`. Think of it like a signature only that participant can make, but anyone can check.

- **You** have a master address. Its secret key lives in your iCloud [Keychain](/glossary#keychain), macOS's secure password storage.
- **Each agent** gets its own address, worked out from yours and the Mac it was created on. Its authority always traces back to you.
- **Each Mac or device** gets its own ID, tied to its hardware.

You'll see your master address and each agent's address in **Settings… → Identity**. You can also assign, rotate, or revoke an agent's address there. Rotating or revoking it automatically stops keys made for the old address.

## Access keys

An **access key** is a password-like code that lets an outside app or device use your Osaurus. Examples: Cursor, Claude Desktop, an [MCP](/glossary#mcp) app, or a teammate's Mac. Access keys start with `osk-v1`.

### Creating an access key

Where you create the key decides what it can reach:

- **One agent only:** **Settings…** → **Identity**, find the agent under **Agent Addresses**, and click **Generate Access Key**.
- **All your agents:** **Settings…** → **Server** → **Overview** → **Access Keys**, then click **Generate Key**.

Either way, you choose:

- **Label:** a name you'll recognize, like "Cursor on work laptop."
- **Expiration:** 30 days, 90 days, 1 year, or never.

The full key is shown **once**. Copy it right away. Afterward, the list shows only its label, what it can reach, when it was last used, and when it expires.

### Using an access key

Paste the key into the other app wherever it asks for an API key or password. For setup steps for popular apps, see [Integrations](/integrations).

### Revoking an access key

1. Open the key list: **Settings… → Server → Overview → Access Keys**, or the agent's keys under **Settings… → Identity**.
2. Click the key, then **Revoke**.

The app using that key is cut off right away.

## Pairing another device

:::tip[Pairing an iPhone]
The Osaurus iPhone app pairs with a 6-digit code from **Settings… → Mobile → Generate Pairing Code** instead of the steps below. See [Mobile](./mobile.md).
:::

Some companion apps on your home or office network can find your Mac on their own and ask to connect:

1. On your Mac, make sure Osaurus's server is running and turned on for your local network (**Expose to Network** in **Settings… → Server**).
2. On the other device, open the companion app and tap **Connect**.
3. Your Mac shows a dialog naming the app and the agent it wants to use. Approve it.
4. The app gets its own key for that one agent. It lasts 90 days unless you choose **Remember permanently**.

Older pairings, made before keys were limited to one agent, show up as **Legacy** in the access key list. They can reach every agent and never expire. Revoke them and pair again for tighter control.

## Using Osaurus on more than one Mac

Your identity isn't tied to one Mac. To use it on another Mac, either let iCloud Keychain sync it, or enter your recovery phrase on the new Mac (see [Moving to a new Mac](#recovery)). Both Macs are then "you," with the same [workspaces](/glossary#workspace) and access. Each Mac still gets its own device ID.

- **Agents are separate on each Mac.** An agent made on one Mac is a different agent from one made on another, even with the same name.
- **Your other Mac's agents.** In a [workspace](./workspaces.md), agents running on your other Mac show as **Yours · other device**. You chat with them through the [relay](/glossary#relay), like a teammate's agent. Agents on the Mac you're using open locally.
- **One Mac serves an agent at a time.** If the same agent comes online on a second Mac (for example, after you copied a backup), the newer one takes over. The other Mac shows **Served From Another Device**. Click **Serve From This Mac** to take it back.
- **Your other Mac can ask for access directly.** A Mac with your identity can request access to an agent on another of your Macs, no workspace or invite needed. The host gives it a 90-day key for that agent, labeled `Owner device – <device name>`. It shows in that agent's key list and you can revoke it like any other.
- **Rotating follows the agent.** When you rotate an agent's address, its [Public Link](/glossary#public-link) reconnects and its workspace shares update. Old keys for that agent stop working. Your other Macs and teammates ask for access again on their own.
- **Older agents keep their addresses.** Agents created before per-Mac addresses existed keep the address they had. Nothing about their pairings, shares, or keys changes when you update.
- **The [Orchestrator](/glossary#orchestrator) stays on this Mac.** Other Macs and teammates can never reach it. (Your paired iPhone is the one exception. See [Mobile](./mobile.md).)

To use your agents from an iPhone, see [Mobile](./mobile.md).

## Moving to a new Mac {/* #recovery */}

If you lose a Mac or move to a new one:

- **iCloud Keychain sync:** if your identity synced (the default), it appears on the new Mac once iCloud Keychain restores.
- **Recovery phrase:** on the new Mac, open **Settings… → Identity**, find **Restore from recovery phrase**, and click **Restore…**. Enter your 24 words to rebuild the same identity. Your existing agents and access keys start working again.

Without one of these, Osaurus creates a fresh identity. Your agents get new addresses, and your old access keys stop working.

:::warning[Back up your agents too]
The recovery phrase rebuilds **your** identity only. An agent's address also depends on the Mac it was created on, which is saved with the agent, not in the phrase. To keep an agent's address on a wiped Mac, keep a copy of the agent alongside your phrase: a Time Machine backup of `~/.osaurus`, or an exported `.osaurus-agent` file.
:::

## Troubleshooting

**An app says "401 Unauthorized."** Its access key was revoked, expired, or mistyped. Create a new key and paste it in again.

**My agents have new addresses after moving Macs.** You started with a fresh identity. Restore from your recovery phrase, and restore the agents from a backup.

---

## Under the hood

For the full crypto spec (secp256k1, App Attest, the `osk-v1` format, request signing rules, and replay protection), see [Identity Cryptography](/identity-internals). Server-side body-size limits live in [Configuration](/configuration#http-server-limits).

### Addresses and keys

An address is an Ethereum-style checksummed hex string, like `0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18`. It identifies the entity; the matching private key signs requests. Anyone holding the address can verify a signature, and nobody can fake one.

| Kind | Owner | Where the key lives |
|---|---|---|
| **Master** | You | iCloud Keychain, gated by Face ID / Touch ID |
| **Agent** | Each of your agents | Never stored; derived on demand from the master key and the device the agent was created on |
| **Device** | Each device running Osaurus | Hardware-bound via Apple's Secure Enclave (App Attest) |

On first launch, Osaurus generates a 32-byte master key with the system's secure random source and saves it to your iCloud Keychain (so it can sync to your other Apple devices). Setup is silent; nothing is shown during onboarding. The 24-word recovery phrase is a BIP39 encoding of the master key.

Each agent gets a deterministic address derived from the master key and this device's ID. If an older version re-saved an agent without its device information, the Identity view restores it automatically when it can reproduce the address; no keys change.

### The `osk-v1` access key format

Access keys are portable, long-lived tokens in the format `osk-v1.<payload>.<signature>`:

```
osk-v1.eyJpc3MiOiIweDc0...g.4f8a9b...
```

Most clients send it as a Bearer token:

```bash
curl http://your-mac.local:1337/v1/chat/completions \
  -H "Authorization: Bearer osk-v1.…" \
  -H "Content-Type: application/json" \
  -d '{"model":"foundation","messages":[{"role":"user","content":"hi"}]}'
```

For MCP clients, paste it into the auth field of their config UI. [Integrations →](/integrations)

Revocations are recorded; the next request using a revoked key gets `401 Unauthorized`. Bulk revocation (revoking every key issued by an address up to a counter threshold) exists at the API level but has no UI button yet.

### Owner-device access

A device holding your identity proves it holds the master key by signing a one-time challenge. The host then issues a 90-day agent-scoped access key labeled `Owner device – <device name>`.

### Bonjour pairing protocol

Connector apps find the host over Bonjour. The pairing flow:

1. The host's server must be reachable on the LAN (`osaurus serve --expose` or the **Expose to Network** toggle).
2. The connector fetches a **single-use challenge nonce** from the host (rate-limited per IP) and signs it with its own keypair.
3. Osaurus verifies the signature and shows an approval dialog naming both the connector and the agent.
4. On approval, Osaurus mints an **agent-scoped** `osk-v1` key (90-day expiration by default; "Remember permanently" for a non-expiring key), **encrypts it to the connector's ephemeral key** (HPKE), and signs the response with the host's own identity so the connector can verify who it paired with.
5. The client decrypts and stores the key; later requests are authenticated with it.

Pairings approved before per-agent scoping are master-scoped, never-expiring keys, labeled **Legacy** in **Server → Overview → Access Keys**.

### Rotation

Rotating an agent's key moves everything that pointed at the old address: the relay tunnel re-authenticates and every workspace share is re-issued. Access keys for the old address stop working.

### Whitelist (advanced)

The whitelist controls which addresses are *allowed* to issue keys for your Osaurus. By default it includes only your master address; you can add trusted external addresses (a teammate, a colleague's agent, a CI bot).

- **Master whitelist:** entries here can issue keys for any agent.
- **Per-agent whitelist:** additional entries authorized only for a specific agent.

The agent's own address and the master address are always implicitly included. There's no settings UI for the whitelist yet; it's managed programmatically (stored in the Keychain and enforced at server startup).

### What's signed and verified

Every authenticated API request carries a cryptographic signature, and the server checks it before doing anything. Every action is verifiable and revocable without a central server. [Identity Cryptography →](/identity-internals)

---

**Related:**

- [Identity Cryptography](/identity-internals) — the full secp256k1 / App Attest / osk-v1 spec
- [Public Links](/relay) — expose an agent to the internet using its identity
- [Mobile](./mobile.md) — pair the Osaurus iPhone app with your Mac
- [Workspaces](./workspaces.md) — share agents with teammates through the relay
- [Integrations](/integrations) — using access keys with Cursor, Claude Desktop, etc.

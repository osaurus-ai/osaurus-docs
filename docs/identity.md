---
title: Osaurus ID
sidebar_label: Osaurus ID
description: Your Osaurus ID proves requests really come from you or your agents, with no password. Claim a public handle, publish workflows, log in to store.osaurus.ai, manage access keys, and back up your recovery phrase.
---

# Osaurus ID

Your **Osaurus ID** is how Osaurus knows a request really comes from you or one of your agents. There's no password to remember: Osaurus creates it for you the first time you open the app. You use it to sign the workflows you publish, to log in to store.osaurus.ai, to let other apps talk to your agents, and to move your setup to a new Mac.

For example: you publish a workflow, and its page on store.osaurus.ai says **Published by @maya**. Later you open the store in your browser, click **Log in with Osaurus**, touch Touch ID once, and you're in. No account, no password.

:::tip[Trust at a glance]
Your Osaurus ID is one piece of how Osaurus protects your data. The full picture is on [Security & Privacy](/security).
:::

## Get started

There's nothing to do on first launch. Osaurus sets up your identity quietly. Then:

1. Open Settings: click the gear icon at the bottom of the narrow strip on the left edge of the window, or press ⌘,. Choose **Osaurus ID** under **General**.
2. Save your 24-word [recovery phrase](/glossary#recovery-phrase) somewhere safe and private. Osaurus shows it once, at setup, and the page keeps a warning until you confirm you've saved it. Anyone who has the phrase can restore your identity.
3. Optional: claim a public handle under **Public Profile** (see [Your public handle](#your-public-handle)). You need one to publish workflows.
4. When another app needs one of your agents, create an [access key](#access-keys) for it.

## What's on the page

- **Wallet & Credits** at the top: turn on **Use Osaurus Router**, see your balance, and top up. See [Osaurus Router](/osaurus-router).
- **Public Profile**: your public handle, display name and bio.
- **Sign In with Osaurus**: the websites you've logged in to with your identity.
- **Master Address** and **Agent Addresses**: the codes behind your identity and each agent's.
- **Devices**: a link to **Settings → Sharing → Devices**, where your own Macs and iPhone are added. See [Devices & Sync](/devices).
- **Danger Zone**: **Restore From Recovery Phrase** and **Reset Identity**.

## Your public handle

Your handle is the name people see on what you share, like **@maya**. It appears on workflows you publish to store.osaurus.ai, on your author page, and on files you sign.

1. Under **Public Profile**, type the handle you want. It can be 3 to 20 characters: lowercase letters, numbers and hyphens. Osaurus tells you whether it's available.
2. Click **Claim**, then confirm.

:::warning[Handles are permanent]
Your handle is public and can't be changed or released later. Pick one you're happy to keep. You can still edit your display name and bio.
:::

The handle lives on [Osaurus Router](/glossary#osaurus-router), next to your credits and workspaces. If Router is off, the page shows **Osaurus ID needs Osaurus Router** with **Open Wallet & Credits** to turn it on.

**Publishing a workflow needs an Osaurus ID.** Every published page is signed with it, so people can see who made it. Saving a workflow as a file doesn't need one. See [Share a Workflow](/workflows-share).

## Log in with Osaurus

Osaurus's own websites, such as store.osaurus.ai, offer **Log in with Osaurus** instead of a username and password.

1. On the website, click **Log in with Osaurus**. Osaurus opens and asks "Sign in to store.osaurus.ai?", showing the exact web address.
2. Click **Continue**.
3. Confirm with Touch ID, or your password on a Mac without Touch ID.

Your browser finishes signing you in. What the website gets, and what it doesn't:

- It receives your master address and, if you claimed one, your handle. It **never** receives your keys, chats or files.
- Each login works for that one website, once, for five minutes. It can't be reused on another site.
- Only Osaurus's own websites can ask. A request from any other site is refused before you see anything.
- **Cancel**, closing the prompt, or ignoring it for two minutes tells the website you said no.

**Sign In with Osaurus** on the Osaurus ID page lists your **Recent Sign-ins**, with **Clear history**. Signing out happens on the website. Developers adding this button to a site: see [Log in with Osaurus](/login-with-osaurus).

## What your identity is made of

Osaurus gives every participant its own **address**, a long code that starts with `0x`. Think of it as a signature only that participant can make, but anyone can check.

- **You** have a master address. Its secret key lives in your iCloud [Keychain](/glossary#keychain), macOS's secure password storage.
- **Each agent** gets its own address, worked out from yours and the Mac it was created on. Its authority always traces back to you.
- **Each Mac or device** gets its own ID, tied to its hardware.

You'll see your master address and each agent's address on the Osaurus ID page. You can also assign, rotate or revoke an agent's address there. Rotating or revoking it automatically stops keys made for the old address.

## Access keys

An **access key** is a password-like code that lets an outside app use your Osaurus. Examples: Cursor, Claude Desktop, or an [MCP](/glossary#mcp) app. Access keys start with `osk-v1`.

### Creating an access key

Where you create the key decides what it can reach:

- **One agent only:** on the Osaurus ID page, find the agent under **Agent Addresses** and click **Generate Access Key**.
- **All your agents:** **Settings → Server → Access Keys**, then click **Generate Key**.

Either way, you choose:

- **Label:** a name you'll recognize, like "Cursor on work laptop."
- **Expiration:** 30 days, 90 days, 1 year, or never.

The full key is shown **once**. Copy it right away. Afterward, the list shows only its label, what it can reach, when it was last used, and when it expires.

### Using an access key

Paste the key into the other app wherever it asks for an API key or password. For setup steps for popular apps, see [Integrations](/integrations).

### Revoking an access key

1. Open the key list: **Settings → Server → Access Keys**, or the agent's keys on the Osaurus ID page.
2. Click the key, then **Revoke**.

The app using that key is cut off right away.

Keys made by the old local-network pairing of earlier versions keep working until they expire or you revoke them. They show as **Legacy** in the access key list. Revoke them if you no longer use that app.

## How other people and your devices connect

- **Other people** reach one of your agents through a guest link (**Share Agent → Guest Link**) or a [workspace](/workspaces). Everyone holding a guest link is listed under **Settings → Sharing → Access → Guests**. See [Remote Access](/remote-access).
- **Your own Macs and iPhone** use [Devices & Sync](/devices) instead. They don't need access keys or a workspace.

## Using Osaurus on more than one Mac

Your identity isn't tied to one Mac. Let iCloud Keychain sync it, or enter your recovery phrase on the new Mac (see [Moving to a new Mac](#recovery)). Both Macs are then "you," with the same handle, [workspaces](/glossary#workspace) and access. Each Mac still gets its own device ID.

- **Agents are separate on each Mac.** An agent made on one Mac is a different agent from one made on another, even with the same name. To chat with your other Mac's agents, add both Macs under [Devices](/devices); its agents appear in the chat sidebar under **On** *that Mac*.
- **One Mac serves an agent at a time.** If the same agent's Remote Access comes on from a second Mac (for example, after you copied a backup), the newer one takes over. The other Mac shows **On another Mac** under **Settings → Sharing → Access → Remote Access**. Click **Serve From This Mac** to take it back.
- **Agents you shared to a workspace** from your other Mac show in that workspace as "Yours · other device."
- **Rotating follows the agent.** When you rotate an agent's address, its Remote Access reconnects and its workspace shares update. Old keys for that agent stop working.
- **Older agents keep their addresses.** Agents created before per-Mac addresses existed keep the address they had.
- **The [Orchestrator](/glossary#orchestrator) stays on this Mac.** Other people's Macs can never reach it. Your own devices reach it only through [Devices & Sync](/devices).

## Moving to a new Mac {/* #recovery */}

If you lose a Mac or move to a new one:

- **iCloud Keychain sync:** if your identity synced (the default), it appears on the new Mac once iCloud Keychain restores.
- **Recovery phrase:** on the new Mac, open the Osaurus ID page and choose **Danger Zone → Restore From Recovery Phrase**. Enter your 24 words to rebuild the same identity. Your existing agents and access keys start working again.

Without one of these, Osaurus creates a fresh identity. Your agents get new addresses, and your old access keys stop working.

Your chats come back separately, through [Devices & Sync](/devices). Sync has its own recovery phrase, which you can link to this one.

:::warning[Back up your agents too]
The recovery phrase rebuilds **your** identity only. An agent's address also depends on the Mac it was created on, which is saved with the agent, not in the phrase. To keep an agent's address on a wiped Mac, keep a copy of the agent alongside your phrase: a Time Machine backup of your Osaurus folder, or an exported agent file.
:::

**Reset Identity** in the Danger Zone starts over with a brand-new identity. Your identity is never replaced without you asking.

## Troubleshooting

**An app says "401 Unauthorized."** Its access key was revoked, expired, or mistyped. Create a new key and paste it in again.

**My agents have new addresses after moving Macs.** You started with a fresh identity. Restore from your recovery phrase, and restore the agents from a backup.

**I can't claim a handle.** Turn on Osaurus Router from **Wallet & Credits**. If the name is taken, reserved or not allowed, the field says so.

**"Log in with Osaurus" opens a setup screen.** This Mac doesn't have an identity yet. Osaurus opens the Osaurus ID page so you can set one up, then try again.

---

## Under the hood

For the full crypto spec (secp256k1, App Attest, the `osk-v1` format, request signing rules, and replay protection), see [Identity Cryptography](/identity-internals). Server-side body-size limits live in [Configuration](/configuration).

### Addresses and keys

An address is an Ethereum-style checksummed hex string, like `0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18`. It identifies the entity; the matching private key signs requests. Anyone holding the address can verify a signature, and nobody can fake one.

| Kind | Owner | Where the key lives |
|---|---|---|
| **Master** | You | iCloud Keychain, gated by Face ID / Touch ID |
| **Agent** | Each of your agents | Never stored; derived on demand from the master key and the device the agent was created on |
| **Device** | Each device running Osaurus | Hardware-bound via Apple's Secure Enclave (App Attest) |

On first launch, Osaurus generates a 32-byte master key with the system's secure random source and saves it to your iCloud Keychain. The 24-word recovery phrase is a BIP39 encoding of the master key.

Each agent gets a deterministic address derived from the master key and this device's ID. If an older version re-saved an agent without its device information, the Osaurus ID page restores it automatically when it can reproduce the address; no keys change.

The public handle is stored on Osaurus Router against your master address. Published workflow pages and signed `.osaurustemplate` files show it as `@handle`.

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

Master-scoped keys reach every agent; agent-scoped keys are rejected on other agents' routes. Revocations are recorded; the next request using a revoked key gets `401 Unauthorized`. Bulk revocation (every key issued by an address up to a counter threshold) exists at the API level but has no UI button.

### Guest links and owner-device access

A redeemed guest link gets an agent-scoped `osk-v1` key, delivered HPKE-sealed through `/pair-invite` so the relay never sees it in plaintext.

For Macs on builds from before sync, a device holding your identity can still prove it holds the master key by signing a one-time challenge; the host issues a 90-day agent-scoped key labeled `Owner device – <device name>`. Current Macs reach each other's agents through [Devices & Sync](/devices) instead.

### LAN pairing (retired)

The Bonjour local-network pairing flow (`GET /pair/challenge`, `POST /pair`) and per-agent `_osaurus._tcp` advertising were removed in 1.0. Those routes no longer answer. Keys it issued keep working until they expire or are revoked; pre-scoping keys are labeled **Legacy** in **Settings → Server → Access Keys**.

### Log in with Osaurus

The login is protocol `osl-v1`: an EIP-191 `personal_sign` assertion by your master key, bound to one origin and nonce, valid for 5 minutes and single-use. Osaurus refuses origins not on its first-party allowlist (store.osaurus.ai, osaurus.ai, www.osaurus.ai) before showing the prompt, reads the master key only after Touch ID or your password, and opens the site's callback with the assertion in the URL fragment. The site verifies the signature itself; there's no Osaurus login server. Full protocol: [Log in with Osaurus](/login-with-osaurus).

### Rotation

Rotating an agent's key moves everything that pointed at the old address: the relay tunnel re-authenticates and every workspace share is re-issued. Access keys for the old address stop working.

### Whitelist (advanced)

The whitelist controls which addresses are *allowed* to issue keys for your Osaurus. By default it includes only your master address; you can add trusted external addresses (a teammate, a colleague's agent, a CI bot).

- **Master whitelist:** entries here can issue keys for any agent.
- **Per-agent whitelist:** additional entries authorized only for a specific agent.

The agent's own address and the master address are always implicitly included. There's no settings UI for the whitelist; it's managed programmatically (stored in the Keychain and enforced at server startup).

### What's signed and verified

Every authenticated API request carries a cryptographic signature, and the server checks it before doing anything. Every action is verifiable and revocable without a central server. [Identity Cryptography →](/identity-internals)

---

**Related:**

- [Identity Cryptography](/identity-internals): the full secp256k1 / App Attest / osk-v1 spec
- [Devices & Sync](/devices): your own Macs and iPhone
- [Remote Access](/remote-access): reach an agent over the internet using its identity
- [Workspaces](/workspaces): share agents with teammates
- [Share a Workflow](/workflows-share): publishing needs an Osaurus ID
- [Integrations](/integrations): using access keys with Cursor, Claude Desktop, and others

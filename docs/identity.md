---
title: Identity & Access
sidebar_label: Identity & Access
description: Cryptographic identity for you and your agents. Issue access keys for outside tools, scope them per-agent, revoke them anytime — no central server.
sidebar_position: 14
---

# Identity & Access

Every participant in Osaurus — you, each of your agents, and each device you pair — gets a **cryptographic address**. Authority flows from your master key down to each agent. Agents can prove who they are without a server. Compromised keys can be revoked at any level, anytime.

:::tip Trust at a glance
Identity is one piece of how Osaurus protects your data. The full picture — encryption at rest, sandboxed execution, what we don't have access to — lives on [Security & Privacy](/security).
:::

This page is the everyday, plain-language view. For the full crypto spec (secp256k1, App Attest, the `osk-v1` format, signing rules), see [Identity Cryptography](/identity-internals).

## What "address" means here

Think of it like an Ethereum-style address — a checksummed hex string like `0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18`. It identifies the entity. The matching private key signs requests. Anyone holding the address can verify the signature; nobody can fake it.

There are three kinds:

| Kind | Owner | Where the key lives |
|---|---|---|
| **Master** | You (the human) | iCloud Keychain, gated by Face/Touch ID |
| **Agent** | Each of your agents | Never stored — derived on demand from the master key |
| **Device** | Each Mac you pair | Hardware-bound via Apple's Secure Enclave (App Attest) |

You only ever see the master key flow during initial setup. The rest is automatic.

## First-time setup

The first time you open Osaurus on a new Mac:

1. Osaurus generates a 32-byte master key with the system's secure random source
2. The key is saved to your iCloud Keychain (so it can sync to your other Apple devices), gated by biometric authentication
3. A one-time **recovery code** (`OSAURUS-XXXX-XXXX-XXXX-XXXX`) is shown — **save this somewhere safe**, you will only see it once

Each agent you create automatically gets a deterministic agent address derived from your master key. You don't see this happen — agents just have an address.

## Access Keys

When you want an outside tool — Cursor, Claude Desktop, an MCP client, a teammate's Mac — to talk to your Osaurus, you mint an **access key**.

Access keys are portable, long-lived tokens. Format: `osk-v1.<payload>.<signature>`. They look like:

```
osk-v1.eyJpc3MiOiIweDc0...g.4f8a9b...
```

### Creating an access key

1. Open the Management window (`⌘ ⇧ M`) → **Identity**
2. Click **Create Access Key**
3. Pick:
   - **Scope** — Master (works for any of your agents) or a specific agent
   - **Label** — A human-readable name like "Cursor on work laptop"
   - **Expiration** — 30 days, 90 days, 1 year, or never
4. The full key string is shown **once** — copy it now
5. Click **Done**

You'll see the key's metadata in the list (label, scope, last used, expires). The full key never appears again.

### Using an access key

Most clients accept it as a Bearer token:

```bash
curl http://your-mac.local:1337/v1/chat/completions \
  -H "Authorization: Bearer osk-v1.…" \
  -H "Content-Type: application/json" \
  -d '{"model":"foundation","messages":[{"role":"user","content":"hi"}]}'
```

For MCP clients, paste it into the auth field of their config UI. [Integrations →](/integrations)

### Revoking

Revoke a single key, or every key issued by the same address up to a counter threshold:

1. **Identity → Access Keys**
2. Click the key → **Revoke**
3. The revocation is recorded — the next request using that key gets `401 Unauthorized`

For bulk revocation (e.g. you suspect every key issued before today is compromised), click **Revoke all keys before this one**.

## Pairing another device

The Osaurus iOS / Mac connector apps use Bonjour to find your Osaurus and pair securely:

1. On the **Osaurus host**, ensure the server is running and reachable on the LAN (`osaurus serve --expose` or the Settings toggle)
2. On the **client device**, open the connector and tap **Connect**
3. The connector signs a nonce with its own keypair
4. Osaurus shows an **approval dialog** naming both the connector and the agent it wants to access
5. Approve → Osaurus mints an **agent-scoped** `osk-v1` key (90-day expiration by default; opt in to "Remember permanently" for a non-expiring key)
6. The client stores the key; subsequent requests are authenticated

Pairings approved before the per-agent scoping update are master-scoped, never-expiring keys. Settings → Identity labels them as **Legacy** — revoke and re-pair to get tighter scoping.

## Whitelist (advanced)

The whitelist controls which addresses are *allowed* to issue keys for your Osaurus. By default it includes only your master address; you can add trusted external addresses (a teammate, a colleague's agent, a CI bot).

- **Master whitelist** — entries here can issue keys for any agent
- **Per-agent whitelist** — additional entries authorized only for a specific agent

The agent's own address and the master address are always implicitly included. Manage from **Settings → Identity → Whitelist**.

## Recovery

If you lose access to a Mac and need to migrate to a new one:

- **iCloud Keychain sync** — If your master key was synced (the default), it appears on the new Mac automatically after iCloud Keychain restores
- **Recovery code** — The one shown during setup. Use it during initial setup on the new Mac to restore the same identity

Without one of those, you'll generate a fresh identity. Your agents will get new addresses; existing access keys won't work.

## What's signed and verified

Every authenticated API request to Osaurus carries a signed token (or an `osk-v1` access key). The server checks:

- The signature came from the address claimed in the payload
- The address is in the active whitelist
- The token isn't revoked or expired
- The counter prevents replay

You don't see any of this — your apps and clients handle it. But it means every action in Osaurus is **verifiable** and **revocable** without a central server.

## Pre-auth body limits

To prevent unauthenticated clients from exhausting host memory, Osaurus rejects oversized request bodies *before* the auth gate:

| Endpoint | Limit |
|---|---|
| `POST /pair` | 64 KiB |
| Other public HTTP routes | 32 MiB |
| Sandbox host bridge | 8 MiB |

Oversized requests return `413 Payload Too Large`.

---

**Related:**

- [Identity Cryptography](/identity-internals) — the full secp256k1 / App Attest / osk-v1 spec
- [Relay](/relay) — expose an agent to the internet using its identity
- [Integrations](/integrations) — using access keys with Cursor, Claude Desktop, etc.

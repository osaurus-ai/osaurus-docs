---
title: Identity
sidebar_label: Identity
description: A cryptographic address for you and each of your agents. Issue access keys for outside tools, scope them per-agent, revoke them anytime — no central server.
---

# Identity

Every participant in Osaurus — you, each of your agents, and each device you pair — gets a **cryptographic address**. Authority flows from your master key down to each agent. Agents can prove who they are without a server. Compromised keys can be revoked at any level, anytime.

:::tip[Trust at a glance]
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

Setup is silent — there's nothing to write down at onboarding. Your backup is a **24-word recovery phrase** (BIP39) that encodes the master key. View and save it anytime from **Management → Identity → View recovery phrase**.

Each agent you create automatically gets a deterministic agent address derived from your master key. You don't see this happen — agents just have an address.

## Access keys

When you want an outside tool — Cursor, Claude Desktop, an MCP client, a teammate's Mac — to talk to your Osaurus, you mint an **access key**.

Access keys are portable, long-lived tokens. Format: `osk-v1.<payload>.<signature>`. They look like:

```
osk-v1.eyJpc3MiOiIweDc0...g.4f8a9b...
```

### Creating an access key

Where you create the key decides its scope:

- **Master-scoped** (works for any of your agents) — Management window (`⌘ ⇧ M`) → **Server** → **Access Keys** → **Create Access Key**
- **Agent-scoped** (one specific agent) — Management window → **Identity** → the agent's key section

Either way you pick:

- **Label** — A human-readable name like "Cursor on work laptop"
- **Expiration** — 30 days, 90 days, 1 year, or never

The full key string is shown **once** — copy it now. You'll see the key's metadata in the list (label, scope, last used, expires), but the full key never appears again.

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

1. **Server → Access Keys** (or the agent's key list under **Identity**)
2. Click the key → **Revoke**
3. The revocation is recorded — the next request using that key gets `401 Unauthorized`

Bulk revocation (revoking every key issued by an address up to a counter threshold) exists at the API level but has no UI button yet — revoke keys individually from the list.

## Pairing another device

The Osaurus iOS / Mac connector apps use Bonjour to find your Osaurus and pair securely:

1. On the **Osaurus host**, ensure the server is running and reachable on the LAN (`osaurus serve --expose` or the Settings toggle)
2. On the **client device**, open the connector and tap **Connect**
3. The connector fetches a **single-use challenge nonce** from the host (rate-limited per IP) and signs it with its own keypair
4. Osaurus verifies the signature and shows an **approval dialog** naming both the connector and the agent it wants to access
5. Approve → Osaurus mints an **agent-scoped** `osk-v1` key (90-day expiration by default; opt in to "Remember permanently" for a non-expiring key), **encrypts it to the connector's ephemeral key** (HPKE), and signs the response with the host's own identity so the connector can verify who it paired with
6. The client decrypts and stores the key; subsequent requests are authenticated

Pairings approved before the per-agent scoping update are master-scoped, never-expiring keys. The **Server → Access Keys** list labels them as **Legacy** — revoke and re-pair to get tighter scoping.

## Whitelist (advanced)

The whitelist controls which addresses are *allowed* to issue keys for your Osaurus. By default it includes only your master address; you can add trusted external addresses (a teammate, a colleague's agent, a CI bot).

- **Master whitelist** — entries here can issue keys for any agent
- **Per-agent whitelist** — additional entries authorized only for a specific agent

The agent's own address and the master address are always implicitly included. There's no settings UI for the whitelist yet — it's managed programmatically (stored in the Keychain and enforced at server startup).

## Recovery

If you lose access to a Mac and need to migrate to a new one:

- **iCloud Keychain sync** — If your master key was synced (the default), it appears on the new Mac automatically after iCloud Keychain restores
- **24-word recovery phrase** — Saved from **Management → Identity → View recovery phrase**. On the new Mac, use **Identity → Restore from recovery phrase** to rebuild the same master key — your existing agents and access keys start working again

Without one of those, you'll generate a fresh identity. Your agents will get new addresses; existing access keys won't work.

## What's signed and verified

Every authenticated API request to your Osaurus carries a cryptographic signature, and the server checks it before doing anything. You don't see any of this — your apps and clients handle it. But it means every action is **verifiable** and **revocable** without a central server. [Identity Cryptography →](/identity-internals)

## Under the hood

For the full secp256k1 / App Attest / `osk-v1` spec, request signing rules, and replay protection, see [Identity Cryptography](/identity-internals). Server-side body-size limits live in [Configuration](/configuration#http-server-limits).

---

**Related:**

- [Identity Cryptography](/identity-internals) — the full secp256k1 / App Attest / osk-v1 spec
- [Public Links](/relay) — expose an agent to the internet using its identity
- [Integrations](/integrations) — using access keys with Cursor, Claude Desktop, etc.

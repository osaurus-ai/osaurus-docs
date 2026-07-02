---
title: Storage & Encryption
sidebar_label: Storage & Encryption
description: How Osaurus stores data on disk — plaintext by default with FileVault protection, opt-in SQLCipher encryption, migration, recovery, and Settings → Storage.
---

# Storage & Encryption

Osaurus stores your local data — chats, memory, methods, tool indexes, plugin databases, and large attachments — under `~/.osaurus/`. Since 0.21.0, data is stored as **plaintext SQLite by default**, protected at rest by macOS **FileVault**. Whole-database **SQLCipher encryption is an explicit opt-in** in **Settings → Storage**.

:::tip[Looking for the user-friendly version?]
This page is the technical reference. For a plain-language overview of how Osaurus protects your data, start at [Security & Privacy](/security).
:::

## TL;DR

- **Plaintext by default.** FileVault already encrypts the whole disk at rest, so your data is protected when the Mac is off or logged out — without an app-managed key that can go missing.
- **Encryption is opt-in.** Turn on **Settings → Storage → Encrypt local data at rest (SQLCipher)** to encrypt every database with a 32-byte key in your macOS Keychain.
- **Upgrades migrate automatically.** If you're coming from a version with always-on encryption, first launch decrypts to plaintext when FileVault is on, or keeps your data encrypted when FileVault is off. No prompt; you can flip the choice later in Settings.
- **Back up before risky operations.** Use **Settings → Storage → Export plaintext backup** before reinstalling macOS, migrating Macs, or rotating the key.

## Why encryption is opt-in

Earlier versions encrypted everything, always. The cipher was never the problem — **availability coupling** was. Every store's ability to open depended on a Keychain key, and that key breaks in ordinary situations:

- Migrating to a new Mac without iCloud Keychain sync
- Re-signing the app, so the Keychain ACL no longer matches
- Wiping or resetting the login Keychain
- Restoring `~/.osaurus/` into a different user account

When the key was gone, the database refused to open and the app failed closed with an opaque error — bricking memory and search with no recovery path. Reliability comes first, and FileVault already provides full-disk encryption at rest. So the default is now plaintext, and SQLCipher is a reversible opt-in.

### Threat model

| Threat | Plaintext + FileVault (default) | Opt-in SQLCipher |
|---|---|---|
| Lost or stolen Mac, powered off | Protected by FileVault | Protected by both |
| Another user account on the same Mac | Filesystem permissions only | Cryptographically separated |
| FileVault turned off | Readable from the raw disk | Encrypted regardless |
| Backups / Time Machine / cloud sync of `~/.osaurus` | Copied as plaintext | Copied as ciphertext |
| Keychain key lost (migration, re-sign, wipe) | **No impact** — nothing depends on the key | Encrypted stores can't open until the key is restored or the store is reset |

**In short:** plaintext is the most reliable option and is well protected if FileVault is on. Opt in to SQLCipher if you share the Mac account, don't run FileVault, or back up `~/.osaurus` somewhere you don't fully trust — and keep a plaintext backup in case the key is ever lost.

## Detection-first opening

The on-disk reality always wins over any flag. A plaintext SQLite file starts with the 16-byte magic header `SQLite format 3\0`; a SQLCipher file's header looks random. Osaurus checks the first 16 bytes of each file and opens it accordingly:

- **Plaintext** → open with no key; the Keychain is never touched
- **Encrypted** → open with the Keychain key
- **Empty or missing** → create in the mode you chose (plaintext unless you opted in)

In the default plaintext mode the key is never read, so a stale or missing Keychain entry can't prevent a store from opening.

## What's stored

| Artifact | Default | Opt-in encrypted | On-disk location |
|---|---|---|---|
| Chat history | SQLite | SQLCipher | `~/.osaurus/chat-history/history.sqlite` |
| Router billing ledger | SQLite | SQLCipher | `~/.osaurus/billing/ledger.sqlite` |
| Memory (identity, pinned facts, episodes, transcript, FTS5 mirrors) | SQLite | SQLCipher | `~/.osaurus/memory/memory.sqlite` |
| Methods catalog | SQLite | SQLCipher | `~/.osaurus/methods/methods.sqlite` |
| Tool index | SQLite | SQLCipher | `~/.osaurus/tool-index/tool_index.sqlite` |
| Per-plugin databases | SQLite | SQLCipher | `~/.osaurus/Tools/{plugin}/data/data.db` |
| Per-agent database (opt-in feature) | SQLite | SQLCipher | `~/.osaurus/agents/{uuid}/db.sqlite` |
| Self-scheduling slots | SQLite | SQLCipher | `~/.osaurus/scheduler.sqlite` |
| Large chat attachments | Plaintext blob | AES-GCM (`.osec`) | `~/.osaurus/chat-history/blobs/{sha256}` |

**Attachment spillover.** Image and document payloads of 16 KB or more are hashed (SHA-256, so duplicates dedup) and written to their own file. The chat row stores only a reference. Reads are detection-first — a posture change never strands existing blobs. Smaller payloads stay inline in the row.

**Router billing ledger.** Charge diagnostics are metadata-only: request id, session id, model, token counts, cost, and status. The ledger never stores prompt text, response text, or tool arguments, in either mode. See [Osaurus Router](/osaurus-router).

**Always plaintext, by design:**

- The posture marker `~/.osaurus/.storage-encryption.json` — encrypting it would reintroduce the chicken-and-egg key dependency this design removes
- JSON config under `~/.osaurus/config/`, `agents/`, `themes/`, `providers/`, `schedules/`, `watchers/`, `skills/`
- Plugin manifests under `~/.osaurus/sandbox-plugins/`
- Vector index files under `~/.osaurus/memory/vectura/{agent}/` — rebuilt from the SQLite source on demand; see [Limitations](#limitations)

## Migration

A convergence pass runs on every launch, and again whenever you flip the Settings toggle. It brings every on-disk file in line with the posture you chose.

### First launch after upgrading (FileVault-gated)

If you upgraded from a version with always-on encryption, Osaurus resolves the target posture once:

- Encrypted install + FileVault **on** → **decrypt to plaintext.** The disk is already encrypted at rest, so SQLCipher is redundant and plaintext is the reliable default.
- Encrypted install + FileVault **off** → **keep encrypted.** Decrypting would strip the data's only at-rest protection.
- Fresh or already-plaintext install → **plaintext.**

The choice is persisted in the posture marker and honored on every later launch. There's no prompt — the migration is invisible, and you can change the posture anytime in **Settings → Storage**.

### How conversion works

For each database whose detected format differs from the desired mode, Osaurus exports it into a temporary file in the target format (via SQLCipher's `sqlcipher_export`), syncs it, and atomically replaces the original. New opens are parked on a gate while handles are closed, and reopened after conversion. Attachment blobs convert alongside the databases.

The process is **idempotent and crash-safe**: because opening is detection-first, a partially converged tree recovers on the next launch — each file is opened according to what it actually is on disk.

## Recovery

Convergence **never auto-deletes data**. If a store can't be opened — almost always an encrypted store whose Keychain key is gone — Osaurus keeps running on whatever opens and surfaces the failure:

- **Memory → Diagnostics** shows the real cause for the memory database, with inline **Retry** and **Reset**
- **Settings → Storage** shows a "Stores needing attention" panel listing every degraded store with its cause and the same actions

**Retry** re-attempts the open (for example, after you restore the Keychain key). **Reset** moves the unreadable file to `~/.osaurus/quarantine/` — **moved, never deleted** — and recreates an empty store so the feature works again. If you later recover the key, you can still export the old data from the quarantined copy.

## Key management (encrypted mode)

:::info
Key management only applies when you opt in to encryption. In the default plaintext mode there is no key, and the Keychain is never read for storage.
:::

The data-encryption key (DEK) is a 32-byte `SymmetricKey` stored as a Keychain generic password:

| Attribute | Value |
|---|---|
| `kSecAttrService` | `com.osaurus.storage` |
| `kSecAttrAccount` | `data-encryption-key` |
| Accessibility | `kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly` |

### Why not biometric

Every Osaurus launch — including background relaunches by `launchd`, auto-updates, and watcher-driven wakeups — needs to open the databases without a user-facing prompt. `AfterFirstUnlockThisDeviceOnly` means the key is available any time you've unlocked the Mac since boot, and is never copied off the device.

### Optional: derive from the master key

If you want the DEK reproducible across devices via the iCloud-synced [Identity master key](/identity-internals), Osaurus can derive it as `HKDF-SHA256(masterKey, salt, "osaurus-storage-v1")`. The salt is stored in the Keychain and in a sidecar file at `~/.osaurus/.storage-key.salt` so it travels with a manual restore. The salt alone is harmless without the master key.

### Rotation and reset

| Operation | Effect |
|---|---|
| Rotate | Generate a fresh key and re-key every database in place |
| Wipe cache | Clear the in-process key cache; the Keychain entry remains |
| Reset for wipe | Delete the Keychain key, salt, and sidecar. **Irreversible without the original key or a plaintext backup.** |

## Settings → Storage

Open the Management window (`⌘ ⇧ M`) → **Storage**. The panel reflects the **detected on-disk reality** (plaintext, encrypted, or mixed), not a flag guess.

- **Encrypt local data at rest** — the opt-in toggle, off by default. Turning it on shows a confirmation explaining the key-loss risk, then converts every database and attachment with progress. Turning it off runs the inverse.
- **Trade-offs panel** — a plain-language summary of the FileVault reliance and key-loss risk, including your machine's **live FileVault status**, so the recommendation reflects whether your disk is actually encrypted at rest.
- **Export plaintext backup** — writes a plaintext copy of every database, attachment, and config to a folder you pick. Decrypts on the way out in encrypted mode; copies as-is in plaintext mode. Never changes anything on disk. Use it **before** reinstalling macOS, migrating Macs, rotating the key, or wiping state.
- **Rotate storage key** — shown only in encrypted mode. Generates a fresh key and re-keys every database in place.
- **Stores needing attention** — appears only when a store failed to open this session. See [Recovery](#recovery).

## Background maintenance

A background actor runs SQLite housekeeping on every registered database, in either posture:

| Operation | Cadence | Why |
|---|---|---|
| `PRAGMA optimize` | Every 6 hours | Lets SQLite re-plan based on observed query patterns |
| `PRAGMA wal_checkpoint(TRUNCATE)` | Every 7 days | Bounds the size of the `-wal` sidecar |
| `VACUUM` | Every 30 days | Reclaims space after large deletes |

State persists in `~/.osaurus/.storage-maintenance.json` so the cadence survives restarts.

**Plugin databases are intentionally not registered** — with hundreds of installed plugins, a global maintenance pass would thrash IO. Plugin authors should run `PRAGMA wal_checkpoint` themselves on long-lived connections.

## Storage paths reference

| Path | Description |
|---|---|
| `~/.osaurus/.storage-encryption.json` | At-rest posture marker (always plaintext) |
| `~/.osaurus/.storage-maintenance.json` | Last `optimize` / `checkpoint` / `vacuum` timestamps |
| `~/.osaurus/.storage-key.salt` | HKDF salt sidecar (only present when the DEK is master-derived) |
| `~/.osaurus/quarantine/` | Unreadable stores moved here by Reset recovery (never deleted) |
| `~/.osaurus/billing/ledger.sqlite` | Router billing ledger |
| `~/.osaurus/chat-history/history.sqlite` | Chat database |
| `~/.osaurus/chat-history/blobs/{sha256}` | Spilled attachments (plaintext blob, or `.osec` when encrypted) |
| `~/.osaurus/memory/memory.sqlite` | Memory database |
| `~/.osaurus/memory/vectura/{agent}/` | Per-agent vector index (always plaintext) |
| `~/.osaurus/methods/methods.sqlite` | Methods catalog |
| `~/.osaurus/tool-index/tool_index.sqlite` | Tool index |
| `~/.osaurus/Tools/{plugin}/data/data.db` | Per-plugin database |
| `~/.osaurus/agents/{uuid}/db.sqlite` | Per-agent database — see [Agent DB](/agent-db) |
| `~/.osaurus/scheduler.sqlite` | Cross-agent next-run and pause slots |

Each database is SQLite by default, or SQLCipher when encryption is on. When encryption is on, the key lives in the macOS Keychain, **not** in `~/.osaurus/`.

## Limitations

- **The plaintext default relies on FileVault.** If FileVault is off, the raw disk and any backups of `~/.osaurus/` are readable. Turn on FileVault, or opt in to SQLCipher.
- **Encrypted mode is device-bound and key loss is unrecoverable.** The Keychain entry is not synced to iCloud and there is no escrow key. If the key is gone, encrypted stores can't be opened — Reset quarantines them and recreates empty stores. Export a plaintext backup before any risky migration.
- **Vector indexes are plaintext in both modes.** The index files under `~/.osaurus/memory/vectura/{agent}/` don't support pluggable encryption. They're rebuilt from the SQLite source on demand and leak some information (clustering, approximate counts) but no raw text.
- **Plugin database maintenance is per-plugin.** A misbehaving plugin that never commits a transaction can grow a large `-wal` file.

---

**Related:**

- [Security & Privacy](/security) — the plain-language overview
- [Identity Cryptography](/identity-internals) — master key, agent key derivation
- [Memory](/memory) — what lives in `memory.sqlite`
- [Server Settings](/configuration) — plaintext config files

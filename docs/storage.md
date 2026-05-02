---
title: Storage & Encryption
sidebar_label: Storage & Encryption
description: SQLCipher-encrypted databases, AES-GCM attachment spillover, the Keychain-backed key, the first-launch migration, and Settings → Storage.
---

# Storage & Encryption

Osaurus encrypts everything sensitive on disk — chats, memory, methods, tool indexes, plugin databases, and large attachments — with a per-device key kept in your macOS Keychain. Nothing leaves your Mac, and nothing is readable by another user account, by Spotlight, or by Time Machine snapshots without the same Keychain entry.

:::tip Looking for the user-friendly version?
This page is the technical reference. For a plain-language overview of how Osaurus protects your data — encryption, identity, sandbox, what we can't access — start at [Security & Privacy](/security).
:::

This page covers what's encrypted, how the key is managed, what happens during the first-launch migration, and the user-facing controls in **Settings → Storage**.

## TL;DR

- **On by default since 0.17.7.** First launch shows a brief "Securing your data" overlay, typical < 1s per database; nothing for new installs.
- **Key in Keychain.** A 32-byte symmetric key, scoped to your Mac account. Not synced to iCloud by default.
- **Recovery requires either the Keychain entry or a plaintext backup.** No escrow key — by design. Use **Settings → Storage → Export plaintext backup** before risky operations.

## What's encrypted

| Artifact | Mechanism | On-disk location |
|---|---|---|
| Chat history | SQLCipher | `~/.osaurus/chat-history/history.sqlite` |
| Memory (identity, pinned facts, episodes, transcript, FTS5 mirrors) | SQLCipher | `~/.osaurus/memory/memory.sqlite` |
| Methods catalog | SQLCipher | `~/.osaurus/methods/methods.sqlite` |
| Tool index | SQLCipher | `~/.osaurus/tool-index/tool_index.sqlite` |
| Per-plugin databases | SQLCipher | `~/.osaurus/Tools/{plugin}/data/data.db` |
| Large chat attachments | AES-GCM (`.osec`) | `~/.osaurus/chat-history/blobs/*.osec` |

**Attachment spillover.** Every `Attachment.image` or `Attachment.document` payload ≥ **16 KB** is hashed (SHA-256), encrypted (AES-GCM), and written to its own `.osec` file via `AttachmentBlobStore`. The chat row stores only `{ "ref": "<sha256>", ... }` — duplicates dedup automatically, and resaving a session no longer rewrites every attachment byte. Smaller payloads stay inline.

**Plaintext, by design.** A few artifacts deliberately stay plaintext:

- JSON config under `~/.osaurus/config/`, `agents/`, `themes/`, `providers/`, `schedules/`, `watchers/`, `skills/`. The 0.17.7 v1 migration step briefly encrypted these and broke any consumer that read them as JSON; the v2 step recovers them.
- Plugin manifests under `~/.osaurus/sandbox-plugins/`.
- Vector index files under `~/.osaurus/memory/vectura/{agent}/`. Rebuilt from the encrypted SQLite source on demand; see [Limitations](#limitations).

## Key management

The data-encryption key (DEK) is managed by `StorageKeyManager`.

### Storage

The DEK is a 32-byte raw `SymmetricKey` persisted as a Keychain generic password:

| Attribute | Value |
|---|---|
| `kSecAttrService` | `com.osaurus.storage` |
| `kSecAttrAccount` | `data-encryption-key` |
| Accessibility | `kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly` |

### Why not biometric

Unlike the Identity master key, the DEK is **not** wrapped behind Face/Touch ID. Every Osaurus launch — including background relaunches by `launchd`, Sparkle auto-updates, and watcher-driven wakeups — needs to open the encrypted databases without a user-facing prompt. `kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly` means the key is available any time you've unlocked the Mac at least once since boot, and is never copied off the device.

### Optional: derive from the master key

For users who want their DEK to be reproducible across devices via the iCloud-synced [Identity master key](/identity-internals), `StorageKeyManager.deriveFromMasterKey(context:)` replaces the Keychain entry with `HKDF-SHA256(masterKeyBytes, salt, "osaurus-storage-v1")`. The salt is persisted in two places:

- The Keychain (`com.osaurus.storage` / `data-encryption-salt`), bound to this device
- A sidecar file at `~/.osaurus/.storage-key.salt` so the salt travels with encrypted artifacts during a manual restore

The salt by itself is harmless without the master key (HKDF is one-way). The master key fetch triggers a one-time biometric prompt; the derived DEK is then cached and behaves identically to a generated one.

### Cache

The DEK is cached in-process behind an `os_unfair_lock`. The first `currentKey()` call performs the Keychain read (and HKDF derivation, if applicable); subsequent calls return the cached value without IO. `wipeCache()` zeroes the cached bytes — used during graceful shutdown and after key rotation.

### Rotation and reset

| Operation | Effect |
|---|---|
| `rotate()` | Generate a fresh CSPRNG key, persist to Keychain, return both old + new keys. Caller (the export service) is responsible for re-keying every database before unblocking the gate. |
| `install(key:)` | Replace the Keychain entry with a caller-provided key. Used inside `rotateStorageKey` so the rotation pipeline doesn't introduce a third key. |
| `wipeCache()` | Clear in-process cache only; Keychain entry remains. |
| `resetForWipe()` | Delete the Keychain key + salt + sidecar file and clear the cache. **Irreversible without the original key or a plaintext backup.** Used on explicit "wipe Osaurus state". |

## Migration

The migrator (`StorageMigrator`) is idempotent, version-stamped, and cross-process safe.

### Version history

| Target version | Steps |
|---|---|
| **v1** | SQLCipher-encrypt every SQLite database under `~/.osaurus/`. |
| **v2** | Restore any leftover `.osec` JSON files back to plaintext `.json`. v1 builds briefly encrypted JSON config too, but no consumer was wired to read `.osec`, which made `agents/`, `themes/`, and provider settings disappear from the UI. v2 walks the `~/.osaurus/` tree, decrypts each `.osec` JSON, and writes the plaintext sibling. v1 itself no longer encrypts JSON. |

The current target is **v2**. The version stamp lives in `~/.osaurus/.storage-version`; if the file is missing or older than the target, the migrator runs and bumps it.

### Cross-process safety

`runIfNeeded` acquires an exclusive `flock(2)` on `~/.osaurus/.storage-migration.lock` for the duration of the run. If two Osaurus processes launch simultaneously (e.g. app + CLI), the second blocks on the lock, then re-reads the version stamp once it acquires it and exits early because the first process already migrated.

### Backup

Originals are **moved** (not copied) into `~/.osaurus/.pre-encryption-backup/`. Both the encrypted and plaintext databases briefly exist on disk during the migration. The backup directory is auto-cleaned on the **second** launch after a successful migration. If the migration partially failed, the backup is kept until you resolve the issue from **Settings → Storage**.

### Launch sequence

```mermaid
sequenceDiagram
    participant App as AppDelegate
    participant Coord as StorageMigrationCoordinator
    participant Migr as StorageMigrator
    participant DB as Database singletons
    App->>Coord: blockingAwaitReady()
    Coord->>Migr: runIfNeeded()
    Migr->>Migr: flock + version check
    alt needs migration
        Migr->>Migr: load DEK
        Migr->>Migr: SQLCipher-export each DB
        Migr->>Migr: v1 to v2 JSON recovery
        Migr->>Migr: stamp .storage-version
    end
    Migr-->>Coord: outcome
    Coord-->>App: ready
    App->>DB: ChatHistory/Memory/Method/Tool open()
    DB->>DB: blockingAwaitReady() (defensive no-op)
```

Every `*Database.shared.open()` call site also calls `blockingAwaitReady()` defensively, so plugin loaders and HTTP handlers that race the AppDelegate can never open a still-plaintext file with an encryption key set.

## Settings → Storage

Open the Management window (`⌘ ⇧ M`) → **Storage**. The panel surfaces the migration outcome, lets you back up before risky operations, and recovers from key mismatches without losing data.

### Migration outcome card

Shows the most recent `StorageMigrator` run:

- Source and target version (e.g. `v0 → v2`)
- Per-database success / failure counts
- JSON files recovered by the v1→v2 step (only shown when non-zero)
- A pointer to `~/.osaurus/.pre-encryption-backup/` when a step failed, plus a hint to relaunch or export

### Export plaintext backup

Writes a tarball of every encrypted artifact in plaintext to a folder you pick (Downloads by default). Use this **before**:

- Reinstalling macOS or migrating to a new Mac without a Time Machine restore
- Rotating the storage key
- Manually wiping Osaurus state

Export does not delete or change anything on disk.

### Rotate storage key

Generates a fresh DEK and re-keys every registered database in place:

1. Confirmation alert (with a "Back up first" shortcut that runs the export)
2. `StorageMigrationCoordinator` flips `isMutating = true`, blocking new `blockingAwaitReady()` callers
3. Every registered handle is closed via `withAllHandlesQuiesced`
4. SQLCipher's `PRAGMA rekey` rewrites each database with the new key
5. `EncryptedFileStore` artifacts are re-wrapped
6. The new key is installed in the Keychain via `install(key:)`
7. Handles reopen, gate clears

The button is **disabled** when a core database fails the key-mismatch check — rotating in that state would destroy unreadable data.

### Key-mismatch warnings

If a database on disk was written with a different DEK than the one currently in Keychain (most often after a Time Machine restore or manual `~/.osaurus/` copy), the panel shows:

- **Loud red card** for any of the four core databases. Rotation is disabled; user is directed to restore the right Keychain entry or import the matching plaintext backup.
- **Quiet warning card** for plugin databases, with a **Show details** list and a **Clean up orphaned plugin data** button. Plugins whose backing DB can't be decrypted are usually leftovers from an uninstalled or replaced plugin; cleaning them up deletes only the unreadable files.

### Idle state

When everything is healthy, the panel shows a green "Encrypted" badge and a single line: *"All databases are encrypted with the current key."*

## Background maintenance

`StorageMaintenance` is a background actor that runs three SQLite housekeeping operations on every registered database:

| Operation | Default cadence | Why |
|---|---|---|
| `PRAGMA optimize` | every 6 hours | Lets SQLite re-plan based on observed query patterns |
| `PRAGMA wal_checkpoint(TRUNCATE)` | every 7 days | Bounds the size of the `-wal` sidecar |
| `VACUUM` | every 30 days | Reclaims space after large deletes (session purges, memory consolidation) |

State is persisted in `~/.osaurus/.storage-maintenance.json` so cadence survives restarts.

**Plugin databases are intentionally not registered.** With hundreds of installed plugins, a global maintenance pass would either thrash IO or queue forever. Plugin DBs are still SQLCipher-encrypted and still get migrated, but their lifecycle is owned by the plugin host. Plugin authors should run `PRAGMA wal_checkpoint` themselves on long-lived connections.

## Storage paths reference

| Path | Description |
|---|---|
| `~/.osaurus/.storage-version` | Current migration version stamp |
| `~/.osaurus/.storage-migration.lock` | Cross-process flock target during migration |
| `~/.osaurus/.storage-migration.json` | Last migration outcome receipt (rendered in Settings) |
| `~/.osaurus/.storage-maintenance.json` | Last `optimize` / `checkpoint` / `vacuum` timestamps |
| `~/.osaurus/.storage-key.salt` | HKDF salt sidecar (only present when DEK is master-derived) |
| `~/.osaurus/.pre-encryption-backup/` | Pre-migration originals; auto-cleaned on second launch after success |
| `~/.osaurus/chat-history/history.sqlite` | SQLCipher chat database |
| `~/.osaurus/chat-history/blobs/*.osec` | AES-GCM-encrypted spilled attachments |
| `~/.osaurus/memory/memory.sqlite` | SQLCipher memory database |
| `~/.osaurus/memory/vectura/{agent}/` | Per-agent VecturaKit vector index (plaintext) |
| `~/.osaurus/methods/methods.sqlite` | SQLCipher methods catalog |
| `~/.osaurus/tool-index/tool_index.sqlite` | SQLCipher tool index |
| `~/.osaurus/Tools/{plugin}/data/data.db` | Per-plugin SQLCipher database |

The DEK lives in macOS Keychain, **not** in `~/.osaurus/`.

## Limitations

- **`kdf_iter = 256000`.** SQLCipher's PBKDF2 round count is fixed at the SQLCipher 4 default. Lowering it would make opens faster (especially on large plugin sets) but would require re-keying every database, since `kdf_iter` is part of the file format. Osaurus uses a CSPRNG key, so the PBKDF2 work is largely wasted overhead — but the safer, slower default stays until a future migration deliberately changes it.
- **Device-bound by default.** The Keychain entry is `kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly` and is **not** synced to iCloud. If you wipe the Keychain, restore a different `~/.osaurus/` than the one your Keychain was paired with, or migrate to a new Mac without a Time Machine restore, you need a plaintext backup to recover. Use **Settings → Storage → Export plaintext backup** before any of these.
- **VecturaKit indexes are plaintext.** The on-disk vector index files under `~/.osaurus/memory/vectura/{agent}/` are written by VecturaKit, which doesn't yet support pluggable storage encryption. The migration wipes them and triggers `MemorySearchService.shared.rebuildIndex()`, which re-embeds from the encrypted SQLite source. The vectors leak some information (clustering, approximate counts) but no raw text. Wrapping these via `EncryptedVecturaStorage` is tracked as a follow-up.
- **Plugin database maintenance is per-plugin.** Skipping global `StorageMaintenance` registration means plugin DBs can grow large `-wal` files if a misbehaving plugin opens a transaction it never commits.
- **Recovery requires either the Keychain entry or a plaintext backup.** This is by design — there's no escrow key.

---

**Related:**

- [Identity Cryptography](/identity-internals) — master key, agent key derivation, App Attest
- [Memory](/memory) — what's encrypted in `memory.sqlite`
- [Server Settings](/configuration) — plaintext config files

---
title: Identity Cryptography
sidebar_label: Identity Cryptography
description: secp256k1 master keys, deterministic agent key derivation, App Attest device assertion, the osk-v1 access-key spec, agent invites, osl-v1 website logins, and the request-signing protocol.
---

# Identity Cryptography

This page is for developers and security reviewers who want the exact cryptography behind an [Osaurus ID](/identity).

The Osaurus ID system gives every participant — human, agent, device — a cryptographic address. All actions are signed and verifiable, enabling trust without a central authority at runtime.

This page is the spec reference. For the everyday view (creating access keys, the recovery phrase, revoking), see [Osaurus ID](/identity).

## Theory and motivation

AI agents that communicate — internally within an application, or externally with other services and agents — need a trust mechanism. Traditional approaches rely on centralized session tokens or API keys that a server issues and validates. This creates a single point of failure and requires the central authority to be online for every interaction.

Osaurus takes a different approach: **address-based identity**. Every participant derives a cryptographic keypair and is identified by the address of its public key. When an agent signs a message, any verifier can confirm the signature came from that address without contacting a server. Authority flows from a human-controlled root key down to agents, and from there to devices — forming a verifiable chain of trust.

**Design goals:**

1. **Self-identifying** — Every agent carries its own address. No lookup table or registry needed.
2. **Verifiable** — Signatures can be checked by anyone holding the public address. No callbacks to a central authority.
3. **Hierarchical** — Authority flows from human (master) to agent to device, with clear delegation boundaries.
4. **Offline-capable** — Agents can prove their identity without network access to an identity server.
5. **Revocable** — Compromised keys can be revoked at any level without replacing the entire identity tree.

## Address hierarchy

```
Master Address (Human)            ← iCloud Keychain / 24-word phrase; same on every device
├── Device A (device ID a1b2c3d4)
│   ├── Agent Address v2 (scope a1b2c3d4, index 0)
│   ├── Agent Address v2 (scope a1b2c3d4, index 1)
│   └── ...
├── Device B (device ID c3d4e5f6)
│   ├── Agent Address v2 (scope c3d4e5f6, index 0)
│   └── ...
└── Legacy Agent Address v1 (index n)   ← minted before device scoping; master-global
```

The master is shared by every device that holds the same identity. Each device has its own hardware-bound device ID, and every agent address minted on that device is derived from `(master, deviceID, index)`. Two Macs (or a Mac and a phone) restored from the same phrase therefore mint **disjoint** agent addresses even when both allocate index 0 — no cross-device index coordination is needed. Ownership is still provable from the master alone: any device holding the master can re-derive and sign for any of its agents given the stored `(deviceScope, index)` path.

### Master address

The human's root identity. All authority flows from this address.

| Property | Detail |
|---|---|
| Curve | secp256k1 |
| Storage | iCloud Keychain (syncs across Apple devices) |
| Access | Requires biometric authentication (Face ID / Touch ID) |
| Format | Checksummed hex address (EIP-55 style), e.g. `0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18` |

The master key is a 32-byte random secret generated via `SecRandomCopyBytes`. Stored once in the Keychain and never exported. The address is derived from the corresponding secp256k1 public key via Keccak-256 hashing.

### Agent addresses

Each agent gets a deterministic child key derived from the master key.

| Property | Detail |
|---|---|
| Derivation | HMAC-SHA512 with domain separation; v2 additionally binds the minting device's ID |
| Storage | **Never stored** — re-derived on demand from the master key |
| Association | Each agent's `agentIndex`, `agentDeviceScope` (nil for legacy v1), and `agentAddress` are persisted on the `Agent` model. Together the first two form the agent's `AgentKeyPath`, which every derivation and signing site takes. |

Agent addresses enable per-agent scoping: an access key signed by an agent can only authorize actions for that specific agent.

| Operation | Effect |
|---|---|
| **Assign** | Allocates the next unused index under this device's scope (v2) and persists the derived address plus `agentDeviceScope`. No-op if the agent already has one. |
| **Rotate Key** | Allocates a fresh unused v2 path, re-derives a new address, and revokes every active `osk-v1` key whose audience matched the previous address. Paths are never reused. Rotating a legacy v1 agent moves it to v2. The rotation propagates everywhere the old address was pinned: the HTTP server restarts with the new validator, the relay tunnel removes the old address and adds the new one, every workspace share is re-issued (share first, then unshare), and owner-device key records are dropped. |
| **Revoke** | Clears the agent's address, index, and device scope, and revokes every active `osk-v1` key scoped to it. The agent's prompt and settings stay intact. |

Existing v1 agents keep their addresses — nothing about pairings, shares, or access keys changes on upgrade. New and rotated addresses are always v2.

### Device ID

A hardware-bound identity that proves which physical device is making a request.

| Property | Detail |
|---|---|
| Hardware | Apple App Attest (Secure Enclave P-256 key) |
| Format | 8-character hex string derived from the attestation key ID |
| Fallback | Software-generated random ID when App Attest is unavailable (development builds) |

The device ID adds a second authentication factor: even if someone obtains a valid identity signature, they cannot forge the device assertion without physical access to the Secure Enclave.

The device ID is a **device fact, not an identity fact**. It's attested independently of master creation: setup, loading an existing identity, and restoring from the phrase all ensure the device is attested, returning the existing ID or attesting a new one but never replacing one that exists. A device that received the master through iCloud Keychain sync or a phrase restore is therefore attested on first load. **Reset Identity** and **Recover from phrase** replace the master but keep the device ID.

## Key derivation

### Master key

```
32 random bytes (SecRandomCopyBytes)
    → secp256k1 private key
    → uncompressed public key (drop 0x04 prefix)
    → Keccak-256 hash
    → last 20 bytes
    → checksummed hex address (EIP-55)
```

Stored in iCloud Keychain with `kSecAttrAccessibleWhenUnlocked`. iCloud sync is attempted first; if unavailable, stored device-only with `kSecAttrAccessibleWhenUnlockedThisDeviceOnly`.

A phone or second device can't yet receive the master through iCloud Keychain: that would require a shared Keychain access group, which needs a provisioning-profile entitlement the Developer ID build doesn't ship with. Until that lands, the **24-word recovery phrase** is the only way to bootstrap the same identity on a client with a different bundle ID. See [Devices & Sync](/devices) for how an iPhone joins instead.

### Agent key

Two derivations exist. Which one applies is decided by the agent's stored `AgentKeyPath`: `deviceScope == nil` → v1, otherwise v2.

**v2 (device-scoped — everything minted or rotated now):**

```
HMAC-SHA512(
    key:  masterKey,                                                  // 32 bytes
    data: "osaurus-agent-v2" || utf8(deviceScope) || 0x00 || bigEndian(index)
)
    → first 32 bytes of HMAC output
    → same address derivation as master key
```

`deviceScope` is the minting device's device ID. The `0x00` terminator makes the variable-length scope unambiguous against the index. Different devices under the same master produce disjoint address spaces.

**v1 (legacy, master-global — agents minted before device scoping):**

```
HMAC-SHA512(
    key:  masterKey,                          // 32 bytes
    data: "osaurus-agent-v1" || bigEndian(index)  // domain + 4-byte index
)
    → first 32 bytes of HMAC output
    → same address derivation as master key
```

The distinct domain prefixes (`osaurus-agent-v1` / `osaurus-agent-v2`) prevent cross-protocol and cross-version key reuse: a v2 address at index 0 is unrelated to the v1 address at index 0. The big-endian index encoding ensures a canonical byte representation across platforms. Each unique path produces a completely independent keypair.

No wire format carries an index or scope — `osk-v1` keys, invites, workspace rosters, relay auth frames, and Secure Channel hellos all pin an *address + signature*.

### Connect identity

Each Mac also derives one **connect identity** for its paired phone:

```
HMAC-SHA512(
    key:  masterKey,
    data: "osaurus-connect-v1" || utf8(deviceId) || 0x00   // empty deviceId without one
)
    → first 32 bytes of HMAC output
    → same address derivation as master key
```

It isn't an agent key and isn't stored on any agent. It exists so a phone paired to a Mac with no custom agents still has an address to pin, since the built-in Default agent has none; the pairing payload carries it under the built-in agent only in that case. Only `POST /secure/session` accepts it; the relay, access keys, and invites never see it. Its own domain prefix keeps it apart from every agent key at every index. Once read, its address is cached so handshakes for other addresses skip the Keychain; when the master key can't be read, handshakes get `503` rather than a pin-dropping `404`.

Agent keys are **never persisted**. They are re-derived from the master key whenever a signature is needed, which requires biometric authentication to access the master key. The derived `agentAddress` is persisted on the `Agent` model so it can be displayed without triggering biometric prompts.

### Device key

- **Hardware path:** `DCAppAttestService.generateKey()` creates a P-256 key in the Secure Enclave. The key ID is hashed with SHA-256 and truncated to 4 bytes (8 hex characters) for the device ID.
- **Software fallback:** 4 random bytes via `SecRandomCopyBytes`, stored in `UserDefaults` for stability across launches.

## Two-layer request signing

Every authenticated API request carries a two-layer signed token. This binds each request to both a cryptographic identity and a physical device.

### Token structure

```
header.payload.accountSignature.deviceAssertion
```

Four base64url-encoded segments joined by `.`:

| Segment | Encoding | Content |
|---|---|---|
| Header | base64url(JSON) | Algorithm, type, version |
| Payload | base64url(JSON) | Claims (see below) |
| Identity Signature | hex | secp256k1 recoverable signature (65 bytes) |
| Device Assertion | base64url | App Attest assertion (or empty for software fallback) |

### Header

```json
{
  "alg": "es256k+apple-attest",
  "typ": "osaurus-id",
  "ver": 5
}
```

### Payload fields

| Field | Type | Description |
|---|---|---|
| `iss` | string | Issuer address (master or agent) |
| `dev` | string | Device ID (8-char hex) |
| `cnt` | uint64 | Monotonic counter (anti-replay) |
| `iat` | int | Issued-at timestamp (Unix seconds) |
| `exp` | int | Expiration timestamp (Unix seconds, typically iat + 60) |
| `aud` | string | Audience (target service hostname) |
| `act` | string | Action being authorized (e.g. `"GET /v1/models"`) |
| `par` | string? | Parent address (for agent-issued tokens, the master address) |
| `idx` | uint32? | Agent index (for agent-issued tokens) |

### Signing process

1. **Encode payload** as JSON
2. **Layer 1 — Identity signature:** Domain-separated secp256k1 signing
   - Envelope: `\x19Osaurus Signed Message:\n<length><payload>` — the decimal byte length of the payload sits between the newline and the payload bytes (Ethereum-style)
   - Hash: Keccak-256 of the envelope
   - Sign: secp256k1 with recovery (produces 65 bytes: r ‖ s ‖ v)
3. **Layer 2 — Device assertion:** App Attest assertion over SHA-256 of the payload
4. **Assemble:** `base64url(header).base64url(payload).hex(accountSig).base64url(deviceAssertion)`

The domain prefix `Osaurus Signed Message` prevents signed payloads from being replayed in other protocols that use the same curve.

## Access keys (`osk-v1`)

Access keys are portable, long-lived tokens for external authentication. They allow tools, MCP clients, and remote agents to authenticate against Osaurus without biometric access to the device.

### Format

```
osk-v1.<base64url-encoded-payload>.<hex-encoded-signature>
```

Three parts separated by `.`:

1. **Prefix:** `osk-v1` (identifies the token format and version)
2. **Payload:** Base64url-encoded canonical JSON
3. **Signature:** Hex-encoded 65-byte secp256k1 recoverable signature

### Payload fields

| Field | Type | Description |
|---|---|---|
| `aud` | OsaurusID | Audience address (who this key is for) |
| `cnt` | uint64 | Counter value at creation time |
| `exp` | int? | Expiration timestamp (null = never expires) |
| `iat` | int | Issued-at timestamp |
| `iss` | OsaurusID | Issuer address (who signed this key) |
| `lbl` | string? | Human-readable label |
| `nonce` | string | Unique identifier for revocation |

Fields are sorted alphabetically for canonical JSON encoding (ensuring consistent signature verification).

### Scoping

- **Master-scoped:** Signed by the master key. `iss` and `aud` are both the master address. Grants access to all agents.
- **Agent-scoped:** Signed by a derived agent key. `iss` and `aud` are both the agent address. Grants access only to that specific agent.

Agent invites redeemed on `POST /pair-invite` always issue **agent-scoped** keys (signed along the invited agent's `AgentKeyPath`). Keys generated manually from Settings depend on where you create them: **Settings → Server → Access Keys** mints master-scoped keys, and an agent's access-key list under **Settings → Osaurus ID → Agent Addresses** mints agent-scoped keys.

### Expiration options

| Option | Duration |
|---|---|
| `30d` | 30 days |
| `90d` | 90 days (default for invites and owner-device keys) |
| `1y` | 1 year |
| `never` | No expiration (only when the user explicitly chooses it) |

### Validation

When a request arrives with an `osk-v1` token:

1. **Parse** the three segments (prefix, payload, signature)
2. **Decode** the base64url payload into `AccessKeyPayload`
3. **Recover** the signer address via `ecrecover` with `Osaurus Signed Access` domain prefix
4. **Verify issuer** — recovered address must match `payload.iss`
5. **Check audience** — `payload.aud` must match the agent or master address
6. **Check whitelist** — `payload.iss` must be in the effective whitelist
7. **Check revocation** — not individually revoked (address + nonce) and not bulk-revoked (counter threshold)
8. **Check expiration** — `payload.exp` must be in the future (if set)

Only metadata is stored after key creation (label, prefix, nonce, counter, addresses, dates). The full key string is shown once and never persisted.

## Whitelist system

The whitelist controls which addresses are authorized to issue access keys. It operates at two levels:

### Master-level whitelist

Addresses in the master whitelist can issue keys for any agent.

### Per-agent overrides

Additional addresses can be authorized for specific agents only. These are additive — they extend the master whitelist, not replace it.

### Effective whitelist

The effective whitelist for a given agent is computed as:

```
effective = masterWhitelist ∪ agentWhitelist[agent] ∪ {agentAddress, masterAddress}
```

The agent's own address and the master address are always implicitly included.

### Storage

Whitelist data is persisted in macOS Keychain (`kSecAttrAccessibleWhenUnlockedThisDeviceOnly`), keyed by `com.osaurus.whitelist`.

## Revocation

Access keys can be revoked through two mechanisms:

### Individual revocation

Revoke a specific key by its `(address, nonce)` pair. The composite key `address:nonce` is added to the revocation set.

### Bulk revocation

Revoke all keys from an address with counter values at or below a threshold. Implemented as a counter threshold per address — any key with `cnt <= threshold` is revoked.

When checking revocation:

```
isRevoked = revokedKeys.contains(address:nonce)
         || (counterThresholds[address] >= cnt)
```

### Storage

Revocation data is persisted in macOS Keychain (`kSecAttrAccessibleWhenUnlockedThisDeviceOnly`), keyed by `com.osaurus.revocations`.

## Recovery

The local restore path is a **24-word BIP39 mnemonic** that round-trips the 32-byte master key's entropy:

- **Encode:** 256 bits of entropy + the high 8 bits of `SHA-256(entropy)` as checksum = 264 bits = 24 × 11-bit indices into the canonical English BIP39 wordlist (2048 words)
- **View:** **Settings → Osaurus ID → Master Address → View recovery phrase** (the phrase is cached in the Keychain via `MasterMnemonicStore`, or derived on demand from the master key)
- **Restore:** **Settings → Osaurus ID → Danger Zone → Restore From Recovery Phrase** — validates the checksum, re-installs the master key into the Keychain, and existing agents and access keys start working again

### What the phrase does and doesn't recover

The phrase rebuilds the **master** only. Agent addresses are re-derived from the master plus each agent's stored key path:

| Layout | Path | Recoverable from the phrase **alone**? | From the phrase **plus the Agent record**? |
|---|---|---|---|
| v1 (legacy) | `index` | Effectively yes — the index space is small enough to scan for a known address | Yes |
| v2 (device-scoped) | `(deviceScope, index)` | **No** — the scope is an opaque 8-hex device ID that exists only on the `Agent` record | Yes |

The path lives in the agent JSON on disk (`~/.osaurus/agents/<id>.json`) and anything that copies it — Time Machine, or an exported `.osaurus-agent` bundle. It is **not** in the Workspaces roster, which carries only the address, name, description, and proof. This is the price of collision-free addresses across devices: keep agent exports or a `~/.osaurus` backup alongside the phrase.

### Identity drift and scope repair

The Osaurus ID page checks persisted derivatives against the current master and surfaces a banner when agent addresses or access keys reference a previous master. Each agent is checked against **its own** derivation (v1 or v2), so a legacy agent isn't flagged just because the v2 derivation at the same index differs.

If an older build re-saved a v2 agent without its `agentDeviceScope`, but the v2 derivation under *this* device's scope reproduces the stored address exactly, the scope is written back automatically — no address, index, or key changes — and the view reports "Restored the device scope for N agent address(es) saved by an older version. No keys were changed." A dropped scope diagnosed on a *different* device stays flagged, since nothing lossless can be done there.

Separately, `RecoveryManager` generates a one-shot `OSAURUS-XXXX-XXXX-XXXX-XXXX` code (8 random bytes from `SecRandomCopyBytes`) intended as a **server-side claim token** for a future flow. It is not shown in the current UI and **cannot** rebuild the local master key — only the mnemonic can.

## Internal vs external communication

### Internal communication

Agents within the same Osaurus instance authenticate using the full two-layer token system:

- **Layer 1:** secp256k1 identity signature (master or agent key)
- **Layer 2:** App Attest device assertion

Strongest authentication: both the cryptographic identity and the physical device are verified. Requires biometric access to the master key.

### External communication

External tools, MCP clients, and remote agents authenticate using `osk-v1` access keys:

- Single-layer: secp256k1 signature only (no device assertion)
- Portable: usable from any device or service
- Scopable: master-scoped (all agents) or agent-scoped (single agent)
- Revocable: individual or bulk revocation without affecting other keys

Access keys bridge the gap between hardware-bound internal identity and the need for third-party integrations that can't access the Secure Enclave.

### Agent invites (`POST /pair-invite`)

Sharing one agent with another person or device goes through a signed, single-use `AgentInvite`, handed out as a deeplink and redeemed over the agent's [relay](/remote-access) tunnel:

1. The owner's Mac pre-approves the invite at generation time and signs it with that **agent's own derived key** (domain prefix `Osaurus Signed Invite`). It names the agent's address (`addr`) and carries a nonce.
2. The receiver's app posts the invite to `<relay url>/pair-invite` with a fresh X25519 `encPub`.
3. The host recovers the signer, requires it to equal `addr`, checks the invite hasn't been used, consumes the nonce, and mints an **agent-scoped** `osk-v1` key for that agent with a 90-day default expiry.
4. The key is **HPKE-sealed** (X25519 + HKDF-SHA256 + ChaCha20-Poly1305) to `encPub`, with the agent address and nonce bound into the HPKE `info`. The relay terminates TLS and is untrusted by design, so it never sees the key in plaintext.

The route is unauthenticated, capped at 64 KiB, and rate-limited per source IP (`PairingRateLimiter`). The response body containing the key is sent on the wire but **never persisted to the request log**: `InsightsService.redactCredentials` scrubs `osk-v1` values and `Bearer osk-…` headers across every logged body.

### LAN pairing (retired)

Osaurus no longer advertises agents over Bonjour (`_osaurus._tcp`), and the LAN `GET /pair/challenge` + `POST /pair` flow is gone: both routes return `404` (or `401` from the auth gate for a non-loopback caller). Your own Macs and iPhone reach each other through [Devices & Sync](/devices); other people use invites and [Workspaces](/workspaces). Keys the old flow minted stay valid until they expire (90 days) or are revoked.

Pairings approved before the agent-scoping fix are master-scoped, never-expiring keys. **Settings → Server** labels them **Legacy** and explains: *"Pre-upgrade pairing — grants access to all agents and never expires."* Revoke them to tighten access.

### Phone pairing (until Sync)

An older iPhone app pairs through a 6-digit code: a SPAKE2 (RFC 9382) exchange over secp256k1 keyed by the code (`POST /pair/code`, then `POST /pair/confirm`), so the code never travels and a swapped share fails confirmation. The phone's key covers every agent on the Mac. These routes stay open for one release, under **Settings → Devices → Mobile**. Once an iPhone has joined the Sync account (`MobileConnectMigration.isRetired`), `/pair/hello`, `/pair/code`, `/pair/confirm`, and `/pair/unpair` answer `410` with `update_required`.

### Owner redeem (same identity, another device)

A device holding the *same* master — a second Mac restored from the phrase, or a phone — can obtain an agent-scoped key for an agent hosted on this Mac without a workspace, router attestation, or invite. It's an `owner_redeem` envelope on `POST /pair-invite`:

1. **Challenge.** The client sends `agent_address`, `device_id`, and an optional `device_name`. The host returns a single-use nonce (120 s TTL) bound to `(agent_address, device_id)` without revealing whether the agent exists. One outstanding challenge per pair (asking again replaces it) under a hard table cap, so unauthenticated step-one traffic can't grow the table.
2. **Prove the master.** The client sends the nonce, a fresh X25519 `encPub` (required — validated before the nonce is consumed), and an EIP-191 **master** signature over `osaurus-owner:redeem:<agent_address_lower>:<nonce>`. The signature must recover to this host's own master address.
3. **Mint and seal.** The agent must be hosted here (`404` otherwise) and must not be built-in (`403`). The host mints an `osk-v1` key labelled `Owner device – <device_name>` with a 90-day expiry, HPKE-seals it to `encPub` — it is never returned in plaintext — and records it in `~/.osaurus/identity/owner-devices.json`.

There's one live key per `(device, agent)`; re-redeeming replaces the previous key. The key appears in the agent's key list and can be revoked like any other, and rotating the agent's key revokes them all.

### Pre-auth body limits

Both Osaurus HTTP servers reject oversized request bodies before the auth gate runs, so an unauthenticated client cannot exhaust host memory:

| Endpoint | Limit | Configurable via |
|---|---|---|
| `POST /pair-invite`, `/secure/session`, `/pair/code`, `/pair/confirm` | 64 KiB | `ServerConfiguration.maxPairingBodyBytes` |
| Other public HTTP routes | 32 MiB | `ServerConfiguration.maxRequestBodyBytes` |
| Sandbox host bridge | 8 MiB | hard-coded in `HostAPIBridgeHandler` |

Both servers enforce the cap with a `Content-Length` pre-check at request head and a streaming guard at body chunks, so chunked clients and clients that lie about their declared length both hit `413 Payload Too Large`.

### Future: cross-instance communication

The address-based design naturally extends to agent-to-agent communication across different Osaurus instances. Since every agent has a globally unique address and can sign messages, agents can verify each other's identity without a shared authority — only knowledge of the other agent's address is needed.

## Log in with Osaurus (`osl-v1`)

First-party websites (`https://store.osaurus.ai`, `https://osaurus.ai`, `https://www.osaurus.ai`) can sign someone in with their master address, with no Osaurus login server:

1. The site opens `osaurus://auth/authorize?client_id=<origin>&redirect_uri=<url>&state=…&nonce=…`.
2. Osaurus refuses origins not on its built-in allowlist, then shows a consent panel naming the origin. On **Continue**, it asks for Touch ID or the login password with a fresh `LAContext` and no reuse window.
3. The master key signs an `osl-v1` assertion: base64url JSON with `typ`, `ver`, `iss` (the lowercase master address), `aud` (the origin), `redirect_uri`, `nonce`, `iat`, `exp` (`iat + 300`), `jti`, and optional `osaurus_id` and `dev`. The signature is EIP-191 `personal_sign` over `osaurus-login-v1.<payload>`, so any Ethereum library verifies it. The key is zeroed after signing.
4. Osaurus opens `redirect_uri` in the default browser with `assertion` and `state` in the fragment. The site verifies the signature and claims and consumes the nonce once.

The `osaurus-login-v1.` message prefix keeps logins disjoint from every other EIP-191 message the master key signs (`osaurus-workflow:`, `osaurus-credits:`, `osaurus-owner:redeem:`). Recent sign-ins are listed under **Settings → Osaurus ID → Sign In with Osaurus**. The full relying-party flow is on [Log in with Osaurus](/login-with-osaurus).

## Security properties

| Property | Mechanism |
|---|---|
| Master key never leaves Keychain | Stored with `kSecAttrAccessibleWhenUnlocked`, read requires `LAContext` biometric auth |
| Agent keys never stored | Re-derived on demand via HMAC-SHA512 from master key |
| Multi-device: unique addresses | v2 derivation binds the minting device's ID, so devices sharing one master mint disjoint agent addresses with no coordination |
| Multi-device: same identity everywhere | Master syncs via iCloud Keychain or phrase; device attestation is ensured on load/restore, never gated on master creation |
| Owner-device access | `owner_redeem` requires a fresh master signature over a single-use, device-bound nonce; keys are HPKE-sealed, 90-day, agent-scoped, and never issued for built-in agents |
| Device keys hardware-bound | Secure Enclave P-256 via App Attest (`DCAppAttestService`) |
| Anti-replay | The two-layer identity token carries a per-device monotonic counter (`cnt`); on access keys, `cnt` is recorded at creation for bulk revocation. Routine `osk-v1` Bearer auth does not use a per-request counter — replay protection over the network comes from the [Secure Channel](/secure-channel) sequence numbers |
| Domain separation | `Osaurus Signed Message`, `Osaurus Signed Access`, `Osaurus Signed Invite`, and `Osaurus Secure Channel` prefixes prevent cross-protocol signature reuse; EIP-191 messages carry unique leading tags (`osaurus-login-v1.`, `osaurus-workflow:`, `osaurus-credits:`, `osaurus-owner:redeem:`) |
| Website logins need user presence | A consent panel, then a fresh `LAContext.evaluatePolicy` (no reuse window), before the master key signs an origin-bound, single-use, 5-minute `osl-v1` assertion; only allowlisted first-party origins can ask |
| Recovery phrase | 24-word BIP39 mnemonic of the master key; viewable behind biometrics, restorable on a new Mac |
| Canonical encoding | Access key payloads use sorted-key JSON for deterministic signature verification |
| Memory safety | Master key bytes are zeroed after use (`memset` / index-level zeroing) |
| Invites scoped to one agent | `/pair-invite` mints agent-scoped keys (signed along the invited agent's key path), 90-day default expiry |
| Minted keys sealed in transit | `/pair-invite` and `/pair/code` HPKE-seal the fresh `osk-v1` key to the connector's ephemeral public key |
| Pairing endpoints rate-limited | `PairingRateLimiter` caps `/pair/code`, `/pair/confirm`, and `/pair-invite` per source IP, with a cooldown after a wrong code or denial; `/secure/session` has its own instance |
| Issued credentials never logged | `/pair/code` and `/pair-invite` log redacted bodies; `InsightsService.redactCredentials` scrubs `osk-v1` values and `Bearer` headers everywhere |
| Pre-auth body-size limits | Pairing and invite routes capped at 64 KiB, other routes at 32 MiB; rejected with `413` before the auth gate |

## File reference

| File | Responsibility |
|---|---|
| `MasterKey.swift` | Generate, store, read, sign with the secp256k1 master key in iCloud Keychain |
| `AgentKey.swift` | Deterministic child key derivation (HMAC-SHA512, v1 master-global and v2 device-scoped), `AgentKeyPath`, and signing for per-agent identities |
| `Services/MobileConnect/MobileConnectIdentity.swift` | The Mac's connect identity for the paired phone (`osaurus-connect-v1`) |
| `Services/MobileConnect/MobileConnectMigration.swift` | Retires the 6-digit phone pairing routes once an iPhone joins Sync |
| `PairingSPAKE2.swift` | SPAKE2 pairing exchange with the older iPhone app |
| `PairingRateLimiter.swift` | Per-source-IP rate limiting and denial cooldown for the unauthenticated pairing and invite routes |
| `PairingKeyEnvelope.swift` | HPKE sealing of freshly minted keys to the connector's ephemeral public key |
| `Models/Agent/AgentInvite.swift` | Signed, single-use agent invite redeemed on `/pair-invite` |
| `Services/Auth/LoginWithOsaurus/` | Log in with Osaurus: request validation and origin allowlist, `osl-v1` assertion signing, the Touch ID gate, the consent panel, and sign-in history |
| `IdentityHealthCheck.swift` | Classifies persisted derivatives as healthy / mismatched / recoverable-scope against the current master |
| `OwnerDeviceAccessHost.swift` | `owner_redeem` on `/pair-invite`: challenge table, master-signature verification, built-in guard, key mint + HPKE seal, per-device key records |
| `DeviceKey.swift` | App Attest key generation, attestation, assertion, and software fallback |
| `OsaurusIdentity.swift` | Public entry point — orchestrates setup and two-layer request signing |
| `IdentityModels.swift` | Data types: `OsaurusID`, `TokenHeader`, `TokenPayload`, `AccessKeyPayload`, `AccessKeyInfo`, `AgentInfo`, `RevocationSnapshot` |
| `APIKeyManager.swift` | Generate, persist, and revoke `osk-v1` access keys (metadata in Keychain) |
| `APIKeyValidator.swift` | Immutable, lock-free access key validation via ecrecover + whitelist + revocation |
| `WhitelistStore.swift` | Master-level and per-agent address whitelist with Keychain persistence |
| `RevocationStore.swift` | Individual and bulk access key revocation with Keychain persistence |
| `CounterStore.swift` | Per-device monotonic counter in `UserDefaults` |
| `MasterKeyMnemonic.swift` | BIP39 24-word mnemonic encode/decode of the master key |
| `MasterMnemonicStore.swift` | Keychain item for the 24-word phrase, same service as the master |
| `RecoveryManager.swift` | One-shot server-side claim-token generation (not the local restore path) |
| `CryptoHelpers.swift` | Keccak-256, domain-separated signing, ecrecover, address derivation, encoding utilities |
| `OsaurusIdentityError.swift` | Error types for the identity system |

---

**Related:**

- [Osaurus ID](/identity) — the everyday view
- [Devices & Sync](/devices) — how your own Macs and iPhone join
- [Log in with Osaurus](/login-with-osaurus) — the website sign-in flow
- [Storage & Encryption](/storage) — how the storage DEK can optionally be derived from the master key
- [Remote Access](/remote-access) — uses the agent's signature to authenticate the relay tunnel
- [HTTP API](/api) — using `osk-v1` from clients

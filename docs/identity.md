---
title: Identity
sidebar_label: Identity
description: Cryptographic identity for humans, agents, and devices — address-based authentication with verifiable signatures and no central authority
---

# Identity

Every participant in Osaurus — human, agent, and device — gets a cryptographic address. All actions are signed and verifiable, enabling trust without a central authority at runtime.

Authority flows from a human-controlled root key down to agents, and from agents to devices, forming a verifiable chain of trust. Agents can prove their identity offline, and compromised keys can be revoked at any level without replacing the entire identity tree.

## Getting Started

1. Open the Management window (**⌘⇧M**) → **Identity**
2. On first launch, Osaurus generates your **master key** — a secp256k1 keypair stored in iCloud Keychain, protected by biometric authentication (Face ID / Touch ID)
3. A one-time **recovery code** is displayed — save it somewhere safe, it is shown only once
4. Each agent you create automatically gets a deterministic **agent address** derived from your master key

## Address Hierarchy

The identity system has three tiers, each serving a distinct role:

```
Master Address (Human)
├── Agent Address (index 0)
├── Agent Address (index 1)
├── Agent Address (index 2)
│   ...
└── Device ID (per physical device)
```

### Master Address

The human's root identity. All authority in the system flows from this address.

| Property | Detail |
| -------- | ------ |
| **Curve** | secp256k1 |
| **Storage** | iCloud Keychain (syncs across Apple devices) |
| **Access** | Requires biometric authentication (Face ID / Touch ID) |
| **Format** | Checksummed hex address (EIP-55 style), e.g. `0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18` |

The master key is a 32-byte random secret generated via `SecRandomCopyBytes`. It is stored once in the Keychain and never exported.

### Agent Addresses

Each agent gets a deterministic child key derived from the master key. Agents can sign messages on their own behalf, but their authority always traces back to the master address.

| Property | Detail |
| -------- | ------ |
| **Derivation** | HMAC-SHA512 with domain separation |
| **Storage** | Never stored — re-derived on demand from the master key |
| **Association** | Each agent's `agentIndex` and `agentAddress` are persisted on the Agent model |

Agent addresses enable per-agent scoping: an access key signed by an agent can only authorize actions for that specific agent, not the entire identity.

### Device ID

A hardware-bound identity that proves which physical device is making a request.

| Property | Detail |
| -------- | ------ |
| **Hardware** | Apple App Attest (Secure Enclave P-256 key) |
| **Format** | 8-character hex string derived from the attestation key ID |
| **Fallback** | Software-generated random ID when App Attest is unavailable (development builds) |

The device ID adds a second authentication factor: even if someone obtains a valid identity signature, they cannot forge the device assertion without physical access to the Secure Enclave.

---

## Access Keys

Access keys (`osk-v1`) are portable, long-lived tokens for external authentication. They allow tools, MCP clients, and remote agents to authenticate against Osaurus without biometric access to the device.

### Creating an Access Key

1. Open the Management window (**⌘⇧M**) → **Identity**
2. Select **Create Access Key**
3. Choose the scope:
   - **Master-scoped** — grants access to all agents
   - **Agent-scoped** — grants access to a specific agent only
4. Set an expiration and optional label
5. The full key string is displayed once — copy and store it securely

:::warning
The full access key is shown only once at creation time. It is never stored or retrievable after dismissal.
:::

### Format

```
osk-v1.<base64url-encoded-payload>.<hex-encoded-signature>
```

Three parts separated by `.`:

1. **Prefix** — `osk-v1` (identifies the token format and version)
2. **Payload** — Base64url-encoded canonical JSON
3. **Signature** — Hex-encoded 65-byte secp256k1 recoverable signature

### Scoping

| Scope | Signed By | Grants Access To |
| ----- | --------- | ---------------- |
| **Master-scoped** | Master key | All agents |
| **Agent-scoped** | Agent key | That specific agent only |

### Expiration Options

| Option | Duration |
| ------ | -------- |
| `30d` | 30 days |
| `90d` | 90 days |
| `1y` | 1 year |
| `never` | No expiration |

### Using an Access Key

Pass the access key in the `Authorization` header when making API requests:

```bash
curl http://127.0.0.1:1337/v1/chat/completions \
  -H "Authorization: Bearer osk-v1.<payload>.<signature>" \
  -H "Content-Type: application/json" \
  -d '{"model": "llama-3.2-3b-instruct-4bit", "messages": [{"role":"user","content":"Hello!"}]}'
```

### Revoking Access Keys

Access keys can be revoked through two mechanisms:

- **Individual revocation** — revoke a specific key by its nonce. Go to **Identity** → select the key → **Revoke**.
- **Bulk revocation** — revoke all keys from an address with counter values at or below a threshold. Useful when a key may have been compromised and you want to invalidate everything issued before a certain point.

---

## Whitelist

The whitelist controls which addresses are authorized to issue access keys.

### Master-Level Whitelist

Addresses in the master whitelist can issue keys for any agent. Add trusted external addresses here.

### Per-Agent Overrides

Additional addresses can be authorized for specific agents only. These are additive — they extend the master whitelist, not replace it.

### Effective Whitelist

The effective whitelist for a given agent is:

```
effective = masterWhitelist ∪ agentWhitelist[agent] ∪ {agentAddress, masterAddress}
```

The agent's own address and the master address are always implicitly included.

---

## Recovery

During initial identity setup, a one-time recovery code is generated:

```
OSAURUS-XXXX-XXXX-XXXX-XXXX
```

Format: `OSAURUS-` prefix followed by 4 groups of 4 uppercase hex characters (8 random bytes = 64 bits of entropy).

:::danger
The recovery code is shown exactly once during setup and never stored on the device. Save it immediately in a secure location.
:::

---

## Technical Reference

### Key Derivation

#### Master Key

```
32 random bytes (SecRandomCopyBytes)
    → secp256k1 private key
    → uncompressed public key (drop 0x04 prefix)
    → Keccak-256 hash
    → last 20 bytes
    → checksummed hex address (EIP-55)
```

The master key is stored in iCloud Keychain with `kSecAttrAccessibleWhenUnlocked`. iCloud sync is attempted first; if unavailable, the key is stored device-only with `kSecAttrAccessibleWhenUnlockedThisDeviceOnly`.

#### Agent Key

```
HMAC-SHA512(
    key:  masterKey,                              // 32 bytes
    data: "osaurus-agent-v1" || bigEndian(index)  // domain + 4-byte index
)
    → first 32 bytes of HMAC output
    → same address derivation as master key
```

The domain prefix `osaurus-agent-v1` prevents cross-protocol key reuse. The big-endian index encoding ensures a canonical byte representation across platforms. Each unique index produces a completely independent keypair.

Agent keys are never persisted. They are re-derived from the master key whenever a signature is needed, which requires biometric authentication to access the master key.

#### Device Key

- **Hardware path:** `DCAppAttestService.generateKey()` creates a P-256 key in the Secure Enclave. The key ID is hashed with SHA-256 and truncated to 4 bytes (8 hex characters) for the device ID.
- **Software fallback:** 4 random bytes via `SecRandomCopyBytes`, stored in `UserDefaults` for stability across app launches.

### Two-Layer Request Signing

Every authenticated API request carries a two-layer signed token that binds each request to both a cryptographic identity and a physical device.

#### Token Structure

```
header.payload.accountSignature.deviceAssertion
```

Four base64url-encoded segments joined by `.`:

| Segment | Encoding | Content |
| ------- | -------- | ------- |
| Header | base64url(JSON) | Algorithm, type, version |
| Payload | base64url(JSON) | Claims (see below) |
| Identity Signature | hex | secp256k1 recoverable signature (65 bytes) |
| Device Assertion | base64url | App Attest assertion (or empty for software fallback) |

#### Header

```json
{
  "alg": "es256k+apple-attest",
  "typ": "osaurus-id",
  "ver": 5
}
```

#### Payload Fields

| Field | Type | Description |
| ----- | ---- | ----------- |
| `iss` | string | Issuer address (master or agent) |
| `dev` | string | Device ID (8-char hex) |
| `cnt` | uint64 | Monotonic counter (anti-replay) |
| `iat` | int | Issued-at timestamp (Unix seconds) |
| `exp` | int | Expiration timestamp (Unix seconds, typically iat + 60) |
| `aud` | string | Audience (target service hostname) |
| `act` | string | Action being authorized (e.g. `"GET /v1/models"`) |
| `par` | string? | Parent address (for agent-issued tokens, the master address) |
| `idx` | uint32? | Agent index (for agent-issued tokens) |

#### Signing Process

1. **Encode payload** as JSON
2. **Layer 1 — Identity signature:** Domain-separated secp256k1 signing
   - Envelope: `\x19Osaurus Signed Message:\n<length><payload>`
   - Hash: Keccak-256 of the envelope
   - Sign: secp256k1 with recovery (produces 65 bytes: r || s || v)
3. **Layer 2 — Device assertion:** App Attest assertion over SHA-256 of the payload
4. **Assemble:** `base64url(header).base64url(payload).hex(accountSig).base64url(deviceAssertion)`

The domain prefix `Osaurus Signed Message` prevents signed payloads from being replayed in other protocols that use the same curve.

### Access Key Validation

When a request arrives with an `osk-v1` token:

1. **Parse** the three segments (prefix, payload, signature)
2. **Decode** the base64url payload into `AccessKeyPayload`
3. **Recover** the signer address via `ecrecover` with `Osaurus Signed Access` domain prefix
4. **Verify issuer** — recovered address must match `payload.iss`
5. **Check audience** — `payload.aud` must match the agent or master address
6. **Check whitelist** — `payload.iss` must be in the effective whitelist
7. **Check revocation** — not individually revoked (address + nonce) and not bulk-revoked (counter threshold)
8. **Check expiration** — `payload.exp` must be in the future (if set)

### Access Key Payload Fields

| Field | Type | Description |
| ----- | ---- | ----------- |
| `aud` | OsaurusID | Audience address (who this key is for) |
| `cnt` | uint64 | Counter value at creation time |
| `exp` | int? | Expiration timestamp (null = never expires) |
| `iat` | int | Issued-at timestamp |
| `iss` | OsaurusID | Issuer address (who signed this key) |
| `lbl` | string? | Human-readable label |
| `nonce` | string | Unique identifier for revocation |

Fields are sorted alphabetically for canonical JSON encoding, ensuring consistent signature verification.

### Internal vs External Communication

| Mode | Authentication | Use Case |
| ---- | -------------- | -------- |
| **Internal** | Two-layer token (identity signature + device assertion) | Agents within the same Osaurus instance |
| **External** | `osk-v1` access key (identity signature only) | Tools, MCP clients, remote agents |

Internal communication provides the strongest authentication — both the cryptographic identity and the physical device are verified. External communication via access keys trades the device assertion for portability, enabling use from any device or service.

### Security Properties

| Property | Mechanism |
| -------- | --------- |
| Master key never leaves Keychain | Stored with `kSecAttrAccessibleWhenUnlocked`, read requires `LAContext` biometric auth |
| Agent keys never stored | Re-derived on demand via HMAC-SHA512 from master key |
| Device keys hardware-bound | Secure Enclave P-256 via App Attest (`DCAppAttestService`) |
| Anti-replay | Per-device monotonic counter (`cnt`); server rejects seen values |
| Domain separation | `Osaurus Signed Message` and `Osaurus Signed Access` prefixes prevent cross-protocol signature reuse |
| Recovery code single-use | Generated from `SecRandomCopyBytes`, shown once, never stored on device |
| Canonical encoding | Access key payloads use sorted-key JSON for deterministic signature verification |
| Memory safety | Master key bytes are zeroed after use |

---

<p align="center">
  For integration details on using access keys with external tools, see the <a href="/integrations">Integration Guide</a>. For exposing agents publicly via secure tunnels, see <a href="/relay">Relay</a>.
</p>

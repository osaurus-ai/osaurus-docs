---
title: Security & Privacy
sidebar_label: Security & Privacy
description: What we do to keep your data yours — encryption at rest, signed identity, sandboxed execution, no telemetry, no backdoors. And why open source means trust.
---

# Security & Privacy

> **What is yours is yours.** Not "by default". Not "we don't sell it". Physically, on your Mac.

This page is the front door to the security and privacy story. The deep technical references live at [Storage & Encryption](/storage), [Identity Cryptography](/identity-internals), and [Sandbox Internals](/sandbox) — but you don't need to read them to trust Osaurus. Read this page first.

---

## The promise

Osaurus is **local-first** — and that's not a marketing line. The chat overlay, your memory, your installed plugins, your identity — all of it runs on your Mac. The default experience never sends your conversations anywhere.

When you opt in to a cloud provider (OpenAI, Anthropic, etc.), only the prompts you send to *that turn* leave. Your memory, your stored chats, your identity, your voice — those stay on your device, encrypted, regardless of which model you're talking to.

We've designed Osaurus so that even **we** — the maintainers — couldn't read your data if we wanted to. The encryption key is on your Mac. The master identity key is in *your* iCloud Keychain, gated by *your* biometrics. The codebase is fully open and auditable. There are no backdoors, and we have no way to add one without you noticing in the next git pull.

---

## What stays on your Mac

| Your data | Where it lives | How it's protected |
|---|---|---|
| Chat history | `~/.osaurus/chat-history/` | **Encrypted** (SQLCipher + AES-GCM blobs) |
| Memory (your facts and history) | `~/.osaurus/memory/` | **Encrypted** (SQLCipher) |
| Methods, tool index, plugin databases | `~/.osaurus/` | **Encrypted** (SQLCipher) |
| Storage encryption key | macOS Keychain | Device-bound, never copied off |
| Master identity key | iCloud Keychain | Biometric-gated, syncs only across your Apple devices |
| Cloud provider API keys | macOS Keychain | Never in plain-text config files |
| Voice transcription | Memory only | **Never written to disk** |
| Models you've downloaded | `~/MLXModels/` | Local files (model weights aren't sensitive on their own) |

Storage encryption has been on by default since 0.17.7 — first launch shows a brief migration overlay, and from then on every byte of your conversations and memory is at-rest-encrypted with a per-device key. [Storage details →](/storage)

---

## Identity that's signed and verifiable

Every API call to your Osaurus carries a **cryptographic signature** from a key only you control.

- Your **master identity** is a secp256k1 keypair generated on first launch, stored in your iCloud Keychain, and gated by Face ID / Touch ID
- Each **agent** gets its own deterministic child key derived from your master — agents can sign on their own behalf, but their authority always traces back to you
- External tools, MCP clients, and remote agents authenticate with **`osk-v1` access keys** — portable tokens you mint, scope (master-wide or single-agent), expire (30/90/365 days or never), and revoke at any time

There's no central server handing out access. Verification is local and offline-capable. If something signs a request as you, it's you. [Identity & Access →](/identity) · [Identity Cryptography →](/identity-internals)

---

## When agents run code, they can't break out

The Sandbox runs agent code in an **isolated Linux VM** (Apple Containerization framework, Alpine Linux). Each agent gets its own Linux user with its own home directory — they can't read each other's files. The VM connects back to Osaurus via a **vsock bridge** with **per-agent bearer tokens** written into the guest as `0600` files; unknown tokens get `401`, no fallback. Outbound network can be set to `none` to fully air-gap.

Sandbox runtime artifacts (the GHCR image, the Linux kernel, the initial filesystem) are pinned to **immutable digests** and verified after download — a registry compromise can't silently swap binaries.

[Agent Loop →](/agent-loop) · [Sandbox Internals →](/sandbox)

---

## What can leave your Mac (and how to control it)

We owe you an honest list:

| Feature | What can leave | How to control it |
|---|---|---|
| **Cloud provider model** | The prompts and conversation context you send to that provider | Stick with local models or `foundation`; don't connect a cloud provider |
| **Relay** | Inbound HTTPS for one specific agent via `agent.osaurus.ai` | Per-agent toggle in **Server → Relays**; off by default; revoke any time |
| **Sandbox network** | Outbound HTTP from the Linux VM | Set `network: "none"` in `~/.osaurus/config/sandbox.json` |
| **Voice** | **Nothing** — fully on-device via FluidAudio | Always local |
| **Memory distillation** | **Nothing** — runs through your Core Model on your Mac | Always local |
| **Telemetry / analytics** | **Nothing** — we don't have any | We don't collect any metrics, ever |

When you connect a remote provider, the **Insights** tab shows you exactly what was sent and received for every request. There's no hidden traffic.

---

## Hardening at every boundary

A short, plain-language tour of the things we've built in:

- **At-rest encryption** — All sensitive SQLite databases are SQLCipher-encrypted with a 32-byte key in your Keychain. Large attachments are AES-GCM-encrypted into content-addressed `.osec` files. [Storage →](/storage)
- **Signed and replay-protected requests** — Every authenticated call carries a per-device monotonic counter the server checks. Replays get `401`.
- **Pre-auth body limits** — `/pair` capped at 64 KiB, other public routes at 32 MiB, sandbox bridge at 8 MiB. Oversized requests get `413` *before* the auth gate so an unauthenticated client can't exhaust host memory.
- **Pairings expire** — Bonjour-paired devices get **agent-scoped, 90-day** access keys by default. Permanent keys are explicit opt-in.
- **Credentials never logged** — Issued `osk-v1` keys and `Bearer` headers are redacted from request logs as defense-in-depth.
- **No silent fallbacks** — If a sandbox artifact fails its digest check, provisioning fails closed. No fallback to alternate mirrors.
- **Reproducible builds** — SPM dependencies are pinned to commits; CI is pinned to a specific Xcode version.

For the full technical posture, see the upstream [SECURITY.md](https://github.com/osaurus-ai/osaurus/blob/main/docs/SECURITY.md).

---

## Open source: trust through transparency

A security claim is only as good as your ability to verify it. Osaurus is **MIT-licensed open source**, and that gives you concrete, real powers:

- **You can read the code.** Every line of Osaurus is on [GitHub](https://github.com/osaurus-ai/osaurus). The handler that processes your prompt, the function that writes a memory entry, the routine that signs every request — all auditable.
- **You can build it yourself.** [Building from Source](/developer) takes about 10 minutes. Reproducible builds: SPM dependencies are pinned to commits; CI is pinned to a specific Xcode version. The binary you run can match the binary you compile.
- **You can fork it.** If we ever did something you disagreed with, you could fork it and keep the version you trust. We can't.
- **No telemetry.** We don't run analytics, ping a server on launch, or count active users. We don't know what models you run, what plugins you install, or what you ask. This is verifiable: search the repo for `URLSession.*shared` and audit every call.
- **Public security policy.** Vulnerability reporting goes through [GitHub Security Advisories](https://github.com/osaurus-ai/osaurus/security/advisories). Acknowledgement within 72 hours.
- **No backdoors, no escrow keys.** There's no master key the maintainers hold. If you wipe your Mac without a backup, even *we* can't recover your data — that's the trade-off, and it's intentional. [More on key recovery →](/storage#limitations)

This is what "your AI" actually means. Not just "private" — **verifiable**.

---

## What we (the maintainers) don't have access to

To be very explicit:

- Your **master identity key** — it's in *your* iCloud Keychain, gated by *your* biometrics
- Your **storage encryption key** — it's in *your* macOS Keychain, device-bound, never synced off
- The **contents of your conversations** — they're encrypted at rest with the storage key
- The **text of your voice input** — it's transcribed locally and never written
- The **names of agents** you've created, the **skills** you've imported, or the **plugins** you've installed
- **Anything else, basically.** The codebase has no "phone home"

The only data we ever see is what *you choose* to put in a public GitHub issue, Discord message, or email. That's the entire surface area.

---

## Reporting a security issue

If you find a vulnerability, please don't disclose it publicly. Instead:

1. Open a private report via [GitHub Security Advisories](https://github.com/osaurus-ai/osaurus/security/advisories)
2. Or email the maintainers privately

We acknowledge within 72 hours and work on a fix. Reporters who wish to be acknowledged are credited in release notes. See the upstream [SECURITY.md](https://github.com/osaurus-ai/osaurus/blob/main/docs/SECURITY.md) for the full policy.

---

## Going deeper

For the technical references behind this page:

- [Storage & Encryption](/storage) — SQLCipher migration, key rotation, plaintext export, key-mismatch recovery
- [Identity Cryptography](/identity-internals) — secp256k1, App Attest, the `osk-v1` spec, request signing
- [Sandbox Internals](/sandbox) — VM isolation, vsock bridge auth, artifact integrity pinning
- [Identity & Access](/identity) — managing your own access keys (everyday view)

---
title: Security & Privacy
sidebar_label: Security & Privacy
description: How Osaurus keeps your data on your Mac, what can leave it and when, how to lock things down further, and what the Osaurus team can't see.
---

# Security & Privacy

> **What is yours is yours.** Not "by default." Not "we don't sell it." Physically, on your Mac.

Osaurus keeps your chats, [memory](/glossary#memory), and settings on your Mac. Some things leave it only when you choose features that need the internet, like [cloud models](/glossary#cloud-model) or [Public Links](/glossary#public-link). This page explains what stays, what can leave, and how to control it. You don't need to read the technical pages to trust Osaurus; start here.

## Get started: lock things down

A few settings make the biggest difference:

1. **Turn on FileVault** in macOS **System Settings → Privacy & Security → FileVault**. [FileVault](/glossary#filevault) encrypts your whole disk, including everything Osaurus stores.
2. **Optionally encrypt Osaurus's data too.** If you share your Mac account or don't use FileVault, open **Settings…** (`⌘ ,`) → **General → Advanced → Data & Storage** and turn on database encryption. [Storage details →](/storage)
3. **Use local models for private work.** A [local model](/glossary#local-model) runs on your Mac, so what you type doesn't leave it.
4. **Hide personal details from cloud models.** Turn on the [Privacy Filter](/privacy-filter) in **Settings… → Privacy → Filter**.
5. **Choose what you share with us.** In the **Data Collection** section of **Settings… → Privacy → Filter**, decide whether to send anonymous usage data and crash reports. [Details →](/telemetry)
6. **Back up your recovery phrase** from **Settings… → Identity**. See [Identity](/identity).

## The promise

Osaurus is **local-first**, and that's not a marketing line. The chat window, your memory, your installed [plugins](/glossary#plugin), and your [identity](/glossary#identity) all run on your Mac. If you only use local models, your conversations never leave your computer.

When you use a cloud model or [provider](/glossary#provider) (like OpenAI or Anthropic), the messages and conversation you send in that chat go to that company. Your stored chat history, memory, identity, and voice audio stay on your Mac, whichever model you use.

We built Osaurus so that even **we**, the people who make it, can't read your data. It lives on your Mac, not on our servers. Your identity's secret key is in *your* iCloud [Keychain](/glossary#keychain). The code is fully open for anyone to check. There are no backdoors, and we couldn't add one without people noticing.

## What stays on your Mac

| Your data | How it's protected |
|---|---|
| Chat history | Stored on your Mac. Encrypted at rest only if FileVault is on or you turn on database encryption |
| Memory (facts Osaurus learned about you) | Same as chat history |
| Other app data (saved methods, tool lists, plugin data) | Same as chat history |
| Your identity's secret key | iCloud Keychain, protected by Face ID or Touch ID; syncs only across your Apple devices |
| Cloud provider [API keys](/glossary#api-key) | macOS Keychain, never in plain-text files |
| Voice | Audio is [transcribed](/glossary#transcription) on your Mac and never saved. The text you send becomes a chat message and is stored like any other |
| Downloaded models | Ordinary files on your Mac |
| [Activity log](/glossary#activity-log) | Stored on your Mac, built so any edit or deletion is detectable |

**About encryption at rest:** Osaurus stores its data as ordinary database files. They're encrypted on disk only when **macOS FileVault** is on, or when you turn on Osaurus's optional database encryption. Without either, someone with access to your Mac account or your disk could read them.

## Identity that's signed and checkable

Every request to your Osaurus from another app or device carries a digital signature from a key only you control. There's no central server handing out access, and checking a signature doesn't need the internet.

- **You** have a master identity, created on your first Mac and backed up by your 24-word [recovery phrase](/glossary#recovery-phrase).
- **Each agent** has its own identity that traces back to yours.
- **Each Mac** has its own hardware-tied ID, so a stolen signature alone can't impersonate it.
- **Other apps** connect with [access keys](/glossary#access-key) you create, limit to one agent or all, set to expire, and revoke anytime.

[Identity →](/identity)

## When agents run code, they stay contained

When an agent runs code or installs software, it does so in the [Sandbox](/glossary#sandbox), a sealed-off space separate from the rest of your Mac. On macOS 26 and later, that's a small, separate Linux computer running inside your Mac. Each agent gets its own space and can't read the others' files. You can cut off its internet access completely, or allow only specific websites.

On macOS 15, the Sandbox uses a lighter form of protection. It can only write inside its own space, but it isn't as fully separated. [Sandbox Internals](/sandbox#seatbelt-fallback-macos-15) explains the difference.

New custom agents start with the Sandbox on unless you turn it off. The [Orchestrator](/glossary#orchestrator) never uses it.

[Tasks →](/agent-loop) · [Sandbox Internals →](/sandbox)

## What can leave your Mac (and how to control it)

We owe you an honest list:

| Feature | What can leave | How to control it |
|---|---|---|
| **Cloud models and providers** | The messages and conversation you send to that company | Use local models or Apple's on-device **foundation** model, or turn on the [Privacy Filter](/privacy-filter) to hide personal details first |
| **Cloud image and video generation** | Your description and, for image-to-video, the source image | Use a local image model for offline work. Osaurus always shows the cost and asks first; it never silently switches to a cloud service |
| **Public Links** | Messages to and from one agent, through Osaurus's relay | Off by default, per agent. Osaurus-to-Osaurus traffic (your iPhone, teammates) is [end-to-end encrypted](/glossary#end-to-end-encryption), so the relay can't read it. Other apps use regular HTTPS to the relay, so the relay can see that traffic. While an iPhone is paired, **Settings… → Mobile → Reach From Anywhere** (on by default) turns links on for every agent. [Public Links →](/relay) · [Mobile →](./mobile.md) |
| **Sandbox internet access** | Web requests from code an agent runs | Turn the Sandbox's network off or limit it to specific websites. [Sandbox →](/sandbox) |
| **Voice** | **No audio.** Speech is turned into text on your Mac. The text is then sent like any typed message, so it goes to a cloud model only if you're chatting with one | Always local |
| **Memory** | **Nothing**, when your [Core Model](/glossary#core-model) is local (the default on macOS 26 and later). If you pick a cloud model as your Core Model, the chats it learns from go to that company | Keep a local model in **Settings… → General → Core Model** |
| **Usage analytics** | Anonymous, combined usage numbers. **Never** your chats, prompts, keys, or files | Nothing is sent until you agree (a pre-checked box on the first setup screen). Turn it off in **Settings… → Privacy → Filter → Data Collection → Share Anonymous Usage Data**. [Details →](/telemetry) |
| **Crash reports** | Crash and freeze details with no personal information | **On from the first launch.** Turn it off in **Settings… → Privacy → Filter → Data Collection → Send Crash Reports**. [Details →](/telemetry) |

Both analytics and crash reports are completely off if you build Osaurus yourself.

### See for yourself in Insights

**Settings… → Insights** shows the [activity log](/glossary#activity-log): a record of everything Osaurus did, including local model requests, cloud model calls, web searches, and messages sent to chat apps. Each entry is marked **Local** or **Cloud**, with where it went and how much was sent.

- The **Left this Mac** tile shows at a glance what went out.
- **Verify Integrity** checks that the log hasn't been edited.
- **Export** saves a copy someone else can check without Osaurus.
- With the Privacy Filter on, you can see exactly what was sent after personal details were hidden.

Choose how long the log is kept (**Keep Activity History**, 30 days by default) and whether it saves message text (**Store Prompts and Responses**) in the **Activity Log** section of **Settings… → Privacy → Filter**. [Details →](/developer-tools#insights)

## Built-in protections

A short tour of the safeguards built in:

- **Personal details hidden on the way out.** The optional [Privacy Filter](/privacy-filter) finds names, emails, secrets, and more in messages going to cloud models and hides them before they leave. If it detects a leak, it stops the message instead of sending it.
- **File clean-up on your Mac.** Agents working in a [Working Folder](/glossary#working-folder) can find or hide personal details in files without sending them anywhere. Changes need your approval, stay inside that folder, and can be undone. [Tasks →](/agent-loop#bulk-edits-and-on-device-redaction)
- **Your Working Folder stays private.** It's a setting on this Mac only and is never sent to anyone. When a remote app runs one of your agents, the agent can only read and edit files inside it, and can't run commands.
- **Signed requests.** Every request from another app or device is checked against keys you control.
- **One Mac per agent link.** If a copied agent comes online on another Mac, the older Mac steps aside instead of fighting over it. **Serve From This Mac** takes it back.
- **Pairings expire.** Devices you pair get a key for one agent that lasts 90 days, unless you choose to keep it permanently.
- **Passwords stay out of logs.** Access keys, API keys, and similar secrets are hidden before anything is written to the activity log.
- **Agent secrets stay out of records.** When an agent saves a password for later, the real value is used only when needed, and every log, history, and screen shows a hidden copy instead. [Details →](/sandbox#secret-containment)
- **No silent fallbacks.** If a download for the Sandbox fails its safety check, Osaurus stops instead of trying somewhere else.

## Open source: trust through transparency

A security claim is only as good as your ability to check it. Osaurus is **open source** (MIT license), and that gives you real powers:

- **You can read the code.** Every line is on [GitHub](https://github.com/osaurus-ai/osaurus).
- **You can build it yourself.** [Building from Source](/developer) takes about 10 minutes, and the build is set up so the app you run can match the app you compile.
- **You can fork it.** If we ever did something you disagreed with, you could keep your own copy. We couldn't stop you.
- **Analytics and crash reports are anonymous and documented.** They **never** include your chats, prompts, keys, files, or agent names. Every analytics event is listed in the [Telemetry](/telemetry) reference.
- **Public security policy.** Report problems through [GitHub Security Advisories](https://github.com/osaurus-ai/osaurus/security/advisories). We reply within 72 hours.
- **No backdoors, no spare keys.** We don't hold a master key. If you turn on database encryption and lose the key without a backup, even *we* can't recover your data. That's on purpose. [More on key recovery →](/storage#limitations)

This is what "your AI" really means. Not just "private": **checkable**.

## What we (the maintainers) can't see

To be very clear:

- Your **identity's secret key.** It's in *your* iCloud Keychain.
- Your **database encryption key** (if you turned it on). It's in *your* macOS Keychain and never leaves this Mac.
- **Your conversations.** They're stored only on your Mac. When you use a cloud model, they go to that model's company, not to us. When you use Osaurus's hosted [Osaurus Cloud](/glossary#osaurus-cloud) models, our [Osaurus Router](/glossary#osaurus-router) passes them to the model; its billing records keep only details like cost and timing, never your messages. When other apps use a Public Link, our relay passes those messages along (Osaurus-to-Osaurus traffic stays encrypted).
- **Your voice recordings.** Audio is turned into text on your Mac and never saved. The text becomes an ordinary chat message on your Mac.
- The **names of your agents**, the **skills** you've imported, or the **plugins** you've installed.
- **Anything that identifies you.** The only data sent automatically is anonymous analytics (after you agree) and crash reports, and you can turn both off. See [Telemetry](/telemetry).

Beyond that, the only data we see is what *you choose* to post in a public GitHub issue, Discord message, or email.

## Reporting a security issue

If you find a security problem, please don't share it publicly. Instead:

1. Open a private report via [GitHub Security Advisories](https://github.com/osaurus-ai/osaurus/security/advisories).
2. Or email the maintainers privately.

We reply within 72 hours and work on a fix. If you'd like, we'll credit you in the release notes. See the upstream [SECURITY.md](https://github.com/osaurus-ai/osaurus/blob/main/docs/SECURITY.md) for the full policy.

---

## Under the hood

### Storage locations and encryption

| Your data | Where it lives | How it's protected |
|---|---|---|
| Chat history | `~/.osaurus/chat-history/` | FileVault at rest; **opt-in SQLCipher encryption** |
| Memory | `~/.osaurus/memory/` | FileVault at rest; **opt-in SQLCipher encryption** |
| Methods, tool index, plugin databases | `~/.osaurus/` | FileVault at rest; **opt-in SQLCipher encryption** |
| Storage encryption key (when opted in) | macOS Keychain | Device-bound, never copied off |
| Master identity key | iCloud Keychain | Biometric-gated, syncs only across your Apple devices |
| Cloud provider API keys | macOS Keychain | Never in plain-text config files |
| Voice transcription | On-device (FluidAudio) | Interim audio buffers are memory-only; text you send is stored in chat history like any other message |
| Downloaded models | `~/MLXModels/` | Local files (model weights aren't sensitive on their own) |
| Activity log (Insights) | `~/.osaurus/activity/` | SHA-256 hash chain makes edits and deletions detectable; same at-rest controls as other stores |

Since 0.21.0, local data is stored as plaintext SQLite by default and protected at rest only by macOS FileVault. That's the most reliable setup, with no app-managed key that can go missing. Opting in to SQLCipher encrypts every database with a 32-byte key in your Keychain, and large attachments are AES-GCM-encrypted into content-addressed `.osec` files. [Storage →](/storage)

### Identity cryptography

- The **master identity** is a secp256k1 keypair generated on your first device, stored in iCloud Keychain, and gated by Face ID / Touch ID. Other devices pick it up through iCloud Keychain sync or the 24-word (BIP39) recovery phrase.
- Each **agent** gets a deterministic child key derived from the master key and the device it was created on, so agents minted on two devices never collide.
- Each **device** has a hardware-bound ID (Secure Enclave / App Attest attestation).
- External tools, MCP clients, and remote agents authenticate with **`osk-v1` access keys**: master-wide or single-agent scope, 30/90/365-day or no expiry, revocation checked on every request.
- Agent-to-agent traffic over the [Secure Channel](/secure-channel) is end-to-end encrypted and sequence-numbered against replays.

[Identity Cryptography →](/identity-internals)

### Sandbox isolation

On macOS 26+, the Sandbox runs agent code in an **isolated Linux VM** (Apple Containerization framework, Alpine Linux). Each agent gets its own Linux user and home directory. The VM connects back to Osaurus via a **vsock bridge** with **per-agent bearer tokens** written into the guest as `0600` files; unknown tokens get `401`, with no fallback. Outbound network can be `none` (fully air-gapped, set `network: "none"` in `~/.osaurus/config/sandbox.json`) or a per-agent **domain allowlist** enforced by a filtering proxy on a host-only network.

On macOS 15, the Sandbox falls back to a **Seatbelt-confined backend**: commands run as host processes under a deny-by-default profile that can only write inside the sandbox workspace. Host reads aren't blocked.

Sandbox runtime artifacts (the GHCR image, the production Kata kernel, vminit, and the initial filesystem) are pinned to **immutable digests** and verified after download, so a registry compromise can't silently swap binaries. If a digest check fails, provisioning fails closed with no fallback mirror. The guest runs with restricted OCI capabilities and `noNewPrivileges`. The built-in Orchestrator is hard-off for the sandbox.

### Hardening details

- **Pre-auth body limits:** `/pair` is capped at 64 KiB, other public routes at 32 MiB, the sandbox bridge at 8 MiB. Oversized requests get `413` *before* the auth gate, so an unauthenticated client can't exhaust host memory.
- **Credential redaction:** issued `osk-v1` keys, `Bearer` headers, `sk-…` keys, JWTs, and API-key headers are redacted before anything is written to the activity log.
- **Secret containment:** when an agent stores a credential with `sandbox_secret_set`, execution gets the real value but every recorded surface gets a redacted copy: chat and HTTP run history, plugin events, approval prompts, debug logs, Insights, and provider wire snapshots. Malformed secret payloads fail closed to a redacted stub, and known secret values are scrubbed from command output.
- **Working Folder:** a machine-local security-scoped bookmark that never crosses the wire. Authenticated remote agent runs can only read and edit files inside it; shell, git commit, and undo stay denied, and a stale bookmark fails closed.
- **Pairing keys:** Bonjour-paired devices get agent-scoped, 90-day `osk-v1` keys by default; permanent keys are an explicit opt-in.
- **Privacy Filter:** fail-closed; the exact post-redaction bytes are captured in Insights.
- **Reproducible builds:** SPM dependencies are pinned to commits; CI is pinned to a specific Xcode version.

### Activity log

Insights covers local model requests, cloud provider calls, web searches, URL fetches, MCP calls, channel deliveries, and Router calls. The log is a SHA-256 hash chain, which is what **Verify Integrity** checks, and an **Export** can be re-verified without Osaurus.

### Telemetry

Usage analytics (Aptabase) wait for your consent: events from launch until you decide are held in memory only and sent only if you agree. Crash and hang reporting (Sentry) is opt-out and starts at launch so even first-run crashes are captured. Both need build-time keys, so source builds never send anything. Full details: [Telemetry](/telemetry).

For the full technical posture, see the upstream [SECURITY.md](https://github.com/osaurus-ai/osaurus/blob/main/docs/SECURITY.md).

---

## Going deeper

- [Storage & Encryption](/storage) — the plaintext default, opt-in SQLCipher, migration, recovery
- [Identity Cryptography](/identity-internals) — secp256k1, App Attest, the `osk-v1` spec, request signing
- [Sandbox Internals](/sandbox) — VM isolation, vsock bridge auth, artifact integrity pinning
- [Identity](/identity) — managing your own access keys (everyday view)
- [Public Links](/relay) — what the relay can and can't see
- [Telemetry](/telemetry) — exactly what analytics and crash reports contain

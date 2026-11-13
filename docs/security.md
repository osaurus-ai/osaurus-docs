---
title: Security & Privacy
sidebar_label: Security & Privacy
description: How Osaurus keeps your data on your Mac, what can leave it and when, how to lock things down further, and what the Osaurus team can't see.
---

# Security & Privacy

> **What is yours is yours.** Not "by default." Not "we don't sell it." Physically, on your Mac.

Osaurus keeps your chats, [memory](/glossary#memory), and settings on your Mac. Some things leave it only when you choose features that need the internet, like [cloud models](/glossary#cloud-model), syncing with your other devices, or [Remote Access](/glossary#remote-access). This page explains what stays, what can leave, and how to control it. You don't need to read the technical pages to trust Osaurus; start here.

## Get started: lock things down

A few settings make the biggest difference. Open Settings with the gear icon at the bottom of the left navigation rail, or press `⌘ ,`.

1. **Turn on FileVault** in macOS **System Settings → Privacy & Security → FileVault**. [FileVault](/glossary#filevault) encrypts your whole disk, including everything Osaurus stores.
2. **Optionally encrypt Osaurus's data too.** If you share your Mac account or don't use FileVault, go to **Settings → Privacy & Security → Data & Storage** and turn on **Encrypt Local Data at Rest (SQLCipher)**. [Storage details →](/storage)
3. **Use local models for private work.** A [local model](/glossary#local-model) runs on your Mac, so what you type doesn't leave it.
4. **Hide personal details from cloud models.** Turn on the [Privacy Filter](/privacy-filter) in **Settings → Privacy & Security → Privacy Filter**.
5. **Choose what you share with us.** In **Settings → Privacy & Security → Data Collection**, decide whether to send anonymous usage data and crash reports. [Details →](/telemetry)
6. **Back up your recovery phrase** from **Settings → Osaurus ID**. See [Osaurus ID](/identity).

## The promise

Osaurus is **local-first**, and that's not a marketing line. The chat window, your memory, your installed [plugins](/glossary#plugin), and your [Osaurus ID](/glossary#osaurus-id) all run on your Mac. If you only use local models, your conversations stay on your own devices.

When you use a cloud model or [provider](/glossary#provider) (like OpenAI or Anthropic), the messages and conversation you send in that chat go to that company. Your stored chats, memory, Osaurus ID, and voice audio stay with you, whichever model you use.

We built Osaurus so that even **we**, the people who make it, can't read your data. It lives on your devices, not on our servers. Your Osaurus ID's secret key is in *your* iCloud [Keychain](/glossary#keychain). The code is fully open for anyone to check. There are no backdoors, and we couldn't add one without people noticing.

## What stays on your Mac

| Your data | How it's protected |
|---|---|
| Chats | Stored on your Mac, locked with keys kept in this Mac's Keychain. If you use [Devices & Sync](/devices), copied to your other devices with end-to-end encryption |
| Memory (facts Osaurus learned about you) | Stays on this Mac. Encrypted at rest only if FileVault is on or you turn on database encryption |
| Other app data (saved methods, tool lists, plugin data) | Same as memory |
| Your Osaurus ID's secret key | iCloud Keychain, protected by Face ID or Touch ID; syncs only across your Apple devices |
| Passwords and API keys in the [Vault](/vault) | macOS Keychain, on this Mac only. Seeing or copying a value needs Touch ID or your password |
| Voice | Audio is [transcribed](/glossary#transcription) on your Mac and never saved. The text you send becomes a chat message and is stored like any other |
| Downloaded models | Ordinary files on your Mac |
| [Activity log](/glossary#activity-log) | Stored on your Mac, built so any edit or deletion is detectable |

**About encryption at rest:** apart from chats, Osaurus stores its data as ordinary database files. They're encrypted on disk only when **macOS FileVault** is on, or when you turn on Osaurus's optional database encryption. Without either, someone with access to your Mac account or your disk could read them.

**Separate spaces.** You can keep a second, separate copy of Osaurus on the same Mac, for example one for work. Use the Dock menu's **Space:** item to make one. Each space has its own chats, agents, settings, and Keychain entries. Spaces other than the default one don't sync through iCloud. [Storage →](/storage)

## Identity that's signed and checkable

Every request to your Osaurus from another app or device carries a digital signature from a key only you control. There's no central server handing out access, and checking a signature doesn't need the internet.

- **You** have a master identity, created on your first Mac and backed up by your 24-word [recovery phrase](/glossary#recovery-phrase).
- **Each agent** has its own identity that traces back to yours.
- **Each Mac** has its own hardware-tied ID, so a stolen signature alone can't impersonate it.
- **Other apps** connect with [access keys](/glossary#access-key) you create, limit to one agent or all, set to expire, and revoke anytime.

[Osaurus ID →](/identity)

### Require a key from apps on this Mac {/* #local-access-key */}

By default, apps running on your own Mac can reach Osaurus without a key. That's convenient, but it also means any program you run, or a web page open in your browser, could try to read your chats or drive your agents. To close that off:

1. Open **Settings → Server → Server Settings → Authentication**.
2. Turn on **Require Access Key for Local Admin Routes**.

Now apps on this Mac need an [access key](/glossary#access-key) to read chats, run agents, call tools, see your devices, or change configuration. Chatting with models through the API still works without one. Web pages are refused unless you list their site by name under **Settings → Server → Server Settings → Connection → Allowed Origins (CORS)**, and even then they need a key. Siri and Shortcuts keep working. The change applies right away, with no restart.

If you use `osaurus mcp` with another AI app, or run `osaurus config` or `osaurus import`, give them a key with `--access-key` or the `OSAURUS_API_KEY` environment variable. An [Osaurus Bundle](/bundles) your company installs can turn this setting on for you.

## When agents run code, they stay contained

When an agent runs code or installs software, it does so in the [Sandbox](/glossary#sandbox), a sealed-off space separate from the rest of your Mac. On macOS 26 and later, that's a small, separate Linux computer running inside your Mac. Each agent gets its own space and can't read the others' files. You can cut off its internet access completely, or allow only specific websites.

On macOS 15, the Sandbox uses a lighter form of protection. It can only write inside its own space, but it isn't as fully separated. [Sandbox Internals](/sandbox) explains the difference.

New custom agents start with the Sandbox on unless you turn it off. The [Orchestrator](/glossary#orchestrator) never uses it.

[Working in Chat →](/agent-loop) · [Sandbox Internals →](/sandbox)

## What can leave your Mac (and how to control it)

We owe you an honest list:

| Feature | What can leave | How to control it |
|---|---|---|
| **Cloud models and providers** | The messages and conversation you send to that company | Use local models or Apple's on-device **foundation** model, or turn on the [Privacy Filter](/privacy-filter) to hide personal details first |
| **Cloud image and video generation** | Your description and, for image-to-video, the source image | Use a local image model for offline work. Osaurus always shows the cost and asks first; it never silently switches to a cloud service |
| **[Devices & Sync](/devices)** | Your chats, copied to your own Macs and iPhone, end-to-end encrypted so only your devices can read them | Off until you link a device. **Same Network** keeps it on your Wi-Fi. **Anywhere (Beta)** passes the encrypted data through Osaurus sync servers, which can't read it. Chats run in the background stay **This Mac only**. Removing a device offers **Remove and Change Phrase**, because a removed device still knows the old phrase |
| **[Remote Access](/remote-access)** | Messages to and from one agent, through Osaurus's [relay](/glossary#relay) | Off for each agent until you confirm **Turn on remote access?** Osaurus-to-Osaurus traffic (teammates, guests) is [end-to-end encrypted](/glossary#end-to-end-encryption), so the relay can't read it. Other apps use regular HTTPS to the relay, so the relay can see that traffic |
| **[Workspaces](/workspaces) and guest links** | Chats with the agents you share, run on your Mac with your keys | You choose which agents to share. Tool calls from teammates can wait for your approval (**Require Approval for Teammate Tool Calls**). Revoke a guest anytime in **Settings → Sharing → Access** |
| **Published workflows** | Everything a published workflow page shows (see [below](#published-workflows)) | Nothing is published until you choose to, and you pick who can see it. **Take Down…** removes the page anytime |
| **[Log in with Osaurus](/login-with-osaurus)** | Your public address and, if you claimed one, your Osaurus ID handle, to the one site you approve | Only when you click **Continue** and confirm with Touch ID or your password. The site never gets your keys, chats, or files |
| **Sandbox internet access** | Web requests from code an agent runs | Turn the Sandbox's network off or limit it to specific websites. [Sandbox →](/sandbox) |
| **Voice** | **No audio.** Speech is turned into text on your Mac. The text is then sent like any typed message, so it goes to a cloud model only if you're chatting with one | Always local |
| **Memory** | **Nothing**, when your [Core Model](/glossary#core-model) is local (the default on macOS 26 and later). If you pick a cloud model as your Core Model, the chats it learns from go to that company | Keep a local model in **Models → Model Defaults → Core Model** |
| **Usage analytics** | Anonymous, combined usage numbers. **Never** your chats, prompts, keys, or files | Nothing is sent until you agree (a pre-checked box on the first setup screen). Turn it off in **Settings → Privacy & Security → Data Collection → Share Anonymous Usage Data**. [Details →](/telemetry) |
| **Crash reports** | Crash and freeze details with no personal information | **On from the first launch.** Turn it off in **Settings → Privacy & Security → Data Collection → Send Crash Reports**. [Details →](/telemetry) |

Both analytics and crash reports are completely off if you build Osaurus yourself.

### Published workflows

You can share a [workflow](/glossary#workflow) by publishing a page on store.osaurus.ai. Before anything uploads, Osaurus shows you the same review your readers will see. [Share a workflow →](/workflows-share)

**Anyone who can open the page sees:**

- every step of the workflow
- the full code of any code steps
- the web addresses it contacts
- the names of the secrets it asks for, never their values
- the tools and models it uses
- your **@handle** (your Osaurus ID name, or a short form of your address)

**What never leaves your Mac:** secret values, your saved answers, local file paths, and run history. Tags you add stay on this Mac too.

**Example runs are optional.** You can attach up to 6 finished runs. Each one shows **What leaves this Mac**: the input and result, with secret inputs and local paths removed. Images are included only if you tick **Include** under each one, and they're re-encoded without location or camera data. Osaurus asks **Share N example runs publicly?** before it publishes them.

**Who can see it:**

| Choice | Who can open it |
|---|---|
| **Public** | Everyone. The link works right away, and the store lists it after the Osaurus team reviews it |
| **Unlisted** | Only people with the link |
| **Password** | Only people with the link and the password (6 to 128 characters) |
| **Workspace** | Only members of the workspaces you choose. Not on the public store and not reviewed |

Publishing always signs the page with your Osaurus ID. **Take Down…** turns the page off for everyone; people who already installed it keep their copy. When you install someone else's workflow, nothing installs until you've seen its review, and Osaurus only accepts store links from store.osaurus.ai.

### See for yourself in Insights

**Settings → Insights** shows the [activity log](/glossary#activity-log): a record of everything Osaurus did, including local model requests, cloud model calls, web searches, messages sent to chat apps, workflow runs, and the times Osaurus asked you something. Each entry is marked **Local** or **Cloud**, with where it went and how much was sent.

- The **Left this Mac** count shows at a glance what went out.
- **Interactions** shows who asked you for something and where you answered (**In the app**, **Desktop**, or **iPhone**).
- **Verify Integrity**, in the **⋯** menu, checks that the log hasn't been edited.
- **Export** saves a copy someone else can check without Osaurus.
- With the Privacy Filter on, you can see exactly what was sent after personal details were hidden.

Choose how long the log is kept (**Keep Activity History**, 30 days by default) and whether it saves message text (**Store Prompts and Responses**) in **Settings → Privacy & Security → Activity Log**. [Details →](/developer-tools)

## Built-in protections

A short tour of the safeguards built in:

- **Personal details hidden on the way out.** The optional [Privacy Filter](/privacy-filter) finds names, emails, secrets, and more in messages going to cloud models and hides them before they leave. If it detects a leak, it stops the message instead of sending it.
- **File clean-up on your Mac.** Agents working in a [Working Folder](/glossary#working-folder) can find or hide personal details in files without sending them anywhere. Changes need your approval, stay inside that folder, and can be undone. [Working in Chat →](/agent-loop)
- **Your Working Folder stays private.** It's a setting on this Mac only and is never sent to anyone. When a remote app runs one of your agents, the agent can only read and edit files inside it, and can't run commands.
- **Signed requests.** Every request from another app or device is checked against keys you control.
- **One Mac per agent link.** If a copied agent comes online on another Mac, the older Mac steps aside instead of fighting over it. **Serve From This Mac** takes it back.
- **Invites expire.** A guest link works once and expires after the time you pick. The key it hands out works for one agent and lasts 90 days by default.
- **Device removal that sticks.** Removing a device from Devices & Sync stops your other devices from talking to it. **Remove and Change Phrase** (the default) also replaces the shared secret, so a lost device can't rejoin.
- **Vault values need you.** Seeing or copying a saved password in the [Vault](/vault) asks for Touch ID or your Mac password every time.
- **Passwords stay out of logs.** Access keys, API keys, and similar secrets are hidden before anything is written to the activity log.
- **Agent secrets stay out of records.** When an agent saves a password for later, the real value is used only when needed, and every log, history, and screen shows a hidden copy instead. [Details →](/sandbox)
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

- Your **Osaurus ID's secret key.** It's in *your* iCloud Keychain.
- Your **database encryption key** (if you turned it on). It's in *your* macOS Keychain and never leaves this Mac.
- **Your Vault.** Passwords and API keys stay in this Mac's Keychain.
- **Your conversations.** They're stored on your devices. When you sync with **Anywhere (Beta)**, our sync servers pass along scrambled data they can't read. When you use a cloud model, your messages go to that model's company, not to us. When you use Osaurus's hosted [Osaurus Cloud](/glossary#osaurus-cloud) models, our [Osaurus Router](/glossary#osaurus-router) passes them to the model; its billing records keep only details like cost and timing, never your messages. When other apps use Remote Access, our relay passes those messages along (Osaurus-to-Osaurus traffic stays encrypted).
- **Your voice recordings.** Audio is turned into text on your Mac and never saved. The text becomes an ordinary chat message.
- The **names of your agents**, the **skills** you've imported, or the **plugins** you've installed, unless you publish them.
- **Anything that identifies you.** The only data sent automatically is anonymous analytics (after you agree) and crash reports, and you can turn both off. See [Telemetry](/telemetry).

Beyond that, the only data we see is what *you choose* to share: a workflow you publish, your Osaurus ID handle, or what you post in a public GitHub issue, Discord message, or email.

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
| Chats | `~/.osaurus/sync/` | osaurus-sync store, sealed with keys in this Mac's Keychain; end-to-end encrypted between your devices |
| Pre-sync chat backup | `~/.osaurus/chat-history/` | Read-only copy from before sync; **opt-in SQLCipher encryption** |
| Memory | `~/.osaurus/memory/` | FileVault at rest; **opt-in SQLCipher encryption** |
| Methods, tool index, plugin databases | `~/.osaurus/` | FileVault at rest; **opt-in SQLCipher encryption** |
| Storage encryption key (when opted in) | macOS Keychain | Device-bound, never copied off |
| Master identity key | iCloud Keychain | Biometric-gated, syncs only across your Apple devices |
| Vault values (passwords, API keys) | macOS Keychain, service `ai.osaurus.credentials` | `WhenUnlockedThisDeviceOnly`; names and scopes in `~/.osaurus/credentials/index.json`, never values |
| Voice transcription | On-device (FluidAudio) | Interim audio buffers are memory-only; text you send is stored like any other message |
| Downloaded models | `~/MLXModels/` | Local files (model weights aren't sensitive on their own) |
| Activity log (Insights) | `~/.osaurus/activity/` | SHA-256 hash chain makes edits and deletions detectable; same at-rest controls as other stores |
| Extra spaces | `~/.osaurus-spaces/<id>/data/` | Same layout as `~/.osaurus/`; own Keychain entries, which don't sync through iCloud |

Since 0.21.0, local data is stored as plaintext SQLite by default and protected at rest only by macOS FileVault. That's the most reliable setup, with no app-managed key that can go missing. Opting in to SQLCipher encrypts every database with a 32-byte key in your Keychain, and large attachments are AES-GCM-encrypted into content-addressed `.osec` files. [Storage →](/storage)

### Identity cryptography

- The **master identity** is a secp256k1 keypair generated on your first device, stored in iCloud Keychain, and gated by Face ID / Touch ID. Other devices pick it up through iCloud Keychain sync or the 24-word (BIP39) recovery phrase.
- Each **agent** gets a deterministic child key derived from the master key and the device it was created on, so agents minted on two devices never collide.
- Each **device** has a hardware-bound ID (Secure Enclave / App Attest attestation).
- External tools, MCP clients, and remote agents authenticate with **`osk-v1` access keys**: master-wide or single-agent scope, 30/90/365-day or no expiry, revocation checked on every request.
- Agent-to-agent traffic over the [Secure Channel](/secure-channel) is end-to-end encrypted and sequence-numbered against replays. Your own devices use osaurus-sync's separate end-to-end channel instead.
- **Log in with Osaurus** signs a single-use, five-minute challenge for one allowlisted site; the site receives the master address and Osaurus ID only.

[Identity Cryptography →](/identity-internals)

### Sandbox isolation

On macOS 26+, the Sandbox runs agent code in an **isolated Linux VM** (Apple Containerization framework, Alpine Linux). Each agent gets its own Linux user and home directory. The VM connects back to Osaurus via a **vsock bridge** with **per-agent bearer tokens** written into the guest as `0600` files; unknown tokens get `401`, with no fallback. Outbound network can be `none` (fully air-gapped, set `network: "none"` in `~/.osaurus/config/sandbox.json`) or a per-agent **domain allowlist** enforced by a filtering proxy on a host-only network.

On macOS 15, the Sandbox falls back to a **Seatbelt-confined backend**: commands run as host processes under a deny-by-default profile that can only write inside the sandbox workspace. Host reads aren't blocked.

Sandbox runtime artifacts (the GHCR image, the production Kata kernel, vminit, and the initial filesystem) are pinned to **immutable digests** and verified after download, so a registry compromise can't silently swap binaries. If a digest check fails, provisioning fails closed with no fallback mirror. The guest runs with restricted OCI capabilities and `noNewPrivileges`. The built-in Orchestrator is hard-off for the sandbox.

### Hardening details

- **Local access key:** with **Require Access Key for Local Admin Routes** on, loopback callers must present a valid `osk-v1` key on `/sessions`, `/agents`, `/attention`, `/conversations/*`, `/devices/*`, `/mcp/*`, `/admin/config/*`, and `/admin/import/*` (with or without `/v1`). Requests with a browser `Origin` get `403 browser_origin_refused` there unless the origin is listed by name (`*` doesn't count), and those routes lose loopback's automatic `*` CORS. Master keys keep their local behavior; agent-scoped keys are confined as for remote callers. App Intents use a per-launch in-process token, and [runtime](/harness-runtimes) tokens still reach `/mcp/*`. The setting is read per request. A bundle turning it off, or adding an origin, is high risk and needs `--yes`. This is a different switch from **Allow local API access without a key** on the Server page, which is about Router spend.
- **Owner routes need the Secure Channel remotely:** a remote caller presenting an owner (master-scoped) key gets `426 Upgrade Required` on every owner route, reads included, unless it uses the [Secure Channel](/secure-channel).
- **Pre-auth body limits:** pairing routes (`/pair/code`, `/pair/confirm`, `/pair-invite`, `/secure/session`) are capped at 64 KiB, other public routes at 32 MiB, the sandbox bridge at 8 MiB. Oversized requests get `413` *before* the auth gate, so an unauthenticated client can't exhaust host memory.
- **Credential redaction:** issued `osk-v1` keys, `Bearer` headers, `sk-…` keys, JWTs, and API-key headers are redacted before anything is written to the activity log.
- **Secret containment:** when an agent stores a credential with `sandbox_secret_set`, execution gets the real value but every recorded surface gets a redacted copy: chat and HTTP run history, plugin events, approval prompts, debug logs, Insights, and provider wire snapshots. Malformed secret payloads fail closed to a redacted stub, and known secret values are scrubbed from command output.
- **Working Folder:** a machine-local security-scoped bookmark that never crosses the wire. Authenticated remote agent runs can only read and edit files inside it; shell, git commit, and undo stay denied, and a stale bookmark fails closed.
- **Pairing credentials:** keys issued through relay invites (`/pair-invite`) are agent-scoped and expire in 90 days by default. The iPhone no longer pairs over HTTP: it joins your Sync account, and its secrets reach the Mac sealed to a one-use key.
- **Removed sync devices:** other devices turn away a removed device's sessions, but a device that wasn't wiped still holds the account secret, so **Remove and Change Phrase** replaces the account identity. **Remove Only** is for a wiped device.
- **Privacy Filter:** fail-closed; the exact post-redaction bytes are captured in Insights.
- **Reproducible builds:** SPM dependencies are pinned to commits; CI is pinned to a specific Xcode version.

### Activity log

Insights covers local model requests, cloud provider calls, web searches, URL fetches, MCP calls, channel deliveries, Router calls, workflow runs, automations, tasks, and interactions. Tool arguments aren't stored. The log is a SHA-256 hash chain, which is what **Verify Integrity** checks, and an **Export** can be re-verified without Osaurus.

### Telemetry

Usage analytics (Aptabase) wait for your consent: events from launch until you decide are held in memory only and sent only if you agree. Crash and hang reporting (Sentry) is opt-out and starts at launch so even first-run crashes are captured. Both need build-time keys, so source builds never send anything. Full details: [Telemetry](/telemetry).

For the full technical posture, see the upstream [SECURITY.md](https://github.com/osaurus-ai/osaurus/blob/main/docs/SECURITY.md).

---

## Going deeper

- [Storage & Encryption](/storage) — the plaintext default, opt-in SQLCipher, migration, recovery
- [Identity Cryptography](/identity-internals) — secp256k1, App Attest, the `osk-v1` spec, request signing
- [Sandbox Internals](/sandbox) — VM isolation, vsock bridge auth, artifact integrity pinning
- [Osaurus ID](/identity) — managing your own access keys (everyday view)
- [Vault](/vault) — where your passwords and API keys live
- [Devices & Sync](/devices) — how your own devices share chats
- [Remote Access](/remote-access) — what the relay can and can't see
- [Telemetry](/telemetry) — exactly what analytics and crash reports contain

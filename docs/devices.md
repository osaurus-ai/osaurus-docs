---
title: Devices & Sync
sidebar_label: Devices & Sync
description: Keep your chats on all your Macs and use your Mac's agents from your iPhone. Add a device with a code and a number check; everything is end-to-end encrypted, with no account to create.
---

# Devices & Sync

**Devices** links your own Macs and your iPhone. Your chats show up on every one of them, and your iPhone can use the agents on your Mac. It's [end-to-end encrypted](/glossary#end-to-end-encryption), so only your devices can read what syncs, and there's no account or password to create.

Picture it: you start a chat on your MacBook at the office and pick it up on your iMac at home, right where you left off. On the train, you open the Osaurus iPhone app and ask Planner what's on tomorrow. Planner still runs on your Mac, with your Mac's calendar and models. The phone just sends the question and shows the answer.

You need the latest Osaurus on each Mac. For your phone, you need the Osaurus iPhone app ([TestFlight](https://testflight.apple.com/join/yTF86bVb)).

## Get started: add a device

Start on a Mac that already has your agents and chats.

1. Open Settings: click the gear icon at the bottom of the narrow strip on the left edge of the window, or press ⌘,.
2. Under **Sharing**, choose **Devices**.
3. Click **Add a Device**, then **Show Code**. Confirm with Touch ID or your password. The code works for 5 minutes.
4. On the new device:
   - **iPhone:** open the Osaurus app and scan the code.
   - **Another Mac:** copy the pairing link from the first Mac. On the second Mac, open **Settings → Sharing → Devices**, click **Join Another Device**, then **Join…**, and paste the link. Osaurus asks you to confirm, because this Mac's chats move into the other device's account.
5. Both devices now show **Check the Number** with six digits. Look at both screens. If the numbers are the same, choose **Numbers Match** on both. If they're different, choose **They're Different** to stop.

The new device appears in the **Devices** list. Your chats start copying across, newest first.

:::warning[Only use your own code]
Paste only a link you can see on your own device's screen. Someone who sends you a pairing link is asking you to move your chats into their account.
:::

## What syncs

- **Chats you start** in the chat window, with their attachments, titles, folders and settings.
- **Conversations teammates and your iPhone have with your agents.** They appear on all your devices, under **On** *Mac name* for the Mac that ran them. From any of your Macs you can write in a teammate's conversation and answer its [approvals](/glossary#approval). The Mac that runs the agent delivers them when it's awake. Your iPhone's conversations are there to read.
- **Your agents.** Each Mac lists its agents on your other devices (see the next section).

**This Mac only:** chats that come from apps using the [API](/glossary#api), plugins, chat-app channels, [Automations](/automations), webhooks, email and [delegation](/glossary#delegation). The chat sidebar marks them **This Mac only**.

Agents' settings, [memory](/glossary#memory), tools and files never copy. Your other devices send their messages to the Mac that runs the agent.

## Use your agents from another device

With **Run Agents for My Other Devices** on (the default), each Mac lists its agents in the chat sidebar of your other devices, under **On** *that Mac's name*. Pick one and chat as usual. The agent runs on its own Mac, with that Mac's models, tools, memory and files. That Mac needs to be awake with Osaurus open.

Every custom agent is listed this way. Built-in agents aren't, except that your iPhone also gets each Mac's [Orchestrator](/glossary#orchestrator).

## Same Network or Anywhere (Beta)

**Find Devices** decides how your devices reach each other:

- **Same Network** (the default): devices sync only when they're on the same Wi-Fi or network. Nothing goes through the internet.
- **Anywhere (Beta)**: devices also find each other over the internet, through Osaurus servers. What passes through is encrypted end to end, so the servers can't read it.

Each device on the list says whether it's **Connected directly** or **Connected through a relay server**. Both sync normally; the relay is just a little slower.

The first time an iPhone joins, your Mac asks once whether to turn on **Anywhere (Beta)**, so the phone works away from home. **Not Now** keeps **Same Network**. Every device needs the same setting.

## Your iPhone

- **Approvals on the phone.** When an agent you're using from the iPhone needs permission, the card appears in that chat with **Allow**, **Allow for This Conversation**, **Always Allow** and **Deny**.
- **Secrets on the phone.** When a run needs a password or key, the iPhone asks for it and sends it, encrypted, to that Mac only. It's never written into your synced chats.
- **Things waiting for you.** Approvals, agent questions, workflow forms and other items in **Inbox → Needs You** reach your iPhone when **Settings → General → Notifications** includes **iPhone** for that kind of item. Answering on one device clears it on the other.
- **Manage agents.** The iPhone can create agents, change their settings and tools, change the default model, and delete agents on a Mac.
- **Keep Mac Awake for iPhone** (under **iPhone** on the Devices page) stops your Mac from going to sleep on its own while an iPhone is in your account. Closing a MacBook lid still puts it to sleep.
- **Continue iPhone Chats on This Mac** brings a chat you had on your phone to the front when you come back to the Mac.

## Your recovery phrase

Sync has its own 24-word [recovery phrase](/glossary#recovery-phrase). Find it under **Recovery → Recovery Phrase → Show**, and write it down somewhere safe. If this Mac ever loses its sync keys, the phrase, or another device that still has your chats, gets them back.

If this Mac has an [Osaurus ID](/identity), you can keep just one phrase. Choose **Use My Osaurus Recovery Phrase**, then **Use…**. Your other devices stop syncing with this Mac until each does the same. Creating or restoring an Osaurus ID on a Mac with no other devices links the two phrases automatically.

To set up a Mac from a phrase, use **Restore From Phrase**. A linked Mac that lost its sync keys shows **Unlock With My Osaurus Recovery Phrase**.

## Remove a device or sign out

To remove a device, open its **…** menu in the **Devices** list and choose **Remove Device…**. You get two choices:

- **Remove and Change Phrase** (the default). A removed device still holds your account's secret until the phrase changes, so this replaces it. The new phrase appears at the top of Devices under **Write Down Your New Recovery Phrase**. Choose **I Wrote It Down** once you have.
- **Remove Only**, for a device you've already wiped.

To leave sync on this Mac, use **Sign Out**: **Sign Out and Keep Chats** keeps them here as this Mac's own chats; **Sign Out and Remove Chats** deletes this Mac's copy. Your other devices keep theirs.

Showing a code or the phrase, removing a device, restoring and signing out all ask for Touch ID or your password first.

## How Devices differs from sharing

These are separate. Turning one on never turns on another.

- **Devices** is for your own Macs and iPhone.
- **[Workspaces](/workspaces)** share chosen agents with other people, one agent at a time.
- **Guest links** (**Share Agent → Guest Link**) give one person access to one agent. See [Remote Access](/remote-access).

Osaurus no longer announces your agents on the local network. Nothing else on your Wi-Fi can see them.

## iPhone app without Sync

For one release, an older Osaurus iPhone app that doesn't offer Sync can still pair the old way, with a 6-digit code. Open **Settings → Sharing → Devices → Mobile** and click **Generate 6-Digit Code**. That page also has **Your iPhone** with **Unpair**, **Remote Access for This iPhone**, and **Keep Mac Awake for This iPhone**.

Once an iPhone joins with **Add a Device**, your Mac turns the 6-digit pairing off and the older app is asked to update.

## Troubleshooting

**My devices don't see each other.** With **Same Network**, devices on different networks never meet. After a while, Devices shows **Your Devices Aren't Connecting**. Click **Use Anywhere**, and choose the same setting on each other device.

**Older chats are slow to arrive.** New messages sync first. **Older Messages** shows how many chats are still downloading. Older history waits while you're on a metered network, Low Data Mode or Low Power Mode.

**Pairing fails.** Both devices need the latest Osaurus. If the code was wrong or expired, or the other device couldn't be reached, Devices says which. Show a new code and try again.

**The iPhone says my Mac can't be reached.** The phone says whether the Mac is asleep, only reachable on the same network, or out of reach. Wake the Mac, check that **Run Agents for My Other Devices** is on, or switch to **Anywhere (Beta)**.

**I need help from support.** **Support → Support Report → Save…** writes connection details and recent sync logs, with no chat content, titles or keys.

---

## Under the hood

### The sync store

Chats live in [osaurus-sync](https://github.com/osaurus-ai/osaurus-sync), a Rust core that stores conversations as signed, end-to-end encrypted event logs and syncs them directly between devices. It's the only conversation store.

| Path | Contents |
|---|---|
| `~/.osaurus/sync/` | The core's database and encrypted attachments |
| `~/.osaurus/sync-local/` | Per-chat state that never syncs (folder bookmark, tool step logs, oversized fields) and the importer and host-run ledgers |
| `~/.osaurus/config/sync.json` | `networkEnabled`, `networkMode`, `hostAgentsForOtherDevices` |
| `~/.osaurus/config/sync-network.json` | The last good server list |
| Keychain (sync service) | Device key, account secret, database key |

On first launch with sync, chats from the old `~/.osaurus/chat-history/` database are copied in, newest first, in batches of 20 (shown under **Earlier Chats**). The old database is kept unchanged as a backup. Device-local sources (`plugin`, `http`, `channel`, `schedule`, `watcher`, `webhook`, `email`, `automation`, `selfSchedule`, `delegation`) use the same store but are never offered to other devices. The **Storage** section shows **Synced Chats**, **This Mac Only**, **Attachments** and **Total on Disk**.

### Pairing

- One offer is open at a time. The code is 12 characters from a 32-character alphabet (60 bits), admits one device, closes after five wrong attempts, and expires after 5 minutes.
- Both sides prove the code with a keyed BLAKE3 hash over both device keys, so a device that doesn't know the code can't answer. It isn't a PAKE.
- After the code checks out, both devices show the same six-digit confirmation, and the account is handed over only after you confirm on both.
- Pairing links start with `osaurus-pair:2:`. A `:1:` link from an older Mac still pairs, without the number check.

### Servers

**Anywhere (Beta)** uses Osaurus relays at `relay-us`, `relay-eu` and `relay-ap.sync.osaurus.ai` and a discovery server at `dns.sync.osaurus.ai`. The list is fetched from `https://osaurus.ai/sync/network.json`. These servers carry only your own devices' sync. They're separate from the agent relay (`*.agent.osaurus.ai`) used by [Remote Access](/remote-access) and [Workspaces](/workspaces); neither carries the other's traffic.

### Recovery phrase and removal

When linked to your Osaurus ID, the sync account secret is derived from the identity master key with HKDF-SHA256 (info `osaurus-sync/user-secret/v1`) and encoded as BIP39, so the Osaurus recovery phrase restores sync too. **Remove and Change Phrase** replaces the account identity; other devices pick it up when they next connect, and a linked account gets its own phrase again. **Remove Only** makes other devices turn away the removed device's sessions, but it still holds the old secret. The Mac's iPhone feeds ignore requests and answers older than 24 hours.

Other local data (memory, file history, tool and automation databases, the pre-sync chat backup) uses this Mac's own storage key, which no phrase recovers. Export a plaintext backup from **Settings → Privacy & Security → Data & Storage** before reinstalling macOS. See [Storage & Encryption](/storage).

### Hosted runs

When you chat with an agent **On** another Mac, that Mac runs the turn and streams the reply back through sync. Other devices show the streaming text read-only and lock that chat's composer until the final message arrives. This replaces reaching your own agents on another Mac over the agent relay.

### The retired 6-digit pairing

The legacy iPhone pairing used a SPAKE2 exchange keyed by the 6-digit code (`POST /pair/code`, `POST /pair/confirm`). It stays for one release under **Devices → Mobile**. Once an iPhone joins with **Add a Device**, the Mac revokes the old phone key, turns off the Remote Access that pairing turned on (Remote Access you enabled for a workspace, a guest link or a webhook stays on), and `/pair/*` answers `410 update_required`. The older LAN routes `GET /pair/challenge` and `POST /pair` are gone, along with per-agent Bonjour advertising.

---

**Related:**

- [Osaurus ID](/identity): your identity and its recovery phrase
- [Workspaces](/workspaces): sharing agents with other people
- [Remote Access](/remote-access): reaching one agent over the internet
- [Security & Privacy](/security): what leaves your Mac and when

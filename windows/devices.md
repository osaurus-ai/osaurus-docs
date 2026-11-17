---
title: Devices & Sync on Windows
sidebar_label: Devices & Sync
description: Link your PC with your Mac, iPhone, or another PC so your chats follow you, chat with this PC's agents from your other devices, and pair a phone or tablet with a 6-digit code.
---

# Devices & Sync

Link your own devices and your chat history follows you between them: start a chat on this PC and carry on from your Mac, your iPhone, or another Windows PC. From those devices you can also chat with an agent on this PC, and the work still runs here, with this PC's models and tools. Everything that syncs is [end-to-end encrypted](/glossary#end-to-end-encryption), so only your devices can read it.

There are two ways to reach this PC from your own devices, both under **Settings → Devices**:

- **Sync** links your devices into one account so chats follow you (below).
- **Mobile** pairs one phone or tablet with a 6-digit code, so it can use this PC's agents (see [Pair a phone or tablet](#pair-a-phone-or-tablet)).

To connect to someone else's Osaurus, or to add an agent someone shared with you, see [Apps & Devices](/windows/connections#another-osaurus).

## Get started: link a device

1. On this PC, open **Settings → Devices → Sync**.
2. Under **Add a device**, click **Show code**. The first time, Osaurus says Windows may ask whether it can use your network; choose **Allow** when it does.
3. The page shows a QR code, a code, and a **Pairing link, for another computer**. They work for 5 minutes.
4. On the other device:
   - **iPhone:** open Osaurus and scan the QR code.
   - **Another computer:** copy the pairing link. On that computer, open its Devices settings, choose to join another device, and paste the link. On another Windows PC that's **Settings → Devices → Sync → Join another device → Join…**: paste the link and click **Join**.

When it works, the page says **Device added** and your chats start copying across. The device appears under **Your devices**.

:::warning[Only use your own link]
Joining moves this PC's chats into the account of the device that showed the link. Paste only a link you can see on your own device's screen.
:::

## What syncs

- **Chats you start**, including voice calls, and the chats this PC answered for your other devices or for teammates.
- **Not synced:** chats in a [project](/windows/projects), agent drafts you're still describing, chats an agent hands to another agent, channel conversations, and [Automations](/windows/automation) runs. These stay on this PC.

Moving a synced chat into a project keeps it on this PC only, which removes it from your other devices.

Your agents themselves don't copy. Your other devices see each agent's name, description, and picture; its settings, memory, tools, and files stay on this PC.

## Chat with this PC's agents from another device

With **Run agents for my other devices** on (the default), your other devices list this PC's agents. They run here, with this PC's models and tools, and ask on the device you're chatting on before they use a tool. This PC has to be on with Osaurus running.

It works the other way too: agents on your other devices appear in this PC's sidebar under **On** *device name*. Pick one and chat as usual. While the other device is answering, the chat shows **Answering on** *device name*.

Every enabled agent you made is listed. Your other computers don't list this PC's built-in Orchestrator.

## This network or anywhere

**Find devices** decides how your devices reach each other:

- **This network** (the default): devices find each other on your Wi-Fi or Ethernet.
- **Anywhere (beta)**: devices also connect through Osaurus servers, so they sync from different networks. Chats stay end-to-end encrypted either way.

The first time an iPhone joins, Osaurus asks once whether to **Turn on Anywhere**, because a phone is rarely on the PC's network. **Not now** keeps **This network**.

**Sync chats** turns syncing off and on. Off, every chat stays on this PC until you turn it back on.

## Your devices and status

- **Status** shows the **Connection** ("Connected to 1 of 2 devices"), and how many messages are **Waiting to send**.
- **Your devices** lists each device with when it was last seen. A device that runs an older Osaurus says it needs an update.
- **Storage** shows how much space synced chats, chats on **This PC only**, and attachments take. **Support report** saves a report you can send with a bug.

## Your recovery phrase

A 24-word [recovery phrase](/glossary#recovery-phrase) brings your synced chats back if you lose every device. Without it, they can't be recovered. You don't need an [Osaurus account](/windows/account) to sync, but if you have one, the two can share a phrase:

- **Linked to your account** (the usual case when you create or restore an account on this PC): your account's phrase also restores sync. **Recovery phrase** under **Recovery** just opens **Account**.
- **Not linked**: sync has a phrase of its own. Click **Show** beside **Recovery phrase**, confirm it's you, and write the words down. If you also have an account, **Use my Osaurus recovery phrase** switches sync to your account's phrase; your other devices stop syncing with this PC until you do the same on each of them.
- **Restore from phrase** joins the account a phrase belongs to, and moves this PC's chats into it.

After **Remove and change recovery phrase…**, sync gets a new phrase of its own, shown on the page with "The old one no longer works." Write the new one down.

## Remove a device or sign out

Click **…** beside a device:

- **Remove device…** for a device you've wiped or given away. It stops receiving your chats.
- **Remove and change recovery phrase…** for a lost or stolen device. Your account gets new keys and a new phrase; your other devices pick them up the next time they connect. Osaurus asks you to confirm it's you first (Windows Hello).

Under **Storage**:

- **Sign out and keep chats** stops syncing; this PC keeps its chats and your other devices keep theirs.
- **Sign out and remove chats** deletes this PC's copy of every chat and its sync keys. Chats that didn't reach another device are lost.

## Pair a phone or tablet

**Settings → Devices → Mobile** pairs the Osaurus app on a phone or tablet with this PC using a 6-digit code. The phone can then use every agent on this PC; the work runs here. This is the older way to connect a phone, for an app that doesn't offer Sync yet. Once an iPhone joins this PC's sync, the 6-digit pairing turns itself off: the paired phone's access ends, **Reach from anywhere** goes off, and the older app is asked to update.

You need an [Osaurus account](/windows/account), and the device on the same network as the PC while you pair. If something is missing, the page says what under **Before you can pair**, with **Open Connections** or **Open Account**.

1. Open Osaurus on your phone or tablet and start pairing.
2. On the PC, click **Generate pairing code**. Windows Hello asks you to confirm it's you.
3. Type the 6-digit code into the phone. The code lasts 5 minutes, works once, and stops working after 5 wrong tries.

The phone keeps access for 90 days, or until you click **Unpair**, which ends it immediately. Only one phone or tablet can be paired at a time; pairing a new one unpairs the old one.

Once a device is paired, **Availability** offers:

- **Reach from anywhere**: use your agents away from this network, through the Osaurus [relay](/glossary#relay). Traffic stays end-to-end encrypted between your device and this PC. It needs at least one agent of your own.
- **Keep PC awake for paired device**: stops the PC sleeping on its own while a device is paired. Choosing **Sleep** or closing a laptop lid still wins.

**Continue mobile chats on this PC** brings a chat you used on the phone to the front when you come back to the PC.

From a paired phone you can chat with your agents, answer their approval cards (including the Orchestrator's setup changes), answer [Privacy Filter](/windows/privacy-filter) reviews for chats started on the phone, supply a secret an agent asks for, make and change your agents, and chat with your [workspace](/windows/workspaces) teammates' agents through this PC.

## Troubleshooting

- **Devices don't find each other:** check **Sync chats** is on. With **This network**, both have to be on the same Wi-Fi or Ethernet; to sync from different networks, choose **Anywhere (beta)**.
- **Pairing didn't finish:** the code works for 5 minutes. Click **Show code** again and use the new one.
- **"Unlock your chats":** this PC's sync keys are gone. Click **Unlock with my Osaurus recovery phrase**.
- **Osaurus closed when another PC on your network shut down:** fixed in 1.0.4. Update from the Microsoft Store.

---

## Under the hood

- Sync stores each chat as a signed, end-to-end encrypted event log ([osaurus-sync](https://github.com/osaurus-ai/osaurus-sync)), shared with the Mac and iPhone. See [Devices & Sync](/devices) for the protocol.
- The sync network doesn't start until there's a device to reach (you show a code, join, or restore), so a fresh install never meets the Windows Firewall prompt before you need it.
- Anywhere (beta) reads its server list from `osaurus.ai` and keeps the last good copy.
- Chats from before sync are copied in once; **Earlier chats** under **Status** shows the progress, and anything not yet copied is retried the next time Osaurus starts.
- While linked, the sync recovery phrase is derived from your Osaurus account's key, so restoring the account restores sync. Changing the phrase, joining another account, or restoring another phrase ends the link.
- Mobile pairing uses a password-authenticated key exchange (SPAKE2): the code never travels over the network, and every exchange uses up one of its 5 tries. The phone gets its own access key, which works only inside the encrypted [Secure Channel](/secure-channel).
- Settings live in `%LOCALAPPDATA%\osaurus\sync.json`; chats in `%LOCALAPPDATA%\osaurus\sync\`.

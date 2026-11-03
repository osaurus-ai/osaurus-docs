---
title: Your data on Windows
sidebar_label: Your Data
description: What Osaurus for Windows keeps on your PC, what it sends and when, file history for undoing agents' changes, remembered approvals, and how to erase everything.
---

# Your data on Windows

Osaurus keeps your chats, memories, keys, settings, and models on your PC, encrypted, in one folder. Nothing is sent anywhere unless you use a cloud model or a feature that needs the internet, or you agree to share usage data. Settings are in **Settings → Data & privacy** and **Settings → Behavior**.

## What leaves your PC

| What | When | Setting |
|---|---|---|
| Your messages | Only to the cloud model you chose, after the [Privacy Filter](/windows/privacy-filter) has replaced personal details | **Settings → Privacy filter** |
| Anonymous usage data | Only if you agree. Setup offers it with the box checked; nothing is sent until you've decided. Never your chats, prompts, files, or keys | **Share anonymous usage data** |
| Crash reports | On by default. File paths, web addresses, and anything shaped like a key are removed first | **Send crash reports** |
| Model and engine downloads | When you download a model, or the first time a local model needs the engine | |

## File history

Osaurus keeps an encrypted copy of every file an agent changes, so you can review a change and revert it. Under **File history**:

- **Keep file history**: **Until the chat is deleted**, **90 days**, or **30 days**.
- **Size limit**: **10 GB (default)**, 20 GB, 5 GB, 1 GB, or **No limit**. The oldest copies go first when the limit is reached.

If Osaurus can't keep a copy of what an action will change, for example a command in a very large folder, it asks before running it, even when the agent normally runs without asking.

## Remembered approvals

When you choose **Always allow** on an approval card, Osaurus remembers it for that agent and folder. **Settings → Behavior → Remembered approvals** lists every one. Click the trash button to forget one, or **Forget all**.

On the same page:

- **Tool approvals**: **Run automatically** (the default) or **Ask each time**, for tools from MCP servers. File edits and commands ask by default either way.
- **Max tool attempts**: how many tool rounds an agent may take in one reply (30 by default).

Each agent can also be set to **Ask every time** or **Deny** for file edits and commands, in its editor under **Permissions → File edits and commands**.

## Where it's kept

`%LOCALAPPDATA%\osaurus`. **Your data on this PC → Open folder** opens it, and [Installation](/windows/installation#where-osaurus-puts-things) lists what's inside. Uninstalling Osaurus doesn't remove it.

## Erase everything

**Danger zone → Reset Osaurus…** erases all Osaurus data on this PC (keys, chats, models, and settings) and quits.

- **Keep my Osaurus account** is ticked: your account and its credits stay. Untick it only if you're handing the PC to someone else, and only after saving your [recovery phrase](/windows/account#back-up-your-recovery-phrase).
- This can't be undone.

---

## Under the hood

- Databases are SQLCipher, keyed with a random 32-byte key protected by Windows DPAPI under your account.
- File history stores each copy encrypted (AES-GCM) and named by a keyed hash, so file names and contents aren't readable on disk.
- Crash reports go to Sentry, and their switch is kept in a file beside the database because crash reporting starts before the database opens. Usage data goes to Aptabase.

---
title: Your data on Windows
sidebar_label: Your Data
description: What Osaurus for Windows keeps on your PC, what it sends and when, Insights and the activity log, file history for undoing agents' changes, remembered approvals, and how to erase everything.
---

# Your data on Windows

Osaurus keeps your chats, settings, and models in one folder on your PC, with chats, keys, and settings in encrypted databases. What leaves the PC is what you send to a cloud model, what the features you use online need, crash reports (on by default, with folder names, the rest of a web address after the site's name, and key-shaped text removed), and usage data if you agree to share it. Settings are in **Settings → Privacy → Data** and **Settings → General → Behavior**.

## What leaves your PC

The main things, and where to control them:

| What | When | Setting |
|---|---|---|
| Your messages | To the cloud model you chose, after the [Privacy Filter](/windows/privacy-filter) has replaced personal details. Models on your PC send nothing, but if you've added a cloud provider, [memory](/windows/memory#which-model-writes-memories) uses it to read chats you had with a local model, except in a project that keeps to local models | **Settings → Privacy → Privacy filter** |
| Web searches and pages agents read | To your search provider or Osaurus Cloud, and to the sites themselves | **Settings → Tools → Web search** ([Web Search](/windows/web-search)) |
| Anonymous usage data | Only if you agree. Setup offers it with the box ticked, and leaving it ticked counts as agreeing; nothing is sent until you've decided. Never what you type | **Share anonymous usage data** |
| Crash reports | On by default. A file path keeps only the file's name, a web address keeps only the site's name, and anything shaped like a key or an email address is removed first. A report also lists the last screens the window showed, by name only | **Send crash reports** |
| Model and engine downloads | When you download a model, or the first time a local model or the Privacy Filter's on-device model needs one | |
| Skill update checks | Only when you click **Check for updates**, or for a source you set to **Check weekly** | **Settings → Tools → Skills** ([Skills](/windows/skills-and-mcp#keep-skills-from-github-up-to-date)) |

Features that connect to other places send what they need when you use them: [MCP servers](/windows/skills-and-mcp#mcp-servers) at a web address, GitHub skill imports and links you paste for Osaurus to set up, [Devices & Sync](/windows/devices), [channels](/windows/channels), and [workspaces](/windows/workspaces). Each page says what goes where.

**Data collection** on **Settings → Privacy → Data** holds the usage-data and crash-report switches.

## Insights

**Settings → Insights** shows what Osaurus did: every reply, search, and tool call, where each request went, what it cost, and how the models and servers are doing. It's built from the **activity log**, a record Osaurus keeps on this PC.

To see one chat alone, right-click the chat in the sidebar and choose **View insights**. That view counts the chat and the helpers it used, from its start (**Whole chat**).

At the top:

- **Scope**: which projects to count, or the one chat you opened it from.
- The period: **Today**, **7 days**, **30 days**, **Month**, or a custom range (**…**).
- **Export**: the log as **JSONL, with the hash chain**, **CSV**, or a **Markdown report**. Message content is left out unless you tick **Include message content**.
- **More** (**…**): **Check the log**, **Keep for**, **Keep message content**, and **Clear activity log…**.

Five views:

| View | What it shows |
|---|---|
| **Overview** | Cloud spend, tokens, values the Privacy Filter protected, replies, what needs attention, and the chats that cost the most |
| **Activity** | Every event, with search and filters (where it went, status, source, model, agent, whether it was filtered) |
| **Spend** | Cloud spend by agent, model, provider, project, or source, what the prompt cache saved, budgets, subscriptions, and Osaurus credits |
| **Privacy** | Where your requests went, what ran without you, projects with their own data rules, and how many values were protected. Counts only: the values stay in the encrypted database |
| **Health** | Your models, this PC's engine and GPU memory, MCP servers, and background work that failed |

**What the log keeps.** By default the activity log keeps records for **30 days**, and keeps **message content** with them. Change both under **More** (or on the **Privacy** view): **Keep for** offers **7 days**, **30 days**, **90 days**, **A year**, or **Forever**, and turning off **Keep message content** stops content being stored. Credentials are removed from what's stored either way. **Clear activity log…** erases every record on this PC and can't be undone; the log keeps one entry saying it was cleared.

## File history

Osaurus keeps what it needs to put back the changes an agent makes in a folder, so you can review a change and revert it: an encrypted copy of each file as it was, or, for a file your git repository already holds, a note to restore it from git. Folders git ignores aren't tracked. Under **File history** on **Settings → Privacy → Data**:

- **Keep copies**: **Until the chat is deleted**, **90 days**, or **30 days**.
- **Size limit**: **10 GB (default)**, 20 GB, 5 GB, 1 GB, or **No limit**. The oldest copies go first when the limit is reached.
- **Space used** shows how much the copies take.

If Osaurus can't keep a copy of what an action will change, for example a command in a very large folder, it asks before running it, even when tools otherwise run without asking.

## Remembered approvals

When you choose **Always allow** on an approval card, Osaurus remembers it for that agent and folder. **Settings → General → Behavior → Remembered approvals** lists every one. Click the trash button to forget one, or **Forget all**.

On the same page:

- **Tool approvals**: **Run tools without asking** (the default) or **Ask before each tool**. It covers every tool, built-in and MCP, for every agent that follows it. Some actions ask either way, such as a change that can't be undone or one outside the chat's folder.
- **Tool rounds per reply**: how many tool rounds an agent may take in one reply (30 by default, up to 120).

Each agent can also choose its own approval setting, and set file edits and commands to **Ask every time** or **Deny**, in its editor under **Permissions**. See [Sandbox](/windows/sandbox#asking-before-a-command-runs) for commands that never need asking.

## Where it's kept

`%LOCALAPPDATA%\osaurus`. **Your data on this PC → Data folder → Open folder** opens it, and [Installation](/windows/installation#where-osaurus-puts-things) lists what's inside. **What agents remember → Manage** opens [Memory](/windows/memory).

Uninstalling Osaurus keeps this folder: your chats, keys, settings, and models stay. To remove it, reset Osaurus before you uninstall, or delete the folder afterward.

## Erase everything

**Reset Osaurus → Reset…** at the bottom of **Settings → Privacy → Data** erases all Osaurus data on this PC (API keys, chats, downloaded models, and themes) and quits. The dialog lists what will be erased.

- If you have an Osaurus account, **Keep my Osaurus account** is ticked: your account and its balance stay. Untick it only if you're handing the PC to someone else, and only after saving your [recovery phrase](/windows/account#back-up-your-recovery-phrase).
- Tick the box confirming you understand, then click **Reset & quit**. This can't be undone.

---

## Under the hood

- Databases are SQLCipher, keyed with a random 256-bit key protected by Windows DPAPI under your account.
- The activity log is its own SQLCipher file, `activity.db`, keyed the same way. Each record's hash covers the one before, so **Check the log** can tell if records were edited, removed, or reordered; someone who can write your files could still rewrite the whole chain. A stored body is capped at 256 KB.
- File history stores each copy encrypted (AES-GCM) and named by a keyed hash, so file names and contents aren't readable on disk.
- Crash reports go to Sentry, and their switch is kept in a file beside the database because crash reporting starts before the database opens. Their trail of screens carries page and section names, never a chat's title, an agent's name, or anything typed. Usage data goes to Aptabase.

---
title: Installing Osaurus for Windows
sidebar_label: Installation
description: Install Osaurus for Windows from the Microsoft Store. It's free, updates itself, and keeps your data in one folder on your PC.
---

# Installing Osaurus for Windows

Osaurus for Windows is a free app from the Microsoft Store, for Windows 11. Install it like any Store app; the Store keeps it up to date after that.

<div style={{textAlign: 'center', margin: '2rem 0'}}>
<a href="https://apps.microsoft.com/store/detail/9P2W5T5WTTZ1?cid=OsaurusDocs" class="button button--primary button--lg">Get it from the Microsoft Store</a>
</div>

## Get started

1. **Open the Store page** with the button above, or search for **Osaurus** in the Microsoft Store app.
2. Click **Get** (or **Install**).
3. **Open Osaurus** from the Start menu. A short setup asks a few questions and builds your first team of [agents](/glossary#agent). See [Quick Start](/windows/quickstart).

You don't need to install anything else first: everything Osaurus needs comes in the package. Local AI models are downloaded later, when you choose one.

### Install with winget

If you'd rather use a terminal, Osaurus can be installed with [winget](https://learn.microsoft.com/windows/package-manager/winget/), Windows's package manager:

```powershell
winget install 9P2W5T5WTTZ1 -s msstore --accept-package-agreements
```

`--accept-package-agreements` lets it run without pausing to ask you to agree to the Store license. The install is the same as one from the Store app, and the Store keeps it up to date.

## System requirements

- **Windows 11**, on an x64 or ARM64 PC
- **Free disk space** for each [local model](/glossary#local-model) you download. Most take a few gigabytes; the starter model, Raptor 0.7 4B, is about 3.4 GB.
- **A graphics card is optional.** To run Osaurus's recommended model on this PC, setup looks for a graphics card with 12 GB of its own memory (VRAM) or more. Without one, setup suggests [Osaurus Cloud](/glossary#osaurus-cloud) instead, and you can still download smaller models later. [Cloud models](/glossary#cloud-model) need only an internet connection.

A few features need more:

| Feature | Needs |
|---|---|
| [Sandbox](/glossary#sandbox) on Linux | WSL 3.0.1 or newer (`wsl --update`) and the **Virtual Machine Platform** Windows feature |
| [Sandbox](/glossary#sandbox) with the **Windows (no setup)** engine | Windows 11 24H2 or later, with the August 2026 update |
| Keeping agents' commands inside the folder you attach | Windows 11 24H2 or later, with the August 2026 update |
| Voice calls and dictation | A microphone. See [Voice](/windows/voice). |

## Updates

The Microsoft Store updates Osaurus automatically. After an update, a **New in …** line appears under the message box of a new chat; click it to read what changed.

To see your version, open **Settings** (bottom of the sidebar) and click **About**, at the foot of the section list. The version is at the top, with **Check for updates**, which opens the Store's downloads and updates page. Below it, every release's notes are listed, newest first.

## Start at sign-in

Osaurus can start when you sign in to Windows, waiting in the system tray so its server is ready for other apps. Turn on **Settings → General → Behavior → Start at login**. It's off by default, and Windows also lists it under **Settings → Apps → Startup**.

Closing the Osaurus window doesn't quit it: it keeps running in the tray. To quit, right-click the tray icon and choose **Quit Osaurus**.

## Uninstall

1. Quit Osaurus (right-click its tray icon → **Quit Osaurus**).
2. Open Windows **Settings → Apps → Installed apps**, find **Osaurus**, and choose **Uninstall**.

Uninstalling **keeps your data**: chats, keys, settings, and downloaded models stay on your PC, so reinstalling picks up where you left off. To remove them too, do one of these:

- **Before uninstalling**, open **Settings → Privacy → Data** and click **Reset…** beside **Reset Osaurus**, then **Reset & quit**. It erases everything Osaurus keeps on this PC and quits. Leave **Keep my Osaurus account** checked if you want to keep your [account](/glossary#osaurus-id) and its credits.
- **After uninstalling**, delete the folder `%LOCALAPPDATA%\osaurus`.

:::warning
Both of these can't be undone. If you didn't keep your account, you need its [recovery phrase](/glossary#recovery-phrase) to get it back on any PC. You can see it in **Settings → Account → Show recovery phrase**.
:::

---

## Under the hood

### Where Osaurus puts things

Everything lives in one folder, `%LOCALAPPDATA%\osaurus` (usually `C:\Users\<you>\AppData\Local\osaurus`). The **Open folder** button beside **Data folder** in **Settings → Privacy → Data** opens it.

| What | Where |
|---|---|
| Chats, settings, agents, memory, keys | Encrypted databases in the data folder |
| Local models (GGUF) | `models\`; change it in **Settings → Models → Models**, under **Engine → Models folder** |
| Local engine builds (llama.cpp) | `engines\` |
| File history (undo for agents' file changes) | `file-history\` |
| Logs | `logs\` |
| Bundle imports | `import\` |

The databases are encrypted with SQLCipher. Their key is a random 32-byte key protected with Windows DPAPI, so it opens only under your Windows account on this PC.

The Store package writes this one folder directly rather than into its private package storage, which is why it survives an uninstall.

To run Osaurus against a different data folder (for testing), set the `OSAURUS_DATA_DIR` environment variable. The `osaurus` command takes `--data-dir` for the same purpose; see [CLI on Windows](/windows/cli).

### Test the local server

Osaurus serves its API on `http://127.0.0.1:1337` while it runs:

```powershell
curl.exe http://127.0.0.1:1337/health
```

Use `curl.exe`, not `curl`, in Windows PowerShell: there `curl` is an alias for `Invoke-WebRequest`.

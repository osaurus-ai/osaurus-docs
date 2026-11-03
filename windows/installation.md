---
title: Installing Osaurus for Windows
sidebar_label: Installation
description: Install Osaurus for Windows from the Microsoft Store. It's free, updates itself, and keeps your data in one folder on your PC.
---

# Installing Osaurus for Windows

Osaurus for Windows is a free app from the Microsoft Store. It's in public beta, and it needs Windows 11. Install it like any Store app; it updates itself after that.

<div style={{textAlign: 'center', margin: '2rem 0'}}>
<a href="https://apps.microsoft.com/store/detail/9P2W5T5WTTZ1?cid=OsaurusDocs" class="button button--primary button--lg">Get it from the Microsoft Store</a>
</div>

## Get started

1. **Open the Store page** with the button above, or search for **Osaurus Beta** in the Microsoft Store app.
2. Click **Get** (or **Install**). The download is about 130 MB.
3. **Open Osaurus** from the Start menu. A short setup walks you through your first assistant. See [Quick Start](/windows/quickstart).

You don't need to install anything else first: everything Osaurus needs comes in the package.

## System requirements

- **Windows 11**, on an x64 or ARM64 PC
- **2–20 GB** of free space for each [local model](/glossary#local-model) you download
- **A graphics card is optional.** Local models run fastest on a graphics card with plenty of its own memory (VRAM): about 12 GB lets Osaurus set one up for you during setup. Smaller cards and processors without one still run smaller models, just more slowly. [Cloud models](/glossary#cloud-model) need only an internet connection.

A few features need more:

| Feature | Needs |
|---|---|
| [Sandbox](/glossary#sandbox) on Linux | WSL 3.0.1 or newer (`wsl --update`) and the **Virtual Machine Platform** Windows feature |
| [Sandbox](/glossary#sandbox) with the **Windows (no setup)** engine | Windows 11 24H2 or later, with the August 2026 update |
| Containing agents' commands to the folder you attach | Windows 11 24H2 or later, with the August 2026 update |

## Updates

The Microsoft Store updates Osaurus automatically. After an update, the next launch shows what's new. To see your version, open **Settings** (bottom of the agent sidebar) → **Providers**: it's at the bottom of the page, next to **What's new**.

## Start at sign-in

Osaurus can start when you sign in to Windows, waiting in the system tray so its server is ready for other apps. Turn on **Settings → Behavior → Start at login**. It's off by default, and Windows also lists it under **Settings → Apps → Startup**.

Closing the Osaurus window doesn't quit it: it keeps running in the tray. To quit, right-click the tray icon and choose **Quit Osaurus**.

## Uninstall

1. Quit Osaurus (right-click its tray icon → **Quit Osaurus**).
2. Open Windows **Settings → Apps → Installed apps**, find **Osaurus Beta**, and choose **Uninstall**.

Uninstalling **keeps your data**: chats, keys, settings, and downloaded models stay on your PC, so reinstalling picks up where you left off. To remove them too, do one of these:

- **Before uninstalling**, open **Settings → Data & privacy → Reset Osaurus…**. It erases everything Osaurus keeps on this PC and quits. Leave **Keep my Osaurus account** checked if you want to keep your [account](/glossary#identity) and its credits.
- **After uninstalling**, delete the folder `%LOCALAPPDATA%\osaurus`.

:::warning
Both of these can't be undone. If you didn't keep your account, you need its [recovery phrase](/glossary#recovery-phrase) to get it back on any PC. You can back it up in **Settings → Account**.
:::

---

## Under the hood

### Where Osaurus puts things

Everything lives in one folder, `%LOCALAPPDATA%\osaurus` (usually `C:\Users\<you>\AppData\Local\osaurus`). The **Open folder** button in **Settings → Data & privacy** opens it.

| What | Where |
|---|---|
| Chats | `conversations.db` |
| Settings, agents, memory, keys | Encrypted databases in the data folder |
| Local models (GGUF) | `models\`; change it in **Settings → Models → Local engine → Models folder** |
| Local engine builds (llama.cpp) | `engines\` |
| File history (undo for agents' file changes) | `file-history\` |
| Logs | `logs\` |
| Bundle imports | `import\` |

The databases are encrypted with SQLCipher. Their key is a random 32-byte key protected with Windows DPAPI, so it opens only under your Windows account on this PC.

Store apps normally have their writes redirected into a private folder that uninstalling deletes. Osaurus is exempt for exactly `%LOCALAPPDATA%\osaurus`, which is why your data survives an uninstall.

To run Osaurus against a different data folder (for testing), set the `OSAURUS_DATA_DIR` environment variable. The `osaurus` command takes `--data-dir` for the same purpose; see [CLI on Windows](/windows/cli#using-a-separate-profile).

### Test the local server

Osaurus serves its API on `http://127.0.0.1:1337` while it runs:

```powershell
curl.exe http://127.0.0.1:1337/health
```

Use `curl.exe`, not `curl`, in Windows PowerShell: there `curl` is an alias for `Invoke-WebRequest`.

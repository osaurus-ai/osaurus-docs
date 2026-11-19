---
title: Troubleshooting on Windows
sidebar_label: Troubleshooting
description: Fixes for common problems with Osaurus for Windows. The port is taken, a reply stopped, a model is slow or won't fit, the sandbox won't start, and the osaurus command isn't found.
---

# Troubleshooting on Windows

Most problems have a quick fix. If yours isn't here, open **Settings → About** and click **Report a problem**: it opens a new post on the [community forum](https://community.osaurus.ai/tag/windows/2) with your Osaurus and Windows versions already filled in. **Copy system info**, at the bottom of the same page, copies those details for anywhere else.

## "Port 1337 is already in use"

Osaurus serves its API on port 1337. If another program already uses that port, Osaurus shows this window when it opens: **Osaurus can't start its local server until it has a port of its own.** You have three ways out:

- **Free up the port**: click **Open Task Manager** to find and close the other program, then click **Try again**.
- **Move Osaurus to another port**: type a free port and click **Use port …**. Osaurus starts on the new port and keeps using it.
- **Quit**.

You can change the port later in **Settings → Devices → Connections**, under **Network access**. Apps you've pointed at `127.0.0.1:1337`, such as Claude Code, Cursor or your own scripts, then need the new port too.

## A reply stopped partway

If you stopped a reply, or Osaurus closed while an agent was working, the reply is kept up to the point it stopped. A line under it says why (**Stopped before the reply finished.** or **Cut off when Osaurus closed.**). Click **Continue** on that line to carry the reply on from where it stopped, without sending a new message. See [Chatting in Osaurus](/windows/chat#continue-a-reply-that-stopped).

## "Sign in again" or "Out of credits"

These appear in the panel beside a chat, under what needs you.

- **Sign in again**: your sign-in with a provider (such as your ChatGPT plan) has expired, and replies fail until you sign in. Click **Sign in**.
- **Out of credits**: your [Osaurus Cloud](/glossary#osaurus-cloud) balance has run out, and this model stops until you add more. Click **Add credits**, or pick a different model for the chat.

## A local model is slow

See also [Local models](/windows/models).

- **Check its fit badge** in **Settings → Models → Models**. **Runs well** and **Tight fit** mean it fits. **GPU + RAM** means part of the model runs from system memory, which is slower; **GPU + RAM + SSD** means some of it is even read from your disk, slowly. **Too large** means it won't run well on this PC. Pick a smaller model, or a smaller build ([quantization](/glossary#quantization)) of the same one.
- **Check the accelerator**: on the same page, under **Engine**, see **Accelerator**. **Auto (recommended)** picks the fastest your PC has. If your graphics card isn't being used, update its driver, or pick **NVIDIA CUDA** or **Vulkan (any GPU)** yourself, then restart Osaurus when it asks.
- **Close other programs using the graphics card**, such as games and other AI apps. Osaurus judges fit by what's free right now.
- **Measure it** with `osaurus bench` in a terminal. See [CLI on Windows](/windows/cli).

## "A model is waiting to load"

When something else is using your graphics card (an image model, a game), a local model might have to run partly from system memory, which is much slower. Osaurus asks before it does: a card in the chat explains why and lists what is **Using the GPU now**. Click **Load anyway** to go ahead slowly, or **Cancel**, close what's using the graphics card, and send again.

## The sandbox won't start

Osaurus says what's missing in **Settings → Tools → Sandbox**. The usual causes are below; [Sandbox](/windows/sandbox) has the full list.

- **"The sandbox needs WSL containers"**: run `wsl --update` in a terminal (you need WSL 3.0.1 or newer), then restart Osaurus.
- **"The sandbox needs the Virtual Machine Platform Windows feature"**: turn it on in **Windows Features** (search for "Turn Windows features on or off") and restart the PC.
- **"Your organization has turned off WSL containers on this PC"**: your IT department has blocked them. Ask them, or switch **Engine** to **Windows (no setup)**, which needs no WSL but does need Windows 11 24H2 with the August 2026 update.

## "This version of Windows can't contain commands"

Keeping an agent's commands inside the folder you attached needs Windows 11 24H2 or later, with the August 2026 update. On an older Windows, commands still run, just without that limit, and Osaurus still asks before running them. Install the latest Windows updates to turn it on.

## `osaurus` is not recognized

The `osaurus` command comes with the app.

1. **Open a new terminal.** One that was open during the install doesn't see the command yet.
2. **Check the alias is on:** Windows **Settings → Apps → Advanced app settings → App execution aliases**, and turn on **Osaurus**.
3. **Check your `PATH`** includes `%LOCALAPPDATA%\Microsoft\WindowsApps`. Windows adds it by default, but some setups remove it.

## I closed the window, but Osaurus is still running

That's on purpose: Osaurus keeps its server running in the system tray, so other apps can still reach it. Right-click the tray icon and choose **Quit Osaurus** to exit, or **Show Osaurus** to bring the window back.

## Starting over

To go through first-run setup again without erasing anything, open **Settings → General → Behavior** and click **Run setup again**.

To erase everything, open **Settings → Privacy → Data** and click **Reset…** beside **Reset Osaurus**. **Reset & quit** erases everything Osaurus keeps on this PC and quits. Leave **Keep my Osaurus account** checked to keep your account and its credits. This can't be undone. See [Uninstall](/windows/installation#uninstall).

---

## Under the hood

`osaurus doctor` reports the command's version, the data folder, the app package, the port and the endpoint file the server wrote, whether the server answers `/health`, whether another program holds the port, and how many bundle imports are queued, then a one-word diagnosis and what to do next. `--json` prints it as JSON; `--redact` removes your user name and home folder. Run `osaurus doctor --redact` before pasting the result anywhere public. See [CLI on Windows](/windows/cli).

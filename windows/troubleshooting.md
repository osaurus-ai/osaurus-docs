---
title: Troubleshooting on Windows
sidebar_label: Troubleshooting
description: Fixes for common problems with Osaurus for Windows — the port is taken, the osaurus command isn't found, a model is slow or won't fit, and the sandbox won't start.
---

# Troubleshooting on Windows

Most problems have a quick fix. If yours isn't here, run `osaurus doctor --redact` in a terminal and post the result in the [community forum](https://community.osaurus.ai/tag/windows/2).

## "Osaurus can't start its local server"

Osaurus serves its API on port 1337. If another program already uses that port, Osaurus shows this window when it opens, with three choices:

- **Open Task Manager** to find and close the other program, then click **Try again**.
- **Move Osaurus to another port**.
- **Quit**.

You can change the port later in **Settings → Connections → Network access**. Apps you've pointed at `127.0.0.1:1337` then need the new port too.

## `osaurus` is not recognized

The `osaurus` command comes with Osaurus 0.1.9 and later.

1. **Open a new terminal.** One that was open during the install doesn't see the command yet.
2. **Check the alias is on:** Windows **Settings → Apps → Advanced app settings → App execution aliases**, and turn on **Osaurus**.
3. **Check your `PATH`** includes `%LOCALAPPDATA%\Microsoft\WindowsApps`. Windows adds it by default, but some setups remove it.

## A local model is slow

- **Check its fit badge** in **Settings → Models**. **GPU + RAM** means part of the model runs from system memory, which is slower; **Too large** means it won't run well on this PC. Pick a smaller model, or a smaller build (quantization) of the same one.
- **Check the accelerator:** **Settings → Models → Local engine → Accelerator**. **Auto (recommended)** uses CUDA on an NVIDIA card with its driver installed, then Vulkan, then the processor. If your graphics card isn't being used, update its driver, or pick **NVIDIA CUDA** or **Vulkan (any GPU)** yourself. The change takes effect after a restart.
- **Close other programs using the graphics card**, such as games and other AI apps. Osaurus judges fit by what's free right now.
- **Measure it** with `osaurus bench` in a terminal. See [CLI on Windows](/windows/cli#osaurus-bench).

## The sandbox won't start

Osaurus says what's missing in **Settings → Sandbox**. The usual causes:

- **"The sandbox needs WSL containers"**: run `wsl --update` in a terminal (you need WSL 3.0.1 or newer), then restart Osaurus.
- **"The sandbox needs the Virtual Machine Platform Windows feature"**: turn it on in **Windows Features** (search for "Turn Windows features on or off") and restart the PC.
- **A message about your organization's policy**: your IT department has blocked WSL containers. Ask them, or switch **Engine** to **Windows (no setup)**, which needs no WSL but does need Windows 11 24H2 with the August 2026 update.

## "This version of Windows can't contain commands"

Keeping an agent's commands to the folder you attached needs Windows 11 24H2 or later, with the August 2026 update. On an older Windows, commands still run, just without that limit, and Osaurus still asks before running them. Install the latest Windows updates to turn it on.

## I closed the window, but Osaurus is still running

That's on purpose: Osaurus keeps its server running in the system tray, so other apps can still reach it. Right-click the tray icon and choose **Quit Osaurus** to exit, or **Show Osaurus** to bring the window back.

## Starting over

**Settings → Data & privacy → Reset Osaurus…** erases everything Osaurus keeps on this PC and quits. Leave **Keep my Osaurus account** checked to keep your account and its credits. This can't be undone. See [Uninstall](/windows/installation#uninstall).

---

## Under the hood

`osaurus doctor` reports the command's version, the data folder, the app package, the port and the `server.json` the server wrote, whether the server answers `/health`, and how many bundle imports are queued, then a one-word diagnosis. `--json` prints it as JSON; `--redact` removes your user name and home folder. See [CLI on Windows](/windows/cli#osaurus-doctor).

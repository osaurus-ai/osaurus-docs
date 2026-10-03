---
title: Installation
sidebar_label: Installation
description: Download and install Osaurus on your Mac in about a minute. It's free, and Apple has checked it so it opens without warnings.
---

# Installation

Osaurus is a free Mac app. To install it, download it, drag it into your Applications folder, and open it. You need a Mac with an M-series chip ([Apple Silicon](/glossary#apple-silicon)) running macOS 15.5 or later.

<div style={{textAlign: 'center', margin: '2rem 0'}}>
<a href="https://osaurus.ai/" class="button button--primary button--lg">Download from osaurus.ai</a>
&nbsp;&nbsp;
<a href="https://github.com/osaurus-ai/osaurus/releases/latest" class="button button--secondary button--lg">Latest release on GitHub</a>
</div>

## Get started

1. **Download** Osaurus from [osaurus.ai](https://osaurus.ai/) (or from [GitHub Releases](https://github.com/osaurus-ai/osaurus/releases/latest)). The file ends in `.dmg`.
2. **Open** the downloaded file and drag **Osaurus** into your **Applications** folder.
3. **Eject** the downloaded disk (click the eject icon next to it in Finder), then open Osaurus. A quick way: press `⌘ Space`, type "Osaurus", and press Return.

Apple has checked and approved Osaurus (it's signed and "notarized"), so it opens without security warnings. The app updates itself when you open it, so you don't need to come back here for new versions.

**Next:** [Quick Start →](/quickstart) walks you through first launch.

## System requirements

- **macOS 15.5** or later
- **Apple Silicon** (M1, M2, M3, or newer)
- **2–20 GB** of free space for each [local model](/glossary#local-model) you download

:::info[macOS 26 features]
[Apple Intelligence](/models/apple-intelligence) models need macOS 26 (Tahoe) or later. The [Sandbox](/glossary#sandbox) (a sealed-off area where agents can run code) works on both macOS 15 and 26, with a fuller setup on macOS 26.
:::

## Pick a build

Each release comes in two downloads. They're the same app; the difference is whether an AI model comes included.

| Download | Size | Who it's for |
|---|---|---|
| **Standard** | ~80 MB | Most people. During setup you download a model or start on [Osaurus Cloud](/glossary#osaurus-cloud). |
| **Full** | ~3.6 GB | People who want to chat offline right away. It includes the **Raptor 0.6** model, so setup skips the download. |

The full download is linked from each [release's notes](https://github.com/osaurus-ai/osaurus/releases/latest) and is also hosted on [Hugging Face](https://huggingface.co/datasets/OsaurusAI/osaurus-releases). After a full install, future updates are the small standard download.

## Permissions

Osaurus only asks for a permission when you first use a feature that needs it. macOS shows the request, and you can change your answer later in **System Settings → Privacy & Security**.

| Permission | What it's for |
|---|---|
| Microphone | Talking to Osaurus, starting a chat with a [wake word](/glossary#wake-word), and Transcription Mode |
| Screen Recording | Capturing your Mac's sound for [transcription](/glossary#transcription) |
| Accessibility | Transcription Mode (typing into other apps for you) |
| Network | Cloud models, online tools, and [Public Links](/glossary#public-link) |
| Files | [Working Folders](/glossary#working-folder) (one folder at a time, and only the ones you pick) |

## Troubleshooting

### "Cannot be opened" error

This shouldn't normally happen, because releases are checked by Apple. If you see it, the download was probably damaged or came from an unofficial site. Delete the app, download it again from [osaurus.ai](https://osaurus.ai/) or [GitHub Releases](https://github.com/osaurus-ai/osaurus/releases/latest), and reinstall. As a last resort, open **System Settings → Privacy & Security**, scroll to the message about Osaurus, and click **Open Anyway**.

### `osaurus` command not found

This only matters if you use the Terminal. See [Install the command-line tool](#verify-the-cli) below.

### Some data won't open after upgrading or moving to a new Mac

Osaurus never deletes your data when it can't open it. Go to **Settings… → General → Advanced → Data & Storage → Stores Needing Attention**, where each affected item has **Retry** and **Reset** buttons. Anything you reset is moved aside, not deleted. [Full guide →](/storage)

## Uninstall

1. Quit Osaurus.
2. Drag **Osaurus** from your **Applications** folder to the Trash.
3. *(Optional)* To remove your chats, memory, and downloaded models too, see [Remove everything](#remove-everything) below.

:::warning
Removing your data can't be undone. To keep a copy of your chats and memory first, use **Settings… → General → Advanced → Data & Storage → Export plaintext backup…**.
:::

---

## Under the hood

### Build files

| Build | File name | Notes |
|---|---|---|
| Standard | `Osaurus-<version>.dmg` | Homebrew and in-app updates use this build. |
| Full | `Osaurus-<version>-full.dmg` | First launch installs the bundled Raptor 0.6 into `~/MLXModels`, and onboarding skips the AI setup step. |

Osaurus is Developer ID signed and notarized by Apple. Updates install automatically through Sparkle when you launch the app. File access for Working Folders uses macOS security-scoped bookmarks.

### Install with Homebrew

If you'd rather use Homebrew:

```bash
brew install --cask osaurus
```

This installs the standard build, puts **Osaurus.app** in your Applications folder, and lets Homebrew manage the **`osaurus` CLI** link in its own prefix. Update with `brew upgrade --cask osaurus`; don't replace that managed link manually.

### Where Osaurus puts things

| What | Path |
|---|---|
| Local models (MLX) | `~/MLXModels/` (override with `OSU_MODELS_DIR`) |
| App data | `~/.osaurus/` |
| Voice models | `~/Library/Application Support/FluidAudio/Models/` |
| Encrypted databases | `~/.osaurus/{chat-history,memory,methods,tool-index}/*.sqlite` |
| Encryption key | macOS Keychain (`com.osaurus.storage`) |
| Quarantined (reset) stores | `~/.osaurus/quarantine/` |

To put models on an external drive:

```bash
export OSU_MODELS_DIR=/Volumes/External/MLXModels
```

### Verify the CLI

If you installed from the DMG, the easiest way to get the `osaurus` command-line tool on your PATH is **Settings… (`⌘ ,`) → Server → Overview → Command Line Tool → Install CLI**. Then check it from the terminal:

```bash
osaurus --version
osaurus serve         # starts the local server
osaurus status        # confirms it's up
osaurus stop          # stops it
```

If `osaurus` still isn't on your PATH, link it manually without writing into Homebrew's managed prefix:

```bash
cli="/Applications/Osaurus.app/Contents/Helpers/osaurus"
[ -x "$cli" ] || cli="/Applications/Osaurus.app/Contents/MacOS/osaurus"

bin="/usr/local/bin"
if [ ! -d "$bin" ] || [ ! -w "$bin" ]; then
  bin="$HOME/.local/bin"
  mkdir -p "$bin"
fi
ln -sf "$cli" "$bin/osaurus"
```

If the link lands in `~/.local/bin`, add that directory to your shell:

```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

From a source checkout, `scripts/release/install_cli_symlink.sh` follows the same `/usr/local/bin` then `~/.local/bin` order. Pass `--prefix <directory>` only when you explicitly want `<directory>/bin`.

Test that the local server is up:

```bash
curl http://127.0.0.1:1337/health
```

### Remove everything

```bash
# If you installed via Homebrew
brew uninstall --cask osaurus

# If you installed manually
rm -rf /Applications/Osaurus.app
rm /usr/local/bin/osaurus 2>/dev/null
rm ~/.local/bin/osaurus 2>/dev/null

# Optional: remove all your data
rm -rf ~/MLXModels
rm -rf ~/.osaurus

# Optional: remove the storage encryption key from Keychain
# (only present if you opted in to storage encryption)
security delete-generic-password -s com.osaurus.storage -a data-encryption-key
```

Removing `~/.osaurus` is irreversible. Export a plaintext backup first if you want to keep your chats and memory.

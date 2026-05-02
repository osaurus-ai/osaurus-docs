---
title: Installation
sidebar_label: Installation
description: Install Osaurus via Homebrew or download the latest signed build from GitHub Releases.
sidebar_position: 2
---

# Installation

Osaurus is a native macOS app for Apple Silicon. Most people install it once with Homebrew and forget about it.

## System requirements

- **macOS 15.5** or later
- **Apple Silicon** (M1, M2, M3, or newer)
- **2–20 GB** free space per local model

:::info macOS 26 features
The [Sandbox](/agent-loop) (running agent code in an isolated Linux VM) and [Apple Foundation Models](/models/apple-intelligence) require macOS 26 (Tahoe) or later. Osaurus itself runs fine on 15.5+ — those features just stay disabled.
:::

## Homebrew (recommended)

```bash
brew install --cask osaurus
```

This installs:

- **Osaurus.app** in your Applications folder
- The **`osaurus` CLI** (linked into your `PATH` automatically)
- **Auto-updates** through `brew upgrade`

### First launch

1. Launch from Spotlight (`⌘ Space` → "Osaurus") or run `osaurus ui`
2. Look for the Osaurus icon in your menu bar
3. The first time you open it on 0.17.7+, you'll see a brief **"Securing your data"** overlay — that's the [storage encryption migration](/storage), and it usually finishes in under a second

### Updating

```bash
brew update
brew upgrade --cask osaurus
```

The app also auto-updates via Sparkle when you launch it, so manual upgrades are mostly for keeping `brew` happy.

## Direct download

If you prefer a manual install:

1. Visit [GitHub Releases](https://github.com/osaurus-ai/osaurus/releases/latest)
2. Download the `.dmg`
3. Open it and drag Osaurus to **Applications**
4. Eject the DMG

### First launch (DMG)

The DMG is signed but not notarized, so the first launch needs:

1. **Right-click** Osaurus.app and choose **Open**
2. Click **Open** in the security dialog

You only need to do this once.

### Manual CLI setup

If `osaurus` isn't on your PATH after a manual install, link it:

```bash
ln -sf "/Applications/Osaurus.app/Contents/MacOS/osaurus" "$(brew --prefix)/bin/osaurus"
```

Or add the bundle to your shell:

```bash
echo 'export PATH="/Applications/Osaurus.app/Contents/MacOS:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

## Verify it works

```bash
osaurus --version
osaurus serve         # starts the local server
osaurus status        # confirms it's up
osaurus stop          # stops it
```

In another terminal, test the API:

```bash
curl http://127.0.0.1:1337/health
```

## Where things live

| What | Path | Override |
|------|------|----------|
| Local models (MLX) | `~/MLXModels` | `OSU_MODELS_DIR` env var |
| App data | `~/.osaurus/` | not configurable |
| Voice models (FluidAudio) | `~/Library/Application Support/FluidAudio/Models/` | not configurable |
| Encrypted databases | `~/.osaurus/{chat-history,memory,methods,tool-index}/*.sqlite` | see [Storage](/storage) |
| Encryption key | macOS Keychain (`com.osaurus.storage`) | see [Storage](/storage) |

```bash
export OSU_MODELS_DIR=/Volumes/External/MLXModels
```

## Permissions

Osaurus requests permissions only when you use the feature that needs them:

| Permission | Required for |
|------------|--------------|
| Microphone | Voice input, VAD wake-word, Transcription Mode |
| Screen Recording | Capturing system audio for transcription |
| Accessibility | Transcription Mode (typing into other apps) |
| Network | Cloud providers, MCP, Relay tunnels |
| Files | Working folders (per-folder, via security-scoped bookmarks) |

You'll be prompted in System Settings → Privacy & Security as you go.

## Troubleshooting

### "Cannot be opened" error

System Settings → Privacy & Security → scroll to the security message → **Open Anyway**.

### `osaurus` command not found

```bash
ls /Applications/Osaurus.app/Contents/MacOS/osaurus
ln -sf "/Applications/Osaurus.app/Contents/MacOS/osaurus" "$(brew --prefix)/bin/osaurus"
```

### Storage migration "failed" notice

If the first-launch migration shows a partial failure, the originals are kept at `~/.osaurus/.pre-encryption-backup/`. Open **Settings → Storage** for recovery options. [Full guide →](/storage)

## Uninstall

```bash
# Homebrew
brew uninstall --cask osaurus

# Manual
rm -rf /Applications/Osaurus.app
rm /usr/local/bin/osaurus 2>/dev/null

# Optional: remove all data
rm -rf ~/MLXModels
rm -rf ~/.osaurus

# Optional: remove the storage encryption key from Keychain
security delete-generic-password -s com.osaurus.storage -a data-encryption-key
```

:::warning
Removing `~/.osaurus` and the Keychain entry is irreversible. Use **Settings → Storage → Export plaintext backup** first if you want to keep your chats and memory.
:::

---

**Next:** [Quick Start →](/quickstart) — your first conversation in 5 minutes.

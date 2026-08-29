---
title: Installation
sidebar_label: Installation
description: Download Osaurus for macOS in under a minute. Native Apple Silicon, signed and notarized, free.
---

# Installation

Osaurus is a native macOS app for Apple Silicon. The fastest way to get it is the download button on the home page — drag it to Applications and you're done.

<div style={{textAlign: 'center', margin: '2rem 0'}}>
<a href="https://osaurus.ai/" class="button button--primary button--lg">Download from osaurus.ai</a>
&nbsp;&nbsp;
<a href="https://github.com/osaurus-ai/osaurus/releases/latest" class="button button--secondary button--lg">Latest release on GitHub</a>
</div>

## System requirements

- **macOS 15.5** or later
- **Apple Silicon** (M1, M2, M3, or newer)
- **2–20 GB** free space per local model

:::info[macOS 26 features]
[Apple Foundation Models](/models/apple-intelligence) require macOS 26 (Tahoe) or later. The [Sandbox](/agent-loop#configure-the-sandbox) uses an isolated Linux VM on macOS 26+ and automatically falls back to a Seatbelt-confined backend on macOS 15 — sandboxed execution works either way.
:::

## Install in 3 steps

1. **Download** the `.dmg` from [osaurus.ai](https://osaurus.ai/) (or [GitHub Releases](https://github.com/osaurus-ai/osaurus/releases/latest))
2. **Open** the DMG and drag Osaurus into your **Applications** folder
3. **Eject** the DMG and launch Osaurus from Spotlight (`⌘ Space` → "Osaurus")

Osaurus is Developer ID signed and notarized by Apple, so it opens without any security warnings.

That's it. Updates auto-install via Sparkle when you launch the app — no need to come back here.

## Prefer the terminal?

If you'd rather install via Homebrew:

```bash
brew install --cask osaurus
```

This puts **Osaurus.app** in your Applications folder and lets Homebrew manage the **`osaurus` CLI** link in its own prefix. Update with `brew upgrade --cask osaurus`; don't replace that managed link manually.

## Permissions

Osaurus only asks for permissions when you actually use the feature that needs them:

| Permission | Needed for |
|---|---|
| Microphone | Voice input, wake-word activation, Transcription Mode |
| Screen Recording | Capturing system audio for transcription |
| Accessibility | Transcription Mode (typing into other apps) |
| Network | Cloud providers, MCP, public agent links |
| Files | Trusted folders (one folder at a time, via macOS security-scoped bookmarks) |

You'll be prompted in System Settings → Privacy & Security as you use each feature.

## Where Osaurus puts things

| What | Path |
|---|---|
| Local models (MLX) | `~/MLXModels/` (override with `OSU_MODELS_DIR`) |
| App data | `~/.osaurus/` |
| Voice models | `~/Library/Application Support/FluidAudio/Models/` |
| Encrypted databases | `~/.osaurus/{chat-history,memory,methods,tool-index}/*.sqlite` |
| Encryption key | macOS Keychain (`com.osaurus.storage`) |

To put models on an external drive:

```bash
export OSU_MODELS_DIR=/Volumes/External/MLXModels
```

## Verify the CLI

If you installed via DMG and want to use the `osaurus` CLI from the terminal:

```bash
osaurus --version
osaurus serve         # starts the local server
osaurus status        # confirms it's up
osaurus stop          # stops it
```

If `osaurus` isn't on your PATH after a DMG install, link it without writing into Homebrew's managed prefix:

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

Test the local server is up:

```bash
curl http://127.0.0.1:1337/health
```

## Troubleshooting

### "Cannot be opened" error

This shouldn't normally happen — releases are signed and notarized. If you see it, the download was likely corrupted or came from an unofficial mirror: delete the app, re-download the DMG from [osaurus.ai](https://osaurus.ai/) or [GitHub Releases](https://github.com/osaurus-ai/osaurus/releases/latest), and reinstall. As a last resort, System Settings → Privacy & Security → scroll to the security message → **Open Anyway**.

### `osaurus` command not found

See the link/PATH steps in [Verify the CLI](#verify-the-cli).

### A store won't open after upgrading or migrating Macs

Osaurus never deletes data on a failed open — the affected store is listed under **Management → Privacy → Storage → Stores needing attention** with Retry and Reset actions, and anything reset is quarantined (moved, not deleted) to `~/.osaurus/quarantine/`. [Full guide →](/storage)

## Uninstall

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

:::warning
Removing `~/.osaurus` is irreversible. Use **Management → Privacy → Storage → Export plaintext backup** first if you want to keep your chats and memory.
:::

---

**Next:** [Quick Start →](/quickstart) — your first conversation in 5 minutes.

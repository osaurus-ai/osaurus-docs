---
title: Installation
sidebar_label: Installation
description: Install Osaurus via Homebrew or download the latest signed build from GitHub Releases.
sidebar_position: 2
---

# Installation

Osaurus is available as a native macOS application for Apple Silicon. Choose your preferred installation method.

## System Requirements

- **macOS 15.5** or later
- **Apple Silicon** (M1, M2, M3, or newer)
- **2-20GB** free space per model

:::info macOS 26 Features
Apple Foundation Models and the [Sandbox](/sandbox) (agent code execution in an isolated Linux VM) require macOS 26 (Tahoe) or later.
:::

## Homebrew Installation

The recommended installation method:

```bash
brew install --cask osaurus
```

This installs:

- **Osaurus.app** in your Applications folder
- **CLI** via the `osaurus` command (automatically linked)
- **Automatic updates** through `brew upgrade`

### First Launch

After installing:

1. Launch from Spotlight (⌘ Space → "osaurus") or run `osaurus ui`
2. Look for the Osaurus icon in your menu bar
3. Click the icon to access controls

### Updating via Homebrew

```bash
# Update Homebrew formulae
brew update

# Upgrade Osaurus
brew upgrade --cask osaurus
```

## Direct Download

Download the latest signed build from GitHub:

1. Visit [GitHub Releases](https://github.com/osaurus-ai/osaurus/releases/latest)
2. Download the DMG file
3. Open the DMG and drag Osaurus to Applications
4. Eject the DMG

### First Launch (Direct Download)

When launching for the first time:

1. **Right-click** Osaurus.app and select **Open**
2. Click **Open** in the security dialog
3. Grant necessary permissions when prompted

:::note
This step is only required once. Osaurus is properly signed but not notarized.
:::

### Manual CLI Setup

After installing via direct download, set up the CLI:

```bash
# Create symlink to CLI
sudo ln -sf /Applications/Osaurus.app/Contents/MacOS/osaurus /usr/local/bin/osaurus

# Verify installation
osaurus --version
```

Or add to PATH:

```bash
echo 'export PATH="/Applications/Osaurus.app/Contents/MacOS:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

## Installation Verification

Verify your installation:

```bash
# Check CLI version
osaurus --version

# Test server startup
osaurus serve

# In another terminal, check status
osaurus status

# Stop server
osaurus stop
```

### GUI Verification

1. Launch Osaurus from Applications or Spotlight
2. Look for the menu bar icon
3. Click the icon and select **About**
4. Verify the version number

## Model Storage

Models are stored at:

```
~/MLXModels
```

Override with the `OSU_MODELS_DIR` environment variable:

```bash
export OSU_MODELS_DIR=/Volumes/External/MLXModels
```

## Permissions

Osaurus requires minimal permissions:

- **Network Access** — For serving the local API
- **File System Access** — For model storage and tools

Some tools may require additional permissions:

- **Automation** — For AppleScript-based tools
- **Accessibility** — For UI automation tools

Grant these in System Settings → Privacy & Security when prompted.

## Troubleshooting

### "Cannot be opened" Error

If macOS prevents opening Osaurus:

1. Go to **System Settings** → **Privacy & Security**
2. Find Osaurus in the security section
3. Click **Open Anyway**

### CLI Not Found

If the `osaurus` command isn't recognized:

```bash
# Check if app exists
ls /Applications/Osaurus.app/Contents/MacOS/osaurus

# Create symlink manually
ln -sf "/Applications/Osaurus.app/Contents/MacOS/osaurus" "$(brew --prefix)/bin/osaurus"
```

### Permission Denied

If you get permission errors:

```bash
# Make CLI executable
chmod +x /Applications/Osaurus.app/Contents/MacOS/osaurus

# Use without sudo for normal operations
osaurus serve  # Correct
```

## Uninstallation

### Via Homebrew

```bash
brew uninstall --cask osaurus
```

### Manual Uninstallation

1. Quit Osaurus from the menu bar
2. Delete the application:
   ```bash
   rm -rf /Applications/Osaurus.app
   ```
3. Remove CLI symlink:
   ```bash
   rm /usr/local/bin/osaurus
   ```
4. Optional — Remove data:

   ```bash
   # Models
   rm -rf ~/MLXModels

   # App data and tools
   rm -rf ~/.osaurus
   ```

## Next Steps

Once installed:

- [Quick Start](/quickstart) — Get running in minutes
- [Chat Interface](/chat-interface) — Learn to use the chat overlay
- [Model Management](/models) — Download your first model

:::tip For Developers
Want to build Osaurus from source or contribute? See the [Building from Source](/developer) guide.
:::

---

<p align="center">
  For installation help, visit our <a href="https://discord.gg/dinoki">Discord community</a> or check the <a href="https://github.com/osaurus-ai/osaurus/issues">GitHub issues</a>.
</p>

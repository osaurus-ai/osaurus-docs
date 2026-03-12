---
title: Configuration
sidebar_label: Configuration
description: Configure Osaurus settings, environment variables, and server options
sidebar_position: 6
---

# Configuration

Osaurus is designed to work out of the box with sensible defaults. Most behavior is controlled per request via the API. This page covers the available configuration options.

## Environment Variables

Configure Osaurus using environment variables:

| Variable         | Description             | Default       |
| ---------------- | ----------------------- | ------------- |
| `OSU_PORT`       | Server port number      | `1337`        |
| `OSU_MODELS_DIR` | Custom models directory | `~/MLXModels` |

### Setting Environment Variables

**Temporary (current session):**

```bash
OSU_PORT=8080 osaurus serve
```

**Persistent (shell profile):**

```bash
# Add to ~/.zshrc or ~/.bashrc
export OSU_PORT=8080
export OSU_MODELS_DIR=/Volumes/External/MLXModels

# Reload shell
source ~/.zshrc
```

## Server Settings

### Port

Default: `1337`

Change the server port:

- **Environment variable:** `OSU_PORT=8080`
- **CLI flag:** `osaurus serve --port 8080`
- **UI:** Menu bar → Settings → Server Port

### Listen Address

Default: `127.0.0.1` (localhost only)

To expose the server on your local network:

```bash
osaurus serve --expose
```

This binds to `0.0.0.0`, making the server accessible from other devices on your network.

:::warning Security Note
Only use `--expose` on trusted networks. The server has no authentication.
:::

### CORS

Cross-Origin Resource Sharing is enabled by default for development:

- **Allowed Origins:** `*` (all origins)
- **Allowed Methods:** `GET, POST, OPTIONS`
- **Allowed Headers:** `Content-Type, Authorization`

CORS settings are not currently configurable.

## Model Storage

Models are stored at:

```
~/MLXModels
```

Override with `OSU_MODELS_DIR`:

```bash
export OSU_MODELS_DIR=/Volumes/ExternalDrive/Models
```

The directory structure:

```
~/MLXModels/
├── llama-3.2-3b-instruct-4bit/
│   ├── config.json
│   ├── model.safetensors
│   └── tokenizer.json
├── mistral-7b-instruct-v0.2-4bit/
│   └── ...
└── ...
```

## Tools Storage

Installed plugins are stored at:

```
~/.osaurus/Tools/<plugin_id>/<version>/
```

This location is not configurable.

## Voice Models Storage

Voice input models (FluidAudio) are stored at:

```
~/.osaurus/voice-models
```

This location is not configurable. Models range from 75 MB (Tiny) to 3 GB (Large V3). See the [Voice Input](/voice) guide for model options.

## Sandbox Configuration

The [Sandbox](/sandbox) runs agent code in an isolated Linux VM. Configure it via the Management window → **Sandbox** → **Container** tab, or edit the config file directly:

**Config file:** `~/.osaurus/config/sandbox.json`

```json
{
  "autoStart": true,
  "cpus": 2,
  "memoryGB": 2,
  "network": "outbound"
}
```

| Setting | Range | Default | Description |
|---------|-------|---------|-------------|
| `autoStart` | true / false | true | Start the container when Osaurus launches |
| `cpus` | 1–8 | 2 | Virtual CPU cores allocated to the VM |
| `memoryGB` | 1–8 | 2 | RAM in GB allocated to the VM |
| `network` | outbound / none | outbound | NAT networking for outbound internet access |

Changes require a container restart to take effect. The Sandbox requires macOS 26 (Tahoe) or later.

## API Path Prefixes

Endpoints are available under multiple prefixes for compatibility:

- `/v1/endpoint` — OpenAI style
- `/api/endpoint` — Generic style
- `/v1/api/endpoint` — Combined style

All prefixes route to the same handlers.

## Not Currently Configurable

The following features are not configurable at this time:

- TLS/SSL termination (use a reverse proxy)
- Custom CORS origin lists
- Global model aliases
- Authentication/API keys
- Request rate limiting
- Configuration profiles
- CLI config files

## Per-Request Configuration

Most model behavior is controlled per-request via API parameters:

```json
{
  "model": "llama-3.2-3b-instruct-4bit",
  "messages": [{ "role": "user", "content": "Hello" }],
  "temperature": 0.7,
  "max_tokens": 1000,
  "top_p": 0.9,
  "stream": true
}
```

See the [API Reference](/api) for all available parameters.

## Recommended Configurations

### Development

```bash
# Default settings work well
osaurus serve
```

### Team/LAN Access

```bash
# Expose on network
osaurus serve --expose --port 1337
```

### Custom Model Location

```bash
# External drive for large models
export OSU_MODELS_DIR=/Volumes/ModelsDrive/MLXModels
osaurus serve
```

### Multiple Instances

```bash
# Terminal 1
OSU_PORT=1337 osaurus serve

# Terminal 2
OSU_PORT=1338 osaurus serve
```

## Custom Themes

Osaurus supports full theme customization, letting you personalize the appearance of the Chat UI and Management windows.

### Accessing Theme Settings

1. Click the Osaurus menu bar icon
2. Select **Settings**
3. Navigate to the **Appearance** tab

### Theme Options

| Setting           | Description                                |
| ----------------- | ------------------------------------------ |
| **Preset Themes** | Choose from built-in light and dark themes |
| **Custom Colors** | Full control over individual color values  |
| **Accent Color**  | Primary color for buttons and highlights   |
| **Background**    | Window and panel background colors         |
| **Text Colors**   | Primary, secondary, and muted text         |

### Creating a Custom Theme

1. Start with a preset theme as a base
2. Adjust individual color values
3. Preview changes in real-time
4. Save your custom theme

### Import and Export

Share themes with others or back them up:

- **Export** — Save your theme as a JSON file
- **Import** — Load a theme from a JSON file

Theme files are portable and can be shared across installations.

### System Appearance

By default, Osaurus follows your macOS appearance setting (Light/Dark). Override this behavior in theme settings to lock a specific appearance regardless of system preference.

---

<p align="center">
  For model-specific configuration, see the <a href="/models">Model Management</a> guide.
</p>

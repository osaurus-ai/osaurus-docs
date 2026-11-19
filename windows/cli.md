---
title: CLI on Windows
sidebar_label: CLI
description: The osaurus command on Windows — starting and stopping the server, downloading models from Hugging Face, MCP, bringing your Mac setup over, and installing Osaurus bundles from a terminal.
---

# CLI on Windows

The `osaurus` command controls Osaurus from a terminal: start or stop the server, check its health, download and chat with models, connect MCP clients, bring over a setup exported from a Mac, and install an [Osaurus bundle](/bundles). It comes with the app; there is nothing extra to install.

The command names match the [Mac CLI](/cli), so scripts and guides mostly carry over. Where Windows behaves differently, this page says so.

## Quick start

Open **Windows Terminal** (or PowerShell, or Command Prompt) and run:

```powershell
osaurus status                          # is the server up?
osaurus list                            # the models you can use
osaurus pull numind/NuExtract3-GGUF     # download a model from Hugging Face
osaurus run <model_id>                  # chat with one of them
osaurus doctor                          # diagnose a broken install
```

You don't have to open Osaurus first. A command that needs the server starts Osaurus in the background, in the notification area with no window, and that copy quits on its own once nothing has used it for five minutes. `osaurus serve` starts Osaurus and keeps it running; `osaurus ui` opens the window.

## Installation

Installing Osaurus from the Microsoft Store also registers `osaurus` as an **app execution alias**. Windows puts the alias in `%LOCALAPPDATA%\Microsoft\WindowsApps`, which is on your `PATH` by default, so the command works in any new terminal window.

- **Open a new terminal after installing.** A terminal that was already open keeps its old `PATH`.
- **Each Windows account gets its own command.** The alias is registered for every user who signs in, the first time they do.
- **If `osaurus` is not found**, open Windows **Settings → Apps → Advanced app settings → App execution aliases** and make sure the **Osaurus** alias is on. See [Troubleshooting](/windows/troubleshooting#osaurus-is-not-recognized).

Check it:

```powershell
osaurus version
```

## Bring your Mac setup over

A configuration exported from Osaurus on a Mac applies on Windows: providers, agents, MCP servers, and settings.

1. On the Mac, export it: `osaurus config export -o osaurus.yaml`.
2. Copy the file to this PC.
3. See what it would change: `osaurus config plan osaurus.yaml`.
4. Apply it: `osaurus config apply osaurus.yaml`.

Parts that work differently on Windows don't stop the rest. Each one is listed as a `note:` line saying what to do instead:

| In the Mac document | On Windows |
|---|---|
| `memory` (the global memory switch and budget) | Not applied: set memory on each agent |
| `tools` (tool policies) | Not applied: Windows remembers approvals per agent |
| `commands` (slash commands) | Not applied: commands are kept by the app |
| `knowledge_collections` | Not applied: on Windows, shared files belong to a [project](/windows/projects) |
| `plugins` (the Mac's native plugins) | Not applied: Windows uses sandbox plugins (`osaurus tools install`) |

Providers keep the Mac's names: a document that adds OpenRouter, OpenAI, xAI, Anthropic, Gemini, DeepSeek, Venice, Ollama, Azure OpenAI or a custom OpenAI-compatible endpoint applies as written. Keys never travel in the document; enter them in Osaurus afterwards (`apply` exits with code `3` until you do). A ChatGPT sign-in and a paired peer can't come from a document; set those up in the app.

A document with nothing that applies on Windows is refused with the reason.

## Commands

| Command | What it does |
|---|---|
| [`serve`](#osaurus-serve) | Start Osaurus, or change the port and network access |
| [`stop`](#osaurus-stop) | Stop the server (this quits the app) |
| [`status`](#osaurus-status) | Check whether the server is running |
| [`ui`](#osaurus-ui) | Open the Osaurus window |
| [`doctor`](#osaurus-doctor) | Diagnose the install, the port and the server |
| [`list`](#osaurus-list), [`show`](#osaurus-show), [`pull`](#osaurus-pull), [`run`](#osaurus-run) | Models |
| [`bench`](#osaurus-bench) | Measure a model's speed on this PC |
| [`mcp`](#osaurus-mcp) | Run an MCP stdio server for other apps |
| [`tools`](#osaurus-tools) | Sandbox plugins |
| [`config`](#osaurus-config) | Declarative configuration |
| [`import`](#osaurus-import) | Install from an Osaurus bundle |
| `version` | Print the version (also `--version`, `-v`) |
| `help` | Print the command list (also `--help`, `-h`) |

Add `--help` after a command to see its usage. The Mac's `manifest`, `bundle`, and `coord` commands are not available on Windows.

### osaurus serve

Starts Osaurus and waits until its server answers.

```powershell
osaurus serve [--port N] [--expose] [--yes]
```

| Option | Description |
|---|---|
| `--port N` | Listen on port `N` (default `1337`) |
| `--expose` | Also listen on your local network. Asks you to confirm first |
| `--yes`, `-y` | Skip the `--expose` confirmation |

On Windows the server runs inside the Osaurus app, so `serve` starts the app when it isn't running, in the notification area with no window. When the server is up, it prints `listening on http://127.0.0.1:1337`.

- **Already running?** `serve` prints the address, and a copy another command started stops planning to quit when idle.
- **Changing the port or network access while Osaurus runs** saves the new setting, which takes effect the next time Osaurus starts (`osaurus stop`, then `osaurus serve`).
- **`--expose` needs an access key.** Osaurus never listens on your network without one, so create an [access key](/windows/connections#access-keys) in Osaurus first. Until then it stays on this PC only.
- **`--supervise` is Mac-only.** To keep Osaurus running, turn on launch at sign-in in the app instead.

### osaurus stop

```powershell
osaurus stop [--force] [--access-key KEY]
```

Stops the server and **quits the Osaurus app**, because the app's window can't work without its server. (On a Mac the app stays open with its server off.)

If an agent is in the middle of a reply, `stop` refuses and tells you so. Pass `--force` to stop anyway.

### osaurus status

```powershell
osaurus status
```

Prints `running (port 1337)` and exits with code 0, or prints `stopped` and exits with code 1.

### osaurus ui

Opens the Osaurus window, starting the app if needed. If Osaurus is already open, its window comes to the front.

### osaurus doctor

Read-only diagnostics: it starts nothing and changes nothing.

```powershell
osaurus doctor [--port N] [--json] [--redact]
```

| Option | Description |
|---|---|
| `--port N` | Check a different port |
| `--json` | Print the report as JSON |
| `--redact` | Replace your user name and home folder with `<redacted>`, so you can paste the report into a bug report or forum post |

The report's `diagnosis` line is one of:

| Diagnosis | What it means | What to do |
|---|---|---|
| `healthy` | Osaurus is running and answering | Nothing |
| `server_stopped` | Osaurus is installed but not running | `osaurus serve` |
| `port_held_by_another_program` | Something else is using Osaurus's port | Close that program, or change Osaurus's port |
| `host_not_found` | The command can't find the Osaurus app | Reinstall Osaurus from the Microsoft Store |

It also counts bundle changes still queued. It exits with code 0 when the server is healthy and 1 otherwise.

### osaurus list

Prints the id of every model you can use: downloaded local models and the models of every provider you've added.

### osaurus show

```powershell
osaurus show <model_id>
```

Prints what Osaurus knows about a model. For a downloaded local model, that's its family, format, and quantization, plus details from the file's header such as its architecture and longest context.

### osaurus pull

```powershell
osaurus pull <model>
```

Downloads a local model, showing progress as a percentage. Give it any of these:

| You give | Example |
|---|---|
| A model id from the catalog (the Models page) | `raptor-0.7-4b-q6_k` |
| A [Hugging Face](/glossary#hugging-face) GGUF repo | `numind/NuExtract3-GGUF` |
| A repo and the build you want | `numind/NuExtract3-GGUF:Q8_0` |
| A repo's page link | `https://huggingface.co/numind/NuExtract3-GGUF` |
| The https link of a `.gguf` file | a Hugging Face `resolve` link |

When a repo has several builds and you don't name one, Osaurus takes the catalog's choice for a repo it knows, and `Q4_K_M` for any other. A repo with neither is refused with the builds it does ship. For a model that can read images, the extra file it needs for that (the projector) downloads with it.

Windows runs GGUF models through llama.cpp, so Mac model ids from `mlx-community/…` are refused with a sentence saying so.

### osaurus run

```powershell
osaurus run <model_id>
```

An interactive chat in the terminal. Type a message and press Enter; type `exit` to quit. Use an id from `osaurus list`.

### osaurus bench

```powershell
osaurus bench [--model <id>] [--prompt-tokens 1024,8192] [--runs 3] [--max-tokens 128] [--json <path>]
```

Measures a model against the running server: time to first token with and without the prompt cache, prompt-processing speed, and generation speed, at each prompt size. Osaurus must already be running. Without `--model`, it uses the first model `osaurus list` shows. `--json` also writes the results to a file.

### osaurus mcp

```powershell
osaurus mcp [--access-key KEY] [--tools PATTERNS]
```

Runs an [MCP](/glossary#mcp) server over standard input and output, for apps that start MCP servers as programs (Claude Desktop, Cursor, VS Code, and others). It passes their tool calls to Osaurus.

It offers the **tools of the MCP servers you've connected in Osaurus**. Osaurus's own built-in tools (files, shell, web) are not offered this way.

`--tools` limits what's offered: a comma-separated list of names, each optionally ending in `*` to match by prefix. Tools left out are hidden and refused if called anyway.

Example client configuration:

```json
{
  "mcpServers": {
    "osaurus": {
      "command": "osaurus",
      "args": ["mcp"]
    }
  }
}
```

### osaurus tools

```powershell
osaurus tools list
osaurus tools install <plugin.json>
osaurus tools uninstall <id>
```

Manages [sandbox plugins](/glossary#sandbox), which run inside the Osaurus sandbox. Windows installs a plugin from its JSON file; there is no plugin registry. The Mac's other `tools` subcommands (`search`, `upgrade`, `create`, and the rest) work on the Mac's native plugins and are refused here.

### osaurus config

Sets Osaurus up from a YAML or JSON document: providers, agents, MCP servers, and settings. The steps are export, edit, plan, apply.

```powershell
osaurus config export [-o file] [--format yaml|json]   # the current configuration (never secrets)
osaurus config schema [--format yaml|json]            # every key a document can hold
osaurus config plan <file> [--prune]                  # dry run: what would change
osaurus config apply <file> [--prune] [--yes]         # make the change
```

- **Documents merge.** Keys you leave out stay as they are; an explicit `null` clears a setting. Agents, providers, and servers are matched by name.
- **`--prune`** deletes entries that aren't in the document's sections.
- **High-risk changes** (for example, ones that loosen security) are refused until you confirm them with `--yes`.
- **Secrets never travel in documents.** A document refers to a secret; you enter its value in Osaurus.
- **Models can be downloaded** by naming them in the document's `models` section, with the same names `osaurus pull` takes.
- **Documents are capped at 512 KB.**

Run `osaurus config schema` for the Windows document reference. The format is close to the Mac's ([Configuration](/configuration)), and a Mac document applies here (see [Bring your Mac setup over](#bring-your-mac-setup-over)), but the keys a Windows install supports are the ones the schema lists.

`apply` exit codes: `0` fully applied; `1` a change failed or was cancelled; `3` applied, but a step must be finished in Osaurus (usually entering a secret).

### osaurus import

Installs agents, skills, MCP servers, agent programs, and settings from an [Osaurus bundle](/bundles): a folder holding an `osaurus-bundle.json` that a vendor or your IT team ships.

```powershell
osaurus import validate --from <bundle> [--json]
osaurus import install  --from <bundle> [agent|skill|mcp|runtime|setting] [<name> ...] [--yes] [--json]
osaurus import update   --from <bundle> [agent|skill|mcp|runtime|setting] [<name> ...] [--yes] [--json]
osaurus import remove   --bundle <id> [agent|skill|mcp|runtime|setting] [<name> ...] [--json]
osaurus import list     [--bundle <id>] [--json]
osaurus import apply    <request id> --access-key KEY
osaurus import secret set    keychain:SERVICE/ACCOUNT
osaurus import secret delete keychain:SERVICE/ACCOUNT
```

- **`validate`** checks a bundle and installs nothing. Run it first: it also lists anything Windows can't install from the bundle (see below).
- **`install`** installs everything, or just the items you name. Installing an agent also installs the skills and MCP servers it uses from the same bundle.
- **`update`** updates what this bundle installed. A setting you changed since is left alone, and nothing you deleted comes back.
- **`remove`** removes what this bundle installed. Settings stay as they are.
- **MCP servers, agent programs, and settings that loosen security need `--yes`.**
- **Changes are queued** in the Osaurus data folder and applied right away when Osaurus is running, or the next time it opens.
- **Run it as yourself.** `import` refuses to run as SYSTEM, or elevated as a different account from the one signed in, because that would set up a profile you never see. This matters for deployment tools such as Intune.

Exit codes: `0` applied or queued; `1` a check or change failed; `3` applied, but a step must be finished in Osaurus.

#### Secrets in bundles

A bundle names a secret as `keychain:SERVICE/ACCOUNT`, the same spelling as on a Mac, so one manifest works on both. On Windows it refers to the Credential Manager entry `Osaurus/bundle/SERVICE/ACCOUNT`, and Osaurus never reads a credential outside that `Osaurus/bundle/` namespace.

Store a value with `osaurus import secret set`. It reads the value from standard input, never from an argument, so it can't end up in a command line or a log:

```powershell
# Prompts for the value without echoing it
osaurus import secret set keychain:acme-support/api-token

# Or pipe it in from your installer
$token | osaurus import secret set keychain:acme-support/api-token
```

Give each bundle its own `SERVICE` name, the bundle's `id`. A reference to another bundle's service is listed as a risk and needs `--yes`.

#### What Windows installs differently

`validate` reports each of these as a warning or a note, and the rest of the bundle installs normally.

| In the bundle | On Windows |
|---|---|
| A Claude Code runtime | The agent runs on the [Claude Code](/windows/claude-code) provider instead. One that names its own program is refused |
| A Pi runtime (`pi_rpc`) | Installs as an agent program Osaurus runs (see [Coding plans](/windows/coding-plans)). Needs `--yes`, and `validate` warns when the program isn't on this PC |
| An agent on a runtime that isn't in the bundle and isn't Claude Code | The agent isn't installed |
| Mac-only abilities (Computer Use, AppleScript, Apple apps, charts) | The agent installs without them |
| Knowledge on an agent | Not applied: on Windows, knowledge belongs to a project |
| Publishing an agent on the relay | Never from a bundle; you turn it on in the app |
| Native plugins | Not applied: Windows uses sandbox plugins |
| A `working_folder` | You pick the folder in Osaurus |
| An Apple Intelligence model, or a model that isn't on this PC | The agent uses your default model, or waits for you to choose one if the bundle requires that model |
| A skill the bundle doesn't include | The agent sees it only if a skill by that name is already installed here |

A vendor who needs different items on each platform can ship two manifests.

## Access keys

Commands run on your PC need no key. If you turned on **Require an access key from this PC** in **Settings → Devices → Connections**, pass a key with `--access-key KEY`, or set one of these environment variables:

`OSAURUS_MCP_ACCESS_KEY`, `OSAURUS_ACCESS_KEY`, `OSAURUS_API_KEY`, `OSU_ACCESS_KEY`, `OSU_API_KEY`.

`--api-key`, `--token`, and `--bearer-token` work as spellings of `--access-key`.

While that switch is on, `osaurus import` holds a queued change until it is applied with a key: `osaurus import apply <request id> --access-key KEY`. `osaurus import list` shows the request ids.

## Using a separate profile

Every command takes `--data-dir <path>` to work with another Osaurus data folder instead of your own. It's useful for trying a configuration or a bundle without touching your real setup. Without it, the command uses `%LOCALAPPDATA%\osaurus`, or the folder in the `OSAURUS_DATA_DIR` environment variable when that's set.

---

## Under the hood

### Finding the server

The server's port is stored in Osaurus's encrypted database, which the command never opens. Instead, the server writes `server.json` (port, process id, app or headless, version) to the data folder once it's listening, and deletes it when it stops cleanly. The command looks for the port in this order:

1. the `OSU_PORT` environment variable,
2. `server.json`,
3. `1337`.

Every command then checks `GET /health` and only trusts a reply that says `"status": "ok"`, so it never sends a key to another program holding the port.

### Starting Osaurus

The command runs from the app's package, so it starts Osaurus through Windows's app activation (`<package family>!App`), not by file path. Every command but `ui` passes `--launched-by-cli`, which starts the app to the notification area with no window. Every command but `serve` and `ui` also passes `--exit-when-idle`: that copy quits once no request has arrived for five minutes, no `osaurus` command is still running, and nothing is in progress (an agent run, a task, a workflow, a download, a media job). Opening a chat window, or running `osaurus serve`, keeps it running.

A port or network change requested while Osaurus is stopped is written to a one-time `serve-request.json` in the data folder, because an app started by the shell doesn't inherit the terminal's environment.

`stop` calls `POST /admin/server/stop`, which only answers on this PC. A `409` means a reply is in progress; `--force` stops anyway. The app takes up to 20 seconds to shut down.

### Model names

`osaurus pull` and a document's `models` section go through the same resolver: a catalog build id or family first, then a Hugging Face repo (`org/repo`, `org/repo:QUANT`, `hf.co/org/repo`, or the repo's page link). A repo with one model downloads it; otherwise the tag picks, then the catalog's pick for a repo it curates, then `Q4_K_M`, as llama.cpp's `-hf` does.

### Bundle queue

Bundle requests and receipts are files in `%LOCALAPPDATA%\osaurus\import\`, laid out as on the Mac. Receipts record what each bundle installed, so `update` and `remove` touch only those items. The Mac compares a bundle's `min_osaurus_version` with its own version; Windows compares it with the Mac version whose bundle format it supports.

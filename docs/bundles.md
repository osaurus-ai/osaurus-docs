---
title: Osaurus Bundles
sidebar_label: Osaurus Bundles
description: Ship Osaurus with your own agents, skills, MCP servers, and runtimes already installed, using an installer script and osaurus import.
---

# Osaurus Bundles

An [Osaurus Bundle](/glossary#osaurus-bundle) lets you ship a ready-made Osaurus setup with your own installer. Your script installs Osaurus, stores your secrets in the user's Keychain, and runs `osaurus import install`. The first time the user opens Osaurus, your agents, skills, and MCP servers are already there and working.

This page is for IT teams, product vendors, and consultants who package Osaurus for their users. You need a Mac with Osaurus 0.25.26 or later to test on, and basic shell scripting. A complete working example lives upstream in [`docs/examples/osaurus-bundle-example/`](https://github.com/osaurus-ai/osaurus/tree/main/docs/examples/osaurus-bundle-example).

:::note
Osaurus Bundles aren't the same as the encrypted `.osaurus-agent` files from an agent's **Export Bundle** button ([Move an agent to another Mac](/agents#move-an-agent-to-another-mac)), or `.mcpb` MCP bundles loaded with `osaurus bundle load`. Osaurus Bundles are a provisioning format handled only by `osaurus import`.
:::

## What a bundle can contain

A bundle is a folder with an `osaurus-bundle.json` manifest at its root. It can contain:

- **Agents**: prompt, model, capability switches, skill allow-list, exact tool list, MCP servers, sandbox and network settings, and the [runtime](/harness-runtimes) they run on.
- **Skills**: [Agent Skills](https://agentskills.io/) folders (`SKILL.md` plus optional `references/` and `assets/`).
- **MCP servers**: HTTP or stdio servers, with credentials given as Keychain references.
- **Harness runtimes**: Claude Code, Pi, or your own Pi-based program.
- **Settings**: a short allow-list of server settings.

| Not in a bundle | Use instead |
| --- | --- |
| Plugins | `osaurus tools install <plugin-id> --consent` in your script |
| Models | `strictness: preferred` so the agent falls back to the user's model, or `osaurus pull <model-id>` in your script |
| Raw secrets | Keychain items your script creates; the bundle holds only `keychain:SERVICE/ACCOUNT` references |
| Other settings | Not provisioned. Users change them in Settings. |

**How it works.** `osaurus import` checks the bundle and copies the parts it needs into `~/.osaurus/import/pending/`. It never launches Osaurus. If Osaurus is running, it applies the import right away; otherwise Osaurus applies the queue the next time it opens. Osaurus records what each bundle installed, so later updates and removals touch only that bundle's items.

## Quick start

1. Copy the upstream example bundle and edit `osaurus-bundle.json` (`id`, `name`, `version`, `publisher`) and one agent file (`name`, `description`, `system_prompt`).
2. Open Osaurus, so validation includes the app's strict schema check, then validate:

   ```bash
   CLI=/Applications/Osaurus.app/Contents/Helpers/osaurus
   "$CLI" import validate --from ~/acme-bundle
   ```

3. Store your secrets ([Secrets](#secrets)), then install:

   ```bash
   "$CLI" import install --from ~/acme-bundle --yes
   ```

4. Open Osaurus. A toast says your agents are ready, and they appear under **Agents**.

## The manifest

```
acme-bundle/
├── osaurus-bundle.json          # the manifest
├── agents/
│   ├── support-desk.json        # agent template envelope
│   └── release-checker.json     # bare agent entry
├── skills/
│   └── triage-ticket/
│       ├── SKILL.md
│       └── references/priority-matrix.md
├── install.sh                   # your installer (not read by Osaurus)
└── uninstall.sh
```

```json
{
  "format": "osaurus.bundle",
  "format_version": 1,
  "id": "com.example.acme-support",
  "name": "Acme Support Starter",
  "version": "1.0.0",
  "publisher": { "name": "Acme Example", "url": "https://acme.example" },
  "min_osaurus_version": "0.25.26",
  "skills": [{ "name": "triage-ticket", "path": "skills/triage-ticket" }],
  "mcp_servers": [{ "name": "Acme Tickets", "transport": "http", "url": "https://mcp.acme.example/mcp", "auth": "bearer", "token_ref": "keychain:com.example.acme-support/tickets-token" }],
  "harness_runtimes": [{ "name": "Acme Pi", "kind": "pi_rpc", "executable": "pi" }],
  "agents": [{ "path": "agents/support-desk.json" }, { "path": "agents/release-checker.json" }],
  "settings": { "require_local_access_key": true }
}
```

| Key | Required | Meaning |
| --- | --- | --- |
| `format`, `format_version` | yes | Always `"osaurus.bundle"` and `1`. |
| `id` | yes | Reverse-DNS id, like `com.acme.starter`. **This is your ownership key.** A bundle can only update and remove items installed under its own id. Never change it. |
| `name` | yes | Shown in the launch toast and `osaurus import list`. |
| `version` | yes | Semantic version. Bump it every release; `update` skips items installed at a newer version, so a stale installer can't downgrade. |
| `description`, `publisher` | no | For your records. `publisher.name` is required inside the object. |
| `min_osaurus_version` | no | The CLI refuses an older app. |
| `skills` | no | `{ "name", "path" }`, relative to the bundle root. |
| `mcp_servers` | no | Inline MCP server entries. |
| `harness_runtimes` | no | Inline runtime entries. |
| `agents` | no | `{ "path" }` to a JSON agent file. |
| `settings` | no | Server settings by key. |

At least one of `skills`, `mcp_servers`, `harness_runtimes`, `agents`, or `settings` must list something. Unknown keys are rejected with a did-you-mean hint. Paths must be relative and stay inside the bundle (no absolute, `~`, `..`, or symlinked paths). Each JSON file is capped at 512 KB. Only the manifest and the files it lists are copied, so you can delete the folder once `osaurus import` returns.

### Settings

| Key | Value | The control in Osaurus |
| --- | --- | --- |
| `require_local_access_key` | `true` / `false` | **Settings → Server → Settings → Authentication → Require Access Key for Local Admin Routes** ([Security](/security#local-access-key)) |
| `allowed_origins` | list like `["https://app.acme.example"]` | **Server → Settings → Connection → Allowed Origins (CORS)**. Only adds; never removes. Restarts the server. |

- `require_local_access_key: false` and every origin in `allowed_origins` are high risk and need `--yes`.
- Bundles can't create access keys. If the key requirement turns on while the user has none, the item reports `needs_user_action` until they create one in **Server → Overview**.
- Settings belong to the user. `install` always sets the value, `update` leaves a setting the user changed since, a conflicting bundle fails, and `remove` leaves settings as they are.
- Once the key requirement is on, live imports need `--access-key KEY` (or `OSAURUS_API_KEY`). Without one the import is queued and applies at next launch.

## Agent files

Each agent is one JSON file (not YAML), in one of three shapes:

1. **An [agent template](/agent-templates) envelope** with `"format": "osaurus.template"` and a top-level `name`. Use it for model requirements or quick actions (`actions`: `{icon, text, prompt}`).
2. **A bare agent entry**: just the agent object.
3. **A config document with exactly one agent**: `{ "agents": [ { ... } ] }`.

```json
{
  "name": "Support Desk",
  "description": "Triages, prioritizes and drafts replies for Acme support tickets.",
  "system_prompt": "You are Acme's support desk assistant...",
  "model": "foundation",
  "capabilities": { "tools_enabled": true, "memory_enabled": true },
  "skills": ["triage-ticket"],
  "tools": { "mode": "manual", "enabled": ["get_current_time", "acme_tickets_search_tickets"] },
  "mcp_servers": { "enabled": ["GitHub"] },
  "plugins": { "enabled": ["osaurus.fetch"] },
  "sandbox": { "enabled": true, "network_enabled": true, "allowed_domains": ["api.acme.example"] },
  "subagents": { "enabled": true, "agents": ["Release Checker"] },
  "orchestrator_spawnable": false,
  "working_folder": "~/Documents/Acme"
}
```

| Key | Meaning |
| --- | --- |
| `name` | Required. How Osaurus matches the agent on update. |
| `description` | One line the Orchestrator uses for routing. Generated when omitted. |
| `model` | `foundation`, a local model id, or `<provider>/<model>`. Omit it to use the user's model. With a template envelope, `requirements.models[0].strictness` is `preferred` (fall back with a notice) or `always` (ask the user to get the model first). |
| `capabilities` | Per-agent switches such as `tools_enabled`, `memory_enabled`, `web_search_enabled`, `knowledge_enabled`, `computer_use_enabled`, `browser_use_enabled`, `relay_enabled`, and `apple_apps`. |
| `skills` | The skill allow-list: omit to leave unchanged, `null` for every skill, a list of names or slugs for only those, `[]` for none. Built-in skills are referenced by slug (`web-researcher`, `document-builder`, and so on). |
| `tools` | `mode: manual` with `enabled` is the exact tool list. MCP tools are named `<server name in snake_case>_<tool>`, like `acme_tickets_search_tickets`. |
| `mcp_servers`, `plugins` | `enabled` gives the agent **every** tool of the named servers or plugins; `disabled` removes them. |
| `sandbox` | `enabled`, `network_enabled`, `allowed_domains`, plus `max_commands_per_turn`, `background_process_enabled`, `plugin_create`. |
| `subagents` | Whether this agent may delegate, and to which agents by name. |
| `orchestrator_spawnable` | `false` keeps the agent out of the Orchestrator's **Allowed subagents** list when the bundle creates it. Only applies at creation. |
| `runtime` | `builtin` (default) or a runtime's name, from this bundle or already on the Mac (like `Claude Code`). |
| `claude_code` | For a Claude Code agent: `model`, `mode` (`agent` / `text_only`), `allow_writes`, `allow_shell`, `allow_osaurus_tools`. |
| `working_folder` | A path hint. The user is asked to pick the folder the first time (`needs_user_action`) unless Osaurus can attach it itself. |

Names (agents, skills, MCP servers, runtimes) are matched case-insensitively; plugins by registry id. A name not in your bundle must already exist on the Mac; `validate` warns about these.

**Exact tools vs whole servers.** An exact tool name stays on the list and starts working once its server connects. `mcp_servers.enabled` only adds the tools the server has when the agent is applied, so a server that isn't connected yet (waiting for a secret) contributes nothing until you run `osaurus import update`. If you can't guarantee the server is connected at install time, list tools by name.

## Skills

A skill folder needs a `SKILL.md` whose `name` matches the manifest entry by slug, and should have a `description` (agents pick skills by it). Limits: 512 files, 10 MB per file, 50 MB total, 16 folders deep, no symlinks. Skills install to `~/.osaurus/skills/<slug>/`. A skill whose name collides with one the user, a built-in, or a plugin already has is refused, so prefix names with your product (`acme-triage`).

## MCP servers

```json
{ "name": "Acme Tickets", "transport": "http", "url": "https://mcp.acme.example/mcp",
  "auth": "bearer", "token_ref": "keychain:com.example.acme-support/tickets-token",
  "secret_header_refs": { "X-Acme-Workspace-Key": "keychain:com.example.acme-support/ws-key" } }

{ "name": "GitHub", "transport": "stdio", "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github@1.2.3"],
  "secret_env_refs": { "GITHUB_PERSONAL_ACCESS_TOKEN": "keychain:com.example.acme-support/github-token" },
  "execution_host": "sandbox" }
```

- HTTP `auth` is `none`, `bearer`, or `oauth`. OAuth servers install as `needs_user_action`; the user signs in once in **Settings → Tools & MCP → Services**.
- stdio takes `command`, `args`, `env` (non-secret), `working_directory`, and `secret_env_refs`. `execution_host` is `sandbox` (default) or `host`.
- `enabled: false` installs the server switched off. A server's `transport` can't change after install.

## Harness runtimes

```json
{ "name": "Acme Pi", "kind": "pi_rpc", "executable": "pi",
  "arguments": ["--mode", "rpc", "--session-id", "{chat_id}", "--append-system-prompt", "{system_prompt_file}"],
  "environment": { "PI_LOG_LEVEL": "info" } }
```

`kind` is `pi_rpc` or `claude_code` and can't change after install. Your installer must install the program itself; `validate` warns when it isn't on `PATH`. `environment` holds plain values only, and `builtin` is a reserved name. Installing an agent with `"runtime": "Acme Pi"` installs the runtime too; removing the last agent that pulled it in removes it. See [Runtimes](/harness-runtimes) for placeholders and the process contract.

**High risk.** Every MCP server, every runtime, and every agent on a runtime or with `computer_use_enabled`, `browser_use_enabled`, `relay_enabled`, or `claude_code.allow_shell` is listed under `risks`. `install` refuses until you pass `--yes`.

## Secrets

Secrets never go in the bundle. Store each one in the user's **login Keychain** and refer to it as `keychain:SERVICE/ACCOUNT`. On apply, Osaurus reads the item once, copies the value into its own Keychain items, and keeps only the reference. `env:` references are refused in bundles.

Run this **as the user**, **after** Osaurus is in `/Applications`:

```bash
printf '%s\n%s\n' "$TICKETS_TOKEN" "$TICKETS_TOKEN" \
  | security add-generic-password -U \
      -s com.example.acme-support -a tickets-token \
      -T /Applications/Osaurus.app -w
```

- `-T /Applications/Osaurus.app` is **required**. Osaurus reads with prompts off, so an item without it is silently unreadable and the import reports it under `pending_secrets`.
- `-w` as the last argument reads the value from standard input, so it never appears in `ps`. Avoid `-w "$SECRET"`.
- `-U` updates an existing item. To rotate, store the new value and run `osaurus import update --from <bundle> --yes`.
- `install` checks each referenced item exists and prints the `security` command to run if one is missing.
- On uninstall, delete your originals with `security delete-generic-password -s SERVICE -a ACCOUNT`. Osaurus deletes its own copies.

## The installer script

1. **Verify Osaurus** if you ship it: `codesign --verify --deep --strict`, `spctl --assess --type execute`, and check `TeamIdentifier=4W8QF9VR2F`.
2. **Use the CLI inside the app**: `/Applications/Osaurus.app/Contents/Helpers/osaurus`.
3. **Run as the logged-in user, never root.** `osaurus import` refuses root. From a `.pkg` postinstall:

   ```bash
   CONSOLE_USER=$(stat -f %Su /dev/console)
   launchctl asuser "$(id -u "$CONSOLE_USER")" sudo -u "$CONSOLE_USER" -H /path/to/user-part.sh
   ```

   With nobody logged in or a locked Keychain, run the user part at next login instead.
4. **Store secrets**, then **install plugins and models** (`osaurus tools install … --consent`, `osaurus pull …`).
5. **Validate, then install**:

   ```bash
   "$CLI" import validate --from "$BUNDLE_DIR" --json > validate.json || exit 1
   "$CLI" import install --from "$BUNDLE_DIR" --yes --json > install.json
   case $? in
     0) echo "Installed or queued" ;;
     3) echo "Installed; the user must finish a step in Osaurus" ;;
     *) echo "Failed; see install.json"; exit 1 ;;
   esac
   ```

6. Optionally `open -a /Applications/Osaurus.app` to show the result sooner.

## Updating and uninstalling

Ship a higher `version` and run `osaurus import update --from <bundle> --yes`:

- Changed items are re-applied; unchanged ones report `unchanged`. New items are installed.
- Items the user deleted aren't brought back (`install` does bring them back). Items you dropped from the bundle stay until you `remove` them.
- Only the keys your agent file declares are re-applied. Lists you declare replace the user's list. A renamed agent keeps the user's name.

`osaurus import remove --bundle <id>` removes everything that bundle installed and cancels its queued imports; you don't need the folder. Add `agent "Name"` to remove one item. Skills and servers still used by another agent (including the user's own) aren't removed.

## What the user sees

Onboarding still runs on first open, and your agents are there when it finishes. A toast says "Agents ready — … · From Acme Support Starter", or names what needs setup. An agent with a pending secret, sign-in, model, or folder shows **Needs setup** and offers **Set Up Now** the first time it's opened ([Agent Templates](/agent-templates#finish-setting-up-an-agent)). Users can edit, rename, or delete anything you installed.

## Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Agents missing after opening Osaurus | Script ran as root | Run the import as the console user |
| Queued import never applies | Osaurus hasn't been opened | Open Osaurus |
| `pending_secrets` / "needs secrets" | Keychain item lacks `-T /Applications/Osaurus.app` | Store it again with `-T`, then `import update` |
| "already exists and was not installed by …" | Name collision | Rename your item |
| `refused` with risks | High-risk items without `--yes` | Review, then pass `--yes` |
| `queued`: "did not accept the access key" | Local access key required | Pass `--access-key` or `OSAURUS_API_KEY` |
| Agent missing a tool | Server not connected or wrong tool name | Check **Settings → Tools & MCP**; compare with `osaurus config export` |
| "only checked for shape" | Osaurus wasn't running during `validate` | Open Osaurus and validate again |

Check state with `osaurus import list --json` and `~/.osaurus/import/results/<request-id>.json`.

## Security checklist

- Sign and notarize your installer, and verify Osaurus's signature before installing it.
- Keep high-risk items to a minimum. Prefer HTTP servers you operate, and `execution_host: sandbox`.
- Use `https://` endpoints, narrow `allowed_domains`, and leave `network_enabled` off unless needed.
- Grant exact `tools.enabled` lists rather than whole servers.
- Handle secrets on standard input, with `-T` for Osaurus only, and delete them on uninstall.
- Pin stdio packages (`@scope/server@1.2.3`, not `@latest`).
- Don't loosen server settings; never ship `require_local_access_key: false`.

---

## Reference

### CLI

```text
osaurus import validate --from <bundle> [--json]
osaurus import install  --from <bundle> [agent|skill|mcp|runtime|setting] [<name> ...] [--yes] [--json]
osaurus import update   --from <bundle> [agent|skill|mcp|runtime|setting] [<name> ...] [--yes] [--json]
osaurus import remove   --bundle <id> [agent|skill|mcp|runtime|setting] [<name> ...] [--json]
osaurus import list     [--bundle <id>] [--json]
```

Every command also takes `--access-key KEY` (or `OSAURUS_API_KEY`). Naming an agent also installs the skills, servers, and runtime it uses from the same bundle. When a name matches more than one kind, say which (`skill triage`).

### Exit codes

| Code | Meaning |
| --- | --- |
| `0` | Applied (Osaurus was running) or queued. `state` says which. |
| `1` | A check or change failed. Nothing was queued if a check failed. |
| `3` | Applied, but something must be finished in Osaurus (secret, sign-in, model, folder). |

### `--json` output

| Field | Values |
| --- | --- |
| `state` | `validated`, `applied`, `partial`, `queued`, `failed`, `refused`, `listed`, `nothing_to_do` |
| `items[].kind` | `agent`, `skill`, `mcp`, `harness_runtime`, `setting` |
| `items[].action` | `install`, `update`, `remove` |
| `items[].status` | `done`, `unchanged`, `needs_user_action`, `failed`, `skipped`, `queued`, `valid` |
| `risks`, `warnings`, `issues`, `pending_secrets` | Lists of strings |
| `installed`, `queued` | (`list`) receipts and pending imports |
| `cancelled_requests` | (`remove`) dropped queued imports |

Fields with no value are omitted, and new fields may be added.

### On-disk paths

| Path | Contents |
| --- | --- |
| `~/.osaurus/import/pending/<request-id>/` | A queued import; removed once applied |
| `~/.osaurus/import/results/<request-id>.json` | Result of an applied import |
| `~/.osaurus/import/installed.json` | Osaurus's receipts. Don't edit it. |
| `~/.osaurus/skills/<slug>/` | Installed skills |

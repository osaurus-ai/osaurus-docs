---
title: Claude Plugins
sidebar_label: Claude Plugins
description: Install ready-made Claude plugins from GitHub in a few clicks — they add skills, slash commands, scheduled jobs, and connections to outside services, and you can update or remove each one as a single package.
---

# Claude Plugins

Claude plugins are ready-made add-on packs that people publish on GitHub, a website where code is shared. One plugin can teach your agents new [skills](/glossary#skill) (playbooks for a kind of task), add slash commands to the chat box, set up scheduled jobs, and connect to outside services. Osaurus installs the whole pack in one go, and you can update or remove it as one unit later. All you need is the plugin's GitHub address, or you can pick one from the built-in catalog.

## Get started

You can install from the catalog or from any GitHub address.

**From the catalog:**

1. Open **Settings…** (`⌘ ,`) → **Skills**, and choose the **Claude Plugins** tab. The same tab is also in **Settings… → Tools & MCP → Plugins**, next to **Installed** and **Browse**.
2. Use the category chips to narrow the list, and click a plugin to see what's inside.
3. Click **Install**.

**From a GitHub address:**

1. Open **Settings… → Skills** and click the link button in the header (its tooltip reads **Import Claude plugin from GitHub**).
2. Paste the repository address, such as `github.com/owner/repository` or just `owner/repository`, and click **Continue**.
3. Tick the plugins you want. You can also untick parts of a plugin you don't need.
4. Click **Install** (the button shows how many plugins you picked, like **Install 2 Plugins**).

Some plugins need a few details before they can connect to a service, such as an account name or a password. If so, Osaurus shows a **Configure Plugin** sheet. Fill in the required fields and click **Save**. Passwords and other secrets go into your [Keychain](/glossary#keychain), macOS's secure password storage.

When the install finishes, Osaurus shows a summary. It lists what was added and anything that still needs you:

- **Scheduled jobs that need a time.** These arrive switched off. Click one to open it and pick when it should run.
- **Service connections that need a sign-in or a password.** Finish these in **Settings… → Tools & MCP → Services**.
- **Anything that was skipped or failed.** One broken file never stops the rest of the plugin from installing.

## What a plugin adds

| Part of the plugin | What you get | Where to find it |
|---|---|---|
| Skills | New playbooks your agents can use | **Settings… → Skills** |
| Scheduled agents | Jobs that run on a timetable, switched off until you set a time | **Settings… → Schedules** |
| Commands | New slash commands | The chat box (type `/`) |
| Service connections | New tools that reach outside services | **Settings… → Tools & MCP → Services** |
| Shared notes and guides | Background reading for the plugin's skills | Attached to each skill |

There's nothing else to set up. Your agents find and load the new skills, commands, and tools when they need them, just like built-in [skills](/skills).

Some plugins rely on skills from a sibling plugin in the same repository. Osaurus notices this and selects the sibling plugin for you, so nothing is missing.

## Managing installed plugins

Installed plugins appear in **Settings… → Tools & MCP → Plugins → Installed**, after Osaurus's own plugins. Each one has an **Imported** badge, a version number, and counts of the skills, schedules, commands, and connections it added.

From the card, or from its detail page, you can:

- **Update.** This button appears when a newer version is available. It replaces the plugin's parts in place, so you won't end up with duplicates.
- **Configure Settings….** Reopen the settings sheet to change the details you entered. A **Configure** button also shows on the card when settings are still required.
- **View Details.** See a full description, keywords, every part the plugin added, its change history, and a notice if anything still needs attention.
- **Uninstall.** Remove everything the plugin added in one step, including any saved passwords and the plugin's own data.

## What isn't supported yet

Some plugins include extras that Osaurus recognizes but doesn't run yet. The plugin's detail page lists these under a "declared but not yet honored" notice, so you aren't surprised.

Plugins sometimes include small helper programs (scripts). Osaurus keeps them so your agent can read them, but it doesn't run them.

## Troubleshooting

**"GitHub rate-limited this app."** GitHub only allows a limited number of anonymous requests per hour. The import sheet shows roughly when the limit resets, so wait and try again. To avoid this, add a free GitHub token: on the Plugins tabs, the **Stop plugin update errors** card has an **Add token** button. The token is saved in your Keychain.

**"This repository has no plugins."** The repository doesn't include a Claude plugin catalog file, so there's nothing for Osaurus to install. Check that you pasted the right address.

**A connection doesn't work after installing.** Look at the install summary or the plugin's detail page. The connection may still need a sign-in, a password, or a value in **Configure Settings…**.

---

## Under the hood

### How plugin files map to Osaurus

Everything a plugin installs is tagged with a stable plugin ID, so the bundle installs, updates, and uninstalls as a single unit.

| Plugin artifact | Becomes | Where it shows up |
|---|---|---|
| `skills/<name>/SKILL.md` | A skill | Settings… → Skills |
| `skills/<name>/scripts`, `references`, `assets`, `templates` | Skill references/assets | Attached to the owning skill |
| `agents/<name>.md` | A schedule (disabled until a cadence is set) | Settings… → Schedules |
| `commands/<name>.md` | A slash command | The chat input |
| `.mcp.json` (HTTP/SSE) | An [MCP](/glossary#mcp) provider | Settings… → Tools & MCP → Services |
| `.mcp.json` (OAuth) | An OAuth MCP provider (needs sign-in) | Settings… → Tools & MCP → Services |
| `CLAUDE.md`, `CONNECTORS.md`, `README.md` | Reference files | Attached to every imported skill |

Imported skills, references, slash commands, and MCP tools load on demand through the same capability discovery used for built-in skills. `SKILL.md` bodies that point at `${CLAUDE_PLUGIN_ROOT}/…` paths or relative links are rewritten at import time to the local files Osaurus bundled.

Orchestrator-style plugins that delegate to sibling skills ("invoke the `comps-analysis` skill…") are detected, and Osaurus auto-selects the sibling plugins that own the referenced skills.

### Plugin settings (`userConfig`)

If a plugin declares a `userConfig` block, the **Configure Plugin** sheet collects those values before its MCP servers start. Non-sensitive values are stored under `~/.osaurus/claude-plugins/`; sensitive ones go to the macOS Keychain.

### Supported repository layouts

Osaurus looks for `.claude-plugin/marketplace.json` on the repository's default branch (the path is case-sensitive). The importer recognizes every published Anthropic plugin shape:

| Example repo | Layout | Result |
|---|---|---|
| `anthropics/skills` | Legacy flat skill list | Skills only |
| `anthropics/claude-for-legal` | Directory-based (`source: "./dir"`) | Full bundle |
| `anthropics/financial-services` | Directory-based with co-located scripts and sibling-skill deps | Full bundle |
| `anthropics/knowledge-work-plugins` | Directory-based with OAuth MCP + `CONNECTORS.md` | Full bundle (OAuth MCP needs sign-in) |
| `anthropics/claude-plugins-community` | Source-as-object pointing at external repos pinned by commit | Full bundle |

Unauthenticated GitHub requests share a limit of 60 per hour. A GitHub token (no scopes needed for public repos) raises it to 5,000 per hour.

### Updates

**Update** appears when the source's version (or commit) is newer than what's installed. It re-fetches and replaces the artifact set in place. Re-importing is idempotent. The detail view fetches the CHANGELOG lazily. Uninstall removes skills, schedules, slash commands, MCP providers, Keychain-stored tokens, and the plugin's data directory.

### Variable substitution

For imported MCP servers, Osaurus applies the Claude Code variable rules to command lines, args, working directory, and environment:

| Token | Resolves to |
|---|---|
| `${CLAUDE_PLUGIN_ROOT}` | The plugin's local read-only cache directory |
| `${CLAUDE_PLUGIN_DATA}` | A per-plugin data directory, created on first use and removed on uninstall |
| `${CLAUDE_PROJECT_DIR}` | Best-effort current workspace root |
| `${user_config.KEY}` | A value from the plugin's userConfig (sensitive values are passed only through the subprocess environment) |
| `${ENV_VAR}` | Host environment, limited to an allow-list (`PATH`, `HOME`, `USER`, …) plus names the plugin declares |

### Not honored yet

These manifest sections are detected and recorded but **not executed**: `hooks`, `lspServers`, `outputStyles`, experimental themes/monitors, `channels`, `bin/` PATH exports, and install scopes (Osaurus is single-host).

Skill-local scripts (Python helpers and similar) are attached so the model can read them, but Osaurus does not execute them. Stdio MCP servers are imported (disabled) into the [Sandbox](/glossary#sandbox) when it's available; otherwise they're listed as skipped.

---

**Related:**

- [Skills](/skills): the skill format and how capability discovery works
- [Remote MCP Providers](/remote-mcp-providers): manual MCP setup and transports
- [Schedules](/schedules): recurring runs that imported agents map to
- [Agents](/agents): agents that use the imported skills and tools

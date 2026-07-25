---
title: Claude Plugins
sidebar_label: Claude Plugins
description: Import full Claude plugins from any GitHub repo — skills, scheduled agents, slash commands, MCP providers, and CLAUDE.md context — as one managed, updatable bundle.
---

# Claude Plugins

Osaurus can import **full Claude plugins** straight from a GitHub repository — not just skills, but the whole bundle: skills, scheduled agents, slash commands, MCP providers, and shared `CLAUDE.md` context. Everything lands tagged with a stable id so the bundle installs, updates, and uninstalls as a single unit.

Imported plugins live in the **Plugins** management tab alongside Osaurus's native plugins, each shown as a card with an `Imported` badge, a version pill, an Update button, and a Configure button when the plugin needs settings.

## What gets imported

| Plugin artifact | Becomes | Where it shows up |
|---|---|---|
| `skills/<name>/SKILL.md` | A skill | Management → Skills |
| `skills/<name>/scripts`, `references`, `assets`, `templates` | Skill references/assets | Attached to the owning skill |
| `agents/<name>.md` | A schedule (disabled until a cadence is set) | Management → Schedules |
| `commands/<name>.md` | A slash command | The chat input |
| `.mcp.json` (HTTP/SSE) | An MCP provider | Management → Providers (MCP) |
| `.mcp.json` (OAuth) | An OAuth MCP provider (needs sign-in) | Management → Providers (MCP) |
| `CLAUDE.md`, `CONNECTORS.md`, `README.md` | Reference files | Attached to every imported skill |

Once imported, skills, references, slash commands, and MCP tools are discovered and loaded on demand through the same capability discovery used for built-in [skills](/skills) — there's nothing extra to wire up. `SKILL.md` bodies that point at `${CLAUDE_PLUGIN_ROOT}/…` paths or relative links are rewritten at import time to the local files Osaurus bundled.

## Importing a plugin

1. Open Management (`⌘ ⇧ M`) → **Plugins**.
2. Click **Import** in the header.
3. Enter the repository (`owner/repo` or a full URL).
4. Choose which plugins — and which artifacts within each — to install.
5. Click **Install Selected**.

If a plugin declares a `userConfig` block, Osaurus shows a **Configure plugin settings** sheet so you can fill in required values before its MCP servers start. Non-sensitive values are stored under `~/.osaurus/claude-plugins/`; sensitive ones go to the macOS Keychain.

After install, a summary lists what landed and what needs a follow-up — schedules that need a cadence (click to jump straight into the schedule editor), MCP providers that need a real token or an OAuth sign-in, and any skipped or failed artifacts (one bad file never aborts the whole import).

### Supported repository layouts

The importer recognizes every published Anthropic plugin shape:

| Example repo | Layout | Result |
|---|---|---|
| `anthropics/skills` | Legacy flat skill list | Skills only |
| `anthropics/claude-for-legal` | Directory-based (`source: "./dir"`) | Full bundle |
| `anthropics/financial-services` | Directory-based with co-located scripts and sibling-skill deps | Full bundle |
| `anthropics/knowledge-work-plugins` | Directory-based with OAuth MCP + `CONNECTORS.md` | Full bundle (OAuth MCP needs sign-in) |
| `anthropics/claude-plugins-community` | Source-as-object pointing at external repos pinned by commit | Full bundle |

Orchestrator-style plugins that delegate to sibling skills ("invoke the `comps-analysis` skill…") are handled too — Osaurus detects the dependency and auto-selects the sibling plugins that own the referenced skills.

## Managing installed plugins

Each imported plugin is a card in **Plugins → Installed** with live per-artifact counts (skills, schedules, commands, MCP servers). From the card or its detail view you can:

- **Update** — appears when the source's version (or commit) is newer than what's installed; re-fetches and replaces the artifact set in place. Re-importing is idempotent, so you won't pile up duplicates.
- **Configure Settings** — re-open the `userConfig` sheet.
- **View Details** — full hero, keyword chips, per-artifact list, a lazily-fetched CHANGELOG, and an "import needs attention" banner for any follow-ups.
- **Uninstall** — removes the skills, schedules, slash commands, and MCP providers in one shot, including Keychain-stored tokens and the plugin's data directory.

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

These manifest sections are detected and recorded but **not executed** — the detail view shows a "declared but not yet honored" notice so you're not surprised: `hooks`, `lspServers`, `outputStyles`, experimental themes/monitors, `channels`, `bin/` PATH exports, and install scopes (Osaurus is single-host).

Skill-local scripts (Python helpers, etc.) are attached so the model can read them, but Osaurus does not execute them. Stdio MCP servers are imported (disabled) into the sandbox when available; otherwise they're listed as skipped.

## Troubleshooting

**"GitHub rate-limited this app."** Unauthenticated GitHub requests share a 60-per-hour limit. The import sheet shows roughly when it resets — wait and retry.

**"This repository has no plugins."** Osaurus looks for `.claude-plugin/marketplace.json` in the repo's default branch (case-sensitive). If it's missing, there's nothing to import.

---

**Related:**

- [Skills](/skills) — the skill format and how capability discovery works
- [Remote MCP Providers](/remote-mcp-providers) — manual MCP setup and transports
- [Schedules](/schedules) — recurring runs that imported agents map to
- [Agents](/agents) — agents that use the imported skills and tools

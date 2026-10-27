---
title: Agent Templates
sidebar_label: Agent Templates
description: Save an agent's setup as a template, share it as a file, and create new agents from it. Osaurus walks you through anything your Mac is missing.
---

# Agent Templates

An [agent template](/glossary#agent-template) is a copy of one agent's setup that you can reuse or share: its instructions, model, tools, connected services, and [Sandbox](/glossary#sandbox) settings. Use templates to make several similar agents quickly, or to give a colleague an agent like yours. Templates never include passwords, keys, folder access, or your documents.

## Get started

1. Open **Settings… (`⌘ ,`) → Agents** and click **Templates** in the header. (Click **Agents** at the top to go back.)
2. Three built-in templates are always there: **Cloud Agent**, **Local Agent**, and **Sub Agent**.
3. On a template card, open the **⋯** menu and choose **Use Template**.
4. **Create Agent from Template** shows one step for each thing your Mac is missing, such as a model or a [Working Folder](/glossary#working-folder), then a **Review** step.
5. Click **Create Agent**. The agent's card and page show **From the … template**.

The agent is only created once nothing is blocking it, so a template your Mac can't support never leaves you with a broken agent.

## Save an agent as a template

- On the agent's card, choose **⋯ → Save as Template**, or
- On the agent's page, open the **Share** menu and choose **Save as Template**.

Your templates appear on the Templates page next to the built-in ones. Each time you save a new version, the old one is kept.

## Share a template as a file

1. On the template card, choose **⋯ → Export File…**.
2. Pick where to save it. Osaurus writes a `.osaurustemplate` file.

If your Mac has an Osaurus [identity](/glossary#identity), the file is signed, so the person you send it to can see it came from you. Saved answers, passwords, keys, and full folder paths are removed before the file is written.

## Import a template

1. On the Templates page, click **Import Template** and choose a `.osaurustemplate` or `.json` file. You can also drag the file onto the page.
2. Read the review before anything is saved. It shows who signed it, the model and tools, what it needs on your Mac, and how to connect any services it uses.
3. If you already have the same version with different content, choose **Keep both** or **Replace**.

A signed file that has been changed since it was signed is shown in the review but can't be imported.

## Finish setting up an agent

An agent that still needs something, like a model download, a folder, or a sign-in, shows a **Needs setup** badge on its card. To fix it:

- Choose **Run Setup** in the card's **⋯** menu, or
- Open the agent in chat. The first time, Osaurus lists what's missing and offers **Set Up Now** or **Later**.

Other agents can't [delegate](/glossary#delegation) to an agent while something it needs is missing.

## Let the Orchestrator use a template

For a template you made, choose **⋯ → Show to Orchestrator**. Then you can ask: *"Make me an agent from the Cloud Agent template that tracks my invoices."* The [Orchestrator](/orchestrator) bases the new agent on the template instead of turning on every tool. Choose **Hide from Orchestrator** to take it back out.

The same menu has **Rename…** and **Delete** for your own templates, and **Save to Library** to make an editable copy of a built-in.

## Troubleshooting

- **Import says the signature doesn't match.** The file was changed after it was signed. Ask the sender to export it again.
- **The new agent shows "Needs setup."** Something it relies on isn't on your Mac yet. Click **Run Setup** to go through the missing steps.
- **A tool from the template is missing.** The service or [plugin](/glossary#plugin) that provides it isn't installed or connected here. The review lists how to connect each service.

---

## Under the hood

### Format

```json
{
  "format": "osaurus.template",
  "format_version": 1,
  "id": "0f5c1a4e-6b7d-4c1a-9a01-000000000001",
  "kind": "agent",
  "version": 1,
  "name": "Cloud Agent",
  "summary": "General-purpose worker on a cloud model.",
  "author": { "name": "Osaurus" },
  "available_to_orchestrator": true,
  "requirements": {
    "models": [{ "slot": "main", "preferred": "sonnet-5", "strictness": "preferred" }]
  },
  "agent": {
    "name": "Cloud Agent",
    "system_prompt": "...",
    "model": "sonnet-5",
    "capabilities": { "tools_enabled": true, "memory_enabled": false },
    "tools": { "mode": "manual", "enabled": ["get_current_time", "web_search"] },
    "mcp_servers": { "enabled": ["Linear"], "disabled": ["Notion"] },
    "plugins": { "enabled": ["osaurus.notes"] },
    "sandbox": { "enabled": true, "network_enabled": false, "allowed_domains": [] },
    "subagents": { "enabled": true, "agents": ["Researcher"] },
    "working_folder": "~/Downloads/Medical Stuff"
  }
}
```

- `agent` is exactly one entry of the [declarative configuration](/configuration#declarative-configuration)'s `agents` section and runs through the same strict validator, planner, and applier. Unknown keys are rejected with a did-you-mean hint.
- `requirements` records what the author's Mac had (models, MCP servers, plugins, permissions, knowledge collections, working folder, secrets, network hosts). Model `strictness` is `always` (setup blocks until the model is available) or `preferred` (fall back to the user's default with a notice).
- `id` + `version` + content hash identify a template. A new `id` imports, a higher version is an update, an older one joins the history, and the same version with different content asks Keep both or Replace.
- `kind` must be `agent`.
- Optional `mcp_server_hints` describe how to connect each named MCP server (`directory_id`, `transport`, `url`, `auth`, `command`, `args`, `env_keys`, `header_keys`, `working_directory`). Only header and variable names travel, never values.

### Portability

References are names or stable string IDs, never UUIDs: MCP servers by name, plugins by registry ID, knowledge collections by name, subagents by agent name. `working_folder` is a path hint; the security-scoped bookmark never leaves the Mac. Relay exposure and knowledge collection IDs are stripped when a template is made from a live agent.

### Accepted import shapes

The importer accepts the envelope above (JSON or YAML), a full declarative document with exactly one agent, or a bare agent entry (a mapping with `name`). The last two are wrapped into a template named after the agent.

### Signing

Exported files are signed with the master key under the domain `Osaurus Signed Template` when one exists. A signature that fails to finish leaves the file unsigned rather than unwritten.

### Storage

Every version is kept in `~/.osaurus/template-library/<template-id>/v<N>.json`, with per-Mac preferences in `index.json`. Built-ins ship inside the app. Whole-config YAML templates saved by `osaurus_config export --save_as` stay in `~/.osaurus/templates/`.

### Orchestrator

`osaurus_config` `templates` lists visible agent templates under `agent_templates`. `plan` / `apply` with `template: "<name>"` resolves an agent template first, then a YAML template of that name; `overrides: {name, description, system_prompt, model}` merge on top. Applying a hidden template fails with a pointer to the Templates page.

### Setup checks

Every agent creation path (create, duplicate, config apply, template, [bundle import](/bundles)) marks the agent for a setup check. The check looks for gaps the author couldn't grant on someone else's Mac: a working folder with no usable bookmark, a pinned model that doesn't resolve, missing system permissions, Knowledge on with no collection, and manual tools nothing here provides. `spawn_agent` refuses a flagged agent with blocking items. The marker clears once the check passes.

### Installing from the command line

Installers can pre-load agents without the import sheet by shipping them in an [Osaurus Bundle](/bundles) and running `osaurus import install`.

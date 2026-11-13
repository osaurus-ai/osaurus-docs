---
title: Agent Templates
sidebar_label: Agent Templates
description: Save an agent's setup as a template, share it as a file or a page on store.osaurus.ai, and create new agents from it. Osaurus walks you through anything your Mac is missing.
---

# Agent Templates

An [agent template](/glossary#agent-template) is a copy of one agent's setup that you can reuse or share: its instructions, model, tools, connected services, and [Sandbox](/glossary#sandbox) settings. Use templates to make several similar agents quickly, or to give a colleague an agent like yours. Templates never include passwords, keys, folder access, or your documents.

For example, you set up a "Bookkeeper" agent that reads invoices in a folder and adds up totals. Save it as a template, and a friend can install the same agent with one click, then pick their own invoice folder.

## Get started

1. Open **Settings → Agents** and click **Templates** at the top. (Click **Agents** at the top to go back.)
2. Three built-in templates are always there: **Cloud Agent**, **Local Agent**, and **Sub Agent**.
3. On a template card, open the **⋯** menu and choose **Use Template**.
4. **Create Agent from Template** shows one step for each thing your Mac is missing, such as a model or a [Working Folder](/glossary#working-folder), then a **Review** step.
5. Click **Create agent**. The agent's card and page show **From the … template**.

The agent is only created once nothing is blocking it, so a template your Mac can't support never leaves you with a broken agent.

## Save an agent as a template

1. On the agent's card in **Settings → Agents**, choose **⋯ → Save as Template**. (Or click the **Share** button at the top of the agent's page and choose **Save as Template**.)
2. Give it a name and a one-line **Summary**, and check what it includes.
3. Turn on **Available to the Orchestrator** if you want to ask for new agents based on it (see [below](#let-the-orchestrator-use-a-template)).
4. Click **Save Template**. When it's saved, click **Share…** to share it right away, or **Done**.

Your templates appear on the Templates page next to the built-in ones. If you save again under the same name, Osaurus adds a new version and keeps the old ones (**⋯ → Version History**).

## Share a template

Click **Share** on the template's card. You have two choices:

- **Save as a file**: Osaurus writes a `.osaurustemplate` file you can send any way you like. Anyone can review and install it, with no account needed.
- **Publish to store.osaurus.ai**: Osaurus makes a web page for the template, with a link you can send. You choose who can see it, and you can update it or take it down at any time.

If your Mac has an [Osaurus ID](/glossary#osaurus-id), the file or page is signed, so people can see it came from you. Saved answers, passwords, keys, and full folder paths are removed before anything is written. Nothing about the template leaves your Mac until you save the file or click publish.

### Publish a page

1. Click **Share** on the template's card, then **Publish to store.osaurus.ai**. You need an Osaurus ID; if you don't have one yet, the sheet says so.
2. Under **Listing Details**, check the page's **Name** and **Description**. Add up to three **Topics**.
3. Optionally, add **Example Runs** to show what the agent does. **Add Example Runs…** lists your chats with agents made from this template. Each one shows exactly what will be shared under **What leaves this Mac**, and nothing is shared until you confirm.
4. Choose **Who can see it**: **Public** (listed on store.osaurus.ai and your author page), **Unlisted** (only people with the link), or **Password** (only people with the link and the password).
5. Publish. If the template carries [workflows](/workflows) you made, **Give my workflows their own pages** (on by default) gives each one its own page too, linked from the agent's page. See [Share a Workflow](/workflows-share).

Afterward, the card's button reads **Live · Public · N installs** (or Unlisted, or Password). Click it to see installs and versions, edit the listing, or **Take Down** the page. When you change the template, the card's **⋯** menu offers **Publish Version N…**. **Copy Link** and **Open Page** are in the same menu.

Built-in templates show **Export** instead of **Share**. To publish your own version of one, choose **⋯ → Save to Library** first.

## Import a template

1. On the Templates page, click **Add Template** and choose a `.osaurustemplate` or `.json` file. You can also drag the file onto the page, or paste the template's text.
2. Read the review before anything is saved. It shows who signed it, the model and tools, what it needs on your Mac, and how to connect any services it uses.
3. If you already have the same version with different content, choose **Keep both** or **Replace**.

On a page on store.osaurus.ai, click **Install agent**. Osaurus opens the same review on the Templates page, showing which website the template came from.

A signed file that has been changed since it was signed is shown in the review but can't be imported.

## Finish setting up an agent

An agent that still needs something, like a model download, a folder, or a sign-in, shows a **Needs setup** badge on its card. To fix it:

- Choose **Run Setup** in the card's **⋯** menu, or
- Open the agent in chat. The first time, Osaurus lists what's missing and offers **Set Up Now** or **Later**.

Other agents can't [delegate](/glossary#delegation) to an agent while something it needs is missing.

## Let the Orchestrator use a template

Turn on **Available to the Orchestrator** when you save a template, or later choose **⋯ → Show to Orchestrator** on its card. A sparkle icon on the card shows it's visible. Then you can ask: *"Make me an agent from the Cloud Agent template that tracks my invoices."* The [Orchestrator](/orchestrator) bases the new agent on the template instead of turning on every tool. Choose **Hide from Orchestrator** to take it back out.

The same menu has **Rename…** and **Delete** for your own templates, and **Save to Library** to make an editable copy of a built-in.

Once you've published a template, chips above the grid (**All**, **Published**, **Built-in**, **Yours**) help you find it, with a line showing how many you've published and how many installs they have.

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

- `agent` is exactly one entry of the [declarative configuration](/configuration)'s `agents` section and runs through the same strict validator, planner, and applier. Unknown keys are rejected with a did-you-mean hint.
- `requirements` records what the author's Mac had (models, MCP servers, plugins, permissions, knowledge collections, working folder, secrets, network hosts). Model `strictness` is `always` (setup blocks until the model is available) or `preferred` (fall back to the user's default with a notice).
- `id` + `version` + content hash identify a template. A new `id` imports, a higher version is an update, an older one joins the history, and the same version with different content asks Keep both or Replace.
- `kind` must be `agent`.
- Optional `mcp_server_hints` describe how to connect each named MCP server (`directory_id`, `transport`, `url`, `auth`, `command`, `args`, `env_keys`, `header_keys`, `working_directory`). Only header and variable names travel, never values.

### Portability

References are names or stable string IDs, never UUIDs: MCP servers by name, plugins by registry ID, knowledge collections by name, subagents by agent name. `working_folder` is a path hint; the security-scoped bookmark never leaves the Mac. Relay exposure and knowledge collection IDs are stripped when a template is made from a live agent.

### Accepted import shapes

The importer accepts the envelope above (JSON or YAML), a full declarative document with exactly one agent, or a bare agent entry (a mapping with `name`). The last two are wrapped into a template named after the agent.

### Signing

Exported files are signed with the master key under the domain `Osaurus Signed Template` when one exists. A signature that fails to finish leaves the file unsigned rather than unwritten. Publishing uploads the same signed file to a page at `store.osaurus.ai/a/…`; workflows the template carries travel inside it.

### Installing from a link

**Install agent** on store.osaurus.ai opens `osaurus://templates-import?url=…`, which shows the import review on the Templates page with the host it came from. An install from a published page counts once per Osaurus ID, with the same signed receipt a workflow install sends.

### Storage

Every version is kept in `~/.osaurus/template-library/<template-id>/v<N>.json`, with per-Mac preferences in `index.json`. What this Mac has published is recorded in `~/.osaurus/template-library/registry.json`. Built-ins ship inside the app. Whole-config YAML templates saved by `osaurus_config export --save_as` stay in `~/.osaurus/templates/`.

### Orchestrator

`osaurus_config` `templates` lists visible agent templates under `agent_templates`. `plan` / `apply` with `template: "<name>"` resolves an agent template first, then a YAML template of that name; `overrides: {name, description, system_prompt, model}` merge on top. Applying a hidden template fails with a pointer to the Templates page.

### Setup checks

Every agent creation path (create, duplicate, config apply, template, [bundle import](/bundles)) marks the agent for a setup check. The check looks for gaps the author couldn't grant on someone else's Mac: a working folder with no usable bookmark, a pinned model that doesn't resolve, missing system permissions, Knowledge on with no collection, and manual tools nothing here provides. `spawn_agent` refuses a flagged agent with blocking items. The marker clears once the check passes.

### Installing from the command line

Installers can pre-load agents without the import sheet by shipping them in an [Osaurus Bundle](/bundles) and running `osaurus import install`.

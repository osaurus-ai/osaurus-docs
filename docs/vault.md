---
title: Vault
sidebar_label: Vault
description: The one place for the API keys, tokens, passwords and sign-ins your agents, workflows, tools and channels use. Values stay in your Mac's Keychain, and showing one needs Touch ID or your password.
---

# Vault

The **Vault** keeps every key, token and password your agents and [workflows](/glossary#workflow) use, in one place. Add a key once, and everything that asks for that name uses it. You don't paste the same key into five different settings pages, and you always know where to change it.

Here's a typical moment. You install a "Daily standup" workflow a friend shared. It needs a key for their task tracker. Shared workflows never include keys, so the Vault lists it under **Missing Keys**. You click **Set**, paste your own key, and the workflow is ready to run.

The values are kept in your Mac's [Keychain](/glossary#keychain), macOS's secure password storage. They stay on this Mac and don't sync to your other devices.

## Get started: add a key

1. Open Settings: click the gear icon at the bottom of the narrow strip on the left edge of the window, or press ⌘,.
2. Under **General**, choose **Vault**.
3. On the **Your Keys** tab, click **Add Key**.
4. Fill in the sheet:
   - **Name**: the name programs look for, such as `GITHUB_TOKEN`. Use letters, numbers and underscores.
   - **Who Can Use It**: **All agents**, or one agent (**Only for** *that agent*). A value for one agent replaces the value for all agents when that agent runs.
   - **Value**: paste the key.
   - **Description** (optional): a note on what the key is for.
5. Click **Add Key**.

Two switches in the sheet change how the key is treated:

- **Hide Value** (on by default) masks the value here and removes it from anything a tool prints. Turn it off for settings that aren't secret, like a user name or a server address. A value that isn't hidden can span several lines, which some keys need.
- **Agents Can Use This When Running Code** lets code an agent runs in its [Sandbox](/glossary#sandbox) read the key.

## Your Keys

This tab holds the keys and settings that agents, workflows, tools and channels use.

- **Missing Keys** sits at the top whenever something you set up still needs a value. A workflow installed without its keys shows up here, and so does a tool or channel waiting for a token. Click **Set** to save the value for all agents. If some agents already have their own value, the row says so, because runs that aren't tied to an agent can only use the shared value.
- **All Agents** lists the shared keys. Click one to change it. Its **…** menu also has **Use a Different Value For** (give one agent its own value), **Let Agents Use This in Code** or **Stop Agents Using This in Code**, and **Delete…**.
- **One agent's keys.** The agent picker beside the search field switches the list to one agent. Pick a key and click **Use a Different Value** to give that agent its own value. **Use the Value for All Agents…** removes the agent's own value after you confirm with **Remove Own Value**.

### Seeing or copying a value

Click **Show** or **Copy** next to a key. Osaurus asks for Touch ID or your Mac password first. A shown value hides again after a few seconds. A copied value stays on this Mac (it doesn't go to your other Apple devices' clipboard) and is cleared after a minute.

## App Keys

**App Keys** lists the keys Osaurus itself uses: your cloud model [providers](/glossary#provider), web search, voice, Hugging Face and GitHub. Each row says what the key is for. You can change them here or on their own settings pages. Agents and workflows can't read these.

## Accounts

**Accounts** lists every sign-in, grouped by service: MCP servers, model providers, workflow connections, and your Discord and Telegram bots and Slack workspaces. Each sign-in is a *session*, so you can be signed in to two accounts of the same service, such as "GitHub · Work" and "GitHub · Personal".

- **Sign In** (or **Add Session** when you already have one) signs in to another account.
- The session marked **Default** is the one agents use unless you pick another for them.
- Each session's **…** menu has **Rename…**, **Make Default**, **Sign In Again**, **Sign Out** and **Remove…**.
- With one agent chosen in the picker, you pick which session that agent uses for each service. The [Orchestrator](/glossary#orchestrator), the [Architect](/glossary#architect) and runs on shared keys always use the default.
- Discord, Telegram and Slack are added, renamed and removed in [Channels](/agent-channels). Their cards here have **Manage in Channels**, and each bot's **…** menu has **Make Default** and **Open in Channels**.

### Connections in Workflows

The **Connections** link on the Workflows page (the second icon on the left edge of the window) shows the same sign-ins, from the workflows' side. Each one shows its status and the workflows that use it, with **Sign In Again** or **Replace Value**. Workflows still missing a sign-in are listed under **Needs Setup** with **Set Up**. **Manage All Sign-Ins in Vault** brings you back to **Accounts**. See [Run a Workflow](/workflows-run).

## Good to know

- **Shared names share a value.** Two workflows, or a workflow and a tool, that both ask for `GITHUB_TOKEN` use the same key. To give one workflow its own value, turn on **Use a separate value for this workflow** during its setup.
- **Uninstalling keeps keys.** Removing a workflow or tool leaves its keys in the Vault, since something else may use them. Delete them here. Deleting an agent deletes that agent's own values.
- **Hidden values need an unlocked Mac.** An automation that runs while your screen is locked can't read hidden values. Values that aren't hidden still work.
- **Vault is not Access Keys.** The Vault holds keys Osaurus uses to reach other services. [Access keys](/glossary#access-key), which let other apps reach your Osaurus, are in **Settings → Server → Access Keys** and on [Osaurus ID](/identity).
- **Keys are never typed into chat.** When an agent or workflow needs a secret, Osaurus asks in a secure field and saves it here.

---

## Under the hood

### Storage

| What | Where |
|---|---|
| Hidden values | Keychain service `ai.osaurus.credentials`, account `global/<KEY>` or `agent/<uuid>/<KEY>`, `kSecAttrAccessibleWhenUnlockedThisDeviceOnly` (no iCloud sync, unreadable while locked) |
| Key records (name, scope, kind, description, exposure, origin, dates) and the values of visible keys | `~/.osaurus/credentials/index.json` |
| Bindings (which key fills which slot) | `~/.osaurus/credentials/bindings.json` |

Names match `[A-Za-z_][A-Za-z0-9_]*` and are at most 128 characters, so every name is a valid environment variable. Values are at most 64 KB. In a non-default [Space](/storage), keys live in that Space's own Keychain entries.

### Resolution

A *slot* is one place that needs a value: an MCP environment variable, header or bearer token, a plugin's declared secret, a channel token, or a workflow key. For a slot read on behalf of an agent, Osaurus uses the agent's own value for the slot's key, then the global value. **Missing Keys** checks global values only, because an MCP server or channel started outside an agent turn has no agent.

Default key names:

| Consumer | Default key |
|---|---|
| MCP env var | The variable name when it's upper snake case, else `<SERVER>_<NAME>` |
| MCP header / bearer token | `<SERVER>_<HEADER>` / `<SERVER>_TOKEN` |
| Plugin secret | The spec name when upper snake case, else `<PLUGIN>_<SPEC>` |
| Native channels | `SLACK_BOT_TOKEN`, `SLACK_APP_TOKEN`, `SLACK_SIGNING_SECRET`, `DISCORD_BOT_TOKEN`, `TELEGRAM_BOT_TOKEN` |
| Custom JSON / n8n channel | `<CONN>_<SECRET>` |
| Workflow | The declared key, upper-snake-cased |

When an installer would overwrite a different value under the same name, it saves `<OWNER>_<KEY>` instead and records the binding.

### Configuration and the sandbox

A [configuration](/configuration) document points at a shared key with `credential:KEY`; the value itself never appears in the document. Keys with **Agents Can Use This When Running Code** on reach the agent's sandbox as environment variables: the global keys first, overlaid by the agent's own. Keys an agent saves with `sandbox_secret_set` are agent-scoped. The agent's **Sandbox** row lists what it sees, with **Open Vault**.

App Keys (provider, web search, TTS, Hugging Face, GitHub) stay in their own stores and aren't agent-usable. OAuth sign-ins stay with their MCP server, provider or workflow connection and are listed on **Accounts**.

### Showing values

**Show** and **Copy** use `LAContext.deviceOwnerAuthentication`, reused for 60 seconds. A shown value hides after 10 seconds. Copy writes with `.currentHostOnly` (no Universal Clipboard) and clears the pasteboard after 60 seconds unless something else was copied.

### Upgrading

Keys saved by older versions in per-feature Keychain items are copied into the Vault one second after launch. The copy never deletes or rewrites the old items, so going back to an older version keeps working, and a key you edit or delete in the Vault is never brought back by the old value.

---

**Related:**

- [Run a Workflow](/workflows-run): setup, **Needs setup**, and where workflow keys go
- [Agent Channels](/agent-channels): bot tokens and accounts
- [Security & Privacy](/security): the overall trust story
- [Storage & Encryption](/storage): where everything else lives

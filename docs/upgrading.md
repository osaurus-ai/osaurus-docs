---
title: Upgrading from Osaurus Classic
sidebar_label: Upgrading from Classic
description: Moving from Osaurus Classic (0.25) to Osaurus 1.0? Your chats, agents and keys carry over. Here's what's new, what changes the first time you use it, and how to go back.
---

# Upgrading from Osaurus Classic

Osaurus 1.0 is a big update to the app you already have. Your chats, agents, models and keys all carry over, and nothing is deleted. A few things have new names or new homes, and one or two need a moment of setup the first time you use them.

"Osaurus Classic" is what we now call the versions before 1.0 (numbered 0.25).

## What's new in 1.0

- **[Workflows](/workflows).** Turn a task you do often into one click. Describe it to the [Architect](/glossary#architect), test it, save it, and share it with a link.
- **[Automations](/automations).** Schedules and Watchers are now one place, and they can run a workflow, an agent, or a quick question.
- **Settings inside the main window.** Click the gear at the bottom of the narrow strip on the left edge of the window, or press ⌘,.
- **The [Vault](/vault).** All your keys, passwords and sign-ins in one place.
- **[Devices & Sync](/devices).** Your chats on your other Macs and your iPhone, end-to-end encrypted.

## What carries over

- Your chats, agents, models, providers, tool servers, plugins and settings.
- Your keys and passwords. They're copied into the new [Vault](/vault); nothing is removed from your Keychain.
- Your Schedules and Watchers. They become [automations](/automations) with the same settings.
- Your [Osaurus ID](/identity) and recovery phrase.

You won't see the welcome screens again. The new starter team (Planner, Courier, Keeper, Scout and Builder) and the seven built-in workflows aren't added to an existing setup, so your agent list stays as it was. Want the team? Open **Settings → Agents → Delegation** and click **Create starter agents**.

## What changes the first time you use it

### The Sandbox is rebuilt

The first time an agent runs code after you update, the [Sandbox](/glossary#sandbox) sets itself up again. This needs an internet connection for a small download, and briefly uses about 8 GB of extra disk space.

Anything you installed inside the old Sandbox, like Python or npm packages, needs installing again. Your files in the Sandbox are kept.

### Themes are now Light or Dark

Custom themes are gone. If you were using one, Osaurus switches to Light or Dark to match it. See [Appearance](/appearance).

### Pairing over your local network is gone

Older versions of the Osaurus iPhone app, and other Macs, could find this Mac on your Wi-Fi and pair with it. That's been replaced by [Devices & Sync](/devices), which works on any network. Access keys you already made keep working until they expire or you revoke them.

The iPhone app's 6-digit code still works for now, while the iPhone app moves to Sync.

### Settings have new names

Many Settings pages moved or were renamed. Searching Settings for the old name still finds the new page.

| Before | Now |
|---|---|
| Keys | **Vault** (Settings → General → Vault) |
| Schedules and Watchers | **Automations** (pinned at the top of Settings) |
| Sync and Mobile | **Devices** (Settings → Sharing → Devices) |
| Identity | **Osaurus ID** |
| Credits | **Wallet & Credits** (in Osaurus ID) |
| Privacy | **Privacy & Security** |
| Computer Use and Browser Use | **Computer & Browser Use** |
| Images | **Images & Video** (image model downloads are under Local Models → Image) |
| Core Model | **Models → Model Defaults → Core Model** |
| Insights | **Developer Tools → Insights** |
| Themes | **Appearance** (Settings → General → Appearance) |
| Public Links | **Remote Access** |

## Going back to Classic

Osaurus never downgrades itself. To go back, download the latest Classic release (numbered 0.25) from the [Releases page](https://github.com/osaurus-ai/osaurus/releases) and install it over 1.0.

Before you do, know that:

- Workflows and automations made in 1.0 won't run in Classic.
- Keys you added or changed after updating won't be there.
- Chats that exist only in sync won't show up.
- The Sandbox is rebuilt again, and packages installed after the update are gone.

Your 1.0 data stays on your Mac, so updating to 1.0 again later picks up where you left off.

---

## Under the hood

- **Who gets 1.0:** new downloads, Homebrew and the website install Osaurus 1.x, which updates from `appcast-next.xml`. Classic (0.25.N) gets fixes only from `appcast.xml`. A Classic user is offered 1.0 after turning on **Beta Updates** in Settings → General; Sparkle asks before installing.
- **Same app and data:** the update is in place (`com.dinoki.osaurus`, `~/.osaurus`). Keychain service names, the account master key (`com.osaurus.account`) and the storage key (`com.osaurus.storage`) are unchanged. `CredentialMigration` copies legacy secrets into the Vault's credential store and deletes nothing.
- **Databases:** chat history moves from schema 24 to 26 (two added columns), which Classic still opens. Memory and Knowledge schemas are unchanged.
- **Automations:** `EventMigration` copies schedules, watchers and channel inbound routes into `~/.osaurus/events/` once and leaves the originals (renamed `*.json.migrated`).
- **Onboarding:** anyone who finished onboarding on 0.9.7 or later doesn't see it again, and no teammates or default workflows are seeded.
- **Sandbox rebuild:** the first start downloads a new init filesystem (about 64 MiB) and builds per-agent environments, briefly using about 8 GiB of disk. Loose files at the workspace root move to `shared/`. If the first start fails, the old sandbox disk is kept for a retry. See [Sandbox](/sandbox).
- **LAN pairing:** 1.0 no longer advertises `_osaurus._tcp` over Bonjour and drops `GET /pair/challenge` and `POST /pair`.
- **Downgrade details:** Classic reads the pre-update Keychain items. Self-schedule tables are renamed `agent_runs_legacy` and `agent_next_run_legacy`. When Classic re-saves an agent, remote agent or sandbox settings, 1.0 keeps a copy under `~/.osaurus/classic-resave/` and restores only the fields Classic dropped. Not restored: `automations` and other new sections of a saved config template, the default agent's avatar, the Slack workspace name, and newer chat tab layout fields.
- **Osaurus Beta app:** the separate Osaurus Beta (`com.dinoki.osaurus.beta`) shares `~/.osaurus`, so workflows and automations made there run in Osaurus 1.0 too.
- Full upstream notes: [`docs/UPGRADE_CLASSIC_TO_1.0.md`](https://github.com/osaurus-ai/osaurus/blob/main/docs/UPGRADE_CLASSIC_TO_1.0.md).

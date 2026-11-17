---
title: Workflows on Windows
sidebar_label: Workflows
description: A workflow is a task Osaurus for Windows remembers how to do. Describe it to the Architect, test it, then run it with one click, on a schedule, when a folder changes, or from an agent. Share it as a file or on store.osaurus.ai.
---

# Workflows

A [workflow](/glossary#workflow) is a task Osaurus remembers how to do. You describe it once, test it, and from then on it runs the same steps every time: with one click, on a schedule, when files land in a folder, or when one of your agents needs it.

You don't write any code. You tell the [Architect](/glossary#architect), Osaurus's workflow builder, what you want in your own words, and it builds the steps for you, using one of your models (see [Models](/windows/models)).

## Get started

1. In the sidebar, click **Workflows**. You land on the Workflows home page.
2. Click **New workflow** (or press **Ctrl+N**).
3. Describe the task, for example "Turn meeting notes into a summary and action items with owners", and send it.
4. The Architect builds the steps and tests them with you. When a test passes, click **Save**.
5. Your workflow is now on the Workflows home page. Click **Run** next to it whenever you need it.

The full walk-through is in [Build with the Architect](/windows/workflows-build). Running, setup and triggers are in [Run a workflow](/windows/workflows-run).

## Why use a workflow?

A chat is good for a one-off question. A workflow is for the things you do again and again.

- **No retyping.** You explain the task once. After that it's one click, or none.
- **The same steps every time.** A good result stays good.
- **You can read every step.** A workflow's page says what you give it, what it does, and what you get back, in plain words. **Full view** shows the whole workflow from left to right.
- **It runs where you need it.** From the Workflows page, from a chat, from one of your agents, by asking Osaurus, on a schedule, or when a folder changes.
- **You can share it.** Save it as a file, or publish it on store.osaurus.ai, so someone else can install it on their own PC.

## The Workflows home page

Click **Workflows** in the sidebar. Under it, the sidebar lists **Drafts** (workflows the Architect is still building) and **Runs** (run pages you have open). A dot shows while a run is working, and turns amber while it waits for you.

The home page has:

- **Import** and **New workflow** at the top, with **Connections** (sign-ins your workflows share) and **Automations** (start workflows on a schedule, from a folder, or from a channel message).
- **Running now**: runs in progress, with **Respond** for one that waits for you and **Stop**.
- Tabs **All**, **Drafts**, **Published** and **Workspaces** (the last three appear once they have something in them), plus a search box (**Search by name or tag…**).
- One row per workflow, with **Run**, or **Set up** when it still needs something. Click a row to see its recent runs, **See all runs** and **Run with different input**.

A row's **…** button (More actions) has **Open**, **Edit with the Architect**, **Share…**, **Export…**, **Rename…**, **Version history**, **Osaurus can run this for you**, and **Uninstall…**.

## Ready-made workflows

Osaurus comes with three [starters](/glossary#starter): **Email Reply**, **Meeting Action Items** and **Social Post Writer**. To add one, click **New workflow** and pick it under **Or add a ready-made workflow**. A preview shows what it uses; click **Add**.

## Who can start a workflow

A workflow's page has a **Who can start it** section:

- **You**, from its run page, or by typing **/** in a chat with an agent that has it.
- **Osaurus can run this for you**: when this is on, the [Orchestrator](/glossary#orchestrator) can run the workflow when you ask it to.
- **Teammates can run this**: shown only when this PC serves a [workspace](/windows/workspaces). Off by default.
- **Agents that can use it**: lists the agents that have this workflow turned on.

To let one of your own agents use a workflow, open the agent's editor, go to **Abilities → Workflows** ("Runs saved workflows as tools"), and turn the workflow on. The agent can then run it as a tool, and you can pick it from **/** or from the **+** menu's **Workflows** in that agent's chats. In the sidebar, an agent's **Workflows** item opens a pane beside its chat with the workflows on this PC and the starters.

**Fix repeated failures automatically**, on the same page, has the Architect draft a fix in a background chat when the same step fails 3 runs in a row, and notifies you. Nothing is saved until you review it.

## Import a workflow

On the Workflows home page, click **Import**:

- **From a file…** opens a `.osaurustemplate` (or `.json`) file. You can also drop a file anywhere on the page, or double-click it in File Explorer.
- **From a link…** takes a link to a workflow published on store.osaurus.ai.

Osaurus always shows a review first: **What it can reach**, what **Setup will ask for**, and a warning if the workflow **Can't run on Windows** or **This version reaches further** than the one you have. Nothing is added until you click **Add to library**.

## Export a workflow

Open the workflow's menu and choose **Export…**.

- **Sign with my Osaurus ID** shows who made the file and that nobody changed it since. Without an [Osaurus ID](/glossary#osaurus-id) on this PC, the file is saved unsigned.
- **Suggest the models I use** fills steps that name no model with the ones you use. This saves a new version first.
- **Include how to connect my MCP servers** adds each server's address or command and the names of its keys, never their values.

Click **Save file…**. Secrets, saved answers and folder paths are never included.

## Share a workflow

On a workflow's page, click **Share**. A pane opens beside the page with two choices:

- **Save as a file**: a `.osaurustemplate` anyone can review and install. No account needed.
- **Publish to store.osaurus.ai**: a page with a link, signed with your Osaurus ID. You choose who can find it, and you can update it or take it down.

Publishing needs an Osaurus ID (create one in **Settings → Account → Account**; see [Account](/windows/account)). Windows asks you to confirm it's you with Windows Hello before it publishes.

Under **Who can find it**, pick one:

| Choice | Who can open it |
|---|---|
| **Hidden** | Anyone with the link. It isn't listed. |
| **Password** | Anyone with the link and a password you set (6 to 128 characters). Send the password separately. |
| **Workspace** | Members of the [workspaces](/windows/workspaces) you pick, from their own Workflows page. Not listed or reviewed. |
| **Public** | Anyone. It's listed in the store once the Osaurus team approves it, usually within 24 hours. Until then it's unlisted, but your link works right away. |

**What travels**: every step, its prompts and the tools it calls, and the form it asks people to fill in. Secret values, saved answers and folder paths stay on this PC. People who install it run it on their own PC, with their own keys.

Once it's live, the pane shows a share card (**Copy image**, **Save image…**, **Share…**), the link (**Open page**, **Copy install link**) and a QR code. Later it shows who can find it, the listing, the versions, **Publish vN** when you've saved a newer version, and **Take down…**. If a reviewer asks for changes, **Revise with Architect** opens the workflow with their note, and Osaurus tells you when a review is decided, even with the pane closed.

You can also publish from the Architect: the draft's fourth tab is **Publish**.

## Troubleshooting

| What you see | What to do |
|---|---|
| **Set up** instead of **Run** | The workflow needs a model, a key, a folder or a package. Click **Set up** and follow the steps. See [Finish setting it up](/windows/workflows-run#finish-setting-it-up). |
| **Can't run on Windows** | A step needs something Windows doesn't have, so it can't run here. Its page says what. |
| Publishing needs an Osaurus ID | Create one in **Settings → Account → Account**, then publish. |
| **Save** is greyed out in the Architect | It hasn't passed a test since the steps changed. Run a test first. |

---

## Under the hood

- Workflows are their own section of the sidebar (`ShellSection.Workflows`); Settings no longer has a Workflows page, and its old route lands in the section.
- A shared or exported workflow is a template file, `.osaurustemplate`. Opening one, or an `osaurus://templates-import?url=…` link, lands on the import review.
- The store's API is `https://api.store.osaurus.ai`; a release build always uses it. Publishing signs the template with your Osaurus ID.
- The three starters ship inside the app, as the Mac ships them.

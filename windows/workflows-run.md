---
title: Run a workflow on Windows
sidebar_label: Run a workflow
description: Run a workflow with one click, fill in its form, finish its setup, give it the sign-ins it needs, look at what it made, and run it on a schedule or when a folder changes.
---

# Run a workflow

Once a [workflow](/windows/workflows) is saved, running it takes one click. This page covers running it by hand, finishing its setup, the sign-ins it uses, what you get back, and having it run by itself.

## Run it from the Workflows page

1. Click **Workflows** in the sidebar.
2. Click **Run** next to the workflow.
   - If it asks for nothing, it starts straight away, and its row shows the run.
   - If it has a form, its run page opens. Fill in the form, or click **Fill with example**, then click **Run** (or press **Enter**).
3. Watch each step work. **Stop** ends the run.

Runs in progress are listed under **Running now** on the home page, and each run page you open is listed in the sidebar under **Runs**.

## The run page

At the top of a run page:

- **About this workflow** opens the workflow's page.
- **Full view** shows this run on a canvas: every step, line and form. Zoom with **Ctrl+plus** and **Ctrl+minus**; **Fit** (**Ctrl+0**) shows the whole workflow.
- **Insights** shows what runs cost and how long they took.
- **Runs** lists earlier runs, with **New run** at the top.

Below the steps you get:

- **Result**, laid out as the workflow describes it. **Copy all** copies it.
- **Images**: pictures the run made. Click one to open the viewer (see below).
- **Files**: files it made, with **Open** and **Show in File Explorer**.
- **Changes**: what it changed in your folders. **Review** shows each change and lets you undo any of them.

Click a step to see its **Input**, **Output** and **Log**. When you're done, **Run again** (**Ctrl+Enter**) starts another run.

### Look at the pictures it made

Pictures a workflow makes open in a viewer over the run page. Step through them with the arrows (or the left and right arrow keys), and:

- **Open** it in your image app, **Copy image**, or **Show in File Explorer**.
- Copy its **Prompt** (and **Negative prompt**, if it has one).
- Copy the settings that made the image.

Press **Esc** to close the viewer.

## When it asks you something

Some workflows stop partway to ask you something in a short form. The run waits: its dot in the sidebar turns amber, and **Running now** shows **Respond**. Open the run, fill in what it asks, and click **Continue**.

## When something goes wrong

When a run fails, the run page shows where it stopped and why, with:

- **Retry from failed step**: runs the failed step and everything after it again, keeping the steps that finished.
- **Fix with the Architect**: opens the run with the [Architect](/glossary#architect), which re-tests from the failed step and proposes a fix. See [Build with the Architect](/windows/workflows-build#fix-a-failed-run).

## Finish setting it up

A workflow may need things before it can run: a model for each step, a key, a folder, packages. When something is missing, its row shows **Set up** instead of **Run**.

1. Click **Set up** (or **Set up…** on the workflow's page).
2. Go through the steps with **Next**. Only the steps this workflow needs are shown:
   - **Models**: the model each step uses. A cloud model sends that step's input off this PC.
   - **Secrets**: keys and tokens. Values are stored encrypted on this PC and never shown again. Instead of pasting a value, you can pick a connection (see below).
   - **Folders**: the folders on this PC it works in. Only these, and folders you allow during a run, are reachable.
   - **Agents**: who answers each task the workflow hands to an agent. **Allow without asking** lets those steps hand their task over without asking you each time.
   - **Tools and servers**: things set up elsewhere in Osaurus, such as an MCP server. Each has a button that takes you there.
   - **Dependencies**: packages the workflow needs (see below).
3. **Review** lists what you chose. Click **Finish**.

### Packages a workflow needs

Some workflows need extra programs, such as a video downloader. These install into a [sandbox](/windows/sandbox) of the workflow's own, never onto this PC.

On the **Dependencies** step (or **Install dependencies** on the workflow's page), click **Install**. The first install also starts the sandbox, so it can take a few minutes. Before you press **Install**, the row names the packages it will put in the sandbox, for example "yt-dlp (pip)". Osaurus waits for up to 30 minutes for the install to finish. If it doesn't finish, press **Install** again; what was already installed is kept.

## Connections

A connection is a sign-in that several workflows can share, so you sign in once. On the Workflows home page, click **Connections**.

- **Add a key or token**: give it a **Name**, choose the **Service**, paste the **Key or token**, and click **Add connection**.
- **Sign in to a service**: choose the **Service** and click **Sign in…**. Finish signing in in your browser; the page updates when you're done. Some services need you to register your own app first: paste its **Client ID** and **Client secret**, and give the service the **Redirect URL** shown (**Copy**).

Services include GitHub, GitLab, Google, Microsoft, Slack, Linear, Notion, Dropbox, Spotify and Stripe, or **Other** for anything else. Each connection says which workflows use it. Values are stored encrypted on this PC and never shown again. When a sign-in expires, click **Sign in again**.

## A workflow's page

Click a workflow on the home page (or **About this workflow** on a run page) to open its page:

- **What it does**: **You give**, **Osaurus does** and **You get**, in plain words, then its steps.
- **Runs**: its recent runs.
- **Before it runs**: whether it's ready, with **Set up…** when it isn't.
- **Who can start it**: see [Who can start a workflow](/windows/workflows#who-can-start-a-workflow).
- **Tags**: your own labels for finding it on the home page (**Edit tags…**).
- **Details**: its secrets and connections, its folders (**Change…**), what you've always allowed it to do (**Revoke**), **Stored data** it keeps between runs (**View**, **Clear…**), **Saved answers** its forms remember (**Forget**, **Forget all…**), and its **Sandbox environment**.

**More** has **Set up…**, **Rename…**, **Export…**, **Version history** and **Check for update**.

**Uninstall…** deletes its saved answers, stored data, secrets and run history on this PC. The template stays in your library.

## Run it on a schedule or when a folder changes

A workflow can run by itself, at times you choose or whenever files change in a folder. These are [Automations](/windows/automation).

1. Open **Settings → Automations → Schedules** (or **Watchers**) and click **Add schedule** (or **Add watcher**).
2. Under **What it does**, choose **A workflow runs**, then pick the **Workflow**.
3. Under **What the workflow gets**, fill in each input with fixed text or a value from what started it, such as `{{trigger.name}}`. A watcher can pass the changed files.
4. Set when it runs, and click **Save**.

The home page's **Automations** button goes to the same place. You can also tell the Architect when to run it while you build it (see [Run it on a schedule straight away](/windows/workflows-build#run-it-on-a-schedule-straight-away)).

A run started this way shows **Automation ·** and the automation's name, and is listed with the workflow's other runs.

## Other ways to run it

- **From a chat**: type **/** in a chat with an agent that has the workflow, or use the **+** menu's **Workflows**.
- **By asking Osaurus**: when **Osaurus can run this for you** is on.
- **From one of your agents**: turn the workflow on in the agent's **Abilities → Workflows**. A run an agent starts shows as a card in its chat, with **Open run**, and a form the run waits on can be answered right there.
- **From a channel message**: see [Channels](/windows/channels).

## Troubleshooting

| What you see | What to do |
|---|---|
| **Set up** instead of **Run** | Click it and finish the steps it shows. |
| **Keys missing** | Add the missing secrets or connections in **Set up**. |
| **Can't run on Windows** | A step needs something Windows doesn't have, so it can't run here. Its page says what. |
| An install stops with "did not finish in 30 minutes" | Press **Install** again. What was installed is kept. |
| **Sign in again** on a connection | Its sign-in expired. Click **Sign in again**. |
| An automation's run was skipped as "needs setup" | Open the workflow and finish **Set up**. |

---

## Under the hood

- A run started by a schedule or watcher is an unattended automation run with no agent, in the trigger's folder. It shares the automation lane's two slots with agent runs, and gives up its slot while a form waits on you.
- A watcher's inputs can use `{{trigger.paths}}`, `{{trigger.count}}`, `{{trigger.folder}}` and `{{trigger.name}}`; a schedule's can use `{{trigger.slot}}`, `{{trigger.name}}` and `{{trigger.folder}}`.
- Package installs go to the workflow's own sandbox environment. The app waits up to 30 minutes for one to finish; a failure names the missing packages, as `name (manager)`.
- A browser sign-in for a connection waits at most five minutes.

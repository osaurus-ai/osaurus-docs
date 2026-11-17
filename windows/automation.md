---
title: Automations on Windows
sidebar_label: Automations
description: Have Osaurus for Windows do things by itself — run a workflow, an agent or a quick question at times you choose or whenever a folder changes, send an agent off on a background task, or let an agent book its own next run.
---

# Automations

An automation does something for you without being asked: every weekday at 8, whenever a file lands in Downloads, or when an agent decides to check back tomorrow. It can run one of your [workflows](/windows/workflows), hand instructions to one of your agents, or ask a model a quick question.

Everything is in **Settings → Automations**, which has four pages:

- **Tasks**: send an agent off to do something in the background, and see every background run.
- **Watchers**: run something whenever files change in a folder.
- **Schedules**: run something at times you choose.
- **Channels**: start runs from messages in other apps. See [Channels](/windows/channels).

An agent can also book its own next run (see [Wake-ups](#wake-ups)).

## When they run

Automations run while Osaurus is running, including when the window is closed and Osaurus is in the system tray. They don't run while Osaurus is quit or the PC is asleep. To have Osaurus running whenever you're signed in, turn on **Settings → General → Behavior → Start at login**.

A schedule time missed while the PC was asleep or Osaurus was closed runs once when it's back, however many were missed, and the agent is told it's late.

Nobody is there to answer questions during these runs, so an agent can't change your files or run commands unless you allow it in the schedule's or watcher's editor (see [While nobody is watching](#while-nobody-is-watching)).

## What it does

Schedules and watchers both start with **What it does**. Pick one:

- **A workflow runs**: pick an installed **Workflow**. Under **What the workflow gets**, fill in each of its inputs with fixed text or a value from what started it, such as `{{trigger.name}}`. A watcher can pass the files that changed. This is usually the best choice for a repeat task.
- **An agent works on it**: pick one of your own **Agent**s and write the **Instructions** for each run.
- **Ask a model**: one answer from a **Model**, with no tools, to **What to ask the model**. Leave the model on **This PC's default chat model**, or pick another.

Each run starts fresh and doesn't see earlier runs, so the instructions must carry everything it needs.

## Schedules

**Settings → Automations → Schedules → Add schedule.**

1. **Name** it, and choose **What it does** (see above).
2. Under **When**, pick **How often**:

   | Option | Runs |
   |---|---|
   | **Once** | At one date and time, then it's done |
   | **Every few minutes** | Every 5 to 1440 minutes, counted from midnight (every 15 runs at :00, :15, :30, :45) |
   | **Hourly** | Every hour, at a minute you choose |
   | **Daily** | Every day at a time |
   | **Weekly** | One day a week, at a time |
   | **Monthly** | One day a month (a day past the end of a short month runs on its last day) |
   | **Yearly** | One date a year (29 February runs on the 28th in other years) |
   | **Cron expression** | Five fields, numbers only, such as `0 9 * * 1-5` ([cron](/glossary#cron)) |

   **Next runs** previews the coming times, and warns you when a schedule means many runs a day.
3. Optionally choose a **Folder (optional)** for it to work in. Without one, an agent can read, search the web and report, or work in its own [sandbox](/windows/sandbox) if it has one.
4. Leave **Run at these times** on, and click **Save**.

In the list, each row says what it runs (the agent's name, **Workflow** or **Model answer**) and when it runs next.

- The switch on each row pauses and resumes it.
- **▶** runs it now; the next scheduled time still runs. **Stop** ends a run in progress.
- The pencil edits it; **…** has **Open last run in Tasks** and **Delete**.

Runs never overlap: a time that comes due while the previous run is still going is skipped, and the row says so.

## Watchers

**Settings → Automations → Watchers → Add watcher.**

1. **Name** it, and choose **What it does** (see above).
2. Choose the **Folder** to watch. Turn on **Include subfolders** to count changes anywhere inside it.
3. Pick **Responsiveness**: how long Osaurus waits for changes to settle before running.

   | Setting | Waits about |
   |---|---|
   | **Fast** | 200 ms |
   | **Balanced** | 1 second |
   | **Patient** | 3 seconds |
   | **Relaxed** | 1 minute |
   | **Deferred** | 5 minutes |
   | **Extended** | 10 minutes |

4. For an agent, write the **Instructions** (for a model, **What to ask the model**). An agent also gets the folder's path and the list of files that changed. Write instructions that are safe to run twice: skip anything already done.
5. Leave **Watch this folder** on, and click **Save**.

In the list, the switch pauses and resumes watching, **▶** runs it on the whole folder (when it isn't already working), and **…** has **Open last run in Tasks** and **Delete**. Changes a run makes itself don't set the watcher off again.

## While nobody is watching

Both editors have an **Allowed while nobody is watching** section. With both switches off, an agent can look and report but not change anything.

- **Create and edit files in this folder** lets it write and edit files in the chosen folder.
- **Run commands** lets it run commands. Moving and renaming files needs this. A command can reach anything your Windows account can, not just this folder.

A schedule with no folder, for an agent that uses the [sandbox](/windows/sandbox), works in the agent's own sandbox home instead. There it can create files and run commands without these switches, and none of your files are in reach.

For **A workflow runs**, the same switches apply to the workflow's steps in that folder. Without a folder, its steps have no files of yours to change. **Ask a model** uses no tools, so there's nothing to allow.

Your choices are saved as always-allow rules for that agent (or workflow) in that folder, so they also apply when you chat with the agent there. Review or revoke them in **Settings → General → Behavior**. An agent whose **File edits and commands** permission is **Deny** stays denied.

## Seeing the runs

- **An agent's run** opens as its own read-only conversation under the agent, named **Schedule · *name*** or **Watcher · *name***. It's added without taking you away from what you're doing. You can read it and stop it, but not continue it. Every run is a fresh conversation that doesn't see earlier runs.
- **A workflow's run** is listed with that workflow's runs in [Workflows](/windows/workflows-run), marked **Automation ·** and the automation's name.
- **A model's answer** is saved as a read-only conversation under the [Orchestrator](/glossary#orchestrator), and listed in Tasks as **Model answer ·** and its name.

Each editor also lists **Recent runs**, with **Open in Tasks**.

## Tasks

**Settings → Automations → Tasks** sends one of your agents off to do something in the background, while you carry on.

1. Pick an **Agent**.
2. Type what it should do in **Prompt**.
3. Click **Dispatch**.

The list shows recent background tasks, including the runs your schedules and watchers start. Select one to see its **Prompt**, its **Result**, and its **Activity** as it works. You can cancel one that's running, and **View trace** shows the run's step-by-step record.

## Wake-ups

An agent can book its own next run, for example to check back on something tomorrow. In the agent's editor, open the **Abilities** tab, then **Wake-ups**, and turn on **Let it wake itself up**. Each wake-up is a new conversation, in the folder of the conversation that booked it, with nobody there to answer it.

**How often it may wake**:

| Mode | Limits |
|---|---|
| **Ambient** | Up to a week ahead, at most once an hour, 6 a day, not between 22:00 and 07:00 |
| **Reactive** | Up to a day ahead, as often as every 5 minutes, 48 a day, any hour |
| **Project** | Up to 30 days ahead, at most once an hour, 4 a day, not between 22:00 and 07:00 |
| **Manual** | The agent can't book itself; only you can |

**Customize the limits** sets the minimum delay, how far ahead, how many a day, quiet hours, and the days it may wake. These limits bind the agent; a wake-up you book yourself only has to be within the furthest-ahead limit.

The panel below shows the next wake-up, with **Run now**, **Book**, **Cancel wake-up**, and **Pause** (**For an hour**, **For a day** or **For a week**). A wake-up missed by more than 5 minutes is skipped, unless it was booked to run when the PC is back.

## Private database

An agent can keep its own tables, for example to track things between runs. On the **Abilities** tab, turn on **Private database**. Its options set a **Storage limit (MB)** (100 by default) and **Warn at (%)** (80 by default). The database is encrypted. See [Agent DB](/agent-db) for what an agent can do with it.

## Different from the Mac

- Schedules and watchers have a page each, and there's no webhook, RSS feed, event stream, failed-run or app-event trigger. [Channels](/windows/channels) start runs from messages in other apps.
- Every run of a watcher is its own read-only conversation. On the Mac, a folder automation keeps one chat.
- A schedule time that comes due while the previous run is still going is skipped. On the Mac it waits its turn.

## Troubleshooting

| What you see | What to do |
|---|---|
| A run happened but changed nothing | Turn on **Create and edit files in this folder** or **Run commands** in the editor. |
| **Off this session** | Osaurus started in safe mode. Restart it normally. |
| A run was skipped because the agent is turned off | Turn on **Enabled** on the agent's **Advanced** tab. |
| A workflow run was skipped because it "needs setup" | Open the workflow and finish **Set up**. See [Finish setting it up](/windows/workflows-run#finish-setting-it-up). |
| "The workflow is no longer installed" | The workflow was uninstalled. Pick another in the editor. |
| "The folder … is not available" | The folder was moved, renamed, or is on a drive that isn't connected. |
| A model answer was skipped for having no model | Pick a **Model** in the editor, or set a default chat model. |
| Nothing ran overnight | The PC was asleep or Osaurus wasn't running. Turn on **Start at login**, and check the PC's sleep settings. |

---

## Under the hood

- At most 2 automation runs happen at once; the rest wait their turn. Each stops after 30 minutes. A run on a local model first waits up to 2 minutes for your chat to go idle.
- Schedules check the clock at least once a minute, in your PC's time zone at each run. A missed time is rerun once, with a note in the prompt if it's 2 minutes or more late.
- Watchers use Windows file notifications as hints, plus a full re-scan of quiet folders every 5 minutes; after a run they re-check the folder up to 5 times. A folder of more than 100,000 items can't be watched.
- The agent sees at most 20 changed paths, then a count of the rest.
- A workflow's inputs can use `{{trigger.paths}}`, `{{trigger.count}}`, `{{trigger.folder}}` and `{{trigger.name}}` (watchers) or `{{trigger.slot}}`, `{{trigger.name}}` and `{{trigger.folder}}` (schedules).
- Grants are always-allow rules for `file_write`, `file_edit`, `file_undo` and `file_copy` (files) and `shell_run` (commands), filed under the agent and folder.
- Tasks dispatched from **Tasks** count against the 8 background tasks that may run at once.
- The private database is SQLCipher at `%LOCALAPPDATA%\osaurus\agents\<agent id>\agent.db`. Its tools are `db_schema`, `db_query` (up to 200 rows), `db_execute`, `db_import`, and saved views.
- `schedule_next_run` takes a time or a delay, the instructions, and `on_miss` (`skip`, the default, or `run_once`); `cancel_next_run` clears it.

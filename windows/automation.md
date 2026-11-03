---
title: Schedules and Watchers on Windows
sidebar_label: Schedules & Watchers
description: Run an agent on its own in Osaurus for Windows — at times you choose, when a folder changes, or when the agent books its own next run — and give it a private database.
---

# Schedules and Watchers on Windows

An agent can work without you there: at times you choose ([Schedules](/schedules)), whenever a folder changes ([Watchers](/watchers)), or when it books its own next run (wake-ups). They work as the Mac pages describe, with the differences below. Schedules and watchers have their own pages under **Automation** in Settings (**Settings → Schedules**, **Settings → Watchers**); wake-ups are set on the agent's **Abilities** tab. Only agents you create can run them.

## When they run

Automation runs while Osaurus is running, including when the window is closed and Osaurus is in the system tray. It doesn't run while Osaurus is quit or the PC is asleep. To have Osaurus running whenever you're signed in, turn on **Settings → Behavior → Start at login**.

A schedule time missed while the PC was asleep or Osaurus was closed runs once when it's back, however many were missed, and the agent is told it's late.

Nobody is there to answer questions during these runs, so an agent can't change your files or run commands unless you allow it in the schedule's or watcher's editor (see [While nobody is watching](#while-nobody-is-watching)).

## Schedules

**Settings → Schedules → Add schedule.**

1. **Name** it and choose the **Agent**.
2. Write the **Instructions** for each run.
3. Under **When**, pick **How often**:

   | Option | Runs |
   |---|---|
   | **Once** | At one date and time, then turns itself off |
   | **Every few minutes** | Every 5 to 1440 minutes, counted from midnight (every 15 runs at :00, :15, :30, :45) |
   | **Hourly** | Every hour, at a minute you choose |
   | **Daily** | Every day at a time |
   | **Weekly** | One day a week, at a time |
   | **Monthly** | One day a month (a day past the end of a short month runs on its last day) |
   | **Yearly** | One date a year (29 February runs on the 28th in other years) |
   | **Cron expression** | Five fields, numbers only, such as `0 9 * * 1-5` |

   **Next runs** previews the coming times, and warns you when a schedule means many runs a day.
4. Optionally choose a **Folder** for it to work in. Without one, the agent can read, search the web, and report, or work in its own [sandbox](/windows/sandbox) if it has one.
5. Click **Save**.

In the list:

- The switch on each row pauses and resumes it.
- **▶** runs it now; the next scheduled time still runs. **Stop** ends a run in progress.
- The pencil edits it; **…** has **Open last run in Tasks** and **Delete**.

Runs never overlap: a time that comes due while the previous run is still going is skipped, and the row says so.

## Watchers

**Settings → Watchers → Add watcher.**

1. **Name** it, choose the **Agent**, and choose the **Folder** to watch. Turn on **Include subfolders** to count changes anywhere inside it.
2. Pick **Responsiveness**: how long Osaurus waits for changes to settle before running.

   | Setting | Waits about |
   |---|---|
   | **Fast** | 200 ms |
   | **Balanced** (default) | 1 second |
   | **Patient** | 3 seconds |
   | **Relaxed** | 1 minute |
   | **Deferred** | 5 minutes |
   | **Extended** | 10 minutes |

3. Write the **Instructions**. The agent also gets the folder's path and the list of files that changed. Write instructions that are safe to run twice: skip anything already done.
4. Click **Save**.

In the list, the switch pauses and resumes watching, **▶** runs it on the whole folder (when it isn't already working), and **…** has **Open last run in Tasks** and **Delete**. Changes the agent makes itself don't set the watcher off again.

## While nobody is watching

Both editors have this section. With both switches off, the agent can look and report but not change anything.

- **Create and edit files in this folder** lets it write and edit files in the chosen folder.
- **Run commands** lets it run commands. Moving and renaming files needs this. A command can reach anything your Windows account can, not just this folder.

A schedule with no folder, for an agent that uses the [sandbox](/windows/sandbox), works in the agent's own sandbox home instead. There it can create files and run commands without these switches, and none of your files are in reach.

Your choices are saved as always-allow rules for that agent in that folder, so they also apply when you chat with the agent there. Review or revoke them in **Settings → Behavior**. An agent whose **File edits and commands** permission is **Deny** stays denied.

## Seeing the runs

Each run opens as its own read-only tab under the agent, named **Schedule · *name*** or **Watcher · *name***. It's added without taking you away from what you're doing. You can read it and stop it, but not continue it. Every run is a fresh conversation that doesn't see earlier runs.

**Settings → Tasks** lists background runs, with each run's prompt, result, and activity. It can also start one: pick an **Agent**, type a **Prompt**, and click **Dispatch**.

## Wake-ups

An agent can book its own next run, for example to check back on something tomorrow. On the agent's **Abilities** tab, open **Wake-ups** and turn on **Let it wake itself up**. Each wake-up is a new conversation, in the folder of the conversation that booked it.

**How often it may wake**:

| Mode | Limits |
|---|---|
| **Ambient** (default) | Up to a week ahead, at most once an hour, 6 a day, not between 22:00 and 07:00 |
| **Reactive** | Up to a day ahead, as often as every 5 minutes, 48 a day, any hour |
| **Project** | Up to 30 days ahead, at most once an hour, 4 a day, not between 22:00 and 07:00 |
| **Manual** | The agent can't book itself; only you can |

**Customize the limits** sets the minimum delay, how far ahead, how many a day, quiet hours, and the days it may wake. These limits bind the agent; a wake-up you book yourself only has to be within the furthest-ahead limit.

The panel below shows the next wake-up, with **Run now**, **Book**, **Cancel wake-up**, and **Pause** (for an hour, a day, or a week). A wake-up missed by more than 5 minutes is skipped, unless it was booked to run when the PC is back.

## Private database

An agent can keep its own tables, for example to track things between runs. On the **Abilities** tab, turn on **Private database**. Its options set a **Storage limit (MB)** (100 by default; 0 for none) and when to warn (80%). The database is encrypted and stays on your PC. See [Agent DB](/agent-db).

## Different from the Mac

- Each run is its own read-only conversation, not part of one ongoing chat.
- Changing files needs the editor's **While nobody is watching** switches; there's no fallback to an agent's working folder.
- Only your own agents run schedules and watchers, not shared workspace agents.
- Every few hours is **Every few minutes** (for example, 180). Times use your Windows clock format.
- The private database has no browser in the app, and deleted rows can't be restored.
- **Manual** is offered as a wake-up mode, and you can customize each limit.

## Troubleshooting

| What you see | What to do |
|---|---|
| A run happened but changed nothing | Turn on **Create and edit files in this folder** or **Run commands** in the editor. |
| **Off this session** | Osaurus started in safe mode. Restart it normally. |
| A run was skipped because the agent is turned off | Turn on **Enabled** on the agent's **Advanced** tab. |
| "The folder … is not available" | The folder was moved, renamed, or is on a drive that isn't connected. |
| Nothing ran overnight | The PC was asleep or Osaurus wasn't running. Turn on **Start at login**, and check the PC's sleep settings. |

---

## Under the hood

- At most 2 automation runs happen at once, and each stops after 30 minutes.
- Schedules check the clock at least once a minute, in your PC's time zone at each run. A missed time is rerun once, with a note in the prompt if it's 2 minutes or more late.
- Watchers use Windows file notifications as hints, plus a full re-scan of quiet folders every 5 minutes; after a run they re-check the folder up to 5 times. A folder of more than 100,000 items can't be watched. Waking the PC rebuilds every watcher; starting Osaurus takes a fresh look at each folder without running anything.
- The agent sees at most 20 changed paths, then a count of the rest.
- Grants are tool-wide always-allow rules for `file_write`, `file_edit`, `file_undo`, and `file_copy` (files) and `shell_run` (commands), filed under the agent and folder.
- The private database is SQLCipher at `%LOCALAPPDATA%\osaurus\agents\<agent id>\agent.db`. Its tools are `db_schema`, `db_query` (up to 200 rows), `db_execute`, `db_import`, and saved views; they're never available to remote callers.
- `schedule_next_run` takes a time or a delay, the instructions, and `on_miss` (`skip`, the default, or `run_once`); `cancel_next_run` clears it.

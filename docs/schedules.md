---
title: Schedules
sidebar_label: Schedules
description: Have an agent do a task on a timer — daily journaling prompts, weekly summaries, monthly reviews. Set it up once and let it run.
---

# Schedules

Some AI tasks are better on autopilot. A daily journal prompt at 8 AM. A weekly code summary on Friday afternoon. A monthly goals review on the first. Schedules let you set these up once and let Osaurus run them — you just review the results.

All you need is one of your own [agents](/glossary#agent) and Osaurus running at the scheduled time. Where [Watchers](/watchers) react to file changes, schedules run on a clock.

## Get started

1. Open **Settings…** (`⌘ ,`) → **Schedules**.
2. Click **Create Schedule**.
3. Fill in:
   - **Name** — what this schedule is for
   - **Frequency** — once, every few minutes, hourly, daily, weekly, monthly, yearly, or a custom pattern
   - **Time** — when it runs (for repeating schedules)
   - **Agent** — which agent does the task (one of your agents, or a shared [workspace](/glossary#workspace) agent)
   - **Instructions** — the message to send the agent when it runs
4. Click **Create Schedule** to save it.

The schedule is now active. See past runs anytime with **History**.

## Frequency options

| Frequency | What it does | Example |
|---|---|---|
| **Once** | Runs a single time on a set date | One-time reminder |
| **Minutes** | Every few minutes | Frequent check-ins |
| **Hourly** | Every hour (or every few hours) | Inbox sweeps |
| **Daily** | Every day at a set time | Morning journaling |
| **Weekly** | Once a week on a day you choose | Weekly progress reports |
| **Monthly** | Once a month on a date you choose | Monthly goal reviews |
| **Yearly** | Once a year on a date you choose | Annual reflection |
| **Cron Expression** | A custom [cron](/glossary#cron) pattern for anything else | Weekday mornings |

For repeating schedules, set the time (24-hour clock) and the day of the week (weekly) or day of the month (monthly).

:::tip[Timing]
Schedules run while Osaurus is open. If your Mac is asleep or Osaurus is closed at the scheduled time, the task runs once the next time you open the app. Even if it missed several times, it catches up with a single run rather than replaying each one.
:::

## Picking an agent

Each schedule runs through one of your agents. The agent's [system prompt](/glossary#system-prompt), default model, and theme are used for the run. Different schedules can use different agents.

To have the run work in a particular folder, set the optional **Working Directory** in the editor. Without one, the run uses the agent's [Working Folder](/glossary#working-folder), if it has one. Either way, a scheduled run with a folder works directly with the files there — even if the agent normally runs in its [Sandbox](/glossary#sandbox).

A shared **workspace agent** runs on its owner's Mac, with their instructions, model, and tools. If their Mac is offline when the schedule fires, that run is skipped until the next scheduled time.

The right [tools](/glossary#tool) and [skills](/glossary#skill) are picked automatically for each run, based on your instructions. Just pick the agent whose personality fits the task best. [How skills get picked →](/skills#how-skills-get-picked)

**Example pairings:**

- **Daily Journal** — a reflective, conversational agent
- **Code Summary** — a technical agent (Git tools appear automatically when the instructions mention a code repository)
- **Research Digest** — a research-focused agent (web search tools appear automatically)

## Writing good instructions

Be specific. The instructions are the message sent to the agent — clear instructions give useful results.

**Daily journaling:**

```
Good morning! Let's start the day with a brief reflection.

Please ask me:
1. What are my top 3 priorities for today?
2. Is there anything from yesterday I need to follow up on?
3. What's one thing I'm looking forward to?

Keep the conversation warm and encouraging.
```

**Weekly report:**

```
Generate a weekly summary based on our conversations from the past week.

Include:
- Key topics discussed
- Decisions made
- Action items identified
- Questions that remain open

Format as a concise bullet-point summary.
```

## Managing schedules

### Viewing your schedules

The Schedules screen lists all your schedules with their name, frequency, next run time, agent, and whether they're active or paused.

### Editing

1. Click the schedule.
2. Change the settings.
3. Click **Save Changes**.

### Pausing and resuming

Turn a schedule off or on without deleting it. Paused schedules don't run until you turn them back on.

### Running now

To run a schedule right away:

1. Click the schedule.
2. Click **Run Now**.

This is handy for testing a new schedule, running it at an unusual time, or catching up on a missed run. If it's already running, Osaurus tells you instead of starting a second run.

### Deleting

1. Click the schedule.
2. Click **Delete**.
3. Confirm.

## Reviewing past runs

After a schedule runs, you can see exactly what happened:

1. Click the schedule.
2. Click **History**.

The full conversation opens — your instructions, the agent's reply, and any tools it used.

Each run is also saved as a chat with a **schedule** badge in the chat sidebar. Filter the sidebar by source to see all your scheduled runs in one place.

## Example schedules

### Daily journaling

| Setting | Value |
|---|---|
| Name | Morning Journal |
| Frequency | Daily at 8:00 AM |
| Agent | Personal Coach |
| Instructions | "Start my day with 3 reflection questions about priorities, energy, and gratitude." |

### Weekly code summary

| Setting | Value |
|---|---|
| Name | Weekly Dev Summary |
| Frequency | Weekly on Friday at 5:00 PM |
| Agent | Code Assistant |
| Instructions | "Review git activity this week and summarize commits, branches, and open items." |

### Monthly goals

| Setting | Value |
|---|---|
| Name | Monthly Goals Review |
| Frequency | Monthly on the 1st at 9:00 AM |
| Agent | Personal Coach |
| Instructions | "Let's review my goals for last month and set intentions for the new month." |

### Daily news digest

| Setting | Value |
|---|---|
| Name | Tech News Digest |
| Frequency | Daily at 7:00 AM |
| Agent | Research Helper |
| Instructions | "Search for the latest AI and developer tools news and give me a 5-item digest." |

## Tips

1. **Start simple** — begin with one or two schedules and add more later.
2. **Use clear names** — so you can tell schedules apart at a glance.
3. **Match the agent to the task** — pick an agent with the right style and tools.
4. **Be specific in instructions** — clear instructions give better results.
5. **Check results now and then** — make sure each schedule is still useful.
6. **Adjust the timing** — find times that fit your routine.
7. **Test with Run Now** — check a new schedule works before waiting for the timer.

## Troubleshooting

### A schedule didn't run

- **Was Osaurus open?** Schedules only run while the app is open.
- **Is the schedule turned on?** Paused schedules don't run.
- **Has the time come yet?** Check the next run time on the card.

### Unexpected results

- **Check the instructions** — vague instructions give inconsistent results.
- **Check the agent** — make sure the right one is picked.
- **See which tools ran** — open [Insights](/developer-tools#insights) (**Settings… → Insights**) to see exactly which skills and tools were used. If the wrong ones loaded, make the instructions more specific.

### Missed schedules

If Osaurus wasn't open at the scheduled time:

- A missed schedule runs once automatically the next time you open the app (several missed times become one run).
- Use **Run Now** to run it yourself anytime.

---

## Under the hood

- **Cron syntax:** **Cron Expression** accepts standard cron syntax, for example `0 9 * * 1-5` for 9:00 AM on weekdays.
- **Missed runs:** missed slots collapse into a single catch-up run on the next launch.
- **File access:** a run with a **Working Directory** (or an inherited Working Folder) gets host file access to that folder, even when the agent normally runs with the [sandbox](/sandbox) on.
- **Chat tagging:** each run is saved as a chat session tagged `schedule`.
- **Capability selection:** tools and skills are auto-selected per run from the instructions; Insights records which capabilities loaded and which tool calls ran.

---

**Related:**

- [Agents](/agents) — choose which agent runs your schedules
- [Watchers](/watchers) — run an agent when files change (works alongside Schedules)
- [Skills](/skills) — skills are picked automatically for each run

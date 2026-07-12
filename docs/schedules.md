---
title: Schedules
sidebar_label: Schedules
description: Run an agent on a timer — daily journaling prompts, weekly summaries, monthly reviews. Set it and forget it.
sidebar_position: 12
---

# Schedules

Some AI tasks are better on autopilot. A daily journal prompt at 8 AM. A weekly code summary on Friday afternoon. A monthly goals review on the first. Schedules let you set those up once and let Osaurus run them — you just review the results.

Where [Watchers](/watchers) react to file changes, schedules run on a clock.

## Quick start

1. Open the Management window (`⌘ ,`) → **Schedules**
2. Click **Create Schedule**
3. Fill in:
   - **Name** — what this schedule is for
   - **Frequency** — once, minutes, hourly, daily, weekly, monthly, yearly, or a cron expression
   - **Time** — when it runs (for recurring schedules)
   - **Agent** — which agent handles the task
   - **Instructions** — the prompt to send when it fires
4. Click **Save**

The schedule is now active. Review past runs anytime via **History**.

## Frequency options

| Frequency | What it does | Example |
|---|---|---|
| **Once** | Single run at a specific date | One-time reminder |
| **Minutes** | Every N minutes | Frequent polling tasks |
| **Hourly** | Every hour (or every N hours) | Inbox sweeps |
| **Daily** | Every day at a set time | Morning journaling |
| **Weekly** | Once a week on a chosen day | Weekly progress reports |
| **Monthly** | Once a month on a chosen date | Monthly goal reviews |
| **Yearly** | Once a year on a chosen date | Annual reflection |
| **Cron Expression** | Full cron syntax for anything else | `0 9 * * 1-5` (weekday mornings) |

For recurring schedules, configure the time (24-hour) and the day-of-week (weekly) or day-of-month (monthly).

:::tip[Timing]
Schedules run when Osaurus is active. If your Mac is asleep or Osaurus isn't running at the scheduled time, the task runs when you next launch the app.
:::

## Picking an agent

Each schedule runs through one of your agents. The agent's system prompt, default model, and theme apply to the run. Different schedules can use different agents.

Tools and skills are picked automatically at run time based on your instructions — pick the agent whose personality best fits the task; the right capabilities will load themselves. [How auto-selection works →](/skills#how-skills-get-picked)

**Example pairings:**

- **Daily Journal** — A reflective, conversational agent
- **Code Summary** — A technical agent (Git tools surface automatically when the prompt mentions a repo)
- **Research Digest** — A research-focused agent (Search and Fetch tools surface automatically)

## Writing good instructions

Be specific. The instructions are the prompt sent to the agent — clear prompts produce useful runs.

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

The Schedules tab shows all your configured schedules with name, frequency, next run time, assigned agent, and active/paused status.

### Editing

1. Click on the schedule
2. Modify the settings
3. Click **Save**

### Pausing and resuming

Toggle a schedule on or off without deleting it. Paused schedules don't run until you resume them.

### Running manually

Trigger any schedule immediately:

1. Click on the schedule
2. Click **Run Now**

Useful for testing new schedules, running outside the normal time, or catching up on missed runs.

### Deleting

1. Click on the schedule
2. Click **Delete**
3. Confirm

## Reviewing past runs

After a schedule fires, you can see exactly what happened:

1. Click on the schedule
2. Click **History**

The full conversation opens — your instructions, the agent's response, any tool calls or actions taken.

Each run is also saved as a chat session tagged `schedule` (visible as a badge in the chat sidebar). Filter the sidebar by source to browse all your scheduled runs in one place.

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

1. **Start simple** — Begin with one or two schedules and add more as needed
2. **Use descriptive names** — Make it easy to identify schedules at a glance
3. **Match agent to task** — Choose an agent with appropriate tools and style
4. **Be specific in instructions** — Clear prompts yield better results
5. **Review results regularly** — Check that schedules are producing useful output
6. **Adjust timing** — Find times that work with your routine
7. **Use "Run Now" to test** — Verify new schedules work before waiting for the timer

## Troubleshooting

### Schedule didn't run

- **Was Osaurus running?** Schedules require the app to be active
- **Is the schedule enabled?** Paused schedules don't run
- **Has the time passed yet?** Check the next-run time on the card

### Unexpected results

- **Review the instructions** — Ambiguous prompts lead to inconsistent results
- **Check the agent** — Make sure the right agent is assigned
- **Inspect what tools fired** — Open Insights (Management `⌘ ,` → **Insights**) to see exactly which capabilities were loaded and which tool calls ran. If the wrong tools loaded, make the schedule's instructions more specific.

### Missed schedules

If Osaurus wasn't running at the scheduled time:

- Missed schedules run automatically on the next app launch
- Use "Run Now" to trigger manually anytime

---

**Related:**

- [Agents](/agents) — pick which agent runs your schedules
- [Watchers](/watchers) — event-based automation (complements Schedules)
- [Skills](/skills) — capabilities are auto-selected per run

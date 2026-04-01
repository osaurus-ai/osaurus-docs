---
title: Schedules
sidebar_label: Schedules
description: Automate recurring AI tasks with timed execution
---

# Schedules

Some AI tasks work best on autopilot. Daily journaling prompts, weekly report generation, monthly summaries—tasks you want to happen consistently without remembering to trigger them. Schedules let you automate recurring AI interactions that run on a timer.

## What is a Schedule?

A schedule is an automated task that runs at specified intervals. When a schedule triggers, Osaurus sends your configured prompt to an agent and saves the response. You can review results later or set up notifications.

Each schedule includes:

- **Name** — Identifier for the scheduled task
- **Frequency** — When and how often to run
- **Agent** — Which AI assistant handles the task
- **Instructions** — The prompt sent when the schedule runs
- **Results** — Access to the last run's conversation

## Features

- **Flexible Frequency** — Once, daily, weekly, monthly, or yearly execution
- **Agent Integration** — Assign an agent to handle scheduled tasks
- **Custom Instructions** — Define prompts sent to the AI when the schedule runs
- **Manual Trigger** — Run any schedule immediately with "Run Now"
- **Results Tracking** — View the chat session from the last run

## Accessing Schedules

Open the Management window with **⌘⇧M**, then navigate to the **Schedules** tab.

## Creating a Schedule

1. Open Management window (**⌘⇧M**) → **Schedules**
2. Click **Create Schedule**
3. Configure the schedule settings:
   - **Name** — Give your schedule a descriptive name
   - **Frequency** — Select how often to run
   - **Time** — Choose when to run (for recurring schedules)
   - **Agent** — Select which agent handles the task
   - **Instructions** — Write the prompt to send
4. Click **Save**

## Schedule Settings

### Name and Description

| Setting         | Description                               |
| --------------- | ----------------------------------------- |
| **Name**        | Display name for the schedule             |
| **Description** | Optional notes about the schedule's purpose |

### Frequency Options

Choose how often your schedule runs:

| Frequency    | Description                              | Example Use Case               |
| ------------ | ---------------------------------------- | ------------------------------ |
| **Once**     | Run a single time at a specific date     | One-time reminder or task      |
| **Daily**    | Run every day at a set time              | Morning journaling prompts     |
| **Weekly**   | Run once per week on a chosen day        | Weekly progress reports        |
| **Monthly**  | Run once per month on a chosen date      | Monthly goal reviews           |
| **Yearly**   | Run once per year on a chosen date       | Annual reflection prompts      |

### Time Settings

For recurring schedules, configure when they run:

| Setting      | Description                                     |
| ------------ | ----------------------------------------------- |
| **Time**     | Hour and minute to run (24-hour format)         |
| **Day**      | Day of week (weekly) or day of month (monthly)  |
| **Date**     | Specific date (once or yearly)                  |

:::tip Timing
Schedules run when Osaurus is active. If your Mac is asleep or Osaurus isn't running at the scheduled time, the task runs when you next launch the app.
:::

### Agent Selection

Assign an agent to handle the scheduled task:

1. Select an agent from the dropdown
2. The agent's system prompt and tool configuration apply to the scheduled run
3. Different schedules can use different agents

**Example configurations:**

- **Daily Journal** — Use a reflective, conversational agent
- **Code Summary** — Use a technical agent with git tool access
- **Research Digest** — Use a research-focused agent with web search

### Instructions

Write the prompt that's sent when the schedule triggers:

**Example for daily journaling:**

```
Good morning! Let's start the day with a brief reflection.

Please ask me:
1. What are my top 3 priorities for today?
2. Is there anything from yesterday I need to follow up on?
3. What's one thing I'm looking forward to?

Keep the conversation warm and encouraging.
```

**Example for weekly reports:**

```
Generate a weekly summary based on our conversations from the past week.

Include:
- Key topics discussed
- Decisions made
- Action items identified
- Questions that remain open

Format as a concise bullet-point summary.
```

## Managing Schedules

### Viewing Schedules

The Schedules tab shows all your configured schedules with:

- Schedule name
- Frequency and next run time
- Assigned agent
- Status (active/paused)

### Editing a Schedule

1. Open Management window (**⌘⇧M**) → **Schedules**
2. Click on the schedule you want to edit
3. Modify the settings
4. Click **Save**

### Pausing and Resuming

Toggle a schedule on or off without deleting it:

1. Find the schedule in the list
2. Click the toggle to pause or resume
3. Paused schedules won't run until resumed

### Running Manually

Trigger any schedule immediately:

1. Click on the schedule
2. Click **Run Now**
3. The schedule executes immediately with your configured agent and instructions

This is useful for:

- Testing new schedules
- Running a task outside its normal time
- Catching up on missed runs

### Deleting a Schedule

1. Open Management window (**⌘⇧M**) → **Schedules**
2. Click on the schedule
3. Click **Delete**
4. Confirm deletion

## Viewing Results

After a schedule runs, you can review what happened:

1. Open Management window (**⌘⇧M**) → **Schedules**
2. Click on the schedule
3. Click **View Last Run**
4. The conversation from the last execution opens

Results include:

- The full conversation between your instructions and the AI
- Timestamp of when it ran
- Any tool calls or actions taken

## Example Schedules

### Daily Journaling

Start each day with guided reflection.

| Setting      | Value                                     |
| ------------ | ----------------------------------------- |
| Name         | Morning Journal                           |
| Frequency    | Daily at 8:00 AM                          |
| Agent        | Personal Coach                            |
| Instructions | "Start my day with 3 reflection questions about priorities, energy, and gratitude." |

### Weekly Code Review

Summarize development activity.

| Setting      | Value                                     |
| ------------ | ----------------------------------------- |
| Name         | Weekly Dev Summary                        |
| Frequency    | Weekly on Friday at 5:00 PM               |
| Agent        | Code Assistant                            |
| Instructions | "Review git activity this week and summarize commits, branches, and open items." |

### Monthly Goals Check

Review progress on longer-term goals.

| Setting      | Value                                     |
| ------------ | ----------------------------------------- |
| Name         | Monthly Goals Review                      |
| Frequency    | Monthly on the 1st at 9:00 AM             |
| Agent        | Personal Coach                            |
| Instructions | "Let's review my goals for last month and set intentions for the new month." |

### Daily News Digest

Get a summary of topics you care about.

| Setting      | Value                                     |
| ------------ | ----------------------------------------- |
| Name         | Tech News Digest                          |
| Frequency    | Daily at 7:00 AM                          |
| Agent        | Research Helper                           |
| Instructions | "Search for the latest AI and developer tools news and give me a 5-item digest." |

## Schedules with Agents

Schedules work seamlessly with [Agents](/agents):

- Each schedule can use a different agent
- The agent's system prompt shapes how instructions are interpreted
- Tool access is controlled by the agent's configuration

**Tip:** Create dedicated agents for scheduled tasks with appropriate tool access and personality.

## Tips and Best Practices

1. **Start simple** — Begin with one or two schedules and add more as needed
2. **Use descriptive names** — Make it easy to identify schedules at a glance
3. **Match agent to task** — Choose an agent with appropriate tools and style
4. **Be specific in instructions** — Clear prompts yield better results
5. **Review results regularly** — Check that schedules are producing useful output
6. **Adjust timing** — Find times that work with your routine
7. **Use "Run Now" to test** — Verify new schedules work before waiting for the timer

## Troubleshooting

### Schedule Didn't Run

- **Check if Osaurus was running** — Schedules require the app to be active
- **Verify the schedule is enabled** — Paused schedules don't run
- **Check the time settings** — Ensure the scheduled time has passed

### Unexpected Results

- **Review the instructions** — Ambiguous prompts lead to inconsistent results
- **Check the agent** — Ensure the right agent is assigned
- **Look at tool access** — The agent may need specific tools enabled

### Missed Schedules

If Osaurus wasn't running at the scheduled time:

- The schedule runs on next app launch (if configured for catch-up)
- Or waits until the next scheduled time
- Use "Run Now" to trigger manually

---

<p align="center">
  For creating custom AI assistants to use with schedules, see the <a href="/agents">Agents</a> guide.
</p>

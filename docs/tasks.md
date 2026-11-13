---
title: Tasks
sidebar_label: Tasks
description: See everything Osaurus does in the background — automation runs, workflow runs, agents waking themselves up, and helpers — while it waits, while it runs, and after it finishes. Stop anything, and read what each one did.
---

# Tasks

A task is a job Osaurus does in the background, while you're not watching. That includes an [automation](/glossary#automation) going off, a [workflow](/glossary#workflow) run, an agent waking itself up, and a [helper](/glossary#helpers) an agent started. The **Tasks** page shows what's running, what's waiting its turn, and what already finished. You can stop anything from there, and read exactly what each task did.

For example, your Morning Brief automation fires at 8 while you're in the middle of a chat on a model on your Mac. The task waits until your answer finishes, then runs. Later you open **Tasks → History**, see that it ran, and open the chat it ran in to read the result.

You don't need to set anything up. Every background job goes through Tasks on its own.

## Get started

1. Open **Settings** (the gear at the bottom of the narrow strip on the left edge of the window, or press **⌘,**).
2. In the Settings sidebar, under **Developer Tools**, click **Tasks**. A number beside it counts tasks that are waiting or running.
3. The **Queues** tab shows what's running now, what's waiting, and the last few that finished.
4. Click any task to see where it came from, how long it took, and every step it took.
5. To end a task that's running or waiting, click **Stop**.

## What counts as a task

These are tasks:

- An [Automation](/automations) run (on a schedule, when a file lands in a folder, and so on).
- A workflow run.
- An agent waking itself up (see [Agent DB & Self-Scheduling](/agent-db)).
- A helper or another agent that a chat or agent started (see [Subagents](/subagents)).
- Work sent by a plugin or another app through Osaurus.

A chat you're typing in is **not** a task. You're already watching it, and its history is in the chat itself. But anything a chat starts on its own, like a helper or a workflow run, does become a task, and remembers which chat it came from.

## The Tasks page

### The Queues tab

The **Queues** tab opens first. It has one section per queue (a line that tasks wait in; you start with one, called **Default**). Each section shows:

- How many tasks are running and waiting, and the queue's limit, such as "up to 20 at once".
- The tasks running now, then the ones waiting, then the last few that finished. Click **See All Finished** for more.

Each task row shows its name, what it runs (an agent, a workflow, or a helper), and one line about where it stands: where it came from, how long it has run, what it's doing, why it's waiting, or when it finished.

A few labels you may see on a row:

- **Waiting for the chat to finish** — you're using a model on your Mac in a chat, and this task needs a different one. It starts once your answer is done.
- **Queue paused** or **Queue full** — the queue isn't taking more right now (see [Queues](#queues) below).
- **Waiting for your answer** — the task needs you. See [Tasks that need you](#tasks-that-need-you).
- **Stale** — the task has stopped making progress for a while. Osaurus doesn't stop it for you; click **Stop** if it looks stuck.

### Foreground

While a chat, an app, or a plugin is getting an answer from a model, a **Foreground** section appears at the top. It lists each one, with its model, whether it runs **On this Mac** or **Remote**, and how long it has been going. **Open** on a chat row brings that chat forward. These rows disappear when the answer finishes, and nothing here is saved.

When a chat is holding tasks back, this section says how many are waiting and shows **Yielding**.

### The History tab

The **History** tab lists every task, newest first, including ones that were skipped. Use the menus at the top to narrow it:

- **Where it came from**: **Automation**, **Agent-scheduled**, **Channel**, **Helper**, **Workflow**, **API**, **Plugin**, and more.
- **Result**: **Ran**, **Skipped**, or **Failed**.
- **Queue**, once you have more than one.

Other places open History already narrowed for you: **History** on the [Automations](/automations) page, **See All** under an agent's **Recent Tasks**, **All Tasks** on a workflow's page, and **Tasks from This Chat** when you right-click a chat in the sidebar.

## A task's details

Click a task to open it:

- **Summary** — what it runs, what started it, how long it waited and ran, how many attempts, the step it's on now, any error, and its result.
- **Open** — jump to related places: **Started from chat** (the chat that started it), the **Chat** it ran in, the **Workflow run** with its steps, the **Automation** that started it, and **Insights** (every request and tool it used; see [Insights](/glossary#insights)).
- **Related Tasks** — the task that started this one, and any helpers it started. Click one to move to it.
- **Timeline** — each step with its time: when it was queued, started, waited for a model, started a helper, waited for you, and finished or was stopped (and by whom).

## Tasks that need you

Sometimes a task can't go on without you: a workflow needs its form filled in, a tool needs your [approval](/glossary#approval), or an agent has a question. These tasks also appear in **Settings → Inbox → Needs You**, where you can answer them. The task picks up again once you do.

Failed tasks are listed in **History** with the **Failed** filter. To try again, run it again from where it came from: the automation, the workflow, or the chat.

## Queues

Most people never need more than the **Default** queue. Every automation, background agent, plugin request, and helper uses it unless you say otherwise. A second queue is handy when you want some jobs kept apart, for example an *Overnight* queue that runs one big job at a time.

To make one:

1. On the Tasks page, click **Add Queue**.
2. Give it a **Name**, and set its limits (below).
3. In an automation, pick the new queue in its **Queue** section.

While Default is your only queue, Osaurus doesn't show a queue choice anywhere. The choice appears as soon as you add a second one.

Each queue's settings (click the settings button on its section):

| Setting | What it does |
|---|---|
| **Max Concurrent Tasks** | How many of its tasks run at the same time (1–64; Default starts at 20). |
| **Max Waiting Tasks** | How many may wait for a turn. Leave it at 0 for no limit. |
| **When Full** | What happens to a new task when the line is full: **Refuse new tasks**, **Keep only the newest per conversation**, or **Drop the oldest waiting task**. |
| **Start Order** | Which waiting task goes next: **In order**, **One at a time per conversation**, or **Any order**. |
| **Paused** | Holds new tasks without starting them. Running tasks still finish. |
| **Delete Queue** | For queues you made. Waiting tasks move to Default, and automations on it use Default. |

## Troubleshooting

- **A task has been waiting a long time.** Check its row. If it says **Waiting for the chat to finish**, it starts after your current chat answer. If it says **Queue paused**, open the queue's settings and turn off **Paused**. If it says **Queue full**, raise **Max Concurrent Tasks**.
- **A task shows Stale.** It stopped making progress. Click **Stop**, then run it again from where it came from.
- **A task says it needs me, but I don't see a question.** Open **Settings → Inbox → Needs You**.
- **A task I expected isn't in History.** Check the filters at the top of **History**, and clear any agent, workflow, or chat filter chip.
- **Tasks show Interrupted.** Osaurus was quit while they were running. They're closed at the next launch; run them again if you need to.

## Good to know

- Everything on the Tasks page stays on your Mac. Task records are kept for 30 days.
- There's no **Retry** button yet. Run a failed task again from its automation, workflow, or chat.
- Each agent runs at most 5 background tasks at once, whatever the queue allows.
- **Max Concurrent Tasks** is about jobs, not your Mac's power. How many model answers can be worked on at once is **Settings → Server → Concurrent Sessions**.
- If a task ran something you do every day by hand, consider saving it as a [workflow](/workflows) and running it with an [Automation](/automations).

---

## Under the hood

Every unit of offloaded work is an `OsaurusTask`. A task waits in a queue, is admitted by the task scheduler, runs in a worker, and leaves an append-only journal (the **Timeline**). Interactive work — a chat turn, an HTTP inference request, a plugin completion — is never a task. It takes a foreground reservation, which the scheduler yields to; tasks that need a different local model wait while one is held. Plugin dispatch and HTTP dispatch requests (see [Plugin Authoring](/plugin-authoring) and [HTTP API](/api)) *are* tasks.

### States

```
received ─┬─▶ filtered | duplicate | suppressed            (never ran)
          └─▶ queued ─▶ admitted ─▶ running ─┬─▶ succeeded
                 │                    ▲  │    ├─▶ failed
                 │                    │  ▼    ├─▶ cancelled
                 │               waitingUser  └─▶ interrupted   (app quit / crash)
                 └─▶ cancelled | suppressed  (dropped while queued)
```

On launch, tasks left `admitted`, `running`, or `waitingUser` become `interrupted`, except workflow tasks whose run resumes. Tasks left `queued` become `cancelled(interrupted)`, and their automation's missed-run policy decides whether it fires again.

### Queue policy

| Field | UI label | Values |
|---|---|---|
| `maxConcurrent` | **Max Concurrent Tasks** | 1–64; Default queue 20 |
| `maxPending` | **Max Waiting Tasks** | `nil` (0 in the UI) is unlimited |
| `overflow` | **When Full** | `reject` (`queue_full`), `coalesceByKey`, `dropOldest` |
| `orderingMode` | **Start Order** | `fifo`, `perKey`, `parallel` |
| `paused` | **Paused** | Nothing is admitted; waiting tasks stay |

Only you (and the Architect, through an approval card) create, edit, or delete queues. Agents enqueue into queues and read task state; they never change policy. Agent turns also have an internal cap of 5 running per agent.

### Liveness

Agent turns and workflow runs carry a lease renewed by their own progress (token usage, tool calls, step updates), at most every 15 seconds. About 60 seconds after renewals stop, the row shows **Stale** with **Stop**; nothing is killed automatically. Helper (subagent) tasks are shadow records under their launching task and follow its Stop.

### Storage

Tasks are stored in `~/.osaurus/tasks/tasks.sqlite` (tables `task_queues`, `tasks`, `task_events`, `task_reservations`), opened through the same storage stack as chat history, so it follows your encryption setting (see [Storage & Encryption](/storage)). The journal is capped at 1,000 events per task. Finished tasks older than 30 days, or beyond 20,000 rows, are pruned at launch and then at most every six hours. If the file can't open at launch, the failure shows under **Settings → Privacy & Security → Data & Storage** with **Retry** and **Reset**, and tasks are kept in memory until it reattaches.

Every request made inside a task carries the task id in [Insights](/glossary#insights), so **All Events for This Task** lists its whole trail and **Open Task** links back here.

---

**Related:**

- [Automations](/automations) — the triggers that start most tasks
- [Workflows](/workflows) — tasks Osaurus remembers how to do
- [Working in Chat](/agent-loop) — what happens in a chat you're watching
- [Subagents](/subagents) — helpers and agents started by another agent
- [Agent DB & Self-Scheduling](/agent-db) — agents that wake themselves up

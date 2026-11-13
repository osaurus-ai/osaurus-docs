---
title: Automations
sidebar_label: Automations
description: Have Osaurus run a workflow, an agent, or a quick question by itself — every weekday at 8, whenever a file lands in a folder, or when another app sends it something.
---

# Automations

An automation runs something for you without being asked. Every weekday at 8, your Morning Brief is waiting. Whenever a new file lands in Downloads, Osaurus tells you what it is and where it should go.

Each automation is one sentence: **when** this happens, **do** that, and here's **what you get**.

All you need is Osaurus open on your Mac at the time. It doesn't need to be in front.

## Some examples

- **Every weekday at 8 a.m.**, run **Morning Brief**, and get today's page as a new chat.
- **When a new file lands in Downloads**, run **New Download**, and get a suggested name and folder for it.
- **Every Friday at 4 p.m.**, run your weekly update workflow, and get a draft to send your team.
- **Every evening at 6**, ask a model for a short motivating quote, and get it as a chat.

## Add an automation

1. Click **Settings** (the gear at the bottom of the narrow strip on the left edge of the window), then **Automations** at the top of the list.
2. Click **Add Automation**.
3. Under **When**, pick what starts it. Most people start with **Schedule** (at set times) or **Folder** (when files change). For a schedule, choose how often and what time. For a folder, choose the folder.
4. Under **Do**, pick what it runs:
   - **Run Workflow**: one of your [workflows](/workflows). This is usually the best choice.
   - **Run Agent**: one of your own agents, with instructions to follow.
   - **Ask a Model**: one quick answer from a model, with no tools.
5. If you picked a workflow with a form, Osaurus fills in what it can. Anything still marked **Choose a value: the workflow needs it.** needs your answer. Click **Bind to…** and choose a fixed value, or something from the trigger, like the time or the changed files.
6. Click **Save**.

That's it. The automation appears in the list with its next run time. To try it right away, hover over it and click the play button (**Run Now**).

You can also ask Osaurus in a chat: "Run Morning Brief every weekday at 8." It sets the automation up for you, after you approve it.

:::tip[Built a workflow that should run by itself?]
When you tell the [Architect](/workflows-build) something like "every Friday at 4 pm", the save card offers to create the automation for you with **Then run it**. You don't need to come here at all.
:::

## Choosing when it runs

### On a schedule

Pick **Once**, every few **Minutes**, **Hourly**, **Daily**, **Weekly**, **Monthly** or **Yearly**, then the time. For anything unusual, like "weekdays only", use a [cron](/glossary#cron) pattern.

### When files change in a folder

Pick the folder, and turn on **Include subfolders** if you want those watched too. **Responsiveness** sets how long Osaurus waits for things to settle before it runs, from **Fast** (about a fifth of a second) to **Extended** (about ten minutes). The longer settings are good for folders where files arrive in bursts.

If the automation itself moves or renames files, Osaurus notices and checks again, so it never keeps setting itself off.

### For more advanced setups

- **Webhook**: runs when another app or service calls a web address that Osaurus gives you. **App Webhooks** has ready-made setups for GitHub, Stripe, Slack, Shopify, Twilio, Microsoft Graph, Meta and Amazon SNS.
- **RSS Feed**: runs when a news feed or blog publishes something new.
- **Event Stream**: runs when a live data feed sends a message.
- **Run Failed**: runs when a workflow fails, so you can be told about it or try something else.
- **App Event**: runs when Osaurus starts, or when this automation is turned on or changed.

To answer messages people send your agents, like Slack messages or email, use [Agent Channels](/agent-channels) instead.

### Only when

**Only When** narrows things down further. For example, only run when the text contains certain words, or only for PDF files in the folder.

## Managing your automations

The Automations list groups them into **Schedules**, **Folder watchers**, **Webhooks**, **Feeds**, **Event streams**, **Failure handlers** and **App events**. Each row reads like a sentence: what starts it, what it runs, and where the result goes, with the next run time.

- **Turn one off** with its switch. It keeps its settings and stops running until you turn it back on.
- **Change one** by clicking it, then **Edit**.
- **Run one now** with the play button that appears when you hover over it.
- **Stop it** while it's running with **Stop Runs** on its page.
- **See what happened** under **Runs** on its page, or click **History** at the top of the list to see every run, marked **Ran**, **Skipped** or **Failed**.

### Where the results go

Schedules and webhooks start a new chat for each run, so one run never carries into the next. Folder automations keep one chat, so you can scroll back through what happened over time. You can change this with **Start a new chat every time**.

A workflow's result also appears in its own run list on the [Workflows page](/workflows-run).

### Whose keys it uses

For **Run Workflow**, **Run as** chooses whose keys and accounts the run uses. The default, **No agent (shared keys)**, uses the keys every agent shares in the [Vault](/vault). Pick one of your agents to use its own keys instead.

## When Osaurus was closed

Automations only run while Osaurus is open. If your Mac was asleep or Osaurus was closed at the scheduled time, a missed schedule runs once the next time you open Osaurus, even if it missed several times. To change that, open the automation's **Queue** section and set **If the App Was Closed** to **Run once on launch**, **Skip**, or **Run every missed time**.

Files that changed in a watched folder while Osaurus was closed start one run when it opens again.

## If one is already running

By default an automation runs one at a time. If it's set off again while it's still running, the new run waits its turn. Turn on **Allow Overlapping Runs** in the **Queue** section to let runs happen side by side. Every run is also a task you can see in [Tasks](/tasks).

## Troubleshooting

### It didn't run

- **Was Osaurus open?** Automations only run while it's open.
- **Is it turned on?** Check its switch in the list.
- **Is it marked Needs attention?** The agent, workflow or account it uses was deleted. Click it, then **Edit**, and pick another one.
- **Does the workflow need something?** If a required input isn't filled in, the automation shows **Not set (required, runs will fail)**. Edit it and fill the input in.

### The result isn't what I expected

Open the run from **Runs** or **History** to see exactly what happened. If it's a workflow, open the run to see each step, and use **Fix with the Architect** if a step went wrong. See [Run a Workflow](/workflows-run#when-something-goes-wrong).

### I can't find my old Schedules or Watchers

They're here. Schedules and Watchers from earlier versions became automations with the same settings the first time you opened the new version. Searching Settings for "Schedules" or "Watchers" opens this page too.

---

## Under the hood

- **Shape:** every automation is **When → Only When → Do → Queue**, stored in the `automations:` section of the [configuration](/configuration). **Export Automations…** and **Import Automations…** in the **⋯** menu next to **Add Automation** read and write it; webhook secrets and tokens are never exported.
- **Storage:** automations live in `~/.osaurus/events/<id>.json`. On first launch after upgrading, `~/.osaurus/schedules/*.json` and `~/.osaurus/watchers/*.json` were converted to automations with the same id and renamed `*.json.migrated`. The older `schedules:`, `watchers:` and `events:` config sections are still accepted and translated.
- **Trigger values:** instructions and workflow inputs can use values such as `{{text}}`, `{{fired_at}}`, `{{schedule.scheduled_for}}`, `{{folder.path}}`, `{{folder.changed_paths}}`, `{{webhook.body.<field>}}`, `{{feed.item.title}}`, `{{sse.data}}` and `{{failure.error}}`. Required workflow inputs must be bound; a mismatch with the workflow's input schema is recorded as `invalid_input`.
- **The Orchestrator never runs an automation.** **Run Agent** takes a custom agent or a shared workspace agent. When the Orchestrator creates an automation in chat, it binds an installed workflow first, asks the Architect to build one when none fits, and uses **Ask a Model** for a tool-less answer.
- **Folder detection:** macOS FSEvents reports changes; rapid changes are debounced per the Responsiveness tier (Fast ~200 ms, Balanced ~1 s, Patient ~3 s, Relaxed ~1 min, Deferred ~5 min, Extended ~10 min). Change detection uses a Merkle hash of file metadata only (path, size, modification time), never file contents. A nested folder watched by another automation is excluded from its parent's watch.
- **Convergence:** after the agent finishes, the folder is fingerprinted again; if the agent changed files, a follow-up pass runs, at most 5 times. The trigger prompt lists up to 20 changed paths plus an overflow count. Folder state is remembered across quits.
- **Folder runs and the sandbox:** a folder automation's run targets the folder that fired, in host-folder mode, even for agents that normally run in the [sandbox](/sandbox). If the folder can't be read, the run is told so and reports it rather than looking elsewhere. Workspace agents receive a text summary of the change only.
- **Webhooks:** the URL is `http://127.0.0.1:<port>/events/<token>` on this Mac, and `https://<agent-address>.agent.osaurus.ai/events/<token>` through [Remote Access](/remote-access). Verification defaults to an HMAC-SHA256 signature in `X-Osaurus-Signature`. Defaults: 256 KB max body, 60 calls per minute. Responses: `202` with `run_id` and `status_url`, `200` filtered or repeat, `401` bad signature, `409` off, `413` too large, `429` rate limited.
- **Queues:** runs wait on the **Default** queue (up to 20 running at once) or a queue you add in **Settings → Developer Tools → Tasks**. Each agent runs at most 5 tasks at a time. Missed-run handling for schedules: run once on launch (default), skip (recorded as `missed_skipped`), or every missed slot (newest 24 at most).
- **Self-scheduling** by an agent (`schedule_next_run`) is separate. See [Agent DB & Self-Scheduling](/agent-db).

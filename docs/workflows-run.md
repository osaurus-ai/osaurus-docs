---
title: Run a Workflow
sidebar_label: Run a Workflow
description: Start a workflow with one click, from a chat, by asking Osaurus, from one of your agents, or on a schedule. Read the result, open its files, and fix a run that failed.
---

# Run a Workflow

Once a workflow is saved, running it takes one click. Fill in its form if it has one, and the result appears a moment later, along with any files it made.

You can also start a workflow from a chat, by asking Osaurus, from one of your agents, or automatically on a schedule.

## Run it from the Workflows page

1. Click **Workflows**, the second icon on the narrow strip along the left edge of the window.
2. Find the workflow on the **All** tab and click **Run**.
3. If the workflow needs something from you, like a topic or an email to reply to, a form appears. Fill it in and click **Run** (or press ⌘Return). Fields marked with **\*** are required. **Fill with Example** fills in a sample, so you can see how it works.
4. Watch each step tick off as it runs. When it's done, the **Result** appears.

Workflows that need nothing from you, like **Morning Brief**, start straight away.

### Use the result

- Each part of the result has its own copy button. **Copy All** copies everything at once.
- If the workflow made files, like a report or an image, they're listed under **Files**. Click **Open**, or **Show in Finder** to see where they are.
- **Run Again** runs it again. If it has a form, you go back to the form with your last answers filled in, so you can change one thing and rerun.

## Other ways to run it

- **From a chat.** In the message box, click **+** and choose **Add Workflow**, then pick one. Or type `/` and pick a workflow from the list. Either way, its form opens so you can fill it in.
- **By asking Osaurus.** Say "run my Morning Brief" in a chat with Osaurus. For this to work, open the workflow's page and turn on **Osaurus can run this for you** under **Who Can Start It**. The built-in workflows have it on already.
- **From one of your agents.** Go to **Settings → Agents**, pick an agent, then **Abilities → Workflows**, and turn on the workflows it may use. The agent can then run them by itself when they fit what you ask.
- **On a schedule, or when something happens.** Set up an [Automation](/automations) to run a workflow every weekday at 8, or whenever a new file lands in a folder.
- **When you're away from your Mac.** Your iPhone, a teammate, or a message in Slack or Telegram can start a workflow too. See [Devices & Sync](/devices), [Workspaces](/workspaces) and [Agent Channels](/agent-channels).

## A workflow's page

Click **See all runs** under a workflow on the Workflows page (or **Details & History** in its **…** menu) to open its page. At the top you'll see:

- whether it's **Ready to run**, has **Keys missing**, or **Needs setup**
- how many steps it has
- whether it **Runs on this Mac** or **Uses the cloud**

Below that are its past runs, what it does, and **Who Can Start It**, where you choose whether Osaurus, your teammates, or automatic fixes are allowed.

## Finish setting it up

A workflow marked **[Needs setup](/glossary#needs-setup)** is missing something it needs to run, such as a model, a key, a folder, or permission to use an app.

1. Click **Set Up** on the workflow's row.
2. Go through each step. Osaurus tells you what's missing and why.
3. When everything is ready, the badge changes to **Ready to run**.

A workflow with **Keys missing** still works up to the point where it needs the key. Add the key in the [Vault](/vault): open **Settings → Vault**, find it under **Missing Keys**, and click **Set**.

## When it asks you something

Some workflows stop halfway to ask you a question, like which folder to save to, or whether a draft looks right. The question appears wherever you started the run: in the chat, on the run's page, or as a notification.

A workflow waits as long as you need. While it's waiting, the **Running now** list on the Workflows page shows **Respond**.

If a workflow wants to read or save files somewhere it wasn't set up for, it asks first. You can choose **Allow for this run**, **Always allow**, or **Don't allow**.

## When something goes wrong

A failed run opens on the step where it stopped, with what went wrong. You have two options:

- **Retry from Failed Step** runs it again from that step, keeping everything that already worked.
- **Fix with the Architect** opens a chat with the [Architect](/glossary#architect) that already knows what failed. It can change the step and test again. Nothing is saved until you click **Save**.

To have this happen by itself, turn on **Fix repeated failures automatically** under **Who Can Start It** on the workflow's page. If the same step fails the same way three runs in a row, the Architect drafts a fix in the background and sends you a notification to review it. Nothing changes until you save it.

## See the whole workflow

Click **Open Full View** (the arrows in the corner of a workflow's **Steps**) to see the whole workflow as a diagram, from what you give it on the left to what you get on the right. On a run, you can watch each step light up as it works, and click any step to see what it received and what it made.

## Past runs

Click a workflow's row to see its last five runs, or **See all runs** for the full list. Click a run to open it again, with its result and files.

---

## Under the hood

- **Agents:** each workflow turned on under an agent's **Abilities → Workflows** becomes a tool named `workflow_<name>`, whose arguments are the workflow's form. The run uses that agent's own keys first, then the shared ones. While it runs, the tool card in chat follows the steps and has **Open Run**.
- **The Orchestrator** lists installed workflows and runs those marked **Osaurus can run this for you** with `run_workflow`. It can also turn workflows on for a custom agent (`agents[].workflows`) and add an `automations:` entry that starts one.
- **Keys:** a run started from the Workflows page or by an automation with **Run as** set to **No agent (shared keys)** uses the keys shared by all agents in the Vault. The run page's footer says **Uses shared keys** or names the agent whose keys it uses.
- **Before every run** Osaurus re-checks setup for that caller. A missing model, revoked secret, disconnected MCP server or removed tool fails with `needs_setup` and marks the workflow **Needs setup**. A step that reaches a key with no value fails with `missing_key`.
- **Relaunch:** a run still going when Osaurus quits resumes on the next launch. Finished steps keep their results, unfinished steps run again, and a waiting form is shown again.
- **Forms and outside callers:** an HTTP API or MCP caller can't answer a form. The call returns `awaiting_user` with the run id, and `GET /workflows/runs/{id}` returns the result once the form is answered and the run ends. See the [HTTP API](/api) and [SDK Examples](/sdk-examples).
- **Insights:** every run is recorded in **Settings → Developer Tools → Insights** on the **Workflows** tab: one row per run (workflow, caller, status, input, output, duration) and one per step (model and tokens, tool calls, logs and requests). See [Developer Tools](/developer-tools).
- **Retry from Failed Step** starts a new run in the same scratch folder with the finished steps kept.

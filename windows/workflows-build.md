---
title: Build a workflow with the Architect on Windows
sidebar_label: Build with the Architect
description: Describe a task in your own words and the Architect builds it into a workflow, tests it with you, and saves it. Change a saved workflow the same way, and go back to any earlier version.
---

# Build with the Architect

The [Architect](/glossary#architect) is the helper that builds [workflows](/windows/workflows). You describe a task in your own words; it drafts the steps, tests them with you, and saves the workflow when a test passes. Nothing is saved until you choose **Save**.

## Build one, start to finish

1. Click **Workflows** in the sidebar, then **New workflow** (or press **Ctrl+N**).
2. Describe the task in the box, the same way you'd explain it to a person. For example: "Turn a folder of invoices into a monthly expense report with totals by category." Press **Tab** to take one of the ideas that cycle in the empty box.
3. Send it. An Architect chat opens in the Workflows section, listed in the sidebar under **Drafts**.
4. The Architect asks only what it needs, then drafts the steps. They appear on the right as it works.
5. It tests the steps with you. Watch each step work on real input, or click **Fill with example** and run a test yourself.
6. When a test has passed, the chat shows a save card saying **Ready to save**. Click **Save**.

The workflow is now installed on this PC and listed on the Workflows home page, ready to [run](/windows/workflows-run).

The **New workflow** page also offers **Or add a ready-made workflow** (the [starters](/glossary#starter)) and **Import a workflow**.

## What you see while you build

The Architect chat sits on the left, and the draft fills the rest of the window. In a narrow window, a **Chat** | **Workflow** switch at the top flips between the two.

Before your first message, the chat asks **What should this workflow do?** and offers ideas under **Or start from an idea**: **Turn a brief into social posts**, **Meeting notes to action items**, **Draft replies to emails** and **Something else…**. An idea puts its words in the message box for you to finish; it doesn't send anything. **Change a saved workflow instead** takes you to the Workflows home page.

The draft has four tabs:

- **Design** (Ctrl+1): what you fill in, what you get back, and the **STEPS**. Click a step to change it by hand, **Test from here** (rerun the last test from that step), **Ask the Architect** about it, or **Delete** it.
- **Test** (Ctrl+2): the **INPUT** form, **Fill with example**, and the **RESULT** of each test.
- **History** (Ctrl+3): earlier **TESTS** (right-click one to **Use this input**) and **CHANGES**, each with **Undo**.
- **Publish** (Ctrl+4): publish the saved workflow on store.osaurus.ai. See [Share a workflow](/windows/workflows#share-a-workflow).

The draft's **…** menu has **Rename**, **Set up…**, **Full view**, **Save as new workflow** and **New workflow**. Press **F2** to rename it.

## Testing and saving

A workflow can only be saved after it has passed a test since its steps last changed. A new name or summary doesn't need a new test. If a step must use a particular model, the test has to run on that model.

To save, use the save card in the chat or the footer of the draft. The footer says **Saving installs it on this PC with the models picked on each step**, and has a box for **What changed in this version (optional)**, and **Save**. Once it's saved, **Try it** opens its run page.

If the draft needs a key, a folder or a package before it can be tested, click **Set up…** in the draft. See [Finish setting it up](/windows/workflows-run#finish-setting-it-up).

### Run it on a schedule straight away

Tell the Architect when it should run, for example "every weekday at 7". The save card then shows **Then run it** with the schedule, and saving also creates the automation in **Settings → Automations**. Clear the **Then run it** box to save the workflow without it. See [Automations](/windows/automation).

## Change a saved workflow

1. Open the workflow's page and click **Edit with Architect** (or choose **Edit with the Architect** from its menu on the home page).
2. The Architect chat asks **What should change in** your workflow, with ideas such as **Change what it asks for**, **Change what it gives back** and **Run it on another model**.
3. Describe the change, test it, and save.

Saving makes the next version. The version you run now keeps working until then. **Save as new** (or **Save as new workflow** in the draft's menu) keeps the old workflow as it is and saves a separate one.

### Go back to an earlier version

On the workflow's page, open **More** and choose **Version history**. **Restore** saves the version you pick again as the newest version. Nothing is deleted.

### Fix a failed run

When a run fails, its run page offers **Fix with the Architect**: the Architect re-tests from the step that failed and proposes a fix for you to save.

## Ask Osaurus instead

You don't have to open Workflows at all. Ask the [Orchestrator](/glossary#orchestrator) for something that takes several steps or tools together, and it can have the Architect build a small workflow and run it straight away. If you like the result, it offers to keep it, with the same save card.

## The Architect's settings

**Settings → Agents → Architect** has the Architect's **Basics** (name, avatar, instructions and model) and, under **Permissions**, when it should ask you first:

- **Edit the draft**: **Auto**, **Ask** or **Never**.
- **Run tests**: **Auto**, **Ask** or **Never**.

**Restore defaults** fills in the stock settings; **Save** applies them.

## Troubleshooting

| What you see | What to do |
|---|---|
| **Needs a test** on the save card | It hasn't passed a test since the steps changed. Run a test first. |
| "The latest test failed" | Fix the step (or ask the Architect to), then test again before saving. |
| "Test again on the required model" | A step must use a particular model. Run the test on that model. |
| **This proposal is closed** on a save card | The draft changed since. Save from the draft, or ask the Architect. |

---

## Under the hood

- A save stands on the draft's test runs since its steps, links, schemas or output last changed; the save route checks the same evidence as the card.
- The Orchestrator's hand-off is the `architect_handoff` tool ("Build and run a small workflow now"). It isn't offered in a project that keeps to local models.
- Saving installs the workflow and adds its template to your library. **Save as new** gives it a new template instead of the next version.

---
title: Build with the Architect
sidebar_label: Build with the Architect
description: Make your own workflow by describing it in a chat. The Architect builds the steps, you test it, and you save it. No code needed.
---

# Build with the Architect

You can make your own workflow without writing any code. Describe the task in a chat, and the [Architect](/glossary#architect), a helper that builds the workflow for you while you chat, turns it into steps. You test it, and when you like the result, you save it.

Nothing is saved until you've tested it and clicked **Save**.

## Build one, start to finish

Let's build a workflow that writes a short update about your week's meetings every Friday.

1. Click **Workflows**, the second icon on the narrow strip along the left edge of the window.
2. Click **New Workflow** (or press ⌘N).
3. Where it asks **What should this workflow do?**, describe the task in your own words. For example:

   > Every Friday at 4 pm, look at this week's meetings in my calendar and write a short update I can send to my team.

4. Press Return. The Architect may ask up to three short questions about anything you left open, such as what you want back or whether it must stay on your Mac. Answer them like you would in any chat.
5. The Architect lists its plan and builds the steps. You'll see them appear on the **Design** tab beside the chat.
6. Look at the button at the bottom of the draft. It always shows the next thing to do:
   - **Set Up…** means the workflow needs something first, like a model or permission to read your calendar. Click it and follow the steps.
   - **Test Run** runs it once so you can check the result.
7. Click **Test Run**. The **Test** tab shows each step as it runs, then the result.
8. Not quite right? Tell the Architect in the chat, for example "make it shorter" or "group the meetings by project". It changes the steps. Click **Test Again**.
9. When you like the result, click **Save…**. The save card shows what you built and the test that passed.
10. Because you asked for "every Friday at 4 pm", the card includes a box, already ticked, that reads **Then run it:** followed by the schedule. Leave it ticked and click **Save**.
11. Click **Try It** to run your new workflow right away.

That's it. Your workflow is on the **All** tab of the Workflows page, and it will run by itself every Friday at 4 pm. To share it, click **Share…** on the save card, or see [Share a Workflow](/workflows-share).

## What you'll see while you build

The Architect chat is on one side and the draft is on the other. Along the top of the draft, **Design → Test → Save → Publish** shows how far you've got.

The **Design** tab explains the workflow in plain words:

- **Steps**: what it does, in order.
- **You fill in**: the form you'll see each time you run it. Some workflows don't need one.
- **You get**: what it gives back, like a summary or a reply.
- **Your files**: any folders it reads from or saves to.
- **It uses**: the accounts, keys, apps and services it needs.
- **Changes**: what changed since you last saved.

The **Test** tab is where you try it. **Fill with Example** fills in the form for you, so you can test with one click.

Click the name at the top to rename the workflow.

## Describe it well

The Architect works best when you say:

- **What you want back.** "A three-line summary", "a reply I can paste into Mail", "a list of action items".
- **What it starts from.** "My unread mail", "a topic I type in", "the files in my Invoices folder".
- **When it should run**, if it should run by itself. "Every weekday at 8", "whenever a new file lands in Downloads".
- **Whether it must stay private.** "Keep this on my Mac" makes sure it only uses models on your Mac.

You don't need to name tools, models or apps. The Architect picks them.

## Other ways to start

- **Ask Osaurus.** In a normal chat, say "build me a workflow that…". Osaurus passes your request to the Architect.
- **Start from a ready-made one.** Under **Or add a ready-made workflow** on the New Workflow page, pick one, preview it, and click **Add**. You can change it afterwards.
- **Let the Architect find one.** For a common job, the Architect first checks your own workflows and the shared ones on store.osaurus.ai, and adapts one that fits instead of starting from scratch.

## Change a saved workflow

1. On the Workflows page, click the **…** next to the workflow and choose **Edit with the Architect**. (On a workflow's own page, click **Edit** at the bottom.)
2. Tell the Architect what to change. The header reads **Editing v2** (or the next version number).
3. Test it, then click **Save…**. Saving makes a new version. Until then, the version you already have keeps running as before.

Want to keep the original and make something new from it? Choose **Save as New Workflow** from the draft's **…** menu.

To go back to an earlier version, choose **Version History** from the **…** menu, then **Restore**.

If you step away halfway, your draft waits on the **Drafts** tab. Click **Continue** to pick up where you left off.

## Good to know

- **Some models can't build workflows.** The Architect needs a model that can use tools, so very small models (including Apple Intelligence) aren't offered for it, and Osaurus warns you if your default is one of them. Pick its model in **Settings → Agents → Architect**.
- **Some models can't run every step.** A few local models can't follow the exact answer format a step needs. Setup tells you, and suggests picking another model for that step.
- **Workflows that run programs use the Sandbox.** If a workflow needs to run a program or a bit of Python, it does so in the [Sandbox](/glossary#sandbox), a safe, separate space on your Mac. Setup tells you if the Sandbox needs to be turned on. A few of these programs need macOS 26.
- **Workflows that need an account** (like Slack or GitHub) show **Sign in to** followed by the service's name during setup. Your browser opens, you approve, and you're done.
- **Keys and passwords** a workflow needs are saved in the [Vault](/vault) on your Mac, never inside the workflow itself.
- **A test must pass before you save** whenever the steps change. Renaming a workflow or changing its description doesn't need a new test.

---

## Under the hood

- **The Architect** is a built-in agent whose tools edit a workflow draft. Before building it asks at most three questions, then states its plan. Its model, name, avatar and permissions are in Settings → Agents → **Architect**. It can also run on Claude Code or Pi ([Runtimes](/harness-runtimes)), where it reaches only its workflow tools through the Osaurus server.
- **Design model requirements:** the Architect needs tool calling, so small-context models that run with tools off (such as Apple Foundation Models) are excluded from its model menu.
- **Step model requirements:** each model step needs native [structured output](/glossary#structured-output): a cloud provider that enforces JSON schemas, Apple Foundation Models, or a local MLX model whose tokenizer supports grammar-constrained decoding (byte-level BPE, which covers most current bundles). A model that can't, such as one with a SentencePiece tokenizer, is a blocking setup item. In the model menu these are grouped as "Can't return typed results".
- **Saving:** `workflow_propose_save` requires one passing test after the graph changes. With a trigger in the brief, the save card's **Then run it** creates the matching entry in Settings → Automations.
- **Reuse:** the Architect searches the store registry (`api.store.osaurus.ai`) and your library first. For other services it searches the Osaurus MCP Directory, or reads a service's OpenAPI description (https only, up to 2 MB) and builds HTTP steps from it.
- **Sign-ins:** OAuth secrets use the redirect URL `http://127.0.0.1:47823/callback`. Services that need your own OAuth app show **Sign in with your own** followed by the service's name, with fields for the Client ID and Client secret.
- **Dependencies:** shell and Python steps run in the workflow's own sandbox environment (a separate Linux user, Python environment and npm workspace). `pip` and `npm` packages work on any supported macOS; `apk` packages need the Linux sandbox on macOS 26 and show **Unavailable here** otherwise. See [Sandbox](/sandbox).
- **Versions:** each save is a new version with a diff in **Version History**. A draft that edits a saved workflow saves that workflow's next version unless you choose **Save as New Workflow**.

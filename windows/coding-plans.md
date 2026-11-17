---
title: Coding plans and your own runtime on Windows
sidebar_label: Coding plans
description: Use GitHub Copilot or Antigravity in Osaurus for Windows on the subscription you already pay for, with every action going through Osaurus's approvals, or run an agent's chats on a Pi program installed on your PC.
---

# Coding plans and your own runtime on Windows

If you already pay for GitHub Copilot or use Antigravity, Osaurus can run it in your chats, signed in with your own plan. Osaurus switches its own tools off: it works only through Osaurus's tools, so every file edit, command, or web visit goes through the same approvals, file history, and [Privacy Filter](/windows/privacy-filter) as any other model. Once it's signed in, it's a model in the picker like any other.

What you need: a GitHub account with a Copilot plan that allows Copilot CLI, or a Google account (or a Gemini API key) for Antigravity. GitHub Copilot also needs Node.js 20 or later on your PC.

[Claude Code](/windows/claude-code) works the same way on your Claude Pro or Max subscription. It has its own page because you install and sign in to it yourself.

Separately, if you have an agent program that speaks Pi's RPC protocol, you can add it as [your own runtime](#your-own-runtime). That's different: it runs its own tools.

## Get started

1. Open **Settings → Models → Providers** and click **Add provider**.
2. Under **Sign in — no key to paste**, pick **GitHub Copilot** or **Antigravity** ("Runs … on your subscription, using only Osaurus's tools").
3. On its page, click **Install**. Osaurus downloads the version it tested and checks that it starts. The status line shows progress, then **Installed · Not signed in**.
4. Click **Sign in**:
   - **GitHub Copilot**: **Sign in with GitHub in the browser**, or **Sign in with GitHub using a code** (open the page shown in any browser, sign in, and enter the code; **Copy code** helps).
   - **Antigravity**: **Sign in with Google** (Osaurus opens Google's sign-in in your browser once Antigravity has started, which takes a few seconds), or **Use a Gemini API key**.
5. When the status says **Installed · Signed in**, pick it in the model picker for an agent or a chat. Until it's signed in, the picker shows **Sign in to** and its name instead of models.

The page also says what leaves your PC: GitHub or Google receives your conversations and what Osaurus's tools return, on your own subscription.

## Using it

- **It needs tools.** It works only through Osaurus's tools, so it runs in an agent's chat whose agent has tools switched on. With none, the chat says so.
- **Approvals.** Every action it takes is an Osaurus tool call, with the same approval cards and file history as any other model. If its model asks for a tool of its own, Osaurus refuses and nothing runs.
- **What it costs.** Your plan pays. When the vendor reports a list price for a chat, Osaurus shows it but doesn't count it as your spend.
- **Contained.** Where your PC can, it runs in a container that limits what it can reach. The page says **Runs contained on this PC**, or why not. **Containment settings** opens **Settings → Tools → Sandbox**, where **Run other vendors' agents contained** turns this on or off for all of them. See [Sandbox](/windows/sandbox).

## Which version runs

**Version** on its page has three choices:

| Choice | What it does |
|---|---|
| **Tested by Osaurus** | The default. The version this Osaurus release was tested with |
| **Latest** | Follows the newest release. Osaurus looks for one once a day (or when you click **Check for updates**), checks it on this PC, and switches only if it passes. A version that fails is held back and the one you had keeps running |
| **My own copy** | Uses a copy you installed yourself, the one a terminal would start. Any version Osaurus hasn't tested is checked on this PC before its first use; **Look again** picks up a newer copy, and **Check again** reruns the check |

The check takes about a minute and sends nothing to a real model. It makes sure the program's tools are still only Osaurus's: it offers its model no tool of its own, and its own tools, called by name, change nothing on disk and reach nothing. A version that fails "does not run".

## Your own runtime

A runtime is an agent program installed on your PC that runs an agent's chats, with its own model and its own tools. It has to speak the RPC protocol of Pi (a coding agent whose command is `pi`), so Osaurus can send it your messages and show what it does. Your organisation may give you one. Unlike GitHub Copilot and Antigravity, **it runs its own tools on this PC**. As the page says: "Osaurus can't approve or undo what they do outside the chat's folder. Add only a program you trust."

1. Open **Settings → Models → Providers → Add provider**, and under **On this PC** pick **Your own runtime**.
2. Fill in **Name**, and **Program**: a `.exe` or `.cmd`, or a command name such as `pi` (**Browse…** to find it).
3. If the program needs them, add **Arguments** (one per line; `{chat_id}`, `{agent_id}`, `{cwd}`, and `{system_prompt_file}` are filled in for each chat) and **Environment** (one `NAME=value` per line, stored unencrypted, so never a secret).
4. Click **Test**: Osaurus starts the program once, asks it for its state, and closes it. Nothing is sent to a model. Then click **Add**.
5. Open one of your own agents and pick the runtime as its model.

A runtime runs only where someone is watching. It runs only agents you created, not the Orchestrator or another built-in agent, and only in a chat in Osaurus on this PC. It can't take a voice call, run on a schedule or a watcher, be handed work by another agent, or answer from another device or app. Changes its own tools make in the chat's folder are kept in its file history when Osaurus can track them; the chat says when it can't.

**Remove** on its page stops Osaurus using it. The program itself stays installed. Removing is refused while an agent still runs on it.

## Troubleshooting

| Message or problem | What to do |
|---|---|
| "GitHub Copilot runs on Node.js 20 or later, and Osaurus found no Node.js on this PC." | Install Node.js from nodejs.org, then click **Install** again |
| "This agent has no tools switched on, and … works only through Osaurus's tools." | Turn on some tools in the agent's editor |
| "… failed Osaurus's check on this PC, so it does not run" | Switch **Version** back to **Tested by Osaurus**, or wait for a newer version |
| "… is not the version Osaurus tested" | The installed copy changed outside Osaurus. Install it again, or choose **My own copy** |
| A runtime says "The program was not found." | Check **Program**: a full path, or a command name Windows can find |

To stop using GitHub Copilot or Antigravity, click **Remove** on its page. Osaurus signs it out and deletes its install and everything it kept on this PC; chats that used it stay but can't continue until it's installed again. What GitHub or Google keeps on its own servers isn't deleted. If you chose **My own copy**, your install is left where it is.

---

## Under the hood

- GitHub Copilot and Antigravity run over the Agent Client Protocol (ACP), each as a child process with its own home folder under Osaurus's data. GitHub Copilot is installed with npm from a pinned lockfile; Antigravity is a pinned download checked against its SHA-256.
- Osaurus's tools reach them through Osaurus's own MCP server, granted per turn. Sign-in runs outside the container, since it needs your browser.
- The version check is run locally, one at a time, against a scripted stand-in model on this PC; it uses no tokens.
- An installed runtime is stored in Osaurus's database as a provider named `runtime-<name>`. Each chat gets its own process, kept across turns and closed when the chat is deleted. Osaurus talks to it in Pi's `--mode rpc`: a prompt goes in, the session's events come out. Osaurus tools it calls go through the bridge with their approvals; its model calls through Osaurus are placed and counted as the provider they reach.

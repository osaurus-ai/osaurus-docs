---
title: Shortcuts, Spotlight & Siri
sidebar_label: Shortcuts, Spotlight & Siri
description: Ask Osaurus a question or start one of your agents from the Shortcuts app, Spotlight, or Siri — it works as soon as you install, with no setup.
---

# Shortcuts, Spotlight & Siri

You can use Osaurus without opening it: ask a quick question from Spotlight, say "Ask Osaurus" to Siri, or build it into your own shortcuts in the Shortcuts app. Two actions are ready as soon as you install Osaurus, with nothing to set up. You just need a [model](/glossary#model) set up in Osaurus, and at least one of your own [agents](/glossary#agent) if you want to start agents this way.

## The two actions

| Action | What it does | Best for |
|---|---|---|
| **Ask Osaurus** | Sends your question to the agent new chats start with (the [Orchestrator](/orchestrator), unless you've changed it) and gives you the answer, or speaks it. It starts a fresh conversation, not the chat you have open, and waits for the reply. | Quick questions |
| **Run Osaurus Agent** | Starts one of your own agents in the background. You choose the **Agent**, and can add optional **Input** text for it. It returns straight away; progress and results show up in Osaurus (Tasks and notifications). | Longer jobs that use tools |

## Get started

**Spotlight:** press `⌘ Space`, type "Ask Osaurus", and go.

**Siri:** say "Ask Osaurus", then your question. To start an agent, say "Run *\<agent name>* in Osaurus". Every phrase needs to include the word "Osaurus".

**Shortcuts app:**

1. Open the Shortcuts app and create a new shortcut.
2. Search for **Ask Osaurus** or **Run Osaurus Agent** and add it.
3. Fill in the details. **Run Osaurus Agent** shows a list of your agents and an optional **Input** field, which you can fill from earlier steps in the shortcut.
4. Run the shortcut.

## Ideas

You can combine these with anything else Shortcuts can do. For example:

- A Focus mode that runs a "wind-down summary" agent every evening.
- A keyboard shortcut that opens "Ask Osaurus" from Spotlight.

## Before you start

- **Set up a model**, so "Ask Osaurus" can answer.
- **Create at least one agent**, so "Run Osaurus Agent" has something to list. The list only shows your own [agents](/agents); the Orchestrator is used by the in-app chat and "Ask Osaurus".

## Troubleshooting

**Osaurus wasn't running.** That's fine. macOS opens Osaurus in the menu bar and it handles the request. The first run takes a little longer.

**"Osaurus isn't reachable".** Osaurus couldn't start or respond. Open it from your Applications folder and try again.

---

## Under the hood

Osaurus ships **App Intents**, Apple's framework for exposing app actions to Shortcuts, Spotlight, and Siri.

The intents are thin clients: every action calls the local Osaurus HTTP server on `127.0.0.1`, the same server the in-app chat and the [HTTP API](/api) use. They don't load their own models or hold separate logic.

- **Ask Osaurus** streams the full [agent loop](/agent-loop) (persona, memory, skills, tools) for the new-chat agent and reads the reply to completion. Because it's connection-bound, it's tuned for short asks. The new-chat agent is set with [`new_chat_agent`](/configuration#declarative-configuration).
- **Run Osaurus Agent** dispatches a **detached** background run that keeps going after the shortcut returns, which is why it suits long tasks.

If Osaurus isn't running, macOS launches the menu-bar app and Osaurus starts the server headlessly before handling the request.

:::note
"Ask Osaurus" reaches the new-chat agent over [loopback](/glossary#loopback) only. Like the rest of Osaurus, local (`127.0.0.1`) callers are trusted; remote callers can't reach the Orchestrator.
:::

---

**Related:**

- [Chat](/chat): the in-app chat window
- [Agents](/agents): create the agents that show up in "Run Osaurus Agent"
- [Voice](/voice): on-device dictation and wake-word activation inside Osaurus
- [CLI](/cli): drive Osaurus from the terminal instead

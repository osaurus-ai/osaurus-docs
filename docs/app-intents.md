---
title: Shortcuts, Spotlight & Siri
sidebar_label: Shortcuts & Siri
description: Osaurus ships App Intents, so "Ask Osaurus" and "Run Osaurus Agent" work from Shortcuts, Spotlight, and Siri the moment you install — zero setup.
---

# Shortcuts, Spotlight & Siri

Osaurus ships **App Intents**, Apple's framework for exposing app actions to the system. The moment you install Osaurus, two actions become available everywhere — the Shortcuts app, Spotlight, and Siri — with no configuration.

## The two actions

| Action | What it does |
|---|---|
| **Ask Osaurus** | Sends a prompt to your **currently active** agent and returns (or speaks) the reply. It waits for the answer, so it's best for quick questions. |
| **Run Osaurus Agent** | Kicks off one of your custom agents **in the background**. It returns immediately; progress and results show up in Osaurus itself (Tasks and notifications). Best for longer, tool-heavy work. |

### Example phrases

Each phrase must contain the app name:

- "Ask Osaurus" — then dictate or type your prompt
- "Run *\<agent>* in Osaurus"

## How to use it

- **Shortcuts app** — add "Ask Osaurus" or "Run Osaurus Agent" to a shortcut, fill in the parameters, and run it. "Run Osaurus Agent" shows a dropdown of your custom agents.
- **Spotlight** — press `⌘ Space`, type "Ask Osaurus", and go.
- **Siri** — say "Ask Osaurus" or "Run *\<agent>* in Osaurus".

You can chain these into automations like any other shortcut — for example, a Focus-mode trigger that runs a "wind-down summary" agent each evening, or a Spotlight ask wired to a keyboard shortcut.

## What you'll want first

- **A model configured**, so "Ask Osaurus" can actually answer.
- **At least one custom agent**, so "Run Osaurus Agent" has something to list. The picker shows your custom [agents](/agents) (the built-in agent is reserved for the in-app chat and "Ask Osaurus").

## How it works

App Intents in Osaurus are **thin clients**: every action calls the local Osaurus HTTP server on `127.0.0.1` — the same server the in-app chat and the [HTTP API](/api) use. They don't load their own models or hold any separate logic.

- **Ask Osaurus** streams the full [agent loop](/agent-loop) (persona, memory, skills, tools) for the active agent and reads the reply to completion. Because it's connection-bound, it's tuned for short asks.
- **Run Osaurus Agent** dispatches a **detached** background run that keeps going after the shortcut returns — which is why it suits long tasks.

If Osaurus isn't running when you trigger an action, macOS launches the menu-bar app and Osaurus starts the server headlessly before handling the request (the first run is slightly slower). If it genuinely can't reach the server, you get a clear "Osaurus isn't reachable" message rather than a silent failure.

:::note
"Ask Osaurus" targets the active agent over loopback only. Like the rest of Osaurus, local (`127.0.0.1`) callers are trusted; remote callers can't reach your built-in agent.
:::

## Related

- [Chat](/chat) — the in-app chat overlay
- [Agents](/agents) — create the custom agents that show up in "Run Osaurus Agent"
- [Voice](/voice) — on-device dictation and wake-word activation inside Osaurus
- [CLI](/cli) — drive Osaurus from the terminal instead

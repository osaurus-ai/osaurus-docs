---
title: Projects
sidebar_label: Projects
description: Group related chats into a project so they share the same instructions, knowledge, and memory — no matter which agent you use. Everything stays on your Mac.
---

# Projects

A **project** groups related chats around one topic — a launch, a trip, a codebase, a client — so they share the same context instead of scattering across dozens of unrelated conversations. Think of agents as *who* you talk to, and a project as *what* you're working on.

Every chat in a project automatically gets three things, and they're shared across **any** agent you use in that project:

- **Instructions** — standing guidance added to every chat ("always call the product Nimbus, keep it concise").
- **Knowledge** — collections every chat can search, on top of whatever the agent already has.
- **Memory** — what the chats learn accumulates in one shared pool, so a fact you mention in one chat is recalled in another.

Everything is local. Nothing about a project leaves your Mac unless a cloud model you chose reads it during a chat.

## Quick start

1. In the chat sidebar, open the **Projects** tab and click **New Project**
2. On the project page, add **Instructions**, grant **Knowledge** collections, and (optionally) pick a **Default Agent**
3. Click **New Chat** to start a conversation inside the project
4. Chat with any agent — instructions and knowledge apply on their own, and everything the chats learn builds up in the project's shared memory

To pull an existing chat in, right-click it in the sidebar and choose **Move to Project**.

## The project page

Opening a project shows a two-column workspace:

- **Left** — the project's chats, with search and a **New Chat** button.
- **Right** — its configuration: **Instructions**, **Knowledge**, and **Default Agent**.

### Instructions

Free-form guidance prepended to the system prompt of every chat in the project. Use it for the things you'd otherwise repeat in each conversation — tone, naming, constraints, what to watch out for. Edits **auto-save** as you type.

### Knowledge

Grant [Knowledge](knowledge.md) collections to the project and every chat in it can search them — **even agents that don't have knowledge enabled on their own**. Project membership is the opt-in. Create a collection right from the project page with **New Collection**; it's auto-granted to the project.

### Default Agent

The agent new chats started from the project page begin with. It's a nudge toward consistency, never a restriction — you can switch agents inside a project chat, and the chat stays in the project.

## Shared memory across agents

This is what makes a project more than a folder. Chats in a project share one pool of memory, so:

- A fact you state in one chat is recalled in **another chat in the same project** — including one running a **different agent**.
- Recall is **immediate**: state something, open a new project chat, and it's already there. You don't wait for background processing.
- It works even for agents that have their **own memory turned off** — they contribute to and read the project's shared memory, while still building no personal memory of their own.

:::note[The one switch that governs it]
Project memory is always on — there's no per-project toggle, because a project without shared memory wouldn't be much of a project. The only master control is the global **Memory** setting; turn that off and projects share nothing either.
:::

Under the hood, each project keeps its own memory that's [distilled](memory.md) into tidy facts in the background, but recall never waits on that — see [Memory](memory.md) for how it all works.

## Deleting a project

Deleting a project (or using **Forget** on its row in **Memory** settings) removes its instructions, its shared memory, and its knowledge grants. The **chats themselves are kept** — they simply move out of the project. Knowledge collections are shared resources and are never deleted by removing a project.

## See also

- [Memory](memory.md) — how shared memory is recalled and stored
- [Knowledge](knowledge.md) — creating and granting collections
- [Chat](chat.md) — the chat window projects live in

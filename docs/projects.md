---
title: Projects
sidebar_label: Projects
description: Group related chats into a project so they share the same instructions, documents, memory, and Working Folder — no matter which agent you use. Everything stays on your Mac.
---

# Projects

A **[project](/glossary#project)** groups related chats around one topic — a launch, a trip, a codebase, a client — so they share the same background instead of scattering across dozens of unrelated conversations. Think of [agents](/glossary#agent) as *who* you talk to, and a project as *what* you're working on.

Every chat in a project automatically gets three things, shared across **any** agent you use in that project:

- **Instructions** — standing guidance added to every chat ("always call the product Nimbus, keep it concise").
- **Knowledge** — [Knowledge](/glossary#knowledge) collections (folders of your documents) every chat can search, on top of whatever the agent already has.
- **Memory** — what the chats learn goes into one shared pool of [memory](/glossary#memory), so a fact you mention in one chat is remembered in another.

A project can also have a [Working Folder](/glossary#working-folder) (a folder on your Mac the agent may work in) that its new chats open in.

Everything stays on your Mac. Nothing about a project leaves it unless a [cloud model](/glossary#cloud-model) you chose reads it during a chat.

## Get started

1. In the chat sidebar, open the **Projects** list and click **New Project** (the **+**).
2. In **Project Settings**, add **Instructions**, choose **Knowledge** collections, and (optionally) pick a **Working Folder** and a **Default Agent**.
3. Click **New Chat** — or press `⌘ N` in a chat that's already in the project — to start a conversation inside it.
4. Chat with any agent. The instructions and knowledge apply on their own, and everything the chats learn builds up in the project's shared memory.

To bring in chats you already have, use **Add Chats** on the project page, or right-click a chat (in the sidebar or on its tab) and choose **Move to Project**. A chat that's already in a project offers **Change Project** instead.

## The project page

Opening a project shows its chats in the main area, with **New Chat** and **Add Chats** buttons and a menu to **Rename** or **Delete** the project. The inspector on the right becomes **Project Settings**: **Instructions**, **Knowledge**, **Working Folder**, **Shared Memory**, and **Default Agent**.

### Instructions

Free-form guidance added to the standing instructions of every chat in the project. Use it for things you'd otherwise repeat in each conversation — tone, names, rules, what to watch out for. Changes **save automatically** as you type.

### Knowledge

Choose [Knowledge](knowledge.md) collections for the project, and every chat in it can search them — **even with agents that don't have Knowledge turned on themselves**. Being in the project is enough. You can create a collection right from the project page with **New Collection**; it's added to the project automatically.

### Working Folder

**Choose Folder…** picks a folder on your Mac that new chats in the project open with, so every agent works in the same place. It only applies to a new chat that doesn't already have its own folder, and it wins over the agent's own remembered [Working Folder](/agents#working-folders-and-the-sandbox). Because a chat uses either a folder or the [Sandbox](/glossary#sandbox) (a sealed-off area for running code), the chat's agent has its Sandbox turned off. Use **Change** to pick another folder, or remove it to stop new chats from opening in one.

### Shared Memory

Shows that chats in the project build shared memory, with **Open in Memory** to review what's been learned. See [below](#shared-memory-across-agents).

### Default Agent

The agent new chats started from the project page begin with. It's a suggestion, not a rule — you can switch agents inside a project chat, and the chat stays in the project.

## Shared memory across agents

This is what makes a project more than a folder. Chats in a project share one pool of memory, so:

- A fact you mention in one chat is remembered in **another chat in the same project** — even one with a **different agent**.
- It's **instant**: say something, open a new project chat, and it already knows. You don't wait for anything to process.
- It works even for agents with their **own memory turned off**. They add to and read the project's shared memory, but still keep no personal memory of their own.

:::note[The one switch that controls it]
Project memory is always on. There's no per-project switch, because a project without shared memory wouldn't be much of a project. The only control is the overall **Memory** setting; turn that off and projects share nothing either.
:::

## Deleting a project

Deleting a project (or using **Forget** on its row in **Memory** settings) removes its instructions, its shared memory, and its knowledge choices. The **chats themselves are kept** — they just move out of the project. Knowledge collections are shared, so removing a project never deletes them.

---

## Under the hood

- **Instructions** are prepended to the system prompt of every chat in the project.
- **Knowledge:** project membership is the opt-in that grants a collection to every chat in the project, regardless of the agent's own knowledge setting.
- **Working Folder:** a project folder replaces a folder seeded from the agent's default, but never a folder the chat picked itself.
- **Memory:** each project keeps its own memory that's [distilled](memory.md) into tidy facts in the background, but recall never waits on that. See [Memory](memory.md) for how it works.

## See also

- [Memory](memory.md) — how shared memory is recalled and stored
- [Knowledge](knowledge.md) — creating and granting collections
- [Chat](chat.md) — the chat window projects live in

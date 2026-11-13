---
title: Projects
sidebar_label: Projects
description: Group related chats into a project so they share the same instructions, documents, memory, and Working Folder, no matter which agent you use. Set them up in Settings → Context → Projects. Everything stays on your Mac.
---

# Projects

A **[project](/glossary#project)** groups related chats around one topic, like a launch, a trip, a codebase, or a client, so they share the same background instead of scattering across dozens of unrelated conversations. Think of [agents](/glossary#agent) as *who* you talk to, and a project as *what* you're working on.

For example, make a "Kitchen Remodel" project. Tell it your budget and the contractor's name once, add a folder of quotes, and every chat about the remodel already knows them, whether you ask your research agent about tiles or your planning agent about dates.

Every chat in a project automatically gets three things, shared across **any** agent you use in that project:

- **Instructions**: standing guidance added to every chat ("always call the product Nimbus, keep it concise").
- **Knowledge**: [Knowledge](/glossary#knowledge) collections (folders of your documents) every chat can search, on top of whatever the agent already has.
- **Memory**: what the chats learn goes into one shared pool of [memory](/glossary#memory), so a fact you mention in one chat is remembered in another.

A project can also have a [Working Folder](/glossary#working-folder) (a folder on your Mac the agent may work in) that its new chats open in.

Everything stays on your Mac. Nothing about a project leaves it unless a [cloud model](/glossary#cloud-model) you chose reads it during a chat.

You may not need a project at all. An agent already has its own instructions, knowledge, memory, and folder. Projects help when several agents work on the same thing.

## Get started

1. Open **Settings → Context → Projects** (the gear at the bottom of the narrow strip on the left edge of the window, or press `⌘ ,`).
2. Click **New Project**.
3. Type a **Name**, and optionally choose a **Default Agent** (the agent new chats in the project start with). Click **Create**.
4. On the project's page, add **Instructions**, choose **Knowledge** collections, and (optionally) pick a **Working Folder**.
5. Go back to your chats. The project now has its own group in the chat sidebar, below **Agents**. Click its **+** to start a chat inside it.
6. Chat with any agent. The instructions and knowledge apply on their own, and everything the chats learn builds up in the project's shared memory.

To bring in chats you already have, open a chat's **⋯** menu (in the sidebar, or right-click its tab) and choose **Move to Project**. A chat that's already in a project offers **Change Project** and **Remove from Project** instead.

## Projects in the chat sidebar

Each project is a group in the chat sidebar, below **Agents**, listing its chats:

- Click the project's name to fold its chats open or closed.
- Click **+** to start a **New Chat** in the project, with its Default Agent (or the window's agent when none is set).
- Hover and click the gear (**Project settings**) to open the project's page in Settings.

## The project's page

**Settings → Context → Projects** is the one place to create, change, and delete projects. Click a project to open its page:

### General

The project's **Name** and **Default Agent**. The Default Agent is a suggestion, not a rule. You can switch agents inside a project chat, and the chat stays in the project.

### Instructions

Free-form guidance added after the agent's own instructions in every chat in the project. Use it for things you'd otherwise repeat in each conversation: tone, names, rules, what to watch out for. Changes save automatically as you type.

### Knowledge

Choose [Knowledge](/knowledge) collections for the project, and every chat in it can search them, **even with agents that don't have Knowledge turned on themselves**. Being in the project is enough. **New Collection** opens Knowledge to make a new collection, and adds it to the project.

### Working Folder

**Choose…** picks a folder on your Mac that new chats in the project open in, so every agent works in the same place. It takes the place of the agent's own remembered [Working Folder](/agents). A folder you pick inside a chat still wins. Because a chat uses either a folder or the [Sandbox](/glossary#sandbox) (a sealed-off area for running code), the chat's agent has its Sandbox turned off. Use **Change…** to pick another folder, or the **×** to clear it.

### Shared Memory

What chats in this project have learned, shared across every agent. **Open in Memory** shows it in **Settings → Memory → Agents & Projects**. See [below](#shared-memory-across-agents).

## Shared memory across agents

This is what makes a project more than a folder. Chats in a project share one pool of memory, so:

- A fact you mention in one chat is remembered in **another chat in the same project**, even one with a **different agent**.
- It's **instant**: say something, open a new project chat, and it already knows. You don't wait for anything to process.
- It works even for agents with their **own memory turned off**. They add to and read the project's shared memory, but still keep no personal memory of their own.

:::note[The one switch that controls it]
Project memory is always on. There's no per-project switch, because a project without shared memory wouldn't be much of a project. The only control is the overall **Memory** setting; turn that off and projects share nothing either.
:::

To clear what a project has learned without deleting it, use the trash button on its row in **Settings → Memory → Agents & Projects**.

## Deleting a project

On the project's page, under **Danger Zone**, click **Delete** next to **Delete Project** (it's also in the page's **⋯** menu). This removes the project's instructions, knowledge choices, and shared memory. The **chats themselves are kept**; they just move out of the project. Knowledge collections are shared, so deleting a project never deletes them.

---

## Under the hood

- **Instructions** are added after the agent's own system prompt in every chat in the project.
- **Knowledge:** project membership is the opt-in that grants a collection to every chat in the project, regardless of the agent's own knowledge setting.
- **Working Folder:** a project folder replaces a folder seeded from the agent's default, but never a folder the chat picked itself.
- **Memory:** each project keeps its own memory that's [distilled](/memory) into tidy facts in the background, but recall never waits on that.
- **Configuration:** projects aren't part of the declarative configuration; the Configurator (`osaurus_config`) can't create or change them.

## See also

- [Memory](/memory): how shared memory is recalled and stored
- [Knowledge](/knowledge): creating and granting collections
- [Chat](/chat): the chat window projects live in
- [Agents](/agents): each agent's own instructions, knowledge, and folder

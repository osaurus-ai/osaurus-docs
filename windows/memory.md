---
title: Memory on Windows
sidebar_label: Memory
description: What agents remember between conversations in Osaurus for Windows, where every memory comes from, how projects keep their own memory, and how to add, edit, forget, and permanently delete memories.
---

# Memory on Windows

Agents remember what you tell them between conversations: who you are, what you prefer, what you're working on. Every memory traces back to something you typed; replies, web pages, and tool results never become memories. It works as [Memory](/memory) describes on the Mac, with the differences below.

Memory is on for every agent. There's nothing to set up, but Osaurus needs a model to read your conversations and write memories (see [Which model writes memories](#which-model-writes-memories)).

Memory is what agents learn from talking to you. To give agents your own documents to search instead, see [Knowledge](/windows/knowledge).

## See what an agent remembers

Open **Settings → Agents → Memory** and choose the agent at the top. Memory is kept per agent.

- **About me**: lines you write yourself, which the agents you choose can read.
- **Identity**, **Preferences**, **Projects**, **Events**, **Facts**: what the agent learned, grouped by kind. **Inferred** marks one the agent worked out rather than something you said outright.
- **Earlier conversations**: summaries of past chats, recalled when a new one is on the same subject.
- **Forgotten**: memories you deleted, kept so they aren't learned again.

Click the arrow on a memory to see where it came from: **IN YOUR WORDS** shows exactly what you typed, and **HISTORY** shows its earlier wording. **Ctrl+F** searches.

At the top, a line says how many messages are waiting to be read. They're read on their own when the app is idle; **Read now** reads them straight away.

In a chat, **Recalled N memories** above a reply shows exactly what the agent was reminded of. When an agent saves something you asked it to remember, the chat shows it, with **Undo**.

## Add, edit, and forget

- **Add a memory** (Ctrl+N) adds one. Leave **Kind** on automatic, or pick one. Tick **Sensitive** to keep it to this agent only.
- To add a line to **About me**, click **+** on its header. An agent reads About me only when its **Use your About me** setting is on (it's off by default).
- Hover a memory and choose **Edit** (F2). The earlier wording is kept in its history.
- **Delete** a memory to forget it. With **Don't let *agent* learn this again** ticked (the default), it moves to **Forgotten** so it isn't learned again. Untick it to delete it without a trace. **Also delete the message it came from** removes the message too.
- To delete forgotten memories for good, use **Delete all** on the **Forgotten** header, or **Delete permanently** on one. Once deleted for good, the agent can learn them again if they come up.

Forgetting an earlier conversation's summary doesn't delete the conversation.

The **…** menu has **Read waiting messages now**, **Tidy up now** (merge and clean up, which otherwise happens once a day), and **Delete all forgotten permanently…**.

## Turn memory off for an agent

Open the agent's **Abilities** tab and the **Memory** card. Set **Memory** to **Off**: it learns and recalls nothing, and nothing already stored is deleted. **Always on** keeps it on for this agent. The page says so when memory is off for the agent you're looking at.

**Let it search memory** lets a model on your PC look things up in memory by itself. Cloud models always can; small local models tend to over-search, so it's off by default and they're reminded of relevant memories instead.

## Memory in a project

A [project](/windows/projects) keeps its own memory. What you say in a project's chats is remembered there, by every agent you use in it, and never recalled in a chat outside the project.

- The project's **Memory** page lists what it remembers, with **Edit** and **Forget**. **Remember everywhere** copies one fact into an agent's general memory.
- **Use my general memory here too** (on by default) lets the project's chats also recall what you've told your agents outside any project. Turn it off to make the project a clean room.
- In a project that keeps to local models, only a model on this PC writes its memories. If none is loaded, they wait until one is.

## Which model writes memories

Osaurus picks the model that reads your conversations and writes memories, in this order:

1. The agent's own cloud provider, if it has a key.
2. Another cloud provider you've turned on, in the order on **Settings → Models → Providers**.
3. The local model you chat with, if it's already loaded.

So once you've added a cloud provider with a key, it also reads the chats you have with a local model, except in a project that keeps to local models. Osaurus Cloud and Claude Code are never used for memory, so it never spends credits or your subscription without you asking. If none of these is available, messages wait ("N messages not read yet") until one is.

## Different from the Mac

- No Core Model setting: the model is chosen as above.
- **About me** replaces identity overrides, and agents read it only if you allow them.
- Deleted memories can be kept under **Forgotten** so they aren't learned again.
- There's no switch in the app to turn memory off for every agent, and no single "erase all memory" button. Turn memory off per agent (**Follow the global setting** leaves it on), and delete memories one at a time, or delete them and then the Forgotten list.
- A reply is reminded of up to about 400 tokens of memory.

---

## Under the hood

- Each reply is reminded of at most 3 memories and 1 earlier conversation, about 400 tokens. Candidates come from a word search, then are ranked; only those that score well enough go in. If this takes longer than a quarter of a second, the reply goes ahead without it.
- A conversation is read about a minute after it goes quiet, at low priority, and only when you're not mid-reply. Tidying runs every 24 hours.
- Memories are never changed in place: an edit writes a new version and keeps the old one in its history. Forgetting also removes summaries built from it.
- Agents save what you ask them to remember with `memory_remember`, and forget with `memory_forget`; `memory_search` is the tool **Let it search memory** controls. The Orchestrator has all three.
- Memory lives in Osaurus's encrypted database in `%LOCALAPPDATA%\osaurus`.

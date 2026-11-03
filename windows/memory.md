---
title: Memory on Windows
sidebar_label: Memory
description: What agents remember between conversations in Osaurus for Windows, where every memory comes from, and how to add, edit, forget, and permanently delete memories.
---

# Memory on Windows

Agents remember what you tell them between conversations: who you are, what you prefer, what you're working on. Every memory traces back to something you typed; replies, web pages, and tool results never become memories. It works as [Memory](/memory) describes on the Mac, with the differences below.

Memory is on for every agent. There's nothing to set up, but Osaurus needs a model to read your conversations and write memories (see [Which model writes memories](#which-model-writes-memories)).

## See what an agent remembers

Open **Settings → Memory** and choose the agent at the top. Memory is kept per agent.

- **About me**: lines you write yourself, which the agents you choose can read.
- **Identity**, **Preferences**, **Projects**, **Events**, **Facts**: what the agent learned, grouped by kind. **Inferred** marks one the agent worked out rather than something you said outright.
- **Earlier conversations**: summaries of past chats, recalled when a new one is on the same subject.
- **Forgotten**: memories you deleted, kept so they aren't learned again.

Click the arrow on a memory to see where it came from: **IN YOUR WORDS** shows exactly what you typed, and **HISTORY** shows its earlier wording. **Ctrl+F** searches.

In a chat, **Recalled N memories** above a reply shows exactly what the agent was reminded of. When an agent saves something you asked it to remember, the chat shows it, with **Undo**.

## Add, edit, and forget

- **Add a memory** (Ctrl+N) adds one. Leave **Kind** on automatic, or pick one. Tick **Sensitive** to keep it to this agent only.
- To add a line to **About me**, click **+** on its header. An agent reads About me only when its **Use your About me** setting is on (it's off by default); the switch is also on the About me header.
- Hover a memory and choose **Edit** (F2). The earlier wording is kept in its history.
- **Delete** a memory to forget it. With **Don't let *agent* learn this again** ticked (the default), it moves to **Forgotten** so it isn't learned again. Untick it to delete it without a trace. **Also delete the message it came from** removes the message too.
- To delete forgotten memories for good, use **Delete all** on the **Forgotten** header, or **Delete permanently** on one.

Forgetting an earlier conversation's summary doesn't delete the conversation.

The **…** menu has **Read waiting messages now** (learn from recent chats right away) and **Tidy up now** (merge and clean up, which otherwise happens once a day).

## Turn memory off for an agent

Open the agent's **Abilities** tab and the **Memory** card. Set **Memory** to **Off**: it learns and recalls nothing, and nothing already stored is deleted. **Always on** keeps it on for this agent.

**Let it search memory** lets a model on your PC look things up in memory by itself. Cloud models always can; small local models tend to over-search, so it's off by default and they're reminded of relevant memories instead.

## Which model writes memories

Osaurus picks the model that reads your conversations and writes memories, in this order:

1. The agent's own cloud provider, if it has a key.
2. Another cloud provider you've turned on, in the order on **Settings → Providers**.
3. The local model you chat with, if it's already loaded.

Osaurus Cloud and Claude Code are never used for memory, so it never spends credits or your subscription without you asking. If none of these is available, messages wait ("N messages not read yet") until one is.

## Different from the Mac

- No Core Model setting: the model is chosen as above.
- **About me** replaces identity overrides, and agents read it only if you allow them.
- Deleted memories can be kept under **Forgotten** so they aren't learned again.
- There's no single "erase all memory" button; delete memories one at a time, or delete them and then the Forgotten list.
- A reply is reminded of up to about 400 tokens of memory.

---

## Under the hood

- Each reply is reminded of at most 3 memories and 1 earlier conversation, about 400 tokens, chosen by a full-text search. If the search takes too long, the reply goes ahead without it.
- A conversation is read about a minute after it goes quiet, at low priority, and only when you're not mid-reply. Tidying runs every 24 hours.
- Memories are never changed in place: an edit writes a new version and keeps the old one in its history. Forgetting also removes summaries built from it.
- Memory lives in Osaurus's encrypted database in `%LOCALAPPDATA%\osaurus`.

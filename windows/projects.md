---
title: Projects on Windows
sidebar_label: Projects
description: Keep a job's chats, files and memory together in a project in Osaurus for Windows, choose where its data may go, see a record of what ran where, and erase a project with a receipt.
---

# Projects on Windows

A project keeps one job together: a client, a case, a codebase, a topic. It holds chats with any of your agents, and every chat in it shares the project's instructions, files, and memory. Each project also has a rule for where its data may go: any model, only models on this PC, or fully offline.

Think of [agents](/windows/agents) as *who* you talk to, and a project as *what* you're working on. You don't need a project to chat; use one when a job deserves its own space, or when its data must stay on this PC.

A project lives on this PC: chats in a project don't [sync](/windows/devices) to your other devices. Projects are different from [Workspaces](/windows/workspaces) (**Settings → Devices → Workspaces**), which share agents with your team.

## Get started

1. In the sidebar, click **Projects** to open the Projects page. Until you have a project, it offers a starting point, each with a sensible rule you can change later:
   - **A client or matter**: kept apart from every other client, with **Local models only**.
   - **A codebase**: asks for its folder, so its chats start there.
   - **A topic**: sources, notes, and drafts on one question, with **Any model**.
   - **Blank project**.

   Once you have projects, click **New project** on the page, or the **+** next to **Projects** in the sidebar.
2. Give it a **Name**. You can rename it any time.
3. Under **Where can its data go?**, pick a rule (see [below](#where-its-data-can-go)).
4. Click **Create project**. The project's Home opens; add instructions, files, and a folder when you need them.

You can also make a project from a chat: right-click the chat in the sidebar, choose **Move to project**, then **New project from this chat…**. Or ask Osaurus in a chat to make one.

## The project's pages

Click a project in the sidebar to open it. Its pages are **Home**, **Files**, **Memory**, **Record**, and **Settings**.

### Home

Home is where you start a new chat in the project. Type in the message box; the agent and model under it are who new chats start with, and you can change them for this chat.

Beside it, **Every chat here gets** shows what the project gives each chat: its **Instructions**, **Files**, **Memory**, **Folder**, and **Record**. **Write instructions** (or **Edit**) sets the project's instructions, such as who the client is and what tone to write in. A change applies from each chat's next message.

Under **Chats** are the project's chats. **Bring chats in** finds chats you've already had that look like they belong here, searched on this PC in chat titles and your own messages, and lets you review them before moving them in.

The **…** menu by the project's name has **Rename**, **Export record**, and **Delete…**.

### Files

Every chat in the project can read these.

- **Add files** copies files into the project, encrypted. You can also drop files or folders on the page.
- **Link a folder** reads a folder where it is and keeps it current.
- **Folders from Knowledge** lists the folders you've added in **Settings → Agents → Knowledge**. Turn one on to let this project search it. See [Knowledge](/windows/knowledge).

The **How chats read it** column says whether a file is read in full or searched: **In full · automatic**, **In full · pinned**, or **Search only**.

### Memory

What's said in the project's chats is remembered here, by every agent you use in it, and never recalled in a chat outside it. Each fact comes from your own words, never a reply. You can **Edit** or **Forget** a fact, and **Remember everywhere** copies one into an agent's general memory. **Use my general memory here too** lets the project's chats also recall what you've told your agents elsewhere; turn it off to make the project a clean room. See [Memory](/windows/memory#memory-in-a-project).

### Record

A month-by-month account of where the project's work ran: how many replies, how many cloud model calls, what reached the internet, how many files changed, and what was spent. It keeps where each step ran, never message text. **Export for an auditor** saves the month as JSON and CSV, with no message text. Replies, model calls and spending are counted from the last 400 days; the rest of the record stays until you delete the project.

Commands an agent runs can use the network on their own; the record doesn't count those.

### Settings

**Name**, **Icon and colour**, **New chats start with** (an agent; you can still pick another for a chat), **Folder** (new chats start in it), **Where its data can go**, **Memory**, and **When the matter ends** ([Archive or Delete](#when-the-matter-ends)). Changes show a save bar; **Ctrl+S** saves.

## Where its data can go

Each project has one of three rules:

| Rule | What it means |
|---|---|
| **Any model** | Cloud models can answer and see its chats as written. With the [privacy filter](/windows/privacy-filter) on, this reads **Any model, filtered**: names, numbers, and addresses are swapped out before anything is sent, and put back in the reply. |
| **Local models only** | No cloud model ever sees the project. An agent's tools, such as web search, can still reach the internet, and the project's Record lists each time one does. |
| **Offline** | Local models, and no tool that reaches the internet. Nothing in the project leaves this PC. |

A chat outside any project counts as **Any model**.

This is the one choice that can't be taken back: what a cloud model has seen, it has seen. You can tighten a rule whenever you like, and it takes effect from each chat's next message. Loosening it asks you first. Moving a chat into a project with a looser rule asks first too.

In a project that keeps to local models, Osaurus uses a model on this PC even if the agent normally uses a cloud one. If the agent is locked to a cloud model, runs on another computer, or no local model is downloaded, the chat says so ("Nothing was sent") and offers to change the model or **Move this chat out**. Nothing is sent before that check. In an **Offline** project, tools that could reach the internet aren't offered at all: the browser, web search, MCP servers, workflows, and channels.

## Move chats in and out

Right-click a chat in the sidebar and choose **Move to project**, then a project. **Remove from project** takes it out. A chat brought in keeps the folder it had.

## When the matter ends

**Archive** takes the project out of the sidebar and pauses its automations. Its chats stay searchable but read-only, and **Restore** brings it back.

**Delete…** asks what should happen to its chats:

- **Keep its chats**: they go back to their agents in the sidebar and follow your general rules. The project's instructions, files, and memory are deleted.
- **Erase everything**: also erases the chats, their file history, and everything Osaurus remembered in the project. Type the project's name to confirm. Tick **Save the record first** to save the record as JSON and CSV to a folder you choose, with the receipt added.

### The receipt

After an erase, Osaurus shows a receipt of what went: chats, file history, memory, files you added, privacy maps, and the record. It also says what was kept:

- **Spending** totals stay with your account, no longer linked to the project's chats.
- **Your folders** are untouched. A folder the project read was read where it is, and Osaurus never deletes your own files.
- **Sandbox homes**: what an agent wrote in its own [sandbox](/windows/sandbox) stays there, because the home belongs to the agent and is shared by all its chats.

**Save another copy** saves the receipt as text. Once you leave the page, nothing about the project remains in Osaurus, the receipt included.

## Different from the Mac

- Projects have their own section in the sidebar and their own pages (Home, Files, Memory, Record, Settings), not a page in Settings.
- Each project has a data rule (**Any model**, **Local models only**, **Offline**) and a monthly Record.
- Deleting can keep the chats or erase everything, with a receipt.
- Shared document folders come from **Settings → Agents → Knowledge** and are turned on per project. See [Knowledge](/windows/knowledge).

---

## Under the hood

- A project's settings can be changed from a chat: the Configurator applies a `projects:` entry with `osaurus_config`, matched by name, with the keys `instructions`, `default_agent`, `folder`, `locality` (`any`, `local_models`, `offline`), `memory_inflow`, `knowledge_mode`, and `collections`. Changes appear in [History](/windows/agents#history).
- The data rule is enforced on the server for every model call made for the project, including delegated work, workflow steps, the memory writer, and an agent's sandbox, before any request leaves this PC. A project that can't be read is treated as local-only.
- In an **Offline** project, an agent's roster is an allow-list of built-in tools known to stay on this PC; a shell command stays only where its network is provably none.
- Files you add are stored encrypted (AES-GCM, in an object store of their own); a linked folder is read where it is.

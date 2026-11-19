---
title: Knowledge on Windows
sidebar_label: Knowledge
description: Share a folder of your own documents with your projects in Osaurus for Windows, so every chat in them can search it. Osaurus reads the folder where it is and keeps up as it changes.
---

# Knowledge on Windows

Knowledge is a folder of your own documents (precedents, policies, notes, price lists) that your [projects](/windows/projects) can search. Add the folder once in Settings, then turn it on in each project that needs it. Every chat in those projects can then look things up in it instead of guessing.

Osaurus reads the folder where it is: nothing is copied, nothing in it is ever changed, and it keeps up as files change. You need a project to use it; on Windows, Knowledge is searched by projects, not by individual agents.

It works much like [Knowledge](/knowledge) on the Mac, with the differences below.

## Get started

1. Open **Settings → Agents → Knowledge** and click **Add folder**.
2. Click **Choose…** and pick the folder. Give it a **Name** and, if you like, a **Summary** of what it holds. Click **Add**.
3. Osaurus reads the folder. The row shows its progress, then **Ready** and how many documents it holds.
4. Open a project, go to its **Files** page, and under **Folders from Knowledge** turn the folder on.

Ask something in one of the project's chats that the folder answers. The agent searches it and reads what it needs.

## Keep it current

- Osaurus notices when files in the folder change. To read it again straight away, choose **Reindex** in the row's **…** menu.
- Click a row's details to see its folder, its summary, which projects use it, and any files that **Couldn't be read** (for example a password-protected file, or a scan with no text in it).
- **Open folder** opens it in File Explorer.
- **Remove** deletes Osaurus's index of it. The folder and its files stay where they are. Projects that used it stop searching it from their next message.

A row says **Searched by words** or **Searched by words and meaning**. Searching by meaning uses a small search model that runs on this PC. Osaurus downloads it the first time you add a folder or search, then keeps it; until it has read the folder, Osaurus searches by words alone.

## What it can read

Text and Markdown files, code, CSV, Word, Excel, PowerPoint, PDF, and RTF documents. A scanned PDF with no text layer can't be read.

## Who sees it

Reading and searching happen on this PC. When an agent reads a passage to answer you, that passage goes to the model that's answering. In a project that lets cloud models answer, that means the cloud model sees it. Under **Local models only**, no cloud model sees it, though an agent's tools can still reach the internet. Under **Offline**, nothing in the project leaves this PC. See [Projects](/windows/projects#where-its-data-can-go).

## Different from the Mac

- A folder is searched by the projects that turn it on, not by agents you pick.
- Files you add to a single project live on that project's **Files** page instead. See [Projects](/windows/projects).

---

## Under the hood

- Each folder has its own encrypted index, `knowledge\<id>\knowledge.db` in Osaurus's data folder under `%LOCALAPPDATA%\osaurus`. A search combines a word search with a meaning search when one is available.
- One folder indexes up to 20,000 documents. Per-file size limits follow the file type, for example 5 MB for plain text and 100 MB for a PDF, and at most 500,000 characters of text are kept from one file.
- The agent's tools are `search_knowledge`, `read_knowledge`, and `list_knowledge`. Which folders a call can reach comes from the chat's project, never from what the model asks for.
- The meaning search uses BAAI's bge-small-en-v1.5, downloaded once from Hugging Face into `knowledge\embedder\` and checked against a pinned hash, and run on this PC with ONNX Runtime. If it can't be fetched, an embedding model you've already downloaded is used instead, if any.

---
title: Knowledge
sidebar_label: Knowledge
description: Point your agents at folders of curated reference material — guides, standards, specs, spreadsheets — and let them search and read it on demand, entirely on your Mac.
---

# Knowledge

Memory is what your AI learns from talking to you. **Knowledge** is what you hand it: folders of curated reference material — team guides, coding standards, product specs, price lists — that agents can search and read on demand. You point a collection at a folder, grant it to an agent, and the agent consults it when a question calls for it instead of guessing.

Everything is indexed and searched locally. Nothing in a collection leaves your Mac unless a cloud model you chose reads it during a chat.

## Quick start

1. Open the Management window (`⌘ ⇧ M`) → **Knowledge**
2. Click **Add Knowledge Base**, give it a name, and pick a folder of documents
3. Grant it right there — after creating a collection, a **grant-to-agents** dialog lets you check the agents that should see it (you can always adjust later in each agent's **Abilities → Overview**)
4. Wait for indexing to finish (it's fast, and re-runs automatically when files change)
5. Ask something the folder answers — the agent will search the collection and cite what it found

:::note[Knowledge rides on Tools]
Knowledge is delivered through tool calls, so the agent's master **Tools** switch must be on. If Tools is off, the Knowledge card shows an *"Inactive while Tools is off"* note and the toggle won't engage until you enable Tools.
:::

## What you can put in a collection

Collections crawl the folder recursively, including subfolders. Supported formats:

| Category | Formats |
|---|---|
| Markdown | `.md`, `.markdown`, `.mdx` — with frontmatter and heading-aware chunking |
| Plain text & code | `.txt` and ~60 code/text extensions (Swift, Python, JSON, YAML, …) |
| Documents | PDF, Word (`.docx`), PowerPoint (`.pptx`) |
| Data | Excel (`.xlsx`), CSV/TSV |

Binary documents are indexed by their extracted text, and `read_knowledge` returns that extracted text to the agent — so a PDF or spreadsheet is as searchable as a markdown file.

Deliberately **excluded**:

- **`.env` files** — secrets don't belong in a searchable index, even though they're plain text
- **Hidden files and symlinks**
- **Images** — no text to extract; OCR/vision indexing is a possible future feature
- **Oversized files** — markdown over 2 MB and other formats over 10 MB are skipped

### Categories: frontmatter or folders

Markdown files can carry YAML frontmatter, and the `type` field is used as the document's category:

```markdown
---
type: guide
---

# Onboarding checklist
...
```

Documents without an explicit `type` get an **inferred category from their folder**: if you've organized a collection into subfolders ("Medical Records/", "recipes/"), that structure already categorizes the documents, and Osaurus reuses it (slugified, e.g. `medical-records`). Inference is metadata-only — files on disk are never modified, and an explicit frontmatter `type` always wins. The collection card shows a neutral hint (not a warning) for documents that ended up uncategorized.

## How search works

Each collection is chunked and indexed two ways: a full-text (BM25) index and a local vector index, combined into hybrid search. If the embedding model isn't available, search falls back to full-text matching — you never lose retrieval entirely.

A **folder watcher** keeps the index live: edit, add, or delete a file in the folder and the collection re-indexes without an app restart. Indexes are derived artifacts stored under `~/.osaurus/knowledge/` — deleting them only costs a rebuild, never your documents.

## Granting collections to agents

Grants are per-agent and explicit, and there are two places to manage them:

- **From the Knowledge tab** — a grant-to-agents dialog appears right after you create a collection, and each collection card shows the agents with access as **stacked avatars**. Click a card to open its detail sheet, which also carries the collection's folder path, categories, and a **Delete** action.
- **From the agent** — in the agent's **Abilities → Overview**: **Knowledge** turns on the retrieval tools and lists your collections as a checklist right under the toggle; **Curator** appears once Knowledge is on and lets the agent file staleness tickets and propose document updates (see below).

An agent can only ever search and read collections it's been granted — the grant is enforced when tools execute, not just hidden from the schema. Deleting a collection removes its index and grants; the source folder on disk is never touched.

You can also grant a collection to a whole **[project](projects.md)**, in which case every chat in that project can search it — regardless of the chatting agent's own knowledge settings.

The Abilities context estimate includes the cost of the knowledge tools and grant manifest, so you can see what enabling it adds to the agent's startup context.

## The agent's tools

With Knowledge on, the agent gets:

| Tool | What it does |
|---|---|
| `list_knowledge` | List granted collections and their documents |
| `search_knowledge` | Hybrid search across granted collections |
| `read_knowledge` | Read a document in full (extracted text for binary formats) |

With **Curator** also on:

| Tool | What it does |
|---|---|
| `flag_knowledge_stale` | File a ticket that a document looks outdated |
| `propose_knowledge_update` | Draft a revised version of a markdown document |
| `list_knowledge_tickets` / `update_knowledge_ticket` | Track and resolve open tickets |

## Curation: agents propose, you approve

Agents never edit your documents directly. Curation is a review loop:

1. The agent notices something outdated and files a **ticket**, or drafts a **proposal** with the revised content and a rationale
2. Pending proposals and open tickets appear at the top of the **Knowledge** tab
3. You review the diff, optionally edit it, then **Approve** (writes the file) or **Dismiss**

Proposals can only target markdown files (`.md`, `.markdown`, `.mdx`) — the app refuses to write text over a PDF or spreadsheet. A stale-flag on a binary document resolves to a ticket for a human to update the source file.

## Knowledge vs. Memory vs. Skills

| | What it is | Who writes it |
|---|---|---|
| [Memory](/memory) | What the AI learned from your conversations | The AI, automatically |
| **Knowledge** | Reference documents you curate in folders | You (agents can propose edits) |
| [Skills](/skills) | Reusable methodology and expertise packages | You or the community |

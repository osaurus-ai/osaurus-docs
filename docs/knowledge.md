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

Binary documents are indexed by their extracted text, and `read_knowledge` returns that extracted text to the agent — so a PDF or spreadsheet is as searchable as a markdown file. For Markdown, non-reserved frontmatter is returned with the document so agents can use your own metadata rather than losing it during retrieval.

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
- **From the agent** — in the agent's **Abilities → Overview**: **Knowledge** turns on the knowledge tools and lists your collections as a checklist right under the toggle. Write access follows the collection grant; there is no separate curator role.

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
| `flag_knowledge_stale` | File a ticket that a document looks outdated |
| `write_knowledge` | Create a document or replace one in full |
| `edit_knowledge` | Apply a targeted, unambiguous find-and-replace edit |
| `delete_knowledge` | Delete a document |
| `list_knowledge_tickets` / `update_knowledge_ticket` | Track and resolve open tickets |

## Curation: approve each change

Knowledge writes use the same consent model as other consequential tools:

1. The agent calls `write_knowledge`, `edit_knowledge`, or `delete_knowledge`.
2. Osaurus validates the operation before asking. Paths must stay inside the granted collection; ambiguous targeted edits are refused.
3. An approval sheet shows create, replace, edit, or delete badges and a concrete diff or occurrence count.
4. Approving applies the change immediately. Denying leaves the source folder untouched.

The write tools are unavailable to external HTTP agent runs and MCP callers because their security boundary is the interactive in-app approval sheet. Existing pending proposals from older releases remain visible temporarily so they are not stranded, but agents no longer create new proposals.

Mutations target Markdown documents only. `write_knowledge` and `delete_knowledge` accept batches of up to 200 unique paths; a write batch is best-effort per document rather than atomic across the collection. `edit_knowledge` applies up to 50 ordered substitutions to one document after validating every match.

### History and safe revert

Every approved write is recorded separately from the rebuildable search index in `write_log.sqlite`. Open **Knowledge → History** to filter writes by collection and revert a whole run or one document.

Revert is conflict-safe: if a document changed after the agent wrote it, Osaurus refuses to overwrite the newer manual edit. Targeted edits also preserve frontmatter that the model did not need to round-trip.

## Knowledge vs. Memory vs. Skills

| | What it is | Who writes it |
|---|---|---|
| [Memory](/memory) | What the AI learned from your conversations | The AI, automatically |
| **Knowledge** | Reference documents you curate in folders | You, or an agent after per-call approval |
| [Skills](/skills) | Reusable methodology and expertise packages | You or the community |

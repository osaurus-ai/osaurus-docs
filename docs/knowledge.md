---
title: Knowledge
sidebar_label: Knowledge
description: Point your agents at folders of your own documents — guides, notes, specs, spreadsheets — so they can look things up instead of guessing. Everything is searched on your Mac.
---

# Knowledge

[Memory](/glossary#memory) is what your AI learns from talking to you. **Knowledge** is what you hand it: folders of your own documents — team guides, recipes, product specs, price lists — that your [agents](/glossary#agent) can search and read when a question calls for it, instead of guessing.

You pick a folder, Osaurus makes it searchable, and you choose which agents can use it. Everything is searched on your Mac. Your documents only leave it if you're using a [cloud model](/glossary#cloud-model) and the agent reads them during a chat.

## Get started

1. Open **Settings…** (`⌘ ,`) → **Knowledge**.
2. Click **Add Collection**, give it a name, and pick a folder of documents.
3. A window asks which agents should be able to use it. Check the ones you want. (You can change this later in each agent's **Abilities → Overview**.)
4. Wait for Osaurus to finish reading the folder. It's quick, and it updates automatically when files change.
5. Ask the agent something the folder answers. It searches the collection and tells you what it found.

:::note[Knowledge needs Tools turned on]
Agents look things up using [tools](/glossary#tool), so the agent's main **Tools** switch must be on. If it's off, the Knowledge card says *"Inactive while Tools is off"*, and Knowledge won't turn on until you turn Tools on.
:::

## What you can put in a collection

A collection includes everything in the folder, including subfolders. Osaurus can read:

| Kind | Examples |
|---|---|
| Notes | Markdown files (`.md`) |
| Plain text and code | Text files and around 60 kinds of code and data files |
| Documents | PDF, Word, PowerPoint |
| Spreadsheets | Excel, CSV |

Osaurus pulls the text out of PDFs, Word files, and spreadsheets, so they're just as searchable as a plain note.

Some things are skipped on purpose:

- **`.env` files** — these usually hold passwords, which don't belong in a searchable index.
- **Hidden files and symbolic links** (a kind of file shortcut)
- **Pictures** — there's no text to read in them yet.
- **Very large files** — Markdown files over 2 MB and other files over 10 MB.
- **Code project clutter** — folders like `node_modules`, `build`, and `.venv` that tools create automatically.

### How big can a collection be?

A collection can hold up to **5,000 files**. Past that, the extra files aren't searchable. This keeps Osaurus from getting stuck if you accidentally pick a huge folder, like your whole home folder. For a really big archive, split it into a few smaller collections.

### Organizing with subfolders

If you've already sorted your documents into subfolders — like "Medical Records" and "Recipes" — Osaurus uses those folder names as categories. Your files are never changed. Documents that end up without a category get a gentle hint on the collection card (not a warning).

## Choosing which agents can see a collection

Each agent only sees the collections you give it. There are two places to manage this:

- **In Knowledge** — right after you create a collection, a window lets you pick agents. Each collection card shows the agents that can use it as small stacked pictures. Click a card to see its folder, categories, and a **Delete** button.
- **In the agent** — open the agent's **Abilities → Overview** and turn on **Knowledge**. Your collections appear as a checklist right below the switch.

Agents can only ever search and read collections you've given them. Deleting a collection removes Osaurus's search index and the agents' access, but **never touches the folder or your files**.

You can also give a collection to a whole [project](/glossary#project). Then every chat in that project can search it, whichever agent you're chatting with.

Turning on Knowledge adds a little to what the agent has to read at the start of each chat. The agent's Abilities screen shows an estimate, so you can see the cost.

## When the agent wants to change a document

An agent with access can also suggest edits to your Markdown notes — fixing an outdated step, adding a new section, or deleting a page. It always asks first:

1. The agent proposes a change.
2. Osaurus checks it first. Changes must stay inside the collection's folder, and unclear edits are refused.
3. An [approval](/glossary#approval) card shows exactly what will change: a new file, a replacement, an edit, or a deletion, with the changed lines.
4. **Allow** applies the change right away. **Deny** leaves your folder untouched.

Agents can also flag a document that looks out of date, so you can review it later.

### Undoing changes

Every approved change is recorded. Open **Knowledge → History** to see changes by collection and undo a whole run or a single document.

Undo is safe: if you've edited the document yourself since the agent changed it, Osaurus won't overwrite your newer edit.

## Clickable document links in chat

When an agent mentions one of your documents in its reply, the file name becomes a link. Click it to open the file in its usual app, or right-click for **Open**, **Open With**, **Show in Finder**, and **Copy Path**. If the file has since moved or been deleted, a message tells you.

## Knowledge vs. Memory vs. Skills

| | What it is | Who writes it |
|---|---|---|
| [Memory](/memory) | What the AI learned from your conversations | The AI, automatically |
| **Knowledge** | Documents you keep in folders | You, or an agent after you approve each change |
| [Skills](/skills) | Ready-made playbooks for kinds of tasks | You or the community |

## Troubleshooting

- **The agent doesn't use the collection.** Check that the agent's **Tools** switch is on, **Knowledge** is on in its **Abilities → Overview**, and the collection is checked.
- **A file isn't found.** Check it isn't in the skipped list above, and that the collection hasn't hit the 5,000-file limit.
- **The agent can't edit a document.** Agents can only change Markdown notes, and only in an in-app chat where you can approve the change.

---

## Under the hood

### Supported formats in detail

| Category | Formats |
|---|---|
| Markdown | `.md`, `.markdown`, `.mdx` — with frontmatter and heading-aware chunking |
| Plain text & code | `.txt` and ~60 code/text extensions (Swift, Python, JSON, YAML, …) |
| Documents | PDF, Word (`.docx`), PowerPoint (`.pptx`) |
| Data | Excel (`.xlsx`), CSV/TSV |

Binary documents are indexed by their extracted text, and `read_knowledge` returns that text to the agent. Symlinks are skipped. For Markdown, non-reserved frontmatter is returned with the document, so agents can use your own metadata.

Skipped directory names (matched at any depth): `node_modules`, `dist`, `build`, `.build`, `out`, `target`, `vendor`, `Pods`, `Carthage`, `.next`, `.nuxt`, `.svelte-kit`, `coverage`, `__pycache__`, `.venv`, `venv`, `.tox`, `.gradle`, `DerivedData`, `.terraform`.

The per-collection cap is 5,000 indexable files (`maxFilesPerCollection`). Files past the cap aren't indexed, and the overflow count is written to the log.

### Categories: frontmatter or folders

Markdown files can carry [YAML](/glossary#json-yaml) frontmatter, and the `type` field is used as the document's category:

```markdown
---
type: guide
---

# Onboarding checklist
...
```

Documents without an explicit `type` get a category inferred from their folder, slugified (for example, `Medical Records/` becomes `medical-records`). Inference is metadata-only, and an explicit frontmatter `type` always wins.

### How search works

Each collection is chunked and indexed two ways: a full-text (BM25) index and a local vector index built from [embeddings](/glossary#embedding), combined into hybrid search. If the embedding model isn't available, search falls back to full-text matching, so you never lose retrieval entirely.

A folder watcher keeps the index live: edit, add, or delete a file and the collection re-indexes without an app restart. Indexes are derived data stored under `~/.osaurus/knowledge/`; deleting them only costs a rebuild, never your documents.

### The agent's tools

With Knowledge on, the agent gets:

| Tool | What it does |
|---|---|
| `list_knowledge` | List granted collections and their documents, paged |
| `search_knowledge` | Hybrid search across granted collections |
| `read_knowledge` | Read a document in full (extracted text for binary formats) |
| `flag_knowledge_stale` | File a ticket that a document looks outdated |
| `write_knowledge` | Create a document or replace one in full |
| `edit_knowledge` | Apply a targeted, unambiguous find-and-replace edit |
| `delete_knowledge` | Delete a document |
| `list_knowledge_tickets` / `update_knowledge_ticket` | Track and resolve open tickets |

`list_knowledge` returns up to 100 documents per call by default (`limit` up to 500) and pages with `offset`. The result states the total matching count, and when a page is smaller than the total it ends with a `next_offset` hint so the agent fetches the next page instead of assuming it has seen everything. The `collection` argument is forgiving: it accepts the display name in any case, a punctuation-insensitive form (`obsidian_vault`), an unambiguous partial name, or a generic alias like `knowledge` or `all` — and the result names what was actually searched.

`search_knowledge` returns up to 5 ranked excerpts by default (`top_k` up to 25). `read_knowledge` re-reads the document from disk, so the agent always sees current content.

Grants are enforced when tools run, not just hidden from the tool list. Write access follows the collection grant; there's no separate curator role. The Abilities context estimate includes the knowledge tools and the grant manifest.

### Write rules

Knowledge writes use the same consent model as other consequential tools. The write tools aren't available to external HTTP agent runs or [MCP](/glossary#mcp) callers, because their safety boundary is the in-app approval sheet. Pending proposals from older releases stay visible for a while so they aren't stranded, but agents no longer create new proposals.

Changes target Markdown documents only. `write_knowledge` and `delete_knowledge` accept batches of up to 200 unique paths; a write batch is best-effort per document, not atomic across the collection. `edit_knowledge` applies up to 50 ordered substitutions to one document after validating every match. Targeted edits preserve frontmatter the model didn't need to round-trip.

Every approved write is recorded in `write_log.sqlite`, separately from the rebuildable search index. Revert refuses to overwrite a document that changed after the agent wrote it.

---

**Related:**

- [Memory](/memory) — what the AI learns from your chats
- [Skills](/skills) — reusable playbooks
- [Projects](/projects) — share collections across a project's chats

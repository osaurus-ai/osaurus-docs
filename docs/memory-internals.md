---
title: Memory Internals
sidebar_label: Memory Internals
description: How memory actually works under the hood — the write pipeline, the read gate, consolidation passes, settings, the HTTP API, and the search backend.
---

# Memory Internals

This is the developer-facing companion to [Memory](/memory). The user-facing page covers what memory is and how to manage it; this page covers how it's wired.

## How writes happen

Memory writes are deferred and debounced. Your chat is never blocked on an LLM call to update memory.

```
[user + assistant turn]
         │
         ▼
[buffered as a pending signal]   ◄── one SQL insert. No LLM.
         │
         ▼
   debounce 60s
         │  (or session change → flush immediately)
         ▼
[Core Model configured?]
         │ no  → signals stay pending, nothing distills
         │ yes ↓
         ▼
[ONE LLM call to your Core Model: distill the whole session]
         │
         ▼
{episode + entities + pinned candidates + identity delta}
         │
         ├──► insert Episode
         ├──► insert PinnedFact for each candidate that passes Jaccard dedup
         └──► append identity overrides for any new identity-grade facts
```

The hot path is one SQL insert plus a debounce arm. Distillation is **one LLM call per session**, not one per turn — so chitchat sessions of 10+ turns produce a single, coherent digest, and many sessions produce zero pinned facts at all.

If `coreModelIdentifier` is `nil`, [`MemoryService.distillSession`](https://github.com/osaurus-ai/osaurus/blob/main/Packages/OsaurusCore/Services/Memory/MemoryService.swift) logs and exits early — pending signals stay buffered and nothing is distilled into pinned facts or episodes.

## How reads happen

```
[incoming user message]
         │
         ▼
[Relevance Gate]
   ├── pronouns / "we discussed" / "remember when"  → episode
   ├── "what's my name" / "who am I"                 → identity
   ├── entity-name hit / explicit recall verb        → pinned
   ├── "exact words" / "verbatim"                    → transcript
   └── nothing fired                                 → none (skip memory)
         │
         ▼
[Planner: fetch the chosen section under the budget]
         │
         ▼
[Compact memory block ≤ memoryBudgetTokens (default 800)]
   + always-on Identity Overrides (tiny)
         │
         ▼
[Prepend to the latest user message]
```

The gate picks at most one section, the planner fits it under the token budget, and the block is prepended to your message just before it goes to the model. Most turns inject ~800 tokens or fewer; many inject zero.

## Consolidation

`MemoryConsolidator` runs in the background every 24 hours (configurable) and on demand from the **Run Consolidation Now** button in the Memory UI. Each pass:

| Step | What it does |
|---|---|
| **Decay** | `salience *= exp(-Δdays / 30)` for pinned facts and episodes |
| **Merge** | Collapse near-duplicate episodes (Jaccard ≥ 0.9 over summary+topics) within the same agent |
| **Promote** | Boost salience on pinned facts whose content overlaps ≥ 3 recent episodes |
| **Evict** | Delete pinned facts below `salienceFloor` and idle 30+ days |
| **Prune** | Drop episodes / transcript older than `episodeRetentionDays` (default 365) |

Consolidation never runs on the request path, so chat latency is unaffected.

## Pinned facts — fields

Each fact stores:

- `content` — the fact itself, in plain text
- `salience` — score in `[0, 1]`. Decayed weekly. Evicted below the floor (default `0.2`) once idle for 30+ days.
- `sourceCount` — number of episodes that mention it
- `useCount` / `lastUsed` — bumped every time the planner surfaces it

Episodes carry a one-to-three-sentence summary, topics, entities, decisions, action items, and a salience score; one row is created per session when distillation runs.

## Settings reference

Open **Management → Memory** for the UI, or edit `~/.osaurus/config/memory.json` directly.

| Setting | Default | Range | Description |
|---|---|---|---|
| `enabled` | `true` | — | Master toggle |
| `embeddingBackend` | `mlx` | `mlx` / `none` | Embedding backend; `none` falls back to FTS5 text matching |
| `embeddingModel` | `nomic-embed-text-v1.5` | — | Model used by VecturaKit |
| `extractionMode` | `sessionEnd` | `sessionEnd` / `manual` | When the writer runs distillation |
| `relevanceGateMode` | `heuristic` | `off` / `heuristic` / `llm` | How the read path decides whether to inject memory |
| `memoryBudgetTokens` | `800` | 100 – 4,000 | Single overall budget for the dynamic section |
| `summaryDebounceSeconds` | `60` | 10 – 3,600 | Inactivity period before distillation |
| `consolidationIntervalHours` | `24` | 1 – 168 | How often the consolidator runs |
| `salienceFloor` | `0.2` | 0.0 – 1.0 | Pinned facts below this and idle 30+ days are evicted |
| `episodeRetentionDays` | `365` | 0 – 3,650 | How long episodes / transcript are kept (0 = forever) |

That's the entire surface — eight knobs total.

## HTTP API

### Per-request memory: `X-Osaurus-Agent-Id`

Add the `X-Osaurus-Agent-Id` header to any `POST /v1/chat/completions` request. Osaurus runs the gate, picks at most one memory section, and prepends it to your message:

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://127.0.0.1:1337/v1",
    api_key="osaurus",
    default_headers={"X-Osaurus-Agent-Id": "my-agent"},
)

response = client.chat.completions.create(
    model="your-model-name",
    messages=[{"role": "user", "content": "What did we talk about last week?"}],
)
```

The header value is an arbitrary string identifying which agent's memory to use.

### Bulk ingest: `POST /memory/ingest`

Useful for seeding memory from existing chat logs or migrating from another system. Distillation flushes immediately at the end of the batch — no waiting on the debounce.

```bash
curl http://127.0.0.1:1337/memory/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "my-agent",
    "conversation_id": "session-1",
    "turns": [
      {"user": "Hi, my name is Alice", "assistant": "Hello Alice!"},
      {"user": "I work at Acme Corp", "assistant": "Got it."}
    ]
  }'
```

| Param | Type | Description |
|---|---|---|
| `agent_id` | string | Which agent owns the memory |
| `conversation_id` | string | The session identifier |
| `turns` | array | Each item has `user` and `assistant` strings |
| `session_date` | string | Optional ISO 8601 date for the whole batch |
| `skip_extraction` | bool | When `true`, only insert transcript rows; skip distillation |

### Discover agent IDs: `GET /agents`

Returns every configured agent with its pinned-fact count.

[Full HTTP API reference →](/api)

## `search_memory` tool

Agents can search their own memory mid-conversation:

| Scope | Searches |
|---|---|
| `pinned` | High-salience facts |
| `episodes` | Per-session digests |
| `transcript` | Raw conversation excerpts |

The relevance gate already picks the right slice for context injection — `search_memory` exists for the times an agent decides it needs a specific kind of recall.

## Search backend

When VecturaKit + an embedding model are available, search uses hybrid BM25 + vector matching with MMR reranking.

When VecturaKit isn't available (e.g. embedding model not downloaded yet), Osaurus falls back to FTS5 `MATCH` queries against per-table mirror tables — same Unicode-folded tokenization, no extra setup. SQL `LIKE` is the final fallback for inputs that can't be sanitized into a valid FTS query.

## Storage layout

All memory data lives in a local SQLite database with WAL mode, **encrypted at rest with SQLCipher** since 0.17.7. The encryption key lives in your macOS Keychain. [Storage → Encryption →](/storage)

| Path | Contents |
|---|---|
| `~/.osaurus/memory/memory.sqlite` | Encrypted SQLCipher database |
| `~/.osaurus/memory/vectura/{agent}/` | Per-agent vector index (rebuilt from SQLite as needed) |
| `~/.osaurus/config/memory.json` | Plaintext config |

---

**Related:**

- [Memory](/memory) — the user-facing view
- [Storage & Encryption](/storage) — how the SQLite databases are encrypted
- [HTTP API](/api) — full endpoint reference

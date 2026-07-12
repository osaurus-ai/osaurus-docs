---
title: Agent DB & Self-Scheduling
sidebar_label: Agent DB & Self-Scheduling
description: Give an agent its own private SQLite database and a single self-scheduled next run — structured memory plus the ability to wake itself up and act.
---

# Agent DB & Self-Scheduling

Any Osaurus agent can opt into two capabilities that let it remember structured data across runs and wake itself up to act on it:

- **Agent DB** — a private SQLite database the agent designs and queries through dedicated tools.
- **Self-scheduling** — a single "next run" slot the agent can set to wake itself at a chosen time.

Together they're a journal that can also set its own alarm.

:::info[This is not Memory]
[Memory](/memory) is a global system that distills *conversational* context across all your chats automatically. Agent DB is **per-agent, structured storage** the agent explicitly schemas and queries. They're independent — an agent can use neither, either, or both.
:::

## Enabling the database

Turn on **Database** in an agent's **Configure → Features**. That does three things:

1. Five database tabs appear in the agent detail view — **Home**, **Schema**, **Data**, **Views**, **Activity**.
2. The agent gains the `db_*` tools (they're hidden from the model when the database is off).
3. The agent gets a fresh, empty database on its first write — nothing is created on disk until it's actually used.

## How the agent uses it

The agent works the database entirely through typed `db_*` tools — it never writes raw, unconstrained SQL by default.

**Schema:** `db_schema` (inspect), `db_create_table`, `db_alter_table`, `db_migrate`.

**Writes:** `db_insert`, `db_upsert`, `db_update`, `db_delete`, `db_restore`.

**Reads & saved views:** `db_query` (read-only SELECT, capped with a `truncated` flag), `db_define_view` / `db_run_view` / `db_list_views` / `db_drop_view`, and an `db_execute` escape hatch restricted by host policy.

**Import & export:** `db_import` (bulk-load rows, e.g. from CSV/JSON) and `db_export` (dump table or view contents).

### Soft deletes

Every table the agent creates gets three reserved columns: `_created_at`, `_updated_at`, and `_deleted_at`. `db_delete` is a **soft delete** — it stamps `_deleted_at` rather than removing the row, and `db_restore` clears it. Reads hide soft-deleted rows by default. In the **Data** tab, the `Active` / `Deleted` / `All` filter maps directly to that flag. There's no hard-delete tool — purging a row is a host-side action the model can't take.

Every mutation is also appended to a hidden changelog (who changed what, and during which run), surfaced in the **Activity** tab.

## Where it lives, and quotas

| Artifact | Path |
|---|---|
| Per-agent database | `~/.osaurus/agents/<uuid>/db.sqlite` |
| Self-schedule slots (all agents) | `~/.osaurus/scheduler.sqlite` |

Both files go through the same storage stack as chat history and memory — plaintext by default, SQLCipher-encrypted when you've opted in. See [Storage & Encryption](/storage).

Each agent has its own storage quota: writes are rejected once the file exceeds the limit (the error tells the model to delete or migrate older rows), and a banner warns you when usage crosses ~80%.

## The detail-view tabs

| Tab | What it shows |
|---|---|
| **Home** | A dashboard of pinned views — the agent's "what should I look at right now?" |
| **Schema** | Read-only catalogue of tables, columns, types, and indexes |
| **Data** | Browse and edit rows, with the Active/Deleted/All filter and CSV export |
| **Views** | Manage saved views; pin one to show on Home |
| **Activity** | The audit log — run history paired with the changelog entries for each run |

## Self-scheduling

Self-scheduling is a **separate opt-in** — the **Self-scheduling** toggle under **Configure → Features** (default off). When off, the scheduling tools are stripped from the model and any pending slot is cancelled, so an agent can't fire after you opt out. It's independent of the database: any agent can self-schedule whether or not it has a DB.

The contract is deliberately minimal: **one next-run slot per agent**. The agent calls `schedule_next_run` to set it; when the time arrives, Osaurus clears the slot *before* dispatching (so a slow run can't double-fire) and runs the agent with the instructions it left itself. Because the slot is cleared on wake, **wake-ups are single-shot** — if the agent wants to run again, it must call `schedule_next_run` again from inside the run. That's how it expresses "keep me going" versus "I'm done."

### `schedule_next_run` fields

Pass **either** `scheduled_at` or `in_seconds`, not both.

| Field | Type | Meaning |
|---|---|---|
| `scheduled_at` | ISO-8601 | Absolute wake-up time |
| `in_seconds` | integer | Relative offset from now |
| `instructions` | string (required) | The "wake-up brief" the agent reads when it fires |
| `context_views` | string[] | Saved-view names to prefetch into the prompt before the run |
| `priority` | `normal` \| `low` | Stored intent hint (a mid-conversation skip for `low` is not currently enforced) |
| `on_miss` | `skip` \| `run_once` \| `run_catchup` | What to do if the wake-up time already passed (e.g. the Mac was asleep) |

`cancel_next_run` clears the slot, and `notify` lets the agent post a user-facing notification without scheduling anything. A requested time is clamped to the agent's **schedule mode** bounds before it's saved; if it's clamped, the tool result says why.

### Schedule modes

The mode sets the *bounds* for self-scheduling (the on/off switch is the separate toggle above):

| Mode | Max horizon | Min interval | Daily cap | Quiet hours |
|---|---|---|---|---|
| **Ambient** | 7 days | 1 hour | 6 | 22:00–07:00 |
| **Reactive** | 24 hours | 5 minutes | 48 | None |
| **Project** | 30 days | 1 hour | 4 | 22:00–07:00 |

Pick a mode in **Configure → Scheduling** (only shown when self-scheduling is on). Selecting a mode rewrites the cap, horizon, and quiet hours — not just the label.

### Pausing

The **Next Run** banner has a pause menu — 1 hour, 4 hours, until tomorrow, a custom date/time, or indefinitely. While paused, a due slot won't dispatch; it stays put and fires once the pause expires (subject to its own `on_miss`).

---

**Related:**

- [Memory](/memory) — global conversational memory (separate from Agent DB)
- [Schedules](/schedules) — app-level recurring runs on a clock
- [Agents](/agents) — per-agent features and configuration
- [Tasks](/agent-loop) — the agent loop the `db_*` and scheduling tools run inside
- [Storage & Encryption](/storage) — how the databases are protected

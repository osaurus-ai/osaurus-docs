---
title: Agent DB & Self-Scheduling
sidebar_label: Agent DB & Self-Scheduling
description: Give one of your agents its own private notebook of tables, and let it set an alarm to wake itself up later — so it can keep track of things and follow up on its own.
---

# Agent DB & Self-Scheduling

You can give any [agent](/glossary#agent) you create two extra abilities:

- **Database** — a private set of tables (like a small spreadsheet) where the agent keeps organized records between chats, such as a reading list, a habit log, or a list of open tasks.
- **Self-scheduling** — an alarm the agent can set to wake itself up at a later time and do something, like check in tomorrow morning.

Together, they're a notebook that can also set its own alarm. For example, tell an agent *"Keep a list of the books I mention, and every Sunday morning remind me which ones I haven't finished."* It records each book in its database, and wakes itself up on Sunday to check the list.

Both are off until you turn them on, and they work on their own or together. They're for agents you create; the [Orchestrator](/glossary#orchestrator) can't use them.

:::info[This is not Memory]
[Memory](/memory) is something Osaurus does automatically across all your chats, picking up facts from conversation. The agent database is **one agent's own organized records**, which the agent sets up and updates on purpose. They're separate — an agent can use neither, either, or both.
:::

## Get started

### Turn on the database

1. Open **Settings → Agents** and pick an agent. (Settings is the gear at the bottom of the narrow strip on the left edge of the window, or press **⌘,**.)
2. Open **Abilities** and turn on **Database**. (You can also open the **Database** row on the agent's page and click **Enable Database**.)
3. Ask the agent to keep track of something, like *"Keep a list of the books I mention and whether I've finished them."*

The agent designs its own tables and fills them in. Nothing is saved until it first writes something.

### Turn on self-scheduling

1. On the same agent, open **Abilities** and turn on **Self-scheduling**.
2. Back on the agent's page, a **Scheduling** section appears. Pick how often the agent may wake itself up (see [Schedule modes](#schedule-modes)).
3. Ask the agent to follow up, like *"Check my reading list every Sunday morning and remind me what's unfinished."*

When the time comes, the agent wakes up and works through the instructions it left for itself. It runs in the background, even if no chat is open.

If you just want something to happen at a set time every day, you don't need self-scheduling. Use [Automations](/automations) to run an agent or a [workflow](/workflows) on a schedule you pick.

## Looking at the agent's data

Everything is in the agent's **Database** row, on the agent's page next to **Memory**. It has four sections:

| Section | What it shows |
|---|---|
| **Overview** | A dashboard of pinned views — the "what should I look at right now?" page |
| **Tables** | Every table the agent made. Browse and edit rows, filter by **Active**, **Deleted**, or **All**, and export to CSV (a file you can open in Numbers or Excel) |
| **Saved Views** | Saved searches the agent (or you) set up. Pin one to show it on the Overview |
| **History** | A record of each run and exactly what changed during it |

### Deleted rows can come back

When the agent deletes a row, it's hidden, not erased. You can see deleted rows with the **Deleted** or **All** filter, and the agent can restore them. The agent can't permanently erase anything on its own.

### Storage limit

Each agent's database can grow to **100 MB** by default — plenty for normal use, but enough to stop a runaway agent from filling your disk. A banner warns you when it's about 80% full. Once it's full, the agent can't add more until it deletes or reorganizes older records (it's told this when a write is refused).

### Privacy

The database stays on your Mac with your other Osaurus data. If the agent uses a [cloud model](/glossary#cloud-model), the table layout — table names and column types — is sent with each request so the model knows how to use it. The rows themselves aren't sent unless the agent reads them during the chat.

## Self-scheduling

An agent has **one alarm slot**. It sets the alarm for a time, and leaves itself a note about what to do. When the alarm goes off, Osaurus clears the slot and runs the agent with that note, in a fresh chat.

Each alarm fires **once**. If the agent wants to keep going — say, every morning — it sets the next alarm during the run. If it doesn't, it's done. The agent can also cancel its alarm, or send you a notification without scheduling anything.

If you turn **Self-scheduling** off, any alarm that's waiting is cancelled, so the agent can't wake up after you've opted out. Self-scheduling doesn't need the database; any agent you create can use it.

Each wake-up runs as a background task. You can see past wake-ups, including ones that were skipped, in **Settings → Developer Tools → Tasks → History** (see [Tasks](/tasks)).

### Schedule modes

The mode sets the limits on how often the agent can wake itself up. (Turning self-scheduling on or off is the separate switch above.)

| Mode | How far ahead it can schedule | Shortest gap between runs | Runs per day | Quiet hours (no runs) |
|---|---|---|---|---|
| **Ambient** — background helper | 7 days | 1 hour | 6 | 10 pm–7 am |
| **Reactive** — quick reflexes | 24 hours | 5 minutes | 48 | None |
| **Project** — deep work | 30 days | 1 hour | 4 | 10 pm–7 am |

Pick a mode in the **Scheduling** section on the agent's page. It only appears when self-scheduling is on. Choosing a mode sets all of these limits at once. If the agent asks for a time outside its limits, Osaurus moves it to the nearest allowed time and tells the agent why.

There's also a **Manual** mode, which means self-scheduling is off: the agent can't set an alarm. You won't see it in the picker — it's what an agent has before you turn self-scheduling on. Turning self-scheduling on switches a Manual agent to **Ambient**.

### The Next Run banner

While self-scheduling is on, a **Next Run** banner sits at the top of the agent's page. It shows when the agent will wake next, with **Run now**, **Edit**, and **Cancel**.

To pause, click **Pause** and choose **1 hour**, **4 hours**, **Until tomorrow**, **Custom…**, or **Indefinitely**. While paused, a waiting alarm doesn't go off. It stays put and fires once the pause ends (following its missed-run setting — see below).

### If your Mac was asleep

When the agent sets an alarm, it also picks what to do if the time passes while your Mac is asleep or Osaurus is closed: skip it (the usual choice), run once, or catch up.

## Good to know

- Both abilities are for agents you create. The Orchestrator can't use them.
- Turning the database off doesn't delete it. The data stays on your Mac until you delete the agent's data.
- An alarm that's less than five minutes late still runs as normal.

---

## Under the hood

### Database tools

The agent works the database only through typed `db_*` [tools](/glossary#tool). It doesn't write raw, unconstrained SQL by default. The tools are hidden from the model when the database is off.

**Schema:** `db_schema` (inspect), `db_create_table`, `db_alter_table`, `db_migrate`.

**Writes:** `db_insert`, `db_upsert`, `db_update`, `db_delete`, `db_restore`.

**Reads & saved views:** `db_query` (read-only SELECT, capped with a `truncated` flag), `db_define_view` / `db_run_view` / `db_list_views` / `db_drop_view`, and a `db_execute` escape hatch restricted by host policy. Destructive SQL (`DROP TABLE`, extension loading, writes to system tables) is blocked.

**Import & export:** `db_import` (bulk-load rows from CSV, TSV, JSON, JSONL, or `.xlsx`) and `db_export` (dump table or view contents).

### Soft deletes and the changelog

Every table the agent creates gets three reserved columns: `_created_at`, `_updated_at`, and `_deleted_at`. `db_delete` is a soft delete — it stamps `_deleted_at` instead of removing the row, and `db_restore` clears it. Reads hide soft-deleted rows by default, and the **Active** / **Deleted** / **All** filter maps directly to that column. There's no hard-delete tool; purging a row is a host-side action the model can't take.

Every change is also appended to a hidden changelog (who changed what, during which run), shown in the **History** section. During a background run, writes are stamped with that run's task id.

### Files and encryption

| Artifact | Path |
|---|---|
| Per-agent database | `~/.osaurus/agents/<uuid>/db.sqlite` |
| Cross-agent scheduler file | `~/.osaurus/scheduler.sqlite` |

Both files use the same storage stack as chat history and memory: plaintext by default (protected by FileVault), SQLCipher-encrypted when you've opted in. See [Storage & Encryption](/storage). When an agent is exported or imported as a bundle, its database is converted to match the receiving Mac's posture.

### Quotas

The storage quota is `storageBytesLimit` (default 100 MB; `0` disables the check) with a warning threshold of `storageWarnPercent` (default 80%). Writes are rejected once the file exceeds the limit, and the error tells the model to delete or migrate older rows.

### `schedule_next_run` fields

The agent sets its alarm with `schedule_next_run`. Pass **either** `scheduled_at` or `in_seconds`, not both.

| Field | Type | Meaning |
|---|---|---|
| `scheduled_at` | ISO-8601 | Absolute wake-up time |
| `in_seconds` | integer | Relative offset from now |
| `instructions` | string (required) | The "wake-up brief" the agent reads when it fires |
| `context_views` | string[] | Saved-view names to prefetch into the prompt before the run |
| `priority` | `normal` \| `low` | Stored intent hint (a mid-conversation skip for `low` isn't currently enforced) |
| `on_miss` | `skip` \| `run_once` \| `run_catchup` | What to do if the wake-up time already passed (e.g. the Mac was asleep). Default `skip`. |

`cancel_next_run` clears the slot, and `notify` posts a user-facing notification without scheduling anything. These three tools are removed from the model when **Self-scheduling** (`selfSchedulingEnabled`) is off.

### How a wake-up runs

The slot is stored as a one-shot schedule [automation](/automations) the agent owns; each `schedule_next_run` call re-arms it (last write wins). When it's due, the schedule source fires it once and disables it *before* dispatching, so a slow run can't fire twice. A pause moves the wake to the end of the pause; a wake that fell behind while the Mac slept follows `on_miss` (less than 5 minutes late still runs). The task scheduler then admits the run on its queue, and the agent runs in a fresh chat session with a short preamble (who scheduled it, when, and how the previous wake finished) followed by its stored instructions. A wake that is skipped or fails to start still finishes as a task, so it shows in **Tasks → History**.

A requested time is clamped to the agent's schedule-mode bounds before it's saved; if it's clamped, the tool result says why. Older builds kept the slot and run history in `scheduler.sqlite` tables; they're migrated on launch and the old tables renamed `*_legacy`.

### Schedule mode presets

Picking a mode writes its preset values (horizon, minimum interval, daily cap, quiet hours) into the agent's settings, replacing the previous ones — not just the label. **Manual** is the stored "off" state: its preset is a 7-day horizon, 15-minute interval, and a daily cap of 0, and any agent-requested schedule is refused while it's set. The picker offers only Ambient, Reactive, and Project.

---

**Related:**

- [Memory](/memory) — automatic memory across chats (separate from the agent database)
- [Automations](/automations) — runs on a schedule or trigger that you set up
- [Tasks](/tasks) — where background runs, including wake-ups, are queued and recorded
- [Agents](/agents) — per-agent features and settings
- [Working in Chat](/agent-loop) — the agent loop the `db_*` and scheduling tools run inside
- [Storage & Encryption](/storage) — how the databases are protected

---
title: Telemetry
sidebar_label: Telemetry
description: The anonymous usage data and crash reports Osaurus can send, what they never include, and how to turn each one off. Both are off if you build Osaurus yourself.
---

# Telemetry

Osaurus can send two kinds of information to its makers, and neither ever includes your conversations:

1. **Anonymous usage data.** Simple, combined counts of how the app is used (for example, "a message was sent"), so we can see where people get stuck. Nothing is sent until you agree.
2. **Crash reports.** Technical details when Osaurus crashes or freezes, so we can fix the bug. These are on from the first launch.

Each has its own switch, and you can turn either off anytime.

:::tip[What we never see]
Usage data and crash reports **never** include your chats, [prompts](/glossary#prompt), [system prompts](/glossary#system-prompt), model replies, what your agents' [tools](/glossary#tool) did, your files or file names, [API keys](/glossary#api-key), agent names, chat titles, or session IDs. There are no accounts, and nothing includes your name, email, or your Mac's name.
:::

## Get started: change your choices

1. Open **Settings…** (`⌘ ,`) → **Privacy**.
2. On the **Filter** tab, find the **Data Collection** section.
3. Turn **Share Anonymous Usage Data** or **Send Crash Reports** on or off. Changes take effect right away.

## Anonymous usage data

### When it starts

- **You choose on the first setup screen.** The welcome screen has a box, checked by default, that says **Share anonymous usage data to help improve Osaurus**. If you continue with it checked, usage data starts. If you uncheck it, nothing is ever sent.
- **Nothing is sent before you decide.** The few events from launch up to your choice are kept in memory only, never saved to disk. They're sent only if you agree and dropped if you don't.
- **Updating from an older version?** If you never made a choice, Osaurus asks you once.
- **Turn it off anytime** in **Share Anonymous Usage Data** (see [Get started](#get-started-change-your-choices)). Sending stops immediately.

### What we never collect

- Chat content: prompts, messages, system prompts, or model replies of any kind.
- What tools were asked to do or what they returned, file contents, or file paths.
- API keys, passwords, sign-in tokens, or the web addresses of cloud [providers](/glossary#provider).
- Agent names, chat titles, session IDs, or conversation history.
- Exact [token](/glossary#token) counts or message lengths.
- The names you gave your cloud providers, or the exact name of a cloud model.
- Any lasting ID for you, an account, your IP address, or your precise location.

### What we do collect

Usage data answers three questions:

- **Are people using the main features?** For example, how many messages are sent and agents are run.
- **Do people come back?** For example, how many days the app is opened.
- **Which features get used?** For example, how many people download a model or add a provider.

Every event also includes your Mac's memory size, rounded to a standard tier (like 16 GB or 32 GB), so we can tell whether a feature struggles on smaller Macs. The full list is in [Under the hood](#under-the-hood).

## Crash reports

Crash reports are a **separate switch** from usage data. Unlike usage data, they're **on from the first launch** in the app you download, so even a crash during setup gets reported. They contain no personal information.

- **Turn them off anytime** in **Send Crash Reports** (see [Get started](#get-started-change-your-choices)).
- **They only cover crashes and freezes.** No screenshots, performance tracking, or list of the websites Osaurus talks to.
- **They aren't tied to you.** Your name, email, and your Mac's name are removed. Each install has a random ID so we can count how many Macs a bug affects, but it isn't linked to who you are.

## If you build Osaurus yourself

If you build Osaurus from its source code, **both are off**. The special keys that turn them on aren't included, so nothing is ever sent. See [Building from Source](/developer).

---

## Under the hood

This section is the detailed reference. The upstream [`TELEMETRY.md`](https://github.com/osaurus-ai/osaurus/blob/main/docs/TELEMETRY.md) is the exhaustive, authoritative list.

### Services used

- **Usage analytics:** [Aptabase](https://aptabase.com), an [open-source](https://github.com/aptabase/aptabase), privacy-first analytics project.
- **Crash and hang reports:** Sentry.

### Analytics consent states

The consent flag has three states: undecided, granted, and declined. While undecided, events are buffered in memory (capped at 64) and only sent if consent is granted. Continuing past the welcome step with the box checked records consent and flushes the buffer. Finishing onboarding with it unchecked records a decline, so the one-time upgrade prompt never re-asks. With no Aptabase key (the contributor default), the SDK never initializes and every event is a no-op.

### Event catalog

| Pillar | Question | Primary signals |
|---|---|---|
| Engagement | Are people using the core product? | `message_sent`, `chat_session_started`, `agent_run` |
| Retention | Do people come back and run the server? | `daily_active`, `app_launched`, `server_started` |
| Feature adoption | Which features get used? | `model_downloaded`, `remote_provider_added`, `mcp_provider_added`, `agent_created` |

One coarse property is attached to every event: `total_memory_gb`, your Mac's physical RAM snapped to a fixed tier (`8`, `16`, `18`, `24`, `32`, `36`, `48`, `64`, `96`, `128+`). This lets a metric be segmented by machine class (for example, whether a large MoE model bounces more on lower-RAM Macs) without sending an exact, identifying memory size.

Highlights:

- **`message_sent`** (the primary metric) fires once per top-level chat turn; internal tool-loop steps aren't counted. It carries the `source` (`chat_ui` / `http_api` / `plugin`), the `model_source` (`foundation` / `local` / `remote`), the `provider_type` enum, whether it streamed, and whether it came from an autonomous agent run. The exact model id is only sent for built-in Foundation/local models; remote model ids are never sent in plaintext.
- **`model_downloaded`** carries a coarse size, quantization, and whether the model is a VLM, using curated catalog ids only.
- **`remote_provider_added`** / **`mcp_provider_added`** carry only the provider type or transport (`http` / `stdio`), never names, URLs, commands, or keys.
- **`agent_created`** carries only `number_of_agents` (the total on the install after this one, built-ins included), with no name, prompt, or configuration. Built-in agents seeded by the app don't fire it.
- **`settings_opened`** fires when Settings opens and on each tab switch, with a stable tab token and whether the install has sent its first chat message yet. Never setting names or values.
- **`sandbox_boot`** carries the boot kind (`cold` / `warm` / `warmFallback` / `template`) and a coarse duration bucket. **`sandbox_provision_failure`** carries closed-list tokens (category, backend, phase, error class, trigger, cold start). The error message, paths, hosts, and agent identity stay on your Mac, mirrored in **Settings… → Sandbox → Diagnostics** so you can self-report.
- **`model_memory_sample`** is a silent diagnostic sampled while a local model is loading or resident: phase, swap-pressure severity, and bucketed swap / footprint / page-rate figures. It's capped at eight per model residency, with no model name, path, or timestamp, and never influences how models are loaded or unloaded.
- **`computer_use_attempt`** / **`computer_use_refused`** / **`computer_use_run`** form a [Computer Use](/computer-use) funnel with coarse tokens only (refusal stage, outcome, bucketed step and confirmation counts). No goal text, app names, or agent ids.
- **`announcement_shown`** / **`announcement_clicked`** are keyed by the announcement's slug.
- **Onboarding funnel** events carry only a stable step name/index and a completion reason; `brain_source_selected` records whether you chose Osaurus Cloud, a local model, or a provider key.

### Install cohort and retention

Aptabase has no user id, so retention is computed from counts. Each install stores its **first-launch date** locally and sends these coarse dimensions on `app_launched` and `daily_active`:

| Property | Values |
|---|---|
| `install_cohort` | ISO week of the first launch, e.g. `2026-W38` |
| `install_age_days` | Whole days since first launch: `0`, `1`, … `364`, or `365+` |
| `install_cohort_source` | `install` (stamped at first launch), `inferred` (older installs, from the creation date of the Osaurus data folder), or `unknown` |

`daily_active` fires at most once per local calendar day per install, so launching repeatedly can't inflate it. The stamp is written once and never updated. Combining cohort, age, and event date can reconstruct the install *day*, a coarse bucket rather than an identifier. Resetting app preferences or using a fresh macOS account starts a new cohort.

### Remote model identifiers

The names and model ids you type for **remote** providers can be identifying (e.g. `acme-internal/legal-bot`), so they're never sent in plaintext. The primary remote dimension is the fixed `provider_type` enum. For distinct-counting, a salted, truncated hash of the remote model id (`model_hash`) is sent instead of the string. The salt is a fixed app constant (so the same model hashes consistently), which is an accepted trade-off: the hash is only applied to user-typed remote ids, it's truncated, and it's only a secondary signal. Built-in Foundation and local MLX ids come from a curated catalog and are sent verbatim.

### Crash reporting configuration

- **Opt-out, started at launch.** The consent flag reads as enabled unless you've explicitly turned it off, and Sentry starts in `applicationDidFinishLaunching` so first-run crashes are captured. Turning it off closes the SDK immediately.
- **Scope:** crash handler and app-hang tracking (3-second threshold) only. Performance tracing, profiling, failed-request capture, and network breadcrumbs are off. Screenshot and view-hierarchy capture don't exist on the macOS SDK.
- **Release health:** session tracking is on, so Sentry can report crash-free rates per release.
- **Breadcrumbs and logs:** the app records short breadcrumbs (mirrored as Sentry Logs) to show what was happening before a hang. They contain identifiers only, never user content.
- **PII:** `sendDefaultPii` is off. Before sending, every identifying user field and the device hostname are stripped. Only the SDK's anonymous installation id (a random UUID stored locally) is kept, so Sentry can count affected installs.
- **Keyless builds:** reporting needs a Sentry DSN, so contributor builds never report.

### Source builds and local development

With no Aptabase key and no Sentry DSN, the SDKs never initialize and every event is a silent no-op, so you can build and contribute without any of this. Debug builds that *do* configure keys report to separate **Debug** buckets, so local testing never pollutes production data. See the [README](https://github.com/osaurus-ai/osaurus#local-development) for setup details.

---

**Related:**

- [Security & Privacy](/security) — the overall trust story, encryption, and what can leave your Mac
- [Privacy Filter](/privacy-filter) — on-device redaction of cloud-bound prompts
- [Building from Source](/developer) — clone, build, and contribute without telemetry keys

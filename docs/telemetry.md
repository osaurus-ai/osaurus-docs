---
title: Telemetry & Crash Reports
sidebar_label: Telemetry
description: What anonymous analytics Osaurus collects and never collects, plus the separate crash-reporting switch. Both controllable in Settings; off in source builds.
---

# Telemetry & Crash Reports

Osaurus has two **separate, independent** switches that send data off your Mac, and neither ever touches your conversations:

1. **Anonymous usage analytics** (via [Aptabase](https://aptabase.com), an [open-source](https://github.com/aptabase/aptabase), privacy-first project) — coarse, aggregated signals about how the app is used, so we can see where people hit friction.
2. **Crash & hang reports** (via Sentry) — diagnostics that let us fix real bugs.

Both are controllable in **Settings → Privacy**, and both are **off in source builds** (the keys that enable them aren't present, so the SDKs never initialize). This page is the user-facing summary; the upstream [`TELEMETRY.md`](https://github.com/osaurus-ai/osaurus/blob/main/docs/TELEMETRY.md) is the exhaustive, authoritative reference.

:::tip[What we never see]
Analytics and crash reports **never** include your chats, prompts, system prompts, model outputs, tool arguments, file contents or paths, API keys, agent names, chat titles, or session ids. There are no accounts and no persistent per-user identifier, so events aren't tied to you.
:::

## Anonymous usage analytics

### Defaults and consent

Analytics are **on by default and opt-out** in shipped builds, with a single switch to turn them off.

- **You confirm before anything is sent.** The first onboarding step shows a pre-checked "Share anonymous usage data" box with an info button explaining what's collected. The handful of events from launch up to that step are held in memory (never written to disk) — continuing with the box checked sends them; unchecking drops them.
- **Off anytime** in **Settings → Privacy → Share Anonymous Usage Data**. Sending stops immediately.
- **Silent in source builds.** With no Aptabase key (the contributor default), the SDK never initializes and every event is a no-op.

### What we never collect

- Chat content — prompts, messages, system prompts, completions, or model output of any kind.
- Tool-call arguments or results, file contents, or file paths.
- API keys, tokens, credentials, or remote provider URLs.
- Agent names, chat titles, session ids, or conversation history.
- Exact token counts or message text length.
- The names of your configured remote providers, or the raw model id of a remote model.
- Any persistent per-user identifier, account, IP address, or precise location.

### What we do collect

Events are organized around three product questions:

| Pillar | Question | Primary signals |
|---|---|---|
| Engagement | Are people using the core product? | `message_sent`, `chat_session_started`, `agent_run` |
| Retention | Do people come back and run the server? | `app_launched`, `server_started` |
| Feature adoption | Which features get used? | `model_downloaded`, `remote_provider_added`, `mcp_provider_added`, `agent_created` |

One coarse property is attached to every event: `total_memory_gb`, your Mac's physical RAM snapped to a fixed tier (`8`, `16`, `18`, `24`, `32`, `36`, `48`, `64`, `96`, `128+`). This lets a metric be segmented by machine class — e.g. whether a large MoE model bounces more on lower-RAM Macs — without ever shipping an exact, identifying memory size.

A few highlights from the event catalog:

- **`message_sent`** (the primary metric) fires once per top-level chat turn — internal tool-loop steps are not counted. It carries the `source` (`chat_ui` / `http_api` / `plugin`), the `model_source` (`foundation` / `local` / `remote`), the `provider_type` enum, whether it streamed, and whether it came from an autonomous agent run. The exact model id is only sent for built-in Foundation/local models; remote model ids are never sent in plaintext.
- **`model_downloaded`** carries a coarse size, quantization, and whether the model is a VLM — using curated catalog ids only.
- **`remote_provider_added`** / **`mcp_provider_added`** carry only the provider type or transport (`http` / `stdio`) — never names, URLs, commands, or keys.
- **`agent_created`** is a count only — no name or configuration.

### Remote model identifiers

The names and model ids you type for **remote** providers can be identifying (e.g. `acme-internal/legal-bot`), so they're never sent in plaintext. The primary remote dimension is the fixed `provider_type` enum. For distinct-counting, a salted, truncated hash of the remote model id (`model_hash`) is sent instead of the string. The salt is a fixed app constant (to make the same model hash consistently), which is an accepted trade-off — the hash is only ever applied to user-typed remote ids, it's truncated, and it's only a secondary signal. Built-in Foundation and local MLX ids come from a curated catalog and are sent verbatim.

## Crash & hang reports

Crash and app-hang reporting via Sentry is a **separate switch** from usage analytics. Unlike analytics, it's **opt-out and on by default from launch** in shipped builds — crash reports carry no personal information and are what let us fix real bugs.

- **Turn it off anytime** in **Settings → Privacy → Send Crash Reports**.
- **Scope is limited to crash and hang diagnostics** — no performance tracing, profiling, failed-request capture, network breadcrumbs, or screenshots.
- **PII is stripped** — the user object and device hostname are dropped from every event, on top of disabling Sentry's PII collection.
- **Off in source builds** — like analytics, it needs a key (a Sentry DSN) to be configured, so contributor builds never report.

## Source builds and local development

If you build Osaurus yourself, **both switches are off** unless you explicitly configure keys. With no Aptabase key and no Sentry DSN, the SDKs are never initialized and every event is a silent no-op — you can build and contribute without any of this. Debug builds that *do* configure keys report to separate **Debug** buckets so local testing never pollutes production data. See the [README](https://github.com/osaurus-ai/osaurus#local-development) for setup details.

---

**Related:**

- [Security & Privacy](/security) — the overall trust story, encryption, and what can leave your Mac
- [Privacy Filter](/privacy-filter) — on-device redaction of cloud-bound prompts
- [Building from Source](/developer) — clone, build, and contribute without telemetry keys

---
title: Privacy Filter
sidebar_label: Privacy Filter
description: On-device redaction for cloud-bound prompts. Regex rules work out of the box; an optional on-device AI classifier catches names, addresses, and secrets — fail-closed and verifiable in Insights.
---

# Privacy Filter

When you talk to a local model, nothing leaves your Mac. But the moment you send a prompt to a cloud provider, your words travel to someone else's servers. The **Privacy Filter** is a redaction gate that sits between the chat and any cloud provider: it detects sensitive content on the way out, lets you review it, swaps it for placeholders, sends the scrubbed version, and restores the originals locally when the reply streams back.

Detection runs as **two independent layers**:

- **Deterministic regex** — built-in patterns, opt-in presets, and your custom rules. Works immediately with **zero download**, and is all most users need.
- **On-device AI classifier** *(opt-in)* — catches the fuzzy shapes regex can't model: names, addresses, dates, free-form secrets. Choose between two models; nothing is downloaded unless you turn AI detection on, and the model runs entirely on your Mac — no third-party model ever sees your raw text, not even to *decide* what counts as sensitive.

:::info[Experimental]
The Privacy Filter is an experimental feature. The regex layer covers deterministic shapes (email, URL, phone, SSN, credit cards, IBAN, AWS keys, GitHub tokens, passports, driver's licenses); AI detection adds names, addresses, dates, and secrets. Always review the redaction sheet for messages that contain things you genuinely care about.
:::

## The gate

The pipeline is a one-way street with a checkpoint:

```
detect → review → scrub → send → stream back → unscrub → render
```

It is **fail-closed** on every send. If scrubbing produced no changes, or a post-scrub re-scan finds anything that leaked, the send is **blocked** and you're told why — Osaurus never silently falls back to sending the original. Fail-closed holds per layer: with AI detection **on**, a missing or corrupt model blocks the send; with AI detection **off**, the regex layer runs on its own and never blocks on a model.

## Getting started

1. Open the Management window (`⌘ ,`) → **Privacy**. All four tabs (**Overview**, **Rules**, **Providers**, **Model**) are available immediately — no download required.
2. Turn on **Enable Privacy Filter** in Overview. The regex layer is now active.
3. *(Optional)* To also catch names, addresses, and free-form secrets, open the **Model** tab, install an AI model, and turn on **AI detection** in Overview. The toggle stays disabled until a model is installed and verified.
4. Send a chat message containing personal info to a cloud provider. A **review sheet** appears showing each detected entity and a side-by-side scrubbed preview. Approve, and the scrubbed message sends; the reply streams back with placeholders restored inline.

Both toggles persist synchronously, so quitting Osaurus right after toggling can't lose the setting.

:::tip[Test before you trust]
The **Rules** tab has a built-in **dry-run tester** — paste sample text and see every entity your live rule set (plus the AI model, when it's on) would redact, with the placeholder each one gets.
:::

## What it detects

Detection results from all layers are merged, so overlapping hits collapse to a single entity in the review sheet.

### Built-in patterns

Deterministic regex toggled per category in **Privacy → Rules → Detection Patterns**. Each toggle controls **both** detection and the post-scrub leak check — turning a category off means Osaurus won't flag it *and* won't block a send that leaks it.

| Category | Detects |
|---|---|
| `phone` | US-style 10–12 digit phone numbers, with or without separators |
| `email` | Standard `local@domain.tld` addresses |
| `url` | `http(s)://…` URLs with a scheme |
| `accountNumber` | US SSNs and Luhn-valid credit card numbers |

### Preset rules

Opt-in patterns for common secrets and IDs, shipped **disabled**. Enable them individually under **Privacy → Rules → Preset Rules**.

| Preset | Detects |
|---|---|
| `driversLicense` | US state driver's license number heuristic |
| `passport` | US passport number heuristic |
| `iban` | IBAN (ISO 13616 country prefix + check digits) |
| `awsKey` | AWS access key IDs |
| `githubToken` | GitHub personal access tokens |

### Custom rules

Your own rules, added under **Privacy → Rules → Custom Rules**. The editor has two modes:

- **Simple** — a no-regex builder. Pick a match type and type the terms; Osaurus generates a valid pattern for you, so a malformed rule is impossible. Match types: exact word, any of a list of terms, starts with, ends with, contains, a digit run of a given length, or everything between two markers.
- **Regex** — a raw pattern for full control. Validated before save, so a broken regex never reaches disk. Patterns are capped at 512 characters.

Both modes support case-insensitive matching and a custom placeholder label — mint `[CUSTOMER_1]` instead of the default `[SECRET_1]`. A live test panel shows what your rule matches as you type.

### On-device AI classifier (opt-in)

AI detection is **off by default** and downloads nothing until you turn it on. It adds the categories regex can't model: `person`, `address`, `date`, and `secret`. Two models are available in the **Model** tab:

| Model | Size | Notes |
|---|---|---|
| [`openai/privacy-filter`](https://huggingface.co/openai/privacy-filter) (Apache-2.0), served as [`mlx-community/openai-privacy-filter-bf16`](https://huggingface.co/mlx-community/openai-privacy-filter-bf16) | ~2.8 GB | A 1.5B-parameter sparse mixture-of-experts token classifier (~50M active per token). The most accurate option. |
| **Rampart** ([`OsaurusAI/rampart-mlx`](https://huggingface.co/OsaurusAI/rampart-mlx)) | ~37 MB | A lightweight BERT token classifier. Fast to download, minimal memory footprint. |

Both are SHA-256 verified file-by-file at install. Adjacent tokens are stitched into single spans, so `John Doe` becomes one `person`, not two.

## Placeholders

Approved entities are swapped for `[CATEGORY_N]` placeholders, numbered per category, per conversation:

```
[PERSON_1]   [PERSON_2]   [PERSON_3]
[EMAIL_1]    [EMAIL_2]
[PHONE_1]    [URL_1]      [ADDR_1]
[ACCT_1]     [DATE_1]     [SECRET_1]
```

The same value reuses the same placeholder for the whole conversation — `Alice` mentioned five times is always `[PERSON_1]` — so when the model refers back to an entity ("about `[PERSON_1]`'s preference…"), Osaurus can restore the original on the way in. A different conversation gets a fresh map starting back at `1`.

## The review sheet

The first message that detects anything pops the review sheet. It has three parts:

- **Detected entities** — one row per `(category, original, placeholder)`. Toggle a row off to drop a false positive before sending.
- **Outgoing preview** — a scrubbed reconstruction of exactly what would be sent. Hover any highlighted placeholder to reveal the original value (which never leaves your Mac).
- **Send / Cancel** — Send is the default action. Cancel aborts the request entirely; nothing is sent and the chat doesn't move.

Prefer not to review every turn? Turn on **Always Approve by Default** in Overview to scrub silently for the rest of a session. After a message ships, the chat bubble shows the original values locally but underlines and tints each one — hover to see which placeholder it was sent as.

## It blocks rather than leak

Because the pipeline is fail-closed, a send can be stopped instead of risking a leak:

| Situation | What happens |
|---|---|
| You dismiss the review sheet | "Privacy Filter: review canceled." Nothing is sent. |
| AI detection is on but the model is missing or failed to load | The send is blocked, pointing at **Settings → Privacy** to reinstall or turn AI detection off. Regex-only sends never hit this. |
| Approved redactions didn't apply | The send is blocked and asks you to report it (this almost always indicates a bug). |
| A post-scrub re-scan still finds PII | The send is blocked, with per-category counts of what leaked (never the raw values). |

The post-scrub re-scan only checks the categories whose built-in pattern is enabled — the same toggle that controls detection — so turning a category off turns off both halves consistently.

## Per-provider overrides

The **Providers** tab lets you disable the filter for a specific cloud provider — handy for a self-hosted endpoint you already trust, or while debugging a model's behavior. Overrides are keyed to the provider's stable id, so renaming a provider won't silently drop your preference. Providers with no explicit override default to **enabled**.

## Verify what actually left your Mac

You don't have to take the filter's word for it. Open **Insights** (Management window → **Insights**), pick a request, and look at the **Request** and **Response** tabs. The **Server Request** / **Server Response** sub-sections show the exact bytes that went to the provider and came back — captured at the wire, *after* scrubbing and *before* unscrubbing.

If you see `[EMAIL_3]` in the Server Request body while your local message reads `alice@example.com`, the filter worked. The pre-scrub local copy sits in **Request → Local** for comparison. See [Developer Tools](/developer-tools) for more on Insights.

## Settings reference

| Setting | Default | Description |
|---|---|---|
| **Enable Privacy Filter** | off | Master toggle. Turns on the regex layer — no model required. |
| **AI detection** | off | Opt into the on-device classifier. Requires an installed model; fails closed if the model goes missing. |
| **AI model** | OpenAI | Which backend AI detection uses: `openai/privacy-filter` (~2.8 GB) or Rampart (~37 MB). |
| **Skip Code Blocks** | on | Skip fenced and inline code spans. |
| **Always Approve by Default** | off | Still redact, but skip the review sheet for the session. |
| Detection Patterns | all on | Per-category built-in toggles (controls detection **and** leak check). |
| Preset Rules | all off | Opt-in preset patterns. |
| Custom Rules | none | Your own rules — Simple builder or regex. |
| Provider overrides | enabled | Per-provider enable/disable. |

## Where things live

| Path | Contents |
|---|---|
| `~/.osaurus/config/privacy-filter.json` | Your settings (plaintext, atomic write) |
| `~/.osaurus/aux-models/openai-privacy-filter-bf16-v1/` | The OpenAI model bundle, when installed |
| `~/.osaurus/aux-models/rampart/` | The Rampart model bundle, when installed |

Placeholder maps live in memory only — they don't persist across restarts, and each chat session keeps its own. **Forget Redactions in Every Conversation** (Overview) clears them immediately; the next send mints fresh placeholders.

## Limitations

- **English-leaning.** Non-English names and addresses get lower confidence and are easier to miss. The regex layer is locale-agnostic for shape-based categories (email, URL, IBAN, AWS keys) but can't catch names.
- **No semantic redaction.** "My medical history" passes through unchanged — the classifier tags tokens, not topics. Keep the review sheet on for sensitive conversations.
- **Images and audio are not scanned.** Only text is inspected — message text, the text parts of multimodal content, tool-call arguments, and reasoning traces. PII inside a screenshot, scan, or audio clip that a cloud model can read is *not* redacted. Strip the attachment or disable the relevant provider if this matters.
- **Local models bypass the filter by design.** Apple Foundation Models and local MLX models never leave your Mac, so the filter only attaches to cloud (remote provider) requests.
- **Very long messages are chunked.** Text beyond ~8,000 characters is split before the classifier sees it, so an entity straddling a chunk boundary may register as two partial matches.
- **Redactions don't carry across conversations.** The same email gets `[EMAIL_1]` independently in two different chats; a reply referencing an entity from another conversation can't be unscrubbed.

## Troubleshooting

**The toggle reset to off after restart.** Confirm `~/.osaurus/config/privacy-filter.json` is writable. If it persists, file an issue.

**The review sheet appeared but the send looks unscrubbed.** Check **Insights → Server Request** for placeholders. If you see raw PII in the wire body, file an issue and attach the request log — the wire capture is the evidence.

**"Privacy Filter is enabled but the on-device model isn't available."** You have AI detection on but the model isn't installed or failed to verify. Either turn AI detection off in **Privacy → Overview** (the regex layer keeps working), or open **Privacy → Model** and click **Re-verify**. If it reports mismatches, delete the model folder and reinstall.

**A send keeps getting blocked.** The post-scrub leak check re-scans the same categories as detection. If a legitimate string matches an enabled preset (e.g. something shaped like an AWS key that isn't one), disable that preset or tighten it with a custom rule.

---

**Related:**

- [Security & Privacy](/security) — the overall trust story and how to report a privacy bug
- [Remote Providers](/remote-providers) — cloud providers the filter applies to
- [Developer Tools](/developer-tools) — the Insights surface used to verify wire-level redaction
- [Memory](/memory) — what Osaurus *keeps* about your conversations (separate from what gets scrubbed on send)
- [Telemetry](/telemetry) — what anonymous analytics Osaurus collects, and what it never does

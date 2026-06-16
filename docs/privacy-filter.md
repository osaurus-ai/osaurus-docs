---
title: Privacy Filter
sidebar_label: Privacy Filter
description: On-device redaction for cloud-bound prompts. An Apache-2.0 classifier plus regex rules scrub names, emails, secrets, and more before anything leaves your Mac — fail-closed and verifiable in Insights.
---

# Privacy Filter

When you talk to a local model, nothing leaves your Mac. But the moment you send a prompt to a cloud provider, your words travel to someone else's servers. The **Privacy Filter** is a redaction gate that sits between the chat and any cloud provider: it detects sensitive content on the way out, lets you review it, swaps it for placeholders, sends the scrubbed version, and restores the originals locally when the reply streams back.

The detector runs **entirely on your Mac** — OpenAI's [`openai/privacy-filter`](https://huggingface.co/openai/privacy-filter) (Apache-2.0), served through the MLX conversion [`mlx-community/openai-privacy-filter-bf16`](https://huggingface.co/mlx-community/openai-privacy-filter-bf16) (~2.8 GB). No third-party model ever sees your raw text, not even to *decide* what counts as sensitive.

:::info[Experimental]
The Privacy Filter is an experimental feature. The on-device classifier catches common shapes (names, emails, phones, URLs, addresses, dates, account numbers, free-form secrets) and the regex layer covers deterministic ones (SSN, credit cards, IBAN, AWS keys, GitHub tokens, passports, driver's licenses). Always review the redaction sheet for messages that contain things you genuinely care about.
:::

## The gate

The pipeline is a one-way street with a checkpoint:

```
detect → review → scrub → send → stream back → unscrub → render
```

It is **fail-closed** on every send. If the model isn't available, if scrubbing produced no changes, or if a post-scrub re-scan finds anything that leaked, the send is **blocked** and you're told why — Osaurus never silently falls back to sending the original. You are never the last line of defense.

## Getting started

1. Open the Management window (`⌘ ⇧ M`) → **Privacy**.
2. On first launch you'll see an install screen. Click **Install** — the ~2.8 GB model bundle streams from Hugging Face and is SHA-256 verified file-by-file before the filter can be enabled.
3. Once verified, the surface flips to four tabs (**Overview**, **Rules**, **Providers**, **Model**). Turn on **Enable Privacy Filter** in Overview.
4. Send a chat message containing personal info to a cloud provider. A **review sheet** appears showing each detected entity, its surrounding context, and a side-by-side scrubbed preview. Approve, and the scrubbed message sends; the reply streams back with placeholders restored inline.

The master toggle is sticky — it persists synchronously, so quitting Osaurus right after toggling can't lose the setting.

## What it detects

Three detector layers run in sequence and their results are merged, so overlapping hits from different layers collapse to a single entity in the review sheet.

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

Your own regex, added under **Privacy → Rules → Custom Rules**. Patterns are validated before they're saved, so a broken regex never makes it to disk (and a rule that later fails to compile is dropped rather than crashing the pipeline). Patterns are capped at 512 characters.

### On-device classifier

Beyond the regex layers, the `openai/privacy-filter` model reads each message and tags entities the patterns can't — most importantly the things with no fixed shape: **people's names**, **postal addresses**, **dates**, and **free-form secrets**. It's a 1.5B-parameter sparse mixture-of-experts classifier (only ~50M parameters fire per token, which is what makes it practical to run on every outbound request). It emits eight categories — `person`, `email`, `phone`, `url`, `address`, `date`, `accountNumber`, `secret` — and adjacent tokens are stitched into single spans, so `John Doe` becomes one `person`, not two.

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

Because the pipeline is fail-closed, a send can be stopped instead of risking a leak. The cases you may see:

| Situation | What happens |
|---|---|
| You dismiss the review sheet | "Privacy Filter: review canceled." Nothing is sent. |
| The model bundle is missing or failed to load | The send is blocked with a pointer to **Settings → Privacy** to re-download or disable. |
| Approved redactions didn't apply | The send is blocked and asks you to report it (this almost always indicates a bug). |
| A post-scrub re-scan still finds PII | The send is blocked, with per-category counts of what leaked (never the raw values). |

The post-scrub re-scan only checks the categories whose built-in pattern is enabled — the same toggle that controls detection — so turning a category off turns off both halves consistently.

## Per-provider overrides

The **Providers** tab lets you disable the filter for a specific cloud provider — handy for a self-hosted endpoint you already trust, or while debugging a model's behavior. Overrides are keyed to the provider's stable id, so renaming a provider won't silently drop your preference. Providers with no explicit override default to **enabled**.

## Verify what actually left your Mac

You don't have to take the filter's word for it. Open **Insights** (`⌘ ⇧ I`), pick a request, and look at the **Request** and **Response** tabs. The **Server Request** / **Server Response** sub-sections show the exact bytes that went to the provider and came back — captured at the wire, *after* scrubbing and *before* unscrubbing.

If you see `[EMAIL_3]` in the Server Request body while your local message reads `alice@example.com`, the filter worked. The pre-scrub local copy sits in **Request → Local** for comparison. See [Developer Tools](/developer-tools) for more on Insights.

## Settings reference

| Setting | Default | Description |
|---|---|---|
| **Enable Privacy Filter** | off | Master toggle. When off, detection never runs. |
| **Skip Code Blocks** | on | Skip fenced and inline code spans. |
| **Always Approve by Default** | off | Still redact, but skip the review sheet for the session. |
| **Confidence Threshold** | 0.5 | Reserved for the classifier; persisted for future model versions. |
| Detection Patterns | all on | Per-category built-in toggles (controls detection **and** leak check). |
| Preset Rules | all off | Opt-in preset patterns. |
| Custom Rules | none | Your own validated regex. |
| Provider overrides | enabled | Per-provider enable/disable. |

## Where things live

| Path | Contents |
|---|---|
| `~/.osaurus/config/privacy-filter.json` | Your settings (plaintext, atomic write) |
| `~/.osaurus/aux-models/openai-privacy-filter-bf16-v1/` | The model bundle |
| `~/.osaurus/aux-models/openai-privacy-filter-bf16-v1/osaurus-manifest.json` | Local SHA-256 manifest used by **Re-verify** |

Placeholder maps live in memory only — they don't persist across restarts, and each chat session keeps its own. **Forget Redactions in Every Conversation** (Overview) clears them immediately; the next send mints fresh placeholders.

## Limitations

- **English-leaning.** Non-English names and addresses get lower confidence and are easier to miss. The regex layer is locale-agnostic for shape-based categories (email, URL, IBAN, AWS keys) but can't catch names.
- **No semantic redaction.** "My medical history" passes through unchanged — the model classifies tokens, not topics. Keep the review sheet on for sensitive conversations.
- **Images and audio are not scanned.** Only text is inspected — message text, the text parts of multimodal content, tool-call arguments, and reasoning traces. PII inside a screenshot, scan, or audio clip that a cloud model can read is *not* redacted. Strip the attachment or disable the relevant provider if this matters.
- **Local models bypass the filter by design.** Apple Foundation Models and local MLX models never leave your Mac, so the filter only attaches to cloud (remote provider) requests.
- **Very long messages are chunked.** Text beyond ~8,000 characters is split before the classifier sees it, so an entity straddling a chunk boundary may register as two partial matches.
- **Redactions don't carry across conversations.** The same email gets `[EMAIL_1]` independently in two different chats; a reply referencing an entity from another conversation can't be unscrubbed.

## Troubleshooting

**The toggle reset to off after restart.** Confirm `~/.osaurus/config/privacy-filter.json` is writable. If it persists, file an issue.

**The review sheet appeared but the send looks unscrubbed.** Check **Insights → Server Request** for placeholders. If you see raw PII in the wire body, file an issue and attach the request log — the wire capture is the evidence.

**"Privacy Filter is enabled but the on-device model isn't available."** Open **Privacy → Model** and click **Re-verify**. If it reports mismatches, delete `~/.osaurus/aux-models/openai-privacy-filter-bf16-v1/` and re-install from the **Privacy** tab.

**A send keeps getting blocked.** The post-scrub leak check re-scans the same categories as detection. If a legitimate string matches an enabled preset (e.g. something shaped like an AWS key that isn't one), disable that preset or tighten it with a custom rule.

---

**Related:**

- [Security & Privacy](/security) — the overall trust story and how to report a privacy bug
- [Remote Providers](/remote-providers) — cloud providers the filter applies to; per-provider overrides live alongside provider records
- [Developer Tools](/developer-tools) — the Insights surface used to verify wire-level redaction
- [Memory](/memory) — what Osaurus *keeps* about your conversations (separate from what gets scrubbed on send)
- [Telemetry](/telemetry) — what anonymous analytics Osaurus collects, and what it never does

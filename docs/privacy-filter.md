---
title: Privacy Filter
sidebar_label: Privacy Filter
description: Hide names, emails, phone numbers, ID numbers, and secrets before a message goes to a cloud model, then get them back in the reply. Runs on your Mac, and you can check what was sent.
---

# Privacy Filter

When you chat with a [local model](/glossary#local-model), nothing leaves your Mac. When you chat with a [cloud model](/glossary#cloud-model), your words go to another company's servers. The **Privacy Filter** finds personal details in your message, like emails, phone numbers, ID numbers, and passwords, and swaps them for placeholders before the message goes out. When the reply comes back, Osaurus puts the real values back in, on your Mac.

It works right away with no download. For extra coverage of names and addresses, you can add a small on-device AI model.

:::info[Experimental]
The Privacy Filter is experimental. The built-in rules catch things with a predictable shape: emails, web addresses, phone numbers, credit cards, ID, tax, health, and bank numbers for more than 100 countries, IBANs, and API keys. The optional AI model adds names, addresses, dates, and secrets. Always check the review sheet for messages that contain things you genuinely care about.
:::

## Get started

1. Open **Settings…** (`⌘ ,`) → **Privacy**. You'll see three tabs: **Filter**, **Rules**, and **Models**.
2. On the **Filter** tab, turn on **Scrub PII before sending to cloud providers**. ([PII](/glossary#pii) means personal details.) The built-in rules are now active.
3. *(Optional)* To also catch names, addresses, and free-form secrets, open the **Models** tab and install an AI model. Installing one turns on **AI detection (on-device model)** automatically.
4. Send a message with some personal details to a cloud model. A **review sheet** shows what was found and what will be sent. Click **Send**, and the reply comes back with your real values restored.

:::tip[Test before you trust]
The **Rules** tab has a **Test Your Rules** section. Paste sample text to see everything that would be hidden, and the placeholder each item gets.
:::

## The review sheet

The first message where something is found opens the review sheet. It has three parts:

- **Detected items.** One row for each thing found, with its placeholder. Turn a row off if it's a false alarm.
- **Outgoing preview.** Exactly what will be sent. Hover a placeholder to see the real value, which stays on your Mac.
- **Send / Cancel.** **Send** sends the cleaned-up message. **Cancel** stops it; nothing is sent.

After a message is sent, your chat shows the real values, underlined and tinted. Hover one to see which placeholder it was sent as.

**Don't want to review every message?** Turn on **Always Approve by Default** on the **Filter** tab. Osaurus still hides details, but skips the sheet for the rest of the session.

**Messages sent in the background**, like from [schedules](/schedules) or other apps using Osaurus, also wait for your review by default. To let them go through automatically after cleaning, turn off **Require Review for Background Requests** under **Advanced** on the **Filter** tab.

## How placeholders work

Each hidden value becomes a label like `[PERSON_1]`, `[EMAIL_1]`, or `[PHONE_2]`. The same value always gets the same label within a chat. So if "Alice" appears five times, the cloud model sees `[PERSON_1]` five times. When the reply mentions `[PERSON_1]`, Osaurus swaps "Alice" back in.

Each new chat starts its own set of labels. To clear them for every chat at once, use **Forget Redactions in Every Conversation** in the **Conversation Privacy** section of the **Filter** tab.

## It blocks rather than leaks

The filter never quietly sends your original message. If something goes wrong, the message is stopped and Osaurus tells you why:

| Situation | What happens |
|---|---|
| You close the review sheet | "Privacy Filter: review canceled." Nothing is sent. |
| AI detection is on, but its model is missing or won't load | The message is blocked. Reinstall the model, or turn AI detection off, in **Settings… → Privacy**. This never happens with AI detection off. |
| The approved changes didn't apply | The message is blocked and Osaurus asks you to report it (it's almost always a bug). |
| A final check still finds personal details | The message is blocked, with a count of what was found by type (never the values themselves). |

## Choose what it looks for

All of this lives on the **Rules** tab.

- **Detection Patterns:** switch the basic types (phone numbers, email addresses, web addresses, card numbers) on or off. Turning a type off means Osaurus won't hide it *and* won't block a message that contains it.
- **My Regions:** choose which countries' ID, tax, health, and bank numbers to look for. Your Mac's region is added automatically. Click **Add region…** to add more. Removing a region never turns anything off.
- **Preset Rules:** ready-made rules for specific ID numbers, bank formats, and secrets like API keys, grouped by your regions, global, and other regions. Each group has **Enable all** and **Disable all**, and you can search. If rules recommended for your regions are off, a banner offers to **Turn on** them.
- **Custom Rules:** click **Add Rule** to hide your own terms, like customer names or project code words. **Simple** mode builds the rule for you: choose "exact word," "starts with," "contains," and so on, then type your terms. You can also give it your own label, like `[CUSTOMER_1]`.

New rules added by an update stay off until you turn them on, so an update never surprises you.

## Skip the filter for one provider

Once the filter is on, the **Per-Provider** section of the **Filter** tab lets you turn it off for a specific [provider](/glossary#provider). That's handy for a private server you already trust. Providers you haven't changed stay protected. Renaming a provider keeps your choice.

## Check what actually left your Mac

You don't have to take the filter's word for it:

1. Open **Settings… → Insights**.
2. Pick a **Cloud** entry and open **Raw**.
3. The **Server** view shows exactly what was sent to the provider and what came back.

If you see `[EMAIL_3]` there while your chat shows `alice@example.com`, the filter worked. Entries the filter changed have a hand icon, and the **Privacy-filtered** tile shows just those. See [Developer Tools](/developer-tools) for more on Insights.

## Hiding personal details in files

The Privacy Filter protects messages going to cloud models. Agents working in a [Working Folder](/glossary#working-folder) can also use the same detectors on your files, right on your Mac. They can scan a text file and report what they find, or replace the details with placeholders in one step you can undo. Only chats in the Osaurus app can change files this way; other apps connecting to Osaurus can't. See [Tasks → Bulk edits and on-device redaction](/agent-loop#bulk-edits-and-on-device-redaction).

## Limitations

- **AI detection works best in English.** Names and addresses in other languages are easier to miss. The built-in rules cover ID formats for more than 100 countries, plus emails, web addresses, IBANs, and API keys, but can't catch names.
- **It hides details, not topics.** "My medical history" goes through unchanged. Keep the review sheet on for sensitive conversations.
- **Images and audio aren't checked.** Only text is. Personal details inside a screenshot, scan, or audio clip are *not* hidden. Remove the attachment if this matters.
- **Local models don't use the filter.** Apple's on-device model and other local models never send anything off your Mac, so there's nothing to hide.
- **Very long messages are split up.** Text over about 8,000 characters is checked in pieces, so an item right at a split could be caught as two partial matches.
- **Labels don't carry between chats.** The same email gets `[EMAIL_1]` separately in two chats, and a reply can't restore a value from another chat.

## Troubleshooting

**The switch turned itself off after a restart.** Osaurus couldn't save its settings. If it keeps happening, [file an issue](https://github.com/osaurus-ai/osaurus/issues).

**The review sheet appeared, but the message looks unfiltered.** In **Insights**, check the entry's **Raw → Server** view for placeholders. If you see real personal details there, file an issue and include that entry.

**"Privacy Filter is enabled but the on-device model isn't available."** AI detection is on, but its model isn't installed or failed its check. Turn **AI detection** off on the **Filter** tab (the built-in rules keep working), or open the **Models** tab and click **Re-verify**. If it reports problems, delete the model and reinstall it.

**A message keeps getting blocked.** Something ordinary matches one of your rules (for example, text shaped like an AWS key that isn't one). Turn that preset off, or narrow it with a custom rule.

---

## Under the hood

### The pipeline

```
detect → review → scrub → send → stream back → unscrub → render
```

The pipeline is **fail-closed** on every send. If scrubbing produced no changes, or a post-scrub re-scan finds a leak, the send is blocked. Fail-closed holds per layer: with AI detection **on**, a missing or corrupt model blocks the send; with it **off**, the regex layer runs alone and never blocks on a model. The post-scrub re-scan only checks categories whose built-in pattern is enabled.

Detection runs as **two independent layers**, and results are merged so overlapping hits collapse to a single entity:

- **Deterministic regex:** built-in patterns, opt-in presets, and custom rules. Zero download.
- **On-device AI classifier** *(opt-in)*: token classification on your Mac. No third-party model ever sees your raw text.

Both toggles persist synchronously, so quitting right after toggling can't lose the setting. The toggle for AI detection on the Filter tab stays disabled while no model is installed.

### Built-in patterns

| Category | Detects |
|---|---|
| `phone` | International phone numbers (`+` country code, `00` prefix, national `0`-prefixed) and North American formats |
| `email` | Standard `local@domain.tld` addresses |
| `url` | `http(s)://…` URLs with a scheme |
| `accountNumber` | Luhn-valid credit and debit card numbers |

US Social Security numbers are the `us.ssn` preset rather than a built-in. Existing installs that had account numbers enabled keep SSN detection on through a settings migration.

### Regions and presets

**My Regions:** the first chip comes from your Mac's locale region, and that region's presets are on from first launch. **Add region…** opens a searchable picker grouped into **Detected from your Mac**, **Country-specific presets**, and **Generic coverage only**. Adding a region turns on its presets, except any you've explicitly switched off. Removing one moves its presets to **Other regions**.

| Group | Examples |
|---|---|
| **My regions / Other regions** | Per-country national ID, tax ID, health ID, passport, driver's license, and bank-account formats, e.g. `us.ssn`, `us.itin`, `us.ein`, `us.medicareMBI`, `us.abaRouting`. Many are checksum-validated (Luhn, mod-97, mod-11, Verhoeff, ISO 7064…), so a validated match outranks a generic look-alike. |
| **Global** | Generic passport / national ID / driver's license / tax ID / bank account fallbacks; finance (`iban`, `bic`, `euVAT`, `ehic`); network (`ipv4`, `ipv6`, `macAddress`); crypto (`bitcoinAddress`, `ethereumAddress`); and secrets (`awsKey`, `githubToken`, `slackToken`, `stripeKey`, `googleApiKey`, `openaiKey`, `anthropicKey`, `jwt`, `pemPrivateKey`, and more) |

On a fresh install, Osaurus enables your home region's presets plus the generic Global ID fallbacks; `iban` / `bic` turn on when a home region uses IBAN, and `euVAT` / `ehic` when it's in the EU. Every other preset, including any added by a later update, is opt-in.

### Custom rules

- **Simple** mode generates a valid regex from a match type: exact word, any of a list of terms, starts with, ends with, contains, a digit run of a given length, or everything between two markers.
- **Regex** mode takes a raw pattern, validated before save and capped at 512 characters.

Both support case-insensitive matching and a custom placeholder label (default `[SECRET_N]`). A live test panel shows matches as you type.

### On-device AI classifier

AI detection is off by default and downloads nothing until you install a model. It adds `person`, `address`, `date`, and `secret`.

| Model | Size | Notes |
|---|---|---|
| [`openai/privacy-filter`](https://huggingface.co/openai/privacy-filter) (Apache-2.0), served as [`mlx-community/openai-privacy-filter-bf16`](https://huggingface.co/mlx-community/openai-privacy-filter-bf16) | ~2.8 GB | A 1.5B-parameter sparse mixture-of-experts token classifier (~50M active per token). The most accurate option. |
| **Rampart** ([`OsaurusAI/rampart-mlx`](https://huggingface.co/OsaurusAI/rampart-mlx)) | ~37 MB | A lightweight BERT token classifier. Fast to download, minimal memory footprint. |

Both are SHA-256 verified file-by-file at install. Adjacent tokens are stitched into single spans, so `John Doe` becomes one `person`, not two.

### Placeholder format

Placeholders are `[CATEGORY_N]`, numbered per category, per conversation:

```
[PERSON_1]   [PERSON_2]   [PERSON_3]
[EMAIL_1]    [EMAIL_2]
[PHONE_1]    [URL_1]      [ADDR_1]
[ACCT_1]     [DATE_1]     [SECRET_1]
```

Placeholder maps live in memory only. They don't persist across restarts, and each chat session keeps its own.

### File tools

In-app Working Folder chats can call:

- `detect_pii`: scans a text file and reports spans by category and line number without writing.
- `redact_file`: replaces detected values with placeholders in one deterministic, undoable operation.

Both accept ephemeral `custom_rules` without changing your saved rules. If Rampart isn't installed, an attended chat can offer the ~37 MB download; declining or running headlessly continues with regex-only detection and an explicit warning. `redact_file` is denied to external HTTP and MCP callers.

### Settings reference

| Setting | Default | Description |
|---|---|---|
| **Scrub PII before sending to cloud providers** | off | Master toggle. Turns on the regex layer, no model required. |
| **AI detection (on-device model)** | off | The on-device classifier. Turns on automatically when you install a model; fails closed if the model goes missing. |
| **AI model** | OpenAI | Which backend AI detection uses: `openai/privacy-filter` (~2.8 GB) or Rampart (~37 MB). |
| **Skip Code Blocks** | on | Skip fenced and inline code spans. |
| **Always Approve by Default** | off | Still redact, but skip the review sheet for the session. |
| **Require Review for Background Requests** | on | Hold cloud-bound requests from the HTTP API, schedules, and other non-interactive callers for review (Filter → Advanced). |
| Detection Patterns | all on | Per-category built-in toggles (controls detection **and** leak check). |
| My Regions | Mac locale region | Countries whose presets are on by default. |
| Preset Rules | home-region + selected Global presets on | Everything else opt-in. |
| Custom Rules | none | Your own rules, Simple builder or regex. |
| Provider overrides | enabled | Per-provider enable/disable, keyed to the provider's stable id. |

### What's scanned

Message text, the text parts of multimodal content, tool-call arguments, and reasoning traces. Text beyond ~8,000 characters is chunked before classification. The filter attaches only to remote-provider requests; Apple Foundation Models and local MLX models bypass it.

### Where things live

| Path | Contents |
|---|---|
| `~/.osaurus/config/privacy-filter.json` | Your settings (plaintext, atomic write). If a toggle resets after restart, confirm this file is writable. |
| `~/.osaurus/aux-models/openai-privacy-filter-bf16-v1/` | The OpenAI model bundle, when installed |
| `~/.osaurus/aux-models/rampart/` | The Rampart model bundle, when installed |

---

**Related:**

- [Security & Privacy](/security) — the overall trust story and how to report a privacy bug
- [Remote Providers](/remote-providers) — cloud providers the filter applies to
- [Developer Tools](/developer-tools) — the Insights surface used to verify wire-level redaction
- [Memory](/memory) — what Osaurus *keeps* about your conversations (separate from what gets scrubbed on send)
- [Telemetry](/telemetry) — what anonymous analytics Osaurus collects, and what it never does

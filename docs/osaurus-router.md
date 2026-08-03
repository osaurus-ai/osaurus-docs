---
title: Osaurus Router
sidebar_label: Osaurus Router
description: Hosted, OpenAI-compatible inference tied to your Osaurus identity. Appears automatically in the model picker — no API key to paste.
---

# Osaurus Router

Osaurus Router is the **hosted inference path** for Osaurus accounts. It's an OpenAI-compatible remote provider that Osaurus wires up automatically once you have an [identity](/identity). You reach hosted models from the same model picker, chat, and [agent loop](/agent-loop) as everything else — no API key to paste.

Think of it as the batteries-included cloud option:

- **Local MLX models** and **Apple Foundation Models** cover the fully-offline case.
- **Your own provider keys** ([Remote Providers](/remote-providers)) cover bring-your-own-cloud.
- **Router** covers "I just want a capable hosted model with zero setup."

Your agents, memory, and tools work the same across all three.

## How it connects

Router availability follows your local Osaurus identity. When an identity is present, Osaurus adds the Router provider to your remote provider list, where it behaves like any other provider in the model picker and chat.

Router is **on by default**. Turn it off anytime with the toggle in **Management → Credits**, or disable the Router provider from **Management → Providers**.

Connection stays automatic:

- It connects on app launch alongside your other auto-connect providers.
- Signing in or changing identity reconnects Router automatically — no manual refresh.
- Waking the Mac or recovering network connectivity retries discovery on its own.
- Transient connect failures retry quietly; authentication and contract errors surface as real, terminal errors rather than spinning forever.

## Using Router

Once connected, Router's models appear in the model picker grouped under **Osaurus Router**, right alongside your local and other cloud models. Pick one and chat, or target it from an agent — it speaks standard OpenAI Chat Completions, so streaming and tool calling work exactly as they do elsewhere.

A couple of reliability details Osaurus handles for you:

- **Sensible output length.** If a request doesn't specify `max_tokens`, Osaurus sends a sane default so a long agent run isn't silently truncated by an upstream cap.
- **No silent empty answers.** If a response finishes without producing any visible text, Osaurus shows an explicit empty-response notice instead of dropping the bubble.

## Redeem credit codes

Version 0.22.15 supports promotion and referral codes in two places:

- On a fresh install, choose **Have a code? → Enter it** on the welcome screen. A successful redemption becomes the wallet's first credit action instead of the automatic welcome-credit claim.
- Later, open **Management → Credits → Have a code?**. Router and an Osaurus Identity must be enabled; account eligibility remains server-authoritative.

Codes are trimmed before submission. While a request is running, the field and controls are disabled. Success shows the campaign message, distinguishes an already-redeemed code, refreshes a non-zero balance, and offers **Redeem another code**. Referral campaigns can instead show that the reward remains pending until the first paid top-up.

Errors are intentionally actionable without exposing server eligibility detail:

- malformed or unknown code: check the code and retry;
- ineligible, frozen, or forbidden account: the code isn't available for this account;
- identity or connection failure: fix that condition and retry;
- temporary service failure: retry later;
- too many attempts: redemption is disabled until the displayed retry countdown ends.

The entered code remains in place after a retryable failure, and editing it clears the prior error.

## Billing and your privacy

Router is metered, so a few things are tracked — but **only metadata, never your content**. Prompt text, responses, tool arguments, and tool results are never written to billing records.

- **Retries are de-duplicated.** A reconnect or automatic retry won't double-bill the same logical step; a Retry you initiate starts a fresh run.
- **Local ledger.** Router charges are also recorded on your Mac at `~/.osaurus/billing/ledger.sqlite` (encrypted with your storage key when you've opted in to [storage encryption](/storage)), keeping the newest 10,000 rows for up to 365 days. This lets support debug "I was charged but saw nothing" reports without any transcripts ever leaving your machine. Each row carries correlation data (request id, model, token counts, cost, status, and how the turn rendered) — no prompt or response text. You can export a metadata-only diagnostic from the Dashboard.

## Related

- [Remote Providers](/remote-providers) — connect your own OpenAI, Anthropic, Gemini, and other provider keys
- [Models](/models) — how local, Apple Foundation, and cloud models share one picker
- [Identity](/identity) — the cryptographic identity Router availability depends on
- [HTTP API](/api) — the OpenAI-compatible surface Router uses under the hood

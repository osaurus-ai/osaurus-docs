---
title: Privacy Filter on Windows
sidebar_label: Privacy Filter
description: Before a message goes to a cloud model, Osaurus for Windows replaces personal details with placeholders and puts the real values back in the reply. On by default.
---

# Privacy Filter on Windows

Before a message goes to a [cloud model](/glossary#cloud-model), the [Privacy Filter](/glossary#privacy-filter) replaces personal details (email addresses, phone numbers, names, card numbers, and anything else you tell it to catch) with placeholders such as `[EMAIL_1]`. The provider only ever sees the placeholder. When the reply comes back, Osaurus puts the real values back in, on your PC.

It's **on by default** for every cloud model. Models that run on your PC are never filtered, because nothing leaves it. Settings are in **Settings → Privacy filter**.

:::warning[It won't catch everything]
The filter is a safety net, not a guarantee. It can miss personal details, especially names, addresses, and anything written in an unusual way or in a language other than English, and it can replace text that isn't personal. Check the card before you send, add [your own rules](#your-own-rules) for details it should always catch, and for anything that must never leave your PC, use a [model that runs on it](/windows/models) instead.
:::

## What you see in a chat

**Before sending.** When your message contains something the filter would replace, a card appears in the chat: "N items you typed will be redacted before sending". It lists each value and the placeholder it becomes.

- Click **Send redacted** to send with every value replaced.
- **Untick** a value to let it go as typed; the button then reads **Send (N items redacted)**.
- Tick **Don't ask again in this chat** to stop the card for this conversation (values are still replaced).
- **Cancel** sends nothing. A card left unanswered for 10 minutes cancels too.

**After sending.** A small shield sits on the corner of your message: solid when every value was protected, an outline when you let one through. Click it to see the message exactly as the model received it, with placeholders in place of your values.

**Values you didn't type.** Tool results, earlier replies, and agent instructions can contain personal details too. Osaurus replaces those without asking, and the reply shows a quiet **N protected automatically** link listing them.

To turn the card off and always replace without asking, turn off **Show me what I typed before it is sent**.

## What it looks for

Under **What to look for**:

- **Built in**, all on: **Email addresses**, **Phone numbers**, **Web links**, **Social security and card numbers**.
- **More patterns**, all off until you turn them on: **US Driver's License**, **US Passport Number**, **IBAN (Bank Account)**, **AWS Access Key**, **GitHub Token**.

Turn off a kind and it's neither replaced nor checked for.

### Names, addresses and ID numbers

Patterns can't spot a person's name or a street address, so Osaurus uses two small AI models, **Rampart** and **Rampart Edge**, that run on your PC. They're downloaded once from Hugging Face (about 17 MB) and nothing they read leaves your PC. Under **Use the model**:

- **Automatically**: download it, and use it once it's ready (the default).
- **Always**: refuse to send to a cloud model without it.
- **Never**: patterns only.

## Your own rules

Client names, project codenames, internal server names: add anything else that should never reach a provider under **Your rules → Add rule**.

1. Give the rule a **Name**, and choose **What it is** (it decides the placeholder's label).
2. Under **How to match**, choose **Simple** and list words or phrases one per line (or a run of digits, or everything between two markers), or **Pattern** for a regular expression.
3. Paste some text into **Test this rule** to check it, then **Save**.

**Try it** at the bottom of the page shows what would be replaced in any text you paste. Nothing is sent anywhere.

## Other settings

| Setting | Default | What it does |
|---|---|---|
| **Redact personal data sent to cloud models** | On | The filter itself. Covers chats, agents, delegated agents, automations, and apps calling Osaurus's API. Images aren't scanned |
| **Show me what I typed before it is sent** | On | The review card described above |
| **Leave code blocks alone** | On | Text in code blocks and `inline code` is neither replaced nor checked, so code reaches the model intact |
| **Refuse requests that cannot ask me** | Off | Automations, delegated agents, and other apps can't show you a review card. Off: what they send is replaced without asking. On: such a request is refused |
| **Providers** | Filtered | Turn the filter off for a provider you trust with your data, such as a server you host yourself |

An Ollama or LM Studio server you added as a provider counts as a cloud provider and is filtered, even when it runs on your PC. Turn it off under **Providers** if you like.

---

## Under the hood

- Placeholders are numbered per kind and kept for the whole conversation, so the same value always gets the same placeholder: `[EMAIL_1]`, `[PHONE_1]`, `[PERSON_1]`, `[ADDR_1]`, `[ACCT_1]`, `[URL_1]`, `[DATE_1]`, `[SECRET_1]`, or a rule's own name.
- The whole request is scanned, not just the latest message. What the provider has already received is sent again unchanged, so its prompt cache keeps working.
- Tool-call arguments and JSON results are read as values, not text, and restored before a tool runs.
- If anything that should have been replaced survives, the send is blocked.
- With **Refuse requests that cannot ask me** on, an API request that would need a review is answered with HTTP 422 `privacy_filter_review_required`. With **Always** selected and the model not installed, a cloud request fails with 503.
- The detection models are Rampart (CC BY 4.0) and Rampart Edge (CC0) from National Design Studio, running on ONNX Runtime.

---
title: Web Search
sidebar_label: Web Search
description: Native web search for every agent — keyless built-in providers out of the box, optional API providers for better quality, premium Router search, and a companion tool that extracts page content.
---

# Web Search

Web search is built into Osaurus. Every agent can discover web sources out of the box — no plugin, no API key — and you can layer on better providers when you want higher-quality results.

There are exactly two tools:

| Tool | What it does |
|---|---|
| `web_search` | Always available. Discover sources: ranked titles, URLs, and snippets from your configured providers with automatic fallback. It does not fetch page bodies. |
| `search_and_extract` | Search **plus** content extraction — fetches the top results and returns their readable text (or raw CSV/JSON data). Also accepts direct URLs. Loaded on demand via capabilities. |

The pattern the tools push models toward: use `web_search` to find sources, then `search_and_extract` to actually read one — rather than rephrasing the search over and over.

:::info[Replaces the osaurus.search plugin]
Native search supersedes the retired `osaurus.search` plugin. An existing install keeps its card in **Settings → Plugins** with a "Built into Osaurus" banner, but the plugin's tools no longer load. Provider choices and API keys are managed in **Settings → Search**.
:::

## Providers and fallback

Osaurus races and falls back across three tiers, and stamps every result set with which tier served it:

1. **Premium (Router) search** — if you're signed in with an [Osaurus account](/osaurus-router), searches can run through the hosted premium search, billed against your credits. When it can't serve a request, Osaurus falls back to the tiers below and notes why.
2. **API providers you configure** — bring your own key for higher-quality results:

   | Provider | Pricing note |
   |---|---|
   | **Tavily** (recommended) | Free tier: 1,000 searches/month |
   | **Exa** (recommended) | Free tier: 1,000 searches/month |
   | Brave Search API | Paid: $5 per 1,000 queries |
   | Serper (Google results) | Free trial credits, then paid |
   | Parallel | Paid: $5 per 1,000 searches |
   | Google Custom Search | Free tier: 100 queries/day |
   | Kagi | Paid: pay-per-use |
   | You.com | Free trial, then paid |

3. **Built-in keyless providers** — Brave and Bing result scrapers work with no setup at all, with DuckDuckGo as a deliberate last resort (its anti-bot layer can serve decoy results to automated clients).

Set up providers in **Settings → Search**: each card shows sign-up instructions, and keys are stored encrypted. You can also define **custom providers** with the same declarative request/response schema the bundled ones use — there is no privileged built-in path.

## What the model can ask for

`web_search` takes one required parameter, `query`. Optional refinements:

| Parameter | Meaning |
|---|---|
| `max_results` | How many results (1–50, default 10) |
| `time_range` | Recency: `d` day, `w` week, `m` month, `y` year |
| `site` | Restrict to a domain, e.g. `arxiv.org` |
| `filetype` | Restrict to a file type, e.g. `pdf` |
| `region` | Region code like `us-en` |
| `offset` | Pagination |
| `category` | `web`, `news`, or `images` — offered only when your enabled providers actually support more than web search |

The tools are deliberately forgiving with small local models: an unknown category falls back to web with a warning instead of an error, string numbers are accepted, time-range synonyms (`"day"`, `"week"`, …) are normalized, and unknown fields are ignored. Snippets are capped in length so local models aren't drowned in tokens.

## Reading pages with `search_and_extract`

`search_and_extract` bridges from *finding* a source to *using* it:

- **Query mode** — searches, then extracts the readable main content of the top results (default 3) as markdown, using a Readability-style extractor.
- **Direct-URL mode** — pass one or more `url` values to skip search and extract those pages directly.
- **Structured data stays raw.** CSV, TSV, and JSON endpoints are extracted untouched. Large payloads are kept out of the model's context and referenced by a `data_ref` handle that tools like `render_chart` read directly — so charting a 10,000-row CSV never round-trips the data through the model.
- With premium search, a single hosted request covers search and text extraction together; pages the hosted path can't serve fall back to local extraction per URL.

`search_and_extract` is a **dynamic built-in**: it isn't in every agent's baseline schema but loads on demand through the capabilities system (`capabilities_load`), keeping the always-on tool surface small.

## When nothing is found

A no-results outcome is reported as a structured failure with the providers that were attempted and an actionable hint — broaden the query, drop `site:`/`filetype:`/time filters, or (if you haven't added one) configure an API provider in **Settings → Search**.

---

**Related:**

- [Browser Use](/browser-use) — operate pages instead of just reading them
- [Osaurus Router](/osaurus-router) — the account behind premium search
- [Tools & Plugins](/tools) — how built-in tools and capabilities work
- [Global Proxy](/global-proxy) — routing outbound traffic through a proxy

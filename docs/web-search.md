---
title: Web Search
sidebar_label: Web Search
description: Let your agents look things up on the web — it works right away with no sign-up, and you can add a search service for better results.
---

# Web Search

Your [agents](/glossary#agent) can search the web and read pages to answer questions about current events, look up facts, or check a website. It's built in and works right away, with no sign-up or [API key](/glossary#api-key) (a password from a search company). If you want better results, you can add a search service of your own or use Osaurus's premium search.

## Get started

Web search already works. Ask an agent something that needs the web, like *"What's the weather forecast for Paris this weekend?"* or *"Summarize the latest release notes for Safari."*

For one of your own agents, check that web search is on:

1. Open **Settings…** (`⌘ ,`) → **Agents** and pick the agent.
2. Make sure the **Web Search** ability is turned on.

## How it searches

Osaurus tries the best option you have first, and falls back automatically if it doesn't work:

1. **Premium search.** If you're signed in to [Osaurus Router](/glossary#osaurus-router), searches can use Osaurus's hosted search, paid for with your [credits](/glossary#credits). If it can't answer, Osaurus moves on to the next option and notes why.
2. **A search service you add.** For higher-quality results, sign up with one of these and paste its key:

   | Service | Cost |
   |---|---|
   | **Tavily** (recommended) | Free for 1,000 searches a month |
   | **Exa** (recommended) | Free for 1,000 searches a month |
   | Brave Search API | Paid: $5 per 1,000 searches |
   | Serper (Google results) | Free trial credits, then paid |
   | Parallel | Paid: $5 per 1,000 searches |
   | Google Custom Search | Free for 100 searches a day |
   | Kagi | Paid, pay as you go |
   | You.com | Free trial, then paid |

3. **Free built-in search.** Brave and Bing work with no setup. DuckDuckGo is the last resort, because it sometimes gives automated searches fake results.

Each set of results notes which option provided it.

## Adding a search service

1. Open **Settings… → Web Search**.
2. Pick a service. Its card explains how to sign up and get a key.
3. Paste the key. Osaurus stores it encrypted.

You can also define your own custom search service; see Under the hood.

## Searching vs. reading pages

Agents have two web tools:

- **Search** finds pages: titles, addresses, and short snippets.
- **Search and read** opens the top results (or an address you give it) and reads the actual text. It also keeps spreadsheets and data files intact, so an agent can chart them.

Agents are guided to search first, then read a page, instead of rephrasing the same search again and again.

To have an agent click around and use a website, rather than just read it, see [Browser Use](/browser-use).

## Troubleshooting

**Nothing was found.** Osaurus tells you which services it tried, with a tip. Try a broader question, remove limits like a specific site or date range, or add a search service in **Settings… → Web Search**.

:::info[Replaces the osaurus.search plugin]
Web search replaces the old `osaurus.search` [plugin](/glossary#plugin). If you had it installed, its card stays in **Settings… → Tools & MCP → Plugins** with a "Built into Osaurus" banner, but it no longer does anything. Manage search services and keys in **Settings… → Web Search**.
:::

---

## Under the hood

### The two tools

| Tool | What it does |
|---|---|
| `web_search` | Discover sources: ranked titles, URLs, and snippets from your configured providers with automatic fallback. It does not fetch page bodies. |
| `search_and_extract` | Search **plus** content extraction. Fetches the top results and returns their readable text (or raw CSV/JSON data). Also accepts direct URLs. This is the fetch tool. |

Both tools are in the agent's tool list whenever web search is enabled for it (the **Web Search** ability on custom agents), and both are removed when it's off. `search_and_extract` ships alongside `web_search` rather than behind a capabilities load, so a model that has found a source can read it right away.

### Providers

Osaurus races and falls back across three tiers (premium Router search, API providers you configure, built-in keyless providers) and stamps every result set with the tier that served it. Custom providers use the same declarative request/response schema as the bundled ones; there's no privileged built-in path.

### `web_search` parameters

`web_search` takes one required parameter, `query`. Optional refinements:

| Parameter | Meaning |
|---|---|
| `max_results` | How many results (1–50, default 10) |
| `time_range` | Recency: `d` day, `w` week, `m` month, `y` year |
| `site` | Restrict to a domain, e.g. `arxiv.org` |
| `filetype` | Restrict to a file type, e.g. `pdf` |
| `region` | Region code like `us-en` |
| `offset` | Pagination |
| `category` | `web`, `news`, or `images`, offered only when your enabled providers support more than web search |

The tools are forgiving with small [local models](/glossary#local-model): an unknown category falls back to web with a warning instead of an error, string numbers are accepted, time-range synonyms (`"day"`, `"week"`, …) are normalized, and unknown fields are ignored. Snippets are capped in length so local models aren't drowned in [tokens](/glossary#token).

### `search_and_extract`

- **Query mode.** Searches, then extracts the readable main content of the top results (default 3) as markdown, using a Readability-style extractor.
- **Direct-URL mode.** Pass one or more `url` values to skip search and extract those pages directly.
- **Structured data stays raw.** CSV, TSV, and JSON endpoints are extracted untouched. Large payloads are kept out of the model's context and referenced by a `data_ref` handle that tools like `render_chart` read directly, so charting a 10,000-row CSV never round-trips the data through the model.
- With premium search, a single hosted request covers search and text extraction together; pages the hosted path can't serve fall back to local extraction per URL.

### No results

A no-results outcome is reported as a structured failure listing the providers attempted, with an actionable hint: broaden the query, drop `site:`/`filetype:`/time filters, or configure an API provider.

---

**Related:**

- [Browser Use](/browser-use): operate pages instead of just reading them
- [Osaurus Router](/osaurus-router): the account behind premium search
- [Tools & Plugins](/tools): how built-in tools and capabilities work
- [Global Proxy](/global-proxy): routing outbound traffic through a proxy

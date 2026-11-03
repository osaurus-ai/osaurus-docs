---
title: Web Search on Windows
sidebar_label: Web Search
description: How agents search the web and read pages in Osaurus for Windows — Osaurus Cloud search, your own search provider, or a SearXNG instance Osaurus runs for you.
---

# Web Search on Windows

Agents search the web with the `web_search` tool and read pages with `web_fetch`. Reading a page always works. Searching needs one of two things: Osaurus Cloud search, or a search provider you set up. Both are in **Settings → Web search**.

The Mac app also has free built-in search that needs no setup; Windows doesn't. If neither option below is set up, agents can still read pages you give them, but can't search.

## Osaurus Cloud search

Searches through your Osaurus [account](/windows/account), with nothing to configure and no API key. Turn on **Osaurus Cloud search**.

- It needs an Osaurus account, and **Osaurus Cloud** turned on in **Settings → Providers**.
- It's on by default when you have an account and haven't set up a provider of your own.
- Each account gets a number of free searches; the card shows how many are left. After that, searches cost credits if **Use your Osaurus balance when free searches run out** is on. That switch applies to your account on every device.
- When Cloud search can't answer, or the free searches are used up and paying is off, Osaurus uses your own provider instead.

## Your own search provider

Under **Web search**, choose one:

| Provider | What it needs |
|---|---|
| **SearXNG (self-hosted, no key)** | The **SearXNG base URL** of an instance you run, or let Osaurus run one (below) |
| **Brave Search** | An API key |
| **Tavily** | An API key |
| **Google Programmable Search** | An **API key** and a **Search Engine ID (cx)** |

Enter the details, click **Test** to check them, then **Save**. Keys are stored encrypted and never shown again. The change applies from the agent's next reply, with no restart.

### Let Osaurus run SearXNG

With **SearXNG** selected, the **Managed local search** panel can run a private SearXNG search engine on your PC. It needs [Docker Desktop](https://www.docker.com/products/docker-desktop/) or Podman, installed and running.

1. Turn on **Enable managed local search**.
2. Click **Set up local search**. Osaurus downloads the SearXNG image and starts it.
3. The panel then shows **Running on** and the address; **Stop** stops it.

## Searching and reading pages

- `web_search` returns up to 10 results (5 by default), and can limit them to the past day, week, or month, or to or away from particular sites.
- `web_fetch` reads one page: web pages, PDFs, and JSON, XML, or plain text. A long page is read a section at a time. It refuses addresses on your own PC or local network.
- If a page can't be read directly and Osaurus Cloud search is on, Osaurus may fetch it through Osaurus Cloud instead.

Web search isn't a separate ability on Windows: an agent has both tools when its **Tools** ability is on, unless its **Which tools** setting (under **Tools** settings) is **Manual** and the list leaves them out.

## Different from the Mac

- No free built-in search; set up Osaurus Cloud search or a provider.
- Four providers: SearXNG, Brave Search, Tavily, and Google Programmable Search. Exa, Serper, Parallel, Kagi, You.com, and custom services aren't on Windows.
- No **Web Search** ability in the agent editor, and no `search_and_extract` tool: agents search, then read the pages they choose.

## Troubleshooting

| What you see | What to do |
|---|---|
| The agent says it can't search the web | Turn on **Osaurus Cloud search**, or choose a provider and **Save**. |
| "Osaurus Cloud isn't enabled as a provider" | Turn on **Osaurus Cloud** in **Settings → Providers**. |
| Cloud search says it needs an account | Create or restore one in **Settings → Account**. |
| "Search test failed" | Check the key (or the SearXNG address) and that the service is reachable. |
| "No container runtime found" | Install and start Docker Desktop or Podman, or enter the address of a SearXNG you run yourself. |

---

## Under the hood

- `web_search(query, count, freshness, site, exclude_sites)`: `count` 1–10 (default 5); `freshness` `day`, `week`, or `month`; up to 5 `exclude_sites`. The tool is offered only when a provider is complete or Cloud search is on.
- `web_fetch(url, offset, max_chars, focus)`: 30-second timeout, 10 MiB limit, results cached for 15 minutes. Web pages are converted to Markdown; `focus` picks the passages most relevant to a question. Private, loopback, and link-local addresses are refused.
- Managed SearXNG runs as a container through the `docker` or `podman` command, whichever answers first.

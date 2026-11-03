---
title: Browser Use on Windows
sidebar_label: Browser Use
description: Give an agent a web browser of its own on Windows — turn it on, sign it in to sites, keep logins in an encrypted vault, and decide which actions ask you first.
---

# Browser Use on Windows

An agent with the browser turned on gets a web browser of its own, separate from yours and from every other agent's. It can open pages, read them, click, and fill in forms, and it asks you before anything that commits you to something. It works as [Browser Use](/browser-use) describes on the Mac, with the differences below.

## Turn it on

1. Open **Settings → Agents** and edit the agent.
2. On the **Abilities** tab, turn on **Web browser**. The **Tools** card must be on too.
3. Save.

The browser is off for every agent until you turn it on. The Orchestrator never browses; ask it to delegate to an agent that does.

When the agent browses, a card in the chat shows the live page, each step in plain words, and the sites it visited. **Watch** opens the page beside the chat, and **Stop** ends the browsing while the rest of the reply carries on.

## The browser pane

**Ctrl+Shift+B**, or the globe button in the title bar, opens the selected agent's browser beside the chat. The globe shows a badge while the pane is closed: when the agent is browsing, and when it's waiting for you.

- **Take over** gives you the page; the agent waits until you click **Resume agent**.
- Type an address to go somewhere yourself. Closing the pane doesn't close the agent's browser.

## Signing in to sites

There are two ways to get an agent signed in. Either way, the model never sees a password.

**Sign in yourself, once.** Open the pane, click **Open browser**, and sign in to the sites the agent works with. It stays signed in. After you sign in, Osaurus offers to save the login for the agent: tick **Let the agent sign in with it without asking** if you like, then **Save**.

**Let it use a saved login.** In **Settings → Browser → Saved logins**, click **Add login** and enter the **Website**, **Username**, and **Password**. Under **Agents**, tick **May use this login** for each agent allowed to use it, on that exact website only. Unless you also turn on **Sign in without asking**, the agent asks you each time. Osaurus types the password into the page itself.

Saved logins are stored encrypted on this PC. To see a saved password, click **Show password** and confirm with Windows Hello.

**When the agent needs you.** If a page needs something only you can do, such as a code from your phone, the agent hands the page to you. Do what's needed, optionally add a note, and click **Hand back** (Ctrl+Enter), or **Decline**. It waits 5 minutes by default, then carries on without you.

## What asks you first

| Action | Asks you? |
|---|---|
| Reading pages, following links a page showed | Never |
| Typing, choosing options | Only when the agent asks before each tool call (its **Permissions** tab, or **Settings → Behavior → Tool approvals** when it follows that setting) |
| Submitting a form; clicking buttons such as Send, Buy, Pay, Delete, Sign in, Post | Always |
| Going to, or typing on, a site your request didn't name | Always |
| Signing in with a saved login that isn't set to sign in without asking | Always |

When you approve an action on a site, that site becomes trusted for that agent, so typing there no longer asks. Trusted sites are listed in **Settings → Behavior → Remembered approvals**, where you can forget them. A browser approval never offers **Always allow**: every consequential action asks.

Agent browsers can't download files or upload them, and only open web (http and https) pages.

## Managing agent browsers

**Settings → Browser → Agent browsers** lists each agent with a browser, its last page, and whether it's **Browsing** or **Open**.

- **Show** opens it beside the chat.
- **Sign out of everything…** clears that agent's cookies and sign-ins. Its saved logins stay.

A page left idle closes after 15 minutes and reopens at the same place next time.

## Built-in protection

Every agent browser blocks ads, trackers, and most cookie banners on its own, with nothing to set up: Microsoft Edge's strict tracking prevention, plus the uBlock Origin Lite extension, downloaded the first time it's needed.

## Different from the Mac

- Turn it on with the **Web browser** ability, not under Subagents.
- There are no autonomy levels: the table above is the rule for every agent.
- Windows has a saved-login vault and lets you take over the page; the Mac uses a separate sign-in window.
- There's no **Reset All Sessions**; sign each agent out on its own.
- Cookie contents are never available to the agent.

## Troubleshooting

| What you see | What to do |
|---|---|
| "The browser needs the Osaurus app" or a message about WebView2 | The browser runs on the Microsoft Edge WebView2 runtime, which Windows 11 includes. If it was removed, [install it](https://developer.microsoft.com/microsoft-edge/webview2/) and restart Osaurus. |
| No **Web browser** card in the editor | It's only on agents you create, not the Orchestrator. |
| "Tools are off, so it can only talk" | Turn on **Tools** on the agent's **Abilities** tab. |
| "Reached its step limit" on the card | The agent stopped at its step limit and reports what it found. Ask it to continue, or narrow the request. |

---

## Under the hood

- The engine is Microsoft Edge WebView2, with one profile per agent in the data folder. Pages are driven over the Chrome DevTools Protocol.
- The parent agent sees one tool, `browser_use(goal, max_steps)`; `max_steps` defaults to 24 (at most 100), and a run stops after 15 minutes. A child run does the browsing with its own `browser_*` tools and returns a summary.
- Every action is classified from the live page element, not from what the model calls it, and checked again just before it runs; a page that changed in between is refused.
- A saved password is typed into the page by Osaurus and scrubbed from every tool result and log.
- The ad blocker is a pinned uBlock Origin Lite release, installed only if its SHA-256 matches.

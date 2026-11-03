---
title: Claude Code on Windows
sidebar_label: Claude Code
description: Use Claude Sonnet, Opus, and Haiku in Osaurus for Windows through your signed-in Claude Code, on your Claude Pro or Max subscription, with no API key.
---

# Claude Code on Windows

If you have Claude Code installed and signed in, Osaurus can use it as a provider: Claude's models in your Osaurus chats, on your Claude Pro or Max subscription, with no API key to paste and nothing for Osaurus to store. Osaurus runs your own `claude` command and never sees your credentials.

On a Mac, Claude Code is a [Runtime](/harness-runtimes). On Windows it's a provider: its models sit in the model picker beside every other model, and Osaurus's agents, tools, and approvals work with it as they do with any model.

## Set it up

1. **Install Claude Code** if you haven't. In a terminal:

   ```powershell
   npm install -g @anthropic-ai/claude-code
   ```

   Anthropic's own Windows installer works too.
2. In **Settings → Providers**, Osaurus shows **Claude Code is available**. Click **Use Claude Code**. (Or **Add provider → Use Claude Code**, or the **Claude Code** chip during setup.)
3. If it says **Claude Code isn't signed in**, click **Sign in with Claude** and finish in your browser, using the Anthropic account that has your subscription. Running `claude` in a terminal and signing in there works too; then click **Check again**.
4. When the card says **Signed in and ready**, pick **Claude Code · Sonnet**, **Opus**, or **Haiku** in the model picker.

## Using it

- **Reasoning effort** in the picker sets how hard the model thinks, from **Low** to **Max**. The levels come from your Claude Code version.
- **Tools and approvals.** Claude Code's own tools are switched off. It uses Osaurus's tools instead, so every file edit or command goes through the same approval card as any other model ("Claude Code wants to …"), and Osaurus records file changes for undo.
- **Where it works.** A chat with a folder attached runs in that folder. Otherwise it runs in the **Default working folder** set on the provider's page (an Osaurus scratch folder unless you choose one).
- **What it costs.** Requests draw on your subscription's limits, shared with your terminal sessions. A model marked **Usage credits** in the picker is billed to your Claude usage credits instead; turn extra usage off in your Claude account if you don't want that. If your sign-in isn't a Pro or Max subscription, requests bill through whatever credential Claude Code is set up with.

## Troubleshooting

| Message | Fix |
|---|---|
| "Claude Code isn't installed" | Install it (above), then click **Check again**. If it's installed somewhere unusual, set the `OSAURUS_CLAUDE_PATH` environment variable to the `claude` command and restart Osaurus. **Already installed? Show where Osaurus looked** lists the places it checked |
| "Claude Code isn't signed in" | **Sign in with Claude**, or run `claude` in a terminal and sign in |
| "Claude Code hit a subscription rate limit" | Your plan's limit for now; wait for it to reset, or switch models |
| "Claude Code has no embeddings endpoint" | Claude Code can't do embeddings; set another provider for them |

---

## Under the hood

- Each turn runs `claude` as a child process, with the prompt on standard input and its built-in tools disabled. Osaurus's tools reach it through Osaurus's own MCP server, granted per turn, and Osaurus's approval gate decides each call.
- Osaurus replaces Claude Code's system prompt with the agent's own, so the model isn't told about tools it doesn't have, and turns off Claude Code's auto-memory and its loading of `CLAUDE.md` files.
- `ANTHROPIC_API_KEY`, `ANTHROPIC_AUTH_TOKEN`, `ANTHROPIC_BASE_URL`, and the Bedrock, Vertex, and Foundry switches are removed from its environment, so it always uses its own sign-in rather than a key it happened to inherit.
- Each conversation keeps its own Claude Code session, so a follow-up continues rather than re-sending the whole thread.
- The [Privacy Filter](/windows/privacy-filter) applies, as for any cloud model.

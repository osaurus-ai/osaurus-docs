---
title: Runtimes
sidebar_label: Runtimes
description: Run an agent's chats on Claude Code, Pi, or another outside agent program instead of Osaurus's own loop, and switch back anytime.
---

# Runtimes

A [runtime](/glossary#runtime) decides who runs an agent's chats. Normally that's Osaurus itself. You can also hand an agent to an outside agent program, such as **Claude Code** or **Pi**. The outside program brings its own model, tools, and conversation history. Osaurus starts it, passes along your messages, shows its replies in the chat, and stops it when you're done.

Use a runtime when you already like another agent program and want it inside Osaurus's chat window, or when you want to use your Claude Pro or Max subscription through your own signed-in Claude Code. You need the program installed on your Mac. Claude Code also needs to be signed in.

## Get started with Claude Code

Claude Code is set up as a runtime for you the first time Osaurus opens. To use it:

1. Install [Claude Code](https://docs.anthropic.com/en/docs/claude-code) and sign in once.
2. Open **Settings… (`⌘ ,`) → Agents → Runtimes**. Click **Test** on the Claude Code row to check that Osaurus can reach it. If it says you aren't signed in, click **Sign In**. That opens Claude Code's own sign-in in your browser. Osaurus never sees your password.
3. In a chat with the agent, open the model picker. Each runtime has its own column next to the model providers. Under **Claude Code**, choose **Sonnet**, **Opus**, or **Haiku**.

That agent's chats now run on Claude Code, including its later chats. To switch back, pick any ordinary model in the picker.

You can also choose the runtime in the agent's settings: **Settings… → Agents →** the agent **→ Configure → Runtime → Runs on**. The picker and this setting change the same thing.

## Add Pi or another runtime

Pi, and agent programs built on Pi, talk to Osaurus through Pi's RPC mode.

1. Open **Settings… → Agents → Runtimes** and click **Add Runtime**.
2. Fill in the form:
   - **Protocol**: **Pi (RPC)** (or **Claude Code** for a second Claude Code entry).
   - **Name**: what you'll see in the picker and agent settings.
   - **Executable**: the program, like `pi`, or the full path to it.
   - **Arguments**: one per line. For Pi, include `--mode` and `rpc`. Add `--session-id` and `{chat_id}` so a chat can pick up where it left off after a restart.
   - **Environment**: optional `NAME=value` lines. These are saved without encryption, so don't put passwords or keys here.
3. Click **Test**. Osaurus starts the program once to make sure it answers.
4. Pick the runtime for an agent in the chat's model picker or under **Configure → Runtime → Runs on**.

## Claude Code options

When an agent runs on Claude Code, **Claude Code Options** appear in its **Configure** tab:

| Option | What it does |
|---|---|
| **Claude model** | Sonnet, Opus, or Haiku. These follow whatever Claude Code currently means by each name. |
| **Execution mode** | **Agent** lets Claude Code read and search files in the chat's folder. **Text only** turns off every tool, so it only writes replies. |
| **Allow file changes** | Lets Claude Code edit files, but only inside the chat's folder. |
| **Allow shell commands** | Lets Claude Code run commands. Osaurus can't limit what those commands touch. |
| **Allow Osaurus read tools** | Lets Claude Code use Osaurus tools the agent is allowed to use. |
| **Allow Osaurus configuration changes** | Lets Claude Code change Osaurus settings. Only on the [Orchestrator](/glossary#orchestrator). |

Requests use your Claude subscription's limits, shared with your Claude Code sessions in Terminal.

## What changes when an agent uses a runtime

- **Each chat gets its own copy of the program.** It starts with your first message and keeps running between messages.
- **It works in the chat's folder.** If the chat has no [Working Folder](/glossary#working-folder), it gets a private scratch folder. Changing the folder restarts the program after the current reply finishes. You can't change the folder while a reply is running.
- **The program brings its own tools and memory.** Osaurus abilities, [memory](/glossary#memory), and the [Sandbox](/glossary#sandbox) don't apply to that agent.
- **Your chat history stays in Osaurus** even if the program restarts.
- **Stop works.** Osaurus asks the program to stop. If it doesn't stop within a few seconds, Osaurus closes it and starts a fresh one on your next message.

Some things don't work with runtime agents yet. Other agents can't [delegate](/glossary#delegation) to them, and they don't appear in the Orchestrator's list. Computer Use, Browser Use, and AppleScript can't target them. In each case you get an error that names the runtime. Osaurus never quietly runs the agent its own way instead.

## Safety

A runtime is a program on your Mac running with your account's access. Osaurus limits Claude Code's file changes to the chat's folder. It can't limit shell commands or a Pi program's tools. Only add runtimes you trust, and keep **Allow shell commands** off unless you need it. When the Orchestrator sets up a runtime for you, adding it always needs your [approval](/glossary#approval).

## Troubleshooting

- **"Not signed in" on Claude Code.** Click **Sign In** on the Runtimes page, or run `claude` in Terminal and sign in. Then click **Test** again.
- **The program isn't found.** Use the full path in **Executable**. Osaurus searches the same places your Terminal does, including tools installed with Homebrew, mise, nvm, or asdf.
- **A Pi chat forgets earlier messages after a restart.** Add `--session-id` and `{chat_id}` to the runtime's arguments.
- **The runtime switch is grayed out.** You can't switch while a reply is running. Wait for it to finish or click Stop.
- **Delegation to this agent fails.** Runtime agents can't take delegated work yet. Pick an ordinary model for the agent, or delegate to a different agent.

---

## Under the hood

### Configuration

Runtimes live in `~/.osaurus/config/harness-runtimes.json`. The [declarative configuration](/configuration#declarative-configuration) registers them under `harness_runtimes` and moves agents onto them with `runtime`:

```yaml
harness_runtimes:
  - name: Spotlight
    kind: pi_rpc            # claude_code | pi_rpc; required to add, fixed after
    executable: ~/.local/bin/spotlight
    arguments: ["--mode", "rpc", "--session-id", "{chat_id}"]
    environment: { PI_LOG_LEVEL: info }   # plain values only

agents:
  - name: Researcher
    runtime: Spotlight      # or "builtin"
default_agent:
  runtime: Claude Code
  claude_code: { model: opus, allow_writes: true }
```

Runtimes apply before agents, so one document can add a runtime and move an agent onto it. A `runtime` that names no registered runtime fails validation and never falls back to `builtin`. Adding a runtime, changing its command line or environment, moving an agent onto a runtime, and turning on `allow_shell` or `allow_osaurus_config_writes` are high-risk plan lines. An [Osaurus Bundle](/bundles#harness-runtimes) can also ship a runtime.

Earlier releases ran Claude Code as `claude-code/<alias>` models under Providers. On launch, any agent that used one of those IDs moves to the Claude Code runtime with that alias as its Claude model. An agent that already has an explicit runtime keeps it.

### Argument placeholders

| Placeholder | Value |
|---|---|
| `{chat_id}` | The Osaurus chat UUID (lowercase) |
| `{agent_id}` | The agent UUID (lowercase) |
| `{cwd}` | The process's working directory |
| `{system_prompt_file}` | A private (0600) file holding the agent's system prompt, for example `--append-system-prompt {system_prompt_file}` |

### Process lifecycle

- One process per chat, started on the first message. The working directory is the chat's folder or `~/.osaurus/harness/<chat id>/`. An unreadable folder fails the turn with an error naming it.
- The process restarts on the next message after the chat folder, the agent's system prompt, its Claude Code options, or the runtime's settings change, or after it exits. A running turn is never interrupted for a restart.
- Claude Code resumes with `--resume <chat id>`. Pi resumes only when its arguments key the session on `{chat_id}`.
- **Stop** sends Pi `{"type":"abort"}` and Claude Code a stream-json `interrupt`. If the turn hasn't settled 8 seconds later, the process is killed.
- **Shutdown** closes stdin, then sends `SIGTERM` after 5 seconds and `SIGKILL` 3 seconds later. This happens when the chat closes, the agent moves to another runtime, the runtime is edited or deleted (idle processes only), and when Osaurus quits.
- stdout is JSON Lines split on LF only. A bounded stderr tail is shown when the process exits unexpectedly.

### Environment

| Variable | Value |
|---|---|
| `OSAURUS_CHAT_ID` | The chat UUID, stable across restarts |
| `OSAURUS_AGENT_ID` | The agent UUID |
| `OSAURUS_AGENT_TOKEN` | A credential scoped to that agent. Send it as `Authorization: Bearer <token>` |
| `OSAURUS_API_BASE` | The local server, for example `http://127.0.0.1:1337`. The OpenAI-compatible API is under `/v1` |
| `OSAURUS_WORKING_DIRECTORY` | The process's starting directory |
| `OSAURUS_MCP_BRIDGE_GRANT` | The same token, under the name `osaurus mcp` reads |

These always win over the runtime's own environment lines; other `OSAURUS_*` names are reserved. `PATH` is the login-shell `PATH`. `CLAUDECODE` is removed, and for Claude Code `ANTHROPIC_API_KEY` is removed so runs stay on the signed-in subscription.

### The agent token

`OSAURUS_AGENT_TOKEN` is minted per process, passed only through the environment, and revoked when the process exits or Osaurus quits. It's honored only from loopback, even when the server is exposed to the network. It can call:

| Route | Use |
|---|---|
| `GET /health`, `GET /mcp/health` | Liveness |
| `GET /mcp/tools`, `POST /mcp/call` | Osaurus tools, as the agent |
| `GET /v1/models`, `/v1/tags`, `/v1/show` | Model discovery |
| `POST /v1/chat/completions`, `/v1/completions`, `/v1/messages`, `/v1/responses` | Inference on Osaurus's local and cloud models |

Anything else returns `403 harness_token_scope`. On the MCP routes the token never widens the agent's permissions:

- Only tools the agent's own settings allow are listed and callable. Tools set to **Ask** are refused, since nobody can approve from inside a harness.
- `osaurus_config` runs only for the Default agent with **Allow Osaurus configuration changes** on.
- Always refused: `spawn_agent`, the loop control tools (`todo`, `complete`, `clarify`, `speak`), and `prompt_working_folder`.
- Computer Use, Browser Use, AppleScript, and Mac query return an "external harness" error.

### Pi RPC

Osaurus speaks Pi's `--mode rpc` protocol (tested against Pi 0.83). It sends one `prompt` per user message (newest only; images as base64, documents inlined as text), `abort` on Stop, and `extension_ui_response` for dialogs. It reads `message_update` text and thinking deltas, `tool_execution_*` as tool activity, `auto_retry_*` / `compaction_*` / `extension_error` as notices, `extension_ui_request` dialogs, `message_end` usage, and `agent_settled` as the end of the turn. Osaurus can't confine a Pi harness's tools; narrow them with `--tools` in the arguments.

### Claude Code

```
claude --print --input-format stream-json --output-format stream-json --verbose
       --include-partial-messages --strict-mcp-config --model <alias>
       (--session-id | --resume) <chat id> <permission flags>
       [--mcp-config <file>] [--append-system-prompt-file <file>] <runtime arguments>
```

**Agent** mode runs with `--permission-mode dontAsk` and an allow list: `Read`, `Grep`, `Glob`; `Edit(//<real folder path>/**)` with **Allow file changes**; `Bash` with **Allow shell commands**; and the Osaurus MCP tools (through `osaurus mcp`) with **Allow Osaurus read tools**. **Text only** disables every tool. The system prompt goes through a 0600 file, never argv.

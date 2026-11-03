---
title: Sandbox and contained commands on Windows
sidebar_label: Sandbox
description: Where agents' commands run on Windows — contained to the folder you attach, or in each agent's own sandbox when no folder is attached. Windows or Linux (WSL) engines, internet access, packages, and secrets.
---

# Sandbox and contained commands

Agents can read and write files and run commands. Osaurus for Windows keeps that work in one of two places:

- **In a folder you attach.** The agent works on your real files there. Osaurus can **contain** its commands so they can change only that folder and can't read your credentials, browser data, or other files.
- **In the agent's own sandbox**, when no folder is attached. Each agent gets a home folder of its own, sealed off from your files, where it can install packages, build things, and run code.

Settings are in **Settings → Sandbox**, and per agent in its editor under **Abilities → Files & commands**.

## Which one a chat uses

1. **A folder is attached:** the agent works in that folder. An attached folder always wins.
2. **No folder:** the agent works in its own sandbox, if the sandbox is on for it.
3. **The sandbox is off** for this agent or this chat: the agent has no file or command tools in that chat.

When a chat would use the sandbox, a **sandbox** chip appears in the message box. Click it to run that one chat without the sandbox, and again to turn it back on. Right-click it for **Sandbox settings…**. Tool cards that ran there carry a **Sandbox** chip.

The [Orchestrator](/orchestrator) never gets a folder or a sandbox: its job is setting Osaurus up.

**Approvals.** Work inside an agent's own sandbox home doesn't ask for approval: nothing there touches your files. Anything outside it, and any "always deny" you've set, still applies.

## Contained commands in your folder

**Settings → Sandbox → Contain commands on this PC** turns containment on for the whole PC. Each agent also has its own switch, **Contain its commands**, on by default.

A contained command:

- **can change only the attached folder** (plus temporary and package-cache folders it needs);
- **can't read your credentials or private data**: Osaurus's own data folder, SSH and cloud-tool credentials, browser profiles, and Windows's credential stores are off limits;
- **can see the names of files elsewhere, but not what's in them**, which tools such as npm and dotnet need;
- can't reach Osaurus's own server.

Tool cards for contained commands carry a **Contained** chip. If a command fails because it hit the boundary, Osaurus tells the agent so, and the agent can explain or ask you to change the setting.

**Internet access** for contained commands is the agent's **Network for contained commands**: **Open** (the default), **Allowed domains only** (the list under **Sandbox options → Sites it may reach**), or **No network**.

Containment needs **Windows 11 24H2 or later with the August 2026 update**. Until the October 2026 update, npm and dotnet can't fetch packages in a contained command; Osaurus says so on the page. On a PC that can't contain commands, they run as before, with your full access, and still ask before running.

## The agent's own sandbox

### Engines

Choose under **Settings → Sandbox → Engine**:

| Engine | What it is | Setup |
|---|---|---|
| **Windows (no setup)** | Commands run in PowerShell in the agent's home folder, contained by Windows. Packages through pip and npm | None. Needs the same Windows version as contained commands |
| **Linux (WSL)** | A small Linux computer inside your PC. Agents can also install system packages and use [plugins](/glossary#plugin) | Set up once; the first start downloads packages and takes a few minutes |
| **Automatic (recommended)** | Windows where this PC can contain commands, otherwise Linux | |

Each engine keeps its own home folders, so switching engines doesn't move files between them.

**Use the sandbox** turns it on or off for every agent. With the Windows engine it's on from the start, because there's nothing to set up. With Linux, click **Set up** the first time; after that it starts on its own when an agent needs it, or with Osaurus if **Start with Osaurus** is on.

### Per-agent settings

In the agent's editor, **Abilities → Files & commands**:

| Setting | Default | What it does |
|---|---|---|
| **Use its own sandbox** | Default | **Default** follows the sandbox page (on once the sandbox is ready); **On** or **Off** decide for this agent |
| **Keep things running** | Off | Lets it start local servers and other long jobs, each with a **Stop** button on its card |
| **Build its own tools** | On | Lets it make small plugins that call an API (Linux engine) |
| **Commands per turn** | 10 | How many commands it may run in one reply (1–200) |
| **Sites it may reach** | (none) | Domains allowed when its network is limited, one per line; `*.example.com` covers subdomains |
| **Secrets** | | API keys its commands get as environment variables |

### Internet access

- **Linux engine:** **Settings → Sandbox → Internet access**: **Full** (the default), **Only allowed domains** (each agent reaches only the domains in its **Sites it may reach**, and package installs still reach their registries), or **Off** (nothing, so no package installs either). Changes apply the next time the sandbox starts.
- **Windows engine:** set per agent with **Network for contained commands**. Under **Allowed domains only**, a pip or npm install can still reach its registry while it runs.

### Packages and secrets

Agents install what they need themselves (pip and npm on both engines; system packages with apk on Linux). The tool card reads **Installing packages**.

When an agent needs an API key, a **Secret needed** card appears in the chat. Paste the value and click **Save**. The value is stored encrypted for that agent only and handed to its commands as an environment variable; **the agent never sees it**, and it's removed from anything a command prints. You can also add or remove secrets in the agent's editor under **Files & commands → Secrets**.

### Maintenance

At the bottom of **Settings → Sandbox**:

- **Agents' home folders → Open** shows each agent's files.
- **Reset** (Linux) rebuilds the sandbox from its image. System packages are removed; home folders are kept.
- **Remove** (Linux) deletes the sandbox's virtual machine and image to free disk space. Home folders are kept, and the next start sets it up again.
- **Diagnostics → Copy** copies the sandbox's status as JSON, for a bug report.

## Troubleshooting

| Message | Fix |
|---|---|
| "The sandbox needs WSL containers" | Run `wsl --update` (WSL 3.0.1 or newer), then restart Osaurus |
| "The sandbox needs the Virtual Machine Platform Windows feature" | Turn it on in **Turn Windows features on or off**, then restart the PC |
| "Your organization has turned off WSL containers on this PC" | Ask your IT administrator, or use the **Windows (no setup)** engine |
| "The installed WSL is newer than this Osaurus build's container SDK supports" | Update Osaurus from the Microsoft Store |
| "This version of Windows can't contain commands" | Install Windows updates (24H2 with the August 2026 update) |
| An agent says a site isn't one of its allowed domains | Add it to the agent's **Sites it may reach** |

---

## Under the hood

- Home folders: `%LOCALAPPDATA%\osaurus\sandbox-windows\agents` (Windows engine) and `%LOCALAPPDATA%\osaurus\container\workspace\agents` (Linux engine, `/workspace/agents` inside the sandbox).
- Containment uses Windows's MXC container support. The Linux engine runs on WSL containers; its image is built on your PC from a pinned base image, never pulled ready-made.
- In the Linux sandbox each agent is its own Linux user. Under **Only allowed domains**, traffic goes through a filtering proxy on the host that resolves every name itself and refuses local-network and loopback addresses.
- Secrets reach commands through a temporary environment file, never the command line, and are scrubbed from output line by line.
- An automation (a [schedule](/schedules), [watcher](/watchers), or self-booked wake-up) with no folder starts the sandbox before it runs, and is skipped with the reason if it can't.

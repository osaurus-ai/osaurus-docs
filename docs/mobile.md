---
title: Mobile
sidebar_label: Mobile
description: Pair the Osaurus iPhone app with your Mac using a 6-digit code, then chat with your agents from anywhere — end-to-end encrypted, with everything still running on your Mac.
---

# Mobile

The **Osaurus iPhone app** is a remote for your Mac. Pair it once with a 6-digit code, and you can chat with your [agents](/glossary#agent), pick up your Mac chats, and approve what an agent wants to do, all from your phone. [Models](/glossary#model), [tools](/glossary#tool), [memory](/glossary#memory), and files stay on the Mac. The phone sends messages and gets replies over an [end-to-end encrypted](/glossary#end-to-end-encryption) connection.

You need the Osaurus iPhone app and Osaurus running on your Mac.

## Get started {/* #pairing */}

Open **Settings…** (`⌘ ,`) → **Mobile** on your Mac, then:

1. Make sure your iPhone and Mac are on the **same network**. Pairing only works over the local network.
2. Open Osaurus on your iPhone.
3. On the Mac, click **Generate Pairing Code** under **Pair an iPhone**. Confirm with Touch ID or your password when asked.
4. Type the 6-digit code into the iPhone app.

The code expires after **5 minutes**, works only once, and is discarded after 5 wrong guesses. Click **Cancel** to throw it away early.

:::tip[Code button greyed out?]
If the Mac only accepts connections from itself, the Mobile tab shows a banner: *"This Mac only accepts connections from itself."* Click **Allow** to open the server to your local network so the phone can reach it.
:::

The phone finds your Mac on its own. On networks that make that hard, such as office and guest Wi-Fi, it searches the network instead. As a last resort, you can type in the Mac's address and port.

The phone doesn't need your [recovery phrase](/glossary#recovery-phrase). Pairing gives it its own [access key](/glossary#access-key) that covers every agent on this Mac.

### The paired iPhone

**Paired iPhone** shows the phone's name, when it paired, and how long its access lasts (90 days; pair again to renew).

- **One iPhone per Mac.** Pairing a new phone unpairs the old one.
- **Unpair** revokes the phone's key immediately. You can also unpair from the phone itself.
- A phone paired from the iOS Simulator shows a **Simulator** badge.

## Settings

| Setting | Default | What it does |
|---|---|---|
| **Reach From Anywhere** | On | While a phone is paired, turns on [Public Links](/relay) (through Osaurus's [relay](/glossary#relay)) for your agents so the iPhone works away from your home or office network. Traffic stays end-to-end encrypted between the iPhone and this Mac. A status row shows how many agents are reachable. |
| **Keep Mac Awake for Paired iPhone** | On | Prevents idle system sleep while a phone is paired, so your agents stay reachable. The display can still sleep, and closing a MacBook lid or choosing **Sleep** always wins. |
| **Continue Phone Chats on This Mac** | On | When you come back to the Mac after using a chat on your phone, that chat opens in front, ready to pick up where you left off. |

**Continue Phone Chats** only acts if you used the phone while you were away. "Back" means the screen unlocks, or the mouse or keyboard moves after 5 minutes idle. Phone chats older than 3 hours are ignored.

## How the phone connects

The phone keeps two routes to your Mac and uses whichever answers:

- **Local network** — used when the Mac answers quickly on the same Wi-Fi.
- **Relay** — used when you're away (requires **Reach From Anywhere**).

Either way, every request travels inside the [Secure Channel](/secure-channel): it's scrambled on the phone and unscrambled only on your Mac, so the relay can't read it. If the Mac is asleep, offline, or has the relay off, the phone shows it as unreachable.

## What you can do from the iPhone

- **Chat with your agents**, including the [Orchestrator](/glossary#orchestrator). Your phone is the one remote device that can reach it. Each agent's quick actions come along, including the Orchestrator's configuration shortcuts.
- **Continue your Mac chats.** Browse, search, and filter your chat history; rename, pin, or archive chats; and keep going in any chat. New turns land in the same chat on the Mac, live if it's open. Chats started on the phone are marked as phone chats.
- **Choose models.** Use the same picker as the Mac, including favorites and per-model options like Thinking or Reasoning Effort. You can also change an agent's default model.
- **Watch tool use.** See what the agent's tools are doing as it happens, with what they were asked, what they returned, and how long they took, plus the **Worked for** time on each response.
- **Answer the Mac's prompts.** Handle [approvals](/glossary#approval) for tools, setup plans from the Orchestrator, [Computer Use](/computer-use) steps, password requests, and [Privacy Filter](/privacy-filter) reviews from the phone, so a run doesn't stall until you're back at the Mac.
- **Manage agents.** Create a new agent, view an agent's [system prompt](/glossary#system-prompt), and turn tools on or off or change their permission.
- **Use workspace agents.** Chat with teammates' [shared agents](/workspaces) through your Mac.
- **Make voice calls.** Speech recognition and synthesis run on the phone. Only the transcript and the reply text cross the network.

### Runs that outlive the connection

iOS suspends apps soon after they leave the screen, which drops the connection. Your phone's runs keep going on the Mac anyway. When you reopen the app, it rejoins the run where it left off, or you can stop it. The Mac remembers finished runs for 30 minutes. After that, the phone simply reloads the chat.

## Security model

- **Pairing is local and short-lived.** The code only works on the local network (never through the relay), lasts 5 minutes, and works once. The phone's access key is encrypted for the phone, so it never crosses the network in readable form.
- **Everything after pairing is end-to-end encrypted** over the Secure Channel. There's no unencrypted fallback.
- **You can revoke it anytime.** **Unpair** on the Mac cuts the phone off immediately, and keys expire after 90 days.
- **The same guardrails still apply.** Tools that need approval still ask, now on your phone or the Mac. Some tools are always off-limits from outside the Mac, including running commands, changing files on the Mac itself, [chat-app channels](/agent-channels), and [Apple app](/apple-apps) tools.

:::warning[Check the paired device name]
The pairing code travels unencrypted on your local network. Someone actively attacking that network could grab it during its 5-minute window and pair before you do. If that happens, your phone's pairing fails and the Mac shows *their* device name under **Paired iPhone**. **Unpair** it and generate a new code on a trusted network.
:::

## Troubleshooting

**The phone can't find the Mac.** Check that both are on the same Wi-Fi and that you clicked **Allow** if the Mobile tab says the Mac only accepts connections from itself. If it still can't, type in the Mac's address and port on the phone.

**The phone says the Mac is unreachable away from home.** Make sure **Reach From Anywhere** is on and the Mac is awake and online.

---

## Under the hood

- **Discovery:** the phone finds the Mac over Bonjour, falls back to scanning its own subnet, and finally accepts a manually entered host and port.
- **Relay address:** away from the local network, the phone uses `https://<agent-address>.agent.osaurus.ai`.
- **Pairing key:** the phone's access key covers every agent on this Mac, valid for 90 days, and encrypted to the phone during pairing.
- **Phone runs** follow the same external deny list as other remote callers: shell, host file writes, agent channel tools, and Apple app tools are blocked.

---

**Related:**

- [Identity](/identity) — the keys behind pairing
- [Secure Channel](/secure-channel) — the end-to-end encryption every phone request uses
- [Public Links](/relay) — the relay that makes **Reach From Anywhere** work
- [Security & Privacy](/security) — the full trust model

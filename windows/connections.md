---
title: Connecting apps and devices on Windows
sidebar_label: Apps & Devices
description: Point other apps at Osaurus's local server, create access keys, open Osaurus to your network, pair with another Osaurus PC or Mac, and add an agent someone shared with you.
---

# Connecting apps and devices

While Osaurus runs, its server answers on `http://127.0.0.1:1337`. Apps that work with OpenAI, Anthropic, or Ollama can use your Osaurus models by pointing at that address: editors, chat clients, scripts. You can also pair with another Osaurus, on Windows or a Mac, and chat with its agents from here. Settings are in **Settings → Devices → Connections**.

To link your own devices so your chats follow you, see [Devices & Sync](/windows/devices) instead.

## Connect an app on this PC

1. In the app, set the base URL (sometimes called endpoint or API host) to `http://127.0.0.1:1337`. Most apps also accept `http://127.0.0.1:1337/v1`.
2. Leave the API key empty, or type anything if the app insists.
3. Pick a model. `osaurus list` in a terminal prints every id you can use (see [CLI](/windows/cli)).

Apps on this PC need no key by default. Two exceptions:

- **Require an access key from this PC** (under **Callers on this PC**) makes other programs, other Windows accounts, and web pages send a key too, for everything but chat completions and the model list. The Osaurus app itself keeps working.
- **Osaurus Cloud requests from other apps** need a key unless **Let local apps spend credits without a key** is on in **Settings → Account → Account**, so a script can't spend your balance unnoticed.

The full list of endpoints is in the [HTTP API](/api) reference.

## Access keys

Under **Access keys**, click **Create key**:

- **Name** it after the app or device that will use it.
- **Account-wide access** on lets the key reach models, MCP, every agent, and settings. Off, it runs only the agents you tick under **Agents this key may run**.

Click **Create**, then **Copy** the key and give it to the app, which sends it as `Authorization: Bearer <key>`. The list shows each key as **Account-wide** or the number of agents it may run. You can reveal a key again later, switch it off, or delete it.

## Open Osaurus to your network

Under **Network access**, set **Bind address** to `0.0.0.0` and click **Apply**, then restart Osaurus. Other devices can now reach Osaurus at your PC's network address.

- **An access key is required.** Osaurus stays on this PC only until at least one key exists, and every caller from another device must send one.
- The connection isn't encrypted by itself. Use it on networks you trust, or pair devices (below), which encrypts everything.

`osaurus serve --expose` does the same from a terminal.

## Another Osaurus

Pairing connects this PC with another Osaurus, Windows or Mac, so you can chat with its agents from here.

1. Click **Connect to a remote Osaurus**. Pick it from the Osaurus devices on your network, or type its **Host** and **Port**, then click **Continue**.
2. Check the agent address shown against what the other machine shows.
3. Click **Pair**. Someone at the other machine has to click **Allow** within two minutes.

Both machines need an [Osaurus account](/windows/account). A paired machine joins your sidebar as an agent you can chat with.

When another device asks to pair with this PC, Osaurus shows **Allow this device to connect?** with the device and the agent it wants. Access lasts 90 days unless you tick **Keep this access permanently**. Paired devices are listed under **Paired devices**, where you can switch one off or remove it.

- **Discoverable on this network** lists which of your agents other Osaurus devices can see. The built-in Orchestrator is never shared.
- **Shared inference → Share my models for inference** lets paired agents, workspace teammates, and invite-link connections run your models from their own machine: their agent and files, your hardware. Each request uses your graphics card, and a cloud model bills your key or account. Off, they see no models.

All traffic between paired machines is end-to-end encrypted through the [Secure Channel](/secure-channel).

## Add an agent someone shared with you

Someone can share one of their agents with you as an invite link (see [Share an agent](/windows/agents#share-an-agent)). Click the link and Osaurus opens **Add this shared agent?**, showing the agent and the address your messages will go to.

1. Check the agent is the one you expect.
2. Leave **Open a chat when paired** ticked to start chatting right away.
3. Click **Add agent**.

The agent joins your sidebar and runs on their computer, with their model and tools. Adding it gives them no access to anything on your PC. An invite works once and expires; if it fails, ask the sender for a fresh one.

If a dialog is already open when the link arrives, Osaurus waits for you to close it and then shows the invite.

---

## Under the hood

- The OpenAI, Anthropic, and Ollama dialects share one port. Paths work with or without a `/v1` or `/api` prefix.
- Reading your recovery phrase, stopping the server, and several other settings routes answer only callers on this PC, whatever key another device holds.
- A web page open in your browser is never treated as "this PC": it must be listed under **Allowed browser origins** (and send a key while one is required).
- A caller that comes through the relay or another device is never local, even when the request arrives on 127.0.0.1.
- An unanswered **Allow this device to connect?** prompt denies itself after 120 seconds.
- Invite links are `osaurus://` links. Osaurus checks the signature and expiry before showing the dialog, and refuses a link whose address isn't on the Osaurus relay.

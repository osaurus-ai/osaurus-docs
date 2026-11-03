---
title: Connecting apps and devices on Windows
sidebar_label: Apps & Devices
description: Point other apps at Osaurus's local server, create access keys, open Osaurus to your network, and pair with another Osaurus PC or Mac.
---

# Connecting apps and devices

While Osaurus runs, its server answers on `http://127.0.0.1:1337`. Apps that work with OpenAI, Anthropic, or Ollama can use your Osaurus models by pointing at that address: editors, chat clients, scripts. Settings are in **Settings → Connections**.

## Connect an app on this PC

1. In the app, set the base URL (sometimes called endpoint or API host) to `http://127.0.0.1:1337`. Most apps also accept `http://127.0.0.1:1337/v1`.
2. Leave the API key empty, or type anything if the app insists.
3. Pick a model. `osaurus list` in a terminal prints every id you can use.

Apps on this PC need no key by default. Two exceptions:

- **Require an access key from this PC** (under **Callers on this PC**) makes local apps send a key too, for everything but chat completions and the model list.
- **Cloud and Osaurus Cloud requests from other apps** need a key unless **Settings → Account → Let local apps spend credits without a key** is on, so a script can't spend your money unnoticed.

The full list of endpoints is in the [HTTP API](/api) reference.

## Access keys

Create one under **App access → Create key**:

- **Name** it after the app or device that will use it.
- **Account-wide access** on gives **Full access**: models, tools, agents, and settings. Off, the key is **Scoped to agents**: it can run only the agents you pick.

Copy the key when it's shown and give it to the app, which sends it as `Authorization: Bearer <key>`. You can reveal it again later, switch it off, or delete it.

## Open Osaurus to your network

Under **Network access**, set **Bind address** to `0.0.0.0` and click **Apply**, then restart Osaurus. Other devices can now reach Osaurus at your PC's network address.

- **An access key is required.** Osaurus refuses to listen on the network until at least one key exists, and every caller from another device must send one.
- The connection isn't encrypted by itself. Use it on networks you trust, or pair devices (below), which encrypts everything.

`osaurus serve --expose` does the same from a terminal.

## Another Osaurus

**Connect to a remote Osaurus** pairs this PC with another Osaurus, Windows or Mac, so you can chat with its agents from here. Pick it from the list of Osaurus devices on your network, or type its address, then click **Pair**. Someone at the other machine has to click **Allow** within two minutes. Both machines need an [Osaurus account](/windows/account).

When another device asks to pair with this PC, Osaurus shows **Allow this device to connect?** with the device and agent it wants. Access lasts 90 days unless you tick **Keep this access permanently**. Paired devices are listed under **Paired devices**, where you can switch one off or **Remove** it.

- **Discoverable on this network** lists which of your agents other Osaurus devices can see. The built-in Orchestrator is never shared.
- **Shared inference → Share my models for inference** lets paired machines run your models with their own agents and files. Each request uses your graphics card, and a cloud model bills your key or account. Off, they see no models.

All traffic between paired machines is end-to-end encrypted through the [Secure Channel](/secure-channel).

---

## Under the hood

- The OpenAI, Anthropic, and Ollama dialects share one port. Paths work with or without a `/v1` or `/api` prefix.
- Reading your recovery phrase, stopping the server, and several other settings routes answer only callers on this PC, whatever key another device holds.
- A web page open in your browser is never treated as "this PC": it must be listed under **Allowed browser origins** (and send a key while one is required).
- A caller that comes through the relay or another device is never local, even when the request arrives on 127.0.0.1.

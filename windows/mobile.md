---
title: Using your agents from an iPhone
sidebar_label: iPhone
description: Pair the Osaurus iPhone app with your Windows PC with a 6-digit code, and reach your agents at home or away, end-to-end encrypted.
---

# Using your agents from an iPhone

The Osaurus app for iPhone talks to the agents on your PC: chat with them, answer their approval cards, and pick up the conversation on either device. Your PC does the work; the phone is a window onto it. Settings are in **Settings → Mobile**.

You need an [Osaurus account](/windows/account) on the PC, at least one agent of your own, and the iPhone on the same network as the PC while you pair. See [Mobile](/mobile) for the iPhone app itself.

## Pair your iPhone

1. If Osaurus only accepts connections from this PC, the page says **Not on your network**: click **Open Connections** and share it on your network first. See [Apps & Devices](/windows/connections#open-osaurus-to-your-network).
2. Open Osaurus on your iPhone and start pairing.
3. On the PC, click **Generate Pairing Code**. Windows Hello asks you to confirm it's you.
4. Type the 6-digit code into the iPhone. The code lasts 5 minutes, works once, and stops working after 5 wrong tries.

The iPhone can then use every agent on this PC for 90 days, until you unpair it. Only one iPhone can be paired at a time; pairing a new one unpairs the old one. To stop it, click **Unpair**: its access ends immediately.

## Away from home

Turn on **Reach From Anywhere** to use your agents when the iPhone isn't on your network. The connection goes through the Osaurus [relay](/relay), and stays end-to-end encrypted between the iPhone and your PC; the relay can't read it.

Your PC has to be on and Osaurus running. **Keep PC Awake for Paired iPhone** stops the PC from going to sleep on its own while an iPhone is paired (choosing **Sleep** or closing a laptop lid still wins).

## Back at your PC

With **Continue Phone Chats on This PC** on, a chat you used on the iPhone opens in front when you come back to the PC.

## What the iPhone can do

- Chat with your agents, and continue chats from the PC.
- Answer approval cards, including the Orchestrator's setup changes.
- Answer [Privacy Filter](/windows/privacy-filter) reviews for chats started on the phone.
- Supply a secret an agent asks for.

---

## Under the hood

Pairing uses a password-authenticated key exchange (SPAKE2): the code never travels over the network, and every exchange uses up one of its 5 tries. The iPhone gets its own access key, sealed to the device, which works only inside the encrypted [Secure Channel](/secure-channel) when it connects from another machine. See [Mobile](/mobile) for the protocol.

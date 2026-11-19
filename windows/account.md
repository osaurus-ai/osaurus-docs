---
title: Your Osaurus account on Windows
sidebar_label: Account
description: Your Osaurus account is a key held on your PC. Create one, back up its 24-word recovery phrase, add credits for Osaurus Cloud, or restore the account you use on a Mac.
---

# Your Osaurus account

Your Osaurus account is a key held on your PC, not a username and password on a server. It pays for [Osaurus Cloud](/glossary#osaurus-cloud) models, it lets your agents pair with your phone and other machines, and its recovery phrase can also restore your synced chats. It's the same thing the Mac calls your [Osaurus ID](/glossary#osaurus-id): use one account on a Mac and a PC and both share one balance. Settings are in **Settings → Account → Account**.

Local models are free and don't need an account.

## Create an account

If setup connected you to Osaurus Cloud, Osaurus already made one. Otherwise, the page says **No account on this machine**: click **Create account**.

Osaurus then shows your **recovery phrase**: 24 words that are the only way to recover your account or use it on another machine. There's no cloud backup on Windows, and Osaurus can't recover it for you.

1. Hold **Hold to show** to see the words, and write them down. There's no Copy button, so the words never pass through your clipboard. You can also click **Save to file**.
2. Type the two words Osaurus asks for, to show you wrote them down.
3. Click **Done**. **Not yet** closes the dialog without finishing.

## Back up your recovery phrase

If you skipped it, or setup created your account for you: click **Show recovery phrase**. Osaurus asks you to confirm it's you (Windows Hello), then shows the words while you hold **Hold to show**. **Hide** puts them away. Anyone who sees these words can use your account and its balance, so don't do this while sharing your screen.

## Credits

**Credits** shows your balance for Osaurus Cloud models. Click **Add credits**, choose an amount (at least $5.00), and click **Continue to checkout**; payment finishes in your browser, and a service fee is added at checkout as its own line. **Recent spend** lists what was billed.

**Let local apps spend credits without a key** is off by default, so another app on your PC can't run Osaurus Cloud models on your balance without an [access key](/windows/connections#access-keys). The Osaurus app itself is unaffected either way.

## Use your Mac account on this PC

1. Click **I already have one** (or **Restore a different account** if this PC already has one).
2. Type or paste the 24-word recovery phrase from your Mac. On a Mac, it's on the **Osaurus ID** page in Settings.
3. Check the address under **This phrase restores** matches your Mac's, then click **Restore account**.

Replacing an account makes the old one's balance unreachable from this PC unless you've saved its recovery phrase.

Restoring your account here also links [sync](/windows/devices#your-recovery-phrase) to it, unless this PC already syncs with other devices.

---

## Under the hood

- The 24 words encode the account's key directly (BIP39 entropy). The key is stored in `%LOCALAPPDATA%\osaurus\wallet.key`, protected with Windows DPAPI, and survives **Settings → Privacy → Data → Reset Osaurus** while **Keep my Osaurus account** is ticked. Agents' addresses are derived from it. See [Osaurus ID](/identity).
- While the recovery phrase is on screen, the window is kept out of screenshots and screen captures.
- While sync is linked to the account, its recovery phrase is derived from the account's key, so one phrase restores both.

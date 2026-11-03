---
title: Your Osaurus account on Windows
sidebar_label: Account
description: Your Osaurus account is a key held on your PC. Create one, back up its 24-word recovery phrase, add credits for Osaurus Cloud, or restore an account you use on a Mac.
---

# Your Osaurus account

Your Osaurus account is a key held on your PC, not a username and password on a server. It pays for [Osaurus Cloud](/glossary#osaurus-cloud) models, and it's what lets your agents pair with your iPhone and other machines. Use the same account on a Mac and a PC and both share one balance. Settings are in **Settings → Account**.

Local models are free and don't need an account.

## Create an account

If you chose **Osaurus Cloud** during setup, Osaurus already created one. Otherwise, click **Create account**.

Osaurus then shows your **recovery phrase**: 24 words that are the only way to recover your account or use it on another machine. There's no cloud backup, and Osaurus can't recover it for you. Copy it or click **Save to file**, keep it somewhere safe, and click **I've saved it**.

## Back up your recovery phrase

If you skipped it, or setup created your account for you: click **Show recovery phrase**. Windows Hello asks you to confirm it's you first. Anyone who sees these words can use your account, so don't do this while sharing your screen.

## Credits

**Credits** shows your balance for Osaurus Cloud. Click **Add credits** to top up (at least $5.00); payment finishes in your browser. **Recent spend** lists what was billed.

**Let local apps spend credits without a key** is off by default, so another app on your PC can't run Osaurus Cloud models on your balance without an [access key](/windows/connections#access-keys).

## Use your Mac account on this PC

1. Click **I already have one** (or **Restore a different account** if this PC already has one).
2. Type or paste the 24-word recovery phrase from your Mac (on a Mac it's under **Identity**, in **Settings…**).
3. Check the address shown matches your Mac's, then click **Restore account**.

Replacing an account makes the old one's balance unreachable from this PC unless you've saved its recovery phrase.

---

## Under the hood

The 24 words encode the account's key directly (BIP39 entropy). The key is stored beside Osaurus's data in `%LOCALAPPDATA%\osaurus`, protected with Windows DPAPI, and survives **Reset Osaurus…** while **Keep my Osaurus account** is ticked. Agents' addresses are derived from it. See [Identity](/identity).

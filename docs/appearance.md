---
title: Appearance
sidebar_label: Appearance
description: Make Osaurus light or dark, or follow your Mac, and make the text bigger or smaller.
---

# Appearance

Osaurus can look light or dark, or follow whatever your Mac is set to. You can also make all the text bigger or smaller, which is handy on a large display or if you find small text hard to read.

## Change light or dark

1. Click **Settings** (the gear at the bottom of the narrow strip on the left edge of the window).
2. Click **General**.
3. Under **Appearance**, choose:
   - **System**: follows your Mac. If your Mac switches to dark in the evening, so does Osaurus.
   - **Light**
   - **Dark**

The change applies to every Osaurus window straight away.

A quicker way: in the menu bar at the top of the screen, choose **View → Appearance**.

## Make text bigger or smaller

In the same place, drag **Text Size**. It goes from 70% to 160%, and 100% is normal. Everything in Osaurus scales with it, including chats, Settings and workflows.

You can also use the menu bar: **View → Zoom In** makes text bigger, and **View → Zoom Out** makes it smaller.

## Where did custom themes go?

Earlier versions of Osaurus let you design your own color themes. That's gone in Osaurus 1.0. If you were using a custom theme, Osaurus switched to Light or Dark to match it. There are no per-agent themes either. See [Upgrading from Osaurus Classic](/upgrading).

---

## Under the hood

- **Settings:** General → **Appearance** has **Appearance** (System, Light, Dark) and **Text Size** (70% to 160%, default 100%). Both are settings-only: they aren't part of the [declarative configuration](/configuration), so the Orchestrator can point you to them but not change them.
- **View menu:** **View → Appearance** sets the same value. **Zoom In** and **Zoom Out** change **Text Size**.
- **Removed in 1.0:** the theme gallery, theme editor, theme import and sharing, per-agent themes, and `~/.osaurus/themes/`.

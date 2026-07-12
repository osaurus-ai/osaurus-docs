---
title: Themes
sidebar_label: Themes
description: Built-in light/dark themes plus a full custom-theme editor with import/export. Bind a theme to an agent so it activates automatically.
sidebar_position: 13
---

# Themes

Make Osaurus look the way you want. Pick from the built-in light and dark themes, or use the editor to customize colors, glass material, typography, animation timing, even the shape of message bubbles. Bind a theme to an agent so it activates whenever that agent does — useful as a visual cue that you're talking to your code reviewer vs. your therapist.

## Quick start

1. Open the Management window (`⌘ ,`) → **Themes**
2. Click any theme to apply it
3. Click **Edit** on a custom theme to tweak it (built-in themes are read-only)
4. Click **Create** to start a new theme from scratch (or duplicate an existing one)

## Built-in themes

Osaurus ships with a curated set of light and dark themes. They're read-only — duplicate one to customize it.

## Custom themes

The theme editor exposes every visual variable Osaurus uses. Changes preview live as you make them.

### Sections of a theme

| Section | What it controls |
|---|---|
| **Metadata** | Name, version, author |
| **Colors** | Text, backgrounds, accents, borders, semantic colors (success/warn/error), code blocks, selection, cursor |
| **Background** | Solid color, gradient, or image (with optional overlay) |
| **Glass** | macOS material (HUD, sidebar, popover, …), blur radius, opacity layers, edge light, optional tint |
| **Typography** | Primary and mono fonts, plus title / heading / body / caption / code sizes |
| **Animations** | Quick / medium / slow durations; spring response and damping |
| **Shadows** | Card shadow opacity, radius, vertical offset (idle and hover) |
| **Messages** | Bubble corner radius, opacity, optional override colors, border width, edge-light toggle |
| **Borders** | Default width, card corner radius, input corner radius, border opacity |

### Background types

| Type | What it needs |
|---|---|
| `solid` | Just a hex color (or use `colors.primaryBackground`) |
| `gradient` | An array of hex colors and an angle in degrees |
| `image` | Base64-encoded image data, fit mode (`fill` / `fit` / `stretch` / `tile`), and opacity |

You can layer an `overlayColor` over any background type.

### Glass materials

Glass is the macOS vibrancy effect Osaurus uses for its windows and overlays. Pick the underlying material:

| Material | Notes |
|---|---|
| `hudWindow` | Default — feels like a HUD overlay |
| `sidebar` | Slightly more saturated, good for left-edge panels |
| `popover` | Tighter contrast, useful for compact overlays |
| `windowBackground` | Closer to standard window chrome |
| `headerView`, `selection`, `menu`, `sheet`, `titlebar`, `toolTip`, `contentBackground`, `underWindowBackground`, `underPageBackground`, `fullScreenUI` | Less common; available for full control |

Glass can be turned off entirely (`glass.enabled: false`) for a flat, solid look.

## Import and export

Themes are JSON files. To share or back up:

- **Export** — Right-click a custom theme → **Export** → save the `.json`
- **Import** — Click **Import** → pick a `.json` file

On import, `metadata.id` is ignored (a new UUID is generated) and `isBuiltIn` is forced to `false` so imports never collide with the built-in set.

## Bind a theme to an agent

Each [agent](/agents) has an optional `themeId`. When that agent becomes active, its theme activates automatically. Useful for visual cues:

| Window | Agent | Theme |
|---|---|---|
| Code Assistant | "Code" | Dark blue |
| Therapist | "Calm" | Warm beige |
| Researcher | "Research" | High-contrast light |

The theme reverts when you switch back to an agent without a bound theme.

## File format

Top-level shape:

```json
{
  "metadata": { ... },
  "colors": { ... },
  "background": { ... },
  "glass": { ... },
  "typography": { ... },
  "animationConfig": { ... },
  "shadows": { ... },
  "messages": { ... },
  "borders": { ... },
  "isBuiltIn": false,
  "isDark": true
}
```

Notes:

- Colors are hex strings: `"#RRGGBB"` for opaque, `"#AARRGGBB"` for alpha (e.g. `"#80FF0000"` is 50% transparent red).
- Dates are ISO 8601: `"2026-01-15T00:00:00Z"`.
- `messages` and `borders` are optional — they fall back to defaults if omitted.
- All other top-level sections are required.

### Minimal example

A minimal dark theme using only required fields:

```json
{
  "metadata": {
    "id": "anything",
    "name": "My Theme",
    "version": "1.0",
    "author": "Your Name",
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-01T00:00:00Z"
  },
  "colors": {
    "primaryText": "#f9fafb",
    "secondaryText": "#a1a1aa",
    "tertiaryText": "#8b8b94",
    "primaryBackground": "#0f0f10",
    "secondaryBackground": "#18181b",
    "tertiaryBackground": "#27272a",
    "sidebarBackground": "#141416",
    "sidebarSelectedBackground": "#2a2a2e",
    "accentColor": "#60a5fa",
    "accentColorLight": "#93c5fd",
    "primaryBorder": "#3f3f46",
    "secondaryBorder": "#52525b",
    "focusBorder": "#60a5fa",
    "successColor": "#22c55e",
    "warningColor": "#fbbf24",
    "errorColor": "#f87171",
    "infoColor": "#60a5fa",
    "cardBackground": "#18181b",
    "cardBorder": "#3f3f46",
    "buttonBackground": "#18181b",
    "buttonBorder": "#3f3f46",
    "inputBackground": "#18181b",
    "inputBorder": "#52525b",
    "glassTintOverlay": "#00000030",
    "codeBlockBackground": "#00000059",
    "shadowColor": "#000000",
    "selectionColor": "#3b82f680",
    "cursorColor": "#3b82f6"
  },
  "background": { "type": "solid" },
  "glass": {
    "enabled": true,
    "material": "hudWindow",
    "blurRadius": 30,
    "opacityPrimary": 0.10,
    "opacitySecondary": 0.08,
    "opacityTertiary": 0.05,
    "edgeLight": "#ffffff33",
    "windowBackingOpacity": 0.55
  },
  "typography": {
    "primaryFont": "SF Pro",
    "monoFont": "SF Mono",
    "titleSize": 28,
    "headingSize": 18,
    "bodySize": 14,
    "captionSize": 12,
    "codeSize": 13
  },
  "animationConfig": {
    "durationQuick": 0.2,
    "durationMedium": 0.3,
    "durationSlow": 0.4,
    "springResponse": 0.4,
    "springDamping": 0.8
  },
  "shadows": {
    "shadowOpacity": 0.3,
    "cardShadowRadius": 12,
    "cardShadowRadiusHover": 20,
    "cardShadowY": 4,
    "cardShadowYHover": 8
  },
  "isBuiltIn": false,
  "isDark": true
}
```

## Storage

Custom themes live as JSON in `~/.osaurus/themes/{uuid}.json`.

---

**Related:**

- [Agents](/agents) — bind a theme to an agent for automatic switching
- [Chat](/chat) — the overlay this all applies to

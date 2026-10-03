---
title: Themes
sidebar_label: Themes
description: Change how Osaurus looks — follow your Mac's light or dark mode, pick a ready-made theme, design your own, and share themes with a link.
---

# Themes

Themes change how Osaurus looks: colors, backgrounds, the frosted-glass effect, fonts, and even the shape of chat bubbles. Pick a ready-made theme, design your own, or install one someone else shared. You can also give each [agent](/glossary#agent) its own theme, so you can tell at a glance which one you're talking to. There's nothing to install.

## Get started

1. Open **Settings…** (`⌘ ,`) → **Themes**.
2. Click **Apply Theme** on any theme card.
3. To go back, click **Reset to Default**, or apply **System**.

To find a theme quickly, use the search box or the filters along the top: **All**, **Built-in**, **Local**, **Imported**, **Shared**, **Needs Review**, and **Duplicates**.

## Built-in themes

**System** is the default. It follows your Mac's light or dark appearance and switches when macOS does. Because it simply mirrors macOS, you can't edit, export, share, or delete it.

Osaurus also comes with a set of ready-made light and dark themes. The default themes match the standard macOS look and **follow your Mac's accent color**: if your Mac uses purple highlights, so does Osaurus.

You can't change a built-in theme directly, but you can use one as a starting point:

1. Open the **⋯** menu on a built-in theme and choose **Edit**.
2. Make your changes.
3. Click **Save as Copy**. Osaurus saves your version as a new theme and leaves the original alone.

You can also choose **Duplicate** from the same menu to make a copy first.

## Making your own theme

1. Click **Create Theme** at the top of the Themes screen, or choose **Edit** or **Duplicate** from a theme's **⋯** menu.
2. Adjust the theme. Changes preview live as you go.
3. Click **Save**.

The editor is organized into sections:

| Section | What it changes |
|---|---|
| **Metadata** | The theme's name, version, and author |
| **Colors** | Text, backgrounds, accents, borders, success/warning/error colors, code blocks, selection, and cursor |
| **Background** | A solid color, a gradient, or a picture, with an optional color wash on top |
| **Glass** | The frosted-glass look of windows: style, blur, see-through levels, edge highlight, and tint. You can also turn it off for a flat look. |
| **Typography** | The main and code fonts, and text sizes for titles, headings, body, captions, and code |
| **Animations** | How fast things move and how bouncy they feel |
| **Shadows** | How strong card shadows are, normally and when you hover |
| **Messages** | Chat bubble corners, see-through level, optional colors, border, and edge highlight |
| **Borders** | Border thickness, card and input-box corner roundness, and border strength |

## Sharing themes

### Share a link

1. Open the **⋯** menu on a theme and choose **Share**.
2. Osaurus uploads the theme so anyone with the link can install it. You may be asked to authenticate so Osaurus can sign the upload as yours.
3. When it says **Theme uploaded**, use the **Share Link** section: click **Copy** to copy the link, scan the QR code, or click **Open Web** to see the theme's web page.

When someone opens your link, Osaurus opens to Themes and offers to install it. Under **Advanced details**, the share sheet also shows the **Theme ID** and **Web URL**.

### Install a shared theme

1. Click **Import → From Link or ID…**.
2. In the **Import by ID** sheet, paste a Theme ID, share link, or web address. The **Paste** button fills it in from your clipboard.
3. Click **Import**.

To find more themes, click **Browse Community Themes** to open the community gallery at osaurus.ai/themes.

### Export and import files

You can also pass themes around as files:

- **Export:** open a theme's **⋯** menu and choose **Export**, then save the file.
- **Import:** click **Import → From File…** and pick a theme file.

An imported theme always gets its own new identity, so it never replaces a built-in theme or one you already have.

## Give an agent its own theme

1. Open **Settings… → Agents** and pick an agent.
2. Go to **General → Appearance**.
3. Under **Visual Theme**, pick a theme. Choose **Default** for no special theme.

Whenever you switch to that agent, its theme turns on. When you switch back to an agent without a theme, Osaurus goes back to your usual theme. For example:

| Agent | Theme |
|---|---|
| Code Assistant | Dark blue |
| Calm | Warm beige |
| Researcher | High-contrast light |

## Troubleshooting

If themes look wrong or go missing, open the manage menu at the top of the Themes screen. It has **Library Health**, **Clear Preview Cache**, **Rollback to Default**, and **Reinstall Built-in Themes**.

---

## Under the hood

### Background types

| Type | What it needs |
|---|---|
| `solid` | Just a hex color (or use `colors.primaryBackground`) |
| `gradient` | An array of hex colors and an angle in degrees |
| `image` | Base64-encoded image data, fit mode (`fill` / `fit` / `stretch` / `tile`), and opacity |

You can layer an `overlayColor` over any background type.

### Glass materials

Glass is the macOS vibrancy effect Osaurus uses for its windows and overlays. The underlying material:

| Material | Notes |
|---|---|
| `hudWindow` | Default; feels like a HUD overlay |
| `sidebar` | Slightly more saturated, good for left-edge panels |
| `popover` | Tighter contrast, useful for compact overlays |
| `windowBackground` | Closer to standard window chrome |
| `headerView`, `selection`, `menu`, `sheet`, `titlebar`, `toolTip`, `contentBackground`, `underWindowBackground`, `underPageBackground`, `fullScreenUI` | Less common; available for full control |

Glass can be turned off entirely with `glass.enabled: false`.

### Sharing internals

Shared themes are uploaded to `https://themes.osaurus.ai`. A Theme ID is a 64-character hex hash. Share links use the form `osaurus://themes-install?hash=<id>`, and the public web URL is `https://themes.osaurus.ai/themes/<id>`. **Import by ID** accepts any of the three.

On file import, `metadata.id` is ignored (a new UUID is generated) and `isBuiltIn` is forced to `false`, so imports never collide with the built-in set. Saving an edited built-in theme writes a copy with `isBuiltIn: false`.

Each agent stores its bound theme as an optional `themeId`.

### File format

Themes are [JSON](/glossary#json-yaml) files. Top-level shape:

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
  "isDark": true,
  "followsSystemAccent": false
}
```

Notes:

- Colors are hex strings: `"#RRGGBB"` for opaque, `"#AARRGGBB"` for alpha (e.g. `"#80FF0000"` is 50% transparent red).
- Dates are ISO 8601: `"2026-01-15T00:00:00Z"`.
- `messages` and `borders` are optional; they fall back to defaults if omitted.
- `followsSystemAccent` is optional (default `false`). When `true`, the accent-adjacent colors (`accentColor`, `accentColorLight`, `focusBorder`, `cursorColor`, `selectionColor`, `sidebarSelectedBackground`, `infoColor`) are re-derived from the user's macOS system accent when the theme is applied; the stored hex values are used as-is when the system accent matches the theme's authored accent.
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

### Storage

Custom themes live as JSON in `~/.osaurus/themes/{uuid}.json`.

---

**Related:**

- [Agents](/agents): give an agent its own theme
- [Chat](/chat): the window themes apply to

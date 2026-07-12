# Osaurus Docs

Documentation site for [Osaurus](https://osaurus.ai) — the local-first AI harness for Apple Silicon. Live at [docs.osaurus.ai](https://docs.osaurus.ai).

Built with [Docusaurus 3](https://docusaurus.io/). Docs are served from the site root (`routeBasePath: "/"`), so `docs/intro.md` is the homepage.

## Requirements

- **Node.js 20+** (Node 22 LTS recommended)
- **npm** (this repo uses `package-lock.json`; do not use yarn or pnpm)

## Development

```bash
npm install
npm start
```

Starts a local dev server at `http://localhost:3000` with hot reload.

## Build

```bash
npm run build
```

Generates the static site into `build/`. The build fails on broken internal links (`onBrokenLinks: "throw"`), so run it before pushing content changes.

To preview the production build locally:

```bash
npm run serve
```

## Typecheck

```bash
npm run typecheck
```

## Project layout

| Path | Purpose |
|------|---------|
| `docs/` | All documentation pages (Markdown/MDX) |
| `sidebars.ts` | Sidebar structure (manual, source of truth for ordering) |
| `docusaurus.config.ts` | Site config: navbar, footer, SEO, plugins, redirects |
| `src/css/custom.css` | Osaurus brand theme (light + dark palettes) |
| `src/components/` | Custom React components exposed to MDX |
| `src/theme/MDXComponents.tsx` | Registers components for use in any doc without imports |
| `static/img/` | Logos, social cards, and other static assets |

## Writing docs

- Every page needs `title` and `description` frontmatter.
- Mermaid diagrams are supported via fenced ` ```mermaid ` code blocks.
- Custom MDX components available in any doc: `<Icon name="..." />`, `<GitHubStats />`, `<JourneyCards>`/`<JourneyCard>`.
- Adding a page? Register it in `sidebars.ts` — pages not in the sidebar are unreachable.

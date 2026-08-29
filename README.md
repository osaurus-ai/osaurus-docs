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

## Sync with upstream

`upstream-baseline.json` records the exact Osaurus source commit and latest stable release covered by these docs. The commit may be ahead of the release when the docs intentionally track current `main`. Before a refresh:

```bash
UPSTREAM=osaurus-ai/osaurus
BASE=$(jq -r .documented_commit upstream-baseline.json)
DOCUMENTED_RELEASE=$(jq -r .documented_release upstream-baseline.json)
LATEST_RELEASE=$(gh release view --repo "$UPSTREAM" --json tagName --jq .tagName)
DOCUMENTED_RELEASE_SHA=$(gh api "repos/$UPSTREAM/commits/$DOCUMENTED_RELEASE" --jq .sha)

gh release view "$LATEST_RELEASE" --repo "$UPSTREAM"
gh api "repos/$UPSTREAM/compare/$BASE...main" \
  --jq '{status, ahead_by, commits: [.commits[] | {sha, message: .commit.message}]}'
gh api "repos/$UPSTREAM/compare/$DOCUMENTED_RELEASE_SHA...$BASE" \
  --jq '{status, ahead_by, commits: [.commits[] | {sha, message: .commit.message}]}'
```

The first comparison finds drift since the last review. The second identifies behavior documented from `main` but not yet present in the recorded stable release. Reconcile every affected document against the chosen source commit and release, then run `npm run typecheck` and `npm run build`. Advance the baseline only after that review and both gates complete successfully.

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

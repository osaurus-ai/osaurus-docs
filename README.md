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
| `src/css/custom.css` | Osaurus brand theme, mirroring the osaurus.ai design system |
| `src/components/` | Custom React components exposed to MDX |
| `src/theme/MDXComponents.tsx` | Registers components for use in any doc without imports |
| `static/img/` | Logos, favicons, social card, and other static assets |
| `static/fonts/` | Self-hosted LINE Seed JP, Inter Tight, and IBM Plex Mono (OFL; licenses in `static/fonts/licenses/`) |
| `og/` | Source for the social card (`og-card.html`) and its renderer (`render.mjs`) |

## Theme

The site follows the [osaurus.ai](https://osaurus.ai) design system (`src/app/tokens.css` in [osaurus-website](https://github.com/osaurus-ai/osaurus-website)): a cream canvas (`#F7F6F2`), near-black text (`#11100F`), teal primary (`#004243`), and lime highlight (`#C0EC51`). Headings use LINE Seed JP, body text Inter Tight, and code IBM Plex Mono. Like the website, the docs are light-only; the color mode switch is disabled.

The font files are full Latin builds of the same families. The website ships subsets trimmed to its own copy, which lack characters docs need (`_`, `#`, `<`, digits), so don't copy those over.

## Social card

`static/img/og-image.png` (1200x630) is rendered from `og/og-card.html` with headless Chrome:

```bash
node og/render.mjs
```

Set `CHROME_PATH` if Chrome isn't in `/Applications`. Edit the HTML, re-render, and commit both.

## Writing for everyone

Most readers aren't developers. Write user-facing pages (Getting Started through Privacy & Trust) so a Mac user with no technical background can follow them.

- **Open with the point.** The first two or three sentences say what the feature is, why you'd use it, and what you need.
- **Steps happen in the app.** Number them, and use the exact labels the app shows (**Settings… → Agents**). Keep curl, YAML, JSON, tool names, and file paths out of the main flow.
- **Explain jargon on first use.** Link the term to the [Glossary](docs/glossary.md), like `[Sandbox](/glossary#sandbox)`, or add a short phrase in parentheses. If a term isn't in the glossary yet, add it.
- **Short sentences, written to "you".** Prefer "Osaurus asks before sending" to "outbound dispatch is gated on approval".
- **Put technical detail last.** End the page with a horizontal rule and an `## Under the hood` section for API calls, configuration, tool names, storage paths, and internals.
- **Use one name per thing:** Orchestrator (not "default agent"), Working Folder (not "trusted folder"; Schedules' **Working Directory** is the one exception), Insights for the screen and activity log for what it records, Osaurus Router for the service and Osaurus Cloud for the picker label, Public Links for the feature and relay for the mechanism.

Page shape:

```markdown
# Title
What it is, why you'd use it, what you need.

## Get started
## (everyday-use sections)
## Troubleshooting

---
## Under the hood
```

Developer and internals pages can stay technical, but still follow the one-name-per-thing rule.

## Writing docs

- Every page needs `title` and `description` frontmatter.
- Mermaid diagrams are supported via fenced ` ```mermaid ` code blocks.
- Custom MDX components available in any doc: `<Icon name="..." />`, `<GitHubStats />`, `<JourneyCards>`/`<JourneyCard>`.
- Adding a page? Register it in `sidebars.ts` — pages not in the sidebar are unreachable.

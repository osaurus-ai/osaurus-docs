#!/usr/bin/env node
// Builds the search index the docs MCP server reads, plus llms.txt and
// llms-full.txt for agents that read plain text instead of speaking MCP.
//
// Outputs (all generated, all gitignored):
//   generated/docs-index.json  pages + heading-level chunks for /mcp
//   static/llms.txt            page list with descriptions
//   static/llms-full.txt       every page's markdown in one file

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DOCS_DIR = join(ROOT, "docs");
const SITE_URL = "https://docs.osaurus.ai";

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (/\.mdx?$/.test(name)) out.push(full);
  }
  return out;
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return { data: {}, body: raw };
  const data = {};
  for (const line of match[1].split("\n")) {
    const kv = line.match(/^([A-Za-z_]+):\s*(.*)$/);
    if (!kv) continue;
    let value = kv[2].trim();
    if (/^(["']).*\1$/.test(value)) value = value.slice(1, -1);
    data[kv[1]] = value;
  }
  return { data, body: raw.slice(match[0].length) };
}

// Docusaurus doc id: path under docs/ without extension.
function docId(file) {
  return relative(DOCS_DIR, file).replace(/\.mdx?$/, "").split("\\").join("/");
}

// Public path: frontmatter slug if set, otherwise the doc id (routeBasePath is "/").
function docSlug(id, data) {
  if (data.slug) return data.slug.replace(/^\/+/, "");
  return id.replace(/(^|\/)index$/, "");
}

// Matches the anchors Docusaurus generates for headings (github-slugger style).
function anchorFor(text) {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[`*_~[\]()]/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s/g, "-");
}

function cleanMarkdown(body) {
  return body
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/^:::(\w+)\[(.*)\]\s*$/gm, "**$2**")
    .replace(/^:::\w*.*$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// Splits a page into chunks at ## and ### headings, ignoring "#" lines in code fences.
function chunkPage(markdown) {
  const chunks = [];
  let current = { heading: null, path: [], lines: [] };
  let lastH2 = null;
  let inFence = false;

  const flush = () => {
    const text = current.lines.join("\n").trim();
    if (text || current.heading) {
      chunks.push({
        heading: current.heading,
        path: current.path,
        anchor: current.heading ? anchorFor(current.heading) : "",
        text,
      });
    }
  };

  for (const line of markdown.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    const h = !inFence && line.match(/^(#{2,3})\s+(.+?)\s*#*\s*$/);
    if (h) {
      flush();
      const level = h[1].length;
      const heading = h[2].replace(/\s*\{#[^}]+\}$/, "");
      if (level === 2) lastH2 = heading;
      const path = level === 3 && lastH2 ? [lastH2, heading] : [heading];
      current = { heading, path, lines: [] };
      continue;
    }
    // Drop the page's own H1, the title is stored separately.
    if (!inFence && /^#\s+/.test(line) && current.heading === null) continue;
    current.lines.push(line);
  }
  flush();
  return chunks;
}

// Doc ids in sidebar order, so listings follow the site's navigation.
function sidebarOrder() {
  try {
    const src = readFileSync(join(ROOT, "sidebars.ts"), "utf8");
    return [...src.matchAll(/id:\s*["']([^"']+)["']/g)].map((m) => m[1]);
  } catch {
    return [];
  }
}

const order = sidebarOrder();
const rank = (id) => {
  const i = order.indexOf(id);
  return i === -1 ? Number.MAX_SAFE_INTEGER : i;
};

const pages = walk(DOCS_DIR)
  .map((file) => {
    const raw = readFileSync(file, "utf8");
    const { data, body } = parseFrontmatter(raw);
    const id = docId(file);
    const slug = docSlug(id, data);
    const markdown = cleanMarkdown(body);
    return {
      id,
      slug,
      url: `${SITE_URL}/${slug}`.replace(/\/$/, ""),
      title: data.title || data.sidebar_label || id,
      description: data.description || "",
      markdown,
      chunks: chunkPage(markdown),
    };
  })
  .sort((a, b) => rank(a.id) - rank(b.id) || a.id.localeCompare(b.id));

// Flat chunk list for search, each carrying enough to cite and fetch.
const chunks = [];
for (const page of pages) {
  for (const c of page.chunks) {
    chunks.push({
      page: page.id,
      title: page.title,
      section: c.path.join(" > "),
      anchor: c.anchor,
      url: c.anchor ? `${page.url}#${c.anchor}` : page.url,
      text: c.text,
    });
  }
}

const index = {
  generatedAt: new Date().toISOString(),
  site: SITE_URL,
  pages: pages.map(({ chunks: _c, ...p }) => ({
    ...p,
    sections: _c.filter((c) => c.heading).map((c) => ({ heading: c.heading, path: c.path.join(" > "), anchor: c.anchor })),
  })),
  chunks,
};

mkdirSync(join(ROOT, "generated"), { recursive: true });
writeFileSync(join(ROOT, "generated", "docs-index.json"), JSON.stringify(index));

const llms = [
  "# Osaurus",
  "",
  "> Osaurus is a free, open-source Mac app for local and cloud AI agents. It runs models on-device with MLX, serves OpenAI, Anthropic, Ollama and MCP compatible APIs on localhost, and ships agents, tools, plugins, memory and channels.",
  "",
  `Official MCP server for these docs: ${SITE_URL}/mcp (Streamable HTTP, no auth). Tools: search_osaurus_docs, read_osaurus_doc, list_osaurus_docs.`,
  "",
  "## Docs",
  "",
  ...pages.map((p) => `- [${p.title}](${p.url})${p.description ? `: ${p.description}` : ""}`),
  "",
].join("\n");
writeFileSync(join(ROOT, "static", "llms.txt"), llms);

const full = pages
  .map((p) => `# ${p.title}\n\nSource: ${p.url}\n\n${p.description ? `> ${p.description}\n\n` : ""}${p.markdown}\n`)
  .join("\n---\n\n");
writeFileSync(join(ROOT, "static", "llms-full.txt"), full);

console.log(`docs index: ${pages.length} pages, ${chunks.length} chunks`);

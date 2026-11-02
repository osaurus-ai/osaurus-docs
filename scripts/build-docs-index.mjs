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
        anchor: current.heading ? current.anchor : "",
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
      // Explicit ids: "## Title {#id}" or MDX "## Title {/* #id */}".
      const explicit = h[2].match(/\s*\{(?:\/\*\s*)?#([\w-]+)(?:\s*\*\/)?\}\s*$/);
      const heading = explicit ? h[2].slice(0, explicit.index).trim() : h[2];
      const anchor = explicit ? explicit[1] : anchorFor(heading);
      if (level === 2) lastH2 = heading;
      const path = level === 3 && lastH2 ? [lastH2, heading] : [heading];
      current = { heading, path, anchor, lines: [] };
      continue;
    }
    // Drop the page's own H1, the title is stored separately.
    if (!inFence && /^#\s+/.test(line) && current.heading === null) continue;
    current.lines.push(line);
  }
  flush();
  return chunks;
}

// Doc ids in sidebar order with their category path ("For Developers > Tools & Plugins"),
// so listings follow the site's navigation. sidebars.ts is plain data once its
// type annotations are stripped.
function sidebarEntries() {
  try {
    const src = readFileSync(join(ROOT, "sidebars.ts"), "utf8")
      .replace(/^import type .*$/m, "")
      .replace(/const sidebars:\s*\w+\s*=/, "return")
      .replace(/^export default sidebars;?\s*$/m, "");
    const config = new Function(src)();
    const out = [];
    const visit = (items, path) => {
      for (const item of items) {
        if (typeof item === "string") out.push({ id: item, section: path.join(" > ") });
        else if (item.type === "doc") out.push({ id: item.id, section: path.join(" > ") });
        else if (item.type === "category") {
          const next = [...path, item.label];
          if (item.link?.type === "doc") out.push({ id: item.link.id, section: next.join(" > ") });
          visit(item.items || [], next);
        }
      }
    };
    for (const items of Object.values(config)) visit(items, []);
    return out;
  } catch (err) {
    console.warn("docs index: could not read sidebars.ts, pages will be unordered", err.message);
    return [];
  }
}

const sidebar = sidebarEntries();
const rank = (id) => {
  const i = sidebar.findIndex((e) => e.id === id);
  return i === -1 ? Number.MAX_SAFE_INTEGER : i;
};
const sectionOf = (id) => sidebar.find((e) => e.id === id)?.section || "";

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
      section: sectionOf(id),
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
      ...(c.heading ? {} : { description: page.description }),
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
  ...[...new Set(pages.map((p) => p.section || "Overview"))].flatMap((section) => [
    `## ${section}`,
    "",
    ...pages
      .filter((p) => (p.section || "Overview") === section)
      .map((p) => `- [${p.title}](${p.url})${p.description ? `: ${p.description}` : ""}`),
    "",
  ]),
].join("\n");
writeFileSync(join(ROOT, "static", "llms.txt"), llms);

const full = pages
  .map((p) => `# ${p.title}\n\nSource: ${p.url}\n\n${p.description ? `> ${p.description}\n\n` : ""}${p.markdown}\n`)
  .join("\n---\n\n");
writeFileSync(join(ROOT, "static", "llms-full.txt"), full);

console.log(`docs index: ${pages.length} pages, ${chunks.length} chunks`);

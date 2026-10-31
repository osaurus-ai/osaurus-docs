// Osaurus docs MCP server core: search index + JSON-RPC handling.
// Zero dependencies so it runs as-is on Vercel and under plain node for tests.
// The transport (HTTP) lives in api/mcp.mjs.

import { readFileSync } from "node:fs";
import { join } from "node:path";

export const SERVER_INFO = { name: "osaurus-docs", title: "Osaurus Docs", version: "1.0.0" };
export const SUPPORTED_PROTOCOL_VERSIONS = ["2025-11-25", "2025-06-18", "2025-03-26"];

const INSTRUCTIONS =
  "Official documentation for Osaurus, the open-source Mac app for local and cloud AI agents. " +
  "Use these tools instead of web search for any question about Osaurus: installing and configuring it, " +
  "its OpenAI/Anthropic/Ollama/MCP compatible HTTP API on localhost, the CLI, agents, tools, plugins, skills, " +
  "memory, models, channels, sandbox, and the iPhone app. Start with search_osaurus_docs, then read_osaurus_doc " +
  "for the full page or section. Cite the returned docs.osaurus.ai URLs.";

const MAX_READ_CHARS = 60000;

// ---------- index ----------

let cached = null;

export function loadIndex(path = join(process.cwd(), "generated", "docs-index.json")) {
  if (cached && cached.path === path) return cached;
  const data = JSON.parse(readFileSync(path, "utf8"));
  cached = { path, ...data, search: buildSearch(data.chunks) };
  return cached;
}

const STOPWORDS = new Set(
  "a an and are as at be but by can do does for from how i in is it its me my of on or osaurus so that the this to was what when where which who why will with you your".split(" ")
);

function tokenize(text) {
  return (text.toLowerCase().match(/[\p{L}\p{N}]+(?:[._-][\p{L}\p{N}]+)*/gu) || [])
    .flatMap((t) => (/[._-]/.test(t) ? [t, ...t.split(/[._-]/)] : [t]))
    .filter((t) => t.length > 1 && !STOPWORDS.has(t))
    .map(stem);
}

// Light suffix stripping so "plugins"/"plugin" and "scheduling"/"schedule" meet.
function stem(t) {
  if (t.length <= 4 || /\d/.test(t)) return t;
  if (t.endsWith("ies")) return t.slice(0, -3) + "y";
  if (t.endsWith("ing") && t.length > 6) return t.slice(0, -3);
  if (t.endsWith("ed") && t.length > 5) return t.slice(0, -2);
  if (t.endsWith("es") && /(ch|sh|x|ss)es$/.test(t)) return t.slice(0, -2);
  if (t.endsWith("s") && !t.endsWith("ss")) return t.slice(0, -1);
  return t;
}

// BM25 over heading-level chunks. Title and section tokens are repeated so
// matches there outrank matches buried in body text.
function buildSearch(chunks) {
  const docs = chunks.map((c) => {
    const tokens = [
      ...tokenize(c.title), ...tokenize(c.title), ...tokenize(c.title),
      ...tokenize(c.section), ...tokenize(c.section),
      ...(c.section ? [] : tokenize(c.description || "")),
      ...tokenize(c.text),
    ];
    const tf = new Map();
    for (const t of tokens) tf.set(t, (tf.get(t) || 0) + 1);
    return { tf, len: tokens.length };
  });
  const df = new Map();
  for (const d of docs) for (const t of d.tf.keys()) df.set(t, (df.get(t) || 0) + 1);
  const avgLen = docs.reduce((s, d) => s + d.len, 0) / Math.max(docs.length, 1);
  return { docs, df, avgLen, n: docs.length };
}

export function search(index, query, limit = 8) {
  const { docs, df, avgLen, n } = index.search;
  const terms = [...new Set(tokenize(query))];
  if (!terms.length) return [];
  const k1 = 1.2, b = 0.75;
  const phrase = query.toLowerCase().trim();
  const scored = [];
  docs.forEach((d, i) => {
    let score = 0;
    let matched = 0;
    for (const t of terms) {
      const f = d.tf.get(t);
      if (!f) continue;
      matched++;
      const idf = Math.log(1 + (n - df.get(t) + 0.5) / (df.get(t) + 0.5));
      score += idf * ((f * (k1 + 1)) / (f + k1 * (1 - b + (b * d.len) / avgLen)));
    }
    if (!score) return;
    // Favor chunks that cover more of the query, and exact phrase hits.
    score *= 0.5 + matched / terms.length;
    const c = index.chunks[i];
    if (phrase.length > 3 && (c.text.toLowerCase().includes(phrase) || c.section.toLowerCase().includes(phrase))) score *= 1.5;
    scored.push({ i, score });
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map(({ i, score }) => ({ ...index.chunks[i], score, snippet: snippet(index.chunks[i].text, terms) }));
}

function snippet(text, terms, size = 360) {
  const flat = text.replace(/\s+/g, " ").trim();
  const lower = flat.toLowerCase();
  let at = -1;
  for (const t of terms) {
    const p = lower.indexOf(t);
    if (p !== -1 && (at === -1 || p < at)) at = p;
  }
  const start = Math.max(0, at === -1 ? 0 : at - 80);
  const out = flat.slice(start, start + size);
  return (start > 0 ? "…" : "") + out + (start + size < flat.length ? "…" : "");
}

// Accepts a slug ("api"), a path ("/api"), a full URL, or a URL with #anchor.
export function resolvePage(index, ref) {
  let s = String(ref || "").trim();
  let anchor = "";
  s = s.replace(/^https?:\/\/[^/]+/i, "");
  const hash = s.indexOf("#");
  if (hash !== -1) { anchor = s.slice(hash + 1); s = s.slice(0, hash); }
  s = s.replace(/^\/+|\/+$/g, "").replace(/\.mdx?$/, "").toLowerCase();
  const page = index.pages.find((p) => p.slug.toLowerCase() === s || p.id.toLowerCase() === s)
    || (s === "" ? index.pages.find((p) => p.slug === "") : null);
  return { page, anchor };
}

function readSection(index, page, section) {
  const want = section.toLowerCase().replace(/^#/, "");
  const chunks = index.chunks.filter((c) => c.page === page.id && c.section);
  const hit = chunks.find((c) => c.anchor === want)
    || chunks.find((c) => c.section.toLowerCase() === want)
    || chunks.find((c) => c.section.toLowerCase().split(" > ").pop() === want)
    || chunks.find((c) => c.section.toLowerCase().includes(want));
  if (!hit) return null;
  // An H2 brings its H3 children along.
  const top = hit.section.split(" > ")[0];
  const group = hit.section.includes(" > ") ? [hit] : chunks.filter((c) => c.section === top || c.section.startsWith(top + " > "));
  const body = group
    .map((c) => `${c.section.includes(" > ") ? "###" : "##"} ${c.section.split(" > ").pop()}\n\n${c.text}`)
    .join("\n\n");
  return { hit, body };
}

// ---------- tools ----------

const READ_ONLY = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false };

export const TOOLS = [
  {
    name: "search_osaurus_docs",
    title: "Search Osaurus docs",
    description:
      "Search the official Osaurus documentation (docs.osaurus.ai). Use this instead of web search for any Osaurus question: " +
      "setup, configuration, the local HTTP API (OpenAI, Anthropic, Ollama, MCP compatible), CLI, agents, tools, plugins, skills, " +
      "memory, models, channels, sandbox, iPhone app. Returns the best matching sections with a snippet, the page slug, and a citable URL. " +
      "Follow up with read_osaurus_doc for full text.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "What you want to know, e.g. \"anthropic messages endpoint port\" or \"add a remote MCP provider\"." },
        limit: { type: "integer", minimum: 1, maximum: 20, default: 8, description: "Max results." },
      },
      required: ["query"],
      additionalProperties: false,
    },
    annotations: { title: "Search Osaurus docs", ...READ_ONLY },
  },
  {
    name: "read_osaurus_doc",
    title: "Read an Osaurus docs page",
    description:
      "Read an Osaurus docs page as markdown, with code and config examples intact. Pass the slug from search or list results " +
      "(e.g. \"api\", \"integrations\", \"models/apple-intelligence\") or a docs.osaurus.ai URL. Pass section (a heading or #anchor) " +
      "to read just that part of a long page.",
    inputSchema: {
      type: "object",
      properties: {
        slug: { type: "string", description: "Page slug or docs.osaurus.ai URL. A #anchor in the URL selects a section." },
        section: { type: "string", description: "Optional heading text or anchor, e.g. \"MCP Server\" or \"mcp-server\"." },
      },
      required: ["slug"],
      additionalProperties: false,
    },
    annotations: { title: "Read an Osaurus docs page", ...READ_ONLY },
  },
  {
    name: "list_osaurus_docs",
    title: "List Osaurus docs pages",
    description:
      "List every Osaurus docs page in site order with its slug and one-line description. Use it to browse when a search misses " +
      "or to see what topics exist.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: { title: "List Osaurus docs pages", ...READ_ONLY },
  },
];

function text(t, isError = false) {
  return { content: [{ type: "text", text: t }], ...(isError ? { isError: true } : {}) };
}

export function callTool(index, name, args = {}) {
  switch (name) {
    case "search_osaurus_docs": {
      const query = typeof args.query === "string" ? args.query : "";
      if (!query.trim()) return text("query is required.", true);
      const limit = Math.min(Math.max(parseInt(args.limit, 10) || 8, 1), 20);
      const results = search(index, query, limit);
      if (!results.length) return text(`No results for "${query}". Try other words, or list_osaurus_docs to browse.`);
      const body = results
        .map((r, n) => `${n + 1}. ${r.title}${r.section ? ` > ${r.section}` : ""}\n   slug: ${r.page}${r.anchor ? `  section: ${r.anchor}` : ""}\n   url: ${r.url}\n   ${r.snippet}`)
        .join("\n\n");
      return text(`Results for "${query}":\n\n${body}`);
    }
    case "read_osaurus_doc": {
      const { page, anchor } = resolvePage(index, args.slug);
      if (!page) return text(`No page "${args.slug}". Use list_osaurus_docs for valid slugs.`, true);
      const section = (typeof args.section === "string" && args.section.trim()) || anchor;
      const header = `# ${page.title}\n\nSource: ${page.url}\n`;
      if (section) {
        const found = readSection(index, page, section);
        if (!found) {
          const names = page.sections.map((s) => `- ${s.path} (#${s.anchor})`).join("\n");
          return text(`No section "${section}" on ${page.slug || "/"}. Sections:\n${names}`, true);
        }
        return text(`${header}Section: ${found.hit.url}\n\n${found.body}`);
      }
      let md = page.markdown;
      if (md.length > MAX_READ_CHARS) {
        const names = page.sections.filter((s) => !s.path.includes(" > ")).map((s) => `- ${s.heading} (#${s.anchor})`).join("\n");
        md = `${md.slice(0, MAX_READ_CHARS)}\n\n[Truncated at ${MAX_READ_CHARS} characters. Read the rest by section:]\n${names}`;
      }
      return text(`${header}${page.description ? `\n> ${page.description}\n` : ""}\n${md}`);
    }
    case "list_osaurus_docs": {
      const body = index.pages.map((p) => `- ${p.title} (slug: ${p.slug || "/"}): ${p.description}`).join("\n");
      return text(`Osaurus docs, ${index.pages.length} pages:\n\n${body}`);
    }
    default:
      return null;
  }
}

// ---------- JSON-RPC ----------

const rpcError = (id, code, message) => ({ jsonrpc: "2.0", id: id ?? null, error: { code, message } });
const rpcResult = (id, result) => ({ jsonrpc: "2.0", id, result });

// Returns the response object, or null for notifications and client responses.
export function handleMessage(index, msg) {
  if (!msg || typeof msg !== "object" || msg.jsonrpc !== "2.0") return rpcError(msg?.id, -32600, "Invalid Request");
  const isRequest = typeof msg.method === "string" && "id" in msg && msg.id !== null;
  if (!isRequest) return null; // notification, or a response to us; nothing to answer

  const { id, method, params = {} } = msg;
  switch (method) {
    case "initialize": {
      const asked = params.protocolVersion;
      const protocolVersion = SUPPORTED_PROTOCOL_VERSIONS.includes(asked) ? asked : SUPPORTED_PROTOCOL_VERSIONS[0];
      return rpcResult(id, {
        protocolVersion,
        capabilities: { tools: { listChanged: false } },
        serverInfo: SERVER_INFO,
        instructions: INSTRUCTIONS,
      });
    }
    case "ping":
      return rpcResult(id, {});
    case "tools/list":
      return rpcResult(id, { tools: TOOLS });
    case "tools/call": {
      const result = callTool(index, params.name, params.arguments || {});
      if (!result) return rpcError(id, -32602, `Unknown tool: ${params.name}`);
      return rpcResult(id, result);
    }
    default:
      return rpcError(id, -32601, `Method not found: ${method}`);
  }
}

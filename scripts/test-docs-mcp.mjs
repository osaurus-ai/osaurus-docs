#!/usr/bin/env node
// Smoke tests for the docs MCP endpoint. Run after build-index:
//   npm run build-index && node scripts/test-docs-mcp.mjs

import assert from "node:assert/strict";
import { handle } from "../api/mcp.mjs";

let id = 0;
async function rpc(method, params, extra = {}) {
  const res = await handle(
    new Request("https://docs.osaurus.ai/mcp", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json, text/event-stream" },
      body: JSON.stringify({ jsonrpc: "2.0", id: ++id, method, params, ...extra }),
    })
  );
  return { status: res.status, body: res.status === 202 ? null : await res.json() };
}
const call = async (name, args) => (await rpc("tools/call", { name, arguments: args })).body.result;

const tests = [];
const test = (name, fn) => tests.push([name, fn]);

test("initialize negotiates a supported version", async () => {
  const { body } = await rpc("initialize", { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "t", version: "0" } });
  assert.equal(body.result.protocolVersion, "2025-06-18");
  assert.equal(body.result.serverInfo.name, "osaurus-docs");
  assert.ok(body.result.capabilities.tools);
  const future = await rpc("initialize", { protocolVersion: "2099-01-01" });
  assert.equal(future.body.result.protocolVersion, "2025-11-25");
});

test("notifications get 202 with no body", async () => {
  const res = await handle(new Request("https://x/mcp", { method: "POST", body: JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" }) }));
  assert.equal(res.status, 202);
});

test("GET is 405, OPTIONS is CORS preflight", async () => {
  assert.equal((await handle(new Request("https://x/mcp"))).status, 405);
  const pre = await handle(new Request("https://x/mcp", { method: "OPTIONS" }));
  assert.equal(pre.status, 204);
  assert.equal(pre.headers.get("access-control-allow-origin"), "*");
});

test("bad JSON and unknown method are JSON-RPC errors", async () => {
  const res = await handle(new Request("https://x/mcp", { method: "POST", body: "{nope" }));
  assert.equal(res.status, 400);
  assert.equal((await res.json()).error.code, -32700);
  assert.equal((await rpc("does/not/exist")).body.error.code, -32601);
});

test("oversized bodies and batches are refused", async () => {
  const big = await handle(new Request("https://x/mcp", { method: "POST", body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "ping", params: { pad: "x".repeat(40000) } }) }));
  assert.equal(big.status, 413);
  const batch = Array.from({ length: 11 }, (_, i) => ({ jsonrpc: "2.0", id: i, method: "ping" }));
  const many = await handle(new Request("https://x/mcp", { method: "POST", body: JSON.stringify(batch) }));
  assert.equal(many.status, 413);
  const ok = await handle(new Request("https://x/mcp", { method: "POST", body: JSON.stringify(batch.slice(0, 10)) }));
  assert.equal(ok.status, 200);
  assert.equal((await ok.json()).length, 10);
});

test("GET points at the setup page and llms.txt", async () => {
  const r = await handle(new Request("https://x/mcp"));
  assert.equal(r.status, 405);
  assert.match(await r.text(), /llms\.txt/);
});

test("long pages are cut at 30k characters with a section list", async () => {
  const r = await call("read_osaurus_doc", { slug: "api" });
  assert.ok(r.content[0].text.length < 33000);
  assert.match(r.content[0].text, /Read the rest by section/);
});

test("tools/list exposes three read-only tools", async () => {
  const { tools } = (await rpc("tools/list")).body.result;
  assert.deepEqual(tools.map((t) => t.name), ["search_osaurus_docs", "read_osaurus_doc", "list_osaurus_docs"]);
  for (const t of tools) assert.equal(t.annotations.readOnlyHint, true);
});

test("search finds the MCP server integration section", async () => {
  const r = await call("search_osaurus_docs", { query: "connect cursor to osaurus mcp server" });
  assert.match(r.content[0].text, /integrations#/);
});

test("search finds the Anthropic API docs", async () => {
  const r = await call("search_osaurus_docs", { query: "anthropic messages endpoint", limit: 3 });
  assert.match(r.content[0].text, /slug: api/);
});

test("read by slug, URL, and section", async () => {
  const page = await call("read_osaurus_doc", { slug: "integrations" });
  assert.match(page.content[0].text, /^# Integrations/);
  const byUrl = await call("read_osaurus_doc", { slug: "https://docs.osaurus.ai/integrations#mcp-server" });
  assert.match(byUrl.content[0].text, /## MCP Server/);
  assert.match(byUrl.content[0].text, /### Cursor/);
  const nested = await call("read_osaurus_doc", { slug: "models/apple-intelligence" });
  assert.match(nested.content[0].text, /Apple Intelligence/);
  const home = await call("read_osaurus_doc", { slug: "/" });
  assert.match(home.content[0].text, /Source: https:\/\/docs\.osaurus\.ai\n/);
});

test("missing page and section are tool errors with hints", async () => {
  const r = await call("read_osaurus_doc", { slug: "nope" });
  assert.equal(r.isError, true);
  const s = await call("read_osaurus_doc", { slug: "integrations", section: "zzz-none" });
  assert.equal(s.isError, true);
  assert.match(s.content[0].text, /Sections:/);
});

test("list returns every page grouped by sidebar section", async () => {
  const t = (await call("list_osaurus_docs", {})).content[0].text;
  assert.match(t, /slug: quickstart/);
  assert.match(t, /^Osaurus docs: \d+ pages in \d+ sidebar sections\./);
  assert.match(t, /## Getting Started \(\d+\)/);
  assert.match(t, /## For Developers > Tools & Plugins \(\d+\)/);
});

test("words that are Object.prototype names don't break scoring", async () => {
  for (const query of ["constructor", "toString valueOf", "hasOwnProperty proto"]) {
    const r = await call("search_osaurus_docs", { query });
    assert.ok(!r.isError);
    assert.doesNotMatch(r.content[0].text, /NaN|function/);
  }
});

test("search snippets keep line breaks", async () => {
  const t = (await call("search_osaurus_docs", { query: "default server port", limit: 1 })).content[0].text;
  assert.match(t, /\n   \| `--port`/);
});

let failed = 0;
for (const [name, fn] of tests) {
  try {
    await fn();
    console.log(`ok   ${name}`);
  } catch (err) {
    failed++;
    console.log(`FAIL ${name}\n     ${err.message}`);
  }
}
console.log(`\n${tests.length - failed}/${tests.length} passed`);
process.exit(failed ? 1 : 0);

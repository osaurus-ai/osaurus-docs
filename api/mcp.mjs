// Streamable HTTP transport for the Osaurus docs MCP server.
// Served at https://docs.osaurus.ai/mcp (vercel.json rewrites /mcp here).
// Stateless: no sessions and no server-to-client stream, every POST is
// answered with plain JSON. That is all a read-only, tools-only server needs.

import { loadIndex, handleMessage } from "../lib/docs-mcp.mjs";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept, Authorization, Mcp-Session-Id, Mcp-Protocol-Version, Last-Event-ID",
  "Access-Control-Expose-Headers": "Mcp-Session-Id, Mcp-Protocol-Version",
  "Access-Control-Max-Age": "86400",
};

const json = (body, status = 200) =>
  new Response(body === null ? null : JSON.stringify(body), {
    status,
    headers: { ...CORS, ...(body === null ? {} : { "Content-Type": "application/json" }), "Cache-Control": "no-store" },
  });

const rpcError = (code, message, status) => json({ jsonrpc: "2.0", id: null, error: { code, message } }, status);

export async function handle(request) {
  const method = request.method.toUpperCase();

  if (method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });

  // No server-initiated stream and no sessions to end.
  if (method === "GET" || method === "DELETE") {
    return new Response("Method Not Allowed", { status: 405, headers: { ...CORS, Allow: "POST, OPTIONS" } });
  }
  if (method !== "POST") return rpcError(-32000, "Method not allowed", 405);

  let payload;
  try {
    payload = await request.json();
  } catch {
    return rpcError(-32700, "Parse error", 400);
  }

  let index;
  try {
    index = loadIndex();
  } catch (err) {
    console.error("docs-mcp: index load failed", err);
    return rpcError(-32603, "Docs index unavailable", 500);
  }

  // Batches are allowed by older protocol versions, so accept them.
  if (Array.isArray(payload)) {
    if (!payload.length) return rpcError(-32600, "Invalid Request", 400);
    const responses = payload.map((m) => handleMessage(index, m)).filter(Boolean);
    return responses.length ? json(responses) : json(null, 202);
  }

  const response = handleMessage(index, payload);
  return response ? json(response) : json(null, 202);
}

export const GET = handle;
export const POST = handle;
export const DELETE = handle;
export const OPTIONS = handle;

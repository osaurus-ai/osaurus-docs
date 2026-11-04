#!/usr/bin/env node
// Local dev server for the docs MCP: serves api/mcp.mjs at http://localhost:3333/mcp
// the same way Vercel does, without the Vercel CLI.
//   npm run mcp:dev            (rebuilds the index first)
//   PORT=4000 npm run mcp:dev

import http from "node:http";
import { handle } from "../api/mcp.mjs";

const PORT = Number(process.env.PORT) || 3333;

const server = http.createServer(async (req, res) => {
  const path = req.url.split("?")[0];
  if (path !== "/mcp" && path !== "/api/mcp") {
    res.writeHead(404).end("Not found. The MCP endpoint is /mcp\n");
    return;
  }
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const hasBody = !["GET", "HEAD", "OPTIONS", "DELETE"].includes(req.method);
  const started = Date.now();
  const response = await handle(
    new Request(`http://localhost:${PORT}${req.url}`, {
      method: req.method,
      headers: req.headers,
      body: hasBody ? Buffer.concat(chunks) : undefined,
    })
  );
  let rpc = "";
  if (hasBody) {
    try {
      const msg = JSON.parse(Buffer.concat(chunks).toString());
      rpc = [msg].flat().map((m) => m.method + (m.params?.name ? `:${m.params.name}` : "")).join(",");
    } catch {}
  }
  console.log(`${req.method} ${path} ${response.status} ${Date.now() - started}ms ${rpc}`);
  res.writeHead(response.status, Object.fromEntries(response.headers));
  res.end(Buffer.from(await response.arrayBuffer()));
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use, probably by another mcp:dev. Stop it (lsof -i :${PORT}) or run with PORT=<other>.`);
    process.exit(1);
  }
  throw err;
});

server.listen(PORT, () => console.log(`docs MCP listening on http://localhost:${PORT}/mcp`));

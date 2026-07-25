---
title: Global Proxy
sidebar_label: Global Proxy
description: Route Osaurus's outbound network traffic through a single validated HTTP, HTTPS, or SOCKS proxy — without weakening TLS or accepting embedded credentials.
---

# Global Proxy

Osaurus can route its outbound network traffic through a single global proxy endpoint. Set one validated proxy URL in **Server settings** and it applies to new outbound connections across the app — without weakening TLS, and without accepting credentials embedded in the URL.

## What the proxy covers

The global proxy applies to Osaurus's own outbound traffic, including:

- Remote provider requests (OpenAI, Anthropic, and other [remote providers](/remote-providers))
- HTTP/SSE [remote MCP provider](/remote-mcp-providers) discovery and auth probes
- Model downloads and Hugging Face lookups
- Plugin HTTP requests, plugin repository refreshes, and plugin artifact installs
- [Relay](/relay), theme sharing, and GitHub skill imports
- Sandbox provisioning

Local loopback health checks deliberately stay direct — a proxy setting never affects how Osaurus talks to itself. Per-provider proxy selection is not supported; the setting is global by design.

## Supported URL formats

The setting is a single URL in one of these forms:

```text
http://proxy.example.com:8080
https://proxy.example.com:8443
socks://proxy.example.com:1080
socks5://proxy.example.com:1080
```

An HTTP or HTTPS proxy URL covers both plain and TLS web traffic; SOCKS URLs configure SOCKS only. The validator requires an explicit scheme, host, and port, and rejects anything else — unsupported schemes, `file:` URLs, paths, query strings, fragments, embedded `user:password@` credentials, missing ports, and localhost/`.local`/loopback/link-local destinations.

Credentials are deliberately out of scope for the URL format. Authenticated proxies aren't currently supported.

## Status and diagnostics

Server settings show a live proxy status line:

| Status | Meaning |
|---|---|
| **Disabled** | The URL is blank; outbound sessions use direct networking |
| **Configured** | The URL validated and was saved; new outbound sessions apply it |
| **Invalid** | The typed value failed validation and was not saved |

Provider and MCP provider cards each expose a copyable **Global proxy** diagnostic row, so a proxy problem is visible where you'd be debugging a connection: a valid proxy shows its redacted endpoint, no proxy shows that requests go direct, and an invalid saved value is shown as *ignored* with the validation reason — instead of silently looking like a network failure.

The value persists as `globalProxyURL` in `server.json` (see [Server Settings](/configuration)). If the saved value is ever missing or invalid, Osaurus fails closed to direct networking rather than guessing.

## Security properties

- Certificate validation stays at the system default — the proxy never bypasses or downgrades TLS, and HTTPS failures are never retried over plain HTTP.
- A proxy URL is constrained to a host/port endpoint: no PAC scripts, no bypass lists, no destination rewrites, no environment-variable injection.
- Clearing the URL is the rollback — sessions return to normal direct networking with nothing left behind.

---

**Related:**

- [Server Settings](/configuration) — where the proxy URL lives
- [Remote Providers](/remote-providers) — the largest traffic family the proxy covers
- [Remote MCP Providers](/remote-mcp-providers) — proxied discovery and auth probes
- [Security & Privacy](/security) — Osaurus's broader network posture

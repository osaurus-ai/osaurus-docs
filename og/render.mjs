#!/usr/bin/env node
// Renders og/og-card.html to static/img/og-image.png (1200x630) with headless Chrome.
// Usage: node og/render.mjs   (set CHROME_PATH to override the browser binary)

import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const source = pathToFileURL(resolve(here, "og-card.html")).href;
const output = resolve(here, "../static/img/og-image.png");

const candidates = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);

const chrome = candidates.find((path) => existsSync(path));
if (!chrome) {
  console.error("No Chrome or Chromium found. Set CHROME_PATH to a Chrome binary.");
  process.exit(1);
}

execFileSync(
  chrome,
  [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--force-device-scale-factor=1",
    "--window-size=1200,630",
    "--virtual-time-budget=3000",
    "--allow-file-access-from-files",
    `--screenshot=${output}`,
    source,
  ],
  { stdio: "inherit" },
);

console.log(`Wrote ${output}`);

import { cpSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = join(root, "dist");
const publicPaths = [
  "index.html",
  "privacy.html",
  "about",
  "form-debugger",
  "d365-form-skill",
  "pattens",
  "agentic-form",
  "assets/css/site.css",
  "assets/img",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
  "llms.txt",
  "llms-full.txt",
];

rmSync(output, { recursive: true, force: true });
for (const publicPath of publicPaths) {
  const destination = join(output, publicPath);
  mkdirSync(dirname(destination), { recursive: true });
  cpSync(join(root, publicPath), destination, { recursive: true });
}
console.log("Prepared static Site in dist/.");

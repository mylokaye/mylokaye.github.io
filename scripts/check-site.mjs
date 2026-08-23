import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const origin = "https://mylokaye.info";
const pages = [
  "index.html",
  "about/index.html",
  "form-debugger/index.html",
  "d365-form-skill/index.html",
  "pattens/index.html",
  "agentic-form/index.html",
  "privacy.html",
];

const failures = [];
const canonicalUrls = [];

for (const asset of [
  "assets/css/site.css",
  "assets/js/site.js",
  "assets/img/site.webmanifest",
  "assets/img/social-share.png",
]) {
  if (!existsSync(join(root, asset))) fail("site assets", `missing ${asset}`);
}

function fail(file, message) {
  failures.push(`${file}: ${message}`);
}

function matches(html, pattern) {
  return [...html.matchAll(pattern)];
}

function internalPathToFile(pathname) {
  const cleanPath = decodeURIComponent(pathname.split(/[?#]/, 1)[0]);
  if (cleanPath === "/") return "index.html";
  if (cleanPath.endsWith("/")) return `${cleanPath.slice(1)}index.html`;
  return cleanPath.slice(1);
}

for (const page of pages) {
  const absolutePage = join(root, page);
  const html = readFileSync(absolutePage, "utf8");

  if (!/<html\s[^>]*lang="en-GB"/i.test(html)) fail(page, "missing lang=\"en-GB\"");
  if (matches(html, /<title>[^<]+<\/title>/gi).length !== 1) fail(page, "must have exactly one non-empty title");
  if (!/<meta\s+name="description"\s+content="[^"]+"/i.test(html)) fail(page, "missing meta description");
  if (matches(html, /<h1(?:\s|>)/gi).length !== 1) fail(page, "must have exactly one h1");
  if (!/href="\/assets\/css\/site\.css"/i.test(html)) fail(page, "missing compiled site stylesheet");
  if (!/src="\/assets\/js\/site\.js"[^>]*defer/i.test(html)) fail(page, "missing deferred site script");

  for (const property of ["og:title", "og:description", "og:url", "og:image"]) {
    if (!new RegExp(`<meta\\s+property="${property}"\\s+content="[^"]+"`, "i").test(html)) {
      fail(page, `missing ${property}`);
    }
  }
  for (const name of ["twitter:card", "twitter:title", "twitter:description", "twitter:image", "twitter:image:alt"]) {
    if (!new RegExp(`<meta\\s+name="${name}"\\s+content="[^"]+"`, "i").test(html)) {
      fail(page, `missing ${name}`);
    }
  }

  const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1];
  if (!canonical?.startsWith(`${origin}/`)) {
    fail(page, "missing or invalid canonical URL");
  } else {
    canonicalUrls.push(canonical);
  }

  const jsonLdBlocks = matches(html, /<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi);
  if (jsonLdBlocks.length === 0) fail(page, "missing JSON-LD");
  for (const block of jsonLdBlocks) {
    try {
      JSON.parse(block[1]);
    } catch (error) {
      fail(page, `invalid JSON-LD: ${error.message}`);
    }
  }

  const localReferences = matches(html, /(?:href|src)="(\/[^"]+)"/gi).map((match) => match[1]);
  for (const reference of localReferences) {
    const localFile = internalPathToFile(reference);
    if (!existsSync(join(root, localFile))) fail(page, `broken local reference ${reference}`);
  }
}

const sitemap = readFileSync(join(root, "sitemap.xml"), "utf8");
for (const canonical of canonicalUrls) {
  if (!sitemap.includes(`<loc>${canonical}</loc>`)) fail("sitemap.xml", `missing ${canonical}`);
}

const repositoryText = [
  ...pages.map((page) => readFileSync(join(root, page), "utf8")),
  sitemap,
  readFileSync(join(root, "llms.txt"), "utf8"),
].join("\n");
for (const retiredName of ["D365-CIJ-Form-Debugger", "Pattens-basic", "forms-v2"]) {
  if (repositoryText.includes(retiredName)) fail("site content", `contains retired project reference ${retiredName}`);
}

if (failures.length > 0) {
  console.error(`FAIL (${failures.length})`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`PASS: ${pages.length} pages, ${canonicalUrls.length} canonical URLs, valid JSON-LD syntax, local links and sitemap coverage.`);

/**
 * Apply SEO artifacts:
 *  1) public/robots.txt + public/sitemap.xml from seo.config.mjs
 *  2) After vite build: inject TEMPLATE_BODY into dist/index.html #root
 *     so non-JS crawlers see real H1/copy (highest-impact SPA fix).
 *
 * Usage:
 *   node scripts/seo-apply.mjs           # robots + sitemap only
 *   node scripts/seo-apply.mjs --prerender
 *   SITE_URL=https://example.com node scripts/seo-apply.mjs --prerender
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { SITE, SITE_URL } from "../seo.config.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const prerender = process.argv.includes("--prerender");

const today = new Date().toISOString().slice(0, 10);

const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;

const publicDir = join(root, "public");
mkdirSync(publicDir, { recursive: true });
writeFileSync(join(publicDir, "robots.txt"), robots, "utf8");
writeFileSync(join(publicDir, "sitemap.xml"), sitemap, "utf8");
console.log(`✓ Wrote public/robots.txt + public/sitemap.xml (${SITE_URL})`);

if (!prerender) process.exit(0);

const { TEMPLATE_BODY } = await import("../src/templateBody.js");
const distHtmlPath = join(root, "dist", "index.html");
if (!existsSync(distHtmlPath)) {
  console.error("✗ dist/index.html missing — run vite build first");
  process.exit(1);
}

let html = readFileSync(distHtmlPath, "utf8");
const needle = '<div id="root"></div>';
if (!html.includes(needle)) {
  // Already prerendered or differently shaped
  if (html.includes('id="root"') && html.includes("page_wrapper")) {
    console.log("✓ dist/index.html already contains prerendered body");
    process.exit(0);
  }
  console.error("✗ Could not find empty #root in dist/index.html");
  process.exit(1);
}

html = html.replace(needle, `<div id="root">${TEMPLATE_BODY}</div>`);

// Ensure absolute social image + canonical use SITE_URL (in case index still relative)
html = html.replace(
  /property="og:url"\s+content="[^"]*"/,
  `property="og:url" content="${SITE_URL}/"`
);
html = html.replace(
  /rel="canonical"\s+href="[^"]*"/,
  `rel="canonical" href="${SITE_URL}/"`
);

writeFileSync(distHtmlPath, html, "utf8");
const wordish = (TEMPLATE_BODY.match(/[A-Za-z]{3,}/g) || []).length;
console.log(`✓ Prerendered ${wordish} word-tokens into dist/index.html for crawlers`);
console.log(`  Brand: ${SITE.name} · ${SITE.title}`);

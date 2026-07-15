/**
 * Reads agentflowtemplate_webflow_io.html (Home V1),
 * decodes HTML entities, swaps Agentflow content/images for Nxtrive,
 * and writes src/templateBody.js for React to render.
 *
 * Layout, classes, typography, and animations are NOT changed.
 */
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = join(__dirname, "agentflowtemplate_webflow_io.html");

const GITHUB = "https://github.com/devzeromax/Nxtrive";
const RELEASES = "https://github.com/devzeromax/Nxtrive/releases";

/**
 * Turn a raw Webflow asset filename into a clean, human-readable name:
 * drops the leading hash and the template-provider suffixes, while keeping
 * the descriptive part and any responsive size marker (e.g. -p-800).
 * MUST stay in sync with the rename applied to the physical files.
 *   6917829257..._connected-with-all-mcp-tools-alt-terminalai-webflow-template.png
 *   -> connected-with-all-mcp-tools-alt.png
 */
function cleanImageName(filename) {
  return filename
    .replace(/^[0-9a-f]{16,}_/i, "")
    .replace(/-terminalai-webflow-template/gi, "")
    .replace(/-terminal-ai-webflow-template/gi, "")
    .replace(/-agentflow-webflow-template/gi, "")
    .replace(/-brix-templates/gi, "")
    .replace(/-webflow-template/gi, "")
    .replace(/--+/g, "-")
    .replace(/-(\.[a-z0-9]+)$/i, "$1");
}

function decodeEntities(s) {
  return s
    .replace(/&#34;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"');
}

function extractBody(html) {
  const m = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (!m) throw new Error("No <body> found in template");
  return m[1].trim();
}

function extractScripts(html) {
  const body = extractBody(html);
  const scripts = [];
  const re = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = re.exec(body)) !== null) {
    const attrs = match[1];
    const content = match[2];
    const src = attrs.match(/src="([^"]+)"/)?.[1];
    scripts.push({ src: src || null, content: src ? "" : content });
  }
  return scripts;
}

function stripScriptsFromBody(body) {
  return body.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "").trim();
}

/** Replace text only between > and < so attributes/classes stay intact */
function swapText(html, from, to) {
  const esc = from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return html.replace(new RegExp(`(?<=>)\\s*${esc}\\s*(?=<)`, "g"), to);
}

function swapAll(html, pairs) {
  let out = html;
  for (const [from, to] of pairs) out = swapText(out, from, to);
  return out;
}

function swapHref(html, from, to) {
  return html.split(from).join(to);
}

function swapImgSrc(html, oldUrl, newPath) {
  return html.split(oldUrl).join(newPath);
}

let html = decodeEntities(readFileSync(SRC, "utf8"));
const scripts = extractScripts(html);
let body = stripScriptsFromBody(extractBody(html));

// ── Logos ──────────────────────────────────────────────────────────────────
body = swapImgSrc(
  body,
  "https://cdn.prod.website-files.com/690b64ff4796ea332638f483/695eda07ce6aa30f501837dc_logo-agentflow-webflow-template.png",
  "/logos/nxtrive-logo-lockup.png"
);
body = swapImgSrc(
  body,
  "https://cdn.prod.website-files.com/690b64ff4796ea332638f483/695eda071bd4e8a309d1e60d_logo-white-agentflow-webflow-template.png",
  "/logos/nxtrive-logo-lockup.png"
);

// ── Hero product image ─────────────────────────────────────────────────────
body = swapImgSrc(
  body,
  "https://cdn.prod.website-files.com/690b64ff4796ea332638f483/695fd5b27d29eb065510b7a9_home-v1-hero-image-terminalai-webflow-template.png",
  "/images/nxtrive-hero-chat.png"
);

// ── How it works overlay (keeps navy canvas + cursor; swaps install mock) ───
body = swapImgSrc(
  body,
  "https://cdn.prod.website-files.com/690b64ff4796ea332638f483/695fd6fd296c28c7d6985b76_installation-agentflow-webflow-template.png",
  "/images/nxtrive-how-it-works.png"
);

// ── Feature card icons ─────────────────────────────────────────────────────
// Keep the ORIGINAL square icons from the template (monitor, sync, wrench,
// shield). They fall through to the catch-all localizer below, which rewrites
// them to /template-images/*.jpg.

// ── Pricing card icons ─────────────────────────────────────────────────────
body = swapImgSrc(
  body,
  "https://cdn.prod.website-files.com/690b64ff4796ea332638f483/69405a7581aabfbff76a632d_free-plan-square-icon-terminalai-webflow-template.jpg",
  "/logos/windows.svg"
);
body = swapImgSrc(
  body,
  "https://cdn.prod.website-files.com/690b64ff4796ea332638f483/69405a75a81bd6070de14e89_advanced-plan-square-icon-terminalai-webflow-template.jpg",
  "/logos/apple.svg"
);
body = swapImgSrc(
  body,
  "https://cdn.prod.website-files.com/690b64ff4796ea332638f483/69405a759ef612eb8be689f0_pro-plan-square-icon-terminalai-webflow-template.jpg",
  "/logos/linux-logo.wine.svg"
);

// ── Blog / news images ─────────────────────────────────────────────────────
body = swapImgSrc(
  body,
  "https://cdn.prod.website-files.com/690b64ff4796ea332638f48c/695e9a6374e6c2cf57feb034_engineers-collaborating-with-modern-command-line-tools-3-2-terminalai-webflow-template.png",
  "/images/personas/research.jpg"
);

// ── Testimonial avatars → persona photos (cycle) ───────────────────────────
const avatars = [
  "690ba933df37d092bebed077_john-carter-avatar-terminalai-webflow-template.png",
  "690ba933db0dad3633d13827_sophie-moore-avatar-terminalai-webflow-template.png",
  "690ba93362692b744103205c_matt-cannon-avatar-terminalai-webflow-template.png",
  "690ba933b1dfa04fed3609f1_lilly-woods-avatar-terminalai-webflow-template.png",
  "690ba933e04d148f364045a6_andy-smith-avatar-terminalai-webflow-template.png",
  "690ba93380f3da9038f03061_sand-houston-avatar-terminalai-webflow-template.png",
  "690ba933462838c197849f21_patrick-meyer-avatar-terminalai-webflow-template.png",
  "690ba9335ce9fbb3aa07ef45_maya-collins-avatar-terminalai-webflow-template.png",
  "690bafbe772e771377800498_john-carter-avatar-terminalai-webflow-template.png",
];
const personas = [
  "/images/personas/legal.jpg",
  "/images/personas/clinical.jpg",
  "/images/personas/research.jpg",
  "/images/personas/developers.jpg",
  "/images/personas/teams.jpg",
  "/images/personas/privacy.jpg",
];
avatars.forEach((file, i) => {
  const url = `https://cdn.prod.website-files.com/690b64ff4796ea332638f483/${file}`;
  const altUrl = `https://cdn.prod.website-files.com/690b64ff4796ea332638f48c/${file}`;
  const target = personas[i % personas.length];
  body = body.split(url).join(target);
  body = body.split(altUrl).join(target);
});

// ── Download / CTA links ───────────────────────────────────────────────────
body = swapHref(body, 'href="https://www.apple.com/la/app-store/"', `href="${RELEASES}"`);
body = swapHref(body, 'href="https://github.com/"', `href="${GITHUB}"`);
body = swapHref(body, 'href="https://x.com/"', `href="${GITHUB}"`);
body = swapHref(body, 'href="https://linkedin.com/"', `href="${GITHUB}"`);
body = swapHref(body, 'href="https://discord.com/"', `href="${GITHUB}"`);
body = swapHref(body, 'href="https://brixtemplates.com/"', `href="${GITHUB}"`);
body = swapHref(body, 'href="https://webflow.com/"', `href="${RELEASES}"`);
body = swapHref(
  body,
  'href="/blog-pages/blog-posts/the-best-search-apis-to-use-in-your-terminal"',
  `href="${GITHUB}"`
);

// ── Nav: single-page anchors (structure unchanged) ─────────────────────────
body = swapHref(body, 'href="/home-pages/home-v1"', 'href="#top"');
body = swapHref(body, 'href="/company-pages/about"', 'href="#features"');
body = swapHref(body, 'href="/company-pages/pricing"', 'href="#download"');
body = swapHref(body, 'href="/"', 'href="#top"');

// Kill remaining template demo URLs (soft-404 risk for SEO + UX)
body = body.replace(/href="\/blog-pages\/[^"]*"/g, `href="${GITHUB}" target="_blank" rel="noopener noreferrer"`);
body = body.replace(
  /href="\/(?:home-pages|contact-pages|company-pages|user-pages|landing-pages|template-pages)\/[^"]*"/g,
  'href="#top"'
);
body = body.replace(/href="\/(?:404|401)"/g, 'href="#top"');


// ── Text content swaps (Nxtrive data) ──────────────────────────────────────
const LOREM =
  "Lorem ipsum dolor sit amet consectetur euismod integer ullamcorper orci enim et et eget dolor.";
const LOREM_SHORT =
  "Lorem ipsum dolor sit amet consectetur euismod integer ullamcorper orci enim.";

body = swapAll(body, [
  ["Your computer, automated", "Chat with your PDFs and documents offline using local RAG"],
  [
    LOREM,
    "Nxtrive is a free, open-source offline local RAG desktop app for Windows, macOS, and Linux. Turn folders of PDFs, Word documents, Markdown files, and source code into a private knowledge base on your machine.",
  ],
  [
    LOREM_SHORT,
    "Every answer links to the exact passage. Open a source preview to verify before you trust it.",
  ],
  ["Installation", "How it works"],
  ["Install in your term or IDE of choice", "Three steps to private answers"],
  ["Download for Windows", "Download for Windows"],
  ["Handoff your computer to AI", "Offline local RAG features for private document chat"],
  ["System control", "Source citations"],
  [
    "Commodo nisl quis sagittis sit et integer vestibulum vulputate eget cursus mauris mi amet id diam sn montes lacus nulla donnec convallis diam egestas",
    "Ingest entire folders with drag-and-drop, organize multiple collections, and chat with cited passages pulled directly from your PDFs and documents.",
  ],
  ["Task automation", "Drag-and-drop ingestion"],
  ["Connected with all MCP tools", "Multiple collections"],
  [
    "Commodo nisl quis sagittis sit et integer vestibulum vulputate eget cursus mauris mi amet id diam sn.",
    "Organize by client, topic, or engagement. Switch instantly, pin active libraries, and delete data from the UI when done.",
  ],
  ["Safe execution", "Fully offline"],
  ["A next-gen AI agent, in your terminal.", "Your documents. Your machine. Your answers."],
  ["Testimonials", "Use cases"],
  ["Trusted by many users", "Who uses offline local RAG"],
  ["John Carter", "Legal & compliance"],
  ["@johncarter", "@legal"],
  [
    "I love how fast it is to automate builds and deploys. The CLI feels modern, and every command runs flawlessly",
    "Review contracts and NDAs without cloud exposure. Index vendor agreements and policy libraries on your machine.",
  ],
  ["Sophie Moore", "Doctors & clinicians"],
  ["@sophiemoore", "@clinical"],
  [
    "It's amazing how simple it is to set up workflows. The terminal looks clean, and everything executes without errors",
    "Query patient notes and medical literature offline. Keep PHI on-device while searching across clinical notes and research PDFs.",
  ],
  ["Matt Cannon", "Researchers & students"],
  ["@mattcannon", "@research"],
  [
    "Running tests and deployments with one command is incredible. The interface feels modern, and nothing ever slows me down",
    "Chat with papers and notes without leaving your desk. Drop folders of PDFs and markdown into a collection and chat across hundreds of sources.",
  ],
  ["Lilly Woods", "Developers"],
  ["@lillywoods", "@developers"],
  [
    "The integration with Git is smooth and reliable. The terminal feels fresh, and pushing code has never been easier",
    "Search codebases and technical docs with cited context. Point Nxtrive at a repo or docs folder and ground every answer in your indexed sources.",
  ],
  ["Andy Smith", "Small teams"],
  ["@andyhouston", "@teams"],
  [
    "I love how smart the autocomplete is in daily tasks. The CLI feels intuitive, and every shortcut works perfectly well",
    "Shared-folder knowledge without a SaaS subscription. Spin up separate collections per client or project on each machine.",
  ],
  ["Sandy Houston", "Privacy-conscious users"],
  ["@sandyhouston", "@privacy"],
  [
    "It's so quick to schedule automated jobs from the terminal. The design feels lightweight, and tasks finish right on time",
    "Personal document Q&A with zero telemetry. No accounts, no API keys, no document analytics.",
  ],
  ["Patrick Meyer", "Legal & compliance"],
  ["@patrickmeyer", "@legal"],
  [
    "I like how straightforward it is to customize prompts. The CLI feels flexible, and everything adapts to my workflow",
    "Ask natural-language questions, open cited passages in preview, and keep every embedding and chat on localhost.",
  ],
  ["Maya Collins", "Doctors & clinicians"],
  ["@mayacollins", "@clinical"],
  [
    "Real-time feedback on running processes is extremely helpful. The terminal feels alive, and monitoring results is now painless",
    "Citations point to the exact passage so you can verify before acting — no cloud upload required.",
  ],
  ["Pricing", "Download"],
  ["Start for free, scale if you need it", "Download Nxtrive for Windows, macOS, and Linux"],
  ["Run unlimited AI-powered commands seamlessly", "PDF, Word (.docx), plain text, Markdown, CSV, JSON, HTML, CSS, and source code"],
  ["Automate workflows with task scheduling and chaining", "Source citations show exactly which file and section each answer came from"],
  ["Integrate with tools like Git, Docker, and Kubernetes", "Works completely offline after one-time Ollama model download"],
  ["Real-time error detection and AI-powered fixes", "Real-time token-by-token streaming answers"],
  ["Create and share reusable command workflows with your team", "Separate knowledge bases per client, topic, or engagement"],
  ["Cross-platform support for macOS, Linux, and Windows", "Windows 10/11, macOS 10.15+, Ubuntu 22.04+ (or equivalent Linux)"],
  ["Free plan", "Windows"],
  ["Limited daily usage", "Windows 10 / 11"],
  ["Advanced plan", "macOS"],
  ["20X usage limit from free", "macOS 10.15+"],
  ["Pro plan", "Linux"],
  ["Unlimited usage", "Ubuntu 22.04+ / equivalent"],
  ["Our blog", "FAQ"],
  ["Our latest news", "Frequently asked questions about local RAG"],
  ["Browse all articles", "View on GitHub"],
  ["Technology", "Local RAG"],
  ["The future of command line tools in modern teams", "What is local RAG?"],
  ["Read article", "Read more"],
  ["The best search APIs to use in your terminal", "Does Nxtrive work completely offline?"],
  ["Why AI copilots simplify the command line", "Which file types does Nxtrive support?"],
  ["How CLI AI agents integrate seamlessly with the cloud", "Is Nxtrive free?"],
  ["Business", "Requirements"],
  ["User experience", "System"],
  ["$ npm i -g @quantum/agentflow", "100% offline · open source · MIT"],
  ["About us", "About"],
  ["Sign up", "GitHub"],
]);

// ── Remove all Webflow / BRIX branding ─────────────────────────────────────
// Footer credit line ("Designed by BRIX Templates - Powered by Webflow")
body = body.replace(
  /Copyright © Agentflow[\s\S]*?Powered by\s*<a[^>]*>\s*Webflow\s*<\/a>/,
  "Copyright © 2026 Nxtrive · Open source under the MIT license"
);
// Fallback if structure differs slightly
body = body.replace(
  /Copyright © Agentflow[^<]*/,
  "Copyright © 2026 Nxtrive · Open source under the MIT license "
);

// Remove the "More Webflow Templates" footer promo link (and its wrapper)
body = body.replace(/<a [^>]*more-webflow-template[\s\S]*?<\/a>/g, "");
body = body.replace(/<div class="mg-top-sm">\s*<\/div>/g, "");

// Scrub Webflow/BRIX wording from alt attributes only (never URLs or classes)
body = body.replace(/ alt="[^"]*"/g, (m) =>
  m
    .replace(/TerminalAI Webflow Template \| BRIX Template/g, "Nxtrive")
    .replace(/Agentflow Webflow Template - Logo/g, "Nxtrive logo")
    .replace(/Agentflow Webflow Template/g, "Nxtrive")
    .replace(/Webflow Template/g, "")
    .replace(/\| BRIX Template[s]?/g, "")
    .replace(/BRIX Template[s]?/g, "Nxtrive")
    .replace(/TerminalAI/g, "Nxtrive")
    .replace(/\bWebflow\b/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+"/g, '"')
);

// Pricing numbers (Nxtrive is free — all $0)
body = swapText(body, "19", "0");
body = swapText(body, "29", "0");

// Alt text updates
body = body.replace(/alt="Agentflow Webflow Template - Logo"/g, 'alt="Nxtrive logo"');
body = body.replace(
  /alt="Your Computed Automated - Agentflow Webflow Template"/g,
  'alt="Nxtrive chat interface - ask questions about your documents offline"'
);
body = body.replace(
  /alt="Install In Your Term Or IDE Of Choice - [^"]*"/g,
  'alt="How Nxtrive works: select a folder, index offline, ask private questions"'
);

// ── Section anchors for nav links ──────────────────────────────────────────
body = body.replace(
  '<section class="section_card-wrapper">',
  '<section class="section_card-wrapper overflow-visible" id="top">'
);
/* Keep home card overflow visible so the tablet bottom is not hard-cropped */
body = body.replace(
  'data-w-id="9d48c936-5ca3-7eef-8cdd-9e1d6b3e1ad6" class="section is-size-lg"',
  'data-w-id="9d48c936-5ca3-7eef-8cdd-9e1d6b3e1ad6" class="section is-size-lg" id="features"'
);
body = body.replace(
  '<div class="section_card is-pricing-section">',
  '<div class="section_card is-pricing-section" id="download">'
);
body = body.replace(
  '<section data-w-id="c1267d1c-b74c-169b-fa51-8b8285d59359" class="section is-size-lg is-bottom-0">',
  '<section data-w-id="c1267d1c-b74c-169b-fa51-8b8285d59359" class="section is-size-lg is-bottom-0" id="how-it-works">'
);
body = body.replace(
  /(<section class="section is-size-lg">\s*<div class="w-layout-blockcontainer container w-container">\s*<div class="w-layout-grid grid-cols-2-auto is-col-1-tablet-center mg-bottom-md">)/,
  '<section class="section is-size-lg" id="faq">\n        <div class="w-layout-blockcontainer container w-container">\n          <div class="w-layout-grid grid-cols-2-auto is-col-1-tablet-center mg-bottom-md">'
);

// ── Hero + header Download CTAs: no Apple/macOS brand ──────────────────────
const DOWNLOAD_ARROW_ICON = `<div class="content-slot icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 14 14" fill="none" class="ui-icon" aria-hidden="true">
                      <path d="M7 1.75v7.5M7 9.25L4 6.25M7 9.25l3-3M2.5 12.25h9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                  </div>`;

const APPLE_ICON_SLOT =
  /<div class="content-slot icon">\s*<svg[\s\S]*?M6\.79116 1\.30541[\s\S]*?<\/svg>\s*<\/div>/g;

// Header navbar primary Download: drop Apple logo (all occurrences in header)
{
  const headerEnd = body.indexOf('id="top"');
  if (headerEnd !== -1) {
    let header = body.slice(0, headerEnd);
    header = header.replace(APPLE_ICON_SLOT, DOWNLOAD_ARROW_ICON);
    body = header + body.slice(headerEnd);
  }
}

// Hero home card only (#top … how-it-works): Download For Free, no Apple mark
{
  const heroStart = body.indexOf('id="top"');
  const heroEnd = body.indexOf('id="how-it-works"', heroStart);
  if (heroStart !== -1 && heroEnd !== -1) {
    let hero = body.slice(heroStart, heroEnd);
    hero = hero.replace(APPLE_ICON_SLOT, DOWNLOAD_ARROW_ICON);
    hero = hero.replace(
      /<div>\s*Download for Mac\s*<\/div>/g,
      "<div>Download For Free</div>"
    );
    hero = hero.replace(
      /<div>\s*Download for macOS\s*<\/div>/g,
      "<div>Download For Free</div>"
    );
    body = body.slice(0, heroStart) + hero + body.slice(heroEnd);
  }
}

// ── Header + footer nav: strip template “Pages” noise ───────────────────────
// Heuristics: Don’t Make Me Think — only real destinations on this one page.
// SEO: no crawlable 404s to missing /home-v2, /blog-v1, /sign-up, etc.
function navLinkTitle(href, label) {
  return `<li class="header_list-item">
                      <a data-wf--ui-element---link-global--link---style="is-title" href="${href}" class="link w-variant-d4c9f12f-acf6-fbc0-1fac-22586269a8e0 w-inline-block">                      <div data-wf--ui-element---link-single-static--link-single---size="is-default" class="control-group">
                        <div>${label}</div>
                      </div>
</a>
                    </li>`;
}

function footerLink(href, label, { external = false } = {}) {
  const attrs = external
    ? `href="${href}" target="_blank" rel="noopener noreferrer"`
    : `href="${href}"`;
  return `<li>
                          <a data-wf--ui-element---link-global--link---style="is-light" ${attrs} class="link w-variant-6e8af443-fe17-01a4-cb2c-e281ff8be2da w-inline-block">                          <div data-wf--ui-element---link-single-static--link-single---size="is-default" class="control-group">
                            <div>${label}</div>
                          </div>
</a>
                        </li>`;
}

function footerColumn(title, linksHtml) {
  return `<div class="flex-vertical-left gap-sm">
                    <div class="display-4">${title}</div>
                    <div class="w-layout-grid footer_nav-column is-cols-1">
                      <ul role="list" class="footer_nav-list w-list-unstyled">
                        ${linksHtml}
                      </ul>
                    </div>
                  </div>`;
}

const headerListStart = body.indexOf('<ul role="list" class="header_list">');
const headerCtaItem = body.indexOf(
  '<li class="header_list-item visible-landscape">',
  headerListStart
);
if (headerListStart !== -1 && headerCtaItem !== -1) {
  body =
    body.slice(0, headerListStart) +
    `<ul role="list" class="header_list">
                    ${navLinkTitle("#features", "Features")}
                    ${navLinkTitle("#how-it-works", "How it works")}
                    ${navLinkTitle("#faq", "FAQ")}
                    ` +
    body.slice(headerCtaItem);
  // Ensure the primary Download CTA is a safe external link
  body = body.replace(
    /(<li class="header_list-item visible-landscape">\s*<a href="https:\/\/github\.com\/devzeromax\/Nxtrive\/releases")(\s*)(target="_blank")?/,
    `$1 target="_blank" rel="noopener noreferrer"`
  );
}

const footerNavStart = body.indexOf('<div class="w-layout-grid footer_nav">');
const footerMiddle = body.indexOf('class="footer_middle"', footerNavStart);
if (footerNavStart !== -1 && footerMiddle !== -1) {
  const middleTagStart = body.lastIndexOf("<div", footerMiddle);
  body =
    body.slice(0, footerNavStart) +
    `<div class="w-layout-grid footer_nav">
                  ${footerColumn(
                    "Product",
                    [
                      footerLink("#features", "Features"),
                      footerLink("#how-it-works", "How it works"),
                      footerLink("#download", "Download"),
                      footerLink("#faq", "FAQ"),
                    ].join("\n                        ")
                  )}
                  ${footerColumn(
                    "Resources",
                    [
                      footerLink(GITHUB, "GitHub", { external: true }),
                      footerLink(RELEASES, "Releases", { external: true }),
                      footerLink(`${GITHUB}/blob/main/README.md`, "Documentation", {
                        external: true,
                      }),
                    ].join("\n                        ")
                  )}
                  ${footerColumn(
                    "Open source",
                    [
                      footerLink(`${GITHUB}/blob/main/LICENSE`, "MIT License", {
                        external: true,
                      }),
                      footerLink(`${GITHUB}/issues`, "Report an issue", {
                        external: true,
                      }),
                    ].join("\n                        ")
                  )}
                </div>
              </div>
            </div>
            ` +
    body.slice(middleTagStart);
}

// Replace dead newsletter signup (no backend) with a clear download CTA
body = body.replace(
  /<div data-w-id="24b26a27-e703-0f02-05ec-e919f363fe59" class="footer_middle">[\s\S]*?<div class="divider_dark footer-divider">/,
  `<div data-w-id="24b26a27-e703-0f02-05ec-e919f363fe59" class="footer_middle">
              <div class="footer_column is-w45 is-align-center-tablet">
                <h2 class="display-8 text-color-light">Download free for Windows, macOS, and Linux.</h2>
              </div>
              <div class="footer_column is-w35">
                <div class="button-row is-align-left">
                  <a href="${RELEASES}" target="_blank" rel="noopener noreferrer" class="button_border is-primary w-inline-block">
                    <div class="button is-primary"><div>Get Nxtrive</div></div>
                  </a>
                  <a href="${GITHUB}" target="_blank" rel="noopener noreferrer" class="link w-variant-6e8af443-fe17-01a4-cb2c-e281ff8be2da w-inline-block">
                    <div data-wf--ui-element---link-single-static--link-single---size="is-default" class="control-group">
                      <div>View source</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
            <div class="divider_dark footer-divider">`
);

// Tighten footer blurb (scan, don't lecture)
body = body.replace(
  /(<div class="footer_column is-w35[^"]*">[\s\S]*?<div class="inner_container is-35ch">\s*<p class="mg-vertical-3xs-2xs">)[^<]+(<\/p>)/,
  `$1Offline local RAG for Windows, macOS, and Linux. Chat with your documents privately on your machine.$2`
);

// FAQ: real Q&A (not thin blog-card titles) — crawlable answers + FAQPage schema
{
  const faqItems = [
    {
      q: "What is local RAG?",
      a: "Local RAG (retrieval-augmented generation) runs document search and chat on your machine. Nxtrive is a free, open-source offline local RAG desktop app for Windows, macOS, and Linux — turn folders of PDFs, Word documents, Markdown, and source code into a private knowledge base.",
    },
    {
      q: "Does Nxtrive work completely offline?",
      a: "Yes. After a one-time Ollama model download, indexing and chat run fully on your device. There is no cloud upload required for day-to-day use.",
    },
    {
      q: "Which file types does Nxtrive support?",
      a: "PDF, Word (.docx), plain text, Markdown, CSV, JSON, HTML, CSS, and source code. Answers include source citations so you can open the exact passage.",
    },
    {
      q: "Is Nxtrive free?",
      a: "Yes. Nxtrive is free and open source under the MIT license for Windows, macOS, and Linux.",
    },
    {
      q: "Do my documents leave my computer?",
      a: "No. Embeddings, vectors, and chats stay on localhost. Your files never leave your machine.",
    },
  ];
  const faqList = faqItems
    .map(
      ({ q, a }) => `<div class="nx-faq__item" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
                  <h3 class="nx-faq__q display-6 heading-title" itemprop="name">${q}</h3>
                  <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                    <p class="nx-faq__a text-neutral-600" itemprop="text">${a}</p>
                  </div>
                </div>`
    )
    .join("\n                ");
  body = body.replace(
    /(<section class="section is-size-lg" id="faq">[\s\S]*?<div class="mg-bottom-sm w-dyn-list">)[\s\S]*?(<\/div>\s*<\/div>\s*<\/section>\s*<footer)/,
    `$1
            <div class="nx-faq" role="list">
                ${faqList}
            </div>
          $2`
  );
}

// Features card: native HTML flow (readable text) instead of the washed-out PNG
body = body.replace(
  /<div class="card__image--feature-second">\s*<\/div>/,
  `<div class="card__image--feature-second nx-features-flow" aria-hidden="true">
                  <ol class="nx-features-flow__list">
                    <li class="nx-features-flow__item is-active">
                      <span class="nx-features-flow__icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.5 7.5h5.2l1.6 1.8H20.5v8.2a2 2 0 0 1-2 2H5.5a2 2 0 0 1-2-2V7.5Z" fill="#2F6BFF"/><path d="M3.5 7.5V6.2A1.7 1.7 0 0 1 5.2 4.5h4.1L11 6.2H3.5Z" fill="#2F6BFF"/></svg>
                      </span>
                      <span class="nx-features-flow__label">Drag-and-drop ingestion</span>
                    </li>
                    <li class="nx-features-flow__item">
                      <span class="nx-features-flow__icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 5.5h14a1.5 1.5 0 0 1 1.5 1.5v2H3.5V7A1.5 1.5 0 0 1 5 5.5Z" fill="#6B7280"/><path d="M3.5 10.5h17v3.2H3.5v-3.2Z" fill="#6B7280"/><path d="M3.5 15.2h17V18A1.5 1.5 0 0 1 19 19.5H5A1.5 1.5 0 0 1 3.5 18v-2.8Z" fill="#6B7280"/></svg>
                      </span>
                      <span class="nx-features-flow__label">Organizing collections</span>
                    </li>
                    <li class="nx-features-flow__item">
                      <span class="nx-features-flow__icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 5.5h11.5A2.5 2.5 0 0 1 19 8v6.2a2.5 2.5 0 0 1-2.5 2.5H10l-3.8 2.6V16.7H5A2.5 2.5 0 0 1 2.5 14.2V8A2.5 2.5 0 0 1 5 5.5Z" fill="#6B7280"/><circle cx="8" cy="11" r="1.1" fill="#fff"/><circle cx="12" cy="11" r="1.1" fill="#fff"/><circle cx="16" cy="11" r="1.1" fill="#fff"/></svg>
                      </span>
                      <span class="nx-features-flow__label">Chatting with your data</span>
                    </li>
                    <li class="nx-features-flow__item">
                      <span class="nx-features-flow__icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 3.5h7.2L18.5 8v12.5a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" fill="#6B7280"/><path d="M14.2 3.5V8h4.3" fill="#9CA3AF"/><path d="M8.5 12h7M8.5 15h7M8.5 18h5" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/></svg>
                      </span>
                      <span class="nx-features-flow__label">Citations and source passages</span>
                    </li>
                  </ol>
                </div>`
);

// Announcement banner (top of page, dismissible in App.jsx)
const ANNOUNCEMENT_BANNER = `<div class="announcement-banner" role="region" aria-label="Announcement" data-announcement-banner>
      <div class="announcement-banner__inner"><button type="button" class="announcement-banner__dismiss" aria-label="Dismiss announcement"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x announcement-banner__icon" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg></button><div class="announcement-banner__content"><p class="announcement-banner__message m-0 inline-flex flex-wrap items-baseline justify-center gap-x-1.5 font-medium"><span>Nxtrive</span><span class="announcement-banner__highlight">FREE</span><span>forever</span></p><a href="#download" class="announcement-banner__cta">Download free<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right announcement-banner__icon" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg></a></div></div>
    </div>
    `;
body = body.replace(
  /(<div class="page_wrapper">\s*)/,
  `$1${ANNOUNCEMENT_BANNER}`
);

// Remove BRIX template promo badges (trailing block, not Nxtrive content)
body = body.replace(/<div data-w-id="e3448af5-7551-d77a-d369-fe54b2320502"[\s\S]*$/, "");



// Webflow hides these elements with inline `opacity:0`/transform and animates
// them in via its interaction engine (IX2). We KEEP the `data-w-id` hooks and
// the hide-state inline styles so the site plays the EXACT same load + scroll
// animations as the reference template. App.jsx re-initializes IX2 after React
// mounts the DOM, and runs a failsafe that reveals anything IX2 leaves hidden
// so the page can never blank out.

// ── Self-host every remaining template image ───────────────────────────────
// The Nxtrive-branded swaps above already point to /logos or /images. Any
// image still on the Webflow CDN (decorative backgrounds, gradients, world
// maps, cursor, footer bg, etc.) is rewritten to the local /template-images
// folder so the site has zero external image dependencies. Filenames are also
// cleaned (hash prefix + template-provider suffixes removed) for readability;
// keep this identical to cleanImageName() used by the physical file rename.
body = body.replace(
  /https:\/\/cdn\.prod\.website-files\.com\/[0-9a-f]+\/([^"'\s)]+\.(?:png|jpg|jpeg|svg|webp|gif))/g,
  (_m, file) => "/template-images/" + cleanImageName(file)
);

// ── Fix rebranded images that still had responsive srcset variants ─────────
// The Nxtrive swaps above replaced the base `src` (e.g. hero,
// feature/pricing icons -> /logos or /images), but Webflow images also carry a
// `srcset`/`sizes` list of -p-500/-p-800 variants. Those variants localized to
// /template-images and re-surfaced the original template mockups (with baked-in
// "AGENTFLOW"/"TerminalAI" text). Strip srcset/sizes from any <img> whose src
// is now a Nxtrive-branded asset so the clean Nxtrive image is used everywhere.
body = body.replace(/<img\b[^>]*>/g, (tag) => {
  if (!/src="\/(?:logos|images)\//.test(tag)) return tag;
  return tag
    .replace(/\s+srcset="[^"]*"/g, "")
    .replace(/\s+sizes="[^"]*"/g, "");
});

// Write generated module
const outPath = join(__dirname, "src", "templateBody.js");
const escapedBody = JSON.stringify(body);
const escapedScripts = JSON.stringify(scripts);

writeFileSync(
  outPath,
  `// AUTO-GENERATED by build-template.mjs — do not edit by hand\nexport const TEMPLATE_BODY = ${escapedBody};\nexport const TEMPLATE_SCRIPTS = ${escapedScripts};\n`,
  "utf8"
);

console.log(`✓ Generated ${outPath}`);
console.log(`  Body length: ${body.length} chars`);
console.log(`  Scripts: ${scripts.length}`);

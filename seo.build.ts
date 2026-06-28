/** Build-time SEO helpers (no path aliases — safe for vite.config.ts). */

export const BRAND_NAME = "Nxtrive";
const GITHUB_REPO = "https://github.com/nxtriveapp/nxtrive";
const DEFAULT_SITE_URL = "https://nxtrive.app";

/** Flickering footer grid — desktop tagline (matches reference component). */
export const FOOTER_FLICKER_TEXT = "Streamline your workflow";
export const FOOTER_FLICKER_TEXT_MOBILE = BRAND_NAME;

export const SEO = {
  title: `${BRAND_NAME} — Offline Local RAG App | Chat with PDFs & Documents`,
  description:
    "Free, open-source local RAG desktop app for Windows, macOS, and Linux. Chat with PDFs, Word docs, and code using an offline LLM—no cloud, API keys, or account.",
  keywords: [
    "local RAG",
    "offline document chat",
    "private LLM",
    "chat with PDFs offline",
    "local vector database",
    "Ollama RAG",
    "document AI desktop app",
    BRAND_NAME,
  ].join(", "),
  ogTitle: `${BRAND_NAME} — Your documents. Your machine. Your answers.`,
  ogDescription:
    "Local RAG desktop app for Windows, macOS, and Linux. Ingest folders, chat with cited answers, and keep every file on your machine.",
  ogImagePath: "/logos/nxtrive-logo-lockup.png",
  twitterCard: "summary_large_image" as const,
  themeColor: "#111a4a",
  locale: "en_US",
  author: BRAND_NAME,
};

export const FAQ_ITEMS = [
  {
    question: "What is local RAG?",
    answer:
      "Retrieval-augmented generation (RAG) combines search over your files with a language model. Nxtrive runs both steps on your computer, so answers are grounded in your documents without sending data to the cloud.",
  },
  {
    question: "Does Nxtrive work completely offline?",
    answer:
      "Yes. After you download the app and the Ollama model once, indexing and chat work without a network connection—ideal for travel, secure facilities, and air-gapped environments.",
  },
  {
    question: "Which file types does Nxtrive support?",
    answer:
      "PDF, Word (.docx), plain text, Markdown, CSV, JSON, HTML, CSS, and common source-code formats including Python, JavaScript, and TypeScript.",
  },
  {
    question: "Is Nxtrive free?",
    answer:
      "Nxtrive is open source under the MIT license. There is no subscription, usage metering, or account required.",
  },
  {
    question: "What do I need to run Nxtrive?",
    answer:
      "Windows 10/11, macOS 10.15+, or Ubuntu 22.04+ (or equivalent Linux). 8 GB RAM minimum (16 GB+ recommended), plus Ollama installed for the local LLM.",
  },
] as const;

export function getSiteUrl(env: Record<string, string | undefined>): string {
  const raw = env.VITE_SITE_URL?.trim() || DEFAULT_SITE_URL;
  return raw.replace(/\/$/, "");
}

function absoluteUrl(siteUrl: string, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${normalized}`;
}

export function buildJsonLd(siteUrl: string) {
  const image = absoluteUrl(siteUrl, SEO.ogImagePath);

  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: BRAND_NAME,
      description: SEO.description,
      inLanguage: "en-US",
      publisher: { "@id": `${siteUrl}/#organization` },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${siteUrl}/#webpage`,
      url: siteUrl,
      name: SEO.title,
      description: SEO.description,
      inLanguage: "en-US",
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: { "@id": `${siteUrl}/#software` },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: image,
      },
      publisher: { "@id": `${siteUrl}/#organization` },
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: BRAND_NAME,
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl(siteUrl, "/logos/nxtrive-mark.png"),
      },
      sameAs: [GITHUB_REPO],
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "@id": `${siteUrl}/#software`,
      name: BRAND_NAME,
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "Document Management",
      operatingSystem: "Windows, macOS, Linux",
      description: SEO.description,
      url: siteUrl,
      image,
      downloadUrl: `${GITHUB_REPO}/releases`,
      softwareHelp: `${GITHUB_REPO}#readme`,
      license: `${GITHUB_REPO}/blob/main/LICENSE`,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
      featureList: [
        "Offline local RAG",
        "PDF and document chat",
        "Source citations",
        "Multiple collections",
        "Folder drag-and-drop ingestion",
      ],
      publisher: { "@id": `${siteUrl}/#organization` },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${siteUrl}/#faq`,
      mainEntity: FAQ_ITEMS.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ];
}

export function buildSitemapXml(siteUrl: string): string {
  const lastmod = new Date().toISOString().slice(0, 10);

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;
}

export function buildRobotsTxt(siteUrl: string): string {
  return `User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;
}

export function buildNoscriptFallback(): string {
  const nav = [
    ["Features", "#features"],
    ["How it works", "#how-it-works"],
    ["Use cases", "#who-its-for"],
    ["Download", "#download"],
    ["FAQ", "#faq"],
    ["GitHub", GITHUB_REPO],
  ] as const;

  return `<noscript>
    <div style="max-width:42rem;margin:2rem auto;padding:0 1.25rem;font-family:system-ui,sans-serif;line-height:1.6;color:#011821">
      <h1>${SEO.title}</h1>
      <p>${SEO.description}</p>
      <nav aria-label="Primary">
        <ul>
          ${nav.map(([label, href]) => `<li><a href="${href}">${label}</a></li>`).join("\n          ")}
        </ul>
      </nav>
      ${FAQ_ITEMS.map(
        (item) =>
          `<section><h2>${item.question}</h2><p>${item.answer}</p></section>`,
      ).join("\n      ")}
    </div>
  </noscript>`;
}

export function buildLlmsTxt(siteUrl: string): string {
  return `# ${BRAND_NAME}

> ${SEO.description}

## Product
- Offline local RAG desktop app for Windows, macOS, and Linux
- Chat with PDFs, Word docs, and code using a local LLM
- Open source (MIT): ${GITHUB_REPO}

## Canonical URL
${siteUrl}/

## Key pages
- ${siteUrl}/#features — Product features
- ${siteUrl}/#download — Download links
- ${siteUrl}/#faq — Frequently asked questions

## Documentation
${GITHUB_REPO}#readme
`;
}

export function buildSeoHeadTags(siteUrl: string): string {
  const canonical = siteUrl;
  const ogImage = absoluteUrl(siteUrl, SEO.ogImagePath);

  return `
    <link rel="canonical" href="${canonical}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="author" content="${SEO.author}" />
    <meta name="keywords" content="${SEO.keywords}" />
    <meta name="application-name" content="${BRAND_NAME}" />
    <meta name="format-detection" content="telephone=no" />
    <link rel="dns-prefetch" href="https://github.com" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${BRAND_NAME}" />
    <meta property="og:locale" content="${SEO.locale}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:image:alt" content="${BRAND_NAME} logo — offline local RAG desktop app" />
    <meta name="twitter:card" content="${SEO.twitterCard}" />
    <meta name="twitter:title" content="${SEO.ogTitle}" />
    <meta name="twitter:description" content="${SEO.ogDescription}" />
    <meta name="twitter:image" content="${ogImage}" />
    <link rel="apple-touch-icon" href="/logos/nxtrive-mark.png" />
    <link rel="manifest" href="/site.webmanifest" />
    ${buildJsonLd(siteUrl)
      .map(
        (graph) =>
          `<script type="application/ld+json">${JSON.stringify(graph)}</script>`,
      )
      .join("\n    ")}`;
}

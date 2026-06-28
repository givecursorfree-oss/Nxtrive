/** Build-time SEO helpers (no path aliases — safe for vite.config.ts). */

export const BRAND_NAME = "Nxtrive";
const GITHUB_REPO = "https://github.com/givecursorfree-oss/Nxtrive";
/** Temporary canonical until nxtrive.app DNS is live — override via VITE_SITE_URL on Vercel. */
export const DEFAULT_SITE_URL = "https://nxtrive.vercel.app";

/** Flickering footer grid — desktop tagline (matches reference component). */
export const FOOTER_FLICKER_TEXT = "Streamline your workflow";
export const FOOTER_FLICKER_TEXT_MOBILE = BRAND_NAME;

export const SEO = {
  title: `${BRAND_NAME} — Offline Local RAG App | Chat with PDFs & Documents`,
  description:
    "Offline local RAG app for Windows, macOS and Linux. Chat with PDFs and documents privately—no cloud, API keys, or account.",
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

export function buildStaticSeoContent(): string {
  return `<main id="static-seo-fallback" class="static-seo-fallback">
    <h1>Chat with your PDFs and documents offline using local RAG</h1>
    <p>
      ${BRAND_NAME} is a free, open-source offline local RAG desktop app for Windows, macOS, and Linux.
      Turn folders of PDFs, Word documents, Markdown files, and source code into a private knowledge base on
      your machine. Ask questions in plain language and get cited answers from a local LLM—not a cloud API.
    </p>
    <p>
      Local RAG (retrieval-augmented generation) searches your files first, then lets a language model answer
      using only what it retrieved. Every document stays on your device. There are no API keys, no accounts,
      and no uploads to third-party servers. After you download ${BRAND_NAME} and an Ollama model once, chat
      and indexing work completely offline.
    </p>
    <section id="features">
      <h2>Offline local RAG features for private document chat</h2>
      <p>
        Ingest entire folders with drag-and-drop, organize multiple collections, and chat with cited passages
        pulled directly from your PDFs and documents. ${BRAND_NAME} supports PDF, Word (.docx), plain text,
        Markdown, CSV, JSON, HTML, CSS, and common programming languages including Python, JavaScript, and
        TypeScript. Source citations show exactly which file and section each answer came from.
      </p>
    </section>
    <section id="how-it-works">
      <h2>How offline document chat works</h2>
      <p>
        Add a folder, ${BRAND_NAME} chunks and embeds your files into a local vector database, then connects
        to Ollama for inference on your hardware. When you ask a question, the app retrieves the most relevant
        passages and sends them to the model as context—grounding every response in your own content rather
        than the open web.
      </p>
    </section>
    <section id="who-its-for">
      <h2>Who uses offline local RAG</h2>
      <p>
        Researchers, developers, legal teams, clinicians, and privacy-conscious professionals use ${BRAND_NAME}
        when sensitive documents cannot leave the network. It is ideal for air-gapped environments, travel,
        client work under NDA, and anyone who wants document AI without subscription fees or vendor lock-in.
      </p>
    </section>
    <section id="download">
      <h2>Download ${BRAND_NAME} for Windows, macOS, and Linux</h2>
      <p>
        ${BRAND_NAME} is open source under the MIT license. Download the latest release for your platform from
        GitHub. You need 8 GB RAM minimum (16 GB recommended) and Ollama installed for the local language model.
        Windows 10/11, macOS 10.15+, and Ubuntu 22.04+ (or equivalent Linux) are supported.
      </p>
    </section>
    <section id="faq">
      <h2>Frequently asked questions about local RAG</h2>
      ${FAQ_ITEMS.map(
        (item) =>
          `<h3>${item.question}</h3><p>${item.answer}</p>`,
      ).join("\n      ")}
    </section>
    <nav aria-label="Primary">
      <ul>
        <li><a href="#features">Features</a></li>
        <li><a href="#how-it-works">How it works</a></li>
        <li><a href="#who-its-for">Use cases</a></li>
        <li><a href="#download">Download</a></li>
        <li><a href="#faq">FAQ</a></li>
        <li><a href="${GITHUB_REPO}">GitHub</a></li>
      </ul>
    </nav>
  </main>`;
}

export function buildNoscriptFallback(): string {
  return `<noscript>
    ${buildStaticSeoContent()}
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

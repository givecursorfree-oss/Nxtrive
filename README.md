<p align="center">
  <img src="public/logos/nxtrive-mark.png" alt="Nxtrive logo" width="80" height="80" />
</p>

<h1 align="center">Nxtrive</h1>

<p align="center">
  <strong>Your documents. Your machine. Your answers.</strong>
</p>

<p align="center">
  Free, open-source offline local RAG desktop app for Windows, macOS, and Linux.<br />
  Chat with PDFs, Word docs, and code using a private on-device LLM — no cloud, API keys, or account.
</p>

<p align="center">
  <a href="https://nxtrive.vercel.app/"><strong>Live website</strong></a> ·
  <a href="https://github.com/devzeromax/Nxtrive/releases">Releases</a> ·
  <a href="https://github.com/devzeromax/Nxtrive/issues">Issues</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" alt="Vite 8" />
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="MIT License" />
</p>

---

## About

**Nxtrive** is a local [RAG](https://en.wikipedia.org/wiki/Retrieval-augmented_generation) (retrieval-augmented generation) desktop application. It indexes your folders locally, retrieves the most relevant passages, and answers questions with **source citations** — all without sending data to the cloud.

This repository is the **official marketing website** and landing page for Nxtrive, maintained by [**@devzeromax**](https://github.com/devzeromax).

| | |
|---|---|
| **Website** | [nxtrive.vercel.app](https://nxtrive.vercel.app/) |
| **Repository** | [github.com/devzeromax/Nxtrive](https://github.com/devzeromax/Nxtrive) |
| **Platforms** | Windows · macOS · Linux |
| **LLM runtime** | [Ollama](https://ollama.com/) (local) |

---

## Why Nxtrive?

- **100% offline** — works after initial model download; ideal for air-gapped and secure environments
- **Private by design** — documents never leave your machine
- **Open source (MIT)** — no subscription, usage limits, or account required
- **Cited answers** — responses grounded in your files with traceable sources
- **Broad file support** — PDF, Word, Markdown, CSV, JSON, HTML, CSS, and source code

---

## Website Features

This landing page is a production-grade React SPA built to rank for **local RAG**, **offline document chat**, and **private LLM** searches.

### Product experience
- Animated hero with live chat mockup and scroll-driven product showcase
- Persona-based use-case selector (research, legal, clinical, developers, and more)
- Platform download section with GitHub release links
- FAQ with accordion UI and structured data
- Flickering dot-grid footer, smooth scroll, and reduced-motion support
- Fully responsive with accessible navigation and skip links

### SEO & technical
- Build-time meta tags, Open Graph, and Twitter Cards
- JSON-LD: `WebSite`, `WebPage`, `Organization`, `SoftwareApplication`, `FAQPage`
- Static crawlable HTML for search engines and audit tools
- Auto-generated `sitemap.xml`, `robots.txt`, and `llms.txt`
- Security headers (CSP, Referrer-Policy, X-Frame-Options)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| UI | React 19 · TypeScript |
| Build | Vite 8 |
| Styling | Tailwind CSS v4 |
| Animation | Motion · Lenis |
| Icons | Lucide React |
| Lint | Oxlint |
| Hosting | Vercel |

---

## Quick Start

### Prerequisites

- Node.js **20+**
- npm **10+**

### Install & run

```bash
git clone https://github.com/devzeromax/Nxtrive.git
cd Nxtrive
npm install
npm run dev
```

Dev server: [http://localhost:5174](http://localhost:5174)

### Environment

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `VITE_SITE_URL` | Canonical URL for SEO (no trailing slash). Example: `https://nxtrive.vercel.app` |

### Build

```bash
npm run build    # type-check + production build → dist/
npm run preview  # preview production build locally
npm run lint     # run Oxlint
```

---

## Project Structure

```
├── public/              # Logos, fonts, images, GSC verification
├── seo.build.ts         # SEO config, JSON-LD, sitemap/robots builders
├── src/
│   ├── components/
│   │   ├── marketing/   # Hero, Features, FAQ, Navbar, Footer, …
│   │   └── ui/          # Buttons, animations, flickering footer
│   ├── hooks/
│   ├── lib/             # Brand, site links, utilities
│   └── styles/          # Typography and design tokens
├── vercel.json          # Deployment headers
└── vite.config.ts       # Vite + SEO build plugin
```

---

## Deploy to Vercel

1. Push this repo to **github.com/devzeromax/Nxtrive**
2. [Import the project](https://vercel.com/new) in Vercel
3. Set `VITE_SITE_URL` to your production URL
4. Build command: `npm run build` · Output: `dist`

---

## SEO & Search Console

After deploying:

1. Verify ownership in [Google Search Console](https://search.google.com/search-console)
2. Submit sitemap: `sitemap.xml` (path only — not the full URL)
3. Request indexing for your homepage

SEO constants are centralized in `seo.build.ts`. Change `VITE_SITE_URL` and redeploy to update canonical URLs site-wide.

---

## Contributing

Contributions are welcome from the community.

1. Fork [devzeromax/Nxtrive](https://github.com/devzeromax/Nxtrive)
2. Create a branch: `git checkout -b feat/your-change`
3. Commit and push
4. Open a pull request

---

## License

Nxtrive is open source under the **MIT License**.

---

<p align="center">
  Maintained by <a href="https://github.com/devzeromax">@devzeromax</a>
</p>

<p align="center">
  <sub>If this project helps you, consider starring the repo.</sub>
</p>

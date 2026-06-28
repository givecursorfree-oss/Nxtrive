# Nxtrive — Marketing Site

Official landing page for [**Nxtrive**](https://nxtrive.vercel.app/), a free, open-source **offline local RAG desktop app** for Windows, macOS, and Linux. Chat with PDFs, Word documents, and code using a private on-device LLM — no cloud, API keys, or account required.

**Live site:** [nxtrive.vercel.app](https://nxtrive.vercel.app/)  
**Product repo:** [github.com/givecursorfree-oss/Nxtrive](https://github.com/givecursorfree-oss/Nxtrive)

---

## Overview

This repository contains the production marketing website for Nxtrive: a single-page React application with scroll-driven animations, product demos, download CTAs, FAQ, and a full technical SEO layer built into the Vite pipeline.

The site is designed to convert visitors searching for **local RAG**, **offline document chat**, and **private LLM** tools into GitHub downloads and product adoption.

---

## Features

### Marketing & UX
- Responsive single-page layout with sticky navigation and section-aware active states
- Hero with word-reveal animation, live chat mockup, and product scroll showcase
- Persona-based use-case selector with visual previews
- Platform download section (Windows, macOS, Linux)
- FAQ accordion with structured data support
- Flickering dot-grid footer with trust badges and link columns
- Smooth scroll (Lenis) with reduced-motion fallbacks
- Accessible skip link, ARIA labels, and keyboard-friendly navigation

### SEO & Discoverability
- Build-time injection of canonical URLs, Open Graph, and Twitter Card meta tags
- JSON-LD structured data: `WebSite`, `WebPage`, `Organization`, `SoftwareApplication`, `FAQPage`
- Static crawlable HTML fallback (~500 words) for non-JS crawlers and audit tools
- Auto-generated `sitemap.xml`, `robots.txt`, and `llms.txt` on production build
- Google Search Console HTML verification support
- Security headers via `vercel.json` (CSP, Referrer-Policy, X-Frame-Options, nosniff)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| Build | [Vite 8](https://vite.dev/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Animation | [Motion](https://motion.dev/) (Framer Motion) |
| Smooth scroll | [Lenis](https://github.com/ddarko/lenis) |
| UI primitives | shadcn-style components + [Lucide](https://lucide.dev/) icons |
| Linting | [Oxlint](https://oxc.rs/) |
| Deployment | [Vercel](https://vercel.com/) |

---

## Getting Started

### Prerequisites

- **Node.js** 20+
- **npm** 10+

### Installation

```bash
git clone https://github.com/givecursorfree-oss/Nxtrive.git
cd Nxtrive
npm install
```

### Environment variables

Copy the example file and set your canonical site URL (no trailing slash):

```bash
cp .env.example .env
```

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SITE_URL` | Canonical URL for meta tags, sitemap, and JSON-LD | `https://nxtrive.vercel.app` |

When your custom domain is live, update this to your production URL (e.g. `https://nxtrive.app`).

### Development

```bash
npm run dev
```

Opens at [http://localhost:5174](http://localhost:5174).

### Production build

```bash
npm run build
npm run preview
```

The build outputs to `dist/` and generates:
- `sitemap.xml`
- `robots.txt`
- `llms.txt`
- SEO-enriched `index.html`

### Lint

```bash
npm run lint
```

---

## Project Structure

```
├── public/                  # Static assets (fonts, logos, images, verification files)
├── seo.build.ts             # SEO config, JSON-LD builders, sitemap/robots generators
├── src/
│   ├── components/
│   │   ├── marketing/       # Page sections (Hero, Features, FAQ, Navbar, Footer, …)
│   │   └── ui/              # Reusable UI (buttons, footer grid, scroll animations)
│   ├── hooks/               # useActiveSection and other hooks
│   ├── lib/                 # Brand, site links, SEO re-exports, utilities
│   └── styles/              # Typography, theme tokens, component CSS
├── index.html               # HTML shell (SEO placeholders injected at build)
├── vercel.json              # Deployment headers and caching rules
└── vite.config.ts           # Vite + Tailwind + SEO build plugin
```

---

## Deployment

### Vercel (recommended)

1. Import the GitHub repository in [Vercel](https://vercel.com/new).
2. Set environment variable:
   ```
   VITE_SITE_URL=https://your-domain.com
   ```
3. Deploy — build command: `npm run build`, output directory: `dist`.

### Google Search Console

1. Add property for your live URL prefix.
2. Verify ownership via the HTML file in `public/googlec76785a677206ee6.html` (or replace with your own).
3. Submit sitemap: `sitemap.xml` (path only, not the full URL).

---

## SEO Configuration

All SEO constants live in `seo.build.ts`:

- Page title, meta description, keywords
- Open Graph and Twitter Card copy
- FAQ items (used in-page and in `FAQPage` schema)
- Footer flicker text constants

The Vite plugin `nxtrive-seo` injects head tags and static crawlable content during `transformIndexHtml`, and writes sitemap/robots/llms files in `closeBundle`.

To change the canonical domain site-wide, update `VITE_SITE_URL` and redeploy.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on port 5174 |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run Oxlint |
| `npm run ui` | Add shadcn components |

---

## Contributing

Contributions are welcome. Please open an issue before large changes. For typos, copy updates, or SEO tweaks, pull requests are appreciated.

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/your-change`)
3. Commit with a clear message
4. Push and open a pull request

---

## Links

- **Website:** [nxtrive.vercel.app](https://nxtrive.vercel.app/)
- **GitHub:** [givecursorfree-oss/Nxtrive](https://github.com/givecursorfree-oss/Nxtrive)
- **Sitemap:** [nxtrive.vercel.app/sitemap.xml](https://nxtrive.vercel.app/sitemap.xml)
- **LLMs.txt:** [nxtrive.vercel.app/llms.txt](https://nxtrive.vercel.app/llms.txt)

---

<p align="center">
  <strong>Nxtrive</strong> — Your documents. Your machine. Your answers.
</p>

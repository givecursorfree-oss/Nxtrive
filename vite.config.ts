import fs from "node:fs";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import {
  buildLlmsTxt,
  buildNoscriptFallback,
  buildRobotsTxt,
  buildSeoHeadTags,
  buildSitemapXml,
  getSiteUrl,
} from "./seo.build.js";

function seoBuildPlugin(siteUrl: string): Plugin {
  return {
    name: "nxtrive-seo",
    transformIndexHtml(html) {
      const seoTags = buildSeoHeadTags(siteUrl);
      const noscript = buildNoscriptFallback();

      return html
        .replace("<!-- SEO_NOSCRIPT -->", noscript)
        .replace("</head>", `    ${seoTags}\n  </head>`);
    },
    closeBundle() {
      const outDir = path.resolve("dist");
      fs.writeFileSync(path.join(outDir, "sitemap.xml"), buildSitemapXml(siteUrl), "utf8");
      fs.writeFileSync(path.join(outDir, "robots.txt"), buildRobotsTxt(siteUrl), "utf8");
      fs.writeFileSync(path.join(outDir, "llms.txt"), buildLlmsTxt(siteUrl), "utf8");
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const siteUrl = getSiteUrl(env);

  return {
    plugins: [tailwindcss(), react(), seoBuildPlugin(siteUrl)],
    css: {
      postcss: {
        plugins: [],
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: 5174,
      open: true,
    },
  };
});

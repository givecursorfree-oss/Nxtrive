/**
 * Marketing site SEO config.
 * Override with env: SITE_URL=https://your-domain.com npm run build
 */
export const SITE_URL = (process.env.SITE_URL || "https://nxtrive.com").replace(/\/$/, "");

export const SITE = {
  name: "Nxtrive",
  url: SITE_URL,
  title: "Nxtrive — Offline Local RAG for Private Document Chat",
  description:
    "Chat with PDFs and documents offline using local RAG. Free, private desktop app for Windows, macOS & Linux — your files never leave your machine.",
  ogImage: `${SITE_URL}/images/nxtrive-hero-chat.png`,
  ogImageAlt: "Nxtrive offline local RAG desktop app chatting with private PDF documents",
  twitterHandle: "@nxtrive",
  githubUrl: "https://github.com/devzeromax/Nxtrive",
  downloadUrl: "https://github.com/devzeromax/Nxtrive/releases",
  locale: "en_US",
  themeColor: "#0b1220",
};

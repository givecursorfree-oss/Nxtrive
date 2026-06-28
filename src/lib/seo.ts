export {
  SEO,
  FAQ_ITEMS,
  FOOTER_FLICKER_TEXT,
  FOOTER_FLICKER_TEXT_MOBILE,
  getSiteUrl,
  buildJsonLd,
  buildSitemapXml,
  buildRobotsTxt,
  buildSeoHeadTags,
  buildNoscriptFallback,
  buildLlmsTxt,
} from "../../seo.build.js";

export const DEFAULT_SITE_URL = "https://nxtrive.app";

export function absoluteUrl(siteUrl: string, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${normalized}`;
}

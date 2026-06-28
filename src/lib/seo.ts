export {
  SEO,
  FAQ_ITEMS,
  FOOTER_FLICKER_TEXT,
  FOOTER_FLICKER_TEXT_MOBILE,
  DEFAULT_SITE_URL,
  getSiteUrl,
  buildJsonLd,
  buildSitemapXml,
  buildRobotsTxt,
  buildSeoHeadTags,
  buildNoscriptFallback,
  buildLlmsTxt,
} from "../../seo.build.js";

export function absoluteUrl(siteUrl: string, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${normalized}`;
}

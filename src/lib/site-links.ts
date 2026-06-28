import { BRAND_NAME } from "@/lib/brand";

/** Central link targets — update GITHUB_REPO when the GitHub org/repo is finalized. */
const GITHUB_REPO = "https://github.com/nxtriveapp/nxtrive";

export const SITE_LINKS = {
  home: "#main",
  features: "#features",
  howItWorks: "#how-it-works",
  useCases: "#who-its-for",
  download: "#download",
  faq: "#faq",
  github: GITHUB_REPO,
  docs: `${GITHUB_REPO}#readme`,
  releases: `${GITHUB_REPO}/releases`,
  releaseNotes: `${GITHUB_REPO}/releases/latest`,
  license: `${GITHUB_REPO}/blob/main/LICENSE`,
  downloads: {
    windows: `${GITHUB_REPO}/releases/latest/download/${BRAND_NAME}-windows-x64.msi`,
    macos: `${GITHUB_REPO}/releases/latest/download/${BRAND_NAME}-macos-universal.dmg`,
    linuxDeb: `${GITHUB_REPO}/releases/latest/download/${BRAND_NAME}-linux-amd64.deb`,
    linuxAppImage: `${GITHUB_REPO}/releases/latest/download/${BRAND_NAME}-linux-amd64.AppImage`,
  },
} as const;

export const EXTERNAL_LINK_PROPS = {
  target: "_blank",
  rel: "noopener noreferrer",
} as const;

/** Accessible external link props with optional visible label suffix for screen readers. */
export function externalLinkProps(label: string) {
  return {
    ...EXTERNAL_LINK_PROPS,
    "aria-label": `${label} (opens in new tab)`,
  } as const;
}

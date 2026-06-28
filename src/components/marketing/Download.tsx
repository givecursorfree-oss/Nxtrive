import { ScrollReveal } from "@/components/marketing/ScrollReveal";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { Button } from "@/components/ui/button";
import { AppleLogo, ExternalLinkIcon, iconSizes, LinuxLogo, WindowsLogo } from "@/components/marketing/icons";
import { BRAND_NAME } from "@/lib/brand";
import { externalLinkProps, SITE_LINKS } from "@/lib/site-links";
import { cn } from "@/lib/utils";
import type { ComponentType } from "react";

type PlatformLogo = ComponentType<{ className?: string }>;

const platforms: {
  icon: PlatformLogo;
  name: string;
  detail: string;
  cta: string;
  href: string;
  featured: boolean;
}[] = [
  {
    icon: WindowsLogo,
    name: "Windows 10 / 11",
    detail: ".msi installer · 64-bit",
    cta: "Download for Windows",
    href: SITE_LINKS.downloads.windows,
    featured: false,
  },
  {
    icon: AppleLogo,
    name: "macOS 10.15+",
    detail: ".dmg · Intel and Apple Silicon",
    cta: "Download for macOS",
    href: SITE_LINKS.downloads.macos,
    featured: true,
  },
  {
    icon: LinuxLogo,
    name: "Ubuntu 22.04+ / equivalent",
    detail: ".deb and .AppImage",
    cta: "Download for Linux",
    href: SITE_LINKS.downloads.linuxDeb,
    featured: false,
  },
];

export function DownloadSection() {
  return (
    <section id="download" className="section-pad section-band" aria-labelledby="download-heading">
      <div className="section-container">
        <SectionHeading
          id="download-heading"
          pill="Download"
          title={`Download ${BRAND_NAME}`}
          titleMuted="free"
          description="Open source, MIT licensed. No account. No credit card. Just download and run."
        />

        <div className="section-content grid gap-6 md:grid-cols-3">
          {platforms.map((platform, i) => (
            <ScrollReveal key={platform.name} delay={i * 100}>
              <article
                className={cn(
                  "marketing-card flex h-full flex-col items-center text-center",
                  platform.featured && "border-deep-indigo/25 ring-2 ring-deep-indigo/10",
                )}
              >
                <div className="download-platform-icon" aria-hidden>
                  <platform.icon />
                </div>
                <h3 className="type-subheading-medium mt-5 text-deep-ink">{platform.name}</h3>
                <p className="type-body-sm mt-2 text-slate">{platform.detail}</p>
                <Button
                  className="mt-6 w-full"
                  href={platform.href}
                  iconRight={<ExternalLinkIcon className={`${iconSizes.sm} opacity-70`} />}
                  {...externalLinkProps(platform.cta)}
                >
                  {platform.cta}
                </Button>
              </article>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={200}>
          <p className="type-body-sm mt-10 text-center text-slate">
            All builds are produced by GitHub Actions from the same open-source repo. If a direct
            download fails, pick your platform on{" "}
            <a
              href={SITE_LINKS.releaseNotes}
              className="type-button inline-flex items-center gap-1 text-deep-indigo underline-offset-2 hover:underline"
              {...externalLinkProps("GitHub Releases")}
            >
              GitHub Releases
              <ExternalLinkIcon className={`${iconSizes.sm} opacity-70`} aria-hidden />
            </a>
            .
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { BrandLockup } from "@/components/marketing/BrandLockup";
import {
  CloseIcon,
  ExternalLinkIcon,
  iconSizes,
  MenuIcon,
} from "@/components/marketing/icons";
import { easeExpoOut, navContainer, navItem } from "@/lib/hero-motion";
import { useActiveSection } from "@/hooks/useActiveSection";
import { BRAND_NAME } from "@/lib/brand";
import { externalLinkProps, SITE_LINKS } from "@/lib/site-links";
import { cn } from "@/lib/utils";

const NAVBAR_HEIGHT_PX = 64;

const navLinks = [
  { href: "#features", label: "Features", sectionId: "features" },
  { href: "#how-it-works", label: "How it works", sectionId: "how-it-works" },
  { href: "#who-its-for", label: "Use cases", sectionId: "who-its-for" },
  { href: "#download", label: "Download", sectionId: "download" },
] as const;

const navSectionIds = navLinks.map((link) => link.sectionId);

const trackedSectionIds = [
  "product-preview",
  "stats",
  ...navSectionIds,
  "supported-formats",
  "system-requirements",
  "faq",
] as const;

const sectionNavMap: Record<string, (typeof navSectionIds)[number]> = {
  "product-preview": "features",
  stats: "how-it-works",
  "supported-formats": "features",
  "system-requirements": "download",
  faq: "download",
};

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const rawActiveSection = useActiveSection([...trackedSectionIds]);
  const activeSection = useMemo(() => {
    if (sectionNavMap[rawActiveSection]) return sectionNavMap[rawActiveSection];
    if (navSectionIds.includes(rawActiveSection as (typeof navSectionIds)[number])) {
      return rawActiveSection;
    }
    return "";
  }, [rawActiveSection]);
  const reduceMotion = useReducedMotion();

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen, closeMenu]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      if (mq.matches) closeMenu();
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [closeMenu]);

  const navLinkClass = (sectionId: string, mobile = false) =>
    cn(
      "relative no-underline transition-colors",
      mobile
        ? "flex min-h-11 items-center rounded-button px-3 type-body text-graphite hover:bg-paper-white hover:text-deep-indigo"
        : "site-navbar__link type-nav-link inline-flex min-h-11 items-center rounded-button px-2.5 py-2 text-graphite hover:text-deep-indigo xl:px-3",
      activeSection === sectionId && "font-medium text-deep-indigo",
      !mobile &&
        activeSection === sectionId &&
        "after:absolute after:inset-x-2 after:bottom-1.5 after:h-0.5 after:rounded-full after:bg-deep-indigo xl:after:inset-x-3",
    );

  return (
    <>
      <motion.header
        className={cn(
          "site-navbar fixed inset-x-0 z-50 w-full border-b border-mist bg-card-white",
          scrolled || menuOpen ? "shadow-subtle-2" : "shadow-none",
        )}
        style={{ height: NAVBAR_HEIGHT_PX, top: "var(--announcement-height)" }}
        initial={reduceMotion ? false : { opacity: 0, y: -12 }}
        animate={reduceMotion ? false : { opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: easeExpoOut, delay: 0.05 }}
      >
        <div className="section-container h-full">
          <div className="site-navbar__bar grid h-full min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-x-2 xl:gap-x-4">
            <a
              href={SITE_LINKS.home}
              className="site-navbar__brand w-fit max-w-full shrink-0 justify-self-start overflow-hidden text-deep-ink no-underline"
              aria-label={`${BRAND_NAME} home`}
            >
              <BrandLockup variant="nav" />
            </a>

            <motion.nav
              className="site-navbar__links hidden min-w-0 items-center justify-center lg:flex"
              aria-label="Primary"
              variants={navContainer}
              initial={reduceMotion ? false : "hidden"}
              animate={reduceMotion ? false : "show"}
            >
              <div className="flex items-center gap-0.5 xl:gap-1">
                {navLinks.map((link) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    variants={navItem}
                    className={navLinkClass(link.sectionId)}
                    aria-current={activeSection === link.sectionId ? "true" : undefined}
                    onClick={closeMenu}
                  >
                    {link.label}
                  </motion.a>
                ))}
              </div>
            </motion.nav>

            <div className="site-navbar__actions flex shrink-0 items-center justify-self-end gap-1.5 xl:gap-2">
              <Button
                variant="ghost"
                size="sm"
                href={SITE_LINKS.github}
                className="hidden min-h-11 px-2.5 text-graphite hover:text-deep-indigo xl:inline-flex xl:px-3"
                iconRight={<ExternalLinkIcon className={`${iconSizes.sm} opacity-70`} />}
                {...externalLinkProps("GitHub")}
              >
                GitHub
              </Button>
              <Button
                href={SITE_LINKS.download}
                className="hidden min-h-11 shrink-0 lg:inline-flex"
              >
                Download free
              </Button>

              <button
                type="button"
                className="site-navbar__menu inline-flex h-11 w-11 items-center justify-center rounded-button border border-mist bg-card-white text-carbon shadow-subtle-2 transition-colors hover:border-fog hover:text-deep-indigo lg:hidden"
                aria-expanded={menuOpen}
                aria-controls="mobile-nav"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                onClick={() => setMenuOpen((open) => !open)}
              >
                {menuOpen ? (
                  <CloseIcon className={iconSizes.md} />
                ) : (
                  <MenuIcon className={iconSizes.md} />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Spacer — keeps content below fixed navbar */}
      <div
        className="site-navbar-spacer"
        aria-hidden
        style={{ height: `calc(${NAVBAR_HEIGHT_PX}px + var(--announcement-height))` }}
      />

      {menuOpen ? (
        <div className="site-navbar-drawer lg:hidden" role="presentation">
          <button
            type="button"
            className="site-navbar-drawer__backdrop"
            aria-label="Close menu"
            onClick={closeMenu}
          />
          <nav
            id="mobile-nav"
            className="site-navbar-drawer__panel"
            aria-label="Mobile"
          >
            <ul className="space-y-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={navLinkClass(link.sectionId, true)}
                    aria-current={activeSection === link.sectionId ? "true" : undefined}
                    onClick={closeMenu}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="pt-3">
                <Button className="w-full" href={SITE_LINKS.download} onClick={closeMenu}>
                  Download free
                </Button>
              </li>
              <li>
                <Button
                  className="w-full"
                  variant="outline"
                  href={SITE_LINKS.github}
                  iconRight={<ExternalLinkIcon className={`${iconSizes.sm} opacity-70`} />}
                  onClick={closeMenu}
                  {...externalLinkProps("View on GitHub")}
                >
                  View on GitHub
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      ) : null}
    </>
  );
}

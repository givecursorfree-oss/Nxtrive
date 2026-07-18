import { useEffect, useRef } from "react";
import { TEMPLATE_BODY, TEMPLATE_SCRIPTS } from "./templateBody.js";

function loadScript(src) {
  return new Promise((resolve) => {
    if (document.querySelector(`script[data-tpl="${src}"]`)) {
      resolve();
      return;
    }
    const el = document.createElement("script");
    el.src = src;
    el.type = "text/javascript";
    el.async = false;
    el.setAttribute("data-tpl", src);
    el.onload = resolve;
    el.onerror = () => resolve();
    document.body.appendChild(el);
  });
}

function injectInline(code) {
  try {
    const el = document.createElement("script");
    el.type = "text/javascript";
    el.textContent = code;
    document.body.appendChild(el);
  } catch {
    /* ignore */
  }
}

const GSAP_OBSERVER =
  "https://cdn.prod.website-files.com/gsap/3.15.0/Observer.min.js";

/** Scroll-scrubbed terminal pieces — never wipe their transform */
const SCROLL_MOTION_SEL = [
  ".terminal-cursor-alt",
  ".terminal-cursor",
  ".terminal-window-small",
  ".terminal-dashboard",
  ".terminal-popup",
  ".terminal-notification",
  ".terminal-workspace",
  ".terminal-home__version-two",
  ".marquee-scroll-item",
  ".marquee-scroll-item-inverse",
].join(",");

function isScrollMotionTarget(el) {
  return !!(el && el.matches && el.matches(SCROLL_MOTION_SEL));
}

function reinitWebflow() {
  const Webflow = window.Webflow;
  if (!Webflow) return false;
  try {
    if (typeof Webflow.destroy === "function") Webflow.destroy();
    if (typeof Webflow.ready === "function") Webflow.ready();
    const ix2 = Webflow.require && Webflow.require("ix2");
    if (ix2 && typeof ix2.init === "function") {
      ix2.init();
      try {
        window.dispatchEvent(new Event("resize"));
        window.dispatchEvent(new Event("load"));
      } catch {
        /* ignore */
      }
      try {
        const store = ix2.store;
        if (store?.dispatch) {
          store.dispatch({ type: "IX2_PAGE_UPDATE" });
          store.dispatch({
            type: "IX2_EVENT_ENGINE_EVENT",
            payload: { eventTypeId: "PAGE_START" },
          });
        }
      } catch {
        /* ignore */
      }
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Opacity-only reveal. Never clears transform (that killed cursor / scroll IX2).
 */
function revealOpacity(el) {
  if (!el || el.dataset.nxRevealed === "1") return;
  if (isScrollMotionTarget(el)) return;
  el.dataset.nxRevealed = "1";
  el.style.opacity = "1";
  el.style.visibility = "visible";
}

/** Hero product shot must always show — IX2 often leaves it at opacity:0 in SPA */
function revealCriticalHero() {
  document
    .querySelectorAll(
      ".hero__image, .hero__image-home-version-one, #top img.hero__image, #top [style*='opacity:0']"
    )
    .forEach(revealOpacity);
}

/**
 * Reveal any still-hidden IX2 nodes that are in (or near) the viewport.
 * Runs on load + scroll so sections are never permanently blank.
 */
function revealVisibleStuck({ near = 1.15 } = {}) {
  const vh = window.innerHeight || 800;
  document
    .querySelectorAll("[data-w-id], [style*='opacity:0'], .hero__image")
    .forEach((el) => {
      if (isScrollMotionTarget(el)) return;
      let opacity;
      try {
        opacity = getComputedStyle(el).opacity;
      } catch {
        return;
      }
      if (opacity !== "0") return;
      const r = el.getBoundingClientRect();
      if (r.height < 1 && r.width < 1) return;
      const inBand = r.top < vh * near && r.bottom > -vh * 0.2;
      if (inBand) revealOpacity(el);
    });
}

/** Force every non-motion stuck node visible (last resort after IX2 had time) */
function revealAllStuckOpacity() {
  document
    .querySelectorAll("[data-w-id], [style*='opacity:0'], .hero__image")
    .forEach((el) => {
      if (isScrollMotionTarget(el)) return;
      try {
        if (getComputedStyle(el).opacity === "0") revealOpacity(el);
      } catch {
        /* ignore */
      }
    });
}

/** Always-on GSAP scrub for How-it-works cursor (matches Webflow a-149) */
function ensureHowItWorksCursorMotion() {
  const section = document.getElementById("how-it-works");
  const cursor = section?.querySelector(".terminal-cursor-alt");
  const windowEl = section?.querySelector(".terminal-window-small");
  if (!section || !cursor || cursor.dataset.nxCursorMotion === "1") return;
  if (!window.gsap || !window.ScrollTrigger) return;

  cursor.dataset.nxCursorMotion = "1";
  const gsap = window.gsap;
  gsap.set(cursor, { xPercent: 80, yPercent: 80, opacity: 0, force3D: true });
  if (windowEl) gsap.set(windowEl, { yPercent: 10, opacity: 0, force3D: true });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 85%",
      end: "center 30%",
      scrub: 0.65,
      invalidateOnRefresh: true,
    },
  });

  if (windowEl) {
    tl.to(windowEl, { yPercent: 0, opacity: 1, ease: "none", duration: 0.35 }, 0.25);
  }
  tl.to(
    cursor,
    {
      xPercent: 0,
      yPercent: 0,
      opacity: 1,
      ease: "power1.inOut",
      duration: 0.45,
    },
    0.3
  );
}

/** Block drag + context-menu save on images (friction only — not true DRM). */
function protectImages(root = document) {
  root.querySelectorAll("img, svg, picture, video").forEach((el) => {
    if (el.dataset.nxProtected === "1") return;
    el.dataset.nxProtected = "1";
    el.setAttribute("draggable", "false");
    el.addEventListener("dragstart", (e) => e.preventDefault());
    el.addEventListener("contextmenu", (e) => e.preventDefault());
  });
}

export default function App() {
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    (async () => {
      let observerLoaded = false;
      for (const s of TEMPLATE_SCRIPTS) {
        if (s.src) {
          await loadScript(s.src);
          if (!observerLoaded && /gsap\.min\.js/i.test(s.src)) {
            await loadScript(GSAP_OBSERVER);
            observerLoaded = true;
          }
        } else if (s.content?.trim()) {
          injectInline(s.content);
        }
      }

      try {
        document.dispatchEvent(new Event("DOMContentLoaded", { bubbles: true }));
        window.dispatchEvent(new Event("load"));
      } catch {
        /* ignore */
      }

      const removeBadge = () => {
        document
          .querySelectorAll(".w-webflow-badge, [class*='webflow-badge']")
          .forEach((el) => el.remove());
      };

      const ANNOUNCEMENT_KEY = "nxtrive-announcement-dismissed";
      const wireAnnouncementBanner = () => {
        const banner = document.querySelector("[data-announcement-banner]");
        if (!banner) return;
        try {
          if (localStorage.getItem(ANNOUNCEMENT_KEY) === "1") {
            banner.hidden = true;
            return;
          }
        } catch {
          /* ignore */
        }
        const dismiss = banner.querySelector(".announcement-banner__dismiss");
        if (!dismiss || dismiss.dataset.nxWired === "1") return;
        dismiss.dataset.nxWired = "1";
        dismiss.addEventListener("click", () => {
          banner.hidden = true;
          try {
            localStorage.setItem(ANNOUNCEMENT_KEY, "1");
          } catch {
            /* ignore */
          }
        });
      };

      const boot = () => {
        const ok = reinitWebflow();
        removeBadge();
        wireAnnouncementBanner();
        protectImages();
        try {
          window.ScrollTrigger?.refresh();
        } catch {
          /* ignore */
        }
        return ok;
      };

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      boot();
      // One delayed re-arm only
      setTimeout(boot, 300);
      protectImages();
      // Catch late-injected template nodes
      const imgObserver = new MutationObserver(() => protectImages());
      imgObserver.observe(document.body, { childList: true, subtree: true });
      setTimeout(() => imgObserver.disconnect(), 8000);

      // Hero mockup must never stay blank
      revealCriticalHero();
      setTimeout(revealCriticalHero, 400);
      setTimeout(revealCriticalHero, 1000);

      if (reducedMotion) {
        revealAllStuckOpacity();
        return;
      }

      // Let IX2 try PAGE_START, then rescue anything still invisible near viewport
      setTimeout(() => revealVisibleStuck({ near: 1.25 }), 700);
      setTimeout(() => revealVisibleStuck({ near: 1.25 }), 1500);
      // Nuclear: never leave the marketing page half-blank
      setTimeout(revealAllStuckOpacity, 2800);

      let raf = 0;
      const onScroll = () => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          revealVisibleStuck({ near: 1.2 });
        });
      };
      window.addEventListener("scroll", onScroll, { passive: true });

      // Cursor scrub — always use GSAP so deploy matches local motion
      setTimeout(() => {
        ensureHowItWorksCursorMotion();
        try {
          window.ScrollTrigger?.refresh();
        } catch {
          /* ignore */
        }
      }, 600);

      setTimeout(removeBadge, 1600);
      const badgeObserver = new MutationObserver(removeBadge);
      badgeObserver.observe(document.body, { childList: true, subtree: true });
      setTimeout(() => badgeObserver.disconnect(), 5000);
    })().catch(() => {
      revealCriticalHero();
      revealAllStuckOpacity();
    });
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: TEMPLATE_BODY }} />;
}

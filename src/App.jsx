import { useEffect, useRef } from "react";
import { TEMPLATE_BODY, TEMPLATE_SCRIPTS } from "./templateBody.js";

/** Load an external script in order (returns a promise) */
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

/** Run an inline script by injecting a <script> element */
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

/** GSAP Observer is used by the template marquee but not shipped in TEMPLATE_SCRIPTS */
const GSAP_OBSERVER =
  "https://cdn.prod.website-files.com/gsap/3.15.0/Observer.min.js";

/**
 * Elements driven by Webflow IX2 continuous SCROLLING_IN_VIEW (a-149+) or
 * scroll-scrubbed transforms. Soft-revealing these kills their motion.
 */
const IX2_SCROLL_MOTION_SEL = [
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
  return !!(el && el.matches && el.matches(IX2_SCROLL_MOTION_SEL));
}

/**
 * Re-initialize Webflow IX2 against the React-rendered DOM so the template's
 * scroll / load animations play like the reference Webflow export.
 */
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
        if (store && typeof store.dispatch === "function") {
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
 * Opacity-only failsafe for stuck PAGE_START hero elements.
 * Never clears transform — that races IX2 SCROLL_INTO_VIEW / SCROLLING_IN_VIEW.
 */
function softRevealOpacity(el) {
  if (el.dataset.nxRevealed === "1") return;
  if (isScrollMotionTarget(el)) return;
  el.dataset.nxRevealed = "1";
  el.style.transition = "opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1)";
  void el.offsetWidth;
  el.style.opacity = "1";
}

/**
 * Only for initial above-the-fold stuck hides. Do NOT run on every scroll —
 * that races Webflow when sections enter the viewport.
 */
function revealAboveFoldFailsafe() {
  const vh = window.innerHeight || 800;
  document.querySelectorAll("[data-w-id], [style*='opacity:0']").forEach((el) => {
    if (isScrollMotionTarget(el)) return;
    let opacity;
    try {
      opacity = getComputedStyle(el).opacity;
    } catch {
      return;
    }
    if (opacity !== "0") return;
    const r = el.getBoundingClientRect();
    const aboveFold = r.top < vh * 0.55 && r.bottom > 0;
    if (!aboveFold) return;
    softRevealOpacity(el);
  });
}

function revealAllOpaque() {
  document.querySelectorAll("[data-w-id], [style*='opacity:0']").forEach((el) => {
    if (isScrollMotionTarget(el)) return;
    el.style.opacity = "1";
  });
}

/** GSAP fallback mirroring Webflow a-149 terminal cursor scrub */
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
      start: "top 80%",
      end: "bottom 20%",
      scrub: 0.6,
      invalidateOnRefresh: true,
    },
  });

  if (windowEl) {
    tl.to(windowEl, { yPercent: 0, opacity: 1, ease: "none", duration: 0.35 }, 0.3);
  }
  tl.to(
    cursor,
    {
      xPercent: 0,
      yPercent: 0,
      opacity: 1,
      ease: "power1.inOut",
      duration: 0.4,
    },
    0.35
  );
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
        } else if (s.content && s.content.trim()) {
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

      const init = () => {
        const ok = reinitWebflow();
        removeBadge();
        wireAnnouncementBanner();
        if (window.gsap && window.ScrollTrigger) {
          try {
            window.ScrollTrigger.refresh();
          } catch {
            /* ignore */
          }
        }
        return ok;
      };

      const ix2Ok = init();
      setTimeout(() => {
        init();
        try {
          window.ScrollTrigger && window.ScrollTrigger.refresh();
        } catch {
          /* ignore */
        }
      }, 250);
      setTimeout(removeBadge, 1600);

      const badgeObserver = new MutationObserver(removeBadge);
      badgeObserver.observe(document.body, { childList: true, subtree: true });
      setTimeout(() => badgeObserver.disconnect(), 5000);

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (reducedMotion) {
        revealAllOpaque();
        return;
      }

      if (!ix2Ok) {
        revealAllOpaque();
        setTimeout(ensureHowItWorksCursorMotion, 400);
        return;
      }

      // Give IX2 time to play PAGE_START; only opacity-rescue stuck hero nodes.
      // No scroll listener — that was racing SCROLL_INTO_VIEW / cursor scrub.
      setTimeout(() => revealAboveFoldFailsafe(), 1200);
      setTimeout(() => {
        const cursor = document.querySelector(
          "#how-it-works .terminal-cursor-alt"
        );
        if (!cursor) return;
        const ix2 = window.Webflow && window.Webflow.require?.("ix2");
        if (!ix2) ensureHowItWorksCursorMotion();
      }, 2200);
    })().catch(() => {});
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: TEMPLATE_BODY }} />;
}

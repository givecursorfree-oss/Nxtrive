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
    el.onerror = () => {
      console.warn("Template script failed to load:", src);
      resolve();
    };
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
  } catch (e) {
    console.warn("Inline template script failed:", e);
  }
}

/** GSAP Observer is used by the template marquee but not shipped in TEMPLATE_SCRIPTS */
const GSAP_OBSERVER =
  "https://cdn.prod.website-files.com/gsap/3.15.0/Observer.min.js";

/**
 * Elements driven by Webflow IX2 continuous SCROLLING_IN_VIEW (a-149 Terminal
 * Animation). Soft-revealing these with transform:none kills the cursor motion.
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
].join(",");

function isScrollMotionTarget(el) {
  if (!el || !el.matches) return false;
  return el.matches(IX2_SCROLL_MOTION_SEL);
}

/**
 * Re-initialize Webflow IX2 against the React-rendered DOM so the template's
 * exact scroll-into-view animations (How it works, Features, Pricing, …) play
 * identically to the reference. Soft-destroy + init + a synthetic `load` event
 * re-arms PAGE_START interactions for above-the-fold content.
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
      // Kick PAGE_START / PAGE_FINISH again so the hero load sequence plays.
      try {
        window.dispatchEvent(new Event("resize"));
        window.dispatchEvent(new Event("load"));
      } catch {}
      try {
        const store = ix2.store;
        if (store && typeof store.dispatch === "function") {
          store.dispatch({ type: "IX2_PAGE_UPDATE" });
          store.dispatch({
            type: "IX2_EVENT_ENGINE_EVENT",
            payload: { eventTypeId: "PAGE_START" },
          });
        }
      } catch {}
    }
    return true;
  } catch (e) {
    console.warn("Webflow re-init issue:", e);
    return false;
  }
}

/**
 * Soft-reveal a still-hidden element with the same motion language as the
 * template (opacity 0→1, slight upward settle). Used as a failsafe when IX2
 * leaves an above-the-fold PAGE_START element armed but unfired.
 */
function softReveal(el) {
  if (el.dataset.nxRevealed === "1") return;
  if (isScrollMotionTarget(el)) return;
  el.dataset.nxRevealed = "1";
  el.style.transition =
    "opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1), " +
    "transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)";
  // Force a style flush so the transition actually runs from the hidden state
  void el.offsetWidth;
  el.style.opacity = "1";
  el.style.transform = "none";
  el.style.webkitTransform = "none";
}

/**
 * Reveal stuck-hidden elements. By default only touches above-the-fold
 * elements so IX2 scroll-into-view animations below the fold still play.
 * Never touches scroll-linked terminal/cursor targets.
 */
function revealFailsafe({ force = false } = {}) {
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
    if (!force) {
      const r = el.getBoundingClientRect();
      // Only soft-reveal elements that are clearly above the fold (PAGE_START
      // targets). Leave anything mid/lower page for IX2 scroll animations.
      const aboveFold = r.top < vh * 0.85 && r.bottom > 0 && r.top < vh * 0.7;
      if (!aboveFold) return;
    }
    softReveal(el);
  });
}

/**
 * Dedicated fallback for How-it-works cursor if IX2 continuous scroll never
 * arms (e.g. blocked scripts). Mirrors Webflow a-149 terminal-cursor-alt motion.
 */
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
    tl.to(
      windowEl,
      { yPercent: 0, opacity: 1, ease: "none", duration: 0.35 },
      0.3
    );
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
          // Load Observer after core GSAP so registerPlugin(ScrollTrigger, Observer) works
          if (!observerLoaded && /gsap\.min\.js/i.test(s.src)) {
            await loadScript(GSAP_OBSERVER);
            observerLoaded = true;
          }
        } else if (s.content && s.content.trim()) {
          injectInline(s.content);
        }
      }

      // Re-dispatch so template scripts that listened for these attach to the
      // now-present DOM (marquees, counters, GSAP SplitText setups).
      try {
        document.dispatchEvent(new Event("DOMContentLoaded", { bubbles: true }));
        window.dispatchEvent(new Event("load"));
      } catch {}

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
        } catch {}
        const dismiss = banner.querySelector(".announcement-banner__dismiss");
        if (!dismiss || dismiss.dataset.nxWired === "1") return;
        dismiss.dataset.nxWired = "1";
        dismiss.addEventListener("click", () => {
          banner.hidden = true;
          try {
            localStorage.setItem(ANNOUNCEMENT_KEY, "1");
          } catch {}
        });
      };

      const init = () => {
        const ok = reinitWebflow();
        removeBadge();
        wireAnnouncementBanner();
        if (window.gsap && window.ScrollTrigger) {
          try {
            window.ScrollTrigger.refresh();
          } catch {}
        }
        return ok;
      };

      const ix2Ok = init();
      // One delayed re-init only — repeated destroy() kills SCROLLING_IN_VIEW
      setTimeout(() => {
        init();
        try {
          window.ScrollTrigger && window.ScrollTrigger.refresh();
        } catch {}
      }, 250);
      setTimeout(removeBadge, 1600);

      const badgeObserver = new MutationObserver(removeBadge);
      badgeObserver.observe(document.body, { childList: true, subtree: true });
      setTimeout(() => badgeObserver.disconnect(), 5000);

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (!ix2Ok || reducedMotion) {
        if (reducedMotion) {
          revealFailsafe({ force: true });
        } else {
          // Scripts missing: reveal static content, then try GSAP cursor fallback
          revealFailsafe({ force: true });
          setTimeout(ensureHowItWorksCursorMotion, 400);
        }
      } else {
        // Soft-reveal any above-fold PAGE_START targets IX2 didn't fire
        // (common in SPAs). Never touch scroll-linked cursor targets.
        let raf = 0;
        const onScroll = () => {
          if (raf) return;
          raf = requestAnimationFrame(() => {
            raf = 0;
            revealFailsafe();
          });
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        setTimeout(() => revealFailsafe(), 700);
        setTimeout(() => revealFailsafe(), 1600);
        // If IX2 continuous scroll never moves the cursor, arm GSAP fallback
        setTimeout(() => {
          const cursor = document.querySelector(
            "#how-it-works .terminal-cursor-alt"
          );
          if (!cursor) return;
          const t = getComputedStyle(cursor).transform;
          const moved = t && t !== "none" && t !== "matrix(1, 0, 0, 1, 0, 0)";
          if (!moved && getComputedStyle(cursor).opacity === "1") {
            // Likely stuck visible without IX2 motion — use GSAP scrub
            ensureHowItWorksCursorMotion();
          } else if (getComputedStyle(cursor).opacity === "0") {
            // Still hidden and unmoved after scroll opportunity — still OK;
            // verify after user has had time; arm fallback only if IX2 dead
            const ix2 = window.Webflow && window.Webflow.require?.("ix2");
            if (!ix2) ensureHowItWorksCursorMotion();
          }
        }, 2200);
      }
    })().catch(console.error);
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: TEMPLATE_BODY }} />;
}

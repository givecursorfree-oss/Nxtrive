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
 */
function revealFailsafe({ force = false } = {}) {
  const vh = window.innerHeight || 800;
  document.querySelectorAll("[data-w-id], [style*='opacity:0']").forEach((el) => {
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
          if (
            !observerLoaded &&
            /gsap\.min\.js/i.test(s.src)
          ) {
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
      setTimeout(init, 200);
      setTimeout(removeBadge, 1600);

      const badgeObserver = new MutationObserver(removeBadge);
      badgeObserver.observe(document.body, { childList: true, subtree: true });
      setTimeout(() => badgeObserver.disconnect(), 5000);

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (!ix2Ok || reducedMotion) {
        revealFailsafe({ force: true });
      } else {
        // Soft-reveal any above-fold PAGE_START targets IX2 didn't fire
        // (common in SPAs). Keep a scroll listener so stuck-in-view elements
        // never stay blank without pre-revealing below-the-fold scroll targets.
        let raf = 0;
        const onScroll = () => {
          if (raf) return;
          raf = requestAnimationFrame(() => {
            raf = 0;
            revealFailsafe();
          });
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        // Give IX2 a short window to play the real load sequence first.
        setTimeout(() => revealFailsafe(), 700);
        setTimeout(() => revealFailsafe(), 1600);
      }
    })().catch(console.error);
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: TEMPLATE_BODY }} />;
}

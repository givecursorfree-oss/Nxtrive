import { useCallback, useLayoutEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRightIcon, CloseIcon } from "@/components/marketing/icons";
import { BRAND_NAME } from "@/lib/brand";
import { syncAnnouncementHeight } from "@/lib/announcement-banner";
import { SITE_LINKS } from "@/lib/site-links";

const CLOSE_MS = 280;

export function AnnouncementBanner() {
  const reduceMotion = useReducedMotion();
  const [dismissed, setDismissed] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useLayoutEffect(() => {
    syncAnnouncementHeight(dismissed);
  }, [dismissed]);

  const dismiss = useCallback(() => {
    syncAnnouncementHeight(true);

    if (reduceMotion) {
      setDismissed(true);
      return;
    }

    setIsClosing(true);
    window.setTimeout(() => setDismissed(true), CLOSE_MS);
  }, [reduceMotion]);

  if (dismissed) {
    return null;
  }

  return (
    <motion.aside
      className="announcement-banner"
      aria-label="Announcement"
      initial={false}
      animate={{
        y: isClosing ? "-100%" : 0,
        opacity: isClosing ? 0 : 1,
      }}
      transition={{ duration: reduceMotion ? 0 : CLOSE_MS / 1000, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="announcement-banner__inner">
        <button
          type="button"
          className="announcement-banner__dismiss"
          onClick={dismiss}
          aria-label="Dismiss announcement"
        >
          <CloseIcon className="announcement-banner__icon" />
        </button>

        <div className="announcement-banner__content">
          <p className="announcement-banner__message m-0 inline-flex flex-wrap items-baseline justify-center gap-x-1.5 font-medium">
            <span>{BRAND_NAME}</span>
            <span className="announcement-banner__highlight">FREE</span>
            <span>forever</span>
          </p>
          <a href={SITE_LINKS.download} className="announcement-banner__cta">
            Download free
            <ArrowRightIcon className="announcement-banner__icon" aria-hidden />
          </a>
        </div>
      </div>
    </motion.aside>
  );
}

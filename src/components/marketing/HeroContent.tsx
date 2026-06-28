import { motion, useReducedMotion } from "motion/react";
import { HeroWordReveal } from "@/components/marketing/HeroWordReveal";
import ImagesBadgeDemo from "@/components/images-badge-demo";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, ExternalLinkIcon, iconSizes } from "@/components/marketing/icons";
import { heroItem, heroStagger } from "@/lib/hero-motion";
import { BRAND_NAME } from "@/lib/brand";
import { externalLinkProps, SITE_LINKS } from "@/lib/site-links";

export function HeroContent() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="hero-copy flex flex-col items-start text-left"
      variants={heroStagger}
      initial={reduceMotion ? false : "hidden"}
      animate={reduceMotion ? false : "show"}
    >
      <motion.div variants={heroItem}>
        <span className="section-pill type-section-pill">100% offline · open source · MIT</span>
      </motion.div>

      <motion.div variants={heroItem} className="mt-6">
        <h1 id="hero-heading" className="type-display text-balance text-deep-ink">
          <HeroWordReveal text="Chat with your documents offline." as="span" className="block" />
          <HeroWordReveal
            text="Nothing leaves your machine."
            as="span"
            className="mt-2 block text-headline-muted"
            delay={0.35}
          />
        </h1>
      </motion.div>

      <motion.p variants={heroItem} className="type-body-lg mt-6 text-balance text-slate">
        {BRAND_NAME} is a local RAG app that turns folders of PDFs, Word files, and code into a
        private knowledge base on your machine. Ask questions and get cited answers from an offline
        LLM — not a cloud API.
      </motion.p>

      <motion.p variants={heroItem} className="type-body-sm mt-4 max-w-md text-slate">
        No API keys · No account · No data leaves your device
      </motion.p>

      <motion.div variants={heroItem} className="mt-6">
        <ImagesBadgeDemo />
      </motion.div>

      <motion.div
        variants={heroItem}
        className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:items-center"
        style={{ gap: "var(--element-gap)" }}
      >
        <Button
          href={SITE_LINKS.download}
          iconRight={<ArrowRightIcon className={`${iconSizes.sm} opacity-80`} />}
        >
          Download free
        </Button>
        <Button variant="outline" href={SITE_LINKS.github} iconRight={<ExternalLinkIcon className={`${iconSizes.sm} opacity-70`} />} {...externalLinkProps("View on GitHub")}>
          View on GitHub
        </Button>
      </motion.div>
    </motion.div>
  );
}

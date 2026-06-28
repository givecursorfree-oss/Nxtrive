"use client";
import type { MotionValue } from "motion/react";
import { BRAND_NAME } from "@/lib/brand";
import { HeroChatDemoScroll } from "@/components/marketing/HeroChatDemo";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

export default function HeroScrollDemo() {
  return (
    <section
      id="product-preview"
      className="section-pad relative"
      aria-labelledby="product-preview-heading"
    >
      <div className="dot-map-bg opacity-25" aria-hidden />
      <ContainerScroll
        titleComponent={
          <>
            <span className="section-pill type-section-pill mx-auto mb-4 w-fit">Live demo</span>
            <h2 id="product-preview-heading" className="headline-pair text-balance text-deep-ink">
              Citations you can <span className="headline-muted">verify.</span>
            </h2>
            <p className="type-body-lg mx-auto mt-4 max-w-xl text-slate">
              Scroll to watch {BRAND_NAME} stream a grounded answer with source links you can open
              and check.
            </p>
          </>
        }
      >
        {(scrollProgress: MotionValue<number>) => (
          <HeroChatDemoScroll scrollProgress={scrollProgress} className="h-full w-full" />
        )}
      </ContainerScroll>
    </section>
  );
}

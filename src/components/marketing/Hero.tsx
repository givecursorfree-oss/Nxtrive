import { HeroChatDemo } from "@/components/marketing/HeroChatDemo";
import { HeroContent } from "@/components/marketing/HeroContent";
import { MockupScroll } from "@/components/ui/mockup-scroll-animation";

export function Hero() {
  return (
    <section className="hero-section" aria-labelledby="hero-heading">
      <div className="dot-map-bg" aria-hidden />
      <div className="hero-bloom" aria-hidden />

      <div className="hero-inner">
        <div className="section-container">
          <div className="hero-grid">
            <div className="lg:sticky lg:top-[calc(var(--navbar-height)+var(--announcement-height)+1.5rem)] lg:self-start">
              <HeroContent />
            </div>

            <MockupScroll id="hero-mockup">
              <HeroChatDemo className="h-full w-full" />
            </MockupScroll>
          </div>
        </div>
      </div>
    </section>
  );
}

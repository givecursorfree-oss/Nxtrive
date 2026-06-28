import { ScrollReveal } from "@/components/marketing/ScrollReveal";
import { PersonaAudienceSelector } from "@/components/marketing/PersonaAudienceSelector";
import { SectionHeading } from "@/components/marketing/SectionHeading";

export function WhoItsFor() {
  return (
    <section id="who-its-for" className="section-pad" aria-labelledby="personas-heading">
      <div className="section-container max-w-[1112px]">
        <SectionHeading
          id="personas-heading"
          pill="Use cases"
          title="Built for professionals who"
          titleMuted="can't upload sensitive files"
        />

        <ScrollReveal delay={80}>
          <div className="section-content">
            <PersonaAudienceSelector labelledBy="personas-heading" />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

import { ScrollReveal } from "@/components/marketing/ScrollReveal";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { FAQ_ITEMS } from "@/lib/seo";

export function FaqSection() {
  return (
    <section id="faq" className="section-pad" aria-labelledby="faq-heading">
      <div className="section-container max-w-3xl">
        <SectionHeading
          id="faq-heading"
          pill="FAQ"
          title="Common questions about"
          titleMuted="local RAG"
          description="Straight answers about privacy, offline use, and what you need to get started."
        />

        <div className="section-content space-y-4">
          {FAQ_ITEMS.map((item, index) => (
            <ScrollReveal key={item.question} delay={index * 60}>
              <details className="marketing-card group">
                <summary className="cursor-pointer list-none type-subheading-medium text-deep-ink marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-start justify-between gap-4">
                    {item.question}
                    <span
                      className="type-body-sm shrink-0 text-fog transition-transform group-open:rotate-45"
                      aria-hidden
                    >
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-4 type-body text-slate">{item.answer}</p>
              </details>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

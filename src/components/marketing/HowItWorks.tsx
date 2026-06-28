import { ScrollReveal } from "@/components/marketing/ScrollReveal";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { ChatCheckIcon, DatabaseLockIcon, FolderArrowIcon } from "@/components/marketing/icons";

import { BRAND_NAME } from "@/lib/brand";

const steps = [
  {
    icon: FolderArrowIcon,
    title: "Point at a folder",
    description:
      `Drop any folder of PDFs, Word docs, or code files. ${BRAND_NAME} walks the directory and ingests every file into a named collection.`,
  },
  {
    icon: DatabaseLockIcon,
    title: "Indexed locally",
    description:
      "Files are chunked, embedded, and stored in a local vector database on your machine. Your data never touches a server.",
  },
  {
    icon: ChatCheckIcon,
    title: "Ask in natural language",
    description:
      "Ask anything. Answers stream token-by-token, grounded in your documents, with source citations you can open and verify.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-pad" aria-labelledby="how-heading">
      <div className="section-container">
        <SectionHeading
          id="how-heading"
          pill="How it works"
          title="Three steps to"
          titleMuted="private answers"
        />

        <div className="section-content grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <ScrollReveal key={step.title} delay={i * 100}>
              <article className="marketing-card h-full">
                <div className="feature-icon-wrap mb-4">
                  <step.icon />
                </div>
                <h3 className="type-subheading-medium text-deep-ink">
                  Step {i + 1} — {step.title}
                </h3>
                <p className="mt-3 type-body text-slate">{step.description}</p>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

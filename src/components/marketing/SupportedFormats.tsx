import { ScrollReveal } from "@/components/marketing/ScrollReveal";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { BRAND_NAME } from "@/lib/brand";
import { Code2, FileText, TextCursorInput, type LucideIcon } from "lucide-react";

const formats: {
  category: string;
  description: string;
  icon: LucideIcon;
  extensions: string[];
}[] = [
  {
    category: "Documents",
    description: "Contracts, reports, and office files",
    icon: FileText,
    extensions: [".pdf", ".docx"],
  },
  {
    category: "Text & markup",
    description: "Notes, data exports, and web content",
    icon: TextCursorInput,
    extensions: [".txt", ".md", ".csv", ".json", ".html", ".css"],
  },
  {
    category: "Source code",
    description: "Repos and technical documentation",
    icon: Code2,
    extensions: [".py", ".js", ".ts", ".tsx"],
  },
];

export function SupportedFormats() {
  return (
    <section id="supported-formats" className="section-pad section-band" aria-labelledby="formats-heading">
      <div className="section-container">
        <SectionHeading
          id="formats-heading"
          pill="Supported formats"
          title="Works with the files"
          titleMuted="you already have"
          description={`Drop folders as-is — ${BRAND_NAME} ingests common document, text, and code formats without conversion.`}
        />

        <div className="section-content grid gap-6 md:grid-cols-3">
          {formats.map((row, i) => {
            const Icon = row.icon;
            return (
              <ScrollReveal key={row.category} delay={i * 80}>
                <article className="format-card marketing-card flex h-full flex-col">
                  <div className="feature-icon-wrap mb-4" aria-hidden>
                    <Icon className="h-6 w-6" strokeWidth={1.75} />
                  </div>
                  <h3 className="type-subheading-medium text-deep-ink">{row.category}</h3>
                  <p className="mt-2 type-body-sm text-slate">{row.description}</p>
                  <ul className="format-chip-list mt-auto pt-4" aria-label={`${row.category} file extensions`}>
                    {row.extensions.map((ext) => (
                      <li key={ext}>
                        <span className="format-chip">{ext}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

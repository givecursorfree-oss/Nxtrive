import { ScrollReveal } from "@/components/marketing/ScrollReveal";
import { SectionHeading } from "@/components/marketing/SectionHeading";

import { BRAND_NAME } from "@/lib/brand";

const requirements = [
  { label: "RAM", value: "8 GB minimum, 16 GB+ recommended for large collections" },
  { label: "Storage", value: "~4–8 GB for Llama-3 model weights + index size" },
  { label: "GPU", value: "Optional — Apple Silicon and discrete GPUs accelerate Ollama" },
  { label: "Display", value: "1024×768 minimum" },
];

export function SystemRequirements() {
  return (
    <section id="system-requirements" className="section-pad section-band" aria-labelledby="requirements-heading">
      <div className="section-container">
        <SectionHeading
          id="requirements-heading"
          pill="System requirements"
          title="Runs on"
          titleMuted="everyday hardware"
        />

        <ScrollReveal delay={100}>
          <div className="section-content mx-auto max-w-3xl overflow-hidden rounded-card border border-mist shadow-subtle">
            <table className="w-full border-collapse text-left">
              <tbody>
                {requirements.map((row, i) => (
                  <tr key={row.label} className={i > 0 ? "border-t border-mist" : ""}>
                    <th className="type-button w-32 bg-paper-white px-5 py-4 text-deep-ink md:w-40">
                      {row.label}
                    </th>
                    <td className="px-5 py-4 type-body-sm text-slate">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mx-auto mt-6 max-w-3xl text-center type-body-sm text-slate">
            Ollama must be installed separately (free, one download). {BRAND_NAME} guides you through
            model setup on first launch.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}

import { ScrollReveal } from "@/components/marketing/ScrollReveal";

const stats = [
  { value: "100%", label: "Local inference, zero cloud" },
  { value: "3 platforms", label: "Windows, macOS, Linux" },
  { value: "0 API keys", label: "No subscriptions or metering" },
];

export function Stats() {
  return (
    <section id="stats" className="section-pad section-band" aria-label="Product stats">
      <div className="section-container">
        <div className="grid gap-6 md:grid-cols-3">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.value} delay={i * 80}>
              <article className="marketing-card text-center">
                <p className="type-heading text-deep-ink">{stat.value}</p>
                <p className="type-body-sm mt-2 text-slate">{stat.label}</p>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

import { ScrollReveal } from "@/components/marketing/ScrollReveal";

interface SectionHeadingProps {
  pill: string;
  title: string;
  titleMuted?: string;
  description?: string;
  id?: string;
}

export function SectionHeading({ pill, title, titleMuted, description, id }: SectionHeadingProps) {
  return (
    <ScrollReveal>
      <div className="mx-auto max-w-2xl text-center">
        <span className="section-pill type-section-pill">{pill}</span>
        <h2 id={id} className="headline-pair mt-4 text-balance">
          {title}
          {titleMuted ? (
            <>
              {" "}
              <span className="headline-muted">{titleMuted}</span>
            </>
          ) : null}
        </h2>
        {description ? <p className="mt-4 type-body text-slate">{description}</p> : null}
      </div>
    </ScrollReveal>
  );
}

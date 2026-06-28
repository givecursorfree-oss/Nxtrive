import {
  SourceCitationPreview,
  StreamingAnswerPreview,
} from "@/components/marketing/FeaturePreviews";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { BRAND_NAME } from "@/lib/brand";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  BookOpenCheck,
  Brain,
  FolderInput,
  Folders,
  Globe,
  type LucideIcon,
  MessagesSquare,
  WifiOff,
} from "lucide-react";
import type { ReactNode } from "react";

const responseModes: {
  label: string;
  hint: string;
  icon: LucideIcon;
}[] = [
  {
    label: "Default",
    hint: "Balanced answers from your indexed files",
    icon: MessagesSquare,
  },
  {
    label: "Search",
    hint: "Prioritize retrieval across collections",
    icon: Globe,
  },
  {
    label: "Think",
    hint: "Deeper reasoning for complex questions",
    icon: Brain,
  },
  {
    label: "Sources",
    hint: "Answers with citations you can verify",
    icon: BookOpen,
  },
];

const secondaryFeatures = [
  {
    icon: Folders,
    title: "Multiple collections",
    headline: "Separate knowledge bases per project",
    description:
      "Organize by client, topic, or engagement. Switch instantly and delete when done.",
  },
  {
    icon: FolderInput,
    title: "Drag and drop ingestion",
    headline: "Drop files or folders on the window",
    description: "Live progress shows files processed and chunks created as you ingest.",
  },
  {
    icon: WifiOff,
    title: "Fully offline",
    headline: "Works without a network connection",
    description:
      "Planes, secure facilities, and air-gapped networks — after the one-time Ollama download.",
  },
];

const primaryFeatures = [
  {
    icon: MessagesSquare,
    title: "Streaming answers",
    headline: "Real-time token-by-token responses",
    description:
      "Stop generation anytime. Like ChatGPT, but your files never leave your desk.",
    preview: StreamingAnswerPreview,
  },
  {
    icon: BookOpenCheck,
    title: "Source citations",
    headline: "Every answer links to the exact passage",
    description:
      "Open a source preview to verify before you trust it — file name, page, and quoted text included.",
    preview: SourceCitationPreview,
  },
] as const;

export function Features() {
  return (
    <section id="features" className="section-pad section-band" aria-labelledby="features-heading">
      <div className="section-container">
        <SectionHeading
          id="features-heading"
          pill="Features"
          title="Everything you need,"
          titleMuted="nothing in the cloud"
        />

        <div className="section-content grid gap-6 lg:grid-cols-2">
          {primaryFeatures.map((feature) => (
            <FeatureCard key={feature.title}>
              <CardHeading
                icon={feature.icon}
                title={feature.title}
                headline={feature.headline}
                description={feature.description}
              />
              <div className="feature-card__media">
                <feature.preview />
              </div>
            </FeatureCard>
          ))}

          <FeatureCard className="lg:col-span-2">
            <div className="feature-card__heading feature-card__heading--center">
              <h3 className="type-subheading-medium text-balance text-deep-ink">
                Four response modes
              </h3>
              <p className="type-body mt-3 max-w-xl text-balance text-slate">
                Switch modes in the composer — tuned for speed, retrieval, reasoning, or cited
                breakdowns.
              </p>
            </div>

            <ResponseModeShowcase />
          </FeatureCard>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {secondaryFeatures.map((feature) => (
            <FeatureCard key={feature.title}>
              <CardHeading
                icon={feature.icon}
                title={feature.title}
                headline={feature.headline}
                description={feature.description}
              />
            </FeatureCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function ResponseModeShowcase() {
  return (
    <div className="response-mode-showcase" aria-label={`${BRAND_NAME} response modes`}>
      <ul className="response-mode-showcase__grid">
        {responseModes.map(({ label, hint, icon: Icon }) => (
          <li key={label} className="response-mode-showcase__item">
            <div className="feature-icon-wrap shrink-0" aria-hidden>
              <Icon className="h-6 w-6" strokeWidth={1.75} />
            </div>
            <div>
              <p className="type-subheading-medium text-deep-ink">{label}</p>
              <p className="type-body-sm mt-1 text-slate">{hint}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface FeatureCardProps {
  children: ReactNode;
  className?: string;
}

const FeatureCard = ({ children, className }: FeatureCardProps) => (
  <article className={cn("marketing-card feature-card", className)}>{children}</article>
);

interface CardHeadingProps {
  icon: LucideIcon;
  title: string;
  headline: string;
  description: string;
}

const CardHeading = ({ icon: Icon, title, headline, description }: CardHeadingProps) => (
  <div className="feature-card__heading">
    <span className="section-pill type-section-pill">{title}</span>
    <div className="feature-icon-wrap mt-4">
      <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
    </div>
    <h3 className="type-subheading-medium mt-4 text-balance text-deep-ink">{headline}</h3>
    <p className="type-body mt-3 text-balance text-slate">{description}</p>
  </div>
);

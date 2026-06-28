import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import {
  ClinicalIcon,
  DevelopersIcon,
  LegalComplianceIcon,
  PrivacyIcon,
  ResearchersIcon,
  TeamsIcon,
} from "@/components/marketing/icons";
import { PersonaAudienceVisual } from "@/components/marketing/PersonaAudienceVisual";
import { BRAND_NAME } from "@/lib/brand";
import { cn } from "@/lib/utils";
import type { ComponentType, SVGProps } from "react";

type AudienceIcon = ComponentType<SVGProps<SVGSVGElement>>;

const audiences: {
  id: string;
  label: string;
  summary: string;
  detail: string;
  icon: AudienceIcon;
  image: string;
}[] = [
  {
    id: "legal",
    label: "Legal & compliance",
    summary: "Review contracts and NDAs without cloud exposure.",
    detail:
      "Index NDAs, vendor agreements, and policy libraries on your machine. Ask natural-language questions, open cited passages in preview, and keep every embedding and chat on localhost.",
    icon: LegalComplianceIcon,
    image: "/images/personas/legal.jpg",
  },
  {
    id: "clinical",
    label: "Doctors & clinicians",
    summary: "Query patient notes and medical literature offline.",
    detail:
      "Keep PHI on-device while searching across clinical notes, research PDFs, and internal protocols. Citations point to the exact passage so you can verify before acting — no cloud upload required.",
    icon: ClinicalIcon,
    image: "/images/personas/clinical.jpg",
  },
  {
    id: "research",
    label: "Researchers & students",
    summary: "Chat with papers and notes without leaving your desk.",
    detail:
      "Drop folders of PDFs and markdown into a collection and chat across hundreds of sources at once. Answers stream with citations back to the exact file and passage.",
    icon: ResearchersIcon,
    image: "/images/personas/research.jpg",
  },
  {
    id: "developers",
    label: "Developers",
    summary: "Search codebases and technical docs with cited context.",
    detail:
      `Point ${BRAND_NAME} at a repo or docs folder. It chunks Python, TypeScript, and markdown locally and grounds every answer in your indexed sources via Ollama.`,
    icon: DevelopersIcon,
    image: "/images/personas/developers.jpg",
  },
  {
    id: "teams",
    label: "Small teams",
    summary: "Shared-folder knowledge without a SaaS subscription.",
    detail:
      "Spin up separate collections per client or project on each machine. Switch instantly, pin active libraries, and delete data from the UI when an engagement ends.",
    icon: TeamsIcon,
    image: "/images/personas/teams.jpg",
  },
  {
    id: "privacy",
    label: "Privacy-conscious users",
    summary: "Personal document Q&A with zero telemetry.",
    detail:
      "No accounts, no API keys, no document analytics. Your embeddings, chat history, and source files live in your OS user data folder — delete them any time from the app.",
    icon: PrivacyIcon,
    image: "/images/personas/privacy.jpg",
  },
];

const ROTATE_MS = 6000;

interface PersonaAudienceSelectorProps {
  labelledBy?: string;
}

export function PersonaAudienceSelector({ labelledBy }: PersonaAudienceSelectorProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelHeight, setPanelHeight] = useState<number | undefined>(undefined);
  const reduceMotion = useReducedMotion();
  const tablistId = useId();
  const active = audiences[activeIndex]!;

  const select = useCallback((index: number) => {
    setActiveIndex(index);
    setPaused(true);
  }, []);

  useEffect(() => {
    if (reduceMotion || paused) return;
    const timer = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % audiences.length);
    }, ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [paused, reduceMotion]);

  useEffect(() => {
    const node = panelRef.current;
    if (!node) return;
    const measure = () => setPanelHeight(node.scrollHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(node);
    return () => ro.disconnect();
  }, [activeIndex, active.summary, active.detail]);

  return (
    <div className="overflow-hidden">
      <div className="persona-audience-shell">
        <div className="persona-audience-grid">
          <div className="persona-audience-copy col-span-12 lg:col-span-6">
            <div className="persona-audience-eyebrow" aria-hidden>
              <div className="flex items-center gap-0.5 overflow-hidden">
                <span className="persona-audience-eyebrow-text">{BRAND_NAME} for</span>
                <span className="persona-audience-cursor" />
              </div>
            </div>
            <span className="sr-only" aria-live="polite">
              {paused || reduceMotion ? "Auto-rotation paused" : "Rotating use cases every 6 seconds"}
            </span>

            <ul
              className="persona-audience-list"
              role="tablist"
              aria-label={labelledBy ? undefined : `Who ${BRAND_NAME} is for`}
              aria-labelledby={labelledBy}
              id={tablistId}
            >
              {audiences.map((item, index) => {
                const isActive = index === activeIndex;
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      role="tab"
                      id={`${tablistId}-tab-${item.id}`}
                      aria-selected={isActive}
                      aria-controls={`${tablistId}-panel`}
                      className={cn("persona-audience-tab", isActive && "persona-audience-tab--active")}
                      onClick={() => select(index)}
                      onFocus={() => setPaused(true)}
                      onMouseEnter={() => setPaused(true)}
                      onMouseLeave={() => setPaused(false)}
                    >
                      <span
                        className={cn(
                          "persona-audience-tab-icon",
                          isActive ? "persona-audience-tab-icon--active" : "persona-audience-tab-icon--idle",
                        )}
                        aria-hidden
                      >
                        <Icon className="h-4 w-4 text-deep-indigo md:h-5 md:w-5" />
                      </span>
                      <span
                        className={cn(
                          "persona-audience-tab-label",
                          isActive ? "persona-audience-tab-label--active" : "persona-audience-tab-label--idle",
                        )}
                      >
                        {item.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div
              className="persona-audience-panel-wrap"
              style={{ height: panelHeight !== undefined ? `${panelHeight}px` : undefined }}
            >
              <div
                ref={panelRef}
                role="tabpanel"
                id={`${tablistId}-panel`}
                aria-labelledby={`${tablistId}-tab-${active.id}`}
                className="persona-audience-panel"
                key={active.id}
              >
                <p className="type-body font-light text-graphite">{active.summary}</p>
                <p className="type-body mt-4 font-light text-graphite">{active.detail}</p>
              </div>
            </div>
          </div>

          <div className="persona-audience-visual-col col-span-12 lg:col-span-6">
            <PersonaAudienceVisual imageSrc={active.image} alt={`${active.label} preview`} />
          </div>
        </div>
      </div>
    </div>
  );
}

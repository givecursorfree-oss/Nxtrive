import { useEffect, useMemo, useState } from "react";
import {
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import {
  containerScrollScenario,
  heroDemoScenarios,
  type ChatDemoScenario,
} from "@/components/marketing/demo-scenarios";
import { BRAND_LOGO_MARK_SRC, BRAND_NAME } from "@/lib/brand";
import { BrandLogoMark, PaperClipIcon, UserCircleIcon, ArrowUpIcon } from "@/components/marketing/icons";
import { cn } from "@/lib/utils";

const DEMO_DURATION_MS = 5200;
const DEMO_LOOP_PAUSE_MS = 2400;

export interface HeroChatDemoProps {
  autoPlay?: boolean;
  className?: string;
  /** Scroll-synced playback for container scroll section */
  scrollProgress?: MotionValue<number>;
  /** Lock to one scenario (used with scrollProgress) */
  scenario?: ChatDemoScenario;
  /** Show backend/model status footer */
  showStatusBar?: boolean;
}

type DemoPhase = "idle" | "typing" | "user" | "thinking" | "streaming" | "citations";

function phaseFromProgress(progress: number): DemoPhase {
  if (progress < 0.06) return "idle";
  if (progress < 0.14) return "typing";
  if (progress < 0.24) return "user";
  if (progress < 0.38) return "thinking";
  if (progress < 0.84) return "streaming";
  return "citations";
}

function ChatDemoFrame({
  scenario,
  progress,
  className,
  showStatusBar = true,
}: {
  scenario: ChatDemoScenario;
  progress: number;
  className?: string;
  showStatusBar?: boolean;
}) {
  const phase = phaseFromProgress(progress);

  const composerQuestion = useMemo(() => {
    if (phase !== "idle" && phase !== "typing") return "";
    const typingT = phase === "idle" ? 0 : Math.min(1, (progress - 0.06) / 0.08);
    return scenario.question.slice(0, Math.floor(typingT * scenario.question.length));
  }, [phase, progress, scenario.question]);

  const streamChars = useMemo(() => {
    if (phase !== "streaming" && phase !== "citations") return 0;
    const streamT = Math.min(1, Math.max(0, (progress - 0.38) / 0.46));
    return Math.floor(streamT * scenario.answer.length);
  }, [phase, progress, scenario.answer.length]);

  const visibleAnswer = scenario.answer.slice(0, streamChars);
  const showCursor = phase === "streaming" && streamChars < scenario.answer.length;
  const isStreaming = phase === "thinking" || phase === "streaming";
  const citationProgress =
    phase === "citations" ? Math.min(1, Math.max(0, (progress - 0.84) / 0.16)) : 0;

  const showUser =
    phase === "user" || phase === "thinking" || phase === "streaming" || phase === "citations";
  const showAssistant = phase === "thinking" || phase === "streaming" || phase === "citations";

  const composerPlaceholder =
    composerQuestion.length > 0 ? composerQuestion : "Ask about your documents…";

  return (
    <div
      className={cn("hero-chat-demo", isStreaming && "hero-chat-demo--streaming", className)}
      aria-label={`${BRAND_NAME} chat demo`}
      role="img"
    >
      <header className="hero-chat-demo__chrome">
        <div className="hero-chat-demo__chrome-traffic" aria-hidden>
          <span className="hero-chat-demo__traffic-dot hero-chat-demo__traffic-dot--close" />
          <span className="hero-chat-demo__traffic-dot hero-chat-demo__traffic-dot--min" />
          <span className="hero-chat-demo__traffic-dot hero-chat-demo__traffic-dot--max" />
        </div>
        <div className="hero-chat-demo__chrome-brand">
          <BrandLogoMark className="!h-7 !w-7" />
          <span className="hero-chat-demo__chrome-title">{BRAND_NAME}</span>
        </div>
        <div className="hero-chat-demo__chrome-spacer" aria-hidden />
      </header>

      <div className="hero-chat-demo__body">
        <aside className="hero-chat-demo__sidebar" aria-hidden>
          <p className="hero-chat-demo__sidebar-label">Collections</p>
          <ul className="space-y-0.5">
            {scenario.collections.map((c) => (
              <li
                key={c.name}
                className={cn(
                  "hero-chat-demo__collection",
                  c.active && "hero-chat-demo__collection--active",
                )}
              >
                <span
                  className="hero-chat-demo__collection-dot"
                  style={{ backgroundColor: c.color }}
                />
                <span className="truncate">{c.name}</span>
              </li>
            ))}
          </ul>
        </aside>

        <div className="hero-chat-demo__main">
          <div className="hero-chat-demo__messages" key={scenario.id}>
            {showUser ? (
              <div className="hero-chat-demo__message hero-chat-demo__message--user">
                <div className="hero-chat-demo__bubble hero-chat-demo__bubble--user">
                  {scenario.question}
                </div>
                <div className="hero-chat-demo__avatar hero-chat-demo__avatar--user" aria-hidden>
                  <UserCircleIcon className="h-5 w-5" />
                </div>
              </div>
            ) : null}

            {showAssistant ? (
              <div className="hero-chat-demo__message">
                <div className="hero-chat-demo__avatar hero-chat-demo__avatar--assistant" aria-hidden>
                  <img src={BRAND_LOGO_MARK_SRC} alt="" className="h-3.5 w-3.5 object-contain" aria-hidden />
                </div>
                <div
                  className={cn(
                    "hero-chat-demo__bubble hero-chat-demo__bubble--assistant",
                    isStreaming && "hero-chat-demo__bubble--streaming",
                  )}
                >
                  {phase === "thinking" ? (
                    <span className="hero-chat-demo__shimmer-text">Writing response</span>
                  ) : (
                    <>
                      <span className="whitespace-pre-wrap">{visibleAnswer}</span>
                      {showCursor ? <span className="hero-chat-demo__cursor" /> : null}
                    </>
                  )}

                  {citationProgress > 0 ? (
                    <div className="hero-chat-demo__citations">
                      {scenario.citations.map((cite, i) => {
                        const show = citationProgress > (i + 1) / (scenario.citations.length + 1);
                        if (!show) return null;
                        return (
                          <span
                            key={cite}
                            className="hero-chat-demo__citation"
                            style={{ animationDelay: `${i * 80}ms` }}
                          >
                            {cite}
                          </span>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>

          <div className="hero-chat-demo__composer">
            <div className="hero-chat-demo__bloom-field" aria-hidden>
              <div className="hero-chat-demo__arch-bloom hero-chat-demo__arch-bloom--base" />
              <div className="hero-chat-demo__arch-bloom hero-chat-demo__arch-bloom--accent" />
              <div className="hero-chat-demo__arch-shimmer" />
            </div>

            <div className="hero-chat-demo__input-stack">
              <div className="hero-chat-demo__prompt">
                <p
                  className={cn(
                    "hero-chat-demo__prompt-text",
                    phase === "typing" && "hero-chat-demo__prompt-text--typing",
                  )}
                >
                  {composerPlaceholder}
                  {phase === "typing" && composerQuestion.length < scenario.question.length ? (
                    <span className="hero-chat-demo__cursor" />
                  ) : null}
                </p>
                <div className="hero-chat-demo__prompt-toolbar">
                  <div className="hero-chat-demo__prompt-icons">
                    <PaperClipIcon className="h-4 w-4" aria-hidden />
                  </div>
                  <div className="hero-chat-demo__send" aria-hidden>
                    <ArrowUpIcon className="h-4 w-4" strokeWidth={2.25} />
                  </div>
                </div>
              </div>
              <p className="hero-chat-demo__hint">
                {phase === "typing"
                  ? "Enter to send"
                  : isStreaming
                    ? "Responding…"
                    : "Enter to send · Shift+Enter for newline"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {showStatusBar ? (
        <footer className="hero-chat-demo__status">
          <span className="hero-chat-demo__status-ok">Backend online</span>
          <span>·</span>
          <span>llama3 · nomic-embed-text</span>
          <span>·</span>
          <span>100% local</span>
        </footer>
      ) : null}
    </div>
  );
}

export function HeroChatDemo({
  autoPlay = true,
  className,
  scrollProgress,
  scenario: scenarioProp,
  showStatusBar = true,
}: HeroChatDemoProps) {
  const reduceMotion = useReducedMotion();
  const noopProgress = useMotionValue(0);
  const [progress, setProgress] = useState(() =>
    reduceMotion || scrollProgress ? 1 : autoPlay ? 0 : 1,
  );
  const [scenarioIndex, setScenarioIndex] = useState(0);

  const activeScenario =
    scenarioProp ?? heroDemoScenarios[scenarioIndex % heroDemoScenarios.length]!;

  useMotionValueEvent(scrollProgress ?? noopProgress, "change", (v) => {
    if (scrollProgress) setProgress(reduceMotion ? 1 : v);
  });

  useEffect(() => {
    if (scrollProgress || reduceMotion || !autoPlay) {
      if (!scrollProgress) setProgress(1);
      return;
    }

    let frame = 0;
    let pauseTimer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    const runCycle = () => {
      setProgress(0);
      const start = performance.now();
      const tick = (now: number) => {
        if (cancelled) return;
        const t = Math.min(1, (now - start) / DEMO_DURATION_MS);
        setProgress(t);
        if (t < 1) {
          frame = requestAnimationFrame(tick);
          return;
        }
        pauseTimer = setTimeout(() => {
          if (cancelled) return;
          if (!scenarioProp) {
            setScenarioIndex((i) => (i + 1) % heroDemoScenarios.length);
          }
          runCycle();
        }, DEMO_LOOP_PAUSE_MS);
      };
      frame = requestAnimationFrame(tick);
    };

    runCycle();

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      if (pauseTimer) clearTimeout(pauseTimer);
    };
  }, [autoPlay, reduceMotion, scenarioProp, scrollProgress]);

  return (
    <ChatDemoFrame
      scenario={activeScenario}
      progress={progress}
      className={className}
      showStatusBar={showStatusBar}
    />
  );
}

export function HeroChatDemoStatic({ className }: { className?: string }) {
  return <HeroChatDemo autoPlay={false} className={className} />;
}

export function HeroChatDemoScroll({
  scrollProgress,
  className,
}: {
  scrollProgress: MotionValue<number>;
  className?: string;
}) {
  return (
    <HeroChatDemo
      autoPlay={false}
      scrollProgress={scrollProgress}
      scenario={containerScrollScenario}
      showStatusBar={false}
      className={className}
    />
  );
}

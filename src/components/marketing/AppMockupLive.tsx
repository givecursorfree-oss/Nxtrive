import { useEffect, useMemo, useState } from "react";
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, type MotionValue } from "motion/react";
import { AppMockupShell } from "@/components/marketing/AppMockupShell";

const USER_QUESTION = "What are the termination clauses in the NDA?";
const ASSISTANT_ANSWER =
  "Either party may terminate with 30 days written notice. Confidentiality obligations survive termination for 3 years per Section 7.2.";

const CITATIONS = ["NDA_2024.pdf · p.4", "NDA_2024.pdf · p.7"];

interface AppMockupLiveProps {
  /** 0–1 scroll progress — only use for scroll-synced demos, not the hero */
  scrollProgress?: MotionValue<number>;
  /** Time-based demo playback (default: true when scrollProgress is omitted) */
  autoPlay?: boolean;
}

const DEMO_DURATION_MS = 4800;
const DEMO_LOOP_PAUSE_MS = 2200;

export function AppMockupLive({ scrollProgress, autoPlay }: AppMockupLiveProps) {
  const reduceMotion = useReducedMotion();
  const shouldAutoPlay = autoPlay ?? !scrollProgress;
  const noopProgress = useMotionValue(0);
  const [progress, setProgress] = useState(reduceMotion ? 1 : 0);

  useMotionValueEvent(scrollProgress ?? noopProgress, "change", (v) => {
    if (scrollProgress) setProgress(v);
  });

  useEffect(() => {
    if (reduceMotion || scrollProgress || !shouldAutoPlay) return;

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
          if (!cancelled) runCycle();
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
  }, [reduceMotion, scrollProgress, shouldAutoPlay]);

  const phase = useMemo(() => {
    if (progress < 0.12) return "idle";
    if (progress < 0.28) return "user";
    if (progress < 0.4) return "thinking";
    if (progress < 0.82) return "streaming";
    return "citations";
  }, [progress]);

  const streamChars = useMemo(() => {
    if (phase !== "streaming" && phase !== "citations") return 0;
    const streamT = Math.min(1, Math.max(0, (progress - 0.4) / 0.42));
    return Math.floor(streamT * ASSISTANT_ANSWER.length);
  }, [phase, progress]);

  const visibleAnswer = ASSISTANT_ANSWER.slice(0, streamChars);
  const showCursor = phase === "streaming" && streamChars < ASSISTANT_ANSWER.length;
  const citationProgress = phase === "citations" ? Math.min(1, (progress - 0.82) / 0.18) : 0;

  return (
    <AppMockupShell
      inputHint={phase === "idle" ? "Ask about your documents…" : phase === "thinking" ? "Searching sources…" : "Ask about your documents…"}
      inputActive={phase === "idle" || phase === "thinking"}
    >
      <div className="flex flex-1 flex-col justify-end space-y-3 overflow-hidden p-3 md:p-4">
        {(phase === "user" || phase === "thinking" || phase === "streaming" || phase === "citations") && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="type-body-sm ml-auto max-w-[85%] rounded-xl rounded-tr-sm bg-deep-indigo px-3 py-2 leading-relaxed text-white"
          >
            {USER_QUESTION}
          </motion.div>
        )}

        {phase === "thinking" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="type-body-sm flex max-w-[40%] items-center gap-1 rounded-xl rounded-tl-sm bg-white/5 px-3 py-3"
          >
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-white/50" />
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-white/50 [animation-delay:150ms]" />
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-white/50 [animation-delay:300ms]" />
          </motion.div>
        )}

        {(phase === "streaming" || phase === "citations") && visibleAnswer.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="type-body-sm max-w-[92%] rounded-xl rounded-tl-sm bg-white/5 px-3 py-2 leading-relaxed text-white/85"
          >
            {visibleAnswer}
            {showCursor ? (
              <span className="ml-0.5 inline-block h-[1em] w-0.5 animate-pulse bg-mint align-middle" />
            ) : null}
            {citationProgress > 0 ? (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {CITATIONS.map((cite, i) => {
                  const show = citationProgress > (i + 1) / (CITATIONS.length + 1);
                  if (!show) return null;
                  return (
                    <motion.span
                      key={cite}
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`type-label-mono inline-flex items-center rounded-full px-2 py-0.5 ${
                        i === 0 ? "bg-mint/15 text-mint" : "bg-sky-blue/15 text-sky-blue"
                      }`}
                    >
                      {cite}
                    </motion.span>
                  );
                })}
              </div>
            ) : null}
          </motion.div>
        )}
      </div>
    </AppMockupShell>
  );
}

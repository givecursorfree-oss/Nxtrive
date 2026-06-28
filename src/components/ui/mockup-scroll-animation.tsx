import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion, useScroll, useTransform, motion, type MotionValue } from "motion/react";
import { cn } from "@/lib/utils";

interface MockupScrollProps {
  children: React.ReactNode | ((scrollProgress: MotionValue<number>) => ReactNode);
  className?: string;
  id?: string;
}

/** Scroll-driven 3D product mockup for the hero right rail */
export function MockupScroll({ children, className, id }: MockupScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const rotate = useTransform(
    scrollYProgress,
    [0.1, 0.48, 0.9],
    reduceMotion ? [0, 0, 0] : isMobile ? [14, 5, 0] : [18, 6, 0],
  );

  const scale = useTransform(
    scrollYProgress,
    [0.1, 0.48, 0.9],
    reduceMotion ? [1, 1, 1] : isMobile ? [0.88, 0.95, 1] : [0.9, 0.97, 1],
  );

  const y = useTransform(
    scrollYProgress,
    [0.06, 0.42],
    reduceMotion ? [0, 0] : isMobile ? [36, 0] : [56, 0],
  );

  const glowOpacity = useTransform(scrollYProgress, [0.15, 0.55, 0.85], [0.2, 0.55, 0.35]);

  const childContent = typeof children === "function" ? children(scrollYProgress) : children;

  return (
    <div
      id={id}
      ref={containerRef}
      className={cn(
        "mockup-scroll-track relative w-full",
        isMobile ? "h-[85vh] min-h-[32rem]" : "h-[115vh] min-h-[42rem]",
        className,
      )}
    >
      <div
        className="mockup-scroll-sticky sticky top-20 flex h-[calc(100vh-5rem)] items-center justify-center md:top-24"
        style={{ perspective: reduceMotion ? undefined : "1400px" }}
      >
        <motion.div
          className="mockup-scroll-stage relative w-full max-w-[42rem] lg:max-w-none"
          style={{
            rotateX: rotate,
            scale,
            y,
            boxShadow: reduceMotion ? undefined : "var(--shadow-xl)",
            transformStyle: "preserve-3d",
          }}
        >
          {!reduceMotion ? (
            <motion.div
              aria-hidden
              className="mockup-scroll-glow pointer-events-none absolute -inset-6 rounded-[20px] md:-inset-10"
              style={{
                opacity: glowOpacity,
                background:
                  "radial-gradient(ellipse 80% 70% at 50% 65%, color-mix(in srgb, var(--color-sky-blue) 28%, transparent), transparent 72%)",
              }}
            />
          ) : null}

          <div className="hero-mockup-card relative h-full max-h-[min(34rem,calc(100dvh-7rem))] w-full">
            <div className="hero-mockup-inner h-full min-h-[22rem] md:min-h-[24rem]">
              {childContent}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

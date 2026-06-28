"use client";
import React, { useRef, type ReactNode } from "react";
import {
  useScroll,
  useTransform,
  motion,
  MotionValue,
  useReducedMotion,
} from "motion/react";
import { cn } from "@/lib/utils";

type ContainerScrollProps = {
  titleComponent: React.ReactNode;
  className?: string;
  children: ReactNode | ((scrollProgress: MotionValue<number>) => ReactNode);
};

export const ContainerScroll = ({ titleComponent, children, className }: ContainerScrollProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const rotate = useTransform(
    scrollYProgress,
    [0, 0.55, 1],
    reduceMotion ? [0, 0, 0] : isMobile ? [22, 8, 0] : [24, 10, 0],
  );
  const scale = useTransform(
    scrollYProgress,
    [0, 0.55, 1],
    reduceMotion ? [1, 1, 1] : isMobile ? [0.72, 0.88, 1] : [1.08, 0.98, 1],
  );
  const headerY = useTransform(
    scrollYProgress,
    [0, 0.35],
    reduceMotion ? [0, 0] : isMobile ? [0, -32] : [0, -72],
  );
  const headerOpacity = useTransform(scrollYProgress, [0, 0.28], [1, 0.35]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.4, 1], [0.2, 0.65, 0.35]);

  const body =
    typeof children === "function" ? children(scrollYProgress) : children;

  return (
    <div
      ref={trackRef}
      className={cn(
        "container-scroll-track relative",
        isMobile ? "h-[200vh]" : "h-[240vh] md:h-[280vh]",
        className,
      )}
    >
      <div className="container-scroll-sticky sticky top-20 flex min-h-[calc(100dvh-5rem)] flex-col items-center justify-center px-2 pb-16 pt-6 md:top-24 md:px-6">
        <motion.div
          style={{ y: headerY, opacity: headerOpacity }}
          className="container-scroll-header mx-auto mb-6 max-w-3xl text-center md:mb-10"
        >
          {titleComponent}
        </motion.div>

        <TabletCard
          rotate={rotate}
          scale={scale}
          glowOpacity={glowOpacity}
          reduceMotion={!!reduceMotion}
        >
          {body}
        </TabletCard>
      </div>
    </div>
  );
};

function TabletCard({
  rotate,
  scale,
  glowOpacity,
  reduceMotion,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  glowOpacity: MotionValue<number>;
  reduceMotion: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className="container-scroll-stage relative mx-auto w-full max-w-5xl"
      style={{
        rotateX: rotate,
        scale,
        transformStyle: reduceMotion ? undefined : "preserve-3d",
        transformOrigin: "center center",
        perspective: reduceMotion ? undefined : "1200px",
      }}
    >
      <motion.div
        aria-hidden
        className="container-scroll-glow pointer-events-none absolute -inset-8 rounded-[32px] md:-inset-14"
        style={{
          opacity: glowOpacity,
          background:
            "radial-gradient(ellipse 90% 70% at 50% 62%, color-mix(in srgb, var(--color-sky-blue) 42%, transparent), transparent 72%)",
        }}
      />

      <div className="container-scroll-tablet">
        <div className="container-scroll-screen">{children}</div>
      </div>
    </motion.div>
  );
}

import { AnimatePresence, motion, useReducedMotion } from "motion/react";

interface PersonaAudienceVisualProps {
  imageSrc: string;
  alt: string;
}

function CornerMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
    >
      <circle cx="2" cy="2" r="2" fill="currentColor" />
      <circle cx="10" cy="2" r="2" fill="currentColor" />
      <circle cx="10" cy="10" r="2" fill="currentColor" />
    </svg>
  );
}

export function PersonaAudienceVisual({ imageSrc, alt }: PersonaAudienceVisualProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="persona-audience-visual">
      <div className="persona-audience-visual-stage">
        <div className="persona-audience-visual-dots" />
        <div className="persona-audience-visual-frame">
          <AnimatePresence mode="wait">
            <motion.img
              key={imageSrc}
              src={imageSrc}
              alt={alt}
              loading="lazy"
              decoding="async"
              className="persona-audience-visual-image"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
            />
          </AnimatePresence>
          <div className="persona-audience-visual-corners">
            <CornerMark className="persona-audience-visual-corner persona-audience-visual-corner--tl" />
            <CornerMark className="persona-audience-visual-corner persona-audience-visual-corner--tr" />
            <CornerMark className="persona-audience-visual-corner persona-audience-visual-corner--bl" />
            <CornerMark className="persona-audience-visual-corner persona-audience-visual-corner--br" />
          </div>
        </div>
      </div>
    </div>
  );
}

import { useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  href: string;
  children: ReactNode;
  className?: string;
  iconRight?: ReactNode;
}

export function MagneticButton({ href, children, className, iconRight }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pull, setPull] = useState({ x: 0, y: 0 });
  const reduceMotion = useReducedMotion();

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion || !ref.current) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const rect = ref.current.getBoundingClientRect();
    const x = event.clientX - (rect.left + rect.width / 2);
    const y = event.clientY - (rect.top + rect.height / 2);
    setPull({ x: x * 0.18, y: y * 0.18 });
  };

  const reset = () => setPull({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      className={cn("inline-flex", className)}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      animate={pull}
      transition={{ type: "spring", stiffness: 350, damping: 28, mass: 0.4 }}
      style={{ willChange: reduceMotion ? undefined : "transform" }}
    >
      <Button href={href} iconRight={iconRight}>
        {children}
      </Button>
    </motion.div>
  );
}

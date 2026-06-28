import { motion, useReducedMotion } from "motion/react";
import { heroWord } from "@/lib/hero-motion";
import { cn } from "@/lib/utils";

interface HeroWordRevealProps {
  text: string;
  className?: string;
  as?: "span" | "p" | "h1";
  delay?: number;
}

export function HeroWordReveal({
  text,
  className,
  as: Tag = "span",
  delay = 0,
}: HeroWordRevealProps) {
  const reduceMotion = useReducedMotion();
  const words = text.split(" ");

  if (reduceMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2 + delay,
      },
    },
  };

  return (
    <Tag className={cn("inline", className)}>
      <motion.span
        className="inline-flex flex-wrap justify-start gap-x-[0.28em]"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {words.map((word, i) => (
          <motion.span
            key={`${word}-${i}`}
            variants={heroWord}
            className="inline-block origin-bottom [font:inherit] [letter-spacing:inherit] [line-height:inherit]"
            style={{ transformPerspective: 800 }}
          >
            {word}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  );
}

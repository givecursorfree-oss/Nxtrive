/** Shared motion tokens — expo-out easing per top-design craft */
export const easeExpoOut = [0.16, 1, 0.3, 1] as const;
export const easeQuartOut = [0.25, 1, 0.5, 1] as const;

export const heroStagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

export const heroItem = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: easeExpoOut },
  },
};

export const heroWord = {
  hidden: { opacity: 0, y: "1.1em", rotateX: -12 },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.7, ease: easeExpoOut },
  },
};

export const navItem = {
  hidden: { opacity: 0, y: -12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: easeExpoOut },
  },
};

export const navContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.55 },
  },
};

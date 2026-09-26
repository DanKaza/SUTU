import type { Transition, Variants } from "framer-motion";

// Standard duration & easing (SUTU SPEC §5)
export const standardTransition: Transition = {
  duration: 0.8,
  ease: [0.22, 1, 0.36, 1],
};

export const microInteraction: Transition = {
  duration: 0.28,
  ease: [0.22, 1, 0.36, 1],
};

export const orientationTransition: Transition = standardTransition;

export const revealUp: Variants = {
  hidden: { opacity: 0, y: 34, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: standardTransition,
  },
};

export const staggerGroup: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.08,
    },
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: standardTransition },
};

export const staggerContainer: Variants = staggerGroup;

export const cardHover: Variants = {
  rest: { y: 0, scale: 1, boxShadow: "0 0 0 rgba(139,92,246,0)" },
  hover: {
    y: -8,
    scale: 1.015,
    boxShadow: "0 20px 60px rgba(124,58,237,.28)",
    transition: microInteraction,
  },
};

export const hoverInteraction = {
  scale: 1.01,
  borderColor: "#8B5CF6",
};


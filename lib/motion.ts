import type { Transition, Variants } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

// Standard duration & easing (SUTU SPEC §5)
export const standardTransition: Transition = {
  duration: 0.4,
  ease: EASE,
};

export const microInteraction: Transition = {
  duration: 0.2,
  ease: EASE,
};

export const orientationTransition: Transition = standardTransition;

/**
 * Entrance reveals move and fade, but never start at opacity 0. An element
 * painted at zero opacity is not eligible to be the largest contentful paint,
 * so a fade-in on above-the-fold content pushes LCP out by the animation
 * length. The filter blur that used to sit here was also main-thread paint
 * work on every frame, which is what pushed total blocking time past a
 * second on a throttled mid-tier phone.
 */
export const revealUp: Variants = {
  hidden: { opacity: 0.001, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: standardTransition,
  },
};

export const staggerGroup: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0,
    },
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0.001, y: 16 },
  show: { opacity: 1, y: 0, transition: standardTransition },
};

export const staggerContainer: Variants = staggerGroup;

export const cardHover: Variants = {
  rest: { y: 0, scale: 1 },
  hover: {
    y: -4,
    scale: 1.01,
    transition: microInteraction,
  },
};

export const hoverInteraction = {
  scale: 1.01,
  borderColor: "#8B5CF6",
};


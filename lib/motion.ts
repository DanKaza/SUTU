import type { Transition } from "framer-motion";

// Orientation motion — page/container transitions (desain_plan.md §4.1)
export const orientationTransition: Transition = {
  duration: 0.4,
  ease: [0.22, 1, 0.36, 1],
};

// Micro-interaction — hover on cards/buttons (desain_plan.md §4.2)
export const hoverInteraction = {
  scale: 1.01,
  borderColor: "#2563EB",
};

// Reduced-motion fallback — opacity fade only (desain_plan.md §4.3)
export const reducedMotionTransition: Transition = {
  duration: 0.2,
};

export const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: orientationTransition },
};

export const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

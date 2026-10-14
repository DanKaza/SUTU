import type { MotionProps, Transition, Variants } from "framer-motion";

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
 * Springs for anything that tracks the pointer or settles after a layout
 * change. The quintic curve above is correct for a one-shot entrance but reads
 * mechanical when the element is already following the user.
 */
export const softSpring: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 30,
  mass: 0.9,
};

export const snappySpring: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 34,
};

export const heavySpring: Transition = {
  type: "spring",
  stiffness: 180,
  damping: 26,
  mass: 1.1,
};

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

/**
 * Opacity only, no transform. For copy that may be the largest contentful
 * paint, where even a 20px offset moves the reported candidate.
 */
export const revealFade: Variants = {
  hidden: { opacity: 0.001 },
  show: { opacity: 1, transition: standardTransition },
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

/**
 * Icons resolve with a spring while the surrounding copy rises on the quintic.
 * A glyph that settles differently from its own label reads as "appearing",
 * which is the whole point of the glyph — but the difference stays small enough
 * that it does not compete with the text for attention.
 */
export const iconPop: Variants = {
  hidden: { opacity: 0.001, scale: 0.86 },
  show: { opacity: 1, scale: 1, transition: softSpring },
};

/** Reveal a list when it is already fully in view — no leading offset. */
export const staggerGroupImmediate: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
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

/**
 * One viewport config, so the trigger point is not re-typed per section. The
 * negative margin starts the reveal before the element's top edge reaches the
 * fold, which is what stops a section from popping in only once it is fully
 * visible.
 */
export const viewportOnce: MotionProps["viewport"] = { once: true, margin: "-80px 0px -80px 0px" };
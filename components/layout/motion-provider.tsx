"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * `reducedMotion="always"` makes framer-motion skip transform and layout
 * animations and jump those values to their target, while leaving opacity
 * animations alone. That is the shape we want: a visitor who asked for less
 * motion still gets a fade, but nothing travels across the screen.
 *
 * Scroll-linked values are exempt — a parallax layer and the nav progress line
 * are feedback, not decoration, so they carry `.motion-live` and are left to
 * keep tracking.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="always">{children}</MotionConfig>;
}
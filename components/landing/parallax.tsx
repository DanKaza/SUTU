"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * A plane that drifts against the scroll, used to give the landing page depth.
 *
 * The element itself moves — there is no wrapper — so a layer can carry a
 * component's own layout classes without adding a nesting level.
 *
 * `distance` is the half travel in px: the layer sits `distance` px low while
 * its section enters the viewport and `distance` px high while it leaves, so
 * total travel is 2 x distance. Keep it small — parallax that reads as "the
 * whole page is sliding" stops being parallax and starts being jank.
 *
 * Only the transform moves: layout, and therefore scroll height and paint
 * order, never changes. Under `prefers-reduced-motion` the layer is pinned to
 * its resting position and no scroll work happens.
 */
export function ParallaxLayer({
  children,
  distance = 48,
  className,
}: {
  children: ReactNode;
  /** Half travel in px. */
  distance?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      style={reducedMotion ? undefined : { y }}
    >
      {children}
    </motion.div>
  );
}

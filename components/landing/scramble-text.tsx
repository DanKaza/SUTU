"use client";

import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const GLYPHS = "#%&*+-/<=>?@[]^_{}~";

/**
 * Scramble-in text: the word churns through glyphs and locks into place.
 *
 * Two things keep it from costing anything:
 * - The real word is always laid out, at zero opacity, and the animating
 *   copy is absolutely positioned on top of it. Glyphs have different widths,
 *   so animating the word in place would reflow the line — on the hero that
 *   would wrap the headline, which sits close to its width budget already.
 * - The real word is never hidden from assistive tech, so it is read as
 *   "matters" from the first frame instead of as noise.
 *
 * Under `prefers-reduced-motion` the word simply renders.
 */
export function ScrambleText({
  text,
  duration = 800,
  className,
}: {
  text: string;
  /** Total decode time in ms. */
  duration?: number;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();
  const [shown, setShown] = useState(text);

  // Where each character locks in, scattered so it does not read as a wipe.
  const lockAt = useMemo(
    () =>
      text
        .split("")
        .map((_, i) => 0.12 + (i / text.length) * 0.6 + Math.random() * 0.16),
    [text]
  );

  useEffect(() => {
    if (reducedMotion) return;

    // Progress comes from the clock, not from a frame count: the hero also
    // runs a canvas and an entrance reveal, and counting frames stretched an
    // 800ms decode to about 1.4s when the page was busy.
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      setShown(
        text
          .split("")
          .map((ch, i) =>
            progress >= lockAt[i]
              ? ch
              : GLYPHS[(Math.random() * GLYPHS.length) | 0]
          )
          .join("")
      );
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, duration, lockAt, reducedMotion]);

  return (
    <span className={cn("relative inline-block", className)}>
      <span className="opacity-0">{text}</span>
      <span aria-hidden="true" className="absolute inset-0">
        {shown}
      </span>
    </span>
  );
}

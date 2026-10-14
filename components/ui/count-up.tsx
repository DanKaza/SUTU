"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { formatNumber } from "@/lib/api/format";

/**
 * A real figure that counts to its value once it scrolls into view.
 *
 * The number is the community's own, so the movement is the data arriving
 * rather than decoration on top of it — which is why nothing invents a figure
 * here. Callers must not render this for placeholder data: a count-up makes a
 * number look measured, so a seeded value would read as a real one.
 *
 * The first frame is 0 and the last is exactly `value`. Under
 * `prefers-reduced-motion` the value is set in one step and no frames run.
 */
export function CountUp({
  value,
  duration = 900,
  className,
}: {
  value: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reducedMotion = useReducedMotion();
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!inView) return;

    // A count from 0 to 1 has no intermediate frames, so there is nothing to
    // animate — running it would only hold the number behind a "0" for a beat
    // and leave the unit reading against the wrong figure.
    if (reducedMotion || value <= 1) {
      setShown(value);
      return;
    }

    let frame = 0;
    const started = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - started) / duration);
      // Ease-out cubic: fast enough to read as a count, slow enough to follow.
      setShown(Math.round(value * (1 - (1 - progress) ** 3)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, duration, reducedMotion]);

  return (
    <span ref={ref} className={className}>
      {formatNumber(shown)}
    </span>
  );
}

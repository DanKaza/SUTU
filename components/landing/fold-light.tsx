"use client";

import { useRef, type PointerEvent } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

/** Px the light travels toward the cursor at the band's edges. */
const TRAVEL = 30;

/**
 * The fold's one lit mass, and it answers the cursor.
 *
 * The light used to be pinned, and the page read as a screenshot of itself. A
 * looping "breathing" animation is the obvious way to fix that and the wrong
 * one: perpetual motion nobody triggered competes with the copy and never stops
 * (R-19). This version moves only because the visitor moved — it settles back
 * to centre when the pointer leaves, and never runs at all on touch, where
 * there is no hover to answer.
 *
 * One layer, not a stack. The section's rule is one lit thing; a second glow
 * competing with it breaks the composition instead of enriching it.
 */
export function FoldLight() {
  const reducedMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  // Slow enough that the light trails the cursor instead of snapping to it.
  const settleX = useSpring(pointerX, { stiffness: 70, damping: 22, mass: 1.2 });
  const settleY = useSpring(pointerY, { stiffness: 70, damping: 22, mass: 1.2 });

  const track = (event: PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - rect.left) / rect.width - 0.5) * 2 * TRAVEL);
    pointerY.set(((event.clientY - rect.top) / rect.height - 0.5) * 2 * TRAVEL);
  };

  const recentre = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <div className="absolute inset-0" onPointerMove={track} onPointerLeave={recentre}>
      {/* The plateau is wider than the card so the lit core still reads on both
          sides of it instead of hiding behind the object. */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(78%_78%_at_50%_52%,rgba(167,139,250,0.66),rgba(167,139,250,0.50)_30%,rgba(139,92,246,0.38)_50%,rgba(124,58,237,0.14)_72%,transparent_92%)]"
        style={reducedMotion ? undefined : { x: settleX, y: settleY }}
      />
    </div>
  );
}
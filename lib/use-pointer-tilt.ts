"use client";

import { type PointerEvent as ReactPointerEvent } from "react";
import { useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";

type PointerTiltOptions = {
  /** Degrees of tilt at the object's corners. */
  maxTilt?: number;
  stiffness?: number;
  damping?: number;
  /** Travel in px for the light that follows the cursor, at the object's edges. */
  drift?: number;
  perspective?: number;
};

/**
 * Tilt plus cursor drift, for the objects that answer the pointer.
 *
 * This is the page's liveliness: nothing here runs on a timer. The object only
 * moves while a pointer is over it, and returns to rest when the pointer
 * leaves, so the motion is a reply to the user rather than an ambient loop
 * competing with the content.
 *
 * Skipped for touch — there is no hover to answer, and a tilt that fires on tap
 * just reads as the layout jumping — and for `prefers-reduced-motion`, where
 * the object renders at rest with no scroll or pointer work attached.
 *
 * `style` goes on the tilting element; `drift` goes on a decorative layer
 * inside it when the same movement should also carry a light.
 */
export function usePointerTilt({
  maxTilt = 5,
  stiffness = 150,
  damping = 20,
  drift = 18,
  perspective = 1200,
}: PointerTiltOptions = {}) {
  const reducedMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const spring = { stiffness, damping };

  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [maxTilt, -maxTilt]), spring);
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-maxTilt, maxTilt]), spring);
  const driftX = useSpring(useTransform(pointerX, [-0.5, 0.5], [-drift, drift]), spring);
  const driftY = useSpring(useTransform(pointerY, [-0.5, 0.5], [-drift, drift]), spring);

  const onPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (reducedMotion || event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const onPointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return {
    reducedMotion,
    handlers: { onPointerMove, onPointerLeave },
    /** Attach to the element that tilts. */
    style: reducedMotion
      ? undefined
      : { rotateX, rotateY, transformPerspective: perspective },
    /** Attach to a decorative layer inside, so the light tracks the cursor too. */
    driftStyle: reducedMotion ? undefined : { x: driftX, y: driftY },
  };
}

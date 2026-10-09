"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Decorative ASCII wave field used as the landing hero background.
 *
 * Rows of monospace glyphs ride layered sine curves, so the field reads as
 * waves made of characters. Rendered on a canvas because hundreds of text
 * nodes per frame would thrash layout; a canvas keeps it to one paint.
 *
 * Purely decorative: aria-hidden, pointer-events-none, and it renders a
 * single static frame when the visitor asks for reduced motion.
 */

/** Density ramp — darker glyphs for crests, sparse for troughs. */
const RAMP = "·.:-=+*#%@";
const LINES = 18;
const CELL_W = 8; // tightened so neighbouring characters sit close together
const FONT_SIZE = 11;

export function AsciiWaves({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // next/font exposes the generated family through a CSS variable, which the
    // canvas font parser can't read itself — resolve it here instead.
    const mono =
      getComputedStyle(document.body)
        .getPropertyValue("--font-jetbrains-mono")
        .trim() || "ui-monospace";

    let width = 0;
    let height = 0;
    let raf = 0;
    let last = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = host.clientWidth;
      height = host.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${FONT_SIZE}px ${mono}, monospace`;
      ctx.textBaseline = "middle";
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      if (width === 0 || height === 0) return;

      const phase = time * 0.0011;
      const cols = Math.ceil(width / CELL_W);
      const amp = Math.max(10, height * 0.03);
      const amp2 = amp * 0.5;

      for (let line = 0; line < LINES; line++) {
        const baseY = ((line + 1) / (LINES + 1)) * height;

        for (let col = 0; col <= cols; col++) {
          const x = col * CELL_W;
          const drift = phase + line * 0.9;

          const y =
            baseY +
            amp * Math.sin(x * 0.018 + drift) +
            amp2 * Math.sin(x * 0.045 - drift * 1.6 + line);

          const intensity =
            0.5 + 0.5 * Math.sin(x * 0.03 + drift * 1.3 + line * 1.7);
          const index = Math.min(
            RAMP.length - 1,
            Math.round(intensity * (RAMP.length - 1))
          );

          ctx.fillStyle = `rgba(167, 139, 250, ${(0.4 + intensity * 0.2).toFixed(3)})`;
          ctx.fillText(RAMP[index], x, y);
        }
      }
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < 24) return; // cap near 40fps; the motion is slow anyway
      last = now;
      draw(now);
    };

    resize();

    const observer = new ResizeObserver(() => {
      resize();
      if (reducedMotion) draw(0);
    });
    observer.observe(host);

    if (reducedMotion) {
      draw(0);
    } else {
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full",
        "[mask-image:radial-gradient(ellipse_78%_68%_at_50%_45%,black,transparent_100%)]",
        "[-webkit-mask-image:radial-gradient(ellipse_78%_68%_at_50%_45%,black,transparent_100%)]",
        className
      )}
    />
  );
}

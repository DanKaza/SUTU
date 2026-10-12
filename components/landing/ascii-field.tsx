"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Decorative ASCII background for the landing hero.
 *
 * One canvas, five interchangeable patterns. All of them are pure text drawn in
 * the project's violet, dimmed but never removed behind the hero copy, so the
 * hero reads as "built out of characters" rather than as a picture.
 *
 * Pick a pattern with the `variant` prop:
 *   dots   — a calm grid of glyphs breathing around a slow focal point
 *   rain   — columns of falling characters with fading trails
 *   ripple — two pulse sources interfering, rings spreading across the grid
 *   drift  — a smooth flowing noise field, like slow clouds of text
 *   grid   — a retro receding floor with rails converging on a horizon
 *
 * Canvas, because a couple of thousand moving glyphs would otherwise mean a
 * couple of thousand layout-affecting nodes. Purely decorative: aria-hidden,
 * pointer-events-none, and a single static frame under reduced motion.
 */

export type AsciiVariant = "dots" | "rain" | "ripple" | "drift" | "grid";

export const ASCII_VARIANTS: {
  id: AsciiVariant;
  label: string;
  note: string;
}[] = [
  {
    id: "dots",
    label: "Dot matrix",
    note: "Grid tenang, terang-redup mengikuti satu titik fokus yang bergerak lambat.",
  },
  {
    id: "rain",
    label: "Glyph rain",
    note: "Kolom karakter jatuh dengan ekor yang memudar — ASCII paling dikenal.",
  },
  {
    id: "ripple",
    label: "Ripples",
    note: "Dua sumber pulsa dari sudut berbeda, cincinnya saling menguatkan.",
  },
  {
    id: "drift",
    label: "Noise drift",
    note: "Medan noise halus yang mengalir seperti awan teks yang bernapas.",
  },
  {
    id: "grid",
    label: "Perspective grid",
    note: "Lantai retro yang mundur ke horizon, garis-garisnya menuju satu titik.",
  },
];

/** Density ramp — heavier glyphs where the pattern is strong. */
const RAMP = ".:-=+*#%@";
const FONT_SIZE = 12;
/** Violet-400, the same accent the rest of the page uses. */
const RGB = "167, 139, 250";
/**
 * Behind real content the field keeps 45% of its brightness rather than
 * vanishing, so it still reads as a background while text stays legible.
 */
const CONTENT_FLOOR = 0.45;
const CONTENT_FADE_RATIO = 0.12;
const CONTENT_FADE_MIN = 50;

type Rect = { x1: number; y1: number; x2: number; y2: number };

const smoothstep = (t: number) => t * t * (3 - 2 * t);

/** 0 inside a content rect, easing to 1 once clear of it by `margin`. */
function contentFade(x: number, y: number, rects: Rect[], margin: number) {
  let value = 1;
  for (const r of rects) {
    const dx = Math.max(r.x1 - x, 0, x - r.x2);
    const dy = Math.max(r.y1 - y, 0, y - r.y2);
    const distance = Math.hypot(dx, dy);
    value = Math.min(value, smoothstep(Math.min(1, distance / margin)));
  }
  return value;
}

/** Deterministic pseudo-random in [0,1) so per-column traits never flicker. */
function noise1(n: number) {
  const s = Math.sin(n * 127.1) * 43758.5453;
  return s - Math.floor(s);
}

const rampChar = (energy: number) =>
  RAMP[Math.min(RAMP.length - 1, Math.max(0, Math.round(energy * (RAMP.length - 1))))];

/**
 * One depth plane of the field: how strongly it paints, how coarse its lattice
 * is, how fast its clock runs, and where its phase starts.
 */
type Layer = { opacity: number; scale: number; speed: number; phase: number };

/**
 * Four depth planes, listed far-to-near so that nearer ink is painted last and
 * overwrites the fainter ink behind it. Layer 1 is the nearest: full opacity,
 * finest lattice, fastest clock. Each plane behind it is dimmer, coarser and
 * slower, which is what turns a single flat sheet of glyphs into a wave field
 * with volume — the same pattern read at four different depths at once.
 *
 * The coarser lattice is also the cost control. Glyph count falls with the
 * square of the scale, so the farthest plane paints a tenth of what the
 * nearest does: four layers cost about 1.6x one layer, not 4x.
 */
const LAYERS: readonly Layer[] = [
  { opacity: 0.22, scale: 3.5, speed: 0.42, phase: 4.8 },
  { opacity: 0.42, scale: 2.5, speed: 0.62, phase: 3.1 },
  { opacity: 0.68, scale: 1.7, speed: 0.8, phase: 1.6 },
  { opacity: 1, scale: 1, speed: 1, phase: 0 },
];

export function AsciiField({
  className,
  variant = "dots",
}: {
  className?: string;
  variant?: AsciiVariant;
}) {
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

    const mono =
      getComputedStyle(document.body)
        .getPropertyValue("--font-jetbrains-mono")
        .trim() || "ui-monospace";

    let width = 0;
    let height = 0;
    let raf = 0;
    let last = 0;
    let contentRects: Rect[] = [];
    let fadeMargin = CONTENT_FADE_MIN;

    const buildContentRects = () => {
      // The hero is a two-column grid on lg and stacks below it, so the area
      // to dim depends on which layout is live.
      contentRects =
        width >= 1024
          ? [
              {
                x1: width * 0.03,
                y1: height * 0.12,
                x2: width * 0.5,
                y2: height * 0.9,
              },
              {
                x1: width * 0.56,
                y1: height * 0.18,
                x2: width * 0.97,
                y2: height * 0.86,
              },
            ]
          : [
              {
                x1: width * 0.03,
                y1: height * 0.05,
                x2: width * 0.97,
                y2: height * 0.45,
              },
              {
                x1: width * 0.08,
                y1: height * 0.5,
                x2: width * 0.92,
                y2: height * 0.95,
              },
            ];
    };

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
      fadeMargin = Math.max(
        CONTENT_FADE_MIN,
        Math.min(width, height) * CONTENT_FADE_RATIO
      );
      buildContentRects();
    };

    /** Draw one glyph, dimmed where real content sits on top of it. */
    const put = (x: number, y: number, char: string, alpha: number) => {
      const dimmed =
        CONTENT_FLOOR +
        (1 - CONTENT_FLOOR) * contentFade(x, y, contentRects, fadeMargin);
      const a = alpha * dimmed;
      // The floor has to sit under the farthest plane's ceiling — its brightest
      // glyph is 0.66 * 0.22 * CONTENT_FLOOR — or the dimmest layer is the one
      // that gets culled and the depth stops reading.
      if (a < 0.004) return;
      ctx.fillStyle = `rgba(${RGB}, ${a.toFixed(3)})`;
      ctx.fillText(char, x, y);
    };

    const drawDots = (time: number) => {
      for (const layer of LAYERS) {
        const t = time * layer.speed + layer.phase * 1000;
        const step = Math.round(26 * layer.scale);
        // A single slow focal point the grid brightens around.
        const fx = width * (0.5 + 0.3 * Math.sin(t * 0.0006));
        const fy = height * (0.45 + 0.22 * Math.cos(t * 0.0009));
        for (let y = step * 0.46; y < height; y += step) {
          for (let x = step * 0.46; x < width; x += step) {
            const d = Math.hypot(x - fx, y - fy);
            const v = 0.5 + 0.5 * Math.sin(d * 0.02 - t * 0.0022);
            const energy = v * v;
            put(x, y, rampChar(energy), (0.09 + energy * 0.52) * layer.opacity);
          }
        }
      }
    };

    const drawRain = (time: number) => {
      for (const layer of LAYERS) {
        const t = time * layer.speed + layer.phase * 1000;
        const colW = Math.round(18 * layer.scale);
        const drop = Math.round(13 * layer.scale);
        const cols = Math.ceil(width / colW);
        const seconds = t * 0.001;
        for (let c = 0; c < cols; c++) {
          // Offsetting the seed per plane keeps the columns of one layer from
          // lining up with the columns of another.
          const seed = noise1(c + 1 + layer.phase * 100);
          const speed = 30 + seed * 70; // px per second
          const tail = 10 + Math.floor(noise1(c + 11) * 14);
          const span = height + tail * drop * 2;
          const head = ((seconds * speed + seed * span) % span) - tail * drop;
          const x = c * colW;
          for (let i = 0; i < tail; i++) {
            const y = head - i * drop;
            if (y < -drop || y > height + drop) continue;
            const fade = 1 - i / tail;
            // Leading glyph is the heaviest one; the tail thins out.
            const char =
              i === 0
                ? RAMP[RAMP.length - 1]
                : rampChar(Math.min(1, fade) * 0.7);
            put(x, y, char, (0.1 + fade * 0.56) * layer.opacity);
          }
        }
      }
    };

    const drawRipple = (time: number) => {
      const spread = Math.max(width, height);
      const sources = [
        { x: width * 0.5, y: height * 0.42, dir: 1 },
        { x: width * 0.78, y: height * 0.72, dir: -1 },
      ];
      for (const layer of LAYERS) {
        const t = time * layer.speed + layer.phase * 1000;
        const cell = Math.round(22 * layer.scale);
        for (let y = cell * 0.5; y < height; y += cell) {
          for (let x = cell * 0.5; x < width; x += cell) {
            let v = 0;
            for (const s of sources) {
              const r = Math.hypot(x - s.x, y - s.y);
              v +=
                s.dir *
                Math.sin(r * 0.045 - t * 0.0022) *
                Math.exp(-r / (spread * 0.7));
            }
            const energy = Math.min(1, Math.abs(v));
            put(x, y, rampChar(energy), (0.07 + energy * 0.56) * layer.opacity);
          }
        }
      }
    };

    const drawDrift = (time: number) => {
      for (const layer of LAYERS) {
        const seconds = (time * layer.speed + layer.phase * 1000) * 0.00012;
        const cell = Math.round(20 * layer.scale);
        for (let y = cell * 0.5; y < height; y += cell) {
          for (let x = cell * 0.5; x < width; x += cell) {
            // Three octaves of smooth value noise, drifting slowly.
            let v = 0;
            let amp = 0.6;
            let freq = 1;
            for (let o = 0; o < 3; o++) {
              v +=
                amp *
                Math.sin(x * 0.004 * freq + seconds * 2 + o) *
                Math.cos(y * 0.005 * freq - seconds * 1.4 + o * 1.7);
              amp *= 0.5;
              freq *= 2.2;
            }
            const energy = Math.min(1, Math.max(0, (v + 1) * 0.5));
            put(x, y, rampChar(energy), (0.06 + energy * 0.5) * layer.opacity);
          }
        }
      }
    };

    const drawGrid = (time: number) => {
      for (const layer of LAYERS) {
        const t = time * layer.speed + layer.phase * 1000;
        // Each plane is its own floor set further back: fewer rows, a higher
        // horizon, a slower pulse. The grids stack into depth instead of
        // overprinting the same lines.
        const rows = Math.max(6, Math.round(24 / layer.scale));
        const horizon = height * (0.3 + (layer.scale - 1) * 0.075);
        const depth = height - horizon;
        // Pulse travels from the horizon toward the viewer, on a loop.
        const pulse = (t * 0.001 * 0.18) % 1;
        const dash = Math.max(6, Math.round(14 * layer.scale));

        for (let r = 0; r < rows; r++) {
          const p = (r + 1) / rows;
          const y = horizon + depth * p * p;
          const glow = Math.max(0, 1 - Math.abs(p - pulse) * 5);
          const char = p < 0.3 ? "." : p < 0.65 ? "-" : "_";
          // Dashes rather than a solid rule, so it stays a texture.
          for (let x = 0; x < width; x += dash) {
            if ((Math.round(x / dash) + r * 2) % 3 !== 0) continue;
            put(x, y, char, (0.05 + p * 0.22 + glow * 0.5) * layer.opacity);
          }
        }

        // Rails converging on the vanishing point.
        const vp = width / 2;
        const rails = Math.max(3, Math.round(7 / layer.scale));
        for (let rail = -rails; rail <= rails; rail++) {
          for (let r = 0; r < rows; r++) {
            const p = (r + 1) / rows;
            const y = horizon + depth * p * p;
            const x = vp + rail * width * 0.09 * layer.scale * p;
            if (x < 0 || x > width) continue;
            put(x, y, ".", (0.05 + p * 0.27) * layer.opacity);
          }
        }
      }
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      if (width === 0 || height === 0) return;

      switch (variant) {
        case "rain":
          drawRain(time);
          break;
        case "ripple":
          drawRipple(time);
          break;
        case "drift":
          drawDrift(time);
          break;
        case "grid":
          drawGrid(time);
          break;
        default:
          drawDots(time);
      }
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < 33) return; // the drift is slow; ~30fps is plenty
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
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full",
        "[mask-image:radial-gradient(ellipse_90%_82%_at_50%_45%,black,transparent_100%)]",
        "[-webkit-mask-image:radial-gradient(ellipse_90%_82%_at_50%_45%,black,transparent_100%)]",
        className
      )}
    />
  );
}

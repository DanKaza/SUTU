"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Decorative CRT-style support terminal shown in the landing hero.
 *
 * This is a visual demonstration, not a real terminal: the community and
 * reference are fictional values, and nothing here is wired to application
 * data. The tube is built from shading plus a handful of compositor-only
 * animations — a roll bar, phosphor flicker, grain, chromatic aberration, an
 * occasional sync tear — and the output is typed out one character at a time.
 *
 * Two deliberate limits:
 * - The displacement filter that bows the scanlines is kept off the text.
 *   Warping glyphs would cost legibility, and the field is static, so it is
 *   rasterised once instead of on every frame.
 * - Untyped characters stay in the layout at zero opacity, so the card never
 *   changes height while it types. A hero that resizes mid-animation would
 *   push everything below it around.
 */

type StatusRow = {
  label: string;
  value: string;
  emphasis?: boolean;
};

const STATUS_ROWS: StatusRow[] = [
  { label: "COMMUNITY", value: "Pixel Forge" },
  { label: "STATUS", value: "SUPPORT RECEIVED", emphasis: true },
  { label: "CONTRIBUTION", value: "5 MON" },
  { label: "REFERENCE", value: "8x1a2b_c3d4" },
];

const CONFIRMATIONS = [
  "Support recorded",
  "Confirmation available",
  "Activity updated",
];

const PATH = "sutu://community";
const COMMAND = "community.status()";

const CHAR_MS = 24;
const PAUSE_PATH = 180;
const PAUSE_COMMAND = 420;
const PAUSE_ROW = 110;
const PAUSE_OK = 70;

type Unit = { text: string; pause: number };

/** Characters revealed so far, with the rest held at zero opacity. */
function Typed({ text, at }: { text: string; at: number }) {
  return (
    <>
      {text.slice(0, at)}
      <span className="opacity-0">{text.slice(at)}</span>
    </>
  );
}

/** Steps through the script, one character at a time. */
function useTerminalScript(script: Unit[]) {
  const reducedMotion = useReducedMotion();
  const [cursor, setCursor] = useState({ unit: 0, chars: 0 });

  useEffect(() => {
    if (reducedMotion) return;
    const unit = script[cursor.unit];
    if (!unit) return;

    const typing = cursor.chars < unit.text.length;
    const id = window.setTimeout(
      () =>
        setCursor((current) =>
          typing
            ? { unit: current.unit, chars: current.chars + 1 }
            : { unit: current.unit + 1, chars: 0 }
        ),
      typing ? CHAR_MS : unit.pause
    );
    return () => window.clearTimeout(id);
  }, [cursor, reducedMotion, script]);

  return (index: number) => {
    if (reducedMotion) return script[index].text.length;
    if (index < cursor.unit) return script[index].text.length;
    if (index > cursor.unit) return 0;
    return cursor.chars;
  };
}

export function SupportTerminal({ className }: { className?: string }) {
  const script = useMemo<Unit[]>(
    () => [
      { text: PATH, pause: PAUSE_PATH },
      { text: COMMAND, pause: PAUSE_COMMAND },
      ...STATUS_ROWS.map((row) => ({ text: row.value, pause: PAUSE_ROW })),
      ...CONFIRMATIONS.map((line) => ({ text: line, pause: PAUSE_OK })),
    ],
    []
  );
  const at = useTerminalScript(script);

  return (
    <div
      className={cn(
        "crt-housing w-full max-w-[420px] rounded-[22px] p-2.5 sm:p-3",
        className
      )}
    >
      <div className="crt-bezel rounded-[16px] p-3 sm:p-3.5">
        <div className="crt-screen relative overflow-hidden rounded-[10px]">
          {/* Glass-decor layers under the text — never clickable. The fine
              scanlines stay sharp; the coarse mask is the part the glass
              bends, because bigger features survive displacement intact. */}
          <div
            className="crt-scanlines pointer-events-none absolute inset-0 z-20"
            aria-hidden="true"
          />
          <div
            className="crt-mask crt-warp pointer-events-none absolute inset-0 z-20"
            aria-hidden="true"
          />
          <div
            className="crt-convex pointer-events-none absolute inset-0 z-20"
            aria-hidden="true"
          />
          <div
            className="crt-vignette pointer-events-none absolute inset-0 z-20"
            aria-hidden="true"
          />

          {/* Fake output, so it is kept out of the accessibility tree. */}
          <div
            aria-hidden="true"
            className="crt-power-on relative z-30 min-h-[310px] font-mono text-[12.5px] leading-[1.65] sm:text-[13px]"
          >
            <div className="crt-glitch">
              <div className="flex items-center justify-between border-b border-[#393044]/60 px-4 py-2.5 sm:px-5">
                <span className="flex items-center gap-2 tracking-[0.14em] text-[#D9C7FF]">
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-[#A970FF] shadow-[0_0_6px_rgba(169,112,255,0.85)]"
                    aria-hidden="true"
                  />
                  SUTU
                </span>
                <span className="flex items-center gap-2 text-[11px] tracking-[0.12em] text-[#9585B5]">
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-[#A970FF] shadow-[0_0_8px_rgba(169,112,255,0.9)]"
                    aria-hidden="true"
                  />
                  SIGNAL OK
                </span>
              </div>

              <div className="crt-aberration px-4 py-4 sm:px-5 sm:py-5">
                <p className="text-[#9585B5]">
                  <Typed text={PATH} at={at(0)} />
                </p>
                <p className="crt-glow mt-1 text-[#D9C7FF]">
                  <span className={cn("text-[#A970FF]", at(1) === 0 && "opacity-0")}>
                    $
                  </span>{" "}
                  <Typed text={COMMAND} at={at(1)} />
                </p>

                <dl className="mt-4 grid grid-cols-[7.5rem_1fr] gap-x-3 gap-y-1.5 sm:grid-cols-[8.5rem_1fr]">
                  {STATUS_ROWS.map(({ label, value, emphasis }, index) => (
                    <Fragment key={label}>
                      <dt
                        className={cn(
                          "text-[#9585B5]",
                          at(index + 2) === 0 && "opacity-0"
                        )}
                      >
                        {label}
                      </dt>
                      <dd
                        className={cn(
                          "min-w-0 break-words",
                          emphasis
                            ? "crt-glow-strong text-[#A970FF]"
                            : "text-[#D9C7FF]"
                        )}
                      >
                        <Typed text={value} at={at(index + 2)} />
                      </dd>
                    </Fragment>
                  ))}
                </dl>

                <div className="mt-4 space-y-1">
                  {CONFIRMATIONS.map((line, index) => (
                    <p key={line} className="text-[#D9C7FF]">
                      <span
                        className={cn(
                          "text-[#A970FF]",
                          at(index + 6) === 0 && "opacity-0"
                        )}
                      >
                        [OK]
                      </span>{" "}
                      <Typed text={line} at={at(index + 6)} />
                    </p>
                  ))}
                </div>

                <p className="mt-4 text-[#D9C7FF]">
                  <span className="text-[#A970FF]">$</span>{" "}
                  <span
                    className="crt-cursor inline-block h-[1.05em] w-[0.55em] translate-y-[0.15em] bg-[#A970FF]"
                    aria-hidden="true"
                  />
                </p>
              </div>
            </div>
          </div>

          {/* Layers on the glass, above the text. */}
          <div
            className="crt-roll pointer-events-none absolute inset-x-0 top-0 z-40 h-[12%]"
            aria-hidden="true"
          />
          <div
            className="crt-noise pointer-events-none absolute inset-0 z-40"
            aria-hidden="true"
          />
          <div
            className="crt-flicker pointer-events-none absolute inset-0 z-40"
            aria-hidden="true"
          />
        </div>

        {/* Engraved label + power indicator on the monitor shell. */}
        <div className="mt-2.5 flex items-center justify-between px-1.5">
          <span className="font-mono text-[9.5px] tracking-[0.22em] text-[#4e4759]">
            SUPPORT
          </span>
          <span
            className="h-1 w-1 rounded-full bg-[#A970FF]/70 shadow-[0_0_5px_rgba(169,112,255,0.6)]"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}

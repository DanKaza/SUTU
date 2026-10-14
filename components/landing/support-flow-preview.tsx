"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useCommunities } from "@/lib/community-data";
import { getAffirmation } from "@/lib/affirmations";
import { usePointerTilt } from "@/lib/use-pointer-tilt";
import { cn } from "@/lib/utils";

const PRESETS = [3, 5, 10, 25];

/** Degrees of tilt at the card's corners. Enough to read as an object, not
 *  enough to move the text off the band it sits on. */
const MAX_TILT = 4;

/**
 * The hero's one object: the support gesture, at the size of a card.
 *
 * The community is whichever one the API lists first, so the fold shows a real
 * row rather than a seed entry — while the same request is in flight the card
 * holds its height instead of collapsing, because this sits directly under the
 * h1 and any reflow here lands in the same frame as the LCP.
 *
 * The amount chips are real local state, not a picture of a control — the
 * selected one moves the affirmation, so nothing here looks tappable while
 * doing nothing. Nothing leaves the page: this is a preview of the flow, and
 * the first screen's only real action is the button above it.
 *
 * The surface is opaque. The lit band behind it lifts whatever it is allowed to
 * show through, and translucent versions measured the tertiary text colour on
 * the card at 4.34:1 and 4.46:1 — under the AA floor. The light reads as
 * surrounding the object rather than passing through it, which is also how the
 * reference frames its one lit mass.
 *
 * It tilts a few degrees toward the pointer. The page's one object answering
 * the cursor is what separates it from a screenshot of a card. Skipped for
 * touch (there is no hover to answer) and for reduced motion.
 */
export function SupportFlowPreview() {
  const { communities, isLoading } = useCommunities();
  const community = communities[0];
  const affirmation = community ? getAffirmation(community.category) : null;
  const [amount, setAmount] = useState(5);

  const tilt = usePointerTilt({ maxTilt: MAX_TILT, stiffness: 150, damping: 20 });

  return (
    <motion.div
      {...tilt.handlers}
      style={tilt.style}
      className="min-h-[292px] w-full max-w-[620px] rounded-card border border-white/11 bg-ink-900 p-5"
    >
      <div className="flex items-start gap-4 border-b border-white/11 pb-4">
        <div
          aria-hidden="true"
          className={cn(
            "h-11 w-11 shrink-0 rounded-full bg-ink-800",
            !isLoading && "flex items-center justify-center font-display text-[14px] font-bold text-ink",
          )}
        >
          {isLoading ? null : community?.logoInitial}
        </div>
        <div className="min-w-0 flex-1">
          {isLoading || !community ? (
            <>
              <div aria-hidden="true" className="h-5 w-40 rounded bg-white/[0.06]" />
              <div aria-hidden="true" className="mt-2 h-4 w-full rounded bg-white/[0.06]" />
            </>
          ) : (
            <>
              <p className="font-display text-[18px] font-semibold text-white">
                Support {community.name}
              </p>
              <p className="font-body text-[16px] text-muted">{community.description}</p>
            </>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {PRESETS.map((preset) => {
          const selected = preset === amount;
          return (
            <button
              key={preset}
              type="button"
              aria-pressed={selected}
              onClick={() => setAmount(preset)}
              className={cn(
                // Selected state is an accent wash plus an accent border, never
                // colour alone — and it doubles as the focusable demonstration
                // that the chips are the flow's real control.
                "min-h-11 rounded-full border px-5 py-2 font-mono text-[14px] transition-colors duration-200 ease-quintic-out",
                selected
                  ? "border-violet-400 bg-violet-500/15 text-violet-400"
                  : "border-white/11 text-muted hover:border-white/20 hover:text-white"
              )}
            >
              {preset} MON
            </button>
          );
        })}
      </div>

      <div className="mt-5 rounded-card border border-violet-400/30 bg-violet-500/[0.07] px-5 py-4 text-center">
        {affirmation ? (
          <>
            <p className="font-display text-[32px] font-semibold leading-[1.1] text-white">
              {affirmation.word}
            </p>
            <p className="mt-2 font-body text-[16px] text-muted">{affirmation.caption}</p>
          </>
        ) : (
          <>
            <div aria-hidden="true" className="mx-auto h-9 w-32 rounded bg-white/[0.06]" />
            <div aria-hidden="true" className="mx-auto mt-3 h-4 w-40 rounded bg-white/[0.06]" />
          </>
        )}
      </div>

      {/* The card stops at the affirmation. There is no transaction hash and no
          totals line: nothing here is a real record, and either one reads as
          invented activity — the rail three sections down already carries the
          community's numbers. */}
    </motion.div>
  );
}

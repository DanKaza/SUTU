"use client";

import { motion } from "framer-motion";
import { communities } from "@/lib/mock-data";
import { getAffirmation } from "@/lib/affirmations";
import { displayMon } from "@/lib/api/format";
import { revealUp } from "@/lib/motion";

const PRESETS = [3, 5, 10, 25];
const PICKED = "lofi-collective";

export function SupportFlowPreview() {
  const community = communities.find((c) => c.id === PICKED) ?? communities[0];
  const affirmation = getAffirmation(community.category);

  return (
    <section>
      <motion.div
        variants={revealUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mx-auto max-w-[900px] rounded-card border border-white/11 bg-ink-950 p-6 sm:p-8"
      >
        <div className="flex items-start gap-4 border-b border-white/11 pb-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink-800 font-display text-sm font-bold text-ink">
            {community.logoInitial}
          </div>
          <div className="min-w-0">
            <h2 className="font-display text-lg font-semibold text-white">Support {community.name}</h2>
            <p className="font-body text-sm text-muted">{community.description}</p>
          </div>
        </div>

        <div className="mt-6">
          <p className="font-mono text-[11px] text-faint">CHOOSE AN AMOUNT</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {PRESETS.map((amount) => (
              <span
                key={amount}
                className={`rounded-full border px-4 py-2 font-mono text-sm ${
                  amount === 5
                    ? "border-violet-400 bg-violet-500/15 text-violet-400"
                    : "border-white/11 text-muted"
                }`}
              >
                {amount} MON
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-card border border-violet-400/30 bg-violet-500/[0.07] px-5 py-6 text-center">
          <p className="font-mono text-[11px] text-violet-400">SUPPORT SENT</p>
          <p className="mt-3 font-display text-4xl font-semibold text-white">{affirmation.word}</p>
          <p className="mt-2 font-body text-sm text-muted">{affirmation.caption}</p>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/11 pt-4 font-mono text-[11px] text-faint">
          <span>
            {community.supporterCount.toLocaleString()} supporters · {displayMon(community.totalSupported)} MON received
          </span>
          <span>5 MON · 0x1a2b…c3d4</span>
        </div>
      </motion.div>
    </section>
  );
}

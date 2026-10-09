"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SupportTerminal } from "@/components/landing/support-terminal";
import { AsciiWaves } from "@/components/landing/ascii-waves";
import { revealUp, staggerGroup } from "@/lib/motion";

const PROOFS = [
  "Every community's support and donation details on one page",
  "Support confirms with an affirmation, not just a receipt",
  "Track every contribution you have made",
];

export function HeroSection() {
  return (
    <section className="relative min-h-[820px] flex items-center pt-12 pb-24 overflow-hidden">
      <AsciiWaves />
      <div className="relative z-10 mx-auto w-full max-w-[1280px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          <motion.div
            variants={staggerGroup}
            initial="hidden"
            animate="show"
            className="lg:col-span-7 flex flex-col items-start text-left z-10"
          >
            <motion.h1
              variants={revealUp}
              className="font-display text-[48px] sm:text-[64px] lg:text-[88px] font-semibold tracking-[-0.03em] leading-[0.95] text-white"
            >
              Back something<br />
              that <span className="text-violet-400">matters</span>.
            </motion.h1>

            <motion.p 
              variants={revealUp}
              className="mt-8 max-w-[520px] font-body text-[18px] sm:text-[20px] leading-[1.55] text-muted"
            >
              SUTU helps communities grow through one open place to back them, support that
              actually lands, and small steps taken consistently.
            </motion.p>

            <motion.div variants={revealUp} className="mt-10 flex flex-wrap items-center gap-4">
              <Link href="/discover">
                <Button size="lg" className="h-14 px-8 text-[16px] font-semibold shadow-glow-violet transition-all duration-300 hover:scale-[1.02]">
                  Explore communities
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="ghost" className="h-14 rounded-full px-8 text-[16px] font-semibold text-white hover:bg-white/5">
                <Play className="mr-2 h-4 w-4 fill-white" />
                Watch the intro
              </Button>
            </motion.div>

            {/* What actually happens — replaces the invented "12,000+" stat */}
            <motion.ul variants={revealUp} className="mt-12 flex flex-col gap-3">
              {PROOFS.map((p) => (
                <li key={p} className="flex items-start gap-3 font-body text-sm text-muted">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" />
                  {p}
                </li>
              ))}
            </motion.ul>
          </motion.div>

          <motion.div
            variants={revealUp}
            initial="hidden"
            animate="show"
            className="lg:col-span-5 relative flex items-center justify-center"
          >
            <SupportTerminal />
          </motion.div>

        </div>
      </div>
    </section>
  );
}


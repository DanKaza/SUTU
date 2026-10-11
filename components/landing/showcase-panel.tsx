"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { communities } from "@/lib/mock-data";
import { formatNumber } from "@/lib/api/format";
import { revealUp, staggerGroup } from "@/lib/motion";
import { ParallaxLayer } from "@/components/landing/parallax";

const PROOFS = [
  "Every community's support and donation details on one page",
  "No account needed to back a community",
  "Keep a record of everything you have contributed",
];

export function ShowcasePanel() {
  return (
    <section>
      <ParallaxLayer
        distance={64}
        className="relative overflow-hidden rounded-card border border-white/11 bg-ink-900 px-8 py-16 sm:px-16 sm:py-20"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            variants={staggerGroup}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="lg:col-span-5 flex flex-col items-start"
          >
            <motion.h2
              variants={revealUp}
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.05] text-white"
            >
              Everything you need to back a community.
            </motion.h2>
            <motion.ul variants={revealUp} className="mt-8 flex flex-col gap-3">
              {PROOFS.map((p) => (
                <li key={p} className="flex items-start gap-3 font-body text-base text-muted">
                  <Heart className="mt-1 h-4 w-4 shrink-0 text-violet-400" />
                  {p}
                </li>
              ))}
            </motion.ul>
            <motion.div variants={revealUp} className="mt-8">
              <Link href="/about">
                <Button variant="ghost" className="p-0 text-[15px] font-semibold text-violet-400 hover:text-violet-300 hover:bg-transparent">
                  How SUTU works
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Real communities from the app's own seed data */}
          <motion.div
            variants={revealUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="lg:col-span-7 flex flex-col gap-3"
          >
            {communities.slice(0, 3).map((c) => (
              <Link
                key={c.id}
                href={`/communities/${c.id}`}
                className="flex items-center gap-4 rounded-card border border-white/11 bg-ink-800 p-4 transition-colors duration-200 ease-quintic-out hover:border-white/20"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink-900 font-display text-sm font-bold text-ink">
                  {c.logoInitial}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-body font-medium text-white">{c.name}</p>
                  <p className="truncate font-body text-sm text-muted">{c.description}</p>
                </div>
                <span className="shrink-0 font-mono text-xs text-faint">
                  {formatNumber(c.supporterCount)} supporters
                </span>
              </Link>
            ))}
          </motion.div>
        </div>
      </ParallaxLayer>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { Heart, Repeat, Search } from "lucide-react";
import { revealUp, staggerGroup, cardHover } from "@/lib/motion";

const STEPS = [
  {
    id: "01",
    icon: Search,
    title: "Find a community",
    description: "Search by name, cause or category. Every profile shows what the community is actually building.",
  },
  {
    id: "02",
    icon: Heart,
    title: "Back it in one flow",
    description: "Pick an amount and send it. No account juggling, no hunting for a donation address.",
  },
  {
    id: "03",
    icon: Repeat,
    title: "Keep showing up",
    description: "Support compounds. Track every contribution and back the same community again.",
  },
];

export function HowItWorksSection() {
  return (
    <div className="relative py-20 rounded-[32px] bg-gradient-to-b from-ink-950 via-[#0a0a14] to-[#040914] px-6 sm:px-12">
      <motion.div
        variants={staggerGroup}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="text-center mx-auto max-w-2xl"
      >
        <motion.span 
          variants={revealUp}
          className="font-mono text-[11px] font-semibold tracking-[0.12em] uppercase text-cyan-400"
        >
          HOW SUTU WORKS
        </motion.span>
        <motion.h2
          variants={revealUp}
          className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.05] text-white"
        >
          Three steps, no account required
        </motion.h2>
      </motion.div>

      <motion.div
        variants={staggerGroup}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mt-16 grid gap-6 sm:grid-cols-3"
      >
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          // Tengah (idx 1) dibuat sedikit lebih tinggi di desktop sebagai focal point
          const isCenter = idx === 1;
          
          return (
            <motion.div
              key={step.id}
              variants={revealUp}
              initial="rest"
              whileHover="hover"
              className={`h-full ${isCenter ? "lg:-mt-4 lg:mb-4" : ""}`}
            >
              <motion.div
                variants={cardHover}
                className="relative flex h-full flex-col overflow-hidden rounded-[20px] border border-white/11 bg-ink-800 p-1"
              >
                {/* Thumbnail Header placeholder */}
                <div className="relative h-40 w-full overflow-hidden rounded-t-[16px] bg-ink-900 border-b border-white/5 flex items-center justify-center">
                  <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')]" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-cyan-900/40 blur-xl rounded-full" />
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-ink-800 text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <span className="font-mono text-xs font-semibold tracking-widest text-cyan-400">
                    STEP {step.id}
                  </span>
                  <h3 className="mt-3 font-display text-lg font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 font-body text-sm text-muted">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

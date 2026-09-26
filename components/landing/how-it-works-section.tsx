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
      <div className="relative rounded-section bg-section py-14 px-6 sm:px-12">
      <motion.div
        variants={staggerGroup}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="text-center mx-auto max-w-2xl"
      >
        <motion.h2
          variants={revealUp}
          className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.05] text-white"
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
          // Step 02 is the action itself, so it gets the one raised surface.
          const isAction = idx === 1;

          return (
            <motion.div
              key={step.id}
              variants={revealUp}
              initial="rest"
              whileHover="hover"
              className="h-full"
            >
              <motion.div
                variants={cardHover}
                className={`flex h-full flex-col rounded-card border p-6 transition-colors duration-300 ease-quintic-out ${
                  isAction
                    ? "border-violet-400/40 bg-ink-800"
                    : "border-white/11 bg-ink-800/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${
                      isAction ? "bg-violet-500 text-ink" : "bg-ink-700 text-violet-400"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="font-mono text-xs text-faint">Step {step.id}</span>
                </div>

                <h3 className="mt-5 font-display text-lg font-semibold text-white">
                  {step.title}
                </h3>
                <p className="mt-2 font-body text-sm text-muted">
                  {step.description}
                </p>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

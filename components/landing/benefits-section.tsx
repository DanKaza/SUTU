"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { revealUp, staggerGroup, cardHover } from "@/lib/motion";

const BENEFITS = [
  {
    icon: "◎",
    title: "Belonging",
    description: "Find a community that feels relevant from the first line you read.",
  },
  {
    icon: "↗",
    title: "Momentum",
    description: "Turn small gestures into habits and shared action.",
  },
  {
    icon: "✦",
    title: "Care",
    description: "Interactions that stay safe, open and human.",
  },
];

export function BenefitsSection() {
  return (
    <section className="py-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left */}
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
            Community, with intention.
          </motion.h2>
          <motion.p 
            variants={revealUp}
            className="mt-6 font-body text-base sm:text-lg leading-relaxed text-muted"
          >
            Back communities that have a rhythm, a purpose and shared values — not another loud
            channel nobody reads.
          </motion.p>
          <motion.div variants={revealUp} className="mt-8">
            <Link href="/discover">
              <Button className="h-12 px-7 text-[15px] font-semibold">
                Find a community
              </Button>
            </Link>
          </motion.div>

          {/* Abstract violet accent */}
          <motion.div 
            variants={revealUp}
            aria-hidden
            className="mt-12 hidden lg:block relative w-48 h-32 opacity-60"
          >
            <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-2 border-violet-500/40" />
            <div className="absolute top-4 left-10 h-12 w-12 rounded-full bg-violet-500/15 blur-md" />
            <div className="absolute bottom-0 right-4 h-10 w-10 rounded-full border border-pink/30" />
            <div className="absolute bottom-2 right-8 h-6 w-6 rounded-full bg-pink/10 blur-sm" />
          </motion.div>
        </motion.div>

        {/* Right: Benefit Cards */}
        <motion.div
          variants={staggerGroup}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="lg:col-span-7 flex flex-col gap-4"
        >
          {BENEFITS.map((b) => (
            <motion.div
              key={b.title}
              variants={revealUp}
              initial="rest"
              whileHover="hover"
            >
              <motion.div 
                variants={cardHover}
                className="flex items-start gap-5 rounded-[20px] border border-white/11 bg-ink-800 p-6 cursor-default transition-colors duration-300"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink-700 text-xl text-violet-400">
                  {b.icon}
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-white">{b.title}</h3>
                  <p className="mt-2 font-body text-sm text-muted">{b.description}</p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { revealUp, staggerGroup } from "@/lib/motion";

const NODES = [
  { label: "Design", angle: 0 },
  { label: "Local", angle: 72 },
  { label: "Builders", angle: 144 },
  { label: "Care", angle: 216 },
  { label: "Culture", angle: 288 },
];

export function HeroSection() {
  return (
    <section className="relative min-h-[820px] flex items-center pt-12 pb-24 overflow-hidden">
      {/* Glow ambient behind visual only */}
      <div 
        aria-hidden 
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-700/20 blur-[120px] rounded-full" 
      />

      <div className="mx-auto w-full max-w-[1280px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Content */}
          <motion.div 
            variants={staggerGroup}
            initial="hidden"
            animate="show"
            className="lg:col-span-7 flex flex-col items-start text-left z-10"
          >
            {/* Eyebrow */}
            <motion.div variants={revealUp} className="inline-flex items-center gap-2 mb-6">
              <span className="h-2 w-2 rounded-full bg-violet-400 animate-pulse" />
              <span className="font-mono text-[11px] font-semibold tracking-[0.12em] uppercase text-violet-400">
                A NEW HOME FOR COLLECTIVE ENERGY
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1 
              variants={revealUp}
              className="font-display text-[48px] sm:text-[64px] lg:text-[88px] font-semibold tracking-[-0.03em] leading-[0.95] text-white"
            >
              Find your <span className="bg-gradient-to-r from-violet-400 via-violet-500 to-pink bg-clip-text text-transparent">people</span>.<br />
              Build what matters.
            </motion.h1>

            {/* Description */}
            <motion.p 
              variants={revealUp}
              className="mt-8 max-w-[520px] font-body text-[18px] sm:text-[20px] leading-[1.55] text-muted"
            >
              SUTU helps communities grow through one open place to back them, support that
              actually lands, and small steps taken consistently.
            </motion.p>

            {/* CTAs */}
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

            {/* Social proof */}
            <motion.div variants={revealUp} className="mt-12 flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-10 w-10 rounded-full border-2 border-ink-950 bg-ink-800 flex items-center justify-center font-mono text-xs text-lilac">
                    U{i}
                  </div>
                ))}
              </div>
              <span className="font-body text-sm text-muted">
                <strong className="font-semibold text-white">12,000+</strong> people already showing up
              </span>
            </motion.div>
          </motion.div>

          {/* Right: Orbit Visual */}
          <motion.div 
            variants={revealUp}
            initial="hidden"
            animate="show"
            className="lg:col-span-5 relative flex items-center justify-center"
          >
            <div className="relative w-full max-w-[480px] aspect-square rounded-[32px] border border-white/11 bg-ink-800/40 p-8 backdrop-blur-md overflow-hidden flex items-center justify-center">
              {/* Subtle Grid overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(#24202E_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

              {/* Central Core */}
              <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full border border-violet-400/30 bg-ink-950 shadow-glow-violet">
                <span className="font-display text-2xl font-bold bg-gradient-to-r from-violet-400 to-pink bg-clip-text text-transparent">
                  SUTU
                </span>
              </div>

              {/* Elliptical Path */}
              <div className="absolute inset-12 rounded-full border border-white/5" />

              {/* Orbiting Nodes */}
              <motion.div 
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
              >
                {NODES.map((node, i) => {
                  const rad = (node.angle * Math.PI) / 180;
                  const x = Math.cos(rad) * 140;
                  const y = Math.sin(rad) * 140;

                  return (
                    <motion.div
                      key={node.label}
                      className="absolute top-1/2 left-1/2 -ml-6 -mt-6 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-ink-900 shadow-lg text-xs font-semibold text-white"
                      style={{
                        transform: `translate(${x}px, ${y}px)`,
                      }}
                    >
                      {node.label[0]}
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

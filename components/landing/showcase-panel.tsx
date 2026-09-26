"use client";

import { motion } from "framer-motion";
import { ArrowRight, MessageSquare, Calendar, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { revealUp, staggerGroup } from "@/lib/motion";

export function ShowcasePanel() {
  return (
    <section className="py-20">
      <div className="relative overflow-hidden rounded-[32px] border border-white/11 bg-ink-900 px-8 py-16 sm:px-16 sm:py-20">
        
        {/* Radial subtle grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#24202E_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left: Content */}
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
              A calmer way to connect.
            </motion.h2>
            <motion.p 
              variants={revealUp}
              className="mt-6 font-body text-base sm:text-lg leading-relaxed text-muted"
            >
              An interaction space built around the substance of support and community, free from
              noisy algorithms and metrics that squeeze the life out of it.
            </motion.p>
            <motion.div variants={revealUp} className="mt-8">
              <Button variant="ghost" className="p-0 text-[15px] font-semibold text-violet-400 hover:text-violet-300 hover:bg-transparent">
                Learn about the SUTU ritual
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Right: UI Mockup Preview */}
          <motion.div 
            variants={revealUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="lg:col-span-7 flex flex-col gap-4"
          >
            {/* Main Community Card Mockup */}
            <div className="relative rounded-2xl border border-white/11 bg-ink-800/80 p-6 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <h3 className="font-display text-lg font-semibold text-white">Design & Culture Guild</h3>
                  <p className="font-body text-xs text-muted">Weekly creative discourse</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono text-xs text-emerald-400">12 people here now</span>
                </div>
              </div>

              {/* Discussion Prompt */}
              <div className="mt-4 rounded-xl bg-ink-950/60 p-4 border border-white/5">
                <p className="font-body text-sm text-white/90">
                  &quot;Bagaimana pendekatan minimalis mengubah caramu melihat dampak produk digital tahun ini?&quot;
                </p>
              </div>

              {/* Sub Floating Cards Layout */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-center gap-3 rounded-xl bg-white/[0.02] border border-white/5 p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-mono text-[11px] font-semibold text-white">New thread</p>
                    <p className="font-body text-[10px] text-muted">2 mins ago</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-white/[0.02] border border-white/5 p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-mono text-[11px] font-semibold text-white">Gathering</p>
                    <p className="font-body text-[10px] text-muted">Tomorrow, 8 PM</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-white/[0.02] border border-white/5 p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                    <BarChart2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-mono text-[11px] font-semibold text-white">Progress</p>
                    <p className="font-body text-[10px] text-muted">74% of goal</p>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

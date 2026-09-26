"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { revealUp } from "@/lib/motion";

export function DeviceMockup() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.5], [4, 0]);
  const rotateY = useTransform(scrollYProgress, [0, 0.5], [-5, 0]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      {/* Large blurred purple shadow */}
      <div 
        aria-hidden 
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] rounded-full bg-violet-700/15 blur-[100px]" 
      />

      <motion.div 
        variants={revealUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mx-auto max-w-[1280px] px-6 perspective-[1200px]"
      >
        <motion.div 
          style={{ rotateX, rotateY }}
          className="relative mx-auto max-w-[900px] rounded-card border border-white/10 bg-ink-950 shadow-glow-violet-lg overflow-hidden"
        >
          {/* Screen Bezel Top */}
          <div className="flex items-center gap-2 border-b border-white/5 bg-ink-900 px-4 py-3">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-white/10" />
              <div className="h-3 w-3 rounded-full bg-white/10" />
              <div className="h-3 w-3 rounded-full bg-white/10" />
            </div>
            <div className="mx-auto rounded-full bg-white/5 px-4 py-1 font-mono text-[10px] text-faint">
              sutu.community/dashboard
            </div>
          </div>

          {/* Screen Content - Dashboard-like placeholder */}
          <div className="p-8 bg-ink-950 min-h-[400px]">
            <div className="grid grid-cols-3 gap-4">
              {/* Sidebar */}
              <div className="col-span-1 space-y-3">
                <div className="rounded-xl bg-ink-800 p-4 border border-white/5">
                  <div className="font-display text-sm font-semibold text-white">Communities</div>
                  {["Design Guild", "Local Builders", "Care Circle"].map((c) => (
                    <div key={c} className="mt-3 flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-violet-500/20" />
                      <span className="font-body text-xs text-muted">{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Area */}
              <div className="col-span-2 space-y-3">
                <div className="rounded-xl bg-ink-800 p-6 border border-white/5">
                  <div className="font-display text-sm font-semibold text-white">Activity Feed</div>
                  <div className="mt-4 space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex gap-3">
                        <div className="h-8 w-8 rounded-full bg-violet-500/15 shrink-0" />
                        <div className="flex-1">
                          <div className="h-3 w-3/4 rounded bg-white/5" />
                          <div className="mt-2 h-2.5 w-1/2 rounded bg-white/3" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function LandingCtaSection() {
  return (
    <section className="relative overflow-hidden rounded-[40px] border border-white/10 bg-void p-12 text-center sm:p-20">
      {/* Soft ambient glow backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-violet/10 blur-3xl" />
      
      <div className="relative z-10 mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Sparkles className="mx-auto h-8 w-8 text-cyan mb-6" />
          <h2 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            Siap untuk <span className="text-iridescent">support</span> komunitasmu?
          </h2>
          <p className="mt-6 font-body text-lg text-muted">
            Bergabunglah dengan ratusan builder dan kontributor lainnya. Mulai perjalananmu di SUTU hari ini.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="h-14 rounded-full bg-iridescent px-10 text-base font-bold text-white shadow-glow-iridescent transition-transform hover:scale-105">
              Hubungkan Wallet
            </Button>
            <Button variant="outline" size="lg" className="h-14 rounded-full border-white/10 bg-white/5 px-10 text-base font-bold text-ink backdrop-blur-sm">
              Jelajah Komunitas
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

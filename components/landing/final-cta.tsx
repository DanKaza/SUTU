"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { revealUp, staggerGroup } from "@/lib/motion";

export function FinalCTA() {
  return (
    <section className="py-24 text-center">
      <motion.div
        variants={staggerGroup}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mx-auto max-w-3xl"
      >
        <motion.h2 
          variants={revealUp}
          className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] text-white"
        >
          Your people are already out there.
        </motion.h2>
        <motion.p 
          variants={revealUp}
          className="mt-6 font-body text-lg sm:text-xl text-muted"
        >
          SUTU is where they already are. Back the first one today.
        </motion.p>
        <motion.div variants={revealUp} className="mt-10">
          <Link href="/discover">
            <Button 
              size="lg" 
              className="group h-16 px-10 text-[17px] font-semibold shadow-glow-violet transition-all duration-300 hover:scale-[1.03]"
            >
              Enter SUTU
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { revealUp, softSpring, staggerGroup, viewportOnce } from "@/lib/motion";

/**
 * The page's second lit thing: one statement and one filled button. The glow
 * lives here and nowhere else on the page, so the two screens that carry an
 * action do not both glow.
 */
export function FinalCTA() {
  return (
    <section className="text-center">
      <motion.div
        variants={staggerGroup}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mx-auto max-w-3xl"
      >
        <motion.h2
          variants={revealUp}
          className="font-display text-[32px] font-semibold leading-[1.05] text-white sm:text-[48px] lg:text-[64px]"
        >
          Someone is already building the thing you want to see exist.
        </motion.h2>
        <motion.p
          variants={revealUp}
          className="mt-6 font-body text-[18px] leading-[1.6] text-muted sm:text-[20px]"
        >
          SUTU is where they already are. Back the first one today.
        </motion.p>
        <motion.div
          variants={revealUp}
          className="mt-10 inline-block"
          whileHover={{ y: -2 }}
          transition={softSpring}
        >
          <Link
            href="/discover"
            className="inline-flex min-h-11 items-center justify-center rounded-full"
          >
            <Button
              size="lg"
              className="group h-14 px-8 text-[16px] font-semibold shadow-glow-violet transition-colors duration-200 ease-quintic-out"
            >
              Enter SUTU
              <ArrowRight
                className="ml-2 h-5 w-5 transition-transform duration-300 ease-quintic-out group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

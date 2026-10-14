"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/layout/brand-logo";
import { Container } from "@/components/layout/container";
import { ParallaxLayer } from "@/components/landing/parallax";
import { SupportFlowPreview } from "@/components/landing/support-flow-preview";
import { usePointerTilt } from "@/lib/use-pointer-tilt";
import { revealUp, softSpring, staggerGroup } from "@/lib/motion";

/**
 * The fold: the name leads, the mark answers it, then the lit band below.
 *
 * The headline is the brand name itself, so the mark beside it is not a repeat
 * of the word — it is the thing the word stands for, and it carries the fold's
 * light. The mark replies to the pointer: it tilts, and the light behind it
 * tracks the cursor. Nothing on this screen moves on its own, so the page is
 * alive when it is being read and still when it is not.
 */
export function HeroSection() {
  const mark = usePointerTilt({ maxTilt: 7, drift: 26, stiffness: 120, damping: 18 });

  return (
    <section className="relative">
      <Container className="pb-10 pt-10">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
          <motion.div
            variants={staggerGroup}
            initial="hidden"
            animate="show"
            className="max-w-[620px]"
          >
            <motion.h1
              variants={revealUp}
              className="font-display text-[64px] font-semibold leading-[0.95] tracking-[-0.03em] text-white sm:text-[88px] xl:text-[104px]"
            >
              SUTU
            </motion.h1>

            <motion.p
              variants={revealUp}
              className="mt-8 max-w-[520px] font-body text-[18px] leading-[1.55] text-muted"
            >
              SUTU helps communities grow through one open place to back them, support that
              actually lands, and small steps taken consistently.
            </motion.p>

            <motion.div
              variants={revealUp}
              className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4"
            >
              <Link href="/discover">
                <Button
                  size="lg"
                  className="group h-14 overflow-hidden px-8 text-[16px] font-semibold transition-colors duration-200 ease-quintic-out"
                >
                  Explore communities
                  <ArrowRight
                    className="ml-2 h-5 w-5 transition-transform duration-300 ease-quintic-out group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Button>
              </Link>
              <Link
                href="/about"
                className="flex min-h-11 items-center font-body text-[16px] font-medium text-muted transition-colors duration-200 ease-quintic-out hover:text-white"
              >
                How it works
              </Link>
            </motion.div>

            {/* One fact line, replacing the three tick-marked proofs that repeated
                the showcase list three sections later. */}
            <motion.p variants={revealUp} className="mt-12 font-mono text-[12px] text-faint">
              No account needed · On-chain record · From 3 MON
            </motion.p>
          </motion.div>

          {/* The mark. It drifts against the scroll so the type and the object sit
              on different planes, then tilts toward the pointer. The light is the
              mark's own — tight and hugging the silhouette, not a page-wide wash,
              so the fold still leads with one object. */}
          <ParallaxLayer distance={22} className="justify-self-center lg:justify-self-end">
            <motion.div
              {...mark.handlers}
              style={mark.style}
              initial="rest"
              animate="rest"
              whileHover="hover"
              className="relative w-[240px] sm:w-[300px] lg:w-[380px]"
            >
              <motion.div
                aria-hidden="true"
                style={mark.driftStyle}
                variants={{
                  rest: { opacity: 0.55, scale: 1 },
                  hover: { opacity: 0.95, scale: 1.06 },
                }}
                transition={softSpring}
                className="pointer-events-none absolute inset-[-14%] rounded-full bg-[radial-gradient(closest-side,rgba(139,92,246,0.45),rgba(124,58,237,0.16)_60%,transparent_80%)] blur-2xl"
              />
              <BrandLogo priority className="h-auto w-full" />
            </motion.div>
          </ParallaxLayer>
        </div>
      </Container>

      {/* The band. Full-bleed so the light runs to both edges of the frame, with
          the page's one object sitting inside it.

          Height comes from its content, not from a viewport unit. This used to
          be `clamp(340px, 37vh, 420px)`, which only made sense inside the
          1920x1080 artboard — 37% of 1080. With the harness gone, a vh-derived
          band drifts with the window and leaves the object floating in a stripe
          of arbitrary height. */}
      <div className="relative w-full overflow-hidden py-20 sm:py-24">
        <ParallaxLayer distance={28} className="absolute inset-0">
          {/* The mass itself: one soft violet ellipse. Its bright plateau is
              wider than the object, so the lit core still reads on both sides
              of the card instead of hiding behind it.

              It breathes. This is the page's one lit mass, so it is the only
              thing on the screen allowed to move on its own — a still light
              made the whole page read as a screenshot. One animated layer, not
              a stack: the section's rule is one lit thing, and a second glow
              competing with it breaks the composition rather than enriching it. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 animate-sutu-breathe bg-[radial-gradient(78%_78%_at_50%_52%,rgba(167,139,250,0.66),rgba(167,139,250,0.50)_30%,rgba(139,92,246,0.38)_50%,rgba(124,58,237,0.14)_72%,transparent_92%)]"
          />
        </ParallaxLayer>

        {/* Soft cuts at both edges, so the band meets the black around it instead
            of ending on a seam. The top one is short — a long fade there eats the
            light. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-ink-950 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[88px] bg-gradient-to-t from-ink-950 to-transparent"
        />

        <div className="relative mx-auto flex h-full w-full max-w-[1200px] items-center justify-center px-6 sm:px-12">
          <SupportFlowPreview />
        </div>
      </div>

      {/* Gutter, so the next section starts on black rather than on the light.
          Sized in steps rather than one fixed value: at a short window the old
          112px pushed the statement out of sight entirely. */}
      <div aria-hidden="true" className="h-20 sm:h-28" />
    </section>
  );
}

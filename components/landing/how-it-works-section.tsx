"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/layout/container";
import { revealUp, staggerGroupImmediate, viewportOnce } from "@/lib/motion";

const STEPS = [
  {
    id: "01",
    title: "Find a community",
    description:
      "Search by name, cause or category. Every profile shows what the community is actually building.",
  },
  {
    id: "02",
    title: "Back it in one flow",
    description:
      "Pick an amount and send it. No account juggling, no hunting for a donation address.",
  },
  {
    id: "03",
    title: "Keep showing up",
    description:
      "Support compounds. Track every contribution and back the same community again.",
  },
];

/**
 * The process, as a sequence rather than a mosaic.
 *
 * It used to be a `rounded-section` (32px) band holding three `rounded-card`
 * (20px) boxes on a `sm:grid-cols-3` row, which failed three ways at once. 32px
 * is a fourth radius the design system does not define (DESIGN §6 allows 8, 20
 * and 999 only). Three identical boxes inside a fourth box is nesting, not
 * hierarchy. And `BenefitsSection` two sections up already owns "heading above a
 * three-column grid of icon + title + body", so the page said the same thing
 * twice in the same composition.
 *
 * What the content actually is: three steps in order, one leading to the next.
 * So the order is now carried by the layout — hairline-topped rows you read
 * downward, which is the row language the `/discover` rail already uses, rather
 * than by a numeral that merely claims it.
 *
 * The heading takes a narrow left column and the steps the wide right one. The
 * page has no asymmetric split yet, and a side-by-side keeps the promise in
 * view while the steps are scanned.
 *
 * Step 02 is the action the product exists for, so it leads: its numeral takes
 * the accent, its title steps up the scale, and its row carries the band's one
 * raised surface. The wash is full-width and borderless on purpose — a raised
 * row and a raised card are different objects, and the card is what this
 * section was trying to escape. The accent is one numeral, not a card, a border
 * and a glow; DESIGN §2 keeps the accent on the one thing per screen that
 * matters, and here that is the step where support happens.
 */

export function HowItWorksSection() {
  return (
    <section className="border-y border-white/11 bg-ink-900 py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] lg:gap-20">
          <motion.h2
            variants={revealUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="font-display text-[24px] font-semibold leading-[1.15] text-white sm:text-[32px]"
          >
            Three steps, no account required
          </motion.h2>

          <motion.ol
            variants={staggerGroupImmediate}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
          >
            {STEPS.map((step, index) => {
              // Step 02 is the action itself, so it takes the band's one raised
              // surface; 01 and 03 sit on the band.
              const isAction = index === 1;
              return (
                <motion.li
                  key={step.id}
                  variants={revealUp}
                  className={`group border-t border-white/11 py-8 transition-colors duration-200 ease-quintic-out last:border-b hover:border-white/25 ${
                    isAction ? "bg-white/[0.03]" : ""
                  }`}
                >
                  <div className="flex gap-5 sm:gap-8">
                    {/* Decorative: the list is ordered, so the numeral repeats
                        what <ol> already conveys and adds nothing for a reader
                        using a screen reader. */}
                    <span
                      aria-hidden="true"
                      className={`w-6 shrink-0 pt-1 font-mono text-[14px] leading-none ${
                        isAction ? "text-violet-400" : "text-faint"
                      }`}
                    >
                      {step.id}
                    </span>

                    <div className="min-w-0">
                      <h3
                        className={`font-display font-semibold text-white ${
                          isAction ? "text-[24px]" : "text-[18px]"
                        }`}
                      >
                        {step.title}
                      </h3>
                      <p className="mt-2 max-w-[560px] font-body text-[16px] leading-[1.6] text-muted">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </motion.ol>
        </div>
      </Container>
    </section>
  );
}

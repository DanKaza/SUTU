"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { Container } from "@/components/layout/container";
import { BrandLogo } from "@/components/layout/brand-logo";
import { usePointerTilt } from "@/lib/use-pointer-tilt";
import { softSpring } from "@/lib/motion";

const EXPLORE = [
  { href: "/discover", label: "Communities" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const SUPPORT = [
  { href: "/my-supports", label: "My Supports" },
  { href: "/profile", label: "Profile" },
  { href: "/basket", label: "Basket" },
];

/**
 * The one link treatment in the footer: the label settles to white while a
 * hairline wipes in beneath it. The rule is neutral rather than accent — the
 * accent is spent on the primary CTA and the affirmation, and six underlined
 * links would spend it on hover crumbs.
 */
function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group -mx-2 inline-flex min-h-11 items-center px-2 font-body text-sm text-muted transition-colors duration-200 ease-quintic-out hover:text-white"
    >
      <span className="relative">
        {label}
        <span
          aria-hidden="true"
          className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-white/40 transition-transform duration-300 ease-quintic-out group-hover:scale-x-100 group-focus-visible:scale-x-100"
        />
      </span>
    </Link>
  );
}

export function Footer() {
  const reducedMotion = useReducedMotion();
  const mark = usePointerTilt({ maxTilt: 5, drift: 12, stiffness: 200, damping: 24 });

  const toTop = () => {
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  };

  return (
    <footer className="relative z-10 border-t border-white/11 bg-ink-900 py-16">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-20">
          <div className="max-w-sm">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center"
              aria-label="SUTU home"
            >
              <motion.span
                {...mark.handlers}
                style={mark.style}
                initial="rest"
                animate="rest"
                whileHover="hover"
                className="relative inline-flex"
              >
                <motion.span
                  aria-hidden="true"
                  style={mark.driftStyle}
                  variants={{
                    rest: { opacity: 0.4, scale: 1 },
                    hover: { opacity: 0.85, scale: 1.08 },
                  }}
                  transition={softSpring}
                  className="pointer-events-none absolute inset-[-30%] rounded-full bg-[radial-gradient(closest-side,rgba(139,92,246,0.5),transparent_75%)] blur-xl"
                />
                <BrandLogo className="h-11 w-auto" />
              </motion.span>
            </Link>

            <p className="mt-5 font-body text-[16px] leading-[1.6] text-muted">
              One place to back the Web3 communities you care about.
            </p>
          </div>

          <div className="flex gap-14">
            <nav aria-label="Footer">
              <h2 className="font-body text-sm font-semibold text-white">Explore</h2>
              <ul className="mt-4 space-y-3">
                {EXPLORE.map((p) => (
                  <li key={p.href}>
                    <FooterLink href={p.href} label={p.label} />
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Your support">
              <h2 className="font-body text-sm font-semibold text-white">Your support</h2>
              <ul className="mt-4 space-y-3">
                {SUPPORT.map((p) => (
                  <li key={p.href}>
                    <FooterLink href={p.href} label={p.label} />
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t border-white/11 pt-8">
          <p className="font-body text-xs text-faint">© 2026 SUTU</p>
          <button
            type="button"
            onClick={toTop}
            className="group flex min-h-11 items-center gap-2 rounded-full border border-white/11 px-4 font-body text-sm text-muted transition-colors duration-200 ease-quintic-out hover:border-white/25 hover:text-white"
          >
            Back to top
            <ArrowUp
              className="h-4 w-4 transition-transform duration-300 ease-quintic-out group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </button>
        </div>
      </Container>
    </footer>
  );
}

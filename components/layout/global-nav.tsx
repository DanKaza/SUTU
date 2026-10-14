"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ShoppingBasket } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ConnectButton } from "@/components/layout/connect-button";
import { Container } from "@/components/layout/container";
import { BrandLogo } from "@/components/layout/brand-logo";
import { orientationTransition } from "@/lib/motion";
import { useAppState } from "@/lib/app-state";

const LANDING_LINKS = [
  { href: "/discover", label: "Communities" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const APP_LINKS = [
  { href: "/", label: "Home" },
  { href: "/discover", label: "Discover" },
  { href: "/my-supports", label: "My Supports" },
  { href: "/profile", label: "Profile" },
];

const APP_ROUTE_PREFIXES = ["/discover", "/communities", "/basket", "/my-supports", "/profile"];

import { useScroll, useSpring, useTransform } from "framer-motion";

export function GlobalNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const { basket } = useAppState();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isApp = APP_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const links = isApp ? APP_LINKS : LANDING_LINKS;

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 h-[76px] transition-all duration-300",
        scrolled ? "bg-ink-950/78 backdrop-blur-[18px]" : "bg-transparent"
      )}
    >
      <Container className="flex h-full items-center justify-between">
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="flex min-h-11 items-center"
        >
          <BrandLogo priority />
        </Link>

        {(!isApp || isApp) && (
          <nav className="hidden items-center gap-8 lg:flex">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    // px-2 + min-h-11 gives every destination a 44px-tall target
                    // without changing how far apart the labels read.
                    "flex min-h-11 items-center rounded-full px-2 font-body text-base transition-colors duration-300 ease-quintic-out",
                    active ? "text-white" : "text-muted hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        )}

        <div className="flex items-center gap-6">
          {!isApp ? (
            <>
              <Link
                href="/discover"
                className="hidden min-h-11 items-center font-body text-base font-medium text-muted transition-colors duration-300 ease-quintic-out hover:text-white sm:flex"
              >
                Find a community
              </Link>
              <Button size="lg">
                Start supporting
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/basket"
                aria-label={`Support basket, ${basket.length} item${basket.length === 1 ? "" : "s"}`}
                className="relative flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors duration-200 ease-quintic-out hover:bg-white/10"
              >
                <ShoppingBasket className="h-5 w-5" />
                {basket.length > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-violet-500 text-[10px] font-bold text-ink-950">
                    {basket.length}
                  </span>
                )}
              </Link>
              <ConnectButton />
            </>
          )}
          
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      <motion.div 
        className="motion-live absolute bottom-0 left-0 h-[2px] w-full origin-left bg-violet-500"
        style={{ scaleX }}
      />


      <AnimatePresence initial={false}>
        {mobileOpen && (
          <motion.div
            key="mobile-nav"
            id="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={orientationTransition}
            className="overflow-hidden border-t border-white/10 bg-ink-950 md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4 sm:px-6">
              <div className="pb-2 sm:hidden">
                <ConnectButton />
              </div>
              {links.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "rounded-xl px-3 py-2.5 font-body text-sm transition-colors duration-200 ease-quintic-out",
                      active
                        ? "bg-white/[0.06] font-medium text-ink"
                        : "text-muted hover:bg-white/5 hover:text-ink"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
              {isApp ? (
                <Link
                  href="/basket"
                  onClick={() => setMobileOpen(false)}
                  className="mt-1 flex items-center justify-between rounded-xl px-3 py-2.5 font-body text-sm text-muted hover:bg-white/5 hover:text-ink"
                >
                  Basket
                  {basket.length > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-500 text-[12px] font-bold text-ink-950">
                      {basket.length}
                    </span>
                  )}
                </Link>
              ) : (
                <Link href="/discover" onClick={() => setMobileOpen(false)} className="mt-2">
                  <Button size="lg" className="w-full">Start supporting</Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

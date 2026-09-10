"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ShoppingBasket } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { ConnectButton } from "@/components/layout/connect-button";
import { orientationTransition } from "@/lib/motion";
import { useAppState } from "@/lib/app-state";

const LANDING_LINKS = [
  { href: "/", label: "Home" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
];

const APP_LINKS = [
  { href: "/discover", label: "Discover" },
  { href: "/my-supports", label: "My Supports" },
  { href: "/profile", label: "Profile" },
];

const APP_ROUTE_PREFIXES = ["/discover", "/communities", "/basket", "/my-supports", "/profile"];

export function GlobalNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { basket } = useAppState();

  const isApp = APP_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const links = isApp ? APP_LINKS : LANDING_LINKS;

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-graphite/15 bg-warm-white/90 backdrop-blur transition-colors duration-300 ease-quintic-out dark:border-white/10 dark:bg-dark-base/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="font-display text-lg font-bold tracking-tight text-charcoal dark:text-warm-white"
        >
          SUTU
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative pb-1 font-body text-sm transition-colors duration-200 ease-quintic-out",
                  active
                    ? "font-medium text-charcoal dark:text-warm-white"
                    : "text-graphite hover:text-charcoal dark:hover:text-warm-white"
                )}
              >
                {link.label}
                {active && (
                  <motion.span
                    layoutId="nav-active-indicator"
                    transition={orientationTransition}
                    className="absolute inset-x-0 -bottom-0 h-[2px] rounded-full bg-charcoal dark:bg-warm-white"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <ConnectButton />
          {isApp ? (
            <Link href="/basket" className="relative flex h-9 w-9 items-center justify-center rounded-full text-charcoal transition-colors duration-200 ease-quintic-out hover:bg-aluminum dark:text-warm-white dark:hover:bg-white/10">
              <ShoppingBasket className="h-5 w-5" />
              {basket.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-cobalt text-[10px] font-bold text-warm-white">
                  {basket.length}
                </span>
              )}
            </Link>
          ) : (
            <Link href="/discover" className="hidden sm:block">
              <Button size="sm">Discover Communities</Button>
            </Link>
          )}
          <ThemeToggle />

          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-charcoal transition-colors duration-200 ease-quintic-out hover:bg-aluminum dark:text-warm-white dark:hover:bg-white/10 md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {mobileOpen && (
          <motion.div
            key="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={orientationTransition}
            className="overflow-hidden border-t border-graphite/15 bg-warm-white dark:border-white/10 dark:bg-dark-base md:hidden"
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
                        ? "bg-aluminum font-medium text-charcoal dark:bg-white/10 dark:text-warm-white"
                        : "text-graphite hover:bg-aluminum/60 hover:text-charcoal dark:hover:bg-white/5 dark:hover:text-warm-white"
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
                  className="mt-1 flex items-center justify-between rounded-xl px-3 py-2.5 font-body text-sm text-graphite hover:bg-aluminum/60 hover:text-charcoal dark:hover:bg-white/5 dark:hover:text-warm-white"
                >
                  Basket
                  {basket.length > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cobalt text-[11px] font-bold text-warm-white">
                      {basket.length}
                    </span>
                  )}
                </Link>
              ) : (
                <Link href="/discover" onClick={() => setMobileOpen(false)} className="mt-2">
                  <Button className="w-full">Discover Communities</Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

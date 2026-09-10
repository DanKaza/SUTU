import Link from "next/link";
import { Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-graphite/15 bg-aluminum/60 transition-colors duration-300 ease-quintic-out dark:border-white/10 dark:bg-white/5">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-6 py-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2 font-body text-sm text-graphite dark:text-white/60">
          <Globe className="h-4 w-4" />
          Communities are independent spaces run by their members.
        </div>
        <div className="flex items-center gap-5 font-body text-sm font-medium">
          <Link
            href="/about"
            className="text-charcoal hover:text-cobalt transition-colors duration-200 ease-quintic-out dark:text-warm-white dark:hover:text-cobalt"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-charcoal hover:text-cobalt transition-colors duration-200 ease-quintic-out dark:text-warm-white dark:hover:text-cobalt"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}

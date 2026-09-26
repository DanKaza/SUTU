import Link from "next/link";
import { Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/11 bg-ink-900 px-6 py-16">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <Link href="/" className="font-display text-2xl font-bold tracking-[-0.04em] text-white">
              <span className="bg-gradient-to-r from-violet-400 to-pink bg-clip-text text-transparent">SUTU</span>
            </Link>
            <p className="mt-4 font-body text-sm text-muted">
              Make room for each other.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 lg:col-span-2">
            <div>
              <h4 className="font-body text-sm font-semibold text-white">Platform</h4>
              <ul className="mt-4 space-y-3">
                <li><Link href="/discover" className="font-body text-sm text-muted hover:text-white transition-colors">Communities</Link></li>
                <li><Link href="/stories" className="font-body text-sm text-muted hover:text-white transition-colors">Stories</Link></li>
                <li><Link href="/about" className="font-body text-sm text-muted hover:text-white transition-colors">About</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-body text-sm font-semibold text-white">Connect</h4>
              <ul className="mt-4 space-y-3">
                <li><Link href="#" className="font-body text-sm text-muted hover:text-white transition-colors">Instagram</Link></li>
                <li><Link href="#" className="font-body text-sm text-muted hover:text-white transition-colors">X</Link></li>
                <li><Link href="#" className="font-body text-sm text-muted hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-white/11 pt-8 sm:flex-row">
          <p className="font-body text-xs text-faint">
            © 2026 SUTU. Built for people who show up.
          </p>
          <div className="flex items-center gap-5">
            <Link href="#" className="text-muted transition-colors hover:text-white">
              <Instagram className="h-4 w-4" />
            </Link>
            <Link href="#" className="text-muted transition-colors hover:text-white">
              <Twitter className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

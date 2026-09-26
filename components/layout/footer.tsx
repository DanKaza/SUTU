import Link from "next/link";

const PAGES = [
  { href: "/discover", label: "Communities" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/11 bg-ink-900 px-6 py-16">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Link href="/" className="font-display text-2xl font-bold tracking-[-0.04em] text-white">
              SUTU
            </Link>
            <p className="mt-4 max-w-sm font-body text-sm text-muted">
              One place to back the Web3 communities you care about.
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="font-body text-sm font-semibold text-white">Explore</h2>
            <ul className="mt-4 space-y-3">
              {PAGES.map((p) => (
                <li key={p.href}>
                  <Link href={p.href} className="font-body text-sm text-muted transition-colors hover:text-white">
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-16 border-t border-white/11 pt-8">
          <p className="font-body text-xs text-faint">
            © 2026 SUTU
          </p>
        </div>
      </div>
    </footer>
  );
}

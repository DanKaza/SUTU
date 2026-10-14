import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * The brand mark on its own. The wordmark was removed from the nav and footer,
 * so this image is the only place the brand is named — which is why `alt` stays
 * "SUTU" rather than being left empty. Without it a screen reader would
 * announce an unnamed link to home on every page.
 *
 * Source: `public/brand/sutu-mark.png` — the supplied artwork with its fully
 * transparent margin trimmed off. The original is 2000x2000 with the mark
 * occupying only 1512x1297 of it, so used as-is the logo rendered at ~65% of
 * whatever box it was given, with a bottom-heavy offset. `sutu_logo.png` is the
 * untouched original; re-run the trim if the artwork is replaced.
 *
 * The trimmed mark is 1514x1298 — wider than tall — so callers set a height and
 * let the width follow. A square `h-9 w-9` box would letterbox it.
 */
export function BrandLogo({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/brand/sutu-mark.png"
      alt="SUTU"
      width={1514}
      height={1298}
      priority={priority}
      className={cn("h-9 w-auto object-contain", className)}
    />
  );
}

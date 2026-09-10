const PALETTE = ["#5E5E5E", "#2563EB", "#1A1A1A", "#9CA3AF"];

export function AvatarStack({
  initials,
  extraCount,
}: {
  initials: string[];
  extraCount?: number;
}) {
  return (
    <div className="flex items-center">
      {initials.map((letter, i) => (
        <div
          key={letter + i}
          className="-ml-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-warm-white text-xs font-medium text-warm-white first:ml-0 dark:border-charcoal"
          style={{ backgroundColor: PALETTE[i % PALETTE.length] }}
        >
          {letter}
        </div>
      ))}
      {extraCount ? (
        <div className="-ml-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-warm-white bg-aluminum text-[11px] font-medium text-graphite dark:border-charcoal dark:bg-white/10 dark:text-white/70">
          +{extraCount >= 1000 ? `${Math.round(extraCount / 1000)}k` : extraCount}
        </div>
      ) : null}
    </div>
  );
}

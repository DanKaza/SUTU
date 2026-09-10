"use client";

import { useCommunities } from "@/lib/community-data";
import { communities as mockCommunities } from "@/lib/mock-data";

const ACCENTS = ["#FF7A59", "#C6F135", "#F72585", "#2563EB"];

export function CommunityTicker() {
  const { communities } = useCommunities();
  const source = communities.length > 0 ? communities : mockCommunities.map((c) => ({ id: c.id, name: c.name, categoryLabel: c.category }));
  const items = [...source, ...source];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-graphite/15 bg-warm-white py-4 dark:border-white/10 dark:bg-charcoal">
      <div className="ticker-track flex w-max items-center gap-8">
        {items.map((community, i) => (
          <span
            key={`${community.id}-${i}`}
            className="flex items-center gap-2 whitespace-nowrap font-body text-sm font-medium text-charcoal dark:text-warm-white"
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: ACCENTS[i % ACCENTS.length] }}
            />
            {community.name}
            <span className="text-graphite dark:text-white/40">· {community.categoryLabel}</span>
          </span>
        ))}
      </div>

      <style jsx>{`
        .ticker-track {
          animation: ticker-scroll 22s linear infinite;
        }
        @keyframes ticker-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}

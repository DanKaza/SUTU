"use client";

import Link from "next/link";
import { communities as mockCommunities } from "@/lib/mock-data";

const ACCENTS = ["#7C5CFF", "#22D3EE", "#F472B6", "#A855F7", "#10B981"];

export function CommunityTicker() {
  // Triple the items for smoother infinite loop
  const items = [...mockCommunities, ...mockCommunities, ...mockCommunities];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] py-4 backdrop-blur-md">
      <div className="ticker-container">
        <div className="ticker-track flex w-max items-center gap-6 px-6">
          {items.map((community, i) => {
            const accent = ACCENTS[i % ACCENTS.length];
            return (
              <Link
                key={`${community.id}-${i}`}
                href={`/communities/${community.id}`}
                className="group flex items-center gap-3 rounded-full border border-white/5 bg-white/[0.03] px-4 py-2 transition-all duration-300 hover:border-white/20 hover:bg-white/10"
              >
                <div 
                  className="h-1.5 w-1.5 rounded-full shadow-lg transition-transform group-hover:scale-150"
                  style={{ backgroundColor: accent, boxShadow: `0 0 8px ${accent}` }}
                />
                <span className="whitespace-nowrap font-body text-xs font-semibold text-muted group-hover:text-ink">
                  {community.name}
                </span>
                <span className="rounded-md bg-white/5 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted/50 group-hover:text-muted/80">
                  {community.category}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .ticker-container {
          position: relative;
          width: 100%;
          overflow: hidden;
          mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
        }

        .ticker-track {
          animation: scroll 40s linear infinite;
        }

        .ticker-track:hover {
          animation-play-state: paused;
        }

        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
      `}</style>
    </div>
  );
}

"use client";

/**
 * Community data layer.
 *
 * Strategy (per user decision): the SUTU backend is the primary source;
 * the bundled mock data is a fallback when the backend is unreachable.
 *
 * The API does not expose per-community supporter/total figures directly,
 * so totals are enriched from GET /stats (confirmed donations only).
 */

import { useEffect, useState } from "react";
import { fetchCommunities, fetchCommunityBySlug, fetchStats } from "@/lib/api/endpoints";
import { formatMon } from "@/lib/api/format";
import type { Community as ApiCommunity, CommunityProject } from "@/lib/api/types";
import { communities as mockCommunities, type Community as MockCommunity } from "@/lib/mock-data";

export type CommunityView = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  categoryLabel: string;
  logoInitial: string;
  /** Number of CONFIRMED donations from /stats (0 when unknown). */
  supporterCount: number;
  /** Total MON received, formatted for display. */
  totalSupported: string;
  /** Payout address from the backend (undefined on the mock fallback). */
  payoutAddress?: string;
  /** True when rendered from mock fallback data. */
  isFallback?: boolean;
};

const CATEGORY_LABELS: Record<string, string> = {
  music: "Music",
  game: "Gaming",
  charity: "Charity",
};

function logoInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || "?";
}

function apiToView(c: ApiCommunity, stats?: { count: number; totalMon: string }): CommunityView {
  return {
    id: c.slug,
    slug: c.slug,
    name: c.name,
    description: c.description,
    category: c.category ?? "charity",
    categoryLabel: CATEGORY_LABELS[c.category ?? ""] ?? "Community",
    logoInitial: logoInitial(c.name),
    supporterCount: stats?.count ?? 0,
    totalSupported: stats?.totalMon ?? "0",
    payoutAddress: c.payout_address,
  };
}

function mockToView(c: MockCommunity): CommunityView {
  return {
    id: c.id,
    slug: c.id,
    name: c.name,
    description: c.description,
    category: c.category,
    categoryLabel: c.category,
    logoInitial: c.logoInitial,
    supporterCount: c.supporterCount,
    totalSupported: c.totalSupported.toLocaleString(),
    isFallback: true,
  };
}

/** Fetch live communities; fall back to mock data on any failure. */
export function useCommunities() {
  const [communities, setCommunities] = useState<CommunityView[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [{ data: apiList }, { data: stats }] = await Promise.all([
          fetchCommunities(),
          fetchStats().catch(() => ({ data: { communities: [] } as never })),
        ]);

        const statsBySlug = new Map(
          (stats.communities ?? []).map((s) => [
            s.community_slug,
            { count: Number(s.total_donations), totalMon: formatMon(s.total_community_wei, 2) },
          ]),
        );

        const list = apiList
          .filter((c) => c.is_active)
          .map((c) => apiToView(c, statsBySlug.get(c.slug)));

        if (!cancelled && list.length > 0) {
          setCommunities(list);
          setIsFallback(false);
        } else if (!cancelled && list.length === 0) {
          setCommunities(mockCommunities.map(mockToView));
          setIsFallback(true);
        }
      } catch {
        if (!cancelled) {
          setCommunities(mockCommunities.map(mockToView));
          setIsFallback(true);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { communities, isLoading, isFallback };
}

/** Fetch one community by slug/id (live first, mock fallback). */
export function useCommunity(slug: string) {
  const [community, setCommunity] = useState<CommunityView | null>(null);
  const [projects, setProjects] = useState<CommunityProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { data } = await fetchCommunityBySlug(slug);
        if (cancelled) return;
        setCommunity(apiToView(data));
        setProjects(data.projects ?? []);
      } catch {
        if (cancelled) return;
        const mock = mockCommunities.find((c) => c.id === slug);
        if (mock) {
          setCommunity(mockToView(mock));
          setProjects([]);
        } else {
          setNotFound(true);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { community, projects, isLoading, notFound };
}

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
import { useQuery } from "@tanstack/react-query";
import { fetchCommunities, fetchCommunityBySlug, fetchStats } from "@/lib/api/endpoints";
import { formatMon } from "@/lib/api/format";
import type { Community as ApiCommunity, CommunityProject } from "@/lib/api/types";
import { communities as mockCommunities, type Community as MockCommunity } from "@/lib/mock-data";

export type CommunityView = {
  id: string;
  /**
   * The backend's UUID for this community. `id` above is the slug (that is what
   * routes use), so code that has to match a record referencing a community by
   * UUID — a donation, for instance — needs this one to look the name up.
   */
  apiId: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  categoryLabel: string;
  logoInitial: string;
  /** Number of CONFIRMED donations from /stats (0 when unknown). */
  supporterCount: number;
  /** Total MON received, as a plain numeric string. Format at the point of display. */
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
    apiId: c.id,
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
    apiId: c.id,
    slug: c.id,
    name: c.name,
    description: c.description,
    category: c.category,
    categoryLabel: c.category,
    logoInitial: c.logoInitial,
    supporterCount: c.supporterCount,
    totalSupported: String(c.totalSupported),
    isFallback: true,
  };
}

/**
 * Shared key: the hero preview and the showcase rail both read this, and
 * /discover does too. One request per stale window instead of one per caller.
 */
const COMMUNITIES_KEY = ["communities"] as const;

async function loadCommunities(): Promise<{ list: CommunityView[]; isFallback: boolean }> {
  const mock = () => ({ list: mockCommunities.map(mockToView), isFallback: true });

  try {
    const [{ data: apiList }, statsRes] = await Promise.all([
      fetchCommunities(),
      // Totals are enrichment. A /stats failure must not cost us the list.
      fetchStats().catch(() => null),
    ]);

    const statsBySlug = new Map(
      (statsRes?.data.communities ?? []).map((s) => [
        s.community_slug,
        { count: Number(s.total_donations), totalMon: formatMon(s.total_community_wei, 2) },
      ]),
    );

    const list = apiList
      .filter((c) => c.is_active)
      .map((c) => apiToView(c, statsBySlug.get(c.slug)));

    return list.length > 0 ? { list, isFallback: false } : mock();
  } catch {
    return mock();
  }
}

/** Fetch live communities; fall back to mock data on any failure. */
export function useCommunities() {
  const { data, isLoading } = useQuery({
    queryKey: COMMUNITIES_KEY,
    queryFn: loadCommunities,
    staleTime: 60_000,
  });

  return {
    communities: data?.list ?? [],
    isLoading,
    isFallback: data?.isFallback ?? false,
  };
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

"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { FeaturedCommunities } from "@/components/community/featured-communities";
import { DirectoryCard } from "@/components/community/directory-card";
import { useCommunities } from "@/lib/community-data";
import { fadeInUp, staggerContainer } from "@/lib/motion";

const SORTS = ["Popular", "Recently Added"];

function DirectoryCardSkeleton() {
  return (
    <Card className="flex h-full flex-col gap-4 p-5">
      <div className="flex items-start justify-between">
        <div className="h-11 w-11 animate-pulse rounded-full bg-aluminum dark:bg-white/10" />
        <div className="h-5 w-16 animate-pulse rounded-full bg-aluminum dark:bg-white/10" />
      </div>
      <div className="flex-1 space-y-2">
        <div className="h-4 w-2/3 animate-pulse rounded bg-aluminum dark:bg-white/10" />
        <div className="h-3 w-full animate-pulse rounded bg-aluminum dark:bg-white/10" />
        <div className="h-3 w-4/5 animate-pulse rounded bg-aluminum dark:bg-white/10" />
      </div>
      <div className="h-10 w-full animate-pulse rounded-full bg-aluminum dark:bg-white/10" />
    </Card>
  );
}

export default function DiscoverPage() {
  const { communities, isLoading: isLoadingCommunities } = useCommunities();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("Popular");

  // Build category tabs from the loaded data (API categories + "All").
  const categories = useMemo(() => {
    const unique = Array.from(new Set(communities.map((c) => c.categoryLabel)));
    return ["All", ...unique];
  }, [communities]);

  const filteredAndSorted = useMemo(() => {
    const query = search.trim().toLowerCase();

    let list = communities.filter((c) => {
      const matchesCategory = category === "All" || c.categoryLabel === category;
      const matchesQuery =
        query === "" ||
        c.name.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });

    list = [...list];
    if (sort === "Popular") return list.sort((a, b) => b.supporterCount - a.supporterCount);
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }, [communities, search, category, sort]);

  const showFeatured = search.trim() === "" && category === "All";

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <motion.div variants={fadeInUp} initial="hidden" animate="show" className="text-center">
        <h1 className="font-display text-5xl font-bold tracking-tight text-charcoal dark:text-warm-white sm:text-6xl">
          Discover communities
        </h1>
        <p className="mx-auto mt-3 max-w-xl font-body text-graphite dark:text-white/60">
          Find a community you care about, and support it in one place.
        </p>
      </motion.div>

      <div className="mx-auto mt-8 max-w-xl">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search communities..."
            className="h-12 pl-11"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-4">
        <Tabs options={categories} value={category} onChange={setCategory} />
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-graphite dark:text-white/60">
          <span>Sort by:</span>
          <Tabs options={SORTS} value={sort} onChange={setSort} />
        </div>
      </div>

      {showFeatured && (
        <div className="mt-12">
          <FeaturedCommunities communities={communities} />
        </div>
      )}

      <div className="mt-14">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-charcoal dark:text-warm-white">
            {search.trim() ? `Results for "${search}"` : "All communities"}
          </h2>
        </div>

        {        isLoadingCommunities ? (
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <DirectoryCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${category}-${sort}-${search}`}
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
            >
              {filteredAndSorted.length > 0 ? (
                filteredAndSorted.map((community) => (
                  <DirectoryCard key={community.id} community={community} />
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <p className="text-graphite dark:text-white/60">No communities found. Try a different search or category.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

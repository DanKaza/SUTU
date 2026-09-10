"use client";

import { HeroSection } from "@/components/landing/hero-section";
import { CommunityTicker } from "@/components/landing/community-ticker";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { CommunityHighlightSection } from "@/components/landing/community-highlight-section";
import { PrinciplesSection } from "@/components/landing/principles-section";

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="relative mx-auto max-w-6xl px-6 py-16">
        <HeroSection />

        <div className="mt-12">
          <CommunityTicker />
        </div>

        <div id="how-it-works" className="mt-20 scroll-mt-24">
          <HowItWorksSection />
        </div>

        <div className="mt-20">
          <CommunityHighlightSection />
        </div>

        <div className="mt-20">
          <PrinciplesSection />
        </div>
      </div>
    </div>
  );
}

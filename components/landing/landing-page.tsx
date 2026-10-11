"use client";

import { HeroSection } from "@/components/landing/hero-section";
import { EditorialStatement } from "@/components/landing/editorial-statement";
import { ShowcasePanel } from "@/components/landing/showcase-panel";
import { NarrativeSection } from "@/components/landing/narrative-section";
import { SupportFlowPreview } from "@/components/landing/support-flow-preview";
import { BenefitsSection } from "@/components/landing/benefits-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { FinalCTA } from "@/components/landing/final-cta";

export function LandingPage() {
  return (
    <div className="grain relative overflow-hidden bg-[#08080B]">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-12">

        <HeroSection />

        {/* Statement: the fullest pause on the page, it carries one argument. */}
        <div className="py-32">
          <EditorialStatement />
        </div>

        {/* Visual band: tighter, so the panel reads as an object. */}
        <div className="py-24">
          <ShowcasePanel />
        </div>

        {/* Argument returns at full weight. */}
        <div className="py-32">
          <NarrativeSection />
        </div>

        {/* Densest content sits closest to its neighbours. */}
        <div className="py-16">
          <SupportFlowPreview />
        </div>

        <div className="py-24">
          <BenefitsSection />
        </div>

        <div className="py-28">
          <HowItWorksSection />
        </div>

        {/* Long approach into the close. */}
        <div className="pb-24 pt-40">
          <FinalCTA />
        </div>

      </div>
    </div>
  );
}

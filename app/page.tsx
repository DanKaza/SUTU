"use client";

import { HeroSection } from "@/components/landing/hero-section";
import { EditorialStatement } from "@/components/landing/editorial-statement";
import { ShowcasePanel } from "@/components/landing/showcase-panel";
import { NarrativeSection } from "@/components/landing/narrative-section";
import { DeviceMockup } from "@/components/landing/device-mockup";
import { BenefitsSection } from "@/components/landing/benefits-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { FinalCTA } from "@/components/landing/final-cta";

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden bg-ink-950">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-12">
        
        <HeroSection />
        
        <div className="py-[clamp(80px,10vw,140px)]">
          <EditorialStatement />
        </div>

        <div className="py-[clamp(80px,10vw,140px)]">
          <ShowcasePanel />
        </div>

        <div className="py-[clamp(80px,10vw,140px)]">
          <NarrativeSection />
        </div>

        <div className="py-[clamp(80px,10vw,140px)]">
          <DeviceMockup />
        </div>

        <div className="py-[clamp(80px,10vw,140px)]">
          <BenefitsSection />
        </div>

        <div className="py-[clamp(80px,10vw,140px)]">
          <HowItWorksSection />
        </div>

        <div className="py-[clamp(80px,10vw,140px)]">
          <FinalCTA />
        </div>

      </div>
    </div>
  );
}

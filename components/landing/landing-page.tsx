"use client";

import { HeroSection } from "@/components/landing/hero-section";
import { EditorialStatement } from "@/components/landing/editorial-statement";
import { ShowcasePanel } from "@/components/landing/showcase-panel";
import { NarrativeSection } from "@/components/landing/narrative-section";
import { BenefitsSection } from "@/components/landing/benefits-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { FinalCTA } from "@/components/landing/final-cta";
import { Container } from "@/components/layout/container";

export function LandingPage() {
  return (
    <div className="relative overflow-hidden bg-ink-950">
      {/* The hero carries its own width: the lit band is full-bleed. */}
      <HeroSection />

      <Container>
        {/* Statement: the fullest pause on the page, it carries one argument. */}
        <div className="py-32">
          <EditorialStatement />
        </div>

        {/* Dense content — the rail sits closest to its neighbours. */}
        <div className="py-16">
          <ShowcasePanel />
        </div>

        {/* Argument returns at full weight. */}
        <div className="py-32">
          <NarrativeSection />
        </div>

        <div className="py-16">
          <BenefitsSection />
        </div>
      </Container>

      {/* The process gets its own ground. A band changes the page's surface
          where a section changes its argument, so it leaves the 1200 column and
          runs edge to edge — a rounded panel inside the column would have been
          a card the size of the page. */}
      <HowItWorksSection />

      <Container>
        {/* Long approach into the close. */}
        <div className="pb-24 pt-40">
          <FinalCTA />
        </div>
      </Container>
    </div>
  );
}

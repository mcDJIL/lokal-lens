"use client";

import HeroSection from "@/components/sections/AboutUs/HeroSection";
import ValuesSection from "@/components/sections/AboutUs/ValuesSection";
import ChallengeAndSolutionSection from "@/components/sections/AboutUs/ChallengeAndSolutionSection";
import TeamSection from "@/components/sections/AboutUs/TeamSection";
import CTASection from "@/components/sections/AboutUs/CTASection";

export default function AboutPage() {
  return (
    <main className="w-full bg-white">
      <HeroSection />
      <ValuesSection />
      <ChallengeAndSolutionSection />
      <TeamSection />
      <CTASection />
    </main>
  );
}

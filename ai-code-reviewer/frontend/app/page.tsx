"use client";

import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import CodeDemoSection from "@/components/landing/CodeDemoSection";
import FeatureGrid from "@/components/landing/FeatureGrid";
import HowItWorks from "@/components/landing/HowItWorks";
import TrustSection from "@/components/landing/TrustSection";
import Footer from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <div className="landing-page flex min-h-screen flex-col">
      <Navbar />
      <Hero />
      <CodeDemoSection />
      <FeatureGrid />
      <HowItWorks />
      <TrustSection />
      <Footer />
    </div>
  );
}

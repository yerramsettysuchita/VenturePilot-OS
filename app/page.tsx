"use client";

import dynamic from "next/dynamic";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AssumptionTicker from "@/components/AssumptionTicker";
import SectionDivider from "@/components/SectionDivider";

// Below-fold sections — loaded lazily to reduce initial bundle
const Problem       = dynamic(() => import("@/components/Problem"));
const Solution      = dynamic(() => import("@/components/Solution"));
const PathSimulator = dynamic(() => import("@/components/PathSimulator"));
const Demo          = dynamic(() => import("@/components/Demo"));
const Features      = dynamic(() => import("@/components/Features"));
const Architecture  = dynamic(() => import("@/components/Architecture"));
const VentureTwin   = dynamic(() => import("@/components/VentureTwin"));
const Impact        = dynamic(() => import("@/components/Impact"));
const Testimonials  = dynamic(() => import("@/components/Testimonials"));
const ComparisonTable = dynamic(() => import("@/components/ComparisonTable"));
const Pricing       = dynamic(() => import("@/components/Pricing"));
const Footer        = dynamic(() => import("@/components/Footer"));
const BackToTop     = dynamic(() => import("@/components/BackToTop"));

export default function Home() {
  return (
    <main>
      <AnnouncementBar />
      <Navbar />
      <Hero />
      <AssumptionTicker />
      <SectionDivider />
      <Problem />
      <SectionDivider />
      <Solution />
      <SectionDivider />
      <PathSimulator />
      <SectionDivider />
      <Demo />
      <SectionDivider />
      <Features />
      <SectionDivider />
      <Architecture />
      <SectionDivider />
      <VentureTwin />
      <SectionDivider />
      <Impact />
      <SectionDivider />
      <Testimonials />
      <SectionDivider />
      <ComparisonTable />
      <SectionDivider />
      <Pricing />
      <Footer />
      <BackToTop />
    </main>
  );
}

"use client";

import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AssumptionTicker from "@/components/AssumptionTicker";
import SectionDivider from "@/components/SectionDivider";
import Problem from "@/components/Problem";
import Solution from "@/components/Solution";
import PathSimulator from "@/components/PathSimulator";
import Demo from "@/components/Demo";
import Features from "@/components/Features";
import Architecture from "@/components/Architecture";
import VentureTwin from "@/components/VentureTwin";
import Impact from "@/components/Impact";
import Testimonials from "@/components/Testimonials";
import ComparisonTable from "@/components/ComparisonTable";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

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

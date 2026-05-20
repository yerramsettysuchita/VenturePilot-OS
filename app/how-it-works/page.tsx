import type { Metadata } from "next";
import HowItWorksClient from "./HowItWorksClient";

export const metadata: Metadata = {
  title: "How It Works | VenturePilot OS",
  description:
    "From idea to execution board in one intelligent loop. See exactly how VenturePilot OS researches, simulates, scores, and builds for you.",
};

export default function HowItWorksPage() {
  return <HowItWorksClient />;
}

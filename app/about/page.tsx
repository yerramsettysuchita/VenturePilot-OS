import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About | VenturePilot OS",
  description:
    "We built the venture execution engine we wish we'd had. The story behind VenturePilot OS.",
};

export default function AboutPage() {
  return <AboutClient />;
}

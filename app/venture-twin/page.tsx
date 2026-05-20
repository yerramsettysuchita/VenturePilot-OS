import type { Metadata } from "next";
import VentureTwinClient from "./VentureTwinClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Venture Twin | VenturePilot OS",
  description: "Your live Adaptive Venture Twin — monitoring assumptions in real time.",
};

export default function VentureTwinPage() {
  return <VentureTwinClient />;
}

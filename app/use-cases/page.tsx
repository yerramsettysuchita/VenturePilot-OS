import type { Metadata } from "next";
import UseCasesClient from "./UseCasesClient";

export const metadata: Metadata = {
  title: "Use Cases | VenturePilot OS",
  description:
    "Built for solo founders, startup teams, venture studios, and accelerators. See how VenturePilot OS fits your context.",
};

export default function UseCasesPage() {
  return <UseCasesClient />;
}

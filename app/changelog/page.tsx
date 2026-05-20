import type { Metadata } from "next";
import ChangelogClient from "./ChangelogClient";

export const metadata: Metadata = {
  title: "Changelog | VenturePilot OS",
  description: "Every update, every improvement, every decision we ship. We build in public.",
};

export default function ChangelogPage() {
  return <ChangelogClient />;
}

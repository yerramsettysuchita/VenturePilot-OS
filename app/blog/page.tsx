import type { Metadata } from "next";
import BlogClient from "./BlogClient";

export const metadata: Metadata = {
  title: "Blog | VenturePilot OS",
  description: "Strategy, product decisions, founder insights, and everything we're learning building VenturePilot OS.",
};

export default function BlogPage() {
  return <BlogClient />;
}

import type { Metadata } from "next";
import "./globals.css";
import ScrollProgress from "@/components/ScrollProgress";
import GlobalUI from "@/components/GlobalUI";

export const metadata: Metadata = {
  title: "VenturePilot OS | Venture Execution Engine",
  description:
    "The AI system that researches your market, simulates your venture paths, scores them with evidence, and builds your execution board in 60 seconds.",
  openGraph: {
    title: "VenturePilot OS | Venture Execution Engine",
    description:
      "The AI system that researches your market, simulates your venture paths, scores them with evidence, and builds your execution board in 60 seconds.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VenturePilot OS | Venture Execution Engine",
    description:
      "The AI system that researches your market, simulates your venture paths, scores them with evidence, and builds your execution board in 60 seconds.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body>
        <ScrollProgress />
        {children}
        <GlobalUI />
      </body>
    </html>
  );
}

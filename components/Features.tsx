"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import WarRoomModal from "./WarRoomModal";

const features = [
  { emoji: "🔍", name: "DeepSearch War Room", desc: "Live market intelligence aggregated in real time", proof: "Used by 200+ founders to find competitor gaps", color: "#00C9A7", iconBg: "#E6FBF7", expandable: true },
  { emoji: "🛤️", name: "Multi-Path Simulator", desc: "Three distinct venture paths generated per idea", proof: "3 paths from 1 idea. Always.", color: "#8B5CF6", iconBg: "#F3EFFE", expandable: false },
  { emoji: "📊", name: "Evidence Scoring Engine", desc: "7-dimension scoring framework backed by data", proof: "7 dimensions. Zero black box.", color: "#F59E0B", iconBg: "#FFFBEB", expandable: false },
  { emoji: "💡", name: "Strategy Explainability", desc: "Every recommendation comes with its full reasoning", proof: "Know the why before you commit.", color: "#F97316", iconBg: "#FFF4EE", expandable: false },
  { emoji: "⚡", name: "One-Click Execution Board", desc: "Strategy converts to a live Project HUB board", proof: "Real board. Real tasks. 60 seconds.", color: "#00C9A7", iconBg: "#E6FBF7", expandable: false },
  { emoji: "🤖", name: "Adaptive Venture Twin", desc: "AI monitors your assumptions and flags drift", proof: "Your strategy stays alive.", color: "#8B5CF6", iconBg: "#F3EFFE", expandable: false },
  { emoji: "🧠", name: "Founder Decision Memory", desc: "Every decision stored and used for context", proof: "Your startup never forgets.", color: "#F59E0B", iconBg: "#FFFBEB", expandable: false },
  { emoji: "❤️", name: "Assumption Health Score", desc: "Live health index on your venture's core bets", proof: "Know when an assumption is dying.", color: "#F97316", iconBg: "#FFF4EE", expandable: false },
  { emoji: "🚀", name: "GTM Launchpad", desc: "Go-to-market sequence auto-generated and tracked", proof: "First 30 days. Already planned.", color: "#00C9A7", iconBg: "#E6FBF7", expandable: false },
  { emoji: "🔄", name: "Pivot Simulator", desc: "Stress-test a pivot before committing resources", proof: "Model the pivot before you make it.", color: "#8B5CF6", iconBg: "#F3EFFE", expandable: false },
];

export default function Features() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [warRoomOpen, setWarRoomOpen] = useState(false);

  return (
    <section className="py-24 bg-white" id="features">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="section-label mb-4">Features</div>
          <h2 className="text-4xl md:text-5xl font-black text-ink leading-tight">
            10 Features That Change{" "}
            <span style={{ background: "linear-gradient(135deg, #00C9A7 0%, #8B5CF6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              How Founders Build
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {features.map((f, i) => (
            <FeatureCard
              key={f.name}
              feature={f}
              index={i}
              inView={inView}
              onClick={f.expandable ? () => setWarRoomOpen(true) : undefined}
            />
          ))}
        </div>
      </div>
      <WarRoomModal open={warRoomOpen} onClose={() => setWarRoomOpen(false)} />
    </section>
  );
}

function FeatureCard({
  feature, index, inView, onClick,
}: {
  feature: typeof features[0];
  index: number;
  inView: boolean;
  onClick?: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.05, duration: 0.45 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onClick}
      className="card p-5 flex flex-col"
      style={{
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
        borderColor: hovered ? feature.color : "#E2E8F0",
        boxShadow: hovered ? `0 8px 24px ${feature.color}20, 0 2px 8px rgba(0,0,0,0.06)` : undefined,
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center text-lg mb-3 shrink-0"
        style={{ background: hovered ? feature.color + "25" : feature.iconBg }}
      >
        {feature.emoji}
      </div>
      <div className="font-bold text-ink text-sm mb-1">{feature.name}</div>
      <div className="text-slate-400 text-xs leading-relaxed flex-1">{feature.desc}</div>
      <div className="mt-3 pt-3 border-t border-slate-100">
        <div
          className="text-xs font-medium leading-relaxed transition-colors duration-200"
          style={{ color: hovered ? feature.color : "#94A3B8" }}
        >
          {feature.expandable && hovered ? "Click to see sample output →" : feature.proof}
        </div>
      </div>
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

const flowNodes = [
  { label: "Idea",         sub: "You type this",           color: "#00C9A7" },
  { label: "DeepSearch",   sub: "We research this",        color: "#8B5CF6" },
  { label: "3 Paths",      sub: "We simulate these",       color: "#00C9A7" },
  { label: "Score",        sub: "We rank these",           color: "#F59E0B" },
  { label: "HUB Board",    sub: "This gets built",         color: "#F97316" },
  { label: "Venture Twin", sub: "This watches everything", color: "#00C9A7" },
];

const connectorColors = ["#00C9A7", "#8B5CF6", "#F59E0B", "#F97316", "#00C9A7"];

function DotGrid() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: "radial-gradient(circle, #CBD5E1 1px, transparent 1px)",
        backgroundSize: "28px 28px",
        opacity: 0.4,
        maskImage: "radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 100%)",
      }}
    />
  );
}

function GradientBlob({ className, color }: { className?: string; color: string }) {
  return (
    <div
      className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
      style={{ background: color, opacity: 0.1 }}
    />
  );
}

function FlowDiagram() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55, duration: 0.5 }}
      className="mt-12 px-4"
    >
      {/* Desktop flow */}
      <div className="hidden md:flex items-start justify-center">
        {flowNodes.map((node, i) => (
          <div key={node.label} className="flex items-center">
            {/* Node */}
            <div className="flex flex-col items-center gap-2">
              <motion.div
                onHoverStart={() => setHovered(i)}
                onHoverEnd={() => setHovered(null)}
                whileHover={{ scale: 1.06 }}
                transition={{ duration: 0.15 }}
                className="px-4 py-2 rounded-full text-xs font-medium bg-white shadow-sm cursor-default select-none"
                style={{
                  border: `1.5px solid ${hovered === i ? node.color : "#E2E8F0"}`,
                  color: hovered === i ? node.color : "#374151",
                  transition: "border-color 0.2s, color 0.2s",
                  boxShadow: hovered === i ? `0 0 0 3px ${node.color}18` : undefined,
                }}
              >
                {node.label}
              </motion.div>
              <span className="text-[10px] text-slate-400 text-center whitespace-nowrap">
                {node.sub}
              </span>
            </div>

            {/* Connector */}
            {i < flowNodes.length - 1 && (
              <div
                className="relative flex items-center mb-5 mx-1 shrink-0"
                style={{ width: 48, height: 16 }}
              >
                {/* Dashed base line */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-full h-px"
                  style={{
                    background: `repeating-linear-gradient(90deg, ${connectorColors[i]}50 0px, ${connectorColors[i]}50 4px, transparent 4px, transparent 8px)`,
                  }}
                />
                {/* Arrow tip */}
                <svg
                  className="absolute -right-1"
                  width="6" height="8" viewBox="0 0 6 8" fill="none"
                >
                  <path d="M1 1l4 3-4 3" stroke={connectorColors[i]} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
                </svg>
                {/* Traveling glow dot — clipped by overflow hidden */}
                <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: 4 }}>
                  <motion.div
                    className="absolute top-1/2 rounded-full blur-[2px]"
                    style={{
                      width: 14, height: 14,
                      marginTop: -7,
                      left: -7,
                      background: connectorColors[i],
                      boxShadow: `0 0 8px ${connectorColors[i]}, 0 0 14px ${connectorColors[i]}`,
                    }}
                    animate={{ x: [0, 62] }}
                    transition={{
                      duration: 0.75,
                      delay: i * 0.75,
                      repeat: Infinity,
                      repeatDelay: 3.0,
                      ease: "easeInOut",
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile flow — horizontal scroll */}
      <div className="md:hidden flex items-start overflow-x-auto gap-2 pb-2 scrollbar-hide snap-x snap-mandatory">
        {flowNodes.map((node, i) => (
          <div key={node.label} className="flex items-center snap-start shrink-0">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-white shadow-sm border border-slate-200 whitespace-nowrap"
                style={{ color: node.color, borderColor: node.color + "60" }}
              >
                {node.label}
              </div>
              <span className="text-[9px] text-slate-400 text-center max-w-[70px] leading-tight">
                {node.sub}
              </span>
            </div>
            {i < flowNodes.length - 1 && (
              <div className="mx-1 text-slate-300 text-sm mt-[-14px]">→</div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-white pt-20">
      <DotGrid />
      <GradientBlob
        className="w-[700px] h-[500px] -top-32 left-1/2 -translate-x-1/2"
        color="linear-gradient(135deg, #00C9A7, #8B5CF6)"
      />
      <GradientBlob className="w-[400px] h-[300px] bottom-0 right-0" color="#F97316" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold px-4 py-1.5 rounded-full mb-8 tracking-widest uppercase"
        >
          <span className="w-2 h-2 rounded-full bg-[#00C9A7] inline-block pulse-dot" />
          Venture Execution Engine
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-5xl md:text-7xl font-black text-ink leading-[1.05] tracking-tight mb-6"
        >
          Your idea deserves{" "}
          <br className="hidden md:block" />
          <span
            style={{
              background: "linear-gradient(135deg, #00C9A7 0%, #8B5CF6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            a decision, not a plan.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          VenturePilot OS researches your market, simulates three venture paths,
          scores them with evidence, and builds your execution board before
          you&apos;ve finished reading the recommendation.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#waitlist"
            className="btn-scale bg-[#0A0A0F] text-white text-sm font-semibold px-7 py-3.5 rounded-lg hover:bg-slate-800"
          >
            Get Early Access
          </a>
          <Link
            href="/how-it-works"
            className="btn-scale border-2 border-slate-300 text-ink text-sm font-semibold px-7 py-3.5 rounded-lg hover:border-ink transition-colors"
          >
            See How It Works
          </Link>
        </motion.div>

        <FlowDiagram />
      </div>
    </section>
  );
}

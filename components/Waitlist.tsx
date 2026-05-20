"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const stageOptions = ["Idea Stage", "Pre-Revenue", "Early Revenue", "Scaling"];
const sizeOptions = ["Solo", "2-5", "6-15", "15+"];

const trustSignals = [
  { icon: "◇", label: "No credit card" },
  { icon: "⚡", label: "Setup in 60 seconds" },
  { icon: "✕", label: "Cancel anytime" },
];

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [stage, setStage] = useState("");
  const [size, setSize] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !stage || !size) return;
    setLoading(true);
    setTimeout(() => {
      const existing = JSON.parse(localStorage.getItem("vpx-waitlist") || "[]");
      existing.push({ email, stage, size, ts: Date.now() });
      localStorage.setItem("vpx-waitlist", JSON.stringify(existing));
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <section className="py-24 bg-[#0A0A0F]" id="waitlist">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          {/* Left */}
          <div className="flex-1">
            <div className="text-xs font-bold tracking-widest text-[#00C9A7] uppercase mb-5">
              Now in Early Access
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-5">
              Be the first founder to run on{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #00C9A7 0%, #8B5CF6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                VenturePilot OS.
              </span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-10">
              Join 400+ founders already on the waitlist. We&apos;re onboarding 50 teams this month.
            </p>

            <div className="flex flex-wrap gap-6">
              {trustSignals.map((s) => (
                <div key={s.label} className="flex items-center gap-2 text-slate-300 text-sm">
                  <span className="text-[#00C9A7]">{s.icon}</span>
                  {s.label}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div className="flex-1 w-full max-w-md">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                  className="w-16 h-16 rounded-full bg-[#00C9A7]/20 flex items-center justify-center mx-auto mb-5"
                >
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path
                      d="M5 14l6 6 12-12"
                      stroke="#00C9A7"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.div>
                <h3 className="text-white font-bold text-xl mb-2">You&apos;re on the list.</h3>
                <p className="text-slate-400 text-sm">
                  We&apos;ll reach out within 24 hours.
                </p>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white/5 border border-white/10 rounded-2xl p-7 flex flex-col gap-4"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-white/8 border border-white/15 rounded-lg px-4 py-3 text-white placeholder-slate-500 text-sm outline-none focus:border-[#00C9A7]/60 focus:ring-1 focus:ring-[#00C9A7]/30 transition-all"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                />

                <select
                  required
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                  className="w-full border border-white/15 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#00C9A7]/60 transition-all"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    color: stage ? "#ffffff" : "#6B7280",
                  }}
                >
                  <option value="" disabled style={{ background: "#1a1a2e" }}>
                    What stage are you at?
                  </option>
                  {stageOptions.map((o) => (
                    <option key={o} value={o} style={{ background: "#1a1a2e", color: "#fff" }}>
                      {o}
                    </option>
                  ))}
                </select>

                <select
                  required
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full border border-white/15 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#00C9A7]/60 transition-all"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    color: size ? "#ffffff" : "#6B7280",
                  }}
                >
                  <option value="" disabled style={{ background: "#1a1a2e" }}>
                    What&apos;s your team size?
                  </option>
                  {sizeOptions.map((o) => (
                    <option key={o} value={o} style={{ background: "#1a1a2e", color: "#fff" }}>
                      {o}
                    </option>
                  ))}
                </select>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-scale w-full py-3.5 rounded-lg bg-[#00C9A7] text-[#0A0A0F] font-bold text-sm hover:bg-[#00b396] transition-colors disabled:opacity-60"
                >
                  {loading ? "Submitting..." : "Get Early Access"}
                </button>

                <p className="text-slate-500 text-xs text-center leading-relaxed">
                  We review every application. You&apos;ll hear back within 24 hours.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

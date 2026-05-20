"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const plans = [
  {
    badge: "Start here",
    badgeBg: "bg-slate-100 text-slate-600",
    name: "Founder",
    price: "$0",
    period: "/ month",
    desc: "For solo founders validating their first idea.",
    features: [
      "3 venture path simulations per month",
      "DeepSearch market scans",
      "Basic scoring engine",
      "Project HUB board export",
      "1 active Venture Twin",
    ],
    cta: "Get Started Free",
    ctaStyle: "border-2 border-[#0A0A0F] text-ink hover:bg-ink hover:text-white",
    featured: false,
  },
  {
    badge: "Most Popular",
    badgeBg: "bg-[#00C9A7] text-white",
    name: "Builder",
    price: "$49",
    period: "/ month",
    desc: "For teams actively building and iterating.",
    features: [
      "Unlimited path simulations",
      "Full DeepSearch War Room",
      "Evidence scoring with custom weights",
      "Strategy explainability layer",
      "Unlimited Project HUB boards",
      "5 active Venture Twins",
      "Founder Decision Memory",
      "Assumption Health Score",
      "GTM Launchpad",
    ],
    cta: "Start Building",
    ctaStyle: "bg-[#0A0A0F] text-white hover:bg-slate-800",
    featured: true,
  },
  {
    badge: "For teams & studios",
    badgeBg: "bg-slate-100 text-slate-600",
    name: "Studio",
    price: "$199",
    period: "/ month",
    desc: "For venture studios and accelerators running multiple startups in parallel.",
    features: [
      "Everything in Builder",
      "Unlimited Venture Twins",
      "Multi-startup dashboard",
      "Portfolio-level assumption monitoring",
      "Pivot Simulator with unlimited runs",
      "Priority onboarding",
      "Dedicated Slack support",
      "Custom DeepSearch signal configuration",
    ],
    cta: "Talk to Us",
    ctaStyle: "border-2 border-[#0A0A0F] text-ink hover:bg-ink hover:text-white",
    featured: false,
  },
];

export default function Pricing() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 bg-white" id="pricing">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="section-label mb-4">Pricing</div>
          <h2 className="text-4xl md:text-5xl font-black text-ink leading-tight mb-3">
            Simple pricing.{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #00C9A7 0%, #8B5CF6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Serious outcomes.
            </span>
          </h2>
          <p className="text-slate-500 text-lg">Start free. Scale when you&apos;re ready.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`card p-7 flex flex-col relative transition-all duration-300 ${
                plan.featured
                  ? "ring-2 ring-[#00C9A7] shadow-[0_0_32px_rgba(0,201,167,0.15)] scale-[1.02]"
                  : "hover:shadow-md"
              }`}
            >
              <div className="mb-5">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full inline-block mb-4 ${plan.badgeBg}`}
                >
                  {plan.badge}
                </span>
                <div className="font-black text-ink text-xl mb-1">{plan.name}</div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-black text-ink">{plan.price}</span>
                  <span className="text-slate-400 text-sm">{plan.period}</span>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed">{plan.desc}</p>
              </div>

              <div className="flex flex-col gap-2.5 flex-1 mb-7">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-start gap-2.5">
                    <svg
                      className="shrink-0 mt-0.5"
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                    >
                      <circle cx="7" cy="7" r="6" fill="#00C9A7" opacity="0.15"/>
                      <path
                        d="M4.5 7l2 2 3-3"
                        stroke="#00C9A7"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-sm text-slate-600">{f}</span>
                  </div>
                ))}
              </div>

              <a
                href="#waitlist"
                className={`btn-scale w-full py-3 rounded-lg text-sm font-bold text-center transition-all duration-200 ${plan.ctaStyle}`}
              >
                {plan.cta}
              </a>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center text-slate-400 text-sm mt-8"
        >
          All plans include a 14-day free trial. No credit card required to start.
        </motion.p>
      </div>
    </section>
  );
}

"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const testimonials = [
  {
    quote:
      "I used to spend 3 weeks going from idea to execution plan. VenturePilot OS collapsed that into a single afternoon. The path scoring alone changed how I think about strategy.",
    name: "Aryan Mehta",
    title: "Founder, Stacklane (YC W24)",
    initials: "AM",
    color: "#00C9A7",
  },
  {
    quote:
      "The Adaptive Venture Twin is the feature I didn't know I needed. When a competitor raised a Series A last month, it flagged three of my assumptions as at-risk before I'd even read the news.",
    name: "Priya Nair",
    title: "Co-founder, Kestrel AI",
    initials: "PN",
    color: "#8B5CF6",
  },
  {
    quote:
      "We run a venture studio with 6 active builds. VenturePilot OS is the only tool that gives us a single intelligence layer across all of them. The multi-startup dashboard alone is worth the price.",
    name: "Rohan Desai",
    title: "Managing Partner, Forge Studio",
    initials: "RD",
    color: "#F59E0B",
  },
];

const stars = Array(5).fill(0);

export default function Testimonials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 bg-[#F8FAFC]" id="testimonials">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="section-label mb-4">From the Community</div>
          <h2 className="text-4xl md:text-5xl font-black text-ink leading-tight">
            Founders who stopped{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #00C9A7 0%, #8B5CF6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              guessing.
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="card p-7 flex flex-col hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
            >
              <div
                className="text-5xl font-black leading-none mb-4 select-none"
                style={{ color: t.color + "30" }}
              >
                &ldquo;
              </div>

              <div className="flex gap-0.5 mb-4">
                {stars.map((_, si) => (
                  <svg key={si} width="14" height="14" viewBox="0 0 14 14" fill="#F59E0B">
                    <path d="M7 1l1.545 3.13L12 4.635l-2.5 2.435.59 3.44L7 8.885l-3.09 1.625.59-3.44L2 4.635l3.455-.505L7 1z"/>
                  </svg>
                ))}
              </div>

              <p className="text-slate-600 text-sm leading-relaxed flex-1">{t.quote}</p>

              <div className="flex items-center gap-3 mt-6 pt-5 border-t border-slate-100">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ background: t.color }}
                >
                  {t.initials}
                </div>
                <div>
                  <div className="font-bold text-ink text-sm">{t.name}</div>
                  <div className="text-xs text-slate-400">{t.title}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

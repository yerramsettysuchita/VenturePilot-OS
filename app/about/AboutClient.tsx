"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";

const beliefs = [
  {
    title: "Research without structure is noise.",
    body: "Intelligence only matters if it's organized well enough to reason over. That's why every DeepSearch result becomes a structured evidence object, not a summary.",
    color: "#00C9A7",
  },
  {
    title: "One answer is never enough.",
    body: "Every founding intent can become multiple viable businesses. Presenting a single recommendation without showing the alternatives is not strategy. It's guessing with extra steps.",
    color: "#8B5CF6",
  },
  {
    title: "Execution is the point.",
    body: "A plan that never becomes a task is just a document. Everything in VenturePilot OS is designed to end in action: a board, a sprint, a milestone, a decision.",
    color: "#F59E0B",
  },
  {
    title: "Strategy should adapt or it dies.",
    body: "The market doesn't wait for your quarterly review. The Adaptive Venture Twin exists because static plans fail dynamically. Your execution should update at the speed of the market.",
    color: "#F97316",
  },
];

const team = [
  {
    initials: "SM",
    name: "Suchita M.",
    role: "Founder & CEO",
    bio: "Previously built data systems at scale. Believes the gap between research and execution is the most expensive problem in early-stage startups.",
    color: "#00C9A7",
  },
  {
    initials: "AR",
    name: "Arjun R.",
    role: "Head of Product",
    bio: "Former accelerator program manager. Watched 200+ founder teams make the same strategic mistakes. Built the scoring engine to stop that pattern.",
    color: "#8B5CF6",
  },
  {
    initials: "KP",
    name: "Kavya P.",
    role: "Head of Engineering",
    bio: "Full-stack engineer with a background in ML pipelines and real-time systems. Responsible for the Venture Twin's monitoring architecture.",
    color: "#F59E0B",
  },
];

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
}

export default function AboutClient() {
  return (
    <main>
      <AnnouncementBar />
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-white px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="section-label mb-6">About</div>
            <h1 className="text-4xl md:text-6xl font-black text-ink leading-tight mb-6">
              We got tired of watching good ideas die in the gap between{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #00C9A7 0%, #8B5CF6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                research and execution.
              </span>
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed">
              VenturePilot OS exists because the tools founders rely on were built
              to inform, not to decide. We built the thing that makes the decision
              and then builds the board.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-[#0A0A0F] px-6">
        <FadeUp>
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-xs font-bold tracking-widest uppercase text-[#00C9A7] mb-8">
              The Mission
            </div>
            <blockquote className="text-2xl md:text-4xl font-black text-white leading-tight">
              &ldquo;Every founder deserves a system that thinks as hard about
              their idea as they do and keeps thinking long after the initial
              plan is made.&rdquo;
            </blockquote>
          </div>
        </FadeUp>
      </section>

      {/* Beliefs */}
      <section className="py-24 bg-[#F8FAFC] px-6">
        <div className="max-w-5xl mx-auto">
          <FadeUp>
            <div className="text-center mb-16">
              <div className="section-label mb-4">Philosophy</div>
              <h2 className="text-4xl font-black text-ink">What we believe</h2>
            </div>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {beliefs.map((b, i) => (
              <FadeUp key={b.title} delay={i * 0.1}>
                <div
                  className="card p-7 h-full"
                  style={{ borderLeft: `4px solid ${b.color}` }}
                >
                  <h3 className="font-black text-ink text-lg mb-3">{b.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{b.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-5xl mx-auto">
          <FadeUp>
            <div className="text-center mb-6">
              <div className="section-label mb-4">Team</div>
              <h2 className="text-4xl font-black text-ink mb-4">
                Built by founders, for founders.
              </h2>
              <p className="text-slate-500 text-lg max-w-xl mx-auto">
                We&apos;ve been in the room where a bad strategic decision costs six
                months of runway. We built the tool we wish we&apos;d had.
              </p>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
            {team.map((t, i) => (
              <FadeUp key={t.name} delay={i * 0.1}>
                <div className="card p-7">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm mb-5"
                    style={{ background: t.color }}
                  >
                    {t.initials}
                  </div>
                  <div className="font-black text-ink text-lg">{t.name}</div>
                  <div className="text-xs font-semibold text-slate-400 mb-4 mt-1 uppercase tracking-wide">
                    {t.role}
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed">{t.bio}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Hiring CTA */}
      <section className="py-20 bg-[#F8FAFC] px-6 text-center">
        <FadeUp>
          <div className="max-w-lg mx-auto">
            <h2 className="text-3xl font-black text-ink mb-3">We&apos;re hiring.</h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
              If you believe strategy and execution should live in the same system,
              we want to talk.
            </p>
            <Link
              href="#"
              className="btn-scale inline-block bg-[#0A0A0F] text-white text-sm font-bold px-8 py-4 rounded-lg hover:bg-slate-800 transition-colors"
            >
              See Open Roles →
            </Link>
          </div>
        </FadeUp>
      </section>

      <Footer />
    </main>
  );
}

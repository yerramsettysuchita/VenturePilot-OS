"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";
import Link from "next/link";

const articles = [
  {
    tag: "Strategy",
    tagColor: "#00C9A7",
    gradient: "linear-gradient(135deg, #00C9A7 0%, #8B5CF6 100%)",
    date: "May 12, 2025",
    readTime: "6 min read",
    title: "Why most founders pick the wrong version of their own idea",
    excerpt:
      "The problem isn't that founders have bad ideas. It's that one founding intent can become five different products, and most founders commit to the first interpretation that sounds good in a sentence. Here's the framework we built to fix that.",
  },
  {
    tag: "Product",
    tagColor: "#8B5CF6",
    gradient: "linear-gradient(135deg, #8B5CF6 0%, #F59E0B 100%)",
    date: "April 28, 2025",
    readTime: "8 min read",
    title: "The Adaptive Venture Twin: why we built a nervous system, not a notification system",
    excerpt:
      "Every startup pivot we've ever seen was preceded by a period where the founder already knew something was wrong but kept executing anyway. We built the Twin to close that gap — not with alerts, but with recomputed strategy.",
  },
  {
    tag: "Founders",
    tagColor: "#F59E0B",
    gradient: "linear-gradient(135deg, #F59E0B 0%, #F97316 100%)",
    date: "April 10, 2025",
    readTime: "5 min read",
    title: "The 3-6 month tax: what bad strategic decisions actually cost early-stage startups",
    excerpt:
      "We interviewed 40 founders who had pivoted at least once. The average time between 'we knew something was wrong' and 'we actually changed direction' was 11 weeks. Here's what happens in those 11 weeks and why it keeps happening.",
  },
];

function ArticleCard({ article, index }: { article: typeof articles[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.12, duration: 0.5 }}
      className="card overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group"
    >
      {/* Gradient image */}
      <div
        className="h-44 w-full"
        style={{ background: article.gradient }}
      />

      <div className="p-6">
        <span
          className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3 inline-block"
          style={{ background: article.tagColor + "18", color: article.tagColor }}
        >
          {article.tag}
        </span>

        <h3 className="text-lg font-black text-ink leading-tight mb-3 group-hover:text-[#00C9A7] transition-colors">
          {article.title}
        </h3>

        <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-3">
          {article.excerpt}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <span className="text-xs text-slate-400">{article.date}</span>
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-400">{article.readTime}</span>
            <Link
              href="#"
              className="text-xs font-semibold text-[#00C9A7] hover:underline"
            >
              Read Article →
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function BlogClient() {
  return (
    <main>
      <AnnouncementBar />
      <Navbar />

      <section className="pt-32 pb-16 bg-white px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <div className="section-label mb-4">Blog</div>
          <h1 className="text-5xl font-black text-ink mb-4">Thinking out loud.</h1>
          <p className="text-xl text-slate-500 leading-relaxed">
            Strategy, product decisions, founder insights, and everything we&apos;re
            learning building VenturePilot OS.
          </p>
        </motion.div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article, i) => (
            <ArticleCard key={article.title} article={article} index={i} />
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}

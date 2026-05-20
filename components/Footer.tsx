"use client";

import Link from "next/link";
import { useState } from "react";

const cols = [
  {
    heading: "Product",
    links: [
      { label: "How It Works", href: "/how-it-works" },
      { label: "Features", href: "/#features" },
      { label: "Architecture", href: "/#architecture" },
      { label: "Pricing", href: "/#pricing" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    heading: "Use Cases",
    links: [
      { label: "Solo Founders", href: "/use-cases#solo" },
      { label: "Startup Teams", href: "/use-cases#teams" },
      { label: "Venture Studios", href: "/use-cases#studios" },
      { label: "Accelerators", href: "/use-cases#accelerators" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "/blog" },
      { label: "Careers (We're hiring →)", href: "#" },
      { label: "Press", href: "#" },
    ],
  },
  {
    heading: "Connect",
    links: [
      { label: "Twitter / X", href: "#" },
      { label: "LinkedIn", href: "#" },
      { label: "GitHub", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");

  return (
    <footer className="bg-[#0A0A0F] text-white" style={{ borderTop: "4px solid", borderImage: "linear-gradient(to right, #00C9A7, #8B5CF6) 1" }}>
      {/* Top row */}
      <div className="max-w-7xl mx-auto px-6 pt-14 pb-10 flex flex-col md:flex-row items-start justify-between gap-8 border-b border-white/8">
        <div>
          <div className="font-bold text-xl mb-2 tracking-tight">
            VenturePilot <span className="text-[#00C9A7]">OS</span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
            From intelligence to execution, in one adaptive engine.
          </p>
        </div>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex gap-2 w-full md:w-auto"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            data-footer-email
            className="flex-1 md:w-64 bg-white/6 border border-white/15 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-[#00C9A7]/50 transition-colors"
          />
          <a
            href="#waitlist"
            className="btn-scale bg-[#00C9A7] text-[#0A0A0F] text-sm font-bold px-5 py-2.5 rounded-lg hover:bg-[#00b396] transition-colors whitespace-nowrap"
          >
            Join Waitlist
          </a>
        </form>
      </div>

      {/* Link columns */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-10">
        {cols.map((col) => (
          <div key={col.heading}>
            <div className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-5">
              {col.heading}
            </div>
            <ul className="space-y-3">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-6 pb-8 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/8 pt-6">
        <p className="text-slate-500 text-sm">
          © 2025 VenturePilot OS. All rights reserved.
        </p>
        <div className="flex items-center gap-4 text-slate-500 text-sm">
          <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
          <span>·</span>
          <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          <span>·</span>
          <Link href="#" className="hover:text-white transition-colors">Security</Link>
        </div>
      </div>
    </footer>
  );
}

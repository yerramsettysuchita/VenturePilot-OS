"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const productLinks = [
  { label: "How It Works", href: "/how-it-works", icon: "⚙️", desc: "The 6-step venture execution loop" },
  { label: "Features", href: "/#features", icon: "✦", desc: "10 features that change how you build" },
  { label: "Architecture", href: "/#architecture", icon: "◈", desc: "Built to reason, not just respond" },
  { label: "Pricing", href: "/#pricing", icon: "◇", desc: "Start free, scale when ready" },
];

const useCasesLinks = [
  { label: "Solo Founders", href: "/use-cases#solo", icon: "◉", desc: "Stop deciding alone" },
  { label: "Startup Teams", href: "/use-cases#teams", icon: "◈", desc: "Same intelligence, every team member" },
  { label: "Venture Studios", href: "/use-cases#studios", icon: "✦", desc: "One intelligence layer, six builds" },
  { label: "Accelerators", href: "/use-cases#accelerators", icon: "▲", desc: "Give every cohort a senior strategist" },
];

function Dropdown({ items, visible }: { items: typeof productLinks; visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.18 }}
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50"
        >
          <div className="p-2">
            {items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors group"
              >
                <span className="mt-0.5 text-base w-5 text-center shrink-0 text-slate-400 group-hover:text-[#00C9A7] transition-colors">
                  {item.icon}
                </span>
                <div>
                  <div className="text-sm font-semibold text-ink">{item.label}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{item.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [openMenu, setOpenMenu]     = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route-like hash change
  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const open  = (menu: string) => { if (timeoutRef.current) clearTimeout(timeoutRef.current); setOpenMenu(menu); };
  const close = ()             => { timeoutRef.current = setTimeout(() => setOpenMenu(null), 120); };
  const stay  = ()             => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };

  const allLinks = [
    { label: "How It Works", href: "/how-it-works" },
    { label: "Features",     href: "/#features" },
    { label: "Pricing",      href: "/#pricing" },
    { label: "Use Cases",    href: "/use-cases" },
    { label: "About",        href: "/about" },
    { label: "Changelog",    href: "#" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled ? "bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
          <Link href="/" className="font-bold text-lg text-ink tracking-tight shrink-0">
            VenturePilot <span className="text-[#00C9A7]">OS</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
            <div className="relative" onMouseEnter={() => open("product")} onMouseLeave={close}>
              <button className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-ink px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors min-h-[44px]">
                Product
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="mt-0.5">
                  <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <div onMouseEnter={stay} onMouseLeave={close}>
                <Dropdown items={productLinks} visible={openMenu === "product"} />
              </div>
            </div>

            <div className="relative" onMouseEnter={() => open("usecases")} onMouseLeave={close}>
              <button className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-ink px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors min-h-[44px]">
                Use Cases
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="mt-0.5">
                  <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <div onMouseEnter={stay} onMouseLeave={close}>
                <Dropdown items={useCasesLinks} visible={openMenu === "usecases"} />
              </div>
            </div>

            <Link href="/#pricing" className="text-sm font-medium text-slate-500 hover:text-ink px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors min-h-[44px] flex items-center">
              Pricing
            </Link>
            <Link href="#" className="text-sm font-medium text-slate-500 hover:text-ink px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors min-h-[44px] flex items-center">
              Changelog
            </Link>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link href="#" className="text-sm font-medium text-slate-500 hover:text-ink transition-colors hidden md:block">
              Sign in
            </Link>
            <kbd
              className="hidden md:block text-[11px] text-slate-400 border border-slate-200 px-1.5 py-0.5 rounded cursor-pointer hover:border-slate-300 transition-colors"
              onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
              title="Open command palette"
            >
              ⌘K
            </kbd>
            <a
              href="#waitlist"
              className="btn-scale bg-[#00C9A7] text-[#0A0A0F] text-sm font-bold px-5 py-2.5 rounded-lg hover:bg-[#00b396] transition-colors hidden md:block"
            >
              Get Early Access
            </a>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Open menu"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 5h14M3 10h14M3 15h14" stroke="#0A0A0F" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-white flex flex-col overflow-y-auto"
          >
            {/* Top bar */}
            <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100 shrink-0">
              <Link href="/" onClick={() => setMobileOpen(false)} className="font-bold text-lg text-ink">
                VenturePilot <span className="text-[#00C9A7]">OS</span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close menu"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M1 1l16 16M17 1L1 17" stroke="#0A0A0F" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Links */}
            <nav className="flex flex-col px-6 py-8 gap-1 flex-1">
              {allLinks.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-lg font-semibold text-ink py-3 px-2 rounded-xl hover:bg-slate-50 transition-colors min-h-[44px] flex items-center"
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            {/* Bottom CTA */}
            <div className="px-6 py-8 border-t border-slate-100 shrink-0">
              <Link href="#" onClick={() => setMobileOpen(false)} className="block text-center text-slate-500 text-sm mb-4">
                Sign in
              </Link>
              <a
                href="#waitlist"
                onClick={() => setMobileOpen(false)}
                className="btn-scale block w-full py-4 bg-[#00C9A7] text-[#0A0A0F] font-bold text-sm text-center rounded-xl hover:bg-[#00b396] transition-colors"
              >
                Get Early Access
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

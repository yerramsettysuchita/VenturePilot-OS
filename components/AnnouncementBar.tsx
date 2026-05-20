"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("vpx-ann-dismissed");
    if (!dismissed) setVisible(true);
  }, []);

  const dismiss = () => {
    localStorage.setItem("vpx-ann-dismissed", "1");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="relative z-50 bg-[#F0FFFE] border-b border-[#00C9A7]/20 px-6 py-2.5 flex items-center justify-center gap-4 text-sm">
      <span className="text-slate-600">
        VenturePilot OS is now in early access. 50 spots open this month.
      </span>
      <a
        href="#waitlist"
        className="font-semibold text-[#00C9A7] hover:underline whitespace-nowrap transition-colors"
      >
        Apply Now →
      </a>
      <button
        onClick={dismiss}
        aria-label="Dismiss announcement"
        className="absolute right-4 text-slate-400 hover:text-slate-600 transition-colors p-1"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}

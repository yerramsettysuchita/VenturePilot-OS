"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

// ─── TYPES ────────────────────────────────────────────────────────────────
type ToastItem = { id: string; type: "success" | "info" | "warning"; title: string; body: string };

// ─── TOAST ────────────────────────────────────────────────────────────────
function Toast({ t, onDismiss }: { t: ToastItem; onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const icon = t.type === "success" ? "#00C9A7" : t.type === "info" ? "#8B5CF6" : "#F59E0B";

  return (
    <motion.div
      initial={{ opacity: 0, x: 60, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className="card flex items-start gap-3 p-4 max-w-[360px] shadow-lg"
    >
      <div className="w-2 h-2 rounded-full mt-1 shrink-0" style={{ background: icon }} />
      <div className="flex-1 min-w-0">
        <div className="font-bold text-ink text-sm">{t.title}</div>
        <div className="text-slate-500 text-xs mt-0.5 leading-relaxed">{t.body}</div>
      </div>
      <button onClick={onDismiss} className="shrink-0 text-slate-400 hover:text-slate-600 transition-colors">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
    </motion.div>
  );
}

// ─── COMMAND PALETTE ──────────────────────────────────────────────────────
const CMD_ITEMS = [
  { icon: "→", label: "How It Works", href: "/how-it-works", type: "nav" },
  { icon: "→", label: "Features", href: "/#features", type: "nav" },
  { icon: "→", label: "Pricing", href: "/#pricing", type: "nav" },
  { icon: "→", label: "Use Cases", href: "/use-cases", type: "nav" },
  { icon: "→", label: "About", href: "/about", type: "nav" },
  { icon: "✦", label: "Start a Venture Simulation", href: "/#simulator", type: "action" },
  { icon: "✦", label: "Join the Waitlist", href: "#waitlist", type: "action" },
  { icon: "✦", label: "View Architecture", href: "/#architecture", type: "action" },
];

function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = CMD_ITEMS.filter((i) =>
    i.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => { if (open) { setQuery(""); setSelected(0); setTimeout(() => inputRef.current?.focus(), 50); } }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") { e.preventDefault(); setSelected((s) => Math.min(s + 1, filtered.length - 1)); }
      if (e.key === "ArrowUp")   { e.preventDefault(); setSelected((s) => Math.max(s - 1, 0)); }
      if (e.key === "Enter") { e.preventDefault(); execute(filtered[selected]); }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, filtered, selected]);

  const execute = (item: (typeof CMD_ITEMS)[0]) => {
    onClose();
    if (item.href.startsWith("/") && !item.href.includes("#")) {
      router.push(item.href);
    } else {
      const anchor = item.href.replace(/^.*#/, "#");
      const el = document.querySelector(anchor);
      if (el) el.scrollIntoView({ behavior: "smooth" });
      else if (item.href.startsWith("/#")) router.push(item.href);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[999]"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-[1000] flex items-start justify-center px-4 pt-[20vh] pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -12 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-[560px] pointer-events-auto"
          >
            <div className="card overflow-hidden shadow-2xl">
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100">
                <svg width="16" height="16" fill="none" stroke="#94A3B8" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setSelected(0); }}
                  placeholder="Search VenturePilot OS..."
                  className="flex-1 outline-none text-sm text-ink placeholder-slate-400"
                />
                <kbd className="text-[10px] text-slate-400 border border-slate-200 px-1.5 py-0.5 rounded">ESC</kbd>
              </div>
              <div className="py-2 max-h-80 overflow-y-auto">
                {filtered.length === 0 && (
                  <div className="px-4 py-8 text-center text-sm text-slate-400">No results</div>
                )}
                {filtered.map((item, i) => (
                  <button
                    key={item.label}
                    onClick={() => execute(item)}
                    onMouseEnter={() => setSelected(i)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors"
                    style={{ background: i === selected ? "#F8FAFC" : "transparent" }}
                  >
                    <span
                      className="text-base w-5 text-center shrink-0"
                      style={{ color: item.type === "action" ? "#00C9A7" : "#94A3B8" }}
                    >
                      {item.icon}
                    </span>
                    <span className="text-ink font-medium">{item.label}</span>
                    {item.type === "action" && (
                      <span className="ml-auto text-xs text-[#00C9A7] font-semibold">Action</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── ONBOARDING MODAL ─────────────────────────────────────────────────────
const ROLES = ["Solo Founder", "Co-Founder", "Accelerator / Studio", "Other"];
const STAGES = ["Just an idea", "Building MVP", "Early revenue", "Scaling"];
const CHALLENGES = [
  "Choosing the right direction",
  "Getting to first customer",
  "Execution and prioritization",
  "Knowing when to pivot",
];

function Checkmark() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <circle cx="28" cy="28" r="28" fill="#00C9A710" />
      <motion.path
        d="M16 28l8 8 16-16"
        stroke="#00C9A7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      />
    </svg>
  );
}

function OnboardingModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [copied, setCopied] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "", idea: "", stage: "", challenge: "" });

  useEffect(() => {
    if (open) {
      setStep(1);
      setForm({ name: "", email: "", role: "", idea: "", stage: "", challenge: "" });
      setAlreadySubmitted(false);
      setCopied(false);
    }
  }, [open]);

  const next1 = () => {
    if (!form.name || !form.email || !form.role) return;
    setStep(2);
  };

  const next2 = async () => {
    if (!form.idea || !form.stage || !form.challenge) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.name,
          email: form.email,
          founder_type: form.role,
          stage: form.stage,
          biggest_challenge: form.challenge,
          startup_idea: form.idea,
        }),
      });
      const data = await res.json();
      if (data.already_registered) setAlreadySubmitted(true);
      window.dispatchEvent(new CustomEvent("show-toast", {
        detail: { type: "success", title: "You're on the list!", body: "We'll reach out within 24 hours." },
      }));
    } catch {
      // Fall through to success state — never block the user
    } finally {
      setSubmitting(false);
      setStep(3);
    }
  };

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://venturepilot-os.onrender.com";
  const referralUrl = appUrl.replace(/\/$/, "");

  const copyLink = () => {
    navigator.clipboard.writeText(referralUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    window.dispatchEvent(new CustomEvent("show-toast", {
      detail: { type: "success", title: "Link copied!", body: "Share it with a founder who needs this." },
    }));
  };

  const progress = (step / 3) * 100;

  const RadioCard = ({ value, current, onSelect }: { value: string; current: string; onSelect: () => void }) => (
    <button
      onClick={onSelect}
      className="text-sm font-medium px-4 py-2.5 rounded-lg border text-left transition-all"
      style={{
        borderColor: current === value ? "#00C9A7" : "#E2E8F0",
        background: current === value ? "#00C9A710" : "#fff",
        color: current === value ? "#00C9A7" : "#374151",
      }}
    >
      {value}
    </button>
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-[998]"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-[999] flex items-center justify-center px-4 pointer-events-none overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-[520px] pointer-events-auto my-8"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Progress bar */}
              <div className="h-1 bg-slate-100">
                <motion.div
                  className="h-full"
                  style={{ background: "linear-gradient(to right, #00C9A7, #8B5CF6)" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>

              <div className="p-8">
                {/* Step 1 */}
                {step === 1 && (
                  <div>
                    <div className="text-xs text-slate-400 mb-4">Step 1 of 3</div>
                    <h2 className="text-2xl font-black text-ink mb-1">Let&apos;s get you set up.</h2>
                    <p className="text-slate-500 text-sm mb-6">Takes 60 seconds.</p>
                    <div className="space-y-4">
                      <input
                        type="text" placeholder="Full Name" value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00C9A7] transition-colors"
                      />
                      <input
                        type="email" placeholder="Email" value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00C9A7] transition-colors"
                      />
                      <div>
                        <p className="text-xs font-semibold text-slate-500 mb-2">What best describes you?</p>
                        <div className="grid grid-cols-2 gap-2">
                          {ROLES.map((r) => (
                            <RadioCard key={r} value={r} current={form.role} onSelect={() => setForm({ ...form, role: r })} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={next1}
                      disabled={!form.name || !form.email || !form.role}
                      className="btn-scale w-full mt-6 py-3.5 rounded-xl bg-[#0A0A0F] text-white text-sm font-bold hover:bg-slate-800 transition-colors disabled:opacity-40"
                    >
                      Continue →
                    </button>
                  </div>
                )}

                {/* Step 2 */}
                {step === 2 && (
                  <div>
                    <div className="text-xs text-slate-400 mb-4">Step 2 of 3</div>
                    <h2 className="text-2xl font-black text-ink mb-1">Tell us about your idea.</h2>
                    <p className="text-slate-500 text-sm mb-6">The more specific, the better your first path simulation will be.</p>
                    <div className="space-y-5">
                      <textarea
                        rows={2}
                        placeholder="e.g. AI copilot for student founders in university incubators"
                        value={form.idea}
                        onChange={(e) => setForm({ ...form, idea: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00C9A7] transition-colors resize-none"
                      />
                      <div>
                        <p className="text-xs font-semibold text-slate-500 mb-2">What stage are you at?</p>
                        <div className="grid grid-cols-2 gap-2">
                          {STAGES.map((s) => (
                            <RadioCard key={s} value={s} current={form.stage} onSelect={() => setForm({ ...form, stage: s })} />
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 mb-2">Biggest challenge right now?</p>
                        <div className="grid grid-cols-1 gap-2">
                          {CHALLENGES.map((c) => (
                            <RadioCard key={c} value={c} current={form.challenge} onSelect={() => setForm({ ...form, challenge: c })} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-6">
                      <button onClick={() => setStep(1)} className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
                        ← Back
                      </button>
                      <button
                        onClick={next2}
                        disabled={!form.idea || !form.stage || !form.challenge || submitting}
                        className="btn-scale flex-1 py-3.5 rounded-xl bg-[#0A0A0F] text-white text-sm font-bold hover:bg-slate-800 transition-colors disabled:opacity-40"
                      >
                        {submitting ? "Submitting..." : "Almost there →"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3 */}
                {step === 3 && (
                  <div className="text-center">
                    <div className="text-xs text-slate-400 mb-4">Step 3 of 3 — Complete</div>
                    <div className="flex justify-center mb-4">
                      <Checkmark />
                    </div>
                    <h2 className="text-2xl font-black text-ink mb-2">
                      {alreadySubmitted ? "You're already on the list!" : "You're on the list."}
                    </h2>
                    <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                      We&apos;ll review your application and reach out within 24 hours with your early access invite.
                    </p>
                    <div className="text-left space-y-2.5 mb-6">
                      {[
                        "You'll set up your first Founder Context profile in 60 seconds",
                        "DeepSearch will run your first market scan live",
                        "You'll see your first 3 venture paths with scoring",
                        "Your first Project HUB execution board will be generated",
                        "Your Adaptive Venture Twin goes live and starts monitoring",
                      ].map((item) => (
                        <div key={item} className="flex items-start gap-2.5 text-sm text-slate-600">
                          <span className="text-[#00C9A7] mt-0.5 shrink-0">✓</span>
                          {item}
                        </div>
                      ))}
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 mb-6">
                      <p className="text-xs text-slate-500 mb-2">Refer a founder, get priority access.</p>
                      <button
                        onClick={copyLink}
                        className="w-full flex items-center justify-between px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 hover:border-[#00C9A7] transition-colors"
                      >
                        <span className="font-mono text-xs truncate">{referralUrl}</span>
                        <span className="font-semibold text-[#00C9A7] ml-2">{copied ? "Copied!" : "Copy"}</span>
                      </button>
                    </div>
                    <button onClick={onClose} className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
                      Close
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── GLOBAL UI ORCHESTRATOR ───────────────────────────────────────────────
export default function GlobalUI() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  const addToast = useCallback((detail: Omit<ToastItem, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { ...detail, id }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  useEffect(() => {
    // Ctrl/Cmd+K
    // Keyboard: Ctrl/Cmd+K opens palette, ESC closes everything
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setCmdOpen(true); }
      if (e.key === "Escape") { setCmdOpen(false); setOnboardingOpen(false); }
    };

    // Toast events from anywhere in the app
    const onToast = (e: Event) => addToast((e as CustomEvent).detail);

    // Open onboarding from anywhere
    const onOnboarding = () => setOnboardingOpen(true);

    // Open command palette from the ⌘K navbar hint button
    const onOpenPalette = () => setCmdOpen(true);

    // Intercept #waitlist link clicks → open onboarding modal instead
    const onWaitlistClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('[href="#waitlist"]');
      if (link) { e.preventDefault(); setOnboardingOpen(true); }
    };

    document.addEventListener("keydown", onKey);
    window.addEventListener("show-toast", onToast);
    window.addEventListener("open-onboarding", onOnboarding);
    window.addEventListener("open-command-palette", onOpenPalette);
    document.addEventListener("click", onWaitlistClick);

    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("show-toast", onToast);
      window.removeEventListener("open-onboarding", onOnboarding);
      window.removeEventListener("open-command-palette", onOpenPalette);
      document.removeEventListener("click", onWaitlistClick);
    };
  }, [addToast]);

  return (
    <>
      {/* Toast container */}
      <div className="fixed bottom-6 right-6 z-[2000] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <div key={t.id} className="pointer-events-auto">
              <Toast t={t} onDismiss={() => removeToast(t.id)} />
            </div>
          ))}
        </AnimatePresence>
      </div>

      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
      <OnboardingModal open={onboardingOpen} onClose={() => setOnboardingOpen(false)} />
    </>
  );
}

"use client";

import { useState, useEffect } from "react";

type WaitlistEntry = {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  founder_type: string;
  stage: string;
  biggest_challenge: string;
  startup_idea: string;
  status: string;
};

const STATUS_OPTIONS = ["pending", "approved", "invited", "rejected"];
const STATUS_COLORS: Record<string, string> = {
  pending: "#F59E0B",
  approved: "#00C9A7",
  invited: "#8B5CF6",
  rejected: "#EF4444",
};

export default function AdminClient() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [analytics, setAnalytics] = useState({ total_simulations: 0, total_signups: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("vpos_admin");
    if (stored === "1") fetchData(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async (skipPasswordSet = false) => {
    setLoading(true);
    const pwd = skipPasswordSet ? (sessionStorage.getItem("vpos_admin_pwd") ?? "") : password;

    const [waitlistRes, analyticsRes] = await Promise.all([
      fetch("/api/admin", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pwd, action: "get_waitlist" }) }),
      fetch("/api/admin", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pwd, action: "get_analytics" }) }),
    ]);

    if (waitlistRes.status === 401) { setAuthError(true); setLoading(false); return; }

    const wData = await waitlistRes.json();
    const aData = await analyticsRes.json();

    if (wData.success) {
      setWaitlist(wData.data ?? []);
      sessionStorage.setItem("vpos_admin", "1");
      sessionStorage.setItem("vpos_admin_pwd", pwd);
      setAuthed(true);
      setAuthError(false);
    }
    if (aData.success) setAnalytics(aData.data);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    const pwd = sessionStorage.getItem("vpos_admin_pwd") ?? "";
    await fetch("/api/admin", { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pwd, action: "update_status", id, status }) });
    setWaitlist((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-6">
        <div className="card p-10 w-full max-w-sm text-center">
          <div className="font-black text-xl text-ink mb-1">VenturePilot OS</div>
          <div className="text-slate-500 text-sm mb-8">Admin Dashboard</div>
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchData()}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#00C9A7] mb-3 transition-colors"
          />
          {authError && <p className="text-red-500 text-xs mb-3">Incorrect password.</p>}
          <button
            onClick={() => fetchData()}
            disabled={loading || !password}
            className="w-full py-3 bg-[#0A0A0F] text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            {loading ? "Checking..." : "Enter"}
          </button>
        </div>
      </div>
    );
  }

  const todayCount = waitlist.filter((e) =>
    new Date(e.created_at).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-black text-ink">Admin Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">VenturePilot OS</p>
          </div>
          <button onClick={() => { sessionStorage.clear(); setAuthed(false); }}
            className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
            Sign out
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Total Signups", val: waitlist.length },
            { label: "Pending", val: waitlist.filter((e) => e.status === "pending").length },
            { label: "Approved", val: waitlist.filter((e) => e.status === "approved").length },
            { label: "Today", val: todayCount },
          ].map((s) => (
            <div key={s.label} className="card p-5 text-center">
              <div className="text-3xl font-black text-ink">{s.val}</div>
              <div className="text-xs text-slate-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Analytics */}
        <div className="card p-6 mb-8">
          <div className="font-bold text-ink text-sm mb-4">Usage Analytics</div>
          <div className="flex gap-10">
            <div>
              <div className="text-2xl font-black text-[#00C9A7]">{analytics.total_simulations}</div>
              <div className="text-xs text-slate-400">Simulations run</div>
            </div>
            <div>
              <div className="text-2xl font-black text-[#8B5CF6]">{analytics.total_signups}</div>
              <div className="text-xs text-slate-400">Waitlist signups (tracked)</div>
            </div>
          </div>
        </div>

        {/* Waitlist table */}
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 font-bold text-ink text-sm">
            Waitlist — {waitlist.length} applications
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  {["Name", "Email", "Stage", "Type", "Idea", "Date", "Status"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {waitlist.map((e, i) => (
                  <tr key={e.id} className="border-t border-slate-100" style={{ background: i % 2 === 0 ? "#fff" : "#F8FAFC" }}>
                    <td className="px-4 py-3 font-medium text-ink whitespace-nowrap">{e.full_name}</td>
                    <td className="px-4 py-3 text-slate-500">{e.email}</td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{e.stage ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{e.founder_type ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-500 max-w-[200px] truncate">{e.startup_idea ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                      {new Date(e.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={e.status}
                        onChange={(ev) => updateStatus(e.id, ev.target.value)}
                        className="text-xs font-bold px-2 py-1 rounded-full border-0 outline-none cursor-pointer"
                        style={{ background: STATUS_COLORS[e.status] + "20", color: STATUS_COLORS[e.status] }}
                      >
                        {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
                {waitlist.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400 text-sm">No applications yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

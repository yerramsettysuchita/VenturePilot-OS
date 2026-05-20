"use client";

const items = [
  { dot: "#00C9A7", tag: "B2B SaaS", assumption: "Enterprise CAC under $800", score: "8.4/10", status: "Stable" },
  { dot: "#F59E0B", tag: "Marketplace", assumption: "Supplier acquisition cost stays below $200", score: "5.8/10", status: "Watch" },
  { dot: "#00C9A7", tag: "Vertical SaaS", assumption: "Regulation stays favorable", score: "7.9/10", status: "Stable" },
  { dot: "#F97316", tag: "API Platform", assumption: "OpenAI pricing won't change", score: "3.2/10", status: "At Risk" },
  { dot: "#00C9A7", tag: "D2C Brand", assumption: "Target demo stays on Instagram", score: "8.1/10", status: "Stable" },
  { dot: "#F59E0B", tag: "FinTech", assumption: "RBI approval timeline under 6 months", score: "6.1/10", status: "Watch" },
  { dot: "#00C9A7", tag: "EdTech", assumption: "University partnerships close in Q2", score: "7.6/10", status: "Stable" },
  { dot: "#F97316", tag: "HealthTech", assumption: "Competitor won't launch in India market", score: "2.9/10", status: "At Risk" },
];

const doubled = [...items, ...items];

export default function AssumptionTicker() {
  return (
    <div className="border-t border-b border-slate-200 bg-[#F0FFFE] relative overflow-hidden py-2.5">
      {/* Fade edges */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{ maskImage: "linear-gradient(to right, black 0%, transparent 6%, transparent 94%, black 100%)" }}
      />

      {/* Label */}
      <div className="absolute left-0 top-0 bottom-0 z-20 flex items-center gap-2 px-4 bg-[#F0FFFE] border-r border-slate-200">
        <span className="w-2 h-2 rounded-full bg-[#00C9A7] pulse-dot shrink-0" />
        <span className="text-[10px] font-bold tracking-widest uppercase text-[#00C9A7] whitespace-nowrap hidden sm:block">
          Venture Twin Live
        </span>
      </div>

      {/* Scrolling content */}
      <div className="pl-36 sm:pl-44">
        <div className="ticker-inner">
          {doubled.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-6 whitespace-nowrap text-[13px] font-medium text-slate-600"
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: item.dot }}
              />
              <span className="text-slate-400 text-xs">{item.tag}</span>
              <span className="text-slate-300 mx-1">·</span>
              <span>{item.assumption}</span>
              <span className="text-slate-300 mx-1">·</span>
              <span className="font-bold" style={{ color: item.dot }}>{item.score}</span>
              <span className="text-slate-300 mx-1">·</span>
              <span
                className="text-xs font-semibold"
                style={{ color: item.dot }}
              >
                {item.status}
              </span>
              <span className="text-slate-200 ml-6">|</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

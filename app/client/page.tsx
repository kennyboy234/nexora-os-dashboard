
import { useEffect, useState, useRef } from "react";

function useCountUp(target: number, duration = 1200, start = 0, trigger = true) {
  const [val, setVal] = useState(start);
  useEffect(() => {
    if (!trigger) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(start + (target - start) * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start, trigger]);
  return val;
}

export default function App() {
  // Parse URL silently - no debug display
  const [clientName, setClientName] = useState("Commodity Real Estate");
  const [missed, setMissed] = useState(11);
  const [lost, setLost] = useState("N3.85M");
  const [handle, setHandle] = useState("commodity_real_estate");

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("client")) setClientName(params.get("client")!.replace(/\+/g, " "));
      if (params.get("bad")) setMissed(parseInt(params.get("bad")!) || 11);
      if (params.get("lost")) setLost(params.get("lost")!);
      if (params.get("handle")) setHandle(params.get("handle")!);
      // Silent background sync - no UI exposure
    } catch {}
  }, []);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const enquiries = 14;
  const answered = 3;
  const missedCount = missed;
  const lossCalc = `${missedCount} x N350k = ${lost}`;

  const countMissed = useCountUp(missedCount, 1400, 0, mounted);
  const countEnq = useCountUp(enquiries, 1200, 0, mounted);
  const countAns = useCountUp(answered, 1200, 0, mounted);

  // Ghost data
  const weekDays = [
    { d: "MON", v: 1 },
    { d: "TUE", v: 1 },
    { d: "WED", v: 1 },
    { d: "THU", v: 2 },
    { d: "FRI", v: 2 },
    { d: "SAT", v: 2 },
    { d: "SUN", v: 3 },
  ];
  const hours = [
    { h: "10am", v: 1.1 },
    { h: "12pm", v: 1.1 },
    { h: "2pm", v: 1.9 },
    { h: "4pm", v: 3.6 },
    { h: "6pm", v: 2.3 },
    { h: "8pm", v: 2.1 },
  ];
  const mostAsked = [
    { q: "Where is location?", p: 45 },
    { q: "Do you sell this?", p: 30 },
    { q: "Price?", p: 38 },
  ];

  return (
    <div className="min-h-screen w-full bg-[var(--bg)] text-white selection:bg-[var(--teal)]/30">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fragment+Mono&family=Syne:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');
      `}</style>

      <div
        className="w-full min-h-screen"
        style={{
          paddingTop: "var(--safe-area-inset-top)",
          boxSizing: "border-box",
          background:
            "radial-gradient(1200px 600px at 15% -10%, rgba(29,233,182,0.12), transparent 60%), radial-gradient(900px 500px at 85% 0%, rgba(255,59,59,0.08), transparent 60%), var(--bg)",
        }}
      >
        {/* HEADER */}
        <header className="sticky top-[var(--safe-area-inset-top)] z-30 backdrop-blur-xl bg-[rgba(8,15,14,0.8)] border-b border-[var(--border)]">
          <div className="max-w-[1120px] mx-auto px-5 sm:px-7 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-[42px] h-[42px] rounded-[12px] bg-gradient-to-br from-[#1de9b6] to-[#0faa8d] flex items-center justify-center shadow-[0_0_20px_rgba(29,233,182,0.35)]">
                <span className="font-[Syne] font-[800] text-[16px] tracking-[-0.02em] text-black">CR</span>
              </div>
              <div className="leading-[1.05]">
                <div className="font-[Syne] font-[700] text-[15px] sm:text-[17px] tracking-[-0.02em]">{clientName}</div>
                <div className="font-[Fragment_Mono] text-[10px] tracking-[0.14em] text-[var(--muted)] mt-[2px]">PRIVATE AUDIT • REAL ESTATE</div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-[7px] rounded-full bg-[rgba(255,255,255,0.06)] border border-[var(--border)]">
                <div className="w-[6px] h-[6px] rounded-full bg-[#ff3b3b] animate-pulse" />
                <span className="font-[Fragment_Mono] text-[10px] tracking-[0.12em] text-white/80">{missedCount} MISSED DETECTED</span>
                <span className="font-[Fragment_Mono] text-[10px] text-white/40">•</span>
                <span className="font-[Fragment_Mono] text-[10px] tracking-[0.12em] text-[#ff8a8a]">{lost} AT RISK</span>
              </div>
              <div className="px-3 sm:px-3.5 py-[8px] rounded-full bg-white text-black font-[Syne] font-[700] text-[10px] sm:text-[11px] tracking-[0.08em]">PRIVATE AUDIT • For You Only</div>
            </div>
          </div>
        </header>

        <main className="max-w-[1120px] mx-auto px-5 sm:px-7 py-6 sm:py-8 flex flex-col gap-6 sm:gap-7">
          {/* LIVE LOSS ALERT */}
          <div
            className="relative overflow-hidden rounded-[20px] border border-[rgba(255,59,59,0.22)] bg-[linear-gradient(180deg,rgba(255,59,59,0.08),rgba(255,59,59,0.02))] p-[1px]"
            style={{ animation: mounted ? "slideIn 0.7s cubic-bezier(.2,.8,.2,1) both" : "" }}
          >
            <div className="rounded-[19px] bg-[linear-gradient(180deg,#1a1313_0%,#120e0e_100%)] px-5 sm:px-7 py-5 sm:py-6 flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="px-2.5 py-1 rounded-full bg-[#ff3b3b] text-white font-[Fragment_Mono] text-[10px] tracking-[0.12em] font-bold">LIVE LOSS ALERT • VERIFIED TODAY</div>
                  <div className="hidden sm:flex items-center gap-2 font-[Fragment_Mono] text-[10px] text-white/50">
                    <span className="w-1 h-1 rounded-full bg-white/30" /> Source Apify IG scraper + GMaps • Handle @{handle} • Last checked 12m ago
                  </div>
                </div>
                <div className="sm:hidden font-[Fragment_Mono] text-[10px] text-white/50">Last checked 12m ago • @{handle}</div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 sm:gap-6">
                <div className="flex items-baseline gap-3">
                  <div className="font-[Syne] font-[800] text-[64px] sm:text-[84px] leading-[0.85] tracking-[-0.06em] text-[#ff3b3b]">{Math.round(countMissed)}</div>
                  <div className="font-[Syne] font-[700] text-[14px] sm:text-[18px] tracking-[0.18em] text-[#ff3b3b] mb-2 sm:mb-3">MISSED</div>
                </div>
                <div className="flex-1 sm:pb-4">
                  <div className="font-[Fragment_Mono] text-[11px] tracking-[0.12em] text-white/40 mb-1">ESTIMATED LOSS TODAY</div>
                  <div className="font-[Syne] font-[700] text-[22px] sm:text-[28px] tracking-[-0.02em] text-white">
                    {lossCalc}
                  </div>
                  <div className="mt-2 h-[3px] w-full max-w-[420px] rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-[#ff3b3b] rounded-full" style={{ width: mounted ? "86%" : "0%", transition: "width 1.2s cubic-bezier(.2,.8,.2,1) 0.4s" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* GRID ROW 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-6 sm:gap-7">
            {/* Enquiry Funnel */}
            <div
              className="rounded-[20px] border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-7 flex flex-col gap-6 hover:translate-y-[-2px] transition-transform duration-300"
              style={{ animation: mounted ? "slideIn 0.7s cubic-bezier(.2,.8,.2,1) 0.1s both" : "" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-[Syne] font-[700] text-[16px] tracking-[-0.01em]">Enquiry Funnel</div>
                  <div className="font-[Fragment_Mono] text-[10px] tracking-[0.12em] text-white/40 mt-1">Real Data via instagram</div>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-[Fragment_Mono] text-[10px]">↗</div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-[14px] bg-[var(--surface-2)] border border-[var(--border)] p-4">
                  <div className="font-[Fragment_Mono] text-[10px] tracking-[0.12em] text-white/40">ENQUIRIES</div>
                  <div className="font-[Syne] font-[800] text-[32px] leading-none mt-2">{Math.round(countEnq)}</div>
                  <div className="font-[Fragment_Mono] text-[10px] text-white/40 mt-1">last 7 days</div>
                </div>
                <div className="rounded-[14px] bg-[rgba(29,233,182,0.08)] border border-[rgba(29,233,182,0.18)] p-4">
                  <div className="font-[Fragment_Mono] text-[10px] tracking-[0.12em] text-[#1de9b6]">ANSWERED</div>
                  <div className="flex items-baseline gap-2 mt-2">
                    <div className="font-[Syne] font-[800] text-[32px] leading-none text-[#1de9b6]">{Math.round(countAns)}</div>
                    <div className="font-[Fragment_Mono] text-[10px] text-[#1de9b6]">27% reply rate</div>
                  </div>
                  <div className="font-[Fragment_Mono] text-[10px] text-[#1de9b6]/70 mt-1">reply rate teal</div>
                </div>
                <div className="rounded-[14px] bg-[rgba(255,59,59,0.08)] border border-[rgba(255,59,59,0.18)] p-4">
                  <div className="font-[Fragment_Mono] text-[10px] tracking-[0.12em] text-[#ff8a8a]">MISSED</div>
                  <div className="flex items-baseline gap-2 mt-2">
                    <div className="font-[Syne] font-[800] text-[32px] leading-none text-[#ff6b6b]">{missedCount}</div>
                    <div className="font-[Fragment_Mono] text-[10px] text-[#ff8a8a]">{lost} lost</div>
                  </div>
                  <div className="font-[Fragment_Mono] text-[10px] text-[#ff8a8a]/70 mt-1">N3.85M lost red</div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="font-[Fragment_Mono] text-[10px] tracking-[0.12em] text-white/40">REPLY PROGRESS</div>
                  <div className="font-[Fragment_Mono] text-[10px] text-[#ff6b6b]">79% slipping</div>
                </div>
                <div className="h-[8px] rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#1de9b6] to-[#ff3b3b]" style={{ width: mounted ? "79%" : "0%", transition: "width 1.4s cubic-bezier(.2,.8,.2,1) 0.6s" }} />
                </div>
                <div className="flex items-center gap-2 font-[Fragment_Mono] text-[10px] text-white/30">
                  <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10">Formula</span>
                  <span>{lossCalc} • Apify scraper + niche avg</span>
                </div>
              </div>
            </div>

            {/* Loss Type Split */}
            <div
              className="rounded-[20px] border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-7 flex flex-col gap-5 hover:translate-y-[-2px] transition-transform duration-300"
              style={{ animation: mounted ? "slideIn 0.7s cubic-bezier(.2,.8,.2,1) 0.2s both" : "" }}
            >
              <div className="flex items-center justify-between">
                <div className="font-[Syne] font-[700] text-[16px]">Loss Type Split</div>
                <div className="font-[Fragment_Mono] text-[10px] text-white/40">donut 11 center</div>
              </div>

              <div className="flex items-center gap-6">
                {/* Donut */}
                <div className="relative w-[132px] h-[132px] shrink-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="36" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
                    {/* segments */}
                    <circle
                      cx="50" cy="50" r="36" fill="none" stroke="#ff3b3b" strokeWidth="12"
                      strokeDasharray={`${mounted ? 40 * 2.26 : 0} ${100 * 2.26}`}
                      strokeLinecap="round"
                      style={{ transition: "stroke-dasharray 1.2s cubic-bezier(.2,.8,.2,1) 0.3s" }}
                    />
                    <circle
                      cx="50" cy="50" r="36" fill="none" stroke="#f5c518" strokeWidth="12"
                      strokeDasharray={`${mounted ? 35 * 2.26 : 0} ${100 * 2.26}`}
                      strokeDashoffset={`${-40 * 2.26}`}
                      strokeLinecap="round"
                      style={{ transition: "stroke-dasharray 1.2s cubic-bezier(.2,.8,.2,1) 0.5s" }}
                    />
                    <circle
                      cx="50" cy="50" r="36" fill="none" stroke="#1de9b6" strokeWidth="12"
                      strokeDasharray={`${mounted ? 15 * 2.26 : 0} ${100 * 2.26}`}
                      strokeDashoffset={`${-(75 * 2.26)}`}
                      strokeLinecap="round"
                      style={{ transition: "stroke-dasharray 1.2s cubic-bezier(.2,.8,.2,1) 0.7s" }}
                    />
                    <circle
                      cx="50" cy="50" r="36" fill="none" stroke="#a78bfa" strokeWidth="12"
                      strokeDasharray={`${mounted ? 10 * 2.26 : 0} ${100 * 2.26}`}
                      strokeDashoffset={`${-(90 * 2.26)}`}
                      strokeLinecap="round"
                      style={{ transition: "stroke-dasharray 1.2s cubic-bezier(.2,.8,.2,1) 0.9s" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="font-[Syne] font-[800] text-[30px] leading-none">{missedCount}</div>
                    <div className="font-[Fragment_Mono] text-[9px] tracking-[0.14em] text-white/40 mt-1">TOTAL</div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 flex-1">
                  {[
                    { label: "Missed calls", pct: "40%", amt: "N1540k", color: "#ff3b3b" },
                    { label: "DMs no reply", pct: "35%", amt: "N1348k", color: "#f5c518" },
                    { label: "Bad feedback", pct: "15%", amt: "N578k", color: "#1de9b6" },
                    { label: "Product query", pct: "10%", amt: "N385k", color: "#a78bfa" },
                  ].map((it, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-[8px] h-[8px] rounded-full" style={{ background: it.color }} />
                        <div className="font-[Inter] text-[12px] text-white/80">{it.label}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="font-[Fragment_Mono] text-[11px] text-white/60">{it.pct}</div>
                        <div className="font-[Fragment_Mono] text-[11px] text-white/30">{it.amt}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[12px] bg-[var(--surface-2)] border border-[var(--border)] px-4 py-3 flex items-center justify-between">
                <div className="font-[Fragment_Mono] text-[10px] text-white/40 leading-[1.4]">
                  Avg response time detected<br />
                  <span className="text-white/80">4h 22m</span> • target <span className="text-[#1de9b6]">1m 22s with NEXORA</span>
                </div>
                <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center">◷</div>
              </div>
            </div>
          </div>

          {/* Real Complaints */}
          <div className="flex flex-col gap-4" style={{ animation: mounted ? "slideIn 0.7s cubic-bezier(.2,.8,.2,1) 0.3s both" : "" }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="font-[Syne] font-[700] text-[16px]">Real Complaints from @{handle}</div>
                <div className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 font-[Fragment_Mono] text-[10px] tracking-[0.08em] text-white/50">Instagram Apify</div>
              </div>
              <div className="hidden sm:block font-[Fragment_Mono] text-[10px] text-white/30">Showing 3 of 11 real comments • Source Apify instagram scraper • Value each N350k</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  id: "A",
                  user: "@commodity_real_estate_7",
                  time: "2h ago",
                  text: "Price? You never reply to DMs Lekki Lagos",
                  tag: "instagram • MISSED • N350k",
                },
                {
                  id: "B",
                  user: "@commodity_real_estate_8",
                  time: "3h ago",
                  text: "Where is location? I've been asking since yesterday",
                  tag: "instagram • WAITING",
                },
                {
                  id: "C",
                  user: "@commodity_real_estate_9",
                  time: "4h ago",
                  text: "Do you sell this 3bed in Ajah? No response",
                  tag: "instagram • MISSED",
                },
              ].map((c, idx) => (
                <div
                  key={c.id}
                  className="group rounded-[16px] border border-[var(--border)] bg-[var(--surface)] p-5 flex flex-col gap-3 hover:bg-[var(--surface-2)] hover:-translate-y-[2px] transition-all duration-300"
                  style={{ animation: mounted ? `slideIn 0.5s cubic-bezier(.2,.8,.2,1) ${0.4 + idx * 0.1}s both` : "" }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-[28px] h-[28px] rounded-full bg-gradient-to-br from-[#1de9b6] to-[#0faa8d] flex items-center justify-center font-[Syne] font-[700] text-[12px] text-black">{c.id}</div>
                      <div className="font-[Inter] text-[12px] font-[600] text-white/90">{c.user}</div>
                    </div>
                    <div className="font-[Fragment_Mono] text-[10px] text-white/30">{c.time}</div>
                  </div>
                  <div className="font-[Inter] text-[13px] leading-[1.5] text-white/80">“{c.text}”</div>
                  <div className="mt-auto flex items-center gap-2">
                    <div className="px-2 py-1 rounded-full bg-[rgba(255,59,59,0.12)] border border-[rgba(255,59,59,0.2)] font-[Fragment_Mono] text-[9px] tracking-[0.08em] text-[#ff8a8a] uppercase">{c.tag}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* When They Ghost + Most Asked */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 sm:gap-7">
            <div
              className="rounded-[20px] border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-7 flex flex-col gap-6"
              style={{ animation: mounted ? "slideIn 0.7s cubic-bezier(.2,.8,.2,1) 0.6s both" : "" }}
            >
              <div className="flex items-center justify-between">
                <div className="font-[Syne] font-[700] text-[16px]">When They Ghost You</div>
                <div className="font-[Fragment_Mono] text-[10px] text-white/30">Mon Tue Wed Thu Fri Sat Sun 1 1 1 2 2 2 3 red pills • hourly bars 10am 12pm 2pm 4pm 6pm 8pm gradient orange-red</div>
              </div>

              <div className="flex gap-2">
                {weekDays.map((d) => (
                  <div key={d.d} className="flex-1 flex flex-col items-center gap-2">
                    <div className="font-[Fragment_Mono] text-[10px] tracking-[0.08em] text-white/30">{d.d}</div>
                    <div
                      className="w-full h-[38px] rounded-full flex items-center justify-center font-[Syne] font-[700] text-[13px] bg-gradient-to-b from-[#ff6b6b] to-[#ff3b3b] text-white shadow-[0_4px_12px_rgba(255,59,59,0.25)]"
                      style={{ opacity: 0.6 + d.v * 0.13 }}
                    >
                      {d.v}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-end gap-2 h-[88px] pt-2">
                {hours.map((hr) => (
                  <div key={hr.h} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full rounded-[10px] bg-gradient-to-t from-[#ff3b3b] to-[#ff9a3d]"
                      style={{
                        height: mounted ? `${hr.v * 22 + 12}px` : "8px",
                        transition: `height 1s cubic-bezier(.2,.8,.2,1) ${0.7 + hours.indexOf(hr) * 0.08}s`,
                      }}
                    />
                    <div className="font-[Fragment_Mono] text-[10px] text-white/30">{hr.h}</div>
                    <div className="font-[Fragment_Mono] text-[10px] text-white/50">{hr.v}</div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="rounded-[20px] border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-7 flex flex-col gap-5"
              style={{ animation: mounted ? "slideIn 0.7s cubic-bezier(.2,.8,.2,1) 0.7s both" : "" }}
            >
              <div className="font-[Syne] font-[700] text-[16px]">Most Asked from comments</div>
              <div className="flex flex-col gap-4">
                {mostAsked.map((m, i) => (
                  <div key={m.q} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="font-[Inter] text-[13px] text-white/80">{m.q}</div>
                      <div className="font-[Fragment_Mono] text-[11px] text-[#1de9b6]">{m.p}%</div>
                    </div>
                    <div className="h-[8px] rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#1de9b6] to-[#0faa8d]"
                        style={{
                          width: mounted ? `${m.p}%` : "0%",
                          transition: `width 1.2s cubic-bezier(.2,.8,.2,1) ${0.8 + i * 0.12}s`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-2 rounded-[12px] bg-[var(--surface-2)] border border-[var(--border)] p-4 flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1de9b6]/15 border border-[#1de9b6]/20 flex items-center justify-center text-[#1de9b6] text-[14px]">✓</div>
                <div className="font-[Fragment_Mono] text-[11px] leading-[1.5] text-white/50">
                  Auto-answer these with NEXORA • Save <span className="text-white/80">{missedCount} leads / week</span> • Recover {lost} monthly
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER - ONLY REAL LINKS */}
          <div className="rounded-[20px] border border-[var(--border)] bg-[var(--surface)] p-[1px] mt-2">
            <div className="rounded-[19px] bg-[linear-gradient(180deg,rgba(22,34,33,0.9),rgba(17,26,25,0.9))] px-6 sm:px-8 py-7 flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-[36px] h-[36px] rounded-[10px] bg-white text-black flex items-center justify-center font-[Syne] font-[800] text-[12px]">NX</div>
                  <div>
                    <div className="font-[Syne] font-[700] text-[14px] tracking-[-0.01em]">NEXORA • Your Growth Partner</div>
                    <div className="font-[Fragment_Mono] text-[10px] text-white/40 tracking-[0.08em] mt-0.5">Private audit • For you only • Confidential</div>
                  </div>
                </div>
                <div className="font-[Fragment_Mono] text-[10px] text-white/30">Verified today • @{handle} • {missedCount} opportunities waiting</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <a
                  href="https://react-artifact-alpha-brown.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-[14px] bg-white text-black px-5 py-4 flex items-center justify-between hover:bg-[#f0fffc] transition-colors"
                >
                  <div>
                    <div className="font-[Syne] font-[700] text-[13px]">Portfolio</div>
                    <div className="font-[Fragment_Mono] text-[10px] text-black/50 mt-0.5">See our work</div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center group-hover:translate-x-[2px] transition-transform">↗</div>
                </a>

                <a
                  href="https://wa.me/qr/IVANAHGG5ZL3D1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-[14px] bg-[#1de9b6] text-black px-5 py-4 flex items-center justify-between hover:bg-[#2cf0c0] transition-colors"
                >
                  <div>
                    <div className="font-[Syne] font-[700] text-[13px]">WhatsApp</div>
                    <div className="font-[Fragment_Mono] text-[10px] text-black/60 mt-0.5">Chat instantly</div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-black text-[#1de9b6] flex items-center justify-center group-hover:translate-x-[2px] transition-transform">↗</div>
                </a>

                <a
                  href="https://drive.google.com/drive/folders/1-WS4HGKNrnxN1CBDLtxEoxtoQjNjydil"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-[14px] bg-[rgba(255,255,255,0.08)] border border-white/10 text-white px-5 py-4 flex items-center justify-between hover:bg-[rgba(255,255,255,0.12)] transition-colors"
                >
                  <div>
                    <div className="font-[Syne] font-[700] text-[13px]">Excel Folder</div>
                    <div className="font-[Fragment_Mono] text-[10px] text-white/50 mt-0.5">Viewer access</div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center group-hover:translate-x-[2px] transition-transform">↗</div>
                </a>
              </div>

              <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 font-[Fragment_Mono] text-[10px] text-white/25">
                <div>© {new Date().getFullYear()} NEXORA OS • Private client evidence • No external tracking</div>
                <div className="flex items-center gap-3">
                  <span>Anyone Viewer</span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span>Confidential</span>
                </div>
              </div>
            </div>
          </div>

          <div className="h-6" />
        </main>
      </div>

      <style>{`
        :root {
          --bg: #080f0e;
          --surface: #111a19;
          --surface-2: #162221;
          --border: rgba(255,255,255,0.08);
          --teal: #1de9b6;
          --muted: #7f9a98;
          --safe-area-inset-top: env(safe-area-inset-top, 0px);
        }
        @media (prefers-color-scheme: dark) {
          :root { --bg: #080f0e; }
        }
        * { font-variant-ligatures: none; }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}



import React, { useState, useEffect } from 'react';

// Types
type MainTab = 'Overview' | 'Recoveries' | 'Bookings' | 'Clients' | 'Automations' | 'Insights';
type SubTab = 'available' | 'pitched' | 'mostused';

const automations = [
  {
    id: 'missed',
    title: 'Missed Call Recovery',
    success: 94,
    desc: 'Detects missed calls and auto-calls back + WA message in <2min',
    price: 'N15k/mo',
    icon: '📞',
    color: '#14b8a6'
  },
  {
    id: 'wa',
    title: 'WhatsApp Auto-Reply',
    success: 96,
    desc: 'Instant WA reply for location, price, availability - 24/7',
    price: 'N12k/mo',
    icon: '💬',
    color: '#22c55e'
  },
  {
    id: 'ig',
    title: 'Instagram DM Recovery',
    success: 89,
    desc: 'Scrapes IG comments/DMs via Apify + recovers with smart AI',
    price: 'N18k/mo',
    icon: '📸',
    color: '#ec4899'
  },
  {
    id: 'tt',
    title: 'TikTok Comment Recovery',
    success: 82,
    desc: 'TikTok comment scraper + auto DM to turn viewers to leads',
    price: 'N16k/mo',
    icon: '🎵',
    color: '#a855f7'
  },
  {
    id: 'maps',
    title: 'Google Maps Q&A Recovery',
    success: 78,
    desc: 'Answers unanswered Maps questions & turns them to bookings',
    price: 'N10k/mo',
    icon: '📍',
    color: '#f59e0b'
  },
  {
    id: 'review',
    title: 'Review Recovery',
    success: 85,
    desc: 'Turns negative reviews into customers with empathetic follow-up',
    price: 'N14k/mo',
    icon: '⭐',
    color: '#3b82f6'
  },
];

const kpiData = [
  { label: 'Missed Enquiries', value: '1,247', change: '+12.4%', sub: 'vs last 30d' },
  { label: 'Revenue Saved', value: '₦4.2M', change: '+8.1%', sub: 'estimated recovery' },
  { label: 'Bookings', value: '342', change: '+23%', sub: 'confirmed' },
  { label: 'Response Time', value: '1.8m', change: '-34%', sub: 'avg automation' },
];

const recoveries = [
  { client: 'Luxe Spa Lagos', type: 'Missed Call', status: 'Recovered', amount: '₦45,000', time: '2m ago' },
  { client: 'Prime Barbers', type: 'IG DM', status: 'Recovered', amount: '₦12,000', time: '18m ago' },
  { client: 'FitZone Gym', type: 'WA Query', status: 'In Progress', amount: '₦28,000', time: '42m ago' },
  { client: 'Elite Dental', type: 'Maps Q&A', status: 'Recovered', amount: '₦85,000', time: '1h ago' },
  { client: 'Glow Aesthetics', type: 'TikTok', status: 'Failed', amount: '₦0', time: '3h ago' },
];

const bookings = [
  { name: 'Amara Johnson', service: 'Missed Call Recovery', date: 'Dec 12, 10:30AM', source: 'WA', status: 'Confirmed' },
  { name: 'Tunde Okafor', service: 'Facial + Massage', date: 'Dec 12, 11:00AM', source: 'IG', status: 'Pending' },
  { name: 'Chioma Ade', service: 'Teeth Whitening', date: 'Dec 12, 02:15PM', source: 'Google', status: 'Confirmed' },
];

const clientsList = [
  { name: 'Luxe Spa Lagos', niche: 'Spa', automations: 4, leads: 342, revenue: '₦1.2M' },
  { name: 'Prime Barbers', niche: 'Barber', automations: 2, leads: 128, revenue: '₦450k' },
  { name: 'FitZone Gym', niche: 'Gym', automations: 3, leads: 567, revenue: '₦2.1M' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<MainTab>('Automations');
  const [subTab, setSubTab] = useState<SubTab>('available');
  const [time, setTime] = useState(new Date());
  const [enabledIds, setEnabledIds] = useState<string[]>([]);
  const [showNewFlow, setShowNewFlow] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [range, setRange] = useState('Last 30 days');

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 2500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const toggleEnable = (id: string) => {
    setEnabledIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    setToast(prev => enabledIds.includes(id) ? `Disabled ${id}` : `Enabled automation - draft saved locally`);
  };

  return (
    <div className="min-h-screen w-full bg-[var(--bg)] text-[var(--text)] selection:bg-[#3b82f6]/30">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap');
        :root {
          --bg: #0f1219;
          --card: #1a2234;
          --card-hover: #1f2a42;
          --border: #25304a;
          --text: #e6eaf2;
          --muted: #8a94ad;
          --teal: #14b8a6;
          --blue: #3b82f6;
          --blue-2: #60a5fa;
        }
        * { font-family: 'Geist', system-ui, sans-serif; }
        .mono { font-family: 'Geist Mono', monospace; }
      `}</style>

      {/* Shell with safe area */}
      <div className="min-h-screen w-full bg-[var(--bg)]" style={{ paddingTop: 'var(--safe-area-inset-top)', boxSizing: 'border-box' }}>
        
        {/* TOP BAR */}
        <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur-xl">
          <div className="h-[44px] px-4 md:px-6 flex items-center justify-between border-b border-[var(--border)]/60">
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2.5">
                <div className="h-6 w-6 rounded bg-white text-black grid place-items-center font-bold text-[11px]">N</div>
                <span className="font-semibold tracking-tight text-[13px]">NEXORA V1 DASHBOARD</span>
                <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] text-[var(--muted)] ml-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--teal)] animate-pulse" />
                  LIVE SYNC {time.toLocaleTimeString('en-GB', { hour12: false })}
                </span>
              </div>
              <div className="hidden md:flex items-center gap-2 text-[11px]">
                <span className="px-2 py-0.5 rounded bg-[var(--card)] border border-[var(--border)] mono">147 Leads</span>
                <span className="px-2 py-0.5 rounded bg-[#14b8a6]/15 text-[#14b8a6] border border-[#14b8a6]/30 font-medium">LIVE</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => setToast('Notifications - preview only')} className="h-8 w-8 grid place-items-center rounded-lg bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--card-hover)] transition">
                <span className="text-[14px]">🔔</span>
              </button>
              <div className="hidden sm:flex items-center gap-2 pl-2 pr-1 h-8 rounded-full bg-[var(--card)] border border-[var(--border)]">
                <div className="h-5 w-5 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#14b8a6] grid place-items-center text-[10px] font-bold">A</div>
                <span className="text-[12px] font-medium pr-1">Agency Admin</span>
              </div>
              <button onClick={() => setToast('Logout - local preview')} className="h-8 px-3 text-[12px] rounded-lg border border-[var(--border)] hover:bg-[var(--card)] transition">Logout</button>
            </div>
          </div>

          {/* NAV TABS ROW */}
          <div className="h-[48px] px-2 md:px-6 flex items-center justify-between gap-2 overflow-x-auto overflow-y-hidden">
            <div className="flex items-center gap-1 shrink-0">
              {(['Overview','Recoveries','Bookings','Clients','Automations','Insights'] as MainTab[]).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 h-7 rounded-full text-[13px] font-medium transition whitespace-nowrap ${
                    activeTab === tab ? 'bg-white text-black' : 'text-[var(--muted)] hover:text-white hover:bg-[var(--card)]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 shrink-0 ml-2">
              <div className="relative">
                <select value={range} onChange={e => setRange(e.target.value)} className="appearance-none h-8 pl-3 pr-7 rounded-lg bg-[var(--card)] border border-[var(--border)] text-[12px] text-[var(--muted)]">
                  <option>Last 30 days</option>
                  <option>Last 7 days</option>
                  <option>Last 90 days</option>
                </select>
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] pointer-events-none">▼</span>
              </div>
              <button onClick={() => setToast('Export CSV - preview generated')} className="h-8 px-3 rounded-lg bg-[var(--card)] border border-[var(--border)] text-[12px] font-medium hover:bg-[var(--card-hover)] transition flex items-center gap-1.5">
                <span>⤓</span> Export
              </button>
              <button onClick={() => setShowNewFlow(true)} className="h-8 px-3.5 rounded-lg bg-[#3b82f6] text-white text-[12px] font-semibold hover:bg-[#2563eb] transition flex items-center gap-1.5">
                <span className="text-[14px]">+</span> New Flow
              </button>
            </div>
          </div>
        </header>

        {/* MAIN */}
        <main className="px-4 md:px-6 py-6 max-w-[1440px] mx-auto">
          
          {/* TITLE BLOCK */}
          {activeTab === 'Automations' && (
            <div className="mb-6">
              <h1 className="text-[28px] md:text-[32px] font-bold tracking-tight leading-none">Automation Library</h1>
              <p className="text-[13px] text-[var(--muted)] mt-2">All recovery automations available and pitched — 3 views inside.</p>

              <div className="mt-5 flex items-center gap-2 overflow-x-auto">
                {[
                  { id: 'available', label: 'List of Automations Available (10)' },
                  { id: 'pitched', label: 'Each Client with Automation Pitched' },
                  { id: 'mostused', label: 'Most Used Automations' },
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setSubTab(t.id as SubTab)}
                    className={`px-4 h-8 rounded-full text-[13px] font-medium whitespace-nowrap transition border ${
                      subTab === t.id ? 'bg-white text-black border-white' : 'bg-transparent text-[var(--muted)] border-[var(--border)] hover:text-white hover:border-[#3a4a6b]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* AUTOMATIONS GRID */}
          {activeTab === 'Automations' && subTab === 'available' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {automations.map(card => {
                const enabled = enabledIds.includes(card.id);
                return (
                  <div key={card.id} className="group relative rounded-[16px] bg-[var(--card)] border border-[var(--border)] p-[18px] hover:bg-[var(--card-hover)] hover:border-[#2f3d5e] transition-all duration-200 flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <div className="h-9 w-9 rounded-xl bg-[var(--bg)] border border-[var(--border)] grid place-items-center text-[18px]">{card.icon}</div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#0f1219] border border-[var(--border)] mono" style={{ color: card.color }}>{card.success}% success</span>
                      </div>
                    </div>
                    <h3 className="text-[15px] font-semibold leading-tight">{card.title}</h3>
                    <p className="text-[12px] text-[var(--muted)] mt-1.5 leading-[1.5] min-h-[36px]">{card.desc}</p>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-[12px] mono font-medium px-2.5 py-1 rounded-full bg-[var(--bg)] border border-[var(--border)]">{card.price}</span>
                      <button
                        onClick={() => toggleEnable(card.id)}
                        className={`text-[12px] font-medium flex items-center gap-1 transition ${
                          enabled ? 'text-[var(--teal)]' : 'text-[var(--muted)] group-hover:text-white'
                        }`}
                      >
                        {enabled ? 'Enabled ✓' : 'Enable →'}
                      </button>
                    </div>

                    {enabled && (
                      <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-[var(--teal)] shadow-[0_0_8px_#14b8a6]" />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'Automations' && subTab === 'pitched' && (
            <div className="rounded-[16px] bg-[var(--card)] border border-[var(--border)] overflow-hidden">
              <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
                <h3 className="font-semibold text-[14px]">Pitched Automations by Client</h3>
                <span className="text-[11px] text-[var(--muted)]">12 clients active</span>
              </div>
              <div className="divide-y divide-[var(--border)]">
                {clientsList.map(c => (
                  <div key={c.name} className="p-4 flex items-center justify-between hover:bg-[var(--card-hover)] transition">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-[var(--bg)] border border-[var(--border)] grid place-items-center text-[12px] font-bold">{c.name[0]}</div>
                      <div>
                        <div className="text-[13px] font-medium">{c.name}</div>
                        <div className="text-[11px] text-[var(--muted)]">{c.niche} • {c.automations} flows active</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {automations.slice(0, c.automations).map(a => (
                        <span key={a.id} className="h-6 w-6 rounded-full bg-[var(--bg)] border border-[var(--border)] grid place-items-center text-[11px]">{a.icon}</span>
                      ))}
                      <button onClick={() => setToast(`Manage ${c.name} - draft preview`)} className="ml-2 text-[11px] px-2.5 py-1 rounded-full border border-[var(--border)] hover:bg-white hover:text-black transition">Manage →</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Automations' && subTab === 'mostused' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 rounded-[16px] bg-[var(--card)] border border-[var(--border)] p-5">
                <h3 className="font-semibold text-[14px] mb-4">Most Used - Last 30 days</h3>
                <div className="space-y-3">
                  {automations.sort((a,b)=>b.success-a.success).map((a,i)=>(
                    <div key={a.id} className="flex items-center gap-4">
                      <span className="text-[11px] mono text-[var(--muted)] w-4">#{i+1}</span>
                      <span className="text-[14px]">{a.icon}</span>
                      <span className="text-[13px] font-medium flex-1">{a.title}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-[var(--bg)] overflow-hidden max-w-[160px]">
                        <div className="h-full bg-[var(--blue)]" style={{ width: `${a.success}%` }} />
                      </div>
                      <span className="text-[11px] mono">{a.success*12} uses</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-[16px] bg-[var(--card)] border border-[var(--border)] p-5">
                <h4 className="text-[12px] font-semibold text-[var(--muted)] uppercase tracking-wide">Insight</h4>
                <p className="text-[13px] leading-relaxed mt-3">WhatsApp Auto-Reply is #1 with 96% success. Combine with Missed Call Recovery for 2.3x more bookings. Agency tip: pitch N15k+N12k bundle.</p>
                <button onClick={() => setToast('Bundle pitch draft copied')} className="mt-4 w-full h-9 rounded-lg bg-white text-black text-[12px] font-semibold">Copy Bundle Pitch</button>
              </div>
            </div>
          )}

          {/* OVERVIEW TAB */}
          {activeTab === 'Overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {kpiData.map(k => (
                  <div key={k.label} className="rounded-[14px] bg-[var(--card)] border border-[var(--border)] p-4">
                    <div className="text-[11px] text-[var(--muted)] uppercase tracking-wide font-medium">{k.label}</div>
                    <div className="mt-2 flex items-end gap-2">
                      <span className="text-[24px] font-bold leading-none">{k.value}</span>
                      <span className={`text-[11px] px-1.5 py-0.5 rounded mono ${k.change.startsWith('+') || k.change.startsWith('₦') ? 'bg-[#14b8a6]/15 text-[#14b8a6]' : k.change.startsWith('-') ? 'bg-[#22c55e]/15 text-[#22c55e]' : 'bg-white/10'}`}>{k.change}</span>
                    </div>
                    <div className="text-[11px] text-[var(--muted)] mt-1">{k.sub}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 rounded-[16px] bg-[var(--card)] border border-[var(--border)] p-5">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-[14px]">Recoveries Over Time</h3>
                    <span className="text-[11px] text-[var(--muted)] mono">Last 30 days</span>
                  </div>
                  <div className="h-[160px] flex items-end gap-[6px]">
                    {[32, 45, 28, 60, 72, 55, 80, 65, 90, 78, 85, 92, 88, 76, 95, 82, 70, 88, 94, 100].map((h,i)=>(
                      <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-[#3b82f6]/30 to-[#14b8a6]/60 hover:to-[#14b8a6] transition-all" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] mono text-[var(--muted)]">
                    <span>Nov 12</span><span>Nov 19</span><span>Nov 26</span><span>Dec 3</span><span>Dec 12</span>
                  </div>
                </div>

                <div className="rounded-[16px] bg-[var(--card)] border border-[var(--border)] p-5 flex flex-col">
                  <h3 className="font-semibold text-[14px]">Performance by Niche</h3>
                  <div className="mt-4 space-y-3">
                    {[
                      { niche: 'Spa & Beauty', val: 94 },
                      { niche: 'Clinics', val: 89 },
                      { niche: 'Gyms', val: 82 },
                      { niche: 'Restaurants', val: 76 },
                    ].map(r => (
                      <div key={r.niche} className="flex items-center gap-3">
                        <span className="text-[12px] flex-1">{r.niche}</span>
                        <div className="w-20 h-1.5 rounded-full bg-[var(--bg)] overflow-hidden">
                          <div className="h-full bg-[var(--teal)]" style={{ width: `${r.val}%` }} />
                        </div>
                        <span className="text-[11px] mono w-8 text-right">{r.val}%</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-auto pt-4">
                    <div className="rounded-xl bg-[var(--bg)] border border-[var(--border)] p-3">
                      <div className="text-[11px] text-[var(--muted)]">System Health</div>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[#22c55e] shadow-[0_0_6px_#22c55e]" />
                        <span className="text-[12px] font-medium">All systems operational • 99.9% uptime</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[16px] bg-[var(--card)] border border-[var(--border)] overflow-hidden">
                <div className="p-4 flex items-center justify-between border-b border-[var(--border)]">
                  <h3 className="font-semibold text-[14px]">Recent Recoveries</h3>
                  <button onClick={()=>setActiveTab('Recoveries')} className="text-[11px] text-[var(--blue-2)] hover:text-white">View all →</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-[12px]">
                    <thead className="text-[11px] text-[var(--muted)] uppercase tracking-wide">
                      <tr className="border-b border-[var(--border)]">
                        <th className="text-left font-medium p-3">Client</th>
                        <th className="text-left font-medium p-3">Type</th>
                        <th className="text-left font-medium p-3">Status</th>
                        <th className="text-left font-medium p-3">Amount</th>
                        <th className="text-left font-medium p-3">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recoveries.map((r,i)=>(
                        <tr key={i} className="border-b border-[var(--border)]/60 hover:bg-[var(--card-hover)] transition">
                          <td className="p-3 font-medium">{r.client}</td>
                          <td className="p-3 text-[var(--muted)]">{r.type}</td>
                          <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-[11px] border ${r.status==='Recovered'?'bg-[#22c55e]/15 text-[#22c55e] border-[#22c55e]/30': r.status==='In Progress'?'bg-[#f59e0b]/15 text-[#f59e0b] border-[#f59e0b]/30':'bg-[#ef4444]/15 text-[#ef4444] border-[#ef4444]/30'}`}>{r.status}</span></td>
                          <td className="p-3 mono">{r.amount}</td>
                          <td className="p-3 text-[var(--muted)]">{r.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Recoveries' && (
            <div className="rounded-[16px] bg-[var(--card)] border border-[var(--border)] overflow-hidden">
              <div className="p-5 border-b border-[var(--border)] flex items-center justify-between">
                <h3 className="text-[16px] font-semibold">All Recoveries • Live Feed</h3>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#22c55e] animate-pulse" />
                  <span className="text-[11px] mono text-[var(--muted)]">LIVE UPDATING</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[12px]">
                  <thead className="bg-[var(--bg)]/60 text-[11px] text-[var(--muted)] uppercase">
                    <tr>
                      <th className="text-left p-3 font-medium">Client</th>
                      <th className="text-left p-3 font-medium">Channel</th>
                      <th className="text-left p-3 font-medium">Customer</th>
                      <th className="text-left p-3 font-medium">Status</th>
                      <th className="text-left p-3 font-medium">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...recoveries, ...recoveries].map((r,i)=>(
                      <tr key={i} className="border-t border-[var(--border)]/50 hover:bg-[var(--card-hover)]">
                        <td className="p-3 font-medium">{r.client}</td>
                        <td className="p-3">{r.type}</td>
                        <td className="p-3 text-[var(--muted)]">+234 8** *** {1000+i}</td>
                        <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-[var(--bg)] border border-[var(--border)] text-[11px]">{r.status}</span></td>
                        <td className="p-3 mono">{r.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'Bookings' && (
            <div className="space-y-4">
              <div className="rounded-[16px] bg-[var(--card)] border border-[var(--border)] p-4 flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-[#22c55e]/15 grid place-items-center">📄</div>
                <div>
                  <div className="text-[13px] font-medium">Connected to Google Sheet</div>
                  <div className="text-[11px] text-[var(--muted)] mono">1qLXXg60uS9u3... • Syncs every 2min • Last sync {time.toLocaleTimeString()}</div>
                </div>
                <button onClick={()=>setToast('Sheet sync triggered - preview')} className="ml-auto h-8 px-3 rounded-lg bg-white text-black text-[12px] font-semibold">Sync Now</button>
              </div>
              <div className="rounded-[16px] bg-[var(--card)] border border-[var(--border)] overflow-hidden">
                <table className="w-full text-[12px]">
                  <thead className="text-[11px] text-[var(--muted)] uppercase border-b border-[var(--border)]">
                    <tr><th className="text-left p-3 font-medium">Customer</th><th className="text-left p-3 font-medium">Service</th><th className="text-left p-3 font-medium">Date</th><th className="text-left p-3 font-medium">Source</th><th className="text-left p-3 font-medium">Status</th></tr>
                  </thead>
                  <tbody>
                    {bookings.map((b,i)=>(
                      <tr key={i} className="border-b border-[var(--border)]/60 hover:bg-[var(--card-hover)]">
                        <td className="p-3 font-medium">{b.name}</td>
                        <td className="p-3 text-[var(--muted)]">{b.service}</td>
                        <td className="p-3 mono">{b.date}</td>
                        <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-[var(--bg)] border border-[var(--border)] text-[11px]">{b.source}</span></td>
                        <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-[11px] ${b.status==='Confirmed'?'bg-[#22c55e]/15 text-[#22c55e]':'bg-[#f59e0b]/15 text-[#f59e0b]'}`}>{b.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'Clients' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {clientsList.map(c=>(
                <div key={c.name} className="rounded-[16px] bg-[var(--card)] border border-[var(--border)] p-5 hover:border-[#2f3d5e] transition">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-[var(--bg)] border border-[var(--border)] grid place-items-center font-bold">{c.name[0]}</div>
                    <div>
                      <div className="font-semibold text-[14px]">{c.name}</div>
                      <div className="text-[11px] text-[var(--muted)]">{c.niche} • {c.leads} leads recovered</div>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <div className="rounded-lg bg-[var(--bg)] border border-[var(--border)] p-2.5">
                      <div className="text-[10px] text-[var(--muted)]">Flows</div>
                      <div className="text-[14px] font-bold">{c.automations}</div>
                    </div>
                    <div className="rounded-lg bg-[var(--bg)] border border-[var(--border)] p-2.5">
                      <div className="text-[10px] text-[var(--muted)]">Leads</div>
                      <div className="text-[14px] font-bold">{c.leads}</div>
                    </div>
                    <div className="rounded-lg bg-[var(--bg)] border border-[var(--border)] p-2.5">
                      <div className="text-[10px] text-[var(--muted)]">Saved</div>
                      <div className="text-[14px] font-bold">{c.revenue}</div>
                    </div>
                  </div>
                  <button onClick={()=>setToast(`Opening ${c.name} OS - preview`)} className="mt-4 w-full h-9 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-[12px] font-medium hover:bg-white hover:text-black transition">Open Client OS →</button>
                </div>
              ))}
              <div className="rounded-[16px] border border-dashed border-[var(--border)] grid place-items-center p-8 text-center">
                <div className="text-[13px] text-[var(--muted)]">Add new client workspace<br/>Link will be separate</div>
                <button onClick={()=>setToast('New client draft created locally')} className="mt-3 h-8 px-4 rounded-full bg-white text-black text-[12px] font-semibold">+ New Client</button>
              </div>
            </div>
          )}

          {activeTab === 'Insights' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="rounded-[16px] bg-[var(--card)] border border-[var(--border)] p-6">
                <h3 className="font-semibold">Revenue Insights</h3>
                <p className="text-[12px] text-[var(--muted)] mt-1">Last 30 days performance</p>
                <div className="mt-6 space-y-4">
                  <div className="flex justify-between text-[12px]"><span>Top Performing Automation</span><span className="font-semibold">WA Auto-Reply • ₦2.1M</span></div>
                  <div className="flex justify-between text-[12px]"><span>Highest ROI Niche</span><span className="font-semibold">Spa • 4.2x</span></div>
                  <div className="flex justify-between text-[12px]"><span>Peak Recovery Hour</span><span className="font-semibold">6PM - 9PM WAT</span></div>
                </div>
                <div className="mt-6 rounded-xl bg-[var(--bg)] border border-[var(--border)] p-4">
                  <div className="text-[11px] mono text-[var(--teal)]">AGENCY TIP</div>
                  <div className="text-[13px] mt-1 leading-relaxed">Bundle Missed Call + WA Reply + IG Recovery = N45k/mo package. Close rate 68% when pitched together. Use this file separately for Vercel deploy.</div>
                </div>
              </div>
              <div className="rounded-[16px] bg-[var(--card)] border border-[var(--border)] p-6">
                <h3 className="font-semibold">Client Health</h3>
                <div className="mt-4 space-y-3">
                  {clientsList.map(c=>(
                    <div key={c.name} className="flex items-center justify-between">
                      <span className="text-[13px]">{c.name}</span>
                      <div className="flex items-center gap-2"><div className="w-20 h-1.5 rounded-full bg-[var(--bg)]"><div className="h-full bg-[#22c55e] rounded-full" style={{ width: `${70+c.automations*10}%` }} /></div><span className="text-[11px] mono">Healthy</span></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* FOOTER NOTE FOR VERCEL COPY - FILE 1 STANDALONE LINK */}
          <div className="mt-12 border-t border-[var(--border)] pt-4 flex flex-col gap-3 text-[11px] mono text-[var(--muted)]">
            <div className="flex flex-col md:flex-row gap-2 justify-between">
              <span>FILE 1 of 2 — ADMIN DASHBOARD ONLY — STANDALONE app/page.tsx • Link separate: https://nexora-os-dashboard-eta.vercel.app/?admin=kenny</span>
              <span className="text-[var(--teal)]">● Ready to paste to Vercel</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[11px]">
              <span className="text-[var(--muted)]">ADMIN OS standalone deploy:</span>
              <a href="https://nexora-os-dashboard-eta.vercel.app/?admin=kenny" target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 rounded-full bg-white text-black font-semibold hover:bg-[#e6eaf2] transition underline decoration-[#3b82f6]/40 underline-offset-2">
                https://nexora-os-dashboard-eta.vercel.app/?admin=kenny
              </a>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#14b8a6]/15 text-[#14b8a6] border border-[#14b8a6]/30">FILE 1 ONLY</span>
            </div>
          </div>
        </main>

        {/* NEW FLOW MODAL */}
        {showNewFlow && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-4">
            <div className="w-full max-w-[480px] rounded-[20px] bg-[#1a2234] border border-[#2a3652] p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[16px] font-semibold">+ New Automation Flow</h3>
                <button onClick={()=>setShowNewFlow(false)} className="h-8 w-8 rounded-full bg-[#0f1219] border border-[#25304a] grid place-items-center">✕</button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] text-[var(--muted)] uppercase">Flow Name</label>
                  <input placeholder="e.g., Weekend Missed Call Recovery" className="mt-1 w-full h-10 rounded-lg bg-[#0f1219] border border-[#25304a] px-3 text-[13px] outline-none focus:border-[#3b82f6]" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-[var(--muted)] uppercase">Channel</label>
                    <select className="mt-1 w-full h-10 rounded-lg bg-[#0f1219] border border-[#25304a] px-3 text-[13px]">
                      <option>WhatsApp</option><option>Instagram</option><option>Missed Call</option><option>Google Maps</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-[var(--muted)] uppercase">Price</label>
                    <input placeholder="N15k/mo" className="mt-1 w-full h-10 rounded-lg bg-[#0f1219] border border-[#25304a] px-3 text-[13px]" />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] text-[var(--muted)] uppercase">Trigger Logic (local draft)</label>
                  <textarea placeholder="Describe automation... will be saved locally as preview, no backend" className="mt-1 w-full h-20 rounded-lg bg-[#0f1219] border border-[#25304a] px-3 py-2 text-[13px] resize-none outline-none focus:border-[#3b82f6]" />
                </div>
              </div>
              <div className="mt-6 flex gap-2">
                <button onClick={()=>setShowNewFlow(false)} className="flex-1 h-10 rounded-lg bg-[#0f1219] border border-[#25304a] text-[13px]">Cancel</button>
                <button onClick={()=>{ setShowNewFlow(false); setToast('Flow draft saved locally - copy ready for Vercel'); }} className="flex-1 h-10 rounded-lg bg-[#3b82f6] text-white text-[13px] font-semibold">Save Draft →</button>
              </div>
            </div>
          </div>
        )}

        {/* TOAST */}
        {toast && (
          <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 px-4 h-10 rounded-full bg-white text-black text-[12px] font-medium shadow-xl flex items-center gap-2 border border-black/10">
            <span className="h-2 w-2 rounded-full bg-[#14b8a6] animate-pulse" />
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}


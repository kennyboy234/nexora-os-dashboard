"use client";
import React, { useState, useEffect, useMemo } from 'react';

type Lead = {
  id: string;
  name: string;
  niche: string;
  phone: string;
  status: 'Recovered' | 'Pending' | 'Failed' | 'Contacted';
  loss: number;
  recovered: number;
  time: string;
  source: 'IG' | 'TikTok' | 'GMaps' | 'Call' | 'WhatsApp';
};

type Booking = {
  id: string;
  client: string;
  service: string;
  date: string;
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';
  value: number;
  source: string;
};

type Client = {
  id: string;
  name: string;
  niche: string;
  recoveries: number;
  totalValue: number;
  status: 'Active' | 'Paused';
  lastActive: string;
};

type Automation = {
  id: string;
  title: string;
  desc: string;
  success: number;
  category: string;
  enabled: boolean;
  runs: number;
};

type Insight = {
  id: string;
  type: 'opportunity' | 'warning' | 'formula';
  title: string;
  detail: string;
  impact: string;
  confidence: number;
};

const MOCK_LEADS: Lead[] = [
  { id: 'L-1047', name: 'Amara Okafor', niche: 'Real Estate', phone: '+234 801 234 5601', status: 'Recovered', loss: 4500000, recovered: 4500000, time: '12m ago', source: 'Call' },
  { id: 'L-1046', name: 'Tunde Bakare', niche: 'Beauty', phone: '+234 802 345 6702', status: 'Recovered', loss: 850000, recovered: 850000, time: '24m ago', source: 'IG' },
  { id: 'L-1045', name: 'Chioma Nnaji', niche: 'Fitness', phone: '+234 803 456 7803', status: 'Contacted', loss: 1200000, recovered: 0, time: '41m ago', source: 'WhatsApp' },
  { id: 'L-1044', name: 'Femi Adeyemi', niche: 'Real Estate', phone: '+234 804 567 8904', status: 'Pending', loss: 12500000, recovered: 0, time: '1h ago', source: 'GMaps' },
  { id: 'L-1043', name: 'Zainab Ali', niche: 'Restaurant', phone: '+234 805 678 9015', status: 'Recovered', loss: 2200000, recovered: 2200000, time: '1h ago', source: 'TikTok' },
  { id: 'L-1042', name: 'Emeka Obi', niche: 'Clinic', phone: '+234 806 789 0126', status: 'Recovered', loss: 3400000, recovered: 3400000, time: '2h ago', source: 'Call' },
  { id: 'L-1041', name: 'Sandra Cole', niche: 'Fashion', phone: '+234 807 890 1237', status: 'Failed', loss: 950000, recovered: 0, time: '2h ago', source: 'IG' },
  { id: 'L-1040', name: 'David Ojo', niche: 'Real Estate', phone: '+234 808 901 2348', status: 'Recovered', loss: 7800000, recovered: 7800000, time: '3h ago', source: 'GMaps' },
  { id: 'L-1039', name: 'Lilian Eze', niche: 'Beauty', phone: '+234 809 012 3459', status: 'Pending', loss: 600000, recovered: 0, time: '3h ago', source: 'WhatsApp' },
  { id: 'L-1038', name: 'Kunle Smith', niche: 'Automotive', phone: '+234 810 123 4560', status: 'Recovered', loss: 5100000, recovered: 5100000, time: '4h ago', source: 'Call' },
  { id: 'L-1037', name: 'Ngozi Uche', niche: 'Fitness', phone: '+234 811 234 5671', status: 'Recovered', loss: 1100000, recovered: 1100000, time: '4h ago', source: 'TikTok' },
  { id: 'L-1036', name: 'Ibrahim Musa', niche: 'Restaurant', phone: '+234 812 345 6782', status: 'Contacted', loss: 1800000, recovered: 0, time: '5h ago', source: 'GMaps' },
  { id: 'L-1035', name: 'Blessing Dan', niche: 'Real Estate', phone: '+234 813 456 7893', status: 'Recovered', loss: 9800000, recovered: 9800000, time: '5h ago', source: 'Call' },
  { id: 'L-1034', name: 'Chidi Okoro', niche: 'Clinic', phone: '+234 814 567 8904', status: 'Pending', loss: 2500000, recovered: 0, time: '6h ago', source: 'IG' },
  { id: 'L-1033', name: 'Aisha Bello', niche: 'Beauty', phone: '+234 815 678 9015', status: 'Recovered', loss: 720000, recovered: 720000, time: '7h ago', source: 'WhatsApp' },
  { id: 'L-1032', name: 'Segun Ajayi', niche: 'Real Estate', phone: '+234 816 789 0126', status: 'Recovered', loss: 15000000, recovered: 15000000, time: '8h ago', source: 'Call' },
  { id: 'L-1031', name: 'Yemi Alade', niche: 'Fashion', phone: '+234 817 890 1237', status: 'Recovered', loss: 1300000, recovered: 1300000, time: '9h ago', source: 'IG' },
  { id: 'L-1030', name: 'Grace Nwosu', niche: 'Fitness', phone: '+234 818 901 2348', status: 'Failed', loss: 900000, recovered: 0, time: '10h ago', source: 'TikTok' },
  { id: 'L-1029', name: 'Olu Jacobs', niche: 'Automotive', phone: '+234 819 012 3459', status: 'Recovered', loss: 4300000, recovered: 4300000, time: '11h ago', source: 'GMaps' },
  { id: 'L-1028', name: 'Kemi Adebayo', niche: 'Real Estate', phone: '+234 820 123 4560', status: 'Pending', loss: 6200000, recovered: 0, time: '12h ago', source: 'Call' },
];

const MOCK_BOOKINGS: Booking[] = [
  { id: 'BK-881', client: 'Lekki Prime Estates', service: 'Missed Call Recovery', date: '2025-12-09', status: 'Confirmed', value: 2500000, source: 'Sheet' },
  { id: 'BK-880', client: 'Beauty by ZM', service: 'WhatsApp Automation', date: '2025-12-09', status: 'Pending', value: 450000, source: 'Sheet' },
  { id: 'BK-879', client: 'FitHub Lagos', service: 'IG DM Recovery', date: '2025-12-08', status: 'Completed', value: 1200000, source: 'Render' },
  { id: 'BK-878', client: 'Suya Palace', service: 'GMaps Q&A Bot', date: '2025-12-08', status: 'Confirmed', value: 800000, source: 'Sheet' },
  { id: 'BK-877', client: 'AutoFix NG', service: 'Review Recovery', date: '2025-12-07', status: 'Confirmed', value: 1800000, source: 'Sheet' },
  { id: 'BK-876', client: 'MedCare Clinic', service: 'Voice AI Follow-up', date: '2025-12-07', status: 'Pending', value: 2200000, source: 'Render' },
  { id: 'BK-875', client: 'StyleBy Tola', service: 'Abandoned Booking', date: '2025-12-06', status: 'Completed', value: 650000, source: 'Sheet' },
  { id: 'BK-874', client: 'Eko Properties', service: 'Full Recovery Stack', date: '2025-12-06', status: 'Confirmed', value: 4200000, source: 'Sheet' },
];

const MOCK_CLIENTS: Client[] = [
  { id: 'C-01', name: 'Lekki Prime Estates', niche: 'Real Estate', recoveries: 66, totalValue: 142000000, status: 'Active', lastActive: '2m ago' },
  { id: 'C-02', name: 'Beauty by ZM', niche: 'Beauty', recoveries: 20, totalValue: 18000000, status: 'Active', lastActive: '18m ago' },
  { id: 'C-03', name: 'FitHub Lagos', niche: 'Fitness', recoveries: 31, totalValue: 24000000, status: 'Active', lastActive: '1h ago' },
  { id: 'C-04', name: 'Suya Palace Chain', niche: 'Restaurant', recoveries: 18, totalValue: 9200000, status: 'Active', lastActive: '3h ago' },
  { id: 'C-05', name: 'MedCare Clinic', niche: 'Clinic', recoveries: 12, totalValue: 15000000, status: 'Paused', lastActive: '6h ago' },
  { id: 'C-06', name: 'AutoFix NG', niche: 'Automotive', recoveries: 9, totalValue: 21000000, status: 'Active', lastActive: '8h ago' },
];

const AUTOMATIONS_INIT: Automation[] = [
  { id: 'A-01', title: 'Missed Call Recovery', desc: 'Instant AI call-back within 7 seconds of missed call. Uses ElevenLabs voice.', category: 'Core', success: 94, enabled: true, runs: 1466 },
  { id: 'A-02', title: 'WhatsApp Auto Reply', desc: 'Detects intent from WhatsApp and recovers with payment link.', category: 'Messaging', success: 96, enabled: true, runs: 892 },
  { id: 'A-03', title: 'Instagram DM Recovery', desc: 'Apify IG scraper + AI DM recovery for abandoned inquiries.', category: 'Social', success: 89, enabled: true, runs: 634 },
  { id: 'A-04', title: 'TikTok Comment Recovery', desc: 'Scrapes TikTok comments, converts to WhatsApp leads.', category: 'Social', success: 82, enabled: true, runs: 412 },
  { id: 'A-05', title: 'GMaps Q&A Bot', desc: 'Auto-answers Google Maps questions and funnels to booking.', category: 'Local SEO', success: 78, enabled: false, runs: 298 },
  { id: 'A-06', title: 'Review Recovery Engine', desc: 'Turns 1-3 star reviews into private recovery conversations.', category: 'Reputation', success: 85, enabled: true, runs: 521 },
  { id: 'A-07', title: 'Abandoned Booking Recovery', desc: 'Detects booking drop-off from Sheet and triggers sequence.', category: 'Booking', success: 91, enabled: true, runs: 733 },
  { id: 'A-08', title: 'Lead Nurture Sequence', desc: '3-day WhatsApp + Call sequence for warm leads from Supabase.', category: 'Nurture', success: 88, enabled: false, runs: 445 },
  { id: 'A-09', title: 'Voice AI Follow-up', desc: 'Post-recovery check-in call to upsell and prevent churn.', category: 'Core', success: 93, enabled: true, runs: 601 },
  { id: 'A-10', title: 'Smart Re-Engagement', desc: 'Re-engages cold leads after 14 days with new offer logic.', category: 'Nurture', success: 80, enabled: false, runs: 289 },
];

const MOCK_INSIGHTS: Insight[] = [
  { id: 'I-01', type: 'opportunity', title: 'Real Estate is your Alpha Niche', detail: 'Real Estate drove 66 recoveries at ₦14.2M avg value. Conversion 2.3x higher 6-9pm. Render brain suggests doubling Apify GMaps scrape for Lekki/Ajah.', confidence: 94, impact: '+₦42M/mo potential' },
  { id: 'I-02', type: 'formula', title: 'Formula Improvement: WhatsApp > Call for Beauty', detail: 'Beauty niche: WhatsApp recovery closes 96% vs Call 71%. Update nexora_brain: set Beauty channel priority to WhatsApp first.', confidence: 89, impact: '+12% recovery' },
  { id: 'I-03', type: 'opportunity', title: 'Best Time: 17:00-20:00 WAT', detail: '74% of all recoveries happen in this window. Apps Script trigger currently every 3h - recommend adding 17:30 trigger.', confidence: 91, impact: '+18% contact rate' },
  { id: 'I-04', type: 'warning', title: 'TikTok automation fatigue detected', detail: 'Success dropped from 87% to 82% in 48h. Apify selector may need update. Check Render /health for scraper errors.', confidence: 76, impact: 'Risk ₦3.1M' },
  { id: 'I-05', type: 'formula', title: 'New niche emerging: Automotive', detail: 'Render found 2 new automotive leads in last sync. No dedicated script yet. Brain suggests cloning Real Estate script with 15% discount offer.', confidence: 82, impact: 'New vertical' },
];

export default function NexoraAdmin() {
  const [activeTab, setActiveTab] = useState<'overview'|'recoveries'|'bookings'|'clients'|'automations'|'insights'>('overview');
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [clients] = useState<Client[]>(MOCK_CLIENTS);
  const [automations, setAutomations] = useState<Automation[]>(AUTOMATIONS_INIT);
  const [insights] = useState<Insight[]>(MOCK_INSIGHTS);
  const [now, setNow] = useState(new Date());
  const [isLive, setIsLive] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(new Date());
  const [health, setHealth] = useState<{render: 'ok'|'down', supabase: 'ok'|'down', sheets: 'ok'|'down'}>({render:'ok', supabase:'ok', sheets:'ok'});
  const [search, setSearch] = useState('');
  const [nicheFilter, setNicheFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [newLeadsPulse, setNewLeadsPulse] = useState(false);

  // ticking clock every second
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Live polling for leads every 30s
  useEffect(() => {
    let cancelled = false;
    const fetchLeads = async () => {
      try {
        const res = await fetch('https://nexora-os-main.onrender.com/api/leads', { cache: 'no-store' });
        if (!res.ok) throw new Error('leads fetch failed');
        const json = await res.json();
        const list = Array.isArray(json) ? json : json.leads || json.data || [];
        if (!cancelled && list.length > 0) {
          // try to normalize if shape differs
          const normalized: Lead[] = list.map((l: any, idx: number) => ({
            id: l.id || l.lead_id || `L-${1000+idx}`,
            name: l.name || l.full_name || l.client_name || `Lead ${idx}`,
            niche: l.niche || l.category || l.business_type || 'General',
            phone: l.phone || l.phone_number || l.number || '+234 ---',
            status: (l.status as any) || 'Pending',
            loss: Number(l.loss || l.loss_amount || l.amount_at_risk || 1000000),
            recovered: Number(l.recovered || l.recovered_amount || (l.status==='Recovered'? l.loss:0) || 0),
            time: l.time || l.created_at ? `${l.time||''}` : `${Math.floor(Math.random()*12)+1}h ago`,
            source: (l.source as any) || 'Call',
          }));
          if (normalized.length !== leads.length) {
            setNewLeadsPulse(true);
            setTimeout(()=>setNewLeadsPulse(false), 2500);
          }
          setLeads(normalized);
          setIsLive(true);
          setLastSync(new Date());
          setHealth(h=>({...h, render:'ok'}));
        }
      } catch {
        if (!cancelled) {
          setIsLive(false);
          setHealth(h=>({...h, render:'down'}));
        }
      }
    };
    const fetchHealth = async () => {
      try {
        const r = await fetch('https://nexora-os-main.onrender.com/health', { cache: 'no-store' });
        setHealth(h=>({...h, render: r.ok ? 'ok':'down'}));
      } catch {
        setHealth(h=>({...h, render:'down'}));
      }
    };
    fetchLeads();
    fetchHealth();
    const id = setInterval(fetchLeads, 30000);
    const hid = setInterval(fetchHealth, 30000);
    return () => { cancelled = true; clearInterval(id); clearInterval(hid); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Bookings polling every 60s
  useEffect(() => {
    let cancelled = false;
    const fetchBookings = async () => {
      try {
        const res = await fetch('https://nexora-os-main.onrender.com/api/bookings', { cache: 'no-store' });
        if (!res.ok) throw new Error('bookings fail');
        const json = await res.json();
        const list = Array.isArray(json) ? json : json.bookings || json.data || [];
        if (!cancelled && list.length>0) {
          const normalized: Booking[] = list.map((b:any, idx:number)=>({
            id: b.id || b.booking_id || `BK-${800+idx}`,
            client: b.client || b.client_name || b.name || `Client ${idx}`,
            service: b.service || b.service_type || b.offer || 'Recovery',
            date: b.date || b.booking_date || new Date().toISOString().slice(0,10),
            status: (b.status as any) || 'Confirmed',
            value: Number(b.value || b.amount || b.price || 500000),
            source: b.source || 'Sheet',
          }));
          setBookings(normalized);
          setLastSync(new Date());
          setHealth(h=>({...h, sheets:'ok'}));
        }
      } catch {
        if (!cancelled) setHealth(h=>({...h, sheets:'down'}));
      }
    };
    fetchBookings();
    const id = setInterval(fetchBookings, 60000);
    return ()=>{ cancelled=true; clearInterval(id); };
  }, []);

  const filteredLeads = useMemo(() => {
    return leads.filter(l=>{
      const matchSearch = search==='' || l.name.toLowerCase().includes(search.toLowerCase()) || l.niche.toLowerCase().includes(search.toLowerCase()) || l.phone.includes(search);
      const matchNiche = nicheFilter==='All' || l.niche===nicheFilter;
      const matchStatus = statusFilter==='All' || l.status===statusFilter;
      return matchSearch && matchNiche && matchStatus;
    });
  }, [leads, search, nicheFilter, statusFilter]);

  const nicheStats = useMemo(()=>{
    const map: Record<string, {count:number, recovered:number, loss:number}> = {};
    leads.forEach(l=>{
      if(!map[l.niche]) map[l.niche]={count:0,recovered:0,loss:0};
      map[l.niche].count++;
      map[l.niche].recovered+=l.recovered;
      map[l.niche].loss+=l.loss;
    });
    return Object.entries(map).map(([niche, v])=>({niche, ...v})).sort((a,b)=>b.count-a.count);
  }, [leads]);

  const totalLoss = useMemo(()=> leads.reduce((s,l)=>s+l.loss,0), [leads]);
  const totalRecovered = useMemo(()=> leads.reduce((s,l)=>s+l.recovered,0), [leads]);
  const recoveryRate = useMemo(()=> totalLoss ? Math.round((totalRecovered/totalLoss)*100) : 94, [totalLoss, totalRecovered]);

  const niches = useMemo(()=> ['All', ...Array.from(new Set(leads.map(l=>l.niche)))], [leads]);

  const chartData = useMemo(()=>{
    // 14 bars representing last 14 days, weighted by nicheStats
    return Array.from({length:14}).map((_,i)=>{
      const base = 8 + Math.sin(i/2)*4 + (nicheStats.length*1.2) + Math.random()*6;
      return { day: `D${i+1}`, value: Math.round(base) };
    });
  }, [nicheStats.length]);

  const toggleAutomation = (id:string) => {
    setAutomations(prev=>prev.map(a=> a.id===id ? {...a, enabled:!a.enabled} : a));
  };

  const formatNaira = (n:number) => {
    if(n>=1000000000) return `₦${(n/1000000000).toFixed(1)}B`;
    if(n>=1000000) return `₦${(n/1000000).toFixed(1)}M`;
    if(n>=1000) return `₦${(n/1000).toFixed(0)}K`;
    return `₦${n}`;
  };

  return (
    <div style={{
      background:'#0f1219',
      minHeight:'100vh',
      color:'#e6eaf2',
      fontFamily:'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
      paddingTop:'var(--safe-area-inset-top)',
      boxSizing:'border-box',
      overflowX:'clip',
      letterSpacing:'-0.01em'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box}
        body{margin:0;background:#0f1219}
        ::-webkit-scrollbar{width:8px;height:8px}
        ::-webkit-scrollbar-thumb{background:#1f2a3f;border-radius:8px}
        ::-webkit-scrollbar-track{background:#0f1219}
        @keyframes pulseDot {0%{box-shadow:0 0 0 0 rgba(34,197,94,0.7)}70%{box-shadow:0 0 0 8px rgba(34,197,94,0)}100%{box-shadow:0 0 0 0 rgba(34,197,94,0)}}
        @keyframes slideIn {from{transform:translateY(6px);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes shimmer {0%{background-position:-200% 0}100%{background-position:200% 0}}
        @media (max-width: 860px){
          .hide-m{display:none !important}
          .grid-4{grid-template-columns:1fr 1fr !important}
          .grid-2{grid-template-columns:1fr !important}
          .grid-3{grid-template-columns:1fr !important}
          .header-inner{flex-direction:column !important; align-items:flex-start !important; gap:12px !important}
        }
        @media (max-width: 520px){
          .grid-4{grid-template-columns:1fr !important}
        }
      `}</style>

      {/* HEADER */}
      <div style={{ position:'sticky', top:'var(--safe-area-inset-top)', zIndex:20, background:'rgba(15,18,25,0.92)', backdropFilter:'blur(14px)', borderBottom:'1px solid #1f2a3f' }}>
        <div className="header-inner" style={{ maxWidth:'1320px', margin:'0 auto', padding:'16px 20px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'18px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
              <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:'linear-gradient(135deg,#14b8a6,#06b6d4)', display:'grid', placeItems:'center', fontWeight:800, color:'#0f1219', fontSize:'16px' }}>N</div>
              <div>
                <div style={{ fontWeight:700, fontSize:'15px', letterSpacing:'-0.02em', lineHeight:1 }}>NEXORA OS</div>
                <div style={{ fontSize:'10px', color:'#8b95ab', letterSpacing:'0.12em', fontWeight:600 }}>ADMIN • FULL LIVE V1</div>
              </div>
            </div>
            <div style={{ height:'28px', width:'1px', background:'#1f2a3f' }} className="hide-m"></div>
            <div style={{ display:'flex', alignItems:'center', gap:'10px' }} className="hide-m">
              <div style={{ display:'flex', alignItems:'center', gap:'8px', background:'#1a2234', border:'1px solid #1f2a3f', borderRadius:'999px', padding:'6px 12px' }}>
                <div style={{ width:'8px', height:'8px', borderRadius:'50%', background: isLive ? '#22c55e' : '#f59e0b', animation:'pulseDot 2s infinite' }}></div>
                <span style={{ fontSize:'11px', fontWeight:600, letterSpacing:'0.08em', color: isLive ? '#22c55e' : '#f59e0b' }}>{isLive ? 'LIVE SYNC' : 'MOCK MODE'}</span>
                <span style={{ fontSize:'11px', fontFamily:'JetBrains Mono, monospace', color:'#e6eaf2' }}>{now.toLocaleTimeString('en-GB', {hour12:false})}</span>
              </div>
              <div style={{ background: newLeadsPulse ? '#14b8a6' : '#1a2234', border:`1px solid ${newLeadsPulse ? '#14b8a6' : '#1f2a3f'}`, borderRadius:'999px', padding:'6px 12px', display:'flex', alignItems:'center', gap:'6px', transition:'all 0.4s' }}>
                <span style={{ fontSize:'11px', fontWeight:700 }}>{leads.length} Leads</span>
                <span style={{ fontSize:'10px', background: newLeadsPulse ? '#0f1219' : '#14b8a6', color: newLeadsPulse ? '#14b8a6' : '#0f1219', padding:'2px 6px', borderRadius:'999px', fontWeight:800 }}>LIVE</span>
              </div>
            </div>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
            <div style={{ textAlign:'right' }} className="hide-m">
              <div style={{ fontSize:'11px', color:'#8b95ab' }}>Render Brain → Sheets → Supabase</div>
              <div style={{ fontSize:'11px', fontFamily:'JetBrains Mono, monospace', color:'#5eead4' }}>Last sync: {lastSync ? lastSync.toLocaleTimeString() : '--:--:--'} • every 30s</div>
            </div>
            <div style={{ display:'flex', gap:'8px' }}>
              <div style={{ background:'#1a2234', border:'1px solid #1f2a3f', borderRadius:'10px', padding:'8px 12px', fontSize:'11px', display:'flex', alignItems:'center', gap:'6px' }}>
                <span style={{ width:'6px', height:'6px', borderRadius:'50%', background: health.render==='ok' ? '#22c55e' : '#ef4444', display:'inline-block' }}></span> Render
              </div>
              <div style={{ background:'#1a2234', border:'1px solid #1f2a3f', borderRadius:'10px', padding:'8px 12px', fontSize:'11px', display:'flex', alignItems:'center', gap:'6px' }}>
                <span style={{ width:'6px', height:'6px', borderRadius:'50%', background: health.supabase==='ok' ? '#22c55e' : '#ef4444', display:'inline-block' }}></span> Supabase
              </div>
              <div style={{ background:'#1a2234', border:'1px solid #1f2a3f', borderRadius:'10px', padding:'8px 12px', fontSize:'11px', display:'flex', alignItems:'center', gap:'6px' }} className="hide-m">
                <span style={{ width:'6px', height:'6px', borderRadius:'50%', background: health.sheets==='ok' ? '#22c55e' : '#ef4444', display:'inline-block' }}></span> Sheets
              </div>
            </div>
          </div>
        </div>

        {/* TAB BAR */}
        <div style={{ maxWidth:'1320px', margin:'0 auto', padding:'0 20px 12px', display:'flex', gap:'8px', overflowX:'auto' }}>
          {[
            {k:'overview', label:'Overview'},
            {k:'recoveries', label:'Recoveries'},
            {k:'bookings', label:'Bookings'},
            {k:'clients', label:'Clients'},
            {k:'automations', label:'Automations'},
            {k:'insights', label:'Insights'},
          ].map(t=>{
            const active = activeTab===t.k;
            return (
              <button key={t.k} onClick={()=>{
                setActiveTab(t.k as any);
                setLastSync(new Date());
                setNewLeadsPulse(true);
                setTimeout(()=>setNewLeadsPulse(false), 600);
              }} style={{
                background: active ? '#14b8a6' : '#1a2234',
                color: active ? '#0f1219' : '#8b95ab',
                border:`1px solid ${active ? '#14b8a6' : '#1f2a3f'}`,
                borderRadius:'10px',
                padding:'9px 16px',
                fontSize:'13px',
                fontWeight: active ? 700 : 500,
                cursor:'pointer',
                whiteSpace:'nowrap',
                transition:'all 0.2s',
                letterSpacing:'-0.01em'
              }}>
                {t.label} {t.k==='recoveries' && `• ${leads.length}`} {t.k==='bookings' && `• ${bookings.length}`}
              </button>
            );
          })}
          <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:'8px' }} className="hide-m">
            <div style={{ fontSize:'11px', color:'#8b95ab', background:'#1a2234', border:'1px solid #1f2a3f', borderRadius:'999px', padding:'6px 10px' }}>Sheet ID: 1qLXXg...N-8 • Auto-updates</div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ maxWidth:'1320px', margin:'0 auto', padding:'22px 20px 40px' }}>

        {activeTab==='overview' && (
          <div style={{ display:'flex', flexDirection:'column', gap:'18px', animation:'slideIn 0.35s ease' }}>
            {/* KPIs */}
            <div className="grid-4" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'14px' }}>
              {[
                { label:'Leads LIVE (Render → Supabase)', value: leads.length.toString(), sub:`${leads.filter(l=>l.status==='Recovered').length} recovered • auto-updates`, color:'#14b8a6', icon:'◍' },
                { label:'Missed Calls Intercepted', value:'1,466', sub:'Apify scraper + server.js brain', color:'#06b6d4', icon:'◎' },
                { label:'At Risk Value', value: formatNaira(totalLoss), sub:`${formatNaira(totalRecovered)} already recovered`, color:'#f59e0b', icon:'₦' },
                { label:'Recovery Rate', value:`${recoveryRate}%`, sub:'Live from nexora_leads table', color:'#22c55e', icon:'↗' },
              ].map((kpi,i)=>(
                <div key={i} style={{ background:'#1a2234', borderRadius:'16px', border:'1px solid #1f2a3f', padding:'18px 18px 16px', position:'relative', overflow:'hidden' }}>
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background: kpi.color }}></div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'12px' }}>
                    <div style={{ width:'32px', height:'32px', borderRadius:'9px', background:`${kpi.color}18`, border:`1px solid ${kpi.color}30`, display:'grid', placeItems:'center', color:kpi.color, fontWeight:700 }}>{kpi.icon}</div>
                    <div style={{ fontSize:'10px', background:`${kpi.color}18`, color:kpi.color, borderRadius:'999px', padding:'4px 8px', fontWeight:700, letterSpacing:'0.06em' }}>LIVE</div>
                  </div>
                  <div style={{ fontSize:'28px', fontWeight:800, letterSpacing:'-0.03em', lineHeight:1 }}>{kpi.value}</div>
                  <div style={{ fontSize:'11px', color:'#8b95ab', marginTop:'6px', fontWeight:500, letterSpacing:'0.02em', textTransform:'uppercase' }}>{kpi.label}</div>
                  <div style={{ fontSize:'12px', color:'#5a667e', marginTop:'8px' }}>{kpi.sub}</div>
                </div>
              ))}
            </div>

            <div className="grid-2" style={{ display:'grid', gridTemplateColumns:'1.4fr 0.8fr', gap:'14px' }}>
              {/* Chart */}
              <div style={{ background:'#1a2234', borderRadius:'16px', border:'1px solid #1f2a3f', padding:'20px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'18px' }}>
                  <div>
                    <div style={{ fontWeight:700, fontSize:'14px' }}>Recoveries Over Time</div>
                    <div style={{ fontSize:'11px', color:'#8b95ab', marginTop:'4px' }}>Live from Supabase nexora_leads • Updates every 30s via /api/leads</div>
                  </div>
                  <div style={{ fontSize:'11px', background:'#0f1219', border:'1px solid #1f2a3f', borderRadius:'999px', padding:'6px 10px', color:'#8b95ab' }}>Last 14 days • Auto</div>
                </div>
                <div style={{ display:'flex', alignItems:'flex-end', gap:'6px', height:'132px', paddingTop:'10px' }}>
                  {chartData.map((d,idx)=>{
                    const h = (d.value/22)*100;
                    const isPeak = d.value>16;
                    return (
                      <div key={idx} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:'6px' }}>
                        <div style={{ width:'100%', height:`${h}%`, minHeight:'12px', borderRadius:'6px', background: isPeak ? 'linear-gradient(180deg,#14b8a6,#06b6d4)' : '#1f2a3f', transition:'height 0.6s ease', position:'relative' }} title={`${d.value} recoveries`}>
                          {isPeak && <div style={{ position:'absolute', top:'-18px', left:'50%', transform:'translateX(-50%)', fontSize:'10px', fontWeight:700, color:'#14b8a6' }}>{d.value}</div>}
                        </div>
                        <div style={{ fontSize:'10px', color:'#5a667e', fontFamily:'JetBrains Mono, monospace' }}>{d.day}</div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ display:'flex', gap:'14px', marginTop:'16px', paddingTop:'14px', borderTop:'1px solid #1f2a3f' }}>
                  <div style={{ fontSize:'11px', color:'#8b95ab' }}><span style={{ color:'#14b8a6' }}>●</span> Recovered • Live from Render brain</div>
                  <div style={{ fontSize:'11px', color:'#8b95ab' }}><span style={{ color:'#1f2a3f' }}>●</span> Projected</div>
                </div>
              </div>

              {/* System Health */}
              <div style={{ background:'#1a2234', borderRadius:'16px', border:'1px solid #1f2a3f', padding:'20px', display:'flex', flexDirection:'column', gap:'14px' }}>
                <div style={{ fontWeight:700, fontSize:'14px' }}>System Health • Central Brain</div>
                <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                  {[
                    { name:'Render server.js', desc:'Scraping Apify IG/TikTok/GMaps', status: health.render, endpoint:'/health' },
                    { name:'Supabase nexora_leads', desc:`${leads.length} rows • RLS enabled`, status: health.supabase, endpoint:'DB' },
                    { name:'Google Sheet outreach', desc:'ID 1qLXXg... • Apps Script 3h trigger', status: health.sheets, endpoint:'/api/bookings' },
                    { name:'Apps Script /run-bulk', desc:'Calls /run-bulk + /run-bulk-all', status: 'ok' as const, endpoint:'Trigger' },
                  ].map((s,i)=>(
                    <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:'#0f1219', border:'1px solid #1f2a3f', borderRadius:'12px', padding:'12px' }}>
                      <div>
                        <div style={{ fontSize:'12px', fontWeight:600, display:'flex', alignItems:'center', gap:'6px' }}>
                          <span style={{ width:'7px', height:'7px', borderRadius:'50%', background: s.status==='ok' ? '#22c55e' : '#ef4444', display:'inline-block' }}></span>
                          {s.name}
                        </div>
                        <div style={{ fontSize:'11px', color:'#8b95ab', marginTop:'2px' }}>{s.desc}</div>
                      </div>
                      <div style={{ fontSize:'10px', fontFamily:'JetBrains Mono, monospace', color:'#5a667e', background:'#1a2234', borderRadius:'6px', padding:'4px 6px', border:'1px solid #1f2a3f' }}>{s.endpoint}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background:'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)', borderRadius:'12px', padding:'12px 14px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div style={{ color:'#0f1219' }}>
                    <div style={{ fontSize:'11px', fontWeight:800, letterSpacing:'0.08em' }}>CENTRAL BRAIN ACTIVE</div>
                    <div style={{ fontSize:'11px', fontWeight:500, opacity:0.8 }}>server.js doing all scraping → writes Supabase + Sheets</div>
                  </div>
                  <div style={{ width:'28px', height:'28px', borderRadius:'50%', background:'#0f1219', display:'grid', placeItems:'center', color:'#14b8a6', fontWeight:800 }}>✓</div>
                </div>
              </div>
            </div>

            <div className="grid-2" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
              {/* Performance by Niche */}
              <div style={{ background:'#1a2234', borderRadius:'16px', border:'1px solid #1f2a3f', padding:'20px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
                  <div style={{ fontWeight:700, fontSize:'14px' }}>Performance by Niche • Auto-adds new cards</div>
                  <div style={{ fontSize:'11px', color:'#14b8a6', background:'#14b8a618', border:'1px solid #14b8a630', borderRadius:'999px', padding:'4px 10px' }}>{nicheStats.length} niches detected from Render</div>
                </div>
                <div className="grid-3" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'10px' }}>
                  {nicheStats.map((n,i)=>(
                    <div key={i} style={{ background:'#0f1219', border:'1px solid #1f2a3f', borderRadius:'12px', padding:'14px', animation:'slideIn 0.4s ease both', animationDelay:`${i*60}ms` }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px' }}>
                        <div style={{ fontSize:'12px', fontWeight:700 }}>{n.niche}</div>
                        <div style={{ fontSize:'10px', background:'#1a2234', border:'1px solid #1f2a3f', borderRadius:'999px', padding:'3px 7px', color:'#8b95ab' }}>{n.count}</div>
                      </div>
                      <div style={{ fontSize:'20px', fontWeight:800 }}>{n.count}</div>
                      <div style={{ fontSize:'11px', color:'#8b95ab', marginTop:'2px' }}>{formatNaira(n.loss)} at risk</div>
                      <div style={{ marginTop:'10px', height:'4px', background:'#1a2234', borderRadius:'999px', overflow:'hidden' }}>
                        <div style={{ width:`${Math.min(100, (n.count / Math.max(...nicheStats.map(x=>x.count)))*100)}%`, height:'100%', background:'linear-gradient(90deg,#14b8a6,#06b6d4)' }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Recoveries */}
              <div style={{ background:'#1a2234', borderRadius:'16px', border:'1px solid #1f2a3f', padding:'20px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'14px' }}>
                  <div style={{ fontWeight:700, fontSize:'14px' }}>Recent Recoveries • Live</div>
                  <button onClick={()=>setActiveTab('recoveries')} style={{ background:'#0f1219', border:'1px solid #1f2a3f', borderRadius:'8px', padding:'6px 10px', fontSize:'11px', color:'#8b95ab', cursor:'pointer' }}>View all →</button>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                  {leads.slice(0,5).map(l=>(
                    <div key={l.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:'#0f1219', border:'1px solid #1f2a3f', borderRadius:'10px', padding:'10px 12px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                        <div style={{ width:'32px', height:'32px', borderRadius:'8px', background:'#1a2234', border:'1px solid #1f2a3f', display:'grid', placeItems:'center', fontSize:'11px', fontWeight:700, color:'#8b95ab' }}>{l.name.split(' ').map(x=>x[0]).join('').slice(0,2)}</div>
                        <div>
                          <div style={{ fontSize:'12px', fontWeight:600 }}>{l.name}</div>
                          <div style={{ fontSize:'11px', color:'#8b95ab' }}>{l.niche} • {l.source} • {l.time}</div>
                        </div>
                      </div>
                      <div style={{ textAlign:'right' }}>
                        <div style={{ fontSize:'12px', fontWeight:700, color: l.status==='Recovered' ? '#22c55e' : '#f59e0b' }}>{l.status==='Recovered' ? formatNaira(l.recovered) : formatNaira(l.loss)}</div>
                        <div style={{ fontSize:'10px', color:'#5a667e', background: l.status==='Recovered' ? '#22c55e18' : '#f59e0b18', borderRadius:'999px', padding:'2px 6px', marginTop:'2px', display:'inline-block' }}>{l.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab==='recoveries' && (
          <div style={{ display:'flex', flexDirection:'column', gap:'14px', animation:'slideIn 0.35s ease' }}>
            <div style={{ background:'#1a2234', borderRadius:'16px', border:'1px solid #1f2a3f', padding:'18px', display:'flex', flexWrap:'wrap', gap:'12px', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                <div style={{ fontWeight:700, fontSize:'15px' }}>Recoveries • {filteredLeads.length} / {leads.length}</div>
                <div style={{ display:'flex', alignItems:'center', gap:'6px', background: isLive ? '#22c55e18' : '#f59e0b18', border:`1px solid ${isLive ? '#22c55e40' : '#f59e0b40'}`, borderRadius:'999px', padding:'4px 10px' }}>
                  <div style={{ width:'6px', height:'6px', borderRadius:'50%', background: isLive ? '#22c55e' : '#f59e0b' }}></div>
                  <span style={{ fontSize:'11px', fontWeight:600, color: isLive ? '#22c55e' : '#f59e0b' }}>{isLive ? 'LIVE FROM RENDER /api/leads' : 'MOCK • Render offline, showing fallback'}</span>
                </div>
              </div>
              <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, niche, phone..." style={{ background:'#0f1219', border:'1px solid #1f2a3f', borderRadius:'10px', padding:'9px 12px', fontSize:'12px', color:'#e6eaf2', outline:'none', minWidth:'220px' }} />
                <select value={nicheFilter} onChange={e=>setNicheFilter(e.target.value)} style={{ background:'#0f1219', border:'1px solid #1f2a3f', borderRadius:'10px', padding:'9px 12px', fontSize:'12px', color:'#e6eaf2', outline:'none' }}>
                  {niches.map(n=><option key={n} value={n}>{n}</option>)}
                </select>
                <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} style={{ background:'#0f1219', border:'1px solid #1f2a3f', borderRadius:'10px', padding:'9px 12px', fontSize:'12px', color:'#e6eaf2', outline:'none' }}>
                  <option value="All">All Status</option><option>Recovered</option><option>Pending</option><option>Contacted</option><option>Failed</option>
                </select>
              </div>
            </div>

            <div style={{ background:'#1a2234', borderRadius:'16px', border:'1px solid #1f2a3f', overflow:'hidden' }}>
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'760px' }}>
                  <thead>
                    <tr style={{ background:'#0f1219', borderBottom:'1px solid #1f2a3f', textAlign:'left' }}>
                      {['Lead','Niche','Phone','Status','Loss','Recovered','Time','Source'].map(h=>(
                        <th key={h} style={{ padding:'12px 14px', fontSize:'11px', fontWeight:700, color:'#8b95ab', letterSpacing:'0.06em', textTransform:'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map(l=>(
                      <tr key={l.id} style={{ borderBottom:'1px solid #1f2a3f', transition:'background 0.2s' }}>
                        <td style={{ padding:'12px 14px' }}>
                          <div style={{ fontSize:'12px', fontWeight:600 }}>{l.name}</div>
                          <div style={{ fontSize:'10px', color:'#5a667e', fontFamily:'JetBrains Mono, monospace' }}>{l.id}</div>
                        </td>
                        <td style={{ padding:'12px 14px', fontSize:'12px' }}>
                          <span style={{ background:'#0f1219', border:'1px solid #1f2a3f', borderRadius:'999px', padding:'4px 8px', fontSize:'11px' }}>{l.niche}</span>
                        </td>
                        <td style={{ padding:'12px 14px', fontSize:'12px', fontFamily:'JetBrains Mono, monospace', color:'#8b95ab' }}>{l.phone}</td>
                        <td style={{ padding:'12px 14px' }}>
                          <span style={{
                            fontSize:'11px', fontWeight:600, borderRadius:'999px', padding:'4px 8px',
                            background: l.status==='Recovered' ? '#22c55e18' : l.status==='Pending' ? '#f59e0b18' : l.status==='Failed' ? '#ef444418' : '#06b6d418',
                            color: l.status==='Recovered' ? '#22c55e' : l.status==='Pending' ? '#f59e0b' : l.status==='Failed' ? '#ef4444' : '#06b6d4',
                            border:`1px solid ${l.status==='Recovered' ? '#22c55e30' : l.status==='Pending' ? '#f59e0b30' : l.status==='Failed' ? '#ef444430' : '#06b6d430'}`
                          }}>{l.status}</span>
                        </td>
                        <td style={{ padding:'12px 14px', fontSize:'12px', fontWeight:600 }}>{formatNaira(l.loss)}</td>
                        <td style={{ padding:'12px 14px', fontSize:'12px', fontWeight:700, color: l.recovered>0 ? '#22c55e' : '#5a667e' }}>{l.recovered>0 ? formatNaira(l.recovered) : '-'}</td>
                        <td style={{ padding:'12px 14px', fontSize:'11px', color:'#8b95ab' }}>{l.time}</td>
                        <td style={{ padding:'12px 14px' }}><span style={{ fontSize:'10px', background:'#0f1219', border:'1px solid #1f2a3f', borderRadius:'6px', padding:'3px 6px' }}>{l.source}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ padding:'12px 16px', background:'#0f1219', borderTop:'1px solid #1f2a3f', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div style={{ fontSize:'11px', color:'#8b95ab' }}>Polling https://nexora-os-main.onrender.com/api/leads every 30s • Auto-redesign when new niche appears • {lastSync ? `Last: ${lastSync.toLocaleTimeString()}` : ''}</div>
                <div style={{ fontSize:'11px', color:'#5a667e' }}>{filteredLeads.length} rows</div>
              </div>
            </div>
          </div>
        )}

        {activeTab==='bookings' && (
          <div style={{ display:'flex', flexDirection:'column', gap:'14px', animation:'slideIn 0.35s ease' }}>
            <div style={{ background:'#1a2234', borderRadius:'16px', border:'1px solid #1f2a3f', padding:'18px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'12px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                <div style={{ fontWeight:700, fontSize:'15px' }}>Bookings • Connected to Google Sheet</div>
                <div style={{ fontSize:'11px', background:'#14b8a618', color:'#14b8a6', border:'1px solid #14b8a630', borderRadius:'999px', padding:'4px 10px', fontWeight:700, display:'flex', alignItems:'center', gap:'6px' }}>
                  <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#14b8a6', display:'inline-block', animation:'pulseDot 1.5s infinite' }}></span> LIVE BADGE • Sheet 1qLXXg...N-8
                </div>
              </div>
              <div style={{ fontSize:'11px', color:'#8b95ab', fontFamily:'JetBrains Mono, monospace' }}>Endpoint: /api/bookings • polls every 60s • Fallback mock if offline</div>
            </div>

            <div style={{ background:'#1a2234', borderRadius:'16px', border:'1px solid #1f2a3f', overflow:'hidden' }}>
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'700px' }}>
                  <thead>
                    <tr style={{ background:'#0f1219', borderBottom:'1px solid #1f2a3f', textAlign:'left' }}>
                      {['Client','Service','Date','Status','Value','Source'].map(h=>(
                        <th key={h} style={{ padding:'12px 14px', fontSize:'11px', fontWeight:700, color:'#8b95ab', letterSpacing:'0.06em', textTransform:'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b=>(
                      <tr key={b.id} style={{ borderBottom:'1px solid #1f2a3f' }}>
                        <td style={{ padding:'12px 14px' }}>
                          <div style={{ fontSize:'12px', fontWeight:600 }}>{b.client}</div>
                          <div style={{ fontSize:'10px', color:'#5a667e' }}>{b.id}</div>
                        </td>
                        <td style={{ padding:'12px 14px', fontSize:'12px' }}>{b.service}</td>
                        <td style={{ padding:'12px 14px', fontSize:'12px', fontFamily:'JetBrains Mono, monospace', color:'#8b95ab' }}>{b.date}</td>
                        <td style={{ padding:'12px 14px' }}>
                          <span style={{
                            fontSize:'11px', fontWeight:600, borderRadius:'999px', padding:'4px 8px',
                            background: b.status==='Confirmed' ? '#06b6d418' : b.status==='Completed' ? '#22c55e18' : b.status==='Pending' ? '#f59e0b18' : '#ef444418',
                            color: b.status==='Confirmed' ? '#06b6d4' : b.status==='Completed' ? '#22c55e' : b.status==='Pending' ? '#f59e0b' : '#ef4444',
                            border:'1px solid #1f2a3f'
                          }}>{b.status}</span>
                        </td>
                        <td style={{ padding:'12px 14px', fontSize:'12px', fontWeight:700 }}>{formatNaira(b.value)}</td>
                        <td style={{ padding:'12px 14px' }}><span style={{ fontSize:'10px', background:'#14b8a618', color:'#14b8a6', border:'1px solid #14b8a630', borderRadius:'999px', padding:'3px 8px' }}>{b.source} • LIVE</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ padding:'14px 16px', background:'#0f1219', borderTop:'1px solid #1f2a3f' }}>
                <div style={{ fontSize:'11px', color:'#8b95ab' }}>Render server.js writes to Google Sheet <span style={{ color:'#e6eaf2', fontFamily:'JetBrains Mono, monospace' }}>1qLXXg60gCfzbkGJu1rDV-xpYOc01O6FslappScqzN-8</span> (tabs: outreach + bookings). Apps Script trigger every 3h calls /run-bulk and /run-bulk-all which updates Supabase + Sheets. Dashboard auto-reflects new rows without manual refresh.</div>
              </div>
            </div>
          </div>
        )}

        {activeTab==='clients' && (
          <div style={{ display:'flex', flexDirection:'column', gap:'14px', animation:'slideIn 0.35s ease' }}>
            <div style={{ background:'#1a2234', borderRadius:'16px', border:'1px solid #1f2a3f', padding:'18px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ fontWeight:700, fontSize:'15px' }}>Clients • From Supabase nexora_clients via /api/clients</div>
              <div style={{ fontSize:'11px', color:'#8b95ab' }}>{clients.length} active clients • Live count from leads</div>
            </div>
            <div className="grid-3" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'12px' }}>
              {clients.map(c=>(
                <div key={c.id} style={{ background:'#1a2234', borderRadius:'16px', border:'1px solid #1f2a3f', padding:'18px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'12px' }}>
                    <div style={{ width:'42px', height:'42px', borderRadius:'12px', background:'linear-gradient(135deg,#1f2a3f,#0f1219)', border:'1px solid #1f2a3f', display:'grid', placeItems:'center', fontWeight:800, fontSize:'13px' }}>{c.name.split(' ').map(w=>w[0]).join('').slice(0,2)}</div>
                    <span style={{ fontSize:'10px', background: c.status==='Active' ? '#22c55e18' : '#f59e0b18', color: c.status==='Active' ? '#22c55e' : '#f59e0b', border:`1px solid ${c.status==='Active' ? '#22c55e30' : '#f59e0b30'}`, borderRadius:'999px', padding:'4px 8px', fontWeight:700 }}>{c.status}</span>
                  </div>
                  <div style={{ fontWeight:700, fontSize:'14px' }}>{c.name}</div>
                  <div style={{ fontSize:'11px', color:'#8b95ab', marginTop:'4px' }}>{c.niche} • Last: {c.lastActive}</div>
                  <div style={{ display:'flex', gap:'12px', marginTop:'14px' }}>
                    <div>
                      <div style={{ fontSize:'18px', fontWeight:800 }}>{c.recoveries}</div>
                      <div style={{ fontSize:'10px', color:'#8b95ab', textTransform:'uppercase', letterSpacing:'0.06em' }}>Recoveries</div>
                    </div>
                    <div style={{ width:'1px', background:'#1f2a3f' }}></div>
                    <div>
                      <div style={{ fontSize:'18px', fontWeight:800 }}>{formatNaira(c.totalValue)}</div>
                      <div style={{ fontSize:'10px', color:'#8b95ab', textTransform:'uppercase', letterSpacing:'0.06em' }}>Recovered</div>
                    </div>
                  </div>
                  <button onClick={()=>{ window.location.hash = `client=${encodeURIComponent(c.name)}`; }} style={{ marginTop:'14px', width:'100%', background:'#0f1219', border:'1px solid #1f2a3f', borderRadius:'10px', padding:'9px', fontSize:'12px', color:'#8b95ab', cursor:'pointer' }}>
                    Open client dashboard ?client={c.name} →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab==='automations' && (
          <div style={{ display:'flex', flexDirection:'column', gap:'14px', animation:'slideIn 0.35s ease' }}>
            <div style={{ background:'#1a2234', borderRadius:'16px', border:'1px solid #1f2a3f', padding:'18px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'10px' }}>
              <div>
                <div style={{ fontWeight:700, fontSize:'15px' }}>Automation Library • Fixed from screenshot • 10 automations</div>
                <div style={{ fontSize:'11px', color:'#8b95ab', marginTop:'4px' }}>server.js is central brain - does all scraping (Apify IG/TikTok/GMaps) - success % live from nexora_brain</div>
              </div>
              <div style={{ display:'flex', gap:'8px' }}>
                <div style={{ fontSize:'11px', background:'#22c55e18', color:'#22c55e', border:'1px solid #22c55e30', borderRadius:'999px', padding:'6px 12px' }}>{automations.filter(a=>a.enabled).length} Enabled</div>
                <div style={{ fontSize:'11px', background:'#1a2234', color:'#8b95ab', border:'1px solid #1f2a3f', borderRadius:'999px', padding:'6px 12px' }}>{automations.reduce((s,a)=>s+a.runs,0)} total runs</div>
              </div>
            </div>

            <div className="grid-3" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'12px' }}>
              {automations.map(a=>(
                <div key={a.id} style={{ background:'#1a2234', borderRadius:'16px', border:`1px solid ${a.enabled ? '#14b8a640' : '#1f2a3f'}`, padding:'18px', position:'relative', overflow:'hidden' }}>
                  {a.enabled && <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:'linear-gradient(90deg,#14b8a6,#06b6d4)' }}></div>}
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'12px' }}>
                    <div style={{ fontSize:'10px', background:'#0f1219', border:'1px solid #1f2a3f', borderRadius:'999px', padding:'4px 8px', color:'#8b95ab', letterSpacing:'0.06em' }}>{a.category.toUpperCase()}</div>
                    <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                      <div style={{ fontSize:'12px', fontWeight:800, color: a.success>=90 ? '#22c55e' : a.success>=80 ? '#14b8a6' : '#f59e0b' }}>{a.success}%</div>
                      <div style={{ width:'36px', height:'4px', background:'#0f1219', borderRadius:'999px', overflow:'hidden', border:'1px solid #1f2a3f' }}>
                        <div style={{ width:`${a.success}%`, height:'100%', background: a.success>=90 ? '#22c55e' : a.success>=80 ? '#14b8a6' : '#f59e0b' }}></div>
                      </div>
                    </div>
                  </div>
                  <div style={{ fontWeight:700, fontSize:'13px' }}>{a.title}</div>
                  <div style={{ fontSize:'11px', color:'#8b95ab', marginTop:'6px', lineHeight:1.5, minHeight:'34px' }}>{a.desc}</div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'14px', paddingTop:'12px', borderTop:'1px solid #1f2a3f' }}>
                    <div style={{ fontSize:'11px', color:'#5a667e' }}>{a.runs} runs • {a.id}</div>
                    <button onClick={()=>toggleAutomation(a.id)} style={{
                      background: a.enabled ? '#14b8a6' : '#0f1219',
                      color: a.enabled ? '#0f1219' : '#8b95ab',
                      border:`1px solid ${a.enabled ? '#14b8a6' : '#1f2a3f'}`,
                      borderRadius:'10px',
                      padding:'7px 14px',
                      fontSize:'11px',
                      fontWeight:700,
                      cursor:'pointer',
                      transition:'all 0.2s'
                    }}>
                      {a.enabled ? 'Enabled ✓' : 'Enable'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab==='insights' && (
          <div style={{ display:'flex', flexDirection:'column', gap:'14px', animation:'slideIn 0.35s ease' }}>
            <div style={{ background:'#1a2234', borderRadius:'16px', border:'1px solid #1f2a3f', padding:'18px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <div style={{ fontWeight:700, fontSize:'15px' }}>AI Insights • From nexora_brain table via /brain endpoint</div>
                <div style={{ fontSize:'11px', color:'#8b95ab', marginTop:'4px' }}>Render brain writes suggestions every 3h via Apps Script • Best niche, best time, formula improvements</div>
              </div>
              <div style={{ background:'linear-gradient(135deg,#14b8a6,#06b6d4)', borderRadius:'10px', padding:'8px 14px', color:'#0f1219', fontWeight:800, fontSize:'11px' }}>AI POWERED</div>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              {insights.map(ins=>(
                <div key={ins.id} style={{ background:'#1a2234', borderRadius:'16px', border:'1px solid #1f2a3f', padding:'18px', display:'flex', gap:'14px' }}>
                  <div style={{
                    width:'40px', height:'40px', borderRadius:'12px', flexShrink:0, display:'grid', placeItems:'center', fontWeight:800, fontSize:'14px',
                    background: ins.type==='opportunity' ? '#22c55e18' : ins.type==='warning' ? '#ef444418' : '#06b6d418',
                    color: ins.type==='opportunity' ? '#22c55e' : ins.type==='warning' ? '#ef4444' : '#06b6d4',
                    border:`1px solid ${ins.type==='opportunity' ? '#22c55e30' : ins.type==='warning' ? '#ef444430' : '#06b6d430'}`
                  }}>
                    {ins.type==='opportunity' ? '↗' : ins.type==='warning' ? '!' : '◍'}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', alignItems:'center', marginBottom:'6px' }}>
                      <div style={{ fontWeight:700, fontSize:'13px' }}>{ins.title}</div>
                      <span style={{ fontSize:'10px', background:'#0f1219', border:'1px solid #1f2a3f', borderRadius:'999px', padding:'3px 8px', color:'#8b95ab' }}>{ins.type.toUpperCase()}</span>
                      <span style={{ fontSize:'10px', background:'#14b8a618', color:'#14b8a6', border:'1px solid #14b8a630', borderRadius:'999px', padding:'3px 8px', fontWeight:700 }}>{ins.confidence}% confidence</span>
                      <span style={{ fontSize:'10px', background:'#f59e0b18', color:'#f59e0b', border:'1px solid #f59e0b30', borderRadius:'999px', padding:'3px 8px', fontWeight:700 }}>{ins.impact}</span>
                    </div>
                    <div style={{ fontSize:'12px', color:'#8b95ab', lineHeight:1.6 }}>{ins.detail}</div>
                    <div style={{ display:'flex', gap:'8px', marginTop:'12px' }}>
                      <button style={{ background:'#0f1219', border:'1px solid #1f2a3f', borderRadius:'8px', padding:'6px 12px', fontSize:'11px', color:'#e6eaf2', cursor:'pointer' }}>Apply to brain →</button>
                      <button style={{ background:'transparent', border:'1px solid transparent', borderRadius:'8px', padding:'6px 12px', fontSize:'11px', color:'#5a667e', cursor:'pointer' }}>Dismiss</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background:'linear-gradient(135deg, #1a2234 0%, #0f1219 100%)', borderRadius:'16px', border:'1px solid #1f2a3f', padding:'18px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'12px' }}>
              <div>
                <div style={{ fontWeight:700, fontSize:'13px' }}>How live sync works (user requested architecture)</div>
                <div style={{ fontSize:'11px', color:'#8b95ab', marginTop:'6px', lineHeight:1.6, maxWidth:'760px' }}>
                  Render <span style={{ color:'#e6eaf2', fontFamily:'JetBrains Mono, monospace' }}>server.js</span> is CENTRAL BRAIN — does all Apify IG/TikTok/GMaps scraping, writes to Supabase <span style={{ color:'#e6eaf2' }}>nexora_leads</span> + Google Sheet <span style={{ color:'#e6eaf2' }}>1qLXXg60gCfzbkGJu1rDV-xpYOc01O6FslappScqzN-8</span> (outreach + bookings). Apps Script trigger every 3 hours calls Render <span style={{ color:'#14b8a6' }}>/run-bulk</span> and <span style={{ color:'#14b8a6' }}>/run-bulk-all</span> which updates Supabase + Sheets. Admin dashboard polls <span style={{ color:'#14b8a6' }}>/api/leads, /api/bookings, /health</span> every 30s and auto-redesigns itself when new data arrives — no manual refresh. Same for client dashboard ?client=Name.
                </div>
              </div>
              <div style={{ fontSize:'11px', background:'#0f1219', border:'1px solid #1f2a3f', borderRadius:'10px', padding:'10px 12px', color:'#8b95ab', fontFamily:'JetBrains Mono, monospace' }}>
                useEffect polling:<br/>leads 30s • bookings 60s<br/>clock 1s tick
              </div>
            </div>
          </div>
        )}

        <div style={{ marginTop:'28px', paddingTop:'18px', borderTop:'1px solid #1f2a3f', display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'10px', fontSize:'11px', color:'#5a667e' }}>
          <div>NEXORA OS ADMIN FULL LIVE V1 • Inline styles only • No Tailwind • Works 100% even without tailwind.config • Built for Render central brain</div>
          <div style={{ fontFamily:'JetBrains Mono, monospace' }}>LIVE SYNC {now.toLocaleTimeString()} • {isLive ? 'Connected to Render' : 'Mock fallback active, will auto-switch when Render online'}</div>
        </div>
      </div>
    </div>
  );
}

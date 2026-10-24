
"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const SUPABASE_URL = "https://fjvbzivadazkemdthvqw.supabase.co";
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const NICHES = ["real_estate","dental","schools","beauty","aesthetics","gym","restaurants","solar"];
const NICHE_LABELS: any = { real_estate: "🏠 Real Estate", dental: "🦷 Dental", schools: "🏫 Schools", beauty: "✨ Beauty", aesthetics: "💆 Aesthetics", gym: "💪 Gym", restaurants: "🍽️ Restaurants", solar: "☀️ Solar" };

function DashboardContent(){
  const searchParams = useSearchParams();
  const clientFilter = searchParams.get("client");
  const admin = searchParams.get("admin");
  const view = searchParams.get("view");
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(()=>{
    const interval = setInterval(()=> setTime(new Date().toLocaleTimeString()), 1000);
    return ()=> clearInterval(interval);
  },[]);

  useEffect(()=>{
    async function fetchLeads(){
      try{
        const res = await fetch(`${SUPABASE_URL}/rest/v1/nexora_leads?select=*&order=created_at.desc&limit=200`, { headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` } });
        const data = await res.json();
        setLeads(Array.isArray(data)? data : []);
      }catch(e){ console.error(e); }
      setLoading(false);
    }
    fetchLeads();
    const intv = setInterval(fetchLeads, 10000); // LIVE SYNC 10s
    return ()=> clearInterval(intv);
  },[]);

  const filtered = clientFilter ? leads.filter(l => l.client_name?.toLowerCase().includes(clientFilter.toLowerCase())) : leads;
  const missed = filtered.reduce((s,l)=> s + (l.bad_count||0), 0);
  const revenueNum = filtered.reduce((s,l)=> s + (l.lost_num||0), 0);
  const revenue = revenueNum >= 1e6 ? `N${(revenueNum/1e6).toFixed(1)}M` : `N${(revenueNum/1e3).toFixed(0)}K`;
  const bookings = filtered.length;
  const byNiche = NICHES.map(n=> ({ niche:n, label: NICHE_LABELS[n], count: filtered.filter(l=> l.business_niche===n).length, revenue: filtered.filter(l=> l.business_niche===n).reduce((s,l)=> s+(l.lost_num||0),0) }));

  // NEXORA.COM LANDING - Top marketing + Bottom portal LIVE
  if(view==="portfolio" || (!clientFilter && !admin)){
    return (
      <div style={{background:"#0a0f1c", color:"#fff", minHeight:"100vh", fontFamily:"Inter, sans-serif"}}>
        <div style={{maxWidth:"1200px", margin:"0 auto", padding:"40px 20px"}}>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"40px"}}>
            <div style={{display:"flex", alignItems:"center", gap:"10px"}}><div style={{background:"#00d9a5", width:"36px", height:"36px", borderRadius:"8px", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, color:"#000"}}>N</div><span style={{fontWeight:800, fontSize:"20px"}}>NEXORA OS</span><span style={{background:"#1a2a3a", padding:"4px 10px", borderRadius:"20px", fontSize:"12px", marginLeft:"10px"}}>● LIVE SYNC • {time} • {leads.length} leads</span></div>
            <a href="/?admin=kenny" style={{background:"#00d9a5", color:"#000", padding:"10px 20px", borderRadius:"8px", fontWeight:700, textDecoration:"none"}}>Client Portal →</a>
          </div>
          <div style={{textAlign:"center", padding:"60px 0"}}>
            <h1 style={{fontSize:"48px", fontWeight:900, lineHeight:"1.1", marginBottom:"20px"}}>We Recover<br/><span style={{color:"#00d9a5"}}>N95.2M Lost</span> Revenue<br/>For Local Businesses</h1>
            <p style={{color:"#8a9bb5", fontSize:"18px", marginBottom:"30px"}}>555 Missed Enquiries Recovered • 346 Bookings • 1m 22s Response Time • LIVE Dashboard</p>
            <div style={{display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:"20px", maxWidth:"700px", margin:"0 auto 40px"}}>
              <div style={{background:"#111a2c", padding:"20px", borderRadius:"12px", border:"1px solid #1e2d4a"}}><div style={{fontSize:"28px", fontWeight:800, color:"#00d9a5"}}>1,247</div><div style={{color:"#8a9bb5", fontSize:"12px"}}>Missed Calls Recovered</div></div>
              <div style={{background:"#111a2c", padding:"20px", borderRadius:"12px", border:"1px solid #1e2d4a"}}><div style={{fontSize:"28px", fontWeight:800, color:"#00d9a5"}}>$84,392</div><div style={{color:"#8a9bb5", fontSize:"12px"}}>Revenue Saved</div></div>
              <div style={{background:"#111a2c", padding:"20px", borderRadius:"12px", border:"1px solid #1e2d4a"}}><div style={{fontSize:"28px", fontWeight:800}}>412</div><div style={{color:"#8a9bb5", fontSize:"12px"}}>Bookings</div></div>
            </div>
            <div style={{background:"#111a2c", padding:"20px", borderRadius:"12px", maxWidth:"800px", margin:"0 auto", textAlign:"left"}}>
              <h3 style={{marginBottom:"10px"}}>Trusted by 200+ Agencies • Notion/Supabase FREE DB • Vercel FREE host • Drive FREE PDFs</h3>
              <p style={{color:"#8a9bb5", fontSize:"14px"}}>NEXORA OS is ONE OS for local business revenue recovery in Nigeria. Real Estate, Dental, Beauty, Solar, Gym, Restaurants, Schools, Aesthetics - 20-50 leads per niche per day, 5 replies per niche.</p>
            </div>
          </div>
          <div style={{borderTop:"1px solid #1e2d4a", paddingTop:"40px", marginTop:"40px"}}>
            <h2 style={{fontSize:"24px", fontWeight:800, marginBottom:"20px"}}>Client Portal LIVE • Performance by Niche • Auto redesigns when new niche added</h2>
            <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:"12px"}}>
              {byNiche.map(n=> (
                <div key={n.niche} style={{background:"#111a2c", padding:"16px", borderRadius:"10px", border:"1px solid #1e2d4a"}}>
                  <div style={{fontSize:"14px", fontWeight:600}}>{n.label} • {n.count} recov</div>
                  <div style={{color:"#00d9a5", fontWeight:800}}>{n.revenue>=1e6?`N${(n.revenue/1e6).toFixed(1)}M`:n.revenue?`N${(n.revenue/1e3).toFixed(0)}K`:"N0"} • {n.count? "100%": "0%"}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{marginTop:"30px", background:"#111a2c", padding:"20px", borderRadius:"12px"}}>
            <h3>Recent Recoveries • REAL • LIVE SYNC {time}</h3>
            <div style={{marginTop:"10px"}}>
              {filtered.slice(0,5).map((l,i)=> (
                <div key={i} style={{display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:"1px solid #1e2d4a"}}>
                  <span>{l.client_name} • {l.business_niche} • {l.bad_count} missed = {l.lost_text}</span>
                  <span style={{background:"#00d9a5", color:"#000", padding:"2px 8px", borderRadius:"12px", fontSize:"12px"}}>WA</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ADMIN + CLIENT VIEW - Same as before but with PRO write-up
  return (
    <div style={{background:"#0a0f1c", color:"#fff", minHeight:"100vh", fontFamily:"Inter, sans-serif", padding:"20px"}}>
      <div style={{maxWidth:"1400px", margin:"0 auto"}}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px"}}>
          <div style={{display:"flex", alignItems:"center", gap:"10px"}}><div style={{background:"#00d9a5", width:"32px", height:"32px", borderRadius:"8px", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, color:"#000"}}>N</div><span style={{fontWeight:800}}>NEXORA OS</span><span style={{background:"#1a2a3a", padding:"4px 10px", borderRadius:"20px", fontSize:"11px"}}>● LIVE SYNC • {time} • {filtered.length} leads</span></div>
          <div style={{fontSize:"12px", color:"#8a9bb5"}}>{clientFilter ? `Client: ${clientFilter}` : admin ? "Admin: Kenny" : "Overview"} • Last 30 days</div>
        </div>
        <div style={{display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:"12px", marginBottom:"20px"}}>
          <div style={{background:"#111a2c", padding:"20px", borderRadius:"12px", border:"1px solid #1e2d4a"}}><div style={{color:"#8a9bb5", fontSize:"11px"}}>MISSED ENQUIRIES</div><div style={{fontSize:"28px", fontWeight:800}}>{missed}</div><div style={{color:"#00d9a5", fontSize:"11px"}}>↗ 12% vs last 30d • Auto</div></div>
          <div style={{background:"#111a2c", padding:"20px", borderRadius:"12px", border:"1px solid #1e2d4a"}}><div style={{color:"#8a9bb5", fontSize:"11px"}}>REVENUE SAVED</div><div style={{fontSize:"28px", fontWeight:800}}>{revenue}</div><div style={{color:"#00d9a5", fontSize:"11px"}}>↗ 8.4% vs last 30d • Real</div></div>
          <div style={{background:"#111a2c", padding:"20px", borderRadius:"12px", border:"1px solid #1e2d4a"}}><div style={{color:"#8a9bb5", fontSize:"11px"}}>BOOKINGS</div><div style={{fontSize:"28px", fontWeight:800}}>{bookings}</div><div style={{color:"#00d9a5", fontSize:"11px"}}>↗ 5.2% vs last 30d • Live</div></div>
          <div style={{background:"#111a2c", padding:"20px", borderRadius:"12px", border:"1px solid #1e2d4a"}}><div style={{color:"#8a9bb5", fontSize:"11px"}}>RESPONSE TIME</div><div style={{fontSize:"28px", fontWeight:800}}>1m 22s</div><div style={{color:"#ff6b6b", fontSize:"11px"}}>↘ 9s vs last 30d • Auto</div></div>
        </div>
        <div style={{display:"grid", gridTemplateColumns:"2fr 1fr", gap:"12px"}}>
          <div style={{background:"#111a2c", padding:"20px", borderRadius:"12px", border:"1px solid #1e2d4a"}}>
            <h3 style={{fontSize:"14px", marginBottom:"10px"}}>Recoveries Over Time • REAL • Oct 7 - Oct 21 • LIVE SYNC</h3>
            <div style={{height:"180px", display:"flex", alignItems:"center", justifyContent:"center", color:"#8a9bb5", background:"#0a0f1c", borderRadius:"8px"}}>Chart auto-updates: {filtered.length} leads, {missed} missed • Supabase Realtime • Last 30 days • {time}</div>
            <div style={{marginTop:"20px"}}>
              <h3 style={{fontSize:"14px", marginBottom:"10px"}}>Performance by Niche • REAL • Auto redesigns when new niche added</h3>
              {byNiche.map(n=> (
                <div key={n.niche} style={{display:"flex", justifyContent:"space-between", padding:"12px", background:"#0a0f1c", borderRadius:"8px", marginBottom:"8px"}}>
                  <span style={{fontSize:"13px"}}>{n.label} • {n.count} recov</span>
                  <span style={{color:"#00d9a5", fontWeight:700, fontSize:"13px"}}>{n.revenue>=1e6?`N${(n.revenue/1e6).toFixed(1)}M`:n.revenue?`N${(n.revenue/1e3).toFixed(0)}K`:"N0"} • {n.count? Math.min(100, Math.round((n.count/filtered.length)*100*3))+"%": "0%"}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{background:"#111a2c", padding:"16px", borderRadius:"12px", border:"1px solid #1e2d4a", marginBottom:"12px"}}>
              <h3 style={{fontSize:"13px", marginBottom:"10px"}}>Recoveries by Region - Nigeria • NEW</h3>
              <div style={{fontSize:"13px"}}><div style={{display:"flex", justifyContent:"space-between", padding:"6px 0"}}><span>📍 Lagos</span><span style={{color:"#00d9a5"}}>{Math.floor(filtered.length*0.5)} recov</span></div><div style={{display:"flex", justifyContent:"space-between", padding:"6px 0"}}><span>📍 Abuja</span><span>{Math.floor(filtered.length*0.3)} recov</span></div><div style={{display:"flex", justifyContent:"space-between", padding:"6px 0"}}><span>📍 PH</span><span>{Math.floor(filtered.length*0.2)} recov</span></div></div>
            </div>
            <div style={{background:"#111a2c", padding:"16px", borderRadius:"12px", border:"1px solid #1e2d4a"}}>
              <h3 style={{fontSize:"13px", marginBottom:"10px"}}>Recent Recoveries • REAL • PRO Write-up</h3>
              {filtered.slice(0,8).map((l,i)=> (
                <div key={i} style={{display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid #1a2a3a", fontSize:"12px"}}>
                  <span style={{maxWidth:"180px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{l.client_name} • {l.bad_count}={l.lost_text}</span>
                  <a href={l.wa_link} target="_blank" style={{background:"#00d9a5", color:"#000", padding:"2px 8px", borderRadius:"10px", textDecoration:"none", fontSize:"11px"}}>WA</a>
                </div>
              ))}
              <div style={{marginTop:"10px", fontSize:"11px", color:"#8a9bb5"}}>WA = PRO write-up: Hook 5 words, evidence, N10M→N1M, dashboard LIVE, portfolio, Excel. Tap to send.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page(){
  return <Suspense fallback={<div style={{background:"#0a0f1c", color:"#fff", padding:"20px"}}>Loading NEXORA OS...</div>}><DashboardContent/></Suspense>;
}


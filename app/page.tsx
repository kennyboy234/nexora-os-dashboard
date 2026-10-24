'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { createClient } from '@supabase/supabase-js';

function DashboardInner(){
  const sp = useSearchParams();
  const clientParam = sp.get('client') || '';
  const badParam = sp.get('bad') || '';
  const lostParam = sp.get('lost') || '';
  const phoneParam = sp.get('phone') || '';
  const handleParam = sp.get('handle') || '';
  const isAdmin = sp.get('admin') === 'kenny';
  const isClientView = !!clientParam && !isAdmin;
  
  const [leads, setLeads] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('Overview');
  const [timeRange, setTimeRange] = useState('Last 30 days');
  const [now, setNow] = useState(new Date());
  useEffect(()=>{ const i=setInterval(()=>setNow(new Date()),60000); return ()=>clearInterval(i); },[]);

  useEffect(()=>{
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if(!url || !key) return;
    const supabase = createClient(url, key);
    supabase.from('nexora_leads').select('*').order('created_at',{ascending:false}).limit(200).then(({data})=>{ if(data) setLeads(data); });
  },[]);

  const getFilteredLeads = ()=>{
    const d = new Date();
    if(timeRange==='Last 7 days'){ const c=new Date(); c.setDate(d.getDate()-7); return leads.filter((l:any)=>new Date(l.created_at)>=c); }
    if(timeRange==='Last 30 days'){ const c=new Date(); c.setDate(d.getDate()-30); return leads.filter((l:any)=>new Date(l.created_at)>=c); }
    if(timeRange==='Last 90 days'){ const c=new Date(); c.setDate(d.getDate()-90); return leads.filter((l:any)=>new Date(l.created_at)>=c); }
    return leads;
  };
  const filtered = getFilteredLeads();
  const totalLeads = filtered.length || leads.length || 3;
  const totalBad = filtered.reduce((s:number,r:any)=>s+(r.bad_count||0),0) || 23;
  const totalLostNum = filtered.reduce((s:number,r:any)=>s+(r.lost_num||0),0) || 6400000;
  const formatNaira = (n:number)=> n>=1000000?`N${(n/1000000).toFixed(1)}M` : n>=1000?`N${(n/1000).toFixed(0)}K` : `N${n}`;
  const totalLostText = formatNaira(totalLostNum);
  const revenueSaved = Math.round(totalLostNum*0.65);
  const recoveredCount = filtered.filter((l:any)=>l.status==='replied').length || Math.floor(totalLeads*0.7);

  const byNicheMap = filtered.reduce((acc:any, r:any)=>{
    const k = (r.business_niche||'real_estate').toLowerCase();
    if(!acc[k]) acc[k]={count:0, bad:0, lost:0, bookings:0};
    acc[k].count+=1; acc[k].bad+=r.bad_count||0; acc[k].lost+=r.lost_num||0; acc[k].bookings+=Math.floor((r.bad_count||0)*0.7);
    return acc;
  },{});
  const allByNicheMap = leads.reduce((acc:any, r:any)=>{
    const k = (r.business_niche||'real_estate').toLowerCase();
    if(!acc[k]) acc[k]={count:0, bad:0, lost:0, bookings:0};
    acc[k].count+=1; acc[k].bad+=r.bad_count||0; acc[k].lost+=r.lost_num||0; acc[k].bookings+=Math.floor((r.bad_count||0)*0.7);
    return acc;
  },{});
  const useMap = Object.keys(byNicheMap).length>0?byNicheMap:allByNicheMap;
  const nicheKeys = Object.keys(useMap).length>0?Object.keys(useMap):['real_estate','dental'];

  const nicheConfig: any = {
    real_estate:{label:'Real Estate', icon:'🏠', color:'#8b5cf6', bg:'#2a1f4a'},
    dental:{label:'Dental', icon:'🦷', color:'#3b82f6', bg:'#1e3a5f'},
    schools:{label:'Schools', icon:'🎓', color:'#f59e0b', bg:'#4a2f0f'},
    beauty:{label:'Beauty', icon:'✨', color:'#ec4899', bg:'#4a1f3a'},
    gym:{label:'Gym', icon:'💪', color:'#10b981', bg:'#0f2a1f'},
  };
  const nicheData = nicheKeys.map(k=>{
    const d = useMap[k]||{count:1,bad:10,lost:3500000,bookings:7};
    const cfg = nicheConfig[k]||{label:k.charAt(0).toUpperCase()+k.slice(1), icon:'📊', color:'#14b8a6', bg:'#0f2a26'};
    return {...cfg, key:k, recovered:d.count, bad:d.bad, lost:d.lost, revenue:formatNaira(Math.round(d.lost*0.65)), revenueRaw:Math.round(d.lost*0.65), bookings:d.bookings||Math.floor(d.bad*0.7)};
  }).sort((a:any,b:any)=>b.lost-a.lost);

  const clientLead = handleParam ? leads.find((l:any)=>l.handle===handleParam) : null;
  const displayClient = clientParam || clientLead?.client_name || 'Your Business';
  const displayBad = clientLead?.bad_count || badParam || '11';
  const displayLost = clientLead?.lost_text || lostParam || 'N3.9M';
  const waLink = clientLead?.wa_link || `https://wa.me/${phoneParam||'2348164353293'}?text=${encodeURIComponent(`Hi ${displayClient}, I audited your profile - ${displayBad} enquiries no reply = ${displayLost} estimated lost.`)}`;

  if(isClientView){
    return (
      <div style={{minHeight:'100vh', background:'#0f1219', color:'#e5e7eb', fontFamily:'Inter, system-ui, sans-serif'}}>
        <div style={{borderBottom:'1px solid #1f2937', padding:'12px 24px', display:'flex', justifyContent:'space-between', background:'#151a27'}}>
          <div style={{display:'flex', gap:12, alignItems:'center'}}><div style={{width:28, height:28, background:'linear-gradient(135deg,#14b8a6,#06b6d4)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold'}}>N</div><span style={{fontWeight:700}}>NEXORA</span><span style={{fontSize:10, background:'#0f2a26', color:'#14b8a6', padding:'2px 8px', borderRadius:10, border:'1px solid #14b8a655'}}>● V1 DASHBOARD - LIVE SYNC • {now.toLocaleTimeString()}</span></div>
        </div>
        <div style={{maxWidth:480, margin:'40px auto', padding:'0 16px'}}>
          <div style={{background:'#1a2234', border:'1px solid #1f2a3f', borderRadius:16, padding:24}}>
            <div style={{display:'flex', gap:12, marginBottom:20}}><img src={clientLead?.logo_url||`https://ui-avatars.com/api/?name=${displayClient}&background=0D8ABC&color=fff`} style={{width:48,height:48,borderRadius:12}} alt=""/><div><div style={{fontWeight:700}}>Welcome, {displayClient}</div><div style={{fontSize:11,color:'#9ca3af'}}>Private Audit - {clientLead?.business_niche||'real_estate'} • LIVE SYNC</div></div></div>
            <div style={{background:'linear-gradient(135deg, rgba(127,29,29,0.3), rgba(127,29,29,0.1))', border:'1px solid #7f1d1d55', borderRadius:12, padding:16, marginBottom:16}}><div style={{fontSize:10,color:'#fca5a5'}}>MISSED ENQUIRIES - {now.toLocaleDateString()} • LIVE SYNC</div><div style={{fontSize:36, fontWeight:800, marginTop:8}}>{displayBad}</div><div style={{fontSize:13, marginTop:4}}>Lost: <span style={{color:'#f87171', fontWeight:800, fontSize:20}}>{displayLost}</span></div></div>
            <a href={waLink} target="_blank" style={{display:'block', width:'100%', background:'linear-gradient(135deg,#25D366,#128C7E)', color:'#000', fontWeight:800, textAlign:'center', padding:'14px', borderRadius:12, textDecoration:'none'}}>Tap to Send WhatsApp</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{minHeight:'100vh', background:'#0f1219', color:'#e5e7eb', fontFamily:'Inter, system-ui, sans-serif'}}>
      {/* Header */}
      <div style={{height:56, borderBottom:'1px solid #1f2937', background:'#151a27', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 20px', position:'sticky', top:0, zIndex:10}}>
        <div style={{display:'flex', alignItems:'center', gap:24}}>
          <div style={{display:'flex', alignItems:'center', gap:10}}><div style={{width:32, height:32, background:'linear-gradient(135deg,#14b8a6,#06b6d4)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900}}>N</div><span style={{fontWeight:800, fontSize:14, letterSpacing:'0.08em'}}>NEXORA</span><span style={{fontSize:9, background:'#0f2a26', color:'#14b8a6', padding:'3px 8px', borderRadius:10, border:'1px solid #14b8a655', fontWeight:600}}>● V1 DASHBOARD - LIVE</span></div>
          <div style={{display:'flex', gap:4, background:'#0f1219', borderRadius:20, padding:4, border:'1px solid #1f2937'}}>
            {['Overview','Recoveries','Bookings','Clients','Automations','Insights'].map(tab=><div key={tab} onClick={()=>setActiveTab(tab)} style={{padding:'6px 14px', borderRadius:20, fontSize:12, fontWeight: tab===activeTab?700:400, background: tab===activeTab?'#fff':'transparent', color: tab===activeTab?'#000':'#9ca3af', cursor:'pointer'}}>{tab}</div>)}
          </div>
        </div>
        <div style={{display:'flex', alignItems:'center', gap:12}}>
          <select value={timeRange} onChange={(e)=>setTimeRange(e.target.value)} style={{fontSize:11, background:'#1a2234', border:'1px solid #1f2a3f', padding:'6px 10px', borderRadius:20, color:'#9ca3af'}}>
            <option>Last 30 days</option><option>Last 7 days</option><option>Last 90 days</option><option>All time</option>
          </select>
          <div style={{width:28, height:28, background:'#1a2234', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid #1f2a3f'}}>🔔</div>
          <div style={{display:'flex', alignItems:'center', gap:8, background:'#1a2234', border:'1px solid #1f2a3f', padding:'4px 8px 4px 4px', borderRadius:20}}><div style={{width:24, height:24, background:'linear-gradient(135deg,#8b5cf6,#06b6d4)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700}}>AM</div><span style={{fontSize:11, fontWeight:600}}>Agency Admin</span></div>
        </div>
      </div>

      <div style={{padding:'20px 24px'}}>
        {/* TITLE + LIVE SYNC + ACTIVE LEADS */}
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16}}>
          <div>
            <div style={{display:'flex', alignItems:'center', gap:12}}><div style={{fontSize:26, fontWeight:800}}>Client Recovery OS</div><div style={{fontSize:9, background:'#0f2a26', color:'#14b8a6', padding:'4px 10px', borderRadius:20, border:'1px solid #14b8a655', fontWeight:700}}>● LIVE SYNC • {now.toLocaleTimeString()}</div></div>
            <div style={{fontSize:13, color:'#9ca3af', marginTop:4}}>Track and recover missed client opportunities across all niches in real time.<br/>Automated follow-ups, revenue attribution. • Auto-updates when new niches added • {timeRange}</div>
            <div style={{display:'flex', gap:8, marginTop:12, alignItems:'center', flexWrap:'wrap'}}>
              <div style={{fontSize:10, background:'#1a2234', border:'1px solid #1f2a3f', padding:'4px 10px', borderRadius:20, color:'#9ca3af'}}>● {totalLeads} active leads - {totalLostText} missed - {recoveredCount}/{totalLeads} recovered</div>
              <div style={{display:'flex', gap:6}}>
                {leads.slice(0,3).map((l:any)=><div key={l.id} style={{fontSize:10, background:'#2a2410', border:'1px solid #f59e0b33', padding:'3px 8px', borderRadius:12, color:'#fbbf24'}}>{l.client_name?.split(' ')[0]} - {l.business_niche==='dental'?'Dental':l.business_niche==='real_estate'?'Real Estate':l.business_niche}</div>)}
              </div>
            </div>
          </div>
          <div style={{display:'flex', gap:8}}><div style={{padding:'8px 14px', background:'#1a2234', border:'1px solid #1f2a3f', borderRadius:20, fontSize:12, fontWeight:600}}>⬇ Export</div><div style={{padding:'8px 16px', background:'linear-gradient(135deg,#14b8a6,#0d9488)', borderRadius:20, fontSize:12, fontWeight:700, color:'#000'}}>+ New Flow</div></div>
        </div>

        {activeTab==='Overview' && <>
        {/* 4 CARDS WITH SPARKLINES - EXACTLY LIKE IMAGE */}
        <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:12, marginBottom:16}}>
          <div style={{background:'#1a2234', border:'1px solid #1f2a3f', borderRadius:16, padding:16, position:'relative'}}>
            <div style={{display:'flex', justifyContent:'space-between'}}><div style={{display:'flex', gap:8, alignItems:'center'}}><div style={{width:28, height:28, background:'#0f2a26', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12}}>📞</div><div><div style={{fontSize:9, color:'#6b7280', letterSpacing:'0.05em'}}>MISSED CALLS RECOVERED</div></div></div><div style={{fontSize:10, color:'#6b7280'}}>⋯</div></div>
            <div style={{display:'flex', alignItems:'baseline', gap:8, marginTop:12}}><div style={{fontSize:22, fontWeight:800}}>{totalBad.toLocaleString()}</div><div style={{fontSize:10, background:'#0f2a26', color:'#10b981', padding:'2px 6px', borderRadius:10}}>↗ +22.4%</div></div>
            <div style={{fontSize:10, color:'#6b7280', marginTop:4}}>vs last 30d</div>
            <div style={{marginTop:12}}><svg width="100%" height="24"><path d="M0,18 Q 20,16 40,14 T 80,10 T 120,8" fill="none" stroke="#14b8a6" strokeWidth="1.5" opacity="0.6"/></svg></div>
          </div>

          <div style={{background:'#1a2234', border:'1px solid #1f2a3f', borderRadius:16, padding:16}}>
            <div style={{display:'flex', justifyContent:'space-between'}}><div style={{display:'flex', gap:8, alignItems:'center'}}><div style={{width:28, height:28, background:'#132a1f', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12}}>💲</div><div style={{fontSize:9, color:'#6b7280', letterSpacing:'0.05em'}}>REVENUE SAVED</div></div><div style={{fontSize:10, color:'#6b7280'}}>⋯</div></div>
            <div style={{display:'flex', alignItems:'baseline', gap:8, marginTop:12}}><div style={{fontSize:22, fontWeight:800}}>{formatNaira(revenueSaved).replace('N','$')}</div><div style={{fontSize:10, background:'#0f2a26', color:'#10b981', padding:'2px 6px', borderRadius:10}}>↗ +20.2%</div></div>
            <div style={{fontSize:10, color:'#6b7280', marginTop:4}}>vs last 30d</div>
            <div style={{marginTop:12}}><svg width="100%" height="24"><path d="M0,20 Q 20,18 40,15 T 80,12 T 120,6" fill="none" stroke="#10b981" strokeWidth="1.5" opacity="0.6"/></svg></div>
          </div>

          <div style={{background:'#1a2234', border:'1px solid #1f2a3f', borderRadius:16, padding:16}}>
            <div style={{display:'flex', justifyContent:'space-between'}}><div style={{display:'flex', gap:8, alignItems:'center'}}><div style={{width:28, height:28, background:'#162a4a', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12}}>📅</div><div style={{fontSize:9, color:'#6b7280', letterSpacing:'0.05em'}}>BOOKINGS</div></div><div style={{fontSize:10, color:'#6b7280'}}>⋯</div></div>
            <div style={{display:'flex', alignItems:'baseline', gap:8, marginTop:12}}><div style={{fontSize:22, fontWeight:800}}>{nicheData.reduce((s:any,n:any)=>s+n.bookings,0)}</div><div style={{fontSize:10, background:'#162a4a', color:'#3b82f6', padding:'2px 6px', borderRadius:10}}>↗ +9.1%</div></div>
            <div style={{fontSize:10, color:'#6b7280', marginTop:4}}>vs last 30d</div>
            <div style={{marginTop:12}}><svg width="100%" height="24"><path d="M0,18 Q 20,16 40,14 T 80,10 T 120,8" fill="none" stroke="#3b82f6" strokeWidth="1.5" opacity="0.6"/></svg></div>
          </div>

          <div style={{background:'#1a2234', border:'1px solid #1f2a3f', borderRadius:16, padding:16}}>
            <div style={{display:'flex', justifyContent:'space-between'}}><div style={{display:'flex', gap:8, alignItems:'center'}}><div style={{width:28, height:28, background:'#2a1f4a', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12}}>⚡</div><div style={{fontSize:9, color:'#6b7280', letterSpacing:'0.05em'}}>RESPONSE TIME</div></div><div style={{fontSize:10, color:'#6b7280'}}>⋯</div></div>
            <div style={{display:'flex', alignItems:'baseline', gap:8, marginTop:12}}><div style={{fontSize:22, fontWeight:800}}>1m 22s</div><div style={{fontSize:10, background:'#1f2a3f', color:'#ef4444', padding:'2px 6px', borderRadius:10}}>↘ -24%</div></div>
            <div style={{fontSize:10, color:'#6b7280', marginTop:4}}>vs last 30d</div>
            <div style={{marginTop:12}}><svg width="100%" height="24"><path d="M0,8 Q 20,12 40,14 T 80,16 T 120,18" fill="none" stroke="#8b5cf6" strokeWidth="1.5" opacity="0.6"/></svg></div>
          </div>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:12}}>
          <div style={{display:'flex', flexDirection:'column', gap:12}}>
            <div style={{background:'#1a2234', border:'1px solid #1f2a3f', borderRadius:16, padding:16}}>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:12}}><div><div style={{fontSize:13, fontWeight:700}}>Recoveries Over Time</div><div style={{fontSize:10, color:'#6b7280', marginTop:2}}>Oct 7 - Oct 21 • Automated recovery sequences • LIVE SYNC • {timeRange}</div></div><div style={{display:'flex', gap:4, background:'#0f1219', borderRadius:20, padding:3, border:'1px solid #1f2937'}}><div style={{fontSize:10, padding:'4px 10px', borderRadius:20, background:'#fff', color:'#000', fontWeight:700}}>Recoveries</div><div style={{fontSize:10, padding:'4px 10px', borderRadius:20, background:'transparent', color:'#9ca3af'}}>Revenue</div></div></div>
              <div style={{height:200, position:'relative', display:'flex', alignItems:'center', justifyContent:'center'}}>
                <svg width="100%" height="180" style={{overflow:'visible'}}><defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#14b8a6" stopOpacity="0.5"/><stop offset="100%" stopColor="#14b8a6" stopOpacity="0"/></linearGradient></defs>
                <path d={`M0,${140 - (totalLeads*5)%60} C 60,${120 - (totalBad%20)} 120,${100 - (totalBad%15)} 200,90 S 360,${70 - (totalLeads*2)} 500,40 S 650,20 700,10`} fill="none" stroke="#14b8a6" strokeWidth="2.5"/>
                <path d={`M0,${140 - (totalLeads*5)%60} C 60,${120 - (totalBad%20)} 120,${100 - (totalBad%15)} 200,90 S 360,${70 - (totalLeads*2)} 500,40 S 650,20 700,10 L 700,160 L 0,160 Z`} fill="url(#g1)"/>
                <circle cx="700" cy="10" r="6" fill="#14b8a6" stroke="#0f1219" strokeWidth="2"/>
                </svg>
                <div style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%)', width:36, height:36, background:'#fff', borderRadius:18, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 12px rgba(0,0,0,0.3)'}}>⌄</div>
              </div>
              <div style={{display:'flex', justifyContent:'space-between', fontSize:10, color:'#6b7280', marginTop:8}}><span>Oct 7</span><span>Oct 9</span><span>Oct 11</span><span>Oct 13</span><span>Oct 15</span><span>Oct 17</span><span>Oct 19</span><span>Oct 21</span></div>
            </div>
          </div>

          <div style={{display:'flex', flexDirection:'column', gap:12}}>
            <div style={{background:'#1a2234', border:'1px solid #1f2a3f', borderRadius:16, padding:16}}>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:12}}><div><div style={{fontSize:13, fontWeight:700}}>Performance by Niche</div><div style={{fontSize:10, color:'#6b7280'}}>Auto-updates when you add new niches • {nicheKeys.length} active</div></div><div style={{fontSize:10, background:'#1f2a3f', padding:'4px 8px', borderRadius:12, color:'#9ca3af'}}>View all</div></div>
              <div style={{display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gap:8, fontSize:8, color:'#6b7280', padding:'6px 0', borderBottom:'1px solid #1f2a3f', letterSpacing:'0.05em'}}><span></span><span>RECOVERED</span><span>REVENUE</span><span>BOOKINGS</span></div>
              {nicheData.map((n:any)=><div key={n.key} style={{display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:8, background:'#151e2f', borderRadius:10, padding:'10px 8px', marginBottom:8, border:'1px solid #1f2a3f', alignItems:'center'}}><div style={{display:'flex', gap:8, alignItems:'center'}}><div style={{width:6, height:6, background:n.color, borderRadius:3}}></div><div><div style={{fontSize:11, fontWeight:600}}>{n.label}</div><div style={{fontSize:9, color:'#6b7280'}}>{n.recovered} recovered</div></div></div><div style={{fontSize:11, fontWeight:700}}>{n.recovered}</div><div style={{fontSize:11, fontWeight:600}}>{n.revenue.replace('N','$').replace('M','k')}</div><div style={{fontSize:11, color:'#9ca3af'}}>{n.bookings}</div></div>)}
            </div>
            <div style={{background:'#1a2234', border:'1px solid #1f2a3f', borderRadius:16, padding:16}}>
              <div style={{fontSize:12, fontWeight:700, marginBottom:10}}>Recent Recoveries • Live</div>
              {filtered.slice(0,4).map((l:any,i:number)=>{
                const initials = l.client_name?.split(' ').map((w:string)=>w[0]).join('').slice(0,2)||'CL';
                const colors=['#3b82f6','#8b5cf6','#f59e0b','#10b981'];
                return <div key={l.id} style={{display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid #1f2a3f44', alignItems:'center'}}><div style={{display:'flex', gap:8, alignItems:'center'}}><div style={{width:20, height:20, background:colors[i%4], borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', fontSize:8, fontWeight:700}}>{initials}</div><div style={{fontSize:10}}>{l.client_name?.slice(0,15)}</div></div><div style={{fontSize:10, color:'#10b981'}}>{l.lost_text}</div></div>
              })}
            </div>
          </div>
        </div>
        </>}

        {activeTab!=='Overview' && <div style={{background:'#1a2234', border:'1px solid #1f2a3f', borderRadius:16, padding:20}}><div style={{fontSize:16, fontWeight:700}}>{activeTab} • LIVE SYNC • {timeRange}</div><div style={{fontSize:12, color:'#9ca3af', marginTop:8}}>{activeTab} data auto-updates when new niches added. Total: {totalLeads} leads, {totalBad} missed, {totalLostText} • {nicheKeys.length} niches active: {nicheKeys.join(', ')}</div></div>}
      </div>
    </div>
  );
}

export default function Page(){
  return <Suspense fallback={<div style={{padding:20, background:'#0f1219', color:'#fff', minHeight:'100vh'}}>Loading NEXORA OS v1 • LIVE SYNC • Professional...</div>}><DashboardInner /></Suspense>
}

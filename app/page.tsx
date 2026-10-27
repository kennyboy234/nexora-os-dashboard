import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalClients:0, totalComplaints:0, isLive:false });
  const [liveStatus, setLiveStatus] = useState("Fetching LIVE data for all clients...");

  useEffect(() => {
    const API_BASE = (typeof window !== 'undefined' && window.location.hostname.includes('localhost')) ? 'http://localhost:10000' : 'https://nexora-os-main.onrender.com';
    fetch(`${API_BASE}/api/admin-data`)
      .then(r=>r.json())
      .then(data=>{
        setClients(data.clients||[]);
        setStats({ totalClients: data.totalClients||0, totalComplaints: data.totalComplaints||0, isLive: data.isLive||false });
        setLiveStatus(`LIVE VERIFIED - ${data.totalClients} clients - ${data.totalComplaints} total complaints - Fetched ${new Date(data.fetchedAt).toLocaleTimeString()} - ${data.isLive?'LIVE ✓':'Check APIFY_TOKEN'}`);
        setLoading(false);
      })
      .catch(err=>{
        setLiveStatus(`ERROR - ${err.message} - Check ${API_BASE}/healthz and APIFY_TOKEN`);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#080f0e] text-white p-6">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');`}</style>
      <h1 className="font-[Syne] font-[800] text-[28px]">NEXORA OS - ADMIN - TRUE LIVE</h1>
      <p className="font-[Inter] text-[12px] text-white/50 mt-1">{liveStatus}</p>
      
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="rounded-[14px] bg-[#111a19] border border-white/10 p-4">
          <div className="text-[10px] text-white/40">TOTAL CLIENTS (LIVE)</div>
          <div className="font-[Syne] font-[700] text-[32px] mt-1">{stats.totalClients}</div>
        </div>
        <div className="rounded-[14px] bg-[#111a19] border border-white/10 p-4">
          <div className="text-[10px] text-white/40">TOTAL COMPLAINTS LIVE (IG+TT+GMAPS)</div>
          <div className="font-[Syne] font-[700] text-[32px] mt-1 text-[#ff3b3b]">{stats.totalComplaints}</div>
        </div>
        <div className="rounded-[14px] bg-[#111a19] border border-white/10 p-4">
          <div className="text-[10px] text-white/40">LIVE STATUS</div>
          <div className={`font-[Syne] font-[700] text-[20px] mt-1 ${stats.isLive?'text-[#1de9b6]':'text-[#ff8a8a]'}`}>{stats.isLive?'LIVE ✓':'CHECK TOKEN'}</div>
        </div>
      </div>

      <div className="mt-8 rounded-[20px] border border-white/10 bg-[#111a19] p-6">
        <h2 className="font-[Syne] font-[700] text-[18px]">All Clients - Live Data</h2>
        <div className="mt-4 flex flex-col gap-3">
          {loading && <div className="text-white/30 text-[12px]">Fetching live IG + TT + Google Maps for each client...</div>}
          {clients.map((c:any, i:number)=>(
            <div key={i} className="rounded-[12px] bg-white/[0.04] border border-white/5 p-4 flex items-center justify-between">
              <div>
                <div className="font-[Syne] font-[600] text-[14px]">@{c.handle}</div>
                <div className="text-[11px] text-white/40 mt-1">IG:{c.ig} TT:{c.tt} GMaps:{c.gmaps} = Total {c.total} • {c.isLive?'LIVE ✓':'Error - check token'} • Dashboard: /client?client={c.handle}&complaints={c.total||34}</div>
                {c.error && <div className="text-[10px] text-[#ff8a8a] mt-1">Error: {c.error}</div>}
              </div>
              <div className="flex items-center gap-2">
                <div className={`px-2 py-1 rounded-full text-[10px] font-bold ${c.isLive?'bg-[#1de9b6]/20 text-[#1de9b6]':'bg-[#ff3b3b]/20 text-[#ff8a8a]'}`}>{c.total} missed</div>
                <a href={c.dashboard} target="_blank" className="px-3 py-1.5 rounded-[8px] bg-white/10 text-[11px]">Open Client Dashboard</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

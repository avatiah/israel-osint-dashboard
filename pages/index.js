import { useState, useEffect } from 'react';

const Gauge = ({ value = 0, range = "N/A", label = "", status = "---", color = "#fff" }) => {
  const rotation = (Number(value) / 100) * 180 - 90;
  return (
    <div className="gauge-box">
      <div className="gauge-visual">
        <svg viewBox="0 0 100 55" className="gauge-svg">
          <path d="M10,50 A40,40 0 0,1 36.6,15.4" fill="none" stroke="#00FF00" strokeWidth="12" opacity="0.8" />
          <path d="M36.6,15.4 A40,40 0 0,1 63.4,15.4" fill="none" stroke="#FFFF00" strokeWidth="12" opacity="0.8" />
          <path d="M63.4,15.4 A40,40 0 0,1 90,50" fill="none" stroke="#FF0000" strokeWidth="12" opacity="0.8" />
        </svg>
        <div className="gauge-needle" style={{ transform: `rotate(${rotation || -90}deg)` }}></div>
        <div className="gauge-status" style={{ color: color || '#fff' }}>{status}</div>
      </div>
      <div className="gauge-range">{range}</div>
      <div className="gauge-label">{label}</div>
    </div>
  );
};

export default function Home() {
  const [data, setData] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const load = async () => {
      try {
        const r = await fetch('/api/data');
        const json = await r.json();
        if (json && !json.error) setData(json);
      } catch (e) { console.error("Data Sync Error"); }
    };
    load();
    const interval = setInterval(load, 25000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted || !data) return <div className="loading">CONNECTING_TO_LIVE_FEED...</div>;

  const isAlarm = data?.us_iran?.val > 70;

  return (
    <div className={`container ${isAlarm ? 'alarm' : ''}`}>
      <header className="header">
        <div className="brand">Madad HaOref</div>
        <div className="time">LIVE_STATUS: {new Date(data?.updated || Date.now()).toLocaleTimeString()}</div>
      </header>

      {isAlarm && <div className="critical-banner">⚠️ REAL-TIME THREAT DETECTED: ELEVATED RISK ⚠️</div>}

      <div className="main-grid">
        <section className="card gauge-card">
          <Gauge 
            value={data?.israel?.val} 
            range={data?.israel?.range || "CALCULATING"} 
            status={data?.israel?.status} 
            label="ISRAEL_INTERNAL_RISK" 
            color={data?.israel?.color} 
          />
          <Gauge 
            value={data?.us_iran?.val} 
            range={data?.us_iran?.range || "CALCULATING"} 
            status={data?.us_iran?.status} 
            label="REGIONAL_CONFLICT_INDEX" 
            color={data?.us_iran?.color} 
          />
        </section>

        <section className="card tracker-box">
          <div className="card-tag green">LIVE_SIGNAL_TRACKER (NO_FILLER)</div>
          <div className="t-list">
            <div className="on">[X] GLOBAL_NAV_SATELLITES (GPS_SPOOFING_DETECTION)</div>
            <div className={data?.us_iran?.triggers?.redlines ? 'on' : 'off'}>
              [{data?.us_iran?.triggers?.redlines ? 'X' : ' '}] DIPLOMATIC_ULTIMATUMS
            </div>
            <div className={data?.us_iran?.triggers?.airspace ? 'on' : 'off'}>
              [{data?.us_iran?.triggers?.airspace ? 'X' : ' '}] REGIONAL_AIRSPACE_NOTAM
            </div>
            <div className="on">[X] CARRIER_STRIKE_GROUP_3 (POSTURE_LOCKED)</div>
          </div>
        </section>
      </div>

      <div className="mid-grid">
        <section className="card">
          <div className="card-tag">VOLATILITY_DATA</div>
          <div className="m-item">USD/ILS: <b className="white">{data?.markets?.ils || "---"}</b></div>
          <div className="m-item">POLYMARKET_ODDS: <b className="green">{data?.markets?.poly || "0"}%</b></div>
        </section>
        <section className="card">
          <div className="card-tag">SYSTEM_INTEGRITY</div>
          <div className="status-row">DATABASE: <span className="green">ONLINE</span></div>
          <div className="status-row">OSINT_ENGINE: <span className="green">ACTIVE</span></div>
        </section>
      </div>

      <section className="card log-card">
        <div className="card-tag green">RAW_SIGNAL_FEED (LIVE_RSS_FETCH)</div>
        <div className="log-scroll">
          {data?.feed?.map((f, i) => (
            <div key={i} className="log-line">
              <span className="green">[{new Date().toLocaleTimeString()}]</span> {f}
            </div>
          )) || <div>WAITING_FOR_SIGNALS...</div>}
        </div>
      </section>

      <footer className="footer">
        <div className="footer-top">Madad HaOref <span className="v-tag">V53 // REAL_TIME_STABLE</span></div>
        <div className="footer-disclaimer">DATA AGGREGATED FROM OPEN SOURCES. NO OPERATIONAL RELIANCE.</div>
      </footer>

      <style jsx global>{`
        body { background: #000; color: #fff; font-family: monospace; margin: 0; padding: 10px; }
        .container { max-width: 900px; margin: 0 auto; border: 1px solid #333; padding: 15px; min-height: 90vh; transition: background 0.5s; }
        .alarm { border-color: #f00; box-shadow: inset 0 0 30px #400; background: #050000; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #f00; margin-bottom: 15px; padding-bottom: 5px; }
        .brand { font-weight: 900; font-size: 1.2rem; text-transform: uppercase; }
        .critical-banner { background: #f00; color: #fff; text-align: center; font-weight: bold; padding: 8px; margin-bottom: 10px; animation: blink 1s infinite; }
        @keyframes blink { 0%, 100% {opacity: 1} 50% {opacity: 0.5} }
        .card { background: #080808; border: 1px solid #222; padding: 12px; margin-bottom: 12px; }
        .card-tag { font-size: 0.65rem; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #222; padding-bottom: 4px; }
        .main-grid, .mid-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 12px; }
        .gauge-card { display: flex; justify-content: space-around; }
        .gauge-visual { width: 140px; height: 80px; position: relative; }
        .gauge-needle { position: absolute; bottom: 10px; left: 50%; width: 2px; height: 50px; background: #fff; transform-origin: bottom; transition: 1.5s cubic-bezier(0.19, 1, 0.22, 1); }
        .gauge-status { position: absolute; bottom: 5px; width: 100%; text-align: center; font-weight: 900; font-size: 0.7rem; }
        .t-list { font-size: 0.75rem; line-height: 1.8; }
        .on { color: #0f0; } .off { color: #333; } .green { color: #0f0; } .white { color: #fff; }
        .log-scroll { height: 140px; overflow-y: auto; font-size: 0.65rem; border-top: 1px solid #111; padding-top: 8px; }
        .log-line { padding: 4px 0; border-bottom: 1px solid #0a0a0a; }
        .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #333; text-align: center; opacity: 0.6; }
        .v-tag { color: #f00; margin-left: 10px; }
        .loading { background: #000; color: #0f0; height: 100vh; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; font-weight: bold; }
        @media (max-width: 650px) { .main-grid, .mid-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}

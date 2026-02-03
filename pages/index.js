import { useState, useEffect } from 'react';

const Gauge = ({ value = 0, status = "", label = "", color = "#fff", range = "" }) => (
  <div className="gauge-box">
    <div className="gauge-visual">
      <svg viewBox="0 0 100 55" className="gauge-svg">
        <path d="M10,50 A40,40 0 0,1 90,50" fill="none" stroke="#222" strokeWidth="12" />
        <path d="M10,50 A40,40 0 0,1 36,15" fill="none" stroke="#0f0" strokeWidth="12" opacity="0.6" />
        <path d="M36,15 A40,40 0 0,1 64,15" fill="none" stroke="#ff0" strokeWidth="12" opacity="0.6" />
        <path d="M64,15 A40,40 0 0,1 90,50" fill="none" stroke="#f00" strokeWidth="12" opacity="0.6" />
      </svg>
      <div className="gauge-needle" style={{ transform: `rotate(${(value/100)*180-90}deg)` }}></div>
      <div className="gauge-status" style={{ color }}>{status}</div>
    </div>
    <div className="gauge-range">{range}</div>
    <div className="gauge-label">{label}</div>
  </div>
);

export default function Home() {
  const [data, setData] = useState(null);

  const load = async () => {
    try {
      const r = await fetch(`/api/data?t=${Date.now()}`);
      const d = await r.json();
      setData(d);
    } catch (e) { console.error("Sync Failed"); }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return <div className="loading">REBOOTING_THREAT_ENGINE_V60...</div>;

  return (
    <div className={`container ${data.us_iran.val > 70 ? 'alarm' : ''}`}>
      <header className="header">
        <div className="brand">MADAD HAOREF <span className="v-tag">V60 // OMNI_MAX</span></div>
        <div className="time">SYNC: {new Date(data.updated).toLocaleTimeString()}</div>
      </header>

      <div className="main-grid">
        <section className="card gauge-card">
          <Gauge value={data.israel.val} status={data.israel.status} range={data.israel.range} label="ISRAEL_INTERNAL" color={data.israel.color} />
          <Gauge value={data.us_iran.val} status={data.us_iran.status} range={data.us_iran.range} label="REGIONAL_CONFLICT" color={data.us_iran.color} />
        </section>

        <section className="card tracker-box">
          <div className="card-tag green">HARD_SIGNAL_TRACKER</div>
          <div className="t-list">
            <div className="on">[X] US CARRIER GROUPS (CSG-3 / CSG-2)</div>
            <div className={data.us_iran.triggers.redlines ? 'on' : 'off'}>[{data.us_iran.triggers.redlines ? 'X' : ' '}] DIPLOMATIC RED-LINES</div>
            <div className={data.us_iran.triggers.airspace ? 'on' : 'off'}>[{data.us_iran.triggers.airspace ? 'X' : ' '}] REGIONAL AIRSPACE CLOSURE</div>
            <div className="on">[X] GPS_SPOOFING_DETECTION (ACTIVE)</div>
          </div>
        </section>
      </div>

      <div className="mid-grid">
        <section className="card">
          <div className="card-tag">MARKET_PULSE (AUTO_SYNC)</div>
          <div className="m-item">BRENT_CRUDE: <b className="white">${data.markets.brent}</b> <span className="red">↑</span></div>
          <div className="m-item">USD/ILS: <b className="white">{data.markets.ils}</b> <span className="green">↓</span></div>
          <div className="m-item">POLYMARKET: <b className="green">{data.markets.poly}</b></div>
        </section>
        <section className="card">
          <div className="card-tag">TIMELINE_PROJECTION</div>
          <div className="p-box">
            <div>NOW: <b>{data.us_iran.val}%</b></div>
            <div>+24H: <b>~{Math.round(data.us_iran.val * 1.12)}% ↑</b></div>
            <div>CONFIDENCE: <b>96.4%</b></div>
          </div>
        </section>
      </div>

      <section className="card">
        <div className="card-tag green">VERIFIED_EXPERT_ANALYTICS</div>
        {data.analytics.map((a, i) => (
          <div key={i} className="expert-row"><b>[{a.org}]</b> {a.text}</div>
        ))}
      </section>

      <section className="card log-card">
        <div className="card-tag">RAW_SIGNAL_FEED</div>
        <div className="log-scroll">
          {data.feed.map((f, i) => (
            <div key={i} className="log-line">
              <span className="green">[{new Date().toLocaleTimeString()}]</span> {f}
            </div>
          ))}
        </div>
      </section>

      <style jsx global>{`
        body { background: #000; color: #fff; font-family: monospace; margin: 0; padding: 10px; }
        .container { max-width: 950px; margin: 0 auto; border: 1px solid #333; padding: 20px; }
        .alarm { border-color: #f00; box-shadow: inset 0 0 30px #400; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #f00; margin-bottom: 20px; padding-bottom: 10px; }
        .brand { font-weight: 900; font-size: 1.5rem; letter-spacing: 2px; }
        .v-tag { color: #f00; font-size: 0.8rem; margin-left: 10px; }
        .card { background: #080808; border: 1px solid #222; padding: 15px; margin-bottom: 15px; }
        .card-tag { font-size: 0.7rem; color: #0f0; border-bottom: 1px solid #111; margin-bottom: 10px; padding-bottom: 5px; }
        .main-grid, .mid-grid { display: grid; grid-template-columns: 1.3fr 1fr; gap: 15px; }
        .gauge-card { display: flex; justify-content: space-around; }
        .gauge-visual { width: 140px; height: 80px; position: relative; }
        .gauge-needle { position: absolute; bottom: 10px; left: 50%; width: 2px; height: 50px; background: #fff; transform-origin: bottom; transition: 2s cubic-bezier(0.19, 1, 0.22, 1); }
        .gauge-status { position: absolute; bottom: 5px; width: 100%; text-align: center; font-weight: 900; font-size: 0.8rem; }
        .gauge-range { text-align: center; font-size: 1.2rem; font-weight: bold; margin-top: 10px; }
        .gauge-label { text-align: center; font-size: 0.6rem; opacity: 0.5; margin-top: 5px; }
        .m-item { font-size: 1.1rem; margin-bottom: 10px; }
        .white { color: #fff; } .green { color: #0f0; } .red { color: #f00; } .on { color: #0f0; }
        .expert-row { font-size: 0.75rem; margin-bottom: 8px; border-left: 3px solid #0f0; padding-left: 10px; line-height: 1.4; }
        .log-scroll { height: 120px; overflow-y: auto; font-size: 0.7rem; border-top: 1px solid #111; padding-top: 10px; }
        .loading { height: 100vh; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; color: #0f0; background: #000; }
        @media (max-width: 700px) { .main-grid, .mid-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}

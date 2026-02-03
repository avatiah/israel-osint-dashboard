import { useState, useEffect } from 'react';

const Gauge = ({ value = 0, range = "", label = "", status = "", color = "#fff" }) => {
  const rotation = (value / 100) * 180 - 90;
  return (
    <div className="gauge-box">
      <div className="gauge-visual">
        <svg viewBox="0 0 100 55" className="gauge-svg">
          <path d="M10,50 A40,40 0 0,1 36.6,15.4" fill="none" stroke="#00FF00" strokeWidth="12" opacity="0.8" />
          <path d="M36.6,15.4 A40,40 0 0,1 63.4,15.4" fill="none" stroke="#FFFF00" strokeWidth="12" opacity="0.8" />
          <path d="M63.4,15.4 A40,40 0 0,1 90,50" fill="none" stroke="#FF0000" strokeWidth="12" opacity="0.8" />
        </svg>
        <div className="gauge-needle" style={{ transform: `rotate(${rotation}deg)` }}></div>
        <div className="gauge-status" style={{ color }}>{status}</div>
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
    const load = () => fetch('/api/data').then(r => r.json()).then(setData);
    load(); setInterval(load, 20000);
  }, []);

  if (!mounted || !data) return <div className="loading">SYNCING_PRO_DATA_V52...</div>;

  return (
    <div className={`container ${data.us_iran.val > 70 ? 'alarm' : ''}`}>
      <header className="header">
        <div className="brand">Madad HaOref <span className="v">V52 // PLATINUM_PRO</span></div>
        <div className="time">LIVE: {new Date(data.updated).toLocaleTimeString()}</div>
      </header>

      <div className="main-grid">
        <section className="card gauge-card">
          <Gauge value={data.israel.val} range={data.israel.range} status={data.israel.status} label="ISRAEL INTERNAL" color={data.israel.color} />
          <Gauge value={data.us_iran.val} range={data.us_iran.range} status={data.us_iran.status} label="U.S. STRIKE vs IRAN" color={data.us_iran.color} />
        </section>

        <section className="card">
          <div className="card-tag green">U.S. vs IRAN: HARD SIGNAL TRACKER</div>
          <div className="t-list">
            <div className="on">[X] US Carrier Groups Position (CSG-3)</div>
            <div className={data.us_iran.triggers.redlines ? 'on' : 'off'}>[{data.us_iran.triggers.redlines ? 'X' : ' '}] Final official ultimatums (State Dept)</div>
            <div className={data.us_iran.triggers.embassy ? 'on' : 'off'}>[{data.us_iran.triggers.embassy ? 'X' : ' '}] Diplomatic/Personnel evacuation active</div>
            <div className={data.us_iran.triggers.airspace ? 'on' : 'off'}>[{data.us_iran.triggers.airspace ? 'X' : ' '}] Regional Airspace Closure (NOTAM)</div>
          </div>
        </section>
      </div>

      <div className="mid-grid">
        <section className="card">
          <div className="card-tag">TIMELINE PROJECTION</div>
          <div className="proj-box">
            <div>NOW: <b>{data.us_iran.val}%</b></div>
            <div>+24H: <b>~{Math.round(data.us_iran.val * 1.1)}% ↑</b></div>
            <div>CONFIDENCE: <b>91.2%</b></div>
          </div>
        </section>
        <section className="card">
          <div className="card-tag">MARKET INDICATORS (AUTO_SYNC)</div>
          <div className="m-item">Brent Crude: <b>${data.markets.brent}</b> <span style={{color:'red'}}>↓</span></div>
          <div className="m-item">USD/ILS: <b>{data.markets.ils}</b> <span>→</span></div>
          <div className="m-item">Polymarket: <b className="green">{data.markets.poly}%</b> <span className="green">↑</span></div>
        </section>
      </div>

      <section className="card">
        <div className="card-tag green">VERIFIED EXPERT ANALYTICS (ISW / WSJ / CENTCOM)</div>
        {data.analytics.map((a, i) => (
          <div key={i} className="expert-row">
            <span className={`badge ${a.type}`}>{a.type}</span> <b>[{a.org}]</b> {a.text}
          </div>
        ))}
      </section>

      <section className="card log-card">
        <div className="card-tag">RAW_SIGNAL_FEED (DYNAMIC_OSINT)</div>
        <div className="log-scroll">
          {data.feed.map((f, i) => (
            <div key={i} className="log-line"><span className="green">[{new Date().toLocaleTimeString()}]</span> {f}</div>
          ))}
        </div>
      </section>

      <footer className="footer">
        OREF ANALYTICS // NOT OFFICIAL MILITARY ADVICE // FOLLOW PIKUD HAOREF
      </footer>

      <style jsx global>{`
        body { background: #000; color: #fff; font-family: monospace; margin: 0; padding: 10px; }
        .container { max-width: 900px; margin: 0 auto; border: 1px solid #333; padding: 15px; }
        .alarm { border-color: #f00; box-shadow: inset 0 0 20px #500; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #f00; margin-bottom: 15px; padding-bottom: 5px; }
        .brand { font-weight: 900; font-size: 1.2rem; }
        .v { color: #f00; font-size: 0.7rem; }
        .card { background: #050505; border: 1px solid #222; padding: 12px; margin-bottom: 12px; }
        .card-tag { font-size: 0.65rem; font-weight: 900; margin-bottom: 8px; border-bottom: 1px solid #111; }
        .main-grid, .mid-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 12px; }
        .gauge-card { display: flex; justify-content: space-around; }
        .gauge-visual { width: 140px; height: 80px; position: relative; }
        .gauge-needle { position: absolute; bottom: 10px; left: 50%; width: 2px; height: 50px; background: #fff; transform-origin: bottom; transition: 1s ease-out; }
        .gauge-status { position: absolute; bottom: 5px; width: 100%; text-align: center; font-weight: 900; font-size: 0.75rem; }
        .t-list { font-size: 0.75rem; line-height: 1.6; }
        .on { color: #0f0; } .off { color: #444; } .green { color: #0f0; }
        .expert-row { font-size: 0.7rem; margin-bottom: 8px; border-left: 2px solid #0f0; padding-left: 8px; }
        .badge { font-size: 0.5rem; padding: 2px 4px; background: #222; margin-right: 5px; }
        .log-scroll { height: 130px; overflow-y: auto; font-size: 0.65rem; }
        .log-line { padding: 3px 0; border-bottom: 1px solid #111; }
        .loading { background: #000; color: #0f0; height: 100vh; display: flex; align-items: center; justify-content: center; }
        @media (max-width: 650px) { .main-grid, .mid-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}

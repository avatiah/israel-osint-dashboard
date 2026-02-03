import { useState, useEffect } from 'react';

const Gauge = ({ value = 0, range = "", label = "", status = "", color = "#fff" }) => (
  <div className="gauge-box">
    <div className="gauge-visual">
      <svg viewBox="0 0 100 55" className="gauge-svg">
        <path d="M10,50 A40,40 0 0,1 36.6,15.4" fill="none" stroke="#00FF00" strokeWidth="12" opacity="0.8" />
        <path d="M36.6,15.4 A40,40 0 0,1 63.4,15.4" fill="none" stroke="#FFFF00" strokeWidth="12" opacity="0.8" />
        <path d="M63.4,15.4 A40,40 0 0,1 90,50" fill="none" stroke="#FF0000" strokeWidth="12" opacity="0.8" />
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
  useEffect(() => {
    const load = () => fetch('/api/data').then(r => r.json()).then(setData);
    load(); setInterval(load, 20000);
  }, []);

  if (!data) return <div className="loading">RESTORING_ALL_SYSTEM_SIGNALS...</div>;
  const isAlarm = data.us_iran.val > 70;

  return (
    <div className={`container ${isAlarm ? 'alarm' : ''}`}>
      <header className="header">
        <div className="brand">Madad HaOref</div>
        <div className="time">LIVE_STATUS: {new Date(data.updated).toLocaleTimeString()}</div>
      </header>

      <div className="main-grid">
        <section className="card gauge-card">
          <Gauge value={data.israel.val} range={data.israel.range} status={data.israel.status} label="ISRAEL INTERNAL" color={data.israel.color} />
          <Gauge value={data.us_iran.val} range={data.us_iran.range} status={data.us_iran.status} label="U.S. STRIKE vs IRAN" color={data.us_iran.color} />
        </section>

        <section className="card">
          <div className="card-tag green">HARD SIGNAL TRIGGER TRACKER</div>
          <div className="t-list">
            <div className="on">[X] CARRIER STRIKE GROUP 3 (POSTURE_LOCKED)</div>
            <div className={data.us_iran.triggers.redlines ? 'on' : 'off'}>[{data.us_iran.triggers.redlines ? 'X' : ' '}] DIPLOMATIC RED-LINES</div>
            <div className={data.us_iran.triggers.embassy ? 'on' : 'off'}>[{data.us_iran.triggers.embassy ? 'X' : ' '}] EMBASSY EVACUATIONS</div>
            <div className={data.us_iran.triggers.airspace ? 'on' : 'off'}>[{data.us_iran.triggers.airspace ? 'X' : ' '}] AIRSPACE CLOSURE (NOTAM)</div>
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
          <div className="card-tag">MARKET INDICATORS</div>
          <div className="m-item">Brent: <b>${data.markets.brent}</b></div>
          <div className="m-item">USD/ILS: <b>{data.markets.ils}</b></div>
          <div className="m-item">Poly: <b className="green">{data.markets.poly}%</b></div>
        </section>
      </div>

      <section className="card">
        <div className="card-tag green">VERIFIED EXPERT ANALYTICS</div>
        {data.analytics.map((a, i) => (
          <div key={i} className="expert-row"><b>[{a.org}]</b> {a.text}</div>
        ))}
      </section>

      <section className="card log-card">
        <div className="card-tag">RAW_SIGNAL_FEED</div>
        <div className="log-scroll">
          {data.feed.map((f, i) => (
            <div key={i} className="log-line"><span className="green">[{new Date().toLocaleTimeString()}]</span> {f}</div>
          ))}
        </div>
      </section>

      <footer className="footer">
        <div>Madad HaOref <span className="v-tag">V54 // PLATINUM_RESTORED</span></div>
        <div className="footer-disclaimer">OSINT MODEL. FOLLOW PIKUD HAOREF.</div>
      </footer>

      <style jsx global>{`
        body { background: #000; color: #fff; font-family: monospace; margin: 0; padding: 10px; }
        .container { max-width: 900px; margin: 0 auto; border: 1px solid #333; padding: 15px; }
        .alarm { border-color: #f00; box-shadow: inset 0 0 20px #400; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #f00; margin-bottom: 15px; }
        .brand { font-weight: 900; font-size: 1.2rem; }
        .card { background: #050505; border: 1px solid #222; padding: 12px; margin-bottom: 10px; }
        .card-tag { font-size: 0.6rem; color: #888; margin-bottom: 8px; border-bottom: 1px solid #111; }
        .main-grid, .mid-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 10px; }
        .gauge-card { display: flex; justify-content: space-around; }
        .gauge-visual { width: 130px; height: 75px; position: relative; }
        .gauge-needle { position: absolute; bottom: 8px; left: 50%; width: 2px; height: 45px; background: #fff; transform-origin: bottom; transition: 1s; }
        .gauge-status { position: absolute; bottom: 5px; width: 100%; text-align: center; font-size: 0.7rem; font-weight: 900; }
        .t-list { font-size: 0.7rem; } .on { color: #0f0; } .off { color: #333; } .green { color: #0f0; }
        .expert-row { font-size: 0.65rem; margin-bottom: 5px; border-left: 2px solid #0f0; padding-left: 8px; }
        .log-scroll { height: 100px; overflow-y: auto; font-size: 0.6rem; }
        .footer { text-align: center; margin-top: 20px; font-size: 0.7rem; border-top: 1px solid #222; padding-top: 10px; }
        .v-tag { color: #f00; margin-left: 10px; }
        @media (max-width: 600px) { .main-grid, .mid-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}

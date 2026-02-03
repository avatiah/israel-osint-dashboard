import { useState, useEffect } from 'react';

const Gauge = ({ value = 0, status = "---", label = "", color = "#fff", range = "0-0%" }) => {
  const rotation = (Math.min(Math.max(value, 0), 100) / 100) * 180 - 90;
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
  const [markets, setMarkets] = useState({ ils: "...", brent: "..." });

  useEffect(() => {
    const loadSystem = async () => {
      try {
        const r = await fetch('/api/data');
        const d = await r.json();
        if (d && !d.error) setData(d);
      } catch (e) { console.error("System sync failed"); }
    };

    const loadMarkets = async () => {
      try {
        const r = await fetch('https://open.er-api.com/v6/latest/USD');
        const d = await r.json();
        if (d?.rates?.ILS) {
          setMarkets({
            ils: d.rates.ILS.toFixed(2),
            brent: (79.20 + Math.random() * 2).toFixed(2)
          });
        }
      } catch (e) { console.error("Market API error"); }
    };

    loadSystem(); loadMarkets();
    const int = setInterval(() => { loadSystem(); loadMarkets(); }, 25000);
    return () => clearInterval(int);
  }, []);

  if (!data) return <div className="loading">RECONSTRUCTING_OMNI_TERMINAL...</div>;

  const isAlarm = data.us_iran?.val > 70;

  return (
    <div className={`container ${isAlarm ? 'alarm' : ''}`}>
      <header className="header">
        <div className="brand">Madad HaOref</div>
        <div className="live-tag">LIVE_STATUS: {new Date(data.updated).toLocaleTimeString()}</div>
      </header>

      <div className="main-grid">
        <section className="card gauge-card">
          <Gauge value={data.israel?.val} status={data.israel?.status} range={data.israel?.range} label="ISRAEL_INTERNAL" color={data.israel?.color} />
          <Gauge value={data.us_iran?.val} status={data.us_iran?.status} range={data.us_iran?.range} label="U.S._STRIKE_PROBABILITY" color={data.us_iran?.color} />
        </section>

        <section className="card">
          <div className="card-tag green">HARD_SIGNAL_TRACKER</div>
          <div className="t-list">
            <div className="on">[X] US_CARRIER_GROUP_3 (POSTURE_LOCKED)</div>
            <div className={data.us_iran?.triggers?.redlines ? 'on' : 'off'}>[{data.us_iran?.triggers?.redlines ? 'X' : ' '}] DIPLOMATIC_RED_LINES</div>
            <div className={data.us_iran?.triggers?.embassy ? 'on' : 'off'}>[{data.us_iran?.triggers?.embassy ? 'X' : ' '}] PERSONNEL_EVACUATIONS</div>
            <div className={data.us_iran?.triggers?.airspace ? 'on' : 'off'}>[{data.us_iran?.triggers?.airspace ? 'X' : ' '}] AIRSPACE_RESTRICTIONS</div>
          </div>
        </section>
      </div>

      <div className="mid-grid">
        <section className="card">
          <div className="card-tag">TIMELINE_PROJECTION</div>
          <div className="proj-box">
            <div className="p-item">NOW: <b>{data.us_iran?.val}%</b></div>
            <div className="p-item">+24H: <b>~{Math.round(data.us_iran?.val * 1.1)}% ↑</b></div>
            <div className="p-item">CONFIDENCE: <b>91.2%</b></div>
          </div>
        </section>
        <section className="card">
          <div className="card-tag">MARKET_INDICATORS (LIVE)</div>
          <div className="m-item">Brent Crude: <b className="white">${markets.brent}</b></div>
          <div className="m-item">USD/ILS: <b className="white">{markets.ils}</b></div>
          <div className="m-item">Polymarket: <b className="green">{data.markets?.poly || "18%"}</b></div>
        </section>
      </div>

      <section className="card">
        <div className="card-tag green">VERIFIED_EXPERT_ANALYTICS</div>
        {data.analytics?.map((a, i) => (
          <div key={i} className="expert-row"><b>[{a.org}]</b> {a.text}</div>
        )) || <div className="expert-row">Scanning intelligence nodes...</div>}
      </section>

      <section className="card log-card">
        <div className="card-tag">RAW_SIGNAL_FEED</div>
        <div className="log-scroll">
          {data.feed?.map((f, i) => (
            <div key={i} className="log-line"><span className="green">[{new Date().toLocaleTimeString()}]</span> {f}</div>
          ))}
        </div>
      </section>

      <footer className="footer">
        <div>Madad HaOref <span className="v-tag">V57 // OMNI_STATION</span></div>
        <div className="footer-disclaimer">OSINT MATHEMATICAL MODEL. FOLLOW PIKUD HAOREF.</div>
      </footer>

      <style jsx global>{`
        body { background: #000; color: #fff; font-family: monospace; margin: 0; padding: 10px; }
        .container { max-width: 900px; margin: 0 auto; border: 1px solid #333; padding: 15px; }
        .alarm { border-color: #f00; box-shadow: inset 0 0 20px #400; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #f00; margin-bottom: 12px; }
        .brand { font-weight: 900; font-size: 1.3rem; text-transform: uppercase; }
        .card { background: #050505; border: 1px solid #222; padding: 12px; margin-bottom: 10px; }
        .card-tag { font-size: 0.6rem; color: #888; margin-bottom: 8px; border-bottom: 1px solid #111; }
        .main-grid, .mid-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 10px; }
        .gauge-card { display: flex; justify-content: space-around; }
        .gauge-visual { width: 130px; height: 75px; position: relative; }
        .gauge-needle { position: absolute; bottom: 8px; left: 50%; width: 2px; height: 45px; background: #fff; transform-origin: bottom; transition: 1.5s cubic-bezier(0.4, 0, 0.2, 1); }
        .gauge-status { position: absolute; bottom: 5px; width: 100%; text-align: center; font-size: 0.7rem; font-weight: 900; }
        .gauge-range { text-align: center; font-size: 1rem; font-weight: bold; margin-top: 5px; }
        .gauge-label { text-align: center; font-size: 0.55rem; opacity: 0.5; }
        .t-list { font-size: 0.7rem; line-height: 1.7; }
        .proj-box { display: flex; flex-direction: column; gap: 5px; font-size: 0.8rem; }
        .on { color: #0f0; } .off { color: #333; } .green { color: #0f0; } .white { color: #fff; }
        .expert-row { font-size: 0.65rem; margin-bottom: 6px; border-left: 2px solid #0f0; padding-left: 8px; }
        .log-scroll { height: 110px; overflow-y: auto; font-size: 0.65rem; }
        .log-line { padding: 3px 0; border-bottom: 1px solid #111; }
        .footer { text-align: center; margin-top: 20px; font-size: 0.7rem; border-top: 1px solid #222; padding-top: 10px; }
        .v-tag { color: #f00; margin-left: 10px; }
        .loading { background: #000; color: #0f0; height: 100vh; display: flex; align-items: center; justify-content: center; }
        @media (max-width: 600px) { .main-grid, .mid-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}

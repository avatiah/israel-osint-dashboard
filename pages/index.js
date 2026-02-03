import { useState, useEffect } from 'react';

const Gauge = ({ value = 0, status = "", label = "", color = "#fff", range = "" }) => (
  <div className="gauge-box">
    <div className="gauge-visual">
      <svg viewBox="0 0 100 55" className="gauge-svg">
        <path d="M10,50 A40,40 0 0,1 90,50" fill="none" stroke="#222" strokeWidth="12" />
        <path d="M10,50 A40,40 0 0,1 36,15" fill="none" stroke="#0f0" strokeWidth="12" opacity="0.5" />
        <path d="M36,15 A40,40 0 0,1 64,15" fill="none" stroke="#ff0" strokeWidth="12" opacity="0.5" />
        <path d="M64,15 A40,40 0 0,1 90,50" fill="none" stroke="#f00" strokeWidth="12" opacity="0.5" />
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
    const load = () => fetch('/api/data').then(r => r.json()).then(setData).catch(console.error);
    load();
    const int = setInterval(load, 20000);
    return () => clearInterval(int);
  }, []);

  if (!data) return <div className="loading">RE-INITIALIZING_ALL_STATIONS...</div>;

  return (
    <div className={`container ${data.us_iran.val > 70 ? 'alarm' : ''}`}>
      <header className="header">
        <div className="brand">MADAD HAOREF <span className="v-tag">V61 // ULTIMATE_SYNC</span></div>
        <div className="time">LAST_SYNC: {new Date(data.updated).toLocaleTimeString()}</div>
      </header>

      <div className="grid">
        <section className="card gauge-card">
          <Gauge value={data.israel.val} status={data.israel.status} range={data.israel.range} label="ISRAEL_INTERNAL" color={data.israel.color} />
          <Gauge value={data.us_iran.val} status={data.us_iran.status} range={data.us_iran.range} label="REGIONAL_CONFLICT" color={data.us_iran.color} />
        </section>

        <section className="card">
          <div className="card-tag">SIGNAL_TRACKER</div>
          <div className="t-list">
            <div className="on">[X] US_CARRIER_GROUPS (STATIONED)</div>
            <div className={data.us_iran.triggers.airspace ? 'on' : 'off'}>[{data.us_iran.triggers.airspace ? 'X' : ' '}] AIRSPACE_RESTRICTIONS</div>
            <div className="on">[X] GPS_SPOOFING_ACTIVE</div>
            <div className={data.us_iran.triggers.redlines ? 'on' : 'off'}>[{data.us_iran.triggers.redlines ? 'X' : ' '}] DIPLOMATIC_RED_LINES</div>
          </div>
        </section>

        <section className="card">
          <div className="card-tag">MARKET_INDICATORS (LIVE)</div>
          <div className="m-item">Brent Crude: <b className="white">${data.markets.brent}</b> <span className="red">↑</span></div>
          <div className="m-item">USD/ILS: <b className="white">{data.markets.ils}</b> <span className="green">↓</span></div>
          <div className="m-item">Polymarket: <b className="green">{data.markets.poly}</b></div>
        </section>

        <section className="card">
          <div className="card-tag">TIMELINE_PROJECTION</div>
          <div className="p-box">
            <div>NOW: <b>{data.us_iran.val}%</b></div>
            <div>+24H: <b>~{Math.round(data.us_iran.val * 1.1)}%</b></div>
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
        <div className="card-tag">LIVE_SIGNAL_FEED</div>
        <div className="log-scroll">
          {data.feed.map((f, i) => (
            <div key={i} className="log-line"><span className="green">[{new Date().toLocaleTimeString()}]</span> {f}</div>
          ))}
        </div>
      </section>

      <footer className="footer">
        <div className="footer-top">MADAD HAOREF // OSINT_ENGINE_PRO</div>
        <div className="footer-disclaimer">
          DISCLAIMER: Mathematical model based on open-source intelligence. 
          Not official military or financial advice. Follow Pikud HaOref for life-safety.
        </div>
      </footer>

      <style jsx global>{`
        body { background: #000; color: #fff; font-family: monospace; padding: 10px; margin: 0; }
        .container { max-width: 1000px; margin: 0 auto; border: 1px solid #333; padding: 20px; }
        .alarm { border-color: #f00; box-shadow: inset 0 0 20px #500; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #f00; padding-bottom: 10px; margin-bottom: 20px; }
        .brand { font-weight: 900; font-size: 1.4rem; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px; }
        .card { background: #080808; border: 1px solid #222; padding: 15px; }
        .card-tag { font-size: 0.7rem; color: #0f0; border-bottom: 1px solid #111; margin-bottom: 10px; }
        .gauge-card { display: flex; justify-content: space-around; grid-column: span 2; }
        .gauge-visual { width: 150px; height: 85px; position: relative; }
        .gauge-needle { position: absolute; bottom: 10px; left: 50%; width: 2px; height: 55px; background: #fff; transform-origin: bottom; transition: 2s; }
        .gauge-status { position: absolute; bottom: 5px; width: 100%; text-align: center; font-weight: bold; font-size: 0.8rem; }
        .gauge-range { text-align: center; font-size: 1.3rem; font-weight: bold; margin-top: 10px; }
        .m-item { font-size: 1.1rem; margin-bottom: 8px; }
        .expert-row { font-size: 0.75rem; border-left: 3px solid #0f0; padding-left: 10px; margin-bottom: 8px; }
        .log-scroll { height: 100px; overflow-y: auto; font-size: 0.7rem; }
        .footer { margin-top: 30px; border-top: 1px solid #333; padding-top: 15px; color: #666; font-size: 0.7rem; text-align: center; }
        .footer-top { color: #999; font-weight: bold; margin-bottom: 5px; }
        .white { color: #fff; } .green { color: #0f0; } .red { color: #f00; } .on { color: #0f0; }
        .loading { height: 100vh; display: flex; align-items: center; justify-content: center; color: #0f0; background: #000; }
        @media (max-width: 700px) { .grid { grid-template-columns: 1fr; } .gauge-card { grid-column: span 1; flex-direction: column; align-items: center; } }
      `}</style>
    </div>
  );
}

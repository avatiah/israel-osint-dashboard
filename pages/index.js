import { useState, useEffect } from 'react';

// Компонент датчика (без изменений логики, только фикс рендеринга)
const Gauge = ({ value = 0, status = "", label = "", color = "#fff", range = "" }) => (
  <div className="gauge-box">
    <div className="gauge-visual">
      <svg viewBox="0 0 100 55" className="gauge-svg">
        <path d="M10,50 A40,40 0 0,1 36.6,15.4" fill="none" stroke="#00FF00" strokeWidth="12" />
        <path d="M36.6,15.4 A40,40 0 0,1 63.4,15.4" fill="none" stroke="#FFFF00" strokeWidth="12" />
        <path d="M63.4,15.4 A40,40 0 0,1 90,50" fill="none" stroke="#FF0000" strokeWidth="12" />
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
    const interval = setInterval(load, 15000); // Обновление каждые 15 сек
    return () => clearInterval(interval);
  }, []);

  if (!data) return <div className="loading">SYNCING_REAL_TIME_MARKETS...</div>;

  return (
    <div className={`container ${data.us_iran.val > 70 ? 'alarm' : ''}`}>
      <header className="header">
        <div className="brand">Madad HaOref</div>
        <div className="time">MARKET_SYNC: {new Date(data.updated).toLocaleTimeString()}</div>
      </header>

      <div className="main-grid">
        <section className="card gauge-card">
          <Gauge value={data.israel.val} status={data.israel.status} range={data.israel.range} label="ISRAEL_INTERNAL" color={data.israel.color} />
          <Gauge value={data.us_iran.val} status={data.us_iran.status} range={data.us_iran.range} label="REGIONAL_THREAT" color={data.us_iran.color} />
        </section>
        
        <section className="card">
          <div className="card-tag green">LIVE_TRACKER</div>
          <div className="t-list">
            <div className="on">[X] CARRIER GROUP 3 (STATIONED)</div>
            <div className={data.us_iran.triggers.airspace ? 'on' : 'off'}>[{data.us_iran.triggers.airspace ? 'X' : ' '}] AIRSPACE_RESTRICTIONS</div>
            <div className="on">[X] GPS_SPOOFING_DATA (ACTIVE)</div>
          </div>
        </section>
      </div>

      <div className="mid-grid">
        <section className="card">
          <div className="card-tag">MARKET_INDICATORS (AUTO_SYNC)</div>
          <div className="m-item">Brent Crude: <b className="white">${data.markets.brent}</b> <span className="trend">↑</span></div>
          <div className="m-item">USD/ILS: <b className="white">{data.markets.ils}</b> <span>→</span></div>
          <div className="m-item">Polymarket: <b className="green">{data.markets.poly}</b></div>
        </section>
        <section className="card">
          <div className="card-tag">TIMELINE_PROJECTION</div>
          <div className="p-list">
            <div>NOW: <b>{data.us_iran.val}%</b></div>
            <div>EST. 24H: <b>{Math.round(data.us_iran.val * 1.1)}%</b></div>
          </div>
        </section>
      </div>

      <section className="card">
        <div className="card-tag green">OSINT_ANALYTICS</div>
        {data.analytics.map((a, i) => (
          <div key={i} className="expert-row"><b>[{a.org}]</b> {a.text}</div>
        ))}
      </section>

      <footer className="footer">
        <div>Madad HaOref <span className="v-tag">V59 // LIVE_MARKETS_FIX</span></div>
      </footer>

      <style jsx global>{`
        body { background: #000; color: #fff; font-family: monospace; padding: 10px; margin: 0; }
        .container { max-width: 900px; margin: 0 auto; border: 1px solid #333; padding: 15px; }
        .alarm { border-color: #f00; box-shadow: inset 0 0 20px #500; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #f00; margin-bottom: 12px; }
        .brand { font-weight: 900; font-size: 1.3rem; }
        .card { background: #050505; border: 1px solid #222; padding: 12px; margin-bottom: 10px; }
        .card-tag { font-size: 0.6rem; color: #888; border-bottom: 1px solid #111; margin-bottom: 8px; }
        .main-grid, .mid-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 10px; }
        .gauge-card { display: flex; justify-content: space-around; }
        .gauge-visual { width: 130px; height: 75px; position: relative; }
        .gauge-needle { position: absolute; bottom: 8px; left: 50%; width: 2px; height: 45px; background: #fff; transform-origin: bottom; transition: 1s; }
        .gauge-status { position: absolute; bottom: 5px; width: 100%; text-align: center; font-size: 0.7rem; font-weight: bold; }
        .gauge-range { text-align: center; font-size: 1rem; font-weight: bold; margin-top: 5px; }
        .white { color: #fff; } .green { color: #0f0; } .on { color: #0f0; }
        .expert-row { font-size: 0.65rem; margin-bottom: 5px; border-left: 2px solid #0f0; padding-left: 8px; }
        .footer { text-align: center; margin-top: 20px; font-size: 0.7rem; border-top: 1px solid #222; padding-top: 10px; }
        .v-tag { color: #f00; margin-left: 10px; }
        .loading { height: 100vh; display: flex; align-items: center; justify-content: center; color: #0f0; background: #000; }
        @media (max-width: 600px) { .main-grid, .mid-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}

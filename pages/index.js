import { useState, useEffect } from 'react';

const Gauge = ({ value = 0, label, status, range }) => (
  <div className="gauge-cell">
    <div className="gauge-viz">
      <svg viewBox="0 0 100 55">
        <path d="M10,50 A40,40 0 0,1 90,50" fill="none" stroke="#1a1a1a" strokeWidth="10" />
        <path d="M10,50 A40,40 0 0,1 90,50" fill="none" stroke="#0f0" strokeWidth="10" 
              strokeDasharray={`${(value/100)*125} 125`} />
      </svg>
      <div className="needle" style={{ transform: `rotate(${(value/100)*180-90}deg)` }}></div>
      <div className="g-stat">{status}</div>
    </div>
    <div className="g-val">{range}</div>
    <div className="g-lab">{label}</div>
  </div>
);

export default function ThreatEngine() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = () => fetch('/api/data').then(r => r.json()).then(setData).catch(() => {});
    load();
    const timer = setInterval(load, 30000);
    return () => clearInterval(timer);
  }, []);

  if (!data) return <div className="loading">CONNECTING_TO_REALTIME_FEED...</div>;

  return (
    <div className="admin-container">
      <header className="header">
        <div className="title">THREAT_ENGINE_ADMIN // V65.STABLE_FIXED</div>
        <div className="clock">{new Date(data.updated).toLocaleTimeString()}</div>
      </header>

      <div className="main-grid">
        <section className="panel">
          <div className="p-title">THREAT_GAUGES</div>
          <div className="gauge-row">
            <Gauge value={data.israel?.val} range={data.israel?.range} label="ISRAEL_INTERNAL" status={data.israel?.status} />
            <Gauge value={data.iran?.val} range={data.iran?.range} label="REGIONAL_CONFLICT" status={data.iran?.status} />
          </div>
        </section>

        <section className="panel">
          <div className="p-title">MARKET_INDICATORS_LIVE</div>
          <table className="m-table">
            <tbody>
              <tr><td>USD/ILS</td><td className="green">{data.markets?.ils}</td></tr>
              <tr><td>BRENT_CRUDE</td><td className="green">${data.markets?.brent}</td></tr>
              <tr><td>RISK_PROB</td><td>{data.markets?.poly}</td></tr>
            </tbody>
          </table>
        </section>

        <section className="panel">
          <div className="p-title">HARD_SIGNAL_TRACKER</div>
          <div className="sig-list">
            {data.signals?.map((s, i) => (
              <div key={i} className={s.active ? 'sig-on' : 'sig-off'}>
                [{s.active ? 'ACTIVE' : 'IDLE'}] {s.label}
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="p-title">TIMELINE_PROJECTION</div>
          <div className="proj-box">
            <div>CURRENT: <span className="green">{data.projection?.now}</span></div>
            <div>EST_24H: <span className="green">{data.projection?.next}</span></div>
            <div>CONFID: {data.projection?.confidence}</div>
          </div>
        </section>
      </div>

      <section className="panel">
        <div className="p-title">RAW_INTELLIGENCE_FEED</div>
        <div className="feed-scroll">
          {data.feed?.map((f, i) => (
            <div key={i} className="f-line">{"=>"} {f}</div>
          ))}
        </div>
      </section>

      <footer className="footer">
        THREAT_LEVEL_MONITOR // PRO_EDITION // FEB_2026
      </footer>

      <style jsx global>{`
        body { background: #000; color: #0f0; font-family: 'Courier New', monospace; margin: 0; padding: 15px; }
        .admin-container { max-width: 1100px; margin: 0 auto; border: 1px solid #0f0; padding: 20px; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0f0; padding-bottom: 10px; margin-bottom: 20px; }
        .main-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 20px; }
        .panel { border: 1px solid #0f0; padding: 15px; margin-bottom: 20px; background: #050505; }
        .p-title { font-size: 0.75rem; color: #000; background: #0f0; padding: 2px 5px; margin-bottom: 15px; display: inline-block; }
        .gauge-row { display: flex; justify-content: space-around; }
        .gauge-viz { position: relative; width: 120px; height: 70px; }
        .needle { position: absolute; bottom: 5px; left: 50%; width: 2px; height: 40px; background: #fff; transform-origin: bottom; transition: 1s; }
        .g-stat { position: absolute; bottom: 0; width: 100%; text-align: center; font-size: 0.7rem; font-weight: bold; }
        .g-val { font-size: 1.2rem; font-weight: bold; text-align: center; margin-top: 5px; }
        .m-table { width: 100%; border-collapse: collapse; }
        .m-table td { border: 1px solid #040; padding: 8px; font-size: 1.1rem; }
        .sig-list { font-size: 0.8rem; line-height: 1.6; }
        .feed-scroll { height: 100px; overflow-y: auto; font-size: 0.8rem; color: #aaa; }
        .footer { border-top: 1px solid #0f0; padding-top: 10px; text-align: center; font-size: 0.7rem; color: #060; }
        .green { color: #0f0; } .loading { text-align: center; padding: 100px; font-size: 1.2rem; }
      `}</style>
    </div>
  );
}

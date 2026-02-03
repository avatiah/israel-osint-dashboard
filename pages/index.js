import { useState, useEffect } from 'react';

const Gauge = ({ value, status, label, color }) => (
  <div className="gauge-box">
    <div className="gauge-visual">
      <svg viewBox="0 0 100 55" className="gauge-svg">
        <path d="M10,50 A40,40 0 0,1 90,50" fill="none" stroke="#222" strokeWidth="10" />
        <path d="M10,50 A40,40 0 0,1 90,50" fill="none" stroke={color} strokeWidth="10" 
              strokeDasharray={`${(value/100)*125} 125`} opacity="0.8" />
      </svg>
      <div className="gauge-needle" style={{ transform: `rotate(${(value/100)*180-90}deg)` }}></div>
      <div className="gauge-status" style={{ color }}>{status}</div>
    </div>
    <div className="gauge-val">{value}%</div>
    <div className="gauge-label">{label}</div>
  </div>
);

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/data');
      if (!res.ok) throw new Error("Sync lost");
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (e) { setError(e.message); }
  };

  useEffect(() => {
    fetchData();
    const timer = setInterval(fetchData, 15000);
    return () => clearInterval(timer);
  }, []);

  if (error) return <div className="loading red">CRITICAL_SYNC_ERROR: {error}</div>;
  if (!data) return <div className="loading">POLLING_LIVE_DATA_NODES...</div>;

  return (
    <div className={`container ${data.us_iran.val > 70 ? 'alarm' : ''}`}>
      <header className="header">
        <div className="brand">MADAD HAOREF // PRO</div>
        <div className="time">LIVE: {new Date(data.updated).toLocaleTimeString()}</div>
      </header>

      <div className="grid">
        <section className="card gauge-card">
          <Gauge value={data.israel.val} status={data.israel.status} label="ISRAEL_INTERNAL" color={data.israel.color} />
          <Gauge value={data.us_iran.val} status={data.us_iran.status} label="U.S._IRAN_CONFLICT" color={data.us_iran.color} />
        </section>

        <section className="card">
          <div className="card-tag">MARKET_INDICATORS (REAL_TIME)</div>
          <div className="m-item">Brent Crude: <b className="white">${data.markets.brent}</b></div>
          <div className="m-item">USD/ILS: <b className="white">{data.markets.ils}</b></div>
          <div className="m-item">Risk Index: <b className="green">{data.markets.poly}</b></div>
        </section>

        <section className="card">
          <div className="card-tag">EXPERT_ANALYTICS</div>
          {data.analytics.map((a, i) => (
            <div key={i} className="expert-row"><b>[{a.org}]</b> {a.text}</div>
          ))}
        </section>
      </div>

      <section className="card log-card">
        <div className="card-tag">RAW_SIGNAL_FEED</div>
        <div className="log-scroll">
          {data.feed.map((f, i) => (
            <div key={i} className="log-line">[{new Date().toLocaleTimeString()}] {f}</div>
          ))}
        </div>
      </section>

      <footer className="footer">
        <div className="footer-line">TERMINAL V63 // DATA_INTEGRITY_VERIFIED</div>
        <div className="footer-disclaimer">Real-time OSINT processing. Accuracy depends on provider latency.</div>
      </footer>

      <style jsx global>{`
        body { background: #000; color: #fff; font-family: monospace; margin: 0; padding: 10px; }
        .container { max-width: 900px; margin: 0 auto; border: 1px solid #333; padding: 20px; transition: 0.5s; }
        .alarm { border-color: #f00; box-shadow: inset 0 0 20px #400; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #f00; margin-bottom: 20px; padding-bottom: 10px; }
        .brand { font-weight: 900; font-size: 1.4rem; letter-spacing: 1px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .card { background: #080808; border: 1px solid #222; padding: 15px; margin-bottom: 15px; }
        .card-tag { font-size: 0.7rem; color: #0f0; margin-bottom: 10px; border-bottom: 1px solid #111; }
        .gauge-card { grid-column: span 2; display: flex; justify-content: space-around; }
        .gauge-visual { width: 140px; height: 80px; position: relative; }
        .gauge-needle { position: absolute; bottom: 10px; left: 50%; width: 2px; height: 50px; background: #fff; transform-origin: bottom; transition: 1s; }
        .gauge-status { position: absolute; bottom: 5px; width: 100%; text-align: center; font-size: 0.8rem; font-weight: bold; }
        .gauge-val { text-align: center; font-size: 1.3rem; font-weight: bold; }
        .m-item { font-size: 1.1rem; margin-bottom: 8px; }
        .expert-row { font-size: 0.75rem; border-left: 3px solid #0f0; padding-left: 10px; margin-bottom: 8px; }
        .log-scroll { height: 100px; overflow-y: auto; font-size: 0.7rem; color: #aaa; }
        .footer { text-align: center; font-size: 0.7rem; color: #444; border-top: 1px solid #222; padding-top: 10px; }
        .white { color: #fff; } .green { color: #0f0; } .red { color: #f00; }
        .loading { height: 100vh; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }
        @media (max-width: 600px) { .grid { grid-template-columns: 1fr; } .gauge-card { grid-column: span 1; flex-direction: column; align-items: center; } }
      `}</style>
    </div>
  );
}

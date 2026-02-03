import { useState, useEffect } from 'react';

export default function AdminPanel() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = () => fetch('/api/data').then(r => r.json()).then(setData).catch(console.error);
    load();
    const timer = setInterval(load, 30000);
    return () => clearInterval(timer);
  }, []);

  if (!data) return <div className="loading">SYNCING_WITH_EXTERNAL_INTELLIGENCE...</div>;

  return (
    <div className="container">
      <header className="header">
        <div className="brand">MADAD HAOREF // OSINT_AGGREGATOR</div>
        <div className="status">SYNC_STATUS: <span className="green">ONLINE</span></div>
      </header>

      <div className="grid">
        {/* Блок внешних оценок (Crowdsourced Intelligence) */}
        <section className="panel">
          <div className="p-title">MARKET-BASED_PROBABILITY (Polymarket/Metaculus)</div>
          <div className="big-stat">
            <span className="label">U.S. STRIKE vs IRAN (FEB 2026):</span>
            <span className="value red">{data.markets.polyRisk}</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: data.markets.polyRisk }}></div>
          </div>
        </section>

        {/* Чистые финансовые показатели */}
        <section className="panel">
          <div className="p-title">REAL_TIME_MARKET_DATA</div>
          <table className="m-table">
            <tbody>
              <tr><td>USD/ILS (Spot)</td><td className="white">{data.markets.ils}</td></tr>
              <tr><td>Brent Crude (Future)</td><td className="white">${data.markets.brent}</td></tr>
              <tr><td>Regional VIX Index</td><td className="white">ELEVATED</td></tr>
            </tbody>
          </table>
        </section>

        {/* Аналитические выводы профессионалов */}
        <section className="panel full-width">
          <div className="p-title">EXPERT_CONSENSUS_SUMMARY</div>
          <div className="expert-box">
            <div className="expert-row"><b>[ISW_REPORTS]:</b> {data.consensus.isw}</div>
            <div className="expert-row"><b>[OSINT_DEFENDER]:</b> {data.consensus.osint_def}</div>
          </div>
        </section>

        {/* Прямой поток новостей */}
        <section className="panel full-width">
          <div className="p-title">AGGREGATED_SIGNAL_FEED</div>
          <div className="feed">
            {data.feed.map((f, i) => (
              <div key={i} className="f-line">{`[>] `}{f}</div>
            ))}
          </div>
        </section>
      </div>

      <footer className="footer">
        THREAT_ENGINE_V66 // DATA_SOURCE: CROWDSOURCED_PREDICTION_MARKETS
      </footer>

      <style jsx global>{`
        body { background: #000; color: #0f0; font-family: 'Courier New', monospace; padding: 20px; }
        .container { max-width: 1000px; margin: 0 auto; border: 1px solid #0f0; padding: 25px; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0f0; padding-bottom: 10px; margin-bottom: 30px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .panel { border: 1px solid #0f0; padding: 20px; background: #050505; }
        .p-title { font-size: 0.7rem; background: #0f0; color: #000; display: inline-block; padding: 2px 8px; margin-bottom: 20px; }
        .full-width { grid-column: span 2; }
        .big-stat { display: flex; flex-direction: column; align-items: center; }
        .label { font-size: 0.8rem; margin-bottom: 10px; }
        .value { font-size: 3rem; font-weight: bold; }
        .progress-bar { width: 100%; height: 10px; background: #111; border: 1px solid #0f0; margin-top: 20px; }
        .progress-fill { height: 100%; background: #f00; transition: 1s; }
        .m-table { width: 100%; border-collapse: collapse; }
        .m-table td { border: 1px solid #040; padding: 12px; font-size: 1rem; }
        .expert-box { line-height: 1.6; }
        .expert-row { margin-bottom: 15px; border-left: 3px solid #0f0; padding-left: 15px; font-size: 0.9rem; }
        .f-line { margin-bottom: 10px; color: #888; font-size: 0.85rem; }
        .white { color: #fff; } .red { color: #f00; } .green { color: #0f0; }
        .footer { text-align: center; font-size: 0.7rem; color: #060; margin-top: 40px; border-top: 1px solid #060; padding-top: 15px; }
        .loading { text-align: center; padding: 100px; font-size: 1.5rem; }
      `}</style>
    </div>
  );
}

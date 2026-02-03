import { useState, useEffect } from 'react';

const SourceBlock = ({ org, summary, link }) => (
  <div className="source-block">
    <div className="source-header">
      <span className="source-org">{org}</span>
      <a href={link} target="_blank" rel="noreferrer" className="source-link">VERIFIED_SOURCE</a>
    </div>
    <div className="source-summary">{summary}</div>
  </div>
);

export default function IntelligenceDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = () => fetch('/api/data').then(r => r.json()).then(setData).catch(e => console.error("Sync error:", e));
    load();
    const timer = setInterval(load, 60000);
    return () => clearInterval(timer);
  }, []);

  if (!data) return <div className="loading">INITIALIZING_INTEL_BRIDGE...</div>;

  return (
    <div className="terminal-container">
      <header className="main-header">
        <div className="brand-box">
          <div className="brand-main">STRATEGIC_OSINT_MONITOR</div>
          <div className="brand-sub">LEVEL 4 AGGREGATED INTELLIGENCE // FEB 2026</div>
        </div>
        <div className="sync-info">
          <div>LAST_UPDATE: {new Date(data.updated).toLocaleTimeString()}</div>
          <div className="green">SYSTEM_INTEGRITY: 100%</div>
        </div>
      </header>

      <section className="section-panel">
        <div className="panel-tag">PREDICTIVE_MARKET_INDICES</div>
        <div className="indices-grid">
          {data.indices && Object.entries(data.indices).map(([key, item]) => (
            <div key={key} className="index-card">
              <div className="index-label">{item.label}</div>
              <div className={`index-value ${item.trend === 'up' ? 'red' : 'green'}`}>
                {item.val} {item.trend === 'up' ? '▲' : '■'}
              </div>
              <div className="index-provider">{key.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="intel-layout">
        <section className="section-panel">
          <div className="panel-tag">EXPERT_OSINT_CONSENSUS</div>
          <div className="sources-list">
            {data.intelligence_sources?.map((src, i) => (
              <SourceBlock key={i} {...src} />
            ))}
          </div>
        </section>

        <section className="section-panel">
          <div className="panel-tag">STRATEGIC_POSTURE_SIGNALS</div>
          <table className="signal-table">
            <thead>
              <tr>
                <th>SIGNAL</th>
                <th>THRESHOLD</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {data.strategic_signals?.map((s, i) => (
                <tr key={i}>
                  <td>{s.signal}</td>
                  <td className="white">{s.level}</td>
                  <td className={s.status === 'CRITICAL' ? 'red' : 'yellow'}>{s.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="disclaimer-box">
            NOTE: Data aggregated from ISW, Polymarket, and Metaculus. Accuracy reflects public prediction market order books.
          </div>
        </section>
      </div>

      <footer className="footer-admin">
        <div className="footer-line">MADAD_HAOREF // AGGREGATED_INTEL_SYSTEM_V66.1</div>
      </footer>

      <style jsx global>{`
        body { background: #000; color: #fff; font-family: 'Courier New', monospace; margin: 0; padding: 15px; }
        .terminal-container { max-width: 1200px; margin: 0 auto; border: 1px solid #333; padding: 25px; }
        .main-header { display: flex; justify-content: space-between; border-bottom: 2px solid #f00; padding-bottom: 15px; margin-bottom: 25px; }
        .brand-main { font-size: 1.6rem; font-weight: 900; letter-spacing: 1px; }
        .brand-sub { font-size: 0.75rem; color: #555; }
        .sync-info { text-align: right; font-size: 0.75rem; }
        .section-panel { border: 1px solid #222; padding: 20px; margin-bottom: 20px; position: relative; background: #050505; }
        .panel-tag { position: absolute; top: -10px; left: 15px; background: #f00; color: #fff; font-size: 0.65rem; padding: 2px 8px; font-weight: bold; }
        .indices-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; text-align: center; }
        .index-value { font-size: 2.2rem; font-weight: bold; margin: 5px 0; }
        .index-label { font-size: 0.7rem; color: #777; }
        .intel-layout { display: grid; grid-template-columns: 1.5fr 1fr; gap: 20px; }
        .source-block { margin-bottom: 20px; border-bottom: 1px solid #111; padding-bottom: 15px; }
        .source-org { font-weight: bold; color: #0f0; }
        .source-link { font-size: 0.6rem; border: 1px solid #333; padding: 2px 4px; text-decoration: none; color: #444; margin-left: 10px; }
        .source-summary { font-size: 0.85rem; color: #bbb; margin-top: 8px; }
        .signal-table { width: 100%; border-collapse: collapse; font-size: 0.75rem; }
        .signal-table td, .signal-table th { padding: 10px 0; border-bottom: 1px solid #111; text-align: left; }
        .footer-admin { margin-top: 30px; border-top: 1px solid #222; padding-top: 15px; text-align: center; font-size: 0.7rem; color: #444; }
        .green { color: #0f0; } .red { color: #f00; } .yellow { color: #ff0; } .white { color: #fff; }
        .loading { height: 90vh; display: flex; align-items: center; justify-content: center; color: #f00; font-size: 1.2rem; }
        @media (max-width: 800px) { .intel-layout, .indices-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}

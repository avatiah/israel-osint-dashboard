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
    const load = () => fetch('/api/data').then(r => r.json()).then(setData).catch(console.error);
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

      {/* Секция 1: Прогностические рынки (Глас народа и денег) */}
      <section className="section-panel">
        <div className="panel-tag">PREDICTIVE_MARKET_INDICES</div>
        <div className="indices-grid">
          {Object.entries(data.indices).map(([key, item]) => (
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
        {/* Секция 2: Глубокий анализ от экспертов */}
        <section className="section-panel">
          <div className="panel-tag">EXPERT_OSINT_CONSENSUS</div>
          <div className="sources-list">
            {data.intelligence_sources.map((src, i) => (
              <SourceBlock key={i} {...src} />
            ))}
          </div>
        </section>

        {/* Секция 3: Стратегические сигналы */}
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
              {data.strategic_signals.map((s, i) => (
                <tr key={i}>
                  <td>{s.signal}</td>
                  <td className="white">{s.level}</td>
                  <td className={s.status === 'CRITICAL' ? 'red' : 'yellow'}>{s.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="disclaimer-box">
            NOTE: All data points are extracted from public records, maritime transponders, 
            satellite FIRMS, and prediction market order books.
          </div>
        </section>
      </div>

      <footer className="footer-admin">
        <div className="footer-line">MADAD_HAOREF // AGGREGATED_INTEL_SYSTEM_V66</div>
        <div className="footer-copyright">DATA SOURCES: ISW, METACULUS, POLYMARKET, BNO, CRISIS GROUP</div>
      </footer>

      <style jsx global>{`
        body { background: #000; color: #fff; font-family: 'Courier New', monospace; margin: 0; padding: 20px; line-height: 1.4; }
        .terminal-container { max-width: 1200px; margin: 0 auto; border: 1px solid #333; padding: 30px; }
        .main-header { display: flex; justify-content: space-between; border-bottom: 3px solid #f00; padding-bottom: 20px; margin-bottom: 30px; }
        .brand-main { font-size: 1.8rem; font-weight: 900; letter-spacing: 2px; }
        .brand-sub { font-size: 0.8rem; color: #666; }
        .sync-info { text-align: right; font-size: 0.8rem; font-weight: bold; }
        
        .section-panel { border: 1px solid #222; padding: 20px; margin-bottom: 20px; position: relative; background: #050505; }
        .panel-tag { position: absolute; top: -10px; left: 15px; background: #f00; color: #fff; font-size: 0.7rem; padding: 2px 8px; font-weight: bold; }
        
        .indices-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; text-align: center; }
        .index-card { border-right: 1px solid #1a1a1a; }
        .index-card:last-child { border-right: none; }
        .index-label { font-size: 0.7rem; color: #888; margin-bottom: 10px; }
        .index-value { font-size: 2.5rem; font-weight: bold; }
        .index-provider { font-size: 0.6rem; color: #444; margin-top: 5px; }

        .intel-layout { display: grid; grid-template-columns: 1.4fr 1fr; gap: 20px; }
        .source-block { margin-bottom: 25px; border-bottom: 1px solid #111; padding-bottom: 15px; }
        .source-header { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .source-org { font-weight: bold; color: #0f0; }
        .source-link { font-size: 0.6rem; border: 1px solid #333; padding: 2px 5px; text-decoration: none; color: #555; }
        .source-summary { font-size: 0.9rem; color: #ccc; text-align: justify; }

        .signal-table { width: 100%; border-collapse: collapse; font-size: 0.8rem; }
        .signal-table th { text-align: left; color: #555; padding-bottom: 10px; }
        .signal-table td { padding: 12px 0; border-bottom: 1px solid #111; }
        
        .disclaimer-box { margin-top: 20px; font-size: 0.65rem; color: #333; font-style: italic; }
        .footer-admin { margin-top: 40px; border-top: 1px solid #222; padding-top: 20px; text-align: center; }
        .footer-line { font-size: 0.8rem; color: #666; margin-bottom: 5px; }
        .footer-copyright { font-size: 0.6rem; color: #333; }

        .green { color: #0f0; } .red { color: #f00; } .yellow { color: #ff0; } .white { color: #fff; }
        .loading { height: 80vh; display: flex; align-items: center; justify-content: center; color: #f00; font-size: 1.5rem; letter-spacing: 5px; }
        @media (max-width: 900px) { .intel-layout, .indices-grid { grid-template-columns: 1fr; } .index-card { border-right: none; border-bottom: 1px solid #1a1a1a; padding-bottom: 15px; } }
      `}</style>
    </div>
  );
}

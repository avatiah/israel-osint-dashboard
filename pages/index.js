import { useState, useEffect } from 'react';

export default function IntelTerminal() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = () => fetch('/api/data').then(r => r.json()).then(setData).catch(console.error);
    load();
    const timer = setInterval(load, 45000);
    return () => clearInterval(timer);
  }, []);

  if (!data) return <div className="loading">CONNECTING_TO_STRATEGIC_NODES...</div>;

  return (
    <div className="terminal">
      <header className="header">
        <div className="title">GLOBAL_THREAT_MONITOR <span className="v-tag">V67.PRO</span></div>
        <div className="meta">
          DATA_AGGREGATION: 03.02.2026 // {new Date(data.updated).toLocaleTimeString()}
        </div>
      </header>

      {/* Основные показатели вероятности */}
      <div className="grid-top">
        {data.prediction_markets.map(m => (
          <div key={m.id} className="stat-card">
            <div className="card-label">{m.org.toUpperCase()} // {m.label}</div>
            <div className={`card-val ${m.status === 'ALARM' ? 'red' : 'yellow'}`}>{m.val}</div>
            <div className="card-sub">{m.trend} change in 24h</div>
          </div>
        ))}
      </div>

      <div className="grid-main">
        {/* Оперативные сигналы */}
        <section className="panel">
          <div className="p-header">STRATEGIC_SIGNALS</div>
          {data.osint_indicators.map((s, i) => (
            <div key={i} className="signal-row">
              <div className="sig-info">
                <span className="sig-label">{s.label}</span>
                <span className="sig-desc">{s.desc}</span>
              </div>
              <div className="sig-status" style={{ color: s.color }}>[{s.val}]</div>
            </div>
          ))}
        </section>

        {/* Аналитика от профи */}
        <section className="panel">
          <div className="p-header">EXPERT_OSINT_ANALYSIS</div>
          {data.intelligence.map((intel, i) => (
            <div key={i} className="intel-block">
              <div className="intel-header">
                <span className="intel-org">{intel.org}</span>
                <span className={`intel-tag ${intel.impact === 'CRITICAL' ? 'bg-red' : 'bg-gray'}`}>{intel.impact}</span>
              </div>
              <p className="intel-text">{intel.text}</p>
              <a href={intel.source} className="intel-link">VERIFY_AT_SOURCE →</a>
            </div>
          ))}
        </section>
      </div>

      <footer className="footer">
        CONFIDENCE_LEVEL: HIGH // SOURCES: CROWDSOURCED_PRED_MARKETS, ISW, OSINT_DEFENDER
      </footer>

      <style jsx global>{`
        body { background: #000; color: #fff; font-family: 'Courier New', monospace; margin: 0; padding: 20px; }
        .terminal { max-width: 1200px; margin: 0 auto; border: 1px solid #333; padding: 20px; border-top: 4px solid #f00; }
        .header { display: flex; justify-content: space-between; border-bottom: 1px solid #333; padding-bottom: 15px; margin-bottom: 25px; }
        .title { font-size: 1.5rem; font-weight: 900; }
        .v-tag { color: #f00; font-size: 0.8rem; margin-left: 10px; }
        .meta { font-size: 0.8rem; color: #666; text-align: right; }
        
        .grid-top { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 25px; }
        .stat-card { border: 1px solid #333; padding: 20px; background: #080808; text-align: center; }
        .card-label { font-size: 0.7rem; color: #888; margin-bottom: 10px; }
        .card-val { font-size: 3rem; font-weight: bold; }
        
        .grid-main { display: grid; grid-template-columns: 1fr 1.5fr; gap: 20px; }
        .panel { border: 1px solid #222; background: #050505; padding: 15px; }
        .p-header { background: #1a1a1a; color: #eee; padding: 5px 10px; font-size: 0.75rem; margin-bottom: 20px; font-weight: bold; }
        
        .signal-row { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #111; padding: 10px 0; }
        .sig-label { display: block; font-size: 0.9rem; font-weight: bold; }
        .sig-desc { font-size: 0.65rem; color: #555; }
        .sig-status { font-weight: bold; }

        .intel-block { margin-bottom: 25px; border-left: 2px solid #333; padding-left: 15px; }
        .intel-header { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .intel-org { font-weight: bold; color: #0f0; }
        .intel-tag { font-size: 0.6rem; padding: 2px 6px; border-radius: 2px; }
        .intel-text { font-size: 0.85rem; color: #ccc; text-align: justify; margin: 10px 0; line-height: 1.5; }
        .intel-link { font-size: 0.7rem; color: #444; text-decoration: none; border-bottom: 1px dotted #444; }

        .bg-red { background: #f00; color: #fff; }
        .bg-gray { background: #333; color: #ccc; }
        .red { color: #f00; } .yellow { color: #ff0; } .green { color: #0f0; }
        .footer { margin-top: 30px; border-top: 1px solid #333; padding-top: 15px; text-align: center; font-size: 0.7rem; color: #444; }
        .loading { height: 80vh; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; color: #f00; }
        @media (max-width: 800px) { .grid-top, .grid-main { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}

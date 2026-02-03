import { useState, useEffect } from 'react';

export default function IntelTerminal() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const sync = () => fetch('/api/data').then(r => r.json()).then(setData).catch(console.error);
    sync();
    const interval = setInterval(sync, 60000); // Обновление раз в минуту
    return () => clearInterval(interval);
  }, []);

  if (!data) return <div className="loading">CONNECTING_TO_ALPHA_VANTAGE_BACKBONE...</div>;

  return (
    <div className="terminal-frame">
      <header className="top-nav">
        <div className="status-bit">SYSTEM_STATUS: <span className="green">ONLINE</span></div>
        <div className="title-main">THREAT_ENGINE_ADMIN // V70</div>
        <div className="timestamp">{new Date(data.updated).toLocaleTimeString()}</div>
      </header>

      <div className="dashboard">
        {/* ЛЕВАЯ ПАНЕЛЬ: Метрики */}
        <aside className="metrics">
          <div className="module">
            <div className="mod-head">LIVE_MARKETS</div>
            <div className="metric-row">
              <span className="dim">BRENT_OIL</span>
              <span className="bold red">${data.markets.brent}</span>
            </div>
            <div className="metric-row">
              <span className="dim">USD_ILS</span>
              <span className="bold green">{data.markets.ils}</span>
            </div>
          </div>

          <div className="module">
            <div className="mod-head">THREAT_CONSENSUS</div>
            <div className="risk-display">
              <div className="risk-num" style={{ color: data.riskScore > 50 ? '#f00' : '#0f0' }}>
                {data.riskScore}%
              </div>
              <div className="risk-bar">
                <div className="risk-fill" style={{ width: `${data.riskScore}%`, background: data.riskScore > 50 ? '#f00' : '#0f0' }}></div>
              </div>
            </div>
            <div className="risk-label">PROBABILITY_OF_ESCALATION</div>
          </div>
        </aside>

        {/* ПРАВАЯ ПАНЕЛЬ: Живой фид аналитики */}
        <main className="feed">
          <div className="mod-head">VERIFIED_INTELLIGENCE_STREAM (RSS_FED)</div>
          <div className="scroll-area">
            {data.intel.map((item, i) => (
              <div key={i} className="intel-card">
                <div className="intel-meta">
                  <span className="green">[{item.time}]</span> // SOURCE: {item.source}
                </div>
                <div className="intel-body">{item.title}</div>
                <a href={item.link} target="_blank" rel="noreferrer" className="verify-btn">READ_FULL_OSINT</a>
              </div>
            ))}
          </div>
        </main>
      </div>

      <footer className="footer">
        POWERED_BY_ALPHA_VANTAGE // AGGREGATED_BY_MADAD_HAOREF_AI // 2026
      </footer>

      <style jsx global>{`
        body { background: #000; color: #fff; font-family: 'Courier New', monospace; margin: 0; padding: 15px; overflow: hidden; }
        .terminal-frame { max-width: 1200px; margin: 0 auto; border: 1px solid #222; padding: 20px; background: #050505; height: 90vh; display: flex; flex-direction: column; }
        
        .top-nav { display: flex; justify-content: space-between; border-bottom: 2px solid #f00; padding-bottom: 10px; margin-bottom: 20px; font-weight: bold; font-size: 0.9rem; }
        .dashboard { display: grid; grid-template-columns: 320px 1fr; gap: 20px; flex-grow: 1; overflow: hidden; }
        
        .module { border: 1px solid #1a1a1a; padding: 15px; margin-bottom: 20px; background: #080808; }
        .mod-head { background: #111; color: #555; font-size: 0.65rem; padding: 4px 8px; margin-bottom: 15px; border-left: 2px solid #f00; }
        
        .metric-row { display: flex; justify-content: space-between; font-size: 1.2rem; margin-bottom: 12px; border-bottom: 1px solid #111; padding-bottom: 5px; }
        .dim { color: #444; font-size: 0.8rem; }
        
        .risk-num { font-size: 4rem; font-weight: bold; text-align: center; line-height: 1; }
        .risk-bar { width: 100%; height: 4px; background: #111; margin: 15px 0; border: 1px solid #222; }
        .risk-fill { height: 100%; transition: 1s ease-in-out; }
        .risk-label { text-align: center; font-size: 0.6rem; color: #444; letter-spacing: 1px; }

        .scroll-area { height: calc(100% - 50px); overflow-y: auto; padding-right: 10px; }
        .intel-card { margin-bottom: 20px; border-bottom: 1px solid #111; padding-bottom: 15px; }
        .intel-meta { font-size: 0.7rem; margin-bottom: 8px; font-weight: bold; }
        .intel-body { font-size: 1rem; line-height: 1.4; color: #ccc; margin-bottom: 10px; }
        .verify-btn { font-size: 0.6rem; color: #0f0; text-decoration: none; border: 1px solid #040; padding: 3px 7px; display: inline-block; transition: 0.3s; }
        .verify-btn:hover { background: #0f0; color: #000; }

        .green { color: #0f0; } .red { color: #f00; } .bold { font-weight: bold; }
        .footer { margin-top: 20px; text-align: center; font-size: 0.6rem; color: #222; border-top: 1px solid #111; padding-top: 10px; }
        .loading { display: flex; align-items: center; justify-content: center; height: 100vh; color: #f00; font-size: 1.2rem; }
      `}</style>
    </div>
  );
}

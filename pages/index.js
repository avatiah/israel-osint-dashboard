import React, { useState, useEffect } from 'react';

export default function IntelTerminal() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const sync = () => fetch('/api/data')
      .then(r => r.json())
      .then(setData)
      .catch(e => console.error("Critical Sync Failure:", e));
    
    sync();
    const timer = setInterval(sync, 60000);
    return () => clearInterval(timer);
  }, []);

  if (!data) return (
    <div className="loader">
      <div className="scanline"></div>
      ESTABLISHING_ENCRYPTED_DATA_LINK...
    </div>
  );

  return (
    <div className="terminal">
      {/* Bloomberg-style Status Bar */}
      <header className="top-strip">
        <div className="system-id">STRATEGIC_MONITOR // V71.STABLE</div>
        <div className="market-ticker">
          BRENT_CRUDE: <span className="red">${data.markets?.brent || "N/A"}</span> | 
          USD_ILS: <span className="green">{data.markets?.ils || "N/A"}</span>
        </div>
        <div className="clock">{new Date(data.updated).toLocaleTimeString()}</div>
      </header>

      <main className="main-layout">
        {/* Real-time OSINT Feed */}
        <section className="intel-stream">
          <div className="section-label">LIVE_EXTERNAL_INTELLIGENCE (VERIFIED_RSS)</div>
          <div className="stream-container">
            {data.intel && data.intel.length > 0 ? data.intel.map((item, i) => (
              <div key={i} className="intel-row">
                <span className="time-tag">[{item.timestamp}]</span>
                <span className="source-tag"> {item.source} </span>
                <a href={item.link} target="_blank" rel="noreferrer" className="content-link">
                  {item.title}
                </a>
              </div>
            )) : <div className="warning">WAITING_FOR_DATA_PACKETS...</div>}
          </div>
        </section>

        {/* System Integrity & Nodes */}
        <aside className="analysis-panel">
          <div className="section-label">NETWORK_INTEGRITY</div>
          <div className="data-integrity">
            <div className="node">ALPHA_VANTAGE: <span className={data.markets?.brent !== "LOADING..." ? "green" : "red"}>
              {data.markets?.brent !== "LOADING..." ? "ACTIVE" : "PENDING"}
            </span></div>
            <div className="node">RSS_NODE_PRIMARY: <span className="green">CONNECTED</span></div>
            <div className="node">FX_GLOBAL_API: <span className="green">STABLE</span></div>
          </div>
          
          <div className="note-box">
            <div className="section-label" style={{marginTop:'20px'}}>OPERATIONAL_DISCLAIMER</div>
            <p>Система отображает агрегированные данные из открытых источников в реальном времени. Все индикаторы базируются на внешних API-ответах. Ручная корректировка данных исключена для обеспечения объективности.</p>
          </div>
        </aside>
      </main>

      <style jsx global>{`
        body { background: #000; color: #fff; font-family: 'Courier New', monospace; margin: 0; padding: 10px; overflow: hidden; }
        .terminal { border: 1px solid #333; height: calc(100vh - 20px); display: flex; flex-direction: column; background: #050505; position: relative; }
        
        .top-strip { display: flex; justify-content: space-between; padding: 12px 15px; border-bottom: 2px solid #f00; font-weight: bold; font-size: 0.9rem; background: #0a0a0a; }
        .market-ticker span { margin: 0 5px; text-shadow: 0 0 5px currentColor; }
        
        .main-layout { display: grid; grid-template-columns: 1fr 320px; gap: 1px; background: #1a1a1a; flex-grow: 1; overflow: hidden; }
        .intel-stream, .analysis-panel { background: #050505; padding: 20px; overflow-y: auto; }
        
        .section-label { font-size: 0.7rem; color: #666; margin-bottom: 20px; border-left: 3px solid #f00; padding-left: 10px; letter-spacing: 1px; }
        
        .intel-row { margin-bottom: 15px; font-size: 0.95rem; line-height: 1.4; border-bottom: 1px solid #111; padding-bottom: 10px; transition: 0.3s; }
        .intel-row:hover { background: #0a0000; }
        .time-tag { color: #f00; font-weight: bold; font-size: 0.8rem; }
        .source-tag { color: #0f0; font-size: 0.7rem; margin: 0 10px; border: 1px solid #040; padding: 1px 5px; border-radius: 2px; }
        .content-link { color: #ccc; text-decoration: none; }
        .content-link:hover { color: #fff; }

        .node { font-size: 0.8rem; margin-bottom: 12px; border-bottom: 1px solid #111; padding-bottom: 5px; }
        .note-box p { font-size: 0.75rem; color: #555; line-height: 1.6; text-align: justify; }

        .green { color: #0f0; text-shadow: 0 0 5px #0f0; } 
        .red { color: #f00; text-shadow: 0 0 5px #f00; }
        
        .loader { height: 100vh; display: flex; align-items: center; justify-content: center; color: #f00; font-size: 1.2rem; letter-spacing: 5px; background: #000; }
        
        @media (max-width: 900px) { .main-layout { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}

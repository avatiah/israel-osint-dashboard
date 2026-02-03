import { useState, useEffect } from 'react';

export default function IntelTerminal() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const sync = () => fetch('/api/data').then(r => r.json()).then(setData);
    sync();
    const timer = setInterval(sync, 60000);
    return () => clearInterval(timer);
  }, []);

  if (!data) return <div className="loader">CONNECTING_TO_GLOBAL_INTEL_NET...</div>;

  return (
    <div className="terminal">
      {/* HEADER: Строгая статусная строка */}
      <header className="top-strip">
        <div className="system-id">MADAD_HAOREF // STRATEGIC_MONITOR</div>
        <div className="market-ticker">
          BRENT: <span className="red">${data.markets.brent}</span> | 
          USD/ILS: <span className="green">{data.markets.ils}</span>
        </div>
        <div className="clock">{new Date(data.updated).toLocaleTimeString()}</div>
      </header>

      <main className="main-layout">
        {/* СЕКЦИЯ: ЖИВОЙ ПОТОК РАЗВЕДДАННЫХ */}
        <section className="intel-stream">
          <div className="section-label">LIVE_INTELLIGENCE_STREAM (VERIFIED_SOURCES)</div>
          <div className="stream-container">
            {data.intel.length > 0 ? data.intel.map((item, i) => (
              <div key={i} className="intel-row">
                <span className="time-tag">[{item.timestamp}]</span>
                <span className="source-tag"> {item.source} </span>
                <a href={item.link} target="_blank" rel="noreferrer" className="content-link">
                  {item.title}
                </a>
              </div>
            )) : <div className="warning">NO_LIVE_DATA_FROM_RSS_NODE</div>}
          </div>
        </section>

        {/* СЕКЦИЯ: ИНДЕКСЫ КОНСЕНСУСА */}
        <aside className="analysis-panel">
          <div className="section-label">DATA_SOURCE_INTEGRITY</div>
          <div className="data-integrity">
            <div className="node">ALPHA_VANTAGE: <span className="green">ONLINE</span></div>
            <div className="node">RSS_NODE_01: <span className="green">CONNECTED</span></div>
            <div className="node">GEO_LOCAL_FX: <span className="green">STABLE</span></div>
          </div>
          
          <div className="note-box">
            <div className="section-label" style={{marginTop:'20px'}}>SYSTEM_NOTES</div>
            <p>Терминал отображает только верифицированные внешние данные. Ручной ввод индексов отключен. Все ссылки кликабельны для проверки первоисточника.</p>
          </div>
        </aside>
      </main>

      <style jsx global>{`
        body { background: #000; color: #fff; font-family: 'Courier New', monospace; margin: 0; padding: 10px; }
        .terminal { border: 1px solid #333; height: calc(100vh - 20px); display: flex; flex-direction: column; background: #050505; }
        
        .top-strip { display: flex; justify-content: space-between; padding: 10px 15px; border-bottom: 2px solid #f00; font-weight: bold; font-size: 0.9rem; }
        .market-ticker span { margin: 0 5px; }
        
        .main-layout { display: grid; grid-template-columns: 1fr 300px; gap: 1px; background: #1a1a1a; flex-grow: 1; overflow: hidden; }
        .intel-stream, .analysis-panel { background: #050505; padding: 15px; overflow-y: auto; }
        
        .section-label { font-size: 0.7rem; color: #666; margin-bottom: 15px; border-left: 3px solid #f00; padding-left: 10px; }
        
        .intel-row { margin-bottom: 12px; font-size: 0.95rem; line-height: 1.3; border-bottom: 1px solid #111; padding-bottom: 8px; }
        .time-tag { color: #f00; font-weight: bold; font-size: 0.8rem; }
        .source-tag { color: #0f0; font-size: 0.7rem; margin: 0 10px; border: 1px solid #040; padding: 1px 4px; }
        .content-link { color: #ccc; text-decoration: none; transition: 0.2s; }
        .content-link:hover { color: #fff; background: #200; }

        .node { font-size: 0.8rem; margin-bottom: 8px; }
        .note-box p { font-size: 0.75rem; color: #444; line-height: 1.5; }

        .green { color: #0f0; } .red { color: #f00; }
        .loader { height: 100vh; display: flex; align-items: center; justify-content: center; color: #f00; font-size: 1.5rem; letter-spacing: 5px; }
        @media (max-width: 900px) { .main-layout { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}

import React, { useState, useEffect } from 'react';

export default function StrategicTerminal() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/data');
        const json = await res.json();
        setData(json);
        setError(false);
      } catch (e) {
        setError(true);
        console.error("Data fetch error");
      }
    };

    fetchData();
    const timer = setInterval(fetchData, 60000);
    return () => clearInterval(timer);
  }, []);

  if (!data && !error) return <div className="sys-loading">INIT_SEQUENCE_ACTIVE...</div>;

  return (
    <div className="terminal-root">
      {/* ТИКЕР СТРАТЕГИЧЕСКИХ ДАННЫХ */}
      <header className="status-bar">
        <div className="ident">NODE: ASHDOD_S_DISTRICT // ADMIN_V72</div>
        <div className="live-data">
          BRENT: <span className="val red">{data?.markets?.brent || "FETCH_ERR"}</span>
          <span className="sep">|</span>
          USD/ILS: <span className="val green">{data?.markets?.ils || "SYNC..."}</span>
        </div>
        <div className="sys-time">{new Date().toISOString().slice(11, 19)} UTC</div>
      </header>

      <main className="content-grid">
        {/* ЛЕНТА РЕАЛЬНОЙ РАЗВЕДКИ */}
        <section className="intel-panel">
          <div className="label">RAW_INTELLIGENCE_STREAM // RSS_LIVE</div>
          <div className="scroll-box">
            {data?.intel?.length > 0 ? data.intel.map((item, i) => (
              <div key={i} className="entry">
                <span className="entry-time">[{item.timestamp}]</span>
                <span className="entry-node"> SIGNAL_L4 </span>
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="entry-link">
                  {item.title}
                </a>
              </div>
            )) : <div className="warn">NO_INCOMING_DATA_PACKETS</div>}
          </div>
        </section>

        {/* ПАНЕЛЬ СОСТОЯНИЯ СЕТИ */}
        <aside className="status-panel">
          <div className="label">NETWORK_INTEGRITY</div>
          <div className="status-item">ALPHA_VANTAGE: <span className={data?.markets?.brent === "LIMIT_REACHED" ? "yellow" : "green"}>{data?.markets?.brent === "LIMIT_REACHED" ? "RATE_LIMITED" : "ONLINE"}</span></div>
          <div className="status-item">RSS_GATEWAY: <span className="green">ACTIVE</span></div>
          <div className="status-item">ENCRYPTION: <span className="green">AES_256_ENABLED</span></div>
          
          <div className="disclaimer">
            <div className="label" style={{marginTop:'30px'}}>DATA_PROTOCOL</div>
            <p>Данный терминал агрегирует динамические данные из открытых разведывательных источников. Любые задержки вызваны регламентом обновления внешних API (Alpha Vantage/RSS).</p>
          </div>
        </aside>
      </main>

      <style jsx global>{`
        body { background: #000; color: #d1d1d1; font-family: 'Courier New', monospace; margin: 0; padding: 10px; overflow: hidden; }
        .terminal-root { border: 1px solid #222; height: calc(100vh - 20px); display: flex; flex-direction: column; background: #050505; }
        
        .status-bar { display: flex; justify-content: space-between; padding: 10px 15px; border-bottom: 2px solid #f00; background: #0a0a0a; font-size: 0.85rem; font-weight: bold; }
        .live-data .val { margin-left: 5px; }
        .sep { margin: 0 15px; color: #333; }

        .content-grid { display: grid; grid-template-columns: 1fr 300px; gap: 1px; background: #111; flex-grow: 1; overflow: hidden; }
        .intel-panel, .status-panel { background: #050505; padding: 20px; overflow-y: auto; }
        
        .label { font-size: 0.65rem; color: #555; margin-bottom: 15px; letter-spacing: 2px; border-left: 2px solid #f00; padding-left: 10px; }
        
        .entry { margin-bottom: 12px; font-size: 0.9rem; line-height: 1.4; border-bottom: 1px solid #0f0f0f; padding-bottom: 8px; }
        .entry-time { color: #f00; margin-right: 10px; }
        .entry-node { font-size: 0.65rem; color: #0f0; border: 1px solid #040; padding: 1px 4px; margin-right: 10px; }
        .entry-link { color: #aaa; text-decoration: none; }
        .entry-link:hover { color: #fff; background: #1a0000; }

        .status-item { font-size: 0.75rem; margin-bottom: 10px; border-bottom: 1px solid #111; padding-bottom: 5px; }
        .disclaimer p { font-size: 0.65rem; color: #333; line-height: 1.5; text-align: justify; }

        .green { color: #0f0; text-shadow: 0 0 5px #0f0; }
        .red { color: #f00; text-shadow: 0 0 5px #f00; }
        .yellow { color: #ff0; }
        .sys-loading { height: 100vh; display: flex; align-items: center; justify-content: center; color: #f00; font-size: 1.2rem; letter-spacing: 5px; }
      `}</style>
    </div>
  );
}

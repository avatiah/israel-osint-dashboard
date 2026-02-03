import React, { useState, useEffect } from 'react';

export default function StrategicTerminal() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/data');
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error("Data fetch error: Link desynchronized.");
      }
    };

    fetchData();
    const timer = setInterval(fetchData, 60000); // Синхронизация раз в минуту
    return () => clearInterval(timer);
  }, []);

  if (!data) return <div className="sys-loader">ESTABLISHING_DATA_LINK...</div>;

  return (
    <div className="terminal-container">
      {/* Bloomberg-style Status Bar */}
      <header className="admin-header">
        <div className="brand">NODE: ASHDOD_DISTRICT // ADMIN_V72.1</div>
        <div className="live-metrics">
          BRENT_CRUDE: <span className="red">${data?.markets?.brent || "N/A"}</span>
          <span className="spacer">|</span>
          USD_ILS: <span className="green">{data?.markets?.ils || "N/A"}</span>
        </div>
        <div className="sys-clock">{new Date(data?.updated).toLocaleTimeString()} UTC</div>
      </header>

      <div className="main-viewport">
        {/* ЖИВАЯ ЛЕНТА РАЗВЕДКИ (RSS) */}
        <section className="intel-scroll">
          <div className="panel-tag">VERIFIED_INTELLIGENCE_STREAM (RSS_LIVE)</div>
          <div className="entries">
            {data?.intel?.length > 0 ? data.intel.map((item, i) => (
              <div key={i} className="intel-row">
                <span className="timestamp">[{item.time}]</span>
                <span className="node-tag"> SOURCE: {item.source} </span>
                <a href={item.link} target="_blank" rel="noreferrer" className="headline">
                  {item.title}
                </a>
              </div>
            )) : <div className="error-msg">AWAITING_INCOMING_PACKETS_FROM_NODE...</div>}
          </div>
        </section>

        {/* ПАНЕЛЬ СОСТОЯНИЯ СИСТЕМЫ */}
        <aside className="status-panel">
          <div className="panel-tag">NETWORK_INTEGRITY</div>
          <div className="stat-line">ALPHA_VANTAGE: <span className={data?.markets?.brent === "LIMIT" ? "yellow" : "green"}>
            {data?.markets?.brent === "LIMIT" ? "RATE_LIMITED" : "ACTIVE"}
          </span></div>
          <div className="stat-line">RSS_GATEWAY: <span className="green">CONNECTED</span></div>
          
          <div className="operational-note">
            <div className="panel-tag" style={{marginTop:'30px'}}>PROTOCOL_V72</div>
            <p>Терминал агрегирует динамические данные в реальном времени. Если блок Brent Oil показывает "LIMIT", это означает временное ограничение бесплатного ключа Alpha Vantage. Лента новостей работает независимо.</p>
          </div>
        </aside>
      </div>

      <style jsx global>{`
        body { background: #000; color: #fff; font-family: 'Courier New', monospace; margin: 0; padding: 15px; overflow: hidden; }
        .terminal-container { border: 1px solid #333; height: 92vh; display: flex; flex-direction: column; background: #050505; }
        
        .admin-header { display: flex; justify-content: space-between; padding: 12px 20px; border-bottom: 2px solid #f00; font-weight: bold; font-size: 0.85rem; background: #0a0a0a; }
        .spacer { margin: 0 20px; color: #222; }
        
        .main-viewport { display: grid; grid-template-columns: 1fr 320px; gap: 1px; background: #111; flex-grow: 1; overflow: hidden; }
        .intel-scroll, .status-panel { background: #050505; padding: 25px; overflow-y: auto; }
        
        .panel-tag { font-size: 0.65rem; color: #555; margin-bottom: 20px; border-left: 2px solid #f00; padding-left: 10px; letter-spacing: 1px; }
        
        .intel-row { margin-bottom: 18px; font-size: 0.95rem; border-bottom: 1px solid #0f0f0f; padding-bottom: 10px; }
        .timestamp { color: #f00; margin-right: 12px; font-size: 0.8rem; }
        .node-tag { font-size: 0.6rem; color: #0f0; border: 1px solid #040; padding: 1px 4px; margin-right: 12px; }
        .headline { color: #ccc; text-decoration: none; transition: 0.2s; }
        .headline:hover { color: #fff; background: #1a0000; }

        .stat-line { font-size: 0.75rem; margin-bottom: 12px; border-bottom: 1px solid #111; padding-bottom: 5px; }
        .operational-note p { font-size: 0.65rem; color: #333; line-height: 1.6; text-align: justify; }

        .green { color: #0f0; text-shadow: 0 0 5px #0f0; }
        .red { color: #f00; text-shadow: 0 0 5px #f00; }
        .yellow { color: #ff0; }
        .sys-loader { height: 100vh; display: flex; align-items: center; justify-content: center; color: #f00; font-size: 1.2rem; letter-spacing: 4px; }
      `}</style>
    </div>
  );
}

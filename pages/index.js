import { useState, useEffect } from 'react';

export default function RealTimeMonitor() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = () => fetch('/api/data').then(r => r.json()).then(setData);
    load();
    const timer = setInterval(load, 60000); // Обновление каждую минуту
    return () => clearInterval(timer);
  }, []);

  if (!data) return <div className="loading">SYNCING_WITH_GLOBAL_NODES...</div>;

  return (
    <div className="monitor">
      <header className="header">
        <div className="brand">OSINT_ACTIVE_MONITOR // V68</div>
        <div className="time">LAST_SYNC: {new Date(data.updated).toLocaleTimeString()}</div>
      </header>

      <div className="main-grid">
        {/* РЕАЛЬНЫЙ КУРС ВАЛЮТ */}
        <section className="card">
          <div className="label">USD/ILS SPOT_PRICE (LIVE)</div>
          <div className="value green">{data.ils}</div>
          <div className="sub-text">Source: Open Exchange API</div>
        </section>

        {/* РАССЧИТАННЫЙ ИНДЕКС УГРОЗЫ */}
        <section className="card">
          <div className="label">NLP_THREAT_PROBABILITY</div>
          <div className={`value ${data.threatIndex > 50 ? 'red' : 'yellow'}`}>
            {data.threatIndex}%
          </div>
          <div className="sub-text">Based on real-time news analysis</div>
        </section>
      </div>

      {/* ЖИВАЯ ЛЕНТА НОВОСТЕЙ */}
      <section className="feed-card">
        <div className="label">RAW_INTELLIGENCE_STREAM (RSS)</div>
        <div className="feed-list">
          {data.news.map((n, i) => (
            <div key={i} className="news-item">
              <span className="news-time">[{new Date(n.pubDate).getHours()}:{new Date(n.pubDate).getMinutes()}]</span>
              <a href={n.link} target="_blank" rel="noreferrer" className="news-title">{n.title}</a>
            </div>
          ))}
        </div>
      </section>

      <footer className="footer">
        STATUS: CONNECTED // DATA_STREAM: UNFILTERED // AUTHENTIC_REALTIME_DATA
      </footer>

      <style jsx global>{`
        body { background: #000; color: #0f0; font-family: 'Courier New', monospace; padding: 20px; }
        .monitor { max-width: 900px; margin: 0 auto; border: 1px solid #0f0; padding: 25px; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0f0; padding-bottom: 10px; margin-bottom: 30px; }
        .main-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
        .card { border: 1px solid #040; padding: 20px; background: #050505; text-align: center; }
        .label { font-size: 0.7rem; color: #080; margin-bottom: 15px; font-weight: bold; }
        .value { font-size: 3.5rem; font-weight: bold; }
        .feed-card { border: 1px solid #040; padding: 20px; background: #050505; }
        .feed-list { height: 200px; overflow-y: auto; text-align: left; }
        .news-item { margin-bottom: 12px; font-size: 0.85rem; border-bottom: 1px solid #010; padding-bottom: 8px; }
        .news-time { color: #080; margin-right: 10px; }
        .news-title { color: #fff; text-decoration: none; }
        .news-title:hover { color: #0f0; }
        .green { color: #0f0; } .red { color: #f00; } .yellow { color: #ff0; }
        .footer { margin-top: 30px; font-size: 0.6rem; color: #040; text-align: center; }
        .loading { display: flex; align-items: center; justify-content: center; height: 100vh; font-size: 1.5rem; }
      `}</style>
    </div>
  );
}

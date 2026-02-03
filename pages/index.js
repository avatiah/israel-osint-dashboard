// ... (imports)

export default function DeepIntelTerminal() {
  const [data, setData] = useState(null);
  // ... (useEffect)

  return (
    <div className="intel-terminal">
      {/* Верхняя статусная строка как в Bloomberg Terminal */}
      <div className="ticker-tape">
        <span>BRENT: ${data?.markets.brent.price} ({data?.markets.brent.change})</span>
        <span>USD/ILS: {data?.markets.ils.price}</span>
        <span>THREAT_INDEX: {data?.threatLevel.score}%</span>
      </div>

      <div className="content-layout">
        {/* Центральный блок: Матрица сигналов */}
        <section className="data-matrix">
          <header className="section-head">STRATEGIC_INTELLIGENCE_MATRIX</header>
          <div className="matrix-grid">
            <div className="matrix-item">
              <label>CONFRONTATION_VECTOR</label>
              <div className="val red">{data?.threatLevel.vector}</div>
            </div>
            <div className="matrix-item">
              <label>MARKET_SENTIMENT</label>
              <div className="val yellow">BEARISH_VOLATILE</div>
            </div>
          </div>
          
          <div className="news-stream">
            {data?.reports.map((r, i) => (
              <div key={i} className="report-entry">
                <span className="time">{new Date(r.pubDate).toLocaleTimeString()}</span>
                <span className="source">[{r.author || 'OSINT'}]</span>
                <p className="text">{r.title}</p>
                <div className="tags">#GEOPOLITICS #ENERGY #LEBANON</div>
              </div>
            ))}
          </div>
        </section>

        {/* Правый блок: Источники и Верификация */}
        <aside className="verification-panel">
          <div className="section-head">SOURCE_VERIFICATION</div>
          <ul className="source-list">
            <li>ALPHA_VANTAGE (ACTIVE)</li>
            <li>AL_JAZEERA_INTEL (CONNECTED)</li>
            <li>RSS_CROWLER_V4 (SCANNING)</li>
          </ul>
        </aside>
      </div>

      <style jsx global>{`
        body { background: #0a0a0a; color: #d4d4d4; font-family: 'Inter', sans-serif; }
        .intel-terminal { padding: 10px; height: 100vh; display: flex; flex-direction: column; }
        .ticker-tape { display: flex; gap: 40px; border-bottom: 1px solid #333; padding: 10px; font-family: 'Courier New'; font-weight: bold; color: #0f0; }
        .content-layout { display: grid; grid-template-columns: 1fr 300px; gap: 1px; background: #333; flex-grow: 1; }
        .data-matrix, .verification-panel { background: #0a0a0a; padding: 20px; overflow-y: auto; }
        .section-head { color: #555; font-size: 0.7rem; letter-spacing: 2px; margin-bottom: 20px; border-bottom: 1px solid #222; padding-bottom: 5px; }
        .report-entry { margin-bottom: 25px; border-left: 1px solid #f00; padding-left: 15px; }
        .report-entry .time { color: #f00; font-size: 0.7rem; font-weight: bold; }
        .report-entry .text { font-size: 1.1rem; color: #eee; margin: 5px 0; line-height: 1.4; }
        .tags { font-size: 0.6rem; color: #444; }
        .val { font-size: 1.8rem; font-weight: 900; }
        .red { color: #ff4d4d; } .yellow { color: #ffcc00; }
      `}</style>
    </div>
  );
}

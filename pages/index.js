import React, { useEffect, useState } from 'react';

const highlightCritical = (text) => {
  const criticalWords = ["deployment", "approach", "incident", "confirmed", "strike", "alert"];
  let formatted = text;
  criticalWords.forEach(word => {
    const reg = new RegExp(`(${word})`, "gi");
    formatted = formatted.replace(reg, '<span style="color:#ff3e3e;font-weight:bold">$1</span>');
  });
  return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
};

const Gauge = ({ value, color }) => {
  const circumference = Math.PI * 40;
  const offset = circumference - (value / 100) * circumference;
  return (
    <svg width="100" height="60" viewBox="0 0 100 60">
      <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#111" strokeWidth="8" />
      <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke={color} strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
      <text x="50" y="45" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold">{value}%</text>
    </svg>
  );
};

export default function Terminal() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const update = async () => {
      const res = await fetch('/api/data');
      const json = await res.json();
      setData(json);
    };
    update();
    const timer = setInterval(update, 30000); // Обновление раз в 30 сек для экономии ресурсов
    return () => clearInterval(timer);
  }, []);

  if (!data) return <div style={s.loader}>INITIALIZING_DATA_STREAM...</div>;

  return (
    <div style={s.container}>
      <header style={s.header}>
        <div style={s.statusLine}>SYSTEM_STATUS: <span style={{color:'#0f4'}}>{data.api_status}</span> // {data.timestamp}</div>
        <h1 style={s.logo}>MADAD HAOREF</h1>
      </header>

      <div style={s.grid}>
        {data.nodes.map(node => (
          <section key={node.id} style={s.card}>
            <div style={s.cardTop}>
              <Gauge value={node.value} color={node.value > 60 ? '#ff3e3e' : '#0f4'} />
              <div style={s.titleBlock}>
                <h2 style={s.nodeTitle}>{node.title}</h2>
                <div style={s.method}>METHOD: {node.method}</div>
              </div>
            </div>
            <div style={s.feed}>
              {node.news.length > 0 ? node.news.map((n, i) => (
                <div key={i} style={s.newsItem}>
                  <span style={s.src}>[{n.src}]</span> {highlightCritical(n.txt)}
                </div>
              )) : <div style={s.noData}>NO_NEW_DATA_FOR_PERIOD</div>}
            </div>
          </section>
        ))}

        <div style={s.forecast}>
          <div style={s.forecastTitle}>TARGET_DATE: {data.prediction.date}</div>
          <div style={s.forecastVal}>ESCALATION_PROBABILITY: {data.prediction.impact}%</div>
        </div>
      </div>
      
      <footer style={s.footer}>
        INTERNAL_USE_ONLY // OSINT_AGREGRATOR_V13.7
      </footer>
    </div>
  );
}

const s = {
  container: { background: '#000', color: '#0f4', fontFamily: 'monospace', minHeight: '100vh', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  header: { textAlign: 'center', marginBottom: '40px', width: '100%', maxWidth: '650px' },
  statusLine: { fontSize: '10px', color: '#004400', marginBottom: '10px', textAlign: 'left', borderBottom: '1px solid #111' },
  logo: { fontSize: '24px', letterSpacing: '6px', margin: 0 },
  grid: { width: '100%', maxWidth: '650px', display: 'flex', flexDirection: 'column', gap: '20px' },
  card: { border: '1px solid #003300', background: '#050505', padding: '15px' },
  cardTop: { display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '15px' },
  nodeTitle: { fontSize: '14px', color: '#fff', margin: 0 },
  method: { fontSize: '9px', color: '#006600', marginTop: '4px' },
  feed: { display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid #111', paddingTop: '10px' },
  newsItem: { fontSize: '12px', color: '#ccc', lineHeight: '1.4' },
  src: { color: '#0f4', fontWeight: 'bold', marginRight: '5px' },
  noData: { color: '#222', fontSize: '10px', fontStyle: 'italic' },
  forecast: { border: '1px solid #600', padding: '15px', background: '#0a0000', textAlign: 'center' },
  forecastTitle: { fontSize: '12px', color: '#ff3e3e' },
  forecastVal: { fontSize: '14px', fontWeight: 'bold', marginTop: '5px' },
  footer: { marginTop: '40px', fontSize: '9px', color: '#111' },
  loader: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', color: '#0f4' }
};

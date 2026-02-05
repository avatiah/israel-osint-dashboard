import React, { useEffect, useState, useRef } from 'react';

// Функция подсветки опасных слов
const highlightCritical = (text) => {
  const words = ["удара", "удар", "атака", "ракета", "тупик", "отверг", "угрожают", "готовности", "БПЛА", "срыва"];
  let formatted = text;
  words.forEach(word => {
    const reg = new RegExp(`(${word})`, "gi");
    formatted = formatted.replace(reg, '<span style="color:#ff3e3e;font-weight:bold">$1</span>');
  });
  return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
};

const Gauge = ({ value, color }) => {
  const circumference = Math.PI * 40;
  const offset = circumference - (Math.min(Math.max(value, 0), 100) / 100) * circumference;

  return (
    <div style={s.gaugeContainer}>
      <svg width="120" height="70" viewBox="0 0 100 60">
        <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#111" strokeWidth="8" strokeLinecap="round" />
        <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke={color} strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1.5s ease-in-out' }} />
        <text x="50" y="45" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold" fontFamily="monospace">{value}%</text>
      </svg>
    </div>
  );
};

export default function MadadHaOref() {
  const [data, setData] = useState(null);
  const lastValidData = useRef(null);

  const fetchIntel = async () => {
    try {
      const res = await fetch('/api/data', { priority: 'high' });
      const json = await res.json();
      if (json?.nodes) { lastValidData.current = json; setData(json); }
    } catch (e) { if (lastValidData.current) setData(lastValidData.current); }
  };

  useEffect(() => {
    fetchIntel();
    const timer = setInterval(fetchIntel, 10000);
    return () => clearInterval(timer);
  }, []);

  const isNotamActive = data?.nodes?.some(node => 
    node.news?.some(n => /NOTAM|Airspace|Closed|Закрытие|FAA/i.test(n.txt))
  );

  if (!data) return <div style={s.loader}>{">"} АКТИВАЦИЯ SENTIMENT_ENGINE...</div>;

  return (
    <div style={s.container}>
      <header style={s.header}>
        <h1 style={s.logo}>MADAD HAOREF</h1>
        <div style={s.statusBlock}>
          <div style={s.meta}>V12.9 // SENTIMENT_ANALYSIS_ACTIVE</div>
          <div style={s.statusText}>СТАТУС: <span style={{color: '#0f4'}}>LIVE_FEED</span></div>
          <div style={s.time}>{new Date(data.timestamp).toLocaleTimeString()} UTC</div>
        </div>
      </header>

      <main style={s.grid}>
        {data.nodes.map(node => (
          <div key={node.id} style={s.card}>
            <div style={s.cardLayout}>
              <Gauge value={node.value} color={node.value > 65 ? '#ff3e3e' : '#0f4'} />
              <div style={s.cardContent}>
                <div style={s.nodeTitle}>{node.title}</div>
                <div style={s.newsSection}>
                  {node.news?.map((item, idx) => (
                    <div key={idx} style={s.newsItem}>
                      <span style={s.newsSrc}>[{item.src}]</span> {highlightCritical(item.txt)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div style={s.infoBox}>
              <div style={s.infoRow}>
                <div style={s.metricsList}>
                  <span style={s.infoLabel}>МЕТРИКИ:</span>
                  <span style={{...s.metricItem, color: isNotamActive ? '#fff' : '#444'}}>
                    <span style={{...s.dot, backgroundColor: isNotamActive ? '#ff0000' : '#004400', animation: isNotamActive ? 'blink 1s infinite' : 'none'}} />
                    NOTAMs
                  </span>
                  <span style={s.metricItem}>ДИПЛОМАТИЯ</span>
                  <span style={s.metricItem}>ЭНЕРГИЯ</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div style={s.forecastBox}>
          <h3 style={s.forecastTitle}>⚠️ СТРАТЕГИЧЕСКИЙ ПРОГНОЗ: {data.prediction?.date}</h3>
          <p style={s.forecastText}>
            ТРЕК: <strong style={{color:'#ff3e3e'}}>{data.prediction?.status === "DIPLOMACY_FOCUS" ? "ФОКУС НА ДИПЛОМАТИИ" : data.prediction?.status}</strong>. <br/>
            РИСК ПРИ СРЫВЕ: <strong>{data.prediction?.impact}%</strong>. 
          </p>
        </div>
      </main>

      <footer style={s.footer}>
        <p style={s.disclaimer}><strong>ОТКАЗ ОТ ОТВЕТСТВЕННОСТИ:</strong> OSINT-МОДЕЛЬ. НЕ ЯВЛЯЕТСЯ ДИРЕКТИВОЙ СЛУЖБ БЕЗОПАСНОСТИ.</p>
        <div style={s.footerMeta}>MADAD HAOREF © 2026 // FULL_ANALYSIS</div>
      </footer>

      <style jsx global>{` @keyframes blink { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } } `}</style>
    </div>
  );
}

const s = {
  container: { background: '#000', color: '#0f4', fontFamily: 'monospace', minHeight: '100vh', padding: '30px 15px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  header: { textAlign: 'center', marginBottom: '30px', width: '100%', maxWidth: '650px', borderBottom: '1px solid #222', paddingBottom: '15px' },
  logo: { fontSize: 'clamp(24px, 8vw, 36px)', letterSpacing: '5px', fontWeight: 'bold', margin: '0' },
  statusBlock: { marginTop: '8px' },
  meta: { fontSize: '10px', color: '#00cc00' },
  statusText: { fontSize: '11px', margin: '4px 0' },
  time: { fontSize: '10px', color: '#008800' },
  grid: { width: '100%', maxWidth: '650px', display: 'flex', flexDirection: 'column', gap: '20px' },
  card: { border: '1px solid #004400', padding: '20px', background: '#050505' },
  cardLayout: { display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' },
  cardContent: { flex: '1 1 300px' },
  nodeTitle: { fontSize: '13px', color: '#fff', fontWeight: 'bold', marginBottom: '12px', borderBottom: '1px solid #111' },
  newsSection: { display: 'flex', flexDirection: 'column', gap: '6px' },
  newsItem: { fontSize: '12px', color: '#eee', textTransform: 'none', lineHeight: '1.4' },
  newsSrc: { color: '#0f4', fontWeight: 'bold' },
  infoBox: { borderTop: '1px solid #1a1a1a', paddingTop: '15px', marginTop: '15px' },
  infoRow: { display: 'flex' },
  infoLabel: { color: '#0f4', fontSize: '10px', marginRight: '15px' },
  metricsList: { display: 'flex', gap: '15px', flexWrap: 'wrap' },
  metricItem: { fontSize: '10px', display: 'flex', alignItems: 'center', gap: '5px', color: '#444' },
  dot: { width: '8px', height: '8px', borderRadius: '50%' },
  forecastBox: { border: '1px solid #600', padding: '20px', background: '#0d0000', textAlign: 'center' },
  forecastTitle: { fontSize: '14px', color: '#ff3e3e', margin: '0' },
  forecastText: { fontSize: '12px', color: '#fff', marginTop: '10px' },
  footer: { marginTop: '40px', borderTop: '1px solid #1a1a1a', paddingTop: '20px', textAlign: 'center', width: '100%', maxWidth: '650px' },
  disclaimer: { fontSize: '9px', color: '#444', textAlign: 'justify' },
  footerMeta: { fontSize: '9px', color: '#004400', marginTop: '10px' },
  loader: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', color: '#0f4' }
};

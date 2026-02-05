import React, { useEffect, useState, useRef } from 'react';

const highlightCritical = (text) => {
  const words = ["удара", "удар", "атака", "ракета", "тупик", "отверг", "угрожают", "готовности", "БПЛА", "срыва"];
  let formatted = text;
  words.forEach(word => {
    const reg = new RegExp(`(${word})`, "gi");
    formatted = formatted.replace(reg, '<span style="color:#ff3e3e;font-weight:bold">$1</span>');
  });
  return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
};

const Gauge = ({ value, color, trend }) => {
  const circumference = Math.PI * 40;
  const offset = circumference - (Math.min(Math.max(value, 0), 100) / 100) * circumference;
  return (
    <div style={s.gaugeContainer}>
      <svg width="120" height="70" viewBox="0 0 100 60">
        <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#111" strokeWidth="8" strokeLinecap="round" />
        <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke={color} strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
        <text x="50" y="45" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold" fontFamily="monospace">{value}%</text>
        <text x="50" y="25" textAnchor="middle" fill={trend === 'up' ? '#ff3e3e' : '#0f4'} fontSize="8">{trend === 'up' ? '▲ TREND' : '▼ STABLE'}</text>
      </svg>
    </div>
  );
};

export default function MadadHaOref() {
  const [data, setData] = useState(null);
  const lastValidData = useRef(null);

  useEffect(() => {
    const fetchIntel = async () => {
      try {
        const res = await fetch('/api/data', { priority: 'high' });
        const json = await res.json();
        if (json?.nodes) { lastValidData.current = json; setData(json); }
      } catch (e) { if (lastValidData.current) setData(lastValidData.current); }
    };
    fetchIntel();
    const timer = setInterval(fetchIntel, 10000);
    return () => clearInterval(timer);
  }, []);

  if (!data) return <div style={s.loader}>{">"} СИНХРОНИЗАЦИЯ СЕТИ...</div>;

  const isNotamActive = data.nodes.some(node => node.news?.some(n => /NOTAM|Airspace|Closed|FAA/i.test(n.txt)));

  return (
    <div style={s.container}>
      <div style={s.topTicker}>
        BRENT: <span style={{color:'#fff'}}>${data.market?.brent}</span> | 
        USD/ILS: <span style={{color:'#fff'}}>{data.market?.usils}</span> | 
        GOLD: <span style={{color:'#fff'}}>${data.market?.gold}</span>
      </div>

      <header style={s.header}>
        <h1 style={s.logo}>MADAD HAOREF</h1>
        <div style={s.statusBlock}>
          <div style={s.meta}>SECURITY_TERMINAL_V13.0 // 06.02_COUNTDOWN</div>
          <div style={s.statusText}>STATUS: <span style={{color: '#0f4', animation: 'blink 2s infinite'}}>LIVE_STREAM</span></div>
        </div>
      </header>

      <main style={s.grid}>
        {data.nodes.map(node => (
          <div key={node.id} style={s.card}>
            <div style={s.cardLayout}>
              <Gauge value={node.value} color={node.value > 65 ? '#ff3e3e' : '#0f4'} trend={node.trend} />
              <div style={s.cardContent}>
                <div style={s.nodeTitle}>{node.title}</div>
                <div style={s.newsSection}>
                  {node.news?.map((item, idx) => (
                    <div key={idx} style={s.newsItem}><span style={s.newsSrc}>[{item.src}]</span> {highlightCritical(item.txt)}</div>
                  ))}
                </div>
              </div>
            </div>
            
            <div style={s.infoBox}>
              <div style={s.metricsList}>
                <span style={s.infoLabel}>METRICS:</span>
                <span style={{...s.metricItem, color: isNotamActive ? '#fff' : '#444'}}>
                  <span style={{...s.dot, backgroundColor: isNotamActive ? '#ff0000' : '#004400', animation: isNotamActive ? 'blink 1s infinite' : 'none'}} /> NOTAMs
                </span>
                <span style={s.metricItem}>DIPLOMACY</span><span style={s.metricItem}>ENERGY</span>
              </div>
            </div>
          </div>
        ))}

        <div style={s.forecastBox}>
          <h3 style={s.forecastTitle}>⚠️ ПРОГНОЗ: {data.prediction?.date}</h3>
          <p style={s.forecastText}>ТРЕК: <strong style={{color:'#ff3e3e'}}>ФОКУС НА ДИПЛОМАТИИ</strong>. РИСК ПРИ СРЫВЕ: <strong>{data.prediction?.impact}%</strong>.</p>
        </div>
      </main>

      <footer style={s.footer}>
        <p style={s.disclaimer}><strong>ОТКАЗ ОТ ОТВЕТСТВЕННОСТИ:</strong> OSINT-МОДЕЛЬ. НЕ ЯВЛЯЕТСЯ ДИРЕКТИВОЙ СЛУЖБ БЕЗОПАСНОСТИ.</p>
        <div style={s.footerMeta}>MADAD HAOREF © 2026 // ADAPTIVE_MONITORING</div>
      </footer>

      <style jsx global>{` @keyframes blink { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } } `}</style>
    </div>
  );
}

const s = {
  container: { background: '#000', color: '#0f4', fontFamily: 'monospace', minHeight: '100vh', padding: '10px 15px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  topTicker: { fontSize: '9px', color: '#444', marginBottom: '20px', borderBottom: '1px solid #111', width: '100%', textAlign: 'center', padding: '5px' },
  header: { textAlign: 'center', marginBottom: '30px', maxWidth: '650px' },
  logo: { fontSize: 'clamp(24px, 8vw, 36px)', letterSpacing: '5px', fontWeight: 'bold' },
  statusBlock: { marginTop: '5px' },
  meta: { fontSize: '9px', color: '#00cc00' },
  statusText: { fontSize: '10px', margin: '5px 0' },
  grid: { width: '100%', maxWidth: '650px', display: 'flex', flexDirection: 'column', gap: '15px' },
  card: { border: '1px solid #004400', padding: '15px', background: '#050505' },
  cardLayout: { display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' },
  cardContent: { flex: '1 1 280px' },
  nodeTitle: { fontSize: '12px', color: '#fff', fontWeight: 'bold', marginBottom: '10px', borderBottom: '1px solid #111' },
  newsSection: { display: 'flex', flexDirection: 'column', gap: '5px' },
  newsItem: { fontSize: '11px', color: '#eee', textTransform: 'none', lineHeight: '1.4' },
  newsSrc: { color: '#0f4', fontWeight: 'bold' },
  infoBox: { borderTop: '1px solid #1a1a1a', paddingTop: '10px', marginTop: '10px' },
  metricsList: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  infoLabel: { color: '#0f4', fontSize: '9px', marginRight: '5px' },
  metricItem: { fontSize: '9px', display: 'flex', alignItems: 'center', gap: '4px', color: '#444' },
  dot: { width: '6px', height: '6px', borderRadius: '50%' },
  forecastBox: { border: '1px solid #600', padding: '15px', background: '#0d0000', textAlign: 'center' },
  forecastTitle: { fontSize: '13px', color: '#ff3e3e', margin: '0' },
  forecastText: { fontSize: '11px', color: '#fff', marginTop: '5px' },
  footer: { marginTop: '30px', textAlign: 'center', maxWidth: '650px' },
  disclaimer: { fontSize: '8px', color: '#333' },
  footerMeta: { fontSize: '8px', color: '#004400', marginTop: '5px' },
  loader: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', color: '#0f4' }
};

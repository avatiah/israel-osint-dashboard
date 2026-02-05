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
        <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#1a1a1a" strokeWidth="8" strokeLinecap="round" />
        <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke={color} strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1.5s' }} />
        <text x="50" y="45" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold" fontFamily="monospace">{value}%</text>
        <text x="50" y="22" textAnchor="middle" fill={trend === 'up' ? '#ff3e3e' : '#0f4'} fontSize="8" fontWeight="bold">{trend === 'up' ? '▲ TREND' : '▼ STABLE'}</text>
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

  if (!data) return <div style={s.loader}>{">"} ВЕРИФИКАЦИЯ ИСТОЧНИКОВ...</div>;

  const isNotamActive = data.nodes.some(node => node.news?.some(n => /NOTAM|Airspace|Closed|FAA/i.test(n.txt)));

  return (
    <div style={{
      ...s.container,
      border: isNotamActive ? '2px solid #600' : '2px solid transparent',
      boxShadow: isNotamActive ? 'inset 0 0 50px rgba(100, 0, 0, 0.3)' : 'none',
      transition: 'all 0.5s ease'
    }}>
      <header style={s.header}>
        <h1 style={s.logo}>MADAD HAOREF</h1>
        <div style={s.statusBlock}>
          <div style={s.meta}>V13.3 // {isNotamActive ? 'CRITICAL_MODE' : 'MONITORING_ACTIVE'}</div>
          <div style={s.statusText}>СТАТУС: <span style={{color: isNotamActive ? '#ff3e3e' : '#0f4'}}>
            {isNotamActive ? '⚠️ ALERT_LEVEL_RED' : 'LIVE_FEED'}
          </span></div>
          <div style={s.time}>{new Date(data.timestamp).toLocaleTimeString()} UTC</div>
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
                <span style={s.infoLabel}>МЕТРИКИ:</span>
                <span style={{...s.metricItem, color: isNotamActive ? '#fff' : '#888'}}>
                  <span style={{...s.dot, backgroundColor: isNotamActive ? '#ff0000' : '#003300', animation: isNotamActive ? 'blink 1s infinite' : 'none'}} /> 
                  NOTAMs
                </span>
                <span style={s.metricItem}>DIPLOMACY</span>
                <span style={s.metricItem}>OSINT_SENTIMENT</span>
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
        <p style={s.disclaimer}><strong>ОТКАЗ ОТ ОТВЕТСТВЕННОСТИ:</strong> ДАННЫЙ РЕСУРС ЯВЛЯЕТСЯ АГРЕГАТОРОМ ОТКРЫТЫХ ДАННЫХ. ИНФОРМАЦИЯ НЕ ЯВЛЯЕТСЯ ОФИЦИАЛЬНОЙ ДИРЕКТИВОЙ СЛУЖБ БЕЗОПАСНОСТИ.</p>
        <div style={s.footerMeta}>MADAD HAOREF © 2026 // DYNAMIC_THREAT_ENGINE</div>
      </footer>

      <style jsx global>{` @keyframes blink { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } } `}</style>
    </div>
  );
}

const s = {
  container: { background: '#000', color: '#0f4', fontFamily: 'monospace', minHeight: '100vh', padding: '25px 15px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxSizing: 'border-box' },
  header: { textAlign: 'center', marginBottom: '30px', maxWidth: '650px', width: '100%' },
  logo: { fontSize: 'clamp(24px, 8vw, 36px)', letterSpacing: '5px', fontWeight: 'bold' },
  statusBlock: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', marginTop: '10px' },
  meta: { fontSize: '10px', color: '#00aa00' },
  statusText: { fontSize: '11px', fontWeight: 'bold' },
  time: { fontSize: '10px', color: '#006600' },
  grid: { width: '100%', maxWidth: '650px', display: 'flex', flexDirection: 'column', gap: '20px' },
  card: { border: '1px solid #004400', padding: '20px', background: '#050505' },
  cardLayout: { display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' },
  cardContent: { flex: '1 1 300px' },
  nodeTitle: { fontSize: '13px', color: '#fff', fontWeight: 'bold', marginBottom: '15px', borderBottom: '1px solid #111', paddingBottom: '5px' },
  newsSection: { display: 'flex', flexDirection: 'column', gap: '8px' },
  newsItem: { fontSize: '12px', color: '#eee', textTransform: 'none', lineHeight: '1.4' },
  newsSrc: { color: '#0f4', fontWeight: 'bold' },
  infoBox: { borderTop: '1px solid #1a1a1a', paddingTop: '15px', marginTop: '15px' },
  metricsList: { display: 'flex', gap: '15px', alignItems: 'center' },
  infoLabel: { color: '#0f4', fontSize: '10px', fontWeight: 'bold' },
  metricItem: { fontSize: '10px', display: 'flex', alignItems: 'center', gap: '6px' },
  dot: { width: '8px', height: '8px', borderRadius: '50%' },
  forecastBox: { border: '1px solid #600', padding: '20px', background: '#0d0000', textAlign: 'center' },
  forecastTitle: { fontSize: '14px', color: '#ff3e3e', margin: '0 0 10px 0' },
  forecastText: { fontSize: '12px', color: '#fff' },
  footer: { marginTop: '50px', textAlign: 'center', maxWidth: '650px', borderTop: '1px solid #111', paddingTop: '20px' },
  disclaimer: { fontSize: '9px', color: '#666' },
  footerMeta: { fontSize: '9px', color: '#004400', marginTop: '10px' },
  loader: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', color: '#0f4' }
};

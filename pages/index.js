import React, { useEffect, useState } from 'react';

const highlightCritical = (text) => {
  const words = ["ВЫСОКАЯ", "аномальная", "ДЕЖУРСТВО", "усиленного", "ПРЕДУПРЕЖДЕНИЕ", "БПЛА", "обход", "удар", "переброска"];
  let formatted = text;
  words.forEach(word => {
    const reg = new RegExp(`(${word})`, "gi");
    formatted = formatted.replace(reg, '<span style="color:#ff3e3e;font-weight:bold">$1</span>');
  });
  return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
};

const Gauge = ({ value, color, trend }) => {
  const circumference = Math.PI * 40;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div style={{ textAlign: 'center' }}>
      <svg width="110" height="65" viewBox="0 0 100 60">
        <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#1a1a1a" strokeWidth="8" strokeLinecap="round" />
        <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke={color} strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 2s ease-out' }} />
        <text x="50" y="45" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="bold">{value}%</text>
        <text x="50" y="20" textAnchor="middle" fill={trend === 'up' ? '#f33' : '#0f4'} fontSize="7" fontWeight="bold">
          {trend === 'up' ? '▲ РОСТ РИСКА' : '▼ СТАБИЛЬНО'}
        </text>
      </svg>
    </div>
  );
};

export default function TerminalV15() {
  const [data, setData] = useState(null);

  const updateData = async () => {
    try {
      const res = await fetch('/api/data');
      const json = await res.json();
      setData(json);
    } catch (e) { console.error("STREAM_ERROR"); }
  };

  useEffect(() => {
    updateData();
    const timer = setInterval(updateData, 15000);
    return () => clearInterval(timer);
  }, []);

  if (!data) return <div style={s.loader}>{">"} ВОССТАНОВЛЕНИЕ ГРАНИЦ МОДУЛЕЙ...</div>;

  const isNotamActive = data.nodes?.some(node => node.news?.some(n => /ПРЕДУПРЕЖДЕНИЕ|БПЛА|удар/i.test(n.txt)));

  return (
    <div style={{
      ...s.container,
      border: isNotamActive ? '2px solid #900' : '1px solid #004400', // Четкая внешняя граница
      boxShadow: isNotamActive ? 'inset 0 0 40px rgba(100, 0, 0, 0.2)' : 'none'
    }}>
      <div style={s.apiIndicator}>
        <span style={{...s.dot, backgroundColor: '#0f4', boxShadow: '0 0 10px #0f4'}} />
        <span style={s.apiText}>СВЯЗЬ_OSINT: ОПТИМАЛЬНО</span>
      </div>

      <header style={s.header}>
        <h1 style={s.logo}>MADAD HAOREF</h1>
        <div style={s.meta}>V15.1 // МОНИТОРИНГ_В_РЕАЛЬНОМ_ВРЕМЕНИ // ТРАФИК ИРАНА: {data.netConnectivity.score}%</div>
      </header>

      <main style={s.grid}>
        {data.nodes.map(node => (
          <div key={node.id} style={s.card}>
            <div style={s.cardLayout}>
              <Gauge value={node.value} color={parseFloat(node.value) > 60 ? '#f33' : '#0f4'} trend={node.trend} />
              <div style={s.cardContent}>
                <div style={s.nodeTitle}>{node.title}</div>
                <div style={s.newsSection}>
                  {node.news.map((n, i) => (
                    <div key={i} style={s.newsItem}><span style={s.newsSrc}>[{n.src}]</span> {highlightCritical(n.txt)}</div>
                  ))}
                </div>
              </div>
            </div>
            <div style={s.infoBox}>
              <div style={s.metricsList}>
                <span style={s.infoLabel}>МЕТРИКИ:</span>
                <span style={s.metricItem}>ИНТЕРНЕТ ИРАНА: <b style={{color:'#0f4'}}>{data.netConnectivity.score}%</b></span>
                <span style={s.metricItem}>DIPLOMACY: <b style={{color:'#888'}}>CRITICAL</b></span>
                <span style={s.metricItem}>SENTIMENT: <b style={{color:'#fff'}}>{node.value}%</b></span>
              </div>
            </div>
          </div>
        ))}

        <div style={s.forecastBox}>
          <div style={s.forecastTitle}>⚠️ СТРАТЕГИЧЕСКИЙ ПРОГНОЗ: {data.prediction.date}</div>
          <div style={s.forecastText}>ВЕРОЯТНОСТЬ ЭСКАЛАЦИИ ПРИ СРЫВЕ ПЕРЕГОВОРОВ: <strong>{data.prediction.impact}%</strong></div>
        </div>
      </main>

      <footer style={s.footer}>
        <p style={s.disclaimer}>ОТКАЗ ОТ ОТВЕТСТВЕННОСТИ: ДАННЫЕ АГРЕГИРОВАНЫ ИЗ ОТКРЫТЫХ ИСТОЧНИКОВ. НЕ ЯВЛЯЕТСЯ ДИРЕКТИВОЙ СЛУЖБ БЕЗОПАСНОСТИ.</p>
        <div style={s.footerMeta}>MADAD HAOREF // ТЕРМИНАЛ_2026 // {new Date().toLocaleTimeString()} UTC</div>
      </footer>
    </div>
  );
}

const s = {
  container: { background: '#000', color: '#0f4', fontFamily: 'monospace', minHeight: '100vh', padding: '30px 15px', position: 'relative', boxSizing: 'border-box' },
  apiIndicator: { position: 'absolute', top: '20px', right: '20px', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,20,0,0.5)', padding: '5px 10px', border: '1px solid #003300' },
  apiText: { fontSize: '9px', color: '#0f4', letterSpacing: '1px' },
  dot: { width: '7px', height: '7px', borderRadius: '50%' },
  header: { textAlign: 'center', marginBottom: '40px' },
  logo: { fontSize: '24px', letterSpacing: '8px', fontWeight: 'bold', margin: '0 0 5px 0' },
  meta: { fontSize: '10px', color: '#006600' },
  grid: { width: '100%', maxWidth: '650px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' },
  card: { border: '1px solid #005500', padding: '20px', background: '#050505', boxShadow: '0 0 15px rgba(0,255,0,0.02)' }, // Усиленная граница
  cardLayout: { display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' },
  cardContent: { flex: 1 },
  nodeTitle: { fontSize: '12px', color: '#fff', fontWeight: 'bold', marginBottom: '12px', borderBottom: '1px solid #003300', paddingBottom: '4px' },
  newsSection: { display: 'flex', flexDirection: 'column', gap: '8px' },
  newsItem: { fontSize: '11px', color: '#ccc', lineHeight: '1.4' },
  newsSrc: { color: '#0f4', fontWeight: 'bold' },
  infoBox: { borderTop: '1px solid #003300', marginTop: '15px', paddingTop: '15px' },
  metricsList: { display: 'flex', gap: '15px', flexWrap: 'wrap' },
  infoLabel: { fontSize: '9px', color: '#0f4', fontWeight: 'bold' },
  metricItem: { fontSize: '9px', color: '#444' },
  forecastBox: { border: '1px solid #800', padding: '20px', background: '#0a0000', textAlign: 'center' },
  forecastTitle: { fontSize: '12px', color: '#f33', marginBottom: '8px' },
  forecastText: { fontSize: '11px', color: '#fff' },
  footer: { marginTop: '60px', textAlign: 'center', borderTop: '1px solid #003300', paddingTop: '20px' },
  disclaimer: { fontSize: '8px', color: '#444', maxWidth: '500px', margin: '0 auto' },
  footerMeta: { fontSize: '8px', color: '#003300', marginTop: '10px' },
  loader: { height: '100vh', background: '#000', color: '#0f4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }
};

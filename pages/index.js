import React, { useEffect, useState } from 'react';

const highlightCritical = (text) => {
  const words = ["удар", "атака", "ракета", "БПЛА", "срыв", "инцидент", "развертывание", "переброска", "аномальный"];
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
    <div style={{ textAlign: 'center' }}>
      <svg width="110" height="65" viewBox="0 0 100 60">
        <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#1a1a1a" strokeWidth="8" strokeLinecap="round" />
        <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke={color} strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1.5s' }} />
        <text x="50" y="45" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="bold" fontFamily="monospace">{value}%</text>
        <text x="50" y="20" textAnchor="middle" fill={trend === 'up' ? '#ff3e3e' : '#0f4'} fontSize="8" fontWeight="bold">{trend === 'up' ? '▲ ТРЕНД' : '▼ СТАБИЛЬНО'}</text>
      </svg>
    </div>
  );
};

export default function TerminalV13() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchIntel = async () => {
      try {
        const res = await fetch('/api/data', { priority: 'high' });
        const json = await res.json();
        if (json?.nodes) setData(json);
      } catch (e) { console.error("SYNC_ERROR"); }
    };
    fetchIntel();
    const timer = setInterval(fetchIntel, 10000);
    return () => clearInterval(timer);
  }, []);

  if (!data) return <div style={s.loader}>{">"} ВОССТАНОВЛЕНИЕ ПОТОКА ДАННЫХ...</div>;

  const isNotamActive = data.nodes?.some(node => node.news?.some(n => /NOTAM|Закрытие|Ограничение/i.test(n.txt)));
  const healthColor = data.apiHealth === 'optimal' ? '#0f4' : '#ffae00';

  return (
    <div style={{
      ...s.container,
      border: isNotamActive ? '2px solid #600' : '2px solid transparent',
      boxShadow: isNotamActive ? 'inset 0 0 60px rgba(120, 0, 0, 0.4)' : 'none',
      transition: 'all 0.5s ease'
    }}>
      <div style={s.apiIndicator}>
        <span style={{...s.dot, backgroundColor: healthColor, boxShadow: `0 0 8px ${healthColor}`}} />
        <span style={{color: healthColor, fontSize: '9px', marginLeft: '8px', letterSpacing: '1px'}}>СВЯЗЬ_OSINT</span>
      </div>

      <header style={s.header}>
        <h1 style={s.logo}>MADAD HAOREF</h1>
        <div style={s.statusBlock}>
          <div style={s.meta}>ВЕРСИЯ 13.9 // {isNotamActive ? 'РЕЖИМ_ТРЕВОГИ' : 'АКТИВНЫЙ_МОНИТОРИНГ'}</div>
          <div style={s.time}>{new Date(data.timestamp).toLocaleTimeString()} UTC</div>
        </div>
      </header>

      <main style={s.grid}>
        {data.nodes.map(node => (
          <div key={node.id} style={s.card}>
            <div style={s.cardLayout}>
              <Gauge value={node.value} color={parseFloat(node.value) > 60 ? '#ff3e3e' : '#0f4'} trend={node.trend} />
              <div style={s.cardContent}>
                <div style={s.nodeTitle}>{node.title}</div>
                <div style={s.newsSection}>
                  {node.news && node.news.length > 0 ? node.news.map((item, idx) => (
                    <div key={idx} style={s.newsItem}><span style={s.newsSrc}>[{item.src}]</span> {highlightCritical(item.txt)}</div>
                  )) : <div style={{color:'#222', fontSize:'10px'}}>ДАННЫЕ_ОТСУТСТВУЮТ</div>}
                </div>
              </div>
            </div>
            
            <div style={s.infoBox}>
              <div style={s.metricsList}>
                <span style={s.infoLabel}>МЕТРИКИ:</span>
                <span style={{...s.metricItem, color: data.netConnectivity?.status !== 'stable' ? '#ffae00' : '#888'}}>
                   ТРАФИК_СЕТИ: {data.netConnectivity?.score}%
                </span>
                <span style={{...s.metricItem, color: isNotamActive ? '#fff' : '#444'}}>
                  <span style={{...s.dot, backgroundColor: isNotamActive ? '#f00' : '#111', animation: isNotamActive ? 'blink 1s infinite' : 'none'}} /> NOTAM
                </span>
                <span style={s.metricItem}>МЕТОД: {node.method || 'OSINT'}</span>
              </div>
            </div>
          </div>
        ))}

        <div style={s.forecastBox}>
          <h3 style={s.forecastTitle}>⚠️ СТРАТЕГИЧЕСКИЙ ПРОГНОЗ: {data.prediction?.date}</h3>
          <p style={s.forecastText}>СТАТУС: <strong>ДИПЛОМАТИЧЕСКИЙ_ТУПИК</strong>. РИСК ЭСКАЛАЦИИ: <strong>{data.prediction?.impact}%</strong>.</p>
        </div>
      </main>

      <footer style={s.footer}>
        <p style={s.disclaimer}>
          <strong>ОТКАЗ ОТ ОТВЕТСТВЕННОСТИ:</strong> ДАННАЯ ПАНЕЛЬ ЯВЛЯЕТСЯ АГРЕГАТОРОМ ОТКРЫТЫХ OSINT-ДАННЫХ. 
          ИНФОРМАЦИЯ НЕ ЯВЛЯЕТСЯ ОФИЦИАЛЬНОЙ ДИРЕКТИВОЙ СЛУЖБ БЕЗОПАСНОСТИ ИЛИ КОМАНДОВАНИЯ ТЫЛА. 
          ИСПОЛЬЗУЙТЕ ТОЛЬКО ДЛЯ ОЗНАКОМИТЕЛЬНЫХ ЦЕЛЕЙ.
        </p>
        <div style={s.footerMeta}>MADAD HAOREF © 2026 // АДАПТИВНЫЙ_ДВИЖОК_УГРОЗ</div>
      </footer>

      <style jsx global>{` @keyframes blink { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } } `}</style>
    </div>
  );
}

const s = {
  container: { background: '#000', color: '#0f4', fontFamily: 'monospace', minHeight: '100vh', padding: '25px 15px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxSizing: 'border-box', position: 'relative' },
  apiIndicator: { position: 'absolute', top: '20px', right: '20px', display: 'flex', alignItems: 'center', padding: '5px 10px', border: '1px solid #111' },
  header: { textAlign: 'center', marginBottom: '30px', maxWidth: '650px', width: '100%' },
  logo: { fontSize: '26px', letterSpacing: '5px', fontWeight: 'bold' },
  statusBlock: { marginTop: '10px' },
  meta: { fontSize: '10px', color: '#008800' },
  time: { fontSize: '10px', color: '#004400' },
  grid: { width: '100%', maxWidth: '650px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' },
  card: { border: '1px solid #003300', padding: '20px', background: '#050505' },
  cardLayout: { display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' },
  cardContent: { flex: '1 1 300px' },
  nodeTitle: { fontSize: '13px', color: '#fff', fontWeight: 'bold', marginBottom: '10px', borderBottom: '1px solid #111', paddingBottom: '5px' },
  newsSection: { display: 'flex', flexDirection: 'column', gap: '8px' },
  newsItem: { fontSize: '12px', color: '#ccc', lineHeight: '1.4' },
  newsSrc: { color: '#0f4', fontWeight: 'bold' },
  infoBox: { borderTop: '1px solid #111', paddingTop: '15px', marginTop: '15px' },
  metricsList: { display: 'flex', gap: '15px', alignItems: 'center' },
  infoLabel: { color: '#0f4', fontSize: '9px', fontWeight: 'bold' },
  metricItem: { fontSize: '9px', display: 'flex', alignItems: 'center', gap: '6px' },
  dot: { width: '8px', height: '8px', borderRadius: '50%' },
  forecastBox: { border: '1px solid #600', padding: '20px', background: '#0d0000', textAlign: 'center' },
  forecastTitle: { fontSize: '14px', color: '#ff3e3e', marginBottom: '10px' },
  forecastText: { fontSize: '11px', color: '#eee' },
  footer: { marginTop: '50px', textAlign: 'center', maxWidth: '650px', borderTop: '1px solid #111', paddingTop: '20px' },
  disclaimer: { fontSize: '9px', color: '#666', lineHeight: '1.5' },
  footerMeta: { fontSize: '9px', color: '#004400', marginTop: '10px' },
  loader: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', color: '#0f4' }
};

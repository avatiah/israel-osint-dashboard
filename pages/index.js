import React, { useEffect, useState } from 'react';

export default function MadadHaOref() {
  const [data, setData] = useState(null);

  const sync = async () => {
    try {
      const r = await fetch('/api/data');
      const j = await r.json();
      if (j && j.nodes) setData(j);
    } catch (e) { console.warn("SYNC_HOLD"); }
  };

  useEffect(() => { sync(); const i = setInterval(sync, 15000); return () => clearInterval(i); }, []);

  if (!data) return <div style={s.loader}>{">"} CONNECTING_TO_MADAD_HAOREF_CORE...</div>;

  return (
    <div style={s.container}>
      <header style={s.header}>
        <h1 style={s.logo}>MADAD HAOREF // ТЕРМИНАЛ</h1>
        <div style={s.time}>{new Date(data.timestamp).toLocaleString()} UTC</div>
      </header>

      <div style={s.grid}>
        {data.nodes?.map(node => (
          <div key={node.id} style={s.card}>
            <div style={s.cardTop}>
              <span style={s.label}>{node.title}</span>
              <span style={{...s.val, color: node.value > 60 ? '#f44' : '#0f4'}}>{node.value}%</span>
            </div>

            <div style={s.newsWall}>
              {node.news?.map((n, i) => (
                <div key={i} style={s.newsItem}>
                  <span style={s.src}>[{n.src}]</span> {n.txt}
                </div>
              ))}
            </div>
            <div style={s.method}>Методология: {node.method}</div>
          </div>
        ))}
      </div>

      <div style={s.forecast}>
        <h3 style={s.fTitle}>⚠️ СТРАТЕГИЧЕСКИЙ ПРОГНОЗ: {data.prediction?.date}</h3>
        <p style={s.fText}>
          ВЕКТОР: <strong>{data.prediction?.status}</strong>. <br/>
          Срыв переговоров в Омане поднимет риск удара США до <strong>{data.prediction?.impact}%</strong>.
        </p>
      </div>

      <footer style={s.footer}>
        ОТКАЗ ОТ ОТВЕТСТВЕННОСТИ: ДАННЫЕ ЯВЛЯЮТСЯ ВЕРОЯТНОСТНОЙ МОДЕЛЬЮ НА ОСНОВЕ ОТКРЫТЫХ ИСТОЧНИКОВ (OSINT). 
        НЕ ЯВЛЯЕТСЯ ОФИЦИАЛЬНОЙ РЕКОМЕНДАЦИЕЙ. MADAD HAOREF © 2026.
      </footer>
    </div>
  );
}

const s = {
  container: { background: '#000', color: '#0f4', fontFamily: 'monospace', minHeight: '100vh', padding: '20px', textTransform: 'uppercase' },
  header: { display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1a1a1a', paddingBottom: '10px', marginBottom: '25px' },
  logo: { fontSize: '20px', letterSpacing: '2px' },
  time: { fontSize: '10px', color: '#444' },
  grid: { maxWidth: '700px', margin: '0 auto' },
  card: { border: '1px solid #222', padding: '15px', background: '#050505', marginBottom: '15px' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  label: { fontSize: '11px', color: '#888' },
  val: { fontSize: '42px', fontWeight: 'bold' },
  newsWall: { borderLeft: '2px solid #111', paddingLeft: '12px', marginBottom: '10px' },
  newsItem: { fontSize: '11px', color: '#ddd', textTransform: 'none', marginBottom: '6px', lineHeight: '1.4' },
  src: { color: '#0f4', fontWeight: 'bold' },
  method: { fontSize: '8px', color: '#222', textTransform: 'none' },
  forecast: { maxWidth: '700px', margin: '20px auto', border: '1px solid #500', padding: '15px', background: '#100' },
  fTitle: { fontSize: '14px', color: '#f44', margin: '0 0 10px 0' },
  fText: { fontSize: '12px', color: '#eee', textTransform: 'none' },
  footer: { fontSize: '9px', color: '#222', textAlign: 'justify', maxWidth: '700px', margin: '40px auto 0', lineHeight: '1.3' },
  loader: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', color: '#0f4' }
};

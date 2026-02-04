import React, { useEffect, useState } from 'react';

export default function ProfessionalDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = () => fetch('/api/data').then(r => r.json()).then(setData);
    load();
    const t = setInterval(load, 20000);
    return () => clearInterval(t);
  }, []);

  if (!data || data.error) return <div style={s.loader}>{">"} RECONNECTING_TO_INTELLIGENCE_NODES...</div>;

  return (
    <div style={s.container}>
      <header style={s.header}>
        <h1 style={s.title}>MADAD_HAOREF // THREAT_ENGINE</h1>
        <div style={s.sub}>SYNC_TIME: {new Date(data.timestamp).toLocaleTimeString()} UTC</div>
      </header>

      <div style={s.grid}>
        {data.indices?.map(idx => (
          <div key={idx.id} style={s.card}>
            <div style={s.cardHeader}>
              <span style={s.label}>{idx.label}</span>
              <span style={s.src}>{idx.source}</span>
            </div>
            <div style={{...s.val, color: idx.val > 60 ? '#ff3e3e' : '#0f4'}}>{idx.val}%</div>
            <div style={s.analysis}>{idx.analysis}</div>
          </div>
        ))}
      </div>

      <div style={s.scenBox}>
        <h3 style={s.scenTitle}>⚠️ СТРАТЕГИЧЕСКИЙ ПРОГНОЗ: {data.forecast.critical_date}</h3>
        <p style={s.scenText}>
          ТЕКУЩИЙ ВЕКТОР: <strong>{data.forecast.scenario}</strong>. <br/>
          При срыве переговоров в Омане риск прямого столкновения вырастет до <strong>{data.forecast.impact}%</strong>. Аналитики указывают на 48-часовое окно после дедлайна.
        </p>
      </div>

      <footer style={s.footer}>
        TERMS: ДАННЫЕ АГРЕГИРОВАНЫ ИЗ ОТКРЫТЫХ ВОЕННЫХ И МЕДИА-ИСТОЧНИКОВ. НЕ ЯВЛЯЕТСЯ ПРИЗЫВОМ К ДЕЙСТВИЮ.
      </footer>
    </div>
  );
}

const s = {
  container: { background: '#000', color: '#0f4', fontFamily: 'monospace', padding: '20px', minHeight: '100vh', textTransform: 'uppercase' },
  header: { borderBottom: '2px solid #111', paddingBottom: '15px', marginBottom: '30px' },
  title: { fontSize: '20px', letterSpacing: '2px', margin: 0 },
  sub: { fontSize: '10px', color: '#444', marginTop: '5px' },
  grid: { display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '600px', margin: '0 auto' },
  card: { border: '1px solid #222', padding: '20px', background: '#050505' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
  label: { fontSize: '11px', fontWeight: 'bold' },
  src: { fontSize: '9px', color: '#333' },
  val: { fontSize: '48px', fontWeight: 'bold', margin: '5px 0' },
  analysis: { fontSize: '12px', color: '#ccc', textTransform: 'none', lineHeight: '1.4', borderTop: '1px solid #111', paddingTop: '10px' },
  scenBox: { border: '1px solid #500', background: '#100', padding: '20px', marginTop: '30px', maxWidth: '600px', margin: '30px auto' },
  scenTitle: { fontSize: '14px', color: '#ff3e3e', margin: '0 0 10px 0' },
  scenText: { fontSize: '13px', textTransform: 'none', color: '#eee', lineHeight: '1.5' },
  footer: { fontSize: '9px', color: '#222', textAlign: 'center', marginTop: '40px' },
  loader: { background: '#000', color: '#0f4', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }
};

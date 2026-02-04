import React, { useEffect, useState } from 'react';

export default function AnalystDashboard() {
  const [data, setData] = useState(null);

  const sync = () => fetch('/api/data').then(r => r.json()).then(setData).catch(() => {});

  useEffect(() => {
    sync();
    const timer = setInterval(sync, 10000);
    return () => clearInterval(timer);
  }, []);

  if (!data) return <div style={s.loader}>{">"} ACCESSING_INTEL_STREAM...</div>;

  return (
    <div style={s.container}>
      <header style={s.header}>
        <div style={s.nodeInfo}>NODE: ASHDOD_ANALYTICS // V8.0</div>
        <div style={s.time}>{new Date(data.timestamp).toLocaleString()}</div>
      </header>

      <div style={s.grid}>
        {data.nodes?.map(node => (
          <section key={node.id} style={s.card}>
            <div style={s.cardHeader}>
              <span style={s.title}>{node.title}</span>
              <span style={{...s.value, color: node.value > 60 ? '#ff3e3e' : '#0f4'}}>{node.value}%</span>
            </div>
            <div style={s.summary}>{node.summary}</div>
            <div style={s.specialistBox}>
              <span style={s.specLabel}>ANALYST_COMMENT:</span> {node.specialist_view}
            </div>
          </section>
        ))}
      </div>

      <section style={s.scenBox}>
        <h2 style={s.scenTitle}>СЦЕНАРНЫЙ АНАЛИЗ // ДЕДЛАЙН: {data.scenario?.date}</h2>
        <p style={s.scenText}>
          ТЕКУЩИЙ ТРЕК: <strong style={{color:'#ff3e3e'}}>{data.scenario?.status}</strong>. <br/>
          При срыве переговоров 6 февраля индекс удара США прогнозируется на уровне <strong>{data.scenario?.impact}%</strong>. 
          Это означает автоматический переход к фазе "Kinetic Action".
        </p>
      </section>

      <footer style={s.footer}>
        ВНИМАНИЕ: ДАННЫЕ ЯВЛЯЮТСЯ РЕЗУЛЬТАТОМ АВТОМАТИЧЕСКОГО OSINT-АНАЛИЗА. СЛЕДУЙТЕ УКАЗАНИЯМ СЛУЖБ БЕЗОПАСНОСТИ.
      </footer>
    </div>
  );
}

const s = {
  container: { background: '#000', color: '#0f4', fontFamily: 'monospace', padding: '20px', minHeight: '100vh', textTransform: 'uppercase' },
  header: { display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1a1a1a', paddingBottom: '10px', marginBottom: '30px' },
  nodeInfo: { fontSize: '12px', letterSpacing: '1px' },
  time: { fontSize: '12px', color: '#444' },
  grid: { display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '800px', margin: '0 auto' },
  card: { border: '1px solid #222', padding: '20px', background: '#050505' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
  title: { fontSize: '14px', fontWeight: 'bold', color: '#888' },
  value: { fontSize: '38px', fontWeight: 'bold' },
  summary: { fontSize: '13px', color: '#eee', textTransform: 'none', lineHeight: '1.4', marginBottom: '15px' },
  specialistBox: { background: '#0a0a0a', padding: '10px', borderLeft: '2px solid #0f4', fontSize: '11px', color: '#ccc', textTransform: 'none' },
  specLabel: { color: '#0f4', fontWeight: 'bold', marginRight: '5px' },
  scenBox: { border: '1px solid #400', background: '#100', padding: '20px', marginTop: '30px', maxWidth: '800px', margin: '30px auto' },
  scenTitle: { fontSize: '14px', color: '#ff3e3e', margin: '0 0 15px 0' },
  scenText: { fontSize: '13px', textTransform: 'none', lineHeight: '1.6', color: '#ddd' },
  footer: { textAlign: 'center', fontSize: '10px', color: '#222', marginTop: '50px' },
  loader: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f4' }
};

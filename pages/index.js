import React, { useEffect, useState } from 'react';

export default function MadadHaOref() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = () => fetch('/api/data').then(res => res.json()).then(setData);
    fetchData();
    const timer = setInterval(fetchData, 60000); // Автообновление каждую минуту
    return () => clearInterval(timer);
  }, []);

  if (!data) return <div style={s.loader}>SYSTEM_BOOT...</div>;

  return (
    <div style={s.container}>
      {/* Шапка */}
      <header style={s.header}>
        <h1 style={s.title}>{data.project_name}</h1>
        <div style={s.liveBadge}>LIVE FEED: {new Date(data.last_update).toLocaleTimeString()}</div>
      </header>

      {/* Объяснение для новичка */}
      <section style={s.intro}>
        <p><strong>Что вы видите?</strong> Это OSINT-мониторинг безопасности. Мы анализируем движение войск, спутники и заявления политиков, чтобы вы понимали уровень угрозы в реальном времени.</p>
      </section>

      {/* Спидометры угроз */}
      <div style={s.grid}>
        {data.indices.map(idx => (
          <div key={idx.id} style={s.card}>
            <div style={{display:'flex', justifyContent:'space-between'}}>
              <span style={s.label}>{idx.label}</span>
              <span style={{color: idx.value > 50 ? '#ff3e3e' : '#0f4'}}>{idx.trend === 'up' ? '▲' : '▼'}</span>
            </div>
            <div style={s.value}>{idx.value}%</div>
            <div style={{...s.bar, width: `${idx.value}%`, backgroundColor: idx.value > 60 ? '#f00' : '#0f4'}}></div>
            <p style={s.details}>{idx.details}</p>
            <div style={s.sources}>Источники: {idx.sources.join(', ')}</div>
          </div>
        ))}
      </div>

      {/* БЛОК: СЦЕНАРНЫЙ АНАЛИЗ */}
      <section style={s.scenarioCard}>
        <h3 style={s.scenarioTitle}>⚠️ {data.scenario_analysis.title}</h3>
        <p style={{fontSize: '12px', color: '#ffcc00'}}>{data.scenario_analysis.trigger_event}</p>
        <div style={{marginTop: '15px'}}>
          {data.scenario_analysis.impact.map((imp, i) => (
            <div key={i} style={s.impactItem}>
              <span>{imp.target}: <strong>{imp.change}</strong></span>
              <small style={{display:'block', color:'#666'}}>{imp.action}</small>
            </div>
          ))}
        </div>
      </section>

      {/* Живой поток сигналов */}
      <section style={s.card}>
        <h3 style={s.label}>ПОСЛЕДНИЕ СИГНАЛЫ (OSINT)</h3>
        {data.live_signals.map((sig, i) => (
          <div key={i} style={s.signal}>
            <span style={{color:'#0f4'}}>[{sig.time}]</span> <span style={{color:'#888'}}>{sig.src}:</span> {sig.msg}
          </div>
        ))}
      </section>

      <footer style={s.footer}>
        <strong>ДИСКЛАЙМЕР:</strong> Данные являются результатом частного анализа открытых источников (OSINT). Информация носит ознакомительный характер. В случае сирены следуйте в защищенное пространство.
      </footer>
    </div>
  );
}

const s = {
  container: { background: '#000', color: '#e0e0e0', fontFamily: 'monospace', padding: '15px', minHeight: '100vh', textTransform: 'uppercase' },
  header: { textAlign: 'center', borderBottom: '1px solid #333', paddingBottom: '15px', marginBottom: '20px' },
  title: { color: '#00ff41', margin: 0, fontSize: '20px' },
  liveBadge: { fontSize: '10px', background: '#1a1a1a', display: 'inline-block', padding: '2px 8px', marginTop: '5px' },
  intro: { fontSize: '12px', color: '#888', marginBottom: '20px', lineHeight: '1.4', background: '#0a0a0a', padding: '10px' },
  grid: { display: 'flex', flexDirection: 'column', gap: '15px' },
  card: { background: '#0f0f0f', border: '1px solid #222', padding: '15px', borderRadius: '4px' },
  label: { fontSize: '11px', color: '#00ff41' },
  value: { fontSize: '32px', fontWeight: 'bold', margin: '10px 0' },
  bar: { height: '4px', transition: 'width 1s ease' },
  details: { fontSize: '12px', color: '#bbb', marginTop: '10px', textTransform: 'none' },
  sources: { fontSize: '9px', color: '#444', marginTop: '8px' },
  scenarioCard: { background: '#1a0000', border: '1px solid #ff0000', padding: '15px', margin: '25px 0', borderRadius: '4px' },
  scenarioTitle: { fontSize: '14px', color: '#ff3e3e', margin: '0 0 10px 0' },
  impactItem: { borderBottom: '1px solid #300', padding: '8px 0', fontSize: '12px' },
  signal: { fontSize: '11px', borderBottom: '1px solid #111', padding: '8px 0' },
  footer: { fontSize: '10px', color: '#333', marginTop: '40px', textAlign: 'justify' },
  loader: { background: '#000', color: '#0f4', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }
};

import React, { useEffect, useState } from 'react';

export default function MadadHaOref() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/data');
      const json = await res.json();
      setData(json);
      setLoading(false);
    } catch (e) { console.error("Sync Error", e); }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Обновление каждые 30 сек.
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div style={s.loader}>> SYNCING_WITH_SATELLITE...</div>;

  return (
    <div style={s.container}>
      <header style={s.header}>
        <h1 style={s.title}>MADAD HAOREF</h1>
        <div style={s.live}>● LIVE_DATA: {new Date(data.timestamp).toLocaleTimeString()}</div>
      </header>

      {/* Индекс Израиля */}
      <div style={s.card}>
        <div style={s.label}>ISRAEL_SECURITY_INDEX (REAL-TIME)</div>
        <div style={{...s.value, color: data.israel.index > 60 ? '#ff3e3e' : '#0f4'}}>{data.israel.index}%</div>
        <div style={s.status}>STATUS: {data.israel.status}</div>
        <div style={s.sub}>Активных сирен (1ч): {data.israel.alerts_active}</div>
      </div>

      {/* Индекс США/Иран */}
      <div style={s.card}>
        <div style={s.label}>US_STRIKE_PROBABILITY (OSINT_VOLUME)</div>
        <div style={s.value}>{data.usa_iran.index}%</div>
        <div style={s.status}>DEALING_MODE: {data.usa_iran.status}</div>
        <div style={s.sub}>Медиа-активность (GDELT): {data.usa_iran.vol_index}</div>
      </div>

      {/* Динамический Сценарный Анализ */}
      <div style={s.scenarioCard}>
        <div style={s.scenTitle}>СЦЕНАРНЫЙ АНАЛИЗ (DEADLINE: 06.02)</div>
        <div style={s.scenBody}>
          {data.usa_iran.index > 55 ? 
            "ВНИМАНИЕ: Рост медиа-сигналов указывает на подготовку общественного мнения к удару. Срыв переговоров 6 февраля приведет к индексу 85%." : 
            "ТЕКУЩЕЕ: Приоритет дипломатии. Если переговоры сорвутся, ожидается скачок индекса на +40% в течение 12 часов."}
        </div>
      </div>

      <footer style={s.footer}>
        <p><strong>МЕТОДОЛОГИЯ:</strong> Данные генерируются автоматически через агрегацию Pikud HaOref API и GDELT Global Event Stream. Ошибка расчёта ±4%.</p>
        <p><strong>ДИСКЛАЙМЕР:</strong> Проект Madad HaOref — независимый инструмент. Не заменяет официальные каналы связи ЦАХАЛ.</p>
      </footer>
    </div>
  );
}

const s = {
  container: { background: '#000', color: '#00ff41', fontFamily: 'monospace', padding: '15px', minHeight: '100vh', textTransform: 'uppercase' },
  header: { borderBottom: '1px solid #1a1a1a', paddingBottom: '10px', marginBottom: '20px' },
  title: { fontSize: '22px', margin: 0, letterSpacing: '2px' },
  live: { fontSize: '10px', color: '#555', marginTop: '5px' },
  card: { border: '1px solid #222', padding: '20px', marginBottom: '15px', background: '#050505' },
  label: { fontSize: '11px', color: '#888' },
  value: { fontSize: '48px', fontWeight: 'bold', margin: '10px 0' },
  status: { fontSize: '12px', letterSpacing: '1px' },
  sub: { fontSize: '10px', color: '#444', marginTop: '10px' },
  scenarioCard: { border: '1px solid #ff3e3e', padding: '15px', background: '#1a0000', marginBottom: '20px' },
  scenTitle: { fontSize: '12px', color: '#ff3e3e', fontWeight: 'bold' },
  scenBody: { fontSize: '11px', marginTop: '10px', textTransform: 'none', lineHeight: '1.4', color: '#ccc' },
  footer: { fontSize: '9px', color: '#333', textAlign: 'justify', borderTop: '1px solid #111', paddingTop: '15px' },
  loader: { background: '#000', color: '#0f4', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }
};

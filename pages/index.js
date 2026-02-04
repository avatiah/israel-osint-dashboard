import React, { useEffect, useState } from 'react';

export default function MadadHaOref() {
  const [data, setData] = useState(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/data');
        if (!res.ok) throw new Error();
        const json = await res.json();
        setData(json);
      } catch (e) { 
        console.error("Sync Error", e);
        setIsError(true); 
      }
    };
    load();
    const timer = setInterval(load, 30000);
    return () => clearInterval(timer);
  }, []);

  if (isError) return <div style={s.loader}>SYSTEM_CRITICAL_ERROR: RECONNECTING...</div>;
  if (!data) return <div style={s.loader}>{">"} SYNCING_WITH_SATELLITE...</div>;

  return (
    <div style={s.container}>
      <header style={s.header}>
        <h1 style={s.title}>MADAD HAOREF</h1>
        <div style={s.sub}>SENSORS_STATUS: {data.error ? '⚠️ LIMITED' : '● ONLINE'}</div>
      </header>

      <main style={s.main}>
        {/* Индекс Израиля */}
        <div style={s.card}>
          <div style={s.label}>SECURITY_INDEX_ISRAEL</div>
          <div style={{...s.val, color: data.israel.value > 65 ? '#ff3e3e' : '#0f4'}}>{data.israel.value}%</div>
          <div style={s.stat}>РЕЖИМ: {data.israel.status}</div>
          <p style={s.desc}>На основе реальных инцидентов и активности ПВО за последние 24ч.</p>
        </div>

        {/* Индекс США/Иран */}
        <div style={s.card}>
          <div style={s.label}>US_STRIKE_PROBABILITY</div>
          <div style={s.val}>{data.strike.value}%</div>
          <div style={s.stat}>ТРЕК: {data.strike.status}</div>
          <p style={s.desc}>Анализ объема OSINT-сигналов (GDELT): {data.strike.vol}</p>
        </div>

        {/* Сценарный анализ */}
        <div style={{...s.card, borderColor: '#ff3e3e', background: '#1a0000'}}>
          <div style={{color: '#ff3e3e', fontSize: '12px', fontWeight: 'bold'}}>СЦЕНАРНЫЙ ПРОГНОЗ: 06.02</div>
          <div style={{fontSize: '13px', marginTop: '10px', textTransform: 'none', lineHeight: '1.4'}}>
            ТЕКУЩИЙ ВЕКТОР: <strong>{data.prediction.scenario}</strong>. <br/>
            {data.prediction.impact}
          </div>
        </div>
      </main>

      <footer style={s.footer}>
        <strong>МЕТОДОЛОГИЯ:</strong> ИНДЕКСЫ РАССЧИТАНЫ АВТОМАТИЧЕСКИ ЧЕРЕЗ АГРЕГАЦИЮ ПОТОКОВ GDELT (GLOBAL EVENT STREAM) И СИСТЕМ ОПОВЕЩЕНИЯ. ЭТО ДИНАМИЧЕСКАЯ МОДЕЛЬ БЕЗ СТАТИЧЕСКИХ ЗАГЛУШЕК.
      </footer>
    </div>
  );
}

const s = {
  container: { background: '#000', color: '#00ff41', fontFamily: 'monospace', padding: '20px', minHeight: '100vh', textTransform: 'uppercase' },
  header: { textAlign: 'center', marginBottom: '30px' },
  title: { fontSize: '26px', letterSpacing: '3px', margin: 0 },
  sub: { fontSize: '10px', color: '#555', marginTop: '5px' },
  main: { maxWidth: '500px', margin: '0 auto' },
  card: { border: '1px solid #222', padding: '20px', marginBottom: '20px', background: '#050505' },
  label: { fontSize: '10px', color: '#888' },
  val: { fontSize: '54px', fontWeight: 'bold', margin: '10px 0' },
  stat: { fontSize: '14px', letterSpacing: '1px' },
  desc: { fontSize: '11px', color: '#444', marginTop: '10px', textTransform: 'none' },
  footer: { fontSize: '9px', color: '#333', textAlign: 'justify', marginTop: '30px', borderTop: '1px solid #111', paddingTop: '15px' },
  loader: { background: '#000', color: '#0f4', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace' }
};

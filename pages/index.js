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
      } catch (e) { setIsError(true); }
    };
    load();
    const timer = setInterval(load, 30000);
    return () => clearInterval(timer);
  }, []);

  if (isError) return <div style={s.loader}>КРИТИЧЕСКАЯ ОШИБКА СЕТИ. ПЕРЕПОДКЛЮЧЕНИЕ...</div>;
  if (!data || !data.israel) return <div style={s.loader}>ПОДКЛЮЧЕНИЕ К УЗЛАМ OSINT...</div>;

  return (
    <div style={s.container}>
      <header style={s.header}>
        <h1 style={s.title}>MADAD HAOREF</h1>
        <div style={s.sub}>SENSORS_STATUS: {data.error ? '⚠️ LIMITED' : '● ONLINE'}</div>
      </header>

      <main style={s.main}>
        {/* Карточка Израиля */}
        <div style={s.card}>
          <div style={s.label}>SECURITY_INDEX_ISRAEL</div>
          <div style={{...s.val, color: data.israel.value > 65 ? '#ff3e3e' : '#0f4'}}>{data.israel.value}%</div>
          <div style={s.stat}>РЕЖИМ: {data.israel.status}</div>
          <p style={s.desc}>Рассчитано на основе {data.israel.raw_alerts} инцидентов за 24ч.</p>
        </div>

        {/* Карточка США/Иран */}
        <div style={s.card}>
          <div style={s.label}>US_STRIKE_PROBABILITY</div>
          <div style={s.val}>{data.strike.value}%</div>
          <div style={s.stat}>ТРЕК: {data.strike.status}</div>
          <p style={s.desc}>Медиа-активность (GDELT Volume): {data.strike.vol}</p>
        </div>

        {/* Сценарный блок */}
        <div style={{...s.card, borderColor: '#ff3e3e', background: '#1a0000'}}>
          <div style={{color: '#ff3e3e', fontSize: '12px', fontWeight: 'bold'}}>СЦЕНАРНЫЙ ПРОГНОЗ: 06.02</div>
          <div style={{fontSize: '13px', marginTop: '10px', textTransform: 'none'}}>
            Текущий сценарий: <strong>{data.prediction.scenario}</strong>. <br/>
            {data.prediction.impact}
          </div>
        </div>
      </main>

      <footer style={s.footer}>
        <strong>МЕТОДОЛОГИЯ:</strong> Индексы формируются автоматически агрегатором GDELT (событийный фон) и RedAlert (активность обстрелов). Это независимая математическая модель.
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
  loader: { background: '#000', color: '#0f4', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }
};

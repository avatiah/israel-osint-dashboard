import React, { useEffect, useState } from 'react';

export default function MadadHaOref() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/data');
        if (!res.ok) throw new Error("API_DOWN");
        const json = await res.json();
        setData(json);
        setError(false);
      } catch (e) {
        console.warn("Retrying sync...");
        setError(true);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 15000); // Чаще опрос для динамики
    return () => clearInterval(interval);
  }, []);

  if (error && !data) return <div style={s.loader}>RECONNECTING_TO_NODES...</div>;
  if (!data) return <div style={s.loader}>{">"} INITIALIZING_MADAD_SYSTEM...</div>;

  return (
    <div style={s.container}>
      <header style={s.header}>
        <h1 style={s.title}>MADAD HAOREF</h1>
        <div style={s.sub}>SYNC_TIME: {new Date(data.timestamp).toLocaleTimeString()}</div>
      </header>

      <main style={s.main}>
        {/* Блок Израиля */}
        <div style={s.card}>
          <div style={s.label}>ISRAEL_SECURITY_INDEX</div>
          <div style={{...s.val, color: data.israel.value > 65 ? '#ff4d4d' : '#00ff41'}}>
            {data.israel.value}%
          </div>
          <div style={s.stat}>STATUS: {data.israel.status}</div>
        </div>

        {/* Блок США/Иран */}
        <div style={s.card}>
          <div style={s.label}>US_STRIKE_PROBABILITY</div>
          <div style={s.val}>{data.strike.value}%</div>
          <div style={s.stat}>MODE: {data.strike.status}</div>
        </div>

        {/* Сценарий 6 февраля */}
        <div style={s.scenCard}>
          <div style={{color: '#ff4d4d', fontSize: '12px', fontWeight: 'bold'}}>SCENARIO_ANALYSIS: 06.02</div>
          <div style={s.scenText}>
            ТЕКУЩИЙ ТРЕК: <strong>{data.prediction.scenario}</strong>. <br/>
            Срыв переговоров в Омане поднимет риск до {data.prediction.impact}%.
          </div>
        </div>
      </main>

      <footer style={s.footer}>
        MADAD HAOREF // REAL-TIME OSINT AGGREGATOR. <br/>
        ДАННЫЕ ОБНОВЛЯЮТСЯ АВТОМАТИЧЕСКИ ИЗ GDELT И REDALERT.
      </footer>
    </div>
  );
}

const s = {
  container: { background: '#000', color: '#0f4', fontFamily: 'monospace', padding: '20px', minHeight: '100vh', textTransform: 'uppercase' },
  header: { textAlign: 'center', marginBottom: '30px', borderBottom: '1px solid #111', paddingBottom: '15px' },
  title: { fontSize: '24px', letterSpacing: '2px', margin: 0 },
  sub: { fontSize: '10px', color: '#444' },
  main: { maxWidth: '450px', margin: '0 auto' },
  card: { border: '1px solid #222', padding: '20px', marginBottom: '20px', background: '#050505' },
  label: { fontSize: '10px', color: '#888' },
  val: { fontSize: '50px', fontWeight: 'bold', margin: '10px 0' },
  stat: { fontSize: '14px' },
  scenCard: { border: '1px solid #400', padding: '15px', background: '#100', marginBottom: '20px' },
  scenText: { fontSize: '12px', marginTop: '10px', textTransform: 'none', color: '#ccc', lineHeight: '1.4' },
  footer: { fontSize: '9px', color: '#222', textAlign: 'center', marginTop: '30px' },
  loader: { background: '#000', color: '#0f4', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace' }
};

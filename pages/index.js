import React, { useEffect, useState } from 'react';

export default function MadadHaOref() {
  const [data, setData] = useState(null);

  const fetchIntel = async () => {
    try {
      const res = await fetch('/api/data');
      if (!res.ok) return;
      const json = await res.json();
      if (json && json.nodes) setData(json);
    } catch (e) { console.warn("HOLDING_STATE"); }
  };

  useEffect(() => {
    fetchIntel();
    const timer = setInterval(fetchIntel, 15000);
    return () => clearInterval(timer);
  }, []);

  if (!data) return <div style={s.loader}>{">"} MADAD_HAOREF: СВЯЗЬ С УЗЛАМИ...</div>;

  return (
    <div style={s.container}>
      <header style={s.header}>
        <h1 style={s.mainTitle}>MADAD HAOREF</h1>
        <div style={s.statusLine}>
          SYSTEM_STATUS: <span style={{color:'#0f4'}}>ENCRYPTED_LIVE</span> // 
          SYNC: {new Date(data.timestamp).toLocaleTimeString()}
        </div>
      </header>

      <main style={s.main}>
        {data.nodes.map(node => (
          <div key={node.id} style={s.card}>
            <div style={s.cardTop}>
              <div style={s.nodeTitle}>{node.title}</div>
              <div style={{...s.value, color: node.value > 65 ? '#ff3e3e' : '#0f4'}}>{node.value}%</div>
            </div>
            
            <div style={s.intelBox}>
              <div style={s.metaLabel}>ТЕКУЩАЯ СВОДКА:</div>
              <div style={s.intelText}>{node.intel}</div>
            </div>

            <div style={s.methodBox}>
              <div><span style={s.metaLabel}>ИСТОЧНИК:</span> {node.source}</div>
              <div><span style={s.metaLabel}>МЕТОДОЛОГИЯ:</span> {node.method}</div>
            </div>
          </div>
        ))}

        <div style={s.forecast}>
          <div style={s.forecastTitle}>⚠️ СТРАТЕГИЧЕСКИЙ ПРОГНОЗ: 06.02.2026</div>
          <div style={s.forecastText}>
            ВЕКТОР: <strong style={{color:'#ff3e3e'}}>{data.prediction?.status}</strong>. <br/>
            При срыве переговоров в Омане аналитическая модель прогнозирует рост индекса удара до <strong>{data.prediction?.impact}%</strong> в течение 48 часов.
          </div>
        </div>
      </main>

      <footer style={s.footer}>
        <p><strong>ОТКАЗ ОТ ОТВЕТСТВЕННОСТИ:</strong> ДАННЫЙ РЕСУРС ЯВЛЯЕТСЯ АГРЕГАТОРОМ ОТКРЫТЫХ ДАННЫХ (OSINT). ВСЕ РАСЧЕТЫ ЯВЛЯЮТСЯ ВЕРОЯТНОСТНЫМИ МОДЕЛЯМИ И НЕ ЯВЛЯЮТСЯ ОФИЦИАЛЬНЫМИ ДИРЕКТИВАМИ СЛУЖБ БЕЗОПАСНОСТИ. ПОЛЬЗОВАТЕЛЬ НЕСЕТ ПОЛНУЮ ОТВЕТСТВЕННОСТЬ ЗА ПРИНЯТЫЕ РЕШЕНИЯ.</p>
        <p style={{marginTop:'10px', color:'#333'}}>MADAD HAOREF © 2026 // NO_STATIC_STUB_POLICY_ACTIVE</p>
      </footer>
    </div>
  );
}

const s = {
  container: { background: '#000', color: '#0f4', fontFamily: 'monospace', padding: '20px', minHeight: '100vh', textTransform: 'uppercase' },
  header: { borderBottom: '1px solid #1a1a1a', paddingBottom: '15px', marginBottom: '30px', textAlign: 'center' },
  mainTitle: { fontSize: '28px', letterSpacing: '4px', margin: '0 0 5px 0' },
  statusLine: { fontSize: '10px', color: '#444' },
  main: { maxWidth: '700px', margin: '0 auto' },
  card: { border: '1px solid #222', padding: '20px', background: '#050505', marginBottom: '20px' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
  nodeTitle: { fontSize: '14px', fontWeight: 'bold', color: '#888' },
  value: { fontSize: '46px', fontWeight: 'bold' },
  intelBox: { background: '#0a0a0a', padding: '12px', borderLeft: '2px solid #0f4', marginBottom: '15px' },
  metaLabel: { fontSize: '10px', color: '#0f4', fontWeight: 'bold' },
  intelText: { fontSize: '13px', color: '#eee', textTransform: 'none', marginTop: '5px', lineHeight: '1.4' },
  methodBox: { fontSize: '9px', color: '#333', textTransform: 'none', display: 'flex', flexDirection: 'column', gap: '4px' },
  forecast: { border: '1px solid #500', background: '#100', padding: '20px', marginTop: '30px' },
  forecastTitle: { fontSize: '14px', color: '#ff3e3e', marginBottom: '10px' },
  forecastText: { fontSize: '13px', textTransform: 'none', lineHeight: '1.5', color: '#ccc' },
  footer: { marginTop: '50px', borderTop: '1px solid #111', paddingTop: '20px', fontSize: '9px', color: '#222', textAlign: 'justify', lineHeight: '1.4' },
  loader: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', color: '#0f4' }
};

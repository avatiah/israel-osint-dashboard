import React, { useEffect, useState } from 'react';

export default function SecurityTerminal() {
  const [data, setData] = useState(null);

  const updateData = async () => {
    try {
      const res = await fetch('/api/data');
      if (!res.ok) return; // Не сбрасываем данные при ошибке сервера
      const json = await res.json();
      
      // КРИТИЧЕСКАЯ ПРОВЕРКА: Если пришел пустой массив или ошибка, не обновляем экран
      if (json && json.nodes && json.nodes.length > 0) {
        setData(json);
      }
    } catch (e) {
      console.warn("API_TIMEOUT: Holding previous state.");
    }
  };

  useEffect(() => {
    updateData();
    const timer = setInterval(updateData, 10000); // Опрос каждые 10 сек
    return () => clearInterval(timer);
  }, []);

  if (!data) return <div style={s.loader}>{">"} ESTABLISHING_SECURE_LINK...</div>;

  return (
    <div style={s.container}>
      <header style={s.header}>
        <div style={s.nodeInfo}>NODE: ASHDOD_ANALYTICS // V10.2 // STABLE_STREAM</div>
        <div style={s.time}>{new Date(data.timestamp).toLocaleTimeString()} UTC</div>
      </header>

      <div style={s.grid}>
        {data.nodes.map(node => (
          <div key={node.id} style={s.card}>
            <div style={s.cardTop}>
              <span style={s.label}>{node.title}</span>
              <span style={{...s.val, color: node.value > 60 ? '#ff3e3e' : '#0f4'}}>{node.value}%</span>
            </div>
            <div style={s.analysis}>{node.analysis}</div>
            <div style={s.expert}>
              <span style={{color:'#0f4'}}>EXPERT_VIEW:</span> {node.view}
            </div>
          </div>
        ))}
      </div>

      <div style={s.scenBox}>
        <h3 style={s.scenTitle}>⚠️ СТРАТЕГИЧЕСКИЙ ПРОГНОЗ: {data.prediction?.date}</h3>
        <p style={s.scenText}>
          ТЕКУЩИЙ ТРЕК: <strong>{data.prediction?.status}</strong>. <br/>
          При официальном срыве переговоров в Маскате, индекс удара вырастет до <strong>{data.prediction?.impact}%</strong>.
        </p>
      </div>

      <footer style={s.footer}>
        DYNAMICS: PERSISTENT ANALYTICS // NO DATA LOSS PROTOCOL ACTIVE
      </footer>
    </div>
  );
}

const s = {
  container: { background: '#000', color: '#0f4', fontFamily: 'monospace', padding: '20px', minHeight: '100vh', textTransform: 'uppercase' },
  header: { display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1a1a1a', paddingBottom: '10px', marginBottom: '25px' },
  nodeInfo: { fontSize: '10px', color: '#444' },
  time: { fontSize: '10px' },
  grid: { display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '600px', margin: '0 auto' },
  card: { border: '1px solid #222', padding: '15px', background: '#050505' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  label: { fontSize: '11px', color: '#888' },
  val: { fontSize: '40px', fontWeight: 'bold' },
  analysis: { fontSize: '12px', color: '#ccc', textTransform: 'none', lineHeight: '1.4', marginBottom: '10px' },
  expert: { fontSize: '10px', color: '#555', borderTop: '1px solid #111', paddingTop: '8px', textTransform: 'none' },
  scenBox: { border: '1px solid #400', background: '#0a0000', padding: '20px', marginTop: '25px', maxWidth: '600px', margin: '25px auto' },
  scenTitle: { fontSize: '13px', color: '#ff3e3e', margin: '0 0 10px 0' },
  scenText: { fontSize: '12px', textTransform: 'none', color: '#eee', lineHeight: '1.5' },
  footer: { textAlign: 'center', fontSize: '9px', color: '#222', marginTop: '40px' },
  loader: { height: '100vh', background: '#000', color: '#0f4', display: 'flex', alignItems: 'center', justifyContent: 'center' }
};

import React, { useEffect, useState } from 'react';

export default function ThreatEngine() {
  const [data, setData] = useState(null);

  const fetchStream = async () => {
    try {
      const res = await fetch('/api/data');
      if (!res.ok) throw new Error("SERVER_FAIL");
      const json = await res.json();
      if (json && json.nodes) setData(json);
    } catch (e) {
      console.warn("RECOVERY_PROTOCOL: Holding last known state.");
    }
  };

  useEffect(() => {
    fetchStream();
    const interval = setInterval(fetchStream, 15000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return <div style={s.loader}>{">"} ACCESSING_INTEL_STREAM...</div>;

  return (
    <div style={s.container}>
      <header style={s.header}>
        <div style={s.meta}>NODE: ASHDOD_ANALYTICS // V10.3</div>
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
          При срыве переговоров 6 февраля индекс удара вырастет до <strong>{data.prediction?.impact}%</strong>.
        </p>
      </div>
    </div>
  );
}

const s = {
  container: { background: '#000', color: '#0f4', fontFamily: 'monospace', padding: '20px', minHeight: '100vh', textTransform: 'uppercase' },
  header: { display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1a1a1a', paddingBottom: '10px', marginBottom: '25px' },
  meta: { fontSize: '10px', color: '#444' },
  time: { fontSize: '10px' },
  grid: { display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '600px', margin: '0 auto' },
  card: { border: '1px solid #222', padding: '15px', background: '#050505' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  label: { fontSize: '11px', color: '#888' },
  val: { fontSize: '40px', fontWeight: 'bold' },
  analysis: { fontSize: '12px', color: '#ccc', textTransform: 'none', lineHeight: '1.4', marginBottom: '10px' },
  expert: { fontSize: '10px', color: '#555', borderTop: '1px solid #111', paddingTop: '8px', textTransform: 'none' },
  scenBox: { border: '1px solid #500', background: '#100', padding: '20px', marginTop: '25px', maxWidth: '600px', margin: '25px auto' },
  scenTitle: { fontSize: '13px', color: '#ff3e3e', margin: '0 0 10px 0' },
  scenText: { fontSize: '12px', textTransform: 'none', color: '#eee', lineHeight: '1.5' },
  loader: { height: '100vh', background: '#000', color: '#0f4', display: 'flex', alignItems: 'center', justifyContent: 'center' }
};

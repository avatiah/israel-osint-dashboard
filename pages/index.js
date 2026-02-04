import React, { useEffect, useState } from 'react';

const Metric = ({ label, val, color }) => (
  <div style={{borderLeft: `2px solid ${color}`, paddingLeft: '10px'}}>
    <div style={{fontSize: '9px', color: '#555'}}>{label}</div>
    <div style={{fontSize: '14px', fontWeight: 'bold', color: color}}>{val}</div>
  </div>
);

export default function MadadDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = () => fetch('/api/data').then(r => r.json()).then(setData);
    load();
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
  }, []);

  if (!data) return <div style={s.loader}>{">"} BOOTING_CORE_V3.1...</div>;

  return (
    <div style={s.container}>
      {/* Топ-панель Экономики */}
      <div style={s.topBar}>
        <Metric label="BRENT_OIL" val={`$${data.econ?.brent}`} color="#ff3e3e" />
        <Metric label="USD_ILS" val={data.econ?.usd_ils} color="#0f4" />
        <div style={{textAlign: 'right', fontSize: '10px', color: '#444'}}>
          NODE: ASHDOD_DISTRICT <br/> {new Date(data.timestamp).toLocaleTimeString()} UTC
        </div>
      </div>

      <main style={s.main}>
        {data.indices?.map(idx => (
          <div key={idx.id} style={s.card}>
            <div style={{display:'flex', justifyContent:'space-between'}}>
              <span style={s.cardLabel}>{idx.label}</span>
              <span style={s.src}>SOURCE: {idx.src}</span>
            </div>
            <div style={{...s.val, color: idx.val > 60 ? '#ff3e3e' : '#0f4'}}>{idx.val}%</div>
            <div style={s.status}>MODE: {idx.status}</div>
            <p style={s.desc}>{idx.desc}</p>
          </div>
        ))}

        {/* Сценарный блок */}
        <div style={s.scenBox}>
          <div style={{color: '#ff3e3e', fontSize: '12px', fontWeight: 'bold'}}>STRATEGIC_FORECAST: 06.02</div>
          <div style={s.scenText}>
            ВЕКТОР: <strong>{data.prediction?.scenario}</strong>. <br/>
            При срыве «Маскатского протокола» (Оман) риск удара США вырастет до {data.prediction?.impact}%.
          </div>
        </div>
      </main>

      <footer style={s.footer}>
        MADAD_HAOREF_V3 // ПОЛНОСТЬЮ ДИНАМИЧЕСКАЯ МОДЕЛЬ // БЕЗ СТАТИЧЕСКИХ ЗАГЛУШЕК
      </footer>
    </div>
  );
}

const s = {
  container: { background: '#000', color: '#0f4', fontFamily: 'monospace', minHeight: '100vh', padding: '15px', textTransform: 'uppercase' },
  topBar: { display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #222', paddingBottom: '15px', marginBottom: '25px' },
  main: { maxWidth: '500px', margin: '0 auto' },
  card: { border: '1px solid #222', padding: '15px', marginBottom: '15px', background: '#050505', position: 'relative' },
  cardLabel: { fontSize: '10px', color: '#888' },
  src: { fontSize: '8px', color: '#222' },
  val: { fontSize: '46px', fontWeight: 'bold', margin: '10px 0' },
  status: { fontSize: '12px', border: '1px solid #333', display: 'inline-block', padding: '2px 6px' },
  desc: { fontSize: '11px', color: '#444', marginTop: '10px', textTransform: 'none', lineHeight: '1.3' },
  scenBox: { border: '1px solid #500', background: '#100', padding: '15px', marginTop: '25px' },
  scenText: { fontSize: '12px', marginTop: '10px', textTransform: 'none', color: '#ccc', lineHeight: '1.4' },
  footer: { fontSize: '9px', color: '#222', marginTop: '40px', textAlign: 'center' },
  loader: { background: '#000', color: '#0f4', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }
};

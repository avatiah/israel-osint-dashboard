import React, { useEffect, useState } from 'react';

const Card = ({ item }) => (
  <div style={s.card}>
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'start'}}>
      <span style={s.label}>{item.label}</span>
      <a href={item.source_url} target="_blank" style={s.srcLink}>[VERIFY_SRC]</a>
    </div>
    <div style={{...s.val, color: item.value > 60 ? '#ff3e3e' : '#0f4'}}>{item.value}%</div>
    <div style={s.status}>STATUS: {item.status}</div>
    <p style={s.desc}>{item.desc}</p>
  </div>
);

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = () => fetch('/api/data').then(r => r.json()).then(setData);
    load();
    const t = setInterval(load, 20000);
    return () => clearInterval(t);
  }, []);

  if (!data) return <div style={s.loader}>{">"} CONNECTING_TO_NODES...</div>;

  return (
    <div style={s.container}>
      <header style={s.header}>
        <h1 style={s.title}>MADAD_HAOREF_V2</h1>
        <div style={s.sub}>LAST_SYNC: {new Date(data.timestamp).toLocaleTimeString()}</div>
      </header>

      <div style={s.grid}>
        {data.indices?.map(idx => <Card key={idx.id} item={idx} />)}
      </div>

      <div style={s.scenBox}>
        <div style={{color:'#ff3e3e', fontSize:'12px', fontWeight:'bold'}}>SCENARIO: OMAN_TALKS_DEADLINE (06.02)</div>
        <p style={s.scenText}>
          ТЕКУЩИЙ ТРЕК: <strong>{data.prediction?.scenario}</strong>. <br/>
          В случае официального срыва переговоров, риск удара США автоматически корректируется до {data.prediction?.impact_val}%.
        </p>
      </div>

      <footer style={s.footer}>
        СИСТЕМА РАБОТАЕТ НА ПРЯМЫХ ПОТОКАХ GDELT И REDALERT. ДАННЫЕ ОБНОВЛЯЮТСЯ В РЕАЛЬНОМ ВРЕМЕНИ.
      </footer>
    </div>
  );
}

const s = {
  container: { background: '#000', color: '#0f4', fontFamily: 'monospace', padding: '15px', minHeight: '100vh', textTransform: 'uppercase' },
  header: { borderBottom: '2px solid #333', paddingBottom: '10px', marginBottom: '20px', textAlign: 'center' },
  title: { fontSize: '22px', margin: 0, letterSpacing: '2px' },
  sub: { fontSize: '10px', color: '#444' },
  grid: { display: 'flex', flexDirection: 'column', gap: '15px' },
  card: { border: '1px solid #222', padding: '15px', background: '#050505' },
  label: { fontSize: '11px', color: '#888' },
  srcLink: { fontSize: '9px', color: '#00ff4133', textDecoration: 'none' },
  val: { fontSize: '42px', fontWeight: 'bold', margin: '10px 0' },
  status: { fontSize: '12px' },
  desc: { fontSize: '11px', color: '#444', marginTop: '10px', textTransform: 'none' },
  scenBox: { border: '1px solid #600', background: '#100', padding: '15px', marginTop: '20px' },
  scenText: { fontSize: '12px', marginTop: '8px', textTransform: 'none', lineHeight: '1.4' },
  footer: { fontSize: '9px', color: '#222', marginTop: '30px', textAlign: 'center' },
  loader: { background: '#000', color: '#0f4', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }
};

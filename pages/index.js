import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/data')
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch((err) => console.error("Ошибка загрузки:", err));
  }, []);

  if (!data) return <div style={{background:'#000', color:'#0f4', height:'100vh', padding:'20px'}}>LOADING_SYSTEM_NODES...</div>;

  return (
    <div style={{ background: '#000', color: '#00ff41', fontFamily: 'monospace', minHeight: '100vh', padding: '20px' }}>
      <header style={{ borderBottom: '1px solid #f00', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
        <span>NODE: ASHDOD_DISTRICT // ADMIN_V72.1</span>
        <span>BRENT_CRUDE: <span style={{color: '#f00'}}>${data.market.brent}</span></span>
        <span>USD_ILS: {data.market.usd_ils}</span>
        <span>{new Date(data.last_update).toUTCString()}</span>
      </header>

      <main style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
        <section style={{ border: '1px solid #333', padding: '15px' }}>
          <h3>TENSION_INDEX</h3>
          <div style={{ fontSize: '64px', fontWeight: 'bold', color: data.index > 75 ? '#ff3e3e' : '#0f4' }}>
            {data.index}
          </div>
          <p>STRIKE_PROB: {data.strike_probability}</p>
        </section>

        <section style={{ border: '1px solid #333', padding: '15px' }}>
          <h3>VERIFIED_INTELLIGENCE_STREAM</h3>
          {data.signals.map((s, i) => (
            <div key={i} style={{ marginBottom: '15px', borderLeft: '2px solid #0f4', paddingLeft: '10px' }}>
              <small>[{s.source}] {s.date.split('T')[1].substring(0, 5)}</small>
              <div style={{ fontSize: '14px' }}>{s.title}</div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

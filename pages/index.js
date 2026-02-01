import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = () => {
      fetch(`/api/data?nocache=${Date.now()}`, { cache: 'no-store' })
        .then(r => r.json())
        .then(d => { if (d && d.live) setData(d); });
    };
    load();
    const int = setInterval(load, 30000);
    return () => clearInterval(int);
  }, []);

  if (!data) return <div style={{background:'#000', color:'#0f0', height:'100vh', padding:'20px'}}>SYNCING...</div>;

  return (
    <div style={{ background: '#000', color: '#0f0', minHeight: '100vh', fontFamily: 'monospace', padding: '20px' }}>
      <header style={{ border: '1px solid #0f0', padding: '15px', marginBottom: '20px' }}>
        <h1 style={{ margin: 0, fontSize: '1.2rem' }}>OSINT_COMMAND_{data.version}</h1>
        <div style={{ fontSize: '0.7rem' }}>TIME: {new Date(data.last_update).toLocaleTimeString()}</div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ border: '1px solid #0f0', padding: '30px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>CURRENT_ISRAEL_RISK</div>
          <div style={{ fontSize: '5rem', fontWeight: 'bold' }}>{data.live.index}%</div>
          <div style={{ fontSize: '0.9rem', color: '#aaa' }}>{data.live.verdict}</div>
        </div>
        
        <div style={{ border: '1px solid #0f0', padding: '20px' }}>
          <div style={{ fontSize: '0.7rem', marginBottom: '10px' }}>&gt; RECENT_SIGNALS:</div>
          {data.signals.map((s, i) => (
            <div key={i} style={{ fontSize: '0.7rem', marginBottom: '5px', opacity: 0.8 }}>- {s}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

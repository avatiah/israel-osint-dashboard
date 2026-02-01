import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);
  const [mode, setMode] = useState('live'); 

  useEffect(() => {
    const load = () => fetch('/api/data').then(r => r.json()).then(d => { if (d && d.live) setData(d); });
    load();
    const int = setInterval(load, 45000);
    return () => clearInterval(int);
  }, []);

  if (!data) return <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace'}}>&gt; RELOADING_STRATEGIC_INTERFACE...</div>;

  return (
    <div style={{ background: '#000', color: '#0f0', minHeight: '100vh', fontFamily: 'monospace', padding: '20px' }}>
      {/* HEADER */}
      <header style={{ border: '1px solid #0f0', padding: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.1rem', letterSpacing: '2px' }}>OSINT_COMMAND_V9</h1>
          <div style={{ fontSize: '0.6rem', opacity: 0.6 }}>STRATEGIC_SURVEILLANCE_SYSTEM</div>
        </div>
        <div style={{ display: 'flex', border: '1px solid #0f0' }}>
          <button onClick={() => setMode('live')} style={{ background: mode === 'live' ? '#0f0' : '#000', color: mode === 'live' ? '#000' : '#0f0', border: 'none', padding: '8px 15px', cursor: 'pointer', fontFamily: 'monospace' }}>LIVE_VIEW</button>
          <button onClick={() => setMode('forecast')} style={{ background: mode === 'forecast' ? '#0f0' : '#000', color: mode === 'forecast' ? '#000' : '#0f0', border: 'none', padding: '8px 15px', cursor: 'pointer', fontFamily: 'monospace' }}>24H_FORECAST</button>
        </div>
      </header>

      {/* MAIN CONTENT GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '20px', marginBottom: '20px' }}>
        
        {/* TOTAL SCORE BLOCK */}
        <div style={{ border: '1px solid #0f0', padding: '25px', textAlign: 'center', background: '#050505' }}>
          <div style={{ fontSize: '0.7rem', opacity: 0.6, marginBottom: '10px' }}>{mode.toUpperCase()}_ISRAEL_THREAT_INDEX</div>
          <div style={{ fontSize: '5rem', fontWeight: 'bold', color: data[mode].index > 70 ? '#f00' : '#0f0' }}>{data[mode].index}%</div>
          <div style={{ fontSize: '0.8rem', border: '1px solid #333', padding: '5px', marginTop: '10px' }}>STATUS: {data[mode].verdict}</div>
        </div>

        {/* BREAKDOWN FACTORS */}
        <div style={{ border: '1px solid #0f0', padding: '20px' }}>
          <div style={{ fontSize: '0.7rem', borderBottom: '1px solid #0f0', paddingBottom: '10px', marginBottom: '20px' }}>DYNAMIC_FACTORS_DETECTION</div>
          {data.live.breakdown.map((f, i) => (
            <div key={i} style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span>{f.name}</span>
                <span>{f.value}%</span>
              </div>
              <div style={{ height: '4px', background: '#111', width: '100%', marginTop: '5px' }}>
                <div style={{ height: '100%', background: '#0f0', width: `${(f.value / 40) * 100}%` }}></div>
              </div>
              <div style={{ fontSize: '0.55rem', opacity: 0.5, marginTop: '3px' }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* EXPERT ARGUMENT BLOCK */}
      <div style={{ border: '1px solid #0f0', padding: '15px', background: '#0a0a00', borderLeft: '4px solid #ffae00', marginBottom: '20px' }}>
        <div style={{ fontSize: '0.7rem', color: '#ffae00', fontWeight: 'bold', marginBottom: '5px' }}>&gt; CORE_STRATEGIC_ARGUMENT (LATEST)</div>
        <div style={{ fontSize: '0.95rem', lineHeight: '1.4', fontStyle: 'italic' }}>"{data.key_argument}"</div>
      </div>

      {/* U.S. vs IRAN SPECIAL BLOCK */}
      <div style={{ border: '2px solid #f00', background: '#100', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ width: '65%' }}>
            <div style={{ fontSize: '0.7rem', color: '#f00', fontWeight: 'bold' }}>EXTERNAL_THEATER: U.S. VS IRAN</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginTop: '5px' }}>KINETIC_STRIKE_PROBABILITY: {data.iran_strike.index}%</div>
            <div style={{ fontSize: '0.65rem', opacity: 0.7, marginTop: '5px', color: '#fff' }}>{data.iran_strike.desc}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.6rem', opacity: 0.5 }}>DEFCON_EQUIVALENT</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#f00' }}>{data.iran_strike.status}</div>
          </div>
        </div>
        <div style={{ height: '8px', background: '#200', marginTop: '15px', border: '1px solid #f00' }}>
          <div style={{ height: '100%', background: '#f00', width: `${data.iran_strike.index}%` }}></div>
        </div>
      </div>

      <footer style={{ marginTop: '20px', fontSize: '0.6rem', opacity: 0.3, textAlign: 'center' }}>
        SYSTEM_UPDATE: {new Date(data.last_update).toLocaleString()} // Awaiting next intelligence cycle.
      </footer>
    </div>
  );
}

import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);
  const [mode, setMode] = useState('live'); // 'live' или 'forecast'

  useEffect(() => {
    const load = () => fetch('/api/data').then(r => r.json()).then(d => setData(d));
    load();
    const int = setInterval(load, 45000);
    return () => clearInterval(int);
  }, []);

  if (!data) return <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace'}}>&gt; ACCESSING_INTEL_STREAM...</div>;

  const current = data[mode];

  return (
    <div style={{ background: '#000', color: '#0f0', minHeight: '100vh', fontFamily: 'monospace', padding: '20px' }}>
      <header style={{ border: '1px solid #0f0', padding: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.1rem', letterSpacing: '2px' }}>OSINT_COMMAND_V7</h1>
          <div style={{ fontSize: '0.6rem', opacity: 0.6 }}>STRATEGIC_INTELLIGENCE_INTERFACE</div>
        </div>
        
        {/* MODE SWITCHER */}
        <div style={{ display: 'flex', border: '1px solid #0f0', overflow: 'hidden' }}>
          <button 
            onClick={() => setMode('live')}
            style={{ background: mode === 'live' ? '#0f0' : '#000', color: mode === 'live' ? '#000' : '#0f0', border: 'none', padding: '10px 20px', cursor: 'pointer', fontFamily: 'monospace' }}
          >LIVE</button>
          <button 
            onClick={() => setMode('forecast')}
            style={{ background: mode === 'forecast' ? '#0f0' : '#000', color: mode === 'forecast' ? '#000' : '#0f0', border: 'none', padding: '10px 20px', cursor: 'pointer', fontFamily: 'monospace' }}
          >24H_FORECAST</button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '20px', marginBottom: '20px' }}>
        
        {/* TOTAL SCORE */}
        <div style={{ border: '1px solid #0f0', padding: '25px', textAlign: 'center', background: '#050505' }}>
          <div style={{ fontSize: '0.7rem', opacity: 0.6, marginBottom: '10px' }}>{mode === 'live' ? 'CURRENT_THREAT_INDEX' : 'PREDICTED_THREAT_INDEX'}</div>
          <div style={{ fontSize: '5rem', fontWeight: 'bold', color: current.index > 75 ? '#f00' : '#0f0' }}>{current.index}%</div>
          <div style={{ fontSize: '0.8rem', border: '1px solid #333', padding: '5px', marginTop: '10px', color: current.index > 75 ? '#f00' : '#0f0' }}>
            STATUS: {current.verdict}
          </div>
        </div>

        {/* BREAKDOWN */}
        <div style={{ border: '1px solid #0f0', padding: '20px' }}>
          <div style={{ fontSize: '0.7rem', borderBottom: '1px solid #0f0', paddingBottom: '10px', marginBottom: '20px' }}>{mode === 'live' ? 'REAL_TIME_FACTORS' : 'PROJECTION_FACTORS'}</div>
          {current.breakdown.map((f, i) => (
            <div key={i} style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '5px' }}>
                <span>{f.name}</span>
                <span style={{ color: f.value > 30 ? '#f00' : '#0f0' }}>{f.value}%</span>
              </div>
              <div style={{ height: '4px', background: '#111', width: '100%' }}>
                <div style={{ height: '100%', background: f.value > 30 ? '#f00' : '#0f0', width: `${(f.value / 40) * 100}%` }}></div>
              </div>
              <div style={{ fontSize: '0.6rem', opacity: 0.5, marginTop: '5px' }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* EXPERT ARGUMENT */}
      <div style={{ border: '1px solid #0f0', padding: '15px', background: '#0a0a00', borderLeft: '4px solid #ffae00' }}>
        <div style={{ fontSize: '0.7rem', color: '#ffae00', fontWeight: 'bold', marginBottom: '8px' }}>&gt; CORE_STRATEGIC_ARGUMENT</div>
        <div style={{ fontSize: '1rem', lineHeight: '1.4', fontStyle: 'italic' }}>
          "{data.key_argument}"
        </div>
      </div>
    </div>
  );
}

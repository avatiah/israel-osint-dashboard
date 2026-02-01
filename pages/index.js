import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);
  const [mode, setMode] = useState('live'); 

  useEffect(() => {
    const load = () => fetch('/api/data')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d && d.live) setData(d); });
    load();
    const int = setInterval(load, 45000);
    return () => clearInterval(int);
  }, []);

  // Защита от ошибки TypeError: проверяем наличие data и выбранного режима
  if (!data || !data[mode]) {
    return (
      <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace'}}>
        &gt; ESTABLISHING_STRATEGIC_LINK...
      </div>
    );
  }

  const current = data[mode];

  return (
    <div style={{ background: '#000', color: '#0f0', minHeight: '100vh', fontFamily: 'monospace', padding: '20px' }}>
      <header style={{ border: '1px solid #0f0', padding: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.1rem', letterSpacing: '2px' }}>OSINT_COMMAND_V7</h1>
          <div style={{ fontSize: '0.6rem', opacity: 0.6 }}>REAL_TIME_STRATEGIC_ANALYSIS</div>
        </div>
        
        <div style={{ display: 'flex', border: '1px solid #0f0' }}>
          <button 
            onClick={() => setMode('live')}
            style={{ background: mode === 'live' ? '#0f0' : '#000', color: mode === 'live' ? '#000' : '#0f0', border: 'none', padding: '8px 15px', cursor: 'pointer', fontFamily: 'monospace', fontSize: '0.7rem' }}
          >LIVE_VIEW</button>
          <button 
            onClick={() => setMode('forecast')}
            style={{ background: mode === 'forecast' ? '#0f0' : '#000', color: mode === 'forecast' ? '#000' : '#0f0', border: 'none', padding: '8px 15px', cursor: 'pointer', fontFamily: 'monospace', fontSize: '0.7rem' }}
          >24H_FORECAST</button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '20px', marginBottom: '20px' }}>
        <div style={{ border: '1px solid #0f0', padding: '25px', textAlign: 'center', background: '#050505' }}>
          <div style={{ fontSize: '0.7rem', opacity: 0.6, marginBottom: '10px' }}>{mode.toUpperCase()}_THREAT_INDEX</div>
          <div style={{ fontSize: '5rem', fontWeight: 'bold', color: current.index > 70 ? '#f00' : '#0f0' }}>{current.index}%</div>
          <div style={{ fontSize: '0.8rem', border: '1px solid #333', padding: '5px', marginTop: '10px', color: current.index > 70 ? '#f00' : '#0f0' }}>
            STATUS: {current.verdict}
          </div>
        </div>

        <div style={{ border: '1px solid #0f0', padding: '20px' }}>
          <div style={{ fontSize: '0.7rem', borderBottom: '1px solid #0f0', paddingBottom: '10px', marginBottom: '20px' }}>PRIMARY_DYNAMICS</div>
          {current.breakdown.map((f, i) => (
            <div key={i} style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '5px' }}>
                <span>{f.name}</span>
                <span>{f.value}%</span>
              </div>
              <div style={{ height: '4px', background: '#111', width: '100%' }}>
                <div style={{ height: '100%', background: current.index > 70 ? '#f00' : '#0f0', width: `${(f.value / 40) * 100}%` }}></div>
              </div>
              <div style={{ fontSize: '0.6rem', opacity: 0.5, marginTop: '5px' }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ border: '1px solid #0f0', padding: '15px', background: '#0a0a00', borderLeft: '4px solid #ffae00' }}>
        <div style={{ fontSize: '0.7rem', color: '#ffae00', fontWeight: 'bold', marginBottom: '8px' }}>&gt; CORE_STRATEGIC_ARGUMENT</div>
        <div style={{ fontSize: '0.9rem', lineHeight: '1.4', fontStyle: 'italic' }}>
          "{data.key_argument}"
        </div>
      </div>
    </div>
  );
}

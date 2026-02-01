import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);
  const [mode, setMode] = useState('live');

  useEffect(() => {
    const load = () => fetch('/api/data').then(r => r.json()).then(d => {
      if (d && d.live) {
        setData(d);
        if (d.iran_strike.index > 80) {
          const audio = new Audio('https://www.soundjay.com/buttons/beep-01a.mp3');
          audio.play().catch(() => {});
        }
      }
    });
    load();
    const int = setInterval(load, 45000);
    return () => clearInterval(int);
  }, []);

  if (!data) return <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace'}}>&gt; SYNCHRONIZING_OSINT_NODES...</div>;

  const isCritical = data.iran_strike.index > 80;

  return (
    <div style={{ 
      background: '#000', color: '#0f0', minHeight: '100vh', fontFamily: 'monospace', padding: '20px',
      animation: isCritical ? 'red-alert 1s infinite' : 'none'
    }}>
      <style jsx global>{` @keyframes red-alert { 0% { background: #000; } 50% { background: #200; } 100% { background: #000; } } `}</style>

      {/* HEADER */}
      <header style={{ border: '1px solid #0f0', padding: '15px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.1rem', letterSpacing: '2px' }}>OSINT_COMMAND_V10</h1>
          <div style={{ fontSize: '0.6rem', color: isCritical ? '#f00' : '#ffae00' }}>SYSTEM_STATUS: {isCritical ? '!!! ALERT_TRIGGER_ACTIVE !!!' : 'NOMINAL_MONITORING'}</div>
        </div>
        <div style={{ display: 'flex', border: '1px solid #0f0' }}>
          <button onClick={() => setMode('live')} style={{ background: mode === 'live' ? '#0f0' : '#000', color: mode === 'live' ? '#000' : '#0f0', border: 'none', padding: '8px 15px', cursor: 'pointer', fontSize: '0.7rem' }}>LIVE</button>
          <button onClick={() => setMode('forecast')} style={{ background: mode === 'forecast' ? '#0f0' : '#000', color: mode === 'forecast' ? '#000' : '#0f0', border: 'none', padding: '8px 15px', cursor: 'pointer', fontSize: '0.7rem' }}>24H_FORECAST</button>
        </div>
      </header>

      {/* METHODOLOGY BLOCK - ENGLISH ONLY */}
      <div style={{ border: '1px solid #333', padding: '10px', fontSize: '0.65rem', marginBottom: '15px', color: '#aaa', lineHeight: '1.4' }}>
        <b style={{color: '#0f0'}}>[MODEL_ARCHITECTURE]</b><br/>
        - <b>ISRAEL_THREAT_INDEX</b>: Monitors tactical local events (IDF, Border skirmishes, Gaza/Lebanon heat).<br/>
        - <b>U.S._VS_IRAN_INDEX</b>: Strategic probability of kinetic strikes between superpowers. <br/>
        - <b>24H_FORECAST</b>: A correlated projection where Israeli risk levels are scaled by the U.S.-Iran conflict probability.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '20px', marginBottom: '20px' }}>
        <div style={{ border: '1px solid #0f0', padding: '25px', textAlign: 'center', background: '#050505' }}>
          <div style={{ fontSize: '0.7rem', opacity: 0.6, marginBottom: '10px' }}>{mode.toUpperCase()}_ISRAEL_RISK_COEFFICIENT</div>
          <div style={{ fontSize: '5rem', fontWeight: 'bold', color: data[mode].index > 75 ? '#f00' : '#0f0' }}>{data[mode].index}%</div>
          <div style={{ fontSize: '0.8rem', border: '1px solid #333', padding: '5px', marginTop: '10px' }}>VERDICT: {data[mode].verdict}</div>
        </div>

        <div style={{ border: '1px solid #0f0', padding: '20px' }}>
          <div style={{ fontSize: '0.7rem', borderBottom: '1px solid #0f0', paddingBottom: '10px', marginBottom: '15px' }}>LIVE_DYNAMIC_FACTORS</div>
          {data.live.breakdown.map((f, i) => (
            <div key={i} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}><span>{f.name}</span><span>{f.value}%</span></div>
              <div style={{ height: '4px', background: '#111', width: '100%', marginTop: '5px' }}>
                <div style={{ height: '100%', background: '#0f0', width: `${(f.value / 40) * 100}%` }}></div>
              </div>
              <div style={{ fontSize: '0.55rem', opacity: 0.5, marginTop: '3px' }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* U.S. VS IRAN THEATER */}
      <div style={{ border: isCritical ? '3px solid #f00' : '2px solid #f00', background: isCritical ? '#300' : '#100', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#f00', fontWeight: 'bold' }}>EXTERNAL_THEATER: U.S. VS IRAN</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 'bold', marginTop: '5px' }}>STRIKE_PROBABILITY: {data.iran_strike.index}%</div>
            <div style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: '5px' }}>{data.iran_strike.desc}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.6rem', opacity: 0.6 }}>RISK_LEVEL</div>
            <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#f00' }}>{data.iran_strike.status}</div>
          </div>
        </div>
        <div style={{ height: '10px', background: '#200', marginTop: '15px', border: '1px solid #f00' }}>
          <div style={{ height: '100%', background: '#f00', width: `${data.iran_strike.index}%`, transition: 'width 2s' }}></div>
        </div>
      </div>
      
      <div style={{ marginTop: '20px', borderTop: '1px solid #111', padding: '15px', fontSize: '0.85rem', fontStyle: 'italic', opacity: 0.8 }}>
        <span style={{color: '#ffae00'}}>&gt; STRATEGIC_ARGUMENT:</span> "{data.key_argument}"
      </div>
    </div>
  );
}

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

  if (!data) return <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace'}}>&gt; INTERCEPTING_SIGNALS...</div>;

  const isCritical = data.iran_strike.index > 80;

  return (
    <div style={{ background: '#000', color: '#0f0', minHeight: '100vh', fontFamily: 'monospace', padding: '20px', animation: isCritical ? 'red-alert 1s infinite' : 'none' }}>
      <style jsx global>{` @keyframes red-alert { 0% { background: #000; } 50% { background: #200; } 100% { background: #000; } } `}</style>

      {/* HEADER & SWITCHER */}
      <header style={{ border: '1px solid #0f0', padding: '15px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '1rem', letterSpacing: '2px' }}>OSINT_COMMAND_V11</h1>
        <div style={{ display: 'flex', border: '1px solid #0f0' }}>
          {['live', 'forecast'].map(m => (
            <button key={m} onClick={() => setMode(m)} style={{ background: mode === m ? '#0f0' : '#000', color: mode === m ? '#000' : '#0f0', border: 'none', padding: '8px 15px', cursor: 'pointer', fontSize: '0.7rem' }}>{m.toUpperCase()}</button>
          ))}
        </div>
      </header>

      {/* CORE INDICES */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '20px', marginBottom: '20px' }}>
        <div style={{ border: '1px solid #0f0', padding: '25px', textAlign: 'center', background: '#050505' }}>
          <div style={{ fontSize: '0.7rem', opacity: 0.6, marginBottom: '10px' }}>{mode.toUpperCase()}_ISRAEL_RISK</div>
          <div style={{ fontSize: '5rem', fontWeight: 'bold', color: data[mode].index > 75 ? '#f00' : '#0f0' }}>{data[mode].index}%</div>
          <div style={{ fontSize: '0.75rem', border: '1px solid #333', padding: '5px', marginTop: '10px' }}>VERDICT: {data[mode].verdict}</div>
        </div>

        <div style={{ border: '1px solid #0f0', padding: '20px' }}>
          <div style={{ fontSize: '0.7rem', borderBottom: '1px solid #0f0', paddingBottom: '10px', marginBottom: '15px' }}>OSINT_METRICS</div>
          {data.live.breakdown.map((f, i) => (
            <div key={i} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem' }}><span>{f.name}</span><span>{f.value}%</span></div>
              <div style={{ height: '4px', background: '#111', width: '100%', marginTop: '5px' }}>
                <div style={{ height: '100%', background: '#0f0', width: `${(f.value / 40) * 100}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RECENT INTELLIGENCE TICKER */}
      <div style={{ border: '1px solid #0f0', padding: '15px', marginBottom: '20px', background: '#010' }}>
        <div style={{ fontSize: '0.65rem', color: '#0f0', marginBottom: '10px', fontWeight: 'bold' }}>&gt; RECENT_INTELLIGENCE_SIGNALS:</div>
        {data.signals.map((s, i) => (
          <div key={i} style={{ fontSize: '0.75rem', marginBottom: '5px', opacity: 0.85 }}>
            <span style={{ color: '#0f0' }}>[SIGNAL_{i+1}]</span> {s}
          </div>
        ))}
      </div>

      {/* US-IRAN THEATER */}
      <div style={{ border: isCritical ? '3px solid #f00' : '2px solid #f00', background: isCritical ? '#300' : '#100', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#f00', fontWeight: 'bold' }}>EXTERNAL_THEATER: U.S. VS IRAN</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>STRIKE_PROBABILITY: {data.iran_strike.index}%</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.9rem', color: '#f00', fontWeight: 'bold' }}>{data.iran_strike.status}</div>
        </div>
        <div style={{ height: '10px', background: '#200', marginTop: '15px', border: '1px solid #f00' }}>
          <div style={{ height: '100%', background: '#f00', width: `${data.iran_strike.index}%`, transition: 'width 2s' }}></div>
        </div>
      </div>
    </div>
  );
}

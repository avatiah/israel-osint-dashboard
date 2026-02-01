import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);
  const [mode, setMode] = useState('live');

  useEffect(() => {
    const load = () => {
      // Timestamp bypasses browser and Vercel CDN cache
      fetch(`/api/data?t=${Date.now()}`, { cache: 'no-store' })
        .then(r => r.json())
        .then(d => { if (d && d.live) setData(d); });
    };
    load();
    const int = setInterval(load, 45000);
    return () => clearInterval(int);
  }, []);

  if (!data) return <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace'}}>&gt; BYPASSING_CACHE_FOR_CALIBRATION...</div>;

  const isCritical = data.iran_strike.index > 85;

  return (
    <div style={{ background: '#000', color: '#0f0', minHeight: '100vh', fontFamily: 'monospace', padding: '20px', animation: isCritical ? 'red-alert 1s infinite' : 'none' }}>
      <style jsx global>{` @keyframes red-alert { 0% { background: #000; } 50% { background: #1a0000; } 100% { background: #000; } } `}</style>

      {/* HEADER */}
      <header style={{ border: '1px solid #0f0', padding: '15px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1rem', letterSpacing: '2px' }}>OSINT_COMMAND_V12</h1>
          <div style={{ fontSize: '0.6rem', color: '#ffae00' }}>DATA_REFRESH: {new Date(data.last_update).toLocaleTimeString()}</div>
        </div>
        <div style={{ display: 'flex', border: '1px solid #0f0' }}>
          <button onClick={() => setMode('live')} style={{ background: mode === 'live' ? '#0f0' : '#000', color: mode === 'live' ? '#000' : '#0f0', border: 'none', padding: '8px 15px', cursor: 'pointer', fontSize: '0.7rem' }}>LIVE</button>
          <button onClick={() => setMode('forecast')} style={{ background: mode === 'forecast' ? '#0f0' : '#000', color: mode === 'forecast' ? '#000' : '#0f0', border: 'none', padding: '8px 15px', cursor: 'pointer', fontSize: '0.7rem' }}>24H_FORECAST</button>
        </div>
      </header>

      {/* LOGIC INFO */}
      <div style={{ border: '1px solid #222', padding: '10px', fontSize: '0.6rem', marginBottom: '15px', color: '#888' }}>
        [LOGIC] Index is now weighted towards ground-level de-escalation (Rafah re-opening) rather than strategic rhetoric. Baseline calibrated to 12%.
      </div>

      {/* MAIN INDICES */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '20px', marginBottom: '20px' }}>
        <div style={{ border: '1px solid #0f0', padding: '25px', textAlign: 'center', background: '#050505' }}>
          <div style={{ fontSize: '0.7rem', opacity: 0.6, marginBottom: '10px' }}>{mode.toUpperCase()}_THREAT_LEVEL</div>
          <div style={{ fontSize: '5rem', fontWeight: 'bold', color: data[mode].index > 65 ? '#f00' : '#0f0' }}>{data[mode].index}%</div>
          <div style={{ fontSize: '0.8rem', border: '1px solid #333', padding: '5px', marginTop: '10px' }}>{data[mode].verdict}</div>
        </div>

        <div style={{ border: '1px solid #0f0', padding: '20px' }}>
          <div style={{ fontSize: '0.7rem', borderBottom: '1px solid #0f0', paddingBottom: '10px', marginBottom: '15px' }}>WEIGHT_DISTRIBUTION</div>
          {data.live.breakdown.map((f, i) => (
            <div key={i} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem' }}><span>{f.name}</span><span>{f.value}%</span></div>
              <div style={{ height: '4px', background: '#111', width: '100%', marginTop: '5px' }}>
                <div style={{ height: '100%', background: '#0f0', width: `${f.value}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SIGNALS TICKER */}
      <div style={{ border: '1px solid #0f0', padding: '15px', marginBottom: '20px', background: '#010' }}>
        <div style={{ fontSize: '0.6rem', color: '#0f0', marginBottom: '10px' }}>&gt; DETECTED_SIGNALS:</div>
        {data.signals.map((s, i) => (
          <div key={i} style={{ fontSize: '0.7rem', marginBottom: '4px', opacity: 0.8 }}>- {s}</div>
        ))}
      </div>

      {/* STRATEGIC OVERLAY (USA-IRAN) */}
      <div style={{ border: '2px solid #f00', background: isCritical ? '#300' : '#100', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.6rem', color: '#f00', fontWeight: 'bold' }}>EXTERNAL_THEATER: U.S. VS IRAN</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>STRIKE_PROBABILITY: {data.iran_strike.index}%</div>
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#f00' }}>{data.iran_strike.status}</div>
        </div>
        <div style={{ height: '8px', background: '#200', marginTop: '10px', border: '1px solid #f00' }}>
          <div style={{ height: '100%', background: '#f00', width: `${data.iran_strike.index}%` }}></div>
        </div>
      </div>
    </div>
  );
}

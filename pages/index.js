import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);
  const [mode, setMode] = useState('live');

  useEffect(() => {
    const load = () => fetch('/api/data').then(r => r.json()).then(d => {
      if (d && d.live) {
        setData(d);
        // Звуковой сигнал при алерте > 80%
        if (d.iran_strike.index > 80) {
          const audio = new Audio('https://www.soundjay.com/buttons/beep-01a.mp3');
          audio.play().catch(() => {}); // Игнорируем блокировку автоплея браузером
        }
      }
    });
    load();
    const int = setInterval(load, 45000);
    return () => clearInterval(int);
  }, []);

  if (!data) return <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace'}}>&gt; CALIBRATING_SYSTEM_V9...</div>;

  const isCritical = data.iran_strike.index > 80;

  return (
    <div style={{ 
      background: '#000', color: '#0f0', minHeight: '100vh', fontFamily: 'monospace', padding: '20px',
      animation: isCritical ? 'red-alert 1s infinite' : 'none'
    }}>
      <style jsx global>{`
        @keyframes red-alert { 0% { background: #000; } 50% { background: #200; } 100% { background: #000; } }
      `}</style>

      {/* HEADER */}
      <header style={{ border: '1px solid #0f0', padding: '15px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.1rem', letterSpacing: '2px' }}>OSINT_COMMAND_CENTER</h1>
          <div style={{ fontSize: '0.6rem', color: '#ffae00' }}>SYSTEM_STATUS: {isCritical ? '!!! ALERT_TRIGGER_ACTIVE !!!' : 'NOMINAL'}</div>
        </div>
        <div style={{ display: 'flex', border: '1px solid #0f0' }}>
          <button onClick={() => setMode('live')} style={{ background: mode === 'live' ? '#0f0' : '#000', color: mode === 'live' ? '#000' : '#0f0', border: 'none', padding: '8px 15px', cursor: 'pointer' }}>LIVE</button>
          <button onClick={() => setMode('forecast')} style={{ background: mode === 'forecast' ? '#0f0' : '#000', color: mode === 'forecast' ? '#000' : '#0f0', border: 'none', padding: '8px 15px', cursor: 'pointer' }}>24H_FORECAST</button>
        </div>
      </header>

      {/* METHODOLOGY NOTE */}
      <div style={{ border: '1px solid #333', padding: '10px', fontSize: '0.6rem', marginBottom: '15px', color: '#888' }}>
        <span style={{color:'#0f0'}}>[INFO]</span> Эти индексы работают независимо: <br/>
        - <b>ISRAEL_THREAT</b>: тактическая обстановка (ЦАХАЛ, Ливан, Газа). <br/>
        - <b>U.S._VS_IRAN</b>: стратегическая вероятность прямого столкновения сверхдержав.
      </div>

      {/* GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '20px', marginBottom: '20px' }}>
        <div style={{ border: '1px solid #0f0', padding: '25px', textAlign: 'center', background: '#050505' }}>
          <div style={{ fontSize: '0.7rem', opacity: 0.6, marginBottom: '10px' }}>{mode.toUpperCase()}_ISRAEL_INDEX</div>
          <div style={{ fontSize: '5rem', fontWeight: 'bold', color: data[mode].index > 75 ? '#f00' : '#0f0' }}>{data[mode].index}%</div>
          <div style={{ fontSize: '0.8rem', border: '1px solid #333', padding: '5px', marginTop: '10px' }}>STATUS: {data[mode].verdict}</div>
        </div>

        <div style={{ border: '1px solid #0f0', padding: '20px' }}>
          <div style={{ fontSize: '0.7rem', borderBottom: '1px solid #0f0', paddingBottom: '10px', marginBottom: '15px' }}>DYNAMICS</div>
          {data.live.breakdown.map((f, i) => (
            <div key={i} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}><span>{f.name}</span><span>{f.value}%</span></div>
              <div style={{ height: '4px', background: '#111', width: '100%', marginTop: '5px' }}>
                <div style={{ height: '100%', background: '#0f0', width: `${(f.value / 40) * 100}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* U.S. VS IRAN - HIGHLIGHTED */}
      <div style={{ border: isCritical ? '3px solid #f00' : '2px solid #f00', background: isCritical ? '#300' : '#100', padding: '20px' }}>
        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#f00' }}>KINETIC_STRIKE_PROBABILITY: {data.iran_strike.index}%</div>
        <div style={{ fontSize: '0.7rem', marginTop: '5px', opacity: 0.8 }}>U.S. PREEMPTIVE ACTION AGAINST IRANIAN ASSETS</div>
        <div style={{ height: '10px', background: '#200', marginTop: '15px', border: '1px solid #f00' }}>
          <div style={{ height: '100%', background: '#f00', width: `${data.iran_strike.index}%` }}></div>
        </div>
        {isCritical && <div style={{ color: '#f00', fontSize: '1rem', fontWeight: 'bold', marginTop: '10px', textAlign: 'center' }}>!!! IMMINENT_WAR_ALERT !!!</div>}
      </div>
    </div>
  );
}

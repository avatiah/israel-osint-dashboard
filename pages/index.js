import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = () => fetch('/api/data').then(r => r.ok ? r.json() : null).then(d => d && setData(d));
    load();
    const int = setInterval(load, 60000);
    return () => clearInterval(int);
  }, []);

  if (!data) return <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace'}}>&gt; ANALYZING_THREAT_FACTORS...</div>;

  const getStatusDesc = (idx) => {
    if (idx < 30) return "STABLE / ROUTINE";
    if (idx < 60) return "ELEVATED / MONITORING";
    if (idx < 85) return "HIGH_TENSION / ALERT";
    return "CRITICAL / ACTIVE_CONFLICT";
  };

  return (
    <div style={{ background: '#000', color: '#0f0', minHeight: '100vh', fontFamily: 'monospace', padding: '10px' }}>
      <header style={{ border: '1px solid #0f0', padding: '10px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems:'center' }}>
        <span style={{fontWeight:'bold'}}>THREAT_ENGINE_ISR</span>
        <div style={{textAlign:'right'}}>
           <div style={{fontSize:'0.8rem', color: data.index > 60 ? '#f00' : '#0f0'}}>{getStatusDesc(data.index)}</div>
           <div style={{fontSize:'0.6rem', opacity:0.6}}>UPLINK_STABLE: {new Date(data.last_update).toLocaleTimeString()}</div>
        </div>
      </header>

      <div className="container">
        <aside className="stats">
          {/* INDEX & BREAKDOWN */}
          <div style={{ border: '1px solid #0f0', padding: '15px', marginBottom: '10px' }}>
            <div style={{fontSize:'0.6rem', opacity:0.6, textAlign:'center'}}>AGGREGATED_TENSION</div>
            <div style={{fontSize:'3.5rem', fontWeight:'bold', textAlign:'center', color: data.index > 70 ? '#f00' : '#0f0'}}>{data.index}%</div>
            
            <div style={{marginTop:'10px', borderTop:'1px solid #111', paddingTop:'10px', fontSize:'0.65rem'}}>
              <div style={{display:'flex', justifyContent:'space-between'}}><span>BASE_LOAD:</span><span>{data.breakdown?.base}%</span></div>
              <div style={{display:'flex', justifyContent:'space-between'}}><span>GEO_SPREAD:</span><span>+{data.breakdown?.geo}%</span></div>
              <div style={{display:'flex', justifyContent:'space-between'}}><span>KINETIC_EVENTS:</span><span>+{data.breakdown?.events}%</span></div>
            </div>
          </div>

          {/* MAP */}
          <div style={{ border: '1px solid #0f0', padding: '10px', textAlign: 'center' }}>
            <svg viewBox="0 0 100 200" style={{ width: '100%', maxHeight: '220px' }}>
              <path d="M40,10 L60,10 L65,30 L35,35 Z" fill={data.geo?.north ? '#f00' : '#111'} stroke="#0f0" strokeWidth="0.5" className={data.geo?.north ? 'pulse' : ''} />
              <path d="M35,35 L65,30 L60,70 L30,75 Z" fill={data.geo?.center ? '#f00' : '#111'} stroke="#0f0" strokeWidth="0.5" className={data.geo?.center ? 'pulse' : ''} />
              <path d="M50,45 L65,45 L65,85 L50,90 Z" fill={data.geo?.westbank ? '#f00' : '#111'} stroke="#0f0" strokeWidth="0.5" className={data.geo?.westbank ? 'pulse' : ''} />
              <path d="M25,80 L35,80 L35,95 L25,100 Z" fill={data.geo?.gaza ? '#f00' : '#111'} stroke="#0f0" strokeWidth="0.5" className={data.geo?.gaza ? 'pulse' : ''} />
              <path d="M30,75 L60,70 L55,180 L20,130 Z" fill={data.geo?.south ? '#f00' : '#111'} stroke="#0f0" strokeWidth="0.5" className={data.geo?.south ? 'pulse' : ''} />
            </svg>
          </div>
        </aside>

        <main className="log">
          <div style={{ border: '1px solid #0f0', padding: '10px', height: '100%' }}>
            <div style={{borderBottom:'1px solid #0f0', paddingBottom:'5px', marginBottom:'10px', fontSize:'0.7rem'}}>&gt; REAL_TIME_SIGNAL_LOG</div>
            {data.signals?.map((s, i) => (
              <div key={i} style={{ marginBottom: '10px', borderBottom: '1px solid #111', paddingBottom: '5px' }}>
                <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.6rem'}}>
                  <span style={{color: s.color}}>[{s.importance}]</span>
                  <span style={{opacity:0.5}}>{s.timestamp}</span>
                </div>
                <div style={{fontSize:'0.85rem', marginTop:'3px', lineHeight:'1.2'}}>{s.title}</div>
              </div>
            ))}
          </div>
        </main>
      </div>

      <style jsx global>{`
        .container { display: flex; flex-direction: column; gap: 10px; }
        @media (min-width: 768px) { .container { flex-direction: row; } .stats { width: 260px; } .log { flex-grow: 1; } }
        .pulse { animation: p 1.5s infinite; }
        @keyframes p { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }
        body { background: #000; margin: 0; }
      `}</style>
    </div>
  );
}

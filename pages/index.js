import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = () => fetch('/api/data').then(r => r.json()).then(d => setData(d));
    load();
    const int = setInterval(load, 30000);
    return () => clearInterval(int);
  }, []);

  if (!data) return <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace'}}>&gt; DATA_RECONSTRUCTION_IN_PROGRESS...</div>;

  return (
    <div style={{ background: '#000', color: '#0f0', minHeight: '100vh', fontFamily: 'monospace', padding: '15px' }}>
      
      {/* HEADER */}
      <header style={{ border: '1px solid #0f0', padding: '15px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '1.1rem', letterSpacing: '2px' }}>ISRAEL_THREAT_ENGINE_V4</div>
          <div style={{ fontSize: '0.6rem', opacity: 0.7 }}>PRO_INTELLIGENCE_DASHBOARD // NO_GRAPHICS_MODE</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.6rem' }}>LAST_UPLINK</div>
          <div>{new Date(data.last_update).toLocaleTimeString()}</div>
        </div>
      </header>

      <div className="main-layout">
        {/* SIDEBAR: NUMBERS */}
        <aside className="sidebar">
          <div style={{ border: '1px solid #0f0', padding: '20px', textAlign: 'center', marginBottom: '15px' }}>
            <div style={{ fontSize: '0.7rem', marginBottom: '5px', opacity: 0.6 }}>STRATEGIC_INDEX</div>
            <div style={{ fontSize: '4rem', fontWeight: 'bold', color: data.index > 70 ? '#f00' : '#0f0' }}>{data.index}%</div>
            <div style={{ fontSize: '0.8rem', marginTop: '5px' }}>
              {data.index > 75 ? '![CRITICAL_THREAT]' : data.index > 45 ? '![ELEVATED_RISK]' : '![STABLE_MONITORING]'}
            </div>
          </div>

          <div style={{ border: '1px solid #0f0', padding: '15px' }}>
            <div style={{ fontSize: '0.7rem', borderBottom: '1px solid #0f0', paddingBottom: '5px', marginBottom: '10px' }}>DETECTION_FACTORS</div>
            <div className="factor"><span>VOLATILITY:</span> <span>{data.factors.volatility}%</span></div>
            <div className="factor"><span>SENTIMENT:</span> <span>{data.factors.sentiment} pts</span></div>
            <div className="factor"><span>INTEL_NODES:</span> <span>{data.factors.intel_nodes}</span></div>
            
            <div style={{ marginTop: '20px', fontSize: '0.55rem', opacity: 0.5, lineHeight: '1.4' }}>
              * VOLATILITY: Скорость обновления данных.<br/>
              * SENTIMENT: Смысловой вес угроз в тексте.<br/>
              * INTEL_NODES: Кол-во экспертных источников.
            </div>
          </div>
        </aside>

        {/* MAIN: FEED */}
        <main className="feed">
          <div style={{ border: '1px solid #0f0', padding: '15px', height: '100%' }}>
            <div style={{ fontSize: '0.7rem', borderBottom: '1px solid #0f0', paddingBottom: '10px', marginBottom: '15px' }}>&gt; RAW_INTELLIGENCE_LOG</div>
            {data.signals?.map((s, i) => (
              <div key={i} style={{ marginBottom: '15px', borderBottom: '1px solid #111', paddingBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', marginBottom: '4px' }}>
                  <span style={{ color: s.color, fontWeight: 'bold' }}>[{s.importance}]</span>
                  <span style={{ opacity: 0.5 }}>{s.time}</span>
                </div>
                <div style={{ fontSize: '0.9rem', lineHeight: '1.3' }}>{s.title}</div>
              </div>
            ))}
          </div>
        </main>
      </div>

      <style jsx>{`
        .main-layout { display: flex; gap: 15px; }
        .sidebar { width: 280px; flex-shrink: 0; }
        .feed { flex-grow: 1; }
        .factor { display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 8px; }
        @media (max-width: 850px) {
          .main-layout { flex-direction: column; }
          .sidebar { width: 100%; }
        }
      `}</style>
      <style jsx global>{` body { background: #000; margin: 0; } `}</style>
    </div>
  );
}

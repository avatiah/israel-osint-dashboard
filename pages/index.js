import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = () => fetch(`/api/data?t=${Date.now()}`).then(r => r.json()).then(d => setData(d));
    load();
    const int = setInterval(load, 45000);
    return () => clearInterval(int);
  }, []);

  if (!data) return <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace'}}>RECALIBRATING MODEL V27...</div>;

  const color = data.index > 70 ? '#f00' : data.index > 40 ? '#f90' : '#0f0';

  return (
    <div style={{ background: '#000', color: '#ccc', minHeight: '100vh', fontFamily: 'monospace', padding: '15px', fontSize: '11px' }}>
      
      <header style={{ borderBottom: `2px solid ${color}`, paddingBottom: '10px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ margin: 0, color: '#fff' }}>MADAD OREF // PRECISION OSINT</h2>
          <div style={{ fontSize: '0.6rem', opacity: 0.6 }}>HORIZON: {data.horizon} // LAST_SYNC: {new Date(data.updated).toLocaleTimeString()}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: color, fontSize: '1.4rem', fontWeight: 'bold' }}>{data.index}%</div>
        </div>
      </header>

      <div className="layout">
        {/* RADAR */}
        <div className="card center">
          <div className="radar" style={{borderColor: color}}>
            <div className="sweep"></div>
            <div className="val" style={{color: color}}>{data.index}%</div>
          </div>
          <div style={{marginTop: '15px', fontSize: '0.6rem'}}>INDEX LEVEL: {data.index > 60 ? 'CRITICAL' : 'ELEVATED'}</div>
        </div>

        {/* RATIONALE & METHODOLOGY */}
        <div className="card">
          <div style={{color: '#fff', fontWeight: 'bold', marginBottom: '10px'}}>&gt; CALCULATION RATIONALE</div>
          <div className="method-list">
            {data.methodology.map((m, i) => (
              <div key={i} style={{fontSize: '0.65rem', marginBottom: '4px', color: m.includes('-') ? '#0f0' : '#f66'}}>[STAT] {m}</div>
            ))}
          </div>
          <p style={{fontSize: '0.6rem', marginTop: '10px', opacity: 0.5}}>* Current market stability (Oil/ILS) is suppressing the escalation index.</p>
        </div>

        {/* MARKETS */}
        <div className="card full market-line">
          <span>BRENT CRUDE: <b style={{color:'#fff'}}>{data.markets.brent}</b></span>
          <span>USD/ILS: <b style={{color:'#fff'}}>{data.markets.ils}</b></span>
          <span>POLYMARKET (JUNE): <b style={{color:'#fff'}}>{data.markets.poly}</b></span>
        </div>

        {/* EXPERT INTELLIGENCE */}
        <div className="card full">
          <div style={{color: '#f90', fontSize: '0.7rem', marginBottom: '10px', fontWeight: 'bold'}}>&gt; VERIFIED EXPERT ANALYTICS (ISW / IISS)</div>
          {data.experts.map((e, i) => (
            <div key={i} style={{marginBottom: '8px', fontSize: '0.65rem'}}>
              <span style={{color: '#fff', background: '#222', padding: '1px 4px', marginRight: '5px'}}>{e.org}</span> {e.text}
            </div>
          ))}
        </div>

        {/* LOGS */}
        <div className="card full">
          <div style={{fontSize: '0.7rem', color: color, marginBottom: '10px', fontWeight: 'bold'}}>&gt; SIGNAL_FEED:</div>
          {data.logs.map((l, i) => (
            <div key={i} style={{fontSize: '0.65rem', padding: '4px 0', borderBottom: '1px solid #111', opacity: 0.7}}>
              [{i+1}] {l}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .layout { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .card { border: 1px solid #222; padding: 15px; background: #050505; }
        .full { grid-column: span 2; }
        .center { text-align: center; }
        .market-line { display: flex; justify-content: space-around; font-size: 0.7rem; }
        .radar { width: 100px; height: 100px; border: 2px solid #030; border-radius: 50%; margin: 0 auto; position: relative; overflow: hidden; }
        .sweep { position: absolute; width: 100%; height: 100%; background: conic-gradient(from 0deg, rgba(0,255,0,0.1) 0deg, transparent 90deg); animation: rot 4s linear infinite; }
        .val { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 1.6rem; font-weight: bold; }
        @keyframes rot { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 600px) { .layout { grid-template-columns: 1fr; } .full { grid-column: span 1; } .market-line { flex-direction: column; gap: 10px; } }
      `}</style>
    </div>
  );
}

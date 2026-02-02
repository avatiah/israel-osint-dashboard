import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = () => fetch(`/api/data?t=${Date.now()}`).then(r => r.json()).then(d => setData(d));
    load();
    const int = setInterval(load, 60000);
    return () => clearInterval(int);
  }, []);

  if (!data) return <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace'}}>MADAD OREF: LOADING...</div>;

  const color = data.index > 70 ? '#f00' : data.index > 40 ? '#f90' : '#0f0';

  return (
    <div style={{ background: '#000', color: '#ccc', minHeight: '100vh', fontFamily: 'monospace', padding: '15px' }}>
      
      {/* HEADER */}
      <header style={{ borderBottom: `2px solid ${color}`, paddingBottom: '10px', marginBottom: '20px' }}>
        <h1 style={{ margin: 0, color: '#fff', fontSize: '1.4rem' }}>MADAD OREF</h1>
        <div style={{ fontSize: '0.6rem', opacity: 0.6 }}>ISRAEL GENERAL THREAT INDEX // MOBILE_V17</div>
      </header>

      <div className="main-grid">
        
        {/* RADAR BLOCK */}
        <div className="card shadow-green">
          <div className="radar" style={{borderColor: color}}>
            <div className="sweep" style={{background: `conic-gradient(from 0deg, ${color}33 0deg, transparent 90deg)`}}></div>
            <div className="val" style={{color: color}}>{data.index}%</div>
          </div>
          <div style={{textAlign:'center', marginTop:'15px', color:color, fontSize:'0.8rem'}}>THREAT_LEVEL: {data.index > 40 ? 'ELEVATED' : 'STABILIZED'}</div>
        </div>

        {/* CALCULATION MATRIX */}
        <div className="card">
          <div style={{fontSize:'0.7rem', color:color, marginBottom:'10px'}}>&gt; CALCULATION_MATRIX</div>
          {data.matrix.map((m, i) => (
            <div key={i} style={{display:'flex', justifyContent:'space-between', fontSize:'0.7rem', padding:'8px 0', borderBottom:'1px solid #111'}}>
              <span>{m.label} ({m.count} signals)</span>
              <span style={{color:'#fff'}}>+{m.impact} pts</span>
            </div>
          ))}
          <div style={{fontSize:'0.6rem', marginTop:'10px', opacity:0.5}}>* Index = (Points) / 4.5 [Normalization]</div>
        </div>

        {/* SIGNALS LOG */}
        <div className="card full-width">
          <div style={{fontSize:'0.7rem', color:color, marginBottom:'10px'}}>&gt; REAL_TIME_SIGNALS</div>
          {data.logs.map((l, i) => (
            <div key={i} style={{fontSize:'0.65rem', marginBottom:'8px', borderLeft:`2px solid ${color}`, paddingLeft:'8px', lineHeight:'1.2'}}>
              <span style={{opacity:0.5}}>[{l.s}]</span> {l.t}
            </div>
          ))}
        </div>
      </div>

      <footer style={{marginTop:'30px', fontSize:'0.6rem', color:'#444', textAlign:'center'}}>
        Sources: Google News OSINT / US Navy / PMO Israel <br/>
        Updated: {new Date(data.updated).toLocaleTimeString()}
      </footer>

      <style jsx>{`
        .main-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .card { border: 1px solid #222; padding: 15px; background: #050505; }
        .full-width { grid-column: span 2; }
        .radar { width: 140px; height: 140px; border: 2px solid #030; border-radius: 50%; margin: 0 auto; position: relative; overflow: hidden; background: radial-gradient(circle, #010 0%, #000 70%); }
        .sweep { position: absolute; width: 100%; height: 100%; animation: r 4s linear infinite; }
        .val { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 2rem; font-weight: bold; }
        @keyframes r { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        @media (max-width: 600px) {
          .main-grid { grid-template-columns: 1fr; }
          .full-width { grid-column: span 1; }
        }
      `}</style>
    </div>
  );
}

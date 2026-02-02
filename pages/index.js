import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = () => fetch(`/api/data?t=${Date.now()}`).then(r => r.json()).then(d => setData(d));
    load();
    const int = setInterval(load, 30000);
    return () => clearInterval(int);
  }, []);

  if (!data) return <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace'}}>V28_BOOT_SEQUENCE...</div>;

  const getStatus = (v) => {
    if (v < 30) return { t: "NOTHING EVER HAPPENS", c: "#0f0" };
    if (v < 65) return { t: "SOMETHING MIGHT HAPPEN", c: "#f90" };
    if (v < 90) return { t: "SOMETHING IS HAPPENING", c: "#f60" };
    return { t: "IT HAPPENED", c: "#f00" };
  };

  const status = getStatus(data.index);

  return (
    <div style={{ background: '#000', color: '#ccc', minHeight: '100vh', fontFamily: 'monospace', padding: '15px', fontSize: '11px' }}>
      
      <header style={{ borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ margin: 0, color: '#fff', fontSize: '1.5rem', letterSpacing: '2px' }}>MADAD OREF</h1>
          <div style={{ fontSize: '0.6rem', opacity: 0.5 }}>STRATEGIC THREAT ANALYTICS // V28_COMMAND</div>
        </div>
        <div style={{ textAlign: 'right', color: status.c }}>
          <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>INDEX: {data.index}%</div>
          <div style={{ fontSize: '0.5rem' }}>02 FEB 2026 // {new Date().toLocaleTimeString()}</div>
        </div>
      </header>

      <div className="grid">
        {/* НОВЫЙ ИНДИКАТОР-ПОЛУСФЕРА */}
        <div className="card center" style={{gridColumn: 'span 1'}}>
           <div className="gauge-container">
              <div className="gauge-arc"></div>
              <div className="gauge-needle" style={{ transform: `rotate(${(data.index / 100) * 180 - 90}deg)` }}></div>
              <div className="gauge-center">
                <div style={{fontSize: '1.5rem', color: status.c}}>{data.index}</div>
                <div style={{fontSize: '0.5rem', opacity: 0.7}}>LEVEL: {status.t}</div>
              </div>
           </div>
        </div>

        {/* EXTERNAL: U.S. VS IRAN */}
        <div className="card">
          <div style={{color: '#f00', borderBottom: '1px solid #300', paddingBottom: '5px', marginBottom: '10px'}}>
            EXTERNAL: U.S. VS IRAN // {data.us_iran.val}%
          </div>
          <div style={{fontSize: '0.65rem', color: '#888', marginBottom: '10px'}}>{data.us_iran.rationale}</div>
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem'}}>
            <span style={{opacity: 0.5}}>POLYMARKET (JUNE 30):</span>
            <span style={{color: '#fff'}}>{data.markets.poly}</span>
          </div>
        </div>

        {/* MARKET BAR */}
        <div className="card full market-bar">
          <div className="m-item">BRENT OIL: <b>{data.markets.brent}</b></div>
          <div className="m-item">USD/ILS: <b>{data.markets.ils}</b></div>
          <div className="m-item">SENTIMENT: <b style={{color: status.c}}>{data.index > 50 ? 'RISK_OFF' : 'STABLE'}</b></div>
        </div>

        {/* EXPERT ANALYTICS */}
        <div className="card full">
          <div style={{color: '#f90', fontSize: '0.7rem', marginBottom: '10px'}}>&gt; VERIFIED_EXPERT_COMMUNITY (ISW / IISS)</div>
          {data.experts.map((e, i) => (
            <div key={i} style={{fontSize: '0.65rem', marginBottom: '6px', display: 'flex'}}>
              <span style={{background: '#222', padding: '0 4px', marginRight: '8px', color: '#fff'}}>{e.org}</span>
              <span>{e.text}</span>
            </div>
          ))}
        </div>

        {/* SIGNAL LOG */}
        <div className="card full">
          <div style={{color: status.c, fontSize: '0.7rem', marginBottom: '8px'}}>&gt; VERIFIED_SIGNALS_LOG:</div>
          {data.logs.map((l, i) => (
            <div key={i} style={{fontSize: '0.6rem', color: '#555', padding: '3px 0', borderBottom: '1px solid #111'}}>
              [{i+1}] {l}
            </div>
          ))}
        </div>
      </div>

      <footer style={{ marginTop: '20px', borderTop: '1px solid #222', paddingTop: '10px', fontSize: '0.55rem', color: '#444' }}>
        <strong>DISCLAIMER:</strong> AGGREGATED OSINT DATA. FOR SITUATIONAL AWARENESS ONLY. NOT OFFICIAL MILITARY GUIDANCE. SOURCES: ISW, IISS, POLYMARKET.
      </footer>

      <style jsx>{`
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .card { border: 1px solid #222; padding: 15px; background: #050505; position: relative; }
        .full { grid-column: span 2; }
        .center { text-align: center; }
        .market-bar { display: flex; justify-content: space-around; }
        .m-item b { color: #fff; margin-left: 5px; }
        
        /* GAUGE STYLES */
        .gauge-container { width: 180px; height: 90px; margin: 0 auto; position: relative; overflow: hidden; }
        .gauge-arc { 
          width: 180px; height: 180px; border-radius: 50%; 
          border: 10px solid #111; border-top-color: #0f0; border-right-color: #f90; border-bottom-color: #f00; border-left-color: #0f0;
          transform: rotate(-45deg);
        }
        .gauge-needle {
          position: absolute; bottom: 0; left: 50%; width: 2px; height: 70px; 
          background: #fff; transform-origin: bottom center; transition: transform 1s;
        }
        .gauge-center { position: absolute; bottom: 0; left: 0; right: 0; text-align: center; }

        @media (max-width: 600px) { .grid { grid-template-columns: 1fr; } .full { grid-column: span 1; } .market-bar { flex-direction: column; gap: 10px; } }
      `}</style>
    </div>
  );
}

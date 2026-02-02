import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = () => fetch(`/api/data?t=${Date.now()}`).then(r => r.json()).then(d => setData(d));
    load();
    const int = setInterval(load, 60000);
    return () => clearInterval(int);
  }, []);

  if (!data) return <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace'}}>BOOTING STRATCOM V25...</div>;

  const color = data.index > 60 ? '#f00' : data.index > 35 ? '#f90' : '#0f0';

  return (
    <div style={{ background: '#000', color: '#ccc', minHeight: '100vh', fontFamily: 'monospace', padding: '15px', fontSize: '11px' }}>
      
      {/* HEADER */}
      <header style={{ borderBottom: `2px solid ${color}`, paddingBottom: '10px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ margin: 0, color: '#fff', fontSize: '1.5rem', letterSpacing: '2px' }}>MADAD OREF</h2>
          <div style={{ fontSize: '0.6rem', opacity: 0.6 }}>02 FEB 2026 // OPERATIONAL_STATUS: {data.index > 40 ? 'CRITICAL' : 'STABLE'}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: color, fontSize: '1.1rem' }}>THREAT: {data.index}%</div>
          <div style={{ fontSize: '0.55rem' }}>SYNC: {new Date(data.updated).toLocaleTimeString()}</div>
        </div>
      </header>

      <div className="grid">
        {/* RADAR */}
        <div className="card center">
          <div className="radar" style={{borderColor: color}}>
            <div className="sweep" style={{background: `conic-gradient(from 0deg, ${color}33 0deg, transparent 90deg)`}}></div>
            <div className="val" style={{color: color}}>{data.index}%</div>
          </div>
          <div style={{marginTop: '15px', fontSize: '0.7rem'}}>METHODOLOGY: BAYESIAN RISK MODEL</div>
        </div>

        {/* U.S. VS IRAN STRIKE INDEX */}
        <div className="card">
          <div style={{color: '#f00', fontWeight: 'bold', marginBottom: '10px'}}>&gt; US STRIKE PROBABILITY // {data.us_iran.val}%</div>
          <div style={{fontSize: '0.65rem', marginBottom: '15px', borderLeft: '2px solid #300', paddingLeft: '8px', color: '#999'}}>
            {data.us_iran.rationale}
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem'}}>
            <span>POLYMARKET (JUNE 30):</span>
            <span style={{color: '#fff'}}>{data.markets.poly_long}</span>
          </div>
        </div>

        {/* MARKET INTELLIGENCE */}
        <div className="card full market-bar">
          <div className="m-box">BRENT OIL: <b style={{color:'#fff'}}>{data.markets.oil}</b></div>
          <div className="m-box">USD/ILS: <b style={{color:'#fff'}}>{data.markets.ils}</b></div>
          <div className="m-box">SENTIMENT: <b style={{color: color}}>{data.index > 40 ? 'STRESS' : 'CALM'}</b></div>
        </div>

        {/* OSINT PROFESSIONAL BRIEF */}
        <div className="card full" style={{borderColor: '#444'}}>
          <div style={{fontSize: '0.7rem', color: '#f90', marginBottom: '10px'}}>&gt; INTEL_COMMUNITY_BRIEF (ISW / IISS)</div>
          {data.osint_brief.map((b, i) => (
            <div key={i} style={{marginBottom: '8px', fontSize: '0.65rem'}}>
              <span style={{color: '#fff'}}>[{b.org}]</span> {b.text}
            </div>
          ))}
        </div>

        {/* LOGS */}
        <div className="card full">
          <div style={{fontSize: '0.7rem', color: color, marginBottom: '10px'}}>&gt; RAW_SIGNAL_FEED:</div>
          {data.logs.map((l, i) => (
            <div key={i} style={{fontSize: '0.65rem', padding: '4px 0', borderBottom: '1px solid #111', color: '#888'}}>
              <span style={{color: color, marginRight: '10px'}}>[SIGNAL_{i+1}]</span> {l}
            </div>
          ))}
        </div>
      </div>

      <footer style={{ marginTop: '20px', borderTop: '1px solid #222', paddingTop: '10px', fontSize: '0.55rem', color: '#444' }}>
        <strong>DISCLAIMER:</strong> This tool aggregates open-source intelligence and market data for situational awareness. It is NOT official military guidance. <br/>
        <strong>SOURCES:</strong> ISW, IISS, Polymarket, Google News Financial API, CSIS Reports.
      </footer>

      <style jsx>{`
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .card { border: 1px solid #222; padding: 15px; background: #050505; }
        .full { grid-column: span 2; }
        .center { text-align: center; }
        .market-bar { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
        .m-box { border-left: 2px solid #333; padding-left: 10px; font-size: 0.65rem; }
        .radar { width: 110px; height: 110px; border: 2px solid #030; border-radius: 50%; margin: 0 auto; position: relative; overflow: hidden; }
        .sweep { position: absolute; width: 100%; height: 100%; animation: rot 4s linear infinite; }
        .val { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 1.8rem; font-weight: bold; }
        @keyframes rot { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 600px) { .grid { grid-template-columns: 1fr; } .full { grid-column: span 1; } .market-bar { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}

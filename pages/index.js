import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = () => fetch(`/api/data?t=${Date.now()}`).then(r => r.json()).then(d => setData(d));
    load();
    const int = setInterval(load, 60000);
    return () => clearInterval(int);
  }, []);

  if (!data) return <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace'}}>SYNCING STRATCOM V19...</div>;

  const color = data.index > 60 ? '#f00' : data.index > 35 ? '#f90' : '#0f0';

  return (
    <div style={{ background: '#000', color: '#ccc', minHeight: '100vh', fontFamily: 'monospace', padding: '15px' }}>
      
      {/* HEADER */}
      <header style={{ borderBottom: `2px solid ${color}`, paddingBottom: '10px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ margin: 0, color: '#fff', fontSize: '1.4rem', letterSpacing: '2px' }}>MADAD OREF</h1>
          <div style={{ fontSize: '0.6rem', opacity: 0.6 }}>ISRAEL STRATEGIC THREAT MONITOR</div>
        </div>
        <div style={{ textAlign: 'right', fontSize: '0.6rem' }}>
          LIVE // {new Date(data.updated).toLocaleTimeString()}
        </div>
      </header>

      <div className="grid">
        {/* RADAR & TREND */}
        <div className="card center">
          <div className="radar" style={{borderColor: color}}>
            <div className="sweep" style={{background: `conic-gradient(from 0deg, ${color}44 0deg, transparent 90deg)`}}></div>
            <div className="val" style={{color: color}}>{data.index}%</div>
          </div>
          <div style={{marginTop: '15px', color: color, fontSize: '0.8rem'}}>STATUS: {data.index > 35 ? 'ELEVATED' : 'STABILIZED'}</div>
          
          <div className="chart">
            {data.history.map((h, i) => (
              <div key={i} style={{flex: 1, background: color, height: `${h}%`, opacity: 0.2 + (i*0.06)}}></div>
            ))}
          </div>
          <div style={{fontSize: '0.5rem', opacity: 0.5}}>72H INDEX DYNAMICS</div>
        </div>

        {/* U.S. vs IRAN */}
        <div className="card" style={{borderLeft: '4px solid #f00'}}>
          <div style={{color: '#f00', fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '10px'}}>EXTERNAL: U.S. VS IRAN</div>
          <div style={{fontSize: '2rem', color: '#fff'}}>{data.iran_prob}%</div>
          <div style={{fontSize: '0.6rem', opacity: 0.7, marginBottom: '15px'}}>STRIKE PROBABILITY (REGIONAL)</div>
          <div style={{fontSize: '0.6rem', color: '#666', lineHeight: '1.4'}}>
            * Logic: Correlates naval carrier strike groups (CSG) presence with Tehran's escalatory rhetoric.
          </div>
        </div>

        {/* MARKET INDICATORS */}
        <div className="card full">
          <div style={{fontSize: '0.7rem', color: '#ff0', marginBottom: '15px'}}>&gt; MARKET_INTELLIGENCE</div>
          <div className="market-grid">
            <div className="m-item"><span>POLYMARKET</span><br/><span style={{color: '#fff'}}>{data.markets.poly}</span></div>
            <div className="m-item"><span>BRENT OIL</span><br/><span style={{color: '#fff'}}>{data.markets.oil}</span></div>
            <div className="m-item"><span>USD/ILS</span><br/><span style={{color: '#fff'}}>{data.markets.ils}</span></div>
            <div className="m-item"><span>SENTIMENT</span><br/><span style={{color: '#fff'}}>{data.index > 40 ? 'RISK_OFF' : 'NEUTRAL'}</span></div>
          </div>
        </div>

        {/* LOGS */}
        <div className="card full">
          <div style={{fontSize: '0.7rem', color: color, marginBottom: '10px'}}>&gt; RECENT_OSINT_SIGNALS</div>
          {data.logs.map((l, i) => (
            <div key={i} style={{fontSize: '0.65rem', marginBottom: '8px', borderLeft: `2px solid ${color}`, paddingLeft: '8px', color: '#999'}}>
              {l}
            </div>
          ))}
        </div>
      </div>

      <footer style={{marginTop: '30px', fontSize: '0.55rem', color: '#444', borderTop: '1px solid #222', paddingTop: '15px'}}>
        <strong>SOURCES (live feeds):</strong><br/>
        • News aggregation (Google News clusters) | • Prediction markets (Polymarket) | 
        • Commodities (Brent Oil - market proxy) | • FX (USD/ILS - stress indicator)
        <div style={{marginTop: '10px'}}>Disclaimer: Not for tactical decisions. Consult official sources.</div>
      </footer>

      <style jsx>{`
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .card { border: 1px solid #222; padding: 15px; background: #050505; }
        .center { text-align: center; }
        .full { grid-column: span 2; }
        .market-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        .m-item { font-size: 0.6rem; border-left: 1px solid #333; padding-left: 8px; }
        .radar { width: 140px; height: 140px; border: 2px solid #030; border-radius: 50%; margin: 0 auto; position: relative; overflow: hidden; }
        .sweep { position: absolute; width: 100%; height: 100%; animation: r 4s linear infinite; }
        .val { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 2.2rem; font-weight: bold; }
        .chart { display: flex; align-items: flex-end; height: 40px; gap: 2px; margin-top: 20px; }
        @keyframes r { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        @media (max-width: 600px) {
          .grid { grid-template-columns: 1fr; }
          .full { grid-column: span 1; }
          .market-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </div>
  );
}

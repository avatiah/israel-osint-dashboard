import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = () => fetch(`/api/data?t=${Date.now()}`).then(r => r.json()).then(d => setData(d));
    load();
    const int = setInterval(load, 30000);
    return () => clearInterval(int);
  }, []);

  if (!data) return <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace'}}>V29_DUAL_STREAM_SYNC...</div>;

  const Gauge = ({ value, label, color }) => (
    <div className="gauge-box">
      <div className="gauge-container">
        <div className="gauge-arc" style={{borderTopColor: color, borderRightColor: color}}></div>
        <div className="gauge-needle" style={{ transform: `rotate(${(value / 100) * 180 - 90}deg)` }}></div>
        <div className="gauge-center">
          <div style={{fontSize: '1.8rem', color: color, fontWeight: 'bold'}}>{value}%</div>
        </div>
      </div>
      <div style={{fontSize: '0.7rem', color: '#fff', marginTop: '10px', letterSpacing: '1px'}}>{label}</div>
    </div>
  );

  const getColor = (v) => v > 70 ? '#f00' : v > 40 ? '#f90' : '#0f0';

  return (
    <div style={{ background: '#000', color: '#ccc', minHeight: '100vh', fontFamily: 'monospace', padding: '15px', fontSize: '11px' }}>
      
      <header style={{ borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, color: '#fff', fontSize: '1.4rem' }}>MADAD OREF <span style={{fontSize: '0.6rem', opacity: 0.4}}>V29_COMMAND</span></h1>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.6rem', opacity: 0.5 }}>02 FEB 2026 // {new Date(data.updated).toLocaleTimeString()}</div>
        </div>
      </header>

      <div className="grid">
        {/* MAIN THREAT GAUGE */}
        <div className="card center">
          <Gauge value={data.index} label="GENERAL THREAT LEVEL" color={getColor(data.index)} />
        </div>

        {/* U.S. VS IRAN GAUGE (ENLARGED) */}
        <div className="card center" style={{borderColor: '#400'}}>
          <Gauge value={data.us_iran.val} label="U.S. STRIKE ON IRAN" color="#f00" />
        </div>

        {/* US-IRAN RATIONALE */}
        <div className="card full" style={{background: '#0a0000'}}>
          <div style={{color: '#f00', fontSize: '0.7rem', marginBottom: '8px', fontWeight: 'bold'}}>&gt; STRIKE RATIONALE:</div>
          <div style={{fontSize: '0.7rem', color: '#aaa', lineHeight: '1.4'}}>
            {data.us_iran.rationale} <br/>
            <span style={{color: '#666'}}>* Current Polymarket Confidence (Short-term): {data.markets.poly}</span>
          </div>
        </div>

        {/* MARKET DATA */}
        <div className="card full market-bar">
          <div className="m-item">BRENT OIL: <b>{data.markets.brent}</b></div>
          <div className="m-item">USD/ILS: <b>{data.markets.ils}</b></div>
          <div className="m-item">MARKET_SENTIMENT: <b style={{color: getColor(data.index)}}>{data.index > 50 ? 'STRESS' : 'CALM'}</b></div>
        </div>

        {/* EXPERTS */}
        <div className="card full">
          <div style={{color: '#f90', fontSize: '0.7rem', marginBottom: '10px'}}>&gt; OSINT_EXPERT_BRIEFING:</div>
          {data.experts.map((e, i) => (
            <div key={i} style={{fontSize: '0.65rem', marginBottom: '6px'}}>
              <span style={{color: '#fff', border: '1px solid #444', padding: '0 4px', marginRight: '8px'}}>{e.org}</span> {e.text}
            </div>
          ))}
        </div>

        {/* LOGS */}
        <div className="card full">
          <div style={{color: '#444', fontSize: '0.6rem', marginBottom: '8px'}}>&gt; RAW_SIGNAL_FEED:</div>
          {data.logs.map((l, i) => (
            <div key={i} style={{fontSize: '0.6rem', color: '#666', padding: '3px 0', borderBottom: '1px solid #111'}}>
              [{i+1}] {l}
            </div>
          ))}
        </div>
      </div>

      <footer style={{ marginTop: '20px', borderTop: '1px solid #222', paddingTop: '10px', fontSize: '0.55rem', color: '#444', lineHeight: '1.5' }}>
        <strong>DISCLAIMER:</strong> AGGREGATED OSINT DATA. FOR SITUATIONAL AWARENESS ONLY. NOT OFFICIAL MILITARY GUIDANCE. <br/>
        <strong>SOURCES:</strong> ISW (INSTITUTE FOR THE STUDY OF WAR), IISS, POLYMARKET DATA, REUTERS FINANCIAL API.
      </footer>

      <style jsx>{`
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .card { border: 1px solid #222; padding: 20px; background: #050505; }
        .full { grid-column: span 2; }
        .center { text-align: center; }
        .market-bar { display: flex; justify-content: space-around; }
        .m-item b { color: #fff; margin-left: 5px; }
        
        .gauge-box { margin: 0 auto; }
        .gauge-container { width: 160px; height: 80px; margin: 0 auto; position: relative; overflow: hidden; }
        .gauge-arc { 
          width: 160px; height: 160px; border-radius: 50%; 
          border: 8px solid #111; border-top-color: transparent; border-right-color: transparent;
          transform: rotate(45deg);
        }
        .gauge-needle {
          position: absolute; bottom: 0; left: 50%; width: 2px; height: 60px; 
          background: #fff; transform-origin: bottom center; transition: transform 1.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .gauge-center { position: absolute; bottom: 0; left: 0; right: 0; text-align: center; }

        @media (max-width: 600px) { .grid { grid-template-columns: 1fr; } .full { grid-column: span 1; } .market-bar { flex-direction: column; gap: 10px; } }
      `}</style>
    </div>
  );
}

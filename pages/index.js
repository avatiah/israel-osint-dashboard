import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);
  const [showMeta, setShowMeta] = useState(false);

  useEffect(() => {
    const load = () => fetch(`/api/data?t=${Date.now()}`).then(r => r.json()).then(d => setData(d));
    load();
    const int = setInterval(load, 60000);
    return () => clearInterval(int);
  }, []);

  if (!data) return <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace'}}>BOOTING STRATCOM_V16...</div>;

  const color = data.index > 75 ? '#f00' : data.index > 45 ? '#f90' : '#0f0';

  return (
    <div style={{ background: '#000', color: '#ccc', minHeight: '100vh', fontFamily: 'monospace', padding: '20px' }}>
      
      {/* HEADER */}
      <header style={{ borderBottom: `1px solid ${color}`, paddingBottom: '15px', marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, color: '#fff', fontSize: '1.8rem', letterSpacing: '4px' }}>MADAD OREF <span style={{fontSize:'0.8rem', color:color}}>[V16_STRATCOM]</span></h1>
          <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>ISRAEL STRATEGIC THREAT MONITORING SYSTEM</div>
        </div>
        <button onClick={() => setShowMeta(!showMeta)} style={{background:'none', border:`1px solid ${color}`, color:color, cursor:'pointer', padding:'5px 10px', fontSize:'0.7rem'}}>
          [ i ] METHODOLOGY
        </button>
      </header>

      {showMeta && (
        <div style={{border:`1px solid ${color}`, padding:'15px', marginBottom:'20px', fontSize:'0.7rem', background:'#0a0a0a'}}>
          &gt; INDEX_CALCULATION: Index = Σ(Sector_Threats * Weights) / Normalization_Factor.<br/>
          &gt; WEIGHTS: Military(5.0), Rhetoric(3.0), Logistics(4.0), Market_Stress(2.0).
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
        
        {/* LEFT: MAIN RADAR & TREND */}
        <div style={{ border: '1px solid #222', padding: '20px', background: '#050505' }}>
          <div className="radar" style={{borderColor: color}}>
            <div className="sweep" style={{background: `conic-gradient(from 0deg, ${color}44 0deg, transparent 90deg)`}}></div>
            <div className="val" style={{color: color}}>{data.index}%</div>
          </div>
          
          <div style={{marginTop:'30px'}}>
            <div style={{fontSize:'0.7rem', marginBottom:'10px', opacity:0.5}}>TENSION_TREND_72H</div>
            <div style={{display:'flex', alignItems:'flex-end', height:'60px', gap:'4px'}}>
              {data.history.map((h, i) => (
                <div key={i} style={{flex:1, background:color, height:`${h.val}%`, opacity: 0.3 + (i*0.05)}} title={`${h.time}: ${h.val}%`}></div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: REGIONAL FRONTS */}
        <div style={{ border: '1px solid #222', padding: '20px' }}>
          <div style={{fontSize:'0.8rem', color:color, marginBottom:'15px'}}>&gt; REGIONAL_FRONT_STATUS</div>
          {data.fronts.map((f, i) => (
            <div key={i} style={{marginBottom:'15px', borderLeft:`2px solid ${f.level > 50 ? '#f00' : '#0f0'}`, paddingLeft:'10px'}}>
              <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.7rem', marginBottom:'5px'}}>
                <span>{f.name}</span>
                <span>{f.level}%</span>
              </div>
              <div style={{height:'3px', background:'#111', width:'100%'}}>
                <div style={{height:'100%', background:f.level > 50 ? '#f00' : '#0f0', width:`${f.level}%`}}></div>
              </div>
            </div>
          ))}
          
          <div style={{marginTop:'25px', paddingTop:'15px', borderTop:'1px solid #222'}}>
            <div style={{fontSize:'0.7rem', color:'#ff0'}}>MARKET_INDICATORS:</div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginTop:'10px', fontSize:'0.7rem'}}>
              <div>POLYMARKET: <span style={{color:'#fff'}}>{data.market.poly}</span></div>
              <div>BRENT_OIL: <span style={{color:'#fff'}}>{data.market.brent}</span></div>
              <div>USD/ILS: <span style={{color:'#fff'}}>{data.market.usdils}</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM: TRIGGER LOGS */}
      <div style={{marginTop:'25px', border:'1px solid #222', padding:'15px', background:'#050505'}}>
        <div style={{fontSize:'0.7rem', color:color, marginBottom:'10px'}}>&gt; LATEST_OSINT_SIGNALS (LIVE_FEED)</div>
        {data.logs.map((l, i) => (
          <div key={i} style={{fontSize:'0.7rem', marginBottom:'6px', color:'#999'}}>
            <span style={{color:color}}>[{l.f}]</span> {l.t}
          </div>
        ))}
      </div>

      <footer style={{marginTop:'40px', fontSize:'0.6rem', color:'#444', textAlign:'center'}}>
        DISCLAIMER: Operational data for situational awareness only. Not for tactical decisions. <br/>
        SOURCES: GOOGLE_NEWS_ENGINE / POLYMARKET_ALGO / TRADING_ECONOMICS_LIVE
      </footer>

      <style jsx>{`
        .radar { width: 160px; height: 160px; border: 2px solid #030; border-radius: 50%; margin: 0 auto; position: relative; overflow: hidden; background: radial-gradient(circle, #010 0%, #000 70%); }
        .sweep { position: absolute; width: 100%; height: 100%; animation: r 4s linear infinite; }
        .val { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 2.5rem; font-weight: bold; text-shadow: 0 0 10px rgba(0,255,0,0.5); }
        @keyframes r { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

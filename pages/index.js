import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = () => fetch(`/api/data?t=${Date.now()}`).then(r => r.json()).then(d => setData(d));
    load();
    const int = setInterval(load, 60000);
    return () => clearInterval(int);
  }, []);

  if (!data) return <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace'}}>INITIALIZING_MADAD_OREF_V15...</div>;

  return (
    <div style={{ background: '#000', color: '#0f0', minHeight: '100vh', fontFamily: 'monospace', padding: '20px', fontSize: '13px' }}>
      
      {/* HEADER */}
      <div style={{ borderBottom: '1px solid #0f0', paddingBottom: '15px', marginBottom: '25px', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '2rem', letterSpacing: '5px' }}>MADAD OREF</h1>
          <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>ISRAEL GENERAL THREAT INDEX // OSINT INTELLIGENCE</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.2rem', color: data.index > 50 ? '#f00' : '#0f0' }}>INDEX: {data.index}%</div>
          <div style={{ fontSize: '0.6rem' }}>LAST_SYNC: {new Date(data.updated).toLocaleTimeString()}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        
        {/* RADAR BLOCK */}
        <div style={{ border: '1px solid #222', padding: '40px', background: '#050505', textAlign: 'center' }}>
          <div className="radar">
            <div className="sweep"></div>
            <div className="val">{data.index}</div>
          </div>
          <div style={{ marginTop: '20px', letterSpacing: '2px' }}>THREAT_LEVEL: {data.index > 50 ? 'HIGH' : 'STABILIZED'}</div>
        </div>

        {/* EXTERNAL THEATER: US VS IRAN */}
        <div style={{ border: '1px solid #f00', padding: '20px', background: '#100' }}>
          <div style={{ color: '#f00', marginBottom: '15px', fontWeight: 'bold' }}>EXTERNAL_THEATER: U.S. VS IRAN</div>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{data.iran_confrontation.index}%</div>
          <div style={{ fontSize: '0.7rem', marginBottom: '15px' }}>STATUS: {data.iran_confrontation.status}</div>
          <div style={{ fontSize: '0.6rem', opacity: 0.8 }}>* Logic: Based on Naval Presence, Rhetoric and Iranian Naval Drills.</div>
        </div>
      </div>

      {/* NEW: MARKET SENTIMENT BLOCK */}
      <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
        {[
          { label: 'POLYMARKET (IRAN STRIKE)', val: data.markets.polymarket_iran_strike },
          { label: 'BRENT CRUDE OIL', val: data.markets.brent_oil },
          { label: 'USD/ILS RATE', val: data.markets.usd_ils },
          { label: 'MARKET TREND', val: data.markets.market_sentiment }
        ].map((m, i) => (
          <div key={i} style={{ border: '1px solid #333', padding: '15px', background: '#080808' }}>
            <div style={{ fontSize: '0.6rem', opacity: 0.5, marginBottom: '5px' }}>{m.label}</div>
            <div style={{ fontSize: '1rem', color: '#ff0' }}>{m.val}</div>
          </div>
        ))}
      </div>

      {/* DISCLAIMER */}
      <footer style={{ marginTop: '50px', borderTop: '1px solid #222', paddingTop: '20px', fontSize: '0.65rem', color: '#444', textAlign: 'center', lineHeight: '1.6' }}>
        Disclaimer: The developers are not responsible for decisions made based on the data in this index. For critical decisions, always consult official sources and experts. <br/>
        SOURCES: GOOGLE_NEWS_API / POLYMARKET_RECAP / TRADING_ECONOMICS
      </footer>

      <style jsx>{`
        .radar { width: 160px; height: 160px; border: 2px solid #030; border-radius: 50%; margin: 0 auto; position: relative; overflow: hidden; }
        .sweep { position: absolute; width: 100%; height: 100%; background: conic-gradient(from 0deg, rgba(0,255,0,0.2) 0deg, transparent 90deg); animation: r 4s linear infinite; }
        .val { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 2.5rem; font-weight: bold; }
        @keyframes r { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

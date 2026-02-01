import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = () => fetch('/api/data').then(r => r.json()).then(d => setData(d));
    load();
    const int = setInterval(load, 45000);
    return () => clearInterval(int);
  }, []);

  if (!data) return <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace'}}>&gt; ESTABLISHING_ENCRYPTED_UPLINK...</div>;

  return (
    <div style={{ background: '#000', color: '#0f0', minHeight: '100vh', fontFamily: 'monospace', padding: '15px', border: '1px solid #040' }}>
      {/* TOP DECORATIVE BAR */}
      <div style={{ fontSize: '0.6rem', display: 'flex', justifyContent: 'space-between', opacity: 0.5, marginBottom: '5px' }}>
        <span>SECURE_CONNECTION: AES-256</span>
        <span>LATENCY: 14ms</span>
        <span>NODE: TEL_AVIV_CENTER</span>
      </div>

      <header style={{ border: '2px solid #0f0', padding: '15px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#010' }}>
        <div>
           <h1 style={{ margin: 0, fontSize: '1.2rem', letterSpacing: '3px' }}>ISRAEL_OSINT_COMMAND</h1>
           <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>STRATEGIC_SURVEILLANCE_INTERFACE</div>
        </div>
        <div style={{ textAlign: 'right', borderLeft: '1px solid #0f0', paddingLeft: '20px' }}>
           <div style={{ fontSize: '1.2rem', color: data.index > 70 ? '#f00' : '#0f0', fontWeight: 'bold' }}>{data.status}</div>
           <div style={{ fontSize: '0.6rem' }}>ALERT_LEVEL</div>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '15px' }}>
        
        {/* LEFT COLUMN: MAIN INTEL */}
        <div>
           <div style={{ border: '1px solid #0f0', padding: '15px', marginBottom: '15px' }}>
             <div style={{ fontSize: '0.7rem', marginBottom: '10px', borderBottom: '1px solid #0f0' }}>&gt; SIGNAL_FEED_STREAM</div>
             {data.signals?.map((s, i) => (
               <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid #111', fontSize: '0.85rem' }}>
                 <span style={{ color: s.color, fontSize: '0.6rem', marginRight: '10px' }}>[{s.type}]</span>
                 {s.title}
               </div>
             ))}
           </div>
        </div>

        {/* RIGHT COLUMN: ANALYTICS */}
        <aside>
          <div style={{ border: '1px solid #0f0', padding: '20px', textAlign: 'center', marginBottom: '15px' }}>
             <div style={{ fontSize: '0.6rem', opacity: 0.6 }}>STRATEGIC_TENSION_INDEX</div>
             <div style={{ fontSize: '4rem', fontWeight: 'bold', color: data.index > 70 ? '#f00' : '#0f0' }}>{data.index}%</div>
             <div style={{ height: '5px', background: '#111', marginTop: '10px', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: '#0f0', width: `${data.index}%` }}></div>
             </div>
          </div>

          <div style={{ border: '1px solid #0f0', padding: '15px', background: '#010' }}>
             <div style={{ fontSize: '0.7rem', marginBottom: '10px', color: '#00ccff' }}>CROSS_DATA_FACTORS</div>
             <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '5px' }}>
                <span>MARKET_STRESS:</span><span>{data.market_stress}</span>
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '5px' }}>
                <span>INTEL_NODES:</span><span>{data.intel_nodes}</span>
             </div>
             <div style={{ fontSize: '0.5rem', marginTop: '10px', opacity: 0.5 }}>DATA_SOURCES: Reuters, ISW, YahooFinance, GovtPortal</div>
          </div>
        </aside>

      </div>
      
      <style jsx global>{`
        @media (max-width: 900px) {
          div[style*="display: grid"] { grid-template-columns: 1fr !important; }
          aside { order: -1; width: 100% !important; }
        }
        body { background: #000; margin: 0; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #0f0; }
      `}</style>
    </div>
  );
}

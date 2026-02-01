import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/data').then(res => res.json()).then(d => setData(d)).catch(e => console.error(e));
  }, []);

  if (!data) return <div style={{background:'#000', color:'#0f0', height:'100vh', padding:'20px', fontFamily:'monospace'}}>&gt; ACCESSING_SYSTEM...</div>;

  return (
    <div style={{ background: '#000', color: '#0f0', minHeight: '100vh', fontFamily: 'monospace', padding: '20px' }}>
      <div style={{ border: '1px solid #0f0', padding: '15px', marginBottom: '20px' }}>
        <h1 style={{ margin: 0, fontSize: '1.2rem' }}>THREAT ENGINE ADMIN // ACTIVE</h1>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px' }}>
        <div style={{ border: '1px solid #0f0', padding: '20px', textAlign: 'center' }}>
          <div style={{fontSize: '0.8rem'}}>TENSION_INDEX</div>
          <div style={{fontSize: '4.5rem', fontWeight: 'bold'}}>{data.index}%</div>
          <table style={{width:'100%', borderCollapse:'collapse', marginTop:'20px', border:'1px solid #0f0'}}>
            {Object.entries(data.blocks).map(([k,v]) => (
              <tr key={k} style={{border:'1px solid #0f0'}}><td style={{padding:'5px', textAlign:'left'}}>{k}</td><td style={{textAlign:'right', padding:'5px'}}>{v}%</td></tr>
            ))}
          </table>
        </div>

        <div style={{ border: '1px solid #0f0', padding: '15px' }}>
          <h3 style={{marginTop:0}}>&gt; LIVE_DATA_STREAM</h3>
          <table style={{width:'100%', borderCollapse:'collapse'}}>
            {data.signals.map((s, i) => (
              <tr key={i} style={{borderBottom: '1px solid #111'}}>
                <td style={{padding: '10px 0', fontSize: '0.8rem'}}>{s.title}</td>
                <td style={{textAlign: 'right'}}><a href={s.link} target="_blank" style={{color:'#0f0', textDecoration:'none', border:'1px solid #0f0', padding:'2px 5px', fontSize:'0.7rem'}}>OPEN</a></td>
              </tr>
            ))}
          </table>
        </div>
      </div>
    </div>
  );
}

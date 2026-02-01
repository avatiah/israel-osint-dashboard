import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = () => fetch('/api/data').then(r => r.json()).then(d => setData(d));
    load();
    const int = setInterval(load, 45000);
    return () => clearInterval(int);
  }, []);

  if (!data) return <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace'}}>&gt; CALIBRATING_SYSTEM_WEIGHTS...</div>;

  return (
    <div style={{ background: '#000', color: '#0f0', minHeight: '100vh', fontFamily: 'monospace', padding: '20px' }}>
      <header style={{ border: '1px solid #0f0', padding: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <h1 style={{ margin: 0, fontSize: '1rem', letterSpacing: '2px' }}>OSINT_ANALYTICS_V5</h1>
        <span style={{opacity: 0.5}}>{new Date(data.last_update).toLocaleTimeString()}</span>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '20px' }}>
        
        {/* ЛЕВАЯ ПАНЕЛЬ: ИТОГ */}
        <div style={{ border: '1px solid #0f0', padding: '25px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', opacity: 0.6, marginBottom: '10px' }}>TOTAL_AGGREGATED_THREAT</div>
          <div style={{ fontSize: '5rem', fontWeight: 'bold', color: data.index > 75 ? '#f00' : '#0f0' }}>{data.index}%</div>
          <div style={{ fontSize: '0.8rem', border: '1px solid #333', padding: '5px', marginTop: '10px' }}>
            STATUS: {data.index > 80 ? 'CRITICAL_ALERT' : data.index > 50 ? 'ELEVATED_RISK' : 'STABLE'}
          </div>
        </div>

        {/* ПРАВАЯ ПАНЕЛЬ: РАСШИФРОВКА */}
        <div style={{ border: '1px solid #0f0', padding: '20px' }}>
          <div style={{ fontSize: '0.7rem', borderBottom: '1px solid #0f0', paddingBottom: '10px', marginBottom: '20px' }}>DETECTION_FACTOR_INFLUENCE</div>
          
          {data.breakdown.map((f, i) => (
            <div key={i} style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '5px' }}>
                <span>{f.name}</span>
                <span style={{ color: f.value > 30 ? '#f00' : '#0f0' }}>+{f.value}%</span>
              </div>
              {/* Прогресс-бар фактора */}
              <div style={{ height: '4px', background: '#111', width: '100%' }}>
                <div style={{ height: '100%', background: f.value > 30 ? '#f00' : '#0f0', width: `${(f.value / 40) * 100}%` }}></div>
              </div>
              <div style={{ fontSize: '0.6rem', opacity: 0.5, marginTop: '5px' }}>{f.desc}</div>
            </div>
          ))}
        </div>

      </div>

      <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #111', fontSize: '0.65rem', color: '#666', lineHeight: '1.4' }}>
        <div style={{ color: '#0f0', marginBottom: '5px' }}>&gt; METHODOLOGY_NOTE:</div>
        Индекс 100% достигается только при одновременном всплеске кинетической активности (бои), 
        негативных прогнозах стратегических аналитиков (ISW/Reuters) и волатильности на рынках. 
        Базовый уровень 10% установлен как константа для региона.
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = () => fetch('/api/data').then(r => r.json()).then(d => setData(d));
    load();
    const int = setInterval(load, 60000);
    return () => clearInterval(int);
  }, []);

  if (!data) return <div style={{background:'#000', color:'#0f0', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace'}}>&gt; GENERATING_HEATMAP...</div>;

  // Функция для определения цвета точки по интенсивности
  const getHeatColor = (val) => {
    if (val === 0) return '#1a1a1a';
    if (val < 2) return '#ffae00'; // Среднее давление
    return '#ff0000'; // Высокое давление
  };

  return (
    <div style={{ background: '#000', color: '#0f0', minHeight: '100vh', fontFamily: 'monospace', padding: '15px' }}>
      <header style={{ border: '2px solid #0f0', padding: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <h1 style={{ margin: 0, fontSize: '1rem' }}>STRATEGIC_HEATMAP_RADAR</h1>
        <span style={{ fontSize: '0.7rem' }}>SYNC_STATUS: {new Date(data.last_update).toLocaleTimeString()}</span>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px' }}>
        
        {/* КАРТА С ТЕПЛОВЫМИ ТОЧКАМИ */}
        <div style={{ border: '1px solid #0f0', padding: '20px', position: 'relative', overflow: 'hidden', background: '#050505' }}>
           <div style={{fontSize:'0.6rem', marginBottom:'15px', opacity:0.6}}>REGIONAL_PRESSURE_POINTS (LIVE)</div>
           
           <div style={{ position: 'relative', width: '200px', margin: '0 auto' }}>
              {/* Контур карты */}
              <svg viewBox="0 0 100 200" style={{ width: '100%' }}>
                <path d="M40,10 L65,10 L60,180 L20,130 Z" fill="none" stroke="#0f0" strokeWidth="0.5" strokeDasharray="2 2" />
                
                {/* Точки городов */}
                {/* North */}
                <circle cx="50" cy="20" r={data.heatmap?.Kiriat_Shmona.intensity > 0 ? "4" : "2"} fill={getHeatColor(data.heatmap?.Kiriat_Shmona.intensity)} className={data.heatmap?.Kiriat_Shmona.intensity > 0 ? "pulse" : ""} />
                {/* Haifa */}
                <circle cx="45" cy="40" r={data.heatmap?.Haifa.intensity > 0 ? "4" : "2"} fill={getHeatColor(data.heatmap?.Haifa.intensity)} className={data.heatmap?.Haifa.intensity > 0 ? "pulse" : ""} />
                {/* Center */}
                <circle cx="42" cy="75" r={data.heatmap?.Tel_Aviv.intensity > 0 ? "4" : "2"} fill={getHeatColor(data.heatmap?.Tel_Aviv.intensity)} className={data.heatmap?.Tel_Aviv.intensity > 0 ? "pulse" : ""} />
                {/* Jerusalem */}
                <circle cx="55" cy="85" r={data.heatmap?.Jerusalem.intensity > 0 ? "4" : "2"} fill={getHeatColor(data.heatmap?.Jerusalem.intensity)} className={data.heatmap?.Jerusalem.intensity > 0 ? "pulse" : ""} />
                {/* South/Gaza */}
                <circle cx="35" cy="100" r={data.heatmap?.Ashdod.intensity > 0 ? "4" : "2"} fill={getHeatColor(data.heatmap?.Ashdod.intensity)} className={data.heatmap?.Ashdod.intensity > 0 ? "pulse" : ""} />
                {/* Beersheba */}
                <circle cx="45" cy="130" r={data.heatmap?.Beersheba.intensity > 0 ? "4" : "2"} fill={getHeatColor(data.heatmap?.Beersheba.intensity)} className={data.heatmap?.Beersheba.intensity > 0 ? "pulse" : ""} />
              </svg>
           </div>
        </div>

        {/* ПАНЕЛЬ ЛЕГЕНДЫ */}
        <aside style={{ border: '1px solid #0f0', padding: '15px' }}>
          <div style={{ fontSize: '0.7rem', borderBottom: '1px solid #0f0', marginBottom: '10px', paddingBottom: '5px' }}>INFO_PRESSURE_BY_ZONE</div>
          {data.heatmap && Object.entries(data.heatmap).map(([city, info]) => (
            <div key={city} style={{ marginBottom: '10px', fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{color: info.intensity > 0 ? '#ffae00' : '#0f0'}}>{city.replace('_', ' ')}</span>
              <span style={{ color: getHeatColor(info.intensity) }}>{info.intensity} SIGS</span>
            </div>
          ))}
          <div style={{ marginTop: '20px', fontSize: '0.5rem', opacity: 0.5, lineHeight: '1.4' }}>
            * SIGS (Signals) - количество упоминаний региона в экспертных сводках за последний цикл.
          </div>
        </aside>
      </div>

      <style jsx global>{`
        .pulse { animation: p 1s infinite; }
        @keyframes p { 0% { r: 2; opacity: 1; } 100% { r: 8; opacity: 0; } }
        body { background: #000; margin: 0; }
      `}</style>
    </div>
  );
}

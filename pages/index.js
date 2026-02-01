import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/data')
      .then(res => {
        if (!res.ok) throw new Error('API_RESPONSE_ERROR');
        return res.json();
      })
      .then(json => setData(json))
      .catch(err => setError(err.message));
  }, []);

  if (error) return <div style={{color: 'red', padding: '20px', fontFamily: 'monospace'}}>ERROR: {error}</div>;
  if (!data) return <div style={{color: '#00ff00', padding: '20px', fontFamily: 'monospace'}}>&gt; ACCESSING_INTEL_NETWORK...</div>;

  return (
    <div style={{ backgroundColor: '#000', color: '#00ff00', minHeight: '100vh', fontFamily: 'monospace', padding: '20px' }}>
      <header style={{ borderBottom: '1px solid #00ff00', marginBottom: '20px', paddingBottom: '10px' }}>
        <h1 style={{ margin: 0 }}>THREAT_ENGINE_ADMIN</h1>
        <small>SYSTEM_STATUS: ACTIVE // DATA_SOURCE: LIVE_RSS</small>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
        {/* Индикатор */}
        <div style={{ border: '1px solid #00ff00', padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.9rem' }}>CURRENT_TENSION_INDEX</div>
          <div style={{ fontSize: '5rem', textShadow: '0 0 10px #00ff00' }}>{data.index}%</div>
          <div style={{ borderTop: '1px solid #00ff00', marginTop: '10px', paddingTop: '10px' }}>
            {Object.entries(data.blocks).map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem' }}>
                <span>{k.toUpperCase()}</span>
                <span>{v}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Сигналы */}
        <div style={{ border: '1px solid #00ff00', padding: '15px' }}>
          <h3 style={{ marginTop: 0 }}>LIVE_LOG_STREAM</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            {data.signals.map((s, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #111' }}>
                <td style={{ padding: '8px 0', fontSize: '0.8rem' }}>
                  <span style={{ color: '#555' }}>[{i}]</span> {s.title}
                </td>
                <td style={{ textAlign: 'right' }}>
                   <a href={s.link} target="_blank" rel="noreferrer" style={{ color: '#00ff00', fontSize: '0.7rem' }}>[LINK]</a>
                </td>
              </tr>
            ))}
          </table>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/data', { cache: 'no-store' });
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error("Fetch error:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div style={{background:'#000', color:'#0f0', padding:'20px', fontFamily:'monospace'}}> &gt; CONNECTING_TO_THREAT_ENGINE... </div>;
  if (!data) return <div style={{background:'#000', color:'#f00', padding:'20px', fontFamily:'monospace'}}> [!] SYSTEM_OFFLINE </div>;

  return (
    <div style={{ backgroundColor: '#000', color: '#0f0', minHeight: '100vh', fontFamily: 'monospace', padding: '20px' }}>
      <header style={{ border: '1px solid #0f0', padding: '10px', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>ADMIN_THREAT_DASHBOARD</h2>
        <small>STATUS: ACTIVE // OSINT_STREAM_ENABLED</small>
      </header>

      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Индекс */}
        <div style={{ border: '1px solid #0f0', padding: '20px', minWidth: '200px', textAlign: 'center' }}>
          <div>TENSION_INDEX</div>
          <div style={{ fontSize: '4rem', fontWeight: 'bold' }}>{data.index}%</div>
        </div>

        {/* Таблица */}
        <div style={{ border: '1px solid #0f0', flexGrow: 1, padding: '10px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #0f0' }}>
                <th style={{ textAlign: 'left', padding: '5px' }}>SIGNAL_FEED</th>
                <th style={{ textAlign: 'right', padding: '5px' }}>SOURCE</th>
              </tr>
            </thead>
            <tbody>
              {data.signals && data.signals.map((s, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '8px 5px', fontSize: '0.9rem' }}>{s.title}</td>
                  <td style={{ textAlign: 'right', fontSize: '0.7rem', color: '#666' }}>{s.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

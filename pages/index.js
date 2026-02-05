import React, { useEffect, useState, useRef } from 'react';

// [highlightCritical и Gauge остаются прежними]
const highlightCritical = (text) => {
  const words = ["удара", "удар", "атака", "ракета", "БПЛА", "срыва", "аномальная", "колебания"];
  let formatted = text;
  words.forEach(word => {
    const reg = new RegExp(`(${word})`, "gi");
    formatted = formatted.replace(reg, '<span style="color:#ff3e3e;font-weight:bold">$1</span>');
  });
  return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
};

const Gauge = ({ value, color, trend }) => {
  const circumference = Math.PI * 40;
  const offset = circumference - (Math.min(Math.max(value, 0), 100) / 100) * circumference;
  return (
    <div style={{ textAlign: 'center' }}>
      <svg width="100" height="60" viewBox="0 0 100 60">
        <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#111" strokeWidth="6" />
        <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke={color} strokeWidth="6" strokeDasharray={circumference} strokeDashoffset={offset} />
        <text x="50" y="45" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">{value}%</text>
      </svg>
    </div>
  );
};

export default function MadadHaOref() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchIntel = async () => {
      const res = await fetch('/api/data');
      const json = await res.json();
      setData(json);
    };
    fetchIntel();
    const timer = setInterval(fetchIntel, 10000);
    return () => clearInterval(timer);
  }, []);

  if (!data) return <div style={s.loader}>CONNECTING_TO_CLOUDFLARE_RADAR...</div>;

  const net = data.netConnectivity;
  const netColor = net.status === 'stable' ? '#0f4' : (net.status === 'anomalous' ? '#ffae00' : '#ff3e3e');

  return (
    <div style={s.container}>
      <header style={s.header}>
        <h1 style={s.logo}>MADAD HAOREF</h1>
        <div style={s.statusBlock}>
          <div style={s.meta}>V13.5 // TRAFFIC_ANOMALY_ENGINE</div>
          <div style={s.time}>{new Date().toLocaleTimeString()} UTC</div>
        </div>
      </header>

      <main style={s.grid}>
        {data.nodes.map(node => (
          <div key={node.id} style={s.card}>
            <div style={s.cardLayout}>
              <Gauge value={node.value} color={node.value > 65 ? '#ff3e3e' : '#0f4'} />
              <div style={s.cardContent}>
                <div style={s.nodeTitle}>{node.title}</div>
                <div style={s.newsSection}>
                  {node.news?.map((n, i) => (
                    <div key={i} style={s.newsItem}>[{n.src}] {highlightCritical(n.txt)}</div>
                  ))}
                </div>
              </div>
            </div>

            <div style={s.infoBox}>
              <div style={s.metricsList}>
                <span style={s.infoLabel}>ДАТЧИКИ:</span>
                {/* НОВЫЙ ДАТЧИК ТРАФИКА */}
                <span style={{ ...s.metricItem, color: netColor }}>
                  <span style={{ ...s.dot, backgroundColor: netColor, animation: net.status !== 'stable' ? 'blink 1s infinite' : 'none' }} />
                  NET_TRAFFIC: {net.score}%
                </span>
                <span style={s.metricItem}>OSINT_SENTIMENT</span>
              </div>
            </div>
          </div>
        ))}

        <div style={s.forecastBox}>
          <h3 style={s.forecastTitle}>⚠️ ПРОГНОЗ: {data.prediction?.date}</h3>
          <p style={s.forecastText}>РИСК ПРИ СРЫВЕ ДИПЛОМАТИИ: <strong>{data.prediction?.impact}%</strong>.</p>
        </div>
      </main>

      <style jsx global>{` @keyframes blink { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } } `}</style>
    </div>
  );
}

const s = {
  container: { background: '#000', color: '#0f4', fontFamily: 'monospace', minHeight: '100vh', padding: '20px' },
  header: { textAlign: 'center', marginBottom: '30px' },
  logo: { fontSize: '28px', letterSpacing: '4px' },
  statusBlock: { fontSize: '10px', color: '#006600' },
  grid: { maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' },
  card: { border: '1px solid #004400', padding: '15px', background: '#050505' },
  cardLayout: { display: 'flex', gap: '15px', alignItems: 'center' },
  cardContent: { flex: 1 },
  nodeTitle: { fontSize: '12px', color: '#fff', marginBottom: '10px', fontWeight: 'bold' },
  newsSection: { display: 'flex', flexDirection: 'column', gap: '5px' },
  newsItem: { fontSize: '11px', color: '#ccc' },
  infoBox: { borderTop: '1px solid #111', marginTop: '10px', paddingTop: '10px' },
  metricsList: { display: 'flex', gap: '15px', alignItems: 'center' },
  infoLabel: { fontSize: '9px', color: '#0f4' },
  metricItem: { fontSize: '9px', display: 'flex', alignItems: 'center', gap: '5px' },
  dot: { width: '6px', height: '6px', borderRadius: '50%' },
  forecastBox: { border: '1px solid #400', padding: '15px', textAlign: 'center', background: '#0a0000' },
  forecastTitle: { fontSize: '14px', color: '#ff3e3e' },
  forecastText: { fontSize: '11px', color: '#eee' },
  loader: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', color: '#0f4' }
};

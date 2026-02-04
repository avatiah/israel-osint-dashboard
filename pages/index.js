import React, { useEffect, useState } from 'react';

const IndexCard = ({ item }) => (
  <div style={styles.card}>
    <div style={styles.cardHeader}>
      <h3 style={styles.cardTitle}>{item.label}</h3>
      <span style={{...styles.range, color: item.color}}>{item.value}% {item.range}</span>
    </div>
    
    <div style={styles.gaugeContainer}>
      <div style={{...styles.progressBar, width: `${item.value}%`, backgroundColor: item.color}}></div>
    </div>

    <div style={styles.statusBadge}>{item.status}</div>
    <p style={styles.analysisText}>{item.analysis}</p>
    
    <div style={styles.sourceBox}>
      <span style={styles.sourceLabel}>ИСТОЧНИКИ (VERIFIED):</span>
      <div style={styles.links}>
        {item.sources.map((src, i) => (
          <a key={i} href={src.url} target="_blank" style={styles.link}>[{src.name}]</a>
        ))}
      </div>
    </div>
  </div>
);

export default function MadadHaOref() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/data').then(res => res.json()).then(setData);
  }, []);

  if (!data) return <div style={styles.loading}>LOADING_OSINT_NETWORK...</div>;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.mainTitle}>{data.project_name}</h1>
        <p style={styles.subtitle}>Система анализа угроз на основе ML-весов и OSINT</p>
      </header>

      <main style={styles.main}>
        {data.indices.map(item => <IndexCard key={item.id} item={item} />)}
        
        <section style={styles.methodologyBox}>
          <h4>МЕТОДОЛОГИЯ РАСЧЕТА</h4>
          <p>{data.methodology}</p>
          <small>Анализ включает данные: Tasnim (Иран), Al-Mayadeen (Ливан), Reuters (Запад).</small>
        </section>
      </main>

      <footer style={styles.footer}>
        <strong>ДИСКЛАЙМЕР:</strong> Проект поддерживается независимым OSINT-сообществом. Мы соблюдаем нейтральность, анализируя как западные, так и региональные (иранские/арабские) источники. Не является официальной информацией Службы тыла.
      </footer>
    </div>
  );
}

const styles = {
  container: { background: '#000', color: '#e0e0e0', fontFamily: 'monospace', minHeight: '100vh', padding: '15px' },
  header: { textAlign: 'center', marginBottom: '25px', borderBottom: '1px solid #1a1a1a', paddingBottom: '15px' },
  mainTitle: { color: '#00ff41', margin: 0, fontSize: '24px' },
  subtitle: { fontSize: '10px', color: '#555', marginTop: '5px' },
  main: { maxWidth: '600px', margin: '0 auto' },
  card: { background: '#0a0a0a', border: '1px solid #222', padding: '15px', marginBottom: '20px', borderRadius: '4px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  cardTitle: { fontSize: '14px', color: '#fff', margin: 0 },
  range: { fontSize: '16px', fontWeight: 'bold' },
  gaugeContainer: { background: '#111', height: '8px', borderRadius: '4px', overflow: 'hidden', marginBottom: '10px' },
  progressBar: { height: '100%', transition: 'width 1.5s ease' },
  statusBadge: { fontSize: '10px', fontWeight: 'bold', border: '1px solid #333', display: 'inline-block', padding: '2px 6px', marginBottom: '10px' },
  analysisText: { fontSize: '13px', color: '#bbb', lineHeight: '1.4', marginBottom: '15px' },
  sourceBox: { borderTop: '1px solid #1a1a1a', paddingTop: '10px' },
  sourceLabel: { fontSize: '9px', color: '#444', display: 'block', marginBottom: '5px' },
  links: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  link: { color: '#00ff41', fontSize: '11px', textDecoration: 'none' },
  methodologyBox: { background: '#080808', padding: '15px', fontSize: '11px', borderLeft: '2px solid #00ff41', color: '#666' },
  footer: { marginTop: '40px', fontSize: '10px', color: '#333', textAlign: 'justify', borderTop: '1px solid #111', paddingTop: '15px' },
  loading: { background: '#000', color: '#0f4', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace' }
};

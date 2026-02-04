import { useEffect, useState } from 'react';

const Gauge = ({ value, label, color, status }) => (
  <div style={styles.gaugeBox}>
    <h3 style={styles.label}>{label}</h3>
    <svg viewBox="0 0 100 55" style={styles.svg}>
      <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#222" strokeWidth="10" />
      <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke={color} 
            strokeWidth="10" strokeDasharray={`${value * 1.26}, 126`} style={{transition: 'all 1s'}} />
      <text x="50" y="45" textAnchor="middle" style={styles.gaugeVal}>{value}%</text>
    </svg>
    <div style={{color: color, fontWeight: 'bold', fontSize: '14px'}}>{status}</div>
  </div>
);

export default function MadadHaOref() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/data').then(res => res.json()).then(setData);
  }, []);

  if (!data) return <div style={styles.loading}>CONNECTING_TO_NODES...</div>;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>{data.project_name}</h1>
        <small>ОПЕРАТИВНЫЙ МОНИТОРИНГ: 2026-02-04</small>
      </header>

      {/* Спидометры */}
      <Gauge value={data.israel_index.value} label="БЕЗОПАСНОСТЬ ИЗРАИЛЯ" color={data.israel_index.color} status={data.israel_index.status} />
      
      <div style={styles.infoCard}>
        <strong>ПОЧЕМУ ТАКОЙ ИНДЕКС?</strong>
        <ul style={styles.list}>
          {data.israel_index.factors.map((f, i) => <li key={i}>{f}</li>)}
        </ul>
        <small style={styles.logicText}>{data.israel_index.logic}</small>
      </div>

      <hr style={styles.hr} />

      <Gauge value={data.strike_index.value} label="ВЕРОЯТНОСТЬ УДАРА США" color={data.strike_index.color} status={data.strike_index.status} />

      <div style={styles.infoCard}>
        <strong>АНАЛИЗ СИТУАЦИИ:</strong>
        <ul style={styles.list}>
          {data.strike_index.factors.map((f, i) => <li key={i}>{f}</li>)}
        </ul>
        <small style={styles.logicText}>{data.strike_index.logic}</small>
      </div>

      <div style={styles.explanationBox}>
        <h4>ДЛЯ ПОЛЬЗОВАТЕЛЯ:</h4>
        <p>Индексы рассчитываются на основе OSINT-аналитики (движение войск, спутниковые снимки, риторика). 
           <strong>Зеленый/Желтый</strong> цвет означает, что дипломатия всё ещё в приоритете.</p>
      </div>

      <footer style={styles.footer}>
        <strong>ДИСКЛАЙМЕР:</strong> Данный ресурс является частной OSINT-инициативой. 
        Информация не является официальной. В случае возникновения ЧС ориентируйтесь 
        исключительно на распоряжения Командования тыла (Pikud HaOref).
      </footer>
    </div>
  );
}

const styles = {
  container: { background: '#000', color: '#0f4', fontFamily: 'monospace', padding: '15px', minHeight: '100vh' },
  header: { textAlign: 'center', marginBottom: '30px', borderBottom: '1px solid #1a1a1a', paddingBottom: '10px' },
  title: { fontSize: '24px', margin: '0' },
  gaugeBox: { textAlign: 'center', marginBottom: '20px' },
  label: { fontSize: '14px', marginBottom: '10px' },
  svg: { width: '200px' },
  gaugeVal: { fill: '#fff', fontSize: '16px', fontWeight: 'bold' },
  infoCard: { background: '#0a0a0a', padding: '15px', border: '1px solid #1a1a1a', borderRadius: '4px', marginBottom: '30px' },
  list: { fontSize: '12px', color: '#ccc', paddingLeft: '15px', marginTop: '10px' },
  logicText: { fontSize: '10px', color: '#555', marginTop: '10px', display: 'block' },
  hr: { border: '0', borderTop: '1px solid #333', margin: '20px 0' },
  explanationBox: { background: '#111', padding: '15px', fontSize: '12px', borderLeft: '3px solid #0f4' },
  footer: { fontSize: '10px', color: '#444', marginTop: '40px', textAlign: 'justify', lineHeight: '1.4' },
  loading: { background: '#000', color: '#0f4', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }
};

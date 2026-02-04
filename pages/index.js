import { useEffect, useState } from 'react';

export default function MadadHaOref() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/data').then(res => res.json()).then(setData);
  }, []);

  if (!data) return <div style={styles.loading}>ИНИЦИАЛИЗАЦИЯ СИСТЕМЫ...</div>;

  return (
    <div style={styles.container}>
      {/* Шапка */}
      <header style={styles.header}>
        <h1 style={styles.title}>{data.project_name}</h1>
        <div style={styles.badge}>LIVE OSINT FEED</div>
      </header>

      {/* Основной Спидометр */}
      <section style={styles.section}>
        <div style={styles.gaugeContainer}>
          <svg viewBox="0 0 100 55" style={styles.gauge}>
            <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#222" strokeWidth="8" />
            <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke={getInsetColor(data.total_index)} 
                  strokeWidth="8" strokeDasharray={`${data.total_index * 1.26}, 126`} />
            <text x="50" y="45" textAnchor="middle" style={styles.gaugeText}>{data.total_index}</text>
          </svg>
          <p style={{color: getInsetColor(data.total_index)}}>{data.status_text}</p>
        </div>
      </section>

      {/* Объяснение для обывателя */}
      <section style={styles.card}>
        <h3>ЧТО ЭТО ЗНАЧИТ?</h3>
        <p style={styles.desc}>
          Этот индекс показывает вероятность эскалации. <strong>{data.total_index} из 100</strong> означает, что ситуация 
          напряжена до предела. Мы анализируем не слухи, а реальные движения войск и спутниковые снимки.
        </p>
      </section>

      {/* Прозрачный расчет */}
      <section style={styles.card}>
        <h3>КАК МЫ СЧИТАЕМ?</h3>
        <ul style={styles.list}>
          <li><strong>Военные (40% веса):</strong> {data.details.military_mobilization}% — учитываем пуски, учения и флот.</li>
          <li><strong>Слова (30% веса):</strong> {data.details.rhetoric}% — прямые угрозы Трампа и Хаменеи.</li>
          <li><strong>OSINT (20% веса):</strong> {data.details.osint_activity}% — свежие снимки ядерных объектов.</li>
        </ul>
        <small style={styles.formula}>{data.logic}</small>
      </section>

      {/* Футер с дисклаймером */}
      <footer style={styles.footer}>
        <p><strong>ДИСКЛАЙМЕР:</strong> Madad HaOref — это аналитический инструмент на основе открытых источников (OSINT). 
        Данные не являются официальной директивой Командования тыла. В случае сирены — немедленно следуйте в убежище.</p>
        <p>© 2026 Madad HaOref Project. Все права защищены.</p>
      </footer>
    </div>
  );
}

const getInsetColor = (val) => val > 75 ? '#ff4d4d' : val > 40 ? '#ffcc00' : '#00ff41';

const styles = {
  container: { background: '#000', color: '#e0e0e0', fontFamily: 'Courier New, monospace', minHeight: '100vh', padding: '15px' },
  header: { textAlign: 'center', borderBottom: '1px solid #333', paddingBottom: '10px' },
  title: { color: '#00ff41', fontSize: '1.4rem', margin: '10px 0' },
  badge: { display: 'inline-block', background: '#00ff41', color: '#000', padding: '2px 8px', fontSize: '10px', fontWeight: 'bold' },
  section: { padding: '20px 0', textAlign: 'center' },
  gaugeContainer: { position: 'relative' },
  gauge: { width: '100%', maxWidth: '300px' },
  gaugeText: { fontSize: '12px', fontWeight: 'bold', fill: '#fff' },
  card: { background: '#0a0a0a', border: '1px solid #1a1a1a', padding: '15px', marginBottom: '15px', borderRadius: '4px' },
  desc: { fontSize: '14px', lineHeight: '1.5', color: '#bbb' },
  list: { textAlign: 'left', fontSize: '13px', paddingLeft: '15px', color: '#0f4' },
  formula: { fontSize: '10px', color: '#555', display: 'block', marginTop: '10px' },
  footer: { fontSize: '11px', color: '#444', textAlign: 'justify', borderTop: '1px solid #222', paddingTop: '20px' },
  loading: { background: '#000', color: '#0f4', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }
};

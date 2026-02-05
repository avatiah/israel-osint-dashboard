import React, { useEffect, useState } from 'react';

export default function MadadHaOref() {
  const [data, setData] = useState(null);

  const load = () => fetch('/api/data').then(r => r.json()).then(d => d.nodes && setData(d)).catch(e => {});

  useEffect(() => {
    load();
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
  }, []);

  if (!data) return <div style={s.loader}>ПОДКЛЮЧЕНИЕ К OSINT-СЕТИ...</div>;

  return (
    <div style={s.container}>
      <header style={s.header}>
        <div style={s.logo}>MADAD HAOREF // ТЕРМИНАЛ БЕЗОПАСНОСТИ</div>
        <div style={s.time}>{new Date(data.timestamp).toLocaleString()}</div>
      </header>

      <div style={s.main}>
        {data.nodes.map(node => (
          <div key={node.id} style={s.card}>
            <div style={s.cardTop}>
              <span style={s.cardLabel}>{node.title}</span>
              <span style={{...s.val, color: node.value > 60 ? '#f44' : '#0f4'}}>{node.value}%</span>
            </div>

            <div style={s.newsList}>
              {node.news.map((n, i) => (
                <div key={i} style={s.newsItem}>
                  <span style={s.newsSrc}>[{n.src}]</span> {n.txt}
                </div>
              ))}
            </div>

            <div style={s.expertBox}>
              <span style={{color: '#0f4'}}>МНЕНИЕ ЭКСПЕРТА:</span> {node.expert}
            </div>
            
            <div style={s.method}>Источник: GDELT, CENTCOM, ISW. Метод: Весовой анализ событий.</div>
          </div>
        ))}

        <div style={s.disclaimer}>
          <strong>ОТКАЗ ОТ ОТВЕТСТВЕННОСТИ:</strong> Данные являются агрегацией открытых источников и вероятностной моделью. 
          Madad HaOref не несет ответственности за действия, предпринятые на основе этой информации. 
          Следите за официальными сообщениями Службы тыла (Pikud HaOref).
        </div>
      </div>
    </div>
  );
}

const s = {
  container: { background: '#000', color: '#0f4', fontFamily: 'monospace', minHeight: '100vh', padding: '15px', textTransform: 'uppercase' },
  header: { display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1a1a1a', paddingBottom: '10px', marginBottom: '20px' },
  logo: { fontSize: '18px', fontWeight: 'bold' },
  time: { fontSize: '10px', color: '#444' },
  main: { maxWidth: '650px', margin: '0 auto' },
  card: { border: '1px solid #222', padding: '15px', background: '#050505', marginBottom: '20px' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
  cardLabel: { fontSize: '12px', color: '#888' },
  val: { fontSize: '36px', fontWeight: 'bold' },
  newsList: { borderLeft: '1px solid #1a1a1a', paddingLeft: '10px', marginBottom: '15px' },
  newsItem: { fontSize: '11px', color: '#ccc', textTransform: 'none', marginBottom: '6px', lineHeight: '1.4' },
  newsSrc: { color: '#0f4', marginRight: '5px', fontWeight: 'bold' },
  expertBox: { background: '#0a0a0a', padding: '10px', fontSize: '11px', color: '#eee', textTransform: 'none', border: '1px solid #111' },
  method: { fontSize: '8px', color: '#222', marginTop: '10px' },
  disclaimer: { fontSize: '9px', color: '#333', textAlign: 'justify', borderTop: '1px dotted #222', paddingTop: '15px' },
  loader: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f4', background: '#000' }
};

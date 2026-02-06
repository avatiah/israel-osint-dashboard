import React, { useEffect, useState } from 'react';

const translations = {
  ru: {
    traffic: "ТРАФИК ИРАНА (ИНТЕРНЕТ)",
    forecast: "СТРАТЕГИЧЕСКИЙ ПРОГНОЗ",
    risk: "РИСК ЭСКАЛАЦИИ (OSINT DATA)",
    metrics: "МЕТРИКИ",
    disclaimer: "ВНИМАНИЕ: ЖИВОЙ ПОТОК ДАННЫХ ИЗ МИРОВЫХ СМИ. ЯЗЫК ОРИГИНАЛА: EN.",
    status: "СВЯЗЬ_OSINT: LIVE",
    trend_up: "▲ RISK INCREASE",
    trend_stable: "▼ STABLE"
  },
  en: {
    traffic: "IRAN INTERNET TRAFFIC",
    forecast: "STRATEGIC FORECAST",
    risk: "ESCALATION RISK (OSINT DATA)",
    metrics: "METRICS",
    disclaimer: "NOTICE: LIVE GLOBAL MEDIA FEED. ORIGINAL LANGUAGE: EN.",
    status: "OSINT_LINK: LIVE",
    trend_up: "▲ RISK INCREASE",
    trend_stable: "▼ STABLE"
  }
};

const highlightCritical = (text) => {
  if (!text) return "";
  const words = ["WARNING", "UAV", "strike", "attack", "B-52", "missile", "death", "killed", "military"];
  let formatted = String(text);
  words.forEach(word => {
    const reg = new RegExp(`(${word})`, "gi");
    formatted = formatted.replace(reg, '<span style="color:#ff3e3e;font-weight:bold">$1</span>');
  });
  return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
};

const Gauge = ({ value, color, trendLabel, isUp }) => (
  <div style={{ textAlign: 'center' }}>
    <svg width="120" height="85" viewBox="0 0 100 75">
      <path d="M 10 55 A 40 40 0 0 1 90 55" fill="none" stroke="#111" strokeWidth="8" strokeLinecap="round" />
      <path d="M 10 55 A 40 40 0 0 1 90 55" fill="none" stroke={color} strokeWidth="8" 
            strokeDasharray={Math.PI * 40} 
            strokeDashoffset={(Math.PI * 40) - (value / 100) * (Math.PI * 40)} 
            strokeLinecap="round" style={{ transition: 'stroke-dashoffset 2s ease-out' }} />
      <text x="50" y="45" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="bold" fontFamily="monospace">{value}%</text>
      <text x="50" y="65" textAnchor="middle" fill={isUp ? '#f33' : '#0f4'} fontSize="7" fontWeight="bold" fontFamily="monospace">
        {trendLabel}
      </text>
    </svg>
  </div>
);

export default function TerminalV16() {
  const [lang, setLang] = useState('en');
  const [data, setData] = useState(null);

  useEffect(() => {
    const savedLang = localStorage.getItem('osint_lang');
    if (savedLang) setLang(savedLang);

    const update = async () => {
      try {
        const res = await fetch('/api/data');
        const json = await res.json();
        setData(json);
      } catch (e) { console.error("Update failed"); }
    };
    update();
    const timer = setInterval(update, 20000); // 20 секунд для щадящего режима API
    return () => clearInterval(timer);
  }, []);

  const changeLang = (l) => { setLang(l); localStorage.setItem('osint_lang', l); };

  if (!data) return <div style={s.loader}>ESTABLISHING_SECURE_FEED...</div>;

  const t = translations[lang];

  return (
    <div style={s.container}>
      <div style={s.topBar}>
        <div style={s.apiIndicator}>
          <span style={s.dot} />
          <span style={s.apiText}>{t.status}</span>
        </div>
        <div style={s.langSwitcher}>
          <button onClick={() => changeLang('ru')} style={{...s.langBtn, color: lang === 'ru' ? '#0f4' : '#030'}}>RU</button>
          <span style={{color: '#030'}}>|</span>
          <button onClick={() => changeLang('en')} style={{...s.langBtn, color: lang === 'en' ? '#0f4' : '#030'}}>EN</button>
        </div>
      </div>

      <header style={s.header}>
        <h1 style={s.logo}>MADAD HAOREF</h1>
        <div style={s.meta}>GLOBAL_THREAT_TERMINAL // V16.0 // {new Date(data.timestamp).toLocaleTimeString()} UTC</div>
      </header>

      <main style={s.grid}>
        {data.nodes.map(node => (
          <div key={node.id} style={s.card}>
            <div style={s.cardLayout}>
              <Gauge 
                value={node.value} 
                color={parseFloat(node.value) > 55 ? '#f33' : '#0f4'} 
                trendLabel={node.trend === 'up' ? t.trend_up : t.trend_stable}
                isUp={node.trend === 'up'}
              />
              <div style={s.cardContent}>
                <div style={s.nodeTitle}>{node.title?.[lang]}</div>
                <div style={s.newsSection}>
                  {node.news.length > 0 ? node.news.map((n, i) => (
                    <div key={i} style={s.newsItem}>
                      <span style={s.newsSrc}>[{n.src.substring(0,10)}]</span> {highlightCritical(n.txt)}
                    </div>
                  )) : <div style={{color: '#333', fontSize: '10px'}}>SEARCHING_LIVE_HEADLINES...</div>}
                </div>
              </div>
            </div>
            <div style={s.infoBox}>
              <div style={s.metricsList}>
                <span style={s.infoLabel}>{t.metrics}:</span>
                <span style={s.metricItem}>{t.traffic}: <b style={{color:'#0f4'}}>{data.netConnectivity?.score}%</b></span>
                <span style={s.metricItem}>SIGNAL: <b style={{color:'#888'}}>REALTIME_RSS</b></span>
              </div>
            </div>
          </div>
        ))}

        <div style={s.forecastBox}>
          <div style={s.forecastTitle}>⚠️ {t.forecast}: {data.prediction?.date}</div>
          <div style={s.forecastText}>AGGREGATED_IMPACT_INDEX: <strong>{data.prediction?.impact}%</strong></div>
        </div>
      </main>

      <footer style={s.footer}>
        <p style={s.disclaimer}>{t.disclaimer}</p>
        <div style={{fontSize: '9px', color: '#030', marginTop: '10px', letterSpacing: '2px'}}>NON_SIMULATED_DATA_STREAM</div>
      </footer>
    </div>
  );
}

const s = {
  container: { background: '#000', color: '#0f4', fontFamily: 'monospace', minHeight: '100vh', padding: '25px 15px' },
  topBar: { maxWidth: '650px', margin: '0 auto 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  langSwitcher: { display: 'flex', gap: '10px', fontSize: '12px', border: '1px solid #005500', padding: '5px 10px' },
  langBtn: { background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'monospace', fontWeight: 'bold' },
  apiIndicator: { display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #005500', padding: '5px 10px' },
  apiText: { fontSize: '9px' },
  dot: { width: '7px', height: '7px', borderRadius: '50%', background: '#0f4', boxShadow: '0 0 8px #0f4' },
  header: { textAlign: 'center', marginBottom: '40px' },
  logo: { fontSize: '26px', letterSpacing: '10px', fontWeight: 'bold' },
  meta: { fontSize: '10px', color: '#004400' },
  grid: { width: '100%', maxWidth: '650px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' },
  card: { border: '1px solid #005500', padding: '20px', background: '#050505' },
  cardLayout: { display: 'flex', gap: '20px', flexWrap: 'wrap' },
  cardContent: { flex: 1 },
  nodeTitle: { fontSize: '13px', color: '#fff', fontWeight: 'bold', borderBottom: '1px solid #005500', paddingBottom: '5px', marginBottom: '10px' },
  newsSection: { display: 'flex', flexDirection: 'column', gap: '12px' },
  newsItem: { fontSize: '11px', color: '#ccc', lineHeight: '1.4' },
  newsSrc: { color: '#0f4', fontWeight: 'bold' },
  infoBox: { borderTop: '1px solid #005500', marginTop: '15px', paddingTop: '10px' },
  metricsList: { display: 'flex', gap: '15px' },
  infoLabel: { fontSize: '9px', color: '#0f4' },
  metricItem: { fontSize: '9px', color: '#444' },
  forecastBox: { border: '1px solid #800', padding: '20px', background: '#0a0000', textAlign: 'center' },
  forecastTitle: { fontSize: '13px', color: '#f33' },
  forecastText: { fontSize: '11px', color: '#fff' },
  footer: { marginTop: '50px', textAlign: 'center', borderTop: '1px solid #003300', paddingTop: '20px' },
  disclaimer: { fontSize: '8px', color: '#444' },
  loader: { height: '100vh', background: '#000', color: '#0f4', display: 'flex', alignItems: 'center', justifyContent: 'center' }
};

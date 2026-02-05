import React, { useEffect, useState } from 'react';

const translations = {
  ru: {
    traffic: "ТРАФИК ИРАНА (ИНТЕРНЕТ)",
    forecast: "СТРАТЕГИЧЕСКИЙ ПРОГНОЗ",
    risk: "РИСК ЭСКАЛАЦИИ ПРИ СРЫВЕ ДИПЛОМАТИИ",
    metrics: "МЕТРИКИ",
    disclaimer: "ОТКАЗ ОТ ОТВЕТСТВЕННОСТИ: ДАННЫЕ АГРЕГИРОВАНЫ ИЗ ОТКРЫТЫХ ИСТОЧНИКОВ. НЕ ЯВЛЯЕТСЯ ДИРЕКТИВОЙ СЛУЖБ БЕЗОПАСНОСТИ.",
    status: "СВЯЗЬ_OSINT: ОПТИМАЛЬНО",
    trend_up: "▲ РОСТ РИСКА",
    trend_stable: "▼ СТАБИЛЬНО",
    loading: "ПОДКЛЮЧЕНИЕ К УЗЛАМ..."
  },
  en: {
    traffic: "IRAN INTERNET TRAFFIC",
    forecast: "STRATEGIC FORECAST",
    risk: "ESCALATION RISK IF DIPLOMACY FAILS",
    metrics: "METRICS",
    disclaimer: "DISCLAIMER: DATA AGGREGATED FROM OPEN OSINT SOURCES. NOT AN OFFICIAL SECURITY DIRECTIVE.",
    status: "OSINT_LINK: OPTIMAL",
    trend_up: "▲ RISK INCREASE",
    trend_stable: "▼ STABLE",
    loading: "CONNECTING TO NODES..."
  }
};

const highlightCritical = (text) => {
  const words = ["WARNING", "ПРЕДУПРЕЖДЕНИЕ", "БПЛА", "UAV", "strike", "удар", "B-52", "deployment", "переброска"];
  let formatted = text;
  words.forEach(word => {
    const reg = new RegExp(`(${word})`, "gi");
    formatted = formatted.replace(reg, '<span style="color:#ff3e3e;font-weight:bold">$1</span>');
  });
  return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
};

const Gauge = ({ value, color, trend, trendLabel }) => {
  const circumference = Math.PI * 40;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div style={{ textAlign: 'center' }}>
      <svg width="110" height="65" viewBox="0 0 100 60">
        <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#1a1a1a" strokeWidth="8" strokeLinecap="round" />
        <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke={color} strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 2s ease-out' }} />
        <text x="50" y="45" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="bold">{value}%</text>
        <text x="50" y="20" textAnchor="middle" fill={trend === 'up' ? '#f33' : '#0f4'} fontSize="7" fontWeight="bold">{trendLabel}</text>
      </svg>
    </div>
  );
};

export default function TerminalV15_3() {
  const [lang, setLang] = useState('en'); // По умолчанию ENGLISH
  const [data, setData] = useState(null);

  useEffect(() => {
    // Загрузка сохраненного языка
    const savedLang = localStorage.getItem('osint_lang');
    if (savedLang) setLang(savedLang);

    const update = async () => {
      try {
        const res = await fetch('/api/data');
        const json = await res.json();
        setData(json);
      } catch (e) { console.error("STREAM_ERROR"); }
    };
    update();
    const timer = setInterval(update, 15000);
    return () => clearInterval(timer);
  }, []);

  const changeLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem('osint_lang', newLang);
  };

  if (!data) return <div style={s.loader}>SYSTEM_BOOT_INITIALIZING...</div>;

  const t = translations[lang];
  const isNotamActive = data.nodes?.some(node => node.news?.some(n => /WARNING|ПРЕДУПРЕЖДЕНИЕ|БПЛА|UAV/i.test(n.txt[lang])));

  return (
    <div style={{
      ...s.container,
      border: isNotamActive ? '2px solid #900' : '1px solid #004400',
    }}>
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
        <div style={s.meta}>V15.3 // {lang.toUpperCase()}_STRATEGIC_PULSE // {new Date().toLocaleTimeString()} UTC</div>
      </header>

      <main style={s.grid}>
        {data.nodes.map(node => (
          <div key={node.id} style={s.card}>
            <div style={s.cardLayout}>
              <Gauge 
                value={node.value} 
                color={parseFloat(node.value) > 60 ? '#f33' : '#0f4'} 
                trend={node.trend} 
                trendLabel={node.trend === 'up' ? t.trend_up : t.trend_stable}
              />
              <div style={s.cardContent}>
                <div style={s.nodeTitle}>{node.title[lang]}</div>
                <div style={s.newsSection}>
                  {node.news.map((n, i) => (
                    <div key={i} style={s.newsItem}>
                      <span style={s.newsSrc}>[{n.src}]</span> {highlightCritical(n.txt[lang])}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={s.infoBox}>
              <div style={s.metricsList}>
                <span style={s.infoLabel}>{t.metrics}:</span>
                <span style={s.metricItem}>{t.traffic}: <b style={{color:'#0f4'}}>{data.netConnectivity.score}%</b></span>
                <span style={s.metricItem}>DIPLOMACY: <b style={{color:'#888'}}>CRITICAL</b></span>
                <span style={s.metricItem}>OSINT_SENTIMENT: <b style={{color:'#fff'}}>{node.value}%</b></span>
              </div>
            </div>
          </div>
        ))}

        <div style={s.forecastBox}>
          <div style={s.forecastTitle}>⚠️ {t.forecast}: {data.prediction.date}</div>
          <div style={s.forecastText}>{t.risk}: <strong>{data.prediction.impact}%</strong></div>
        </div>
      </main>

      <footer style={s.footer}>
        <p style={s.disclaimer}>{t.disclaimer}</p>
        <div style={s.footerMeta}>MADAD HAOREF // TACTICAL_TERMINAL_2026</div>
      </footer>
    </div>
  );
}

const s = {
  container: { background: '#000', color: '#0f4', fontFamily: 'monospace', minHeight: '100vh', padding: '30px 15px', position: 'relative', boxSizing: 'border-box' },
  topBar: { maxWidth: '650px', margin: '0 auto 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  langSwitcher: { display: 'flex', gap: '10px', fontSize: '12px', border: '1px solid #003300', padding: '5px 10px', background: '#050505' },
  langBtn: { background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'monospace', fontWeight: 'bold' },
  apiIndicator: { display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #003300', padding: '5px 10px' },
  apiText: { fontSize: '9px', letterSpacing: '1px' },
  dot: { width: '7px', height: '7px', borderRadius: '50%', background: '#0f4', boxShadow: '0 0 8px #0f4' },
  header: { textAlign: 'center', marginBottom: '40px' },
  logo: { fontSize: '24px', letterSpacing: '8px', fontWeight: 'bold' },
  meta: { fontSize: '10px', color: '#006600', marginTop: '5px' },
  grid: { width: '100%', maxWidth: '650px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' },
  card: { border: '1px solid #005500', padding: '20px', background: '#050505' },
  cardLayout: { display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' },
  cardContent: { flex: 1 },
  nodeTitle: { fontSize: '12px', color: '#fff', fontWeight: 'bold', marginBottom: '12px', borderBottom: '1px solid #003300', paddingBottom: '5px' },
  newsSection: { display: 'flex', flexDirection: 'column', gap: '8px' },
  newsItem: { fontSize: '11px', color: '#ccc', lineHeight: '1.4' },
  newsSrc: { color: '#0f4', fontWeight: 'bold' },
  infoBox: { borderTop: '1px solid #003300', marginTop: '15px', paddingTop: '15px' },
  metricsList: { display: 'flex', gap: '15px', flexWrap: 'wrap' },
  infoLabel: { fontSize: '9px', color: '#0f4', fontWeight: 'bold' },
  metricItem: { fontSize: '9px', color: '#444' },
  forecastBox: { border: '1px solid #800', padding: '20px', background: '#0a0000', textAlign: 'center' },
  forecastTitle: { fontSize: '12px', color: '#f33', marginBottom: '8px' },
  forecastText: { fontSize: '11px', color: '#fff' },
  footer: { marginTop: '60px', textAlign: 'center', borderTop: '1px solid #003300', paddingTop: '20px' },
  disclaimer: { fontSize: '8px', color: '#444', maxWidth: '500px', margin: '0 auto' },
  footerMeta: { fontSize: '8px', color: '#003300', marginTop: '10px' },
  loader: { height: '100vh', background: '#000', color: '#0f4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }
};

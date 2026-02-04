import React, { useEffect, useState } from 'react';

const Gauge = ({ value = 0, label, color, status }) => (
  <div style={{ textAlign: 'center', marginBottom: '30px' }}>
    <h3 style={{ fontSize: '14px', color: '#888', marginBottom: '12px' }}>{label}</h3>
    <svg viewBox="0 0 100 55" style={{ width: '100%', maxWidth: '260px' }}>
      <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#1a1a1a" strokeWidth="10" />
      <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke={color} strokeWidth="10" 
            strokeDasharray={`${(value || 0) * 1.26}, 126`} style={{ transition: 'stroke-dasharray 1s ease' }} />
      <text x="50" y="45" textAnchor="middle" style={{ fill: '#fff', fontSize: '16px', fontWeight: 'bold', fontFamily: 'monospace' }}>{value}%</text>
    </svg>
    <div style={{ color: color, fontWeight: 'bold', letterSpacing: '1px', marginTop: '8px', fontSize: '14px' }}>{status}</div>
  </div>
);

export default function MadadHaOref() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/data')
      .then(res => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then(json => setData(json))
      .catch(err => {
        console.error(err);
        setError(true);
      });
  }, []);

  if (error) return <div style={{background:'#000', color:'red', padding:'20px'}}>SYSTEM_ERROR: КРИТИЧЕСКИЙ СБОЙ ДАННЫХ</div>;
  if (!data) return <div style={{background:'#000', color:'#0f4', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace'}}>INIT_SECURE_LINK...</div>;

  return (
    <div style={{ background: '#000', color: '#e0e0e0', fontFamily: 'monospace', minHeight: '100vh', padding: '20px', textTransform: 'uppercase' }}>
      <header style={{ textAlign: 'center', borderBottom: '1px solid #222', paddingBottom: '20px', marginBottom: '30px' }}>
        <h1 style={{ color: '#00ff41', margin: 0, fontSize: '24px', letterSpacing: '2px' }}>{data?.project_name}</h1>
        <small style={{ color: '#555' }}>ANALYSIS TIMESTAMP: 2026-02-04 12:30 UTC</small>
      </header>

      <main style={{ maxWidth: '500px', margin: '0 auto' }}>
        {/* Индекс Израиля */}
        <section style={{ marginBottom: '50px' }}>
          <Gauge value={data?.israel_index?.value} label="SECURITY_INDEX_ISRAEL" color={data?.israel_index?.color} status={data?.israel_index?.status} />
          <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', padding: '15px', borderRadius: '2px' }}>
            <strong style={{ color: '#00ff41', fontSize: '14px' }}>ПОЧЕМУ ЭТО ВАЖНО:</strong>
            <p style={{ color: '#aaa', fontSize: '13px', marginTop: '10px', lineHeight: '1.5', textTransform: 'none' }}>{data?.israel_index?.analysis}</p>
            <div style={{ borderTop: '1px solid #222', marginTop: '10px', paddingTop: '10px', fontSize: '10px', color: '#444' }}>{data?.israel_index?.logic}</div>
          </div>
        </section>

        {/* Индекс США/Иран */}
        <section style={{ marginBottom: '50px' }}>
          <Gauge value={data?.strike_index?.value} label="US_STRIKE_PROBABILITY" color={data?.strike_index?.color} status={data?.strike_index?.status} />
          <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', padding: '15px', borderRadius: '2px' }}>
            <strong style={{ color: '#00ff41', fontSize: '14px' }}>ГЕОПОЛИТИЧЕСКИЙ ВЕКТОР:</strong>
            <p style={{ color: '#aaa', fontSize: '13px', marginTop: '10px', lineHeight: '1.5', textTransform: 'none' }}>{data?.strike_index?.analysis}</p>
            <div style={{ borderTop: '1px solid #222', marginTop: '10px', paddingTop: '10px', fontSize: '10px', color: '#444' }}>{data?.strike_index?.logic}</div>
          </div>
        </section>
      </main>

      <footer style={{ borderTop: '1px solid #222', paddingTop: '20px', fontSize: '11px', color: '#555', textAlign: 'justify', lineHeight: '1.4' }}>
        <strong>DISCLAIMER:</strong> MADAD HAOREF — НЕЗАВИСИМЫЙ АНАЛИТИЧЕСКИЙ РЕСУРС. ИНДЕКСЫ РАССЧИТАНЫ НА ОСНОВЕ ПУБЛИЧНЫХ ОТЧЕТОВ ISW, INSS И OSINT-МОНИТОРИНГА. ЭТИ ДАННЫЕ НЕ ЯВЛЯЮТСЯ ОФИЦИАЛЬНЫМИ РЕКОМЕНДАЦИЯМИ. В СЛУЧАЕ ТРЕВОГИ СЛЕДУЙТЕ ИНСТРУКЦИЯМ СЛУЖБЫ ТЫЛА (PIKUD HAOREF).
      </footer>
    </div>
  );
}

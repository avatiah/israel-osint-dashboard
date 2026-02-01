export default async function handler(req, res) {
  try {
    const RSS_URL = 'https://news.google.com/rss/search?q=Israel+military+strategic+intelligence+forecast&hl=en-US';
    const response = await fetch(RSS_URL);
    const xml = await response.text();
    const titles = [...xml.matchAll(/<title>(.*?)<\/title>/g)].map(m => m[1]).slice(1, 25);

    let counts = { kinetic: 0, strategic: 0, systemic: 0 };
    let keyArgument = "No significant strategic shifts detected in the last 60 minutes.";
    
    // Logic to find the "Key Argument"
    const expertTitles = titles.filter(t => /(analysis|indicates|shows|expert|forecast|warns)/i.test(t));
    if (expertTitles.length > 0) {
      // Prioritize titles that look like detailed conclusions
      keyArgument = expertTitles.reduce((a, b) => a.length > b.length ? a : b).split(' - ')[0];
    }

    titles.forEach(t => {
      const text = t.toLowerCase();
      if (/(missile|strike|attack|clash|border|idf)/.test(text)) counts.kinetic++;
      if (/(analysis|forecast|strategic|intelligence|report|isw)/.test(text)) counts.strategic++;
      if (/(cyber|market|economy|bank|currency|ils)/.test(text)) counts.systemic++;
    });

    const f1 = Math.min(counts.kinetic * 6, 40);   
    const f2 = Math.min(counts.strategic * 8, 40); 
    const f3 = Math.min(counts.systemic * 5, 20);     

    const totalIndex = 12 + f1 + f2 + f3; 

    res.status(200).json({
      index: Math.min(Math.round(totalIndex), 100),
      breakdown: [
        { name: 'KINETIC_ACTIVITY', value: f1, desc: 'Direct military engagements, strikes, and border incidents.' },
        { name: 'STRATEGIC_FORECAST', value: f2, desc: 'Expert projections, intelligence reports, and geopolitical shifts.' },
        { name: 'SYSTEMIC_STRESS', value: f3, desc: 'Cyber-attacks, market volatility, and critical infrastructure pressure.' }
      ],
      key_argument: keyArgument,
      last_update: new Date().toISOString()
    });
  } catch (e) {
    res.status(500).json({ error: "CALIBRATION_FAILED" });
  }
}

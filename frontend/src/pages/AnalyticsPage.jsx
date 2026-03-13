import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Plug, Download, Image } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const COLORS = ['#00E5FF', '#7C3AED', '#00FF87', '#FF6B6B', '#FFB347'];
const TS = { background: '#111520', border: '1px solid #1E2535', borderRadius: '8px', fontSize: 11, fontFamily: 'IBM Plex Mono' };
const AS = { fontSize: 11, fill: '#718096', fontFamily: 'IBM Plex Mono' };

export default function AnalyticsPage() {
  const { activeIntegration, liveData, mode, stressData } = useApp();
  const navigate = useNavigate();
  const pageRef = useRef(null);
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [stressTrend, setStressTrend] = useState([]);
  const [exporting, setExporting] = useState('');

  useEffect(() => {
    if (!activeIntegration) return;
    generate();
    const iv = setInterval(generate, 5000);
    return () => clearInterval(iv);
  }, [activeIntegration, liveData, mode, stressData]);

  // Build stress trend history
  useEffect(() => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setStressTrend(prev => [...prev.slice(-19), { time: now, score: stressData.score, alertSeverity: stressData.alertSeverity, kpiVolatility: stressData.kpiVolatility }]);
  }, [stressData]);

  const generate = () => {
    const now = new Date();
    const pts = 10;
    if (activeIntegration === 'news') {
      const base = mode === 'crisis' ? 20 : mode === 'opportunity' ? 78 : 52;
      setChartData(Array.from({ length: pts }, (_, i) => ({ time: new Date(now - (pts - i) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), sentiment: Math.max(0, Math.min(100, base + (Math.random() - 0.5) * 18)), articles: Math.floor(Math.random() * 8) + 2, breaking: Math.floor(Math.random() * 3) })));
      setPieData([{ name: 'Business', value: 30 }, { name: 'Technology', value: 22 }, { name: 'Finance', value: 18 }, { name: 'Politics', value: 15 }, { name: 'Other', value: 15 }]);
    }
    if (activeIntegration === 'weather' && liveData.weather) {
      const base = liveData.weather.temp;
      setChartData(Array.from({ length: pts }, (_, i) => ({ time: new Date(now - (pts - i) * 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), temperature: parseFloat((base + (Math.random() - 0.5) * 4).toFixed(1)), humidity: Math.max(0, Math.min(100, liveData.weather.humidity + (Math.random() - 0.5) * 8)), windSpeed: Math.max(0, liveData.weather.windSpeed + (Math.random() - 0.5) * 4), rainProb: Math.floor(Math.random() * 30) + (mode === 'crisis' ? 50 : 10) })));
      setPieData([{ name: 'Clear', value: mode === 'crisis' ? 10 : 40 }, { name: 'Cloudy', value: 25 }, { name: 'Rain', value: mode === 'crisis' ? 40 : 15 }, { name: 'Storm', value: mode === 'crisis' ? 25 : 5 }, { name: 'Snow', value: 15 }]);
    }
    if (activeIntegration === 'stocks' && liveData.stocks?.length) {
      const base = parseFloat(liveData.stocks[0]?.price || 150);
      setChartData(Array.from({ length: pts }, (_, i) => ({ time: new Date(now - (pts - i) * 1800000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), price: parseFloat((base * (1 + (Math.random() - 0.5) * 0.04)).toFixed(2)), volume: Math.floor(Math.random() * 5000000) + 1000000, change: parseFloat(((Math.random() - 0.5) * 2).toFixed(2)) })));
      setPieData(liveData.stocks.map(s => ({ name: s.symbol, value: Math.abs(parseFloat(s.price)) })));
    }
  };

  const exportPDF = async () => {
    setExporting('pdf');
    try {
      const { default: jsPDF } = await import('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js').then(() => ({ default: window.jspdf.jsPDF }));
      const doc = new jsPDF();
      doc.setFontSize(20); doc.setTextColor(0, 229, 255); doc.text('OpsPulse Analytics Report', 20, 20);
      doc.setFontSize(11); doc.setTextColor(100, 100, 100);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 32);
      doc.text(`Integration: ${activeIntegration || 'None'}`, 20, 42);
      doc.text(`Mode: ${mode}`, 20, 52);
      doc.setFontSize(14); doc.setTextColor(0, 229, 255); doc.text('Business Stress Score', 20, 68);
      doc.setFontSize(36); doc.setTextColor(255, 107, 107); doc.text(`${stressData.score}`, 20, 88);
      doc.setFontSize(11); doc.setTextColor(100, 100, 100);
      const scoreLabel = stressData.score >= 81 ? 'Crisis' : stressData.score >= 61 ? 'High Stress' : stressData.score >= 31 ? 'Moderate' : 'Stable';
      doc.text(`Status: ${scoreLabel}`, 20, 98);
      doc.setFontSize(14); doc.setTextColor(0, 229, 255); doc.text('Stress Score Breakdown', 20, 114);
      doc.setFontSize(11); doc.setTextColor(60, 60, 60);
      doc.text(`Alert Severity (40%): ${stressData.alertSeverity}/100`, 20, 126);
      doc.text(`KPI Volatility (30%): ${stressData.kpiVolatility}/100`, 20, 136);
      doc.text(`External Signal Risk (20%): ${stressData.externalSignalRisk}/100`, 20, 146);
      doc.text(`Anomaly Frequency (10%): ${stressData.anomalyFrequency}/100`, 20, 156);
      doc.setFontSize(14); doc.setTextColor(0, 229, 255); doc.text('Score Formula', 20, 172);
      doc.setFontSize(10); doc.setTextColor(80, 80, 80);
      doc.text('Stress Score = (0.40 × Alert Severity) + (0.30 × KPI Volatility)', 20, 184);
      doc.text('              + (0.20 × External Signal Risk) + (0.10 × Anomaly Frequency)', 20, 194);
      doc.save(`OpsPulse_Analytics_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch {
      // fallback simple export
      const content = `OpsPulse Analytics Report\n\nGenerated: ${new Date().toLocaleString()}\nIntegration: ${activeIntegration}\nMode: ${mode}\nStress Score: ${stressData.score}\n\nBreakdown:\nAlert Severity (40%): ${stressData.alertSeverity}\nKPI Volatility (30%): ${stressData.kpiVolatility}\nExternal Signal Risk (20%): ${stressData.externalSignalRisk}\nAnomaly Frequency (10%): ${stressData.anomalyFrequency}`;
      const blob = new Blob([content], { type: 'text/plain' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'OpsPulse_Analytics.txt'; a.click();
    }
    setExporting('');
  };

  const exportImage = async () => {
    setExporting('img');
    try {
      const html2canvas = (await import('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js')).default || window.html2canvas;
      const canvas = await html2canvas(pageRef.current, { backgroundColor: '#0A0E1A', scale: 1.5 });
      const a = document.createElement('a'); a.href = canvas.toDataURL('image/png'); a.download = 'OpsPulse_Analytics.png'; a.click();
    } catch {
      alert('Export as image requires html2canvas. Please run: npm install html2canvas jspdf');
    }
    setExporting('');
  };

  const score = stressData.score;
  const scoreColor = score >= 81 ? '#FF6B6B' : score >= 61 ? '#FFB347' : score >= 31 ? '#00E5FF' : '#00FF87';
  const scoreLabel = score >= 81 ? 'Crisis' : score >= 61 ? 'High Stress' : score >= 31 ? 'Moderate' : 'Stable';

  const MODEL_COMPONENTS = [
    { label: 'Alert Severity', weight: '40%', value: stressData.alertSeverity, desc: 'Measures seriousness of alerts triggered in the system. Critical alerts push this score high.', color: 'text-danger', border: 'border-danger/30', bg: 'bg-danger/5' },
    { label: 'KPI Volatility', weight: '30%', value: stressData.kpiVolatility, desc: 'Measures sudden fluctuations in KPIs over time. High variance in KPI values increases this score.', color: 'text-warning', border: 'border-warning/30', bg: 'bg-warning/5' },
    { label: 'External Signal Risk', weight: '20%', value: stressData.externalSignalRisk, desc: 'Measures negative signals from live integrations — negative news sentiment, weather alerts, stock crashes.', color: 'text-accent', border: 'border-accent/30', bg: 'bg-accent/5' },
    { label: 'Anomaly Frequency', weight: '10%', value: stressData.anomalyFrequency, desc: 'Measures unexpected spikes or irregular events detected in data streams.', color: 'text-accent2', border: 'border-accent2/30', bg: 'bg-accent2/5' },
  ];

  if (!activeIntegration) return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 bg-accent/10 border border-accent/20 rounded-2xl flex items-center justify-center mb-4"><Plug size={28} className="text-accent" /></div>
      <div className="text-text font-semibold text-lg mb-2">No Integration Active</div>
      <div className="text-textMuted text-sm mb-6">Activate an integration to see analytics.</div>
      <button onClick={() => navigate('/dashboard/integrations')} className="btn-primary">Go to Integrations</button>
    </div>
  );

  return (
    <div className="space-y-6" ref={pageRef}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-text">Analytics</h1>
          <p className="text-textMuted text-sm mt-1">Live charts · updates every 5s · {activeIntegration} integration</p>
        </div>
        <div className="flex gap-3">
          <button onClick={exportImage} disabled={exporting === 'img'} className="flex items-center gap-2 border border-accent/30 text-accent bg-accent/5 px-4 py-2 rounded-lg text-sm hover:bg-accent/10 disabled:opacity-50">
            <Image size={14} /> {exporting === 'img' ? 'Exporting...' : 'Export Image'}
          </button>
          <button onClick={exportPDF} disabled={exporting === 'pdf'} className="flex items-center gap-2 border border-accent2/30 text-accent2 bg-accent2/5 px-4 py-2 rounded-lg text-sm hover:bg-accent2/10 disabled:opacity-50">
            <Download size={14} /> {exporting === 'pdf' ? 'Exporting...' : 'Export PDF'}
          </button>
        </div>
      </div>

      {/* Stress Score Card */}
      <div className="grid grid-cols-4 gap-4">
        <div className="kpi-card border col-span-1" style={{ borderColor: `${scoreColor}40`, background: `${scoreColor}10` }}>
          <div className="text-xs font-mono text-textMuted uppercase mb-2">Business Stress Score</div>
          <div className="text-6xl font-display font-bold" style={{ color: scoreColor }}>{score}</div>
          <div className="text-xs font-mono mt-1" style={{ color: scoreColor }}>{scoreLabel}</div>
          <div className="mt-3 h-2 bg-border rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${score}%`, background: scoreColor }} />
          </div>
        </div>
        {MODEL_COMPONENTS.map(c => (
          <div key={c.label} className={`kpi-card border ${c.border} ${c.bg}`}>
            <div className="flex justify-between items-start mb-2">
              <div className={`text-xs font-mono uppercase ${c.color}`}>{c.label}</div>
              <div className={`text-xs font-mono ${c.color}`}>{c.weight}</div>
            </div>
            <div className={`text-3xl font-display font-bold ${c.color}`}>{c.value}</div>
            <div className="mt-2 h-1.5 bg-border rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-500 ${c.value >= 70 ? 'bg-danger' : c.value >= 40 ? 'bg-warning' : 'bg-success'}`} style={{ width: `${c.value}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Stress Score Trend */}
      <div className="kpi-card">
        <div className="text-xs font-mono text-textMuted uppercase mb-4">📈 Stress Score Live Trend</div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={stressTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E2535" />
            <XAxis dataKey="time" tick={AS} />
            <YAxis domain={[0, 100]} tick={AS} />
            <Tooltip contentStyle={TS} />
            <Line type="monotone" dataKey="score" stroke="#FF6B6B" strokeWidth={2.5} dot={false} name="Stress Score" />
            <Line type="monotone" dataKey="alertSeverity" stroke="#FFB347" strokeWidth={1.5} dot={false} name="Alert Severity" strokeDasharray="4 4" />
            <Line type="monotone" dataKey="kpiVolatility" stroke="#00E5FF" strokeWidth={1.5} dot={false} name="KPI Volatility" strokeDasharray="4 4" />
            <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'IBM Plex Mono' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Stress Breakdown Bar */}
      <div className="kpi-card">
        <div className="text-xs font-mono text-textMuted uppercase mb-4">📊 Stress Score Component Breakdown</div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={[{ name: 'Breakdown', alertSeverity: stressData.alertSeverity, kpiVolatility: stressData.kpiVolatility, externalSignalRisk: stressData.externalSignalRisk, anomalyFrequency: stressData.anomalyFrequency }]} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#1E2535" />
            <XAxis type="number" domain={[0, 100]} tick={AS} />
            <YAxis type="category" dataKey="name" tick={AS} />
            <Tooltip contentStyle={TS} />
            <Bar dataKey="alertSeverity" fill="#FF6B6B" name="Alert Severity (40%)" radius={[0, 4, 4, 0]} />
            <Bar dataKey="kpiVolatility" fill="#FFB347" name="KPI Volatility (30%)" radius={[0, 4, 4, 0]} />
            <Bar dataKey="externalSignalRisk" fill="#00E5FF" name="External Signal (20%)" radius={[0, 4, 4, 0]} />
            <Bar dataKey="anomalyFrequency" fill="#7C3AED" name="Anomaly Freq (10%)" radius={[0, 4, 4, 0]} />
            <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'IBM Plex Mono' }} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Integration-specific charts */}
      {activeIntegration === 'news' && (
        <div className="grid grid-cols-2 gap-6">
          <div className="kpi-card">
            <div className="text-xs font-mono text-textMuted uppercase mb-4">📰 Sentiment Trend</div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2535" />
                <XAxis dataKey="time" tick={AS} /><YAxis domain={[0, 100]} tick={AS} />
                <Tooltip contentStyle={TS} />
                <Line type="monotone" dataKey="sentiment" stroke="#00E5FF" strokeWidth={2} dot={false} name="Sentiment %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="kpi-card">
            <div className="text-xs font-mono text-textMuted uppercase mb-4">📊 Articles Volume</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2535" />
                <XAxis dataKey="time" tick={AS} /><YAxis tick={AS} />
                <Tooltip contentStyle={TS} />
                <Bar dataKey="articles" fill="#7C3AED" name="Articles" radius={[4, 4, 0, 0]} />
                <Bar dataKey="breaking" fill="#FF6B6B" name="Breaking" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeIntegration === 'weather' && (
        <div className="grid grid-cols-2 gap-6">
          <div className="kpi-card">
            <div className="text-xs font-mono text-textMuted uppercase mb-4">🌡️ Temperature & Humidity</div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2535" />
                <XAxis dataKey="time" tick={AS} /><YAxis tick={AS} />
                <Tooltip contentStyle={TS} />
                <Line type="monotone" dataKey="temperature" stroke="#FFB347" strokeWidth={2} dot={false} name="Temp °C" />
                <Line type="monotone" dataKey="humidity" stroke="#00E5FF" strokeWidth={2} dot={false} name="Humidity %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="kpi-card">
            <div className="text-xs font-mono text-textMuted uppercase mb-4">🌧️ Rain & Wind</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2535" />
                <XAxis dataKey="time" tick={AS} /><YAxis tick={AS} />
                <Tooltip contentStyle={TS} />
                <Bar dataKey="rainProb" fill="#7C3AED" name="Rain %" radius={[4, 4, 0, 0]} />
                <Bar dataKey="windSpeed" fill="#00E5FF" name="Wind km/h" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeIntegration === 'stocks' && (
        <div className="grid grid-cols-2 gap-6">
          <div className="kpi-card">
            <div className="text-xs font-mono text-textMuted uppercase mb-4">💹 Price Movement</div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2535" />
                <XAxis dataKey="time" tick={AS} /><YAxis tick={AS} />
                <Tooltip contentStyle={TS} />
                <Line type="monotone" dataKey="price" stroke="#00FF87" strokeWidth={2} dot={false} name="Price $" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="kpi-card">
            <div className="text-xs font-mono text-textMuted uppercase mb-4">📊 Volume Trend</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2535" />
                <XAxis dataKey="time" tick={AS} /><YAxis tick={AS} tickFormatter={v => `${(v / 1000000).toFixed(1)}M`} />
                <Tooltip contentStyle={TS} formatter={v => [`${(v / 1000000).toFixed(2)}M`, 'Volume']} />
                <Bar dataKey="volume" fill="#00E5FF" name="Volume" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Distribution Pie */}
      <div className="kpi-card">
        <div className="text-xs font-mono text-textMuted uppercase mb-4">🥧 Distribution</div>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
              {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip contentStyle={TS} />
            <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'IBM Plex Mono' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Stress Score Model Section */}
      <div className="kpi-card border border-accent/20 bg-accent/5">
        <div className="mb-6">
          <div className="text-xs font-mono text-accent uppercase tracking-widest mb-1">Business Intelligence Model</div>
          <h2 className="font-display text-2xl font-bold text-text">Stress Score Model</h2>
          <p className="text-textMuted text-sm mt-2">The Business Stress Score quantifies real-time operational risk using a weighted formula across four signal categories.</p>
        </div>

        {/* Formula */}
        <div className="bg-bg border border-border rounded-xl p-6 mb-6 font-mono text-sm">
          <div className="text-accent text-xs uppercase mb-3">Formula</div>
          <div className="text-text space-y-1">
            <div><span className="text-accent2 font-bold">Stress Score</span> <span className="text-textMuted">=</span></div>
            <div className="pl-4"><span className="text-danger font-bold">(0.40 × Alert Severity)</span></div>
            <div className="pl-4"><span className="text-textMuted">+</span> <span className="text-warning font-bold">(0.30 × KPI Volatility)</span></div>
            <div className="pl-4"><span className="text-textMuted">+</span> <span className="text-accent font-bold">(0.20 × External Signal Risk)</span></div>
            <div className="pl-4"><span className="text-textMuted">+</span> <span className="text-accent2 font-bold">(0.10 × Anomaly Frequency)</span></div>
          </div>
        </div>

        {/* Component Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {MODEL_COMPONENTS.map(c => (
            <div key={c.label} className={`border ${c.border} rounded-xl p-4`}>
              <div className="flex items-center justify-between mb-2">
                <div className={`text-sm font-semibold ${c.color}`}>{c.label}</div>
                <div className={`text-xs font-mono border ${c.border} px-2 py-0.5 rounded-full ${c.color}`}>{c.weight}</div>
              </div>
              <div className="text-xs text-textMuted leading-relaxed">{c.desc}</div>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${c.value >= 70 ? 'bg-danger' : c.value >= 40 ? 'bg-warning' : 'bg-success'}`} style={{ width: `${c.value}%` }} />
                </div>
                <div className={`text-xs font-mono ${c.color}`}>{c.value}/100</div>
              </div>
            </div>
          ))}
        </div>

        {/* Score Ranges */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { range: '0 – 30', label: 'Stable', color: 'text-success', border: 'border-success/30', bg: 'bg-success/5', icon: '🟢' },
            { range: '31 – 60', label: 'Moderate', color: 'text-accent', border: 'border-accent/30', bg: 'bg-accent/5', icon: '🔵' },
            { range: '61 – 80', label: 'High Stress', color: 'text-warning', border: 'border-warning/30', bg: 'bg-warning/5', icon: '🟡' },
            { range: '81 – 100', label: 'Crisis', color: 'text-danger', border: 'border-danger/30', bg: 'bg-danger/5', icon: '🔴' },
          ].map(r => (
            <div key={r.range} className={`border ${r.border} ${r.bg} rounded-xl p-4 text-center`}>
              <div className="text-2xl mb-1">{r.icon}</div>
              <div className={`text-sm font-semibold ${r.color}`}>{r.label}</div>
              <div className="text-xs text-textMuted font-mono mt-1">{r.range}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
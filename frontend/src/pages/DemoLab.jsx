import React, { useState, useEffect, useRef } from 'react';
import { Activity, AlertTriangle, TrendingUp, Zap, Bell, Radio, Shield, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

// ─── Demo Lab is FULLY SELF-CONTAINED ────────────────────────────────────────
// It has its OWN state: demoMode, demoScore, demoAlerts, demoFeed, demoTimeline
// It does NOT affect the real Dashboard/Analytics/AppContext
// The real Dashboard only changes with real API integrations
// ─────────────────────────────────────────────────────────────────────────────

const TS = { background: '#111520', border: '1px solid #1E2535', borderRadius: '8px', fontSize: 11, fontFamily: 'IBM Plex Mono' };
const AS = { fontSize: 10, fill: '#718096', fontFamily: 'IBM Plex Mono' };

const calcDemoStress = (mode, alertCount = 0) => {
  let aS, kV, eR, aF;
  if (mode === 'crisis') {
    aS = 85 + Math.random() * 12;
    kV = 72 + Math.random() * 18;
    eR = 78 + Math.random() * 15;
    aF = 70 + Math.random() * 18;
  } else if (mode === 'opportunity') {
    aS = 5 + Math.random() * 8;
    kV = 10 + Math.random() * 10;
    eR = 8 + Math.random() * 10;
    aF = 5 + Math.random() * 8;
  } else {
    aS = 12 + alertCount * 8 + Math.random() * 10;
    kV = 22 + Math.random() * 16;
    eR = 18 + Math.random() * 14;
    aF = 12 + Math.random() * 10;
  }
  const score = Math.round(0.40 * aS + 0.30 * kV + 0.20 * eR + 0.10 * aF);
  return { score: Math.min(100, Math.max(0, score)), alertSeverity: Math.round(aS), kpiVolatility: Math.round(kV), externalSignalRisk: Math.round(eR), anomalyFrequency: Math.round(aF) };
};

const DEMO_KPIS = {
  normal: { revenue: '$42,800', orders: '186', inventory: 'Stable', tickets: '12', sentiment: '68%' },
  crisis:  { revenue: '$18,200', orders: '43', inventory: 'Critical', tickets: '89', sentiment: '21%' },
  opportunity: { revenue: '$87,500', orders: '412', inventory: 'Optimal', tickets: '4', sentiment: '91%' },
};

const SCENARIO_INFO = {
  normal:      { icon: '⚪', color: 'text-warning', border: 'border-warning/30', bg: 'bg-warning/5', activeBg: 'bg-warning/15', stressRange: '30–50', label: 'Normal Mode', desc: 'Business environment is stable. KPIs fluctuate normally. No major alerts triggered.' },
  crisis:      { icon: '🔴', color: 'text-danger',  border: 'border-danger/30',  bg: 'bg-danger/5',  activeBg: 'bg-danger/15',  stressRange: '70–90', label: 'Crisis Mode',  desc: 'Major operational crisis. Negative news, extreme weather, or stock market crash.' },
  opportunity: { icon: '🟢', color: 'text-success', border: 'border-success/30', bg: 'bg-success/5', activeBg: 'bg-success/15', stressRange: '20–35', label: 'Opportunity Mode', desc: 'Positive market signals. Favorable sentiment, stock rally, ideal conditions.' },
};

const CRISIS_FEEDS = ['🔴 Breaking negative news spike detected', '🔴 Market volatility increasing sharply', '🔴 Critical inventory threshold breached', '🔴 Extreme weather alert issued', '🔴 Emergency response team notified', '🔴 War Room triggered — Stress Score > 70'];
const OPPORTUNITY_FEEDS = ['🟢 Positive news sentiment detected', '🟢 Stock market rally identified', '🟢 Demand forecast increasing', '🟢 Sales opportunity signal triggered', '🟢 Growth indicators rising'];
const NORMAL_FEEDS = ['⚪ System running normally', '⚪ Data streams stable', '⚪ KPI volatility within normal range', '⚪ All systems healthy'];

// ── Embedded War Room (demo-only, not the real WarRoom component) ─────────────
function DemoWarRoom({ score, alerts, onClose }) {
  useEffect(() => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const beep = (f, s, d) => { const o = ctx.createOscillator(); const g = ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.frequency.value = f; g.gain.setValueAtTime(0.18, ctx.currentTime + s); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + s + d); o.start(ctx.currentTime + s); o.stop(ctx.currentTime + s + d); };
      beep(880, 0, 0.2); beep(880, 0.3, 0.2); beep(660, 0.6, 0.3);
    } catch {}
  }, []);

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 backdrop-blur-md">
      <div className="w-full max-w-2xl mx-4 border-2 border-danger rounded-2xl bg-[#0d0608] shadow-2xl shadow-danger/30 overflow-hidden">
        <div className="bg-danger/20 border-b border-danger/30 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-danger animate-pulse" />
            <span className="text-danger font-display font-bold text-lg tracking-widest uppercase">⚠ War Room — ACTIVE</span>
            <span className="text-xs font-mono text-danger border border-danger/30 px-2 py-0.5 rounded-full">DEMO MODE</span>
          </div>
          <button onClick={onClose} className="text-textMuted hover:text-white"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-5">
          <div className="flex items-center justify-between border border-danger/30 bg-danger/10 rounded-xl px-5 py-4">
            <div>
              <div className="text-xs font-mono text-textMuted uppercase mb-1">Demo Stress Score</div>
              <div className="text-5xl font-display font-bold text-danger">{score}</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-mono font-bold px-3 py-1 rounded-full border border-danger/40 text-danger bg-danger/10 animate-pulse">⚠ CRITICAL</div>
              <div className="text-xs text-textMuted font-mono mt-2">Threshold exceeded: &gt;70</div>
            </div>
          </div>
          <div className="h-2 bg-border rounded-full overflow-hidden">
            <div className="h-full bg-danger rounded-full animate-pulse" style={{ width: `${score}%` }} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-bg border border-danger/20 rounded-xl p-4">
              <div className="text-xs font-mono text-textMuted uppercase mb-3">Crisis Alerts ({alerts.length})</div>
              <div className="space-y-2 max-h-36 overflow-y-auto">
                {alerts.length === 0
                  ? <div className="text-textMuted text-xs font-mono">No crisis alerts</div>
                  : alerts.slice(0, 5).map((a, i) => (
                    <div key={i} className="text-xs font-mono text-danger border border-danger/20 bg-danger/5 px-2.5 py-1.5 rounded-lg">{a}</div>
                  ))}
              </div>
            </div>
            <div className="bg-bg border border-danger/20 rounded-xl p-4">
              <div className="text-xs font-mono text-textMuted uppercase mb-3">Recommended Actions</div>
              <div className="space-y-1.5">
                {['Investigate negative signal sources', 'Prepare emergency operations response', 'Monitor financial volatility', 'Notify key stakeholders', 'Reduce operational risk exposure'].map((a, i) => (
                  <div key={i} className="flex gap-2 text-xs font-mono text-warning">
                    <span className="text-danger flex-shrink-0">{i + 1}.</span>{a}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono text-textMuted">Auto-dismisses when Demo Score drops below 70</div>
            <button onClick={onClose} className="px-5 py-2 rounded-lg border border-danger text-danger text-sm font-medium hover:bg-danger/10 transition-colors">
              Acknowledge & Minimize
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DemoLab() {
  const [demoMode, setDemoMode] = useState('normal');
  const [demoStress, setDemoStress] = useState({ score: 38, alertSeverity: 20, kpiVolatility: 28, externalSignalRisk: 22, anomalyFrequency: 15 });
  const [demoAlerts, setDemoAlerts] = useState([]);
  const [demoFeed, setDemoFeed] = useState([]);
  const [demoTimeline, setDemoTimeline] = useState([]);
  const [warRoomOpen, setWarRoomOpen] = useState(false);
  const [warRoomDismissed, setWarRoomDismissed] = useState(false);
  const [stressTrend, setStressTrend] = useState([]);
  const [triggering, setTriggering] = useState('');
  const tickRef = useRef(null);
  const prevAbove70 = useRef(false);

  const addFeed = (msg, type = 'info') => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setDemoFeed(prev => [{ id: Date.now() + Math.random(), msg, type, time }, ...prev].slice(0, 40));
    setDemoTimeline(prev => [{ id: Date.now() + Math.random(), time, msg, type }, ...prev].slice(0, 30));
  };

  const addDemoAlert = (msg) => setDemoAlerts(prev => [msg, ...prev].slice(0, 10));

  // Stress score recalc every 4s
  useEffect(() => {
    if (tickRef.current) clearInterval(tickRef.current);
    const recalc = () => {
      const result = calcDemoStress(demoMode, demoAlerts.length);
      setDemoStress(result);
      setStressTrend(prev => {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return [...prev.slice(-19), { time, score: result.score, alertSeverity: result.alertSeverity, kpiVolatility: result.kpiVolatility }];
      });
      const above = result.score > 70;
      if (above && !prevAbove70.current && !warRoomDismissed) {
        setWarRoomOpen(true);
      }
      if (!above && prevAbove70.current) {
        setWarRoomOpen(false);
        setWarRoomDismissed(false);
      }
      prevAbove70.current = above;
    };
    recalc();
    tickRef.current = setInterval(recalc, 4000);
    return () => clearInterval(tickRef.current);
  }, [demoMode, demoAlerts, warRoomDismissed]);

  const activateScenario = (newMode) => {
    setDemoMode(newMode);
    setDemoAlerts([]);
    setWarRoomDismissed(false);

    const feeds = newMode === 'crisis' ? CRISIS_FEEDS : newMode === 'opportunity' ? OPPORTUNITY_FEEDS : NORMAL_FEEDS;
    feeds.forEach((msg, i) => setTimeout(() => addFeed(msg, newMode === 'crisis' ? 'crisis' : newMode === 'opportunity' ? 'opportunity' : 'info'), i * 450));

    if (newMode === 'crisis') {
      setTimeout(() => addDemoAlert('🔴 CRISIS: Negative news spike detected'), 200);
      setTimeout(() => addDemoAlert('🔴 CRISIS: Market volatility threshold breached'), 800);
      setTimeout(() => addDemoAlert('🔴 CRISIS: Emergency response required'), 1400);
    } else if (newMode === 'opportunity') {
      setTimeout(() => addDemoAlert('🟢 OPPORTUNITY: Positive market signal detected'), 200);
    }
  };

  const fireTrigger = (type) => {
    setTriggering(type);
    if (type === 'alert') { addDemoAlert('🔴 MANUAL: Alert triggered — anomaly in data stream'); addFeed('🔴 Manual alert triggered — anomaly detected', 'crisis'); }
    if (type === 'anomaly') { addDemoAlert('🟡 ANOMALY: Unexpected KPI spike detected'); addFeed('🟡 Anomaly detected — unexpected KPI spike', 'warning'); }
    if (type === 'opportunity') { addFeed('🟢 Opportunity signal — favorable market conditions', 'opportunity'); }
    setTimeout(() => setTriggering(''), 800);
  };

  const dismissWarRoom = () => { setWarRoomOpen(false); setWarRoomDismissed(true); };
  const reopenWarRoom = () => { setWarRoomOpen(true); setWarRoomDismissed(false); };

  const score = demoStress.score;
  const kpis = DEMO_KPIS[demoMode];
  const scenario = SCENARIO_INFO[demoMode];
  const isWarActive = score > 70;
  const scoreColor = score > 70 ? 'text-danger' : score >= 61 ? 'text-warning' : score >= 31 ? 'text-accent' : 'text-success';
  const scoreBg = score > 70 ? 'border-danger/40 bg-danger/10' : score >= 61 ? 'border-warning/30 bg-warning/5' : score >= 31 ? 'border-accent/30 bg-accent/5' : 'border-success/30 bg-success/5';

  return (
    <div className="space-y-6">
      {/* Demo War Room Modal */}
      {warRoomOpen && <DemoWarRoom score={score} alerts={demoAlerts} onClose={dismissWarRoom} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-text">Demo Lab</h1>
          <p className="text-textMuted text-sm mt-1">Self-contained simulation — does not affect real Dashboard or Analytics</p>
        </div>
        {isWarActive && !warRoomOpen && (
          <button onClick={reopenWarRoom} className="flex items-center gap-2 border border-danger/40 text-danger bg-danger/10 px-4 py-2 rounded-lg text-sm font-medium animate-pulse">
            <AlertTriangle size={14} /> War Room Active — Click to Open
          </button>
        )}
      </div>

      <div className="kpi-card border border-accent/20 bg-accent/5">
        <p className="text-accent text-xs font-mono">ℹ️ Demo Lab runs on simulated data only. Real Dashboard KPIs only update when an API integration is active. Analytics charts only show with real API data.</p>
      </div>

      {/* Live Status Row */}
      <div className="grid grid-cols-4 gap-4">
        <div className={`kpi-card border ${scoreBg}`}>
          <div className="text-xs font-mono text-textMuted uppercase mb-2">Demo Stress Score</div>
          <div className={`text-5xl font-display font-bold ${scoreColor}`}>{score}</div>
          <div className="mt-2 h-1.5 bg-border rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-700 ${score > 70 ? 'bg-danger' : score >= 31 ? 'bg-accent' : 'bg-success'}`} style={{ width: `${score}%` }} />
          </div>
          <div className="text-xs text-textMuted font-mono mt-1">recalcs every 4s</div>
        </div>
        <div className={`kpi-card border ${scenario.border} ${demoMode === 'crisis' ? scenario.activeBg : scenario.bg}`}>
          <div className="text-xs font-mono text-textMuted uppercase mb-2">Active Scenario</div>
          <div className="text-2xl mb-1">{scenario.icon}</div>
          <div className={`text-sm font-semibold capitalize ${scenario.color}`}>{demoMode}</div>
          <div className="text-xs text-textMuted font-mono mt-1">Target: {scenario.stressRange}</div>
        </div>
        <div className={`kpi-card border ${isWarActive ? 'border-danger/40 bg-danger/10' : 'border-border'}`}>
          <div className="text-xs font-mono text-textMuted uppercase mb-2">War Room</div>
          <div className={`text-2xl mb-1 ${isWarActive ? 'animate-pulse' : ''}`}>{isWarActive ? '🚨' : '🛡️'}</div>
          <div className={`text-sm font-semibold font-mono ${isWarActive ? 'text-danger' : 'text-success'}`}>{isWarActive ? 'ACTIVE' : 'STANDBY'}</div>
          {isWarActive && (
            <button onClick={reopenWarRoom} className="mt-1 text-xs font-mono text-danger underline">Open War Room</button>
          )}
        </div>
        <div className="kpi-card border border-border">
          <div className="text-xs font-mono text-textMuted uppercase mb-2">Demo Alerts</div>
          <div className="text-5xl font-display font-bold text-accent">{demoAlerts.length}</div>
          <div className="text-xs text-textMuted font-mono mt-1">simulated only</div>
        </div>
      </div>

      {/* Scenario Buttons */}
      <div className="kpi-card border border-border">
        <div className="text-xs font-mono text-textMuted uppercase mb-4 flex items-center gap-2"><Zap size={12} /> Scenario Controls</div>
        <div className="grid grid-cols-3 gap-4">
          {Object.values(SCENARIO_INFO).map(s => (
            <button key={s.label} onClick={() => activateScenario(s.id || (s.label.includes('Normal') ? 'normal' : s.label.includes('Crisis') ? 'crisis' : 'opportunity'))}
              className={`p-4 rounded-xl border text-left transition-all hover:scale-[1.01] ${demoMode === (s.label.includes('Normal') ? 'normal' : s.label.includes('Crisis') ? 'crisis' : 'opportunity') ? `${s.activeBg} ${s.border}` : `${s.bg} ${s.border}`}`}>
              <div className="flex items-center justify-between mb-2">
                <div className={`flex items-center gap-2 font-semibold text-sm ${s.color}`}>
                  <span className="text-xl">{s.icon}</span>{s.label}
                </div>
                {demoMode === (s.label.includes('Normal') ? 'normal' : s.label.includes('Crisis') ? 'crisis' : 'opportunity') && (
                  <span className={`text-xs font-mono border ${s.border} ${s.color} px-2 py-0.5 rounded-full`}>ACTIVE</span>
                )}
              </div>
              <div className="text-xs text-textMuted mb-2 leading-relaxed">{s.desc}</div>
              <div className={`text-xs font-mono ${s.color}`}>Stress: {s.stressRange}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Demo KPIs */}
      <div>
        <div className="text-xs font-mono text-textMuted uppercase mb-3">Demo KPI Values — {demoMode} scenario</div>
        <div className="grid grid-cols-5 gap-4">
          {[
            { label: 'Revenue', value: kpis.revenue, color: demoMode === 'crisis' ? 'text-danger' : demoMode === 'opportunity' ? 'text-success' : 'text-accent' },
            { label: 'Orders Today', value: kpis.orders, color: demoMode === 'crisis' ? 'text-danger' : demoMode === 'opportunity' ? 'text-success' : 'text-accent2' },
            { label: 'Inventory', value: kpis.inventory, color: demoMode === 'crisis' ? 'text-danger' : demoMode === 'opportunity' ? 'text-success' : 'text-warning' },
            { label: 'Open Tickets', value: kpis.tickets, color: demoMode === 'crisis' ? 'text-danger' : demoMode === 'opportunity' ? 'text-success' : 'text-accent' },
            { label: 'Sentiment', value: kpis.sentiment, color: demoMode === 'crisis' ? 'text-danger' : demoMode === 'opportunity' ? 'text-success' : 'text-accent2' },
          ].map(k => (
            <div key={k.label} className="kpi-card border border-border">
              <div className="text-xs font-mono text-textMuted uppercase mb-2">{k.label}</div>
              <div className={`text-2xl font-display font-bold ${k.color}`}>{k.value}</div>
              <div className="text-xs text-textMuted font-mono mt-1">demo data</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stress Score Breakdown */}
      <div className="kpi-card border border-border">
        <div className="text-xs font-mono text-textMuted uppercase mb-3">Demo Stress Score Breakdown</div>
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Alert Severity', value: demoStress.alertSeverity, weight: '40%' },
            { label: 'KPI Volatility', value: demoStress.kpiVolatility, weight: '30%' },
            { label: 'External Signal Risk', value: demoStress.externalSignalRisk, weight: '20%' },
            { label: 'Anomaly Frequency', value: demoStress.anomalyFrequency, weight: '10%' },
          ].map(item => (
            <div key={item.label}>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-textMuted">{item.label}</span>
                <span className="text-accent">{item.weight}</span>
              </div>
              <div className="h-2 bg-border rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-700 ${item.value >= 70 ? 'bg-danger' : item.value >= 40 ? 'bg-warning' : 'bg-success'}`} style={{ width: `${item.value}%` }} />
              </div>
              <div className="text-xs text-textMuted font-mono mt-1">{item.value}/100</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stress Trend Chart */}
      {stressTrend.length > 1 && (
        <div className="kpi-card border border-border">
          <div className="text-xs font-mono text-textMuted uppercase mb-4">📈 Demo Stress Score Trend</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={stressTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2535" />
              <XAxis dataKey="time" tick={AS} />
              <YAxis domain={[0, 100]} tick={AS} />
              <Tooltip contentStyle={TS} />
              <Line type="monotone" dataKey="score" stroke="#FF6B6B" strokeWidth={2.5} dot={false} name="Stress Score" />
              <Line type="monotone" dataKey="alertSeverity" stroke="#FFB347" strokeWidth={1.5} dot={false} name="Alert Severity" strokeDasharray="4 4" />
              <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'IBM Plex Mono' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* War Room Preview Panel */}
      <div className={`kpi-card border-2 ${isWarActive ? 'border-danger' : 'border-border'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Shield size={16} className={isWarActive ? 'text-danger' : 'text-textMuted'} />
            <span className={`text-sm font-semibold font-mono uppercase tracking-widest ${isWarActive ? 'text-danger' : 'text-textMuted'}`}>
              War Room: {isWarActive ? 'ACTIVE' : 'STANDBY'}
            </span>
            {isWarActive && <span className="w-2 h-2 rounded-full bg-danger animate-pulse" />}
          </div>
          {isWarActive && (
            <button onClick={reopenWarRoom} className="text-xs font-mono border border-danger/40 text-danger px-3 py-1.5 rounded-lg hover:bg-danger/10">
              Open Full War Room
            </button>
          )}
        </div>

        {isWarActive ? (
          <div className="grid grid-cols-3 gap-4">
            <div className="border border-danger/20 rounded-xl p-4 bg-bg">
              <div className="text-xs font-mono text-textMuted uppercase mb-2">Demo Stress Score</div>
              <div className="text-4xl font-display font-bold text-danger">{score}</div>
              <div className="text-xs text-danger font-mono mt-1">⚠ Above threshold (70)</div>
            </div>
            <div className="border border-danger/20 rounded-xl p-4 bg-bg">
              <div className="text-xs font-mono text-textMuted uppercase mb-2">Active Alerts ({demoAlerts.length})</div>
              <div className="space-y-1 max-h-20 overflow-y-auto">
                {demoAlerts.length === 0
                  ? <div className="text-xs font-mono text-textMuted">No alerts yet</div>
                  : demoAlerts.slice(0, 3).map((a, i) => <div key={i} className="text-xs font-mono text-danger">{a}</div>)
                }
              </div>
            </div>
            <div className="border border-danger/20 rounded-xl p-4 bg-bg">
              <div className="text-xs font-mono text-textMuted uppercase mb-2">Recommended Actions</div>
              <div className="space-y-1 text-xs font-mono text-warning">
                <div>1. Investigate signal sources</div>
                <div>2. Prepare emergency response</div>
                <div>3. Monitor external signals</div>
              </div>
            </div>
          </div>
        ) : demoMode === 'opportunity' ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-success/20 rounded-xl p-4 bg-bg">
              <div className="text-xs font-mono text-textMuted uppercase mb-2">Opportunity Insights</div>
              <div className="space-y-1 text-xs font-mono text-success">
                <div>• Market sentiment improving</div>
                <div>• Sales opportunity detected</div>
                <div>• Demand forecast increasing</div>
              </div>
            </div>
            <div className="border border-success/20 rounded-xl p-4 bg-bg">
              <div className="text-xs font-mono text-textMuted uppercase mb-2">Positive Signals</div>
              {['Favorable news sentiment', 'Stock market rally', 'Low operational risk', 'Growth indicators rising'].map((s, i) => (
                <div key={i} className="text-xs font-mono text-success">✓ {s}</div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-textMuted text-sm font-mono">
            War Room on standby — activate Crisis Mode to trigger · Score must exceed 70
            <div className="mt-1 text-xs">Current: <span className={scoreColor}>{score}</span> · Threshold: <span className="text-danger">71+</span></div>
          </div>
        )}
      </div>

      {/* Extra Triggers */}
      <div className="kpi-card border border-border">
        <div className="text-xs font-mono text-textMuted uppercase mb-4 flex items-center gap-2"><Radio size={12} /> Manual Event Triggers</div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { id: 'alert', label: 'Trigger Alert', icon: <Bell size={14} />, color: 'text-danger', border: 'border-danger/30', bg: 'bg-danger/5' },
            { id: 'anomaly', label: 'Trigger Anomaly', icon: <Radio size={14} />, color: 'text-warning', border: 'border-warning/30', bg: 'bg-warning/5' },
            { id: 'opportunity', label: 'Trigger Opportunity', icon: <TrendingUp size={14} />, color: 'text-success', border: 'border-success/30', bg: 'bg-success/5' },
          ].map(t => (
            <button key={t.id} onClick={() => fireTrigger(t.id)} disabled={triggering === t.id}
              className={`flex items-center justify-center gap-2 p-4 rounded-xl border ${t.border} ${t.bg} ${t.color} text-sm font-medium hover:opacity-80 transition-all disabled:opacity-40`}>
              {triggering === t.id ? <span className="w-4 h-4 border border-current border-t-transparent rounded-full animate-spin" /> : t.icon}
              {t.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-textMuted font-mono mt-3">Triggers update demo alerts, feed, and stress score independently of real dashboard</p>
      </div>

      {/* Demo Alerts */}
      {demoAlerts.length > 0 && (
        <div className="kpi-card border border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-mono text-textMuted uppercase">Demo Alerts ({demoAlerts.length})</div>
            <button onClick={() => setDemoAlerts([])} className="text-xs font-mono text-textMuted hover:text-text border border-border px-2 py-1 rounded">Clear</button>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {demoAlerts.map((a, i) => (
              <div key={i} className={`text-xs font-mono p-2.5 rounded-lg border ${a.includes('🔴') ? 'border-danger/30 bg-danger/5 text-danger' : a.includes('🟢') ? 'border-success/30 bg-success/5 text-success' : 'border-warning/30 bg-warning/5 text-warning'}`}>
                {a}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="kpi-card border border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs font-mono text-textMuted uppercase flex items-center gap-2"><Activity size={12} /> Simulation Timeline</div>
          {demoTimeline.length > 0 && <button onClick={() => setDemoTimeline([])} className="text-xs font-mono text-textMuted hover:text-text border border-border px-2 py-1 rounded">Clear</button>}
        </div>
        {demoTimeline.length === 0 ? (
          <div className="text-center py-8 text-textMuted text-sm font-mono">Activate a scenario to see the simulation timeline</div>
        ) : (
          <div className="space-y-2 max-h-56 overflow-y-auto">
            {demoTimeline.map(e => (
              <div key={e.id} className="flex items-start gap-3 text-xs font-mono border-b border-border pb-2">
                <span className="text-textMuted flex-shrink-0 w-20">{e.time}</span>
                <span className={e.type === 'crisis' ? 'text-danger' : e.type === 'opportunity' ? 'text-success' : e.type === 'warning' ? 'text-warning' : 'text-textMuted'}>{e.msg}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Explainer */}
      <div className="kpi-card border border-border">
        <div className="text-xs font-mono text-textMuted uppercase mb-4">How This Works for Judges</div>
        <div className="grid grid-cols-3 gap-6 text-xs text-textMuted font-mono">
          <div><div className="text-warning font-semibold mb-2">⚪ Normal</div><div className="space-y-1"><div>Stress: 30–50</div><div>No War Room</div><div>Stable KPIs</div></div></div>
          <div><div className="text-danger font-semibold mb-2">🔴 Crisis</div><div className="space-y-1"><div>Stress: 70–90</div><div>War Room auto-opens</div><div>Red alerts + beep</div></div></div>
          <div><div className="text-success font-semibold mb-2">🟢 Opportunity</div><div className="space-y-1"><div>Stress: 20–35</div><div>No War Room</div><div>Insight panel shown</div></div></div>
        </div>
      </div>
    </div>
  );
}
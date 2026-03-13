import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { AlertTriangle, Plug } from 'lucide-react';
import WarRoom from '../components/WarRoom';

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const {
    activeIntegration, liveData, setLiveData,
    mode, liveFeed, addFeedEvent,
    alerts, setAlerts, addAlert,
    stressData, warRoomOpen, dismissWarRoom, reopenWarRoom,
  } = useApp();

  const [kpis, setKpis] = useState({});
  const [kpiTick, setKpiTick] = useState(0);
  const liveIntervalRef = useRef(null);
  const prevMode = useRef(null);

  useEffect(() => {
    if (prevMode.current === mode) return;
    prevMode.current = mode;
    if (mode === 'crisis') {
      addAlert({ type: 'crisis', message: 'CRISIS ALERT: Critical situation detected!', color: 'danger' });
      addFeedEvent({ type: 'crisis', message: 'CRISIS MODE — all systems on high alert' });
    } else if (mode === 'opportunity') {
      addAlert({ type: 'opportunity', message: 'Opportunity Signal: Favorable conditions!', color: 'success' });
      addFeedEvent({ type: 'opportunity', message: 'OPPORTUNITY — favorable conditions detected' });
    } else {
      addFeedEvent({ type: 'info', message: 'System running normally — data streams stable' });
    }
  }, [mode]);

  useEffect(() => {
    if (!activeIntegration) return;
    if (liveIntervalRef.current) clearInterval(liveIntervalRef.current);
    liveIntervalRef.current = setInterval(() => {
      setLiveData(prev => {
        if (activeIntegration === 'weather' && prev.weather) {
          return {
            ...prev,
            weather: {
              ...prev.weather,
              temp:      parseFloat((prev.weather.temp + (Math.random() - 0.5) * 0.8).toFixed(1)),
              windSpeed: Math.max(0, parseFloat((prev.weather.windSpeed + (Math.random() - 0.5) * 1.5).toFixed(1))),
              humidity:  Math.min(100, Math.max(0, Math.round(prev.weather.humidity + (Math.random() - 0.5) * 2))),
            },
          };
        }
        if (activeIntegration === 'stocks' && prev.stocks?.length) {
          return {
            ...prev,
            stocks: prev.stocks.map(s => {
              const pct = (Math.random() - 0.5) * 0.008;
              const np  = parseFloat((parseFloat(s.price) * (1 + pct)).toFixed(2));
              return { ...s, price: np.toFixed(2), change: (np - parseFloat(s.price)).toFixed(2), changePercent: (pct * 100).toFixed(2) };
            }),
          };
        }
        return prev;
      });
      if (activeIntegration === 'news') setKpiTick(t => t + 1);
    }, 4000);
    return () => clearInterval(liveIntervalRef.current);
  }, [activeIntegration]);

  useEffect(() => {
    if (!activeIntegration) { setKpis({}); return; }

    if (activeIntegration === 'news' && liveData.news?.length) {
      const news     = liveData.news;
      const breaking = news.filter(n =>
        n.title?.toLowerCase().includes('breaking') ||
        n.title?.toLowerCase().includes('urgent') ||
        n.title?.toLowerCase().includes('alert')
      ).length;
      const sources  = [...new Set(news.map(n => n.source?.name).filter(Boolean))];
      const baseS    = mode === 'crisis' ? 22 : mode === 'opportunity' ? 80 : 50;
      const sentiment = Math.max(0, Math.min(100, baseS + Math.floor((Math.random() - 0.5) * 14)));
      const apm       = parseFloat((news.length / 60 + (Math.random() - 0.5) * 0.05).toFixed(2));
      setKpis({
        'Total Headlines': { value: news.length,                             sub: 'fetched live',      color: 'text-accent' },
        'Breaking News':   { value: breaking || Math.floor(Math.random() * 2) + 1, sub: 'urgent stories', color: 'text-danger' },
        'Top Source':      { value: sources[0] || 'N/A',                    sub: `${sources.length} sources`, color: 'text-accent2' },
        'Avg Sentiment':   { value: `${sentiment}%`, sub: sentiment > 60 ? 'Positive' : sentiment > 40 ? 'Neutral' : 'Negative', color: sentiment > 60 ? 'text-success' : sentiment > 40 ? 'text-warning' : 'text-danger' },
        'Articles/Min':    { value: apm,                                    sub: 'live rate',           color: 'text-accent' },
      });
    }

    if (activeIntegration === 'weather' && liveData.weather) {
      const w        = liveData.weather;
      const forecast = mode === 'crisis' ? 'Severe Storm' : mode === 'opportunity' ? 'Clear Skies' : 'Stable';
      setKpis({
        'Temperature': { value: `${w.temp}°C`,       sub: `Feels like ${w.feels}°C`,          color: 'text-warning' },
        'Humidity':    { value: `${w.humidity}%`,    sub: w.humidity > 70 ? 'High' : 'Comfortable', color: 'text-accent' },
        'Wind Speed':  { value: `${w.windSpeed} km/h`, sub: w.windSpeed > 30 ? 'Strong' : 'Light breeze', color: 'text-accent2' },
        'Condition':   { value: w.icon || 'Clear',   sub: w.description || '',               color: 'text-success' },
        'Forecast':    { value: forecast,             sub: `H:${w.high}° L:${w.low}°`,        color: mode === 'crisis' ? 'text-danger' : mode === 'opportunity' ? 'text-success' : 'text-warning' },
      });
    }

    if (activeIntegration === 'stocks' && liveData.stocks?.length) {
      const s      = liveData.stocks[0];
      const avgChg = (liveData.stocks.reduce((a, st) => a + parseFloat(st.changePercent || 0), 0) / liveData.stocks.length).toFixed(2);
      const vol    = liveData.stocks.reduce((a, st) => a + (st.volume || 0), 0);
      const trend  = mode === 'crisis' ? 'Bearish' : mode === 'opportunity' ? 'Bullish' : parseFloat(avgChg) >= 0 ? 'Bullish' : 'Bearish';
      setKpis({
        'Stock Price':    { value: `$${s?.price}`,           sub: `${s?.symbol} live`,            color: 'text-success' },
        'Market Change':  { value: `${parseFloat(avgChg) >= 0 ? '+' : ''}${avgChg}%`, sub: 'avg portfolio', color: parseFloat(avgChg) >= 0 ? 'text-success' : 'text-danger' },
        'Trading Volume': { value: `${(vol / 1000000).toFixed(1)}M`, sub: 'shares today',         color: 'text-accent' },
        'Market Trend':   { value: trend,                    sub: `${liveData.stocks.filter(st => parseFloat(st.change) >= 0).length}/${liveData.stocks.length} up`, color: trend === 'Bullish' ? 'text-success' : 'text-danger' },
        'Day High/Low':   { value: `$${s?.high}`,            sub: `Low $${s?.low}`,               color: 'text-accent2' },
      });
    }
  }, [activeIntegration, liveData, mode, kpiTick]);

  const score      = stressData.score;
  const scoreColor = score > 70 ? 'text-danger' : score >= 61 ? 'text-warning' : score >= 31 ? 'text-accent' : 'text-success';
  const scoreBg    = score > 70 ? 'border-danger/40 bg-danger/10' : score >= 61 ? 'border-warning/30 bg-warning/5' : score >= 31 ? 'border-accent/30 bg-accent/5' : 'border-success/30 bg-success/5';
  const scoreLabel = score > 70 ? 'Crisis' : score >= 61 ? 'High Stress' : score >= 31 ? 'Moderate' : 'Stable';

  return (
    <div className="space-y-6">
      {/* War Room modal — renders whenever warRoomOpen is true */}
      {warRoomOpen && (
        <WarRoom stressScore={score} alerts={alerts} onClose={dismissWarRoom} />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-text">Dashboard</h1>
          <p className="text-textMuted text-sm mt-1">
            {activeIntegration ? `Live ${activeIntegration} · ${mode} mode` : 'No integration active'}
          </p>
        </div>
        {/* Banner button: visible when score is high but War Room is dismissed */}
        {score > 70 && !warRoomOpen && (
          <button
            onClick={reopenWarRoom}
            className="flex items-center gap-2 border border-danger/40 text-danger bg-danger/10 px-4 py-2 rounded-lg text-sm font-medium animate-pulse"
          >
            <AlertTriangle size={14} /> War Room Active — Click to View
          </button>
        )}
      </div>

      {!activeIntegration ? (
        <div className="kpi-card border border-border flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-accent/10 border border-accent/20 rounded-2xl flex items-center justify-center mb-4">
            <Plug size={28} className="text-accent" />
          </div>
          <div className="text-text font-semibold text-lg mb-2">No Integration Active</div>
          <div className="text-textMuted text-sm mb-6">Go to Integrations and enter your API key to see live KPIs.</div>
          <button onClick={() => navigate('/dashboard/integrations')} className="btn-primary flex items-center gap-2">
            <Plug size={14} /> Go to Integrations
          </button>
        </div>
      ) : (
        <>
          {/* Score cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className={`kpi-card border ${scoreBg}`}>
              <div className="text-xs font-mono text-textMuted uppercase mb-2">Business Stress Score</div>
              <div className={`text-5xl font-display font-bold ${scoreColor}`}>{score}</div>
              <div className={`text-xs font-mono mt-1 ${scoreColor}`}>{scoreLabel}</div>
              <div className="mt-2 h-1.5 bg-border rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${score > 70 ? 'bg-danger' : score >= 61 ? 'bg-warning' : score >= 31 ? 'bg-accent' : 'bg-success'}`}
                  style={{ width: `${score}%` }}
                />
              </div>
              <div className="text-xs text-textMuted font-mono mt-1">updates every 4s</div>
            </div>

            <div className="kpi-card border border-border">
              <div className="text-xs font-mono text-textMuted uppercase mb-2">Integration</div>
              <div className="text-3xl mb-1">
                {activeIntegration === 'news' ? '📰' : activeIntegration === 'weather' ? '🌤️' : '💹'}
              </div>
              <div className="text-sm font-semibold text-text capitalize">{activeIntegration}</div>
              <div className="flex items-center gap-1 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                <span className="text-xs text-success font-mono">Live</span>
              </div>
            </div>

            <div className={`kpi-card border ${mode === 'crisis' ? 'border-danger/30 bg-danger/5' : mode === 'opportunity' ? 'border-success/30 bg-success/5' : 'border-border'}`}>
              <div className="text-xs font-mono text-textMuted uppercase mb-2">System Mode</div>
              <div className="text-3xl mb-1">{mode === 'crisis' ? '🔴' : mode === 'opportunity' ? '🟢' : '⚪'}</div>
              <div className={`text-sm font-semibold capitalize ${mode === 'crisis' ? 'text-danger' : mode === 'opportunity' ? 'text-success' : 'text-text'}`}>
                {mode}
              </div>
            </div>

            <div className="kpi-card border border-border">
              <div className="text-xs font-mono text-textMuted uppercase mb-2">Active Alerts</div>
              <div className="text-5xl font-display font-bold text-accent">{alerts.length}</div>
              <div className="text-xs text-textMuted font-mono mt-1">
                {alerts.filter(a => a.type === 'crisis').length} critical
              </div>
            </div>
          </div>

          {/* Stress breakdown */}
          <div className="kpi-card border border-border">
            <div className="text-xs font-mono text-textMuted uppercase mb-3">Stress Score Breakdown — recalculates every 4s</div>
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Alert Severity',      value: stressData.alertSeverity,      weight: '40%' },
                { label: 'KPI Volatility',       value: stressData.kpiVolatility,       weight: '30%' },
                { label: 'External Signal Risk', value: stressData.externalSignalRisk, weight: '20%' },
                { label: 'Anomaly Frequency',    value: stressData.anomalyFrequency,    weight: '10%' },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-textMuted">{item.label}</span>
                    <span className="text-accent">{item.weight}</span>
                  </div>
                  <div className="h-2 bg-border rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${item.value >= 70 ? 'bg-danger' : item.value >= 40 ? 'bg-warning' : 'bg-success'}`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                  <div className="text-xs text-textMuted font-mono mt-1">{item.value}/100</div>
                </div>
              ))}
            </div>
          </div>

          {/* KPI cards */}
          <div className="grid grid-cols-5 gap-4">
            {Object.entries(kpis).map(([label, kpi]) => (
              <div key={label} className="kpi-card border border-border">
                <div className="text-xs font-mono text-textMuted uppercase mb-2 truncate">{label}</div>
                <div className={`text-2xl font-display font-bold mb-1 ${kpi.color} truncate`}>{kpi.value}</div>
                <div className="text-xs text-textMuted truncate">{kpi.sub}</div>
              </div>
            ))}
          </div>

          {/* Alerts + Feed */}
          <div className="grid grid-cols-2 gap-4">
            <div className="kpi-card">
              <div className="text-xs font-mono text-textMuted uppercase mb-3">Active Alerts</div>
              {alerts.length === 0 ? (
                <div className="text-textMuted text-sm font-mono text-center py-6">No alerts</div>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {alerts.map(alert => (
                    <div
                      key={alert.id}
                      className={`flex items-start justify-between p-3 rounded-lg border text-xs font-mono ${
                        alert.color === 'danger'  ? 'border-danger/30 bg-danger/5 text-danger' :
                        alert.color === 'success' ? 'border-success/30 bg-success/5 text-success' :
                        'border-warning/30 bg-warning/5 text-warning'
                      }`}
                    >
                      <span>{alert.message}</span>
                      <button
                        onClick={() => setAlerts(p => p.filter(a => a.id !== alert.id))}
                        className="text-textMuted hover:text-text ml-2"
                      >✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="kpi-card">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-mono text-textMuted uppercase">Live Feed</span>
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              </div>
              {liveFeed.length === 0 ? (
                <div className="text-textMuted text-sm font-mono text-center py-6">No events yet</div>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {liveFeed.map(event => (
                    <div key={event.id} className="flex items-start gap-2 text-xs font-mono border-b border-border pb-2">
                      <span className="text-textMuted flex-shrink-0">{event.time}</span>
                      <span className={event.type === 'crisis' ? 'text-danger' : event.type === 'opportunity' ? 'text-success' : 'text-textMuted'}>
                        {event.message}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
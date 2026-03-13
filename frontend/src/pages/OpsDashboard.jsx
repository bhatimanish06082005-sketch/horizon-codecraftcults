import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { AlertTriangle, Plug } from 'lucide-react';
import WarRoom from '../components/WarRoom';

export default function OpsDashboard() {
  const {
    activeIntegration, liveData, mode, liveFeed,
    alerts, setAlerts, addAlert, addFeedEvent,
    stressData, warRoomOpen, dismissWarRoom, reopenWarRoom,
  } = useApp();

  const [kpis, setKpis]       = useState({});
  const [kpiTick, setKpiTick] = useState(0);
  const prevMode = useRef(null);
  const tickRef  = useRef(null);

  useEffect(() => {
    if (prevMode.current === mode) return;
    prevMode.current = mode;
    if (mode === 'crisis') {
      addAlert({ type: 'crisis', message: 'CRISIS ALERT: Critical situation detected!', color: 'danger' });
      addFeedEvent({ type: 'crisis', message: 'CRISIS — ops team notified' });
    } else if (mode === 'opportunity') {
      addFeedEvent({ type: 'opportunity', message: 'Opportunity Signal detected' });
    } else {
      addFeedEvent({ type: 'info', message: 'System running normally' });
    }
  }, [mode]);

  useEffect(() => {
    if (!activeIntegration) return;
    if (tickRef.current) clearInterval(tickRef.current);
    tickRef.current = setInterval(() => {
      if (activeIntegration === 'news') setKpiTick(t => t + 1);
    }, 4000);
    return () => clearInterval(tickRef.current);
  }, [activeIntegration]);

  useEffect(() => {
    if (!activeIntegration) { setKpis({}); return; }

    if (activeIntegration === 'news' && liveData.news?.length) {
      const news      = liveData.news;
      const breaking  = news.filter(n =>
        n.title?.toLowerCase().includes('breaking') || n.title?.toLowerCase().includes('alert')
      ).length;
      const sources   = [...new Set(news.map(n => n.source?.name).filter(Boolean))];
      const baseS     = mode === 'crisis' ? 22 : mode === 'opportunity' ? 80 : 50;
      const sentiment = Math.max(0, Math.min(100, baseS + Math.floor((Math.random() - 0.5) * 14)));
      setKpis({
        'Total Headlines': { value: news.length, color: 'text-accent' },
        'Breaking News':   { value: breaking || Math.floor(Math.random() * 2) + 1, color: 'text-danger' },
        'Top Source':      { value: sources[0] || 'N/A', color: 'text-accent2' },
        'Avg Sentiment':   { value: `${sentiment}%`, color: sentiment > 60 ? 'text-success' : 'text-danger' },
        'Articles/Min':    { value: parseFloat((news.length / 60 + (Math.random() - 0.5) * 0.05).toFixed(2)), color: 'text-accent' },
      });
    }

    if (activeIntegration === 'weather' && liveData.weather) {
      const w = liveData.weather;
      setKpis({
        'Temperature': { value: `${w.temp}°C`,        color: 'text-warning' },
        'Humidity':    { value: `${w.humidity}%`,     color: 'text-accent' },
        'Wind Speed':  { value: `${w.windSpeed} km/h`, color: 'text-accent2' },
        'Condition':   { value: w.icon || 'Clear',    color: 'text-success' },
        'Forecast':    { value: mode === 'crisis' ? 'Severe Storm' : 'Stable', color: mode === 'crisis' ? 'text-danger' : 'text-success' },
      });
    }

    if (activeIntegration === 'stocks' && liveData.stocks?.length) {
      const s      = liveData.stocks[0];
      const avgChg = (
        liveData.stocks.reduce((a, st) => a + parseFloat(st.changePercent || 0), 0) / liveData.stocks.length
      ).toFixed(2);
      setKpis({
        'Stock Price':    { value: `$${s?.price}`, color: 'text-success' },
        'Market Change':  { value: `${parseFloat(avgChg) >= 0 ? '+' : ''}${avgChg}%`, color: parseFloat(avgChg) >= 0 ? 'text-success' : 'text-danger' },
        'Trading Volume': { value: `${(liveData.stocks.reduce((a, st) => a + (st.volume || 0), 0) / 1000000).toFixed(1)}M`, color: 'text-accent' },
        'Market Trend':   { value: mode === 'crisis' ? 'Bearish' : 'Bullish', color: mode === 'crisis' ? 'text-danger' : 'text-success' },
        'Day High/Low':   { value: `$${s?.high} / $${s?.low}`, color: 'text-accent2' },
      });
    }
  }, [activeIntegration, liveData, mode, kpiTick]);

  const score      = stressData.score;
  const scoreColor = score > 70 ? 'text-danger' : score >= 61 ? 'text-warning' : score >= 31 ? 'text-accent' : 'text-success';
  const scoreBg    = score > 70 ? 'border-danger/40 bg-danger/10' : score >= 61 ? 'border-warning/30 bg-warning/5' : score >= 31 ? 'border-accent/30 bg-accent/5' : 'border-success/30 bg-success/5';
  const scoreLabel = score > 70 ? 'Crisis' : score >= 61 ? 'High Stress' : score >= 31 ? 'Moderate' : 'Stable';

  return (
    <div className="space-y-6">
      {/* War Room modal — shared state via AppContext, works for both roles */}
      {warRoomOpen && (
        <WarRoom stressScore={score} alerts={alerts} onClose={dismissWarRoom} />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-text">Ops Dashboard</h1>
          <p className="text-textMuted text-sm mt-1">
            {activeIntegration ? `Live ${activeIntegration} · ${mode} mode` : 'No integration active'}
          </p>
        </div>
        {/* Banner shown when score is high but modal was dismissed */}
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
          <div className="text-textMuted text-sm">Ask the owner to activate an integration.</div>
        </div>
      ) : (
        <>
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

          <div className="grid grid-cols-5 gap-4">
            {Object.entries(kpis).map(([label, kpi]) => (
              <div key={label} className="kpi-card border border-border">
                <div className="text-xs font-mono text-textMuted uppercase mb-2 truncate">{label}</div>
                <div className={`text-2xl font-display font-bold ${kpi.color} truncate`}>{kpi.value}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="kpi-card">
              <div className="text-xs font-mono text-textMuted uppercase mb-3">Active Alerts</div>
              {alerts.length === 0 ? (
                <div className="text-textMuted text-sm font-mono text-center py-6">No alerts</div>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {alerts.map(alert => (
                    <div key={alert.id} className={`flex items-start justify-between p-3 rounded-lg border text-xs font-mono ${alert.color === 'danger' ? 'border-danger/30 bg-danger/5 text-danger' : alert.color === 'success' ? 'border-success/30 bg-success/5 text-success' : 'border-warning/30 bg-warning/5 text-warning'}`}>
                      <span>{alert.message}</span>
                      <button onClick={() => setAlerts(p => p.filter(a => a.id !== alert.id))} className="ml-2 text-textMuted hover:text-text">✕</button>
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
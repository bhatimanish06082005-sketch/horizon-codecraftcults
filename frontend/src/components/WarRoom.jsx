import React, { useEffect } from 'react';
import { X, AlertTriangle, Shield, Activity } from 'lucide-react';

export default function WarRoom({ stressScore, alerts, onClose }) {
  useEffect(() => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const beep = (freq, start, dur) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.15, ctx.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + dur);
      };
      beep(880, 0, 0.2);
      beep(880, 0.3, 0.2);
      beep(660, 0.6, 0.35);
    } catch (_) {}
  }, []);

  const crisisAlerts = (alerts || []).filter((a) => a.type === 'crisis');
  const scoreLabel =
    stressScore >= 90 ? 'CRITICAL' : stressScore >= 80 ? 'SEVERE' : 'HIGH';

  const actions = [
    { text: 'Investigate negative external signal sources immediately', priority: 'high' },
    { text: 'Monitor financial indicators and market volatility', priority: 'high' },
    { text: 'Prepare operational response and notify stakeholders', priority: 'medium' },
    { text: 'Switch to backup systems if primary signals fail', priority: 'medium' },
    { text: 'Document incident timeline for post-mortem review', priority: 'low' },
  ];

  const priorityColor = {
    high: 'text-danger border-danger/30 bg-danger/5',
    medium: 'text-warning border-warning/30 bg-warning/5',
    low: 'text-textMuted border-border bg-surface2',
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-2xl mx-4 border-2 border-danger rounded-2xl bg-[#0d0608] shadow-2xl shadow-danger/20 overflow-hidden">

        {/* Header */}
        <div className="bg-danger/15 border-b border-danger/30 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-danger animate-pulse" />
            <span className="text-danger font-display font-bold text-base tracking-widest uppercase">
              War Room — Active
            </span>
            <span className="text-xs font-mono text-danger/70 border border-danger/20 px-2 py-0.5 rounded-full">
              {scoreLabel}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-textMuted hover:text-white transition-colors p-1"
            aria-label="Minimize War Room"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Stress Score Banner */}
          <div className="flex items-center justify-between border border-danger/30 bg-danger/8 rounded-xl px-5 py-4">
            <div>
              <div className="text-xs font-mono text-textMuted uppercase mb-1 tracking-wider">
                Business Stress Score
              </div>
              <div className="text-6xl font-display font-bold text-danger leading-none">
                {stressScore}
              </div>
            </div>
            <div className="text-right space-y-2">
              <div className="text-sm font-mono font-bold px-4 py-1.5 rounded-full border border-danger/40 text-danger bg-danger/10 animate-pulse">
                Threshold Exceeded
              </div>
              <div className="text-xs text-textMuted font-mono">Crisis threshold: &gt; 70</div>
            </div>
          </div>

          {/* Score Bar */}
          <div className="h-1.5 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-danger rounded-full transition-all duration-700"
              style={{ width: `${Math.min(stressScore, 100)}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Active Alerts */}
            <div className="bg-bg border border-danger/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={13} className="text-danger" />
                <span className="text-xs font-mono text-textMuted uppercase">
                  Crisis Alerts ({crisisAlerts.length})
                </span>
              </div>
              {crisisAlerts.length === 0 ? (
                <div className="text-textMuted text-xs font-mono py-4 text-center">
                  No crisis alerts logged yet
                </div>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {crisisAlerts.slice(0, 6).map((alert) => (
                    <div
                      key={alert.id}
                      className="text-xs font-mono text-danger border border-danger/20 bg-danger/5 px-2.5 py-1.5 rounded-lg leading-relaxed"
                    >
                      {alert.message}
                    </div>
                  ))}
                </div>
              )}

              {/* Critical KPIs summary */}
              <div className="mt-3 pt-3 border-t border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Activity size={12} className="text-warning" />
                  <span className="text-xs font-mono text-textMuted uppercase">Critical KPIs</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-textMuted">Alert Severity</span>
                    <span className="text-danger">High</span>
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-textMuted">KPI Volatility</span>
                    <span className="text-warning">Elevated</span>
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-textMuted">Signal Risk</span>
                    <span className="text-danger">Critical</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended Actions */}
            <div className="bg-bg border border-danger/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Shield size={13} className="text-warning" />
                <span className="text-xs font-mono text-textMuted uppercase">Recommended Actions</span>
              </div>
              <div className="space-y-2 max-h-52 overflow-y-auto">
                {actions.map((action, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-2 text-xs font-mono border rounded-lg px-2.5 py-1.5 ${priorityColor[action.priority]}`}
                  >
                    <span className="flex-shrink-0 font-bold">{i + 1}.</span>
                    <span className="leading-relaxed">{action.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-1">
            <div className="text-xs font-mono text-textMuted">
              Auto-closes when Stress Score drops below 70
            </div>
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-5 py-2 rounded-lg border border-danger/40 text-danger text-sm font-medium hover:bg-danger/8 transition-colors"
            >
              Acknowledge & Minimize
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
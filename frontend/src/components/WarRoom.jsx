import React, { useEffect } from 'react';
import { AlertTriangle, X, Zap } from 'lucide-react';

const ACTIONS = [
  'Contact inventory suppliers immediately for emergency restocking',
  'Escalate critical support tickets to senior team',
  'Review and pause non-essential marketing spend',
  'Send customer communication for any order delays',
  'Schedule emergency ops review meeting in 30 minutes',
];

export default function WarRoom({ stressData, alerts, onClose }) {
  useEffect(() => {
    // Play alert sound using Web Audio API
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      [0, 0.3, 0.6].forEach(delay => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(880, ctx.currentTime + delay);
        osc.frequency.setValueAtTime(660, ctx.currentTime + delay + 0.15);
        gain.gain.setValueAtTime(0.1, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.4);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.4);
      });
    } catch {}
  }, []);

  const criticalAlerts = alerts?.filter(a => a.type === 'crisis' || a.severity === 'critical') || [];

  return (
    <div className="fixed inset-0 z-50 bg-bg/95 backdrop-blur-sm war-room-overlay flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-danger/20 border border-danger/50 rounded-xl flex items-center justify-center animate-pulse2">
              <AlertTriangle size={24} className="text-danger" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-danger">WAR ROOM MODE</h1>
              <p className="text-textMuted text-sm font-mono">Critical business alert — immediate action required</p>
            </div>
          </div>
          <button onClick={onClose} className="text-textMuted hover:text-text transition-colors p-2 hover:bg-border rounded-lg">
            <X size={20} />
          </button>
        </div>

        {/* Critical KPIs */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-danger/10 border border-danger/30 rounded-xl p-5">
            <div className="text-xs font-mono text-textMuted mb-2 uppercase">Stress Score</div>
            <div className="text-5xl font-display font-bold text-danger">{stressData?.stressScore || '—'}</div>
            <div className="text-danger text-xs font-mono mt-1 uppercase">{stressData?.status}</div>
          </div>
          <div className="bg-warning/10 border border-warning/30 rounded-xl p-5">
            <div className="text-xs font-mono text-textMuted mb-2 uppercase">Ticket Load</div>
            <div className="text-5xl font-display font-bold text-warning">{stressData?.breakdown?.ticketLoad || 0}</div>
            <div className="text-warning text-xs font-mono mt-1">/ 100</div>
          </div>
          <div className="bg-accent2/10 border border-accent2/30 rounded-xl p-5">
            <div className="text-xs font-mono text-textMuted mb-2 uppercase">Inventory Risk</div>
            <div className="text-5xl font-display font-bold text-accent2">{stressData?.breakdown?.inventoryRisk || 0}</div>
            <div className="text-accent2 text-xs font-mono mt-1">/ 100</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Crisis Alerts */}
          <div className="bg-surface border border-border rounded-xl p-5">
            <div className="text-xs font-mono text-danger uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-danger live-dot" />
              Active Crises ({criticalAlerts.length})
            </div>
            <div className="space-y-3">
              {criticalAlerts.length === 0 ? (
                <div className="text-textMuted text-sm font-mono">No active crises detected</div>
              ) : criticalAlerts.slice(0, 4).map(a => (
                <div key={a._id} className="flex items-start gap-2 p-3 bg-danger/5 border border-danger/20 rounded-lg">
                  <AlertTriangle size={12} className="text-danger mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-text">{a.title}</div>
                    <div className="text-xs text-textMuted mt-0.5">{a.message}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Actions */}
          <div className="bg-surface border border-border rounded-xl p-5">
            <div className="text-xs font-mono text-accent uppercase tracking-wider mb-4 flex items-center gap-2">
              <Zap size={12} />
              Recommended Actions
            </div>
            <div className="space-y-2">
              {ACTIONS.map((action, i) => (
                <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-border/30 transition-colors cursor-default">
                  <span className="text-accent font-mono text-xs mt-0.5 flex-shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-xs text-textMuted leading-relaxed">{action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <button onClick={onClose} className="btn-secondary text-sm px-8">
            Exit War Room Mode
          </button>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { X, AlertTriangle, Zap, Activity } from 'lucide-react';
import { acknowledgeAlert } from '../services/api';

const typeConfig = {
  crisis: { badge: 'badge-crisis', icon: <AlertTriangle size={12} />, label: 'CRISIS', color: 'border-l-danger' },
  opportunity: { badge: 'badge-opportunity', icon: <Zap size={12} />, label: 'OPPORTUNITY', color: 'border-l-success' },
  anomaly: { badge: 'badge-anomaly', icon: <Activity size={12} />, label: 'ANOMALY', color: 'border-l-warning' },
};

export default function AlertPanel({ alerts, onAcknowledge }) {
  const handle = async (id) => {
    try {
      await acknowledgeAlert(id);
      onAcknowledge?.(id);
    } catch {}
  };

  if (!alerts?.length) return (
    <div className="kpi-card text-center py-8">
      <div className="text-textMuted text-sm font-mono">✓ No active alerts</div>
    </div>
  );

  return (
    <div className="space-y-3">
      {alerts.map(alert => {
        const config = typeConfig[alert.type] || typeConfig.anomaly;
        return (
          <div key={alert._id} className={`bg-surface border border-border rounded-xl p-4 border-l-4 ${config.color} flex items-start justify-between gap-3 animate-fade-in`}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className={config.badge}>{config.label}</span>
                <span className="text-xs text-textMuted font-mono">{alert.vertical?.toUpperCase()}</span>
              </div>
              <div className="text-sm font-semibold text-text mb-1">{alert.title}</div>
              <div className="text-xs text-textMuted leading-relaxed">{alert.message}</div>
              <div className="text-xs text-textMuted font-mono mt-1.5">
                {new Date(alert.createdAt).toLocaleTimeString()}
              </div>
            </div>
            <button onClick={() => handle(alert._id)} className="text-textMuted hover:text-text transition-colors flex-shrink-0 mt-0.5">
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

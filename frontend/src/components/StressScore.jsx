import React from 'react';
import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

export default function StressScore({ score, status, breakdown }) {
  const colorMap = {
    healthy: { bar: 'bg-success', text: 'text-success', border: 'border-success/30', bg: 'bg-success/5', icon: <CheckCircle size={16} /> },
    warning: { bar: 'bg-warning', text: 'text-warning', border: 'border-warning/30', bg: 'bg-warning/5', icon: <AlertTriangle size={16} /> },
    critical: { bar: 'bg-danger', text: 'text-danger', border: 'border-danger/30', bg: 'bg-danger/5', icon: <AlertCircle size={16} /> },
  };
  const c = colorMap[status] || colorMap.healthy;

  return (
    <div className={`kpi-card border ${c.border} ${c.bg}`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-mono text-textMuted uppercase tracking-wider">Business Stress Score</span>
        <span className={`flex items-center gap-1 text-xs font-mono uppercase ${c.text}`}>
          {c.icon} {status}
        </span>
      </div>

      <div className={`text-5xl font-display font-bold mb-4 ${c.text}`}>{score}</div>

      <div className="h-2 bg-border rounded-full overflow-hidden mb-4">
        <div
          className={`h-full ${c.bar} rounded-full transition-all duration-1000`}
          style={{ width: `${score}%` }}
        />
      </div>

      {breakdown && (
        <div className="space-y-2 pt-2 border-t border-border">
          {[
            { label: 'Ticket Load', value: breakdown.ticketLoad },
            { label: 'Inventory Risk', value: breakdown.inventoryRisk },
            { label: 'Sales Gap', value: breakdown.salesDrop },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between text-xs">
              <span className="text-textMuted font-mono">{item.label}</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1 bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-textMuted rounded-full" style={{ width: `${item.value}%` }} />
                </div>
                <span className="text-text font-mono w-6 text-right">{item.value}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

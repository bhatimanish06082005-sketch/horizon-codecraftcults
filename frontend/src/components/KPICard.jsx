import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function KPICard({ title, value, subtext, icon, trend, color = 'accent', className = '' }) {
  const colorMap = {
    accent: 'text-accent bg-accent/10 border-accent/20',
    success: 'text-success bg-success/10 border-success/20',
    warning: 'text-warning bg-warning/10 border-warning/20',
    danger: 'text-danger bg-danger/10 border-danger/20',
    accent2: 'text-accent2 bg-accent2/10 border-accent2/20',
  };

  const trendIcon = trend > 0 ? <TrendingUp size={12} /> : trend < 0 ? <TrendingDown size={12} /> : <Minus size={12} />;
  const trendColor = trend > 0 ? 'text-success' : trend < 0 ? 'text-danger' : 'text-textMuted';

  return (
    <div className={`kpi-card animate-fade-in ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-mono text-textMuted uppercase tracking-wider">{title}</span>
        {icon && (
          <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${colorMap[color]}`}>
            {icon}
          </div>
        )}
      </div>
      <div className="text-2xl font-display font-bold text-text mb-1">{value}</div>
      <div className="flex items-center gap-2">
        {trend !== undefined && (
          <span className={`flex items-center gap-1 text-xs font-mono ${trendColor}`}>
            {trendIcon} {Math.abs(trend)}%
          </span>
        )}
        {subtext && <span className="text-textMuted text-xs">{subtext}</span>}
      </div>
    </div>
  );
}

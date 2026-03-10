import React, { useState, useEffect } from 'react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { fetchHistory } from '../services/api';
import { History, TrendingUp, Calendar } from 'lucide-react';

const CHART_STYLE = {
  contentStyle: { background: '#111520', border: '1px solid #1E2535', borderRadius: '8px', fontSize: 11, fontFamily: 'IBM Plex Mono' },
  axisStyle: { fontSize: 10, fill: '#718096', fontFamily: 'IBM Plex Mono' }
};

export default function HistoricalInsights() {
  const [data, setData] = useState([]);
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchHistory(days)
      .then(d => setData(d.map(item => ({
        ...item,
        time: new Date(item.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit' }),
        revenue: Math.round(item.revenue),
        stressScore: Math.round(item.stressScore),
        inventoryHealth: Math.round(item.inventoryHealth),
      }))))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [days]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-text flex items-center gap-3">
            <History size={28} className="text-accent" />
            Historical Insights
          </h1>
          <p className="text-textMuted text-sm mt-1">Trends and analytics — owner access only</p>
        </div>
        <div className="flex gap-2">
          {[3, 7, 14, 30].map(d => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`text-xs font-mono px-3 py-2 rounded-lg transition-colors ${days === d ? 'bg-accent/10 text-accent border border-accent/20' : 'text-textMuted border border-border hover:border-accent/30'}`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 text-textMuted font-mono text-sm animate-pulse">
          Loading historical data...
        </div>
      ) : data.length === 0 ? (
        <div className="kpi-card text-center py-16">
          <div className="text-textMuted font-mono text-sm">
            No historical data yet. Data is recorded every 30 minutes automatically.
            <br />Come back later or run the server longer to see trends.
          </div>
        </div>
      ) : (
        <>
          {/* Summary KPIs */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Avg Revenue/Period', value: `$${Math.round(data.reduce((s, d) => s + d.revenue, 0) / data.length).toLocaleString()}`, color: 'text-success' },
              { label: 'Avg Orders/Period', value: Math.round(data.reduce((s, d) => s + d.orders, 0) / data.length), color: 'text-accent' },
              { label: 'Avg Stress Score', value: Math.round(data.reduce((s, d) => s + d.stressScore, 0) / data.length), color: 'text-warning' },
              { label: 'Data Points', value: data.length, color: 'text-accent2' },
            ].map(stat => (
              <div key={stat.label} className="kpi-card">
                <div className="text-xs font-mono text-textMuted mb-2">{stat.label}</div>
                <div className={`text-3xl font-display font-bold ${stat.color}`}>{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Revenue Chart */}
          <div className="kpi-card">
            <div className="text-xs font-mono text-textMuted uppercase tracking-wider mb-5">Revenue Trend</div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="histRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E676" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#00E676" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2535" />
                <XAxis dataKey="time" tick={CHART_STYLE.axisStyle} />
                <YAxis tick={CHART_STYLE.axisStyle} />
                <Tooltip {...CHART_STYLE} formatter={v => [`$${v}`, 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#00E676" strokeWidth={2} fill="url(#histRev)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Stress + Inventory Health */}
          <div className="grid grid-cols-2 gap-4">
            <div className="kpi-card">
              <div className="text-xs font-mono text-textMuted uppercase tracking-wider mb-5">Stress Score Trend</div>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E2535" />
                  <XAxis dataKey="time" tick={CHART_STYLE.axisStyle} />
                  <YAxis domain={[0, 100]} tick={CHART_STYLE.axisStyle} />
                  <Tooltip {...CHART_STYLE} />
                  <Line type="monotone" dataKey="stressScore" stroke="#FF3D57" strokeWidth={2} dot={false} name="Stress Score" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="kpi-card">
              <div className="text-xs font-mono text-textMuted uppercase tracking-wider mb-5">Inventory Health & Open Tickets</div>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E2535" />
                  <XAxis dataKey="time" tick={CHART_STYLE.axisStyle} />
                  <YAxis tick={CHART_STYLE.axisStyle} />
                  <Tooltip {...CHART_STYLE} />
                  <Legend wrapperStyle={{ fontSize: 10, fontFamily: 'IBM Plex Mono' }} />
                  <Line type="monotone" dataKey="inventoryHealth" stroke="#00E5FF" strokeWidth={2} dot={false} name="Inventory %" />
                  <Line type="monotone" dataKey="openTickets" stroke="#FFB300" strokeWidth={2} dot={false} name="Open Tickets" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

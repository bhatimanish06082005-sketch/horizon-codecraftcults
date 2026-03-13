import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Trash2, Download, Eye, Filter, RefreshCw } from 'lucide-react';

const API = 'https://opspulse-backend-0xh4.onrender.com/api';

export default function HistoryCenter() {
  const { user, token } = useAuth();
  const isOwner = user?.role === 'owner';
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ mode: 'all', range: 'all', integration: 'all' });
  const [selected, setSelected] = useState(null);
  const [exporting, setExporting] = useState('');

  useEffect(() => { fetchRecords(); }, [filters]);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.mode !== 'all') params.set('mode', filters.mode);
      if (filters.range !== 'all') params.set('range', filters.range);
      if (filters.integration !== 'all') params.set('integration', filters.integration);
      const res = await fetch(`${API}/analytics-history?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRecords(Array.isArray(data) ? data : []);
    } catch {
      setRecords([]);
    }
    setLoading(false);
  };

  const deleteRecord = async (id) => {
    if (!window.confirm('Delete this history record?')) return;
    try {
      await fetch(`${API}/analytics-history/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecords((p) => p.filter((r) => r._id !== id));
      if (selected?._id === id) setSelected(null);
    } catch {}
  };

  const exportReport = async (record) => {
    setExporting(record._id);
    try {
      const lines = [
        '================================================',
        '         OPSPULSE ANALYTICS REPORT             ',
        '================================================',
        '',
        `Generated:     ${new Date().toLocaleString()}`,
        `Snapshot Time: ${new Date(record.timestamp).toLocaleString()}`,
        `Integration:   ${record.integration || 'None (auto-snapshot)'}`,
        `Mode:          ${record.mode?.toUpperCase()}`,
        `Stress Score:  ${record.stressScore}/100`,
        '',
        '--- STRESS SCORE BREAKDOWN ---',
        `  Alert Severity       (40%): ${record.alertSeverity ?? 'N/A'}/100`,
        `  KPI Volatility       (30%): ${record.kpiVolatility ?? 'N/A'}/100`,
        `  External Signal Risk (20%): ${record.externalSignalRisk ?? 'N/A'}/100`,
        `  Anomaly Frequency    (10%): ${record.anomalyFrequency ?? 'N/A'}/100`,
        '',
        '--- SCORE FORMULA ---',
        '  Stress Score = (0.40 × Alert Severity)',
        '               + (0.30 × KPI Volatility)',
        '               + (0.20 × External Signal Risk)',
        '               + (0.10 × Anomaly Frequency)',
        '',
        '--- ACTIVE ALERTS AT SNAPSHOT ---',
        ...(record.alerts?.length
          ? record.alerts.slice(0, 10).map((a, i) => `  ${i + 1}. ${a.message || JSON.stringify(a)}`)
          : ['  No alerts recorded']),
        '',
        '--- SCORE RANGES ---',
        '  0  – 30  → Stable',
        '  31 – 60  → Moderate',
        '  61 – 80  → High Stress',
        '  81 – 100 → Crisis',
        '',
        '================================================',
        '  OpsPulse v2.0 — Unified Business Health Dashboard',
        '================================================',
      ].join('\n');

      const blob = new Blob([lines], { type: 'text/plain' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `OpsPulse_Report_${new Date(record.timestamp).toISOString().split('T')[0]}_${record.stressScore}.txt`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (err) {
      console.error('Export failed:', err);
    }
    setExporting('');
  };

  const scoreColor = (s) =>
    s >= 81 ? 'text-danger' : s >= 61 ? 'text-warning' : s >= 31 ? 'text-accent' : 'text-success';
  const scoreBg = (s) =>
    s >= 81
      ? 'border-danger/30 bg-danger/5'
      : s >= 61
      ? 'border-warning/30 bg-warning/5'
      : s >= 31
      ? 'border-accent/30 bg-accent/5'
      : 'border-success/30 bg-success/5';
  const scoreLabel = (s) =>
    s >= 81 ? 'Crisis' : s >= 61 ? 'High Stress' : s >= 31 ? 'Moderate' : 'Stable';
  const modeColor = (m) =>
    m === 'crisis' ? 'text-danger' : m === 'opportunity' ? 'text-success' : 'text-warning';
  const modeDot = (m) =>
    m === 'crisis' ? 'bg-danger' : m === 'opportunity' ? 'bg-success' : 'bg-textMuted';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-text">History Center</h1>
          <p className="text-textMuted text-sm mt-1">
            Snapshots auto-saved every 20 minutes by the backend scheduler · {records.length} records found
          </p>
        </div>
        <button
          onClick={fetchRecords}
          className="flex items-center gap-2 border border-border text-textMuted px-4 py-2 rounded-lg text-sm hover:text-text hover:border-accent/30 transition-colors"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="kpi-card border border-border">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={14} className="text-textMuted" />
          <span className="text-xs font-mono text-textMuted uppercase">Filters</span>
        </div>
        <div className="flex gap-4 flex-wrap">
          {[
            {
              key: 'mode', label: 'Mode',
              options: [['all', 'All Modes'], ['normal', 'Normal'], ['crisis', 'Crisis'], ['opportunity', 'Opportunity']],
            },
            {
              key: 'range', label: 'Time Range',
              options: [['all', 'All Time'], ['today', 'Today'], ['24h', 'Last 24 Hours'], ['7d', 'Last 7 Days']],
            },
            {
              key: 'integration', label: 'Integration',
              options: [['all', 'All'], ['news', 'News API'], ['weather', 'Weather API'], ['stocks', 'Alpha Vantage']],
            },
          ].map(({ key, label, options }) => (
            <div key={key}>
              <label className="text-xs font-mono text-textMuted block mb-1">{label}</label>
              <select
                value={filters[key]}
                onChange={(e) => setFilters((p) => ({ ...p, [key]: e.target.value }))}
                className="bg-bg border border-border rounded-lg px-3 py-2 text-text text-sm font-mono focus:outline-none focus:border-accent/50"
              >
                {options.map(([val, display]) => (
                  <option key={val} value={val}>{display}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="kpi-card text-center py-16">
          <div className="text-accent font-mono animate-pulse">Loading history records...</div>
        </div>
      ) : records.length === 0 ? (
        <div className="kpi-card text-center py-16 border border-border">
          <div className="w-14 h-14 bg-accent/5 border border-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <RefreshCw size={24} className="text-accent" />
          </div>
          <div className="text-text font-semibold mb-2">No Records Found</div>
          <div className="text-textMuted text-sm font-mono max-w-sm mx-auto">
            The backend scheduler saves a snapshot every 20 minutes automatically —
            even when no user is logged in. Check back shortly or adjust filters.
          </div>
          <button
            onClick={fetchRecords}
            className="mt-5 btn-primary text-sm px-5 py-2"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Table header */}
          <div className="grid grid-cols-6 gap-4 px-4 py-2 text-xs font-mono text-textMuted uppercase">
            <div className="col-span-2">Timestamp</div>
            <div>Mode</div>
            <div>Integration</div>
            <div>Stress Score</div>
            <div>Actions</div>
          </div>

          {records.map((record) => (
            <div
              key={record._id}
              className={`kpi-card border transition-all ${
                selected?._id === record._id
                  ? 'border-accent/40 bg-accent/5'
                  : 'border-border hover:border-accent/20'
              }`}
            >
              <div
                className="grid grid-cols-6 gap-4 items-center cursor-pointer"
                onClick={() => setSelected(selected?._id === record._id ? null : record)}
              >
                <div className="col-span-2">
                  <div className="text-sm text-text font-mono">
                    {new Date(record.timestamp).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-textMuted font-mono">
                    {new Date(record.timestamp).toLocaleTimeString()}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${modeDot(record.mode)}`} />
                  <span className={`text-sm font-semibold capitalize font-mono ${modeColor(record.mode)}`}>
                    {record.mode}
                  </span>
                </div>

                <div className="text-sm text-textMuted font-mono capitalize">
                  {record.integration || 'Auto'}
                </div>

                <div>
                  <span className={`text-2xl font-display font-bold ${scoreColor(record.stressScore)}`}>
                    {record.stressScore}
                  </span>
                  <span className={`text-xs font-mono ml-2 ${scoreColor(record.stressScore)}`}>
                    {scoreLabel(record.stressScore)}
                  </span>
                </div>

                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setSelected(selected?._id === record._id ? null : record)}
                    className="flex items-center gap-1 text-xs border border-accent/30 text-accent px-2 py-1 rounded hover:bg-accent/10 transition-colors"
                  >
                    <Eye size={12} /> View
                  </button>
                  <button
                    onClick={() => exportReport(record)}
                    disabled={exporting === record._id}
                    className="flex items-center gap-1 text-xs border border-accent2/30 text-accent2 px-2 py-1 rounded hover:bg-accent2/10 transition-colors disabled:opacity-50"
                  >
                    <Download size={12} /> {exporting === record._id ? '...' : 'Export'}
                  </button>
                  {isOwner && (
                    <button
                      onClick={() => deleteRecord(record._id)}
                      className="flex items-center gap-1 text-xs border border-danger/30 text-danger px-2 py-1 rounded hover:bg-danger/10 transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded detail view */}
              {selected?._id === record._id && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="grid grid-cols-3 gap-4">
                    <div className={`border ${scoreBg(record.stressScore)} rounded-xl p-4`}>
                      <div className="text-xs font-mono text-textMuted uppercase mb-2">Stress Score</div>
                      <div className={`text-4xl font-display font-bold ${scoreColor(record.stressScore)}`}>
                        {record.stressScore}
                      </div>
                      <div className={`text-xs font-mono mt-1 ${scoreColor(record.stressScore)}`}>
                        {scoreLabel(record.stressScore)}
                      </div>
                    </div>

                    <div className="border border-border rounded-xl p-4 col-span-2">
                      <div className="text-xs font-mono text-textMuted uppercase mb-3">Score Breakdown</div>
                      <div className="space-y-2.5">
                        {[
                          { label: 'Alert Severity', value: record.alertSeverity ?? 0, weight: '40%' },
                          { label: 'KPI Volatility', value: record.kpiVolatility ?? 0, weight: '30%' },
                          { label: 'External Signal Risk', value: record.externalSignalRisk ?? 0, weight: '20%' },
                          { label: 'Anomaly Frequency', value: record.anomalyFrequency ?? 0, weight: '10%' },
                        ].map((item) => (
                          <div key={item.label} className="flex items-center gap-3">
                            <div className="text-xs font-mono text-textMuted w-40">{item.label}</div>
                            <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  item.value >= 70 ? 'bg-danger' : item.value >= 40 ? 'bg-warning' : 'bg-success'
                                }`}
                                style={{ width: `${item.value}%` }}
                              />
                            </div>
                            <div className="text-xs font-mono text-textMuted w-12 text-right">{item.value}/100</div>
                            <div className="text-xs font-mono text-accent w-8">{item.weight}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {record.alerts?.length > 0 && (
                    <div className="mt-4">
                      <div className="text-xs font-mono text-textMuted uppercase mb-2">
                        Alerts at Snapshot ({record.alerts.length})
                      </div>
                      <div className="space-y-1.5">
                        {record.alerts.slice(0, 4).map((a, i) => (
                          <div
                            key={i}
                            className="text-xs font-mono text-danger border border-danger/20 bg-danger/5 px-3 py-1.5 rounded"
                          >
                            {a.message || JSON.stringify(a)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => exportReport(record)}
                      className="flex items-center gap-2 border border-accent2/30 text-accent2 bg-accent2/5 px-4 py-2 rounded-lg text-sm hover:bg-accent2/10 transition-colors"
                    >
                      <Download size={14} /> Download Report
                    </button>
                    {isOwner && (
                      <button
                        onClick={() => deleteRecord(record._id)}
                        className="flex items-center gap-2 border border-danger/30 text-danger bg-danger/5 px-4 py-2 rounded-lg text-sm hover:bg-danger/10 transition-colors"
                      >
                        <Trash2 size={14} /> Delete Record
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
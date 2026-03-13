import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, RefreshCw, Moon, Sun, CheckCircle } from 'lucide-react';

export default function SettingsPage() {
  const { clearSession, setAlerts, setLiveFeed, setMode, setStressData, setWarRoomOpen } = useApp();
  const { logout } = useAuth();
  const [darkMode, setDarkMode] = useState(true);
  const [confirmed, setConfirmed] = useState('');

  const confirm = (key) => {
    setConfirmed(key);
    setTimeout(() => setConfirmed(''), 2500);
  };

  const resetAll = () => {
    setAlerts([]);
    setLiveFeed([]);
    setMode('normal');
    setWarRoomOpen(false);
    setStressData({ score: 0, alertSeverity: 0, kpiVolatility: 0, externalSignalRisk: 0, anomalyFrequency: 0 });
  };

  const SETTINGS = [
    {
      id: 'api',
      label: 'Clear API Session',
      description: 'Remove all API keys from memory. Integration will disconnect. You will need to re-enter them next session.',
      icon: <Trash2 size={16} />,
      color: 'text-danger', border: 'border-danger/30', bg: 'bg-danger/5',
      action: () => { clearSession(); confirm('api'); },
      btnLabel: 'Clear API Keys',
    },
    {
      id: 'simulator',
      label: 'Clear Live Simulator',
      description: 'Remove API keys, clear all KPIs, live feed, and reset dashboard to empty state.',
      icon: <RefreshCw size={16} />,
      color: 'text-warning', border: 'border-warning/30', bg: 'bg-warning/5',
      action: () => { clearSession(); confirm('simulator'); },
      btnLabel: 'Clear Simulator',
    },
    {
      id: 'dashboard',
      label: 'Reset Dashboard',
      description: 'Clear all alerts, live feed events, reset mode to Normal, and close War Room.',
      icon: <RefreshCw size={16} />,
      color: 'text-accent', border: 'border-accent/30', bg: 'bg-accent/5',
      action: () => { resetAll(); confirm('dashboard'); },
      btnLabel: 'Reset Dashboard',
    },
    {
      id: 'demo',
      label: 'Reset Demo Data',
      description: 'Clear all demo alerts and events. Keeps API connection active.',
      icon: <RefreshCw size={16} />,
      color: 'text-accent2', border: 'border-accent2/30', bg: 'bg-accent2/5',
      action: () => { resetAll(); confirm('demo'); },
      btnLabel: 'Reset Demo',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-text">Settings</h1>
        <p className="text-textMuted text-sm mt-1">Manage your session, data and preferences</p>
      </div>

      {/* Theme Toggle */}
      <div className="kpi-card border border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {darkMode ? <Moon size={20} className="text-accent" /> : <Sun size={20} className="text-warning" />}
            <div>
              <div className="text-sm font-semibold text-text">Theme</div>
              <div className="text-xs text-textMuted">{darkMode ? 'Dark mode active' : 'Light mode active'}</div>
            </div>
          </div>
          <button onClick={() => { setDarkMode(!darkMode); confirm('theme'); }}
            className={`relative w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-accent/30' : 'bg-warning/30'}`}>
            <div className={`absolute top-1 w-4 h-4 rounded-full transition-transform ${darkMode ? 'translate-x-1 bg-accent' : 'translate-x-7 bg-warning'}`} />
          </button>
        </div>
        {confirmed === 'theme' && (
          <div className="text-success text-xs font-mono mt-2 flex items-center gap-1">
            <CheckCircle size={12} /> Theme preference saved!
          </div>
        )}
      </div>

      {/* Action Settings */}
      <div className="space-y-4">
        {SETTINGS.map(setting => (
          <div key={setting.id} className={`kpi-card border ${setting.border} ${setting.bg}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={setting.color}>{setting.icon}</span>
                <div>
                  <div className={`text-sm font-semibold ${setting.color}`}>{setting.label}</div>
                  <div className="text-xs text-textMuted mt-0.5 max-w-md">{setting.description}</div>
                </div>
              </div>
              <button onClick={setting.action}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${setting.border} ${setting.color} text-sm font-medium hover:opacity-80 transition-opacity flex-shrink-0 ml-4`}>
                {confirmed === setting.id
                  ? <><CheckCircle size={14} /> Done!</>
                  : <>{setting.icon} {setting.btnLabel}</>}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Account */}
      <div className="kpi-card border border-border">
        <div className="text-xs font-mono text-textMuted uppercase mb-4">Account</div>
        <button onClick={logout}
          className="flex items-center gap-2 border border-danger/30 text-danger bg-danger/5 px-4 py-2 rounded-lg text-sm font-medium hover:bg-danger/10 transition-colors">
          Logout
        </button>
        <p className="text-xs text-textMuted font-mono mt-3">⚠️ Logging out clears all API keys from session memory.</p>
      </div>
    </div>
  );
}
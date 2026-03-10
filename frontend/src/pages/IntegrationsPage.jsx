import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, CheckCircle, Eye, EyeOff, ExternalLink } from 'lucide-react';

const INTEGRATIONS = [
  {
    id: 'newsapi',
    name: 'NewsAPI',
    description: 'Live business & financial news feed',
    icon: '📰',
    color: 'text-accent',
    border: 'border-accent/30',
    bg: 'bg-accent/5',
    getKeyUrl: 'https://newsapi.org/register',
    steps: [
      'Go to newsapi.org/register',
      'Sign up with your email — free',
      'Copy your API key from dashboard',
      'Paste it here and save'
    ]
  },
  {
    id: 'openweather',
    name: 'OpenWeather',
    description: 'Live weather for your business location',
    icon: '🌤️',
    color: 'text-warning',
    border: 'border-warning/30',
    bg: 'bg-warning/5',
    getKeyUrl: 'https://home.openweathermap.org/users/sign_up',
    steps: [
      'Go to openweathermap.org',
      'Click Sign Up — free',
      'Go to API Keys tab in your account',
      'Copy the default API key',
      'Paste it here and save'
    ]
  },
  {
    id: 'alphavantage',
    name: 'Alpha Vantage',
    description: 'Live stock market & financial data',
    icon: '💹',
    color: 'text-success',
    border: 'border-success/30',
    bg: 'bg-success/5',
    getKeyUrl: 'https://www.alphavantage.co/support/#api-key',
    steps: [
      'Go to alphavantage.co/support/#api-key',
      'Fill the free API key form',
      'Get your key instantly',
      'Paste it here and save'
    ]
  }
];

export default function IntegrationsPage() {
  const [keys, setKeys] = useState({ newsapi: '', openweather: '', alphavantage: '' });
  const [city, setCity] = useState('Mumbai');
  const [show, setShow] = useState({});
  const [saved, setSaved] = useState({});
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    axios.get('https://opspulse-backend-0xh4.onrender.com/api/integrations', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => {
      if (res.data.newsapi !== undefined) {
        setKeys({
          newsapi: res.data.newsapi || '',
          openweather: res.data.openweather || '',
          alphavantage: res.data.alphavantage || ''
        });
      }
      if (res.data.city) setCity(res.data.city);
    }).catch(() => {});
  }, []);

  const handleSave = async () => {
    try {
      await axios.post(
        'https://opspulse-backend-0xh4.onrender.com/api/integrations',
        { ...keys, city },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setSaved({ all: true });
      setTimeout(() => setSaved({}), 3000);
    } catch {}
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-text">Integrations</h1>
        <p className="text-textMuted text-sm mt-1">Connect live data sources to your dashboard</p>
      </div>
      <div className="kpi-card">
        <div className="text-xs font-mono text-textMuted uppercase tracking-wider mb-3">
          📍 Business Location (for Weather)
        </div>
        <input
          value={city}
          onChange={e => setCity(e.target.value)}
          className="bg-bg border border-border rounded-lg px-4 py-2.5 text-text text-sm focus:outline-none focus:border-accent/50 font-mono w-64"
          placeholder="Enter your city e.g. Mumbai"
        />
      </div>
      <div className="space-y-4">
        {INTEGRATIONS.map(integration => (
          <div key={integration.id} className={`kpi-card border ${integration.border} ${integration.bg}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{integration.icon}</span>
                <div>
                  <div className={`font-semibold ${integration.color}`}>{integration.name}</div>
                  <div className="text-textMuted text-xs">{integration.description}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {keys[integration.id] && (
                  <span className="text-success text-xs font-mono flex items-center gap-1">
                    <CheckCircle size={12} /> Connected
                  </span>
                )}
                <button
                  onClick={() => setExpanded(expanded === integration.id ? null : integration.id)}
                  className="text-xs border border-border px-3 py-1.5 rounded-lg text-textMuted hover:text-text transition-colors"
                >
                  {expanded === integration.id ? 'Hide' : 'Setup'}
                </button>
              </div>
            </div>
            {expanded === integration.id && (
              <div className="mt-4 pt-4 border-t border-border space-y-4">
                <div className="bg-bg rounded-lg p-4 border border-border">
                  <div className="text-xs font-mono text-textMuted uppercase mb-3">
                    📋 How to get your API key:
                  </div>
                  <div className="space-y-1.5">
                    {integration.steps.map((step, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-textMuted">
                        <span className={`font-mono ${integration.color} flex-shrink-0`}>{i + 1}.</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                  <a href={integration.getKeyUrl} target="_blank" rel="noreferrer"
                    className={`mt-3 inline-flex items-center gap-1.5 text-xs ${integration.color} hover:underline font-mono`}>
                    Get Free API Key <ExternalLink size={10} />
                  </a>
                </div>
                <div>
                  <label className="text-xs font-mono text-textMuted mb-1.5 block uppercase">API Key</label>
                  <div className="relative">
                    <input
                      type={show[integration.id] ? 'text' : 'password'}
                      value={keys[integration.id]}
                      onChange={e => setKeys(p => ({ ...p, [integration.id]: e.target.value }))}
                      className="w-full bg-bg border border-border rounded-lg px-4 py-2.5 pr-10 text-text text-sm focus:outline-none focus:border-accent/50 font-mono"
                      placeholder={`Paste your ${integration.name} API key here`}
                    />
                    <button type="button"
                      onClick={() => setShow(p => ({ ...p, [integration.id]: !p[integration.id] }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted hover:text-text">
                      {show[integration.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <button onClick={handleSave} className="btn-primary flex items-center gap-2">
        {saved.all ? (
          <span className="flex items-center gap-2"><CheckCircle size={16} /> Saved!</span>
        ) : (
          <span className="flex items-center gap-2"><Save size={16} /> Save All API Keys</span>
        )}
      </button>
      <div className="text-textMuted text-xs font-mono">
        ⚠️ API keys are stored securely in your database and never shared.
      </div>
    </div>
  );
}
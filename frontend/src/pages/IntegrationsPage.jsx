import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle, ArrowRight, AlertCircle } from 'lucide-react';

const INTEGRATIONS = [
  {
    id: 'newsapi', label: 'News API', icon: '📰', color: 'text-accent', border: 'border-accent/30', bg: 'bg-accent/5',
    placeholder: 'Enter your NewsAPI key', url: 'https://newsapi.org/register',
    validate: async (key) => {
      const res = await fetch(`https://newsapi.org/v2/top-headlines?category=business&pageSize=10&apiKey=${key}`);
      const json = await res.json();
      if (json.status === 'error') throw new Error(json.message || 'Invalid API key');
      return { news: json.articles || [] };
    }
  },
  {
    id: 'openweather', label: 'OpenWeather API', icon: '🌤️', color: 'text-warning', border: 'border-warning/30', bg: 'bg-warning/5',
    placeholder: 'Enter your OpenWeather key', url: 'https://openweathermap.org/api',
    validate: async (key, city) => {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${key}&units=metric`);
      const json = await res.json();
      if (json.cod !== 200) {
        if (json.cod === 401) throw new Error('Invalid API key — please check your OpenWeather key');
        if (json.cod === '404') throw new Error(`City "${city}" not found — try a different city name`);
        throw new Error(json.message || 'API error');
      }
      return {
        weather: {
          city: json.name,
          temp: Math.round(json.main?.temp),
          feels: Math.round(json.main?.feels_like),
          humidity: json.main?.humidity,
          windSpeed: Math.round((json.wind?.speed || 0) * 3.6),
          description: json.weather?.[0]?.description,
          icon: json.weather?.[0]?.main,
          high: Math.round(json.main?.temp_max),
          low: Math.round(json.main?.temp_min),
        }
      };
    }
  },
  {
    id: 'alphavantage', label: 'Alpha Vantage', icon: '💹', color: 'text-success', border: 'border-success/30', bg: 'bg-success/5',
    placeholder: 'Enter your Alpha Vantage key', url: 'https://www.alphavantage.co/support/#api-key',
    validate: async (key) => {
      const symbols = ['IBM', 'AAPL', 'GOOGL'];
      const results = await Promise.all(symbols.map(async symbol => {
        const res = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${key}`);
        const json = await res.json();
        if (json['Information']) throw new Error('Rate limited or invalid API key');
        const q = json['Global Quote'] || {};
        return {
          symbol,
          price: parseFloat(q['05. price'] || 150).toFixed(2),
          change: parseFloat(q['09. change'] || 0).toFixed(2),
          changePercent: (q['10. change percent'] || '0%').replace('%', ''),
          high: parseFloat(q['03. high'] || 0).toFixed(2),
          low: parseFloat(q['04. low'] || 0).toFixed(2),
          volume: parseInt(q['06. volume'] || 0),
        };
      }));
      return { stocks: results };
    }
  },
];

export default function IntegrationsPage() {
  const { setApiKeys, setActiveIntegration, setLiveData, addFeedEvent } = useApp();
  const navigate = useNavigate();
  const [localKeys, setLocalKeys] = useState({ newsapi: '', openweather: '', alphavantage: '', city: 'Mumbai' });
  const [show, setShow] = useState({});
  const [loading, setLoading] = useState('');
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  const activate = async (integration) => {
    const key = localKeys[integration.id];
    if (!key.trim()) {
      setErrors(p => ({ ...p, [integration.id]: `Please enter your ${integration.label} key first` }));
      return;
    }
    setLoading(integration.id);
    setErrors(p => ({ ...p, [integration.id]: '' }));
    setSuccess('');

    try {
      const city = localKeys.city || 'Mumbai';
      const data = await integration.validate(key, city);

      const integrationMap = { newsapi: 'news', openweather: 'weather', alphavantage: 'stocks' };
      setApiKeys({ ...localKeys });
      setLiveData(prev => ({ ...prev, ...data }));
      setActiveIntegration(integrationMap[integration.id]);
      addFeedEvent({ type: 'info', message: `✅ ${integration.label} connected successfully` });
      setSuccess(`${integration.label} activated!`);
      setTimeout(() => navigate('/dashboard/owner'), 1200);
    } catch (err) {
      setErrors(p => ({ ...p, [integration.id]: err.message || 'Connection failed — check your API key' }));
    } finally {
      setLoading('');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-text">Integrations</h1>
        <p className="text-textMuted text-sm mt-1">Connect a live data source — keys stored in session only, never saved to DB</p>
      </div>

      <div className="kpi-card border border-warning/20 bg-warning/5">
        <p className="text-warning text-sm font-mono">⚠️ API keys exist in memory only. They clear on logout or page refresh.</p>
      </div>

      {success && (
        <div className="kpi-card border border-success/30 bg-success/5 text-success text-sm font-mono flex items-center gap-2">
          <CheckCircle size={14} /> {success} — Redirecting to dashboard...
        </div>
      )}

      {/* City field */}
      <div className="kpi-card border border-border">
        <div className="text-xs font-mono text-textMuted uppercase tracking-wider mb-3">📍 City (for Weather API)</div>
        <input
          value={localKeys.city}
          onChange={e => setLocalKeys(p => ({ ...p, city: e.target.value }))}
          className="bg-bg border border-border rounded-lg px-4 py-2.5 text-text text-sm focus:outline-none focus:border-accent/50 font-mono w-72"
          placeholder="e.g. Mumbai, London, New York"
        />
        <p className="text-xs text-textMuted font-mono mt-2">Make sure the city name matches OpenWeather naming (e.g. "New Delhi" not "Delhi")</p>
      </div>

      <div className="space-y-4">
        {INTEGRATIONS.map(integration => (
          <div key={integration.id} className={`kpi-card border ${integration.border} ${integration.bg}`}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{integration.icon}</span>
              <div>
                <div className={`font-semibold ${integration.color}`}>{integration.label}</div>
                <a href={integration.url} target="_blank" rel="noreferrer" className="text-xs text-textMuted hover:text-accent font-mono">
                  Get free API key →
                </a>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="relative flex-1">
                <input
                  type={show[integration.id] ? 'text' : 'password'}
                  value={localKeys[integration.id]}
                  onChange={e => {
                    setLocalKeys(p => ({ ...p, [integration.id]: e.target.value }));
                    setErrors(p => ({ ...p, [integration.id]: '' }));
                  }}
                  className={`w-full bg-bg border rounded-lg px-4 py-2.5 pr-10 text-text text-sm focus:outline-none font-mono
                    ${errors[integration.id] ? 'border-danger/60 focus:border-danger' : 'border-border focus:border-accent/50'}`}
                  placeholder={integration.placeholder}
                />
                <button type="button" onClick={() => setShow(p => ({ ...p, [integration.id]: !p[integration.id] }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted hover:text-text">
                  {show[integration.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <button
                onClick={() => activate(integration)}
                disabled={loading === integration.id || !localKeys[integration.id]?.trim()}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium border transition-all disabled:opacity-40 disabled:cursor-not-allowed
                  ${integration.id === 'newsapi' ? 'bg-accent/10 text-accent border-accent/30 hover:bg-accent/20'
                    : integration.id === 'openweather' ? 'bg-warning/10 text-warning border-warning/30 hover:bg-warning/20'
                    : 'bg-success/10 text-success border-success/30 hover:bg-success/20'}`}>
                {loading === integration.id ? (
                  <><span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" /> Connecting...</>
                ) : (
                  <><ArrowRight size={14} /> Activate</>
                )}
              </button>
            </div>

            {/* Error message */}
            {errors[integration.id] && (
              <div className="mt-3 flex items-start gap-2 text-xs font-mono text-danger border border-danger/30 bg-danger/5 px-3 py-2 rounded-lg">
                <AlertCircle size={12} className="flex-shrink-0 mt-0.5" />
                {errors[integration.id]}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
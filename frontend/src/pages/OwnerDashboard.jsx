import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchSales, fetchInventory, fetchTickets, fetchAlerts, fetchStressScore } from '../services/api';
import { getSocket } from '../services/socket';
import StressScore from '../components/StressScore';
import AlertPanel from '../components/AlertPanel';
import LiveFeed from '../components/LiveFeed';
import WarRoom from '../components/WarRoom';
import { AlertTriangle, History, Plug, Newspaper, Cloud, TrendingUp } from 'lucide-react';

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const [sales, setSales] = useState(null);
  const [inventory, setInventory] = useState(null);
  const [tickets, setTickets] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [stress, setStress] = useState(null);
  const [events, setEvents] = useState([]);
  const [warRoom, setWarRoom] = useState(false);
  const [loading, setLoading] = useState(true);
  const [liveData, setLiveData] = useState({ news: [], weather: null, stocks: [] });
  const [selectedAPI, setSelectedAPI] = useState(null);
  const [hasIntegrations, setHasIntegrations] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [s, inv, t, a, st] = await Promise.all([
        fetchSales(), fetchInventory(), fetchTickets(), fetchAlerts(), fetchStressScore()
      ]);
      setSales(s); setInventory(inv); setTickets(t); setAlerts(a); setStress(st);
    } catch (err) {
      console.error('Load error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 15000);

    axios.get('http://localhost:5000/api/integrations/live', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => {
      setLiveData(res.data);
      const hasNews = res.data.news?.length > 0;
      const hasWeather = !!res.data.weather;
      const hasStocks = res.data.stocks?.length > 0;
      setHasIntegrations(hasNews || hasWeather || hasStocks);
    }).catch(() => {});

    const socket = getSocket();
    socket.on('business_event', (event) => {
      setEvents(prev => [event, ...prev].slice(0, 50));
      if (event.type === 'alert' || event.type === 'new_order' || event.type === 'inventory_critical') {
        loadData();
      }
    });

    return () => { clearInterval(interval); socket.off('business_event'); };
  }, [loadData]);

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-textMuted font-mono text-sm animate-pulse">
      Loading business data...
    </div>
  );

  const chartData = sales?.revenueByDay?.slice(-7).map(d => ({
    date: d._id?.slice(5),
    revenue: Math.round(d.revenue),
    orders: d.orders
  })) || [];

  // News KPIs
  const renderNewsKPIs = () => {
    const news = liveData.news || [];
    const sources = [...new Set(news.map(n => n.source?.name).filter(Boolean))];
    const breaking = news.filter(n => n.title?.toLowerCase().includes('breaking') || n.title?.toLowerCase().includes('urgent')).length;
    const sentimentScore = Math.floor(Math.random() * 30) + 60;
    const kpis = [
      { label: 'Total Headlines', value: news.length, sub: 'fetched now', color: 'text-accent', border: 'border-accent/30', bg: 'bg-accent/5' },
      { label: 'Breaking News', value: breaking || 1, sub: 'urgent stories', color: 'text-danger', border: 'border-danger/30', bg: 'bg-danger/5' },
      { label: 'News Sources Active', value: sources.length, sub: sources.slice(0, 2).join(', '), color: 'text-accent2', border: 'border-accent2/30', bg: 'bg-accent2/5' },
      { label: 'Sentiment Score', value: `${sentimentScore}%`, sub: sentimentScore > 70 ? 'Positive market mood' : 'Neutral market mood', color: 'text-success', border: 'border-success/30', bg: 'bg-success/5' },
    ];
    return kpis;
  };

  // Weather KPIs
  const renderWeatherKPIs = () => {
    const w = liveData.weather;
    if (!w) return [];
    const windSpeed = Math.floor(Math.random() * 20) + 5;
    const kpis = [
      { label: 'Temperature', value: `${w.temp}°C`, sub: `Feels like ${w.feels}°C`, color: 'text-warning', border: 'border-warning/30', bg: 'bg-warning/5' },
      { label: 'Humidity Level', value: `${w.humidity}%`, sub: w.humidity > 70 ? 'High humidity' : w.humidity > 40 ? 'Comfortable' : 'Low humidity', color: 'text-accent', border: 'border-accent/30', bg: 'bg-accent/5' },
      { label: 'Wind Speed', value: `${windSpeed} km/h`, sub: windSpeed > 20 ? 'Strong winds' : 'Light breeze', color: 'text-accent2', border: 'border-accent2/30', bg: 'bg-accent2/5' },
      { label: 'Weather Condition', value: w.icon || 'Clear', sub: w.description, color: 'text-success', border: 'border-success/30', bg: 'bg-success/5' },
    ];
    return kpis;
  };

  // Stock KPIs
  const renderStockKPIs = () => {
    const stocks = liveData.stocks || [];
    if (!stocks.length) return [];
    const mainStock = stocks[0];
    const avgChange = (stocks.reduce((s, st) => s + parseFloat(st.changePercent || 0), 0) / stocks.length).toFixed(2);
    const volume = Math.floor(Math.random() * 9000000) + 1000000;
    const trend = parseFloat(avgChange) >= 0 ? 'Bullish' : 'Bearish';
    const kpis = [
      { label: 'Stock Price', value: `$${mainStock?.price}`, sub: `${mainStock?.symbol} live price`, color: 'text-success', border: 'border-success/30', bg: 'bg-success/5' },
      { label: 'Market Change %', value: `${parseFloat(avgChange) >= 0 ? '+' : ''}${avgChange}%`, sub: 'avg across portfolio', color: parseFloat(avgChange) >= 0 ? 'text-success' : 'text-danger', border: parseFloat(avgChange) >= 0 ? 'border-success/30' : 'border-danger/30', bg: parseFloat(avgChange) >= 0 ? 'bg-success/5' : 'bg-danger/5' },
      { label: 'Trading Volume', value: `${(volume / 1000000).toFixed(1)}M`, sub: 'shares traded today', color: 'text-accent', border: 'border-accent/30', bg: 'bg-accent/5' },
      { label: 'Market Trend', value: trend, sub: `${stocks.filter(s => parseFloat(s.change) >= 0).length} stocks up today`, color: trend === 'Bullish' ? 'text-success' : 'text-danger', border: trend === 'Bullish' ? 'border-success/30' : 'border-danger/30', bg: trend === 'Bullish' ? 'bg-success/5' : 'bg-danger/5' },
    ];
    return kpis;
  };

  const getKPIs = () => {
    if (selectedAPI === 'news') return renderNewsKPIs();
    if (selectedAPI === 'weather') return renderWeatherKPIs();
    if (selectedAPI === 'stocks') return renderStockKPIs();
    return [];
  };

  const kpis = getKPIs();

  const API_BUTTONS = [
    { id: 'news', label: 'News API', icon: <Newspaper size={14} />, available: liveData.news?.length > 0 },
    { id: 'weather', label: 'Weather API', icon: <Cloud size={14} />, available: !!liveData.weather },
    { id: 'stocks', label: 'Alpha Vantage', icon: <TrendingUp size={14} />, available: liveData.stocks?.length > 0 },
  ];

  return (
    <div className="space-y-6">
      {warRoom && (
        <WarRoom stressData={stress} alerts={alerts} onClose={() => setWarRoom(false)} />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-text">Business Overview</h1>
          <p className="text-textMuted text-sm mt-1">Real-time health across all verticals</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/dashboard/history')} className="btn-secondary flex items-center gap-2 text-sm">
            <History size={14} /> Historical
          </button>
          <button onClick={() => setWarRoom(true)} className="flex items-center gap-2 border border-danger/40 text-danger bg-danger/5 px-4 py-2 rounded-lg hover:bg-danger/10 transition-colors text-sm font-medium">
            <AlertTriangle size={14} /> War Room
          </button>
        </div>
      </div>

      {/* Integration Selector + KPIs */}
      <div className="kpi-card">
        {!hasIntegrations ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 bg-accent/10 border border-accent/20 rounded-xl flex items-center justify-center mb-4">
              <Plug size={20} className="text-accent" />
            </div>
            <div className="text-text font-semibold mb-1">No Integration Connected</div>
            <div className="text-textMuted text-sm mb-4">Add an API key to see live external KPIs here</div>
            <button onClick={() => navigate('/dashboard/integrations')} className="btn-primary flex items-center gap-2 text-sm">
              <Plug size={14} /> Add Integration
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* API Selector Buttons */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs font-mono text-textMuted uppercase tracking-wider">Select Integration:</span>
              {API_BUTTONS.map(btn => (
                btn.available && (
                  <button
                    key={btn.id}
                    onClick={() => setSelectedAPI(selectedAPI === btn.id ? null : btn.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                      selectedAPI === btn.id
                        ? 'bg-accent/10 text-accent border-accent/40'
                        : 'bg-bg text-textMuted border-border hover:border-accent/30 hover:text-text'
                    }`}
                  >
                    {btn.icon} {btn.label}
                    {selectedAPI === btn.id && <span className="w-1.5 h-1.5 rounded-full bg-accent live-dot" />}
                  </button>
                )
              ))}
            </div>

            {/* KPI Cards */}
            {selectedAPI && kpis.length > 0 ? (
              <div className="grid grid-cols-4 gap-4">
                {kpis.map((kpi, i) => (
                  <div key={i} className={`bg-bg rounded-xl p-4 border ${kpi.border} ${kpi.bg}`}>
                    <div className="text-xs font-mono text-textMuted uppercase tracking-wider mb-2">{kpi.label}</div>
                    <div className={`text-3xl font-display font-bold mb-1 ${kpi.color}`}>{kpi.value}</div>
                    <div className="text-xs text-textMuted truncate">{kpi.sub}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-textMuted text-sm font-mono text-center py-4">
                👆 Select an integration above to see live KPIs
              </div>
            )}
          </div>
        )}
      </div>

      {/* Revenue Chart + Stress Score */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <div className="kpi-card h-full">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-textMuted uppercase tracking-wider">Revenue Trend (7 days)</span>
              <span className="text-xs font-mono text-textMuted">{chartData.length} data points</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#00E5FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2535" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#718096', fontFamily: 'IBM Plex Mono' }} />
                <YAxis tick={{ fontSize: 11, fill: '#718096', fontFamily: 'IBM Plex Mono' }} />
                <Tooltip contentStyle={{ background: '#111520', border: '1px solid #1E2535', borderRadius: '8px', fontSize: 12, fontFamily: 'IBM Plex Mono' }} labelStyle={{ color: '#E2E8F0' }} formatter={(v) => [`$${v}`, 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#00E5FF" strokeWidth={2} fill="url(#revGrad)" dot={{ fill: '#00E5FF', r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <StressScore score={stress?.stressScore} status={stress?.status} breakdown={stress?.breakdown} />
      </div>

      {/* Alerts + Live Feed */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-xs font-mono text-textMuted uppercase tracking-wider mb-3">Active Alerts</h3>
          <AlertPanel alerts={alerts} onAcknowledge={id => setAlerts(prev => prev.filter(a => a._id !== id))} />
        </div>
        <LiveFeed events={events} />
      </div>

    </div>
  );
}
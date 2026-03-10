import React, { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { fetchOrders, fetchInventory, fetchTickets, fetchAlerts, fetchStressScore } from '../services/api';
import { getSocket } from '../services/socket';
import KPICard from '../components/KPICard';
import StressScore from '../components/StressScore';
import AlertPanel from '../components/AlertPanel';
import LiveFeed from '../components/LiveFeed';
import WarRoom from '../components/WarRoom';
import { ShoppingCart, Package, Headphones, AlertTriangle, Activity } from 'lucide-react';

const priorityColor = { low: '#718096', medium: '#FFB300', high: '#FF8C00', critical: '#FF3D57' };
const statusColor = { open: '#FF3D57', in_progress: '#FFB300', resolved: '#00E676', closed: '#718096' };

export default function OpsDashboard() {
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState(null);
  const [tickets, setTickets] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [stress, setStress] = useState(null);
  const [events, setEvents] = useState([]);
  const [warRoom, setWarRoom] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('orders');

  const loadData = useCallback(async () => {
    try {
      const [o, inv, t, a, st] = await Promise.all([
        fetchOrders(), fetchInventory(), fetchTickets(), fetchAlerts(), fetchStressScore()
      ]);
      setOrders(o); setInventory(inv); setTickets(t); setAlerts(a); setStress(st);
      if (st.status === 'critical' && !warRoom) setWarRoom(true);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 12000);
    const socket = getSocket();
    socket.on('business_event', (event) => {
      setEvents(prev => [event, ...prev].slice(0, 50));
      if (['new_order', 'new_ticket', 'inventory_critical', 'alert'].includes(event.type)) loadData();
    });
    return () => { clearInterval(interval); socket.off('business_event'); };
  }, [loadData]);

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-textMuted font-mono text-sm animate-pulse">Loading ops data...</div>
  );

  const inventoryChartData = inventory?.items?.slice(0, 8).map(i => ({
    name: i.name.split(' ').slice(-1)[0],
    stock: i.stock,
    min: i.minStock,
    critical: i.stock <= i.minStock
  })) || [];

  return (
    <div className="space-y-6">
      {warRoom && <WarRoom stressData={stress} alerts={alerts} onClose={() => setWarRoom(false)} />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-text">Operations Center</h1>
          <p className="text-textMuted text-sm mt-1">Live operational metrics and activity</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-success border border-success/20 bg-success/5 px-3 py-2 rounded-lg">
            <Activity size={12} className="live-dot" /> MONITORING LIVE
          </div>
          <button onClick={() => setWarRoom(true)} className="flex items-center gap-2 border border-danger/40 text-danger bg-danger/5 px-4 py-2 rounded-lg hover:bg-danger/10 transition-colors text-sm font-medium">
            <AlertTriangle size={14} /> War Room
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Live Orders" value={orders.filter(o => o.status === 'processing').length} subtext="processing" icon={<ShoppingCart size={14} />} color="accent" />
        <KPICard title="Critical Stock" value={inventory?.criticalItems?.length || 0} subtext={`of ${inventory?.totalItems || 0} items`} icon={<Package size={14} />} color={inventory?.criticalItems?.length > 2 ? 'danger' : 'warning'} />
        <KPICard title="Open Tickets" value={tickets?.openTickets || 0} subtext={`${tickets?.criticalTickets || 0} critical`} icon={<Headphones size={14} />} color={tickets?.criticalTickets > 0 ? 'danger' : 'accent'} />
        <KPICard title="Active Alerts" value={alerts.length} subtext={`${alerts.filter(a => a.type === 'crisis').length} crises`} icon={<AlertTriangle size={14} />} color={alerts.filter(a => a.type === 'crisis').length > 0 ? 'danger' : 'warning'} />
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Inventory Chart */}
        <div className="col-span-2 kpi-card">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-textMuted uppercase tracking-wider">Inventory Levels</span>
            <span className="text-xs font-mono text-danger">{inventory?.criticalItems?.length || 0} below minimum</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={inventoryChartData} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2535" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#718096', fontFamily: 'IBM Plex Mono' }} />
              <YAxis tick={{ fontSize: 10, fill: '#718096', fontFamily: 'IBM Plex Mono' }} />
              <Tooltip contentStyle={{ background: '#111520', border: '1px solid #1E2535', borderRadius: '8px', fontSize: 11, fontFamily: 'IBM Plex Mono' }} />
              <Bar dataKey="stock" radius={[3, 3, 0, 0]}>
                {inventoryChartData.map((entry, i) => (
                  <Cell key={i} fill={entry.critical ? '#FF3D57' : '#00E5FF'} fillOpacity={entry.critical ? 1 : 0.7} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <StressScore score={stress?.stressScore} status={stress?.status} breakdown={stress?.breakdown} />
      </div>

      {/* Data Tables + Feed */}
      <div className="grid grid-cols-2 gap-4">
        <div className="kpi-card">
          <div className="flex items-center gap-2 mb-4">
            {['orders', 'tickets'].map(t2 => (
              <button key={t2} onClick={() => setTab(t2)}
                className={`text-xs font-mono px-3 py-1.5 rounded-lg transition-colors ${tab === t2 ? 'bg-accent/10 text-accent border border-accent/20' : 'text-textMuted hover:text-text'}`}>
                {t2.toUpperCase()}
              </button>
            ))}
          </div>
          {tab === 'orders' ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {orders.slice(0, 15).map(order => (
                <div key={order._id} className="flex items-center justify-between p-2.5 bg-bg/50 rounded-lg border border-border text-xs">
                  <div>
                    <div className="font-mono text-text">{order.orderId?.slice(-8)}</div>
                    <div className="text-textMuted mt-0.5">{order.product} · {order.customer}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-success">${order.amount}</div>
                    <div className={`mt-0.5 px-1.5 py-0.5 rounded text-xs font-mono ${order.status === 'completed' ? 'text-success' : 'text-warning'}`}>
                      {order.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {tickets?.tickets?.slice(0, 15).map(ticket => (
                <div key={ticket._id} className="flex items-center justify-between p-2.5 bg-bg/50 rounded-lg border border-border text-xs">
                  <div>
                    <div className="font-mono text-text">{ticket.ticketId}</div>
                    <div className="text-textMuted mt-0.5 truncate max-w-32">{ticket.subject}</div>
                  </div>
                  <div className="text-right space-y-0.5">
                    <div className="px-1.5 py-0.5 rounded text-xs font-mono" style={{ color: priorityColor[ticket.priority] }}>
                      {ticket.priority}
                    </div>
                    <div className="px-1.5 py-0.5 rounded text-xs font-mono" style={{ color: statusColor[ticket.status] }}>
                      {ticket.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-xs font-mono text-textMuted uppercase tracking-wider mb-3">Active Alerts</h3>
            <AlertPanel alerts={alerts.slice(0, 3)} onAcknowledge={id => setAlerts(prev => prev.filter(a => a._id !== id))} />
          </div>
          <LiveFeed events={events} />
        </div>
      </div>
    </div>
  );
}

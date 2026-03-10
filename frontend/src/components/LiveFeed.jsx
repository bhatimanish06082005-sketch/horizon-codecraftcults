import React from 'react';
import { ShoppingCart, Package, Headphones, Bell } from 'lucide-react';

const eventConfig = {
  new_order: { icon: <ShoppingCart size={12} />, color: 'text-success', bg: 'bg-success/10' },
  inventory_update: { icon: <Package size={12} />, color: 'text-accent', bg: 'bg-accent/10' },
  inventory_critical: { icon: <Package size={12} />, color: 'text-danger', bg: 'bg-danger/10' },
  new_ticket: { icon: <Headphones size={12} />, color: 'text-warning', bg: 'bg-warning/10' },
  alert: { icon: <Bell size={12} />, color: 'text-accent2', bg: 'bg-accent2/10' },
};

export default function LiveFeed({ events }) {
  return (
    <div className="kpi-card h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-mono text-textMuted uppercase tracking-wider">Live Activity Feed</span>
        <div className="flex items-center gap-1.5 text-xs font-mono text-success">
          <span className="w-1.5 h-1.5 rounded-full bg-success live-dot" />
          LIVE
        </div>
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 max-h-72">
        {events.length === 0 && (
          <div className="text-textMuted text-xs font-mono text-center py-4 animate-pulse">Waiting for events...</div>
        )}
        {events.map((event, i) => {
          const cfg = eventConfig[event.type] || eventConfig.alert;
          const time = new Date(event.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          let msg = '';
          if (event.type === 'new_order') msg = `Order ${event.data?.orderId?.slice(-6)} — ${event.data?.product} · $${event.data?.amount}`;
          else if (event.type === 'inventory_update') msg = `Inventory: ${event.data?.product} → ${event.data?.newStock} units`;
          else if (event.type === 'inventory_critical') msg = `⚠ Critical: ${event.data?.product} (${event.data?.stock} left)`;
          else if (event.type === 'new_ticket') msg = `Ticket ${event.data?.ticketId?.slice(-6)} [${event.data?.priority}] — ${event.data?.subject}`;
          else if (event.type === 'alert') msg = `Alert: ${event.data?.alert?.title}`;
          else msg = event.type;

          return (
            <div key={i} className={`flex items-start gap-2.5 p-2.5 rounded-lg bg-bg/50 border border-border animate-fade-in`}>
              <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 ${cfg.bg} ${cfg.color}`}>
                {cfg.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-text truncate">{msg}</div>
                <div className="text-xs text-textMuted font-mono mt-0.5">{time}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

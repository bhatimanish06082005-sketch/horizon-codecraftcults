import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, BarChart2, Plug, FlaskConical, Settings, LogOut, Menu, X, Zap, History } from 'lucide-react';

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const isOwner = user?.role === 'owner';

  const NAV = [
    { to: isOwner ? '/dashboard/owner' : '/dashboard/ops', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { to: '/dashboard/analytics', icon: <BarChart2 size={18} />, label: 'Analytics' },
    ...(isOwner ? [{ to: '/dashboard/integrations', icon: <Plug size={18} />, label: 'Integrations' }] : []),
    { to: '/dashboard/demo', icon: <FlaskConical size={18} />, label: 'Demo Lab' },
    { to: '/dashboard/history-center', icon: <History size={18} />, label: 'History Center' },
    ...(isOwner ? [{ to: '/dashboard/settings', icon: <Settings size={18} />, label: 'Settings' }] : []),
  ];

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      <div className={`flex flex-col border-r border-border bg-surface transition-all duration-300 ${collapsed ? 'w-16' : 'w-56'}`}>
        <div className="flex items-center justify-between px-4 py-5 border-b border-border">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-accent/20 border border-accent/30 rounded-lg flex items-center justify-center">
                <Zap size={14} className="text-accent" />
              </div>
              <span className="font-display font-bold text-text text-sm">OpsPulse</span>
            </div>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="text-textMuted hover:text-text">
            {collapsed ? <Menu size={18} /> : <X size={18} />}
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1">
          {NAV.map(item => (
            <NavLink key={item.to} to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive ? 'bg-accent/10 text-accent border border-accent/20' : 'text-textMuted hover:text-text hover:bg-surface2'}`
              }>
              {item.icon}
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="px-2 py-4 border-t border-border">
          {!collapsed && (
            <div className="px-3 py-2 mb-2">
              <div className="text-xs font-mono text-textMuted truncate">{user?.email}</div>
              <div className="text-xs font-mono text-accent capitalize">{user?.role?.replace('_', ' ')}</div>
            </div>
          )}
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-textMuted hover:text-danger hover:bg-danger/5 w-full transition-colors">
            <LogOut size={18} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
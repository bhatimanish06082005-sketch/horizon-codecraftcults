import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, LayoutDashboard, History, LogOut, Menu, X, Plug } from 'lucide-react';

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const ownerLinks = [
    { path: '/dashboard/owner', icon: <LayoutDashboard size={16} />, label: 'Overview' },
    { path: '/dashboard/history', icon: <History size={16} />, label: 'Historical Insights' },
    { path: '/dashboard/integrations', icon: <Plug size={16} />, label: 'Integrations' },
  ];

  const opsLinks = [
    { path: '/dashboard/ops', icon: <LayoutDashboard size={16} />, label: 'Operations' },
  ];

  const links = user?.role === 'owner' ? ownerLinks : opsLinks;

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-56' : 'w-16'} flex-shrink-0 bg-surface border-r border-border flex flex-col transition-all duration-300 z-20`}>
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-border gap-3 overflow-hidden">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
            <Activity size={16} className="text-bg" strokeWidth={2.5} />
          </div>
          {sidebarOpen && <span className="font-display text-lg font-bold text-text whitespace-nowrap">OpsPulse</span>}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-hidden">
          {sidebarOpen && (
            <div className="text-xs font-mono text-textMuted px-4 py-2 uppercase tracking-widest">
              {user?.role === 'owner' ? 'Owner' : 'Operations'}
            </div>
          )}
          {links.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`sidebar-link ${location.pathname === link.path ? 'active' : ''} ${!sidebarOpen ? 'justify-center' : ''}`}
              title={!sidebarOpen ? link.label : ''}
            >
              {link.icon}
              {sidebarOpen && <span>{link.label}</span>}
            </Link>
          ))}
        </nav>

        {/* User section */}
        <div className="p-3 border-t border-border">
          {sidebarOpen && (
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent text-xs font-bold flex-shrink-0">
                {user?.name?.[0] || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-text truncate">{user?.name}</div>
                <div className="text-xs text-textMuted font-mono truncate">
                  {user?.role === 'owner' ? 'Business Owner' : 'Ops Manager'}
                </div>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={`sidebar-link w-full mt-1 text-danger hover:text-danger hover:bg-danger/10 ${!sidebarOpen ? 'justify-center' : ''}`}
          >
            <LogOut size={15} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-surface border-b border-border flex items-center px-6 gap-4 flex-shrink-0">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-textMuted hover:text-text transition-colors">
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2 text-xs font-mono text-textMuted">
            <span className="w-1.5 h-1.5 rounded-full bg-success live-dot" />
            LIVE
          </div>
          <div className="text-xs font-mono text-textMuted border border-border rounded-lg px-3 py-1.5">
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
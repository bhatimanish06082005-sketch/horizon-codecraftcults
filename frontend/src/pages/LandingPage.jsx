import React from 'react';
import { Link } from 'react-router-dom';
import {
  Activity, BarChart2, Shield, Zap, Clock, Globe,
  ArrowRight, CheckCircle, AlertTriangle, TrendingUp,
  Database, Server, Code2, Layers, GitBranch, Package
} from 'lucide-react';

const FEATURES = [
  {
    icon: <Activity size={20} className="text-accent" />,
    title: 'Real-Time Monitoring',
    desc: 'Live KPI feeds from News, Weather, and Stock Market APIs refresh every 4 seconds with automatic anomaly detection.',
    border: 'border-accent/20', bg: 'bg-accent/5',
  },
  {
    icon: <TrendingUp size={20} className="text-danger" />,
    title: 'Business Stress Score',
    desc: 'Weighted composite score calculated from alert severity, KPI volatility, external signal risk, and anomaly frequency.',
    border: 'border-danger/20', bg: 'bg-danger/5',
  },
  {
    icon: <Shield size={20} className="text-warning" />,
    title: 'War Room Mode',
    desc: 'Crisis command center auto-activates when stress score exceeds 70. Surfaces active alerts and recommended response actions.',
    border: 'border-warning/20', bg: 'bg-warning/5',
  },
  {
    icon: <BarChart2 size={20} className="text-accent2" />,
    title: 'Operational Analytics',
    desc: 'Interactive Recharts dashboards for sentiment trends, price movement, weather patterns, and score breakdowns.',
    border: 'border-accent2/20', bg: 'bg-accent2/5',
  },
  {
    icon: <Clock size={20} className="text-success" />,
    title: 'Historical Intelligence',
    desc: 'Backend scheduler auto-saves snapshots every 20 minutes to MongoDB — independent of any active user session.',
    border: 'border-success/20', bg: 'bg-success/5',
  },
  {
    icon: <Globe size={20} className="text-accent" />,
    title: 'Multi-Signal Integration',
    desc: 'Unified adapter layer for NewsAPI, OpenWeatherMap, and Alpha Vantage. One dashboard, all your business signals.',
    border: 'border-accent/20', bg: 'bg-accent/5',
  },
];

const STEPS = [
  {
    num: '01', icon: <Zap size={18} className="text-accent" />,
    title: 'Integrate Signals',
    desc: 'Enter API keys for NewsAPI, OpenWeather, or Alpha Vantage. Live data streams activate instantly.',
  },
  {
    num: '02', icon: <Activity size={18} className="text-warning" />,
    title: 'Monitor KPIs',
    desc: 'Watch live KPI cards update every 4 seconds. Stress Score recalculates continuously using a weighted formula.',
  },
  {
    num: '03', icon: <AlertTriangle size={18} className="text-danger" />,
    title: 'Detect Alerts',
    desc: 'The system classifies incoming data as Crisis, Opportunity, or Normal and logs alerts to the feed automatically.',
  },
  {
    num: '04', icon: <Shield size={18} className="text-success" />,
    title: 'Activate War Room',
    desc: 'When Stress Score crosses 70, War Room opens with triage actions. Closes automatically when conditions normalise.',
  },
];

const TECH_STACK = [
  {
    category: 'Frontend',
    icon: <Code2 size={16} className="text-accent" />,
    color: 'border-accent/20 bg-accent/5',
    labelColor: 'text-accent',
    items: [
      { name: 'React 18', desc: 'Component UI framework' },
      { name: 'Vite', desc: 'Build tool & dev server' },
      { name: 'Tailwind CSS', desc: 'Utility-first styling' },
      { name: 'Recharts', desc: 'Interactive chart library' },
      { name: 'React Router v6', desc: 'Client-side routing' },
      { name: 'Lucide React', desc: 'Icon system' },
    ],
  },
  {
    category: 'Backend',
    icon: <Server size={16} className="text-accent2" />,
    color: 'border-accent2/20 bg-accent2/5',
    labelColor: 'text-accent2',
    items: [
      { name: 'Node.js', desc: 'JavaScript runtime' },
      { name: 'Express.js', desc: 'REST API framework' },
      { name: 'Socket.IO', desc: 'Real-time WebSocket layer' },
      { name: 'JWT Auth', desc: 'Stateless authentication' },
      { name: 'node-cron', desc: 'Background scheduler' },
      { name: 'Axios', desc: 'HTTP client layer' },
    ],
  },
  {
    category: 'Database & Infra',
    icon: <Database size={16} className="text-success" />,
    color: 'border-success/20 bg-success/5',
    labelColor: 'text-success',
    items: [
      { name: 'MongoDB', desc: 'NoSQL document store' },
      { name: 'Mongoose', desc: 'ODM schema layer' },
      { name: 'MongoDB Atlas', desc: 'Cloud database hosting' },
      { name: 'Render', desc: 'Backend deployment' },
      { name: '.env Config', desc: 'Environment management' },
      { name: 'REST API', desc: 'JSON data exchange' },
    ],
  },
  {
    category: 'External APIs',
    icon: <Package size={16} className="text-warning" />,
    color: 'border-warning/20 bg-warning/5',
    labelColor: 'text-warning',
    items: [
      { name: 'NewsAPI', desc: 'Live news headlines' },
      { name: 'OpenWeatherMap', desc: 'Real-time weather data' },
      { name: 'Alpha Vantage', desc: 'Stock market prices' },
      { name: 'CORS', desc: 'Cross-origin policy' },
      { name: 'bcrypt', desc: 'Password hashing' },
      { name: 'dotenv', desc: 'Secrets management' },
    ],
  },
];

const SCORE_FORMULA = [
  { label: 'Alert Severity',      weight: '40%', color: 'text-danger',  bar: 'bg-danger',  value: 40 },
  { label: 'KPI Volatility',      weight: '30%', color: 'text-warning', bar: 'bg-warning', value: 30 },
  { label: 'External Signal Risk',weight: '20%', color: 'text-accent',  bar: 'bg-accent',  value: 20 },
  { label: 'Anomaly Frequency',   weight: '10%', color: 'text-accent2', bar: 'bg-accent2', value: 10 },
];

export default function LandingPage() {
  return (
    <div
      className="min-h-screen bg-bg text-text"
      style={{
        backgroundImage:
          'linear-gradient(rgba(0,229,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.012) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }}
    >
      {/* ── Nav ── */}
      <nav className="border-b border-border/50 px-6 py-4 sticky top-0 bg-bg/90 backdrop-blur-sm z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-accent/10 border border-accent/30 rounded-lg flex items-center justify-center">
              <Zap size={15} className="text-accent" />
            </div>
            <span className="font-display font-bold text-text">OpsPulse</span>
            <span className="text-xs font-mono text-textMuted border border-border px-2 py-0.5 rounded-full ml-1">v2.0</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-mono text-textMuted">
            <a href="#features" className="hover:text-text transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-text transition-colors">How it works</a>
            <a href="#tech-stack" className="hover:text-text transition-colors">Tech Stack</a>
            <a href="#roles" className="hover:text-text transition-colors">Roles</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-textMuted hover:text-text text-sm transition-colors font-mono">
              Sign In
            </Link>
            <Link to="/login" className="btn-primary text-sm px-5 py-2">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 border border-accent/20 bg-accent/5 rounded-full px-4 py-1.5 text-xs font-mono text-accent mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Operational Intelligence Platform for SMBs
          </div>

          <h1 className="font-display text-5xl md:text-6xl font-bold text-text mb-6 leading-tight">
            OpsPulse —{' '}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, #00E5FF, #7C3AED)' }}
            >
              Unified Business
            </span>
            <br />
            Health Dashboard
          </h1>

          <p className="text-textMuted text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Monitor operational signals, detect risks, and respond to business events in real time.
            Aggregates live news, weather, and market data into a single actionable stress score.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/login" className="btn-primary flex items-center gap-2 px-7 py-3.5 text-base">
              Launch Dashboard <ArrowRight size={16} />
            </Link>
            <a
              href="#how-it-works"
              className="flex items-center gap-2 border border-border hover:border-accent/30 text-textMuted hover:text-text px-7 py-3.5 rounded-xl text-base transition-all font-medium"
            >
              <BarChart2 size={16} /> See How It Works
            </a>
          </div>
        </div>

        {/* Stress Score Formula card — static, no fake live data */}
        <div className="mt-20 bg-surface border border-border rounded-2xl p-8 max-w-3xl mx-auto">
          <div className="text-xs font-mono text-accent uppercase tracking-widest mb-5">
            Business Stress Score — Weighted Formula
          </div>
          <div className="space-y-3">
            {SCORE_FORMULA.map((item) => (
              <div key={item.label} className="flex items-center gap-4">
                <div className="w-44 text-xs font-mono text-textMuted flex-shrink-0">{item.label}</div>
                <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${item.bar}`} style={{ width: `${item.value * 2.2}%` }} />
                </div>
                <div className={`text-sm font-mono font-bold w-10 text-right ${item.color}`}>{item.weight}</div>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-5 border-t border-border font-mono text-xs text-textMuted leading-relaxed">
            <span className="text-accent2 font-bold">Score</span>{' '}
            = (0.40 × Alert Severity) + (0.30 × KPI Volatility) + (0.20 × External Risk) + (0.10 × Anomaly Freq)
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {[
              { range: '0–30',   label: 'Stable',     color: 'text-success', border: 'border-success/30', bg: 'bg-success/5' },
              { range: '31–60',  label: 'Moderate',   color: 'text-accent',  border: 'border-accent/30',  bg: 'bg-accent/5'  },
              { range: '61–80',  label: 'High Stress',color: 'text-warning', border: 'border-warning/30', bg: 'bg-warning/5' },
              { range: '81–100', label: 'Crisis',     color: 'text-danger',  border: 'border-danger/30',  bg: 'bg-danger/5'  },
            ].map(r => (
              <div key={r.range} className={`border ${r.border} ${r.bg} rounded-xl p-3 text-center`}>
                <div className={`text-sm font-semibold ${r.color}`}>{r.label}</div>
                <div className="text-xs text-textMuted font-mono mt-0.5">{r.range}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <div className="text-xs font-mono text-accent uppercase tracking-widest mb-3">Platform Features</div>
          <h2 className="font-display text-3xl font-bold text-text">Everything you need to stay ahead</h2>
          <p className="text-textMuted mt-3 max-w-xl mx-auto text-sm leading-relaxed">
            A unified operations dashboard that turns raw API signals into actionable business intelligence.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div key={f.title} className={`border ${f.border} ${f.bg} rounded-2xl p-6 hover:scale-[1.01] transition-transform`}>
              <div className="w-9 h-9 bg-bg border border-border rounded-xl flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="font-display font-bold text-text mb-2">{f.title}</h3>
              <p className="text-textMuted text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <div className="text-xs font-mono text-accent uppercase tracking-widest mb-3">Workflow</div>
          <h2 className="font-display text-3xl font-bold text-text">How It Works</h2>
          <p className="text-textMuted mt-3 max-w-xl mx-auto text-sm">
            From raw signal to crisis response in four steps.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, i) => (
            <div key={step.num} className="relative">
              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-full h-px bg-gradient-to-r from-border to-transparent z-0" />
              )}
              <div className="bg-surface border border-border rounded-2xl p-6 relative z-10 h-full">
                <div className="text-xs font-mono text-textMuted mb-4 tracking-widest">{step.num}</div>
                <div className="w-10 h-10 bg-bg border border-border rounded-xl flex items-center justify-center mb-4">
                  {step.icon}
                </div>
                <h3 className="font-display font-bold text-text mb-2">{step.title}</h3>
                <p className="text-textMuted text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tech Stack ── */}
      <section id="tech-stack" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <div className="text-xs font-mono text-accent uppercase tracking-widest mb-3">Built With</div>
          <h2 className="font-display text-3xl font-bold text-text">Tech Stack</h2>
          <p className="text-textMuted mt-3 max-w-xl mx-auto text-sm leading-relaxed">
            A modern full-stack JavaScript architecture — React frontend, Node.js backend, MongoDB database,
            and live third-party API integrations.
          </p>
        </div>

        {/* Architecture banner */}
        <div className="flex items-center justify-center gap-3 mb-10 flex-wrap">
          {[
            { label: 'React + Vite', color: 'text-accent border-accent/30 bg-accent/5' },
            { label: '→', color: 'text-textMuted border-transparent' },
            { label: 'Node.js + Express', color: 'text-accent2 border-accent2/30 bg-accent2/5' },
            { label: '→', color: 'text-textMuted border-transparent' },
            { label: 'MongoDB Atlas', color: 'text-success border-success/30 bg-success/5' },
            { label: '→', color: 'text-textMuted border-transparent' },
            { label: 'External APIs', color: 'text-warning border-warning/30 bg-warning/5' },
          ].map((item, i) => (
            <span key={i} className={`text-xs font-mono border rounded-full px-3 py-1 ${item.color}`}>
              {item.label}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {TECH_STACK.map((stack) => (
            <div key={stack.category} className={`border ${stack.color} rounded-2xl p-5`}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-bg border border-border rounded-lg flex items-center justify-center">
                  {stack.icon}
                </div>
                <span className={`text-xs font-mono font-bold uppercase tracking-wider ${stack.labelColor}`}>
                  {stack.category}
                </span>
              </div>
              <div className="space-y-2.5">
                {stack.items.map((item) => (
                  <div key={item.name} className="flex items-start justify-between gap-2">
                    <span className="text-sm font-mono text-text font-medium">{item.name}</span>
                    <span className="text-xs text-textMuted font-mono text-right leading-relaxed">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Additional stack details */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-surface border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Layers size={14} className="text-accent" />
              <span className="text-xs font-mono text-textMuted uppercase tracking-wider">Architecture</span>
            </div>
            <div className="space-y-2 text-xs font-mono text-textMuted">
              <div className="flex justify-between"><span>Pattern</span><span className="text-text">MVC + Context API</span></div>
              <div className="flex justify-between"><span>Auth</span><span className="text-text">JWT Bearer Token</span></div>
              <div className="flex justify-between"><span>State</span><span className="text-text">React Context</span></div>
              <div className="flex justify-between"><span>Real-time</span><span className="text-text">Socket.IO</span></div>
              <div className="flex justify-between"><span>Scheduler</span><span className="text-text">setInterval (20 min)</span></div>
            </div>
          </div>
          <div className="bg-surface border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <GitBranch size={14} className="text-accent2" />
              <span className="text-xs font-mono text-textMuted uppercase tracking-wider">Data Models</span>
            </div>
            <div className="space-y-2 text-xs font-mono text-textMuted">
              <div className="flex justify-between"><span>User</span><span className="text-text">email, role, hash</span></div>
              <div className="flex justify-between"><span>AnalyticsHistory</span><span className="text-text">score, mode, KPIs</span></div>
              <div className="flex justify-between"><span>Alert</span><span className="text-text">type, message, time</span></div>
              <div className="flex justify-between"><span>Integration</span><span className="text-text">provider, status</span></div>
              <div className="flex justify-between"><span>History</span><span className="text-text">snapshots, filters</span></div>
            </div>
          </div>
          <div className="bg-surface border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Shield size={14} className="text-success" />
              <span className="text-xs font-mono text-textMuted uppercase tracking-wider">Security & Access</span>
            </div>
            <div className="space-y-2 text-xs font-mono text-textMuted">
              <div className="flex justify-between"><span>Passwords</span><span className="text-text">bcrypt hashed</span></div>
              <div className="flex justify-between"><span>Sessions</span><span className="text-text">JWT stateless</span></div>
              <div className="flex justify-between"><span>CORS</span><span className="text-text">Origin whitelist</span></div>
              <div className="flex justify-between"><span>Role Guard</span><span className="text-text">owner / ops_manager</span></div>
              <div className="flex justify-between"><span>Env Secrets</span><span className="text-text">.env + Render vars</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Roles ── */}
      <section id="roles" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <div className="text-xs font-mono text-accent uppercase tracking-widest mb-3">Access Control</div>
          <h2 className="font-display text-3xl font-bold text-text">Two Roles, One Platform</h2>
          <p className="text-textMuted mt-3 max-w-xl mx-auto text-sm">
            Role-based access control ensures every user sees exactly what they need.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface border border-accent/20 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-accent/10 border border-accent/20 rounded-xl flex items-center justify-center">
                <Shield size={18} className="text-accent" />
              </div>
              <div>
                <h3 className="font-display font-bold text-text">Owner</h3>
                <div className="text-xs font-mono text-accent">Full system access</div>
              </div>
            </div>
            <ul className="space-y-2.5">
              {[
                'Dashboard & Live KPIs',
                'Analytics & Export',
                'Integrations Setup',
                'History Center',
                'Demo Lab',
                'Settings & User Config',
                'War Room Control',
                'Delete History Records',
              ].map(item => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-textMuted font-mono">
                  <CheckCircle size={13} className="text-accent flex-shrink-0" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-surface border border-accent2/20 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-accent2/10 border border-accent2/20 rounded-xl flex items-center justify-center">
                <Activity size={18} className="text-accent2" />
              </div>
              <div>
                <h3 className="font-display font-bold text-text">Operations Manager</h3>
                <div className="text-xs font-mono text-accent2">Monitoring & response access</div>
              </div>
            </div>
            <ul className="space-y-2.5">
              {[
                'Dashboard & Live KPIs',
                'Analytics & Export',
                'History Center (view only)',
                'Demo Lab',
                'War Room Alerts',
              ].map(item => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-textMuted font-mono">
                  <CheckCircle size={13} className="text-accent2 flex-shrink-0" /> {item}
                </li>
              ))}
              {[
                'Integrations — Owner only',
                'Settings — Owner only',
                'Delete Records — Owner only',
              ].map(item => (
                <li key={item} className="flex items-center gap-2.5 text-sm font-mono opacity-35">
                  <span className="w-3.5 h-3.5 rounded-sm border border-textMuted flex-shrink-0" />
                  <span className="text-textMuted line-through">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div
          className="rounded-2xl border border-accent/20 p-12 text-center"
          style={{ background: 'linear-gradient(135deg, rgba(0,229,255,0.04) 0%, rgba(124,58,237,0.04) 100%)' }}
        >
          <div className="text-xs font-mono text-accent uppercase tracking-widest mb-4">Ready to explore?</div>
          <h2 className="font-display text-3xl font-bold text-text mb-4">
            Launch OpsPulse with demo credentials
          </h2>
          <p className="text-textMuted mb-3 max-w-lg mx-auto text-sm">
            No setup required. Sign in as Owner or Ops Manager and explore the full platform instantly.
          </p>
          <div className="flex items-center justify-center gap-6 text-xs font-mono text-textMuted mb-8">
            <span>owner@opspulse.com</span>
            <span className="text-border">|</span>
            <span>ops@opspulse.com</span>
            <span className="text-border">|</span>
            <span>password: <span className="text-accent">password123</span></span>
          </div>
          <Link to="/login" className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 text-base">
            Launch Dashboard <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border/50 px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-textMuted">
          <div className="flex items-center gap-2">
            <Zap size={12} className="text-accent" />
            <span>OpsPulse v2.0 — Unified Business Health Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <span>React · Node.js · MongoDB</span>
            <span className="text-border">|</span>
            <span>Built for SMBs</span>
            <span className="text-border">|</span>
            <span>Enterprise-grade</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
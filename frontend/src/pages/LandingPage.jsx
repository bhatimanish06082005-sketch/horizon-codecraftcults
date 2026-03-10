import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Zap, Shield, BarChart2, Bell, Globe, ArrowRight, CheckCircle, TrendingUp, Package, Headphones } from 'lucide-react';

const AnimatedCounter = ({ target, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <span>{count.toLocaleString()}</span>;
};

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div className="min-h-screen bg-bg text-text overflow-x-hidden">
      {/* Nav */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-bg/95 backdrop-blur border-b border-border' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <Activity size={16} className="text-bg" strokeWidth={2.5} />
            </div>
            <span className="font-display text-xl font-bold text-text">OpsPulse</span>
          </div>
          <Link to="/login" className="btn-primary flex items-center gap-2">
            Login <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        {/* Grid background */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
        {/* Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute top-2/3 right-1/4 w-[300px] h-[300px] bg-accent2/5 rounded-full blur-3xl" />

        <div className="relative z-10 text-center max-w-4xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 border border-accent/30 bg-accent/5 rounded-full px-4 py-1.5 mb-8 text-accent text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-accent live-dot inline-block" />
            REAL-TIME BUSINESS INTELLIGENCE
          </div>

          <h1 className="font-display text-6xl md:text-8xl font-bold leading-[0.95] mb-6">
            <span className="text-text">One Dashboard.</span>
            <br />
            <span className="bg-gradient-to-r from-accent to-accent2 bg-clip-text text-transparent">
              Total Clarity.
            </span>
          </h1>

          <p className="text-textMuted text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            OpsPulse unifies your CRM, inventory, accounting, and support data into a single real-time dashboard — so you always know the pulse of your business.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/login" className="btn-primary flex items-center gap-2 text-base px-8 py-4">
              Start Monitoring <ArrowRight size={16} />
            </Link>
            <a href="#features" className="btn-secondary flex items-center gap-2 text-base px-8 py-4">
              See Features
            </a>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            {[
              { label: 'Metrics Tracked', value: 47, suffix: '+' },
              { label: 'Alerts/Day', value: 120, suffix: '+' },
              { label: 'Uptime', value: 99, suffix: '%' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-3xl font-bold text-accent">
                  <AnimatedCounter target={stat.value} />{stat.suffix}
                </div>
                <div className="text-textMuted text-xs mt-1 font-mono">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-32 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-accent font-mono text-sm mb-3 tracking-widest">THE PROBLEM</div>
            <h2 className="font-display text-5xl font-bold mb-4">Fragmented Data Kills Decisions</h2>
            <p className="text-textMuted text-lg max-w-2xl mx-auto">SMBs juggle 5-10 disconnected tools. By the time you compile the data, the opportunity is gone.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '📊', title: 'Siloed Systems', desc: 'CRM, inventory, support, and accounting tools don\'t talk to each other.' },
              { icon: '⏱️', title: 'Delayed Insights', desc: 'Manual reports take hours. Critical issues go unnoticed until it\'s too late.' },
              { icon: '🔍', title: 'No Single Truth', desc: 'Multiple dashboards, conflicting numbers, zero clarity on actual business health.' },
            ].map(item => (
              <div key={item.title} className="kpi-card text-center group">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-semibold text-text mb-2">{item.title}</h3>
                <p className="text-textMuted text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-32 px-6 bg-surface/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-accent font-mono text-sm mb-3 tracking-widest">THE SOLUTION</div>
              <h2 className="font-display text-5xl font-bold mb-6">OpsPulse Unifies Everything</h2>
              <p className="text-textMuted text-lg mb-8 leading-relaxed">
                Connect all your business systems into one real-time dashboard. Get instant alerts, track key metrics, and make decisions based on live data — not yesterday's spreadsheet.
              </p>
              <div className="space-y-4">
                {[
                  'Real-time data from all business verticals',
                  'AI-powered Business Stress Score (0-100)',
                  'Automatic crisis alerts and opportunity signals',
                  'War Room Mode for critical situations',
                  'Historical analytics for trend analysis',
                ].map(item => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle size={16} className="text-success flex-shrink-0" />
                    <span className="text-textMuted text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-textMuted">BUSINESS STRESS SCORE</span>
                  <span className="w-2 h-2 rounded-full bg-success live-dot" />
                </div>
                <div className="text-6xl font-display font-bold text-success">42</div>
                <div className="h-2 bg-border rounded-full overflow-hidden">
                  <div className="h-full w-[42%] bg-gradient-to-r from-success to-warning rounded-full" />
                </div>
                <div className="grid grid-cols-3 gap-3 pt-2">
                  {[
                    { label: 'Revenue', value: '$24,891', up: true },
                    { label: 'Orders', value: '47', up: true },
                    { label: 'Tickets', value: '12', up: false },
                  ].map(m => (
                    <div key={m.label} className="bg-bg rounded-lg p-3 border border-border">
                      <div className="text-textMuted text-xs mb-1">{m.label}</div>
                      <div className={`font-semibold font-mono text-sm ${m.up ? 'text-success' : 'text-warning'}`}>{m.value}</div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex items-center gap-2 text-xs text-textMuted font-mono">
                    <span className="text-success">●</span> New order: Wireless Headphones — $89.99
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-32 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-accent font-mono text-sm mb-3 tracking-widest">FEATURES</div>
            <h2 className="font-display text-5xl font-bold">Built for Operations Excellence</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Activity size={20} />, title: 'Real-Time Updates', desc: 'Socket.io powered live data streams update every dashboard widget instantly.' },
              { icon: <Shield size={20} />, title: 'War Room Mode', desc: 'Critical alert mode activates automatically when stress score hits danger zone.' },
              { icon: <Bell size={20} />, title: 'Smart Alerts', desc: 'Crisis, opportunity, and anomaly alerts keep you ahead of every situation.' },
              { icon: <BarChart2 size={20} />, title: 'Stress Score', desc: 'Proprietary 0-100 business health score weighing tickets, inventory, and sales.' },
              { icon: <TrendingUp size={20} />, title: 'Historical Insights', desc: 'Trend charts for revenue, inventory, tickets stored automatically every 30 min.' },
              { icon: <Zap size={20} />, title: 'Role-Based Access', desc: 'Owner and Ops Manager views — each seeing exactly what they need.' },
            ].map(f => (
              <div key={f.title} className="kpi-card group hover:scale-[1.02] transition-transform">
                <div className="w-10 h-10 bg-accent/10 border border-accent/20 rounded-lg flex items-center justify-center text-accent mb-4 group-hover:bg-accent/20 transition-colors">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-text mb-2">{f.title}</h3>
                <p className="text-textMuted text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-24 px-6 bg-surface/30 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-accent font-mono text-sm mb-3 tracking-widest">TECH STACK</div>
          <h2 className="font-display text-4xl font-bold mb-12">Built on Modern Infrastructure</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Socket.io', 'JWT Auth', 'Recharts', 'Tailwind CSS', 'node-cron'].map(tech => (
              <div key={tech} className="border border-border bg-bg px-5 py-2.5 rounded-full text-sm font-mono text-textMuted hover:border-accent/40 hover:text-accent transition-all">
                {tech}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 border-t border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/3 to-transparent" />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h2 className="font-display text-5xl font-bold mb-6">Start Monitoring Now</h2>
          <p className="text-textMuted text-lg mb-8">Get full visibility into your business health in minutes. Demo accounts ready.</p>
          <Link to="/login" className="btn-primary inline-flex items-center gap-2 text-base px-10 py-4">
            Start Monitoring <ArrowRight size={16} />
          </Link>
          <div className="mt-6 text-textMuted text-sm font-mono">
            owner@opspulse.com · ops@opspulse.com · password: password123
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-accent rounded flex items-center justify-center">
              <Activity size={12} className="text-bg" />
            </div>
            <span className="font-display font-bold text-sm">OpsPulse</span>
          </div>
          <div className="text-textMuted text-xs font-mono">Unified Business Health Dashboard · Hackathon 2024</div>
        </div>
      </footer>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, Eye, EyeOff, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'owner' ? '/dashboard/owner' : '/dashboard/ops');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (type) => {
    setForm({ email: type === 'owner' ? 'owner@opspulse.com' : 'ops@opspulse.com', password: 'password123' });
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6" style={{
      backgroundImage: 'linear-gradient(rgba(0,229,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.02) 1px, transparent 1px)',
      backgroundSize: '60px 60px'
    }}>
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 text-textMuted hover:text-text transition-colors text-sm mb-8 group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to home
        </Link>

        <div className="bg-surface border border-border rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
              <Activity size={20} className="text-bg" strokeWidth={2.5} />
            </div>
            <div>
              <div className="font-display text-xl font-bold">OpsPulse</div>
              <div className="text-textMuted text-xs font-mono">Dashboard Access</div>
            </div>
          </div>

          <h1 className="font-display text-2xl font-bold mb-2">Welcome back</h1>
          <p className="text-textMuted text-sm mb-6">Sign in to monitor your business health</p>

          {/* Demo buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button onClick={() => fillDemo('owner')} className="border border-accent/30 bg-accent/5 text-accent text-xs py-2 rounded-lg hover:bg-accent/10 transition-colors font-mono">
              👑 Owner Demo
            </button>
            <button onClick={() => fillDemo('ops')} className="border border-accent2/30 bg-accent2/5 text-accent2 text-xs py-2 rounded-lg hover:bg-accent2/10 transition-colors font-mono">
              ⚙️ Ops Demo
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-mono text-textMuted mb-1.5 block uppercase tracking-wider">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="w-full bg-bg border border-border rounded-lg px-4 py-3 text-text text-sm focus:outline-none focus:border-accent/50 transition-colors font-mono placeholder-textMuted"
                placeholder="you@company.com"
                required
              />
            </div>
            <div>
              <label className="text-xs font-mono text-textMuted mb-1.5 block uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  className="w-full bg-bg border border-border rounded-lg px-4 py-3 pr-10 text-text text-sm focus:outline-none focus:border-accent/50 transition-colors font-mono placeholder-textMuted"
                  placeholder="••••••••"
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted hover:text-text transition-colors">
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {error && <div className="text-danger text-sm bg-danger/10 border border-danger/20 rounded-lg px-4 py-3 font-mono text-xs">{error}</div>}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 border-t border-border pt-4 text-center text-xs text-textMuted font-mono">
            <div className="mt-4 text-center text-xs text-textMuted">
              New ops manager?{' '}
              <Link to="/register" className="text-accent hover:underline">Create account</Link>
            </div>
            password: <span className="text-accent">password123</span> for both accounts
          </div>
        </div>
      </div>
    </div>
  );
}

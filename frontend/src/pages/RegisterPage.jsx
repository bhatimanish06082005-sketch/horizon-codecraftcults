import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import axios from 'axios';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirm)
      return setError('Passwords do not match');

    if (form.password.length < 6)
      return setError('Password must be at least 6 characters');

    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
  name: form.name,
  email: form.email,
  password: form.password
});

// Don't auto login — redirect to login page
navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6" style={{
      backgroundImage: 'linear-gradient(rgba(0,229,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.02) 1px, transparent 1px)',
      backgroundSize: '60px 60px'
    }}>
      <div className="w-full max-w-md">
        <Link to="/login" className="flex items-center gap-2 text-textMuted hover:text-text transition-colors text-sm mb-8 group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to login
        </Link>

        <div className="bg-surface border border-border rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
              <Activity size={20} className="text-bg" strokeWidth={2.5} />
            </div>
            <div>
              <div className="font-display text-xl font-bold">OpsPulse</div>
              <div className="text-textMuted text-xs font-mono">Create Ops Manager Account</div>
            </div>
          </div>

          <h1 className="font-display text-2xl font-bold mb-2">Create Account</h1>
          <p className="text-textMuted text-sm mb-6">Register as an Operations Manager</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-mono text-textMuted mb-1.5 block uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className="w-full bg-bg border border-border rounded-lg px-4 py-3 text-text text-sm focus:outline-none focus:border-accent/50 transition-colors font-mono placeholder-textMuted"
                placeholder="John Smith"
                required
              />
            </div>

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

            <div>
              <label className="text-xs font-mono text-textMuted mb-1.5 block uppercase tracking-wider">Confirm Password</label>
              <input
                type="password"
                value={form.confirm}
                onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))}
                className="w-full bg-bg border border-border rounded-lg px-4 py-3 text-text text-sm focus:outline-none focus:border-accent/50 transition-colors font-mono placeholder-textMuted"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="text-danger text-sm bg-danger/10 border border-danger/20 rounded-lg px-4 py-3 font-mono text-xs">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 border-t border-border pt-4 text-center text-xs text-textMuted">
            Already have an account?{' '}
            <Link to="/login" className="text-accent hover:underline">Sign in</Link>
          </div>

          <div className="mt-3 text-center text-xs text-textMuted font-mono bg-accent/5 border border-accent/20 rounded-lg px-4 py-2">
            ⚙️ All new accounts get <span className="text-accent">Ops Manager</span> role
          </div>
        </div>
      </div>
    </div>
  );
}
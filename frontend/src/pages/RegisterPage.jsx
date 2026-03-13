import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, UserPlus } from 'lucide-react';
import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) return setError('Passwords do not match');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      await axios.post(`${BASE}/api/auth/register`, {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6" style={{
      backgroundImage: 'linear-gradient(rgba(0,229,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.015) 1px, transparent 1px)',
      backgroundSize: '60px 60px'
    }}>
      <div className="w-full max-w-md">
        <Link to="/login" className="inline-flex items-center gap-2 text-textMuted hover:text-text transition-colors text-sm mb-8 group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to login
        </Link>

        <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-2xl">
          <div className="h-0.5 bg-gradient-to-r from-accent2 via-accent to-transparent" />

          <div className="p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-accent2/10 border border-accent2/20 rounded-xl flex items-center justify-center">
                <UserPlus size={18} className="text-accent2" strokeWidth={1.5} />
              </div>
              <div>
                <div className="font-display text-lg font-bold text-text leading-none">OpsPulse</div>
                <div className="text-textMuted text-xs font-mono mt-0.5">Create Ops Manager Account</div>
              </div>
            </div>

            <h1 className="font-display text-2xl font-bold text-text mb-1">Create Account</h1>
            <p className="text-textMuted text-sm mb-7">Register as an Operations Manager</p>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
                <div className="flex items-start gap-2 text-danger text-xs bg-danger/5 border border-danger/20 rounded-lg px-3 py-2.5 font-mono">
                  <span className="flex-shrink-0 mt-0.5">⚠</span>
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 mt-1 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
                    </svg>
                    Creating Account…
                  </>
                ) : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-border space-y-3">
              <div className="text-center text-xs text-textMuted font-mono">
                Already have an account?{' '}
                <Link to="/login" className="text-accent hover:underline">Sign in</Link>
              </div>
              <div className="text-center text-xs text-textMuted font-mono bg-accent2/5 border border-accent2/20 rounded-lg px-4 py-2">
                All new accounts get <span className="text-accent2">Ops Manager</span> role
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
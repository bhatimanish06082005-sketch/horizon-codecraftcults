import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, ArrowLeft, ShieldCheck, User, Lock } from 'lucide-react';

const ROLES = [
  {
    id: 'owner',
    label: 'Owner',
    email: 'owner@opspulse.com',
    description: 'Full system access',
    icon: <ShieldCheck size={16} />,
  },
  {
    id: 'ops_manager',
    label: 'Ops Manager',
    email: 'ops@opspulse.com',
    description: 'Dashboard & Analytics',
    icon: <User size={16} />,
  },
];

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email) { setError('Email is required.'); return; }
    if (!form.password) { setError('Password is required.'); return; }
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'owner' ? '/dashboard/owner' : '/dashboard/ops');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    setSelectedRole(role.id);
    setForm({ email: role.email, password: 'password123' });
    setError('');
  };

  return (
    <div
      className="min-h-screen bg-bg flex items-center justify-center px-6"
      style={{
        backgroundImage:
          'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(0,229,255,0.06) 0%, transparent 70%), linear-gradient(rgba(0,229,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.015) 1px, transparent 1px)',
        backgroundSize: 'auto, 60px 60px, 60px 60px',
      }}
    >
      <div className="w-full max-w-md">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-textMuted hover:text-text transition-colors text-sm mb-8 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to home
        </Link>

        <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-2xl">
          {/* Top accent bar */}
          <div className="h-0.5 bg-gradient-to-r from-accent via-accent2 to-transparent" />

          <div className="p-8">
            {/* Brand */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-accent/10 border border-accent/20 rounded-xl flex items-center justify-center">
                <ShieldCheck size={20} className="text-accent" strokeWidth={1.5} />
              </div>
              <div>
                <div className="font-display text-lg font-bold text-text leading-none">OpsPulse</div>
                <div className="text-textMuted text-xs font-mono mt-0.5">Operational Intelligence Platform</div>
              </div>
            </div>

            <h1 className="font-display text-2xl font-bold text-text mb-1">Welcome back</h1>
            <p className="text-textMuted text-sm mb-7">Sign in to monitor your business health</p>

            {/* Role selector */}
            <div className="mb-6">
              <label className="text-xs font-mono text-textMuted uppercase tracking-wider mb-2 block">
                Quick Demo Access
              </label>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => fillDemo(role)}
                    className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                      selectedRole === role.id
                        ? 'border-accent/50 bg-accent/5 text-accent'
                        : 'border-border hover:border-accent/30 hover:bg-surface2 text-textMuted hover:text-text'
                    }`}
                  >
                    <div className={`mt-0.5 flex-shrink-0 ${selectedRole === role.id ? 'text-accent' : 'text-textMuted'}`}>
                      {role.icon}
                    </div>
                    <div>
                      <div className={`text-sm font-semibold leading-none mb-1 ${selectedRole === role.id ? 'text-accent' : 'text-text'}`}>
                        {role.label}
                      </div>
                      <div className="text-xs text-textMuted font-mono">{role.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Email */}
              <div>
                <label className="text-xs font-mono text-textMuted mb-1.5 block uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textMuted pointer-events-none" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => { setForm((p) => ({ ...p, email: e.target.value })); setError(''); }}
                    className="w-full bg-bg border border-border rounded-lg pl-9 pr-4 py-3 text-text text-sm focus:outline-none focus:border-accent/50 transition-colors font-mono placeholder-textMuted"
                    placeholder="you@company.com"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-mono text-textMuted mb-1.5 block uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textMuted pointer-events-none" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => { setForm((p) => ({ ...p, password: e.target.value })); setError(''); }}
                    className="w-full bg-bg border border-border rounded-lg pl-9 pr-11 py-3 text-text text-sm focus:outline-none focus:border-accent/50 transition-colors font-mono placeholder-textMuted"
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted hover:text-text transition-colors p-1"
                  >
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2 text-danger text-xs bg-danger/5 border border-danger/20 rounded-lg px-3 py-2.5 font-mono">
                  <span className="flex-shrink-0 mt-0.5">⚠</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Submit */}
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
                    Authenticating…
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 pt-5 border-t border-border">
              <div className="text-center text-xs text-textMuted font-mono space-y-2">
                <div>Demo password: <span className="text-accent">password123</span> for both roles</div>
                <div>
                  New ops manager?{' '}
                  <Link to="/register" className="text-accent hover:underline">
                    Create account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-6 text-xs text-textMuted font-mono">
          Secured by enterprise-grade encryption · OpsPulse v2.0
        </div>
      </div>
    </div>
  );
}
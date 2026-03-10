import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import OwnerDashboard from './pages/OwnerDashboard';
import OpsDashboard from './pages/OpsDashboard';
import HistoricalInsights from './pages/HistoricalInsights';
import RegisterPage from './pages/RegisterPage';
import IntegrationsPage from './pages/IntegrationsPage';
import DashboardLayout from './layouts/DashboardLayout';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-bg">
      <div className="text-accent font-mono animate-pulse">Initializing OpsPulse...</div>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && user.role !== requiredRole) {
    if (user.role === 'owner') return <Navigate to="/dashboard/owner" replace />;
    return <Navigate to="/dashboard/ops" replace />;
  }
  return children;
};

const RoleRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-bg">
      <div className="text-accent font-mono animate-pulse">Initializing OpsPulse...</div>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'owner' ? '/dashboard/owner' : '/dashboard/ops'} replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<RoleRedirect />} />
          <Route path="/dashboard/owner" element={
            <ProtectedRoute requiredRole="owner">
              <DashboardLayout><OwnerDashboard /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/ops" element={
            <ProtectedRoute requiredRole="ops_manager">
              <DashboardLayout><OpsDashboard /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/history" element={
            <ProtectedRoute requiredRole="owner">
              <DashboardLayout><HistoricalInsights /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/integrations" element={
            <ProtectedRoute requiredRole="owner">
              <DashboardLayout><IntegrationsPage /></DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
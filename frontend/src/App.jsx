import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OwnerDashboard from './pages/OwnerDashboard';
import OpsDashboard from './pages/OpsDashboard';
import AnalyticsPage from './pages/AnalyticsPage';
import IntegrationsPage from './pages/IntegrationsPage';
import DemoLab from './pages/DemoLab';
import SettingsPage from './pages/SettingsPage';
import HistoryCenter from './pages/HistoryCenter';
import DashboardLayout from './layouts/DashboardLayout';

const Loading = () => (
  <div className="flex items-center justify-center h-screen bg-bg">
    <div className="text-accent font-mono animate-pulse">Initializing OpsPulse...</div>
  </div>
);

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'owner' ? '/dashboard/owner' : '/dashboard/ops'} replace />;
  }
  return children;
};

const RoleRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'owner' ? '/dashboard/owner' : '/dashboard/ops'} replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
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
            <Route path="/dashboard/integrations" element={
              <ProtectedRoute requiredRole="owner">
                <DashboardLayout><IntegrationsPage /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/settings" element={
              <ProtectedRoute requiredRole="owner">
                <DashboardLayout><SettingsPage /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/analytics" element={
              <ProtectedRoute>
                <DashboardLayout><AnalyticsPage /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/demo" element={
              <ProtectedRoute>
                <DashboardLayout><DemoLab /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/history-center" element={
              <ProtectedRoute>
                <DashboardLayout><HistoryCenter /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/ops" element={
              <ProtectedRoute requiredRole="ops_manager">
                <DashboardLayout><OpsDashboard /></DashboardLayout>
              </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}
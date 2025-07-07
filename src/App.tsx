import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Layout from './components/Layout/Layout';
import Auth from './pages/Auth';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Videos from './pages/Videos';
import Store from './pages/Store';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Payment from './pages/Payment';
import Plans from './pages/Plans';
import AdminDashboard from './pages/AdminDashboard';
import Emagrecimento from './pages/Emagrecimento';
import Progress from './pages/Progress';
import AppsPage from './pages/Apps';
import About from './pages/About';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-900">
        <Router>
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/login" element={<Navigate to="/auth?mode=login" replace />} />
          <Route path="/register" element={<Navigate to="/auth?mode=register" replace />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="videos" element={<Videos />} />
            <Route path="store" element={<Store />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="profile" element={<Profile />} />
            <Route path="progress" element={<Progress />} />
            <Route path="plans" element={<Plans />} />
            <Route path="payment" element={<Payment />} />
            <Route path="settings" element={<Settings />} />
            <Route path="apps" element={<AppsPage />} />
            <Route path="emagrecimento" element={<Emagrecimento />} />
            <Route
              path="admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route path="" element={<Navigate to="/dashboard" replace />} />
          </Route>
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
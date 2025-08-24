import React, { lazy, Suspense, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Layout from "./components/Layout/Layout";
import PlanGuard from "./components/PlanGuard";
import ErrorBoundary from "./components/ErrorBoundary";
import { Toaster } from "react-hot-toast";
import LoadingSpinner from "./components/LoadingSpinner";

import { performanceMonitor, registerServiceWorker, addResourceHint } from "./lib/performance";

// Lazy load components with better chunking
const Auth = lazy(() =>
  import("./pages/Auth").then(module => {
    performanceMonitor.mark('auth-loaded');
    return module;
  })
);

const Home = lazy(() =>
  import("./pages/Home").then(module => {
    performanceMonitor.mark('home-loaded');
    return module;
  })
);

const Dashboard = lazy(() =>
  import("./pages/Dashboard").then(module => {
    performanceMonitor.mark('dashboard-loaded');
    return module;
  })
);

const Videos = lazy(() =>
  import("./pages/Videos").then(module => {
    performanceMonitor.mark('videos-loaded');
    return module;
  })
);

const Store = lazy(() =>
  import("./pages/Store").then(module => {
    performanceMonitor.mark('store-loaded');
    return module;
  })
);

const Favorites = lazy(() =>
  import("./pages/Favorites").then(module => {
    performanceMonitor.mark('favorites-loaded');
    return module;
  })
);

const Profile = lazy(() =>
  import("./pages/Profile").then(module => {
    performanceMonitor.mark('profile-loaded');
    return module;
  })
);

const Payment = lazy(() =>
  import("./pages/Payment").then(module => {
    performanceMonitor.mark('payment-loaded');
    return module;
  })
);

const PaymentSuccess = lazy(() =>
  import("./pages/PaymentSuccess").then(module => {
    performanceMonitor.mark('payment-success-loaded');
    return module;
  })
);

const Plans = lazy(() =>
  import("./pages/Plans").then(module => {
    performanceMonitor.mark('plans-loaded');
    return module;
  })
);

const AdminDashboard = lazy(() =>
  import("./pages/AdminDashboard").then(module => {
    performanceMonitor.mark('admin-loaded');
    return module;
  })
);

const Progress = lazy(() =>
  import("./pages/Progress").then(module => {
    performanceMonitor.mark('progress-loaded');
    return module;
  })
);

const AppsPage = lazy(() =>
  import("./pages/Apps").then(module => {
    performanceMonitor.mark('apps-loaded');
    return module;
  })
);

const About = lazy(() =>
  import("./pages/About").then(module => {
    performanceMonitor.mark('about-loaded');
    return module;
  })
);

const Achievements = lazy(() =>
  import("./pages/Achievements").then(module => {
    performanceMonitor.mark('achievements-loaded');
    return module;
  })
);

const FitnessModulesApp = lazy(() =>
  import("./components/fitness-modules/ModulosConfig").then(module => {
    performanceMonitor.mark('fitness-modules-loaded');
    return module;
  })
);

const TestDashboard = lazy(() =>
  import("./pages/TestDashboard").then(module => {
    performanceMonitor.mark('test-dashboard-loaded');
    return module;
  })
);

const AuthCallback = lazy(() =>
  import("./pages/AuthCallback").then(module => {
    performanceMonitor.mark('auth-callback-loaded');
    return module;
  })
);

const ResetPassword = lazy(() =>
  import("./pages/ResetPassword").then(module => {
    performanceMonitor.mark('reset-password-loaded');
    return module;
  })
);

// Loading fallback component
const LoadingFallback: React.FC = () => (
  <LoadingSpinner 
    size="md" 
    text="Carregando página..." 
    fullScreen={false}
  />
);

function App() {
  useEffect(() => {
    // Performance monitoring
    performanceMonitor.mark('app-start');
    
    // Preconnect to external domains
    addResourceHint('https://fonts.googleapis.com', 'preconnect');
    addResourceHint('https://fonts.gstatic.com', 'preconnect');
    addResourceHint('https://api.stripe.com', 'dns-prefetch');
    
    // Register service worker for caching
    registerServiceWorker();

    // Performance logging in development
    if (import.meta.env.DEV) {
      setTimeout(() => {
        const metrics = performanceMonitor.getPageLoadMetrics();
        if (metrics) {
          console.log('Page Load Metrics:', metrics);
        }
      }, 1000);
    }
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
      <div className="min-h-screen bg-slate-900">
        <Routes>
          <Route
            path="/"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <Home />
              </Suspense>
            }
          />
          <Route
            path="/about"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <About />
              </Suspense>
            }
          />
          <Route
            path="/auth"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <Auth />
              </Suspense>
            }
          />
          <Route
            path="/login"
            element={<Navigate to="/auth?mode=login" replace />}
          />
          <Route
            path="/register"
            element={<Navigate to="/auth?mode=register" replace />}
          />
          <Route
            path="/auth/callback"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <AuthCallback />
              </Suspense>
            }
          />
          <Route
            path="/auth/confirm"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <AuthCallback />
              </Suspense>
            }
          />
          <Route
            path="/auth/reset-password"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <ResetPassword />
              </Suspense>
            }
          />

          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route
              path="dashboard"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <Dashboard />
                </Suspense>
              }
            />
            <Route
              path="videos"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <Videos />
                </Suspense>
              }
            />
            <Route
              path="store"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <Store />
                </Suspense>
              }
            />
            <Route
              path="favorites"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <Favorites />
                </Suspense>
              }
            />
            <Route
              path="profile"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <Profile />
                </Suspense>
              }
            />

            <Route
              path="achievements"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <Achievements />
                </Suspense>
              }
            />

            <Route
              path="progress"
              element={
                <PlanGuard requiredPlan="B">
                  <Suspense fallback={<LoadingFallback />}>
                    <Progress />
                  </Suspense>
                </PlanGuard>
              }
            />
            <Route
              path="plans"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <Plans />
                </Suspense>
              }
            />
            <Route
              path="payment"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <Payment />
                </Suspense>
              }
            />
            <Route
              path="payment-success"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <PaymentSuccess />
                </Suspense>
              }
            />

            <Route
              path="apps"
              element={
                <PlanGuard requiredPlan="B">
                  <Suspense fallback={<LoadingFallback />}>
                    <AppsPage />
                  </Suspense>
                </PlanGuard>
              }
            />
            <Route
              path="fitness/*"
              element={
                <PlanGuard requiredPlan="B">
                  <Suspense fallback={<LoadingFallback />}>
                    <FitnessModulesApp />
                  </Suspense>
                </PlanGuard>
              }
            />
            <Route
              path="admin"
              element={
                <AdminRoute>
                  <Suspense fallback={<LoadingFallback />}>
                    <AdminDashboard />
                  </Suspense>
                </AdminRoute>
              }
            />
            <Route
              path="test"
              element={
                <AdminRoute>
                  <Suspense fallback={<LoadingFallback />}>
                    <TestDashboard />
                  </Suspense>
                </AdminRoute>
              }
            />
            <Route path="" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </div>

      {/* Toast notifications with better positioning */}
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'bg-slate-800 text-white border border-slate-700',
          duration: 4000,
          style: {
            background: 'rgba(30, 41, 59, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            color: 'white',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: 'white',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: 'white',
            },
          },
        }}
      />
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

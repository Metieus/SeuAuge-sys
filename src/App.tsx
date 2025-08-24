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
import SupabaseStatus from "./components/Common/SupabaseStatus";
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

const About = lazy(() =>
  import("./pages/About").then(module => {
    performanceMonitor.mark('about-loaded');
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

const Favorites = lazy(() =>
  import("./pages/Favorites").then(module => {
    performanceMonitor.mark('favorites-loaded');
    return module;
  })
);

const Cart = lazy(() =>
  import("./pages/Cart").then(module => {
    performanceMonitor.mark('cart-loaded');
    return module;
  })
);

const Profile = lazy(() =>
  import("./pages/Profile").then(module => {
    performanceMonitor.mark('profile-loaded');
    return module;
  })
);

const FitnessModulesApp = lazy(() =>
  import("./components/fitness-modules/ModulosConfig").then(module => {
    performanceMonitor.mark('fitness-modules-loaded');
    return module;
  })
);

const Reports = lazy(() =>
  import("./pages/Reports").then(module => {
    performanceMonitor.mark('reports-loaded');
    return module;
  })
);

const Videos = lazy(() =>
  import("./pages/Videos").then(module => {
    performanceMonitor.mark('videos-loaded');
    return module;
  })
);

const Products = lazy(() =>
  import("./pages/Products").then(module => {
    performanceMonitor.mark('products-loaded');
    return module;
  })
);

const AppsPage = lazy(() =>
  import("./pages/Apps").then(module => {
    performanceMonitor.mark('apps-loaded');
    return module;
  })
);

const Achievements = lazy(() =>
  import("./pages/Achievements").then(module => {
    performanceMonitor.mark('achievements-loaded');
    return module;
  })
);

const AdminDashboard = lazy(() =>
  import("./pages/AdminDashboard").then(module => {
    performanceMonitor.mark('admin-dashboard-loaded');
    return module;
  })
);

const Onboarding = lazy(() =>
  import("./pages/Onboarding").then(module => {
    performanceMonitor.mark('onboarding-loaded');
    return module;
  })
);

const PreferencesSetup = lazy(() =>
  import("./pages/PreferencesSetup").then(module => {
    performanceMonitor.mark('preferences-setup-loaded');
    return module;
  })
);

const Plans = lazy(() =>
  import("./pages/Plans").then(module => {
    performanceMonitor.mark('plans-loaded');
    return module;
  })
);

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  </div>
);

const App: React.FC = () => {
  useEffect(() => {
    // Register service worker for PWA
    registerServiceWorker();

    // Add preconnect hints for better performance
    addResourceHint('preconnect', 'https://fonts.googleapis.com');
    addResourceHint('preconnect', 'https://fonts.gstatic.com');

    // Mark app initialization
    performanceMonitor.mark('app-start');

    // Register performance observer
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          performanceMonitor.mark(`${entry.name}-observed`);
        });
      });
      observer.observe({ entryTypes: ['navigation', 'resource'] });
    }

    // Performance metrics reporting after load
    if (import.meta.env.PROD) {
      setTimeout(() => {
        const metrics = performanceMonitor.getMetrics();
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
            <SupabaseStatus />
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
                  path="/plans"
                  element={
                    <Suspense fallback={<LoadingFallback />}>
                      <Plans />
                    </Suspense>
                  }
                />

                {/* Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Suspense fallback={<LoadingFallback />}>
                          <Dashboard />
                        </Suspense>
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Suspense fallback={<LoadingFallback />}>
                          <Profile />
                        </Suspense>
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/favorites"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Suspense fallback={<LoadingFallback />}>
                          <Favorites />
                        </Suspense>
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Suspense fallback={<LoadingFallback />}>
                          <Cart />
                        </Suspense>
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reports"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Suspense fallback={<LoadingFallback />}>
                          <Reports />
                        </Suspense>
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/achievements"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Suspense fallback={<LoadingFallback />}>
                          <Achievements />
                        </Suspense>
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/onboarding"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Suspense fallback={<LoadingFallback />}>
                          <Onboarding />
                        </Suspense>
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/preferences"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Suspense fallback={<LoadingFallback />}>
                          <PreferencesSetup />
                        </Suspense>
                      </Layout>
                    </ProtectedRoute>
                  }
                />

                {/* Plan-Protected Routes */}
                <Route path="/protected/*" element={
                  <ProtectedRoute>
                    <Layout>
                      <Routes>
                        <Route
                          path="videos"
                          element={
                            <PlanGuard requiredPlan="B">
                              <Suspense fallback={<LoadingFallback />}>
                                <Videos />
                              </Suspense>
                            </PlanGuard>
                          }
                        />
                        <Route
                          path="products"
                          element={
                            <PlanGuard requiredPlan="B">
                              <Suspense fallback={<LoadingFallback />}>
                                <Products />
                              </Suspense>
                            </PlanGuard>
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
                      </Routes>
                    </Layout>
                  </ProtectedRoute>
                } />

                {/* Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <Layout>
                        <Suspense fallback={<LoadingFallback />}>
                          <AdminDashboard />
                        </Suspense>
                      </Layout>
                    </AdminRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>

              {/* Global Toast Notifications */}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#1e293b',
                    color: '#f1f5f9',
                    border: '1px solid #334155',
                  },
                  success: {
                    style: {
                      background: '#059669',
                      color: '#ffffff',
                    },
                  },
                  error: {
                    style: {
                      background: '#dc2626',
                      color: '#ffffff',
                    },
                  },
                }}
              />
            </div>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;

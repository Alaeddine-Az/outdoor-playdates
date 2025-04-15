import { Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { LoadScript } from '@react-google-maps/api';
import { GOOGLE_MAPS_LIBRARIES } from '@/config/googleMaps';
import PublicRoutes from './routes/PublicRoutes';
import ProtectedRoutes from './routes/ProtectedRoutes';
import AdminRoutes from './routes/AdminRoutes';
import MainLayout from './components/layout/MainLayout';
import AppLayout from './components/AppLayout';
import NotFound from './pages/NotFound';
import Auth from './pages/Auth';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Terms from './pages/Terms';
import Contact from './pages/Contact';
import ThankYou from './pages/ThankYou';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import ConnectionsPage from './pages/Connections';
import ScrollToTop from './components/ScrollToTop';
import { useEffect } from 'react';
import { ensureAdminUser } from './utils/adminInitializer';
import PlaydateDetail from './pages/PlaydateDetail';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

function AppRoutes() {
  const { user, isAdmin, loading } = useAuth();
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  
  // Initialize admin user
  useEffect(() => {
    ensureAdminUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <LoadScript 
      googleMapsApiKey={googleMapsApiKey}
      libraries={GOOGLE_MAPS_LIBRARIES}
      onLoad={() => console.log('📦 Google Maps script loaded successfully')}
    >
      <Routes>
        {/* Public pages outside main layout */}
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/contact" element={<Contact />} />

        {/* Admin routes - redirects non-admin users to dashboard */}
        <Route path="/admin/*" element={
          loading ? (
            <div className="flex items-center justify-center h-screen">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : isAdmin ? (
            <AdminRoutes />
          ) : (
            <Navigate to="/dashboard" replace />
          )
        } />

        {/* Main Layout with protected routes - redirects admin users to admin dashboard */}
        <Route element={
          loading ? (
            <div className="flex items-center justify-center h-screen">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : isAdmin ? (
            <Navigate to="/admin" replace />
          ) : (
            <MainLayout />
          )
        }>
          {/* App Layout for protected app pages */}
          <Route element={<AppLayout />}>
            {/* Protected routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/connections" element={<ConnectionsPage />} />
            <Route path="/playdate/:id" element={<PlaydateDetail />} />
            <Route path="/*" element={<ProtectedRoutes />} />
          </Route>
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </LoadScript>
  );
}

function App() {
  return (
    <>
      <ScrollToTop />
      <AppRoutes />
      <Toaster />
    </>
  );
}

export default App;


import { Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
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

function AppRoutes() {
  // Initialize admin user
  useEffect(() => {
    ensureAdminUser();
  }, []);

  return (
    <Routes>
      {/* Public pages outside main layout */}
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/thank-you" element={<ThankYou />} />
      <Route path="/about" element={<About />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/contact" element={<Contact />} />

      {/* Admin routes */}
      <Route path="/admin/*" element={<AdminRoutes />} />

      {/* Main Layout with protected routes */}
      <Route element={<MainLayout />}>
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

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import PublicRoutes from './routes/PublicRoutes';
import ProtectedRoutes from './routes/ProtectedRoutes';
import AdminRoutes from './routes/AdminRoutes';
import MainLayout from './components/layout/MainLayout';
import NotFound from './pages/NotFound';
import Auth from './pages/Auth';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Terms from './pages/Terms';
import Contact from './pages/Contact';
import ThankYou from './pages/ThankYou';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';

// Create a client
const queryClient = new QueryClient();

function AppRoutes() {
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

      {/* Main Layout with protected routes */}
      <Route element={<MainLayout />}>
        {/* Protected routes - add Dashboard explicitly here */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/*" element={<ProtectedRoutes />} />
        <Route path="/parent/*" element={<ProtectedRoutes />} />
        <Route path="/parent-profile" element={<ProtectedRoutes />} />
        <Route path="/child/*" element={<ProtectedRoutes />} />
        <Route path="/add-child" element={<ProtectedRoutes />} />
        <Route path="/connections/*" element={<ProtectedRoutes />} />
        <Route path="/messages/*" element={<ProtectedRoutes />} />
        <Route path="/events/*" element={<ProtectedRoutes />} />
        <Route path="/create-event" element={<ProtectedRoutes />} />
        <Route path="/event/*" element={<ProtectedRoutes />} />
        <Route path="/playdates/*" element={<ProtectedRoutes />} />
        <Route path="/create-playdate" element={<ProtectedRoutes />} />
        <Route path="/playdate/*" element={<ProtectedRoutes />} />
        <Route path="/group/*" element={<ProtectedRoutes />} />

        {/* Admin routes */}
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Route>

      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-muted-foreground text-lg">Loading...</span>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;


import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import PublicRoutes from './routes/PublicRoutes';
import ProtectedRoutes from './routes/ProtectedRoutes';
import AdminRoutes from './routes/AdminRoutes';
import MainLayout from './components/layout/MainLayout';
import NotFound from './pages/NotFound';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes (outside main layout) */}
            <Route path="/auth" element={<PublicRoutes />} />
            <Route path="/thank-you" element={<PublicRoutes />} />
            <Route path="/about" element={<PublicRoutes />} />
            <Route path="/faq" element={<PublicRoutes />} />
            <Route path="/terms" element={<PublicRoutes />} />
            <Route path="/contact" element={<PublicRoutes />} />
            
            {/* Home page */}
            <Route path="/" element={<PublicRoutes />} />
            
            {/* Main Layout with protected routes */}
            <Route element={<MainLayout />}>
              {/* Protected routes */}
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
          
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

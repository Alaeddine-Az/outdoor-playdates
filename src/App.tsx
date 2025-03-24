
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Import pages
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import Playdates from './pages/Playdates';
import Challenges from './pages/Challenges';
import Achievements from './pages/Achievements';
import Connections from './pages/Connections';
import ParentProfile from './pages/ParentProfile';
import PlaydateDetail from './pages/PlaydateDetail';
import GroupDetail from './pages/GroupDetail';
import NotFound from './pages/NotFound';
import ThankYou from './pages/ThankYou';
import Auth from './pages/Auth';
import CreatePlaydate from './pages/CreatePlaydate';
import AddChild from './pages/AddChild';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Terms from './pages/Terms';
import Contact from './pages/Contact';

// Create a client
const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    // Show loading spinner or placeholder
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/playdates"
              element={
                <ProtectedRoute>
                  <Playdates />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-playdate"
              element={
                <ProtectedRoute>
                  <CreatePlaydate />
                </ProtectedRoute>
              }
            />
            <Route
              path="/playdate/:id"
              element={
                <ProtectedRoute>
                  <PlaydateDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/challenges"
              element={
                <ProtectedRoute>
                  <Challenges />
                </ProtectedRoute>
              }
            />
            <Route
              path="/achievements"
              element={
                <ProtectedRoute>
                  <Achievements />
                </ProtectedRoute>
              }
            />
            <Route
              path="/connections"
              element={
                <ProtectedRoute>
                  <Connections />
                </ProtectedRoute>
              }
            />
            <Route
              path="/parent-profile"
              element={
                <ProtectedRoute>
                  <ParentProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-child"
              element={
                <ProtectedRoute>
                  <AddChild />
                </ProtectedRoute>
              }
            />
            <Route
              path="/group/:id"
              element={
                <ProtectedRoute>
                  <GroupDetail />
                </ProtectedRoute>
              }
            />
            
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

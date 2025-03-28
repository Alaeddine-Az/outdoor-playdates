
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Import pages
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import UserProfile from './pages/UserProfile';
import ChildProfile from './pages/ChildProfile';
import Connections from './pages/Connections';
import Messages from './pages/Messages';
import Events from './pages/Events';
import CreateEvent from './pages/CreateEvent';
import EventDetail from './pages/EventDetail';
import Playdates from './pages/Playdates';
import PlaydateDetail from './pages/PlaydateDetail';
import GroupDetail from './pages/GroupDetail';
import NotFound from './pages/NotFound';
import ThankYou from './pages/ThankYou';
import Auth from './pages/Auth';
import AddChild from './pages/AddChild';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Terms from './pages/Terms';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import CreatePlaydate from './pages/CreatePlaydate';

// Create a client
const queryClient = new QueryClient();

// Protected route component that uses useAuth
function ProtectedRouteContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    // Show a better loading indicator
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">Loading your account...</p>
        <p className="text-xs text-muted-foreground mt-2">If this persists, try refreshing the page.</p>
      </div>
    );
  }
  
  if (!user) {
    console.log("No user found, redirecting to auth page");
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
}

// Wrapper that ensures ProtectedRouteContent is only used within AuthProvider
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return children;
};

// Admin route component
function AdminRouteContent({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth();
  
  if (loading) {
    // Show loading spinner or placeholder
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
}

// Wrapper that ensures AdminRouteContent is only used within AuthProvider
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  return children;
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
            
            {/* Admin routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminRouteContent>
                    <AdminDashboard />
                  </AdminRouteContent>
                </AdminRoute>
              }
            />
            
            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <ProtectedRouteContent>
                    <Dashboard />
                  </ProtectedRouteContent>
                </ProtectedRoute>
              }
            />
            
            {/* Profile Routes */}
            <Route
              path="/parent/:id"
              element={
                <ProtectedRoute>
                  <ProtectedRouteContent>
                    <UserProfile />
                  </ProtectedRouteContent>
                </ProtectedRoute>
              }
            />
            <Route
              path="/parent-profile"
              element={
                <ProtectedRoute>
                  <ProtectedRouteContent>
                    <UserProfile />
                  </ProtectedRouteContent>
                </ProtectedRoute>
              }
            />
            <Route
              path="/child/:id"
              element={
                <ProtectedRoute>
                  <ProtectedRouteContent>
                    <ChildProfile />
                  </ProtectedRouteContent>
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-child"
              element={
                <ProtectedRoute>
                  <ProtectedRouteContent>
                    <AddChild />
                  </ProtectedRouteContent>
                </ProtectedRoute>
              }
            />
            
            {/* Connection Routes */}
            <Route
              path="/connections"
              element={
                <ProtectedRoute>
                  <ProtectedRouteContent>
                    <Connections />
                  </ProtectedRouteContent>
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages/:id"
              element={
                <ProtectedRoute>
                  <ProtectedRouteContent>
                    <Messages />
                  </ProtectedRouteContent>
                </ProtectedRoute>
              }
            />
            
            {/* Event Routes */}
            <Route
              path="/events"
              element={
                <ProtectedRoute>
                  <ProtectedRouteContent>
                    <Events />
                  </ProtectedRouteContent>
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-event"
              element={
                <ProtectedRoute>
                  <ProtectedRouteContent>
                    <CreateEvent />
                  </ProtectedRouteContent>
                </ProtectedRoute>
              }
            />
            <Route
              path="/event/:id"
              element={
                <ProtectedRoute>
                  <ProtectedRouteContent>
                    <EventDetail />
                  </ProtectedRouteContent>
                </ProtectedRoute>
              }
            />
            
            {/* Playdate Routes */}
            <Route
              path="/playdates"
              element={
                <ProtectedRoute>
                  <ProtectedRouteContent>
                    <Playdates />
                  </ProtectedRouteContent>
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-playdate"
              element={
                <ProtectedRoute>
                  <ProtectedRouteContent>
                    <CreatePlaydate />
                  </ProtectedRouteContent>
                </ProtectedRoute>
              }
            />
            <Route
              path="/playdate/:id"
              element={
                <ProtectedRoute>
                  <ProtectedRouteContent>
                    <PlaydateDetail />
                  </ProtectedRouteContent>
                </ProtectedRoute>
              }
            />
            <Route
              path="/group/:id"
              element={
                <ProtectedRoute>
                  <ProtectedRouteContent>
                    <GroupDetail />
                  </ProtectedRouteContent>
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


import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

// Import pages
import Dashboard from '@/pages/Dashboard';
import UserProfile from '@/pages/UserProfile';
import ChildProfile from '@/pages/ChildProfile';
import AddChild from '@/pages/AddChild';
import Connections from '@/pages/Connections';
import Messages from '@/pages/Messages';
import Events from '@/pages/Events';
import CreateEvent from '@/pages/CreateEvent';
import EventDetail from '@/pages/EventDetail';
import Playdates from '@/pages/Playdates';
import CreatePlaydate from '@/pages/CreatePlaydate';
import PlaydateDetail from '@/pages/PlaydateDetail';
import GroupDetail from '@/pages/GroupDetail';
import NotFound from '@/pages/NotFound';

// Reusable component for protected routes
export const ProtectedRouteContent = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
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
};

const ProtectedRoutes = () => {
  const { user } = useAuth();

  // If no user, redirect to auth page
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/parent/:id" element={<UserProfile />} />
      <Route path="/parent-profile" element={<UserProfile />} />
      <Route path="/child/:id" element={<ChildProfile />} />
      <Route path="/add-child" element={<AddChild />} />
      <Route path="/connections" element={<Connections />} />
      <Route path="/messages/:id" element={<Messages />} />
      <Route path="/events" element={<Events />} />
      <Route path="/create-event" element={<CreateEvent />} />
      <Route path="/event/:id" element={<EventDetail />} />
      <Route path="/playdates" element={<Playdates />} />
      <Route path="/create-playdate" element={<CreatePlaydate />} />
      <Route path="/playdate/:id" element={<PlaydateDetail />} />
      <Route path="/group/:id" element={<GroupDetail />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default ProtectedRoutes;

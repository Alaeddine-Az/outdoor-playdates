
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
  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <ProtectedRouteContent>
            <Dashboard />
          </ProtectedRouteContent>
        }
      />
      <Route
        path="/parent/:id"
        element={
          <ProtectedRouteContent>
            <UserProfile />
          </ProtectedRouteContent>
        }
      />
      <Route
        path="/parent-profile"
        element={
          <ProtectedRouteContent>
            <UserProfile />
          </ProtectedRouteContent>
        }
      />
      <Route
        path="/child/:id"
        element={
          <ProtectedRouteContent>
            <ChildProfile />
          </ProtectedRouteContent>
        }
      />
      <Route
        path="/add-child"
        element={
          <ProtectedRouteContent>
            <AddChild />
          </ProtectedRouteContent>
        }
      />
      <Route
        path="/connections"
        element={
          <ProtectedRouteContent>
            <Connections />
          </ProtectedRouteContent>
        }
      />
      <Route
        path="/messages/:id"
        element={
          <ProtectedRouteContent>
            <Messages />
          </ProtectedRouteContent>
        }
      />
      <Route
        path="/events"
        element={
          <ProtectedRouteContent>
            <Events />
          </ProtectedRouteContent>
        }
      />
      <Route
        path="/create-event"
        element={
          <ProtectedRouteContent>
            <CreateEvent />
          </ProtectedRouteContent>
        }
      />
      <Route
        path="/event/:id"
        element={
          <ProtectedRouteContent>
            <EventDetail />
          </ProtectedRouteContent>
        }
      />
      <Route
        path="/playdates"
        element={
          <ProtectedRouteContent>
            <Playdates />
          </ProtectedRouteContent>
        }
      />
      <Route
        path="/create-playdate"
        element={
          <ProtectedRouteContent>
            <CreatePlaydate />
          </ProtectedRouteContent>
        }
      />
      <Route
        path="/playdate/:id"
        element={
          <ProtectedRouteContent>
            <PlaydateDetail />
          </ProtectedRouteContent>
        }
      />
      <Route
        path="/group/:id"
        element={
          <ProtectedRouteContent>
            <GroupDetail />
          </ProtectedRouteContent>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default ProtectedRoutes;

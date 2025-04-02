
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Import pages
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
import EditProfile from '@/pages/EditProfile';
import ParentProfile from '@/pages/ParentProfile';
import EditChild from '@/pages/EditChild';

const ProtectedRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-muted-foreground">Loading your account...</p>
      </div>
    );
  }

  if (!user) {
    console.log("No user found, redirecting to auth page");
    return <Navigate to="/auth" replace />;
  }

  return (
    <Routes>
      <Route path="/parent/:id" element={<ParentProfile />} />
      <Route path="/parent-profile" element={<ParentProfile />} />
      <Route path="/child/:id" element={<ChildProfile />} />
      <Route path="/add-child" element={<AddChild />} />
      <Route path="/edit-child/:id" element={<EditChild />} />
      <Route path="/connections" element={<Connections />} />
      <Route path="/messages/:id" element={<Messages />} />
      <Route path="/events" element={<Events />} />
      <Route path="/create-event" element={<CreateEvent />} />
      <Route path="/event/:id" element={<EventDetail />} />
      <Route path="/playdates" element={<Playdates />} />
      <Route path="/create-playdate" element={<CreatePlaydate />} />
      <Route path="/playdate/:id" element={<PlaydateDetail />} />
      <Route path="/group/:id" element={<GroupDetail />} />
      <Route path="/edit-profile" element={<EditProfile />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default ProtectedRoutes;

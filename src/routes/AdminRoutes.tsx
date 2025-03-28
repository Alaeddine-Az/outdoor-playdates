
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AdminDashboard from '@/pages/AdminDashboard';

// Reusable component for admin routes
export const AdminRouteContent = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, isAdmin } = useAuth();
  
  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">Verifying admin access...</p>
        <p className="text-xs text-muted-foreground mt-2">If this persists, try refreshing the page.</p>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const AdminRoutes = () => {
  return (
    <Routes>
      <Route
        path="/admin"
        element={
          <AdminRouteContent>
            <AdminDashboard />
          </AdminRouteContent>
        }
      />
    </Routes>
  );
};

export default AdminRoutes;

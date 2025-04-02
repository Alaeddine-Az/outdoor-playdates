
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/layout/AdminLayout';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminSignups from '@/pages/admin/AdminSignups';
import AdminLogs from '@/pages/admin/AdminLogs';
import CreateAdmin from '@/pages/admin/CreateAdmin';

const AdminRoutes = () => {
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
  
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/users" element={<AdminUsers />} />
        <Route path="/signups" element={<AdminSignups />} />
        <Route path="/logs" element={<AdminLogs />} />
        <Route path="/create-admin" element={<CreateAdmin />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminRoutes;

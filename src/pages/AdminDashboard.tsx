
import React from 'react';
import { Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import SignupCardGrid from '@/components/admin/SignupCardGrid';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';

const AdminDashboard = () => {
  const {
    user,
    loading,
    isAdmin,
    pendingSignups,
    handleApprove,
    handleReject
  } = useAdminDashboard();

  // Redirect if not admin
  if (user && !isAdmin && !loading) {
    return <Navigate to="/dashboard" replace />;
  }

  // Redirect if not logged in
  if (!user && !loading) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <>
      <Header />
      <main className="container max-w-6xl py-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Pending Approval Requests</h2>
          
          {loading ? (
            <p>Loading requests...</p>
          ) : (
            <SignupCardGrid 
              signups={pendingSignups}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          )}
        </section>
      </main>
    </>
  );
};

export default AdminDashboard;

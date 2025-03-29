
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignupCardGrid from '@/components/admin/SignupCardGrid';
import EarlySignupList from '@/components/admin/EarlySignupList';
import AccountCreationModal from '@/components/admin/AccountCreationModal';
import { useAdminSignups } from '@/hooks/useAdminSignups';
import UserManagement from '@/components/admin/UserManagement';

const AdminDashboard = () => {
  const {
    user,
    loading: authLoading,
    isAdmin,
    pendingSignups,
    handleApprove: handleApproveRequest,
    handleReject: handleRejectRequest
  } = useAdminDashboard();

  const {
    loading: signupsLoading,
    signups,
    handleApprove,
    handleReject,
    handleCreateAccount,
    isModalOpen,
    selectedSignup,
    handleCloseModal,
    handleConfirmAccountCreation,
    isCreatingAccount,
    refreshSignups
  } = useAdminSignups();

  useEffect(() => {
    if (user && isAdmin) {
      refreshSignups();
    }
  }, [user, isAdmin]);

  // Redirect if not admin
  if (user && !isAdmin && !authLoading) {
    return <Navigate to="/dashboard" replace />;
  }

  // Redirect if not logged in
  if (!user && !authLoading) {
    return <Navigate to="/auth" replace />;
  }

  const loading = authLoading || signupsLoading;

  return (
    <>
      <Header />
      <main className="container max-w-6xl py-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <Tabs defaultValue="early-signups" className="mb-8">
          <TabsList>
            <TabsTrigger value="early-signups">Early Signups</TabsTrigger>
            <TabsTrigger value="approval-requests">Approval Requests</TabsTrigger>
            <TabsTrigger value="user-management">User Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="early-signups" className="mt-6">
            <EarlySignupList 
              signups={signups}
              onApprove={handleApprove}
              onReject={handleReject}
              onCreateAccount={handleCreateAccount}
              loading={loading}
            />
          </TabsContent>
          
          <TabsContent value="approval-requests" className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Pending Approval Requests</h2>
            
            {loading ? (
              <p>Loading requests...</p>
            ) : (
              <SignupCardGrid 
                signups={pendingSignups}
                onApprove={handleApproveRequest}
                onReject={handleRejectRequest}
              />
            )}
          </TabsContent>
          
          <TabsContent value="user-management" className="mt-6">
            <UserManagement />
          </TabsContent>
        </Tabs>
      </main>
      
      <AccountCreationModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        signup={selectedSignup}
        onConfirm={handleConfirmAccountCreation}
        isLoading={isCreatingAccount}
      />
    </>
  );
};

export default AdminDashboard;

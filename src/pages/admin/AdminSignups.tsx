
import React from 'react';
import { useAdminSignups } from '@/hooks/useAdminSignups';
import EarlySignupList from '@/components/admin/EarlySignupList';
import AccountCreationModal from '@/components/admin/AccountCreationModal';

const AdminSignups: React.FC = () => {
  const {
    loading,
    signups,
    completedSignups,
    handleApprove,
    handleReject,
    handleMarkComplete,
    handleCreateAccount,
    isModalOpen,
    selectedSignup,
    handleCloseModal,
    handleConfirmAccountCreation,
    isCreatingAccount,
    refreshSignups
  } = useAdminSignups();

  React.useEffect(() => {
    refreshSignups();
  }, [refreshSignups]);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Early Signups</h1>
      
      <EarlySignupList 
        title="Active Signups"
        description="Users who have signed up for early access and are in the onboarding process"
        signups={signups}
        onApprove={handleApprove}
        onReject={handleReject}
        onCreateAccount={handleCreateAccount}
        onMarkComplete={handleMarkComplete}
        loading={loading}
        showCompleteButton={true}
      />
      
      <EarlySignupList
        title="Onboarding Complete"
        description="Users who have completed the onboarding process"
        signups={completedSignups}
        onApprove={handleApprove}
        onReject={handleReject}
        onCreateAccount={handleCreateAccount}
        loading={loading}
      />
      
      <AccountCreationModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        signup={selectedSignup}
        onConfirm={handleConfirmAccountCreation}
        isLoading={isCreatingAccount}
      />
    </div>
  );
};

export default AdminSignups;

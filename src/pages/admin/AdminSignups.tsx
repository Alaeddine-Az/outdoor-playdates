
import React from 'react';
import { useAdminSignups } from '@/hooks/useAdminSignups';
import EarlySignupList from '@/components/admin/EarlySignupList';
import AccountCreationModal from '@/components/admin/AccountCreationModal';

const AdminSignups: React.FC = () => {
  const {
    loading,
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

  React.useEffect(() => {
    refreshSignups();
  }, [refreshSignups]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Early Signups</h1>
      
      <EarlySignupList 
        signups={signups}
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


import React, { useEffect } from 'react';
import { useAdminSignups } from '@/hooks/useAdminSignups';
import EarlySignupList from '@/components/admin/EarlySignupList';
import AccountCreationModal from '@/components/admin/AccountCreationModal';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

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

  useEffect(() => {
    refreshSignups();
  }, [refreshSignups]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Early Signups</h1>
        <Button 
          onClick={refreshSignups} 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {/* Display no data message if both signup lists are empty */}
          {signups.length === 0 && completedSignups.length === 0 ? (
            <div className="bg-muted/50 rounded-lg p-8 text-center">
              <AlertTriangle className="mx-auto h-12 w-12 text-amber-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">No early signups found</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                There are no early signups in the database. Make sure your Supabase database contains entries in the 'early_signups' table.
              </p>
              <Button onClick={refreshSignups} variant="outline" size="sm">
                Try Again
              </Button>
            </div>
          ) : (
            <>
              <EarlySignupList 
                title="Active Signups"
                description="Users who have signed up for early access and are in the onboarding process"
                signups={signups}
                onApprove={handleApprove}
                onReject={handleReject}
                onCreateAccount={handleCreateAccount}
                onMarkComplete={handleMarkComplete}
                loading={false}
                showCompleteButton={true}
              />
              
              <EarlySignupList
                title="Onboarding Complete"
                description="Users who have completed the onboarding process"
                signups={completedSignups}
                onApprove={handleApprove}
                onReject={handleReject}
                onCreateAccount={handleCreateAccount}
                loading={false}
              />
            </>
          )}
        </>
      )}
      
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

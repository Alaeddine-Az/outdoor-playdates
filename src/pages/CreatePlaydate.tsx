
import React from 'react';
import AppLayoutWrapper from '@/components/AppLayoutWrapper';
import PlaydateCreationForm from '@/components/PlaydateCreationForm';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

const CreatePlaydate = () => {
  const isMobile = useIsMobile();
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <AppLayoutWrapper>
        <div className="container flex items-center justify-center py-12">
          <div className="text-center">Loading...</div>
        </div>
      </AppLayoutWrapper>
    );
  }
  
  if (!user) {
    toast({
      title: "Authentication required",
      description: "You need to sign in to create a playdate",
      variant: "destructive"
    });
    return <Navigate to="/auth" replace />;
  }
  
  return (
    <AppLayoutWrapper>
      <div className={`${isMobile ? 'px-2 py-4' : 'py-8'} mx-auto max-w-3xl w-full`}>
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Create a New Playdate</h1>
        <PlaydateCreationForm />
      </div>
    </AppLayoutWrapper>
  );
};

export default CreatePlaydate;

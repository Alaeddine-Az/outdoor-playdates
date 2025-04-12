
import React from 'react';
import PlaydateCreationForm from '@/components/PlaydateCreationForm';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const CreatePlaydate = () => {
  const isMobile = useIsMobile();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    toast({
      title: "Authentication required",
      description: "You need to sign in to create a playdate",
      variant: "destructive",
    });
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className={`${isMobile ? 'px-2 py-4' : 'py-8'} mx-auto max-w-3xl w-full`}>
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">Create a New Playdate</h1>
      <PlaydateCreationForm />
    </div>
  );
};

export default CreatePlaydate;

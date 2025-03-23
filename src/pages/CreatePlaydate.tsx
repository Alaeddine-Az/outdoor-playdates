
import React from 'react';
import AppLayout from '@/components/AppLayout';
import PlaydateCreationForm from '@/components/PlaydateCreationForm';
import { useIsMobile } from '@/hooks/use-mobile';

const CreatePlaydate = () => {
  const isMobile = useIsMobile();
  
  return (
    <AppLayout>
      <div className={`container ${isMobile ? 'px-2 py-4' : 'py-8'}`}>
        <PlaydateCreationForm />
      </div>
    </AppLayout>
  );
};

export default CreatePlaydate;

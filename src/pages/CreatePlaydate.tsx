
import React from 'react';
import AppLayout from '@/components/AppLayout';
import PlaydateCreationForm from '@/components/PlaydateCreationForm';

const CreatePlaydate = () => {
  return (
    <AppLayout>
      <div className="container py-8">
        <PlaydateCreationForm />
      </div>
    </AppLayout>
  );
};

export default CreatePlaydate;

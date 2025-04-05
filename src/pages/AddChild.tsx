
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayoutWrapper from '@/components/AppLayoutWrapper';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';
import ChildBasicInfoForm from '@/components/child/ChildBasicInfoForm';
import ChildInterestsForm from '@/components/child/ChildInterestsForm';
import { useChildProfile } from '@/hooks/useChildProfile';

const AddChild = () => {
  const navigate = useNavigate();
  const { 
    child, 
    setChild, 
    selectedInterests, 
    setSelectedInterests, 
    customInterest, 
    setCustomInterest, 
    loading, 
    isSaving, 
    handleSave, 
    isNewChild 
  } = useChildProfile();

  if (loading) {
    return (
      <AppLayoutWrapper>
        <div className="p-6 max-w-3xl mx-auto space-y-6">
          <div className="h-10 w-40 bg-muted rounded animate-pulse mb-4"></div>
          <div className="h-32 bg-muted rounded animate-pulse"></div>
          <div className="h-32 bg-muted rounded animate-pulse"></div>
        </div>
      </AppLayoutWrapper>
    );
  }

  return (
    <AppLayoutWrapper>
      <div className="p-6 max-w-3xl mx-auto animate-fade-in">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/parent-profile')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Profile
        </Button>
        
        <h1 className="text-2xl font-bold mb-6">
          Add a Child
        </h1>
        
        <div className="space-y-6">
          <ChildBasicInfoForm 
            child={child} 
            setChild={setChild} 
          />
          
          <ChildInterestsForm 
            selectedInterests={selectedInterests}
            setSelectedInterests={setSelectedInterests}
            customInterest={customInterest}
            setCustomInterest={setCustomInterest}
          />
          
          <div className="flex justify-end gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/parent-profile')}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isSaving || !child.name || !child.age}
              className="button-glow bg-primary hover:bg-primary/90 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Add Child"}
            </Button>
          </div>
        </div>
      </div>
    </AppLayoutWrapper>
  );
};

export default AddChild;

import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';
import ChildBasicInfoForm from '@/components/child/ChildBasicInfoForm';
import ChildInterestsForm from '@/components/child/ChildInterestsForm';
import { useChildProfile } from '@/hooks/useChildProfile';
import { toast } from '@/components/ui/use-toast';

const EditChild = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
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
  } = useChildProfile(id);

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/parent-profile');
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        <div className="h-10 w-40 bg-muted rounded animate-pulse mb-4"></div>
        <div className="h-32 bg-muted rounded animate-pulse"></div>
        <div className="h-32 bg-muted rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto animate-fade-in">
      <Button 
        variant="ghost" 
        onClick={handleBack}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back
      </Button>
      
      <h1 className="text-2xl font-bold mb-6">
        {isNewChild ? 'Add a Child' : `Edit ${child.name}'s Profile`}
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
            {isSaving ? "Saving..." : isNewChild ? "Add Child" : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditChild;

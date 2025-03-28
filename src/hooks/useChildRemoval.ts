
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

export const useChildRemoval = () => {
  const [isRemoving, setIsRemoving] = useState(false);
  const navigate = useNavigate();

  const removeChild = async (childId: string, childName: string) => {
    if (!childId) return;
    
    try {
      setIsRemoving(true);
      
      // First remove child interests
      const { error: interestsError } = await supabase
        .from('child_interests')
        .delete()
        .eq('child_id', childId);
      
      if (interestsError) throw interestsError;
      
      // Then remove the child
      const { error: childError } = await supabase
        .from('children')
        .delete()
        .eq('id', childId);
      
      if (childError) throw childError;
      
      toast({
        title: "Child removed",
        description: `${childName}'s profile has been removed`,
      });
      
      // Refresh the page to reflect changes
      window.location.reload();
    } catch (error: any) {
      console.error('Error removing child:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsRemoving(false);
    }
  };

  return {
    removeChild,
    isRemoving
  };
};

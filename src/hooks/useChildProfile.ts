
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { ChildProfile } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export const useChildProfile = (childId?: string) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isNewChild = !childId;
  
  const [child, setChild] = useState<Partial<ChildProfile>>({
    name: '',
    age: '',
    bio: '',
  });
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [customInterest, setCustomInterest] = useState('');
  const [loading, setLoading] = useState(!isNewChild);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchChild = async () => {
      if (isNewChild || !user) return;
      
      try {
        const { data, error } = await supabase
          .from('children')
          .select('*')
          .eq('id', childId)
          .eq('parent_id', user.id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setChild({
            id: data.id,
            name: data.name,
            age: data.age,
            bio: data.bio || '',
            parent_id: data.parent_id,
            created_at: data.created_at,
            updated_at: data.updated_at
          });
          
          // Fetch child interests
          const { data: interestsData, error: interestsError } = await supabase
            .from('child_interests')
            .select('interests(name)')
            .eq('child_id', childId);
          
          if (interestsError) throw interestsError;
          
          if (interestsData) {
            const interests = interestsData.map((item: any) => item.interests.name);
            setSelectedInterests(interests);
          }
        }
      } catch (error: any) {
        console.error('Error fetching child:', error);
        toast({
          title: "Error loading child",
          description: error.message,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchChild();
  }, [childId, user, isNewChild]);

  const handleSave = async () => {
    if (!user) return;
    
    // Validate inputs
    if (!child.name?.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a name for your child",
        variant: "destructive"
      });
      return;
    }
    
    if (!child.age) {
      toast({
        title: "Missing information",
        description: "Please select your child's age",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSaving(true);
      
      let childId = child.id;
      
      if (isNewChild) {
        // Create new child
        const { data, error } = await supabase
          .from('children')
          .insert({
            name: child.name.trim(),
            age: child.age,
            bio: child.bio?.trim() || null,
            parent_id: user.id
          })
          .select();
        
        if (error) throw error;
        childId = data?.[0]?.id;
      } else {
        // Update existing child
        const { error } = await supabase
          .from('children')
          .update({
            name: child.name.trim(),
            age: child.age,
            bio: child.bio?.trim() || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', childId)
          .eq('parent_id', user.id);
        
        if (error) throw error;
      }
      
      // Handle interests
      if (childId) {
        // First remove existing interests
        if (!isNewChild) {
          await supabase
            .from('child_interests')
            .delete()
            .eq('child_id', childId);
        }
        
        // Insert new interests
        if (selectedInterests.length > 0) {
          // First, ensure all interests exist in the interests table
          for (const interest of selectedInterests) {
            // Check if interest exists
            const { data: existingInterest } = await supabase
              .from('interests')
              .select('id')
              .eq('name', interest)
              .single();
            
            let interestId = existingInterest?.id;
            
            // If interest doesn't exist, create it
            if (!interestId) {
              const { data: newInterest, error: createError } = await supabase
                .from('interests')
                .insert({ name: interest })
                .select()
                .single();
              
              if (createError) throw createError;
              interestId = newInterest.id;
            }
            
            // Now link child to interest
            const { error: linkError } = await supabase
              .from('child_interests')
              .insert({
                child_id: childId,
                interest_id: interestId
              });
            
            if (linkError) throw linkError;
          }
        }
      }
      
      toast({
        title: isNewChild ? "Child added" : "Child updated",
        description: isNewChild 
          ? `${child.name} has been added to your profile` 
          : `${child.name}'s profile has been updated`,
      });
      
      // Redirect back to parent profile
      navigate('/parent-profile');
    } catch (error: any) {
      console.error('Error saving child:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
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
  };
};

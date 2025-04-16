
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PlaydateFormValues } from './PlaydateFormFields';

interface UsePlaydateSubmitProps {
  userId: string;
  latitude: number | null;
  longitude: number | null;
}

export const usePlaydateSubmit = ({ userId, latitude, longitude }: UsePlaydateSubmitProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (values: PlaydateFormValues) => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a playdate.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Convert form values to proper datetime format
      const startDateTime = new Date(values.date);
      const [startHour, startMinute] = values.startTime.split(':').map(Number);
      startDateTime.setHours(startHour, startMinute);
      
      const endDateTime = new Date(values.date);
      const [endHour, endMinute] = values.endTime.split(':').map(Number);
      endDateTime.setHours(endHour, endMinute);
      
      // Prepare data for insertion, including coordinates if available
      const playdateData = {
        title: values.title,
        description: values.description,
        location: values.location,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        max_participants: values.maxParticipants,
        creator_id: userId,
        status: 'upcoming', // Using 'upcoming' which is an allowed value in the constraint
      };
      
      // Add coordinates if available, or use default coordinates for Toronto if location provided but no coordinates
      if (latitude !== null && longitude !== null) {
        Object.assign(playdateData, {
          latitude,
          longitude
        });
      } else if (values.location) {
        // Use default coordinates for Toronto if no specific coordinates provided
        Object.assign(playdateData, {
          latitude: 43.6532,
          longitude: -79.3832
        });
        console.log("Using default Toronto coordinates for playdate");
      }
      
      const { data, error } = await supabase
        .from('playdates')
        .insert(playdateData)
        .select();
      
      if (error) throw error;
      
      console.log("Created playdate:", data);
      
      toast({
        title: "Playdate created!",
        description: "Your playdate has been successfully created.",
      });
      
      // Redirect to playdates page
      navigate('/playdates');
    } catch (error: any) {
      console.error('Error creating playdate:', error);
      toast({
        title: "Failed to create playdate",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    isSubmitting,
    handleSubmit,
  };
};


import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export function useUpdatePlaydate(playdateId: string | undefined) {
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdatePlaydate = async (
    values: any, 
    playdateData: any,
    refreshData: () => Promise<void>
  ) => {
    if (!user || !playdateId || user.id !== playdateData?.creator_id) {
      toast({
        title: 'Unauthorized',
        description: 'You can only edit playdates you created.',
        variant: 'destructive',
      });
      return;
    }

    setIsUpdating(true);
    try {
      const startDateTime = new Date(`${values.startDate}T${values.startTime}`);
      const endDateTime = new Date(`${values.startDate}T${values.endTime}`);

      if (endDateTime <= startDateTime) {
        toast({
          title: 'Invalid time range',
          description: 'End time must be after start time.',
          variant: 'destructive',
        });
        setIsUpdating(false);
        return;
      }

      const { error } = await supabase
        .from('playdates')
        .update({
          title: values.title,
          description: values.description,
          location: values.location,
          start_time: startDateTime.toISOString(),
          end_time: endDateTime.toISOString(),
          max_participants: values.maxParticipants ? parseInt(values.maxParticipants) : null
        })
        .eq('id', playdateId);

      if (error) throw error;

      await refreshData();

      toast({
        title: 'Success',
        description: 'Playdate updated successfully!',
      });
    } catch (err: any) {
      console.error('Failed to update playdate:', err);
      toast({
        title: 'Update failed',
        description: err.message || 'Could not update playdate.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return { isUpdating, handleUpdatePlaydate };
}

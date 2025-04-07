
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const usePlaydateActions = (playdateId: string | undefined, refreshData: () => Promise<void>) => {
  const { user } = useAuth();
  const [isJoining, setIsJoining] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleJoinPlaydate = async (selectedChildIds: string[]) => {
    if (!user || selectedChildIds.length === 0 || !playdateId) {
      toast({
        title: 'Error',
        description: 'Select at least one child to join.',
        variant: 'destructive',
      });
      return;
    }

    setIsJoining(true);
    try {
      const primaryChildId = selectedChildIds[0];

      const { error } = await supabase.from('playdate_participants').insert({
        playdate_id: playdateId,
        child_id: primaryChildId,
        child_ids: selectedChildIds,
        parent_id: user.id,
        status: 'pending'
      });
      
      if (error) throw error;

      toast({ title: 'Success', description: 'You have joined the playdate!' });
      
      // Immediately refresh the data to show the updated participants
      await refreshData();

    } catch (err: any) {
      console.error('Error joining playdate:', err);
      toast({
        title: 'Failed',
        description: err.message || 'Could not join playdate.',
        variant: 'destructive',
      });
    } finally {
      setIsJoining(false);
    }
  };

  const handleUpdatePlaydate = async (values: any, playdateData: any) => {
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

      // Immediately refresh the data to show the updated playdate
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

  const handlePlaydateCanceled = async () => {
    // Immediately refresh the data to show the canceled status
    await refreshData();
  };

  return {
    isJoining,
    isUpdating, 
    isProcessing,
    setIsProcessing,
    handleJoinPlaydate,
    handleUpdatePlaydate,
    handlePlaydateCanceled
  };
};

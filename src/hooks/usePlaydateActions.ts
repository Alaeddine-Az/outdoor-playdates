
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const usePlaydateActions = (
  playdateId: string | undefined,
  refreshData: () => Promise<void>
) => {
  const { user } = useAuth();
  const [isJoining, setIsJoining] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRemoving, setIsRemoving] = useState<string[]>([]);

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
        parent_id: user.id
      });

      if (error) throw error;

      toast({ title: 'Success', description: 'You have joined the playdate!' });

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

const handleRemoveParticipant = async (participantId: string, childIdToRemove: string) => {
  if (!user || !participantId || !childIdToRemove) return;

  console.log("🔍 Trying to remove child from participant row:", { participantId, childIdToRemove });
  setIsRemoving(prev => [...prev, participantId]);

  try {
    // Fetch the current participant row
    const { data: rows, error: fetchError } = await supabase
      .from('playdate_participants')
      .select('child_ids')
      .eq('id', participantId)
      .single();

    if (fetchError || !rows) {
      throw new Error("Could not fetch participant data.");
    }

    const currentChildIds = rows.child_ids || [];

    const updatedChildIds = currentChildIds.filter((id: string) => id !== childIdToRemove);

    if (updatedChildIds.length === 0) {
      // No more children left – delete the whole row
      const { error: deleteError } = await supabase
        .from('playdate_participants')
        .delete()
        .eq('id', participantId);

      if (deleteError) throw deleteError;

      console.log("✅ Deleted participant row because no more children remained.");
    } else {
      // Update the row with remaining children
      const { error: updateError } = await supabase
        .from('playdate_participants')
        .update({ child_ids: updatedChildIds })
        .eq('id', participantId);

      if (updateError) throw updateError;

      console.log("✅ Updated participant row with fewer children:", updatedChildIds);
    }

    await refreshData();

    toast({
      title: 'Success',
      description: 'Child removed from playdate successfully!',
    });

  } catch (err: any) {
    console.error('❌ Error removing child from playdate:', err);
    toast({
      title: 'Failed',
      description: err.message || 'Could not remove child from playdate.',
      variant: 'destructive',
    });
  } finally {
    setIsRemoving(prev => prev.filter(id => id !== participantId));
  }
};

  const handlePlaydateCanceled = async () => {
    await refreshData();
  };

  return {
    isJoining,
    isUpdating,
    isProcessing,
    isRemoving,
    setIsProcessing,
    handleJoinPlaydate,
    handleUpdatePlaydate,
    handlePlaydateCanceled,
    handleRemoveParticipant
  };
};

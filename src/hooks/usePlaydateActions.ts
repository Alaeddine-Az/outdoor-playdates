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
      const { data: existingParticipation, error: checkError } = await supabase
        .from('playdate_participants')
        .select('id, child_ids')
        .eq('playdate_id', playdateId)
        .eq('parent_id', user.id)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') throw checkError;

      if (existingParticipation) {
        const updatedChildIds = [
          ...new Set([
            ...(existingParticipation.child_ids || []),
            ...selectedChildIds
          ])
        ];

        const { error: updateError } = await supabase
          .from('playdate_participants')
          .update({
            child_ids: updatedChildIds,
            child_id: selectedChildIds[0]
          })
          .eq('id', existingParticipation.id);

        if (updateError) throw updateError;
      } else {
        const { error } = await supabase.from('playdate_participants').insert({
          playdate_id: playdateId,
          child_id: selectedChildIds[0],
          child_ids: selectedChildIds,
          parent_id: user.id
        });

        if (error) throw error;
      }

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
      const { data: row, error: fetchError } = await supabase
        .from('playdate_participants')
        .select('child_ids, parent_id, playdate_id')
        .eq('id', participantId)
        .single();

      if (fetchError) throw fetchError;

      const { data: playdateData, error: playdateError } = await supabase
        .from('playdates')
        .select('creator_id')
        .eq('id', row.playdate_id)
        .single();
      
      if (playdateError) throw playdateError;
      
      const isCreator = user.id === playdateData.creator_id;

      if (row.parent_id !== user.id && !isCreator) {
        throw new Error("You can only remove your own children from the playdate.");
      }

      const currentChildIds = row.child_ids || [];

      if (!currentChildIds.includes(childIdToRemove)) {
        throw new Error("Child not found in this playdate.");
      }

      const updatedChildIds = currentChildIds.filter(id => id !== childIdToRemove);

      if (updatedChildIds.length === 0) {
        const { error: deleteError } = await supabase
          .from('playdate_participants')
          .delete()
          .eq('id', participantId);

        if (deleteError) throw deleteError;

        console.log("✅ Deleted participant row because no more children remained.");
      } else {
        const { error: updateError } = await supabase
          .from('playdate_participants')
          .update({ 
            child_ids: updatedChildIds,
            child_id: updatedChildIds[0]
          })
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
    if (!user || !playdateId) return;

    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('playdates')
        .update({ status: 'cancelled' }) // ✅ Must match DB constraint
        .eq('id', playdateId)
        .eq('creator_id', user.id);

      if (error) throw error;

      toast({
        title: 'Cancelled',
        description: 'Playdate was successfully cancelled.',
      });

      await refreshData();
    } catch (err: any) {
      console.error('Error cancelling playdate:', err);
      toast({
        title: 'Failed',
        description: err.message || 'Could not cancel playdate.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
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

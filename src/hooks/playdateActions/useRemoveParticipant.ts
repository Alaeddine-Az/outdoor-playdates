
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export function useRemoveParticipant(playdateId: string | undefined) {
  const { user } = useAuth();
  const [isRemoving, setIsRemoving] = useState<string[]>([]);

  const handleRemoveParticipant = async (
    participantId: string,
    childIdToRemove: string,
    refreshData: () => Promise<void>
  ) => {
    if (!user || !participantId || !childIdToRemove) return;

    setIsRemoving(prev => [...prev, participantId]);

    try {
      // Fetch the current participant row
      const { data: row, error: fetchError } = await supabase
        .from('playdate_participants')
        .select('child_ids, parent_id, playdate_id, child_id')
        .eq('id', participantId)
        .single();

      if (fetchError) throw fetchError;

      // Get the playdate to check if user is creator
      const { data: playdateData, error: playdateError } = await supabase
        .from('playdates')
        .select('creator_id')
        .eq('id', row.playdate_id)
        .single();

      if (playdateError) throw playdateError;

      const isCreator = user.id === playdateData.creator_id;

      // Only allow parents to remove their own children or creators to remove any child
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
      } else {
        const newPrimaryChildId = childIdToRemove === row.child_id
          ? updatedChildIds[0]
          : row.child_id;

        const { error: updateError } = await supabase
          .from('playdate_participants')
          .update({
            child_ids: updatedChildIds,
            child_id: newPrimaryChildId
          })
          .eq('id', participantId);

        if (updateError) throw updateError;
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

  return { isRemoving, handleRemoveParticipant };
}

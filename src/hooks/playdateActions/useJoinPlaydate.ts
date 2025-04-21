
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export function useJoinPlaydate(playdateId: string | undefined) {
  const { user } = useAuth();
  const [isJoining, setIsJoining] = useState(false);

  const handleJoinPlaydate = async (
    selectedChildIds: string[],
    refreshData: () => Promise<void>
  ) => {
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
      // Check if the parent already has any children in this playdate
      const { data: existingParticipation, error: checkError } = await supabase
        .from('playdate_participants')
        .select('id, child_ids')
        .eq('playdate_id', playdateId)
        .eq('parent_id', user.id)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') throw checkError;

      if (existingParticipation) {
        // Update existing participation with additional children
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
        // Create new participation
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

  return { isJoining, handleJoinPlaydate };
}


import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { PlaydateParticipant, ChildProfile } from '@/types';

export function usePlaydateParticipants(id: string | undefined) {
  const [participants, setParticipants] = useState<PlaydateParticipant[]>([]);
  const [participantDetails, setParticipantDetails] = useState<{
    [key: string]: { parent: any; child: ChildProfile; participantId?: string }
  }>({});
  const [isLoading, setIsLoading] = useState(true);

  const loadParticipants = useCallback(async () => {
    try {
      if (!id) return;
      setIsLoading(true);

      const { data: rawParticipants } = await supabase
        .from('playdate_participants')
        .select('*')
        .eq('playdate_id', id);
      
      console.log("📋 Raw participants data:", rawParticipants);
      
      if (!rawParticipants) {
        setParticipants([]);
        setParticipantDetails({});
        return;
      }

      const normalized = rawParticipants.map(p => ({
        ...p,
        child_ids: p.child_ids?.length ? p.child_ids : [p.child_id]
      }));
      setParticipants(normalized);

      const allChildIds = normalized.flatMap(p => p.child_ids).filter(Boolean);
      const uniqueChildIds = [...new Set(allChildIds)];

      console.log("🧒 All child IDs:", allChildIds);
      console.log("🧒 Unique child IDs:", uniqueChildIds);

      if (uniqueChildIds.length > 0) {
        const { data: allChildren } = await supabase
          .from('children')
          .select('*')
          .in('id', uniqueChildIds);

        const parentIds = (allChildren || []).map(c => c.parent_id).filter(Boolean);
        const uniqueParentIds = [...new Set(parentIds)];

        const { data: allParents } = await supabase
          .from('profiles')
          .select('*')
          .in('id', uniqueParentIds);

        const parentMap = Object.fromEntries(
          (allParents || []).map(p => [p.id, p])
        );

        const childMap = Object.fromEntries(
          (allChildren || []).map(c => [c.id, c])
        );

        const detailsObj: {
          [key: string]: { parent: any; child: ChildProfile; participantId?: string };
        } = {};

        for (const p of normalized) {
          for (const childId of p.child_ids) {
            const child = childMap[childId];
            if (child) {
              const parent = parentMap[child.parent_id];
              detailsObj[`${p.id}_${childId}`] = {
                child,
                parent,
                participantId: p.id
              };
            }
          }
        }

        console.log("🏗️ Built participant details:", detailsObj);
        setParticipantDetails(detailsObj);
      } else {
        setParticipantDetails({});
      }
    } catch (err: any) {
      console.error('Failed to load participants:', err);
      toast({
        title: 'Error',
        description: err.message || 'Could not load participants',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  return {
    participants,
    participantDetails,
    isLoading,
    loadParticipants
  };
}


import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ChildProfile, PlaydateParticipant } from '@/types';
import { useForm } from 'react-hook-form';

export interface PlaydateDetailData {
  playdate: any;
  creator: any;
  participants: PlaydateParticipant[];
  participantDetails: {
    [key: string]: { 
      parent: any; 
      child: ChildProfile; 
      participantId?: string 
    };
  };
  userChildren: any[];
  isCreator: boolean;
  isCanceled: boolean;
  isCompleted: boolean;
  isLoading: boolean;
  form: any;
}

export const usePlaydateDetail = (id: string | undefined) => {
  const { user } = useAuth();
  const [playdate, setPlaydate] = useState<any>(null);
  const [creator, setCreator] = useState<any>(null);
  const [participants, setParticipants] = useState<PlaydateParticipant[]>([]);
  const [participantDetails, setParticipantDetails] = useState<{
    [key: string]: { parent: any; child: ChildProfile; participantId?: string }
  }>({});
  const [userChildren, setUserChildren] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      location: '',
      startDate: '',
      startTime: '',
      endTime: '',
      maxParticipants: ''
    }
  });

  const loadPlaydateData = useCallback(async () => {
    try {
      if (!id) return;
      setIsLoading(true);

      console.log("🔄 Loading playdate data for ID:", id);

      const { data: playdateData, error: playdateError } = await supabase
        .from('playdates')
        .select('*')
        .eq('id', id)
        .single();
      if (playdateError) throw playdateError;
      setPlaydate(playdateData);

      const { data: creatorData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', playdateData.creator_id)
        .single();
      setCreator(creatorData);

      const { data: rawParticipants } = await supabase
        .from('playdate_participants')
        .select('*')
        .eq('playdate_id', id);

      console.log("📋 Raw participants data:", rawParticipants);
      
      if (!rawParticipants) {
        setParticipants([]);
        setParticipantDetails({});
      } else {
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
      }

      if (user) {
        const { data: childrenData } = await supabase
          .from('children')
          .select('*')
          .eq('parent_id', user.id);
        setUserChildren(childrenData || []);
      }

      if (playdateData) {
        const startDate = new Date(playdateData.start_time);
        const endDate = new Date(playdateData.end_time);

        form.reset({
          title: playdateData.title,
          description: playdateData.description || '',
          location: playdateData.location,
          startDate: format(startDate, 'yyyy-MM-dd'),
          startTime: format(startDate, 'HH:mm'),
          endTime: format(endDate, 'HH:mm'),
          maxParticipants: playdateData.max_participants?.toString() || ''
        });
      }

      console.log("✅ Playdate data loaded successfully");
    } catch (err) {
      console.error('Failed to load playdate data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [id, user, form]);

  // Trigger initial load
  useEffect(() => {
    loadPlaydateData();
  }, [loadPlaydateData, id, user, refreshTrigger]);

  // Function to force a refresh by incrementing the trigger
  const forceRefresh = useCallback(() => {
    console.log("🔃 Forcing playdate data refresh");
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // Enhanced loadPlaydateData that also triggers a refresh
  const refreshData = useCallback(async () => {
    await loadPlaydateData();
    forceRefresh();
  }, [loadPlaydateData, forceRefresh]);

  const isCreator = user && playdate?.creator_id === user.id;
  const isCanceled = playdate?.status === 'canceled';
  const isCompleted = playdate ? new Date(playdate.end_time) < new Date() : false;

  return {
    playdate,
    creator,
    participants,
    participantDetails,
    userChildren,
    isCreator,
    isCanceled,
    isCompleted,
    isLoading,
    form,
    setPlaydate,
    loadPlaydateData: refreshData
  };
};

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { ChildProfile, PlaydateParticipant } from '@/types';
import { useForm } from 'react-hook-form';

// Import refactored components
import { PlaydateHost } from '@/components/playdates/detail/PlaydateHost';
import { PlaydateInfo } from '@/components/playdates/detail/PlaydateInfo';
import { PlaydateParticipants } from '@/components/playdates/detail/PlaydateParticipants';
import { PlaydateJoin } from '@/components/playdates/detail/PlaydateJoin';
import { PlaydateSchedule } from '@/components/playdates/detail/PlaydateSchedule';
import { PlaydateEdit } from '@/components/playdates/detail/PlaydateEdit';
import { PlaydateCancel } from '@/components/playdates/detail/PlaydateCancel';

const PlaydateDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [playdate, setPlaydate] = useState<any>(null);
  const [creator, setCreator] = useState<any>(null);
  const [participants, setParticipants] = useState<PlaydateParticipant[]>([]);
  const [participantDetails, setParticipantDetails] = useState<{
    [key: string]: { parent: any; child: ChildProfile; status?: string }
  }>({});
  const [userChildren, setUserChildren] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

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

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (!id) return;

        // Fetch playdate
        const { data: playdateData, error: playdateError } = await supabase
          .from('playdates')
          .select('*')
          .eq('id', id)
          .single();
        if (playdateError) throw playdateError;
        setPlaydate(playdateData);

        // Fetch creator profile
        const { data: creatorData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', playdateData.creator_id)
          .single();
        setCreator(creatorData);

        // Fetch participants
        const { data: rawParticipants } = await supabase
          .from('playdate_participants')
          .select('*')
          .eq('playdate_id', id);
        if (!rawParticipants) return;

        const normalized = rawParticipants.map(p => ({
          ...p,
          child_ids: p.child_ids?.length ? p.child_ids : [p.child_id]
        }));
        setParticipants(normalized);

        // Fetch child & parent data for all child_ids
        const allChildIds = normalized.flatMap(p => p.child_ids).filter(Boolean);
        const uniqueChildIds = [...new Set(allChildIds)];

        const { data: allChildren } = await supabase
          .from('children')
          .select('*')
          .in('id', uniqueChildIds);

        const parentIds = allChildren?.map(c => c.parent_id).filter(Boolean);
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
          [key: string]: { parent: any; child: ChildProfile; status?: string };
        } = {};

        for (const p of normalized) {
          for (const childId of p.child_ids) {
            const child = childMap[childId];
            if (child) {
              const parent = parentMap[child.parent_id];
              detailsObj[`${p.id}_${childId}`] = { 
                child, 
                parent, 
                status: p.status || 'pending' 
              };
            }
          }
        }

        setParticipantDetails(detailsObj);

        // Fetch current user's children
        if (user) {
          const { data: childrenData } = await supabase
            .from('children')
            .select('*')
            .eq('parent_id', user.id);
          setUserChildren(childrenData || []);
        }

        // Set form default values for editing
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
      } catch (err) {
        console.error('Failed to load playdate data:', err);
        toast({
          title: 'Error loading data',
          description: 'Could not load playdate or participants.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [id, user, form]);

  const handleJoinPlaydate = async (selectedChildIds: string[]) => {
    if (!user || selectedChildIds.length === 0 || !id) {
      toast({
        title: 'Error',
        description: 'Select at least one child to join.',
        variant: 'destructive',
      });
      return;
    }

    setIsJoining(true);
    try {
      // Get the first child ID to use as the primary child_id (required by the schema)
      const primaryChildId = selectedChildIds[0];
      
      await supabase.from('playdate_participants').insert({
        playdate_id: id,
        child_id: primaryChildId, // Add the required child_id field
        child_ids: selectedChildIds,
        parent_id: user.id,
        status: 'pending'
      });

      toast({ title: 'Success', description: 'You have joined the playdate!' });
      
      // Refresh the participants list after joining
      const { data: rawParticipants } = await supabase
        .from('playdate_participants')
        .select('*')
        .eq('playdate_id', id);
        
      if (rawParticipants) {
        const normalized = rawParticipants.map(p => ({
          ...p,
          child_ids: p.child_ids?.length ? p.child_ids : [p.child_id]
        }));
        setParticipants(normalized);
      }
      
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

  const handleUpdatePlaydate = async (values: any) => {
    if (!user || !id || user.id !== playdate?.creator_id) {
      toast({
        title: 'Unauthorized',
        description: 'You can only edit playdates you created.',
        variant: 'destructive',
      });
      return;
    }

    setIsUpdating(true);
    try {
      // Format date and time fields into ISO strings
      const startDateTime = new Date(`${values.startDate}T${values.startTime}`);
      const endDateTime = new Date(`${values.startDate}T${values.endTime}`);

      // Validate end time is after start time
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
        .eq('id', id);

      if (error) throw error;

      // Update the local state
      setPlaydate({
        ...playdate,
        title: values.title,
        description: values.description,
        location: values.location,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        max_participants: values.maxParticipants ? parseInt(values.maxParticipants) : null
      });

      setIsEditDialogOpen(false);
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
    // Refresh the playdate data after cancellation
    if (!id) return;
    
    try {
      const { data: updatedPlaydate } = await supabase
        .from('playdates')
        .select('*')
        .eq('id', id)
        .single();
        
      if (updatedPlaydate) {
        setPlaydate(updatedPlaydate);
      } else {
        // If somehow the playdate was deleted, navigate back to playdates
        navigate('/playdates');
      }
    } catch (err) {
      console.error('Error refreshing playdate data:', err);
    }
  };

  if (isLoading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  if (!playdate) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-bold">Playdate Not Found</h2>
        <Button onClick={() => navigate('/playdates')}>Go Back</Button>
      </div>
    );
  }

  // Check if the current user is the creator of the playdate
  const isCreator = user && playdate.creator_id === user.id;
  const isCanceled = playdate.status === 'canceled';

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="ghost" onClick={() => navigate('/playdates')}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Playdates
      </Button>

      {isCanceled && (
        <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-md border border-red-200">
          This playdate has been canceled by the host.
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6 mt-6">
        {/* LEFT COLUMN */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>{playdate.title}</CardTitle>
              {isCreator && !isCanceled && (
                <div className="flex gap-2">
                  <PlaydateEdit 
                    playdate={playdate}
                    isUpdating={isUpdating}
                    isEditDialogOpen={isEditDialogOpen}
                    setIsEditDialogOpen={setIsEditDialogOpen}
                    onUpdate={handleUpdatePlaydate}
                    form={form}
                  />
                  <PlaydateCancel
                    playdateId={id || ''}
                    onCanceled={handlePlaydateCanceled}
                    isProcessing={isProcessing}
                    setIsProcessing={setIsProcessing}
                  />
                </div>
              )}
            </CardHeader>
            <CardContent>
              <PlaydateHost creator={creator} />
              <PlaydateInfo playdate={playdate} />
            </CardContent>
          </Card>

          {/* PARTICIPANTS */}
          <PlaydateParticipants participantDetails={participantDetails} />
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {!isCanceled && (
            <PlaydateJoin 
              userChildren={userChildren}
              isJoining={isJoining}
              onJoin={handleJoinPlaydate}
            />
          )}

          <PlaydateSchedule 
            playdate={playdate}
            participantsCount={participants.length}
          />
        </div>
      </div>
    </div>
  );
};

export default PlaydateDetail;


import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { CalendarClock, MapPin, Users, Clock, ArrowLeft, User } from 'lucide-react';
import { format } from 'date-fns';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ChildProfile, PlaydateParticipant } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';

const PlaydateDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [playdate, setPlaydate] = useState<any>(null);
  const [creator, setCreator] = useState<any>(null);
  const [participants, setParticipants] = useState<PlaydateParticipant[]>([]);
  const [participantDetails, setParticipantDetails] = useState<{
    [key: string]: { parent: any; child: ChildProfile | null }
  }>({});
  const [userChildren, setUserChildren] = useState<any[]>([]);
  const [selectedChildIds, setSelectedChildIds] = useState<string[]>([]); // Updated to array for multiple selection
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);

  // Check if user is already a participant with any of their children
  const userParticipation = participants.find(p => 
    p.child_ids?.some(childId => selectedChildIds.includes(childId))
  );
  const isParticipant = !!userParticipation;

  useEffect(() => {
    const fetchPlaydateDetails = async () => {
      try {
        if (!id) return;

        // Fetch playdate details
        const { data: playdateData, error: playdateError } = await supabase
          .from('playdates')
          .select('*')
          .eq('id', id)
          .single();

        if (playdateError) throw playdateError;
        setPlaydate(playdateData);

        // Fetch creator profile
        if (playdateData.creator_id) {
          const { data: creatorData, error: creatorError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', playdateData.creator_id)
            .single();

          if (!creatorError) {
            setCreator(creatorData);
          }
        }

        // Fetch participants
        const { data: participantsData, error: participantsError } = await supabase
          .from('playdate_participants')
          .select('*')
          .eq('playdate_id', id);

        if (participantsError) throw participantsError;
        setParticipants(participantsData || []);

        // Fetch detailed information for each participant
        if (participantsData && participantsData.length > 0) {
          const participantDetailsObj: { [key: string]: { parent: any; child: ChildProfile | null } } = {};
          
          for (const participant of participantsData) {
            // For each child in the participant's child_ids array
            if (participant.child_ids && participant.child_ids.length > 0) {
              for (const childId of participant.child_ids) {
                // Fetch child details
                const { data: childData, error: childError } = await supabase
                  .from('children')
                  .select('*')
                  .eq('id', childId)
                  .single();
                
                if (!childError && childData) {
                  // Fetch parent details using parent_id from child
                  const { data: parentData, error: parentError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', childData.parent_id)
                    .single();
                  
                  if (!parentError && parentData) {
                    // Create a unique key combining participant ID and child ID
                    const detailKey = `${participant.id}_${childId}`;
                    participantDetailsObj[detailKey] = {
                      parent: parentData,
                      child: childData
                    };
                  }
                }
              }
            }
          }
          
          setParticipantDetails(participantDetailsObj);
        }

        // Fetch user's children if logged in
        if (user) {
          const { data: childrenData, error: childrenError } = await supabase
            .from('children')
            .select('*')
            .eq('parent_id', user.id);

          if (!childrenError && childrenData) {
            setUserChildren(childrenData);
          }
        }
      } catch (error) {
        console.error('Error fetching playdate details:', error);
        toast({
          title: 'Error',
          description: 'Failed to load playdate details.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaydateDetails();
  }, [id, user]);

  const handleChildSelection = (childId: string) => {
    setSelectedChildIds(prev => {
      if (prev.includes(childId)) {
        return prev.filter(id => id !== childId);
      } else {
        return [...prev, childId];
      }
    });
  };

  const handleJoinPlaydate = async () => {
    if (!user || selectedChildIds.length === 0 || !id) {
      toast({
        title: 'Error',
        description: 'Please select at least one child to join this playdate.',
        variant: 'destructive',
      });
      return;
    }

    setIsJoining(true);
    try {
      // Insert participant record with multiple children
      const { error } = await supabase
        .from('playdate_participants')
        .insert({
          playdate_id: id,
          child_ids: selectedChildIds,
          parent_id: user.id,
          status: 'pending'
        });

      if (error) throw error;

      // Refetch participants
      const { data: updatedParticipants, error: fetchError } = await supabase
        .from('playdate_participants')
        .select('*')
        .eq('playdate_id', id);

      if (fetchError) throw fetchError;
      setParticipants(updatedParticipants || []);

      toast({
        title: 'Success',
        description: 'You have joined the playdate!',
      });
    } catch (error: any) {
      console.error('Error joining playdate:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to join playdate.',
        variant: 'destructive',
      });
    } finally {
      setIsJoining(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!playdate) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Playdate Not Found</h2>
        <p className="text-muted-foreground mb-6">The playdate you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/playdates')}>
          View All Playdates
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/playdates')}
        className="mb-6 flex items-center"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Playdates
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{playdate.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-2">
                <CalendarClock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">
                    {format(new Date(playdate.start_time), 'EEEE, MMMM d, yyyy')}
                  </p>
                  <p className="text-muted-foreground">
                    {format(new Date(playdate.start_time), 'h:mm a')} - 
                    {format(new Date(playdate.end_time), 'h:mm a')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">{playdate.location}</p>
                </div>
              </div>

              {playdate.description && (
                <div className="pt-2">
                  <h3 className="text-lg font-medium mb-2">About this Playdate</h3>
                  <p className="text-muted-foreground">{playdate.description}</p>
                </div>
              )}

              {creator && (
                <div className="pt-2">
                  <h3 className="text-lg font-medium mb-2">Hosted by</h3>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {creator.parent_name?.[0] || 'H'}
                    </div>
                    <div>
                      <p className="font-medium">
                        <Link to={`/parent/${creator.id}`} className="hover:underline">
                          {creator.parent_name}
                        </Link>
                      </p>
                      <p className="text-sm text-muted-foreground">{creator.location}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Participants
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {participants.length > 0 ? (
                <ul className="space-y-3">
                  {Object.entries(participantDetails).map(([key, details]) => {
                    return (
                      <li key={key} className="flex items-start gap-3 p-3 rounded-lg border">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10">
                            {details?.child?.name?.[0] || 'C'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          {details ? (
                            <>
                              <div className="flex items-center gap-2">
                                <Link to={`/child/${details.child?.id}`} className="font-medium hover:text-primary">
                                  {details.child?.name}
                                </Link>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
                                  {details.child?.age} years
                                </span>
                                <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-muted">
                                  {key.split('_')[0] && participants.find(p => p.id === key.split('_')[0])?.status}
                                </span>
                              </div>
                              <div className="text-sm text-muted-foreground mt-1 flex items-center">
                                <User className="h-3 w-3 mr-1" />
                                <span>Parent: </span>
                                <Link to={`/parent/${details.parent?.id}`} className="ml-1 hover:underline">
                                  {details.parent?.parent_name}
                                </Link>
                              </div>
                            </>
                          ) : (
                            <span className="text-muted-foreground">Loading participant details...</span>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-muted-foreground">No participants yet. Be the first to join!</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Join Playdate</CardTitle>
            </CardHeader>
            <CardContent>
              {user ? (
                <>
                  {userChildren.length > 0 ? (
                    <>
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Select children:</label>
                        <div className="space-y-2">
                          {userChildren.map(child => (
                            <div key={child.id} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`child-${child.id}`} 
                                checked={selectedChildIds.includes(child.id)} 
                                onCheckedChange={() => handleChildSelection(child.id)}
                              />
                              <label 
                                htmlFor={`child-${child.id}`} 
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {child.name} ({child.age})
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <Button
                        className="w-full"
                        disabled={isJoining || isParticipant || selectedChildIds.length === 0}
                        onClick={handleJoinPlaydate}
                      >
                        {isJoining ? 'Joining...' : isParticipant ? 'Already Joined' : 'Join Playdate'}
                      </Button>
                    </>
                  ) : (
                    <div className="text-center">
                      <p className="text-muted-foreground mb-3">You need to add a child profile first.</p>
                      <Button onClick={() => navigate('/add-child')}>
                        Add Child
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center">
                  <p className="text-muted-foreground mb-3">Sign in to join this playdate.</p>
                  <Button onClick={() => navigate('/auth')}>
                    Sign In
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  When
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="font-medium">Date</p>
                  <p className="text-muted-foreground">
                    {format(new Date(playdate.start_time), 'EEEE, MMMM d, yyyy')}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Time</p>
                  <p className="text-muted-foreground">
                    {format(new Date(playdate.start_time), 'h:mm a')} - 
                    {format(new Date(playdate.end_time), 'h:mm a')}
                  </p>
                </div>
                {playdate.max_participants && (
                  <div>
                    <p className="font-medium">Capacity</p>
                    <p className="text-muted-foreground">
                      {participants.length} / {playdate.max_participants} participants
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PlaydateDetail;

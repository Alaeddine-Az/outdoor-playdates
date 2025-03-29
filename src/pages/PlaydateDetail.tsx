
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, MapPin, Users, ArrowLeft, Check, Calendar as CalendarIcon } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { ParentProfile, ChildProfile } from '@/types';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface Playdate {
  id: string;
  title: string;
  description: string | null;
  location: string;
  start_time: string;
  end_time: string;
  max_participants: number | null;
  creator_id: string;
  created_at: string;
  updated_at: string;
}

interface PlaydateParticipant {
  id: string;
  playdate_id: string;
  parent_id: string;
  children_ids: string[];
  created_at: string;
  status: string;
}

const PlaydateDetailPage = () => {
  const { id: playdateId } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [playdate, setPlaydate] = useState<Playdate | null>(null);
  const [creator, setCreator] = useState<ParentProfile | null>(null);
  const [participants, setParticipants] = useState<PlaydateParticipant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [selectedChildren, setSelectedChildren] = useState<string[]>([]);
  const [userChildren, setUserChildren] = useState<ChildProfile[]>([]);
  const [isParticipant, setIsParticipant] = useState(false);
  
  useEffect(() => {
    const fetchPlaydateDetails = async () => {
      if (!playdateId || !user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Fetch playdate details
        const { data: playdateData, error: playdateError } = await supabase
          .from('playdates')
          .select('*')
          .eq('id', playdateId)
          .single();

        if (playdateError) throw playdateError;
        
        setPlaydate(playdateData);
        
        // Fetch creator details
        const { data: creatorData, error: creatorError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', playdateData.creator_id)
          .single();
          
        if (creatorError) throw creatorError;
        
        setCreator(creatorData);
        
        // Fetch participants
        const { data: participantsData, error: participantsError } = await supabase
          .from('playdate_participants')
          .select('*')
          .eq('playdate_id', playdateId);
          
        if (participantsError) throw participantsError;
        
        // Ensure participants have the correct structure
        const enrichedParticipants = participantsData?.map(p => ({
          ...p,
          parent_id: p.parent_id || '',
          children_ids: p.children_ids || []
        })) || [];
        
        setParticipants(enrichedParticipants);
        
        // Check if user is already a participant
        const isUserParticipant = enrichedParticipants?.some(
          (p) => p.parent_id === user.id
        );
        setIsParticipant(isUserParticipant || false);
        
        // Fetch user's children
        const { data: childrenData, error: childrenError } = await supabase
          .from('children')
          .select('*')
          .eq('parent_id', user.id);
          
        if (childrenError) throw childrenError;
        
        setUserChildren(childrenData || []);
      } catch (error) {
        console.error('Error fetching playdate details:', error);
        toast({
          title: 'Error',
          description: 'Failed to load playdate details',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaydateDetails();
  }, [playdateId, user]);

  const handleJoinPlaydate = async () => {
    if (!user || !playdate || selectedChildren.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select at least one child to join the playdate',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsJoining(true);
      
      const { data, error } = await supabase
        .from('playdate_participants')
        .insert({
          playdate_id: playdate.id,
          parent_id: user.id,
          children_ids: selectedChildren
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Update participants list with correctly structured participant
      const newParticipant: PlaydateParticipant = {
        ...data,
        parent_id: user.id,
        children_ids: selectedChildren
      };
      
      setParticipants([...participants, newParticipant]);
      setIsParticipant(true);
      
      toast({
        title: 'Success!',
        description: 'You have joined the playdate',
      });
    } catch (error) {
      console.error('Error joining playdate:', error);
      toast({
        title: 'Error',
        description: 'Failed to join the playdate',
        variant: 'destructive',
      });
    } finally {
      setIsJoining(false);
    }
  };

  const handleChildCheckboxChange = (childId: string) => {
    if (selectedChildren.includes(childId)) {
      setSelectedChildren(selectedChildren.filter(id => id !== childId));
    } else {
      setSelectedChildren([...selectedChildren, childId]);
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'h:mm a');
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="h-8 w-32 bg-muted animate-pulse rounded mb-4"></div>
        <div className="h-64 w-full bg-muted animate-pulse rounded mb-6"></div>
        <div className="h-32 w-full bg-muted animate-pulse rounded"></div>
      </div>
    );
  }

  if (!playdate || !creator) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">Playdate Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The playdate you're looking for could not be found or has been cancelled.
        </p>
        <Button onClick={() => navigate('/playdates')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Playdates
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={() => navigate('/playdates')}
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        
        {playdate.creator_id === user?.id && (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            You created this playdate
          </Badge>
        )}
      </div>

      <Card className="mb-8 overflow-hidden border-none shadow-md">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            {playdate.title}
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">
                  {formatDate(playdate.start_time)}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">
                  {formatTime(playdate.start_time)} - {formatTime(playdate.end_time)}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">{playdate.location}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">
                  {participants.length} {participants.length === 1 ? 'family' : 'families'} attending
                  {playdate.max_participants && ` (max ${playdate.max_participants})`}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col justify-between">
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Hosted by</h3>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage src="/placeholder.svg" alt={creator.parent_name} />
                    <AvatarFallback>
                      {creator.parent_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{creator.parent_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {creator.location && `${creator.location}`}
                    </p>
                  </div>
                </div>
              </div>
              
              {!isParticipant && playdate.creator_id !== user?.id && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full mt-4">
                      Join Playdate
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Join Playdate</DialogTitle>
                      <DialogDescription>
                        Select which children will attend the playdate
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <h4 className="text-sm font-medium mb-3">Your Children</h4>
                      {userChildren.length > 0 ? (
                        userChildren.map((child) => (
                          <div key={child.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={child.id}
                              checked={selectedChildren.includes(child.id)}
                              onCheckedChange={() => handleChildCheckboxChange(child.id)}
                            />
                            <Label htmlFor={child.id}>{child.name}</Label>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          You need to add children to your profile before joining a playdate
                        </p>
                      )}
                    </div>
                    
                    <DialogFooter>
                      <Button
                        type="submit"
                        disabled={selectedChildren.length === 0 || isJoining}
                        onClick={handleJoinPlaydate}
                      >
                        {isJoining ? 'Joining...' : 'Join Playdate'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
              
              {isParticipant && (
                <Badge className="self-start py-1.5 text-green-700 bg-green-50 hover:bg-green-100 border-green-200">
                  <Check className="h-4 w-4 mr-1" /> You're attending
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <CardContent>
          <div className="mt-2">
            <h3 className="font-medium mb-2">About this playdate</h3>
            <p className="text-muted-foreground whitespace-pre-line">
              {playdate.description || 'No description provided.'}
            </p>
          </div>
        </CardContent>
      </Card>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Attending Families</h2>
        {participants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {participants.map((participant) => (
              <Card key={participant.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border">
                      <AvatarImage src="/placeholder.svg" alt="Participant" />
                      <AvatarFallback>
                        {participant.parent_id === creator.id ? 'H' : 'P'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {participant.parent_id === creator.id
                          ? `${creator.parent_name} (Host)`
                          : participant.parent_id === user?.id
                          ? 'You'
                          : 'Participant'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {participant.children_ids?.length || 0}{' '}
                        {(participant.children_ids?.length || 0) === 1 ? 'child' : 'children'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No one has joined this playdate yet.</p>
        )}
      </div>
    </div>
  );
};

export default PlaydateDetailPage;

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AppLayoutWrapper from '@/components/AppLayoutWrapper';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, MapPin, Users, ArrowLeft, Check, Calendar as CalendarIcon } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { ParentProfile, ChildProfile, PlaydateParticipant } from '@/types';
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

// Helper type for enriched participant data
interface EnrichedParticipant extends PlaydateParticipant {
  parent_id: string; // This ensures parent_id is always available in the enriched data
}

const PlaydateDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [playdate, setPlaydate] = useState<Playdate | null>(null);
  const [creator, setCreator] = useState<ParentProfile | null>(null);
  const [participants, setParticipants] = useState<EnrichedParticipant[]>([]); // Using EnrichedParticipant
  const [participantProfiles, setParticipantProfiles] = useState<Record<string, ParentProfile>>({});
  const [participantChildren, setParticipantChildren] = useState<Record<string, ChildProfile[]>>({});
  const [userChildren, setUserChildren] = useState<ChildProfile[]>([]);
  const [selectedChildren, setSelectedChildren] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  
  useEffect(() => {
    if (!id || !user) return;
    
    const fetchPlaydate = async () => {
      try {
        // Get playdate details
        const { data: playdateData, error: playdateError } = await supabase
          .from('playdates')
          .select('*')
          .eq('id', id)
          .single();
        
        if (playdateError) throw playdateError;
        setPlaydate(playdateData);
        
        // Get creator profile
        if (playdateData) {
          const { data: creatorData, error: creatorError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', playdateData.creator_id)
            .single();
          
          if (creatorError) throw creatorError;
          setCreator(creatorData);
        }
        
        // Get participants
        const { data: participantsData, error: participantsError } = await supabase
          .from('playdate_participants')
          .select('*')
          .eq('playdate_id', id);
        
        if (participantsError) throw participantsError;
        
        if (participantsData) {
          // First, get all children to find their parents
          const childIds = participantsData.map(p => p.child_id);
          
          // Create a map to store child to parent relationships
          const childToParentMap: Record<string, string> = {};
          
          if (childIds.length > 0) {
            const { data: childrenData } = await supabase
              .from('children')
              .select('id, parent_id')
              .in('id', childIds);
              
            if (childrenData) {
              childrenData.forEach(child => {
                childToParentMap[child.id] = child.parent_id;
              });
            }
          }
          
          // Now enrich the participant data with parent information
          const enrichedParticipants: EnrichedParticipant[] = participantsData.map(participant => {
            // Explicitly cast the database result to include our optional parent_id
            const participantWithParentId = participant as PlaydateParticipant;
            
            // Try to get parent_id from the participant itself or from the child-parent map
            const parentId = participantWithParentId.parent_id || childToParentMap[participant.child_id];
            
            if (!parentId) {
              console.warn(`No parent found for child ${participant.child_id}`);
            }
            
            return {
              ...participantWithParentId,
              parent_id: parentId || 'unknown' // Ensure parent_id is always set
            } as EnrichedParticipant;
          });
          
          setParticipants(enrichedParticipants);
          
          // Check if user has already joined
          const userJoined = enrichedParticipants.some(p => 
            p.parent_id === user.id && p.status !== 'cancelled'
          );
          setHasJoined(userJoined);
          
          // Collect unique parent IDs from the enriched participants
          const parentIds = Array.from(new Set(
            enrichedParticipants
              .filter(p => p.parent_id && p.parent_id !== 'unknown')
              .map(p => p.parent_id)
          ));
          
          // Get participant profiles if we have parent IDs
          if (parentIds.length > 0) {
            const { data: profiles, error: profilesError } = await supabase
              .from('profiles')
              .select('*')
              .in('id', parentIds);
            
            if (profilesError) throw profilesError;
            
            const profileMap: Record<string, ParentProfile> = {};
            profiles?.forEach(profile => {
              profileMap[profile.id] = profile as ParentProfile;
            });
            setParticipantProfiles(profileMap);
            
            // Get children for each parent
            const childMap: Record<string, ChildProfile[]> = {};
            
            for (const parentId of parentIds) {
              const { data: children, error: childrenError } = await supabase
                .from('children')
                .select('*')
                .eq('parent_id', parentId);
              
              if (childrenError) throw childrenError;
              childMap[parentId] = children || [];
            }
            
            setParticipantChildren(childMap);
          }
        }
        
        // Get current user's children
        const { data: userChildrenData, error: userChildrenError } = await supabase
          .from('children')
          .select('*')
          .eq('parent_id', user.id);
        
        if (userChildrenError) throw userChildrenError;
        setUserChildren(userChildrenData || []);
        
        // Default all user's children as selected
        const childSelections: Record<string, boolean> = {};
        userChildrenData?.forEach(child => {
          childSelections[child.id] = true;
        });
        setSelectedChildren(childSelections);
      } catch (error: any) {
        console.error('Error fetching playdate details:', error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlaydate();
  }, [id, user]);
  
  const joinPlaydate = async () => {
    if (!user || !playdate) return;
    
    try {
      setJoining(true);
      
      // Get selected children
      const childrenToJoin = Object.entries(selectedChildren)
        .filter(([_, isSelected]) => isSelected)
        .map(([childId]) => childId);
      
      if (childrenToJoin.length === 0) {
        toast({
          title: "No children selected",
          description: "Please select at least one child to join the playdate",
          variant: "destructive"
        });
        return;
      }
      
      // Insert participants
      for (const childId of childrenToJoin) {
        const { error: participantError } = await supabase
          .from('playdate_participants')
          .insert({
            playdate_id: playdate.id,
            parent_id: user.id,
            child_id: childId,
            status: 'confirmed'
          });
        
        if (participantError) throw participantError;
      }
      
      toast({
        title: "Joined playdate",
        description: `You have successfully joined ${playdate.title}`,
      });
      
      setHasJoined(true);
      setIsOpen(false);
      
      // Refresh participants
      const { data: updatedParticipantsData } = await supabase
        .from('playdate_participants')
        .select('*')
        .eq('playdate_id', playdate.id);
      
      if (updatedParticipantsData) {
        // Create a map to store child to parent relationships
        const childToParentMap: Record<string, string> = {};
        
        // First, get all children to find their parents
        if (updatedParticipantsData.length > 0) {
          const childIds = updatedParticipantsData.map(p => p.child_id);
          
          const { data: childrenData } = await supabase
            .from('children')
            .select('id, parent_id')
            .in('id', childIds);
            
          if (childrenData) {
            childrenData.forEach(child => {
              childToParentMap[child.id] = child.parent_id;
            });
          }
        }
        
        // Now enrich the participant data with parent information
        const enrichedParticipants: EnrichedParticipant[] = updatedParticipantsData.map(participant => {
          // Explicitly cast the database result to include our optional parent_id
          const participantWithParentId = participant as PlaydateParticipant;
          
          // Try to get parent_id from the participant or from the child-parent map
          const parentId = participantWithParentId.parent_id || childToParentMap[participant.child_id];
          return {
            ...participantWithParentId,
            parent_id: parentId || 'unknown'
          } as EnrichedParticipant;
        });
        
        setParticipants(enrichedParticipants);
      }
    } catch (error: any) {
      console.error('Error joining playdate:', error);
      toast({
        title: "Error joining playdate",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setJoining(false);
    }
  };
  
  const leavePlaydate = async () => {
    if (!user || !playdate) return;
    
    try {
      setJoining(true);
      
      // Delete participation records
      const { error } = await supabase
        .from('playdate_participants')
        .delete()
        .match({ playdate_id: playdate.id, parent_id: user.id });
      
      if (error) throw error;
      
      toast({
        title: "Left playdate",
        description: `You have successfully left ${playdate.title}`,
      });
      
      setHasJoined(false);
      
      // Refresh participants
      const { data: updatedParticipantsData } = await supabase
        .from('playdate_participants')
        .select('*')
        .eq('playdate_id', playdate.id);
      
      if (updatedParticipantsData) {
        // Create a map to store child to parent relationships
        const childToParentMap: Record<string, string> = {};
        
        // First, get all children to find their parents
        if (updatedParticipantsData.length > 0) {
          const childIds = updatedParticipantsData.map(p => p.child_id);
          
          const { data: childrenData } = await supabase
            .from('children')
            .select('id, parent_id')
            .in('id', childIds);
            
          if (childrenData) {
            childrenData.forEach(child => {
              childToParentMap[child.id] = child.parent_id;
            });
          }
        }
        
        // Now enrich the participant data with parent information
        const enrichedParticipants: EnrichedParticipant[] = updatedParticipantsData.map(participant => {
          // Explicitly cast the database result to include our optional parent_id
          const participantWithParentId = participant as PlaydateParticipant;
          
          // Try to get parent_id from the participant or from the child-parent map
          const parentId = participantWithParentId.parent_id || childToParentMap[participant.child_id];
          return {
            ...participantWithParentId,
            parent_id: parentId || 'unknown'
          } as EnrichedParticipant;
        });
        
        setParticipants(enrichedParticipants);
      }
    } catch (error: any) {
      console.error('Error leaving playdate:', error);
      toast({
        title: "Error leaving playdate",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setJoining(false);
    }
  };
  
  if (loading) {
    return (
      <AppLayoutWrapper>
        <div className="p-6 max-w-4xl mx-auto">
          <div className="h-8 w-32 bg-muted animate-pulse rounded mb-4"></div>
          <div className="h-64 w-full bg-muted animate-pulse rounded mb-6"></div>
          <div className="h-32 w-full bg-muted animate-pulse rounded"></div>
        </div>
      </AppLayoutWrapper>
    );
  }
  
  if (!playdate || !creator) {
    return (
      <AppLayoutWrapper>
        <div className="p-6 max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Playdate Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The playdate you're looking for could not be found or has been cancelled.
          </p>
          <Button onClick={() => navigate('/playdates')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Playdates
          </Button>
        </div>
      </AppLayoutWrapper>
    );
  }
  
  const formattedDate = format(new Date(playdate.start_time), 'EEEE, MMMM d, yyyy');
  const startTime = format(new Date(playdate.start_time), 'h:mm a');
  const endTime = format(new Date(playdate.end_time), 'h:mm a');
  
  const uniqueFamilies = [...new Set(participants
    .map(p => p.parent_id)
    .filter(id => id !== undefined && id !== null) as string[]
  )];
  
  const numFamilies = uniqueFamilies.length;
  const numChildren = participants.length;
  
  const isCreator = user?.id === playdate.creator_id;
  
  return (
    <AppLayoutWrapper>
      <div className="p-6 max-w-4xl mx-auto animate-fade-in">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/playdates')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Playdates
        </Button>
        
        <div className="bg-white rounded-xl shadow-soft border border-muted overflow-hidden mb-6">
          <div className="p-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">{playdate.title}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-5 w-5 mr-2 text-primary" />
                  <span>{formattedDate}</span>
                </div>
                
                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-5 w-5 mr-2 text-primary" />
                  <span>{startTime} - {endTime}</span>
                </div>
                
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-5 w-5 mr-2 text-primary" />
                  <span>{playdate.location}</span>
                </div>
                
                <div className="flex items-center text-muted-foreground">
                  <Users className="h-5 w-5 mr-2 text-primary" />
                  <span>
                    {numFamilies} {numFamilies === 1 ? 'family' : 'families'} joined,&nbsp;
                    {numChildren} {numChildren === 1 ? 'child' : 'children'}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col md:items-end">
                <div className="flex items-center gap-3 mb-4">
                  <div className="mr-auto md:mr-0">
                    <div className="text-sm text-muted-foreground">Hosted by</div>
                    <Link 
                      to={`/parent/${creator.id}`}
                      className="font-medium hover:text-primary transition-colors flex items-center gap-2"
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={creator.avatar_url} alt={creator.parent_name} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {creator.parent_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {creator.parent_name}
                    </Link>
                  </div>
                </div>
                
                <div className="mt-auto pt-4 space-y-2 w-full md:text-right">
                  {isCreator ? (
                    <Badge variant="outline">You're hosting this playdate</Badge>
                  ) : hasJoined ? (
                    <div className="space-y-2">
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                        <Check className="h-3 w-3 mr-1" /> You're attending
                      </Badge>
                      <div className="flex justify-between md:justify-end gap-2">
                        <Button 
                          variant="outline" 
                          onClick={leavePlaydate}
                          className="text-sm"
                        >
                          Leave Playdate
                        </Button>
                        <Button 
                          asChild
                          className="text-sm button-glow bg-primary hover:bg-primary/90 text-white"
                        >
                          <a 
                            href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(playdate.title)}&dates=${new Date(playdate.start_time).toISOString().replace(/-|:|\.\d\d\d/g, "")}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <CalendarIcon className="h-4 w-4 mr-1" /> Add to Calendar
                          </a>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                      <DialogTrigger asChild>
                        <Button className="button-glow bg-primary hover:bg-primary/90 text-white">
                          <Users className="h-4 w-4 mr-2" /> Join Playdate
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Join {playdate.title}</DialogTitle>
                          <DialogDescription>
                            Select which of your children will attend this playdate
                          </DialogDescription>
                        </DialogHeader>
                        
                        {userChildren.length === 0 ? (
                          <div className="py-4 text-center">
                            <p className="text-muted-foreground mb-2">
                              You need to add children to your profile first
                            </p>
                            <Button asChild className="mt-2">
                              <Link to="/add-child">Add Child</Link>
                            </Button>
                          </div>
                        ) : (
                          <div className="py-4 space-y-4">
                            {userChildren.map((child) => (
                              <div key={child.id} className="flex items-start space-x-3">
                                <Checkbox
                                  id={child.id}
                                  checked={!!selectedChildren[child.id]}
                                  onCheckedChange={(checked) => {
                                    setSelectedChildren({
                                      ...selectedChildren,
                                      [child.id]: !!checked
                                    });
                                  }}
                                />
                                <div className="space-y-1">
                                  <Label
                                    htmlFor={child.id}
                                    className="text-base font-medium leading-none"
                                  >
                                    {child.name}
                                  </Label>
                                  <p className="text-sm text-muted-foreground">
                                    {child.age} years old
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={joinPlaydate}
                            disabled={joining || userChildren.length === 0 || Object.values(selectedChildren).every(selected => !selected)}
                            className="button-glow bg-primary hover:bg-primary/90 text-white"
                          >
                            {joining ? 'Joining...' : 'Join Playdate'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">About This Playdate</h2>
                <div className="prose max-w-none">
                  {playdate.description ? (
                    <p>{playdate.description}</p>
                  ) : (
                    <p className="text-muted-foreground">No description provided.</p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Location</h2>
                <div className="bg-muted h-[200px] rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-muted-foreground mr-2" />
                  <span className="text-muted-foreground">Map view not available</span>
                </div>
                <p className="font-medium">{playdate.location}</p>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Participating Families</h2>
                {participants.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">
                      No families have joined yet. Be the first to join!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {uniqueFamilies.map(parentId => {
                      const profile = participantProfiles[parentId];
                      if (!profile) return null;
                      
                      const childrenParticipating = participants
                        .filter(p => p.parent_id === parentId)
                        .map(p => p.child_id);
                      
                      const children = participantChildren[parentId]
                        ?.filter(c => childrenParticipating.includes(c.id)) || [];
                      
                      return (
                        <div key={parentId} className="border rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={profile.avatar_url} alt={profile.parent_name} />
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {profile.parent_name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <Link 
                              to={`/parent/${profile.id}`}
                              className="font-medium hover:text-primary transition-colors"
                            >
                              {profile.parent_name}
                            </Link>
                            {parentId === playdate.creator_id && (
                              <Badge variant="outline" className="ml-auto">Host</Badge>
                            )}
                          </div>
                          
                          <div className="ml-10 text-sm text-muted-foreground">
                            Children attending:
                            <ul className="list-disc list-inside mt-1">
                              {children.map(child => (
                                <li key={child.id}>{child.name} ({child.age})</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayoutWrapper>
  );
};

export default PlaydateDetailPage;

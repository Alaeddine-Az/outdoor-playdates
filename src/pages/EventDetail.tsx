import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { useEventDetails } from '@/hooks/useEvents';
import { format } from 'date-fns';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  User,
  Link as LinkIcon,
  ChevronLeft,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useUserChildren } from '@/hooks/playdate/useUserChildren';

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [selectedChildren, setSelectedChildren] = useState<Record<string, boolean>>({});
  const [joining, setJoining] = useState(false);
  
  const { userChildren } = useUserChildren();
  
  const { 
    event, 
    host, 
    participants, 
    participantProfiles,
    participantChildren,
    isJoined,
    loading,
    error,
    joinEvent,
    leaveEvent
  } = useEventDetails(id || '');
  
  if (loading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <Skeleton className="h-[200px] w-full rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Skeleton className="h-[300px] w-full rounded-xl" />
            </div>
            <Skeleton className="h-[300px] w-full rounded-xl" />
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error || !event || !host) {
    return (
      <AppLayout>
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The event you're looking for could not be found.
          </p>
          <Button onClick={() => navigate(-1)}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
        </div>
      </AppLayout>
    );
  }

  const eventDate = new Date(event.start_time);
  const formattedDate = format(eventDate, 'EEEE, MMMM d, yyyy');
  const startTime = format(new Date(event.start_time), 'h:mm a');
  const endTime = format(new Date(event.end_time), 'h:mm a');
  
  const participantCount = participants.length;
  const childrenCount = participantChildren.length;
  
  const handleJoinClick = () => {
    const initialSelection: Record<string, boolean> = {};
    userChildren.forEach(child => {
      initialSelection[child.id] = true;
    });
    setSelectedChildren(initialSelection);
    setJoinDialogOpen(true);
  };
  
  const handleJoinSubmit = async () => {
    const selectedIds = Object.entries(selectedChildren)
      .filter(([_, isSelected]) => isSelected)
      .map(([id]) => id);
    
    if (selectedIds.length === 0) return;
    
    setJoining(true);
    const result = await joinEvent(selectedIds);
    setJoining(false);
    
    if (result.success) {
      setJoinDialogOpen(false);
    }
  };
  
  const handleLeaveEvent = async () => {
    await leaveEvent();
  };
  
  return (
    <AppLayout>
      <div className="animate-fade-in">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Events
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-soft border border-muted overflow-hidden mb-6">
              <div className="p-6">
                <h1 className="text-2xl md:text-3xl font-bold mb-4">{event.title}</h1>
                
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
                      <span>{event.location}, {event.city}</span>
                    </div>
                    
                    <div className="flex items-center text-muted-foreground">
                      <Users className="h-5 w-5 mr-2 text-primary" />
                      <span>
                        {participantCount} {participantCount === 1 ? 'family' : 'families'} joined,&nbsp;
                        {childrenCount} {childrenCount === 1 ? 'child' : 'children'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-start">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar>
                        <AvatarImage src={host.avatar_url} alt={host.parent_name} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {host.parent_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm text-muted-foreground">Hosted by</div>
                        <Link 
                          to={`/parent/${host.id}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {host.parent_name}
                        </Link>
                      </div>
                    </div>
                    
                    <div className="mt-auto pt-4 flex gap-2 w-full">
                      {isJoined ? (
                        <>
                          <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={handleLeaveEvent}
                          >
                            Leave Event
                          </Button>
                          <Button 
                            asChild
                            className="flex-1 button-glow bg-primary hover:bg-primary/90 text-white"
                          >
                            <a href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${eventDate.toISOString().replace(/-|:|\.\d\d\d/g, "")}`} target="_blank" rel="noopener noreferrer">
                              <Calendar className="h-4 w-4 mr-2" /> Add to Calendar
                            </a>
                          </Button>
                        </>
                      ) : (
                        <Button 
                          onClick={handleJoinClick}
                          className="w-full button-glow bg-primary hover:bg-primary/90 text-white"
                        >
                          <Users className="h-4 w-4 mr-2" /> Join Event
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-soft border border-muted p-6">
                <h2 className="text-xl font-semibold mb-4">About This Event</h2>
                <div className="prose max-w-none">
                  {event.description ? (
                    <p>{event.description}</p>
                  ) : (
                    <p className="text-muted-foreground">No description provided.</p>
                  )}
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-soft border border-muted p-6">
                <h2 className="text-xl font-semibold mb-4">Location</h2>
                <p className="mb-2">{event.location}</p>
                <p className="text-muted-foreground mb-4">{event.address}</p>
                
                <div className="h-[200px] bg-muted rounded-md flex items-center justify-center">
                  <Button variant="outline">
                    <LinkIcon className="h-4 w-4 mr-2" /> Open in Maps
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-xl shadow-soft border border-muted p-6">
              <h2 className="text-xl font-semibold mb-4">Participants</h2>
              {participants.length === 0 ? (
                <p className="text-muted-foreground">No participants yet. Be the first to join!</p>
              ) : (
                <div className="space-y-4">
                  {participants.map(participant => {
                    const profile = participantProfiles[participant.parent_id];
                    if (!profile) return null;
                    
                    const participantChildrenCount = participant.children_ids.length;
                    
                    return (
                      <div key={participant.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={profile.avatar_url} alt={profile.parent_name} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {profile.parent_name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <Link 
                              to={`/parent/${profile.id}`}
                              className="font-medium hover:text-primary transition-colors"
                            >
                              {profile.parent_name}
                            </Link>
                            <div className="text-xs text-muted-foreground">
                              {participantChildrenCount} {participantChildrenCount === 1 ? 'child' : 'children'}
                            </div>
                          </div>
                        </div>
                        
                        <Button 
                          asChild
                          variant="ghost" 
                          size="sm"
                        >
                          <Link to={`/parent/${profile.id}`}>
                            <User className="h-4 w-4 mr-1" /> Profile
                          </Link>
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <Dialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Join {event.title}</DialogTitle>
              <DialogDescription>
                Select which of your children will attend this event.
              </DialogDescription>
            </DialogHeader>
            
            {userChildren.length === 0 ? (
              <div className="py-4 text-center">
                <p className="text-muted-foreground mb-2">
                  You need to add children to your profile first.
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
                        className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
                onClick={() => setJoinDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleJoinSubmit}
                disabled={joining || userChildren.length === 0 || Object.values(selectedChildren).every(selected => !selected)}
                className="button-glow bg-primary hover:bg-primary/90 text-white"
              >
                {joining ? 'Joining...' : 'Join Event'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default EventDetailPage;

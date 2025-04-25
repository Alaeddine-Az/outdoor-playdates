
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEventDetails } from '@/hooks/useEvents';
import { useUserChildren } from '@/hooks/playdate/useUserChildren';
import { EventDetailSkeleton } from '@/components/events/detail/EventDetailSkeleton';
import { JoinEventDialog } from '@/components/events/detail/JoinEventDialog';
import { EventDetailsSection } from '@/components/events/detail/EventDetailsSection';
import { ParticipantsList } from '@/components/events/detail/ParticipantsList';
import AppLayout from '@/components/AppLayout';

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
        <EventDetailSkeleton />
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
            <EventDetailsSection
              event={event}
              host={host}
              formattedDate={formattedDate}
              startTime={startTime}
              endTime={endTime}
              participantCount={participantCount}
              childrenCount={childrenCount}
              isJoined={isJoined}
              onJoinClick={handleJoinClick}
              onLeaveEvent={handleLeaveEvent}
            />
            
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
            <ParticipantsList
              participants={participants}
              participantProfiles={participantProfiles}
            />
          </div>
        </div>

        <JoinEventDialog
          open={joinDialogOpen}
          onOpenChange={setJoinDialogOpen}
          userChildren={userChildren}
          selectedChildren={selectedChildren}
          onSelectionChange={(childId, checked) => {
            setSelectedChildren(prev => ({
              ...prev,
              [childId]: checked
            }));
          }}
          onSubmit={handleJoinSubmit}
          joining={joining}
          eventTitle={event.title}
        />
      </div>
    </AppLayout>
  );
};

export default EventDetailPage;

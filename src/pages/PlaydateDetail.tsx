
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PlaydateParticipants } from '@/components/playdates/detail/PlaydateParticipants';
import { PlaydateJoin } from '@/components/playdates/detail/PlaydateJoin';
import { PlaydateSchedule } from '@/components/playdates/detail/PlaydateSchedule';
import { PlaydateStatusMessage } from '@/components/playdates/detail/PlaydateStatusMessage';
import { PlaydateHeader } from '@/components/playdates/detail/PlaydateHeader';
import { usePlaydateDetail } from '@/hooks/usePlaydateDetail';
import { usePlaydateActions } from '@/hooks/usePlaydateActions';

const PlaydateDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const {
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
    loadPlaydateData
  } = usePlaydateDetail(id);

  const {
    isJoining,
    isUpdating,
    isProcessing,
    isRemoving,
    setIsProcessing,
    handleJoinPlaydate,
    handleUpdatePlaydate,
    handlePlaydateCanceled,
    handleRemoveParticipant
  } = usePlaydateActions(id, loadPlaydateData);

  // Local participantDetails state
  const [localParticipantDetails, setLocalParticipantDetails] = useState(participantDetails);

  // Get list of already participating child IDs for the current user
  const [participatingChildIds, setParticipatingChildIds] = useState<string[]>([]);

  // Determine which children are already participating
  useEffect(() => {
    const childIds: string[] = [];
    Object.values(participantDetails).forEach(({ child }) => {
      if (userChildren.some(userChild => userChild.id === child.id)) {
        childIds.push(child.id);
      }
    });
    setParticipatingChildIds(childIds);
  }, [participantDetails, userChildren]);

  // Sync when the hook value changes
  useEffect(() => {
    setLocalParticipantDetails(participantDetails);
  }, [participantDetails]);

  const handleUpdatePlaydateSubmit = (values: any) => {
    handleUpdatePlaydate(values, playdate);
    setIsEditDialogOpen(false);
  };

  // Handle removing a participant
  const handleParticipantRemoved = async (participantId: string, childIdToRemove: string) => {
    // Call the hook function to remove from database
    await handleRemoveParticipant(participantId, childIdToRemove);
    
    // Update local state immediately for a responsive UI
    setLocalParticipantDetails(prev => {
      const updated = { ...prev };
      for (const key in updated) {
        if (updated[key].participantId === participantId && updated[key].child.id === childIdToRemove) {
          delete updated[key];
          break;
        }
      }
      return updated;
    });
  };

  const handleJoin = async (selectedChildIds: string[]) => {
    await handleJoinPlaydate(selectedChildIds);
  };

  if (isLoading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  if (!playdate) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-bold">Playdate Not Found</h2>
        <button onClick={() => navigate('/playdates')}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <PlaydateStatusMessage 
        isCanceled={isCanceled} 
        isCompleted={isCompleted} 
      />
      
      <PlaydateHeader
        playdate={playdate}
        creator={creator}
        isCreator={isCreator}
        isCanceled={isCanceled}
        isCompleted={isCompleted}
        isUpdating={isUpdating}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        onUpdate={handleUpdatePlaydateSubmit}
        onCanceled={handlePlaydateCanceled}
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
        form={form}
        playdateId={id || ''}
      />

      <div className="grid md:grid-cols-3 gap-6 mt-6">
        <div className="md:col-span-2 space-y-6">
          <PlaydateParticipants 
            participantDetails={localParticipantDetails} 
            playdateId={id || ''}
            isCompleted={isCompleted}
            isCanceled={isCanceled}
            onParticipantRemoved={handleParticipantRemoved}
            isRemoving={isRemoving}
          />
        </div>

        <div className="space-y-6">
          {!isCanceled && (
            <PlaydateJoin
              userChildren={userChildren}
              isJoining={isJoining}
              onJoin={handleJoin}
              isCompleted={isCompleted}
              isCanceled={isCanceled}
              alreadyJoined={participatingChildIds}
            />
          )}

          <PlaydateSchedule
            playdate={playdate}
            participantsCount={participants.length}
            isCompleted={isCompleted}
          />
        </div>
      </div>
    </div>
  );
};

export default PlaydateDetail;

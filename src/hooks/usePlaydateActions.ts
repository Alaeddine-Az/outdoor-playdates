
import { useState } from 'react';
import { useJoinPlaydate } from './playdateActions/useJoinPlaydate';
import { useUpdatePlaydate } from './playdateActions/useUpdatePlaydate';
import { useRemoveParticipant } from './playdateActions/useRemoveParticipant';
import { usePlaydateCanceled } from './playdateActions/usePlaydateCanceled';

export function usePlaydateActions(playdateId: string | undefined, refreshData: () => Promise<void>) {
  const [isProcessing, setIsProcessing] = useState(false);

  // Compose individual action hooks
  const { isJoining, handleJoinPlaydate } = useJoinPlaydate(playdateId);
  const { isUpdating, handleUpdatePlaydate } = useUpdatePlaydate(playdateId);
  const { isRemoving, handleRemoveParticipant } = useRemoveParticipant(playdateId);
  const { handlePlaydateCanceled } = usePlaydateCanceled();

  // Wrapper for joining a playdate
  const handleJoin = async (selectedChildIds: string[]) => {
    await handleJoinPlaydate(selectedChildIds, refreshData);
  };

  // Wrapper for updating a playdate
  const handleUpdate = async (values: any, playdateData: any) => {
    await handleUpdatePlaydate(values, playdateData, refreshData);
  };

  // Wrapper for removing a participant
  const handleRemove = async (participantId: string, childIdToRemove: string) => {
    await handleRemoveParticipant(participantId, childIdToRemove, refreshData);
  };

  // Wrapper for canceling a playdate
  const handleCancel = async () => {
    await handlePlaydateCanceled(refreshData);
  };

  return {
    isJoining,
    isUpdating,
    isRemoving,
    isProcessing,
    setIsProcessing,
    handleJoinPlaydate: handleJoin,
    handleUpdatePlaydate: handleUpdate,
    handleRemoveParticipant: handleRemove,
    handlePlaydateCanceled: handleCancel
  };
}

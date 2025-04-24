
import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { usePlaydateData } from './playdate/usePlaydateData';
import { usePlaydateParticipants } from './playdate/usePlaydateParticipants';
import { useUserChildren } from './playdate/useUserChildren';

export function usePlaydateDetail(id: string | undefined) {
  const { user } = useAuth();
  const { playdate, creator, isLoading: isLoadingPlaydate, loadPlaydateData, setPlaydate } = usePlaydateData(id);
  const { participants, participantDetails, loadParticipants } = usePlaydateParticipants(id);
  const { userChildren } = useUserChildren();
  
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

  const refreshData = useCallback(async () => {
    await loadPlaydateData();
    await loadParticipants();
  }, [loadPlaydateData, loadParticipants]);

  // Initialize form with playdate data when available
  if (playdate) {
    const startDate = new Date(playdate.start_time);
    const endDate = new Date(playdate.end_time);

    form.reset({
      title: playdate.title,
      description: playdate.description || '',
      location: playdate.location,
      startDate: format(startDate, 'yyyy-MM-dd'),
      startTime: format(startDate, 'HH:mm'),
      endTime: format(endDate, 'HH:mm'),
      maxParticipants: playdate.max_participants?.toString() || ''
    });
  }

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
    isLoading: isLoadingPlaydate,
    form,
    setPlaydate,
    loadPlaydateData: refreshData
  };
}

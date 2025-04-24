
import { useAuth } from '@/contexts/AuthContext';
import { usePlaydateFetch } from './playdate/usePlaydateFetch';
import { usePlaydateProcessor } from './playdate/usePlaydateProcessor';
import { Playdate, UsePlaydatesOptions } from '@/types/playdate';

export const usePlaydates = (options: UsePlaydatesOptions = {}) => {
  const { user } = useAuth();
  
  const {
    loading,
    error,
    playdateData,
    creatorProfiles,
    participantCounts
  } = usePlaydateFetch(user?.id);

  const {
    allPlaydates,
    myPlaydates,
    pastPlaydates
  } = usePlaydateProcessor(playdateData, creatorProfiles, participantCounts, user?.id);

  return {
    allPlaydates,
    myPlaydates,
    pastPlaydates,
    nearbyPlaydates: [], // Keeping this for backward compatibility
    loading,
    error
  };
};

export type { Playdate };

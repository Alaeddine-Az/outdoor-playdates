
import { useMemo } from 'react';
import { Playdate } from '@/types/playdate';
import { formatPlaydate } from '@/utils/playdateFormatters';

export const usePlaydateProcessor = (
  playdateData: any[],
  creatorProfiles: Record<string, any>,
  participantCounts: Record<string, number>,
  userId: string | undefined
) => {
  const processedPlaydates = useMemo(() => {
    if (!playdateData) return { allPlaydates: [], myPlaydates: [], pastPlaydates: [] };

    const now = new Date();
    const upcoming: Playdate[] = [];
    const past: Playdate[] = [];
    const my: Playdate[] = [];

    playdateData.forEach(playdate => {
      const endDate = new Date(playdate.end_time);
      const formattedPlaydate = formatPlaydate(
        playdate,
        creatorProfiles[playdate.creator_id],
        participantCounts[playdate.id]
      );

      if (endDate < now) {
        past.push(formattedPlaydate);
      } else {
        upcoming.push(formattedPlaydate);
        if (playdate.creator_id === userId) {
          my.push(formattedPlaydate);
        }
      }
    });

    return {
      allPlaydates: upcoming,
      myPlaydates: my,
      pastPlaydates: past
    };
  }, [playdateData, creatorProfiles, participantCounts, userId]);

  return processedPlaydates;
};

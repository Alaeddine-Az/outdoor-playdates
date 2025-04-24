
import { format } from 'date-fns';

export const formatPlaydate = (playdate: any, creatorProfile: any, participantCount: number = 0, status: string = 'upcoming') => {
  const hostName = creatorProfile?.parent_name || 'Unknown Host';

  return {
    id: playdate.id,
    title: playdate.title,
    date: format(new Date(playdate.start_time), 'EEE, MMM d'),
    time: `${format(new Date(playdate.start_time), 'h:mm a')} - ${format(new Date(playdate.end_time), 'h:mm a')}`,
    location: playdate.location,
    families: participantCount,
    status: playdate.status || status,
    host: hostName,
    host_id: playdate.creator_id,
    start_time: playdate.start_time,
    end_time: playdate.end_time,
    latitude: playdate.latitude,
    longitude: playdate.longitude
  };
};

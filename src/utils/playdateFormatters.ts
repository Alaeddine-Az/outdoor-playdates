
import { PlaydateData } from '@/types/dashboard';

/**
 * Format a raw playdate from Supabase into a standardized PlaydateData object
 */
export const formatPlaydate = (playdate: any, status: 'upcoming' | 'pending' | 'completed'): PlaydateData => {
  try {
    const startDate = new Date(playdate.start_time);
    const endDate = new Date(playdate.end_time);
    const now = new Date();

    const isValidDate = !isNaN(startDate.getTime()) && !isNaN(endDate.getTime());

    let dateStr = 'Date unavailable';
    let timeStr = 'Time unavailable';
    let playdateStatus: 'upcoming' | 'pending' | 'completed' = 'pending';

    if (isValidDate) {
      dateStr = startDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });

      timeStr = `${startDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
      })} - ${endDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
      })}`;

      if (startDate > now) playdateStatus = 'upcoming';
      else if (endDate < now) playdateStatus = 'completed';
    }

    const hostName = playdate.profiles?.parent_name || 'Unknown Host';

    return {
      id: playdate.id,
      title: playdate.title || 'Untitled Playdate',
      date: dateStr,
      time: timeStr,
      location: playdate.location || 'Location not specified',
      attendees: 1,
      families: 1,
      status: playdateStatus,
      host: hostName,
      host_id: playdate.creator_id,
      start_time: playdate.start_time,
      latitude: playdate.latitude,
      longitude: playdate.longitude,
      distance: undefined // Initialize with undefined
    };
  } catch (err) {
    console.error("Error processing playdate:", err, playdate);
    return {
      id: playdate.id || 'unknown-id',
      title: playdate.title || 'Untitled Playdate',
      date: 'Date error',
      time: 'Time unavailable',
      location: playdate.location || 'Unknown location',
      attendees: 1,
      families: 1,
      status: 'pending',
      host: playdate.profiles?.parent_name || 'Unknown Host',
      host_id: playdate.creator_id,
      start_time: undefined,
      latitude: undefined,
      longitude: undefined,
      distance: undefined
    };
  }
};

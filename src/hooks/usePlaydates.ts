
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface Playdate {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  status: 'pending' | 'confirmed' | 'completed';
}

export const usePlaydates = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allPlaydates, setAllPlaydates] = useState<Playdate[]>([]);
  const [myPlaydates, setMyPlaydates] = useState<Playdate[]>([]);
  const [pastPlaydates, setPastPlaydates] = useState<Playdate[]>([]);

  useEffect(() => {
    const fetchPlaydates = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch all playdates
        const { data: playdatesData, error: playdatesError } = await supabase
          .from('playdates')
          .select('*')
          .order('start_time', { ascending: true });

        if (playdatesError) {
          throw playdatesError;
        }
        
        console.log("Fetched playdates:", playdatesData);
        
        if (playdatesData) {
          const now = new Date();
          const upcoming: Playdate[] = [];
          const userPlaydates: Playdate[] = [];
          const past: Playdate[] = [];
          
          playdatesData.forEach(playdate => {
            const startDate = new Date(playdate.start_time);
            const endDate = new Date(playdate.end_time);
            
            const dateOptions: Intl.DateTimeFormatOptions = { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric'
            };
            
            const dateStr = startDate.toLocaleDateString('en-US', dateOptions);
            const startTimeStr = startDate.toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit', 
              hour12: true 
            });
            const endTimeStr = endDate.toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit', 
              hour12: true 
            });
            
            const formattedPlaydate: Playdate = {
              id: playdate.id,
              title: playdate.title,
              date: dateStr,
              time: `${startTimeStr} - ${endTimeStr}`,
              location: playdate.location,
              attendees: 1, // Default to 1 for now
              status: endDate < now ? 'completed' : 'confirmed'
            };
            
            // Add to appropriate arrays
            if (endDate < now) {
              past.push(formattedPlaydate);
            } else {
              upcoming.push(formattedPlaydate);
            }
            
            // If the current user created this playdate, add to user's playdates
            if (playdate.creator_id === user.id) {
              userPlaydates.push(formattedPlaydate);
            }
          });
          
          setAllPlaydates(upcoming);
          setMyPlaydates(userPlaydates);
          setPastPlaydates(past);
        }
      } catch (err: any) {
        console.error("Error fetching playdates:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaydates();
  }, [user]);

  return {
    loading,
    error,
    allPlaydates,
    myPlaydates,
    pastPlaydates
  };
};

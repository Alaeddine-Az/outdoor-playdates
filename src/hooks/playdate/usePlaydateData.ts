
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export function usePlaydateData(id: string | undefined) {
  const [playdate, setPlaydate] = useState<any>(null);
  const [creator, setCreator] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadPlaydateData = useCallback(async () => {
    try {
      if (!id) return;
      setIsLoading(true);
      console.log("🔄 Loading playdate data for ID:", id);

      const { data: playdateData, error: playdateError } = await supabase
        .from('playdates')
        .select('*')
        .eq('id', id)
        .single();
      if (playdateError) throw playdateError;
      setPlaydate(playdateData);

      const { data: creatorData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', playdateData.creator_id)
        .single();
      setCreator(creatorData);
    } catch (err: any) {
      console.error('Failed to load playdate data:', err);
      toast({
        title: 'Error',
        description: err.message || 'Could not load playdate data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  return {
    playdate,
    creator,
    isLoading,
    loadPlaydateData,
    setPlaydate
  };
}

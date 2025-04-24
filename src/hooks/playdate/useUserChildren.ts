
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useUserChildren() {
  const { user } = useAuth();
  const [userChildren, setUserChildren] = useState<any[]>([]);

  useEffect(() => {
    const loadUserChildren = async () => {
      if (user) {
        const { data: childrenData } = await supabase
          .from('children')
          .select('*')
          .eq('parent_id', user.id);
        setUserChildren(childrenData || []);
      }
    };

    loadUserChildren();
  }, [user]);

  return { userChildren };
}

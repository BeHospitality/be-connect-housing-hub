import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useClientId = () => {
  const { user } = useAuth();
  const [clientId, setClientId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientId = async () => {
      if (!user) {
        setClientId(null);
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('profiles')
        .select('client_id')
        .eq('user_id', user.id)
        .single();

      setClientId(data?.client_id ?? null);
      setLoading(false);
    };

    fetchClientId();
  }, [user]);

  return { clientId, loading };
};

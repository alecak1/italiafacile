import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Corridor {
  id: string;
  origin_country: string;
  destination_country: string;
  slug: string;
}

export function useCorridors() {
  const [corridors, setCorridor] = useState<Corridor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('relocation_corridors')
        .select('*')
        .eq('is_active', true);

      if (data) setCorridor(data as Corridor[]);
      setLoading(false);
    };
    fetch();
  }, []);

  const getCorridorBySlug = (slug: string) => corridors.find((c) => c.slug === slug);
  const getDefaultCorridor = () => corridors[0] || null;

  return { corridors, loading, getCorridorBySlug, getDefaultCorridor };
}

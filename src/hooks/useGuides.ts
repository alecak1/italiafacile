import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DbGuide {
  id: string;
  corridor_id: string | null;
  title: string;
  category: string;
  reading_time: string;
  summary: string;
  sections: { title: string; content: string; bullets?: string[] }[];
  sort_order: number;
}

export function useGuides(corridorId?: string | null) {
  const [guides, setGuides] = useState<DbGuide[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGuides = useCallback(async () => {
    let query = supabase
      .from('guides')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true });

    if (corridorId) {
      query = query.eq('corridor_id', corridorId);
    }

    const { data, error } = await query;

    if (!error && data) {
      setGuides(data.map((g: any) => ({
        ...g,
        sections: Array.isArray(g.sections) ? g.sections : [],
      })));
    }
    setLoading(false);
  }, [corridorId]);

  useEffect(() => {
    fetchGuides();
  }, [fetchGuides]);

  return { guides, loading, refetch: fetchGuides };
}

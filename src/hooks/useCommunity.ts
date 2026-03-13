import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface DbQuestion {
  id: string;
  user_id: string;
  text: string;
  category: string;
  created_at: string;
  author_name?: string;
  answers: DbAnswer[];
}

export interface DbAnswer {
  id: string;
  user_id: string;
  text: string;
  upvotes: number;
  created_at: string;
  author_name?: string;
}

export function useCommunity(corridorId?: string | null) {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<DbQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('questions')
      .select('*, answers(*)')
      .order('created_at', { ascending: false });

    // Only filter by corridor if explicitly set (not null/undefined = "all")
    if (corridorId) {
      query = query.eq('corridor_id', corridorId);
    }

    const { data, error } = await query;

    if (!error && data) {
      // Fetch author names from profiles
      const userIds = new Set<string>();
      data.forEach((q: any) => {
        userIds.add(q.user_id);
        q.answers?.forEach((a: any) => userIds.add(a.user_id));
      });

      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, name')
        .in('user_id', Array.from(userIds));

      const nameMap: Record<string, string> = {};
      profiles?.forEach((p: any) => {
        nameMap[p.user_id] = p.name || 'Utente';
      });

      const mapped: DbQuestion[] = data.map((q: any) => ({
        ...q,
        author_name: nameMap[q.user_id] || 'Utente',
        answers: (q.answers || []).map((a: any) => ({
          ...a,
          author_name: nameMap[a.user_id] || 'Utente',
        })),
      }));

      setQuestions(mapped);
    }
    setLoading(false);
  }, [corridorId]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('community-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'questions' }, () => fetchQuestions())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'answers' }, () => fetchQuestions())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchQuestions]);

  const addQuestion = useCallback(async (text: string, category: string = 'generale') => {
    if (!user) return { error: 'Not authenticated' };

    const { error } = await supabase
      .from('questions')
      .insert({
        user_id: user.id,
        text,
        category,
        corridor_id: corridorId || null,
      });

    return { error };
  }, [user, corridorId]);

  const addAnswer = useCallback(async (questionId: string, text: string) => {
    if (!user) return { error: 'Not authenticated' };

    const { error } = await supabase
      .from('answers')
      .insert({
        question_id: questionId,
        user_id: user.id,
        text,
      });

    return { error };
  }, [user]);

  return { questions, loading, addQuestion, addAnswer, refetch: fetchQuestions };
}

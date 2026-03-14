import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface CommunityTip {
  id: string;
  user_id: string;
  step_template_id: string | null;
  corridor_id: string | null;
  city: string;
  title: string;
  description: string;
  category: string;
  status: string;
  is_highlighted: boolean;
  created_at: string;
  author_name: string;
  vote_count: number;
  user_voted: boolean;
}

export interface CommunityExperience {
  id: string;
  user_id: string;
  step_template_id: string | null;
  corridor_id: string | null;
  city: string;
  title: string;
  time_required: string;
  problems: string;
  advice: string;
  status: string;
  created_at: string;
  author_name: string;
  vote_count: number;
  user_voted: boolean;
}

export function useCommunityInsights(stepTemplateId?: string | null, corridorId?: string | null) {
  const { user } = useAuth();
  const [tips, setTips] = useState<CommunityTip[]>([]);
  const [experiences, setExperiences] = useState<CommunityExperience[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInsights = useCallback(async () => {
    setLoading(true);

    // Fetch tips
    let tipQuery = supabase
      .from('community_tips')
      .select('*')
      .eq('status', 'approved');
    
    if (stepTemplateId) tipQuery = tipQuery.eq('step_template_id', stepTemplateId);
    
    const { data: tipData } = await tipQuery.order('created_at', { ascending: false });

    // Fetch experiences
    let expQuery = supabase
      .from('community_experiences')
      .select('*')
      .eq('status', 'approved');
    
    if (stepTemplateId) expQuery = expQuery.eq('step_template_id', stepTemplateId);
    
    const { data: expData } = await expQuery.order('created_at', { ascending: false });

    // Fetch vote counts and user votes
    const tipIds = (tipData || []).map((t: any) => t.id);
    const expIds = (expData || []).map((e: any) => e.id);

    let tipVotesMap: Record<string, number> = {};
    let userTipVotes = new Set<string>();
    let expVotesMap: Record<string, number> = {};
    let userExpVotes = new Set<string>();

    if (tipIds.length > 0) {
      const { data: allTipVotes } = await supabase
        .from('tip_votes')
        .select('tip_id, user_id')
        .in('tip_id', tipIds);
      
      (allTipVotes || []).forEach((v: any) => {
        tipVotesMap[v.tip_id] = (tipVotesMap[v.tip_id] || 0) + 1;
        if (user && v.user_id === user.id) userTipVotes.add(v.tip_id);
      });
    }

    if (expIds.length > 0) {
      const { data: allExpVotes } = await supabase
        .from('experience_votes')
        .select('experience_id, user_id')
        .in('experience_id', expIds);
      
      (allExpVotes || []).forEach((v: any) => {
        expVotesMap[v.experience_id] = (expVotesMap[v.experience_id] || 0) + 1;
        if (user && v.user_id === user.id) userExpVotes.add(v.experience_id);
      });
    }

    // Fetch author names
    const userIds = new Set<string>();
    (tipData || []).forEach((t: any) => userIds.add(t.user_id));
    (expData || []).forEach((e: any) => userIds.add(e.user_id));

    let nameMap: Record<string, string> = {};
    if (userIds.size > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, name')
        .in('user_id', Array.from(userIds));
      (profiles || []).forEach((p: any) => { nameMap[p.user_id] = p.name || 'Utente'; });
    }

    const mappedTips: CommunityTip[] = (tipData || []).map((t: any) => ({
      ...t,
      author_name: nameMap[t.user_id] || 'Utente',
      vote_count: tipVotesMap[t.id] || 0,
      user_voted: userTipVotes.has(t.id),
    }));
    // Sort by votes desc, highlighted first
    mappedTips.sort((a, b) => {
      if (a.is_highlighted !== b.is_highlighted) return a.is_highlighted ? -1 : 1;
      return b.vote_count - a.vote_count;
    });

    const mappedExps: CommunityExperience[] = (expData || []).map((e: any) => ({
      ...e,
      author_name: nameMap[e.user_id] || 'Utente',
      vote_count: expVotesMap[e.id] || 0,
      user_voted: userExpVotes.has(e.id),
    }));
    mappedExps.sort((a, b) => b.vote_count - a.vote_count);

    setTips(mappedTips);
    setExperiences(mappedExps);
    setLoading(false);
  }, [stepTemplateId, user]);

  useEffect(() => { fetchInsights(); }, [fetchInsights]);

  const voteTip = useCallback(async (tipId: string) => {
    if (!user) return;
    const tip = tips.find(t => t.id === tipId);
    if (!tip) return;

    if (tip.user_voted) {
      await supabase.from('tip_votes').delete().eq('tip_id', tipId).eq('user_id', user.id);
    } else {
      await supabase.from('tip_votes').insert({ tip_id: tipId, user_id: user.id });
    }
    await fetchInsights();
  }, [user, tips, fetchInsights]);

  const voteExperience = useCallback(async (expId: string) => {
    if (!user) return;
    const exp = experiences.find(e => e.id === expId);
    if (!exp) return;

    if (exp.user_voted) {
      await supabase.from('experience_votes').delete().eq('experience_id', expId).eq('user_id', user.id);
    } else {
      await supabase.from('experience_votes').insert({ experience_id: expId, user_id: user.id });
    }
    await fetchInsights();
  }, [user, experiences, fetchInsights]);

  const submitTip = useCallback(async (data: {
    title: string;
    description: string;
    city: string;
    category: string;
  }) => {
    if (!user) return { error: 'Not authenticated' };
    const { error } = await supabase.from('community_tips').insert({
      user_id: user.id,
      step_template_id: stepTemplateId || null,
      corridor_id: corridorId || null,
      title: data.title.trim().slice(0, 200),
      description: data.description.trim().slice(0, 1000),
      city: data.city.trim().slice(0, 100),
      category: data.category,
    });
    return { error };
  }, [user, stepTemplateId, corridorId]);

  const submitExperience = useCallback(async (data: {
    title: string;
    city: string;
    time_required: string;
    problems: string;
    advice: string;
  }) => {
    if (!user) return { error: 'Not authenticated' };
    const { error } = await supabase.from('community_experiences').insert({
      user_id: user.id,
      step_template_id: stepTemplateId || null,
      corridor_id: corridorId || null,
      title: data.title.trim().slice(0, 200),
      city: data.city.trim().slice(0, 100),
      time_required: data.time_required.trim().slice(0, 100),
      problems: data.problems.trim().slice(0, 2000),
      advice: data.advice.trim().slice(0, 2000),
    });
    return { error };
  }, [user, stepTemplateId, corridorId]);

  return { tips, experiences, loading, voteTip, voteExperience, submitTip, submitExperience, refetch: fetchInsights };
}

// Hook for user's own contributions (profile page)
export function useMyContributions() {
  const { user } = useAuth();
  const [tips, setTips] = useState<CommunityTip[]>([]);
  const [experiences, setExperiences] = useState<CommunityExperience[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);

    const [{ data: tipData }, { data: expData }] = await Promise.all([
      supabase.from('community_tips').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('community_experiences').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    ]);

    setTips((tipData || []).map((t: any) => ({ ...t, author_name: '', vote_count: 0, user_voted: false })));
    setExperiences((expData || []).map((e: any) => ({ ...e, author_name: '', vote_count: 0, user_voted: false })));
    setLoading(false);
  }, [user]);

  useEffect(() => { fetch(); }, [fetch]);

  return { tips, experiences, loading, refetch: fetch };
}

// Hook for admin moderation
export function useAdminCommunityModeration() {
  const [tips, setTips] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [{ data: tipData }, { data: expData }] = await Promise.all([
      supabase.from('community_tips').select('*').order('created_at', { ascending: false }),
      supabase.from('community_experiences').select('*').order('created_at', { ascending: false }),
    ]);

    // Get author names
    const userIds = new Set<string>();
    (tipData || []).forEach((t: any) => userIds.add(t.user_id));
    (expData || []).forEach((e: any) => userIds.add(e.user_id));

    let nameMap: Record<string, string> = {};
    if (userIds.size > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, name')
        .in('user_id', Array.from(userIds));
      (profiles || []).forEach((p: any) => { nameMap[p.user_id] = p.name || 'Utente'; });
    }

    setTips((tipData || []).map((t: any) => ({ ...t, author_name: nameMap[t.user_id] || 'Utente' })));
    setExperiences((expData || []).map((e: any) => ({ ...e, author_name: nameMap[e.user_id] || 'Utente' })));
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const updateTipStatus = useCallback(async (id: string, status: string) => {
    await supabase.from('community_tips').update({ status }).eq('id', id);
    await fetchAll();
  }, [fetchAll]);

  const updateExperienceStatus = useCallback(async (id: string, status: string) => {
    await supabase.from('community_experiences').update({ status }).eq('id', id);
    await fetchAll();
  }, [fetchAll]);

  const toggleHighlight = useCallback(async (id: string, current: boolean) => {
    await supabase.from('community_tips').update({ is_highlighted: !current }).eq('id', id);
    await fetchAll();
  }, [fetchAll]);

  const deleteTip = useCallback(async (id: string) => {
    await supabase.from('community_tips').delete().eq('id', id);
    await fetchAll();
  }, [fetchAll]);

  const deleteExperience = useCallback(async (id: string) => {
    await supabase.from('community_experiences').delete().eq('id', id);
    await fetchAll();
  }, [fetchAll]);

  return { tips, experiences, loading, updateTipStatus, updateExperienceStatus, toggleHighlight, deleteTip, deleteExperience };
}

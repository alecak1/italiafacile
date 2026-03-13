import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Profile {
  id: string;
  user_id: string;
  name: string | null;
  nationality: string | null;
  destination_country: string | null;
  destination_city: string | null;
  reason_for_moving: string | null;
  already_in_country: boolean | null;
  has_tax_code: boolean | null;
  job_status: string | null;
  language_level: string | null;
  onboarding_completed: boolean | null;
  corridor_id: string | null;
  avatar_url: string | null;
  bio: string | null;
  social_linkedin: string | null;
  social_instagram: string | null;
  social_facebook: string | null;
}

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!error && data) {
      setProfile(data as Profile);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (!user || !profile) return { error: 'No user or profile' };

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', user.id);

    if (!error) {
      setProfile((prev) => prev ? { ...prev, ...updates } : prev);
    }
    return { error };
  }, [user, profile]);

  return { profile, loading, updateProfile, refetch: fetchProfile };
}

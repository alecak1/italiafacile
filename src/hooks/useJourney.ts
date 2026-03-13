import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface StepTemplate {
  id: string;
  corridor_id: string;
  step_order: number;
  title: string;
  explanation: string;
  why_it_matters: string;
  where_to_go: string;
  estimated_time: string;
  cost: string;
  category: string;
  documents: { name: string; description: string }[];
  checklist_items: string[];
}

export interface UserStepProgress {
  id: string;
  step_template_id: string;
  status: 'locked' | 'current' | 'completed';
  checklist_state: boolean[];
  completed_at: string | null;
}

export interface JourneyStepWithProgress extends StepTemplate {
  progress: UserStepProgress | null;
  status: 'locked' | 'current' | 'completed';
  checklist: { id: string; label: string; checked: boolean }[];
}

export function useJourney(corridorId?: string | null) {
  const { user } = useAuth();
  const [steps, setSteps] = useState<JourneyStepWithProgress[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJourney = useCallback(async () => {
    if (!corridorId) {
      setSteps([]);
      setLoading(false);
      return;
    }

    // Fetch step templates for this corridor
    const { data: templates, error: tErr } = await supabase
      .from('journey_step_templates')
      .select('*')
      .eq('corridor_id', corridorId)
      .eq('is_active', true)
      .order('step_order', { ascending: true });

    if (tErr || !templates) {
      setLoading(false);
      return;
    }

    // Fetch user progress if logged in
    let progressMap: Record<string, UserStepProgress> = {};
    if (user) {
      const { data: progressData } = await supabase
        .from('user_step_progress')
        .select('*')
        .eq('user_id', user.id);

      if (progressData) {
        for (const p of progressData) {
          progressMap[p.step_template_id] = p as unknown as UserStepProgress;
        }
      }
    }

    // Merge templates with progress
    const merged: JourneyStepWithProgress[] = templates.map((t: any) => {
      const progress = progressMap[t.id] || null;
      const checklistItems: string[] = Array.isArray(t.checklist_items) ? t.checklist_items : [];
      const checklistState: boolean[] = progress?.checklist_state as boolean[] || checklistItems.map(() => false);

      return {
        ...t,
        documents: Array.isArray(t.documents) ? t.documents : [],
        checklist_items: checklistItems,
        progress,
        status: progress?.status || (t.step_order === 1 ? 'current' : 'locked'),
        checklist: checklistItems.map((label: string, i: number) => ({
          id: `${t.id}-${i}`,
          label,
          checked: checklistState[i] || false,
        })),
      };
    });

    setSteps(merged);
    setLoading(false);
  }, [corridorId, user]);

  useEffect(() => {
    fetchJourney();
  }, [fetchJourney]);

  const initializeProgress = useCallback(async () => {
    if (!user || !corridorId || steps.length === 0) return;

    // Check if user already has progress
    const { data: existing } = await supabase
      .from('user_step_progress')
      .select('id')
      .eq('user_id', user.id)
      .limit(1);

    if (existing && existing.length > 0) return;

    // Initialize progress for all steps
    const inserts = steps.map((step, i) => ({
      user_id: user.id,
      step_template_id: step.id,
      status: i === 0 ? 'current' : 'locked',
      checklist_state: step.checklist_items.map(() => false),
    }));

    await supabase.from('user_step_progress').insert(inserts);
    await fetchJourney();
  }, [user, corridorId, steps, fetchJourney]);

  const updateChecklist = useCallback(async (stepId: string, checklistIndex: number) => {
    if (!user) return;

    const step = steps.find((s) => s.id === stepId);
    if (!step) return;

    const newState = [...(step.progress?.checklist_state || step.checklist_items.map(() => false))];
    newState[checklistIndex] = !newState[checklistIndex];

    if (step.progress) {
      await supabase
        .from('user_step_progress')
        .update({ checklist_state: newState })
        .eq('id', step.progress.id);
    } else {
      await supabase
        .from('user_step_progress')
        .insert({
          user_id: user.id,
          step_template_id: stepId,
          status: 'current',
          checklist_state: newState,
        });
    }

    await fetchJourney();
  }, [user, steps, fetchJourney]);

  const completeStep = useCallback(async (stepId: string) => {
    if (!user) return;

    const stepIndex = steps.findIndex((s) => s.id === stepId);
    if (stepIndex === -1) return;

    // Mark current as completed
    await supabase
      .from('user_step_progress')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .eq('step_template_id', stepId);

    // Unlock next step
    const nextStep = steps[stepIndex + 1];
    if (nextStep) {
      if (nextStep.progress) {
        await supabase
          .from('user_step_progress')
          .update({ status: 'current' })
          .eq('id', nextStep.progress.id);
      } else {
        await supabase
          .from('user_step_progress')
          .insert({
            user_id: user.id,
            step_template_id: nextStep.id,
            status: 'current',
            checklist_state: nextStep.checklist_items.map(() => false),
          });
      }
    }

    await fetchJourney();
  }, [user, steps, fetchJourney]);

  return { steps, loading, initializeProgress, updateChecklist, completeStep, refetch: fetchJourney };
}

import { ArrowRight, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import JourneyTimeline from '@/components/JourneyTimeline';
import { useProfile } from '@/hooks/useProfile';
import { useJourney } from '@/hooks/useJourney';
import { useNavigate } from 'react-router-dom';

const Journey = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { profile } = useProfile();
  const { steps, loading } = useJourney(profile?.corridor_id);

  const completedCount = steps.filter((s) => s.status === 'completed').length;
  const totalCount = steps.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const currentStep = steps.find((s) => s.status === 'current');

  const mapSteps = steps.map((s) => ({
    id: s.id, order: s.step_order, title: s.title, explanation: s.explanation,
    whyItMatters: s.why_it_matters, documents: s.documents, whereToGo: s.where_to_go,
    estimatedTime: s.estimated_time, cost: s.cost, checklist: s.checklist,
    status: s.status, category: s.category,
  }));

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="bg-card px-6 pt-12 pb-6">
        <h1 className="text-2xl font-black tracking-tight text-foreground">{t('journey.title')}</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {t('journey.stepsOf', { completed: completedCount, total: totalCount })}
        </p>
        <div className="mt-5 flex items-center gap-3">
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full gradient-hero transition-all duration-1000" style={{ width: `${Math.max(progress, 3)}%` }} />
          </div>
          <span className="text-sm font-black text-primary">{Math.round(progress)}%</span>
        </div>
      </div>

      {currentStep && (
        <div className="px-6 py-5">
          <button
            onClick={() => navigate(`/step/${currentStep.id}`)}
            className="flex w-full items-center gap-3.5 rounded-2xl gradient-hero p-5 text-primary-foreground shadow-cta transition-all active:scale-[0.98]"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-60">{t('journey.continueFrom')}</div>
              <div className="mt-0.5 text-[15px] font-bold">{currentStep.title}</div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary shadow-xs">
              <ArrowRight className="h-4 w-4" />
            </div>
          </button>
        </div>
      )}

      <div className="px-6 pb-4">
        <h2 className="mb-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">{t('journey.allSteps')}</h2>
        <JourneyTimeline steps={mapSteps} />
      </div>
    </div>
  );
};

export default Journey;

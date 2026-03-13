import { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import JourneyTimeline from '@/components/JourneyTimeline';
import { mockJourneySteps } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';

const Journey = () => {
  const [steps] = useState(mockJourneySteps);
  const navigate = useNavigate();
  const completedCount = steps.filter((s) => s.status === 'completed').length;
  const totalCount = steps.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const currentStep = steps.find((s) => s.status === 'current');

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="bg-card px-5 pt-12 pb-5">
        <h1 className="text-2xl font-extrabold text-foreground">Il tuo Percorso</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {completedCount} di {totalCount} passi completati
        </p>

        {/* Progress bar */}
        <div className="mt-4 flex items-center gap-3">
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full gradient-hero transition-all duration-1000"
              style={{ width: `${Math.max(progress, 3)}%` }}
            />
          </div>
          <span className="text-sm font-extrabold text-primary">{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Current step CTA - always visible */}
      {currentStep && (
        <div className="px-5 py-4">
          <button
            onClick={() => navigate(`/step/${currentStep.id}`)}
            className="flex w-full items-center gap-3 rounded-2xl gradient-hero p-4 text-primary-foreground shadow-cta transition-all active:scale-[0.98]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-70">Continua da qui</div>
              <div className="text-sm font-bold">{currentStep.title}</div>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-primary">
              <ArrowRight className="h-4 w-4" />
            </div>
          </button>
        </div>
      )}

      <div className="px-5 pb-4">
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Tutti i passi</h2>
        <JourneyTimeline steps={steps} />
      </div>
    </div>
  );
};

export default Journey;

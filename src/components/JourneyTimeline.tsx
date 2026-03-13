import { Check, Lock, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { JourneyStep } from '@/types';

interface JourneyTimelineProps {
  steps: JourneyStep[];
}

const JourneyTimeline = ({ steps }: JourneyTimelineProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="relative">
      <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-border/70" />
      <div className="space-y-3">
        {steps.map((step, index) => {
          const isCompleted = step.status === 'completed';
          const isCurrent = step.status === 'current';
          const isLocked = step.status === 'locked';

          return (
            <div key={step.id} className="animate-fade-in"
              style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'backwards' }}>
              <button onClick={() => !isLocked && navigate(`/step/${step.id}`)} disabled={isLocked}
                className={`relative flex w-full items-center gap-4 rounded-2xl p-4 text-left transition-all duration-200 active:scale-[0.98] ${
                  isCurrent ? 'border border-primary/20 bg-card shadow-card-hover'
                    : isCompleted ? 'border border-border/60 bg-card shadow-card' : 'bg-muted/30'
                }`}>
                <div className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all ${
                  isCompleted ? 'bg-success text-success-foreground'
                    : isCurrent ? 'gradient-hero text-primary-foreground shadow-cta animate-pulse-soft'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {isCompleted ? <Check className="h-5 w-5" /> : isCurrent ? <Sparkles className="h-4 w-4" />
                    : isLocked ? <Lock className="h-4 w-4" /> : <span className="text-sm font-bold">{step.order}</span>}
                </div>
                <div className="min-w-0 flex-1">
                  <div className={`text-sm font-semibold ${isLocked ? 'text-muted-foreground' : 'text-card-foreground'}`}>{step.title}</div>
                  {isCurrent && (
                    <div className="mt-1.5 flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{step.estimatedTime}</span>
                      <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                      <span className="text-xs text-muted-foreground">{step.cost}</span>
                    </div>
                  )}
                  {isCompleted && (
                    <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-success">
                      <Check className="h-3 w-3" /> {t('journey.completed')}
                    </span>
                  )}
                </div>
                {isCurrent ? (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xs">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                ) : !isLocked ? <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" /> : null}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default JourneyTimeline;

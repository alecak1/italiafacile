import { Check, Lock, ChevronRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { JourneyStep } from '@/types';

interface JourneyTimelineProps {
  steps: JourneyStep[];
}

const JourneyTimeline = ({ steps }: JourneyTimelineProps) => {
  const navigate = useNavigate();

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-border" />

      <div className="space-y-3">
        {steps.map((step, index) => {
          const isCompleted = step.status === 'completed';
          const isCurrent = step.status === 'current';
          const isLocked = step.status === 'locked';

          return (
            <div
              key={step.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'backwards' }}
            >
              <button
                onClick={() => !isLocked && navigate(`/step/${step.id}`)}
                disabled={isLocked}
                className={`relative flex w-full items-center gap-4 rounded-2xl p-4 text-left transition-all active:scale-[0.98] ${
                  isCurrent
                    ? 'bg-card shadow-card-hover ring-2 ring-primary/20'
                    : isCompleted
                    ? 'bg-card shadow-card'
                    : 'bg-muted/40'
                }`}
              >
                {/* Step indicator */}
                <div
                  className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all ${
                    isCompleted
                      ? 'bg-success text-success-foreground'
                      : isCurrent
                      ? 'gradient-hero text-primary-foreground shadow-cta animate-pulse-soft'
                      : 'bg-border text-muted-foreground'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : isCurrent ? (
                    <Sparkles className="h-4 w-4" />
                  ) : isLocked ? (
                    <Lock className="h-4 w-4" />
                  ) : (
                    <span className="text-sm font-bold">{step.order}</span>
                  )}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className={`text-sm font-semibold ${
                    isLocked ? 'text-muted-foreground' : 'text-card-foreground'
                  }`}>
                    {step.title}
                  </div>
                  {isCurrent && (
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{step.estimatedTime}</span>
                      <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                      <span className="text-xs text-muted-foreground">{step.cost}</span>
                    </div>
                  )}
                  {isCompleted && (
                    <span className="mt-0.5 inline-block text-[10px] font-semibold text-success">✓ Completato</span>
                  )}
                </div>

                {/* Arrow / badge */}
                {isCurrent ? (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                ) : !isLocked ? (
                  <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                ) : null}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ArrowRight = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);

export default JourneyTimeline;

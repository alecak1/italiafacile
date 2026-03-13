import { Check, Lock, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { JourneyStep } from '@/types';

interface JourneyTimelineProps {
  steps: JourneyStep[];
}

const JourneyTimeline = ({ steps }: JourneyTimelineProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-3">
      {steps.map((step, index) => {
        const isCompleted = step.status === 'completed';
        const isCurrent = step.status === 'current';
        const isLocked = step.status === 'locked';

        return (
          <div
            key={step.id}
            className="animate-slide-up"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <button
              onClick={() => !isLocked && navigate(`/step/${step.id}`)}
              disabled={isLocked}
              className={`flex w-full items-center gap-4 rounded-2xl p-4 text-left transition-all ${
                isCurrent
                  ? 'bg-card shadow-card-hover ring-2 ring-primary/20'
                  : isCompleted
                  ? 'bg-card shadow-card opacity-80'
                  : 'bg-muted/50 opacity-60'
              }`}
            >
              {/* Step indicator */}
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  isCompleted
                    ? 'bg-success text-success-foreground'
                    : isCurrent
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-border text-muted-foreground'
                }`}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : isLocked ? (
                  <Lock className="h-4 w-4" />
                ) : (
                  <span className="text-sm font-bold">{step.order}</span>
                )}
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div
                  className={`text-sm font-semibold ${
                    isLocked ? 'text-muted-foreground' : 'text-card-foreground'
                  }`}
                >
                  {step.title}
                </div>
                {isCurrent && (
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {step.estimatedTime} · {step.cost}
                  </div>
                )}
              </div>

              {/* Arrow */}
              {!isLocked && (
                <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default JourneyTimeline;

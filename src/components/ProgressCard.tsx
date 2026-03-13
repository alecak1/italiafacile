import { ArrowRight, Map, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { JourneyStep } from '@/types';

interface ProgressCardProps {
  steps: JourneyStep[];
  userName: string;
}

const ProgressCard = ({ steps, userName }: ProgressCardProps) => {
  const navigate = useNavigate();
  const completedCount = steps.filter((s) => s.status === 'completed').length;
  const totalCount = steps.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const currentStep = steps.find((s) => s.status === 'current');

  return (
    <div className="relative overflow-hidden rounded-3xl gradient-hero p-6 text-primary-foreground shadow-hero animate-fade-in">
      {/* Decorative circles */}
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
      <div className="absolute -right-2 top-8 h-12 w-12 rounded-full bg-white/5" />

      <div className="relative">
        <div className="mb-1 flex items-center gap-1.5">
          <Map className="h-4 w-4 opacity-80" />
          <span className="text-xs font-medium opacity-80">Il tuo percorso</span>
        </div>

        <div className="mb-4 flex items-end gap-2">
          <span className="text-4xl font-extrabold leading-none">{Math.round(progress)}%</span>
          <span className="mb-1 text-sm font-medium opacity-80">completato</span>
        </div>

        {/* Progress bar */}
        <div className="mb-5 h-3 overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-white transition-all duration-1000 ease-out"
            style={{ width: `${Math.max(progress, 3)}%` }}
          />
        </div>

        {/* Next step CTA - this is the KEY action */}
        {currentStep && (
          <button
            onClick={() => navigate(`/step/${currentStep.id}`)}
            className="flex w-full items-center gap-3 rounded-2xl bg-white/20 p-4 backdrop-blur-sm transition-all hover:bg-white/30 active:scale-[0.98]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/25">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-[10px] font-semibold uppercase tracking-wider opacity-70">Prossimo passo</div>
              <div className="text-sm font-bold">{currentStep.title}</div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary">
              <ArrowRight className="h-5 w-5" />
            </div>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProgressCard;

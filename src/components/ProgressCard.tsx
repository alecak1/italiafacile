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
    <div className="relative overflow-hidden rounded-3xl gradient-hero p-7 text-primary-foreground shadow-hero animate-fade-in">
      {/* Decorative elements */}
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/[0.07]" />
      <div className="absolute -right-3 top-12 h-16 w-16 rounded-full bg-white/[0.04]" />
      <div className="absolute -left-4 -bottom-4 h-20 w-20 rounded-full bg-white/[0.04]" />

      <div className="relative">
        <div className="mb-1.5 flex items-center gap-2">
          <Map className="h-4 w-4 opacity-70" />
          <span className="text-xs font-semibold uppercase tracking-wider opacity-70">Il tuo percorso</span>
        </div>

        <div className="mb-5 flex items-end gap-2">
          <span className="text-5xl font-black leading-none tracking-tight">{Math.round(progress)}%</span>
          <span className="mb-1.5 text-sm font-medium opacity-70">completato</span>
        </div>

        {/* Progress bar */}
        <div className="mb-6 h-2.5 overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-white transition-all duration-1000 ease-out"
            style={{ width: `${Math.max(progress, 3)}%` }}
          />
        </div>

        {/* Next step CTA */}
        {currentStep && (
          <button
            onClick={() => navigate(`/step/${currentStep.id}`)}
            className="flex w-full items-center gap-3.5 rounded-2xl bg-white/15 p-4 backdrop-blur-sm transition-all hover:bg-white/25 active:scale-[0.98]"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-60">Prossimo passo</div>
              <div className="mt-0.5 text-sm font-bold">{currentStep.title}</div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary shadow-xs">
              <ArrowRight className="h-5 w-5" />
            </div>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProgressCard;

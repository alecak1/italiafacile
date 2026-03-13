import { ArrowRight } from 'lucide-react';
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
    <div className="rounded-2xl bg-primary p-5 text-primary-foreground shadow-elevated animate-fade-in">
      <div className="mb-1 text-sm font-medium opacity-90">Il tuo percorso</div>
      <div className="mb-3 text-2xl font-bold">
        {Math.round(progress)}% completato
      </div>

      {/* Progress bar */}
      <div className="mb-4 h-2.5 overflow-hidden rounded-full bg-primary-foreground/20">
        <div
          className="h-full rounded-full bg-primary-foreground transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {currentStep && (
        <div className="flex items-center justify-between rounded-xl bg-primary-foreground/15 p-3">
          <div>
            <div className="text-xs font-medium opacity-80">Prossimo passo</div>
            <div className="text-sm font-semibold">{currentStep.title}</div>
          </div>
          <button
            onClick={() => navigate(`/step/${currentStep.id}`)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/20 transition-colors hover:bg-primary-foreground/30"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProgressCard;

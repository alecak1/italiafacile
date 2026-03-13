import { useState } from 'react';
import JourneyTimeline from '@/components/JourneyTimeline';
import { mockJourneySteps } from '@/data/mockData';

const Journey = () => {
  const [steps] = useState(mockJourneySteps);
  const completedCount = steps.filter((s) => s.status === 'completed').length;
  const totalCount = steps.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-12 pb-2">
        <h1 className="text-2xl font-bold text-foreground">Il tuo Percorso</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {completedCount} di {totalCount} passi completati
        </p>
      </div>

      {/* Progress bar */}
      <div className="px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-primary transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm font-bold text-primary">{Math.round(progress)}%</span>
        </div>
      </div>

      <div className="px-5 py-4">
        <JourneyTimeline steps={steps} />
      </div>
    </div>
  );
};

export default Journey;

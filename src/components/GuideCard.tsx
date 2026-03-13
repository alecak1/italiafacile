import { Clock, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Guide } from '@/types';

interface GuideCardProps {
  guide: Guide;
}

const GuideCard = ({ guide }: GuideCardProps) => {
  const navigate = useNavigate();

  const categoryColors: Record<string, string> = {
    documenti: 'bg-secondary/10 text-secondary',
    casa: 'bg-warning/10 text-warning',
    lavoro: 'bg-primary/10 text-primary',
    sanita: 'bg-success/10 text-success',
    vita: 'bg-accent text-accent-foreground',
  };

  const categoryLabels: Record<string, string> = {
    documenti: 'Documenti',
    casa: 'Casa',
    lavoro: 'Lavoro',
    sanita: 'Sanità',
    vita: 'Vita',
  };

  return (
    <button
      onClick={() => navigate(`/guide/${guide.id}`)}
      className="flex w-full items-start gap-3 rounded-2xl bg-card p-4 text-left shadow-card transition-all hover:shadow-card-hover"
    >
      <div className="min-w-0 flex-1">
        <div className="mb-2 flex items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
              categoryColors[guide.category] || 'bg-muted text-muted-foreground'
            }`}
          >
            {categoryLabels[guide.category] || guide.category}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Clock className="h-3 w-3" />
            {guide.readingTime}
          </span>
        </div>
        <h3 className="text-sm font-semibold text-card-foreground">{guide.title}</h3>
        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{guide.summary}</p>
      </div>
      <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" />
    </button>
  );
};

export default GuideCard;

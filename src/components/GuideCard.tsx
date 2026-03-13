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
      className="group flex w-full items-start gap-4 rounded-2xl border border-border/60 bg-card p-5 text-left shadow-card transition-all duration-200 hover:shadow-card-hover hover:border-border hover:-translate-y-0.5"
    >
      <div className="min-w-0 flex-1">
        <div className="mb-2.5 flex items-center gap-2.5">
          <span
            className={`rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
              categoryColors[guide.category] || 'bg-muted text-muted-foreground'
            }`}
          >
            {categoryLabels[guide.category] || guide.category}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Clock className="h-3 w-3" />
            {guide.readingTime}
          </span>
        </div>
        <h3 className="text-[15px] font-semibold leading-snug text-card-foreground group-hover:text-primary transition-colors">{guide.title}</h3>
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground line-clamp-2">{guide.summary}</p>
      </div>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted/60 text-muted-foreground transition-all group-hover:bg-primary/10 group-hover:text-primary">
        <ChevronRight className="h-4 w-4" />
      </div>
    </button>
  );
};

export default GuideCard;

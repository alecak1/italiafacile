import { ThumbsUp, MapPin, Star, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { CommunityTip } from '@/hooks/useCommunityInsights';

interface CommunityTipCardProps {
  tip: CommunityTip;
  onVote: (id: string) => void;
}

const CommunityTipCard = ({ tip, onVote }: CommunityTipCardProps) => {
  const { t } = useTranslation();

  return (
    <div className={cn(
      'rounded-2xl border p-4 transition-all',
      tip.is_highlighted
        ? 'border-warning/25 bg-warning/5'
        : 'border-border/40 bg-card shadow-card'
    )}>
      {tip.is_highlighted && (
        <div className="flex items-center gap-1.5 mb-2.5">
          <Star className="h-3.5 w-3.5 text-warning fill-warning" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-warning">
            {t('communityInsights.mostHelpful')}
          </span>
        </div>
      )}

      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/8">
          <Users className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground leading-snug">{tip.title}</p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{tip.description}</p>
          <div className="flex items-center gap-3 mt-2.5">
            {tip.city && (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground">
                <MapPin className="h-3 w-3" /> {tip.city}
              </span>
            )}
            <span className="text-[10px] text-muted-foreground">
              {tip.author_name}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-end">
        <button
          onClick={() => onVote(tip.id)}
          className={cn(
            'flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all active:scale-95',
            tip.user_voted
              ? 'bg-primary/10 text-primary'
              : 'bg-muted/50 text-muted-foreground hover:bg-primary/5 hover:text-primary'
          )}
        >
          <ThumbsUp className={cn('h-3.5 w-3.5', tip.user_voted && 'fill-primary')} />
          {t('communityInsights.useful')} {tip.vote_count > 0 && `(${tip.vote_count})`}
        </button>
      </div>
    </div>
  );
};

export default CommunityTipCard;

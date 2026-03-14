import { useState } from 'react';
import { ThumbsUp, MapPin, Clock, ChevronDown, AlertTriangle, Lightbulb } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { CommunityExperience } from '@/hooks/useCommunityInsights';

interface CommunityExperienceCardProps {
  experience: CommunityExperience;
  onVote: (id: string) => void;
}

const CommunityExperienceCard = ({ experience, onVote }: CommunityExperienceCardProps) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-2xl border border-border/40 bg-card shadow-card overflow-hidden transition-all">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-start gap-3 p-4 text-left"
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground leading-snug">{experience.title}</p>
          <div className="flex items-center gap-3 mt-1.5">
            {experience.city && (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground">
                <MapPin className="h-3 w-3" /> {experience.city}
              </span>
            )}
            {experience.time_required && (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground">
                <Clock className="h-3 w-3" /> {experience.time_required}
              </span>
            )}
            <span className="text-[10px] text-muted-foreground">{experience.author_name}</span>
          </div>
        </div>
        <ChevronDown className={cn(
          'h-4 w-4 shrink-0 text-muted-foreground transition-transform mt-1',
          expanded && 'rotate-180'
        )} />
      </button>

      <div className={cn(
        'grid transition-all duration-300',
        expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
      )}>
        <div className="overflow-hidden">
          <div className="px-4 pb-4 space-y-3">
            {experience.problems && (
              <div className="rounded-xl bg-destructive/5 border border-destructive/10 p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-destructive mb-1">
                      {t('communityInsights.problemsEncountered')}
                    </p>
                    <p className="text-xs leading-relaxed text-foreground/70">{experience.problems}</p>
                  </div>
                </div>
              </div>
            )}

            {experience.advice && (
              <div className="rounded-xl bg-success/5 border border-success/10 p-3">
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-3.5 w-3.5 text-success shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-success mb-1">
                      {t('communityInsights.adviceGiven')}
                    </p>
                    <p className="text-xs leading-relaxed text-foreground/70">{experience.advice}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end">
              <button
                onClick={(e) => { e.stopPropagation(); onVote(experience.id); }}
                className={cn(
                  'flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all active:scale-95',
                  experience.user_voted
                    ? 'bg-primary/10 text-primary'
                    : 'bg-muted/50 text-muted-foreground hover:bg-primary/5 hover:text-primary'
                )}
              >
                <ThumbsUp className={cn('h-3.5 w-3.5', experience.user_voted && 'fill-primary')} />
                {t('communityInsights.useful')} {experience.vote_count > 0 && `(${experience.vote_count})`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityExperienceCard;

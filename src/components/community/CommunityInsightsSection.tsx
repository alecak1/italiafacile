import { useState } from 'react';
import { Users, Lightbulb, BookOpen, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCommunityInsights } from '@/hooks/useCommunityInsights';
import { useAuth } from '@/contexts/AuthContext';
import CommunityTipCard from './CommunityTipCard';
import CommunityExperienceCard from './CommunityExperienceCard';
import { TipSubmissionForm, ExperienceSubmissionForm } from './SubmissionForms';

interface CommunityInsightsSectionProps {
  stepTemplateId: string;
  corridorId?: string | null;
}

const CommunityInsightsSection = ({ stepTemplateId, corridorId }: CommunityInsightsSectionProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { tips, experiences, loading, voteTip, voteExperience, submitTip, submitExperience, refetch } = useCommunityInsights(stepTemplateId, corridorId);
  const [showTipForm, setShowTipForm] = useState(false);
  const [showExpForm, setShowExpForm] = useState(false);

  const handleTipSubmit = async (data: any) => {
    const result = await submitTip(data);
    if (!result.error) await refetch();
    return result;
  };

  const handleExpSubmit = async (data: any) => {
    const result = await submitExperience(data);
    if (!result.error) await refetch();
    return result;
  };

  if (loading) return null;

  const hasTips = tips.length > 0;
  const hasExperiences = experiences.length > 0;
  const hasContent = hasTips || hasExperiences;

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10">
          <Users className="h-4.5 w-4.5 text-accent-foreground" />
        </div>
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {t('communityInsights.title')}
          </h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {t('communityInsights.subtitle')}
          </p>
        </div>
      </div>

      {/* Community label */}
      <div className="flex items-center gap-2 rounded-xl bg-muted/30 px-3 py-2">
        <div className="h-1.5 w-1.5 rounded-full bg-accent" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {t('communityInsights.communityLabel')}
        </span>
      </div>

      {/* Tips section */}
      {hasTips && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-3.5 w-3.5 text-primary" />
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              {t('communityInsights.communityTips')}
            </h3>
          </div>
          {tips.slice(0, 5).map((tip) => (
            <CommunityTipCard key={tip.id} tip={tip} onVote={voteTip} />
          ))}
        </div>
      )}

      {/* Experiences section */}
      {hasExperiences && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-3.5 w-3.5 text-secondary" />
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              {t('communityInsights.userExperiences')}
            </h3>
          </div>
          {experiences.slice(0, 3).map((exp) => (
            <CommunityExperienceCard key={exp.id} experience={exp} onVote={voteExperience} />
          ))}
        </div>
      )}

      {!hasContent && (
        <div className="rounded-2xl border border-dashed border-border bg-muted/20 py-8 text-center">
          <Users className="mx-auto h-6 w-6 text-muted-foreground/40 mb-2" />
          <p className="text-sm text-muted-foreground">{t('communityInsights.noInsightsYet')}</p>
          <p className="text-xs text-muted-foreground/60 mt-1">{t('communityInsights.beFirstToShare')}</p>
        </div>
      )}

      {/* Submission forms */}
      {showTipForm && (
        <TipSubmissionForm
          onSubmit={handleTipSubmit}
          onClose={() => setShowTipForm(false)}
        />
      )}

      {showExpForm && (
        <ExperienceSubmissionForm
          onSubmit={handleExpSubmit}
          onClose={() => setShowExpForm(false)}
        />
      )}

      {/* CTAs to contribute */}
      {user && !showTipForm && !showExpForm && (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowTipForm(true)}
            className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-primary/30 bg-primary/3 p-3.5 text-xs font-semibold text-primary transition-all hover:bg-primary/5 hover:border-primary/40 active:scale-[0.98]"
          >
            <Plus className="h-3.5 w-3.5" />
            {t('communityInsights.addTip')}
          </button>
          <button
            onClick={() => setShowExpForm(true)}
            className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-secondary/30 bg-secondary/3 p-3.5 text-xs font-semibold text-secondary transition-all hover:bg-secondary/5 hover:border-secondary/40 active:scale-[0.98]"
          >
            <Plus className="h-3.5 w-3.5" />
            {t('communityInsights.shareExperience')}
          </button>
        </div>
      )}
    </div>
  );
};

export default CommunityInsightsSection;

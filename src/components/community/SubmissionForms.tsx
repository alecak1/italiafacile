import { useState } from 'react';
import { X, Lightbulb, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface TipFormProps {
  onSubmit: (data: { title: string; description: string; city: string; category: string }) => Promise<{ error: any }>;
  onClose: () => void;
}

const TIP_CATEGORIES = ['documents', 'office', 'timing', 'general'];

export const TipSubmissionForm = ({ onSubmit, onClose }: TipFormProps) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('general');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) return;
    setSubmitting(true);
    const { error } = await onSubmit({ title, description, city, category });
    setSubmitting(false);
    if (error) {
      toast.error(t('communityInsights.submitError'));
    } else {
      toast.success(t('communityInsights.tipSubmitted'));
      onClose();
    }
  };

  return (
    <div className="rounded-2xl border border-primary/20 bg-card p-5 shadow-elevated space-y-4 animate-scale-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground">{t('communityInsights.addTip')}</h3>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div>
        <label className="text-xs font-semibold text-muted-foreground">{t('communityInsights.tipTitle')}</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          placeholder={t('communityInsights.tipTitlePlaceholder')}
          className="mt-1.5 w-full rounded-xl border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-muted-foreground">{t('communityInsights.tipDescription')}</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={1000}
          rows={3}
          placeholder={t('communityInsights.tipDescPlaceholder')}
          className="mt-1.5 w-full resize-none rounded-xl border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <p className="mt-1 text-right text-[10px] text-muted-foreground">{description.length}/1000</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-muted-foreground">{t('communityInsights.city')}</label>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            maxLength={100}
            placeholder="Es. Milano"
            className="mt-1.5 w-full rounded-xl border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground">{t('communityInsights.category')}</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-border bg-background p-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {TIP_CATEGORIES.map(c => (
              <option key={c} value={c}>{t(`communityInsights.cat_${c}`)}</option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground italic">
        {t('communityInsights.moderationNotice')}
      </p>

      <button
        onClick={handleSubmit}
        disabled={!title.trim() || !description.trim() || submitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl gradient-hero py-3 text-sm font-bold text-primary-foreground shadow-cta disabled:opacity-40 transition-all"
      >
        {submitting ? t('communityInsights.submitting') : t('communityInsights.submitTip')}
      </button>
    </div>
  );
};

interface ExperienceFormProps {
  onSubmit: (data: { title: string; city: string; time_required: string; problems: string; advice: string }) => Promise<{ error: any }>;
  onClose: () => void;
}

export const ExperienceSubmissionForm = ({ onSubmit, onClose }: ExperienceFormProps) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [city, setCity] = useState('');
  const [timeRequired, setTimeRequired] = useState('');
  const [problems, setProblems] = useState('');
  const [advice, setAdvice] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !advice.trim()) return;
    setSubmitting(true);
    const { error } = await onSubmit({ title, city, time_required: timeRequired, problems, advice });
    setSubmitting(false);
    if (error) {
      toast.error(t('communityInsights.submitError'));
    } else {
      toast.success(t('communityInsights.experienceSubmitted'));
      onClose();
    }
  };

  return (
    <div className="rounded-2xl border border-primary/20 bg-card p-5 shadow-elevated space-y-4 animate-scale-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground">{t('communityInsights.shareExperience')}</h3>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div>
        <label className="text-xs font-semibold text-muted-foreground">{t('communityInsights.expTitle')}</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          placeholder={t('communityInsights.expTitlePlaceholder')}
          className="mt-1.5 w-full rounded-xl border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-muted-foreground">{t('communityInsights.city')}</label>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            maxLength={100}
            placeholder="Es. Milano"
            className="mt-1.5 w-full rounded-xl border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground">{t('communityInsights.timeRequired')}</label>
          <input
            value={timeRequired}
            onChange={(e) => setTimeRequired(e.target.value)}
            maxLength={100}
            placeholder="Es. 2 ore"
            className="mt-1.5 w-full rounded-xl border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-muted-foreground">{t('communityInsights.whatWentWrong')}</label>
        <textarea
          value={problems}
          onChange={(e) => setProblems(e.target.value)}
          maxLength={2000}
          rows={3}
          placeholder={t('communityInsights.problemsPlaceholder')}
          className="mt-1.5 w-full resize-none rounded-xl border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-muted-foreground">{t('communityInsights.yourAdvice')}</label>
        <textarea
          value={advice}
          onChange={(e) => setAdvice(e.target.value)}
          maxLength={2000}
          rows={3}
          placeholder={t('communityInsights.advicePlaceholder')}
          className="mt-1.5 w-full resize-none rounded-xl border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <p className="text-[11px] text-muted-foreground italic">
        {t('communityInsights.moderationNotice')}
      </p>

      <button
        onClick={handleSubmit}
        disabled={!title.trim() || !advice.trim() || submitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl gradient-hero py-3 text-sm font-bold text-primary-foreground shadow-cta disabled:opacity-40 transition-all"
      >
        {submitting ? t('communityInsights.submitting') : t('communityInsights.submitExperience')}
      </button>
    </div>
  );
};

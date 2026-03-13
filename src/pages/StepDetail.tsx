import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Euro, FileText, Check, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useProfile } from '@/hooks/useProfile';
import { useJourney } from '@/hooks/useJourney';

const StepDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { profile } = useProfile();
  const { steps, updateChecklist, completeStep } = useJourney(profile?.corridor_id);

  const step = steps.find((s) => s.id === id);

  if (!step) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
      </div>
    );
  }

  const toggleItem = (checklistIndex: number) => updateChecklist(step.id, checklistIndex);
  const allChecked = step.checklist.every((item) => item.checked);
  const checkedCount = step.checklist.filter((item) => item.checked).length;

  const handleComplete = async () => {
    if (allChecked) { await completeStep(step.id); navigate('/journey'); }
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="sticky top-0 z-10 glass-strong border-b border-border/30 flex items-center gap-3 px-5 py-4">
        <button onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted transition-colors">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <span className="text-xs font-semibold text-muted-foreground">{t('step.stepOf', { current: step.step_order, total: steps.length })}</span>
      </div>

      <div className="px-6">
        <div className="animate-fade-in mb-7 pt-2">
          <div className="mb-3 inline-flex items-center rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
            {step.status === 'current' ? t('step.currentStep') : step.status === 'completed' ? t('step.completedStep') : t('step.lockedStep')}
          </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">{step.title}</h1>
          <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{step.explanation}</p>
        </div>

        <div className="animate-slide-up mb-6 rounded-2xl border border-secondary/20 bg-secondary/5 p-5">
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-secondary">{t('step.whyImportant')}</h3>
          <p className="text-sm leading-relaxed text-foreground">{step.why_it_matters}</p>
        </div>

        <div className="mb-6 grid grid-cols-3 gap-3 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-card text-center">
            <Clock className="mx-auto mb-1.5 h-4 w-4 text-muted-foreground" />
            <p className="text-[10px] font-medium text-muted-foreground">{t('step.time')}</p>
            <p className="mt-0.5 text-xs font-bold text-foreground">{step.estimated_time}</p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-card text-center">
            <Euro className="mx-auto mb-1.5 h-4 w-4 text-muted-foreground" />
            <p className="text-[10px] font-medium text-muted-foreground">{t('step.cost')}</p>
            <p className="mt-0.5 text-xs font-bold text-foreground">{step.cost}</p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-card text-center">
            <MapPin className="mx-auto mb-1.5 h-4 w-4 text-muted-foreground" />
            <p className="text-[10px] font-medium text-muted-foreground">{t('step.where')}</p>
            <p className="mt-0.5 text-xs font-bold text-foreground line-clamp-2">{step.where_to_go.split(' ').slice(0, 3).join(' ')}</p>
          </div>
        </div>

        <div className="mb-6 animate-slide-up" style={{ animationDelay: '150ms' }}>
          <h3 className="mb-3 text-sm font-bold text-foreground">{t('step.whereToGo')}</h3>
          <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-card">
            <MapPin className="h-5 w-5 shrink-0 text-primary" />
            <p className="flex-1 text-sm text-foreground">{step.where_to_go}</p>
            <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
          </div>
        </div>

        <div className="mb-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <h3 className="mb-3 text-sm font-bold text-foreground">{t('step.requiredDocs')}</h3>
          <div className="space-y-2">
            {step.documents.map((doc, i) => (
              <div key={i} className="flex items-start gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-card">
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{doc.name}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{doc.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8 animate-slide-up" style={{ animationDelay: '250ms' }}>
          <h3 className="mb-3 text-sm font-bold text-foreground">{t('step.checklist')}</h3>
          <div className="space-y-2">
            {step.checklist.map((item, index) => (
              <button key={item.id} onClick={() => toggleItem(index)}
                className={`flex w-full items-center gap-3.5 rounded-2xl border p-4 text-left transition-all duration-200 ${
                  item.checked ? 'border-success/30 bg-success/5' : 'border-border/60 bg-card shadow-card hover:shadow-card-hover'
                }`}>
                <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-all ${
                  item.checked ? 'border-success bg-success' : 'border-border'
                }`}>
                  {item.checked && <Check className="h-3.5 w-3.5 text-success-foreground" />}
                </div>
                <span className={`text-sm ${item.checked ? 'text-muted-foreground line-through' : 'text-foreground font-medium'}`}>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 z-20 border-t border-border/30 glass-strong px-6 py-4 safe-bottom">
        <button onClick={handleComplete} disabled={!allChecked}
          className="flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl gradient-hero text-base font-bold text-primary-foreground shadow-cta transition-all active:scale-[0.98] disabled:opacity-40 disabled:shadow-none">
          <Check className="h-5 w-5" />
          {allChecked ? t('step.markComplete') : t('step.completeChecklist', { done: checkedCount, total: step.checklist.length })}
        </button>
      </div>
    </div>
  );
};

export default StepDetail;

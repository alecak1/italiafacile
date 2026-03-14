import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Euro, FileText, Check, ExternalLink, Lightbulb, ChevronRight, Sparkles } from 'lucide-react';
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
  const progressPercent = step.checklist.length > 0 ? (checkedCount / step.checklist.length) * 100 : 0;

  const handleComplete = async () => {
    if (allChecked) { await completeStep(step.id); navigate('/journey'); }
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* ── Top bar ── */}
      <div className="sticky top-0 z-20 glass-strong border-b border-border/20">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-5 py-3">
          <button
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted transition-colors active:scale-95"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          {/* Mini progress in top bar */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-muted-foreground">
              {t('step.stepOf', { current: step.step_order, total: steps.length })}
            </span>
            <div className="hidden sm:flex items-center gap-1">
              {steps.map((s, i) => (
                <div
                  key={s.id}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    s.id === step.id ? 'w-6 bg-primary' :
                    s.status === 'completed' ? 'w-3 bg-primary/40' :
                    'w-3 bg-border'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="w-9" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* ── Hero Illustration (wider than content) ── */}
      {step.image_url && (
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 mt-6 mb-8 animate-fade-in">
          <div className="relative w-full overflow-hidden rounded-[20px] md:rounded-[24px] shadow-card">
            <img
              src={step.image_url}
              alt={step.title}
              className="w-full h-[200px] md:h-[320px] object-cover"
            />
            {/* Soft side fades */}
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background/60 to-transparent" />
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background/60 to-transparent" />
            {/* Soft bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background/80 to-transparent" />
          </div>
        </div>
      )}

      <div className="max-w-[1100px] mx-auto px-5 md:px-8">

        {/* ── Step indicator + Progress ── */}
        <div className="mb-6 animate-fade-in">
          <div className="flex items-center gap-2.5 mb-4">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
              step.status === 'completed'
                ? 'bg-success/10 text-success'
                : step.status === 'current'
                  ? 'bg-primary/10 text-primary'
                  : 'bg-muted text-muted-foreground'
            }`}>
              {step.status === 'completed' && <Check className="h-3.5 w-3.5" />}
              {step.status === 'current' && <Sparkles className="h-3.5 w-3.5" />}
              {t('step.stepOf', { current: step.step_order, total: steps.length })}
            </span>
            <span className="text-xs font-medium text-muted-foreground">{step.category}</span>
          </div>

          {/* Title */}
          <h1 className="text-[26px] md:text-[32px] font-black tracking-tight leading-[1.15] text-foreground mb-3">
            {step.title}
          </h1>
          {/* Description */}
          <p className="text-[15px] md:text-base leading-relaxed text-muted-foreground max-w-2xl">
            {step.explanation}
          </p>

          {/* Progress bar */}
          {step.checklist.length > 0 && (
            <div className="mt-5 flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full gradient-hero transition-all duration-500 ease-out"
                  style={{ width: `${Math.max(progressPercent, 3)}%` }}
                />
              </div>
              <span className="text-xs font-bold text-muted-foreground whitespace-nowrap">
                {checkedCount}/{step.checklist.length}
              </span>
            </div>
          )}
        </div>

        {/* ── Info Cards ── */}
        <div className="mb-8 grid grid-cols-3 gap-3 animate-slide-up" style={{ animationDelay: '80ms' }}>
          {[
            { icon: Clock, label: t('step.time'), value: step.estimated_time },
            { icon: Euro, label: t('step.cost'), value: step.cost },
            { icon: MapPin, label: t('step.where'), value: step.where_to_go.split(' ').slice(0, 3).join(' ') },
          ].map(({ icon: Icon, label, value }, i) => (
            <div
              key={i}
              className="flex flex-col items-center rounded-2xl border border-border/40 bg-card p-5 shadow-card text-center transition-all hover:shadow-card-hover"
            >
              <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/8">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{label}</p>
              <p className="text-sm font-bold text-foreground leading-snug">{value || '—'}</p>
            </div>
          ))}
        </div>

        {/* ── Why Important ── */}
        <div className="mb-8 animate-slide-up" style={{ animationDelay: '120ms' }}>
          <div className="rounded-2xl border border-warning/15 bg-warning/5 p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-warning/15 mt-0.5">
                <Lightbulb className="h-[18px] w-[18px] text-warning" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-warning mb-2">
                  {t('step.whyImportant')}
                </h3>
                <p className="text-sm leading-relaxed text-foreground/80">
                  {step.why_it_matters}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Where to Go + Documents ── */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up" style={{ animationDelay: '160ms' }}>
          {/* Where */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              {t('step.whereToGo')}
            </h3>
            <button className="flex w-full items-center gap-3.5 rounded-2xl border border-border/40 bg-card p-4 shadow-card transition-all hover:shadow-card-hover hover:border-primary/20 active:scale-[0.99]">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/8">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-foreground leading-snug">{step.where_to_go}</p>
              </div>
              <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
            </button>
          </div>

          {/* Documents */}
          {step.documents.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                <FileText className="h-3.5 w-3.5 text-secondary" />
                {t('step.requiredDocs')}
              </h3>
              <div className="space-y-2.5">
                {step.documents.map((doc, i) => (
                  <div key={i} className="flex items-center gap-3.5 rounded-2xl border border-border/40 bg-card p-4 shadow-card transition-all hover:shadow-card-hover">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/8">
                      <FileText className="h-5 w-5 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">{doc.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{doc.description}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-border" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Checklist ── */}
        <div className="mb-12 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">{t('step.checklist')}</h3>

          {step.checklist.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-muted/30 py-10 text-center">
              <Check className="mx-auto h-6 w-6 text-muted-foreground/40 mb-2" />
              <p className="text-sm text-muted-foreground">Nessun elemento nella checklist</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {step.checklist.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => toggleItem(index)}
                  className={`group flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-300 ${
                    item.checked
                      ? 'border-success/20 bg-success/5'
                      : 'border-border/40 bg-card shadow-card hover:shadow-card-hover hover:border-primary/20'
                  }`}
                >
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 transition-all duration-300 ${
                    item.checked
                      ? 'border-success bg-success'
                      : 'border-border group-hover:border-primary/40'
                  }`}>
                    <Check className={`h-4 w-4 transition-all duration-300 ${
                      item.checked
                        ? 'text-success-foreground opacity-100 scale-100'
                        : 'text-transparent opacity-0 scale-75'
                    }`} />
                  </div>
                  <span className={`text-sm leading-snug transition-all duration-300 ${
                    item.checked
                      ? 'text-muted-foreground line-through'
                      : 'text-foreground font-medium'
                  }`}>
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Completion celebration */}
          {allChecked && step.checklist.length > 0 && (
            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-success/20 bg-success/5 p-5 animate-fade-in">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-success/15">
                <Sparkles className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm font-bold text-success">Tutto completato! 🎉</p>
                <p className="text-xs text-success/70 mt-0.5">Puoi procedere al prossimo step.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Sticky CTA ── */}
      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-border/20 glass-strong safe-bottom">
        <div className="flex justify-center px-5 py-4 max-w-[1100px] mx-auto">
          <button
            onClick={handleComplete}
            disabled={!allChecked}
            className={`flex h-[52px] w-full max-w-lg items-center justify-center gap-2.5 rounded-2xl text-[15px] font-bold transition-all duration-300 active:scale-[0.98] ${
              allChecked
                ? 'gradient-hero text-primary-foreground shadow-cta hover:shadow-hero'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
          >
            <Check className="h-5 w-5" />
            {allChecked
              ? t('step.markComplete')
              : t('step.completeChecklist', { done: checkedCount, total: step.checklist.length })}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepDetail;

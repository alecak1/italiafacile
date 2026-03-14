import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Euro, FileText, Check, ExternalLink, Lightbulb, ChevronRight, Sparkles, MessageCircle } from 'lucide-react';
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
  const stepIndex = steps.findIndex((s) => s.id === id);

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
    <div className="min-h-screen bg-background pb-28">
      {/* ── Hero Image ── */}
      {step.image_url ? (
        <div className="relative w-full">
          <div className="h-[220px] md:h-[300px] w-full overflow-hidden rounded-b-[20px] md:rounded-b-[28px]">
            <img
              src={step.image_url}
              alt={step.title}
              className="h-full w-full object-cover"
            />
          </div>
          {/* Gradient fade into background */}
          <div className="absolute inset-0 rounded-b-[20px] md:rounded-b-[28px] bg-gradient-to-t from-background via-background/30 to-transparent" />
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 flex h-10 w-10 items-center justify-center rounded-full bg-card/80 backdrop-blur-sm shadow-card transition-all hover:shadow-card-hover active:scale-95"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
        </div>
      ) : (
        <div className="sticky top-0 z-10 glass-strong border-b border-border/30">
          <div className="flex items-center gap-3 px-5 py-4">
            <button onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted transition-colors active:scale-95">
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </button>
            <span className="text-xs font-semibold text-muted-foreground">
              {t('step.stepOf', { current: step.step_order, total: steps.length })}
            </span>
          </div>
        </div>
      )}

      <div className="px-6 md:px-8 lg:px-0 w-full max-w-4xl mx-auto">
        {/* ── Step indicator + Category ── */}
        <div className="mt-5 mb-3 flex items-center gap-2 animate-fade-in">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
            <Check className="h-4 w-4 rounded-full bg-primary text-primary-foreground p-0.5" />
            {t('step.stepOf', { current: step.step_order, total: steps.length })}
          </span>
          <span className="text-muted-foreground/40">·</span>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground">
            <FileText className="h-3.5 w-3.5 text-primary" />
            {step.category}
          </span>
        </div>

        {/* ── Title & Description ── */}
        <div className="animate-fade-in mb-8">
          <h1 className="text-[28px] md:text-[34px] font-black tracking-tight leading-[1.15] text-foreground">
            {step.title}
          </h1>
          <p className="mt-3 text-[15px] md:text-base leading-relaxed text-muted-foreground max-w-2xl">
            {step.explanation}
          </p>
        </div>

        {/* ── Info Cards Row (4 cards like reference) ── */}
        <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-3 animate-slide-up" style={{ animationDelay: '80ms' }}>
          {[
            { icon: Clock, label: t('step.time'), value: step.estimated_time },
            { icon: Euro, label: t('step.cost'), value: step.cost },
            { icon: MapPin, label: t('step.where'), value: step.where_to_go.split(' ').slice(0, 3).join(' ') },
            { icon: MessageCircle, label: t('step.help', 'Aiuto'), value: null },
          ].map(({ icon: Icon, label, value }, i) => (
            <div
              key={i}
              className="flex flex-col items-center rounded-2xl border border-border/50 bg-card p-5 shadow-card text-center min-h-[110px] justify-center transition-all hover:shadow-card-hover"
            >
              <div className="mb-2.5 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/8">
                <Icon className="h-[18px] w-[18px] text-primary" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{label}</p>
              {value ? (
                <p className="text-sm font-bold text-foreground leading-snug">{value}</p>
              ) : (
                <div className="flex gap-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── Two-column: Why Important + Where to Go ── */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up" style={{ animationDelay: '120ms' }}>
          {/* Why Important */}
          <div className="rounded-2xl bg-warning/5 border border-warning/15 p-6">
            <div className="flex items-start gap-3 mb-3">
              <Lightbulb className="h-5 w-5 text-warning shrink-0 mt-0.5" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-warning">
                {t('step.whyImportant')}
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-foreground/80 pl-8">
              {step.why_it_matters}
            </p>
          </div>

          {/* Where to Go + Documents */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="h-4 w-4 text-primary" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {t('step.whereToGo')}
              </h3>
            </div>

            {/* Where to go card */}
            <button className="flex w-full items-center gap-3.5 rounded-2xl border border-border/50 bg-card p-4 shadow-card transition-all hover:shadow-card-hover hover:border-primary/20 active:scale-[0.99]">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/8">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-foreground leading-snug">{step.where_to_go}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Documento di identità valido</p>
              </div>
              <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
            </button>

            {/* Documents inline */}
            {step.documents.map((doc, i) => (
              <div key={i} className="flex items-center gap-3.5 rounded-2xl border border-border/50 bg-card p-4 shadow-card">
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

        {/* ── Checklist ── */}
        <div className="mb-10 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t('step.checklist')}</h3>
            <span className="text-xs font-semibold text-muted-foreground">
              {checkedCount}/{step.checklist.length}
            </span>
          </div>

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
                      ? 'border-success/25 bg-success/5'
                      : 'border-border/50 bg-card shadow-card hover:shadow-card-hover hover:border-primary/20'
                  }`}
                >
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 transition-all duration-300 ${
                    item.checked
                      ? 'border-success bg-success scale-100'
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
            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-success/20 bg-success/5 p-4 animate-fade-in">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-success/15">
                <Sparkles className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm font-bold text-success">Tutto completato!</p>
                <p className="text-xs text-success/70">Puoi procedere al prossimo step.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Sticky CTA ── */}
      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-border/20 glass-strong safe-bottom">
        <div className="flex justify-center px-6 py-4 md:max-w-3xl md:mx-auto">
          <button
            onClick={handleComplete}
            disabled={!allChecked}
            className={`flex h-14 w-full max-w-md items-center justify-center gap-2.5 rounded-2xl text-base font-bold transition-all duration-300 active:scale-[0.98] ${
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

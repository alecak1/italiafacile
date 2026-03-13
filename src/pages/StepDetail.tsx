import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Euro, FileText, Check, ExternalLink } from 'lucide-react';
import { mockJourneySteps } from '@/data/mockData';
import { useState } from 'react';

const StepDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const step = mockJourneySteps.find((s) => s.id === id);

  const [checklist, setChecklist] = useState(step?.checklist || []);

  if (!step) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Passo non trovato.</p>
      </div>
    );
  }

  const toggleItem = (itemId: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, checked: !item.checked } : item))
    );
  };

  const allChecked = checklist.every((item) => item.checked);
  const checkedCount = checklist.filter((item) => item.checked).length;

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 glass-strong border-b border-border/30 flex items-center gap-3 px-5 py-4">
        <button onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted transition-colors">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <span className="text-xs font-semibold text-muted-foreground">Passo {step.order} di {mockJourneySteps.length}</span>
      </div>

      <div className="px-6">
        {/* Title */}
        <div className="animate-fade-in mb-7 pt-2">
          <div className="mb-3 inline-flex items-center rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
            {step.status === 'current' ? '📍 Passo attuale' : step.status === 'completed' ? '✅ Completato' : '🔒 Bloccato'}
          </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">{step.title}</h1>
          <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{step.explanation}</p>
        </div>

        {/* Why it matters */}
        <div className="animate-slide-up mb-6 rounded-2xl border border-secondary/20 bg-secondary/5 p-5">
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-secondary">💡 Perché è importante</h3>
          <p className="text-sm leading-relaxed text-foreground">{step.whyItMatters}</p>
        </div>

        {/* Info cards */}
        <div className="mb-6 grid grid-cols-3 gap-3 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-card text-center">
            <Clock className="mx-auto mb-1.5 h-4 w-4 text-muted-foreground" />
            <p className="text-[10px] font-medium text-muted-foreground">Tempo</p>
            <p className="mt-0.5 text-xs font-bold text-foreground">{step.estimatedTime}</p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-card text-center">
            <Euro className="mx-auto mb-1.5 h-4 w-4 text-muted-foreground" />
            <p className="text-[10px] font-medium text-muted-foreground">Costo</p>
            <p className="mt-0.5 text-xs font-bold text-foreground">{step.cost}</p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-card text-center">
            <MapPin className="mx-auto mb-1.5 h-4 w-4 text-muted-foreground" />
            <p className="text-[10px] font-medium text-muted-foreground">Dove</p>
            <p className="mt-0.5 text-xs font-bold text-foreground line-clamp-2">{step.whereToGo.split(' ').slice(0, 3).join(' ')}</p>
          </div>
        </div>

        {/* Where to go */}
        <div className="mb-6 animate-slide-up" style={{ animationDelay: '150ms' }}>
          <h3 className="mb-3 text-sm font-bold text-foreground">📍 Dove andare</h3>
          <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-card">
            <MapPin className="h-5 w-5 shrink-0 text-primary" />
            <p className="flex-1 text-sm text-foreground">{step.whereToGo}</p>
            <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
          </div>
        </div>

        {/* Documents */}
        <div className="mb-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <h3 className="mb-3 text-sm font-bold text-foreground">📄 Documenti necessari</h3>
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

        {/* Checklist */}
        <div className="mb-8 animate-slide-up" style={{ animationDelay: '250ms' }}>
          <h3 className="mb-3 text-sm font-bold text-foreground">✅ Checklist</h3>
          <div className="space-y-2">
            {checklist.map((item) => (
              <button
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`flex w-full items-center gap-3.5 rounded-2xl border p-4 text-left transition-all duration-200 ${
                  item.checked
                    ? 'border-success/30 bg-success/5'
                    : 'border-border/60 bg-card shadow-card hover:shadow-card-hover'
                }`}
              >
                <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-all ${
                  item.checked ? 'border-success bg-success' : 'border-border'
                }`}>
                  {item.checked && <Check className="h-3.5 w-3.5 text-success-foreground" />}
                </div>
                <span className={`text-sm ${item.checked ? 'text-muted-foreground line-through' : 'text-foreground font-medium'}`}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky bottom CTA */}
      <div className="sticky bottom-0 z-20 border-t border-border/30 glass-strong px-6 py-4 safe-bottom">
        <button
          disabled={!allChecked}
          className="flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl gradient-hero text-base font-bold text-primary-foreground shadow-cta transition-all active:scale-[0.98] disabled:opacity-40 disabled:shadow-none"
        >
          <Check className="h-5 w-5" />
          {allChecked ? 'Segna come completato' : `Completa la checklist (${checkedCount}/${checklist.length})`}
        </button>
      </div>
    </div>
  );
};

export default StepDetail;

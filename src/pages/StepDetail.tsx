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

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center gap-3 bg-background px-4 py-4">
        <button onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <span className="text-xs font-medium text-muted-foreground">Passo {step.order} di {mockJourneySteps.length}</span>
      </div>

      <div className="px-5">
        {/* Title */}
        <div className="animate-fade-in mb-6">
          <div className="mb-2 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {step.status === 'current' ? '📍 Passo attuale' : step.status === 'completed' ? '✅ Completato' : '🔒 Bloccato'}
          </div>
          <h1 className="text-2xl font-bold text-foreground">{step.title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.explanation}</p>
        </div>

        {/* Why it matters */}
        <div className="animate-slide-up mb-5 rounded-2xl bg-secondary/5 p-4">
          <h3 className="mb-1.5 text-xs font-semibold text-secondary">💡 Perché è importante</h3>
          <p className="text-sm leading-relaxed text-foreground">{step.whyItMatters}</p>
        </div>

        {/* Info cards */}
        <div className="mb-5 grid grid-cols-3 gap-3 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="rounded-xl bg-card p-3 shadow-card text-center">
            <Clock className="mx-auto mb-1 h-4 w-4 text-muted-foreground" />
            <p className="text-[10px] text-muted-foreground">Tempo</p>
            <p className="text-xs font-semibold text-foreground">{step.estimatedTime}</p>
          </div>
          <div className="rounded-xl bg-card p-3 shadow-card text-center">
            <Euro className="mx-auto mb-1 h-4 w-4 text-muted-foreground" />
            <p className="text-[10px] text-muted-foreground">Costo</p>
            <p className="text-xs font-semibold text-foreground">{step.cost}</p>
          </div>
          <div className="rounded-xl bg-card p-3 shadow-card text-center">
            <MapPin className="mx-auto mb-1 h-4 w-4 text-muted-foreground" />
            <p className="text-[10px] text-muted-foreground">Dove</p>
            <p className="text-xs font-semibold text-foreground line-clamp-2">{step.whereToGo.split(' ').slice(0, 3).join(' ')}</p>
          </div>
        </div>

        {/* Where to go */}
        <div className="mb-5 animate-slide-up" style={{ animationDelay: '150ms' }}>
          <h3 className="mb-2 text-sm font-semibold text-foreground">📍 Dove andare</h3>
          <div className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-card">
            <MapPin className="h-5 w-5 shrink-0 text-primary" />
            <p className="flex-1 text-sm text-foreground">{step.whereToGo}</p>
            <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
          </div>
        </div>

        {/* Documents */}
        <div className="mb-5 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <h3 className="mb-2 text-sm font-semibold text-foreground">📄 Documenti necessari</h3>
          <div className="space-y-2">
            {step.documents.map((doc, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl bg-card p-3 shadow-card">
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                <div>
                  <p className="text-sm font-medium text-foreground">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">{doc.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Checklist */}
        <div className="mb-8 animate-slide-up" style={{ animationDelay: '250ms' }}>
          <h3 className="mb-2 text-sm font-semibold text-foreground">✅ Checklist</h3>
          <div className="space-y-2">
            {checklist.map((item) => (
              <button
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className="flex w-full items-center gap-3 rounded-xl bg-card p-3 shadow-card text-left transition-all"
              >
                <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-all ${
                  item.checked ? 'border-success bg-success' : 'border-border'
                }`}>
                  {item.checked && <Check className="h-3.5 w-3.5 text-success-foreground" />}
                </div>
                <span className={`text-sm ${item.checked ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Sticky bottom CTA */}
      <div className="sticky bottom-0 z-20 border-t border-border bg-card/95 backdrop-blur-md px-5 py-4 safe-bottom">
        <button
          disabled={!allChecked}
          className="flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl gradient-hero text-base font-bold text-primary-foreground shadow-cta transition-all active:scale-[0.98] disabled:opacity-40 disabled:shadow-none"
        >
          <Check className="h-5 w-5" />
          {allChecked ? 'Segna come completato' : `Completa la checklist (${checklist.filter(i => i.checked).length}/${checklist.length})`}
        </button>
      </div>
    </div>
  );
};

export default StepDetail;

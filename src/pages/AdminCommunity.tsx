import { useState, useEffect } from 'react';
import { useAdminCommunityModeration } from '@/hooks/useCommunityInsights';
import { Trash2, Check, X, Star, Lightbulb, BookOpen, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-warning/10 text-warning',
  approved: 'bg-success/10 text-success',
  rejected: 'bg-destructive/10 text-destructive',
};

const AdminCommunity = () => {
  const { tips, experiences, loading, updateTipStatus, updateExperienceStatus, toggleHighlight, deleteTip, deleteExperience } = useAdminCommunityModeration();
  const [tab, setTab] = useState<'tips' | 'experiences' | 'questions'>('tips');

  // Keep legacy questions moderation
  const [questions, setQuestions] = useState<any[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('questions')
        .select('*, answers(id)')
        .order('created_at', { ascending: false });
      if (data) {
        setQuestions(data.map((q: any) => ({ ...q, answer_count: Array.isArray(q.answers) ? q.answers.length : 0 })));
      }
      setQuestionsLoading(false);
    })();
  }, []);

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm('Eliminare questa domanda e tutte le risposte?')) return;
    await supabase.from('answers').delete().eq('question_id', id);
    await supabase.from('questions').delete().eq('id', id);
    setQuestions(prev => prev.filter(q => q.id !== id));
    toast.success('Domanda eliminata');
  };

  const tabs = [
    { key: 'tips' as const, label: 'Consigli', icon: Lightbulb, count: tips.filter(t => t.status === 'pending').length },
    { key: 'experiences' as const, label: 'Esperienze', icon: BookOpen, count: experiences.filter(e => e.status === 'pending').length },
    { key: 'questions' as const, label: 'Domande', icon: MessageCircle, count: 0 },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-black text-foreground">Moderazione Community</h2>

      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map(({ key, label, icon: Icon, count }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-all',
              tab === key ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
            {count > 0 && (
              <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-warning text-[10px] font-bold text-warning-foreground">
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
        </div>
      ) : (
        <>
          {/* Tips tab */}
          {tab === 'tips' && (
            <div className="space-y-2">
              {tips.length === 0 && <p className="text-sm text-muted-foreground py-8 text-center">Nessun consiglio</p>}
              {tips.map((tip) => (
                <div key={tip.id} className="rounded-2xl border border-border bg-card p-4 shadow-card">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn('rounded-md px-2 py-0.5 text-[10px] font-bold uppercase', STATUS_COLORS[tip.status])}>
                          {tip.status}
                        </span>
                        {tip.is_highlighted && <Star className="h-3.5 w-3.5 text-warning fill-warning" />}
                      </div>
                      <p className="text-sm font-semibold text-foreground">{tip.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{tip.description}</p>
                      <p className="text-[10px] text-muted-foreground mt-1.5">
                        {tip.author_name} · {tip.city || '—'} · {new Date(tip.created_at).toLocaleDateString('it-IT')}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {tip.status === 'pending' && (
                        <>
                          <button onClick={() => { updateTipStatus(tip.id, 'approved'); toast.success('Approvato'); }}
                            className="rounded-lg p-2 text-success hover:bg-success/10 transition-colors">
                            <Check className="h-4 w-4" />
                          </button>
                          <button onClick={() => { updateTipStatus(tip.id, 'rejected'); toast.success('Rifiutato'); }}
                            className="rounded-lg p-2 text-destructive hover:bg-destructive/10 transition-colors">
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      <button onClick={() => { toggleHighlight(tip.id, tip.is_highlighted); toast.success(tip.is_highlighted ? 'Rimosso highlight' : 'Evidenziato'); }}
                        className="rounded-lg p-2 text-warning hover:bg-warning/10 transition-colors">
                        <Star className={cn('h-4 w-4', tip.is_highlighted && 'fill-warning')} />
                      </button>
                      <button onClick={() => { if (confirm('Eliminare?')) { deleteTip(tip.id); toast.success('Eliminato'); } }}
                        className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Experiences tab */}
          {tab === 'experiences' && (
            <div className="space-y-2">
              {experiences.length === 0 && <p className="text-sm text-muted-foreground py-8 text-center">Nessuna esperienza</p>}
              {experiences.map((exp) => (
                <div key={exp.id} className="rounded-2xl border border-border bg-card p-4 shadow-card">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn('rounded-md px-2 py-0.5 text-[10px] font-bold uppercase', STATUS_COLORS[exp.status])}>
                          {exp.status}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-foreground">{exp.title}</p>
                      {exp.problems && <p className="text-xs text-muted-foreground mt-0.5">Problemi: {exp.problems.slice(0, 100)}...</p>}
                      {exp.advice && <p className="text-xs text-muted-foreground mt-0.5">Consiglio: {exp.advice.slice(0, 100)}...</p>}
                      <p className="text-[10px] text-muted-foreground mt-1.5">
                        {exp.author_name} · {exp.city || '—'} · {new Date(exp.created_at).toLocaleDateString('it-IT')}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {exp.status === 'pending' && (
                        <>
                          <button onClick={() => { updateExperienceStatus(exp.id, 'approved'); toast.success('Approvato'); }}
                            className="rounded-lg p-2 text-success hover:bg-success/10 transition-colors">
                            <Check className="h-4 w-4" />
                          </button>
                          <button onClick={() => { updateExperienceStatus(exp.id, 'rejected'); toast.success('Rifiutato'); }}
                            className="rounded-lg p-2 text-destructive hover:bg-destructive/10 transition-colors">
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      <button onClick={() => { if (confirm('Eliminare?')) { deleteExperience(exp.id); toast.success('Eliminato'); } }}
                        className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Questions tab (legacy) */}
          {tab === 'questions' && (
            <div className="space-y-2">
              {questions.map((q) => (
                <div key={q.id} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-card">
                  <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{q.text}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {q.category} • {q.answer_count} risposte • {new Date(q.created_at).toLocaleDateString('it-IT')}
                    </p>
                  </div>
                  <button onClick={() => handleDeleteQuestion(q.id)}
                    className="shrink-0 rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminCommunity;

import { useState } from 'react';
import { Plus, Users, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import QuestionCard from '@/components/QuestionCard';
import { useProfile } from '@/hooks/useProfile';
import { useCommunity } from '@/hooks/useCommunity';
import { toast } from 'sonner';

const Community = () => {
  const { t } = useTranslation();
  const { profile } = useProfile();
  const { questions, loading, addQuestion } = useCommunity(profile?.corridor_id);
  const [showForm, setShowForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!newQuestion.trim()) return;
    setSubmitting(true);
    const { error } = await addQuestion(newQuestion.trim());
    if (error) {
      toast.error(t('community.publishError'));
    } else {
      setNewQuestion('');
      setShowForm(false);
      toast.success(t('community.published'));
    }
    setSubmitting(false);
  };

  const mappedQuestions = questions.map((q) => ({
    id: q.id,
    authorName: q.author_name || 'Utente',
    text: q.text,
    category: q.category,
    createdAt: new Date(q.created_at).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' }),
    answers: q.answers.map((a) => ({
      id: a.id,
      authorName: a.author_name || 'Utente',
      text: a.text,
      upvotes: a.upvotes,
      createdAt: new Date(a.created_at).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' }),
    })),
  }));

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="bg-card px-6 pt-12 pb-6">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-foreground">{t('community.title')}</h1>
            <p className="text-sm text-muted-foreground">{t('community.subtitle')}</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-5">
        {!showForm ? (
          <button onClick={() => setShowForm(true)}
            className="flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl gradient-hero text-base font-bold text-primary-foreground shadow-cta transition-all active:scale-[0.98] animate-fade-in">
            <Plus className="h-5 w-5" />
            {t('community.askQuestion')}
          </button>
        ) : (
          <div className="space-y-4 rounded-2xl border border-border/60 bg-card p-6 shadow-elevated animate-scale-in">
            <div className="flex items-center gap-2 mb-1">
              <MessageCircle className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">{t('community.yourQuestion')}</span>
            </div>
            <textarea value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)}
              placeholder={t('community.placeholder')}
              className="h-28 w-full resize-none rounded-xl border border-border bg-background p-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              autoFocus />
            <div className="flex gap-3">
              <button onClick={() => { setShowForm(false); setNewQuestion(''); }}
                className="flex-1 rounded-xl border border-border py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted">
                {t('community.cancel')}
              </button>
              <button onClick={handleSubmit} disabled={!newQuestion.trim() || submitting}
                className="flex-1 rounded-xl gradient-hero py-3.5 text-sm font-bold text-primary-foreground shadow-cta disabled:opacity-40 disabled:shadow-none transition-all">
                {submitting ? t('community.publishing') : t('community.publish')}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3 px-6">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
          </div>
        ) : mappedQuestions.length > 0 ? (
          mappedQuestions.map((question, i) => (
            <div key={question.id} className="animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
              <QuestionCard question={question} />
            </div>
          ))
        ) : (
          <div className="py-20 text-center animate-fade-in">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
              <MessageCircle className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="text-sm font-semibold text-foreground">{t('community.noQuestions')}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t('community.beFirst')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;

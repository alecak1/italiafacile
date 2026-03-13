import { useState } from 'react';
import { Plus, Users, MessageCircle } from 'lucide-react';
import QuestionCard from '@/components/QuestionCard';
import { mockQuestions } from '@/data/mockData';

const Community = () => {
  const [showForm, setShowForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="bg-card px-5 pt-12 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">Community</h1>
            <p className="text-sm text-muted-foreground">Domande e risposte da chi ci è passato.</p>
          </div>
        </div>
      </div>

      {/* Ask button - always visible */}
      <div className="px-5 py-4">
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl gradient-hero text-base font-bold text-primary-foreground shadow-cta transition-all active:scale-[0.98] animate-fade-in"
          >
            <Plus className="h-5 w-5" />
            Fai una domanda alla community
          </button>
        ) : (
          <div className="space-y-3 rounded-2xl bg-card p-5 shadow-elevated animate-scale-in">
            <div className="flex items-center gap-2 mb-1">
              <MessageCircle className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">La tua domanda</span>
            </div>
            <textarea
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Scrivi la tua domanda qui..."
              className="h-28 w-full resize-none rounded-xl border border-border bg-background p-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setShowForm(false); setNewQuestion(''); }}
                className="flex-1 rounded-xl border border-border py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                Annulla
              </button>
              <button
                disabled={!newQuestion.trim()}
                className="flex-1 rounded-xl gradient-hero py-3 text-sm font-bold text-primary-foreground shadow-cta disabled:opacity-40"
              >
                Pubblica
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Questions */}
      <div className="space-y-3 px-5">
        {mockQuestions.length > 0 ? (
          mockQuestions.map((question, i) => (
            <div key={question.id} className="animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
              <QuestionCard question={question} />
            </div>
          ))
        ) : (
          <div className="py-16 text-center animate-fade-in">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
              <MessageCircle className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">Nessuna domanda ancora</p>
            <p className="mt-1 text-xs text-muted-foreground">Fai la prima domanda alla community!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;

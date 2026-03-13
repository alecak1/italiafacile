import { useState } from 'react';
import { Plus } from 'lucide-react';
import QuestionCard from '@/components/QuestionCard';
import { mockQuestions } from '@/data/mockData';

const Community = () => {
  const [showForm, setShowForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-12 pb-2">
        <h1 className="text-2xl font-bold text-foreground">Community</h1>
        <p className="mt-1 text-sm text-muted-foreground">Domande e risposte dalla comunità.</p>
      </div>

      {/* Ask button */}
      <div className="px-5 py-3">
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-card text-sm font-medium text-muted-foreground transition-all hover:border-primary hover:text-primary"
          >
            <Plus className="h-4 w-4" />
            Fai una domanda
          </button>
        ) : (
          <div className="space-y-3 rounded-2xl bg-card p-4 shadow-card">
            <textarea
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Scrivi la tua domanda..."
              className="h-24 w-full resize-none rounded-xl border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={() => { setShowForm(false); setNewQuestion(''); }}
                className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium text-foreground"
              >
                Annulla
              </button>
              <button
                disabled={!newQuestion.trim()}
                className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-40"
              >
                Pubblica
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Questions */}
      <div className="space-y-3 px-5">
        {mockQuestions.map((question) => (
          <QuestionCard key={question.id} question={question} />
        ))}
      </div>
    </div>
  );
};

export default Community;

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Trash2, MessageCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface QuestionRow {
  id: string;
  text: string;
  category: string;
  created_at: string;
  user_id: string;
  corridor_id: string | null;
  answer_count: number;
}

const AdminCommunity = () => {
  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQuestions = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('questions')
      .select('*, answers(id)')
      .order('created_at', { ascending: false });

    if (data) {
      setQuestions(data.map((q: any) => ({
        ...q,
        answer_count: Array.isArray(q.answers) ? q.answers.length : 0,
      })));
    }
    setLoading(false);
  };

  useEffect(() => { fetchQuestions(); }, []);

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm('Eliminare questa domanda e tutte le risposte?')) return;
    // Delete answers first
    await supabase.from('answers').delete().eq('question_id', id);
    await supabase.from('questions').delete().eq('id', id);
    toast.success('Domanda eliminata');
    fetchQuestions();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-foreground">Moderazione Community</h2>
        <span className="text-sm text-muted-foreground">{questions.length} domande</span>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary" /></div>
      ) : (
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
    </div>
  );
};

export default AdminCommunity;

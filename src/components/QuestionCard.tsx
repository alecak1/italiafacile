import { MessageCircle, ThumbsUp } from 'lucide-react';
import { Question } from '@/types';

interface QuestionCardProps {
  question: Question;
}

const QuestionCard = ({ question }: QuestionCardProps) => {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card transition-all hover:shadow-card-hover">
      <div className="mb-3 flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
          {question.authorName.charAt(0)}
        </div>
        <div>
          <span className="text-sm font-medium text-foreground">{question.authorName}</span>
          <span className="ml-2 text-[11px] text-muted-foreground">· {question.createdAt}</span>
        </div>
      </div>

      <p className="mb-4 text-sm font-medium leading-relaxed text-card-foreground">{question.text}</p>

      {question.answers.length > 0 ? (
        <div className="space-y-2.5 border-t border-border/60 pt-4">
          {question.answers.slice(0, 1).map((answer) => (
            <div key={answer.id} className="rounded-xl bg-muted/40 p-4">
              <div className="mb-1.5 flex items-center gap-2">
                <span className="text-xs font-semibold text-foreground">{answer.authorName}</span>
              </div>
              <p className="text-[13px] leading-relaxed text-muted-foreground">{answer.text}</p>
              <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <ThumbsUp className="h-3 w-3" />
                <span>{answer.upvotes}</span>
              </div>
            </div>
          ))}
          {question.answers.length > 1 && (
            <button className="text-xs font-semibold text-secondary hover:underline">
              +{question.answers.length - 1} altre risposte
            </button>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-xl bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
          <MessageCircle className="h-3.5 w-3.5" />
          <span>Nessuna risposta ancora. Sii il primo!</span>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;

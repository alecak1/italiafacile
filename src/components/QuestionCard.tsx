import { MessageCircle, ThumbsUp } from 'lucide-react';
import { Question } from '@/types';

interface QuestionCardProps {
  question: Question;
}

const QuestionCard = ({ question }: QuestionCardProps) => {
  return (
    <div className="rounded-2xl bg-card p-4 shadow-card">
      <div className="mb-1 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
          {question.authorName.charAt(0)}
        </div>
        <span className="text-xs font-medium text-foreground">{question.authorName}</span>
        <span className="text-[10px] text-muted-foreground">· {question.createdAt}</span>
      </div>

      <p className="mb-3 text-sm font-medium text-card-foreground">{question.text}</p>

      {question.answers.length > 0 ? (
        <div className="space-y-2 border-t border-border pt-3">
          {question.answers.slice(0, 1).map((answer) => (
            <div key={answer.id} className="rounded-xl bg-muted/50 p-3">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-xs font-medium">{answer.authorName}</span>
              </div>
              <p className="text-xs text-muted-foreground">{answer.text}</p>
              <div className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground">
                <ThumbsUp className="h-3 w-3" />
                <span>{answer.upvotes}</span>
              </div>
            </div>
          ))}
          {question.answers.length > 1 && (
            <p className="text-xs text-secondary font-medium">
              +{question.answers.length - 1} altre risposte
            </p>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MessageCircle className="h-3.5 w-3.5" />
          <span>Nessuna risposta ancora. Sii il primo!</span>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;

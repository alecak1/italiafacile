import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { mockGuides } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';

const GuideDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const guide = mockGuides.find((g) => g.id === id);
  const currentIndex = mockGuides.findIndex((g) => g.id === id);
  const nextGuide = currentIndex >= 0 && currentIndex < mockGuides.length - 1 ? mockGuides[currentIndex + 1] : null;

  if (!guide) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Guida non trovata.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="sticky top-0 z-10 flex items-center gap-3 bg-background px-4 py-4">
        <button onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          {guide.readingTime}
        </div>
      </div>

      <div className="px-5">
        <h1 className="mb-2 text-2xl font-bold text-foreground animate-fade-in">{guide.title}</h1>
        <p className="mb-6 text-sm text-muted-foreground">{guide.summary}</p>

        <div className="space-y-6">
          {guide.sections.map((section, i) => (
            <div key={i} className="animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
              <h2 className="mb-2 text-lg font-semibold text-foreground">{section.title}</h2>
              <p className="mb-3 text-sm leading-relaxed text-muted-foreground">{section.content}</p>
              {section.bullets && (
                <ul className="space-y-2">
                  {section.bullets.map((bullet, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Next actions */}
        <div className="mt-10 space-y-3">
          {nextGuide && (
            <button
              onClick={() => navigate(`/guide/${nextGuide.id}`)}
              className="flex w-full items-center gap-3 rounded-2xl bg-card p-4 shadow-card transition-all hover:shadow-card-hover active:scale-[0.98]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/10">
                <BookOpen className="h-5 w-5 text-secondary" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Prossima guida</div>
                <div className="text-sm font-bold text-foreground">{nextGuide.title}</div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </button>
          )}

          {!user && (
            <button
              onClick={() => navigate('/auth')}
              className="flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl gradient-hero text-base font-bold text-primary-foreground shadow-cta transition-all active:scale-[0.98]"
            >
              Inizia il tuo percorso personalizzato
              <ArrowRight className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuideDetail;

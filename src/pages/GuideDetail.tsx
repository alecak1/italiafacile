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
      <div className="sticky top-0 z-10 glass-strong border-b border-border/30 flex items-center gap-3 px-5 py-4">
        <button onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted transition-colors">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          {guide.readingTime}
        </div>
      </div>

      <div className="px-6">
        <h1 className="mb-3 pt-2 text-2xl font-black tracking-tight text-foreground animate-fade-in">{guide.title}</h1>
        <p className="mb-8 text-sm leading-relaxed text-muted-foreground">{guide.summary}</p>

        <div className="space-y-8">
          {guide.sections.map((section, i) => (
            <div key={i} className="animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
              <h2 className="mb-3 text-lg font-bold text-foreground">{section.title}</h2>
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{section.content}</p>
              {section.bullets && (
                <ul className="space-y-2.5">
                  {section.bullets.map((bullet, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm text-foreground">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Next actions */}
        <div className="mt-12 space-y-3 pb-4">
          {nextGuide && (
            <button
              onClick={() => navigate(`/guide/${nextGuide.id}`)}
              className="group flex w-full items-center gap-3.5 rounded-2xl border border-border/60 bg-card p-5 shadow-card transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary/10">
                <BookOpen className="h-5 w-5 text-secondary" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Prossima guida</div>
                <div className="mt-0.5 text-sm font-bold text-foreground">{nextGuide.title}</div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
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

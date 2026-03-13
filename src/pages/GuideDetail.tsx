import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import { mockGuides } from '@/data/mockData';

const GuideDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const guide = mockGuides.find((g) => g.id === id);

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
      </div>
    </div>
  );
};

export default GuideDetail;

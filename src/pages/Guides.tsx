import { useState } from 'react';
import { Search, BookOpen, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import GuideCard from '@/components/GuideCard';
import { useGuides } from '@/hooks/useGuides';
import { useProfile } from '@/hooks/useProfile';
import { GUIDE_CATEGORIES, GuideCategory } from '@/types';

const Guides = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useProfile();
  const { guides, loading } = useGuides(user ? profile?.corridor_id : undefined);
  const [activeCategory, setActiveCategory] = useState<GuideCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = guides.filter((g) => {
    const matchesCategory = activeCategory === 'all' || g.category === activeCategory;
    const matchesSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const mapGuide = (g: typeof guides[0]) => ({
    id: g.id,
    title: g.title,
    category: g.category as any,
    readingTime: g.reading_time,
    summary: g.summary,
    sections: g.sections,
  });

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="bg-card px-6 pt-12 pb-6">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/10">
            <BookOpen className="h-5 w-5 text-secondary" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-foreground">Guide</h1>
            <p className="text-sm text-muted-foreground">Tutto spiegato semplice.</p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-3.5">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cerca una guida..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto px-6 py-4 scrollbar-none">
        <button
          onClick={() => setActiveCategory('all')}
          className={`shrink-0 rounded-full px-4 py-2.5 text-xs font-semibold transition-all ${
            activeCategory === 'all'
              ? 'gradient-hero text-primary-foreground shadow-cta'
              : 'bg-card text-muted-foreground shadow-card hover:shadow-card-hover'
          }`}
        >
          Tutte
        </button>
        {GUIDE_CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`shrink-0 rounded-full px-4 py-2.5 text-xs font-semibold transition-all ${
              activeCategory === cat.key
                ? 'gradient-hero text-primary-foreground shadow-cta'
                : 'bg-card text-muted-foreground shadow-card hover:shadow-card-hover'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="space-y-3 px-6">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
          </div>
        ) : filtered.length > 0 ? (
          filtered.map((guide, i) => (
            <div key={guide.id} className="animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
              <GuideCard guide={mapGuide(guide)} />
            </div>
          ))
        ) : (
          <div className="py-16 text-center animate-fade-in">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">Nessuna guida trovata</p>
            <p className="mt-1 text-xs text-muted-foreground">Prova con un'altra ricerca.</p>
          </div>
        )}

        {!user && (
          <div className="mt-6 animate-fade-in">
            <button
              onClick={() => navigate('/auth')}
              className="flex w-full items-center gap-3 rounded-2xl gradient-hero p-5 text-left text-primary-foreground shadow-cta transition-all active:scale-[0.98]"
            >
              <div className="flex-1">
                <div className="text-sm font-bold">Vuoi un percorso personalizzato?</div>
                <div className="mt-0.5 text-xs opacity-80">Registrati gratis e ricevi il piano su misura per te.</div>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Guides;

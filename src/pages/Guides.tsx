import { useState } from 'react';
import { Search } from 'lucide-react';
import GuideCard from '@/components/GuideCard';
import { mockGuides } from '@/data/mockData';
import { GUIDE_CATEGORIES, GuideCategory } from '@/types';

const Guides = () => {
  const [activeCategory, setActiveCategory] = useState<GuideCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = mockGuides.filter((g) => {
    const matchesCategory = activeCategory === 'all' || g.category === activeCategory;
    const matchesSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-12 pb-2">
        <h1 className="text-2xl font-bold text-foreground">Guide</h1>
        <p className="mt-1 text-sm text-muted-foreground">Tutto quello che devi sapere, spiegato semplice.</p>
      </div>

      {/* Search */}
      <div className="px-5 py-3">
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5">
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

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto px-5 pb-4 scrollbar-none">
        <button
          onClick={() => setActiveCategory('all')}
          className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium transition-all ${
            activeCategory === 'all'
              ? 'bg-primary text-primary-foreground'
              : 'bg-card text-muted-foreground shadow-card'
          }`}
        >
          Tutte
        </button>
        {GUIDE_CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium transition-all ${
              activeCategory === cat.key
                ? 'bg-primary text-primary-foreground'
                : 'bg-card text-muted-foreground shadow-card'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Guides list */}
      <div className="space-y-3 px-5">
        {filtered.length > 0 ? (
          filtered.map((guide) => <GuideCard key={guide.id} guide={guide} />)
        ) : (
          <div className="py-12 text-center">
            <p className="text-sm text-muted-foreground">Nessuna guida trovata. Prova con un'altra ricerca.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Guides;

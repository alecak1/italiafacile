import { FileText, Home as HomeIcon, HelpCircle, BookOpen, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProgressCard from '@/components/ProgressCard';
import GuideCard from '@/components/GuideCard';
import { mockJourneySteps, mockGuides } from '@/data/mockData';
import heroIllustration from '@/assets/hero-illustration.png';

const HomePage = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('user_name') || 'Amico';
  const currentStep = mockJourneySteps.find((s) => s.status === 'current');

  const quickActions = [
    { label: 'Documenti', desc: 'Guida completa', icon: FileText, path: '/guides', color: 'bg-secondary/10 text-secondary' },
    { label: 'Affitti', desc: 'Come trovare casa', icon: HomeIcon, path: '/guides', color: 'bg-warning/10 text-warning' },
    { label: 'Domande', desc: 'Chiedi alla community', icon: HelpCircle, path: '/community', color: 'bg-primary/10 text-primary' },
  ];

  const recentGuides = mockGuides.slice(0, 3);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero section */}
      <div className="relative overflow-hidden bg-card px-5 pb-6 pt-10">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }} />

        <div className="relative flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">Ciao 👋</p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-foreground">{userName}</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Il tuo assistente per trasferirti in Italia. Ogni passo, spiegato semplice.
            </p>
          </div>
          <img
            src={heroIllustration}
            alt="Illustrazione viaggio"
            className="h-24 w-24 object-contain opacity-90 animate-fade-in"
          />
        </div>

        {/* Floating next-action banner */}
        {currentStep && (
          <button
            onClick={() => navigate(`/step/${currentStep.id}`)}
            className="mt-5 flex w-full items-center gap-3 rounded-2xl gradient-hero p-4 text-left text-primary-foreground shadow-cta transition-all active:scale-[0.98] animate-fade-in"
            style={{ animationDelay: '200ms' }}
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-70">Inizia da qui</div>
              <div className="text-sm font-bold">{currentStep.title}</div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary">
              <ArrowRight className="h-5 w-5" />
            </div>
          </button>
        )}
      </div>

      <div className="space-y-7 px-5 py-6">
        {/* Progress card */}
        <ProgressCard steps={mockJourneySteps} userName={userName} />

        {/* Quick actions */}
        <div>
          <h2 className="mb-3 text-lg font-bold text-foreground">Azioni rapide</h2>
          <div className="grid grid-cols-3 gap-3">
            {quickActions.map((action, i) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={() => navigate(action.path)}
                  className="flex flex-col items-center gap-2.5 rounded-2xl bg-card p-4 shadow-card transition-all hover:shadow-card-hover active:scale-[0.97] animate-fade-in"
                  style={{ animationDelay: `${(i + 1) * 100}ms` }}
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${action.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="text-center">
                    <span className="block text-xs font-semibold text-foreground">{action.label}</span>
                    <span className="block text-[10px] text-muted-foreground">{action.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent guides */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Guide utili</h2>
            <button onClick={() => navigate('/guides')} className="flex items-center gap-1 text-xs font-semibold text-secondary">
              Vedi tutte <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="space-y-3">
            {recentGuides.map((guide, i) => (
              <div key={guide.id} className="animate-fade-in" style={{ animationDelay: `${(i + 1) * 80}ms` }}>
                <GuideCard guide={guide} />
              </div>
            ))}
          </div>
        </div>

        {/* Community teaser */}
        <button
          onClick={() => navigate('/community')}
          className="flex w-full items-center gap-4 rounded-2xl border-2 border-dashed border-border bg-card/50 p-5 text-left transition-all hover:border-secondary hover:shadow-card-hover"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary/10">
            <HelpCircle className="h-6 w-6 text-secondary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-foreground">Hai una domanda?</p>
            <p className="text-xs text-muted-foreground">Chiedi alla community e ricevi risposte da chi ci è già passato.</p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
};

export default HomePage;

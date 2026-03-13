import { FileText, Home as HomeIcon, HelpCircle, BookOpen, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProgressCard from '@/components/ProgressCard';
import GuideCard from '@/components/GuideCard';
import { mockJourneySteps, mockGuides } from '@/data/mockData';

const HomePage = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('user_name') || 'Amico';

  const quickActions = [
    { label: 'Guida documenti', icon: FileText, path: '/guides', color: 'bg-secondary/10 text-secondary' },
    { label: 'Guida affitti', icon: HomeIcon, path: '/guides', color: 'bg-warning/10 text-warning' },
    { label: 'Fai una domanda', icon: HelpCircle, path: '/community', color: 'bg-primary/10 text-primary' },
  ];

  const recentGuides = mockGuides.slice(0, 3);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-5 pt-12 pb-2">
        <p className="text-sm text-muted-foreground">Ciao 👋</p>
        <h1 className="text-2xl font-bold text-foreground">{userName}</h1>
      </div>

      <div className="space-y-6 px-5 py-4">
        {/* Progress card */}
        <ProgressCard steps={mockJourneySteps} userName={userName} />

        {/* Quick actions */}
        <div>
          <h2 className="mb-3 text-base font-semibold text-foreground">Azioni rapide</h2>
          <div className="grid grid-cols-3 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={() => navigate(action.path)}
                  className="flex flex-col items-center gap-2 rounded-2xl bg-card p-4 shadow-card transition-all hover:shadow-card-hover"
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${action.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-center text-[11px] font-medium text-foreground leading-tight">{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent guides */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">Guide utili</h2>
            <button onClick={() => navigate('/guides')} className="flex items-center gap-1 text-xs font-medium text-secondary">
              Vedi tutte <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="space-y-3">
            {recentGuides.map((guide) => (
              <GuideCard key={guide.id} guide={guide} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

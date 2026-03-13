import { MapPin, Check, ArrowRight, Settings, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockJourneySteps } from '@/data/mockData';

const Profile = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('user_name') || 'Utente';
  const completedSteps = mockJourneySteps.filter((s) => s.status === 'completed').length;
  const remainingSteps = mockJourneySteps.filter((s) => s.status !== 'completed').length;
  const totalSteps = mockJourneySteps.length;
  const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="relative overflow-hidden bg-card px-5 pb-6 pt-12">
        <div className="absolute inset-0 gradient-hero opacity-5" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-18 w-18 items-center justify-center rounded-2xl gradient-hero text-3xl font-extrabold text-primary-foreground shadow-hero"
               style={{ width: '72px', height: '72px' }}>
            {userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-foreground">{userName}</h1>
            <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              Milano, Italia
            </div>
            <div className="mt-1.5 flex items-center gap-2">
              <div className="h-1.5 w-20 overflow-hidden rounded-full bg-border">
                <div className="h-full rounded-full gradient-hero" style={{ width: `${progress}%` }} />
              </div>
              <span className="text-xs font-bold text-primary">{Math.round(progress)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-5 py-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-card p-5 shadow-card text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-success/10">
              <Check className="h-6 w-6 text-success" />
            </div>
            <p className="text-3xl font-extrabold text-foreground">{completedSteps}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Completati</p>
          </div>
          <div className="rounded-2xl bg-card p-5 shadow-card text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10">
              <ArrowRight className="h-6 w-6 text-secondary" />
            </div>
            <p className="text-3xl font-extrabold text-foreground">{remainingSteps}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Rimanenti</p>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="px-5 space-y-2">
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Informazioni</h2>
        {[
          { label: 'Nazionalità', value: '🇧🇬 Bulgaria' },
          { label: 'Motivo', value: '💼 Lavoro' },
          { label: 'Livello italiano', value: '🟡 Principiante' },
          { label: 'Stato lavorativo', value: 'Impiegato' },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between rounded-2xl bg-card p-4 shadow-card">
            <span className="text-sm text-muted-foreground">{item.label}</span>
            <span className="text-sm font-semibold text-foreground">{item.value}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-6 px-5 space-y-2">
        <button
          onClick={() => navigate('/journey')}
          className="flex w-full items-center justify-between rounded-2xl bg-card p-4 shadow-card transition-all hover:shadow-card-hover"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <ArrowRight className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-semibold text-foreground">Vai al percorso</span>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </button>

        <button
          onClick={() => {
            localStorage.removeItem('onboarding_complete');
            localStorage.removeItem('user_name');
            navigate('/onboarding');
          }}
          className="flex w-full items-center justify-between rounded-2xl bg-card p-4 shadow-card transition-all hover:shadow-card-hover"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-destructive/10">
              <Settings className="h-4 w-4 text-destructive" />
            </div>
            <span className="text-sm font-semibold text-foreground">Ricomincia onboarding</span>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
};

export default Profile;

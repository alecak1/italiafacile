import { MapPin, Check, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockJourneySteps } from '@/data/mockData';

const Profile = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('user_name') || 'Utente';
  const completedSteps = mockJourneySteps.filter((s) => s.status === 'completed').length;
  const remainingSteps = mockJourneySteps.filter((s) => s.status !== 'completed').length;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-12 pb-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">{userName}</h1>
            <div className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              Milano, Italia
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-card p-4 shadow-card text-center">
            <div className="flex h-10 w-10 mx-auto items-center justify-center rounded-full bg-success/10 mb-2">
              <Check className="h-5 w-5 text-success" />
            </div>
            <p className="text-2xl font-bold text-foreground">{completedSteps}</p>
            <p className="text-xs text-muted-foreground">Passi completati</p>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-card text-center">
            <div className="flex h-10 w-10 mx-auto items-center justify-center rounded-full bg-secondary/10 mb-2">
              <ArrowRight className="h-5 w-5 text-secondary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{remainingSteps}</p>
            <p className="text-xs text-muted-foreground">Passi rimanenti</p>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="mt-6 px-5 space-y-3">
        <h2 className="text-base font-semibold text-foreground">Informazioni</h2>
        {[
          { label: 'Nazionalità', value: '🇧🇬 Bulgaria' },
          { label: 'Motivo', value: 'Lavoro' },
          { label: 'Livello italiano', value: 'Principiante' },
          { label: 'Stato lavorativo', value: 'Impiegato' },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between rounded-xl bg-card p-4 shadow-card">
            <span className="text-sm text-muted-foreground">{item.label}</span>
            <span className="text-sm font-medium text-foreground">{item.value}</span>
          </div>
        ))}
      </div>

      {/* Reset */}
      <div className="mt-8 px-5">
        <button
          onClick={() => {
            localStorage.removeItem('onboarding_complete');
            localStorage.removeItem('user_name');
            navigate('/onboarding');
          }}
          className="w-full rounded-xl border border-border py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-destructive hover:border-destructive"
        >
          Ricomincia onboarding
        </button>
      </div>
    </div>
  );
};

export default Profile;

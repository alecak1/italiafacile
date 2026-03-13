import { useRef, useState } from 'react';
import { MapPin, Check, ArrowRight, Settings, ChevronRight, LogOut, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useJourney } from '@/hooks/useJourney';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const REASON_LABELS: Record<string, string> = {
  work: '💼 Lavoro',
  study: '📚 Studio',
  family: '❤️ Famiglia',
};

const LANGUAGE_LABELS: Record<string, string> = {
  none: '🔴 Non parlo italiano',
  beginner: '🟡 Principiante',
  intermediate: '🟢 Intermedio',
  advanced: '💚 Avanzato',
};

const JOB_LABELS: Record<string, string> = {
  employed: 'Impiegato',
  unemployed: 'In cerca di lavoro',
  student: 'Studente',
  freelance: 'Libero professionista',
};

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { profile, updateProfile } = useProfile();
  const { steps } = useJourney(profile?.corridor_id);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const userName = profile?.name || user?.user_metadata?.full_name || 'Utente';
  const completedSteps = steps.filter((s) => s.status === 'completed').length;
  const remainingSteps = steps.filter((s) => s.status !== 'completed').length;
  const totalSteps = steps.length;
  const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  const handleSignOut = async () => {
    localStorage.removeItem('onboarding_complete');
    localStorage.removeItem('user_name');
    await signOut();
    navigate('/');
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Seleziona un file immagine.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('L\'immagine deve essere inferiore a 2MB.');
      return;
    }

    setUploading(true);
    const ext = file.name.split('.').pop();
    const filePath = `${user.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast.error('Errore nel caricamento della foto.');
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    const avatarUrl = `${publicUrl}?t=${Date.now()}`;
    await updateProfile({ avatar_url: avatarUrl } as any);
    toast.success('Foto aggiornata!');
    setUploading(false);
  };

  const infoItems = [
    { label: 'Nazionalità', value: profile?.nationality || '—' },
    { label: 'Destinazione', value: profile?.destination_city ? `${profile.destination_city}, ${profile.destination_country}` : '—' },
    { label: 'Motivo', value: REASON_LABELS[profile?.reason_for_moving || ''] || '—' },
    { label: 'Livello italiano', value: LANGUAGE_LABELS[profile?.language_level || ''] || '—' },
    { label: 'Stato lavorativo', value: JOB_LABELS[profile?.job_status || ''] || '—' },
  ];

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="relative overflow-hidden bg-card px-6 pb-7 pt-12">
        <div className="absolute inset-0 gradient-hero opacity-[0.04]" />
        <div className="relative flex items-center gap-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="relative flex items-center justify-center rounded-2xl gradient-hero text-3xl font-black text-primary-foreground shadow-hero overflow-hidden group"
            style={{ width: '72px', height: '72px' }}
          >
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              userName.charAt(0).toUpperCase()
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="h-5 w-5 text-white" />
            </div>
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              </div>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarUpload}
          />
          <div>
            <h1 className="text-xl font-black text-foreground">{userName}</h1>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
            {profile?.destination_city && (
              <div className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                {profile.destination_city}, {profile.destination_country}
              </div>
            )}
            <div className="mt-2 flex items-center gap-2.5">
              <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full gradient-hero" style={{ width: `${progress}%` }} />
              </div>
              <span className="text-xs font-bold text-primary">{Math.round(progress)}%</span>
            </div>
          </div>
        </div>
      </div>

      {remainingSteps > 0 && (
        <div className="px-6 pt-5">
          <button
            onClick={() => navigate('/journey')}
            className="flex w-full items-center gap-3.5 rounded-2xl gradient-hero p-5 text-primary-foreground shadow-cta transition-all active:scale-[0.98] animate-fade-in"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/20">
              <ArrowRight className="h-5 w-5" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-60">Continua il percorso</div>
              <div className="mt-0.5 text-sm font-bold">{remainingSteps} passi rimanenti</div>
            </div>
            <ChevronRight className="h-5 w-5 opacity-60" />
          </button>
        </div>
      )}

      <div className="px-6 py-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card text-center">
            <div className="mx-auto mb-2.5 flex h-12 w-12 items-center justify-center rounded-2xl bg-success/10">
              <Check className="h-6 w-6 text-success" />
            </div>
            <p className="text-3xl font-black text-foreground">{completedSteps}</p>
            <p className="mt-1 text-xs text-muted-foreground">Completati</p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card text-center">
            <div className="mx-auto mb-2.5 flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10">
              <ArrowRight className="h-6 w-6 text-secondary" />
            </div>
            <p className="text-3xl font-black text-foreground">{remainingSteps}</p>
            <p className="mt-1 text-xs text-muted-foreground">Rimanenti</p>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-2">
        <h2 className="mb-3 text-xs font-bold text-muted-foreground uppercase tracking-widest">Informazioni</h2>
        {infoItems.map((item) => (
          <div key={item.label} className="flex items-center justify-between rounded-2xl border border-border/60 bg-card p-4 shadow-card">
            <span className="text-sm text-muted-foreground">{item.label}</span>
            <span className="text-sm font-semibold text-foreground">{item.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 px-6 space-y-2">
        <button
          onClick={() => navigate('/journey')}
          className="group flex w-full items-center justify-between rounded-2xl border border-border/60 bg-card p-4 shadow-card transition-all hover:shadow-card-hover"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <ArrowRight className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-semibold text-foreground">Vai al percorso</span>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </button>

        <button
          onClick={() => {
            localStorage.removeItem('onboarding_complete');
            localStorage.removeItem('user_name');
            navigate('/onboarding');
          }}
          className="group flex w-full items-center justify-between rounded-2xl border border-border/60 bg-card p-4 shadow-card transition-all hover:shadow-card-hover"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-warning/10">
              <Settings className="h-4 w-4 text-warning" />
            </div>
            <span className="text-sm font-semibold text-foreground">Ricomincia onboarding</span>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </button>

        <button
          onClick={handleSignOut}
          className="group flex w-full items-center justify-between rounded-2xl border border-border/60 bg-card p-4 shadow-card transition-all hover:shadow-card-hover"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-destructive/10">
              <LogOut className="h-4 w-4 text-destructive" />
            </div>
            <span className="text-sm font-semibold text-foreground">Esci</span>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};

export default Profile;

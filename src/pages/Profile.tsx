import { useRef, useState } from 'react';
import { MapPin, Check, ArrowRight, Settings, ChevronRight, LogOut, Camera, Pencil, Linkedin, Instagram, Facebook, X, Save } from 'lucide-react';
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
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [socialLinkedin, setSocialLinkedin] = useState('');
  const [socialInstagram, setSocialInstagram] = useState('');
  const [socialFacebook, setSocialFacebook] = useState('');
  const [saving, setSaving] = useState(false);

  const userName = profile?.name || user?.user_metadata?.full_name || 'Utente';
  const completedSteps = steps.filter((s) => s.status === 'completed').length;
  const remainingSteps = steps.filter((s) => s.status !== 'completed').length;
  const totalSteps = steps.length;
  const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  const startEditing = () => {
    setBio(profile?.bio || '');
    setSocialLinkedin(profile?.social_linkedin || '');
    setSocialInstagram(profile?.social_instagram || '');
    setSocialFacebook(profile?.social_facebook || '');
    setEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    await updateProfile({
      bio: bio.trim().slice(0, 300) || null,
      social_linkedin: socialLinkedin.trim().slice(0, 200) || null,
      social_instagram: socialInstagram.trim().slice(0, 200) || null,
      social_facebook: socialFacebook.trim().slice(0, 200) || null,
    } as any);
    setEditing(false);
    setSaving(false);
    toast.success('Profilo aggiornato!');
  };

  const handleSignOut = async () => {
    localStorage.removeItem('onboarding_complete');
    localStorage.removeItem('user_name');
    await signOut();
    navigate('/');
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (!file.type.startsWith('image/')) { toast.error('Seleziona un file immagine.'); return; }
    if (file.size > 2 * 1024 * 1024) { toast.error("L'immagine deve essere inferiore a 2MB."); return; }

    setUploading(true);
    const ext = file.name.split('.').pop();
    const filePath = `${user.id}/avatar.${ext}`;
    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
    if (uploadError) { toast.error('Errore nel caricamento.'); setUploading(false); return; }

    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
    await updateProfile({ avatar_url: `${publicUrl}?t=${Date.now()}` } as any);
    toast.success('Foto aggiornata!');
    setUploading(false);
  };

  const socialLinks = [
    { url: profile?.social_linkedin, icon: Linkedin, label: 'LinkedIn', color: 'text-[#0A66C2]' },
    { url: profile?.social_instagram, icon: Instagram, label: 'Instagram', color: 'text-[#E4405F]' },
    { url: profile?.social_facebook, icon: Facebook, label: 'Facebook', color: 'text-[#1877F2]' },
  ].filter(s => s.url);

  const infoItems = [
    { label: 'Nazionalità', value: profile?.nationality || '—' },
    { label: 'Destinazione', value: profile?.destination_city ? `${profile.destination_city}, ${profile.destination_country}` : '—' },
    { label: 'Motivo', value: REASON_LABELS[profile?.reason_for_moving || ''] || '—' },
    { label: 'Livello italiano', value: LANGUAGE_LABELS[profile?.language_level || ''] || '—' },
    { label: 'Stato lavorativo', value: JOB_LABELS[profile?.job_status || ''] || '—' },
  ];

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
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
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
          <div className="flex-1">
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

      {/* Bio & Socials */}
      <div className="px-6 pt-5">
        {!editing ? (
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Chi sono</h2>
              <button onClick={startEditing} className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
                <Pencil className="h-3.5 w-3.5" /> Modifica
              </button>
            </div>
            {profile?.bio ? (
              <p className="text-sm leading-relaxed text-foreground">{profile.bio}</p>
            ) : (
              <p className="text-sm text-muted-foreground italic">Aggiungi una breve descrizione di te...</p>
            )}
            {socialLinks.length > 0 && (
              <div className="mt-4 flex items-center gap-3">
                {socialLinks.map((s) => {
                  const Icon = s.icon;
                  return (
                    <a key={s.label} href={s.url!} target="_blank" rel="noopener noreferrer"
                       className={`flex h-9 w-9 items-center justify-center rounded-xl bg-muted transition-transform hover:scale-110 ${s.color}`}>
                      <Icon className="h-4.5 w-4.5" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-primary/30 bg-card p-5 shadow-elevated animate-scale-in space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Modifica profilo</h2>
              <button onClick={() => setEditing(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={300}
                placeholder="Racconta qualcosa di te..."
                className="mt-1.5 h-20 w-full resize-none rounded-xl border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <p className="mt-1 text-right text-[10px] text-muted-foreground">{bio.length}/300</p>
            </div>
            <div className="space-y-3">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground"><Linkedin className="h-3.5 w-3.5" /> LinkedIn</label>
                <input value={socialLinkedin} onChange={(e) => setSocialLinkedin(e.target.value)} maxLength={200}
                       placeholder="https://linkedin.com/in/..."
                       className="mt-1.5 w-full rounded-xl border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground"><Instagram className="h-3.5 w-3.5" /> Instagram</label>
                <input value={socialInstagram} onChange={(e) => setSocialInstagram(e.target.value)} maxLength={200}
                       placeholder="https://instagram.com/..."
                       className="mt-1.5 w-full rounded-xl border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground"><Facebook className="h-3.5 w-3.5" /> Facebook</label>
                <input value={socialFacebook} onChange={(e) => setSocialFacebook(e.target.value)} maxLength={200}
                       placeholder="https://facebook.com/..."
                       className="mt-1.5 w-full rounded-xl border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
              </div>
            </div>
            <button onClick={handleSave} disabled={saving}
                    className="flex w-full items-center justify-center gap-2 rounded-xl gradient-hero py-3.5 text-sm font-bold text-primary-foreground shadow-cta disabled:opacity-40 transition-all">
              <Save className="h-4 w-4" />
              {saving ? 'Salvataggio...' : 'Salva modifiche'}
            </button>
          </div>
        )}
      </div>

      {/* CTA percorso */}
      {remainingSteps > 0 && (
        <div className="px-6 pt-5">
          <button onClick={() => navigate('/journey')}
                  className="flex w-full items-center gap-3.5 rounded-2xl gradient-hero p-5 text-primary-foreground shadow-cta transition-all active:scale-[0.98] animate-fade-in">
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

      {/* Stats */}
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

      {/* Info */}
      <div className="px-6 space-y-2">
        <h2 className="mb-3 text-xs font-bold text-muted-foreground uppercase tracking-widest">Informazioni</h2>
        {infoItems.map((item) => (
          <div key={item.label} className="flex items-center justify-between rounded-2xl border border-border/60 bg-card p-4 shadow-card">
            <span className="text-sm text-muted-foreground">{item.label}</span>
            <span className="text-sm font-semibold text-foreground">{item.value}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-6 px-6 space-y-2">
        <button onClick={() => navigate('/journey')}
                className="group flex w-full items-center justify-between rounded-2xl border border-border/60 bg-card p-4 shadow-card transition-all hover:shadow-card-hover">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10"><ArrowRight className="h-4 w-4 text-primary" /></div>
            <span className="text-sm font-semibold text-foreground">Vai al percorso</span>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </button>

        <button onClick={() => { localStorage.removeItem('onboarding_complete'); localStorage.removeItem('user_name'); navigate('/onboarding'); }}
                className="group flex w-full items-center justify-between rounded-2xl border border-border/60 bg-card p-4 shadow-card transition-all hover:shadow-card-hover">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-warning/10"><Settings className="h-4 w-4 text-warning" /></div>
            <span className="text-sm font-semibold text-foreground">Ricomincia onboarding</span>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </button>

        <button onClick={handleSignOut}
                className="group flex w-full items-center justify-between rounded-2xl border border-border/60 bg-card p-4 shadow-card transition-all hover:shadow-card-hover">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-destructive/10"><LogOut className="h-4 w-4 text-destructive" /></div>
            <span className="text-sm font-semibold text-foreground">Esci</span>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};

export default Profile;

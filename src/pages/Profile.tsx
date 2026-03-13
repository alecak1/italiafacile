import { useRef, useState } from 'react';
import { MapPin, Check, ArrowRight, Settings, ChevronRight, LogOut, Camera, Pencil, Linkedin, Instagram, Facebook, X, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useJourney } from '@/hooks/useJourney';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import LanguageSelector from '@/components/LanguageSelector';

const Profile = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
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
    toast.success(t('profile.profileUpdated'));
  };

  const handleLanguageChange = async (langCode: string) => {
    i18n.changeLanguage(langCode);
    await updateProfile({ preferred_language: langCode } as any);
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
    if (!file.type.startsWith('image/')) { toast.error(t('profile.selectImage')); return; }
    if (file.size > 2 * 1024 * 1024) { toast.error(t('profile.photoTooLarge')); return; }
    setUploading(true);
    const ext = file.name.split('.').pop();
    const filePath = `${user.id}/avatar.${ext}`;
    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
    if (uploadError) { toast.error(t('profile.photoError')); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
    await updateProfile({ avatar_url: `${publicUrl}?t=${Date.now()}` } as any);
    toast.success(t('profile.photoUpdated'));
    setUploading(false);
  };

  const REASON_LABELS: Record<string, string> = {
    work: t('profile.reasonWork'), study: t('profile.reasonStudy'), family: t('profile.reasonFamily'),
  };
  const LANGUAGE_LABELS: Record<string, string> = {
    none: t('profile.langNone'), beginner: t('profile.langBeginner'),
    intermediate: t('profile.langIntermediate'), advanced: t('profile.langAdvanced'),
  };
  const JOB_LABELS: Record<string, string> = {
    employed: t('profile.jobEmployed'), unemployed: t('profile.jobUnemployed'),
    student: t('profile.jobStudent'), freelance: t('profile.jobFreelance'),
  };

  const socialLinks = [
    { url: profile?.social_linkedin, icon: Linkedin, label: 'LinkedIn', color: 'text-[#0A66C2]' },
    { url: profile?.social_instagram, icon: Instagram, label: 'Instagram', color: 'text-[#E4405F]' },
    { url: profile?.social_facebook, icon: Facebook, label: 'Facebook', color: 'text-[#1877F2]' },
  ].filter(s => s.url);

  const infoItems = [
    { label: t('profile.nationality'), value: profile?.nationality || '—' },
    { label: t('profile.destination'), value: profile?.destination_city ? `${profile.destination_city}, ${profile.destination_country}` : '—' },
    { label: t('profile.reason'), value: REASON_LABELS[profile?.reason_for_moving || ''] || '—' },
    { label: t('profile.italianLevel'), value: LANGUAGE_LABELS[profile?.language_level || ''] || '—' },
    { label: t('profile.jobStatus'), value: JOB_LABELS[profile?.job_status || ''] || '—' },
  ];

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="relative overflow-hidden bg-card px-6 pb-7 pt-12">
        <div className="absolute inset-0 gradient-hero opacity-[0.04]" />
        <div className="relative flex items-center gap-4">
          <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
            className="relative flex items-center justify-center rounded-2xl gradient-hero text-3xl font-black text-primary-foreground shadow-hero overflow-hidden group"
            style={{ width: '72px', height: '72px' }}>
            {profile?.avatar_url ? <img src={profile.avatar_url} alt="Avatar" className="h-full w-full object-cover" /> : userName.charAt(0).toUpperCase()}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"><Camera className="h-5 w-5 text-white" /></div>
            {uploading && <div className="absolute inset-0 flex items-center justify-center bg-black/50"><div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" /></div>}
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
          <div className="flex-1">
            <h1 className="text-xl font-black text-foreground">{userName}</h1>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
            {profile?.destination_city && (
              <div className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />{profile.destination_city}, {profile.destination_country}
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

      {/* Language selector */}
      <div className="px-6 pt-5">
        <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{t('profile.language')}</span>
          </div>
          <div className="flex gap-2">
            {LANGUAGES.map((lang) => (
              <button key={lang.code} onClick={() => handleLanguageChange(lang.code)}
                className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all ${
                  i18n.language === lang.code
                    ? 'gradient-hero text-primary-foreground shadow-cta'
                    : 'border border-border bg-background text-muted-foreground hover:text-foreground hover:border-primary/30'
                }`}>
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bio & Socials */}
      <div className="px-6 pt-4">
        {!editing ? (
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{t('profile.aboutMe')}</h2>
              <button onClick={startEditing} className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
                <Pencil className="h-3.5 w-3.5" /> {t('profile.edit')}
              </button>
            </div>
            {profile?.bio ? <p className="text-sm leading-relaxed text-foreground">{profile.bio}</p>
              : <p className="text-sm text-muted-foreground italic">{t('profile.addBio')}</p>}
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
              <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{t('profile.editProfile')}</h2>
              <button onClick={() => setEditing(false)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">{t('profile.bio')}</label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} maxLength={300} placeholder={t('profile.bioPlaceholder')}
                className="mt-1.5 h-20 w-full resize-none rounded-xl border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
              <p className="mt-1 text-right text-[10px] text-muted-foreground">{bio.length}/300</p>
            </div>
            <div className="space-y-3">
              {[
                { icon: Linkedin, label: 'LinkedIn', value: socialLinkedin, setter: setSocialLinkedin, placeholder: 'https://linkedin.com/in/...' },
                { icon: Instagram, label: 'Instagram', value: socialInstagram, setter: setSocialInstagram, placeholder: 'https://instagram.com/...' },
                { icon: Facebook, label: 'Facebook', value: socialFacebook, setter: setSocialFacebook, placeholder: 'https://facebook.com/...' },
              ].map(({ icon: Icon, label, value, setter, placeholder }) => (
                <div key={label}>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground"><Icon className="h-3.5 w-3.5" /> {label}</label>
                  <input value={value} onChange={(e) => setter(e.target.value)} maxLength={200} placeholder={placeholder}
                    className="mt-1.5 w-full rounded-xl border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
              ))}
            </div>
            <button onClick={handleSave} disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-xl gradient-hero py-3.5 text-sm font-bold text-primary-foreground shadow-cta disabled:opacity-40 transition-all">
              <Save className="h-4 w-4" />{saving ? t('profile.saving') : t('profile.saveChanges')}
            </button>
          </div>
        )}
      </div>

      {remainingSteps > 0 && (
        <div className="px-6 pt-4">
          <button onClick={() => navigate('/journey')}
            className="flex w-full items-center gap-3.5 rounded-2xl gradient-hero p-5 text-primary-foreground shadow-cta transition-all active:scale-[0.98] animate-fade-in">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/20"><ArrowRight className="h-5 w-5" /></div>
            <div className="flex-1 text-left">
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-60">{t('profile.continueJourney')}</div>
              <div className="mt-0.5 text-sm font-bold">{t('profile.stepsRemaining', { count: remainingSteps })}</div>
            </div>
            <ChevronRight className="h-5 w-5 opacity-60" />
          </button>
        </div>
      )}

      <div className="px-6 py-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card text-center">
            <div className="mx-auto mb-2.5 flex h-12 w-12 items-center justify-center rounded-2xl bg-success/10"><Check className="h-6 w-6 text-success" /></div>
            <p className="text-3xl font-black text-foreground">{completedSteps}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t('profile.completedSteps')}</p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card text-center">
            <div className="mx-auto mb-2.5 flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10"><ArrowRight className="h-6 w-6 text-secondary" /></div>
            <p className="text-3xl font-black text-foreground">{remainingSteps}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t('profile.remainingSteps')}</p>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-2">
        <h2 className="mb-3 text-xs font-bold text-muted-foreground uppercase tracking-widest">{t('profile.info')}</h2>
        {infoItems.map((item) => (
          <div key={item.label} className="flex items-center justify-between rounded-2xl border border-border/60 bg-card p-4 shadow-card">
            <span className="text-sm text-muted-foreground">{item.label}</span>
            <span className="text-sm font-semibold text-foreground">{item.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 px-6 space-y-2">
        <button onClick={() => navigate('/journey')}
          className="group flex w-full items-center justify-between rounded-2xl border border-border/60 bg-card p-4 shadow-card transition-all hover:shadow-card-hover">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10"><ArrowRight className="h-4 w-4 text-primary" /></div>
            <span className="text-sm font-semibold text-foreground">{t('profile.goToJourney')}</span>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </button>
        <button onClick={() => { localStorage.removeItem('onboarding_complete'); localStorage.removeItem('user_name'); navigate('/onboarding'); }}
          className="group flex w-full items-center justify-between rounded-2xl border border-border/60 bg-card p-4 shadow-card transition-all hover:shadow-card-hover">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-warning/10"><Settings className="h-4 w-4 text-warning" /></div>
            <span className="text-sm font-semibold text-foreground">{t('profile.restartOnboarding')}</span>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </button>
        <button onClick={handleSignOut}
          className="group flex w-full items-center justify-between rounded-2xl border border-border/60 bg-card p-4 shadow-card transition-all hover:shadow-card-hover">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-destructive/10"><LogOut className="h-4 w-4 text-destructive" /></div>
            <span className="text-sm font-semibold text-foreground">{t('profile.logout')}</span>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};

export default Profile;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, MapPin, Briefcase, GraduationCap, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useCorridors } from '@/hooks/useCorridors';
import { supabase } from '@/integrations/supabase/client';

interface OnboardingData {
  name: string;
  nationality: string;
  destinationCountry: string;
  destinationCity: string;
  reasonForMoving: string;
  alreadyInCountry: string;
  hasTaxCode: string;
  jobStatus: string;
  languageLevel: string;
}

const STEPS = ['name', 'nationality', 'destination', 'reason', 'status', 'language'] as const;

const Onboarding = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { updateProfile } = useProfile();
  const { getDefaultCorridor } = useCorridors();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    name: '', nationality: 'Bulgaria', destinationCountry: 'Italia', destinationCity: '',
    reasonForMoving: '', alreadyInCountry: '', hasTaxCode: '', jobStatus: '', languageLevel: '',
  });

  const progress = ((step + 1) / STEPS.length) * 100;

  const canContinue = () => {
    switch (STEPS[step]) {
      case 'name': return data.name.trim().length > 0;
      case 'nationality': return true;
      case 'destination': return data.destinationCity.trim().length > 0 && data.alreadyInCountry !== '';
      case 'reason': return data.reasonForMoving !== '';
      case 'status': return data.jobStatus !== '' && data.hasTaxCode !== '';
      case 'language': return data.languageLevel !== '';
      default: return false;
    }
  };

  const handleNext = async () => {
    if (step < STEPS.length - 1) { setStep(step + 1); return; }
    setSaving(true);
    const corridor = getDefaultCorridor();
    await updateProfile({
      name: data.name, nationality: data.nationality, destination_country: data.destinationCountry,
      destination_city: data.destinationCity, reason_for_moving: data.reasonForMoving,
      already_in_country: data.alreadyInCountry === 'yes', has_tax_code: data.hasTaxCode === 'yes',
      job_status: data.jobStatus, language_level: data.languageLevel,
      onboarding_completed: true, corridor_id: corridor?.id || null,
    });
    if (user && corridor) {
      const { data: templates } = await supabase.from('journey_step_templates').select('id, step_order')
        .eq('corridor_id', corridor.id).eq('is_active', true).order('step_order', { ascending: true });
      if (templates && templates.length > 0) {
        const inserts = templates.map((tpl: any, i: number) => ({
          user_id: user.id, step_template_id: tpl.id,
          status: i === 0 ? 'current' : 'locked', checklist_state: [],
        }));
        await supabase.from('user_step_progress').insert(inserts);
      }
    }
    localStorage.setItem('onboarding_complete', 'true');
    localStorage.setItem('user_name', data.name);
    setSaving(false);
    navigate('/dashboard');
  };

  const OptionButton = ({ value, selected, onClick, children, icon }: {
    value: string; selected: boolean; onClick: () => void; children: React.ReactNode; icon?: React.ReactNode;
  }) => (
    <button onClick={onClick}
      className={`flex w-full items-center gap-3.5 rounded-2xl border-2 p-4 text-left transition-all duration-200 ${
        selected ? 'border-primary bg-primary/5 shadow-card-hover' : 'border-border bg-card hover:border-primary/30 hover:shadow-card'
      }`}>
      {icon && (
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all ${
          selected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
        }`}>{icon}</div>
      )}
      <span className={`text-sm font-medium ${selected ? 'text-foreground' : 'text-muted-foreground'}`}>{children}</span>
    </button>
  );

  const renderStep = () => {
    switch (STEPS[step]) {
      case 'name':
        return (
          <div className="animate-fade-in space-y-6">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-foreground">{t('onboarding.nameTitle')}</h1>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{t('onboarding.nameSubtitle')}</p>
            </div>
            <input type="text" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })}
              placeholder={t('onboarding.namePlaceholder')}
              className="w-full rounded-2xl border-2 border-border bg-card px-5 py-4 text-base font-medium text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
              autoFocus />
          </div>
        );
      case 'nationality':
        return (
          <div className="animate-fade-in space-y-6">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-foreground">{t('onboarding.nationalityTitle')}</h1>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{t('onboarding.nationalitySubtitle')}</p>
            </div>
            <div className="space-y-3">
              {['Bulgaria', 'Romania', 'Altro'].map((n) => (
                <OptionButton key={n} value={n} selected={data.nationality === n} onClick={() => setData({ ...data, nationality: n })}>
                  {n === 'Bulgaria' ? '🇧🇬 Bulgaria' : n === 'Romania' ? '🇷🇴 Romania' : `🌍 ${t('onboarding.other')}`}
                </OptionButton>
              ))}
            </div>
          </div>
        );
      case 'destination':
        return (
          <div className="animate-fade-in space-y-6">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-foreground">{t('onboarding.destinationTitle')}</h1>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{t('onboarding.destinationSubtitle')}</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-2xl border-2 border-border bg-card px-5 py-3.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <input type="text" value={data.destinationCity} onChange={(e) => setData({ ...data, destinationCity: e.target.value })}
                  placeholder={t('onboarding.destinationPlaceholder')}
                  className="flex-1 bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none" />
              </div>
              <p className="text-sm font-semibold text-foreground">{t('onboarding.alreadyInCountry')}</p>
              <div className="grid grid-cols-2 gap-3">
                <OptionButton value="yes" selected={data.alreadyInCountry === 'yes'} onClick={() => setData({ ...data, alreadyInCountry: 'yes' })}>{t('onboarding.yes')}</OptionButton>
                <OptionButton value="no" selected={data.alreadyInCountry === 'no'} onClick={() => setData({ ...data, alreadyInCountry: 'no' })}>{t('onboarding.no')}</OptionButton>
              </div>
            </div>
          </div>
        );
      case 'reason':
        return (
          <div className="animate-fade-in space-y-6">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-foreground">{t('onboarding.reasonTitle')}</h1>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{t('onboarding.reasonSubtitle')}</p>
            </div>
            <div className="space-y-3">
              <OptionButton value="work" selected={data.reasonForMoving === 'work'} onClick={() => setData({ ...data, reasonForMoving: 'work' })} icon={<Briefcase className="h-5 w-5" />}>{t('onboarding.work')}</OptionButton>
              <OptionButton value="study" selected={data.reasonForMoving === 'study'} onClick={() => setData({ ...data, reasonForMoving: 'study' })} icon={<GraduationCap className="h-5 w-5" />}>{t('onboarding.study')}</OptionButton>
              <OptionButton value="family" selected={data.reasonForMoving === 'family'} onClick={() => setData({ ...data, reasonForMoving: 'family' })} icon={<Heart className="h-5 w-5" />}>{t('onboarding.family')}</OptionButton>
            </div>
          </div>
        );
      case 'status':
        return (
          <div className="animate-fade-in space-y-6">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-foreground">{t('onboarding.statusTitle')}</h1>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{t('onboarding.statusSubtitle')}</p>
            </div>
            <div className="space-y-5">
              <div>
                <p className="mb-3 text-sm font-semibold text-foreground">{t('onboarding.hasTaxCode')}</p>
                <div className="grid grid-cols-2 gap-3">
                  <OptionButton value="yes" selected={data.hasTaxCode === 'yes'} onClick={() => setData({ ...data, hasTaxCode: 'yes' })}>{t('onboarding.yes')}</OptionButton>
                  <OptionButton value="no" selected={data.hasTaxCode === 'no'} onClick={() => setData({ ...data, hasTaxCode: 'no' })}>{t('onboarding.no')}</OptionButton>
                </div>
              </div>
              <div>
                <p className="mb-3 text-sm font-semibold text-foreground">{t('onboarding.jobStatus')}</p>
                <div className="space-y-3">
                  {[
                    { value: 'employed', label: t('onboarding.employed') },
                    { value: 'unemployed', label: t('onboarding.unemployed') },
                    { value: 'student', label: t('onboarding.student') },
                    { value: 'freelance', label: t('onboarding.freelance') },
                  ].map((opt) => (
                    <OptionButton key={opt.value} value={opt.value} selected={data.jobStatus === opt.value} onClick={() => setData({ ...data, jobStatus: opt.value })}>{opt.label}</OptionButton>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'language':
        return (
          <div className="animate-fade-in space-y-6">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-foreground">{t('onboarding.languageTitle')}</h1>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{t('onboarding.languageSubtitle')}</p>
            </div>
            <div className="space-y-3">
              {[
                { value: 'none', label: t('onboarding.langNone'), emoji: '🔴' },
                { value: 'beginner', label: t('onboarding.langBeginner'), emoji: '🟡' },
                { value: 'intermediate', label: t('onboarding.langIntermediate'), emoji: '🟢' },
                { value: 'advanced', label: t('onboarding.langAdvanced'), emoji: '💚' },
              ].map((opt) => (
                <OptionButton key={opt.value} value={opt.value} selected={data.languageLevel === opt.value} onClick={() => setData({ ...data, languageLevel: opt.value })}>{opt.emoji} {opt.label}</OptionButton>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="sticky top-0 z-10 glass-strong border-b border-border/30 px-5 pt-5 pb-4">
        <div className="flex items-center gap-3">
          {step > 0 && (
            <button onClick={() => setStep(step - 1)} className="flex h-9 w-9 items-center justify-center rounded-full text-foreground hover:bg-muted transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full gradient-hero transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-xs font-semibold text-muted-foreground">{step + 1}/{STEPS.length}</span>
        </div>
      </div>

      <div className="flex-1 px-6 py-8">{renderStep()}</div>

      <div className="sticky bottom-0 glass-strong border-t border-border/30 px-6 pb-8 pt-5">
        <button onClick={handleNext} disabled={!canContinue() || saving}
          className="flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl gradient-hero text-base font-bold text-primary-foreground shadow-cta transition-all active:scale-[0.98] disabled:opacity-40 disabled:shadow-none">
          {saving ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
          ) : (
            <>
              {step === STEPS.length - 1 ? t('onboarding.startJourney') : t('onboarding.continue')}
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Onboarding;

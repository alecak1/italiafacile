import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, MapPin, Briefcase, GraduationCap, Heart } from 'lucide-react';

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

const STEPS = [
  'name',
  'nationality',
  'destination',
  'reason',
  'status',
  'language',
] as const;

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    name: '',
    nationality: 'Bulgaria',
    destinationCountry: 'Italia',
    destinationCity: '',
    reasonForMoving: '',
    alreadyInCountry: '',
    hasTaxCode: '',
    jobStatus: '',
    languageLevel: '',
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

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      // Complete onboarding
      localStorage.setItem('onboarding_complete', 'true');
      localStorage.setItem('user_name', data.name);
      navigate('/dashboard');
    }
  };

  const OptionButton = ({ value, selected, onClick, children, icon }: {
    value: string; selected: boolean; onClick: () => void; children: React.ReactNode; icon?: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-2xl border-2 p-4 text-left transition-all ${
        selected
          ? 'border-primary bg-primary/5 shadow-card-hover'
          : 'border-border bg-card hover:border-primary/30'
      }`}
    >
      {icon && <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${selected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>{icon}</div>}
      <span className="text-sm font-medium">{children}</span>
    </button>
  );

  const renderStep = () => {
    switch (STEPS[step]) {
      case 'name':
        return (
          <div className="animate-fade-in space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Come ti chiami?</h1>
              <p className="mt-2 text-sm text-muted-foreground">Useremo il tuo nome per personalizzare l'esperienza.</p>
            </div>
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              placeholder="Il tuo nome"
              className="w-full rounded-2xl border-2 border-border bg-card px-4 py-4 text-base font-medium text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-0"
              autoFocus
            />
          </div>
        );

      case 'nationality':
        return (
          <div className="animate-fade-in space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Da dove vieni?</h1>
              <p className="mt-2 text-sm text-muted-foreground">Questo ci aiuta a personalizzare le informazioni per te.</p>
            </div>
            <div className="space-y-3">
              {['Bulgaria', 'Romania', 'Altro'].map((n) => (
                <OptionButton key={n} value={n} selected={data.nationality === n} onClick={() => setData({ ...data, nationality: n })}>
                  {n === 'Bulgaria' ? '🇧🇬 Bulgaria' : n === 'Romania' ? '🇷🇴 Romania' : '🌍 Altro'}
                </OptionButton>
              ))}
            </div>
          </div>
        );

      case 'destination':
        return (
          <div className="animate-fade-in space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dove ti trasferisci?</h1>
              <p className="mt-2 text-sm text-muted-foreground">Indica la città di destinazione.</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-2xl border-2 border-border bg-card px-4 py-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  value={data.destinationCity}
                  onChange={(e) => setData({ ...data, destinationCity: e.target.value })}
                  placeholder="Es. Milano, Roma, Torino..."
                  className="flex-1 bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
              <p className="text-sm font-medium text-foreground">Sei già in Italia?</p>
              <div className="grid grid-cols-2 gap-3">
                <OptionButton value="yes" selected={data.alreadyInCountry === 'yes'} onClick={() => setData({ ...data, alreadyInCountry: 'yes' })}>Sì</OptionButton>
                <OptionButton value="no" selected={data.alreadyInCountry === 'no'} onClick={() => setData({ ...data, alreadyInCountry: 'no' })}>No</OptionButton>
              </div>
            </div>
          </div>
        );

      case 'reason':
        return (
          <div className="animate-fade-in space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Perché ti trasferisci?</h1>
              <p className="mt-2 text-sm text-muted-foreground">Questo ci aiuta a creare il percorso giusto per te.</p>
            </div>
            <div className="space-y-3">
              <OptionButton value="work" selected={data.reasonForMoving === 'work'} onClick={() => setData({ ...data, reasonForMoving: 'work' })} icon={<Briefcase className="h-5 w-5" />}>
                Lavoro
              </OptionButton>
              <OptionButton value="study" selected={data.reasonForMoving === 'study'} onClick={() => setData({ ...data, reasonForMoving: 'study' })} icon={<GraduationCap className="h-5 w-5" />}>
                Studio
              </OptionButton>
              <OptionButton value="family" selected={data.reasonForMoving === 'family'} onClick={() => setData({ ...data, reasonForMoving: 'family' })} icon={<Heart className="h-5 w-5" />}>
                Famiglia
              </OptionButton>
            </div>
          </div>
        );

      case 'status':
        return (
          <div className="animate-fade-in space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">La tua situazione attuale</h1>
              <p className="mt-2 text-sm text-muted-foreground">Aiutaci a capire da dove parti.</p>
            </div>
            <div className="space-y-4">
              <p className="text-sm font-medium text-foreground">Hai già il codice fiscale italiano?</p>
              <div className="grid grid-cols-2 gap-3">
                <OptionButton value="yes" selected={data.hasTaxCode === 'yes'} onClick={() => setData({ ...data, hasTaxCode: 'yes' })}>Sì</OptionButton>
                <OptionButton value="no" selected={data.hasTaxCode === 'no'} onClick={() => setData({ ...data, hasTaxCode: 'no' })}>No</OptionButton>
              </div>
              <p className="text-sm font-medium text-foreground">Situazione lavorativa</p>
              <div className="space-y-3">
                {[
                  { value: 'employed', label: 'Ho un lavoro' },
                  { value: 'unemployed', label: 'Cerco lavoro' },
                  { value: 'student', label: 'Studente' },
                  { value: 'freelance', label: 'Libero professionista' },
                ].map((opt) => (
                  <OptionButton key={opt.value} value={opt.value} selected={data.jobStatus === opt.value} onClick={() => setData({ ...data, jobStatus: opt.value })}>
                    {opt.label}
                  </OptionButton>
                ))}
              </div>
            </div>
          </div>
        );

      case 'language':
        return (
          <div className="animate-fade-in space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Parli italiano?</h1>
              <p className="mt-2 text-sm text-muted-foreground">Il tuo livello ci aiuta a darti consigli migliori.</p>
            </div>
            <div className="space-y-3">
              {[
                { value: 'none', label: 'Non parlo italiano', emoji: '🔴' },
                { value: 'beginner', label: 'Principiante', emoji: '🟡' },
                { value: 'intermediate', label: 'Intermedio', emoji: '🟢' },
                { value: 'advanced', label: 'Avanzato', emoji: '💚' },
              ].map((opt) => (
                <OptionButton key={opt.value} value={opt.value} selected={data.languageLevel === opt.value} onClick={() => setData({ ...data, languageLevel: opt.value })}>
                  {opt.emoji} {opt.label}
                </OptionButton>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Progress bar */}
      <div className="sticky top-0 z-10 bg-background px-4 pt-4">
        <div className="flex items-center gap-3">
          {step > 0 && (
            <button onClick={() => setStep(step - 1)} className="flex h-9 w-9 items-center justify-center rounded-full text-foreground hover:bg-muted">
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
            <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-xs font-medium text-muted-foreground">{step + 1}/{STEPS.length}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 py-8">
        {renderStep()}
      </div>

      {/* CTA */}
      <div className="sticky bottom-0 bg-background px-5 pb-8 pt-4">
        <button
          onClick={handleNext}
          disabled={!canContinue()}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-all disabled:opacity-40"
        >
          {step === STEPS.length - 1 ? 'Inizia il tuo percorso' : 'Continua'}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Onboarding;

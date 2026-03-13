import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  MapPin,
  Clock,
  HelpCircle,
  Shield,
  Heart,
  Briefcase,
  GraduationCap,
  ChevronRight,
  Star,
} from 'lucide-react';
import heroImage from '@/assets/hero-landing.jpg';
import iconDocuments from '@/assets/icon-documents.png';
import iconGuidance from '@/assets/icon-guidance.png';
import iconCommunity from '@/assets/icon-community.png';
import LanguageSelector from '@/components/LanguageSelector';

const LandingPage = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const painPoints = [
    { icon: <FileText className="h-6 w-6" />, titleKey: 'landing.pain1Title', descKey: 'landing.pain1Desc', color: 'bg-destructive/10 text-destructive' },
    { icon: <HelpCircle className="h-6 w-6" />, titleKey: 'landing.pain2Title', descKey: 'landing.pain2Desc', color: 'bg-warning/10 text-warning' },
    { icon: <Clock className="h-6 w-6" />, titleKey: 'landing.pain3Title', descKey: 'landing.pain3Desc', color: 'bg-secondary/10 text-secondary' },
    { icon: <Shield className="h-6 w-6" />, titleKey: 'landing.pain4Title', descKey: 'landing.pain4Desc', color: 'bg-primary/10 text-primary' },
  ];

  const features = [
    {
      image: iconGuidance,
      titleKey: 'landing.feature1Title', descKey: 'landing.feature1Desc',
      highlights: ['landing.feature1h1', 'landing.feature1h2', 'landing.feature1h3'],
    },
    {
      image: iconDocuments,
      titleKey: 'landing.feature2Title', descKey: 'landing.feature2Desc',
      highlights: ['landing.feature2h1', 'landing.feature2h2', 'landing.feature2h3'],
    },
    {
      image: iconCommunity,
      titleKey: 'landing.feature3Title', descKey: 'landing.feature3Desc',
      highlights: ['landing.feature3h1', 'landing.feature3h2', 'landing.feature3h3'],
    },
  ];

  const steps = [
    { number: '01', titleKey: 'landing.step1Title', descKey: 'landing.step1Desc' },
    { number: '02', titleKey: 'landing.step2Title', descKey: 'landing.step2Desc' },
    { number: '03', titleKey: 'landing.step3Title', descKey: 'landing.step3Desc' },
    { number: '04', titleKey: 'landing.step4Title', descKey: 'landing.step4Desc' },
  ];

  const testimonials = [
    { name: 'Elena K.', city: 'Milano', textKey: 'landing.testimonial1', reasonKey: 'landing.ucWork' },
    { name: 'Georgi M.', city: 'Roma', textKey: 'landing.testimonial2', reasonKey: 'landing.ucStudy' },
    { name: 'Svetlana R.', city: 'Torino', textKey: 'landing.testimonial3', reasonKey: 'landing.ucFamily' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* ========== NAVBAR ========== */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-card/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-hero">
              <MapPin className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-extrabold text-foreground tracking-tight">Trasferisciti</span>
          </div>
          <div className="flex items-center gap-3">
            {/* Language switcher */}
            <div className="flex items-center gap-1 rounded-xl border border-border bg-background px-1.5 py-1">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => i18n.changeLanguage(lang.code)}
                  className={`rounded-lg px-2 py-1 text-sm transition-all ${
                    i18n.language === lang.code
                      ? 'gradient-hero text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => navigate('/auth')}
              className="flex h-10 items-center gap-2 rounded-xl gradient-hero px-5 text-sm font-bold text-primary-foreground shadow-cta transition-all hover:opacity-90 active:scale-95"
            >
              {t('landing.login')}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* ========== HERO ========== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/75 to-foreground/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-6xl px-5 py-20 lg:px-8 lg:py-32">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-1.5 backdrop-blur-sm">
              <Star className="h-3.5 w-3.5 text-primary-foreground" />
              <span className="text-xs font-semibold text-primary-foreground/90">{t('landing.badge')}</span>
            </div>

            <h1 className="mb-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-primary-foreground lg:text-6xl">
              {t('landing.heroTitle1')}
              <br />
              <span className="text-primary" style={{ textShadow: '0 0 40px hsla(146, 51%, 36%, 0.4)' }}>
                {t('landing.heroTitle2')}
              </span>
            </h1>

            <p className="mb-8 max-w-lg text-base leading-relaxed text-primary-foreground/80 lg:text-lg">
              {t('landing.heroSubtitle')}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                onClick={() => navigate('/auth')}
                className="flex h-14 items-center justify-center gap-2.5 rounded-2xl gradient-hero px-8 text-base font-bold text-primary-foreground shadow-hero transition-all hover:opacity-90 active:scale-95"
              >
                {t('landing.cta')}
                <ArrowRight className="h-5 w-5" />
              </button>
              <span className="text-sm text-primary-foreground/60">{t('landing.ctaFree')}</span>
            </div>

            <div className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-2">
                {['E', 'G', 'S', 'I', 'P'].map((letter, i) => (
                  <div key={i} className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-foreground/80 bg-primary text-xs font-bold text-primary-foreground">
                    {letter}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-xs text-primary-foreground/60">{t('landing.socialProof')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== PAIN POINTS ========== */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="mb-12 max-w-2xl">
            <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-destructive">{t('landing.problemLabel')}</span>
            <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-foreground lg:text-4xl">{t('landing.problemTitle')}</h2>
            <p className="text-base leading-relaxed text-muted-foreground lg:text-lg">{t('landing.problemSubtitle')}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {painPoints.map((pain, i) => (
              <div key={i} className="group rounded-3xl bg-card p-6 shadow-card transition-all hover:shadow-elevated hover:-translate-y-1">
                <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${pain.color}`}>{pain.icon}</div>
                <h3 className="mb-2 text-base font-bold text-foreground">{t(pain.titleKey)}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{t(pain.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== SOLUTION DIVIDER ========== */}
      <section className="relative py-16 lg:py-20">
        <div className="absolute inset-0 gradient-hero opacity-[0.04]" />
        <div className="relative mx-auto max-w-3xl px-5 text-center lg:px-8">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl gradient-hero shadow-hero">
            <MapPin className="h-8 w-8 text-primary-foreground" />
          </div>
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-foreground lg:text-4xl">
            {t('landing.solutionTitle')}
            <br />
            <span className="text-primary">{t('landing.solutionTitle2')}</span>
          </h2>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-muted-foreground lg:text-lg">{t('landing.solutionDesc')}</p>
        </div>
      </section>

      {/* ========== FEATURES ========== */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="mb-12">
            <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-primary">{t('landing.featuresLabel')}</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground lg:text-4xl">{t('landing.featuresTitle')}</h2>
          </div>

          <div className="space-y-8 lg:space-y-16">
            {features.map((feature, i) => (
              <div key={i} className={`flex flex-col items-center gap-8 lg:flex-row ${i % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                <div className="flex w-full items-center justify-center rounded-3xl bg-card p-8 shadow-card lg:w-5/12">
                  <img src={feature.image} alt={t(feature.titleKey)} className="h-48 w-48 object-contain lg:h-56 lg:w-56" />
                </div>
                <div className="flex-1 lg:w-7/12">
                  <h3 className="mb-3 text-2xl font-extrabold text-foreground lg:text-3xl">{t(feature.titleKey)}</h3>
                  <p className="mb-5 text-base leading-relaxed text-muted-foreground">{t(feature.descKey)}</p>
                  <div className="space-y-2.5">
                    {feature.highlights.map((h, j) => (
                      <div key={j} className="flex items-center gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success/10">
                          <CheckCircle2 className="h-4 w-4 text-success" />
                        </div>
                        <span className="text-sm font-medium text-foreground">{t(h)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section className="relative py-16 lg:py-24">
        <div className="absolute inset-0 bg-card" />
        <div className="relative mx-auto max-w-6xl px-5 lg:px-8">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-secondary">{t('landing.howLabel')}</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground lg:text-4xl">{t('landing.howTitle')}</h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <div key={i} className="relative rounded-3xl bg-background p-6 shadow-card">
                <span className="mb-3 block text-4xl font-extrabold text-primary/15">{step.number}</span>
                <h3 className="mb-2 text-base font-bold text-foreground">{t(step.titleKey)}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{t(step.descKey)}</p>
                {i < steps.length - 1 && (
                  <div className="absolute -right-3 top-1/2 z-10 hidden lg:block">
                    <ChevronRight className="h-6 w-6 text-border" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIALS ========== */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-warning">{t('landing.testimonialsLabel')}</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground lg:text-4xl">{t('landing.testimonialsTitle')}</h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {testimonials.map((item, i) => (
              <div key={i} className="rounded-3xl bg-card p-6 shadow-card">
                <div className="mb-4 flex gap-0.5">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="mb-5 text-sm leading-relaxed text-foreground">"{t(item.textKey)}"</p>
                <div className="flex items-center gap-3 border-t border-border pt-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-hero text-sm font-bold text-primary-foreground">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.city} · {t(item.reasonKey)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== USE CASES ========== */}
      <section className="relative py-16 lg:py-24">
        <div className="absolute inset-0 bg-card" />
        <div className="relative mx-auto max-w-6xl px-5 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground lg:text-4xl">{t('landing.useCasesTitle')}</h2>
            <p className="mt-3 text-base text-muted-foreground">{t('landing.useCasesSubtitle')}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: <Briefcase className="h-7 w-7" />, labelKey: 'landing.ucWork', descKey: 'landing.ucWorkDesc' },
              { icon: <GraduationCap className="h-7 w-7" />, labelKey: 'landing.ucStudy', descKey: 'landing.ucStudyDesc' },
              { icon: <Heart className="h-7 w-7" />, labelKey: 'landing.ucFamily', descKey: 'landing.ucFamilyDesc' },
            ].map((uc, i) => (
              <div key={i} className="rounded-3xl bg-background p-8 text-center shadow-card">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">{uc.icon}</div>
                <h3 className="mb-2 text-lg font-bold text-foreground">{t(uc.labelKey)}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{t(uc.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FINAL CTA ========== */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }} />

        <div className="relative mx-auto max-w-3xl px-5 text-center lg:px-8">
          <h2 className="mb-4 text-3xl font-extrabold text-primary-foreground lg:text-5xl">{t('landing.finalCta')}</h2>
          <p className="mx-auto mb-8 max-w-xl text-base text-primary-foreground/80 lg:text-lg">{t('landing.finalCtaDesc')}</p>
          <button
            onClick={() => navigate('/auth')}
            className="inline-flex h-14 items-center gap-2.5 rounded-2xl bg-card px-10 text-base font-bold text-primary shadow-elevated transition-all hover:shadow-hero active:scale-95"
          >
            {t('landing.finalCtaButton')}
            <ArrowRight className="h-5 w-5" />
          </button>
          <p className="mt-4 text-sm text-primary-foreground/60">{t('landing.noCreditCard')}</p>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="border-t border-border bg-card py-10">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-hero">
                <MapPin className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-base font-extrabold text-foreground">Trasferisciti</span>
            </div>
            <div className="flex gap-8">
              <button onClick={() => navigate('/guides')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('nav.guides')}</button>
              <button onClick={() => navigate('/community')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('nav.community')}</button>
            </div>
            <p className="text-xs text-muted-foreground">{t('landing.footer')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

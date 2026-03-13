import { useNavigate } from 'react-router-dom';
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
  Users,
  BookOpen,
  Map,
} from 'lucide-react';
import heroImage from '@/assets/hero-landing.jpg';
import iconDocuments from '@/assets/icon-documents.png';
import iconGuidance from '@/assets/icon-guidance.png';
import iconCommunity from '@/assets/icon-community.png';

const LandingPage = () => {
  const navigate = useNavigate();

  const painPoints = [
    {
      icon: <FileText className="h-6 w-6" />,
      title: 'Burocrazia incomprensibile',
      description: 'Moduli, uffici, scadenze. Nessuno ti spiega cosa fare e in che ordine.',
      color: 'bg-destructive/10 text-destructive',
    },
    {
      icon: <HelpCircle className="h-6 w-6" />,
      title: 'Informazioni sparse e confuse',
      description: 'Passi ore a cercare su Google, forum e gruppi Facebook senza trovare risposte chiare.',
      color: 'bg-warning/10 text-warning',
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'Tempo e soldi persi',
      description: 'Documenti sbagliati, code inutili, appuntamenti mancati. Ogni errore costa tempo e denaro.',
      color: 'bg-secondary/10 text-secondary',
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Paura di sbagliare',
      description: 'La paura di dimenticare qualcosa di importante ti blocca e ti fa sentire solo.',
      color: 'bg-primary/10 text-primary',
    },
  ];

  const features = [
    {
      image: iconGuidance,
      title: 'Percorso personalizzato',
      description: 'Un piano passo-passo creato su misura per la tua situazione. Sai sempre cosa fare dopo.',
      highlights: ['Percorso su misura', 'Checklist per ogni passo', 'Progresso tracciato'],
    },
    {
      image: iconDocuments,
      title: 'Guida documenti completa',
      description: 'Ogni documento spiegato in modo semplice: cosa serve, dove andare, quanto costa.',
      highlights: ['Documenti necessari', 'Dove andare', 'Tempi e costi'],
    },
    {
      image: iconCommunity,
      title: 'Community di supporto',
      description: 'Fai domande e ricevi risposte da chi ha già vissuto la tua stessa esperienza.',
      highlights: ['Domande e risposte', 'Esperienze reali', 'Supporto reciproco'],
    },
  ];

  const steps = [
    { number: '01', title: 'Rispondi a poche domande', desc: 'Ci bastano 2 minuti per capire la tua situazione.' },
    { number: '02', title: 'Ricevi il tuo percorso', desc: 'Un piano personalizzato con tutti i passi da seguire.' },
    { number: '03', title: 'Completa passo dopo passo', desc: 'Segui le istruzioni e spunta la checklist.' },
    { number: '04', title: 'Sei a casa in Italia', desc: 'Documenti in ordine, vita organizzata. Ce l\'hai fatta!' },
  ];

  const testimonials = [
    {
      name: 'Elena K.',
      city: 'Milano',
      text: 'Senza questa guida sarei ancora in fila all\'ufficio sbagliato. Mi ha risparmiato settimane di stress.',
      reason: 'Lavoro',
    },
    {
      name: 'Georgi M.',
      city: 'Roma',
      text: 'Finalmente qualcuno che spiega la burocrazia italiana in modo semplice. Ogni passo era chiaro.',
      reason: 'Studio',
    },
    {
      name: 'Svetlana R.',
      city: 'Torino',
      text: 'La community mi ha aiutato tantissimo. Ho trovato risposte a domande che non sapevo nemmeno di avere.',
      reason: 'Famiglia',
    },
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
          <button
            onClick={() => navigate('/onboarding')}
            className="flex h-10 items-center gap-2 rounded-xl gradient-hero px-5 text-sm font-bold text-primary-foreground shadow-cta transition-all hover:opacity-90 active:scale-95"
          >
            Inizia gratis
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </nav>

      {/* ========== HERO ========== */}
      <section className="relative overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <img src={heroImage} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/75 to-foreground/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-6xl px-5 py-20 lg:px-8 lg:py-32">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-1.5 backdrop-blur-sm">
              <Star className="h-3.5 w-3.5 text-primary-foreground" />
              <span className="text-xs font-semibold text-primary-foreground/90">La guida #1 per trasferirsi in Italia</span>
            </div>

            <h1 className="mb-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-primary-foreground lg:text-6xl">
              Trasferirsi in Italia
              <br />
              <span className="text-primary" style={{ textShadow: '0 0 40px hsla(146, 51%, 36%, 0.4)' }}>
                senza stress.
              </span>
            </h1>

            <p className="mb-8 max-w-lg text-base leading-relaxed text-primary-foreground/80 lg:text-lg">
              La burocrazia italiana ti spaventa? Ti guidiamo passo dopo passo in tutto quello che devi fare: documenti, residenza, sanità, banca e casa.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                onClick={() => navigate('/onboarding')}
                className="flex h-14 items-center justify-center gap-2.5 rounded-2xl gradient-hero px-8 text-base font-bold text-primary-foreground shadow-hero transition-all hover:opacity-90 active:scale-95"
              >
                Inizia il tuo percorso
                <ArrowRight className="h-5 w-5" />
              </button>
              <span className="text-sm text-primary-foreground/60">✓ Gratuito · ✓ 2 minuti · ✓ Personalizzato</span>
            </div>

            {/* Social proof */}
            <div className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-2">
                {['E', 'G', 'S', 'I', 'P'].map((letter, i) => (
                  <div
                    key={i}
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-foreground/80 bg-primary text-xs font-bold text-primary-foreground"
                  >
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
                <p className="text-xs text-primary-foreground/60">+500 persone guidate con successo</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== PAIN POINTS ========== */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="mb-12 max-w-2xl">
            <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-destructive">Il problema</span>
            <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-foreground lg:text-4xl">
              Trasferirsi all'estero è un incubo burocratico
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground lg:text-lg">
              Sappiamo cosa stai passando. Migliaia di persone come te affrontano ogni giorno gli stessi problemi.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {painPoints.map((pain, i) => (
              <div
                key={i}
                className="group rounded-3xl bg-card p-6 shadow-card transition-all hover:shadow-elevated hover:-translate-y-1"
              >
                <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${pain.color}`}>
                  {pain.icon}
                </div>
                <h3 className="mb-2 text-base font-bold text-foreground">{pain.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{pain.description}</p>
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
            La soluzione?
            <br />
            <span className="text-primary">Una guida che ti prende per mano.</span>
          </h2>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-muted-foreground lg:text-lg">
            Trasferisciti ti dice cosa fare, quando farlo e come farlo. Niente più confusione. Solo passi chiari verso la tua nuova vita.
          </p>
        </div>
      </section>

      {/* ========== FEATURES ========== */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="mb-12">
            <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-primary">Funzionalità</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground lg:text-4xl">
              Tutto quello che ti serve
            </h2>
          </div>

          <div className="space-y-8 lg:space-y-16">
            {features.map((feature, i) => (
              <div
                key={i}
                className={`flex flex-col items-center gap-8 lg:flex-row ${
                  i % 2 !== 0 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Image */}
                <div className="flex w-full items-center justify-center rounded-3xl bg-card p-8 shadow-card lg:w-5/12">
                  <img src={feature.image} alt={feature.title} className="h-48 w-48 object-contain lg:h-56 lg:w-56" />
                </div>

                {/* Content */}
                <div className="flex-1 lg:w-7/12">
                  <h3 className="mb-3 text-2xl font-extrabold text-foreground lg:text-3xl">{feature.title}</h3>
                  <p className="mb-5 text-base leading-relaxed text-muted-foreground">{feature.description}</p>
                  <div className="space-y-2.5">
                    {feature.highlights.map((h, j) => (
                      <div key={j} className="flex items-center gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success/10">
                          <CheckCircle2 className="h-4 w-4 text-success" />
                        </div>
                        <span className="text-sm font-medium text-foreground">{h}</span>
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
            <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-secondary">Come funziona</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground lg:text-4xl">
              4 semplici passi
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <div key={i} className="relative rounded-3xl bg-background p-6 shadow-card">
                <span className="mb-3 block text-4xl font-extrabold text-primary/15">{step.number}</span>
                <h3 className="mb-2 text-base font-bold text-foreground">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
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
            <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-warning">Testimonianze</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground lg:text-4xl">
              Chi ci è già passato
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {testimonials.map((t, i) => (
              <div key={i} className="rounded-3xl bg-card p-6 shadow-card">
                <div className="mb-4 flex gap-0.5">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="mb-5 text-sm leading-relaxed text-foreground">"{t.text}"</p>
                <div className="flex items-center gap-3 border-t border-border pt-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-hero text-sm font-bold text-primary-foreground">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.city} · {t.reason}</p>
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
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground lg:text-4xl">Per chi è?</h2>
            <p className="mt-3 text-base text-muted-foreground">Che tu venga per lavoro, studio o famiglia, ti aiutiamo.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: <Briefcase className="h-7 w-7" />, label: 'Lavoro', desc: 'Hai trovato lavoro in Italia o stai cercando una nuova opportunità professionale.' },
              { icon: <GraduationCap className="h-7 w-7" />, label: 'Studio', desc: 'Ti sei iscritto a un\'università italiana o vuoi studiare in Italia.' },
              { icon: <Heart className="h-7 w-7" />, label: 'Famiglia', desc: 'Ti ricongiugi con la tua famiglia o ti trasferisci con il partner.' },
            ].map((uc, i) => (
              <div key={i} className="rounded-3xl bg-background p-8 text-center shadow-card">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  {uc.icon}
                </div>
                <h3 className="mb-2 text-lg font-bold text-foreground">{uc.label}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{uc.desc}</p>
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
          <h2 className="mb-4 text-3xl font-extrabold text-primary-foreground lg:text-5xl">
            Pronto a iniziare la tua nuova vita in Italia?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-base text-primary-foreground/80 lg:text-lg">
            In 2 minuti creiamo il tuo percorso personalizzato. È gratuito.
          </p>
          <button
            onClick={() => navigate('/onboarding')}
            className="inline-flex h-14 items-center gap-2.5 rounded-2xl bg-card px-10 text-base font-bold text-primary shadow-elevated transition-all hover:shadow-hero active:scale-95"
          >
            Inizia adesso — è gratis
            <ArrowRight className="h-5 w-5" />
          </button>
          <p className="mt-4 text-sm text-primary-foreground/60">
            Nessuna carta di credito richiesta
          </p>
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
              <button onClick={() => navigate('/guides')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Guide</button>
              <button onClick={() => navigate('/community')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Community</button>
            </div>
            <p className="text-xs text-muted-foreground">© 2026 Trasferisciti. Tutti i diritti riservati.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

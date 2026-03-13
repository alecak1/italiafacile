import { JourneyStep, Guide, Question, UserProfile } from '@/types';

export const defaultUserProfile: UserProfile = {
  id: '1',
  name: 'Maria',
  nationality: 'Bulgaria',
  destinationCountry: 'Italia',
  destinationCity: 'Milano',
  reasonForMoving: 'work',
  alreadyInCountry: false,
  hasTaxCode: false,
  jobStatus: 'employed',
  languageLevel: 'beginner',
  onboardingCompleted: true,
};

export const mockJourneySteps: JourneyStep[] = [
  {
    id: '1',
    order: 1,
    title: 'Ottieni il Codice Fiscale',
    explanation: 'Il codice fiscale è il tuo numero di identificazione personale in Italia. Serve per quasi tutto: lavoro, banca, sanità.',
    whyItMatters: 'Senza codice fiscale non puoi firmare un contratto di lavoro, aprire un conto in banca o accedere ai servizi sanitari.',
    documents: [
      { name: 'Passaporto o carta d\'identità', description: 'Documento di identità valido' },
      { name: 'Modulo di richiesta', description: 'Disponibile presso l\'Agenzia delle Entrate' },
    ],
    whereToGo: 'Agenzia delle Entrate più vicina alla tua residenza',
    estimatedTime: '1-2 ore',
    cost: 'Gratuito',
    checklist: [
      { id: '1a', label: 'Prepara il documento di identità', checked: false },
      { id: '1b', label: 'Trova l\'ufficio più vicino', checked: false },
      { id: '1c', label: 'Compila il modulo di richiesta', checked: false },
      { id: '1d', label: 'Ritira il codice fiscale', checked: false },
    ],
    status: 'current',
    category: 'documenti',
  },
  {
    id: '2',
    order: 2,
    title: 'Registra la Residenza',
    explanation: 'Devi registrarti presso il comune della città dove vivrai. Questo è obbligatorio entro 20 giorni dall\'arrivo.',
    whyItMatters: 'La residenza è necessaria per accedere ai servizi pubblici, alla sanità e per molte pratiche burocratiche.',
    documents: [
      { name: 'Codice fiscale', description: 'Già ottenuto nel passo precedente' },
      { name: 'Contratto di affitto', description: 'O dichiarazione di ospitalità' },
      { name: 'Documento di identità', description: 'Passaporto o carta d\'identità' },
    ],
    whereToGo: 'Ufficio anagrafe del Comune',
    estimatedTime: '2-3 settimane per completamento',
    cost: 'Gratuito',
    checklist: [
      { id: '2a', label: 'Ottieni il codice fiscale', checked: false },
      { id: '2b', label: 'Trova un alloggio', checked: false },
      { id: '2c', label: 'Vai all\'ufficio anagrafe', checked: false },
      { id: '2d', label: 'Presenta la documentazione', checked: false },
    ],
    status: 'locked',
    category: 'documenti',
  },
  {
    id: '3',
    order: 3,
    title: 'Iscrizione al SSN',
    explanation: 'Iscriviti al Servizio Sanitario Nazionale per avere accesso alle cure mediche pubbliche in Italia.',
    whyItMatters: 'L\'iscrizione al SSN ti dà diritto a un medico di base gratuito e a cure ospedaliere a costi ridotti.',
    documents: [
      { name: 'Codice fiscale', description: 'Già ottenuto' },
      { name: 'Certificato di residenza', description: 'O richiesta in corso' },
      { name: 'Documento di identità', description: 'Passaporto o carta d\'identità' },
      { name: 'Permesso di soggiorno', description: 'Se applicabile' },
    ],
    whereToGo: 'ASL (Azienda Sanitaria Locale) della tua zona',
    estimatedTime: '1-2 ore',
    cost: 'Gratuito',
    checklist: [
      { id: '3a', label: 'Raccogli i documenti necessari', checked: false },
      { id: '3b', label: 'Trova la ASL di zona', checked: false },
      { id: '3c', label: 'Compila il modulo di iscrizione', checked: false },
      { id: '3d', label: 'Scegli il medico di base', checked: false },
    ],
    status: 'locked',
    category: 'sanita',
  },
  {
    id: '4',
    order: 4,
    title: 'Apri un Conto in Banca',
    explanation: 'Un conto bancario italiano è necessario per ricevere lo stipendio e gestire le spese quotidiane.',
    whyItMatters: 'La maggior parte dei datori di lavoro paga tramite bonifico bancario. Serve anche per affitto e bollette.',
    documents: [
      { name: 'Codice fiscale', description: 'Già ottenuto' },
      { name: 'Documento di identità', description: 'Passaporto o carta d\'identità' },
      { name: 'Prova di residenza', description: 'Contratto di affitto o certificato' },
    ],
    whereToGo: 'Filiale bancaria o banca online',
    estimatedTime: '30 minuti - 1 ora',
    cost: 'Varia per banca (0-10€/mese)',
    checklist: [
      { id: '4a', label: 'Confronta le offerte bancarie', checked: false },
      { id: '4b', label: 'Prepara i documenti', checked: false },
      { id: '4c', label: 'Apri il conto', checked: false },
      { id: '4d', label: 'Attiva l\'home banking', checked: false },
    ],
    status: 'locked',
    category: 'documenti',
  },
  {
    id: '5',
    order: 5,
    title: 'Trova un Alloggio Stabile',
    explanation: 'Trova un appartamento in affitto a lungo termine. Questo è uno dei passi più importanti per stabilirti.',
    whyItMatters: 'Un contratto di affitto regolare è richiesto per la residenza e per molte altre pratiche.',
    documents: [
      { name: 'Codice fiscale', description: 'Già ottenuto' },
      { name: 'Buste paga o garanzie', description: 'Prova di reddito' },
      { name: 'Documento di identità', description: 'Passaporto o carta d\'identità' },
    ],
    whereToGo: 'Agenzie immobiliari, portali online (Immobiliare.it, Idealista)',
    estimatedTime: '2-4 settimane',
    cost: 'Deposito: 2-3 mesi di affitto',
    checklist: [
      { id: '5a', label: 'Definisci il budget', checked: false },
      { id: '5b', label: 'Cerca annunci online', checked: false },
      { id: '5c', label: 'Visita gli appartamenti', checked: false },
      { id: '5d', label: 'Firma il contratto', checked: false },
    ],
    status: 'locked',
    category: 'casa',
  },
];

export const mockGuides: Guide[] = [
  {
    id: '1',
    title: 'Come ottenere il Codice Fiscale',
    category: 'documenti',
    readingTime: '5 min',
    summary: 'Guida completa per ottenere il tuo codice fiscale italiano.',
    sections: [
      {
        title: 'Cos\'è il Codice Fiscale?',
        content: 'Il codice fiscale è un codice alfanumerico di 16 caratteri che identifica ogni persona in Italia.',
        bullets: [
          'Serve per lavorare, aprire un conto e accedere alla sanità',
          'È gratuito e si ottiene in giornata',
          'Puoi richiederlo anche dall\'estero tramite consolato',
        ],
      },
      {
        title: 'Come richiederlo',
        content: 'Vai all\'Agenzia delle Entrate con il tuo documento di identità.',
        bullets: [
          'Porta il passaporto o la carta d\'identità',
          'Compila il modulo disponibile in ufficio',
          'Riceverai il codice subito',
        ],
      },
    ],
  },
  {
    id: '2',
    title: 'Guida agli Affitti in Italia',
    category: 'casa',
    readingTime: '8 min',
    summary: 'Tutto quello che devi sapere per trovare casa in Italia.',
    sections: [
      {
        title: 'Tipologie di contratto',
        content: 'In Italia esistono diversi tipi di contratto di affitto.',
        bullets: [
          'Contratto 4+4: il più comune, durata 4 anni rinnovabili',
          'Contratto transitorio: da 1 a 18 mesi',
          'Contratto per studenti: da 6 a 36 mesi',
        ],
      },
    ],
  },
  {
    id: '3',
    title: 'Il Sistema Sanitario Italiano',
    category: 'sanita',
    readingTime: '6 min',
    summary: 'Come funziona la sanità pubblica in Italia e come iscriversi.',
    sections: [
      {
        title: 'Come funziona',
        content: 'Il SSN offre assistenza sanitaria a tutti i residenti.',
        bullets: [
          'Il medico di base è gratuito',
          'Le visite specialistiche hanno un ticket',
          'Il pronto soccorso è sempre accessibile',
        ],
      },
    ],
  },
  {
    id: '4',
    title: 'Trovare Lavoro in Italia',
    category: 'lavoro',
    readingTime: '7 min',
    summary: 'Consigli pratici per trovare lavoro come straniero in Italia.',
    sections: [
      {
        title: 'Dove cercare',
        content: 'Esistono diversi canali per trovare lavoro in Italia.',
        bullets: [
          'LinkedIn è molto usato per posizioni qualificate',
          'Indeed e InfoJobs per offerte generali',
          'Centri per l\'impiego per supporto gratuito',
        ],
      },
    ],
  },
  {
    id: '5',
    title: 'Vita Quotidiana in Italia',
    category: 'vita',
    readingTime: '5 min',
    summary: 'Consigli per adattarsi alla vita quotidiana italiana.',
    sections: [
      {
        title: 'Trasporti',
        content: 'Le città italiane hanno buoni trasporti pubblici.',
        bullets: [
          'Abbonamento mensile: 35-50€',
          'Le grandi città hanno metro e tram',
          'Le app di car sharing sono molto diffuse',
        ],
      },
    ],
  },
];

export const mockQuestions: Question[] = [
  {
    id: '1',
    authorName: 'Ivan P.',
    text: 'Quanto tempo ci vuole per ottenere il codice fiscale a Milano?',
    category: 'documenti',
    createdAt: '2 giorni fa',
    answers: [
      {
        id: '1a',
        authorName: 'Elena K.',
        text: 'Io l\'ho ottenuto in giornata! Sono andata all\'Agenzia delle Entrate di Via Manin alle 9 di mattina e in un\'ora avevo tutto.',
        upvotes: 12,
        createdAt: '1 giorno fa',
      },
      {
        id: '1b',
        authorName: 'Georgi M.',
        text: 'Dipende dall\'ufficio. A Milano centro è veloce, nelle periferie può servire appuntamento.',
        upvotes: 5,
        createdAt: '1 giorno fa',
      },
    ],
  },
  {
    id: '2',
    authorName: 'Dimitar S.',
    text: 'Quale banca consigliate per aprire un conto senza residenza?',
    category: 'documenti',
    createdAt: '3 giorni fa',
    answers: [
      {
        id: '2a',
        authorName: 'Svetlana R.',
        text: 'Revolut funziona bene all\'inizio. Per un conto italiano, Intesa Sanpaolo è stata la più disponibile con me.',
        upvotes: 8,
        createdAt: '2 giorni fa',
      },
    ],
  },
  {
    id: '3',
    authorName: 'Petya N.',
    text: 'Come trovo un appartamento a Roma senza buste paga italiane?',
    category: 'casa',
    createdAt: '5 giorni fa',
    answers: [],
  },
];

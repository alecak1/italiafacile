// Core entities following multi-tenant SaaS architecture
// Country/nationality are configurable, not hardcoded

export interface UserProfile {
  id: string;
  name: string;
  nationality: string;
  destinationCountry: string;
  destinationCity: string;
  reasonForMoving: 'work' | 'study' | 'family';
  alreadyInCountry: boolean;
  hasTaxCode: boolean;
  jobStatus: 'employed' | 'unemployed' | 'student' | 'freelance';
  languageLevel: 'none' | 'beginner' | 'intermediate' | 'advanced';
  onboardingCompleted: boolean;
}

export type StepStatus = 'completed' | 'current' | 'locked';

export interface StepDocument {
  name: string;
  description: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

export interface JourneyStep {
  id: string;
  order: number;
  title: string;
  explanation: string;
  whyItMatters: string;
  documents: StepDocument[];
  whereToGo: string;
  estimatedTime: string;
  cost: string;
  checklist: ChecklistItem[];
  status: StepStatus;
  category: string;
}

export interface Guide {
  id: string;
  title: string;
  category: 'documenti' | 'casa' | 'lavoro' | 'sanita' | 'vita';
  readingTime: string;
  summary: string;
  sections: GuideSection[];
}

export interface GuideSection {
  title: string;
  content: string;
  bullets?: string[];
}

export interface Question {
  id: string;
  authorName: string;
  text: string;
  category: string;
  createdAt: string;
  answers: Answer[];
}

export interface Answer {
  id: string;
  authorName: string;
  text: string;
  upvotes: number;
  createdAt: string;
}

export type GuideCategory = Guide['category'];

export const GUIDE_CATEGORIES: { key: GuideCategory; label: string; icon: string }[] = [
  { key: 'documenti', label: 'Documenti', icon: 'FileText' },
  { key: 'casa', label: 'Casa', icon: 'Home' },
  { key: 'lavoro', label: 'Lavoro', icon: 'Briefcase' },
  { key: 'sanita', label: 'Sanità', icon: 'Heart' },
  { key: 'vita', label: 'Vita in Italia', icon: 'Sun' },
];

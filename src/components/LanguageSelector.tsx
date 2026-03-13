import { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'it', flag: '🇮🇹', label: 'Italiano' },
  { code: 'en', flag: '🇬🇧', label: 'English' },
  { code: 'bg', flag: '🇧🇬', label: 'Български' },
];

interface LanguageSelectorProps {
  /** Optional callback after language changes (e.g. save to profile) */
  onLanguageChange?: (code: string) => void;
  /** Visual variant */
  variant?: 'compact' | 'full';
}

const LanguageSelector = ({ onLanguageChange, variant = 'compact' }: LanguageSelectorProps) => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const current = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0];

  const handleSelect = (code: string) => {
    i18n.changeLanguage(code);
    onLanguageChange?.(code);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 rounded-xl border border-border bg-background transition-all hover:border-primary/30 ${
          variant === 'full' ? 'w-full justify-between px-4 py-3' : 'px-3 py-2'
        }`}
      >
        <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
        <span className="text-sm font-medium text-foreground">
          {current.flag} {variant === 'full' ? current.label : ''}
        </span>
        <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className={`absolute z-50 mt-1.5 max-h-64 overflow-y-auto rounded-xl border border-border bg-card shadow-elevated animate-fade-in ${
          variant === 'full' ? 'left-0 right-0' : 'right-0 min-w-[180px]'
        }`}>
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-muted/50 ${
                lang.code === i18n.language ? 'text-primary font-semibold' : 'text-foreground'
              }`}
            >
              <span className="text-base">{lang.flag}</span>
              <span className="flex-1 text-left">{lang.label}</span>
              {lang.code === i18n.language && <Check className="h-4 w-4 text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;

import { useState } from 'react';
import { Check, PackageCheck, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface PreparationChecklistProps {
  documents: { name: string; description: string }[];
}

const PreparationChecklist = ({ documents }: PreparationChecklistProps) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(true);

  const defaultItems = [
    t('stepDetail.prepDoc'),
    t('stepDetail.prepCopy'),
    t('stepDetail.prepForm'),
  ];

  const [checked, setChecked] = useState<boolean[]>(defaultItems.map(() => false));
  const allReady = checked.every(Boolean);

  const toggle = (i: number) => {
    const next = [...checked];
    next[i] = !next[i];
    setChecked(next);
  };

  return (
    <div className="rounded-2xl border border-primary/10 bg-primary/3 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center gap-3 p-5 text-left"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <PackageCheck className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-foreground">{t('stepDetail.beforeYouGo')}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{t('stepDetail.beforeYouGoDesc')}</p>
        </div>
        <ChevronDown className={cn(
          'h-4 w-4 text-muted-foreground transition-transform duration-300',
          isExpanded && 'rotate-180'
        )} />
      </button>

      {/* Content */}
      <div className={cn(
        'grid transition-all duration-300',
        isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
      )}>
        <div className="overflow-hidden">
          <div className="px-5 pb-5 space-y-2">
            {defaultItems.map((label, i) => (
              <button
                key={i}
                onClick={() => toggle(i)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all duration-300',
                  checked[i]
                    ? 'border-success/20 bg-success/5'
                    : 'border-border/30 bg-card/50 hover:border-primary/20'
                )}
              >
                <div className={cn(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-all duration-300',
                  checked[i] ? 'border-success bg-success' : 'border-border'
                )}>
                  <Check className={cn(
                    'h-3.5 w-3.5 transition-all duration-300',
                    checked[i] ? 'text-success-foreground opacity-100' : 'text-transparent opacity-0'
                  )} />
                </div>
                <span className={cn(
                  'text-sm transition-colors',
                  checked[i] ? 'text-muted-foreground line-through' : 'text-foreground font-medium'
                )}>
                  {label}
                </span>
              </button>
            ))}

            {/* Ready button */}
            {allReady && (
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-success/10 border border-success/20 p-3 animate-fade-in">
                <Check className="h-4 w-4 text-success" />
                <span className="text-sm font-semibold text-success">{t('stepDetail.readyToGo')}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreparationChecklist;

import { useState } from 'react';
import { FileText, ChevronDown, Check, AlertTriangle, Copy, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface DocumentCardProps {
  name: string;
  description: string;
  index: number;
  isPrepared: boolean;
  onTogglePrepared: () => void;
}

const DocumentCard = ({ name, description, index, isPrepared, onTogglePrepared }: DocumentCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        'rounded-2xl border transition-all duration-300 overflow-hidden',
        isPrepared
          ? 'border-success/25 bg-success/5'
          : 'border-border/40 bg-card shadow-card hover:shadow-card-hover'
      )}
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center gap-3.5 p-4 text-left"
      >
        <div className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors',
          isPrepared ? 'bg-success/15' : 'bg-secondary/8'
        )}>
          {isPrepared ? (
            <Check className="h-5 w-5 text-success" />
          ) : (
            <FileText className="h-5 w-5 text-secondary" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn(
            'text-sm font-semibold leading-snug transition-colors',
            isPrepared ? 'text-success' : 'text-foreground'
          )}>
            {name}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{description}</p>
        </div>
        <ChevronDown className={cn(
          'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300',
          isExpanded && 'rotate-180'
        )} />
      </button>

      {/* Expandable Details */}
      <div className={cn(
        'grid transition-all duration-300',
        isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
      )}>
        <div className="overflow-hidden">
          <div className="px-4 pb-4 space-y-3">
            {/* Detail pills */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 rounded-xl bg-muted/50 px-3 py-2.5">
                <FileText className="h-3.5 w-3.5 text-primary shrink-0" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {t('stepDetail.original')}
                  </p>
                  <p className="text-xs font-semibold text-foreground">{t('stepDetail.yes')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-muted/50 px-3 py-2.5">
                <Copy className="h-3.5 w-3.5 text-primary shrink-0" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {t('stepDetail.copy')}
                  </p>
                  <p className="text-xs font-semibold text-foreground">{t('stepDetail.recommended')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-muted/50 px-3 py-2.5 col-span-2">
                <Shield className="h-3.5 w-3.5 text-primary shrink-0" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {t('stepDetail.validity')}
                  </p>
                  <p className="text-xs font-semibold text-foreground">{t('stepDetail.notExpired')}</p>
                </div>
              </div>
            </div>

            {/* Common mistakes */}
            <div className="rounded-xl bg-warning/5 border border-warning/10 p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-warning shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-warning mb-1">
                    {t('stepDetail.commonMistakes')}
                  </p>
                  <p className="text-xs leading-relaxed text-foreground/70">
                    {t('stepDetail.expiredDocWarning')}
                  </p>
                </div>
              </div>
            </div>

            {/* Mark as prepared */}
            <button
              onClick={(e) => { e.stopPropagation(); onTogglePrepared(); }}
              className={cn(
                'flex w-full items-center gap-3 rounded-xl border-2 border-dashed p-3 transition-all duration-300',
                isPrepared
                  ? 'border-success/30 bg-success/5'
                  : 'border-border/50 hover:border-primary/30 hover:bg-primary/5'
              )}
            >
              <div className={cn(
                'flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-all duration-300',
                isPrepared ? 'border-success bg-success' : 'border-border'
              )}>
                <Check className={cn(
                  'h-3.5 w-3.5 transition-all duration-300',
                  isPrepared ? 'text-success-foreground opacity-100' : 'text-transparent opacity-0'
                )} />
              </div>
              <span className={cn(
                'text-sm font-medium transition-colors',
                isPrepared ? 'text-success' : 'text-muted-foreground'
              )}>
                {isPrepared ? t('stepDetail.docPrepared') : t('stepDetail.markAsPrepared')}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;

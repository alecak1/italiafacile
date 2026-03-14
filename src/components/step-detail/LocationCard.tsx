import { MapPin, ExternalLink, Phone, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LocationCardProps {
  whereToGo: string;
}

const LocationCard = ({ whereToGo }: LocationCardProps) => {
  const { t } = useTranslation();
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(whereToGo)}`;

  return (
    <div className="space-y-3">
      {/* Location info card */}
      <div className="rounded-2xl border border-border/40 bg-card p-5 shadow-card">
        <div className="flex items-start gap-3.5 mb-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/8">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground leading-snug">{whereToGo}</p>
            <p className="text-xs text-muted-foreground mt-1">{t('stepDetail.checkHoursBefore')}</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1.5 rounded-xl border border-border/40 bg-muted/30 p-3 transition-all hover:bg-primary/5 hover:border-primary/20 active:scale-[0.97]"
          >
            <ExternalLink className="h-4 w-4 text-primary" />
            <span className="text-[11px] font-semibold text-foreground">{t('stepDetail.openMaps')}</span>
          </a>
          <button
            className="flex flex-col items-center gap-1.5 rounded-xl border border-border/40 bg-muted/30 p-3 transition-all hover:bg-primary/5 hover:border-primary/20 active:scale-[0.97]"
          >
            <Phone className="h-4 w-4 text-primary" />
            <span className="text-[11px] font-semibold text-foreground">{t('stepDetail.call')}</span>
          </button>
          <button
            className="flex flex-col items-center gap-1.5 rounded-xl border border-border/40 bg-muted/30 p-3 transition-all hover:bg-primary/5 hover:border-primary/20 active:scale-[0.97]"
          >
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-[11px] font-semibold text-foreground">{t('stepDetail.hours')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationCard;

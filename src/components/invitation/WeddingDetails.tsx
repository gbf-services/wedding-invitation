'use client';

import { Calendar, Clock, MapPin } from 'lucide-react';
import { t, Language } from '@/lib/translations';
import { formatDate, formatTime } from '@/lib/utils';

interface WeddingDetailsProps {
  date: string;
  time: string;
  venue: string;
  venueAr?: string;
  venueAddress: string;
  venueAddressAr?: string;
  language: Language;
  primaryColor: string;
}

export default function WeddingDetails({
  date,
  time,
  venue,
  venueAr,
  venueAddress,
  venueAddressAr,
  language,
  primaryColor,
}: WeddingDetailsProps) {
  const displayVenue = language === 'ar' && venueAr ? venueAr : venue;
  const displayAddress = language === 'ar' && venueAddressAr ? venueAddressAr : venueAddress;

  return (
    <div className="py-12 px-4">
      <h3 className="text-lg font-serif text-center text-charcoal mb-8">
        {t('weddingDetails', language)}
      </h3>
      <div className="max-w-md mx-auto space-y-4">
        <div className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: `${primaryColor}08` }}>
          <Calendar className="w-5 h-5 flex-shrink-0" style={{ color: primaryColor }} />
          <div>
            <p className="text-sm text-gray-500">{formatDate(date, language)}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: `${primaryColor}08` }}>
          <Clock className="w-5 h-5 flex-shrink-0" style={{ color: primaryColor }} />
          <div>
            <p className="text-sm text-gray-500">{formatTime(time, language)}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: `${primaryColor}08` }}>
          <MapPin className="w-5 h-5 flex-shrink-0" style={{ color: primaryColor }} />
          <div>
            <p className="text-sm font-medium text-charcoal">{displayVenue}</p>
            <p className="text-xs text-gray-400">{displayAddress}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

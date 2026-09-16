'use client';

import { motion } from 'framer-motion';
import { MapPin, ExternalLink } from 'lucide-react';
import { t, Language } from '@/lib/translations';

interface VenueSectionProps {
  venue: string;
  venueAr?: string;
  venueAddress: string;
  venueAddressAr?: string;
  googleMapsUrl?: string;
  venueImageUrl?: string;
  language: Language;
  primaryColor: string;
}

export default function VenueSection({
  venue,
  venueAr,
  venueAddress,
  venueAddressAr,
  googleMapsUrl,
  venueImageUrl,
  language,
  primaryColor,
}: VenueSectionProps) {
  const displayVenue = language === 'ar' && venueAr ? venueAr : venue;
  const displayAddress = language === 'ar' && venueAddressAr ? venueAddressAr : venueAddress;

  return (
    <div className="py-12 px-4">
      <h3 className="text-lg font-serif text-center text-charcoal mb-8">{t('venue', language)}</h3>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-md mx-auto"
      >
        {venueImageUrl && (
          <div className="rounded-2xl overflow-hidden mb-4">
            <img src={venueImageUrl} alt={displayVenue} className="w-full h-48 object-cover" />
          </div>
        )}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <MapPin className="w-5 h-5" style={{ color: primaryColor }} />
            <h4 className="font-medium text-charcoal">{displayVenue}</h4>
          </div>
          <p className="text-sm text-gray-500 mb-4">{displayAddress}</p>
          {googleMapsUrl && (
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium px-6 py-2 rounded-full border transition-colors"
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              {t('getDirections', language)}
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </motion.div>
    </div>
  );
}

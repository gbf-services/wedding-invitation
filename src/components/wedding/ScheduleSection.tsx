'use client';

import { motion } from 'framer-motion';
import { Church, Gem, GlassWater, Cake, Music, MapPin, ExternalLink } from 'lucide-react';

interface ScheduleEvent {
  id: string;
  title: string;
  time: string;
  location: string;
  mapsUrl: string;
  icon: string;
}

interface ScheduleSectionProps {
  schedule: ScheduleEvent[];
  primaryColor?: string;
}

function getIcon(icon: string) {
  switch (icon) {
    case 'church':
      return Church;
    case 'rings':
      return Gem;
    case 'champagne':
      return GlassWater;
    case 'cake':
      return Cake;
    case 'dance':
      return Music;
    default:
      return Music;
  }
}

export default function ScheduleSection({
  schedule,
  primaryColor = '#C9A96E',
}: ScheduleSectionProps) {
  return (
    <section className="py-16 sm:py-20 px-4">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <p
            className="text-[11px] tracking-[0.35em] uppercase mb-3"
            style={{ color: primaryColor }}
          >
            Order of the Day
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl" style={{ color: '#3D2B1F' }}>
            Wedding Schedule
          </h2>
          <div className="flex items-center justify-center gap-3 mt-5">
            <div className="h-px w-12" style={{ backgroundColor: primaryColor }} />
            <span className="text-sm" style={{ color: primaryColor }}>✦</span>
            <div className="h-px w-12" style={{ backgroundColor: primaryColor }} />
          </div>
        </motion.div>

        <div className="relative">
          <div
            className="absolute left-5 sm:left-1/2 sm:-translate-x-1/2 top-0 bottom-0 w-px"
            style={{
              background: `linear-gradient(to bottom, transparent, ${primaryColor}60, transparent)`,
            }}
          />

          <div className="space-y-6">
            {schedule.map((event, i) => {
              const Icon = getIcon(event.icon);
              const isLeft = i % 2 === 0;

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: isLeft ? -24 : 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.7, delay: i * 0.08 }}
                  className={`relative flex items-start gap-4 sm:gap-0 ${
                    isLeft ? 'sm:flex-row' : 'sm:flex-row-reverse'
                  }`}
                >
                  <div className="relative z-10 flex-shrink-0 ml-0.5 sm:mx-auto">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center border-2 bg-white"
                      style={{ borderColor: primaryColor }}
                    >
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: primaryColor }} />
                    </div>
                  </div>

                  <div
                    className={`flex-1 sm:w-[calc(50%-1.75rem)] ${
                      isLeft ? 'sm:mr-auto sm:text-right sm:pr-2' : 'sm:ml-auto sm:text-left sm:pl-2'
                    } ml-3 sm:ml-0`}
                  >
                    <div
                      className="rounded-2xl border p-4 sm:p-5"
                      style={{
                        borderColor: `${primaryColor}20`,
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        boxShadow: '0 10px 28px rgba(61, 43, 31, 0.06)',
                      }}
                    >
                      <p
                        className="text-[11px] tracking-[0.2em] uppercase mb-1"
                        style={{ color: primaryColor }}
                      >
                        {event.time}
                      </p>
                      <h3 className="font-serif text-lg sm:text-xl mb-2" style={{ color: '#3D2B1F' }}>
                        {event.title}
                      </h3>
                      <div
                        className={`flex items-center gap-1.5 text-xs sm:text-sm ${
                          isLeft ? 'sm:justify-end' : ''
                        }`}
                        style={{ color: '#8B6F5C' }}
                      >
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{event.location}</span>
                      </div>
                      {event.mapsUrl && (
                        <a
                          href={event.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-1.5 mt-3 text-xs tracking-wide transition-opacity hover:opacity-75 ${
                            isLeft ? 'sm:flex-row-reverse' : ''
                          }`}
                          style={{ color: primaryColor }}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span className="underline underline-offset-2">View Map</span>
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

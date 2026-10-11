'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Music, Pause } from 'lucide-react';
import { wedding } from '@/lib/wedding-config';
import OpeningScreen from '@/components/wedding/OpeningScreen';
import BibleVerseSection from '@/components/wedding/BibleVerseSection';
import CoupleIntroSection from '@/components/wedding/CoupleIntroSection';
import WeddingCalendar from '@/components/wedding/WeddingCalendar';
import WeddingCountdown from '@/components/wedding/WeddingCountdown';
import ScheduleSection from '@/components/wedding/ScheduleSection';
import GiftRegistrySection from '@/components/wedding/GiftRegistrySection';
import EventRSVP from '@/components/wedding/EventRSVP';
import WeddingFooter from '@/components/wedding/WeddingFooter';

function Reveal({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  );
}

export default function WeddingPage() {
  const [started, setStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    document.title = 'Christian & Joya | Wedding Invitation';
  }, []);

  const startInvitation = () => {
    setStarted(true);
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.45;
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  };

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div
      className="scroll-smooth"
      style={{ backgroundColor: wedding.colors.bg, color: wedding.colors.text }}
    >
      <audio ref={audioRef} src={wedding.music} loop preload="auto" />

      <AnimatePresence>
        {!started && (
          <motion.div key="opening" exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
            <OpeningScreen onOpen={startInvitation} />
          </motion.div>
        )}
      </AnimatePresence>

      {started && (
        <motion.div
          key="invitation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.button
            type="button"
            onClick={toggleMusic}
            aria-label={isPlaying ? 'Pause music' : 'Play music'}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="fixed right-5 top-5 z-50 flex h-12 w-12 items-center justify-center rounded-full shadow-lg backdrop-blur-sm transition-transform hover:scale-105 active:scale-95"
            style={{
              backgroundColor: `${wedding.colors.secondary}e6`,
              color: wedding.colors.primary,
              border: `1px solid ${wedding.colors.accent}40`,
            }}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Music className="h-5 w-5" />}
          </motion.button>

          <Reveal>
            <BibleVerseSection verse={wedding.verse} ref={wedding.verseRef} />
          </Reveal>

          <Reveal>
            <CoupleIntroSection
              groomFather={wedding.groomFather}
              groomMother={wedding.groomMother}
              brideFather={wedding.brideFather}
              brideMother={wedding.brideMother}
              groom={wedding.groom}
              bride={wedding.bride}
            />
          </Reveal>

          <Reveal>
            <WeddingCalendar date={wedding.date} primaryColor={wedding.colors.primary} />
          </Reveal>

          <Reveal>
            <WeddingCountdown
              date={wedding.date}
              time={wedding.time}
              primaryColor={wedding.colors.primary}
            />
          </Reveal>

          <Reveal>
            <ScheduleSection schedule={wedding.schedule} primaryColor={wedding.colors.primary} />
          </Reveal>

          <Reveal>
            <GiftRegistrySection
              title={wedding.giftRegistry.title}
              message={wedding.giftRegistry.message}
              bank={wedding.giftRegistry.bank}
              account={wedding.giftRegistry.account}
              primaryColor={wedding.colors.primary}
            />
          </Reveal>

          <Reveal>
            <Suspense fallback={null}>
              <EventRSVP primaryColor={wedding.colors.primary} />
            </Suspense>
          </Reveal>

          <Reveal>
            <WeddingFooter
              groom={wedding.groom}
              bride={wedding.bride}
              date={wedding.date}
            />
          </Reveal>
        </motion.div>
      )}
    </div>
  );
}
